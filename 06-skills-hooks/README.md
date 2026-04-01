# 第六章：Skills & Hooks — AI 工作流自动化

> **适合人群：** 工程师
> **学习目标：** 深入理解 Skill 的工作原理，能制作高质量的自定义 Skill，用 Hook 实现事件驱动自动化

---

## 6.1 Skills 是什么？

**Skill（斜杠命令）** 是将复杂的 AI 操作封装成一行指令的机制。
本质是一个 **Markdown 文件** —— 用户调用 `/skill-name` 时，文件内容作为系统指令传给 AI 执行。

**没有 Skill 时：**
```
你：帮我 Review 这个 PR，检查代码质量、安全漏洞、测试覆盖、
    并按照我们团队的格式写评论，不要使用表情包，
    每个问题要说明原因和改进建议...
（每次 Review 都要重复输入这段话）
```

**有了 `/review-pr` Skill 后：**
```
你：/review-pr 123
AI：（自动执行完整的 PR Review 流程，格式统一）
```

---

## 6.2 Skill 的文件位置与作用域

```
~/.claude/commands/               ← 个人全局（所有项目，不提交 git）
  └── my-skill.md

项目根目录/.claude/commands/      ← 项目级（团队共享，提交 git）
  └── team-skill.md
```

**优先级：** 项目级同名 Skill 会覆盖全局 Skill。

**命名规则：**
- 文件名：`kebab-case.md`（如 `fix-bug.md`）
- 调用方式：`/fix-bug`（去掉 `.md` 后缀，加 `/` 前缀）

---

## 6.3 Skill 文件的完整结构

```markdown
---
name: skill-identifier        ← 可选：YAML Frontmatter，提供元数据
description: 描述何时使用此 Skill（AI 会读这里来决定是否自动触发）
---

这里是 Skill 的主体说明，用自然语言描述 AI 应该做什么。

用户传入的参数会替换 $ARGUMENTS 变量。    ← 唯一的特殊变量

## Steps / Instructions（可选，但推荐）
1. 步骤一
2. 步骤二

## Output Format（可选，但推荐）
结果按以下格式呈现：...
```

### 关键：`$ARGUMENTS` 变量

`$ARGUMENTS` 是 Skill 文件中**唯一的特殊变量**，自动替换为用户调用时传入的所有参数。

```bash
# 用户输入
/fix-bug 登录后 token 没有清除，复现步骤：...

# Skill 文件中的 $ARGUMENTS 会被替换为：
# "登录后 token 没有清除，复现步骤：..."
```

**Skill 文件写法：**
```markdown
Fix the bug described by the user.

Bug description: $ARGUMENTS

## Steps
1. Understand the bug: analyze what $ARGUMENTS is describing
2. Search the codebase for related code
3. Implement a minimal fix
4. Explain the root cause and the fix applied
```

---

## 6.4 内置 Skills（Claude Code 自带）

```bash
/commit          # 分析 diff，生成符合规范的 commit message 并提交
/review-pr       # Review GitHub Pull Request
/help            # 获取帮助
/clear           # 清空对话上下文（保留项目规则）
/cost            # 查看本次会话的 token 消耗
```

---

## 6.5 制作自定义 Skill：从零到可用

### 第一步：确定 Skill 的用途

好的 Skill 应该满足：
- 你或团队**经常重复**做的操作
- 需要**固定格式**的输出
- 涉及**多个步骤**的复杂流程

### 第二步：创建文件

```bash
# 项目级 Skill（推荐团队共享）
mkdir -p .claude/commands
touch .claude/commands/your-skill.md

# 个人全局 Skill
mkdir -p ~/.claude/commands
touch ~/.claude/commands/your-skill.md
```

### 第三步：编写 Skill 内容

**结构模板：**
```markdown
---
description: 一句话说明这个 Skill 的用途（可选但推荐）
---

[主要指令：用祈使句描述任务]

[如果有参数] $ARGUMENTS

## Context（可选）
[提供背景信息，如项目规范、技术栈等]

## Steps
1. [第一步具体做什么]
2. [第二步具体做什么]
3. [...]

## Output Format
[规定输出的结构和格式]

## Constraints（可选）
- [约束1：不要做什么]
- [约束2：必须遵守什么]
```

