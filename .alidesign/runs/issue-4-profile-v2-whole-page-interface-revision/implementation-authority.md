# Implementation authority

- Repository workflow: `github-standard-development` from project `AGENTS.md`.
- Existing isolated worktree and issue branch:
  `feat/4-profile-v2-professional-identity`.
- Authoring source: `profile.json`.
- Projection toolchain: `artifacts/build_profile.mjs`.
- Generated outputs: `README.md`, `profile.html`, and existing SVG paths.
- The four existing production SVG files are immutable in this run. Their
  pre-change hashes are acceptance inputs; generated-output checks must not
  rewrite them to different bytes.
- Required verification: project tests, generated drift, XML parse, frozen
  hashes, complete diff audit, real desktop/mobile visual evidence, independent
  release design review, and `git diff --check`.
- Delivery: focused commit, push only the issue branch, update existing Draft
  PR #5, then GitHub smoke check. No merge or branch deletion.
