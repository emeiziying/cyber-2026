---
title: 文档结构总览
---

# 文档结构总览

如果你现在不是想立刻开始读，而是想先弄清楚这套文档是怎么组织的，这一页先把全站结构展开。

## 先看结论

- 这套文档分成两层：`导读`、`学习主线`
- `导读` 负责回答“我该从哪开始”
- `学习主线` 负责回答“团队能力应该按什么顺序建立”
- 模板、配置样例和检查清单不再单独收口，而是放回各自章节内展示
- 每个学习模块都有一个主页面，案例和演练都放在对应模块的 `examples/` 目录下

---

## 读者视角：整站怎么读

| 区块 | 作用 | 包含内容 | 什么时候先看 |
|------|------|----------|--------------|
| [导读](./index) | 帮你判断入口，不用一上来读完整站 | [开始阅读](./index)、[快速启动指南](./quick-start)、本页 | 第一次进入站点，或准备把内容介绍给别人 |
| 学习主线 | 按“认知与协作方式 → 能力构建 → 治理与团队化”逐层推进 | 10 个核心模块 + 各模块案例页 | 已经知道要系统学习，想按章节推进 |

---

## 学习主线：10 个模块分 3 层

### 第一层：认知与协作方式

先建立判断框架，不急着配工具。

| 模块 | 这章主要回答什么 | 配套案例 |
|------|------------------|----------|
| [范式转变](../paradigm-shift/) | 为什么 AI 不是“多一个工具”，而是工作方式变化 | [角色影响场景](../paradigm-shift/examples/role-impact-scenarios) |
| [Vibe Coding](../vibe-coding/) | 改变之后，具体该怎样与 AI 协作 | [完整会话示例](../vibe-coding/examples/full-session)、[Agentic Coding](../vibe-coding/examples/agentic-coding) |
| [工具全景](../tools-overview/) | 不同工具和产品各适合什么任务 | [团队画像案例](../tools-overview/examples/team-profiles) |

### 第二层：能力构建

当你已经知道怎么协作，下一步是把经验沉淀成结构化能力。

| 模块 | 这章主要回答什么 | 配套案例 / 进阶页 |
|------|------------------|-------------------|
| [Rules](../rules/) | 什么约束应该写进项目共享规则 | [Rules 冲突案例](../rules/examples/rules-conflict-case) |
| [MCP](../mcp/) | 什么时候该让 AI 接真实工具和外部系统 | [MCP 只读接入演练](../mcp/examples/mcp-readonly-rollout)、[MCP 热门开源项目](../mcp/examples/popular-mcp-servers) |
| [Skills & Hooks](../skills-hooks/) | 哪些重复流程该封装成 Skill 或自动触发检查 | [进阶模式](../skills-hooks/advanced-patterns)、[Skill 与 Hook 判断案例](../skills-hooks/examples/skill-hook-decision-cases) 等 |
| [Agent 开发](../agent-development/) | 封装还不够时，什么时候值得升级成 Agent | [Review Agent 演练](../agent-development/examples/review-agent-walkthrough) |
| [Harness Engineering](../harness-engineering/) | 怎样把 Rules、MCP、Skill、Agent 组合成可维护的工程体系 | [Harness 设计演练](../harness-engineering/examples/harness-design-case) |

### 第三层：治理与团队化

最后再把个人做法升级成团队机制。

| 模块 | 这章主要回答什么 | 配套案例 |
|------|------------------|----------|
| [生产落地与治理](../production-governance/) | 怎样给 AI 使用边界、风险分级和验收标准 | [发布风险复盘案例](../production-governance/examples/release-risk-review) |
| [团队工作流与质量控制](../team-workflow/) | 怎样把任务入口、测试义务、Review 和复盘沉淀成流程 | [工作流样例](../team-workflow/examples/workflow-sample) |

---

## 维护者视角：文件结构怎么放

| 路径模式 | 作用 | 维护规则 |
|---------|------|----------|
| `docs/index.md` | 站点首页 | 只做入口，不承载章节正文 |
| `docs/intro/*.md` | 导读区页面 | 负责引导读者进入正确路径 |
| `docs/<module>/index.md` | 模块主页面 | 负责讲清楚该模块的核心判断和边界 |
| `docs/<module>/examples/*.md` | 模块案例页 | 负责补充演练、样例、比较和实操案例 |

这意味着：**模块正文和案例最好不要混放。**  
一个简单判断方法是：

- 要讲概念和判断框架，放 `index.md`
- 要讲具体案例和演练，放 `examples/`
- 要给读者看模板骨架，直接写进对应章节正文

---

## 如果你按目标找内容

- 想先理解为什么团队要改变工作方式：从 [范式转变](../paradigm-shift/) 开始
- 想尽快把项目约束写出来：从 [Rules](../rules/) 开始
- 想判断该写 Rule、接 MCP 还是封装 Skill：从 [工具全景](../tools-overview/) 接着读 [Rules](../rules/) 和 [MCP](../mcp/)
- 想推进团队统一：从 [快速启动指南](./quick-start) 或 [Harness Engineering](../harness-engineering/) 开始
- 想直接看模板骨架：进对应章节看内嵌示例

---

## 下一步怎么走

- 还没开始看正文：回到 [开始阅读](./index)
- 已经知道自己处在哪个阶段：去 [快速启动指南](./quick-start)
- 准备按主线系统阅读：从 [范式转变](../paradigm-shift/) 开始
