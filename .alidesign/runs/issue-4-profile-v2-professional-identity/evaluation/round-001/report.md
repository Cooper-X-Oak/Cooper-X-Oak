# Evaluation round

- Run: `issue-4-profile-v2-professional-identity`
- Round: `round-001`
- Review mode: `independent_release_review` applying the project `release` profile
- Artifact: generated GitHub Profile v2 (`README.md`, `profile.html`, and four Ring Ledger SVG projections)
- Reviewer: `codex-design-evaluator-019f664b-38d1-79f3-ba6b-2a9c059f5c6c`
- Verdict: `passed`
- Approximate release-quality result: `8.9 / 10`

## Applicable rules

- Decisions Q61–Q65 in `decision-contract.md`.
- `visual-design-spec.md`, `craft-criteria.md`, `implementation-authority.md`, and `interaction-state-matrix.md`.
- `.alidesign/evaluation-profile.yaml`, release mode and its blocking conditions.
- AliDesign evidence separation, independent review, append-only routing/evaluation, and gate-resolution rules.
- GitHub Profile README platform constraints: native GFM semantics, local assets, and documented theme projection.

## Evidence collected

- Independent source audit of `profile.json`, generator, tests, generated README/preview, four production SVGs, canonical declarations, and artifact route revision 005. Gate-only revision 006 preserves every provider, actor, input, artifact, and verdict while assigning `implementation-verification.md` / `dom-metrics.json`, `report.md`, and `evidence.json` to evidence collection, independent review, and gate resolution respectively.
- Independent rerun: Profile contract tests `21/21`, six generated files current, concept regression `4/4`, four SVGs parse as XML, route SHA verified, and `git diff --check` clean.
- Visual review of 860-context light/dark, actual 320px light/dark, and actual 320px image-disabled screenshots.
- `evidence/dom-metrics.json`: five CDP captures; each document has `clientWidth == scrollWidth`, no overflow nodes, and link bounds inside the viewport. All three narrow states use an actual 320px layout viewport.
- Public verification of Issue #6, its three proof comments, `writing-loop-harness`, and Draft PR #5.
- History check: Profile v1 run remains unchanged at tree `341de507f7a7280e505b932bf92cadbd00350388`.

### Rejected evidence corrected before verdict

The reviewer rejected the first three 320px captures because Chrome's bare
`--window-size=320` retained a wider layout viewport and cropped the output
bitmap. The rejected captures are retained in this sealed round as
`invalid-320-*.png`; they are not release evidence. Before this round received
or stored a verdict, evidence collection was repeated through CDP
`Emulation.setDeviceMetricsOverride`. The replacement screenshots and
`dom-metrics.json` prove `innerWidth = clientWidth = scrollWidth = 320`,
`overflowNodes = []`, all links inside the viewport, and the counterexample CTA
at `224.3125..288.3125`. No product source, generator, README, SVG, or canonical
visual contract changed during this evidence correction.

## Evidence gaps

- Non-blocking until push, then mandatory: smoke-check GitHub's actual Draft PR branch render, CDN assets, theme selection, links, and narrow page behavior. Any platform regression requires stopping delivery and appending another evaluation round.

## Q61–Q65 acceptance

| Decision | Verdict | Evidence |
|---|---|---|
| Q61 open editorial translation | pass | Critical identity, experiment, proof, next step, open loop, and CTA remain native GFM at 860/320, both themes, and image failure; SVGs contain no critical copy. |
| Q62 one source and theme projections | pass | Two visual roles with light/dark structurally equivalent projections; no viewport source or third mobile runtime asset; the same geometry is 320-safe. |
| Q63 decorative Evidence threshold | pass | Empty-alt non-semantic marker immediately precedes the native Evidence H3; three proofs and CTA occur only once in GFM; the black field remains unique and non-terminal-like. |
| Q64 cross-row reverse lock | pass | `picture → H1 → lead → experiment`; no table or duplicate identity copy; Hero bbox is 36% × 78.8% with a 60-unit safe edge and remains a clear 320px anchor. |
| Q65 two-level ledger spine | pass | One H1; H2 02–05; H3 Q/H/E/N; three principles; one open-loop record; one counterexample CTA; three top-level rules; only two visual roles. |

## Subchecks

| Dimension | Check | Verdict | Evidence | Rule | Owner phase | Blocking |
|---|---|---|---|---|---|---|
| Coherence / hierarchy | Single editorial reading spine | pass | 860 and 320 render matrix; heading outline | `visual_design.page_grammar` | `component_domain` | no |
| Authenticity / anti-template | Cooper-specific identity-to-evidence relationship | pass | Ring/Oak geometry, Issue #6, proof ledger, open loop, counterexample action | anti-template acceptance in Q65 | `component_domain` | no |
| Accessibility / semantics | Native content, names, order, focusable links, image failure | pass | README audit and image-disabled capture | Q61, Q63; `craft.accessibility` | `interaction_states` | no |
| Responsive behavior | No clipping or horizontal overflow | pass | CDP metrics and corrected 320 screenshots | Q62, Q64, Q65; release profile | `implementing` | no |
| Theme projection | Meaningful light/dark tokens with common geometry | pass | normalized SVG structure and render matrix | `visual_design.asset_projection` | `component_domain` | no |
| Craft / visual polish | Flat restrained hierarchy, right-heavy Hero, one black field | pass | light/dark and wide/narrow original images | `craft-criteria.md` | `implementing` | no |
| Content truth / actionability | Claims link to narrow public proof; CTA is real | pass | Issue #6, three comments, repository link, CTA | claim-proof map and Q61 | `information_architecture` | no |
| Platform fit | Native GFM plus local theme assets; graceful image failure | pass | README source, generated preview, platform contract | GitHub Profile README contract | `implementing` | no |

## Blocking issues

None.

## Accepted exceptions

- The in-app Browser Skill's required runtime tool was unavailable. Local Chrome CDP is accepted because the evidence includes actual viewport, scroll width, overflow-node, link-bound, theme, and image-failure records.
- Two unreferenced, ungenerated, unmodified v1 mobile SVGs remain as legacy files and are not v2 production roles.
- The account avatar remains v1 while the README introduces Ring Ledger, as required by the approved dual-mark transition.
- Replacing the invalid first captures before verdict is accepted because the round was still draft and unsealed; the rejection and correction are explicitly retained.

## Directed revisions

None.

## Anti-template conclusion

Passed. The design derives from a project-specific causal chain—Ring Ledger
identity, declared capability-routing experiment, three linked public proofs,
an honest unfinished loop, and counterexample feedback—rather than from card,
badge, terminal, dashboard, metric, or icon-pack conventions.

## Next legal transition or stop reason

`evaluation_passed → accepted`, followed by complete repository verification,
commit, push to the existing Draft PR #5, and a mandatory GitHub branch-render
smoke check. Automatic merge remains forbidden.
