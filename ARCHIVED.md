# ARCHIVED

This repository was locally archived/normalized in **backup mode** (history left
intact, no force push, no tracked files deleted).

## Restore working state
All committed content is restorable from git:

```bash
git restore .            # discard local modifications, return to last commit
git checkout main        # ensure you are on the main branch
git log --oneline        # review history
```

No tracked files were removed during archiving. The normalization added only
`.gitignore`, `AGENTS.md`, `ARCHIVED.md`, and snapshotted previously-untracked
working files (profile.html, artifacts/, extra notes) as a WIP commit.

## Credentials
None. This repository contains no credential files (`*.env`, `cookies.txt`,
`*.pem`, `*.key`) in either the working tree or git history. The scan was clean,
so no history rewrite was required. `.gitignore` now blocks such files from
being committed in the future.

## Identity
Repo-local git identity is pinned to the GitHub noreply address to keep the
batch consistent and avoid leaking a real email (global config untouched):

```
user.name  = Cooper Oak
user.email = 68638637+Cooper-X-Oak@users.noreply.github.com
```

## Remote
- origin: https://github.com/Cooper-X-Oak/Cooper-X-Oak.git
- Nothing was pushed during archiving. Push manually when ready:
  `git push origin main`
