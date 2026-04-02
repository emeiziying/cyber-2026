---
description: 审查 minimal-agent-demo 的代码变更，重点关注分层、响应结构和测试覆盖
---

Review the specified file or recent changes in the minimal Notes API demo.

Target: $ARGUMENTS

If no target is provided, review the staged diff.

## Review Priorities

### Correctness

- Validation logic matches the API contract
- Search and filter behavior handle empty input correctly
- Status codes align with the returned error shape

### Architecture

- `server.js` stays thin and does not absorb service logic
- `repositories` only handle persistence concerns
- Shared response formatting stays in `src/utils/response.js`

### Tests

- Changes under `src/services` or `src/server.js` are covered by tests
- Tests cover at least one failure path in addition to the happy path

## Output Format

For each finding:

**[Severity: HIGH/MEDIUM/LOW]** `file:line`
> Explain the issue and why it matters.

End with:

- Overall assessment
- Highest-priority follow-up
