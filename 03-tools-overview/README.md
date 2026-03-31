# 第三章：主流 AI 编程工具全景

> **适合人群：** 全员（工程师 + 技术管理者）
> **学习目标：** 了解主流工具的核心差异，能根据场景做出合适的工具选型

---

## 3.1 工具分类

AI 编程工具按使用形态分为三类：

```
┌─────────────────────────────────────────────────────────┐
│  IDE 插件类          CLI 工具类           Web/Chat 类    │
│  ─────────────       ──────────────       ────────────   │
│  • Cursor            • Claude Code        • Claude.ai    │
│  • GitHub Copilot    • Aider              • ChatGPT      │
│  • Windsurf          • Codex CLI          • v0.dev       │
│  • Cline (VSCode)                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 3.2 主流工具横向对比

| 维度 | Claude Code | Cursor | GitHub Copilot | Aider |
|------|-------------|--------|----------------|-------|
| **形态** | CLI | IDE | IDE 插件 | CLI |
| **上下文理解** | 整个代码库 | 整个代码库 | 当前文件 + 部分 | 整个代码库 |
| **多文件编辑** | ✅ 自主决策 | ✅ 需人工确认 | ⚠️ 有限 | ✅ 自主决策 |
| **自主度** | 高（Agent 模式） | 中 | 低（补全为主） | 高 |
| **工具调用** | ✅ MCP 支持 | ✅ 有限工具 | ❌ | ❌ |
| **自定义规则** | ✅ CLAUDE.md | ✅ .cursorrules | ⚠️ 有限 | ✅ .aider.conf |
| **适合场景** | 复杂任务、自动化 | 日常编码 | 代码补全 | 终端重度用户 |
| **计费模式** | 按 token / 订阅 | 订阅 | 订阅 | 按 token |

---

## 3.3 重点工具详解

### Claude Code
Anthropic 官方 CLI，定位是"自主编程 Agent"。

**核心优势：**
- Agent 模式：能自主完成包含多个步骤的复杂任务
- MCP 协议支持：可以连接 GitHub、数据库、浏览器等外部工具
- 可编程性强：Rules / Skills / Hooks 体系完整
- 上下文窗口大（200K tokens），能理解大型代码库

**适合场景：**
- 需要跨多个文件的功能开发
- 自动化重复性工程任务
- 接入外部系统（数据库、API、CI/CD）

```bash
# 安装
npm install -g @anthropic-ai/claude-code

# 基本使用
claude "帮我分析这个项目的架构，并找出潜在的性能问题"

# 非交互式执行
claude -p "为所有没有测试的 service 文件生成单元测试" --dangerously-skip-permissions
```

---

### Cursor
基于 VSCode 的 AI 原生 IDE，对已有 VSCode 用户迁移成本低。

**核心优势：**
- 完整的 IDE 体验，代码补全 + 对话 + 多文件编辑一体
- Composer 模式：描述需求，自动修改多个文件
- Tab 补全：比 Copilot 更"智能"的上下文补全
- 支持自定义模型（可接入本地模型）

**适合场景：**
- 日常编码工作流
- 需要 IDE 深度集成（调试、Git、Extensions）
- 团队统一工具链

```
# .cursorrules 示例（放在项目根目录）
你是一个 TypeScript/React 专家。
- 使用函数组件和 Hooks，不使用 class 组件
- 状态管理使用 Zustand
- 样式使用 Tailwind CSS
- 所有组件都需要有对应的 .test.tsx 文件
```

---

### GitHub Copilot
微软/GitHub 出品，与 GitHub 生态深度集成。

**核心优势：**
- 与 GitHub、VS Code、JetBrains 生态无缝集成
- Copilot Chat：在 IDE 内直接对话
- PR 摘要自动生成
- 企业版有更严格的数据隐私控制

**局限：**
- 主要是补全和问答，自主 Agent 能力较弱
- 多文件编辑能力有限
- 定制化程度不如 Claude Code / Cursor

---

## 3.4 选型决策树

```
你的主要需求是什么？
│
├── 日常代码编写 + 不想换 IDE
│   └── → GitHub Copilot（在现有 IDE 上叠加）
│
├── 愿意换 IDE，想要更强的 AI 集成
│   └── → Cursor
│
├── 需要自动化复杂任务 / 跨多文件开发
│   └── → Claude Code
│
└── 重度终端用户 + 开源偏好
    └── → Aider
```

---

## 3.5 组合使用策略（推荐）

实际工作中，最佳实践往往是**组合使用**：

```
日常编码补全：Cursor / Copilot（IDE 内）
     +
复杂任务执行：Claude Code（CLI）
     +
探索/问答：Claude.ai Web（无代码上下文的轻量对话）
```

**团队建议：**
- 统一一套 IDE 工具（降低协作成本）
- 额外引入 Claude Code 处理批量/复杂任务
- 建立共享的 Rules 和 MCP 配置（后续章节详述）

---

## 完成检查清单

- [ ] 能说出 Claude Code、Cursor、GitHub Copilot 的核心差异
- [ ] 知道在什么场景下选择哪个工具
- [ ] 完成过至少一个工具的基础安装和使用
- [ ] 了解工具组合使用的策略

---

**上一章 ←** [第二章：Vibe Coding 实战](../02-vibe-coding/)
**下一章 →** [第四章：Rules](../04-rules/)
