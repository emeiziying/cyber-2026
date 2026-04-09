# gitlab-mr-review 实战指南：OpenClaw 内的 GitLab MR 巡检 Skill

> **定位：** `gitlab-mr-review` 是一个在 **OpenClaw 内编写并运行** 的专项 Skill，用来驱动 reviewer agent 持续巡检 GitLab MR、写回中文评审意见，并维护增量复审所需的本地状态。
>
> **运行数据（截至 2026-04-09）：** reviewer 自 **2026-03-17** 开始执行 review，累计已 review **118** 个 MR，累计已记录 **57** 个 bug。

---

## 它解决什么问题

很多团队的 MR review 问题，不在“不会看 diff”，而在“无法稳定复审”。

- 有人想到时才手工翻一遍 GitLab
- 让 AI 临时看一次 diff，再临时决定要不要写评论

这样做短期可用，长期会出现四类问题：

- 没有增量机制，同一个 MR 容易反复看、反复说
- 没有明确入口，heartbeat、定时巡检和人工点名 review 很难共用一套纪律
- 没有状态文件，AI 自己写回的评论也可能把 MR 再次触发成“待 review”
- 没有外部问题同步，跨 MR 的缺陷就只能散落在评论线程里

`gitlab-mr-review` 做的事情很明确：把“发现 MR、拉取上下文、写回评论、同步问题、更新 reviewed state”收敛成一套可重复执行的 OpenClaw reviewer 工作流。

---

## 它为什么比一次性 prompt 更稳

这个案例的价值，不在于“多写了一段 prompt”，而在于它把 review 能力拆成了几个职责清晰的层次：

| 组成 | 作用 | 为什么这样拆 |
|------|------|-------------|
| `SKILL.md` | 定义入口、适用场景、核心规则 | 主入口保持轻，先回答“什么时候用、先做什么” |
| `references/workflow.md` | 定义 review 主流程 | 把“先看什么、后写什么、什么时候停”固定下来 |
| `references/gitlab-api.md` | 约束 GitLab 评论和 merge readiness 动作 | API 细节不混进主说明 |
| `references/bug-tracker.md` | 约束外部缺陷同步 | GitLab 评论和缺陷跟踪各自有边界 |
| `references/local-files.md` | 解释脚本、状态文件和本地配置 | 工作区事实和教学说明分开 |
| `scripts/poll_gitlab_mrs.sh` | 处理确定性的轮询逻辑 | 能脚本化的动作不留给模型临时推理 |

它和 [如何制作 Skills](../advanced-patterns) 里强调的结构一致：`SKILL.md` 只管入口和边界，细节按需下沉到 `references/`，确定性动作交给脚本。

---

## 核心机制

### 先用轮询脚本决定有没有新活

heartbeat 或 cron 场景下，这个 Skill 不会先 review，而是先跑轮询脚本：

```bash
bash skills/gitlab-mr-review/scripts/poll_gitlab_mrs.sh
```

脚本只回答一个基础问题：当前工作区里有没有“新出现或更新过、还没被这套 reviewer 流程消化掉”的 MR。

如果没有，就返回安静结果；如果有，再吐出待处理 MR 的 JSON 行。这样做有三个直接好处：

- review 触发条件统一，不用每次靠人肉判断
- heartbeat 路径和人工点名 review 路径可以共用后续流程
- “有没有待处理 MR” 变成脚本事实，而不是 agent 自己猜

### 两条入口，共用一套 review 纪律

这个 Skill 有两条入口：

- **heartbeat / cron**：先轮询，再逐个 review 待处理 MR
- **direct MR request**：用户直接点名某个 MR，跳过轮询，直接拉取上下文并 review

入口不同，后续纪律一致：

1. 先看 MR 变更和最新版本信息
2. 再看已有 discussions，确认是不是复审
3. 优先找阻塞性的正确性、安全性、可靠性问题
4. 能挂行级 discussion 就挂行级 discussion
5. 无论如何都补一条 summary note，给出本轮结论

这样可以避免“定时巡检是一套风格，人工点名又是另一套风格”的漂移。

### 行级评论和总结评论要分层

这个案例把 GitLab 评论拆成两层：

- **line-level discussion**：用于指出具体文件、具体位置上的问题
- **summary note**：用于给出这一轮 review 的总体判断

行级 discussion 负责把问题钉在具体变更上，方便作者按上下文修；summary note 负责告诉人“这一轮到底有没有阻塞问题、最高风险点在哪里、前一轮问题是否已经解除”。

如果只写行级评论，作者可能看不出整体判断；如果只写总结，问题又会失去定位。两者一起出现，review 才真正可执行。

### 外部缺陷同步不是把评论再抄一遍

这个 Skill 还会把部分问题同步到 Feishu Bitable，但重点不是“多写一份副本”，而是“只同步值得持续跟踪的问题，并且避免重复建记录”。

它通常只把这些问题同步出去：

- 需要在 MR 之外继续追踪的 `Critical` / `Major`
- 在多个 MR 里反复出现的同类问题
- 用户明显需要跨会话看状态的缺陷

这里的分工很清楚：GitLab discussion 解决“当前 MR 怎么改”，外部 tracker 解决“这个问题是否还活着、有没有反复出现、后续有没有修完”。

### 本地 reviewed state 只能在评论成功后再更新

这套 Skill 最关键的一条工程纪律，是 reviewed-state 的更新时间必须晚于评论真正落地的时间。

本地状态文件大致长这样：

```json
{
  "27::52": "2026-03-20T05:47:00.928Z"
}
```

这里的 key 是 `project_id::mr_iid`，value 不是轮询时看到的旧 `updated_at`，而是**评论成功写回 GitLab 后，再次拉取 MR 得到的最新 `updated_at`**。

