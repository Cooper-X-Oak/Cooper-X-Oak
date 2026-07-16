# Implementation authority

User authorization: revoke the unauthorized human-evidence gate, complete the
D03/D04 artifact review, implement the README, and update the existing Draft
PR without automatic merge.

Repository workflow: `github-standard-development` as declared by the effective
project `AGENTS.md` through `$apply-repo-workflow`.

Projection contract:

- `profile.json` is the editable source of truth.
- `artifacts/build_profile.mjs` deterministically generates `README.md`,
  `profile.html`, and the four production SVGs.
- Generated outputs are never hand-edited.
- The implementation must preserve the canonical silhouette/topology hashes,
  native GFM semantics, two visual-role allowlist, theme structural equivalence,
  responsive evidence, and images-disabled behavior.
- Publishing is limited to committing and pushing the current feature branch
  to Draft PR #5. Automatic merge is prohibited.
