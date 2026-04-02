Generate comprehensive unit tests for: $ARGUMENTS

If no argument is provided, generate tests for the most recently modified source file.

## Test Strategy
- Happy path: normal expected usage
- Edge cases: empty input, null/undefined, boundary values, empty collections
- Error cases: invalid input, external service failure, timeout

## Conventions
- Framework: Vitest (describe / it / expect)
- File location: same directory as source file, named *.test.ts
- Mock all external dependencies (DB, HTTP clients, file system)
- Test names follow: "should [expected behavior] when [condition]"

## Output
- Complete, runnable test file (no placeholder comments)
- After writing, run the tests and fix any failures before finishing
