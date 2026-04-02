# Cyber 2026 — AI 助手规则

## 项目背景

这是 **Cyber 2026** 文档站的源码仓库，内容围绕"赛博飞升方法论"组织，帮助团队从基础 AI 工具使用过渡到稳定的生产级 AI 集成。

站点使用 VitePress 构建，全部内容以中文（简体）编写，面向希望将 AI 工具系统化、规范化引入团队工作流的技术和非技术读者。

---

## 技术栈

- **静态站点生成器：** VitePress 2.0.0-alpha.17
- **语言：** Markdown（文档内容）+ TypeScript（站点配置）
- **包管理器：** pnpm 10.32.1
- **Node.js：** 20+
- **配置文件：** `.vitepress/config.mts`（TypeScript 模块格式）

---

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动本地开发服务器（热重载，默认端口 5173）
pnpm docs:dev

# 构建静态站点（输出到 .vitepress/dist/）
pnpm docs:build

# 预览构建产物
pnpm docs:preview
```

---

## 目录结构

```
/
├── .vitepress/
│   └── config.mts              # VitePress 站点配置（导航、侧边栏、语言）
├── docs/                       # 站点正文内容（唯一来源）
│   ├── index.md                # 首页（hero + 功能介绍）
│   ├── intro/index.md          # 开始阅读入口
│   ├── project-overview/       # 内容地图
│   ├── paradigm-shift/         # 模块1：范式转变
│   │   └── examples/
│   ├── vibe-coding/            # 模块2：Vibe Coding 协作方式
│   │   └── examples/
│   ├── tools-overview/         # 模块3：工具全景
│   │   └── examples/
│   ├── rules/                  # 模块4：Rules（项目约束）
│   │   └── examples/
│   ├── mcp/                    # 模块5：MCP 外部工具接入
│   │   └── examples/
│   ├── skills-hooks/           # 模块6：Skills & Hooks 自动化
│   │   └── examples/
│   ├── agent-development/      # 模块7：Agent 开发与边界
│   │   └── examples/
│   ├── production-governance/  # 模块8：生产落地与治理
│   │   └── examples/
│   ├── team-workflow/          # 模块9：团队工作流与质量控制
│   │   └── examples/
│   ├── appendix-case-studies/  # 案例与延伸阅读
│   ├── presentation-outlines/  # 分享与培训资料
│   ├── downloads/              # 下载资源索引页
│   ├── examples/
│   │   └── minimal-agent-demo/ # 最小 Agent 示例项目（文档页）
│   └── public/downloads/       # 静态资源（手工维护，直接发布）
│       ├── rules/templates/
│       ├── mcp/templates/
│       ├── skills-hooks/templates/
│       ├── production-governance/templates/
│       ├── team-workflow/templates/
│       ├── appendix-case-studies/templates/
│       ├── presentation-outlines/
│       └── examples/minimal-agent-demo/ # 完整示例项目源码
├── package.json
├── pnpm-lock.yaml
├── README.md
└── .gitignore
```

---

## 内容规范

### 文件命名
- 所有文件和目录使用 `kebab-case`（如 `agent-development/`、`tools-overview.md`）
- 每个学习模块的主文档固定命名为 `index.md`
- 示例文档放在对应模块的 `examples/` 子目录下

### Markdown 内容约定
- **语言：** 全站中文（简体），不要混用英文句子
- **大纲层级：** 使用 H2（`##`）和 H3（`###`），VitePress 只渲染这两级大纲
- **Front matter：** 在需要覆盖标题或控制大纲时添加，否则不需要
- **内部链接：** 使用相对路径并省略 `.md` 后缀（VitePress cleanUrls 已启用）
- **代码块：** 始终标注语言（如 ` ```bash`、` ```typescript`）

### 内容结构模式
每个学习模块的 `index.md` 建议按以下顺序组织：
1. 这解决什么问题（痛点）
2. 为什么重要
3. 核心概念说明
4. 使用边界（什么情况下用/不用）
5. 场景示例

### 导航与侧边栏
侧边栏结构在 `.vitepress/config.mts` 中维护。新增页面时：
1. 在 `docs/` 下创建对应的 Markdown 文件
2. 在 `config.mts` 的 `sidebar` 数组中添加对应条目
3. 确保 `link` 路径与文件路径一致（相对于 `docs/` 且无后缀）

---

## 下载资源管理

`docs/public/downloads/` 是站点直接发布的静态目录，需要**手工维护并直接提交**：
- 模板文件（`.md.template`、`.json.template` 等）
- PPT 文件（`.pptx`）
- 压缩包（`.tar.gz`）
- 示例项目源码（`examples/minimal-agent-demo/`）

修改示例项目代码时，需要同步更新：
- `docs/examples/minimal-agent-demo/`（文档页）
- `docs/public/downloads/examples/minimal-agent-demo/`（可下载源码）

---

## Git 工作流

### 提交信息格式
```
type: 简短描述（中文或英文均可）
```

常用 type：
- `feat:` — 新增内容或功能
- `docs:` — 文档更新
- `refactor:` — 重组结构，不改变内容
- `fix:` — 修正错误

### 分支规范
- 主分支：`main`
- 功能分支：`claude/[task-id]` 或 `[author]/[feature-name]`
- 通过 PR 合并到 main

---

## 行为规范

### 编辑文档时
- 修改现有页面内容前，先通读该页面，理解上下文再修改，不要孤立地改某一段
- 新增学习模块时，同步在 `.vitepress/config.mts` 的 sidebar 里添加导航条目
- 添加可下载资源时，同步更新 `docs/downloads/index.md` 的下载列表

### 修改站点配置时
- `config.mts` 使用 TypeScript，修改后确认语法正确（`pnpm docs:build` 会验证）
- sidebar 的 `link` 字段必须与实际文件路径严格对应，否则会出现 404

### 处理示例项目时
- `docs/public/downloads/examples/minimal-agent-demo/` 有自己的 `CLAUDE.md`，在该目录下工作时以该文件的规范为准

---

## 禁止行为

- 不要将 `.vitepress/dist/`（构建产物）或 `.vitepress/cache/` 提交到 Git
- 不要将 `node_modules/` 提交到 Git
- 不要在 `docs/` 以外的位置存放站点正文内容
- 不要修改 `docs/public/downloads/` 中的文件后忘记同步对应的文档页
- 不要在 sidebar 中添加没有对应文件的链接（会导致构建警告或 404）

---

## 当前开发重点

- 分支 `claude/add-claude-documentation-dcABT`：补充项目文档和 AI 助手规则
- 站点核心学习路径（9 个模块）已基本成型，重点在完善示例和案例
