# 热门开源 Agent 方案参考

> 本页汇总 2026 年社区中具有代表性的开源 Agent 项目，帮助团队在构建自己的 Agent 之前，先了解已有的成熟方案可以直接使用或借鉴。

---

## 如何使用本页

本页不是选型排名，而是一张**参照地图**：

- 如果你的需求已被某个项目完整覆盖，直接使用，无需重复造轮子
- 如果你需要自己构建，可以参考这些项目的设计思路和工具配置
- 每个项目都标注了"与 Claude Code 的关系"，帮助你判断是替代、互补还是可组合

| 方案 | 定位 | 与 Claude Code 关系 |
|------|------|-------------------|
| OpenHands | 全自动软件工程 Agent | 替代或互补 |
| SWE-agent | 代码问题自动修复 | 参考设计 |
| Aider | 终端 AI 配对编程 | 替代或并行使用 |
| claude-code-action | CI/CD 内嵌 Claude | 与 Claude Code 直接集成 |
| CrewAI | 多 Agent 协作编排 | 构建自定义 Multi-Agent 时参考 |

---

## 各方案详解

### OpenHands（原 OpenDevin）— 全自动软件工程 Agent

**一句话定位：** 在沙箱环境中完全自主地完成软件开发任务，从读代码到写代码到执行测试，全程无需人工干预。

**核心能力：**
- 自主浏览代码仓库，理解项目结构
- 生成代码改动、运行测试、根据测试结果迭代
- 支持多种 LLM 后端（包括 Claude）
- 提供 Web 界面，可以观察 Agent 的每一步操作

**使用场景：**
- 自动修复已有 bug（输入 issue 描述，输出 PR）
- 探索性代码任务（重构、迁移）
- 研究 AI Agent 全自动完成任务的能力边界

**与 Claude Code 的关系：**  
OpenHands 是 Claude Code 的"对手方案"——两者目标相似（自主完成软件任务），但路径不同。OpenHands 强调沙箱隔离和完全自主；Claude Code 强调与开发者的交互式协作。如果你需要"完全无人值守"的任务执行，可以试用 OpenHands；如果你希望 AI 作为协作者而非替代者，Claude Code 更合适。

**仓库：** [github.com/All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands)

---

### SWE-agent — 代码问题自动修复

**一句话定位：** 普林斯顿大学出品，专门针对 GitHub issue 的代码修复 Agent，在 SWE-bench 基准测试上持续名列前茅。

**核心能力：**
- 输入一个 GitHub issue URL，自动定位问题代码并生成修复
- 使用专门设计的 Agent-Computer Interface（ACI）控制终端和代码编辑器
- 支持 Claude、GPT-4 等多种模型作为推理后端

**使用场景：**
- 研究 Agent 如何自主定位和修复代码问题
- 作为代码质量自动化流水线的一部分（配合 CI 触发）
- 参考 ACI 设计模式来构建自己的代码 Agent

**与 Claude Code 的关系：**  
SWE-agent 更偏向研究和基准测试场景，而 Claude Code 更偏向日常开发协作。两者可以并行：在评估 AI 修复能力时用 SWE-agent 做基准，日常开发中用 Claude Code 做交互式协作。SWE-agent 的 ACI 设计思路值得在构建自定义 Agent 时借鉴。

**仓库：** [github.com/SWE-agent/SWE-agent](https://github.com/SWE-agent/SWE-agent)

---

### Aider — 终端 AI 配对编程

**一句话定位：** 在终端中与 AI 结对编程的工具，自动感知 git 仓库上下文，直接提交修改。

**核心能力：**
- 自动分析 git 仓库结构，理解代码依赖关系
- 在对话中修改多个文件，自动生成 git commit
- 支持 Claude、GPT-4、Gemini 等主流模型
- 提供语音输入模式和 Web UI 可选

**使用场景：**
- 不想安装 Claude Code 时的轻量替代
- 与不使用 VS Code 的团队成员共享 AI 编程能力
- 在 CI 环境中自动执行代码改动任务

**与 Claude Code 的关系：**  
Aider 和 Claude Code 定位高度重叠，都是"终端里的 AI 编程助手"。主要差异：Aider 对多模型支持更完善，适合需要灵活切换模型的场景；Claude Code 与 Claude 模型的集成更深（Agent SDK、MCP、Skills & Hooks 生态），适合深度使用 Claude 的团队。两者不建议同时使用，根据团队技术栈选择其一即可。

**仓库：** [github.com/Aider-AI/aider](https://github.com/Aider-AI/aider)

---

### claude-code-action — CI/CD 内嵌 Claude

**一句话定位：** 官方出品的 GitHub Action，让 Claude Code 直接在 PR 和 issue 中响应评论、自动修复代码。

**核心能力：**
- 在 PR 评论中 `@claude` 触发 AI 响应
- 自动读取 PR diff、评论和代码上下文
- 可以直接推送 commit 修复 CI 失败或审查意见
- 支持配置 CLAUDE.md 控制 AI 行为

**使用场景：**
- 自动响应 PR 中的代码审查意见
- CI 失败时自动尝试修复（lint、测试、类型错误等）
- 在 issue 中触发 AI 分析和初步解决方案

**与 Claude Code 的关系：**  
`claude-code-action` 是 Claude Code 的 CI/CD 延伸——它把 Claude Code 的能力嵌入 GitHub 工作流，让 AI 在无人值守的情况下参与代码审查和修复流程。推荐在团队 Claude Code 使用成熟后，作为第二阶段的自动化升级引入。

```yaml
# .github/workflows/claude.yml 示例
name: Claude Code Action
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

**仓库：** [github.com/anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)

---

### CrewAI — 多 Agent 协作编排

**一句话定位：** 定义"角色化 Agent 团队"，让多个 AI Agent 分工协作完成复杂任务，每个 Agent 有独立的目标、工具和记忆。

**核心能力：**
- 声明式定义 Agent 角色（研究员、工程师、审查员……）
- Agent 之间通过结构化消息传递协作
- 支持 Claude 作为单个 Agent 的推理后端
- 内置任务依赖管理和执行顺序控制

**使用场景：**
- 构建需要多角色协作的复杂自动化流程（如：研究 → 起草 → 审核 → 发布）
- 参考多 Agent 设计模式来规划自己的 Claude Sub-Agent 架构
- 在 Claude Code 生态外构建独立的 AI 工作流

**与 Claude Code 的关系：**  
CrewAI 是构建多 Agent 系统的框架，Claude Code 的 Sub-Agent 功能可以实现类似的效果。两者的区别在于：CrewAI 更适合独立部署的自动化服务（无需人工介入）；Claude Code Sub-Agent 更适合与开发者交互式协作的场景。如果你正在规划 Claude Code 的 Multi-Agent 架构，CrewAI 的角色化设计思路值得参考。

**仓库：** [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)

---

## 与本站其他章节的关系

- [Agent 开发主文档](../index) — 判断什么时候需要构建 Agent，以及最小单 Agent 设计方法
- [Review Agent 演练](./review-agent-walkthrough) — 本站完整的单 Agent 构建案例
- [Harness Engineering](../../harness-engineering/) — 将 Agent 整合进团队工程体系的系统化方法
