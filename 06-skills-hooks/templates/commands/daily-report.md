Generate a concise daily development report for today's work.

## Steps
1. Run `git log --since="today" --oneline` to get today's commits
2. Check the diff of modified files for context
3. List any open PRs if gh is available: `gh pr list --author @me --state open`
4. Summarize in the format below

## Output Format

### 📅 Daily Report — {today's date}

**Completed**
- {bullet list based on commits and changes}

**In Progress**
- {open PRs or incomplete work}

**Summary**
{One paragraph, 2-3 sentences, describing what was accomplished and why it matters}

Keep total length under 200 words. Focus on impact, not just activity.
