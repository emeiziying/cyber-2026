# 第六章：Skills & Hooks — AI 工作流自动化

> **适合人群：** 工程师
> **学习目标：** 用 Skill 封装团队工作流，用 Hook 实现基于事件的自动化

---

## 6.1 Skills 是什么？

**Skill（斜杠命令）** 是将复杂的 AI 操作封装成一行指令的机制。

**没有 Skill 时：**
```
你：帮我 Review 这个 PR，检查代码质量、安全漏洞、测试覆盖、
    并按照我们团队的格式写评论，不要使用表情包，
    每个问题要说明原因和改进建议...
（每次 Review 都要输入这段话）
```

**有了 `/review-pr` Skill 后：**
```
你：/review-pr 123
AI：（自动执行完整的 PR Review 流程）
```

---

## 6.2 Skills 的类型

### 内置 Skills（Claude Code 自带）
```bash
/commit          # 智能生成 commit message 并提交
/review-pr       # Review Pull Request
/help            # 获取帮助
/clear           # 清空对话上下文
/cost            # 查看本次会话的 token 消耗
```

### 自定义 Skills（团队/个人定义）
Skill 本质上是一个 Markdown 文件，包含：
- **触发条件**（什么时候使用这个 Skill）
- **执行逻辑**（AI 需要做什么）
- **输出格式**（结果如何呈现）

---

## 6.3 创建自定义 Skill

**文件位置：**
```
~/.claude/commands/           # 个人全局 Skill（所有项目可用）
项目根目录/.claude/commands/  # 项目级 Skill（提交到 git，团队共享）
```

**示例：创建 `/daily-report` Skill**

文件路径：`.claude/commands/daily-report.md`

```markdown
Generate a daily development report for today's work.

## Instructions
1. Run `git log --since="today" --author="$(git config user.email)" --oneline`
   to get today's commits
2. Check for any open PRs with `gh pr list --author @me --state open`
3. Look at modified files to understand what areas were worked on
4. Generate a report in the following format:

## Daily Report - [Date]

### Completed Today
- [bullet list from commits]

### In Progress
- [open PRs]

### Key Changes
- [brief technical summary of what changed and why]

Keep the report concise (under 200 words) and focused on impact.
```

**使用方式：**
```
/daily-report
```

---

## 6.4 Hooks 是什么？

**Hook** 是基于事件触发的自动化脚本，在 AI 执行特定操作前后自动运行。

### Hook 事件类型

| 事件 | 触发时机 |
|------|---------|
| `PreToolCall` | AI 调用工具前 |
| `PostToolCall` | AI 调用工具后 |
| `SessionStart` | 会话开始时 |
| `SessionEnd` | 会话结束时 |
| `Stop` | AI 输出停止时 |

### Hook 的能力
- 可以**阻止** AI 执行某个操作（返回非 0 exit code）
- 可以**修改** AI 工具调用的输入
- 可以**注入额外信息**到 AI 的上下文中
- 可以触发**外部脚本**（通知、日志、检查等）

---

## 6.5 实用 Hooks 示例

### 示例1：保存所有对话到本地（PostToolCall）

```json
{
  "hooks": {
    "PostToolCall": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date): Tool call completed\" >> ~/.claude/activity.log"
          }
        ]
      }
    ]
  }
}
```

### 示例2：禁止在 main 分支直接操作文件（PreToolCall）

```json
{
  "hooks": {
    "PreToolCall": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'branch=$(git branch --show-current); if [ \"$branch\" = \"main\" ] || [ \"$branch\" = \"master\" ]; then echo \"ERROR: 不允许在 $branch 分支直接修改文件\" >&2; exit 1; fi'"
          }
        ]
      }
    ]
  }
}
```

### 示例3：每次会话开始时自动加载环境信息（SessionStart）

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo \"Current branch: $(git branch --show-current)\nPending PRs: $(gh pr list --author @me --json number --jq length 2>/dev/null || echo 'N/A')\nLast commit: $(git log -1 --oneline 2>/dev/null || echo 'No commits')\""
          }
        ]
      }
    ]
  }
}
```

---

## 6.6 配置位置

**Claude Code Hooks 配置：**
```
~/.claude/settings.json          # 全局 hooks
项目根目录/.claude/settings.json  # 项目级 hooks
```

完整配置示例见 [`templates/settings-with-hooks.json`](./templates/settings-with-hooks.json)

---

## 6.7 Skills vs Hooks 对比

| 维度 | Skills | Hooks |
|------|--------|-------|
| **触发方式** | 用户主动调用 `/xxx` | 事件自动触发 |
| **用途** | 封装复杂 AI 操作流程 | 自动化、检查、限制 |
| **编写语言** | Markdown（自然语言描述） | Shell 脚本 / 任意命令 |
| **适合场景** | 复用固定工作流 | 安全检查、环境初始化、日志 |

---

## 完成检查清单

- [ ] 了解内置 Skill（如 `/commit`）的使用方式
- [ ] 为团队创建过一个自定义 Skill（如日报、PR 模板）
- [ ] 配置过至少一个 Hook（SessionStart 或 PreToolCall）
- [ ] 理解 Hook 如何阻止 AI 执行不安全操作

---

**上一章 ←** [第五章：MCP](../05-mcp/)
**下一章 →** [第七章：Agent 开发](../07-agent-development/)
