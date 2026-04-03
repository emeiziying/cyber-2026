# Harness Engineering

**目标读者：** 已完成 Rules、MCP、Skills & Hooks、Agent 开发各章学习，希望将这些能力整合为稳定生产体系的工程师或技术负责人。

**学习目标：** 理解什么是 Harness Engineering，掌握其三层结构，并能为自己的团队设计一套最小可用的 Harness。

---

## 这解决什么问题

你和团队已经会用 AI Agent 了。但你可能发现：

- 同样的任务，Agent 今天能做好，明天就出错——原因不明
- 某位同事总结了一套"和 Agent 协作的窍门"，但只有他知道，无法复用
- Agent 犯过的错，下次换个人操作，同样的错又来一遍
- 越来越多的 AI 使用场景，缺少统一的质量保证机制

这些问题的根源不在于 AI 能力不足，而在于**缺乏工程化的 Agent 运行环境**。用 Agent 写代码容易，让 Agent 在团队中持续可靠地工作，需要专门的工程投入——这就是 Harness Engineering 要解决的问题。

---

## 为什么重要

2026 年初，OpenAI 发布了一份内部实验报告：**3 名工程师搭档 Codex Agent，历时 5 个月，合并约 1500 个 PR，交付了一个接近百万行代码的 beta 产品——期间没有人工手写一行源代码。**

这不是魔法，也不是偶然。他们将这套方法论命名为 **Harness Engineering**（由 HashiCorp 联合创始人 Mitchell Hashimoto 最早提出），核心理念只有一句话：

> **Humans steer. Agents execute.**
> 人类掌舵，智能体执行。

工程师的职责不再是实现代码，而是**设计让 Agent 可靠工作的环境**。

其中最关键的原则是：

> **每次发现 Agent 犯了一个错误，就投入时间设计一个机制，确保它永远不再犯同样的错。**

这一原则将每次失败转化为对系统的永久性改进，是 Harness 随时间持续增强的核心动力。

---

## 核心概念

Martin Fowler 将 Harness Engineering 归纳为三个相互配合的层：

| 层 | 名称 | 作用 | 对应你已学的能力 |
|----|------|------|-----------------|
| 第一层 | **Context Engineering**（上下文工程） | 维护 Agent 始终可访问的知识库与项目规范，让 Agent 在每次对话中都有足够的上下文 | Rules / CLAUDE.md |
| 第二层 | **Architectural Constraints**（架构约束） | 用确定性检查器（linter、结构测试）和 LLM 检查器限制 Agent 的输出边界，防止 Agent "创造性地偏离"架构 | Skills / Hooks / CI |
| 第三层 | **Garbage Collection**（垃圾回收） | 定期运行的 Agent，主动发现并修复代码库中的不一致、过期文档和技术债 | Agent 开发 |

三层合力：Context 保证 Agent 知道该做什么，Constraints 保证 Agent 做的符合规范，GC 保证积累的问题不会失控。

### 什么时候适合引入 Harness Engineering

**适合：**
- 团队有 2 人以上在使用 AI Agent 协作
- 项目需要持续维护（而非一次性脚本）
- Agent 的输出会直接进入生产代码库
- 你发现同类错误在重复出现

**不必要：**
- 个人实验性项目或原型验证
- 一次性数据处理任务
- 团队对 AI 工具刚开始探索，尚未形成稳定使用习惯

---

## 正反案例

### 没有 Harness 的团队

> 小李用 Claude 生成了一个功能，跑通了测试，合并了 PR。两周后，小王接手同一模块，用同样的方式让 AI 生成代码，得到了一个命名风格完全不同、忽略了团队约定的实现。小张复盘时发现，AI 对团队"不要直接操作数据库，必须走 Repository 层"的规范一无所知。  
> 这个规范只活在几个月前的一个 Slack 消息里。

问题核心：**Context 层缺失**。团队的约定没有进入 Agent 的工作上下文。

### 有 Harness 的团队

> 团队的 CLAUDE.md 明确记录了架构约定，每次有新约定产生就立即更新。一个 pre-commit Hook 会检查提交中是否有绕过 Repository 层的直接数据库调用，违规时自动拒绝并输出提示。每两周运行一次的 GC Agent 会扫描文档与实现的一致性，将发现的偏差作为 Issue 提交。  
> 新成员入职第一天，用 AI 生成的代码就符合团队风格——不是因为 AI 更聪明，而是因为环境更清晰。

---

## 落地路径

Harness 不是一次性建设完成的。建议按三步渐进：

### Step 1：建立 Context Layer（第 1–2 周）

- 整理并完善 `CLAUDE.md`，确保包含：项目架构约定、编码规范、禁止行为、常用工具清单
- 接入 MCP 只读工具（代码库、文档、数据库 schema），让 Agent 能主动获取上下文而非依赖人工粘贴
- 将"口口相传的团队规范"全部写入 Rules，每次发现 Agent 因不了解某个约定而出错，立即补充

**完成标志：** 新人第一次使用 AI Agent，不需要老成员额外解释，就能生成符合团队风格的代码。

