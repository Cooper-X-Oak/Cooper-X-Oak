# Canonical visual design — Pixel Oak monument poster

Status: canonical for the implementation bridge. D01–D06 and the D03/D04
artifact projection are locked by the user-appointed design controller.

## `visual_design.oak_monument_skeleton`

- One connected `32u × 24u` double-shoulder single-canopy Oak.
- 30–32u canopy width and 14–16u canopy height, with at least three stepped
  advances/recesses on each shoulder.
- Y fork: branches ≥4u; true central negative ≥3u wide and ≥4u deep.
- Trunk: ≥5u at narrowest, expanding to 7–9u at roots.
- Roots: 14–18u span, direct from trunk, with no base, circle, platform, pot,
  or badge.
- Integer coordinates only; whole-unit optical correction only.
- The forest-only silhouette must still read as a mature tree/Oak.

## `visual_design.hero_poster_composition`

- Shared viewBox: `0 0 54 36`, 3:2, `xMidYMid meet`.
- Oak bbox: `(20u, 6u, 32u, 24u)`, zero crop.
- Left field: `20u`; at least 85% empty. No copy, coordinate, grid, scale,
  status, or HUD. One removable `2u × 2u` signal block is the only candidate
  optical mark.
- Projection targets: Oak ≥420 CSS px wide around an 860px content width and
  ≥168×120 CSS px at true 320px.
- Markup adjacency: `picture → unique H1 → lead → hr → next H2`.
- Images-disabled: short `Pixel oak monument` alt, no persistent empty frame,
  and complete native identity/content/action.

## `visual_design.hero_color_material_projection`

```text
bone   #F2EFE4
ink    #0D100E
forest #347A55
structure-light #5C8E70
structure-dark  #285F45
signal #3B9648
```

- Forest and signal are immutable across themes.
- Light uses bone background and the muted light forest structure face.
- Dark uses ink background and the deep forest structure face.
- Background/true negative: 70%–75%; forest: 20%–24%; structure face: 4%–6%;
  signal: exactly 4u².
- All identity-critical non-text boundaries ≥3:1.
- Flat opaque fills only; no additional color or material effect.

## `visual_design.oak_structure_plane_topology`

- Oak-local allowed bbox: `x=6u–17u, y=4u–23u`; Hero projection adds
  `(20u, 6u)`.
- One four-neighbor connected structure face with zero holes and zero branches.
- Functional zones overlap into one shape: crown interior, left-branch bridge,
  left trunk side, and left-root closure.
- Area `78u²–116u²`, recommended `88u²–100u²`; never over 22% of the colored
  Oak entity.
- Minimum thickness 2u; left-branch bridge ≥3u; no isolated 1u detail.
- At least 1u of forest remains between the structure face and the real Y
  negative; the face never fills or outlines the negative.
- The face does not touch crown top/outer shoulders, right branch/root, or a
  long trunk edge. It meets the outer contour exactly once at the left-root
  bottom in a 3u–5u interval.
- Removing the structure face leaves a complete, recognizable forest Oak.
- Legal comparison variants change only crown/trunk/root area allocation and
  root-exit width: Shoulder-weighted, Balanced, Grounded.

## Page grammar

- One left GFM axis below the right-heavy poster.
- Consistent two-digit folio H2 headings.
- One primary true statement first in each section.
- Experiment fields remain open H3/text, not cards.
- One thematic break between top-level sections.
- No repeated Oak icons, per-section signs, code-panel simulation, fake
  controls, or visual metadata that does not exist in the product facts.

## `visual_design.evidence_root_field`

- Visual role: the only full-width near-black chapter field after Hero.
- ViewBox: `0 0 54 14` (27:7); one theme-invariant local asset is preferred.
- Geometry provenance: production Oak local crop `x=7u–25u, y=17u–24u`,
  transformed exactly 2× to destination `x=18u–54u, y=0u–14u`.
- Includes lower trunk, left/right roots, real root negatives, and the D04
  structure-face exit. Excludes canopy, complete Y, complete Oak, and signal
  from the source crop.
- Left field `x=0u–18u` remains ink and may contain one separate signal at
  `x=4u–6u, y=8u–10u`.
- Both themes use ink background, forest root, bone structure face, and signal;
  geometry and colors are identical.
- Area targets: ink/negative 64%–72%, forest 22%–29%, bone 4%–7%, signal 4u².
- Empty alt. Direct order inside Current Experiment: decorative root field →
  Evidence H3 → exactly three proof links → Next H3 → honest next paragraph.
