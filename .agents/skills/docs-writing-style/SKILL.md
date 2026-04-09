---
name: docs-writing-style
description: Use when drafting, rewriting, or normalizing Cyber 2026 docs content pages such as module index pages, sidebar-linked standalone teaching pages, or docs/**/examples/*.md, while preserving the repo's established VitePress teaching style.
---

# Docs Writing Style

Use this skill only for Cyber 2026 content pages inside `docs/`:

- Module body pages at `docs/**/index.md`, except `docs/index.md` and `docs/intro/index.md`
- Standalone teaching pages under `docs/` that are explicitly linked from the sidebar, such as `docs/skills-hooks/advanced-patterns.md`
- Example pages at `docs/**/examples/*.md`

Do not use this skill for:

- `docs/index.md` or any page with `layout: home`
- `docs/intro/index.md`
- Files under `docs/public/downloads/`
- `README.md`, `CLAUDE.md`, or repo meta docs
- Landing pages, download indexes, or utility pages with custom frontmatter-driven layouts

## Required Prep

Before you draft or rewrite a page:

1. Read `AGENTS.md`, especially `Markdown 内容约定`, `内容结构模式`, and any navigation rules relevant to the target page. If a tool surfaces `CLAUDE.md`, treat it as a compatibility pointer and follow `AGENTS.md`.
2. Read `references/page-style.md`.
3. Read at least one same-type or closest-shape page from the repo as a style sample only:
   - For a module page, inspect another `docs/*/index.md`.
   - For a standalone teaching page, inspect a nearby sidebar-linked teaching page with a similar purpose, or the target page itself when you are making a local edit and no close peer exists.
   - For an example page, inspect another `docs/*/examples/*.md`.

The skill package (`SKILL.md` + `references/page-style.md`) is the style authority for this workflow. Same-type pages are examples, not higher-priority rules.

If the target page is out of scope, say so plainly and do not force this skill's template onto it.

## Page Type Decision

### Module Page

Treat the page as a module page when it is the main teaching page for a topic under `docs/<module>/index.md`.

Requirements:

- The page must stay in simplified Chinese.
- The page must use only H2 and H3 headings.
- The page should follow the module-page teaching skeleton, but plain H2 titles are the default.
- Preserve existing H2 numbering only when the source page already uses it and the task is a local edit, or when the user explicitly asks for numbered headings.
- The page should keep the top callout block for `适合人群` and `学习目标`.
- The page must include these closing blocks in order near the end of the page: `与前后章节的关系`, `延伸阅读 / 模板 / 示例`, `完成检查清单`.
- Preserve any existing trailing chapter-navigation line after those closing blocks, such as `**上一章 ←** ...` or `**下一章 →** ...`.
- Any explicit chapter-order reference must come from user input or repo facts that clearly establish the module position.

If the page needs an explicit chapter-order reference and that information is missing, first derive it from repository facts such as adjacent module pages or configured learning-path order. If it still cannot be determined confidently, stop and ask. Never guess.

### Standalone Teaching Page

Treat the page as a standalone teaching page when it is a non-home, non-intro content page under `docs/` that is explicitly linked from the sidebar but is neither a module `index.md` page nor an `examples/` page.

Requirements:

- Keep the page in simplified Chinese.
- Use only H2 and H3 headings.
- Preserve the existing intro callout when the source page already uses one; do not add it blindly.
- Keep the structure teaching-oriented and sectioned, but do not force the module-page closing trio onto pages that use a different established ending.
- Preserve page-specific closing structure and related-page links when they are supported by repo facts.

### Example Page

Treat the page as an example page when it is a case study, walkthrough, scenario, or sample under `docs/**/examples/*.md`.

Requirements:

- Keep the page in simplified Chinese.
- Use only H2 and H3 headings.
- Do not force numbered chapter headings.
- Do not add the module-page intro callout unless the source page already uses it.
- Keep the structure more narrative and case-driven than the module pages.

## Priority Order

Resolve conflicts in this order:

1. The user's explicit request in the current turn
2. `AGENTS.md`
3. This skill package (`SKILL.md` + `references/page-style.md`)
4. Existing same-type pages in `docs/`, only as non-authoritative examples

Do not invent new style rules when the repository already has a stable pattern. If a same-type page conflicts with this skill package, follow the skill package and treat the page as drift.

Treat numbered H2 sections in older module pages as a legacy pattern, not the default for new drafts or full rewrites.

## Workflow

1. Classify the target as `module page`, `standalone teaching page`, `example page`, or `out of scope`.
2. Extract the requested subject, audience, and constraints from the user input.
3. Load the repo rules, this skill reference, and one same-type page before outlining.
4. Build the outline from the matching skeleton in `references/page-style.md`.
5. If the target is a module page and the output needs explicit chapter-order wording, resolve it from explicit input or repo facts before drafting.
6. Draft or rewrite the page using the established repo voice and layout.
7. Run the self-check before returning the result.

## Hard Rules

- Use simplified Chinese prose. English is allowed only for names, commands, paths, APIs, or terms that already exist in the repo.
- Use H2 and H3 only. Do not introduce H4 or deeper headings.
- Add frontmatter only when it is necessary to override title or control page behavior.
- Internal doc links must be relative paths and must omit the `.md` suffix.
- Every code fence must declare a language.
- Keep major blocks separated with `---` when that pattern already exists on the page type.
- Do not add numeric prefixes to every H2 by default on module pages.
- Do not delete an existing trailing chapter-navigation line from a module page unless the user explicitly asks to remove it.
- Do not copy homepage patterns such as `layout: home`, `hero`, or `features` into content pages.
- Do not rewrite example pages into rigid chapter lessons.

## Output Contracts

### For Module Pages

Always preserve or generate:

- Top title line
- Intro callout block for `适合人群` and `学习目标`
- Plain H2 section titles by default; retain numbered H2s only when intentionally preserving a legacy page or when explicitly requested
- A teaching progression that matches the repo's chapter pages
- The closing sections `与前后章节的关系`, `延伸阅读 / 模板 / 示例`, and `完成检查清单` in that order
- Any existing trailing chapter-navigation line after those closing sections

### For Standalone Teaching Pages

Always preserve or generate:

- A clear page purpose that matches the sidebar-linked teaching intent
- The existing intro callout when the source page already uses one
- A sectioned teaching flow that fits the page's purpose without forcing the module-page closing trio
- Existing related-page links or closing structure when they are part of the established page pattern

### For Example Pages

Always preserve or generate:

- A clear opening that explains the background or problem
- A body organized around steps, comparisons, layered analysis, tables, or quoted prompts
- A closing takeaway, checklist, or experience summary when it helps the example land

## Self-Check

Before finishing, verify all of the following:

- The page is in scope for this skill.
- The page is written in simplified Chinese.
- No H4 or deeper headings appear.
- Internal links do not end in `.md`.
- Every code fence has a language tag.
- Module pages use plain H2 titles by default.
- If a module page keeps numbered H2s, that choice is intentional legacy preservation or explicitly requested.
- Any explicit chapter-order reference was provided explicitly or derived from repo facts, not guessed.
- Module pages include `与前后章节的关系`.
- Module pages include `延伸阅读 / 模板 / 示例`.
- Module pages include `完成检查清单`.
- If a module page had a trailing chapter-navigation line, it was preserved or intentionally updated rather than dropped.
- Standalone teaching pages keep their page-specific closing structure and do not gain module-page-only scaffolding by mistake.
- Example pages do not gain module-page-only scaffolding by mistake.
