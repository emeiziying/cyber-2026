# Cyber 2026

**赛博飞升方法论** — 帮助团队从基础 AI 工具使用过渡到稳定的生产级 AI 集成的文档站。

## 本地开发

```bash
pnpm install
pnpm docs:dev
```

| 命令 | 说明 |
|------|------|
| `pnpm docs:dev` | 启动本地开发服务器（热重载，端口 5173） |
| `pnpm docs:build` | 构建静态站点到 `.vitepress/dist/` |
| `pnpm docs:preview` | 本地预览构建产物 |

## 内容结构

文档站按以下学习路径组织：

**认知与协作方式**
- [`docs/paradigm-shift/`](./docs/paradigm-shift/) — 范式转变：理解 AI 如何改变工作方式
- [`docs/vibe-coding/`](./docs/vibe-coding/) — Vibe Coding：与 AI 协作的会话模式
- [`docs/tools-overview/`](./docs/tools-overview/) — 工具全景：工具选型框架

**能力构建**
- [`docs/rules/`](./docs/rules/) — Rules：为 AI 设置项目级约束
- [`docs/mcp/`](./docs/mcp/) — MCP：外部工具接入（Model Context Protocol）
- [`docs/skills-hooks/`](./docs/skills-hooks/) — Skills & Hooks：自动化工作流
- [`docs/agent-development/`](./docs/agent-development/) — Agent 开发：边界与决策

**治理与团队化**
- [`docs/production-governance/`](./docs/production-governance/) — 生产落地与治理
- [`docs/team-workflow/`](./docs/team-workflow/) — 团队工作流与质量控制

**资料**
- [`docs/appendix-case-studies/`](./docs/appendix-case-studies/) — 案例与延伸阅读
- [`docs/presentation-outlines/`](./docs/presentation-outlines/) — 分享与培训资料
- [`docs/downloads/`](./docs/downloads/) — 下载资源索引

## 仓库结构

```
├── .vitepress/config.mts       # 站点配置（导航、侧边栏）
├── docs/                       # 站点正文唯一来源
│   └── public/downloads/       # 静态资源（手工维护，直接提交）
├── package.json
└── CLAUDE.md                   # AI 助手行为规范
```

## 阅读入口

- 首页：[`docs/index.md`](./docs/index.md)
- 开始阅读：[`docs/intro/index.md`](./docs/intro/index.md)
- 内容地图：[`docs/project-overview/index.md`](./docs/project-overview/index.md)

## 贡献

- 正文内容只存放在 `docs/` 目录下
- 可下载资源在 `docs/public/downloads/` 手工维护并直接提交
- 新增页面需同步更新 `.vitepress/config.mts` 的侧边栏配置
- AI 助手协作规范见 [`CLAUDE.md`](./CLAUDE.md)
