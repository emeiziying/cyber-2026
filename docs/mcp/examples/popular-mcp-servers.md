# MCP 热门开源项目

> 本页汇总 2026 年社区里最常被拿来做入门选型的 MCP Server，帮助团队在"先只读，再逐步放开"原则下快速判断。许可证并不完全相同，以各仓库 LICENSE 为准；例如 Playwright MCP 当前为 Apache-2.0。另需注意：GitHub 和 Brave Search 已有各自独立维护的官方实现，而 PostgreSQL 官方 reference server 已归档。

---

## 选型导图

MCP Server 可以分为两类，建议按顺序接入：

| 类型 | 项目 | 接入时机 |
|------|------|----------|
| **基础设施类** | Filesystem、GitHub MCP、Memory | 第一批接入，低风险，效果立竿见影 |
| **能力增强类** | Context7、Brave Search、Playwright、数据库读取类 MCP | 基础类稳定后，按需接入 |

**原则：** 不要一次接七个。每次接一个，验证 AI 是否能正确使用、权限是否清晰、上下文传递是否完整。

---

## 各项目详解

### Context7 ⭐ 2026 年最受欢迎

**一句话定位：** 自动注入版本匹配的最新官方文档，让 AI 不再靠过时的训练数据猜测 API。

**为什么重要：**  
AI 训练数据有截止日期。当你问 Claude 如何使用 Next.js 15 的某个 API，它很可能会把 Next.js 13 的写法告诉你。Context7 的价值在于：当你在 prompt 里明确写出库名、版本，或者直接提供 library ID 时，它可以去匹配对应版本的文档并注入上下文。

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

配置好之后，在 prompt 中加入 `use context7` 即可触发文档注入；如果版本很关键，建议直接写在问题里：

```text
用 Pydantic v2 写一个带有嵌套模型的数据验证类，use context7
```

**仓库：** [github.com/upstash/context7](https://github.com/upstash/context7)

---

### GitHub MCP Server — 官方实现

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

**推荐配置策略：** 先只开放读取类权限，让团队观察 AI 使用 GitHub 信息的方式，确认稳定后再按需放开写权限。官方实现已经支持 `read-only` 模式和 `toolsets` 白名单，适合做最小接入。

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "-e",
        "GITHUB_READ_ONLY",
        "-e",
        "GITHUB_TOOLSETS",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>",
        "GITHUB_READ_ONLY": "1",
        "GITHUB_TOOLSETS": "repos,issues,pull_requests,users"
      }
    }
  }
}
```

**仓库：** [github.com/github/github-mcp-server](https://github.com/github/github-mcp-server)

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
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": {
        "BRAVE_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

**仓库：** [github.com/brave/brave-search-mcp-server](https://github.com/brave/brave-search-mcp-server)

---

### Memory — 跨会话持久记忆

**一句话定位：** 知识图谱式持久记忆系统，让 AI 跨会话记住项目决策和上下文。

**核心价值：**  
Claude Code 每次会话结束即清空记忆，下次需要重新交代背景。Memory MCP 让 AI 可以在对话中主动存储重要信息（架构决策、已知问题、团队约定），下次对话时自动检索。

**使用场景：**
- 记录架构决策（为什么选了 X 而不是 Y）
- 记录已知的坑（某个 API 有什么注意事项）
- 记录团队约定（超出 AGENTS.md 的临时性约定）

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

### 数据库读取类 MCP —— 优先选维护中的实现

**一句话定位：** 让 AI 读取 schema 或执行只读 SQL 做分析，但数据库类实现变化很快，接入前要先确认维护状态。

**使用场景：**
- 让 AI 读取真实数据验证业务逻辑
- 数据分析和报表生成
- 让 AI 理解数据库 schema，辅助 SQL 编写

**现状提醒：**
- MCP 官方 `servers` 仓库里的 PostgreSQL reference server 已归档，更适合作为历史参考，不适合作为今天团队默认照抄的模板
- 更稳妥的做法是优先选数据库厂商或活跃社区仍在维护的实现，例如托管 Postgres 场景里的 Neon MCP
- 无论选哪种实现，都应优先使用只读账号或只读副本，而不是把可写连接直接交给 AI

下面这个骨架故意不再写死旧的包名；真实项目里，应把它替换成你选定的维护中实现：

```json
{
  "mcpServers": {
    "database": {
      "command": "<your-maintained-database-mcp-server>",
      "args": ["<host-specific-args>"],
      "env": {
        "DATABASE_URL": "${READ_ONLY_DATABASE_URL}"
      }
    }
  }
}
```

**参考入口：**
- [github.com/neondatabase/mcp-server-neon](https://github.com/neondatabase/mcp-server-neon) — 托管 Postgres 的官方代表实现
- [MCP Registry](https://mcp.directory) — 查找仍在维护的数据库类 MCP Server

---

## 推荐组合

根据团队阶段选择最小可用组合，不要一次全部接入：

### 入门组合（第 1–2 周）

```text
Filesystem（只读 docs/）+ GitHub MCP（只读）+ Context7
```

验证 AI 是否能有效利用上下文，接入成本低，风险几乎为零。

### 标准组合（第 3–4 周）

在入门组合基础上加：

```text
+ Brave Search + Memory
```

覆盖"外部信息查询"和"跨会话记忆"两个常见需求。

### 完整组合（稳定后按需）

在标准组合基础上，按团队实际需求选择：

```text
+ Playwright（需要 QA 自动化时）
+ 数据库只读 MCP（需要数据分析时）
+ GitHub 写权限（已充分验证后）
```

---

## 社区资源

- [awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) — 社区维护的 MCP Server 精选列表，按类别组织
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — Anthropic 官方参考实现合集
- [mcp.directory](https://mcp.directory) — MCP Server 搜索与发现平台
- [mcpservers.org](https://mcpservers.org) — 社区 MCP 目录
