# Implementation record — whole-page interface

## Product projection

- `profile.json`: page contract changed from the old linear experiment ledger to
  `github-profile-pixel-oak-control-ledger`.
- `artifacts/build_profile.mjs`: projects five semantic interface tables:
  opening register, experiment ledger, principles strip, Open Loop record, and
  counterexample action.
- `README.md`: generated GitHub surface using native headings, HTML tables,
  ordered evidence, and real links.
- `profile.html`: local semantic preview of the same content and composition.
- `artifacts/build_profile.test.mjs`: locks the new grammar, narrow-label break
  opportunities, and exact production SVG hashes.

## Frozen asset result

No production SVG file is modified in the worktree. SHA-256 before and after:

| File | SHA-256 |
|---|---|
| `profile-signature-light.svg` | `2d54d6f74a4a76bccfcd97dcca672348c0cd384a161b185208c25ad423ea46ea` |
| `profile-signature-dark.svg` | `7f61fd6fa27428dc512c26dedfb13baa6e4ef6a921aa320226bfa847720a588d` |
| `profile-evidence-light.svg` | `2ae45e21e5f11822a971c7be0fdbb8453519f4341ab5d6f4313da8ea79e27e91` |
| `profile-evidence-dark.svg` | `2ae45e21e5f11822a971c7be0fdbb8453519f4341ab5d6f4313da8ea79e27e91` |

## Directed craft correction during evidence collection

The first 320px render showed the unbroken `COUNTEREXAMPLE` label crowding the
declaration column. Before evaluation was opened, the label was changed to the
semantic two-line form `COUNTER / EXAMPLE`; `UNFINISHED / RECORD` received the
same explicit square-ledger break. The `NOW` label was shortened from `PUBLIC
EXPERIMENT` to `ACTIVE` after the first render exposed an orphan final letter.
No product fact or SVG changed.

## Verification

- Profile contract: 23/23 passed.
- Generator drift: 6/6 current.
- SVG XML parse: 4/4 passed.
- Capability routing history: verified.
- Browser evidence: 860 light/dark, 320 light/dark, and 320 images-disabled.
- Every case: five tables, eight links, zero overflow nodes.
- True 320 cases: `innerWidth = clientWidth = scrollWidth = 320`.
- `git diff --check`: passed; Windows line-ending notices only.
