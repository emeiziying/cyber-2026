# MCP 热门开源项目

> 本页汇总 2026 年社区中最受欢迎的开源 MCP Server，帮助团队在"先只读，再逐步放开"原则下快速选型。所有项目均为 MIT 开源协议。

---

## 选型导图

MCP Server 可以分为四类，建议按顺序接入：

| 类型 | 项目 | 接入时机 |
|------|------|----------|
| **基础设施类** | Filesystem、GitHub MCP、Memory | 第一批接入，低风险，效果立竿见影 |
| **能力增强类** | Context7、Brave Search、Playwright、PostgreSQL | 基础类稳定后，按需接入 |
| **协作工具类** | Slack、Notion、Linear | 团队协作场景成熟后，按需接入 |
| **专项能力类** | Stripe、Docker、Google Drive | 特定业务需求驱动，精准接入 |

**原则：** 不要一次接七个。每次接一个，验证 AI 是否能正确使用、权限是否清晰、上下文传递是否完整。

---

## 各项目详解

### Context7 ⭐ 2026 年最受欢迎

**一句话定位：** 自动注入版本匹配的最新官方文档，让 AI 不再靠过时的训练数据猜测 API。

**为什么重要：**  
AI 训练数据有截止日期。当你问 Claude 如何使用 Next.js 15 的某个 API，它很可能会把 Next.js 13 的写法告诉你。Context7 会在对话时自动检测你用的框架版本，从官方源拉取对应版本的文档注入上下文。

**使用场景：**
- 使用任何版本迭代较快的框架（Next.js、React、Pydantic、FastAPI……）
- 迁移到新版本时，让 AI 学习新 API 而非靠旧知识
- 减少"AI 给了能跑但不是推荐写法"的情况

**权限风险：** 无（只读，从官方文档源拉取，无写操作）

**使用方式：**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

配置好之后，在 prompt 中加入 `use context7` 即可触发文档注入：

```
用 Pydantic v2 写一个带有嵌套模型的数据验证类，use context7
```

**仓库：** [github.com/upstash/context7](https://github.com/upstash/context7)

---

### GitHub MCP Server — 官方推荐

**一句话定位：** 最完整的 GitHub 仓库交互接口，支持 issue、PR、代码搜索等。

**核心能力：**

| 能力 | 风险级别 | 推荐先开放 |
|------|----------|-----------|
| 读取 issue / PR / 评论 | 无 | ✅ 是 |
| 搜索代码库 | 无 | ✅ 是 |
| 读取文件内容 | 无 | ✅ 是 |
| 创建 issue / comment | 低 | 验证后开放 |
| 创建分支 / PR | 中 | 审慎开放 |
| 合并 PR | 高 | 通常保留人工操作 |

**推荐配置策略：** 先只开放读取类权限，让团队观察 AI 使用 GitHub 信息的方式，确认稳定后再按需放开写权限。

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>"
      }
    }
  }
}
```

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/github)

---

### Filesystem — 官方参考实现

**一句话定位：** 最简单的本地文件读写，给 AI 访问指定目录的能力，无需手工粘贴内容。

**使用场景：**
- 让 AI 读取 `docs/` 目录了解项目文档
- 让 AI 读取 `logs/` 做错误分析
- 让 AI 读取配置文件核实当前设置

**关键配置：** 必须显式声明允许访问的目录，AI 无法访问声明外的路径。

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/project/docs",
        "/home/user/project/logs"
      ]
    }
  }
}
```

**注意：** 不要把整个 home 目录或代码仓库根目录加进去，最小化可访问范围是基本原则。

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)

---

### Brave Search — 网络搜索

**一句话定位：** 让 AI 可以实时搜索网络，获取训练数据截止日期之后的最新信息。

**使用场景：**
- 调研技术选型时，查找最新的社区评价和已知问题
- 查找某个库的最新版本和 breaking changes
- 让 AI 搜索特定错误信息的解决方案

**权限风险：** 无（只读查询，无写操作），需要 Brave Search API Key（免费额度每月 2000 次请求）。

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)