### Step 2：加入 Constraints Layer（第 3–4 周）

- 在 pre-commit Hook 中加入关键约束的自动检查（架构规范、安全规范、格式规范）
- 设计"错误日志"：记录 Agent 产生过的每个需要人工修正的错误，分析模式
- 将高频错误模式转化为新的 Hook 检查或 Skill 中的明确约束

**完成标志：** 能举出至少 3 条因 Agent 犯错而新增的自动化检查规则。

### Step 3：引入 Garbage Collection Agent（第 5–8 周）

- 设计定期扫描任务：文档与实现的一致性、测试覆盖率趋势、依赖版本过期
- GC Agent 的输出不直接修改代码，而是生成 Issue 或 PR draft，由人工审核
- 设置运行频率（建议每周一次），将结果纳入团队 sprint review

**完成标志：** 团队有一个"Harness 健康仪表盘"，能看到 Context、Constraints、GC 各层的状态。

---

## 失败模式

| 失败模式 | 症状 | 根因 |
|----------|------|------|
| **Harness 太轻** | Agent 产出质量不稳定，每次都需要人工大量修改 | Context 不完整，Constraints 缺失 |
| **Harness 太重** | 工程师觉得用 AI 比自己写还麻烦，开始绕过流程 | Constraints 过于繁琐，每个操作都需要多轮审批 |
| **Context 腐烂** | CLAUDE.md 上次更新是三个月前，Agent 按过期规范工作 | 没有机制强制更新 Context，缺少 GC 层 |
| **GC 缺失** | 技术债越积越多，Agent 越来越频繁地犯同类错误 | 只建设了前两层，没有"自我清洁"机制 |
| **孤岛 Harness** | 每个人有自己的 CLAUDE.md，团队没有共享版本 | Harness 建设没有纳入团队协作流程 |

---

## 常见误区

**误区一：Harness Engineering = 让 AI 完全自动化，人退出循环**

Harness Engineering 的核心恰恰是"人类掌舵"——人设计环境、审核边界、修复约束。自动化的是执行，而非决策。

**误区二：只要 prompt 写得好，就不需要工程化约束**

Prompt 质量影响单次结果，Harness 决定长期稳定性。好的 prompt 在今天有效，好的 Harness 在六个月后仍然有效。

**误区三：Harness 是一次性工程，设置好就不用管**

Harness 需要持续维护——新的错误模式要转化为新的约束，项目演进时 Context 要同步更新。一个停止维护的 Harness 比没有 Harness 更危险，因为它会给 Agent 错误的信心。

---

## 最小练习

以下四步可以在一个工作日内完成，帮你快速感受 Harness 的实际效果：

1. **审计 Context Layer**：打开你项目的 `CLAUDE.md`，检查是否包含这三类内容：（a）项目架构约定，（b）编码规范与禁止行为，（c）常用工具与访问方式。缺什么就补什么。

2. **增加一个 Constraints 检查**：选择一个你的团队在 Code Review 中最常提的问题，将它写成一个 pre-commit Hook 或 CI 检查，让 Agent 提交违规代码时自动报错。

3. **建立错误日志**：在 `CLAUDE.md` 或团队 wiki 中创建一个"Agent 已知错误模式"列表，将本周 Agent 产生的需要人工修正的错误记录下来，分析原因。

4. **将一个错误固化为规则**：从上一步的错误列表中，选一条最典型的，将修复方式转化为新的 Rule、Hook 或 Skill 约束，确保同类错误不再发生。

---

## 与相邻章节的关系

Harness Engineering 是前面各章能力的综合运用：

- **[Rules →](/rules/)**：是 Context Layer 的核心载体，CLAUDE.md 就是你的 Context 基础设施
- **[MCP →](/mcp/)**：为 Context Layer 提供动态工具访问能力，让 Agent 能主动获取外部信息
- **[Skills & Hooks →](/skills-hooks/)**：Constraints Layer 的主要实现手段，Hook 是最直接的自动化约束
- **[Agent 开发 →](/agent-development/)**：为 Garbage Collection Layer 提供执行能力
- **[→ 生产落地与治理](/production-governance/)**：在 Harness 基础上建立更宏观的风险管理框架
- **[→ 团队工作流](/team-workflow/)**：将 Harness 维护纳入团队日常协作流程

---

## 延伸资源

- [**Harness 设计演练**](./examples/harness-design-case)：一个 3 人前端团队从零搭建 Harness 的完整案例
- <a href="/downloads/harness-engineering/templates/harness-checklist.md.template" download>**Harness 建设检查清单模板**</a>：可下载的团队 Harness 评估与建设清单
- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)（OpenAI 原文）
- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)（Martin Fowler 解析）

---

## 完成检查清单

- [ ] 能用自己的语言解释 Harness 三层结构，并举出每层在你团队中对应的具体工具或文件
- [ ] 已识别出本团队 Harness 当前最薄弱的一个层，并有改进计划
- [ ] 已将至少一个历史 Agent 错误固化为规则、Hook 或自动化检查，确保不再重现
