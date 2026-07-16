# Specification — Pixel Oak monument poster revision

Status: planning; high-impact composition decisions remain delegated to the
design controller.

## User-authorized evidence boundary

No external participant study is required for this revision. Synthetic model
observations may inform reversible design work but are not acceptance-bearing
human research and cannot block implementation or release. Acceptance is based
on the user-approved direction, the appointed design controller's artifact
review, deterministic repository tests, responsive/theme evidence, and the
user's review of the updated Draft PR.

## Outcome

Replace the rejected Ring Ledger launch candidate with a GitHub Profile whose
first impression is a mature pixel Oak monument and whose complete page reads
as one extreme-minimal visual poster. Preserve the real experiment, evidence,
Open Loop, and counterexample action without presenting fabricated interface
behavior.

## Primary audience and task

Fellow builders and potential collaborators arrive through GitHub. They should
recognize a distinct Cooper Oak identity immediately, understand the human-
control positioning, and then verify the work through public proof or submit a
counterexample.

## Locked art direction

- Pixel visual poster.
- Double-shoulder single-canopy Oak monument.
- Extreme giant-poster minimalism.
- Bone white, near black, forest green, and a small signal-lime accent.
- Flat, deterministic local SVG with integer-pixel geometry.

## Core silhouette contract

- Master model: `32u × 24u`, 4:3, one connected silhouette.
- Canopy: 30–32u wide, 14–16u high, three or more stepped advances/recesses per
  shoulder, 62%–72% occupancy of its bounding region.
- Fork: inherited Y topology; each main branch ≥4u; central negative opening
  ≥3u wide and ≥4u deep.
- Trunk: continuous, ≥5u at the narrowest point, expanding to 7–9u at roots.
- Roots: 14–18u span, direct from the trunk, no circle, badge, platform, pot, or
  separate base.
- Optical corrections are whole-unit moves only. No curves, rounded smoothing,
  gradients, highlights, bevels, shadows, or fake antialias geometry.
- Desktop visible Oak width ≥420 CSS px. True 320px visible size ≥168×120 CSS
  px; rendered `u` ≥5 CSS px.

## Content truth and platform contract

- `profile.json` remains the authoring source; generated outputs are not edited
  directly.
- Identity, proof, links, Open Loop, and `提交反例` remain real GFM and real
  public destinations.
- Theme projection uses deterministic local assets. Narrow safety must be true
  of the same production composition rather than a viewport-only substitute.
- Images disabled or broken must leave the complete identity and action path.
- GitHub Profile remains static. No fake controls, telemetry, product states,
  customer proof, or interaction chrome.

## Hero poster composition

- Canvas: one fixed `54u × 36u` / 3:2 viewBox for light and dark.
- Oak bbox: `(20u, 6u, 32u, 24u)`; complete canopy, trunk, and roots remain
  inside the canvas with zero crop.
- Negative space: left `20u`; at least 85% remains empty. No identity copy,
  coordinates, grids, scales, folio arrays, HUD marks, or fake data enters the
  SVG. One removable unlabeled signal block no larger than `2u × 2u` may be
  tested as optical counterweight.
- Markup sequence: `picture → H1 → lead → thematic break → next H2`, with no
  badge, secondary art, CTA, social row, table, or centered wrapper between.
- The same geometry must yield about `510 × 382 CSS px` for the Oak at an 860px
  content width and at least `168 × 120 CSS px` in a real 320px viewport.
- `preserveAspectRatio="xMidYMid meet"`; no `slice`, viewport-specific asset,
  theme-specific movement, or non-integer geometry.

## Color and material projection

| Token | Value | Role |
|---|---|---|
| `poster.bone` | `#F2EFE4` | Light paper; dark structure face |
| `poster.ink` | `#0D100E` | Dark paper; light structure face |
| `poster.forest` | `#347A55` | Immutable Oak material |
| `poster.signal` | `#3B9648` | Immutable one-block optical signal |