---

### Memory — 跨会话持久记忆

**一句话定位：** 知识图谱式持久记忆系统，让 AI 跨会话记住项目决策和上下文。

**核心价值：**  
Claude Code 每次会话结束即清空记忆，下次需要重新交代背景。Memory MCP 让 AI 可以在对话中主动存储重要信息（架构决策、已知问题、团队约定），下次对话时自动检索。

**使用场景：**
- 记录架构决策（为什么选了 X 而不是 Y）
- 记录已知的坑（某个 API 有什么注意事项）
- 记录团队约定（超出 CLAUDE.md 的临时性约定）

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)

---

### Playwright — 无头浏览器控制

**一句话定位：** 让 AI 控制浏览器，用于端到端测试、界面验证和网页内容提取。

**使用场景：**
- 配合 gstack `/qa` 做界面自动化测试
- 截图验证 UI 改动效果
- 提取需要登录才能访问的网页内容

**权限风险：** 中（AI 可以控制浏览器，包括点击、填表、导航），建议明确 AI 允许访问的域名范围。

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**仓库：** [github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)

---

### PostgreSQL — 数据库只读查询

**一句话定位：** 让 AI 直接查询数据库做分析，无写权限。

**使用场景：**
- 让 AI 读取真实数据验证业务逻辑
- 数据分析和报表生成
- 让 AI 理解数据库 schema，辅助 SQL 编写

**⚠️ 重要：** 务必使用只读数据库账号，不要把有写权限的连接字符串配给 AI。建议使用生产库的只读副本，而非直连生产主库。

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://readonly_user:password@localhost/mydb"
      ]
    }
  }
}
```

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)

---

### Slack MCP — 团队沟通集成

**一句话定位：** 让 AI 读取频道消息和发送通知，打通工程任务与团队沟通。

**使用场景：**
- 在 CI 流水线异常时，让 AI 自动在对应频道发送摘要通知
- 让 AI 查找特定频道中的决策记录和讨论上下文
- 配合 Hooks 在代码合并后自动发送发布说明到 Slack

**权限风险：** 中（可发送消息，建议先只开放读取权限，写入权限需要团队评审后放开）

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "<your-bot-token>",
        "SLACK_TEAM_ID": "<your-team-id>"
      }
    }
  }
}
```

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)

---

### Notion MCP — 知识库读写

**一句话定位：** 让 AI 访问 Notion 页面和数据库，读取需求文档或写入结构化内容。

**为什么重要：**  
大量团队把需求、设计稿、会议记录存放在 Notion。没有 MCP 时，AI 对这些上下文一无所知，只能靠人工粘贴。Notion MCP 让 AI 可以直接读取指定页面，在任务中自动获取背景信息。

**使用场景：**
- 让 AI 读取需求文档，直接按文档内容实现功能
- 让 AI 将代码审查结论写入 Notion 追踪表
- 生成技术文档后自动推送到知识库

**权限风险：** 中（需要 Notion Integration Token，建议按最小权限原则只授权必要的 workspace 和 page）

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_TOKEN": "<your-integration-token>"
      }
    }
  }
}
```

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/notion)

---

### Linear MCP — 工程任务追踪

**一句话定位：** 让 AI 读写 Linear issue，实现"代码改动自动关联任务"的闭环。

**核心价值：**  
工程师在修复 bug 时，AI 可以自动读取关联 issue 的上下文（复现步骤、期望行为、优先级），而不是凭空猜测需求。完成后 AI 还可以将修复说明写回 issue，无需人工同步。

**使用场景：**
- 修复 bug 时让 AI 读取对应 issue，理解验收标准
- 需求开发完成后自动更新 Linear issue 状态
- 让 AI 生成本次迭代的变更摘要，写入 Linear 项目文档

**权限风险：** 低到中（读取无风险；写入建议只开放 comment 和状态更新，不开放删除操作）

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "linear-mcp-server"],
      "env": {
        "LINEAR_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

**仓库：** [github.com/jerhadf/linear-mcp-server](https://github.com/jerhadf/linear-mcp-server)

---

### Stripe MCP — 支付数据查询

**一句话定位：** 让 AI 安全查询支付流水和客户数据，辅助排查订单问题或生成财务报告。

**使用场景：**
- 让 AI 查找某笔失败订单的原因（无需进入 Stripe Dashboard）
- 生成某时间段的收款摘要报告
- 辅助排查 Webhook 未正确触发的问题

**⚠️ 重要：** 只使用受限权限的 API Key（Restricted Key），不要使用 Secret Key。只授权必要的只读权限（`charges:read`、`customers:read` 等），绝不授权写入或退款权限。

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/agent-toolkit"],
      "env": {
        "STRIPE_SECRET_KEY": "<your-restricted-key>"
      }
    }
  }
}
```

