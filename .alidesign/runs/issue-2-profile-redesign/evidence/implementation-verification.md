# Implementation verification

- Candidate: `IA-A-flagship-first-evidence-landing`
- Authoring source: `profile.json`
- Generated surfaces: `README.md`, `profile.html`, and four
  `assets/profile-signature-*` theme/viewport variants
- Evidence date: 2026-07-15

## Build and contract evidence

- `node artifacts/build_profile.mjs` generated all six outputs only after the
  complete output set passed validation.
- `node --test artifacts/build_profile.test.mjs`: 15/15 tests passed.
- `node artifacts/build_profile.mjs --check`: no source/output drift.
- `git diff --check`: passed; Git only reported expected Windows line-ending
  normalization notices.
- Failure contracts reject the retired v1 console schema, redirected primary
  action, duplicate projects, missing proof, non-HTTPS proof, and legacy
  dashboard fields.
- Mutation coverage confirms that mobile signature copy and preview avatar
  colors derive from `profile.json`; `.gitattributes` fixes generated text to
  LF so a fresh Windows checkout does not create false drift.
- Canonical URL/path checks reject traversal outside a selected repository;
  angle-delimited GFM destinations preserve valid URL parentheses without
  breaking the rendered link.

## Browser and responsive evidence

Headless Chromium loaded the complete semantic preview from the local file.
All four cases had one H1, exactly three project entries, no console errors,
no horizontal overflow, and a first link of `#selected-work`. Activating that
link produced the expected hash.

| Case | Selected asset | Width result |
|---|---|---|
| 1440px light | `profile-signature-light.svg` | no overflow |
| 1440px dark | `profile-signature-dark.svg` | no overflow |
| 390px light | `profile-signature-mobile-light.svg` | no overflow |
| 320px dark | `profile-signature-mobile-dark.svg` | no overflow |
| 200% zoom | responsive document | no overflow; all three projects present |

At the 860px desktop content width, the smallest signature source line renders
at 14.33px. At 320px, the mobile signature renders at 288px wide, so its
smallest 28px source line renders at 13.44px. Both clear the 13px auxiliary-text
target.
On a dark 390px run, the first Tab focused `See selected work ↓` with a solid
3px outline; Enter activated `#selected-work`.

Screenshots:

- [`desktop-light.png`](desktop-light.png)
- [`desktop-dark.png`](desktop-dark.png)
- [`narrow-390-light.png`](narrow-390-light.png)
- [`narrow-320-dark.png`](narrow-320-dark.png)
- [`zoom-200-light.png`](zoom-200-light.png)
- [`image-fallback-light.png`](image-fallback-light.png)

## Asset, link, and accessibility evidence

- Windows XML parsing accepted all four generated SVGs with `svg` roots.
- All ten published repository, release, install, test, CI, and repository-exit
  URLs returned HTTP 200. The latest-release URL resolved to `v1.8.16` at the
  evidence snapshot without hard-coding that volatile version in profile copy.
- GitHub's authenticated GFM rendering API preserved one `<picture>`, all three
  responsive `<source>` elements, one H1, the `#selected-work` link, three H3
  project headings, and the intended alt text; it emitted no script element.
- The signature remains static, local, and free of script, remote resources,
  gradients, filters, animation, links, rounded panels, and control language.
- Contrast ratios:
  - light signature primary: 16.57:1
  - light signature secondary: 7.42:1
  - dark signature primary: 17.32:1
  - dark signature secondary: 11.17:1
  - preview light link: 5.19:1
  - preview dark link: 6.11:1
- Identity, project summaries, evidence links, and the primary path are native
  text and remain available if the signature image fails.
- An aborted-SVG browser run produced a zero-width image with the intended alt
  text while retaining the H1, all three projects, eleven native links, and a
  no-overflow 390px document.

## Known release boundary

The local preview exercises the complete shared view model and responsive
assets, and the GitHub GFM API confirms the relevant sanitized structure. The
repository branch/PR render remains the final visual platform smoke check
before merge.
