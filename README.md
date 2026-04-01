# AI Agent 技术分享 — cyber-2026

> 团队内部技术分享，覆盖从 Vibe Coding 入门到 Agent 开发的完整学习路线。
> 适合工程师（实践操作）和技术管理者（概念决策）混合受众。

---

## 仓库定位

- 这是一个 **AI Agent 学习资料 + 落地模板** 仓库，不是业务应用仓库，也不是 SDK。
- 仓库目标分为两部分：一是支撑内部分享与培训，二是沉淀团队可直接复制的 Rules / MCP / Skills 基础资产。
- 当前已补充一个最小示例项目 [`examples/minimal-agent-demo`](./examples/minimal-agent-demo/)，用于演示模板如何落到真实目录结构和命令链路上。

---

## 学习路线图

```
[第一章] 范式转变          ← 管理者必看，建立认知框架
     ↓
[第二章] Vibe Coding       ← 感受 AI 编程的"心流"体验
     ↓
[第三章] 工具全景           ← 了解主流工具，做出选型决策
     ↓
[第四章] Rules             ← 让 AI 真正理解你的项目
     ↓
[第五章] MCP               ← 给 AI 装上"手和眼"
     ↓
[第六章] Skills & Hooks    ← 自动化你的 AI 工作流
     ↓
[第七章] Agent 开发         ← 从使用者到构建者
     ↓
[第八章] 生产落地与治理      ← 把 AI 引入真实交付流程
     ↓
[第九章] 团队工作流与质量控制 ← 把个人能力沉淀成团队机制
     ↓
[附录] 真实案例库            ← 用案例演练和复盘闭环
```

---

## 仓库分层

| 层级 | 目录 | 作用 |
|------|------|------|
| 课程层 | `01-paradigm-shift` ~ `03-tools-overview` | 统一认知、建立工具选型框架 |
| 模板层 | `04-rules` ~ `06-skills-hooks` | 提供可直接复制的 Rules / MCP / Skill 模板 |
| 示例层 | [`examples/minimal-agent-demo`](./examples/minimal-agent-demo/) | 用最小 Node 项目演示模板如何组合落地 |
| 进阶层 | `07-agent-development` | 介绍 Agent / Multi-Agent 原理与 SDK 级实现思路 |
| 治理层 | `08-production-governance` ~ `09-team-workflow` | 把 AI 纳入真实交付、Review、测试和团队协作机制 |
| 案例层 | [`appendix-case-studies`](./appendix-case-studies/) | 用练习案例和复盘模板做实战演练 |

完整项目梳理见 [`PROJECT-OVERVIEW.md`](./PROJECT-OVERVIEW.md)。

---

## 章节目录

| 章节 | 主题 | 难度 | 适合人群 |
|------|------|------|---------|
| [第一章](./01-paradigm-shift/) | AI 辅助开发的范式转变 | ⭐ | 全员 |
| [第二章](./02-vibe-coding/) | Vibe Coding 实战 | ⭐⭐ | 工程师 |
| [第三章](./03-tools-overview/) | 主流 AI 编程工具全景 | ⭐⭐ | 全员 |
| [第四章](./04-rules/) | Rules — 驯化你的 AI 助手 | ⭐⭐⭐ | 工程师 |
| [第五章](./05-mcp/) | MCP — 扩展 AI 能力边界 | ⭐⭐⭐ | 工程师 |
| [第六章](./06-skills-hooks/) | Skills & Hooks — AI 工作流自动化 | ⭐⭐⭐ | 工程师 |
| [第七章](./07-agent-development/) | 从工具使用到 Agent 开发 | ⭐⭐⭐⭐ | 工程师 |
| [第八章](./08-production-governance/) | 生产落地与治理 | ⭐⭐⭐⭐ | 工程师 / Tech Lead / 管理者 |
| [第九章](./09-team-workflow/) | 团队工作流与质量控制 | ⭐⭐⭐⭐ | 工程师 / Reviewer / Tech Lead |
| [附录](./appendix-case-studies/) | 真实案例库 | ⭐⭐⭐ | 工程师 |

---

## 如何使用本仓库

- **管理者：** 重点阅读第一章和第三章，理解团队引入 AI 工具的价值与路径
- **工程师：** 按顺序阅读，每章末尾有"完成检查清单"可自测掌握程度
- **Tech Lead / Reviewer：** 在完成第七章后继续阅读第八、九章，把 AI 使用从“个人提效”推进到“团队治理”
- **模板落地：** 重点阅读第四到第六章，然后对照 [`examples/minimal-agent-demo`](./examples/minimal-agent-demo/) 理解 Rules、MCP、Skills 如何组合
- **案例演练：** 阅读 [`appendix-case-studies`](./appendix-case-studies/) 中的案例设计，选择 1-2 个场景做实操和复盘
- **模板文件：** `templates/` 目录下的配置文件可直接复制到自己的项目中使用

---

## 可复用资产

- [04-rules/templates/CLAUDE.md.template](./04-rules/templates/CLAUDE.md.template) 和 [04-rules/templates/frontend-CLAUDE.md.template](./04-rules/templates/frontend-CLAUDE.md.template)：项目级 AI 规则骨架
- [05-mcp/templates/mcp-config.json](./05-mcp/templates/mcp-config.json)：常见 MCP Server 配置样例
- [06-skills-hooks/templates/commands](./06-skills-hooks/templates/commands/)：`fix-bug`、`gen-tests`、`review-code`、`daily-report`、`gen-team-rules` 等 Skill 模板
- [08-production-governance/templates](./08-production-governance/templates/)：风险分级和交付验收模板
- [09-team-workflow/templates](./09-team-workflow/templates/)：任务入口和 PR Review 清单模板
- [appendix-case-studies/templates/case-study-template.md](./appendix-case-studies/templates/case-study-template.md)：案例复盘模板
- [examples/minimal-agent-demo](./examples/minimal-agent-demo/)：最小可运行示例，包含 `CLAUDE.md`、`.claude/settings.json`、项目级 Skills 和一组可执行脚本

---

## 最小落地验证

```bash
cd examples/minimal-agent-demo
npm test
npm start
```

完成运行后，可继续查看以下文件，理解模板如何落地：

- [`examples/minimal-agent-demo/CLAUDE.md`](./examples/minimal-agent-demo/CLAUDE.md)
- [`examples/minimal-agent-demo/.claude/settings.json`](./examples/minimal-agent-demo/.claude/settings.json)
- [`examples/minimal-agent-demo/.claude/commands`](./examples/minimal-agent-demo/.claude/commands/)

---

## 核心工具参考

- [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [Cursor 文档](https://docs.cursor.com)
