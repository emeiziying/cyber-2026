# cyber-2026 — AI 助手规则

## 项目背景

本仓库是一份团队内部技术分享教材，覆盖从 Vibe Coding 入门到 Agent 开发的完整学习路线。内容面向混合受众：工程师（实践操作）和技术管理者（概念决策）。

**这是纯文档仓库**——无构建系统、无测试套件、无依赖包。所有内容均为 Markdown 文档和 JSON/Markdown 配置模板。

---

## 仓库结构

```
cyber-2026/
├── CLAUDE.md                        ← 本文件（AI 助手规则）
├── README.md                        ← 主入口，学习路线图
├── 01-paradigm-shift/               ← 第一章：AI 辅助开发的范式转变（⭐，全员）
│   └── README.md
├── 02-vibe-coding/                  ← 第二章：Vibe Coding 实战（⭐⭐，工程师）
│   └── README.md
├── 03-tools-overview/               ← 第三章：主流 AI 编程工具全景（⭐⭐，全员）
│   └── README.md
├── 04-rules/                        ← 第四章：Rules — 驯化 AI 助手（⭐⭐⭐，工程师）
│   ├── README.md
│   └── templates/
│       ├── CLAUDE.md.template       ← 通用后端项目模板
│       └── frontend-CLAUDE.md.template ← 前端（React + TypeScript）模板
├── 05-mcp/                          ← 第五章：MCP — 扩展 AI 能力边界（⭐⭐⭐，工程师）
│   ├── README.md
│   └── templates/
│       └── mcp-config.json          ← MCP 服务器配置模板
├── 06-skills-hooks/                 ← 第六章：Skills & Hooks — AI 工作流自动化（⭐⭐⭐，工程师）
│   ├── README.md
│   ├── advanced-patterns.md         ← 高级 Skill 设计模式
│   └── templates/
│       ├── settings-with-hooks.json ← Hooks 配置模板
│       └── commands/                ← 5 个可直接使用的 Skill 模板
│           ├── daily-report.md
│           ├── fix-bug.md
│           ├── gen-team-rules.md
│           ├── gen-tests.md
│           └── review-code.md
└── 07-agent-development/            ← 第七章：从工具使用到 Agent 开发（⭐⭐⭐⭐，工程师）
    └── README.md
```

**章节难度与受众：**
- ⭐ 第一章：全员必读，建立认知框架
- ⭐⭐ 第二、三章：全员，实践感受
- ⭐⭐⭐ 第四、五、六章：工程师，深度配置与自动化
- ⭐⭐⭐⭐ 第七章：工程师，Agent 开发能力

---

## 内容规范

### 语言
- 文档主体语言为**中文**
- 代码示例、文件名、命令、技术术语保持**英文**
- Skill 模板文件（`06-skills-hooks/templates/commands/`）使用英文编写，因为它们作为 AI 系统指令执行

### 章节结构
每个章节的 `README.md` 应包含：
1. 章节标题 + 适合人群 + 学习目标
2. 有编号的内容小节（`## X.1`, `## X.2` ...）
3. 代码块和示例（具体优于抽象）
4. **完成检查清单**（`## 完成检查清单`，用 `- [ ]` 格式）
5. 导航链接（`上一章 ←` / `下一章 →`）

### 模板文件（`templates/` 目录）
- 模板供读者直接复制使用，**不要修改为具体项目的配置**
- JSON 模板须包含清晰的占位符注释
- CLAUDE.md 模板须包含所有必要章节（背景、技术栈、命令、目录结构、代码规范、禁止行为）

---

## Git 工作流

### 当前开发分支
本仓库在功能分支上开发：`claude/add-claude-documentation-FZRtC`

### Commit 消息规范
```
类型: 简短描述（中文或英文均可）

类型：
  feat    新增章节或功能性内容
  docs    修改/补充现有文档
  chore   维护性工作（重命名、整理结构）
  fix     修正错误内容

示例：
  docs: 补充第六章 Skill 高质量示例
  feat: 新增第八章内容
  chore: 更新模板文件占位符格式
```

### 提交到远端
```bash
git push -u origin claude/add-claude-documentation-FZRtC
```

---

## AI 助手行为规范

### 内容修改
- 修改章节内容前，先阅读该章节的 `README.md` 以理解现有结构
- 新增章节时，在根目录 `README.md` 的章节目录表中同步添加条目
- 不要改变各章节的学习难度定位（⭐ 数量）

### 模板文件
- `04-rules/templates/` 下的模板是通用模板，不针对本仓库本身
- 修改模板时保持占位符格式（用中括号 `[...]` 标注需填写的内容）

### 禁止行为
- 不要在本仓库添加 `package.json`、`requirements.txt` 等依赖管理文件（这是纯文档仓库）
- 不要删除或重命名 `templates/` 目录（读者会直接引用这些路径）
- 不要将中文文档翻译成英文（保持原有语言策略）
- 不要修改章节编号（`01-` 到 `07-` 的目录前缀）

---

## 核心参考资源

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [Anthropic SDK 文档](https://docs.anthropic.com/en/api)
- [Cursor 文档](https://docs.cursor.com)
