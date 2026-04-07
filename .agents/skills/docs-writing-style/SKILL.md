---
name: docs-writing-style
description: Use when drafting, rewriting, or normalizing Cyber 2026 repository docs content pages in docs/**/index.md except docs/intro/index.md, or docs/**/examples/*.md, and the output must match the repo's established VitePress teaching style.
---

# Docs Writing Style

Use this skill only for Cyber 2026 content pages inside `docs/`:

- Module body pages at `docs/**/index.md`, except `docs/intro/index.md`
- Example pages at `docs/**/examples/*.md`

Do not use this skill for:

- `docs/index.md` or any page with `layout: home`
- `docs/intro/index.md`
- Files under `docs/public/downloads/`
- `README.md`, `CLAUDE.md`, or repo meta docs
- Landing pages, download indexes, or utility pages with custom frontmatter-driven layouts

## Required Prep

Before you draft or rewrite a page:

1. Read `CLAUDE.md`, especially `Markdown 内容约定` and `内容结构模式`.
2. Read `references/page-style.md`.
3. Read at least one same-type page from the repo as a style sample only:
   - For a module page, inspect another `docs/*/index.md`.
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
- The page must end with these exact closing blocks in order: `与前后章节的关系`, `延伸阅读 / 模板 / 示例`, `完成检查清单`.
- Any explicit chapter-order reference must come from user input or repo facts that clearly establish the module position.

If the page needs an explicit chapter-order reference and that information is missing, first derive it from repository facts such as adjacent module pages or configured learning-path order. If it still cannot be determined confidently, stop and ask. Never guess.

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
2. `CLAUDE.md`
3. This skill package (`SKILL.md` + `references/page-style.md`)
4. Existing same-type pages in `docs/`, only as non-authoritative examples

Do not invent new style rules when the repository already has a stable pattern. If a same-type page conflicts with this skill package, follow the skill package and treat the page as drift.

Treat numbered H2 sections in older module pages as a legacy pattern, not the default for new drafts or full rewrites.

## Workflow

1. Classify the target as `module page`, `example page`, or `out of scope`.
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
- Do not copy homepage patterns such as `layout: home`, `hero`, or `features` into content pages.
- Do not rewrite example pages into rigid chapter lessons.

## Output Contracts

### For Module Pages

Always preserve or generate:

- Top title line
- Intro callout block for `适合人群` and `学习目标`
- Plain H2 section titles by default; retain numbered H2s only when intentionally preserving a legacy page or when explicitly requested
- A teaching progression that matches the repo's chapter pages
- The exact closing sections `与前后章节的关系`, `延伸阅读 / 模板 / 示例`, and `完成检查清单`

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
- Example pages do not gain module-page-only scaffolding by mistake.
