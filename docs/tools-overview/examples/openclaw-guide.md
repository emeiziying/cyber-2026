# OpenClaw 实战指南

> **本页适合：** 已了解 Claude Code 基本用法、希望把 AI 能力嵌入飞书等团队通讯工具的工程师或技术负责人

---

## OpenClaw 是什么

OpenClaw 不是"另一个 Claude Code"。它的形态完全不同：

**Claude Code** 是开发者在终端里召唤的工具——你打开终端，启动会话，完成任务，关闭。

**OpenClaw** 是在你的服务器上**常驻运行的 AI Agent 守护进程**，通过你团队已有的消息平台（飞书、钉钉、Slack、Telegram 等）与人交互。它不需要打开终端，它活在你的聊天软件里，7×24 等待被触发。

用一句话概括：

> **Claude Code 是你去找 AI；OpenClaw 是 AI 一直在旁边等你。**

---

## 三工具横向对比

| 维度 | Claude Code | Codex CLI | OpenClaw |
|------|-------------|-----------|----------|
| **运行方式** | 终端 CLI，按需启动 | 终端 CLI，按需启动 | 持久化守护进程，常驻 |
| **交互入口** | 终端 | 终端 | 飞书 / 钉钉 / Slack / 微信等 |
| **记忆** | 会话级（重启清零） | 会话级（重启清零） | 跨会话持久记忆 |
| **多 Agent** | 无 | 无 | 核心功能，多 Agent 并行 |
| **底层模型** | Claude | OpenAI | 任意（Claude / GPT / Llama…） |
| **配置核心文件** | `CLAUDE.md`（项目规范） | 类似机制 | `SOUL.md`（人格定义）|
| **初始配置成本** | 低（分钟级） | 低（分钟级） | 高（15–20 小时 DevOps） |
| **开源** | 否 | 是 | 是 |
| **适合场景** | 本地复杂代码任务 | 本地代码任务 | 团队机器人、跨工具自动化、持久化助理 |

### SOUL.md vs CLAUDE.md

两者都是"告诉 AI 它是谁"的配置文件，但侧重点不同：

| 文件 | 作用 | 类比 |
|------|------|------|
| `CLAUDE.md` | 项目规范、架构约定、禁止行为 | "在这个项目里你该做什么" |
| `SOUL.md` | 人格、价值观、沟通风格、记忆初始化 | "你是谁、你怎么和人说话" |

---

## 核心优势：多 Agent 架构

OpenClaw 最独特的能力是可以在同一个服务器上运行多个**完全隔离**的 Agent，每个 Agent 有：

- 独立的 `SOUL.md`（人格）
- 独立的工作区和会话记忆
- 独立的模型配置（一个用 Claude，另一个用 GPT-4）
- 独立的工具权限

不同 Agent 可以绑定不同的飞书群、频道或用户，各司其职：

```
飞书"前端技术群"  →  路由到  →  前端 Agent（擅长 React/TS）
飞书"运维告警群"  →  路由到  →  运维 Agent（有服务器读权限）
飞书"产品讨论群"  →  路由到  →  PM Agent（不接触代码库）
```

---

## 实际工作中如何使用

### 场景 1：飞书群内的 AI 助理

最常见的起点：在飞书某个技术群里部署一个 Agent，用于回答常见问题、提供技术参考。

```
工程师在飞书群 @AI助理：
"我在用 pnpm，为什么 node_modules 里的软链接在 Docker 里失效了？"

OpenClaw Agent 回复：
"这是 pnpm 的 symlink 在容器环境里的经典问题……
推荐方案：在 Dockerfile 中加 --shamefully-hoist……"
```

与直接问 Claude Web 的区别：Agent 有**项目记忆**，知道你们用什么框架、有什么已有约定，不需要每次重新交代背景。

---

### 场景 2：触发异步长任务

发消息触发，后台跑，完成后推送结果——适合不需要实时交互的批量工作。

```
在飞书发送：
"帮我把今天合并的所有 PR 整理成日报，发到 #每日同步 群"

OpenClaw 执行：
1. 调用 GitHub MCP 工具拉取今天的 PR 列表
2. 调用 Claude API 对每个 PR 生成一句话摘要
3. 格式化为日报模板
4. 在飞书 #每日同步 群发送，并 @ 相关负责人
（整个过程约 2 分钟，不需要你守着）
```

---

### 场景 3：编排 Claude Code / Codex 作为子工具

这是 OpenClaw 最有价值但也最需要配置的用法：**把 OpenClaw 作为总调度，Claude Code 和 Codex CLI 作为执行引擎**。

