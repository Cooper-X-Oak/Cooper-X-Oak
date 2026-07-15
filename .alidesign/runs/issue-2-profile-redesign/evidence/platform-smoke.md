# GitHub branch-render smoke check

- Branch: `feat/2-profile-redesign`
- Initial artifact commit: `b47c09812c524618dcb5689e91e71d7f00920092`
- Pull request: [#3](https://github.com/Cooper-X-Oak/Cooper-X-Oak/pull/3)
- Public branch surface:
  `https://github.com/Cooper-X-Oak/Cooper-X-Oak/tree/feat/2-profile-redesign`
- Evidence date: 2026-07-15

## Results

| Check | Desktop light, 1440px | Narrow dark, 390px |
|---|---|---|
| HTTP response | 200 | 200 |
| README H1 | `Cooper Oak` | `Cooper Oak` |
| H2 sections | `Selected work`, `How I work` | same |
| Project H3 count | 3 | 3 |
| `<picture>` / `<source>` | 1 / 3 | 1 / 3 |
| Selected asset | `profile-signature-light.svg` | `profile-signature-mobile-dark.svg` |
| Primary anchor | `#selected-work` | `#selected-work` |
| README horizontal overflow | none | none |
| Signature loaded | yes | yes |

Screenshots:

- [`github-branch-desktop-light.png`](github-branch-desktop-light.png)
- [`github-branch-narrow-dark.png`](github-branch-narrow-dark.png)

The GitHub page emitted transient failures for its own hovercard/sidebar
requests (`ERR_ABORTED` and HTTP 503). The README article, signature asset,
headings, primary anchor, project links, and responsive layout all completed;
the failures are unrelated to repository content.

PR #3 reports `MERGEABLE` with a `CLEAN` merge state. This repository currently
reports no branch checks for the task branch, so local contract tests and the
documented release evidence remain the applicable verification set.
