# CLAUDE.md — Cyber 2026

## Project Overview

This is a **VitePress documentation site** — the "赛博飞升方法论" (Cyber Ascension Handbook). It is a Chinese-language (zh-CN) educational resource about AI-assisted software development methodology for teams. There is no application code; the deliverable is a static documentation website.

## Tech Stack

- **Framework:** VitePress 2.0.0-alpha.17 (Vue-based static site generator)
- **Package Manager:** pnpm 10.32.1 (required — do not use npm or yarn)
- **Language:** Markdown content, minimal TypeScript config only
- **Node.js:** 18+ (per VitePress requirements)

## Commands

```bash
pnpm docs:dev       # Start local dev server (hot-reload)
pnpm docs:build     # Build static site to .vitepress/dist/
pnpm docs:preview   # Preview the production build locally
```

Always run `pnpm install` first if `node_modules/` is missing.

## Directory Structure

```
.vitepress/
  config.mts          # VitePress config: nav, sidebar, theme, locale
docs/                  # All site content (srcDir)
  index.md             # Homepage (hero layout)
  intro/               # Getting started
  paradigm-shift/      # Part 1 — 范式转变
  vibe-coding/         # Vibe Coding methodology
  tools-overview/      # 工具全景
  rules/               # Rules chapter
  mcp/                 # MCP (Model Context Protocol)
  skills-hooks/        # Skills & Hooks
  agent-development/   # Agent development
  production-governance/ # Production governance
  team-workflow/       # Team workflow & quality
  appendix-case-studies/ # Case studies & appendix
  presentation-outlines/ # Training materials
  examples/            # Example projects (rendered in site)
  downloads/           # Downloads page
  public/              # Static assets & downloadable resources
    downloads/         # Downloadable files (templates, PPTs, examples)
```

### Content Organization

The site follows a learning progression:

1. **认知与协作方式** — Paradigm Shift → Vibe Coding → Tools Overview
2. **能力构建** — Rules → MCP → Skills & Hooks → Agent Development
3. **治理与团队化** — Production Governance → Team Workflow

Each chapter has an `index.md` plus an `examples/` subdirectory with hands-on case studies.

## Content Conventions

- All prose is written in **Chinese (zh-CN)**
- Markdown files use VitePress extensions (frontmatter, custom containers, etc.)
- Files in `docs/public/downloads/**/*.md` are **excluded** from the site build (`srcExclude`)
- Navigation and sidebar are defined in `.vitepress/config.mts` — update this file when adding/removing pages
- Outline depth is configured to show heading levels 2–3

## Adding New Content

1. Create a `.md` file under the appropriate `docs/` subdirectory
2. Add a sidebar entry in `.vitepress/config.mts` under the correct section
3. If adding a new top-level chapter, also add a `nav` entry in the config
4. Verify with `pnpm docs:dev` that the page renders and navigation works

## Example Projects

The `docs/public/downloads/examples/` directory contains downloadable example projects (e.g., `minimal-agent-demo/`). These are:
- **Excluded** from site rendering via `srcExclude`
- Bundled as static assets for download
- Have their own `CLAUDE.md`, dependencies, and test suites

## Key Files

| File | Purpose |
|------|---------|
| `.vitepress/config.mts` | Site config: navigation, sidebar, theme, locale |
| `package.json` | Scripts and dependencies |
| `pnpm-lock.yaml` | Dependency lock file — commit changes to this |
| `docs/index.md` | Site homepage |

## Rules

- **Do not** add runtime dependencies — this is a docs-only site
- **Do not** modify files under `.vitepress/cache/` or `.vitepress/dist/` — these are gitignored build artifacts
- **Do not** commit `node_modules/`
- Keep commit messages in English, prefixed with conventional commits (`feat:`, `docs:`, `fix:`, `refactor:`)
- When editing content, preserve the existing Chinese writing style and terminology
- Prefer editing existing files over creating new ones
