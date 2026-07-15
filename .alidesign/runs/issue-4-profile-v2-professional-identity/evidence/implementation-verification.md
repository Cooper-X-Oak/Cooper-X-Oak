# Profile v2 implementation verification

Collected: 2026-07-15.
Responsibility: deterministic evidence collection, not design judgment.

| Check | Result | Evidence |
|---|---|---|
| Authoring contract | pass | `profile.json` schema 3; 21/21 tests |
| Generated-output drift | pass | six files current |
| Page grammar | pass | one H1; ordered H2 02–05; ordered Question/Hypothesis/Evidence/Next H3; three rules |
| Asset role allowlist | pass | Hero signature and Evidence black marker only; light/dark projections |
| SVG safety | pass | XML parse; no script, remote content, text element, animation, filter, gradient, shadow, or link |
| Theme equivalence | pass | normalized light/dark SVG strings identical per role |
| Hero bounds | pass | 36% width, 78.8% height, 60-unit right safe edge |
| Non-text contrast | pass | Hero forest/canvas and marker rule/black-field ≥ 3:1 in both themes |
| Responsive | pass | CDP device-metrics capture at actual 320px and 1280px context; `clientWidth == scrollWidth`, no overflow nodes, all links within the viewport |
| Image failure | pass | H1, lead, complete outline, all proof links, Open loop, and CTA remain |
| Public links | pass | three Issue comments, Issue #6, and writing-loop-harness returned HTTP 200 |
| Historical baseline | pass | old run has no diff; tree `341de507f7a7280e505b932bf92cadbd00350388` |
| Concept regression | pass | 4/4 concept tests and render drift check |
| Capability-router regression | pass | 10/10 local Skill contract tests, including the six launch-routing cases |
| Route integrity | pass | append-only revision history verified through sealed revision 006; evaluation outputs have unique responsibility ownership |

## Screenshot inventory

| File | Viewport / mode | Purpose |
|---|---|---|
| `profile-v2-860-light.png` | 1280 context / light / 860 README | Desktop composition and platform competition |
| `profile-v2-860-dark.png` | 1280 context / dark / 860 README | Dark tokens and Evidence boundary |
| `profile-v2-320-light.png` | 320 / light | Reflow and Hero weight |
| `profile-v2-320-dark.png` | 320 / dark | Narrow dark projection |
| `profile-v2-320-images-disabled.png` | 320 / light / images off | Semantic and action fallback |

`dom-metrics.json` is the machine-readable record for all five captures. The
first narrow screenshots were rejected during independent review because
Chrome's command-line `--window-size=320` retained a larger layout viewport and
cropped the bitmap. The evidence above was recaptured with CDP
`Emulation.setDeviceMetricsOverride`; no product source or visual contract was
changed to obtain the passing result.

## Evidence gap

This local evidence does not reproduce GitHub's final CDN/cache timing. The
README uses only documented GFM headings, links, relative images, and
`prefers-color-scheme` theme sources; the final Draft PR branch render remains a
platform smoke check after push.
