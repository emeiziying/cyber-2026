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

# 校验文档链接
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
│   ├── intro/
│   │   ├── index.md              # 开始阅读入口
│   │   ├── quick-start.md        # 快速启动指南（分阶段路径）
│   │   └── doc-map.md            # 文档结构总览（站点地图 + 维护约定）
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
│   │   └── examples/
│   │       ├── mcp-readonly-rollout.md
│   │       └── popular-mcp-servers.md
│   ├── skills-hooks/             # 模块6：Skills & Hooks 自动化
│   │   ├── index.md
│   │   ├── advanced-patterns.md  # 进阶模式（独立页面）
│   │   └── examples/
│   │       ├── skill-hook-decision-cases.md
│   │       ├── dept-skill-sharing.md
│   │       ├── official-skills-catalog.md # Anthropic 官方 Skills 速查
│   │       ├── skill-pack-selection.md   # Skill Pack 选型指南
│   │       ├── gstack-workflow.md        # gstack 实战指南
│   │       ├── superpowers-workflow.md   # superpowers 实战指南
│   │       └── gsd-workflow.md           # GSD 实战指南
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
- **引用块换行：** `config.mts` 中注册了自定义 markdown 插件，将 blockquote 内的软换行（softbreak）转为硬换行（hardbreak），确保多行引用块中的换行在渲染后保留

### 内容结构模式
每个学习模块的 `index.md` 建议按以下顺序组织：
1. 这解决什么问题（痛点）
2. 为什么重要
3. 核心概念说明
4. 使用边界（什么情况下用/不用）
5. 场景示例

### 导航与侧边栏
侧边栏结构在 `.vitepress/config.mts` 中维护。当前侧边栏分为两大区块：
- **导读**（开始阅读、快速启动指南、文档结构总览）
- **学习主线**（按"认知与协作方式 → 能力构建 → 治理与团队化"三层嵌套，当前模块：范式转变、Vibe Coding、工具全景、Rules、MCP、Skills & Hooks、Agent 开发、Harness Engineering、生产落地与治理、团队工作流与质量控制）

其中 **Skills & Hooks** 模块的侧边栏进一步细分为三个子区块：
- **核心方法**：进阶模式、Skill 与 Hook 判断案例
- **组织实践**：部门级 Skill 共享
- **Skill Pack 案例**：Skill Pack 选型、gstack / superpowers / GSD 实战指南

新增**学习主线模块**（`docs/` 下的顶层模块目录）时，必须同步以下所有位置：

1. 在 `docs/` 下创建对应的 Markdown 文件
2. 在 `config.mts` 的 `sidebar` 数组中添加对应条目（示例页嵌套在其模块的 `items` 内）
3. 确保 `link` 路径与文件路径一致（相对于 `docs/` 且无后缀）
4. **更新 `docs/intro/index.md` 的"推荐怎么读"**：在对应学习阶段的步骤中加入新模块链接
5. **更新相邻模块的章节关系说明**：修改上一章的 `x.9 与前后章节的关系` 中的"下一章"，以及下一章的"上一章"，确保导航链条不断

新增**示例页**（模块内 `examples/` 目录下的文件）时，只需执行步骤 1–3，无需改动导读。

### 导读页结构（`docs/intro/index.md`）

导读页是读者进入学习路径的入口，必须始终与实际模块保持同步。它包含两个需要维护的部分：

**"推荐怎么读"三步骤：**
```
1. 认知与协作方式：范式转变 / Vibe Coding / 工具全景
2. 能力构建：Rules / MCP / Skills & Hooks / Agent 开发 / Harness Engineering
3. 治理与团队化：生产落地与治理 / 团队工作流与质量控制
```
新增学习主线模块时，按其所属层次将链接插入对应步骤。

**"按目标选择入口"**：面向不同目标读者的快速入口，通常不需要为每个新模块都加条目，只在该模块对某类读者有明显导流价值时才添加。

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
- 新增学习主线模块时，按"导航与侧边栏"一节列出的 5 步清单逐项执行，不要只改 sidebar 而遗漏导读和章节关系
- 模板骨架直接维护在对应章节正文中，避免出现多份事实来源

### 修改站点配置时
- `config.mts` 使用 TypeScript，修改后确认语法正确（`pnpm docs:build` 会验证）
- sidebar 的 `link` 字段必须与实际文件路径严格对应，否则会出现 404

### 校验文档链接时
- `pnpm docs:check` 运行 `scripts/check-doc-links.mjs`，递归扫描 `docs/` 下所有 `.md` 文件的内部链接
- 脚本会屏蔽代码块内容以避免误报，支持相对路径与绝对路径校验
- CI 流水线（`.github/workflows/docs-check.yml`）在每次 PR 和 push 到 main 时自动执行链接校验 + 构建验证
- 提交前若新增了页面或链接，建议先本地运行 `pnpm docs:check` 排查断链

## 禁止行为

- 不要将 `.vitepress/dist/`（构建产物）或 `.vitepress/cache/` 提交到 Git
- 不要将 `node_modules/` 提交到 Git
- 不要在 `docs/` 以外的位置存放站点正文内容
- 不要在 sidebar 中添加没有对应文件的链接（会导致构建警告或 404）
- 不要删除或重命名页面而忘记同步更新 `.vitepress/config.mts` 的 sidebar 和其他页面中指向该页面的链接
- 不要新增学习主线模块而不更新 `docs/intro/index.md` 的"推荐怎么读"——导读是读者的入口，遗漏会导致新模块对读者不可见
- 不要只更新导读而不更新相邻章节的"与前后章节的关系"——章节导航链条必须前后一致

---

## 当前开发重点

- 站点核心学习路径（10 个模块）已全部建立，每个模块均包含主文档和至少一个示例
- 导读区新增**快速启动指南**（`intro/quick-start.md`），提供分阶段的学习路径入口
- Skills & Hooks 模块已大幅扩展：进阶模式页面 + 6 个示例（含 Skill Pack 选型及 gstack / superpowers / GSD 三套实战指南）
- MCP 模块新增**热门开源 MCP 项目**参考页（`mcp/examples/popular-mcp-servers.md`）
- 已接入文档链接自动校验（`pnpm docs:check`）和 CI 流水线，确保链接完整性
- `docs/project-overview/`（内容地图页面）已于早期移除，相关链接已从 sidebar、README、首页、导读页同步清理
- 重点在完善各模块示例内容和章节内模板展示
