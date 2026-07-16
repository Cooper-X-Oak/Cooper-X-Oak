# Specification — Pixel Oak whole-page interface

## Intent

Make the Profile feel authored as one complete interface, not as default
Markdown decorated by a Hero and an Evidence image. The design language is a
public working ledger: explicit declarations, bounded proof, unfinished work,
and a visible route for counterexamples.

## Primary visitor task

Within one scan, understand who Cooper Oak is, what experiment is active, what
has actually been demonstrated, what remains unfinished, and where to challenge
the claim.

## Required content

- `COOPER OAK` and the human-control lead.
- Capability Routing context, Question, Hypothesis, Evidence, and Next.
- Exactly three public proof links.
- Exactly three linked operating principles.
- One honest `writing-loop-harness` continuity statement.
- One contextual `提交反例` link.

## Composition contract

1. Hero remains the first visual object and is byte-frozen.
2. Identity and current experiment form a compact opening register rather than
   two unrelated vertical sections.
3. Question/Hypothesis/Evidence/Next become one semantic field/value ledger;
   Evidence retains the black root marker as a full-width interruption.
4. Principles become a numbered three-cell operating strip.
5. Open Loop and Discuss form a closing two-part matrix with visibly different
   responsibilities: unfinished record versus action.
6. The page ends on the real counterexample link, not on decorative copy.

## Prohibitions

- No SVG edits, regeneration drift, new visual asset role, gradients, shadows,
  motion, badge wall, telemetry, fake controls, fake metrics, or terminal shell.
- No CSS dependency or assumption that GitHub retains arbitrary style rules.
- No content duplicated into images.
- No wide unbreakable token or table configuration that forces page-level
  horizontal scrolling at 320px.

## Acceptance evidence

- Frozen SHA-256 checks for all four SVGs.
- Generator contract tests and drift check.
- DOM outline/table/link checks.
- 860 light/dark, 320 light/dark, and 320 images-disabled renders with viewport,
  scroll-width, table, and link bounds.
- Independent release-mode design review.
