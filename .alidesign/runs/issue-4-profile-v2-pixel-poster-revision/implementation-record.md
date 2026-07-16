# Implementation record — Pixel Oak Profile candidate

Source of truth: `profile.json`.

Generated projection:

- `README.md`
- `profile.html`
- `assets/profile-signature-light.svg`
- `assets/profile-signature-dark.svg`
- `assets/profile-evidence-light.svg`
- `assets/profile-evidence-dark.svg`

Implementation decisions:

- Replaced the small Ring Ledger Hero with a 3:2, 54×36-cell Pixel Oak poster.
- Preserved the frozen D03/D04 silhouette and topology hashes in generator
  tests.
- Projected the same geometry through light/dark forest-family tokens.
- Replaced the old ring Evidence marker with a decorative root crop from the
  same Oak system; native GFM remains the only evidence and action layer.
- Retained exactly two visual roles, one H1, the 02–05 ledger spine, Q/H/E/N,
  three proof links, three principles, one honest Open Loop, and one
  counterexample action.
- Did not add viewport-specific assets, custom GitHub CSS, tables, badges,
  terminal chrome, fake controls, embedded copy, motion, or remote resources.

Verification:

- Profile contract tests: 22/22 passed.
- Generator drift check: six outputs current.
- D03/D04 silhouette and structure hashes: passed.
- Light/dark structural equivalence: passed.
- Four SVG XML parses: passed.
- CDP production evidence: 860-light, 860-dark, 320-light, 320-dark, and
  320-images-disabled collected.
- All five cases: `innerWidth === clientWidth === scrollWidth`; no overflow
  nodes; eight links in viewport bounds.
- `git diff --check`: no whitespace errors.

Evidence collector note: the bundled Playwright package lacked
`playwright-core`, so the collector used local Brave through raw CDP with
`Emulation.setDeviceMetricsOverride`. No dependency was installed. This is a
tool substitution only and does not relax the viewport or artifact criteria.

## Directed revision R-001

Round-001 found that HTML width/height plus a forced full-width preview image
left a large Hero vacancy and an Evidence broken-image strip. The generator now
keeps intrinsic dimensions on each SVG root, omits HTML width/height, and uses
`max-width: 100%` without forcing broken images to full width. The round-002
collector fails closed unless the broken Hero is at most one alt-text line, the
decorative Evidence image collapses to zero height, H1 follows compactly, all
links remain in bounds, and no horizontal overflow exists.