```
用户在飞书发送：
"帮我在 user-service 里加一个限流中间件，要有单测"

OpenClaw 主 Agent：
├── 调用 Claude Code → 分析 user-service 现有结构，生成中间件代码
├── 调用 Codex CLI → 生成配套单测
├── 审查两份输出（LLM 检查器）
└── 汇总结果：代码贴回飞书 + 开 GitHub Draft PR
```

这个模式的核心价值：**你不需要打开终端，也不需要切换工具**，在飞书里发一条消息就完成了跨工具协作。

---

### 场景 4：多 Agent 角色协作

适合有明确角色分工需求的团队。以一个需求从产品到开发的流转为例：

```
产品在飞书"需求讨论群"发送需求描述
    ↓
PM Agent 结构化需求，输出标准化需求卡片
    ↓
PM Agent 通知 Dev Agent（通过 AGENTS.md 定义的路由）
    ↓
Dev Agent 在"工程群"接收，拆分技术任务，推送到 GitHub Issues
    ↓
任务完成后，Dev Agent 通知 PM Agent 验收
```

---

### 场景 5：监控与自动提醒（飞书告警集成）

```
OpenClaw 定时任务（每 15 分钟）：
├── 读取线上错误日志（只读 MCP 权限）
├── 判断是否有新增异常模式
└── 有异常 → 飞书推送到告警群，附带初步分析
    无异常 → 静默
```

对比传统告警机器人：OpenClaw 的 Agent 不只是转发原始日志，而是会**初步分析**并给出可能原因——因为它有项目的代码上下文记忆。

---

## 飞书配置要点

OpenClaw 的飞书接入通过 `channels.feishu` 插件配置，关键字段：

```json
{
  "channels": {
    "feishu": {
      "appId": "cli_xxx",
      "appSecret": "xxx",
      "verificationToken": "xxx",
      "accounts": [
        {
          "id": "main",
          "routeTo": "agentId-frontend"
        }
      ]
    }
  }
}
```

消息路由规则：根据 `(channel, accountId, peer)` 三元组将飞书消息路由给指定 Agent，支持按群 ID 或用户 ID 精确路由。

**钉钉接入**（规划中）：OpenClaw 的插件架构支持扩展新平台，钉钉接入方式与飞书类似，配置完成后路由规则完全相同。

---

## 适合谁 / 不适合谁

**适合引入 OpenClaw 的团队：**

- 飞书/钉钉是主要协作工具，希望 AI 直接嵌入其中
- 有跨工具编排需求（AI 需要粘合 GitHub、监控、日历等多个系统）
- 有服务器运维能力（或 DevOps 工程师）
- 希望 AI 有持久记忆，不用每次重新交代背景
- 需要多个角色专用 Agent 并行运行

**暂时不适合的场景：**

- 只需要代码补全或本地代码库辅助 → 用 Claude Code 就够了
- 团队没有服务器运维能力 → 初始配置成本（15–20 小时）难以消化
- 需要立即上手 → Claude Code 分钟级可用，OpenClaw 需要数天配置
- 对安全合规要求极严格 → 见下方安全说明

---

## 安全注意事项

OpenClaw 是自托管开源项目，**安全维护责任在你的团队**，而非第三方。

2026 年初发现的 **CVE-2026-25253**（远程代码执行，CVSS 8.8）提醒我们：

- 部署前确认版本已包含该漏洞的修复
- 定期关注 OpenClaw GitHub 的 Security Advisories
- 生产环境部署需做网络隔离，限制 Agent 的执行权限
- 所有外部工具接入（GitHub、数据库等）使用最小权限原则

与 Claude Code 的对比：Claude Code 背后有 Anthropic 的安全团队持续维护；OpenClaw 的安全责任链更依赖社区和你的团队。

---

## 与 Claude Code 组合使用的推荐模式

不要把 OpenClaw 和 Claude Code 视为竞争关系：

| 场景 | 推荐工具 |
|------|----------|
| 深度代码任务（多文件重构、复杂 bug 排查） | Claude Code（直接在终端） |
| 触发式任务（消息驱动、异步执行） | OpenClaw |
| 跨系统自动化（需要粘合多个工具） | OpenClaw 编排 Claude Code |
| 团队共享 AI 能力（非工程师也能用） | OpenClaw（通过飞书） |
| 快速一次性代码问题 | Claude Code 或 Claude Web |

最成熟的形态：**OpenClaw 作为团队 AI 入口，Claude Code 作为代码执行引擎**，两者通过任务路由协作。

---

## 延伸资源

- [工具全景](../) — 回到主模块，了解完整工具选型框架
- [团队画像案例](./team-profiles) — 不同团队画像的工具组合推荐
- [Agent 开发](../../agent-development/) — 深入了解如何设计可靠的 Agent
- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [OpenClaw GitHub 仓库](https://github.com/openclaw/openclaw)