- The counterexample action is not adjacent to the root field or Next. It
  remains the unique native link in `05 / Discuss on GitHub`, after Working
  Principles and Open Loop, as required by the selected information
  architecture.
- The visual contains no heading, proof, URL, Next, CTA, number, grid, node,
  line, or technology-diagram semantics.
- Images-disabled removes the visual pause but preserves all proof and action.

## Artifact recognition acceptance

At true 320px and without typography, the complete silhouette remains at least
`168 × 120 CSS px`, reads as one wide-canopy Oak, and preserves its central Y
negative, trunk and roots. The frozen D03/D04 projection is reviewed directly
at 860px and 320px in both themes. No human study is required or implied.
Synthetic model observations are heuristic history only and cannot block a
state gate, UI mutation, evaluation, or release.

## `visual_design.d03_d04_projection`

- Frozen silhouette SHA-256:
  `395c18d10bb21004519f0134ac2dfbeb4b2686323d9b357fd46c4958e2335203`.
- Frozen structure topology SHA-256:
  `0c0c241fcce8c7c888e7c1ae36cd8863e4b2c474d9bebcf00d92a5fb01ebdd7e`.
- Oak stays `#347A55` in both themes.
- The internal facet is `#5C8E70` on bone and `#285F45` on ink. It is a
  subordinate forest-family material face, never a polar cutout or a second
  object.
- Backgrounds remain bone `#F2EFE4` and ink `#0D100E`; the signal remains
  `#3B9648`.
- D03 is accepted and D04 is the reversible shallow-facet selection. The
  silhouette and topology are frozen; craft may tune only declared projection
  and spacing tokens without inventing new geometry.

## `visual_design.gfm_poster_page_grammar`

- This declaration projects, and never overrides,
  `information_architecture.reading_spine`.
- H2 outline is fixed to `02 / Current Experiment`, `03 / Working Principles`,
  `04 / Open Loop`, and `05 / Discuss on GitHub`. The folio and its title remain
  together; H2 is one line at 860px and at most two lines at 320px.
- Current Experiment H3 allowlist and order are exactly Question, Hypothesis,
  Evidence, Next. Each remains a single rendered line at 860px and 320px.
- Context is one sentence/one paragraph; Question is one question/one
  paragraph; Hypothesis is one or two sentences/one paragraph; Evidence is one
  three-item linked list with no intro/outro; Next is one sentence/one
  paragraph.
- Proof is exactly three natural-language link sentences, 12–22 words
  recommended and 26 words maximum each. Principles is exactly three links,
  3–6 words recommended and 8 words maximum each.
- Open Loop is exactly one 2–3 sentence paragraph, 36–52 words recommended and
  60 words maximum, linking `writing-loop-harness` once.
- Discuss has one 14–24 word context sentence followed by the unique native CTA
  link. The Chinese CTA is 2–8 Han characters and one line at 320px.
- The page contains exactly four top-level thematic breaks: after Identity,
  Current Experiment, Working Principles, and Open Loop. There is no closing
  break after Discuss and no break inside Current Experiment.
- Source blocks use exactly one Markdown blank line. No `<br>`, `&nbsp;`, empty
  HTML block, repeated blank line, table, blockquote, code fence, details,
  badge, fake control, or custom CSS is used to manufacture spacing.
- Hero adjacency is `picture → H1 → lead → hr → Current Experiment`. Evidence
  adjacency is `root field → Evidence H3 → three proofs → Next H3 → Next copy`.
- URLs are hidden behind descriptive link text; no raw URL, SHA, comment ID, or
  query string is visible. Mixed Chinese/English copy uses ordinary semantic
  spacing and punctuation, without zero-width break insertion.
- At 860px: all H2/H3 are within their line limits, each proof is at most two
  lines, each principle one line, Open Loop at most three lines, and CTA one
  line. At a real 320px layout viewport: H2 ≤2 lines, proof ≤5 lines each,
  principle ≤2 lines each, Open Loop ≤9 lines, CTA one line, all link bounds are
  inside the viewport, and `scrollWidth === clientWidth`.
- Rendered line counts come from DOM client rects or an equivalent observable
  measurement and are paired with whole-page 860px/320px evidence.
- With images disabled, the heading outline, four thematic breaks, links,
  section order, and CTA remain complete; no fixed image frame or double break
  remains.