---

## 6.6 实战：5 个高质量 Skill 示例

### Skill 1：Bug 修复（带参数）

文件：`.claude/commands/fix-bug.md`
```markdown
Fix the bug described below. Follow the project's error handling conventions.

Bug report: $ARGUMENTS

## Steps
1. Search the codebase to understand the relevant code path
2. Identify the root cause (not just the symptom)
3. Implement a minimal fix that doesn't break existing behavior
4. Check if similar bugs exist elsewhere in the codebase
5. Write or update tests to cover this case

## Output
- Root cause analysis (1-2 sentences)
- Files changed and why
- Test coverage added
```

用法：`/fix-bug 用户登录后刷新页面 token 丢失，复现：Chrome + 无痕模式`

---

### Skill 2：功能开发（带上下文注入）

文件：`.claude/commands/new-feature.md`
```markdown
Implement a new feature following our project conventions.

Feature request: $ARGUMENTS

## Project Conventions (always follow)
- Use TypeScript strict mode
- Services layer for business logic, repositories for data access
- Every new service method needs a unit test
- API responses: { data: T, error: null } or { data: null, error: { code, message } }

## Steps
1. Clarify the requirements from $ARGUMENTS if ambiguous
2. Design the data model changes (if any)
3. Implement service layer logic
4. Add API route (if needed)
5. Write unit tests
6. Update types

Start by asking if there are any requirements unclear before coding.
```

---

### Skill 3：日报生成（无参数）

文件：`.claude/commands/daily-report.md`
```markdown
Generate a concise daily development report for today's work.

## Steps
1. Run: git log --since="today" --oneline
2. Run: git diff --stat HEAD~$(git log --since="today" --oneline | wc -l) HEAD
3. Check open PRs if gh is available: gh pr list --author @me --state open

## Output Format

### Daily Report — {today's date}

**Completed**
- {bullet points from commits, focus on what was accomplished}

**In Progress**
- {open PRs or work started but not committed}

**Summary**
{2-3 sentences describing today's impact}

Keep total length under 200 words.
```

---

### Skill 4：代码审查（带严格格式）

文件：`.claude/commands/review.md`
```markdown
Perform a thorough code review of: $ARGUMENTS

If no argument given, review all staged changes (git diff --staged).

## Review Dimensions

### Correctness
- Logic errors, off-by-one, unhandled edge cases (null, empty, overflow)
- Async/concurrency issues

### Security
- Input validation at system boundaries
- Injection risks (SQL, XSS, command)
- Sensitive data in logs or responses

### Performance
- N+1 queries, unnecessary loops, missing indexes

### Maintainability
- Single responsibility, naming clarity, duplication

## Output Format

**[HIGH/MEDIUM/LOW]** `file.ts:line`
> Problem description

```suggestion
improved code
```

---

**Overall: APPROVE / REQUEST_CHANGES**
Top 3 issues to fix first: ...
```

---

### Skill 5：生成测试（针对指定文件）

文件：`.claude/commands/gen-tests.md`
```markdown
Generate comprehensive unit tests for: $ARGUMENTS

## Test Strategy
- Test the happy path
- Test edge cases: empty input, null, boundary values
- Test error cases: invalid input, external service failure
- Mock all external dependencies (DB, HTTP, file system)

## Conventions
- Use Vitest (describe/it/expect)
- Test file: same directory as source, named *.test.ts
- Mock pattern: vi.mock('../path/to/module')
- Use descriptive test names: "should [action] when [condition]"

## Output
Complete test file ready to run, no placeholder comments.
After writing, run: npx vitest run [test-file] to verify it passes.
```

---

## 6.7 Skill 质量的关键差异

| 低质量 Skill | 高质量 Skill |
|------------|------------|
| 指令模糊："帮我改代码" | 指令精确："Implement X following convention Y" |
| 无输出格式规定 | 明确定义输出结构 |
| 没有约束条件 | 明确 "不要做什么" |
| 没有使用 $ARGUMENTS | 合理利用参数传递上下文 |
| 单步操作 | 分步骤，有明确的检查点 |

