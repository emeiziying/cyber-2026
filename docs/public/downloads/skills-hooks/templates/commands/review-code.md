Perform a thorough code review of the specified file or recent changes.

## Usage
`/review-code [file path or "staged" for staged changes]`

## Review Checklist

### Correctness
- Logic errors or off-by-one mistakes
- Edge cases not handled (null, empty list, zero, overflow)
- Async/concurrency issues

### Security
- Input validation at system boundaries
- SQL injection / XSS / command injection risks
- Sensitive data exposure in logs or responses
- Authentication/authorization gaps

### Performance
- N+1 query problems
- Unnecessary re-computation in loops
- Missing indexes for DB queries

### Code Quality
- Functions doing more than one thing
- Magic numbers/strings without constants
- Duplicated logic that could be extracted
- Misleading variable/function names

## Output Format

For each issue found, report as:

**[Severity: HIGH/MEDIUM/LOW]** `file:line`
> Description of the issue

Suggested fix:
```
code suggestion
```

---

End with a **Summary** section:
- Overall assessment (Approve / Request Changes / Needs Discussion)
- Top 3 most important issues to address first
