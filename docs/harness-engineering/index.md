# Harness Engineering

> **适合人群：** 已完成 Rules、MCP、Skills & Hooks、Agent 开发各章学习，希望将这些能力整合为稳定生产体系的工程师或技术负责人
> **学习目标：** 理解什么是 Harness Engineering，掌握其三层结构，并能为自己的团队设计一套最小可用的 Harness

---

## 本章解决什么问题

你和团队已经会用 AI Agent 了。但你可能发现：

- 同样的任务，Agent 今天能做好，明天就出错——原因不明
- 某位同事总结了一套"和 Agent 协作的窍门"，但只有他知道，无法复用
- Agent 犯过的错，下次换个人操作，同样的错又来一遍
- 越来越多的 AI 使用场景，缺少统一的质量保证机制

这些问题的根源不在于 AI 能力不足，而在于**缺乏工程化的 Agent 运行环境**。用 Agent 写代码容易，让 Agent 在团队中持续可靠地工作，需要专门的工程投入——这就是 Harness Engineering 要解决的问题。

---

## 为什么这件事重要

2026 年 2 月 11 日，OpenAI 在总结 Codex Agent 协作实践的文章中，用 **Harness Engineering** 来概括这类工作：**3 名工程师与 Codex Agent 协作 5 个月，累计打开并合并约 1500 个 PR，交付了一个规模接近百万行代码的 beta 产品。**

这不是魔法，也不是偶然。文章强调，真正放大产能的关键，不是继续让人亲自写更多代码，而是把更多工程精力投入到让 Agent 稳定工作的环境里。OpenAI 对这类工作方式的概括，可以先用一句中文记住：

> **人类掌舵，智能体执行。**

工程师的重心不再只是实现代码，而是**设计让 Agent 可靠工作的环境**。

类似的经验也出现在 Mitchell Hashimoto 2026 年 2 月 5 日关于“Engineer the Harness”的总结里。一个反复出现的原则是：

> **每次发现 Agent 犯了一个错误，就投入时间设计一个机制，确保它下次更不容易再犯同样的错。**

这一原则将每次失败转化为对系统的永久性改进，是 Harness 随时间持续增强的核心动力。

---

## 核心概念与边界

上一章更关注 Agent 本身能做什么；本章更关注怎样把这些能力放进一个可控、可维护、能长期稳定运行的团队环境里。

### 三层结构

把 OpenAI 的实践、Mitchell 的经验总结，以及 Martin Fowler / Thoughtworks 对 harness 的“指导、感知与约束”三类机制放在一起看，本文为了便于落地，先把一个最小 Harness 教学上整理为三层：

| 层 | 名称 | 作用 | 对应你已学的能力 |
|----|------|------|-----------------|
| 第一层 | **Context Engineering**（上下文工程） | 维护 Agent 始终可访问的知识库与项目规范，让 Agent 在每次对话中都有足够的上下文 | Rules / `AGENTS.md` / 仓库内文档 |
| 第二层 | **Architectural Constraints**（架构约束） | 用确定性检查器（linter、结构测试）和 LLM 检查器限制 Agent 的输出边界，防止 Agent "创造性地偏离"架构 | Skills / Hooks / CI / 结构测试 |
| 第三层 | **Garbage Collection**（垃圾回收） | 定期运行的 Agent 或自动化，主动发现并修复代码库中的不一致、过期文档和技术债 | Agent 开发 / 定时任务 |

三层合力：Context 保证 Agent 知道该做什么，Constraints 保证 Agent 做的符合规范，GC 保证积累的问题不会失控。

Fowler 的文章更适合理解 harness 的调节方向，以及前馈约束与反馈回路的关系；这里的三层是本站为了串联前面几章能力采用的教学抽象。

### 什么时候更适合引入 Harness Engineering

- 团队有 2 人以上在使用 AI Agent 协作
- 项目需要持续维护（而非一次性脚本）
- Agent 的输出会直接进入生产代码库
- 你发现同类错误在重复出现

### 暂时不必急着引入

- 个人实验性项目或原型验证
- 一次性数据处理任务
- 团队对 AI 工具刚开始探索，尚未形成稳定使用习惯

