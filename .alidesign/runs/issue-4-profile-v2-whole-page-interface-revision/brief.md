# Design run: issue-4-profile-v2-whole-page-interface-revision

- Project: `Cooper-X-Oak-profile-issue-4`
- Mode: `full`
- State: `discovery`
- Milestone: [M004](../../milestones/M004.md)
- Issue: [AD-004](../../issues/AD-004.md)
- Created: `2026-07-16T07:21:08.745855Z`

## Task

Redesign the complete GitHub Profile page system while preserving the two current Pixel Oak visual roles byte-for-byte

## Current authority and gaps

- User authority freezes the current Hero and Evidence SVGs and directs the
  revision toward the rest of the page.
- Project authority requires `profile.json` authoring, deterministic generation,
  GitHub/GFM platform fit, real public evidence, and Draft PR delivery.
- The previous accepted run remains historical authority for Pixel Oak assets
  and content truth, but its `gfm_poster_page_grammar` is superseded for this
  run because it is the diagnosed cause of the unchanged overall design.
- `$review-design-quality` governs general coherence, responsive resilience,
  accessibility, and anti-template review. It cannot invent product facts.
- GitHub provides no repository CSS surface. Layout must be expressed through
  semantic GFM/HTML that degrades safely.
- No blocking content or brand fact is missing. Exact grid proportions remain
  reversible craft choices subject to render evidence.

## Boundary

- In scope: `profile.json`, README/profile generator, generated README and local
  preview, contract/evidence tooling, and run records.
- Frozen: `assets/profile-signature-light.svg`,
  `assets/profile-signature-dark.svg`, `assets/profile-evidence-light.svg`, and
  `assets/profile-evidence-dark.svg`.
- Out of scope: avatar, repository Pins, contribution graph, GitHub global CSS,
  new claims, new metrics, new controls, automatic PR merge.

## Success

The first screen establishes identity and the active experiment as one composed
interface; the middle behaves as an inspectable field/evidence ledger; the end
separates operating principles, unfinished work, and the single counterexample
action. The change must remain obvious when the two SVGs are visually ignored.

## Required artifacts

- Keep specifications, IA, component/domain maps, interaction matrices, decisions, evidence, evaluation, and feedback for this run under this directory.

## Next legal transition

Seal capability routing revision-001 and resolve `authority_resolved`.