**仓库：** [github.com/stripe/agent-toolkit](https://github.com/stripe/agent-toolkit)

---

### Docker MCP Toolkit — 容器与镜像管理

**一句话定位：** Docker 官方出品的 MCP 工具集，让 AI 查看和管理本地容器、镜像与 Compose 服务。

**核心能力：**
- 列出和检查运行中的容器状态
- 读取容器日志（排查问题时极为有效）
- 执行 Docker Compose 操作（启动、停止、重建服务）

**使用场景：**
- 让 AI 读取出错容器的日志，直接定位问题
- 本地开发环境出现服务异常时，让 AI 检查容器健康状态
- 配合 Hooks 在测试前自动拉起依赖服务

**权限风险：** 高（AI 可以停止或删除容器），建议只在本地开发环境使用，不要在生产环境节点上配置。

```json
{
  "mcpServers": {
    "docker": {
      "command": "docker",
      "args": ["mcp", "gateway", "run"],
      "env": {}
    }
  }
}
```

**仓库：** [github.com/docker/mcp-servers](https://github.com/docker/mcp-servers)

---

### Google Drive MCP — 文件读写与搜索

**一句话定位：** 让 AI 搜索和读取 Google Drive 中的文档、表格和演示文稿。

**使用场景：**
- 让 AI 读取 Google Docs 中的需求文档或设计说明
- 搜索 Drive 中的历史记录（会议纪要、上线说明）
- 将 AI 生成的报告写入 Google Sheets

**权限风险：** 中（需要 Google OAuth 授权，建议只授权"只读"范围，写入权限按需单独评审）

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"]
    }
  }
}
```

首次运行会打开浏览器进行 Google 账号授权，授权信息缓存在本地。

**仓库：** [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive)

---

## 推荐组合

根据团队阶段选择最小可用组合，不要一次全部接入：

### 入门组合（第 1–2 周）

```
Filesystem（只读 docs/）+ GitHub MCP（只读）+ Context7
```

验证 AI 是否能有效利用上下文，接入成本低，风险几乎为零。

### 标准组合（第 3–4 周）

在入门组合基础上加：

```
+ Brave Search + Memory
```

覆盖"外部信息查询"和"跨会话记忆"两个常见需求。

### 完整组合（稳定后按需）

在标准组合基础上，按团队实际需求选择：

```
+ Playwright（需要 QA 自动化时）
+ PostgreSQL 只读（需要数据分析时）
+ GitHub 写权限（已充分验证后）
+ Slack（需要打通团队通知时）
+ Notion / Linear（需要集成协作工具时）
+ Stripe 受限只读（有支付业务排查需求时）
+ Docker（本地开发调试容器问题时）
```

**原则：** 接入协作工具类（Slack、Notion、Linear）时，先评估"AI 是否有必要触达这些平台"，避免因配置不当造成意外消息发送或数据泄露。

---

## 社区资源

- [awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) — 社区维护的 MCP Server 精选列表，按类别组织
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — Anthropic 官方参考实现合集
- [mcp.directory](https://mcp.directory) — MCP Server 搜索与发现平台
- [mcpservers.org](https://mcpservers.org) — 社区 MCP 目录
