# Profile v2 implementation record

Status: accepted launch candidate; independent release evaluation passed.
Production route: sealed `revision-004` (`f259fbbc989f49a6d11d0c74b41c8eb0178c727f800ab9062b1ea9e0afd1efd5`).
Artifact/evaluation routes: sealed revisions 005–006; accepted evaluation is
`evaluation/round-001`.

## Projection completed

`profile.json` schema version 3 is the single authoring model. The project
generator projects it into:

- one semantic GitHub Profile README;
- one script-free semantic local preview;
- light/dark Hero signature SVGs;
- light/dark decorative Evidence-marker SVGs.

The README uses no viewport image source. Both roles use the same production
asset at 860px and 320px. Old mobile signature files remain unreferenced legacy
assets and are not part of the generated output set.

## Product behavior implemented

- Hero order: theme-safe picture → `COOPER OAK` H1 → locked lead → Current
  experiment.
- Hero SVG contains only Ring Ledger geometry, an origin block, and a rule.
- Evidence order: empty-alt black marker → native Evidence H3 → three natural
  proof links → native Next H3.
- Page outline: one H1; four ordered H2s `02–05`; four ordered experiment H3s;
  three thematic breaks.
- Principles are three linked lines; Open loop names only the public
  `writing-loop-harness`; Discuss links once to `提交反例` in Issue #6.
- Launch preserves the current GitHub account avatar. No external profile
  setting was changed.

## Deterministic and structural checks

- Profile contract tests: `21/21` passed.
- Pixel Laboratory historical concept tests: `4/4` passed.
- Generator drift: `6 files current`.
- Concept-board drift: current.
- Routing revision history: verified.
- Four generated SVGs parse as XML.
- Light/dark outputs are structurally identical after token normalization.
- Hero glyph source bounds are 36% of width and 78.8% of height with a 60-unit
  right safe edge.
- Hero forest/canvas and Evidence rule/black-field non-text contrast exceed 3:1
  in both declared themes.
- Every published proof, Open loop, and counterexample URL returned HTTP 200.

## Render evidence

- `evidence/profile-v2-860-light.png`
- `evidence/profile-v2-860-dark.png`
- `evidence/profile-v2-320-light.png`
- `evidence/profile-v2-320-dark.png`
- `evidence/profile-v2-320-images-disabled.png`

The 860 evidence uses a 1280px Profile context whose README column is capped at
860px. The narrow evidence uses an actual 320px browser viewport. Both widths
show natural wrapping without horizontal scroll or crop. The image-disabled
capture retains the complete native heading outline and link content.

The installed in-app Browser Skill could not initialize because its required
JavaScript runtime tool was not exposed in this task. Evidence was therefore
captured with local Chrome through the DevTools Protocol. An initial
command-line narrow capture was rejected because Chrome retained a larger
layout viewport and cropped the 320px bitmap. The replacement evidence uses an
explicit 320px device-metrics override and records `clientWidth`, `scrollWidth`,
overflow-node bounds, and every link bound in `evidence/dom-metrics.json`. This
changes the collection tool only; it does not waive any release check or change
the product source.

## History boundary

- `.alidesign/runs/issue-2-profile-redesign/**` has no diff.
- Its tree remains `341de507f7a7280e505b932bf92cadbd00350388`.
- Existing route revisions 001–003 and the concept review remain unchanged.
- Product visual decisions were appended as revision 004.
- Artifact and evaluation ownership corrections were appended as revisions
  005–006; no sealed revision was rewritten.

## Release handoff

The independent reviewer passed Q61–Q65 and all eight release-quality
dimensions. Run the complete repository verification, commit, push the existing
Draft PR #5, and smoke-check GitHub's branch render. Do not merge automatically.
If the platform smoke reveals a broken asset, theme, link, or narrow rendering,
stop delivery and append the next evaluation round rather than editing the
sealed round.