---

## 一个最小场景与反例

### 没有 Harness 的团队

> 小李用 Claude 生成了一个功能，跑通了测试，合并了 PR。两周后，小王接手同一模块，用同样的方式让 AI 生成代码，得到了一个命名风格完全不同、忽略了团队约定的实现。小张复盘时发现，AI 对团队"不要直接操作数据库，必须走 Repository 层"的规范一无所知。
> 这个规范只活在几个月前的一个 Slack 消息里。

问题核心：**Context 层缺失**。团队的约定没有进入 Agent 的工作上下文。

### 有 Harness 的团队

> 团队的 AGENTS.md 明确记录了高频约束，并链接到详细架构文档；每次有新约定产生就立即更新。一个 pre-commit Hook 会检查提交中是否有绕过 Repository 层的直接数据库调用，违规时自动拒绝并输出提示。每两周运行一次的 GC Agent 会扫描文档与实现的一致性，将发现的偏差作为 Issue 提交。
> 新成员入职第一天，用 AI 生成的代码就符合团队风格——不是因为 AI 更聪明，而是因为环境更清晰。

---

## 实操方法：三步搭建最小 Harness

Harness 不是一次性建设完成的。建议按三步渐进：

### Step 1：建立 Context Layer（第 1–2 周）

**目标：** 让 Agent 每次开始工作时，都能拿到稳定、可复用的项目上下文。

- 保持 `AGENTS.md` 简短，只放所有任务都需要知道的高频规则、常用命令和文档入口
- 把复杂且易变的知识拆到仓库内文档（如 `docs/`、`ARCHITECTURE.md`、schema、runbook），并由 `AGENTS.md` 链接过去
- 接入 MCP 只读工具（代码库、文档、数据库 schema），让 Agent 能主动获取上下文而非依赖人工粘贴
- 每次发现 Agent 因不了解某个约定而出错时，先判断它应该沉淀为 `AGENTS.md` 的高频规则，还是仓库文档里的详细说明，再立即补充

**完成标志：** 新人第一次使用 AI Agent，不需要老成员额外解释，也能顺着 `AGENTS.md` 找到正确的规则和文档，并生成符合团队风格的代码。

### Step 2：加入 Constraints Layer（第 3–4 周）

**目标：** 把高频错误从“靠人记住”变成“系统自动拦住”。

- 在 pre-commit Hook 中加入关键约束的自动检查（架构规范、安全规范、格式规范）
- 设计"错误日志"：记录 Agent 产生过的每个需要人工修正的错误，分析模式
- 将高频错误模式转化为新的 Hook 检查或 Skill 中的明确约束

**完成标志：** 能举出至少 3 条因 Agent 犯错而新增的自动化检查规则。

### Step 3：引入 Garbage Collection Agent（第 5–8 周）

**目标：** 让团队具备持续发现和清理“环境腐烂”的能力，而不是只在出问题后救火。

- 设计定期扫描任务：文档与实现的一致性、测试覆盖率趋势、依赖版本过期
- GC Agent 的输出不直接修改代码，而是生成 Issue 或 PR draft，由人工审核
- 设置运行频率（建议每周一次），将结果纳入团队 sprint review

**完成标志：** 团队有一个"Harness 健康仪表盘"，能看到 Context、Constraints、GC 各层的状态。

---

## 常见失败模式

| 失败模式 | 症状 | 根因 |
|----------|------|------|
| **Harness 太轻** | Agent 产出质量不稳定，每次都需要人工大量修改 | Context 不完整，Constraints 缺失 |
| **Harness 太重** | 工程师觉得用 AI 比自己写还麻烦，开始绕过流程 | Constraints 过于繁琐，每个操作都需要多轮审批 |
| **Context 腐烂** | AGENTS.md 上次更新是三个月前，Agent 按过期规范工作 | 没有机制强制更新 Context，缺少 GC 层 |
| **GC 缺失** | 技术债越积越多，Agent 越来越频繁地犯同类错误 | 只建设了前两层，没有"自我清洁"机制 |
| **孤岛 Harness** | 每个人有自己的 AGENTS.md，团队没有共享版本 | Harness 建设没有纳入团队协作流程 |

