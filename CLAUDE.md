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

# 校验文档链接与下载资源路径
pnpm docs:check

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
│   └── config.mts                # VitePress 站点配置（导航、侧边栏、语言）
├── docs/                         # 站点正文内容（唯一来源）
│   ├── index.md                  # 首页（hero + 功能介绍）
│   ├── intro/index.md            # 开始阅读入口
│   ├── paradigm-shift/           # 模块1：范式转变
│   │   ├── index.md
│   │   └── examples/role-impact-scenarios.md
│   ├── vibe-coding/              # 模块2：Vibe Coding 协作方式
│   │   ├── index.md
│   │   └── examples/full-session.md
│   ├── tools-overview/           # 模块3：工具全景
│   │   ├── index.md
│   │   └── examples/team-profiles.md
│   ├── rules/                    # 模块4：Rules（项目约束）
│   │   ├── index.md
│   │   └── examples/rules-conflict-case.md
│   ├── mcp/                      # 模块5：MCP 外部工具接入
│   │   ├── index.md
│   │   └── examples/mcp-readonly-rollout.md
│   ├── skills-hooks/             # 模块6：Skills & Hooks 自动化
│   │   ├── index.md
│   │   ├── advanced-patterns.md  # 进阶模式（独立页面）
│   │   └── examples/
│   │       ├── skill-hook-decision-cases.md
│   │       └── dept-skill-sharing.md
│   ├── agent-development/        # 模块7：Agent 开发与边界
│   │   ├── index.md
│   │   └── examples/review-agent-walkthrough.md
│   ├── harness-engineering/      # 模块10：Harness Engineering（能力构建综合）
│   │   ├── index.md
│   │   └── examples/harness-design-case.md
│   ├── production-governance/    # 模块8：生产落地与治理
│   │   ├── index.md
│   │   └── examples/release-risk-review.md
│   ├── team-workflow/            # 模块9：团队工作流与质量控制
│   │   ├── index.md
│   │   └── examples/workflow-sample.md
│   ├── appendix-case-studies/    # 案例与延伸阅读
│   │   ├── index.md
│   │   ├── cross-functional-ai-handbook.md  # 跨角色 AI 手册
│   │   └── examples/fix-search-bug-case.md
│   ├── presentation-outlines/    # 分享与培训资料
│   │   ├── index.md
│   │   └── 30min-cross-functional-ai-workshop.md
│   ├── downloads/index.md        # 下载资源索引页
│   ├── examples/
│   │   └── minimal-agent-demo/index.md  # 最小 Agent 示例项目（文档页）
│   └── public/downloads/         # 静态资源（手工维护，直接发布）
│       ├── rules/templates/      # CLAUDE.md 模板
│       ├── mcp/templates/        # MCP 配置模板
│       ├── skills-hooks/templates/  # Skill 命令与 Hook 配置模板
│       ├── production-governance/templates/  # 风险矩阵、验收清单模板
│       ├── team-workflow/templates/  # PR 检查清单、需求模板
│       ├── appendix-case-studies/templates/  # 案例模板
│       ├── harness-engineering/templates/    # Harness 建设检查清单模板
│       ├── presentation-outlines/   # PPT 文件及生成脚本
│       └── examples/minimal-agent-demo/  # 完整示例项目源码（含 CLAUDE.md）
├── scripts/
│   └── check-doc-links.mjs       # 文档内链校验脚本
├── .github/
│   └── workflows/
│       └── docs-check.yml        # CI：校验链接 + 构建验证（PR & push to main）
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
- **排除规则：** `public/downloads/` 下的 `.md` 文件已通过 `srcExclude` 排除构建，不会被 VitePress 当作页面处理

### 内容结构模式
每个学习模块的 `index.md` 建议按以下顺序组织：
1. 这解决什么问题（痛点）
2. 为什么重要
3. 核心概念说明
4. 使用边界（什么情况下用/不用）
5. 场景示例

### 导航与侧边栏
侧边栏结构在 `.vitepress/config.mts` 中维护。当前侧边栏分为四大区块：
- **导读**（开始阅读）
- **学习主线**（9 个模块，按"认知与协作方式 → 能力构建 → 治理与团队化"三层嵌套）
- **案例与演练**（附录、跨角色手册、实战案例、Minimal Agent Demo）
- **资料与分享**（培训资料、Workshop、下载资源）

新增页面时：
1. 在 `docs/` 下创建对应的 Markdown 文件
2. 在 `config.mts` 的 `sidebar` 数组中添加对应条目（示例页嵌套在其模块的 `items` 内）
3. 确保 `link` 路径与文件路径一致（相对于 `docs/` 且无后缀）

---

## 下载资源管理

`docs/public/downloads/` 是站点直接发布的静态目录，需要**手工维护并直接提交**：
- 模板文件（`.md.template`、`.json.template` 等）
- PPT 文件（`.pptx`）及其生成脚本（`.py`）
- 压缩包（`.tar.gz`）
- 示例项目源码（`examples/minimal-agent-demo/`）
- Skill 命令模板（`skills-hooks/templates/commands/`）
- MCP 配置模板（`mcp/templates/mcp-config.json`）
- Hook 配置模板（`skills-hooks/templates/settings-with-hooks.json`）

修改示例项目代码时，需要同步更新：
- `docs/examples/minimal-agent-demo/`（文档页）
- `docs/public/downloads/examples/minimal-agent-demo/`（可下载源码）
- `docs/public/downloads/examples/minimal-agent-demo.tar.gz`（压缩包）

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

### 校验文档链接时
- `pnpm docs:check` 运行 `scripts/check-doc-links.mjs`，递归扫描 `docs/` 下所有 `.md` 文件的内部链接
- 脚本会屏蔽代码块内容以避免误报，支持相对路径、绝对路径及 `/downloads/` 静态资源校验
- CI 流水线（`.github/workflows/docs-check.yml`）在每次 PR 和 push 到 main 时自动执行链接校验 + 构建验证
- 提交前若新增了页面或链接，建议先本地运行 `pnpm docs:check` 排查断链

### 处理示例项目时
- `docs/public/downloads/examples/minimal-agent-demo/` 有自己的 `CLAUDE.md`，在该目录下工作时以该文件的规范为准

---

## 禁止行为

- 不要将 `.vitepress/dist/`（构建产物）或 `.vitepress/cache/` 提交到 Git
- 不要将 `node_modules/` 提交到 Git
- 不要在 `docs/` 以外的位置存放站点正文内容
- 不要修改 `docs/public/downloads/` 中的文件后忘记同步对应的文档页
- 不要在 sidebar 中添加没有对应文件的链接（会导致构建警告或 404）
- 不要删除或重命名页面而忘记同步更新 `.vitepress/config.mts` 的 sidebar 和其他页面中指向该页面的链接

---

## 当前开发重点

- 站点核心学习路径（9 个模块）已全部建立，每个模块均包含主文档和至少一个示例
- Skills & Hooks 模块已扩展为包含进阶模式页面和多个示例
- 案例与演练板块已增加跨角色 AI 手册和实战修复案例
- 分享与培训板块已增加 30 分钟 Workshop 页面和配套 PPT（含可视化版本）
- 已接入文档链接自动校验（`pnpm docs:check`）和 CI 流水线，确保链接完整性
- `docs/project-overview/`（内容地图页面）已于近期移除，相关链接已从 sidebar、README、首页、导读页同步清理
- 新增 `harness-engineering/` 模块（能力构建层第 5 章），包含主文档、演练案例和可下载检查清单模板
- 重点在完善各模块示例内容和下载资源
