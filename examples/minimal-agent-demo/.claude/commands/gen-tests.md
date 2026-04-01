---
description: 为 minimal-agent-demo 的业务逻辑补充回归测试
---

Generate or update tests for: $ARGUMENTS

If no file is provided, inspect the most recently modified file under `src/`.

## Test Strategy

- Happy path: valid input returns the expected data
- Validation path: empty or invalid fields return a structured error
- Query path: filtering and search logic behave correctly

## Conventions

- Use Node.js built-in `node:test`
- Use `assert/strict`
- Put tests in `test/`
- Name tests as: `should [expected result] when [condition]`
- Reset the in-memory repository state between tests

## Output

- A complete runnable `*.test.js` file
- A note confirming `npm test` was run