---

## 常见误区 / 风险提醒

| 误区 | 更稳妥的判断 |
|------|--------------|
| “Harness Engineering = 让 AI 完全自动化，人退出循环” | Harness 的核心恰恰是“人类掌舵”：人设计环境、审核边界、修复约束。自动化的是执行，而非决策。 |
| “只要 prompt 写得好，就不需要工程化约束” | Prompt 质量影响单次结果，Harness 决定长期稳定性。好的 prompt 在今天有效，好的 Harness 在六个月后仍然有效。 |
| “Harness 是一次性工程，设置好就不用管” | Harness 需要持续维护。新的错误模式要转化为新的约束，项目演进时 Context 也要同步更新。 |

**风险提醒：** 一个停止维护的 Harness，比没有 Harness 更危险，因为它会持续给 Agent 错误的上下文和错误的信心。

---

## 最小练习

以下四步可以在一个工作日内完成，帮你快速感受 Harness 的实际效果：

1. **审计 Context Layer**：打开你项目的 `AGENTS.md` 和它指向的核心文档，检查是否覆盖这三类内容：（a）项目架构约定，（b）编码规范与禁止行为，（c）常用工具与访问方式。缺什么就补什么。

2. **增加一个 Constraints 检查**：选择一个你的团队在 Code Review 中最常提的问题，将它写成一个 pre-commit Hook 或 CI 检查，让 Agent 提交违规代码时自动报错。

3. **建立错误日志**：创建一个"Agent 已知错误模式"列表，将本周 Agent 产生的需要人工修正的错误记录下来，分析原因。最好至少保留一份仓库内、可机读的版本，团队 wiki 可作为协作视图。

4. **将一个错误固化为规则**：从上一步的错误列表中，选一条最典型的，将修复方式转化为新的 Rule、Hook 或 Skill 约束，确保同类错误不再发生。

---

## 与前后章节的关系

Harness Engineering 是前面各章能力的综合运用：

- **[Rules →](../rules/)**：是 Context Layer 的核心载体，AGENTS.md 就是你的 Context 基础设施
- **[MCP →](../mcp/)**：为 Context Layer 提供动态工具访问能力，让 Agent 能主动获取外部信息
- **[Skills & Hooks →](../skills-hooks/)**：Constraints Layer 的主要实现手段，Hook 是最直接的自动化约束
- **[Agent 开发 →](../agent-development/)**：为 Garbage Collection Layer 提供执行能力
- **[→ 生产落地与治理](../production-governance/)**：在 Harness 基础上建立更宏观的风险管理框架
- **[→ 团队工作流](../team-workflow/)**：将 Harness 维护纳入团队日常协作流程

---

## 延伸阅读 / 模板 / 示例

- [**Harness 设计演练**](./examples/harness-design-case)：一个 3 人前端团队从零搭建 Harness 的完整案例

### 最小 Harness 检查项

- `Context Layer`：已有共享 `AGENTS.md` 作为入口，并能指向架构约定、禁止行为、常用工具路径的仓库内事实来源
- `Constraints Layer`：已有至少一个能拦住高频错误的 Hook、CI 或结构检查
- `GC Layer`：已有固定节奏复盘 Agent 错误，并把高频问题反写成规则或检查

- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)（OpenAI：repo 作为 system of record、doc gardening 与 agent-first 开发实践）
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey)（Mitchell Hashimoto：Engineer the Harness 的个人实践）
- [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)（Thoughtworks：从“指导 / 感知 / 约束”与不同 harness 类别理解外层 Harness）

---

## 完成检查清单

- [ ] 能用自己的语言解释 Harness 三层结构，并举出每层在你团队中对应的具体工具或文件
- [ ] 已识别出本团队 Harness 当前最薄弱的一个层，并有改进计划
- [ ] 已将至少一个历史 Agent 错误固化为规则、Hook 或自动化检查，确保不再重现

---

**上一章 ←** [Agent 开发](../agent-development/)
**下一章 →** [生产落地与治理](../production-governance/)
