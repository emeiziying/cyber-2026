# 第五章：MCP — 给 AI 装上"手和眼"

> **适合人群：** 工程师
> **学习目标：** 理解 MCP 协议，能接入官方 MCP Server，了解自定义扩展的可能性

---

## 5.1 为什么需要 MCP？

**没有 MCP 时的 AI：**
- 只能"看"文本，不能真正"操作"外部系统
- 查 GitHub Issue 要手动粘贴
- 查数据库要手动执行 SQL 然后粘贴结果
- 每次都需要人类作为"中转站"

**有了 MCP 之后：**
```
你：帮我看一下 Issue #42 说的是什么问题，然后在代码里找到相关逻辑

AI：（自动调用 GitHub MCP 读取 Issue）
    → 读到：Issue 描述的是用户登录后 token 刷新失败的问题
    → （搜索代码库中的 token refresh 逻辑）
    → 找到了 src/auth/token.service.ts:87，这里有个逻辑bug...
```

---

## 5.2 MCP 是什么？

**Model Context Protocol（模型上下文协议）** — Anthropic 于 2024 年开源的标准化协议，定义了 AI 模型与外部工具之间的通信方式。

### 核心概念

```
┌─────────────────────────────────────────────────┐
│                   MCP 三要素                     │
├─────────────┬──────────────┬────────────────────┤
│   Tools     │  Resources   │     Prompts        │
│  （工具）   │  （资源）    │   （提示模板）      │
├─────────────┼──────────────┼────────────────────┤
│ AI 可以调用 │ AI 可以读取  │ 预定义的交互模板   │
│ 的函数      │ 的数据源     │                    │
│             │              │                    │
│ 如：        │ 如：         │ 如：               │
│ create_pr   │ 文件系统     │ /code-review       │
│ run_query   │ 数据库表     │ /write-test        │
│ send_slack  │ API 文档     │                    │
└─────────────┴──────────────┴────────────────────┘
```

### 工作原理
```
Claude Code ←──── MCP 协议 (JSON-RPC) ────→ MCP Server
     │                                            │
  描述需求                                   连接外部系统
  接收结果                                   (GitHub/DB/...)
```

---

## 5.3 常用 MCP Server 生态

| 分类 | MCP Server | 能力 |
|------|-----------|------|
| **代码托管** | GitHub MCP | 读写 Issue、PR、代码、分支 |
| **数据库** | PostgreSQL MCP | 查询、执行 SQL、获取 Schema |
| **文件系统** | Filesystem MCP | 读写本地文件（超出项目目录） |
| **浏览器** | Puppeteer MCP | 网页截图、自动化操作 |
| **搜索** | Brave Search MCP | 网络搜索 |
| **通知** | Slack MCP | 发送消息、读取频道 |
| **时间** | Time MCP | 获取当前时间、时区转换 |

---

## 5.4 配置 MCP Server

### Claude Code 配置文件位置
```
~/.claude/settings.json          # 全局配置
项目根目录/.claude/settings.json  # 项目级配置（推荐提交到 git）
```

### 配置示例（见 templates/mcp-config.json）

**快速启用 GitHub MCP：**
```bash
# 方式1：使用 claude mcp add 命令
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here \
  -- npx -y @modelcontextprotocol/server-github

# 方式2：直接编辑配置文件（见 templates/mcp-config.json）
```

**最小示例参考：**

- [`templates/mcp-config.json`](./templates/mcp-config.json) — 通用模板
- [`../examples/minimal-agent-demo/.claude/settings.json`](../examples/minimal-agent-demo/.claude/settings.json) — 项目级示例，展示如何把 `filesystem` 和 `github` MCP 放进真实目录结构中

---

## 5.5 实战：GitHub MCP 接入

**前置条件：** 准备一个 GitHub Personal Access Token（需要 repo 权限）

**步骤：**

1. 生成 Token：GitHub Settings → Developer settings → Personal access tokens
2. 配置 MCP（参考 `templates/mcp-config.json`）
3. 验证连接：
   ```
   你：列出这个 repo 最近 5 个 open 的 Issue
   AI：（调用 GitHub MCP，自动列出）
   ```

如果你希望先在一个最小仓库里练习配置，可以直接进入 [`../examples/minimal-agent-demo`](../examples/minimal-agent-demo/) 查看 `.claude/settings.json`，先理解目录位置和配置方式，再替换成你自己的 Token 与路径。

**常用指令示例：**
```
# Issue 管理
"帮我总结 Issue #123 的讨论内容，以及目前的进展"
"找出所有带 bug 标签、超过 7 天未更新的 Issue"

# PR 操作
"Review 这个 PR，重点看安全漏洞和性能问题"
"为我刚完成的功能自动生成 PR 描述"

# 代码搜索
"在这个 repo 里找所有使用了废弃 API xxx 的地方"
```

---

## 5.6 自定义 MCP Server（进阶）

当官方 MCP Server 无法满足需求时，可以开发内部 MCP Server 对接公司系统：

```typescript
// 一个最简单的 MCP Server 示例（Node.js）
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "my-company-mcp", version: "1.0.0" });

// 注册一个工具
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "query_internal_db",
    description: "查询公司内部数据库",
    inputSchema: {
      type: "object",
      properties: {
        sql: { type: "string", description: "SQL 查询语句（只读）" }
      }
    }
  }]
}));

// 处理工具调用
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "query_internal_db") {
    const result = await db.query(request.params.arguments.sql);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
});

// 启动
const transport = new StdioServerTransport();
await server.connect(transport);
```

**可以对接的内部系统：**
- 公司内部 API 文档系统
- 监控/告警平台
- 内部工单系统
- 部署平台

---

## 5.7 MCP 安全注意事项

- **最小权限原则：** Token 只授予必要的权限
- **项目级配置：** 敏感 Token 用环境变量，不要硬编码在配置文件里
- **注意 Prompt Injection：** MCP 返回的外部数据可能包含恶意指令
- **只读优先：** 非必要不授予写权限

```bash
# 推荐：Token 放在环境变量，不要放在配置文件
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
```

---

## 完成检查清单

- [ ] 能解释 MCP 的工作原理和三要素（Tools/Resources/Prompts）
- [ ] 成功配置并使用了至少一个官方 MCP Server
- [ ] 了解自定义 MCP Server 的基本结构
- [ ] 知道 MCP 使用中的安全注意事项

---

**上一章 ←** [第四章：Rules](../04-rules/)
**下一章 →** [第六章：Skills & Hooks](../06-skills-hooks/)
