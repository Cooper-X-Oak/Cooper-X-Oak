# Decisions for issue-4-profile-v2-pixel-poster-revision

Record decisions that affect the current run. Do not promote a decision into project-wide policy without explicit approval.

| Date | Decision | Authority | Scope | Consequence |
|---|---|---|---|---|
# Decisions — Profile v2 pixel-poster revision

## D00 — Revoke unauthorized human-recognition gate

- User decision: the previously proposed five-person recognition study was
  never authorized and is not a project, implementation, evaluation, or
  release requirement.
- No human participant was contacted and no human-research evidence exists.
- Existing isolated model-session observations remain append-only internal
  heuristic evidence. They are explicitly synthetic and cannot be described as
  user research, usability testing, or human validation.
- Missing human-recognition evidence must not block `semantics_ready`,
  `implementation_authorized`, UI mutation, evaluation, commit, push, or Draft
  PR review.
- The user-appointed design controller remains responsible for design-quality
  review, but it may not expand project scope or create a new external research
  gate without an explicit user decision.
- Owner: user authority / workflow correction.

## Locked by the user

1. Start a revision; do not defend or micro-tune the current launch candidate.
2. Delegate high-impact design questions to independent design controller
   `019f664b-38d1-79f3-ba6b-2a9c059f5c6c`.
3. Use a pixel visual-poster mother system.
4. Make a pixel Oak monument the dominant image.
5. Use extreme giant-poster minimalism rather than a control-plane/dashboard
   metaphor.
6. Use bone white, near black, forest green, and only a small signal-lime
   accent.
7. Retire the abstract Ring Ledger pipe/maze glyph.
8. Preserve the existing v2 run and sealed evaluation as old-contract history.
9. Keep PR #5 Draft and do not merge automatically.

## Preserved platform and truth constraints

- GitHub Profile/GFM is a static publishing surface, not a custom application.
- Real identity, experiment facts, public proof links, Open Loop, and the
  counterexample route must not be replaced by inaccessible or fabricated
  visual copy.
- Light/dark, 320px reflow, image failure, and deterministic local assets remain
  required.
- No fabricated UI, controls, telemetry, metrics, customer proof, or remote
  assets.

## Delegated decision sequence

- D01 (locked by design controller): use the `D / A′` corrected skeleton,
  **Double-shoulder single-canopy Oak monument**. Canonical owner:
  `component_domain / visual_design.oak_monument_skeleton`.
  - deterministic `32u × 24u` 4:3 master;
  - one connected silhouette with 30–32u canopy, 14–16u canopy height,
    minimum 4u main branches, 5u trunk, 14–18u root span, and no base disc;
  - inherits the old avatar's vertical growth axis, pixel construction, forest
    green, and Y-fork topology, but rejects its circle, plastic fill, exact
    sprite symmetry, small-logo scale, and all Ring/pipeline language;
  - desktop visible Oak width ≥420 CSS px; true 320px visible size
    ≥168×120 CSS px; single-color silhouette must still read as a mature tree;
  - recognition gate: at least 4/5 unprompted observers answer tree/oak and
    recall wide canopy + central trunk after a one-second narrow view.
- D02 (locked by design controller): use the `D / A′` corrected composition,
  **Offset full-tree poster**. Canonical owner:
  `component_domain / visual_design.hero_poster_composition`.
  - one `54u × 36u` 3:2 viewBox for both themes;
  - Oak bbox is exactly `(20u, 6u, 32u, 24u)`, occupying 59.3% of width and
    66.7% of height, with zero crop;
  - left `20u` is active negative space and remains at least 85% empty; at most
    one unlabeled `2u × 2u` signal block is allowed;
  - fixed sequence: `picture → H1 → lead → hr → next H2`;
  - later GFM continues one left axis, consistent two-digit folios, one primary
    statement per section, and one thematic break between top-level sections;
  - images-disabled collapses the image footprint and leaves a short
    `Pixel oak monument` alt before the complete native identity and content.
- D03 (locked by design controller): use **constant forest material with
  controlled background polarity**. Canonical owner:
  `component_domain / visual_design.hero_color_material_projection`.
  - tokens: bone `#F2EFE4`, ink `#0D100E`, forest `#347A55`, signal
    `#3B9648`;
  - forest Oak and signal stay identical across themes; bone/ink exchange only
    the background and one fixed structure-face role;
  - full-canvas area targets: background 70%–75%, forest 20%–24%, structure
    4%–6%, signal exactly one `2u × 2u` block (about 0.206%);
  - no derived greens, opacity, gradient, highlight, glow, shadow, blur, or
    fifth visible color;
  - all identity-critical non-text boundaries remain at least 3:1; forest is
    not approved as normal bone-background body text.
- D04 (locked by design controller): use a **single-side inset continuous
  structure face**. Canonical owner:
  `component_domain / visual_design.oak_structure_plane_topology`.
  - local allowed bbox `x=6u–17u, y=4u–23u`;
  - exactly one four-neighbor connected component, no hole, branch, node,
    floating cell, stroke, or right-side copy;
  - starts inside the left crown, bridges the left branch, descends within the
    left trunk, and touches the outer contour exactly once at a 3u–5u left-root
    exit;
  - structure area `78u²–116u²`; minimum path thickness 2u, branch bridge ≥3u,
    and at least 1u forest buffer from the true Y negative;
  - concept variants: Shoulder-weighted, Balanced, and Grounded; all share the
    outer silhouette, tokens, theme geometry, Y negative, and left topology.
- D05 (locked by design controller): use a **root evidence cross-section**.
  Canonical owner: `component_domain / visual_design.evidence_root_field`.
  - fixed `54u × 14u` viewBox; near-black background in both themes;
  - deterministic source crop from production Oak local
    `x=7u–25u, y=17u–24u`, transformed exactly 2× into destination
    `x=18u–54u, y=0u–14u`;
  - contains lower trunk, both roots, real root negatives, and the D04 left-root
    structure exit; excludes canopy, complete Y, complete Oak, and all copy;
  - theme-invariant ink background, forest root, bone structure face, and one
    signal block; empty alt;
  - directly precedes the native Evidence H3, three proof links, Next, and the
    unique counterexample action; those semantics never enter the SVG.
- D06 (locked by design controller): use the native GFM **poster page grammar**
  without changing the selected reading spine. Canonical owner:
  `component_domain / visual_design.gfm_poster_page_grammar`.
  - H2 folios are exactly `02 /` through `05 /`; H3 is limited to Question,
    Hypothesis, Evidence, and Next;
  - visible copy has field-specific sentence, paragraph, and rendered-line
    budgets; proof stays exactly three linked sentences, principles exactly
    three short links, Open Loop one paragraph/one repository, and the CTA one
    native link in Discuss;
  - the page has exactly four top-level thematic breaks, one Markdown blank
    line between blocks, and no spacer HTML, forced `<br>`, table, card, badge,
    code panel, or repeated section art;
  - real 860px and 320px DOM line/bounds evidence is required; source character
    counts alone do not prove the contract;
  - D05 is clarified: the root field directly precedes Evidence, three proofs,
    and Next inside Current Experiment, but the counterexample CTA remains only
    in `05 / Discuss on GitHub` after Principles and Open Loop.
- D07 (open): select or reject the Shoulder-weighted, Balanced, and Grounded
  concept evidence. This is the final high-impact component-domain question.
- After D07, stop adding preference questions. Asset roles follow mechanically
  from the locked declarations and must be resolved through capability routing.
