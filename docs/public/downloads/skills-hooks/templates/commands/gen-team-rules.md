Generate a CLAUDE.md rules file for this project by analyzing the codebase and interviewing the user.

This skill uses a modular approach: each step is handled by focused sub-prompts.

---

## Step 1: Intake — collect context

Ask the user these questions (all at once, not one by one):

1. **技术栈：** 主要语言、框架、数据库、测试工具是什么？
2. **团队痛点：** AI 辅助开发中，最常出现哪类问题（格式不对、层级乱、命名不统一...）？
3. **现有规范：** 已有 .eslintrc / prettier / 架构文档吗？如有，我会读取它们作为参考。

Collect answers, then proceed to Step 2.

---

## Step 2: Analyze — infer implicit conventions from existing code

Scan the codebase to extract the *actual* conventions being followed (not what people say they do):

- Read 3-5 existing service files → infer naming conventions and function length norms
- Read 3-5 test files → infer testing patterns and mock style
- Read existing API route handlers → infer error handling patterns
- Check for existing config/utils structure

**Principle: only document what you observe. If evidence is insufficient, mark as "(需要补充)".**

---

## Step 3: Build — generate CLAUDE.md using behavior-trigger format

Generate the CLAUDE.md using this format for behavioral rules:

```
在 [具体场景/触发条件] 时，[具体行为]
```

NOT abstract adjectives like "写出高质量代码" or "注重安全性".

Structure the output as:
1. 项目背景（1 paragraph）
2. 技术栈（list）
3. 常用命令（code block）
4. 目录结构（tree）
5. 行为规范（behavior-trigger format, organized by: 代码质量 / 错误处理 / 安全 / 测试）
6. 禁止行为（explicit don'ts）

---

## Step 4: Confirm and write

Show the generated CLAUDE.md to the user and ask:
> "以上规则是否符合你们项目的实际情况？有哪些需要调整？"

After confirmation, write to `CLAUDE.md` in the project root.

If the file already exists:
- Detect conflicts between new and existing rules
- For conflicts: show both versions and ask which to keep
- For additions: append to the relevant section
- Never silently overwrite existing rules

---

## Constraints

- Rules must be specific and actionable, not vague
- Each behavior rule needs a concrete trigger condition
- If insufficient evidence for a rule, note "(原材料不足，建议手动补充)" instead of guessing
- Keep total file under 150 lines to stay readable
