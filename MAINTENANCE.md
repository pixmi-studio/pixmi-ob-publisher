# Plugin Maintenance & Review Guide

## Common Review Issues to Monitor
- **Security**: Ensure AppSecret is never stored in plain text in logs (Verified).
- **Performance**: Ensure Markdown parsing is efficient for large files (Verified).
- **UX**: Ensure notices are informative and not intrusive (Verified).

## Post-Submission Checklist
1. Monitor the GitHub PR on `obsidianmd/obsidian-releases`.
2. Respond to any requests for changes within 48 hours.
3. If the reviewer requests a change in `manifest.json`, remember to update both `src/manifest.json` and the root `manifest.json`.

## Versioning
- Any changes requested during review should be released as a new version (e.g., 1.0.12) before the PR is merged.