- Light: bone background, forest Oak, ink structure face, signal block.
- Dark: ink background, forest Oak, bone structure face, signal block.
- Real fork/root negative spaces expose the active background and are not
  painted with the structure token.
- Source area targets: background 70%–75%, forest 20%–24%, structure 4%–6%,
  signal exactly `4u²`; forest is at least 75% of the colored Oak entity.
- Approved minimum contrast: forest/bone ≈4.49:1, forest/ink ≈3.70:1,
  signal/bone ≈3.23:1, signal/ink ≈5.14:1, bone/ink ≈16.62:1.
- No fifth visible color, derived theme green, opacity, gradient, blur, glow,
  shadow, mask feather, animation, or color-matrix inversion.

## GFM continuation grammar

- Native H1, lead, H2/H3, body, lists, and links share one left axis.
- Top-level H2 headings use one consistent two-digit folio grammar.
- Each top-level section starts with its most important true statement rather
  than a badge or metadata row.
- Experiment fields remain open semantic text, not cards.
- One thematic break separates adjacent top-level sections.
- Pixel identity comes from the monument, picture field, folio rhythm, strict
  section cuts, and sparse signal color—not repeated icons, code blocks, square
  characters, terminal panels, or per-section SVG signs.
- H2 outline is exactly `02 / Current Experiment` through
  `05 / Discuss on GitHub`; H3 is exactly Question, Hypothesis, Evidence, Next.
- The page has exactly four top-level thematic breaks and one Markdown blank
  line between blocks. No forced line break, spacer HTML, table, card, badge,
  details, blockquote, or custom CSS may create the rhythm.
- Proof is exactly three linked natural-language sentences; principles exactly
  three short links; Open Loop exactly one paragraph and one repository link;
  the counterexample CTA exactly one native link in Discuss.
- The root field is directly adjacent only to Evidence, proof, and Next within
  Current Experiment. It does not move the CTA out of the final Discuss section.
- Field-specific word and rendered-line budgets are canonical in
  `visual-design-spec.md`; 860px and real 320px DOM line/bounds evidence is
  required before release.

## Image-failure contract

- Hero alt: `Pixel oak monument`.
- Missing or disabled images leave no fixed 3:2 empty frame; H1, lead, section
  outline, proof, and actions move up naturally.
- Expected accessible order: short image alt → unique H1 → lead → separator →
  next H2.

## Required concept proof before UI mutation

Produce at least three reversible silhouette/composition variants that all obey
the locked skeleton but differ in meaningful crown rhythm, fork negative space,
root stance, or Hero occupancy. Compare them in monochrome, light/dark, desktop,
and 320px. A selected concept must pass the unprompted recognition gate before
being promoted to canonical visual design.

## Acceptance

1. Without name or color, at least 4/5 unprompted observers identify the
   silhouette as a tree or Oak and recall the wide crown plus central trunk.
2. With images enabled, the whole page reads as one authored pixel-poster
   system rather than a decorative image followed by default Markdown.
3. With images disabled, identity, evidence, links, and action remain complete.
4. Desktop and true 320px light/dark renders have no crop, overflow, weak fork,
   collapsed root, small-logo regression, or toy/game/HUD reading.
5. A fresh independent release reviewer—different from the design controller
   and implementation actor—passes the delivered artifact.

## Open decisions

- D07: the design controller must select or reject the three D04 concept
  variants from their light/dark, monochrome, 860px, and 320px evidence.
- D07 is the final high-impact preference question. Production asset roles are
  mechanically derived from the selected declarations and capability route.

## Non-goals

- Re-litigating public product facts already proven in Issue #6.
- Changing the GitHub account avatar during this Draft launch revision.
- Building an interactive site, custom CSS runtime, or dashboard outside the
  GitHub Profile surface.
- Rewriting or backfilling the old accepted run or sealed evaluation.
