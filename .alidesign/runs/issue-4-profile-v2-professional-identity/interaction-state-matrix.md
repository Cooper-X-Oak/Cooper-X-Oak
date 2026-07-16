# Profile v2 interaction and failure-state matrix

Status: static behavior declaration.

| State or condition | Applicable | Required behavior | Verification |
|---|---:|---|---|
| Default link | yes | Native GFM/browser anchor; truthful accessible name and HTTPS target | DOM/link inspection |
| Hover / active / visited | yes | Platform/browser defaults; no author CSS or SVG imitation | Preview and GitHub render |
| Keyboard focus | yes | Every proof, principle, repository, and counterexample link follows document order with visible native focus | Keyboard smoke |
| Light theme | yes | Light SVG projections and native GFM remain readable | 860/320 screenshots |
| Dark theme | yes | Dark SVG projections and native GFM remain readable; black marker keeps a visible boundary | 860/320 screenshots |
| 320px reflow | yes | Same production assets and single GFM column; no viewport asset switch or horizontal scroll | screenshot and overflow check |
| Image unavailable | yes | H1, lead, full outline, experiment facts, links, and CTA remain unchanged | broken-path screenshot and outline diff |
| Long wrapping | yes | Headings, question, proof sentences, and repository name wrap without crop | 320px and zoom inspection |
| Script unavailable | yes | No script is required for README or preview content | static-source inspection |
| Custom motion | no | Omitted: static GFM has no task-bearing transition or animation | route `motion: not_applicable` |
| Loading / empty / retry / permission | no | No custom data fetch, form, or private destination exists | source and link inventory |
| Destructive action | no | README exposes none | semantic inspection |

Image failure is loss of optional identity geometry, not loss of product meaning.
If any meaningful text, URL, heading, or CTA disappears with an image, return to
`component_domain` and repair `visual_design.asset_projection`.
