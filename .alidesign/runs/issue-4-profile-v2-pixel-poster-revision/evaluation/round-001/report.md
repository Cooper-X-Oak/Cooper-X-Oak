# Evaluation round — Pixel Oak production candidate

- Run: `issue-4-profile-v2-pixel-poster-revision`
- Round: `round-001`
- Review mode: `release`
- Artifact: generated Profile README, preview, and four production SVGs
- Verdict: `needs_revision`
- Routing revision: `revision-006`
- Independent reviewer: `codex-independent-release-reviewer-pixel-oak`

## Applicable rules

- Canonical Pixel Oak art direction and D03/D04 hashes/tokens.
- Craft criteria for 860/320, light/dark, semantics and image failure.
- AliDesign release blockers override aggregate quality.
- Human recognition is not a gate; synthetic proxy history is heuristic only.

## Evidence collected

- Five CDP production captures and `production-metrics.json`.
- Profile contract tests: 22/22 passed.
- Six generated outputs current.
- Four SVG XML parses passed.
- Light/dark structural equivalence and D03/D04 hashes passed.
- `git diff --check` contained no whitespace errors.

## Subchecks

| Dimension | Verdict | Evidence | Owner phase | Blocking |
|---|---|---|---|---:|
| D03/D04 fidelity | passed | Frozen hashes, tokens and four loaded captures | component_domain | no |
| Overall visual system | passed | 3:2 Pixel Oak Hero, root Evidence field, ledger spine | component_domain | no |
| 860/320 loaded | passed | Four captures; zero overflow nodes | craft | no |
| Theme projection | passed | Same geometry, declared forest-family tokens | component_domain | no |
| Semantics/accessibility | passed | Native GFM remains complete; eight links in bounds | interaction_states | no |
| Anti-template/platform fit | passed | Cooper-specific Oak/proof/open-loop relationship | component_domain | no |
| Images disabled | needs_revision | Large Hero aspect-ratio vacancy and Evidence broken-image strip | implementing | yes |

## Blocking issue R-001

The 320 images-disabled capture retains the Hero's large 3:2 empty footprint
and an Evidence broken-image strip. `renderPicture()` writes HTML width/height
attributes and the preview forces every image to `width: 100%`. This violates
the canonical collapse/no-fixed-frame contract.

Directed revision: keep intrinsic dimensions on the SVG root, remove HTML
width/height from README images, stop forcing broken images to full width,
regenerate, and recapture all five states. D03/D04 geometry, colors, IA and
loaded-state visual design must not change.

## Accepted exceptions

- Raw local Brave CDP is accepted because the bundled Playwright package lacks
  `playwright-core`; no dependency installation is required.
- No human test or external research is required.

## Next legal transition

Seal this round as `needs_revision`, return to `implementing`, apply only
R-001, collect replacement evidence, and create append-only `round-002`.
Draft PR push and automatic merge are not allowed from this round.
