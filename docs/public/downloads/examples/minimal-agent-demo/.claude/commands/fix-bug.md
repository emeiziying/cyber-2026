---
description: 修复 minimal-agent-demo 中的缺陷，并保持 API 响应格式和测试同步
---

Fix the bug described below in the minimal Notes API demo.

Bug report: $ARGUMENTS

## Project Conventions

- Route handling lives in `src/server.js`
- Business rules and validation live in `src/services`
- Data access lives in `src/repositories`
- API responses must stay in `{ data, error }` format
- Tests use Node.js built-in `node:test`

## Steps

1. Search the codebase to identify the affected code path
2. Explain the root cause in one sentence before changing code
3. Implement the smallest fix that preserves existing behavior
4. Update or add tests in `test/`
5. Run `npm test`

## Output

- Root cause
- Files changed
- Test coverage added or updated