---

## 6.8 Hooks 是什么？

**Hook** 是基于**事件自动触发**的脚本，不需要用户主动调用。

### Hook 事件类型

| 事件 | 触发时机 | 典型用途 |
|------|---------|---------|
| `SessionStart` | 会话开始时 | 环境初始化、加载上下文 |
| `PreToolCall` | AI 调用工具前 | 安全检查、权限验证 |
| `PostToolCall` | AI 调用工具后 | 日志记录、通知 |
| `Stop` | AI 输出停止时 | 触发后续流程 |

### Hook 的能力
- **阻止操作**：脚本返回非 0 exit code → AI 操作被取消
- **向 AI 注入信息**：脚本输出 JSON 格式的 `{ "output": "..." }` → AI 会读到
- **触发外部系统**：发通知、记日志、调 API

### Hook 配置位置
```
~/.claude/settings.json           # 全局 hooks
项目根目录/.claude/settings.json  # 项目级 hooks
```

---

## 6.9 实用 Hooks 示例

### SessionStart：自动加载环境信息

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo \"分支: $(git branch --show-current)\n最近提交: $(git log -1 --oneline 2>/dev/null)\""
      }]
    }]
  }
}
```

### PreToolCall：禁止在 main 分支直接写文件

```json
{
  "hooks": {
    "PreToolCall": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "bash -c 'b=$(git branch --show-current); [ \"$b\" = \"main\" ] && echo \"禁止在 main 分支直接写文件\" >&2 && exit 1 || exit 0'"
      }]
    }]
  }
}
```

### PostToolCall：记录文件修改日志

```json
{
  "hooks": {
    "PostToolCall": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "echo \"[$(date '+%Y-%m-%d %H:%M:%S')] 文件已修改\" >> ~/.claude/file-changes.log"
      }]
    }]
  }
}
```

---

## 6.10 Skills vs Hooks 总结对比

| 维度 | Skills | Hooks |
|------|--------|-------|
| **触发方式** | 用户主动 `/skill-name` | 事件自动触发 |
| **编写语言** | Markdown + 自然语言 | Shell 脚本 |
| **特殊变量** | `$ARGUMENTS` | `$CLAUDE_PROJECT_DIR` 等环境变量 |
| **版本控制** | `.claude/commands/*.md` 提交 git | `.claude/settings.json` 提交 git |
| **适合场景** | 标准化 AI 工作流 | 安全检查、环境初始化、自动化 |

---

## 6.11 最小落地示例

如果你想看一套已经放进真实项目目录的最小组合，可以参考：

- [`../examples/minimal-agent-demo/.claude/commands/fix-bug.md`](../examples/minimal-agent-demo/.claude/commands/fix-bug.md)
- [`../examples/minimal-agent-demo/.claude/commands/gen-tests.md`](../examples/minimal-agent-demo/.claude/commands/gen-tests.md)
- [`../examples/minimal-agent-demo/.claude/commands/review-code.md`](../examples/minimal-agent-demo/.claude/commands/review-code.md)
- [`../examples/minimal-agent-demo/.claude/settings.json`](../examples/minimal-agent-demo/.claude/settings.json)

这个示例的目标不是展示复杂业务，而是把 **项目规则 + MCP 配置 + 项目级 Skills** 放进一个可运行的最小 Node 项目中，方便团队先跑通流程，再迁移到真实仓库。

---

## 完成检查清单

- [ ] 理解 Skill 的本质：Markdown 文件 → 系统指令
- [ ] 知道 `$ARGUMENTS` 的作用，能在 Skill 中正确使用
- [ ] 为项目创建过至少一个自定义 Skill，并实际调用验证效果
- [ ] 了解 Frontmatter 的作用（`description` 字段）
- [ ] 配置过至少一个 Hook（SessionStart 或 PreToolCall）
- [ ] 理解 Hook 如何通过 exit code 阻止 AI 操作

---

**上一章 ←** [第五章：MCP](../05-mcp/)
**下一章 →** [第七章：Agent 开发](../07-agent-development/)
