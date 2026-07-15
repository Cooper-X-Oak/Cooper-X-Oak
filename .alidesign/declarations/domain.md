# Domain declaration

## Product objects and terminology

- **Profile:** The complete GitHub page. README is one region; avatar, Bio,
  Pins, contributions, and activity are native GitHub regions outside it.
- **Profile README:** A static, public, GitHub-flavored Markdown introduction
  and work-discovery surface.
- **Signature visual:** One non-interactive editorial image that establishes
  identity. It is not a hero application, dashboard, or navigation surface.
- **Selected work:** Exactly three public repositories chosen by proof quality
  and breadth, not by equal category quotas.
- **Project proof:** A public destination that substantiates a durable claim:
  a release, installable source, tests, or successful CI.
- **Primary path:** The native Markdown link from the introduction to
  `#selected-work`.
- **Goal:** `100 projects` is the author's stated aspiration. It is not a
  progress metric and must never be formatted as telemetry.
- **Build in public:** A positioning statement supported by public repositories
  and activity, not a live operating mode.

## Users, roles, permissions, and responsibility boundaries

- **Visitor:** May read the public profile and follow public links. No account
  action, form, or custom interaction is required.
- **Maintainer:** Updates `profile.json`, verifies public evidence, generates
  outputs, and runs the release evaluation.
- **Generator:** Projects validated content into README, preview HTML, and SVG.
  It cannot invent content, status, metrics, or IA.
- All selected proof must be accessible without private repository permission.

## States, severity, risk, and status semantics

- Allowed proof kinds: `release`, `install`, `tests`, `ci`, `documentation`.
- Proof kinds describe the linked artifact; they are not maturity badges.
- A broken primary anchor, broken selected-work link, unsupported claim, or
  unreadable final rendering is release-blocking.
- A temporarily unavailable secondary repositories link is still a defect but
  does not justify replacing it with a fake local control.
- Do not publish `PUBLIC LAB`, `RELEASED`, `LIVE`, `SHIPPING`, `MODE`, or
  similar self-issued UI states. The direct proof link is the state evidence.

## Sensitive data and reveal rules

- Publish only data already visible on the public GitHub profile or selected
  public repositories.
- Do not publish email, private social accounts, local paths, credentials,
  private repository names, or private contribution details.
- Volatile counts may exist in internal evidence snapshots but are excluded
  from durable Profile copy.

## Dangerous or irreversible operations

- The README has no destructive operation.
- Git merge, Issue close, branch deletion, worktree removal, and profile-setting
  changes remain governed by `$apply-repo-workflow` and are outside design
  component semantics.

## Domain-specific evidence and compliance sources

- `.alidesign/runs/issue-2-profile-redesign/content-evidence.md`
- GitHub public Profile, repository READMEs, release pages, tests, and CI.
- GitHub Profile README, profile reference, and Markdown documentation linked
  by `.alidesign/manifest.yaml`.

## Unknowns that block design decisions

- None for the selected work-discovery task.
- A verified contact destination is absent and deliberately excluded. It would
  require a new content decision before a future contact CTA is added.
