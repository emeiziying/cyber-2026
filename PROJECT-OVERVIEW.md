# `cyber-2026` 项目概览

## 1. 项目是什么

`cyber-2026` 是一个面向团队内部的 AI Agent 技术分享仓库，核心用途不是交付业务功能，而是沉淀一套从认知建立到工程落地的学习与实践材料。

- 面向管理者：帮助建立 AI 编程工具的认知框架和选型方法
- 面向工程师：提供可复制的 Rules、MCP、Skills 模板，以及一个最小落地示例

## 2. 当前结构

| 目录 | 角色 | 说明 |
|------|------|------|
| [`01-paradigm-shift`](./01-paradigm-shift/) | 课程层 | 解释 AI 辅助开发的范式变化 |
| [`02-vibe-coding`](./02-vibe-coding/) | 课程层 | 说明 Vibe Coding 的使用方式和边界 |
| [`03-tools-overview`](./03-tools-overview/) | 课程层 | 对主流 AI 编程工具做横向对比 |
| [`04-rules`](./04-rules/) | 模板层 | 讲解并提供 `CLAUDE.md` 模板 |
| [`05-mcp`](./05-mcp/) | 模板层 | 讲解并提供 MCP 配置样例 |
| [`06-skills-hooks`](./06-skills-hooks/) | 模板层 | 讲解 Skill / Hook，并提供命令模板 |
| [`07-agent-development`](./07-agent-development/) | 进阶层 | 介绍 Agent / Multi-Agent 原理与 SDK 示例 |
| [`08-production-governance`](./08-production-governance/) | 治理层 | 说明如何把 AI 纳入真实交付流程、权限边界与验收机制 |
| [`09-team-workflow`](./09-team-workflow/) | 治理层 | 说明如何把个人使用经验沉淀为团队工作流与质量约束 |
| [`appendix-case-studies`](./appendix-case-studies/) | 案例层 | 提供练习案例和复盘模板，补齐“学会”和“会用”之间的断层 |
| [`examples/minimal-agent-demo`](./examples/minimal-agent-demo/) | 示例层 | 用零依赖 Node 项目串联 Rules、MCP、Skills 的最小闭环 |

## 3. 复用资产

当前仓库对外稳定输出的核心资产不是代码 API，而是以下模板与示例：

- Rules 模板：
  - [`04-rules/templates/CLAUDE.md.template`](./04-rules/templates/CLAUDE.md.template)
  - [`04-rules/templates/frontend-CLAUDE.md.template`](./04-rules/templates/frontend-CLAUDE.md.template)
- MCP 模板：
  - [`05-mcp/templates/mcp-config.json`](./05-mcp/templates/mcp-config.json)
- Skills 模板：
  - [`06-skills-hooks/templates/commands`](./06-skills-hooks/templates/commands/)
- 治理模板：
  - [`08-production-governance/templates`](./08-production-governance/templates/)
  - [`09-team-workflow/templates`](./09-team-workflow/templates/)
- 案例模板：
  - [`appendix-case-studies/templates/case-study-template.md`](./appendix-case-studies/templates/case-study-template.md)
- 最小落地示例：
  - [`examples/minimal-agent-demo/CLAUDE.md`](./examples/minimal-agent-demo/CLAUDE.md)
  - [`examples/minimal-agent-demo/.claude/settings.json`](./examples/minimal-agent-demo/.claude/settings.json)
  - [`examples/minimal-agent-demo/.claude/commands`](./examples/minimal-agent-demo/.claude/commands/)

## 4. 最小验证路径

如果目标是验证这套材料是否能支撑新成员快速上手，推荐直接走以下路径：

1. 阅读根目录 [README.md](./README.md)，明确仓库分层和阅读顺序
2. 依次阅读第四到第六章，理解 Rules、MCP、Skills 分别解决什么问题
3. 进入 [`examples/minimal-agent-demo`](./examples/minimal-agent-demo/)，运行：

   ```bash
   npm test
   npm start
   ```

4. 对照以下文件，查看讲义内容如何落在真实项目中：
   - [`examples/minimal-agent-demo/CLAUDE.md`](./examples/minimal-agent-demo/CLAUDE.md)
   - [`examples/minimal-agent-demo/.claude/settings.json`](./examples/minimal-agent-demo/.claude/settings.json)
   - [`examples/minimal-agent-demo/.claude/commands/fix-bug.md`](./examples/minimal-agent-demo/.claude/commands/fix-bug.md)
   - [`examples/minimal-agent-demo/.claude/commands/gen-tests.md`](./examples/minimal-agent-demo/.claude/commands/gen-tests.md)
   - [`examples/minimal-agent-demo/.claude/commands/review-code.md`](./examples/minimal-agent-demo/.claude/commands/review-code.md)
5. 如果目标是团队落地，再继续阅读 [`08-production-governance`](./08-production-governance/) 和 [`09-team-workflow`](./09-team-workflow/)，把使用方法升级为治理机制
6. 最后从 [`appendix-case-studies`](./appendix-case-studies/) 里挑选案例做一次完整演练和复盘

## 5. 当前结论

- 这个仓库仍然以教学资料为主，不应被误读成业务应用仓库
- 目前已经具备“讲概念 + 给模板 + 给最小示例 + 给治理骨架 + 给案例模板”的基础形态
- 如果后续继续演进，最自然的方向是把附录中的案例逐步充实为可直接演练的完整实战包
