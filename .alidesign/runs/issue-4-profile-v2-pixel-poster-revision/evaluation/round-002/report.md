# Evaluation round — directed revision R-001

- Run: `issue-4-profile-v2-pixel-poster-revision`
- Round: `round-002`
- Review mode: `release`
- Artifact: regenerated Pixel Oak Profile candidate
- Verdict: `passed`
- Routing revision: `revision-009`
- Independent reviewer: `codex-independent-release-reviewer-pixel-oak`

## Directed revision closure

R-001 is closed. At true 320px with SVG resources blocked:

- Hero height is `24.796875px`, a single alt-text line rather than a 3:2
  vacancy.
- H1 begins `20px` after the broken Hero.
- Decorative Evidence image height is `0px`; no broken-image strip remains.
- `innerWidth === clientWidth === scrollWidth === 320`.
- `overflowNodes=[]` and all eight links remain in bounds.

The implementation keeps intrinsic dimensions on SVG roots, removes HTML
width/height from README images, and no longer forces broken preview images to
full width. It uses no script, custom GitHub CSS, fallback asset, or viewport
asset.

## Release subchecks

| Dimension | Verdict | Evidence |
|---|---|---|
| D03/D04 fidelity | passed | Frozen hashes and forest-family projection unchanged |
| Overall Pixel Oak system | passed | Large Hero, root Evidence field, ledger spine |
| 860 light/dark | passed | Full-page captures; no overflow |
| 320 light/dark | passed | Full Oak, natural wrapping, links in bounds |
| Images disabled | passed | Compact Hero alt, zero-height Evidence image |
| Semantics/accessibility | passed | Native GFM outline and actions remain complete |
| Anti-template/platform fit | passed | Cooper-specific system within supported GFM |
| Engineering verification | passed | 22/22, six outputs current, XML, route history, diff check |

## Accepted exceptions

- Raw Brave CDP remains the evidence collector because bundled Playwright lacks
  `playwright-core`; observed metrics and screenshots are complete.
- No human or synthetic recognition gate applies.
- GitHub branch-render smoke check is required after push and remains
  non-blocking until the branch is updated.

## Verdict

No blocking issue or directed revision remains. Allow `evaluation_passed`,
commit, push the existing Draft PR, and perform the GitHub branch-render smoke
check. Automatic merge remains prohibited.
