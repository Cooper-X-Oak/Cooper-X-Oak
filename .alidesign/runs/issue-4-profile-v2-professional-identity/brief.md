# Design run: issue-4-profile-v2-professional-identity

- Repository: `Cooper-X-Oak/Cooper-X-Oak`
- GitHub Issue: `#4`
- Branch: `feat/4-profile-v2-professional-identity`
- Mode: `full`
- State: `planning`
- Milestone: [M002](../../milestones/M002.md)
- Design issue: [AD-002](../../issues/AD-002.md)
- Baseline commit: `82a6dce8495cfabd18fddb9726d215696e98cdf1`
- v1 run tree: `341de507f7a7280e505b932bf92cadbd00350388`
- Created: `2026-07-15T12:52:48.105404Z`

## Task

Rebuild Profile v2 from a professional, evidence-backed AI-native positioning
and three materially different art-direction hypotheses. Do not continue
micro-tuning the v1 banner.

## Why this run exists

Profile v1 correctly removed the fake console, toy controls, unsupported claims,
and dashboard shell. It is retained as the old-contract engineering baseline.
Its remaining weakness is higher-order: the page says what Cooper has built but
does not yet establish a distinctive professional thesis or make the strongest
AI-native work the organizing identity.

## Historical boundary

- Do not edit, migrate, backfill, rescore, or reinterpret
  `.alidesign/runs/issue-2-profile-redesign/**`.
- In particular, preserve its `state.json`, decisions, evidence, feedback, and
  `evaluation/round-001/**` exactly as merged.
- v1 is evidence and contrast, not a visual template for v2.
- All new route decisions, evaluation rounds, and evidence belong to this run.

## Current authority

- User: use AliDesign capability routing, restart from positioning and three art
  directions, and preserve old history.
- Repository: `AGENTS.md` defines the source of truth and GitHub standard
  development workflow.
- Platform: a static public GitHub Profile README rendered by GFM.
- Facts: public GitHub API snapshot and repository evidence dated 2026-07-15.
- Planning method: `$evidence-clarity-loop`.
- Reversible concept-quality guidance: `$review-design-quality`.
- Workflow/gates: `$alidesign-engineering` revision-001.

## Current gaps

- No Cooper-specific personal-brand art-direction production provider is
  resolved. `visual_art_direction` remains `missing`.
- The final public role label, conversion target, flagship AI project, contact
  route, and use of the `100 projects` goal remain user decisions.
- IA, visual design, craft, implementation, evidence collection, independent
  review, and final gate providers remain future route work.

## Mutation boundary

This planning run may create only run-scoped evidence, positioning, spec, and
concept documents. It must not modify:

- `profile.json`;
- `README.md`;
- `profile.html`;
- `artifacts/build_profile.mjs`;
- `assets/profile-signature-*`.

Those paths remain behind `ui_mutation` until a later sealed route resolves the
art-direction, craft, and implementation capabilities.

## Next legal transition

Remain in `planning` while the user reviews the positioning, role label,
flagship proof, and three hypotheses. Do not claim `planning_ready` while
`information_architecture`, `ia_variants`, or the user/provider choices behind
`visual_art_direction` remain missing. The next route change must append
`revision-002`; revision-001 is sealed history.
