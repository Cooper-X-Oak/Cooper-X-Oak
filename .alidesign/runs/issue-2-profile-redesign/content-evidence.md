# Content evidence inventory

Snapshot date: 2026-07-15. Public GitHub facts may change; durable copy avoids
hard-coding volatile counts unless the generator acquires them at build time.

## Verified identity

- Name: `Cooper Oak`.
- Public bio: `Building game mods, AI tools, and weird useful projects in
  public. Started from scratch in 2026. Goal: 100 projects.`
- Public avatar: two-color pixel mark, `#6ed959` on `#f0f0f0`.
- No public website, location, company, Twitter/X handle, or contact link was
  returned by the GitHub profile API.

## Selected project evidence

### LongYinMod_RisingFame — released software

- Repository: https://github.com/Cooper-X-Oak/LongYinMod_RisingFame
- Proof: https://github.com/Cooper-X-Oak/LongYinMod_RisingFame/releases/latest
- Public evidence at snapshot: 20 stars, 3 forks, 6 releases; README documents
  installation, support boundaries, troubleshooting, changelog, and issue path.
- Safe durable claim: a released BepInEx mod for LongYinLiZhiZhuan with
  documented installation and support boundaries.

### goal-to-do — installable tool

- Repository: https://github.com/Cooper-X-Oak/goal-to-do
- Proof: https://github.com/Cooper-X-Oak/goal-to-do/tree/main/skills/goal-todo
- Release: https://github.com/Cooper-X-Oak/goal-to-do/releases/tag/v0.1.0
- Public evidence at snapshot: 3 stars and one release; README provides direct
  `$skill-installer` and local installation instructions plus verification.
- Safe durable claim: an installable Codex skill that turns vague long-running
  tasks into aligned `/goal` prompts.

### valvetrade-pipeline — tested system

- Repository: https://github.com/Cooper-X-Oak/valvetrade-pipeline
- Proof: https://github.com/Cooper-X-Oak/valvetrade-pipeline/actions/runs/28073647116
- Public evidence: database migrations, guard tests, RLS isolation tests,
  deduplication tests, an embedded-Postgres end-to-end pipeline test, and a
  successful public CI run for typecheck and the full test suite.
- Safe durable claim: a TypeScript/PostgreSQL pipeline skeleton with database
  guards, tenant isolation, deduplication, and end-to-end tests on embedded
  Postgres.

## Secondary public work, not repeated in the v1 selected list

- `awesome-ai-native-os`: a public taxonomy/index draft. Its root README links
  to scene files that are not yet present, so it must not be described as a
  complete atlas with published scene documents.
- `writing-loop-harness`: a file-based agent workflow harness with a declared
  control model and local viewer.
- `taste-of-ai`: a live documentation scaffold whose sampled skill pages and
  Season 1 index are still marked draft/待测; the public evidence directories
  contain only `.gitkeep` placeholders.

These remain discoverable through the repositories page. Their exclusion from
the selected list is an information-hierarchy choice, not a quality judgment.

## Claims to remove or avoid

- `STARTED`, `GOAL`, `MODE`, and `FOCUS` presented as operating telemetry.
- `MAP / ALIGN / ORCHESTRATE / GUARD / SHIP / VERIFY` as if the independent
  repositories form one real runtime workflow.
- `PUBLIC LAB`, `TESTED SKELETON`, `LIVE MANUAL`, and similar self-issued
  statuses when a direct proof link communicates more accurately.
- The generic `CO` application mark; it has no relationship to the public
  avatar and implies a product shell.
- Exact project counts or claims of adoption not derived from public evidence.
- `open-design` as authored flagship evidence: its public README and release
  links identify `nexu-io/open-design`, so it is not used as a personal proof
  without additional ownership context.
- `taste-of-ai` as completed evidence: the public site is live, but the current
  repository content does not support a claim that evaluations have been run
  or evidence has been published.

## Platform evidence

- GitHub describes the Profile README as a top-of-profile place to tell people
  about the author and proud contributions:
  https://docs.github.com/en/account-and-profile/concepts/personal-profile
- GitHub Pins already expose repository descriptions and stars, and support up
  to six items:
  https://docs.github.com/en/account-and-profile/reference/profile-reference
- GitHub-flavored Markdown supports relative repository images, anchors, and
  `<picture>` for light/dark variants:
  https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
