# Cyber 2026 Docs Page Style

This file distills the stable layout rules already present in the repository's content pages. It is not a new design system.

## Authority

- Treat this file and `../SKILL.md` as the normative style source for this skill.
- Same-type pages in `docs/` are reference examples only.
- If an existing page conflicts with this skill package, follow the skill package and treat the page as drift to avoid copying inconsistencies forward.

## Shared Rules

- Use simplified Chinese throughout the page.
- Use H2 and H3 only.
- Use relative internal links and omit `.md`.
- Add frontmatter only when it is needed for title override or page behavior.
- Mark every code fence with a language.
- Prefer concise teaching prose over decorative wording.
- Reuse the repo's existing table, checklist, and quoted-callout patterns instead of inventing new ones.

## Module Page Skeleton

Use this skeleton for `docs/<module>/index.md` pages:

```markdown
# 模块标题

> **适合人群：** ...
> **学习目标：** ...

---

## 本章解决什么问题

## 为什么这件事重要

## 核心概念与边界

### 子节（按需）

---

## 一个最小场景与反例

## 实操方法

## 常见误区 / 风险提醒

## 最小练习

## 与前后章节的关系

## 延伸阅读 / 模板 / 示例

## 完成检查清单

- [ ] ...
```

Module page notes:

- Do not add H2 numeric prefixes by default.
- Preserve H2 numbering only when maintaining an already-numbered page without a full rewrite, or when the user explicitly asks for numbered sections.
- Resolve module order from explicit user input first when the page needs ordinal chapter wording. If it is missing, derive it only from clear repo facts; if it still cannot be determined, stop and ask instead of guessing.
- Put the reader-facing problem first, then importance, then concepts, then scenarios and practice.
- Use `---` between major regions when the page already follows that rhythm.
- Always preserve the closing block order: `与前后章节的关系` -> `延伸阅读 / 模板 / 示例` -> `完成检查清单`.
- End `与前后章节的关系` with navigation context or adjacent chapter references when the module is part of the main learning path.

## Example Page Skeleton

Use this skeleton for `docs/**/examples/*.md` pages:

```markdown
# 示例标题

## 背景 / 问题

## 分析 / 步骤 / 对照

### 子节（按需）

## 结论 / 经验沉淀
```

Example page notes:

- Do not force chapter numbering.
- Do not add the `适合人群 / 学习目标` callout by default.
- Open with context, then move into steps, comparisons, tables, or evidence.
- Keep the page concrete and case-driven.
- A checklist is optional. Use it only if the example naturally ends in an action summary.

## Prohibited Drift

- Do not apply homepage frontmatter like `layout: home`, `hero`, or `features` to content pages.
- Do not mix in full English sentences when the repo has a Chinese equivalent.
- Do not convert example pages into numbered teaching chapters.
- Do not add extra heading depths just to mirror document outlines from elsewhere.