原因只有一个：

- reviewer 自己写的评论也会推进 MR 的 `updated_at`
- 如果把旧时间写回状态文件，下一次轮询就会把同一个 MR 再次识别成“新变更”
- 结果就是 agent 被自己的评论反复触发，进入伪增量循环

这类先后纪律，才是“能长期跑”的 Skill 和“一次性 prompt”的分界线。

---

## 适用边界

### 适合什么场景

- 你已经在 OpenClaw 里运行 reviewer agent，希望它能长期巡检 GitLab 中新开或更新过的 MR
- 你需要支持增量复审，而不是每次都把整个 MR 当成第一次 review
- 你希望 review 结果里同时有行级意见、整体结论和可持续跟踪的问题记录
- 你愿意维护本地状态文件、轮询脚本和外部 tracker 这类配套资产

### 不适合什么场景

- 你只是偶尔手工 review 一个 MR，不需要 heartbeat 或 cron 入口
- 你没有稳定的本地 reviewed-state 管理，却又想做增量巡检
- 你想让 review 和 merge 自动连成一步
- 你还没有决定哪些问题值得同步到外部系统，就先把所有评论都往 tracker 里抄

如果你的需求还停留在“帮我看下这个 MR 有没有明显问题”，更适合先看 [代码审查 Agent 的最小设计闭环](../../agent-development/examples/review-agent-walkthrough)。`gitlab-mr-review` 已经是“最小 review agent”之上的专项工作流层。

---

## 从这个案例能学到什么

这个案例对 Skill 设计最有价值的，不是 GitLab 细节，而是下面几条结构性经验。

### `SKILL.md` 要轻，不要把所有细节都写进去

如果主文件既要描述入口，又要解释 API，又要解释状态文件，还要定义 tracker 同步规则，最后通常会膨胀成一份大提示词。

更稳的写法是：

- `SKILL.md` 只保留入口、触发条件、核心纪律
- 细节按主题下沉到 `references/`
- 只在当前步骤需要时才加载对应 reference

这样既省上下文，也更容易维护。

### 确定性动作应该交给脚本

判断“哪些 MR 是待处理的”，本质上是状态比较和结果过滤，不是创造性工作。

把这部分交给脚本，有两个好处：

- 结果更稳定，减少模型自己拼轮询逻辑的机会
- Skill 文档可以专注在 review 判断，而不是复述一大段 shell 逻辑

### 评论写回和本地状态更新必须有先后纪律

很多专项 Skill 的难点，不在“会不会做”，而在“做完以后怎样不留下脏状态”。

`gitlab-mr-review` 的 reviewed-state 规则说明了一件事：只要工作流里既有外部写操作，又有本地持久化状态，就必须显式规定谁先谁后、失败时怎么办、什么情况下不能标记完成。

### 外部系统同步一定要做去重

一旦 Skill 会同时写 GitLab 和外部 tracker，就会出现重复记录问题。

这个案例没有把“同步”理解成无脑复制，而是先问：这是不是同一个问题、应不应该复用旧记录、修完以后是新建一条，还是把旧条目标为已修复。

这种去重纪律，决定了外部系统最后是“状态看板”还是“噪音仓库”。

### merge 不该被默认塞进 review 流

这套 Skill 明确把 merge 当成单独动作处理。

这背后的判断很稳：review 完成只代表“我已经形成了结论并写回”，不代表“现在一定安全可合并”。CI 状态、未解决 discussion、跨 MR 协调顺序，都可能让 merge 需要另一轮确认。

---

## 不要原样照搬什么

这个案例值得借结构，不值得整套照搬实现。

- 不要把 `review_bug_tracker.json` 里的 token、app id、table id、view id 之类配置写进文档或提示词
- 不要把 Feishu Bitable 当成所有团队的默认依赖；它只是这个工作区里的一个外部跟踪器
- 不要在文档里写宿主机器上的绝对路径，例如 `/Users/...`
- 不要默认所有 diff 都能稳稳挂上行级评论；当 diff 位置校验不稳定时，应允许回退到附近位置或 summary note
- 不要把 review 和 merge 自动绑死；“审过了”不等于“可以直接合”

更稳的迁移顺序是先借结构，再换实现：

1. 先借“轮询 + 增量状态”这套入口机制
2. 再借“行级 discussion + summary note”这套评论分层
3. 最后才决定要不要补外部 tracker，同步到什么系统

---

## 最值得先迁移的三件事

如果你想把这个案例迁到自己的项目里，最值得先借的不是整套工作区依赖，而是下面三个最小单元：

- **增量 review 入口**：先判断 MR 是否真有新变化，再决定是否 review
- **评论分层**：把具体问题和整体结论分开表达
- **后写状态纪律**：只有在评论真正成功写回后，才更新本地 reviewed state

先把这三件事做稳，你的 reviewer Skill 就已经比“一次性看 diff”高出一个层级。外部 tracker、复审线程复用、merge readiness 都可以后加。

---

## 延伸资源

- [如何制作 Skills](../advanced-patterns) — 回到 Skill 本体结构、入口设计和按需加载的基本做法
- [工作流选型](./skill-pack-selection) — 如果你在判断自己需要的是专项 Skill、Skill Pack，还是更大的工作流框架
- [代码审查 Agent 的最小设计闭环](../../agent-development/examples/review-agent-walkthrough) — 先理解最小 review agent 该解决什么，再看专项 Skill 怎样把它做深
- [Harness Engineering](../../harness-engineering/) — 当专项 Skill 越来越多时，怎样把它们整合进可维护的团队能力体系
