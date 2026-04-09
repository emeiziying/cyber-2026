# Cyber 2026 Docs Page Style

This file distills the stable layout rules already present in the repository's content pages. It is not a new design system.

## Authority

- Treat this file and `../SKILL.md` as a compact summary of recurring repo patterns and fallback page shapes.
- `AGENTS.md`, the target page itself, and clear repository facts remain higher-priority than this reference.
- Same-type pages in `docs/` help identify stable patterns and valid variations; do not erase repo-consistent differences just to match a generic shape.

## Shared Rules

- Start from `AGENTS.md`; treat `CLAUDE.md` only as a compatibility pointer when a tool still references it.
- Use simplified Chinese throughout the page.
- Use H2 and H3 only.
- Use relative internal links and omit `.md`.
- Add frontmatter only when it is needed for title override or page behavior.
- Mark every code fence with a language.
- Prefer concise teaching prose over decorative wording.
- Reuse the repo's existing table, checklist, and quoted-callout patterns instead of inventing new ones.

## Module Page Typical Shape

Use this typical shape for `docs/<module>/index.md` pages when creating a new page or repairing a structurally incomplete draft:

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

---

**下一章 →** [下一章标题](../next-module/)
```

Module page notes:

- Do not add H2 numeric prefixes by default.
- Preserve H2 numbering only when maintaining an already-numbered page without a full rewrite, or when the user explicitly asks for numbered sections.
- Resolve module order from explicit user input first when the page needs ordinal chapter wording. If it is missing, derive it only from clear repo facts; if it still cannot be determined, stop and ask instead of guessing.
- Put the reader-facing problem first, then importance, then concepts, then scenarios and practice.
- Use `---` between major regions when the page already follows that rhythm.
- Always preserve the closing block order: `与前后章节的关系` -> `延伸阅读 / 模板 / 示例` -> `完成检查清单`.
- Preserve any existing trailing chapter-navigation line after the closing blocks; it may point to the previous chapter, next chapter, or both in future pages.
- End `与前后章节的关系` with navigation context or adjacent chapter references when the module is part of the main learning path.
- Preserve topic-specific sections that the page already uses to teach its subject, such as transition, boundary, or rollout sections that do not appear in every module page.

## Standalone Teaching Page Typical Shape

Use this typical shape for sidebar-linked standalone content pages such as `docs/skills-hooks/advanced-patterns.md` when the page needs a starting structure:

```markdown
# 页面标题

> **适合人群：** ...
> **目标：** ...

---

## 这页解决什么问题

## 核心方法 / 结构 / 判断

### 子节（按需）

---

## 实操建议 / 常见问题 / 进阶边界

## 延伸阅读
```

Standalone teaching page notes:

- Use this shape for pages that are teaching content, appear in the sidebar, but are neither module index pages nor example pages.
- Preserve the intro callout only when the page already uses one or the user explicitly asks for it.
- Keep a teaching progression, but let the sections follow the page's actual purpose instead of forcing the module-page closing trio.
- Preserve established related-page links and page-specific endings when the repo already uses them.
- Prefer the target page's existing rhythm when doing a local rewrite; this shape is a fallback, not a required template.

## Example Page Typical Shape

Use this typical shape for `docs/**/examples/*.md` pages when you need a default starting point:

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
- Keep strong example-specific section names when they make the case easier to scan; do not rename them only to match this typical shape.

## Prohibited Drift

- Do not apply homepage frontmatter like `layout: home`, `hero`, or `features` to content pages.
- Do not mix in full English sentences when the repo has a Chinese equivalent.
- Do not convert example pages into numbered teaching chapters.
- Do not add extra heading depths just to mirror document outlines from elsewhere.
