# superpowers 实战指南：让编码 Agent 自动进入设计-计划-实现闭环

> **背景：** [superpowers](https://github.com/obra/superpowers) 是 obra 开源的一套 coding agent 工作流。它不是单个 prompt，而是一组可组合 Skill 加上一层初始指令，让 Agent 在合适的时候自动进入设计、计划、实现、测试、审查和收尾流程。

---

## superpowers 是什么

superpowers 的核心目标，不是给你更多命令，而是让 Agent **默认按工程化流程工作**。

普通情况下，很多 coding agent 会在你刚描述需求时就立刻开始写代码；superpowers 则先强制 Agent 停下来，先搞清楚：

- 你真正要解决的问题是什么
- 设计是否已经说清楚
- 任务是否能被拆成稳定的小步
- 每一步是否有验证方法

官方 README 对它的定义很直接：它是一套建立在可组合 Skill 之上的 **完整软件开发工作流**。重点不是"会多少招"，而是"有没有一条默认可信的交付链路"。

---

## 核心机制

superpowers 最核心的不是"多几个命令"，而是把下面几件事设成默认行为：

- **自动触发相关 Skill**：用户不需要每一步都手动点名
- **设计先于实现**：先通过 `brainstorming` 澄清目标，再进入写代码
- **计划驱动执行**：先写设计，再拆计划，再让子 Agent 执行
- **验证优先**：把 TDD、code review、完成前验证嵌入主流程

它更像一个**先写 spec、再拆计划、再组织执行的工程经理系统**，而不是一个等你逐条下命令的专家角色菜单。

---

## 典型工作流

superpowers 的主流程大致是：

| 阶段 | 自动触发的 Skill | 作用 |
|------|------------------|------|
| **需求澄清** | `brainstorming` | 先问问题、澄清目标、探索方案，并把设计文档保存下来 |
| **隔离开发环境** | `using-git-worktrees` | 在新分支 / 新 worktree 中工作，先确认环境和测试基线 |
| **任务拆解** | `writing-plans` | 把实现拆成 2–5 分钟粒度的小任务，写清文件路径、代码和验证步骤 |
| **执行实现** | `subagent-driven-development` 或 `executing-plans` | 用子 Agent 按任务推进，并做两阶段 review |
| **测试驱动** | `test-driven-development` | 强制走 RED → GREEN → REFACTOR，先写失败测试再写实现 |
| **代码审查** | `requesting-code-review` | 在任务之间检查是否偏离计划、是否引入严重问题 |
| **分支收尾** | `finishing-a-development-branch` | 汇总测试结果，决定合并、提 PR、保留或丢弃分支 |

它特别适合解决三类常见问题：

- 需求还没说清，Agent 就开始写代码
- 改动一大，任务很快失控
- 改完了但其实没验证清楚

这三类问题，本质上都在靠同一套机制解决：设计澄清、计划拆解、自动执行和验证闭环。

---

## 适合谁

- 希望 Agent 默认先设计、再计划、再实现的个人开发者或小团队
- 想把 TDD、review、完成前验证变成流程内置纪律的团队
- 已经接受子 Agent / worktree / 计划驱动开发方式的团队

**不太适合直接作为主流程的情况：**

- 团队习惯强人工编排，希望明确决定每一步叫哪个角色进场
- 已经有成熟且固定的开发流水线，不希望再叠加一层强约束自动流程

---

## 对 Skills & Hooks 的启发

superpowers 值得研究，不只是因为它"好用"，更因为它展示了 Skill 的另一种高级形态：

- Skill 不一定只是一个手动触发的小命令
- Skill 可以被编排成一条完整的工程流水线
- 初始指令 + Skill 库 + 自动触发机制，可以组成一个真正可复用的方法论产品

它对本章最重要的启发是：Skill 的高级形态不一定是"更多命令"，也可以是**把一套稳定工程方法论产品化**。

---

## 延伸资源

- [superpowers GitHub 仓库](https://github.com/obra/superpowers) — README、安装方式、内置 Skill 列表
- [Skill Pack 选型](./skill-pack-selection) — 如果你现在要在 superpowers 和 gstack 之间做判断
- [gstack GitHub 仓库](https://github.com/garrytan/gstack) — 角色化 Skill Pack 的另一种代表做法
- [gstack 实战指南](./gstack-workflow) — 本站对 gstack 工作流的拆解
- [Skills 进阶模式](../advanced-patterns) — 从单个 Skill 走向 Skill Pack / 工作流产品化
