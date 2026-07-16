# Profile v2 implementation authority

Status: resolved for the `implementation_authorized` gate.

## Repository workflow

- Repository: `Cooper-X-Oak/Cooper-X-Oak`.
- Workflow: `github-standard-development`, declared by project `AGENTS.md`.
- Issue branch/worktree: `feat/4-profile-v2-professional-identity` in the
  dedicated `Cooper-X-Oak-profile-issue-4` worktree.
- Delivery: existing Draft PR #5 targeting remote default branch `main`.
- User authorization: implement, verify, commit, and push the launch candidate;
  do not merge.
- GitHub account avatar/profile settings are out of scope for this launch.

Preflight on 2026-07-15 confirmed a clean task worktree, `origin` ownership,
GitHub authentication, public Issue #4, Draft PR #5, and remote default branch
`main`. Main was reported unprotected by the repository API; this workflow still
forbids direct main pushes.

## Authorized projection

`profile.json` remains the authoring source. `artifacts/build_profile.mjs`
validates and deterministically projects it to:

- `README.md`;
- `profile.html`;
- `assets/profile-signature-light.svg`;
- `assets/profile-signature-dark.svg`;
- `assets/profile-evidence-light.svg`;
- `assets/profile-evidence-dark.svg`.

The two old mobile signature files are legacy v1 artifacts and are no longer
referenced or generated. No dependency, framework, account setting, avatar,
repository pin, or unrelated asset is changed.

## Preserved history

- `.alidesign/runs/issue-2-profile-redesign/**` remains byte-identical.
- Its sealed `evaluation/round-001/**` remains byte-identical.
- Routing revisions 001–003 and concept-review artifacts remain unchanged.
- Production decisions are appended as revision 004 and later evaluation work
  uses the next contiguous round.

## Verification authority

- `node artifacts/build_profile.mjs` generates outputs.
- `node --test artifacts/build_profile.test.mjs` validates source and output
  contracts.
- `node artifacts/build_profile.mjs --check` rejects drift.
- XML parsing, link requests, screenshots, DOM/outline inspection, diff review,
  and `git diff --check` provide release evidence.
- The independent reviewer is Codex task
  `019f664b-38d1-79f3-ba6b-2a9c059f5c6c`; it is not the author or gate resolver.
