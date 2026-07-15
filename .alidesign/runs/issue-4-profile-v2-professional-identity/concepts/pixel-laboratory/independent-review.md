# Independent draft concept-board review

## Review metadata

- Actor: `codex-independent-concept-reviewer`
- Isolation method: `fresh subagent context`
- Scope: read-only review of the decision contract, selected art direction,
  information architecture, Pixel Laboratory index/input contract, and all
  three 1600 × 1000 PNG boards at original detail.
- Authority: the run-specific decision contract, art direction, and information
  architecture govern; the general design-quality reference supplies secondary
  legibility, accessibility, anti-template, and craft checks.
- Status: draft concept-board review only. No repository files, routes, Git
  state, issues, or pull requests were modified by the reviewer.
- Shared technical compliance: the rendered boards are flat and white-led. A
  source-pattern check found no external image references, gradients, filters,
  scripts, or animation constructs. Declared text-color contrast is strong:
  ink/paper `16.96:1`, forest/paper `10.83:1`, muted/paper `5.56:1`, and
  white/forest `11.76:1`.

## Revision 1 — initial review

A shared blocking defect affects all three boards: the principle strip appears
before `CURRENT EXPERIMENT`, reversing the locked
`IDENTITY / LEAD → CURRENT EXPERIMENT → WORKING PRINCIPLES` spine. Each 360
study also stops after `QUESTION`, so it does not yet demonstrate the sequential
reflow of `HYPOTHESIS → EVIDENCE → NEXT`.

### 01 — Branch Register

Verdict: **hold; strongest editorial base, but not selectable in its current
form.**

Strengths:

- The calmest and most professionally credible composition.
- The open ledger gives `QUESTION → HYPOTHESIS → EVIDENCE → NEXT` the clearest
  labels, baselines, line lengths, and reading rhythm of the three.
- Whitespace, restrained rules, and the forest/ink palette read as editorial
  design rather than game, HUD, terminal, or dashboard styling.
- The 360 study genuinely recomposes the glyph and Hero instead of simply
  shrinking the desktop block.

Risks and defects:

- **Blocking:** the glyph is a literal, symmetrical tree/cross silhouette. It
  reads more like a park, conservation, municipal, or institutional mark than
  an authored Cooper Oak identity and could be transferred by replacing the
  name and color.
- **Blocking:** the principles precede the experiment evidence.
- Non-blocking: the uniformly heavy, all-capital Hero expresses rigor more
  strongly than curiosity.
- Non-blocking/unverified: the 360 excerpt proves the Hero and question, but not
  the spacing or legibility of the remaining three experiment fields.

### 02 — Counterform Canopy

Verdict: **reject in this round.**

Strengths:

- The strongest figure/ground contrast and immediate visual authority.
- The Hero and evidence ledger remain legible despite the large identity field.
- The counterform approach is materially distinct and remains flat, with no
  decorative depth effects.

Risks and defects:

- **Blocking:** the enclosing forest square becomes an app icon or brand tile,
  especially in the 360 study. The white counterform reads as a `Y`, trophy,
  plug, or fork before it reads as an Oak.
- **Blocking:** the lower-left black slab duplicates `CURRENT EXPERIMENT` and
  lists its four fields like a sidebar, navigation index, or status module.
  Together with the right-hand ledger, it creates a prohibited card/control
  surface reading.
- **Blocking:** the principles precede the experiment evidence.
- Non-blocking: the two large solid blocks overpower the human inquiry and make
  the identity feel packaged rather than curious, bounded, and experimental.

### 03 — Ring Ledger

Verdict: **reject in this round.**

Strengths:

- The most overtly authored desktop composition and the strongest asymmetrical
  balance.
- The open evidence ledger and vertical register support a rigorous editorial
  rhythm without enclosing the four fields in cards.
- The stepped-ring premise is relevant to history and accumulated evidence.

Risks and defects:

- **Blocking:** the glyph reads primarily as a maze, circuit, fingerprint, or
  generic data-system symbol. The central trunk is insufficient to establish
  Oak, and the 360 reduction intensifies the square app-mark/maze reading.
- **Blocking:** `ONE OPEN LOOP AT A TIME` introduces Open Loop language before
  the Current Experiment, while the principle strip again precedes evidence.
- Non-blocking: the large technical mark overstates system authority and
  suppresses the desired human curiosity.
- Non-blocking craft defect: the small `03` is visually trapped against the
  glyph's lower-right edge and reads like a clipping/alignment artifact.

### Comparative recommendation

`no recommendation`

Branch Register has the best legibility, editorial restraint, and professional
credibility, but its central identity meets an explicit rejection condition:
it reads as a generic environmental/institutional tree mark. Counterform Canopy
fails through app-icon and control-module readings; Ring Ledger fails through
maze/data-symbol and premature system-brand readings. Selecting one now would
waive the run's own failure gates rather than resolve them.

### Directed revisions

1. **All boards — Hero-to-experiment transition and 360 column.** Move the
   complete `CURRENT EXPERIMENT / CAPABILITY ROUTING` record immediately after
   the lead; place the three principles only after all four experiment fields;
   remove premature Open Loop language and duplicate experiment indexes.
   Acceptance: a top-to-bottom trace on desktop and 360 reaches
   `QUESTION → HYPOTHESIS → EVIDENCE → NEXT` before any principle or Open Loop
   material, with no element resembling navigation, telemetry, or a status
   module.
2. **Branch Register — desktop upper-left glyph and 360 top glyph.** Rebuild the
   mark around an Oak-specific, less symmetrical branch/canopy/trunk or
   counterform relationship. Acceptance: in an unlabeled monochrome small-size
   check, the form reads as Oak/growth rather than a park, medical-cross, or
   institutional logo; it remains traceable to the pixel/green lineage and
   cannot be transferred unchanged by swapping only name and color.
3. **Counterform Canopy and Ring Ledger — desktop and 360 identity zones.**
   Replace Counterform's enclosing app-tile logic and break Ring Ledger's closed
   square labyrinth into an unmistakable trunk/canopy/growth-ring construction;
   remove Counterform's duplicate black experiment module and Ring Ledger's
   trapped `03`. Acceptance: neither small rendering presents a square app icon,
   trophy/plug, maze, circuit, or generic data mark; both read as Oak/growth
   without explanatory copy, and each board contains only one open editorial
   experiment sequence.

### Gate statement

These revision-002 boards are **not fit for user direction selection yet**.
They are useful comparative evidence, but every board trips at least one
explicit identity or hierarchy rejection gate.

They do not satisfy canonical product `visual_design`, `craft`, or
`design_review`; they do not constitute implementation projection; and they do
not authorize any Profile/UI mutation.

## Revision 2 — verification

Reviewer: `codex-independent-concept-reviewer`

Verification target: regenerated route `revision-003`, inspected read-only at
original PNG detail and against the bound SVG/generator/manifest sources. The
artifact tests pass `4/4`, and the manifest hashes match the current input,
generator, three SVGs, and three PNGs.

### Directed-revision verification

1. **All boards — Hero-to-experiment transition and 360 column: PASS.** On
   desktop, the full experiment precedes `WORKING PRINCIPLES`: Current
   Experiment begins at `y=500/520/530`, `NEXT` appears at `y=782/790/800`, and
   principles begin at `y=844/854/859` for Branch, Counterform, and Ring. Each
   narrow study now shows `QUESTION` at `y=518`, `HYPOTHESIS` at `568`,
   `EVIDENCE` at `632`, and `NEXT` at `696`, followed by principles at `779`.
   Counterform's duplicate black index module and Ring's premature Open Loop
   tagline are absent. The result is one open editorial evidence sequence, not
   navigation, telemetry, or status theater.
2. **Branch Register — desktop and narrow glyph: FAIL.** The revised asymmetry
   clears the earlier park, medical-cross, and institutional-logo reading, and
   the lower canopy/trunk now suggests growth. However, the upper-left `72 × 24`
   forest rectangle at desktop coordinates `x=120, y=166` is completely
   detached from every other glyph element; the same isolated dash survives in
   the narrow version. At small size it reads as disconnected noise above the
   tree rather than a coherent branch/canopy relationship.
3. **Counterform Canopy and Ring Ledger — identity zones: PASS.** Counterform no
   longer uses an enclosing forest square or duplicate black experiment module;
   its stepped canopy, trunk, and central negative opening read as Oak/growth at
   desktop and narrow sizes. Ring no longer forms a closed square labyrinth;
   three open stepped canopy/ring paths terminate around a clear central trunk
   with lateral growth marks. The former maze/app-square reading is no longer
   primary, and the trapped `03` is absent.

### Per-board verdicts

- `01 — Branch Register`: **HOLD.** Information hierarchy, spacing,
  professional editorial tone, and responsive evidence pass, but the isolated
  upper glyph fragment remains a selection blocker.
- `02 — Counterform Canopy`: **SELECTABLE.** The app-tile and control-module
  blockers are resolved; the mark reads as one Oak/growth identity across
  desktop and narrow studies.
- `03 — Ring Ledger`: **SELECTABLE.** The maze/circuit/app-square blocker is
  resolved. The open canopy rings and trunk produce the most authored and least
  transferable identity while retaining the clearest connection between Oak
  growth and accumulated evidence.

### Comparative recommendation

Recommend: **`03 — Ring Ledger`**.

Ring Ledger combines the strongest project-specific identity with the
evidence-led editorial system: the glyph communicates canopy, growth rings, and
trunk without becoming a literal environmental logo, game sprite, app tile, or
technical maze. Counterform Canopy is a valid alternative, but its more literal
pixel-tree construction is less distinctive than Ring Ledger's growth/evidence
relationship.

### Gate statement

The updated boards are fit for user direction selection between Counterform
Canopy and Ring Ledger, with Ring Ledger independently recommended. Branch
Register remains on hold until its detached fragment is repaired.

This gate applies only to reversible concept-direction selection. These boards
still do not satisfy canonical product `visual_design`, `craft`, or
`design_review`; they do not constitute implementation projection; and they do
not authorize Profile/UI mutation.

## Revision 3 — Branch micro-verification

- **Detached-noise blocker: PASS.** The new desktop `24 × 24` step at
  `x=168, y=190` touches both the former upper-left fragment at `y=190` and the
  lower branch at `y=214`; the narrow `10 × 10` equivalent makes the same
  continuous connection. At original detail, both glyphs now read as one
  coherent asymmetric Oak/branch structure without returning to the park,
  medical, or institutional-mark reading.
- **Branch Register verdict: SELECTABLE.**
- **Comparative recommendation: unchanged.** `03 — Ring Ledger` remains the
  independent recommendation; Branch Register is now a cleared alternative
  rather than a held board.
- **Gate:** all three boards are fit for user concept-direction selection. This
  does not satisfy canonical product `visual_design`, `craft`, or
  `design_review`, does not constitute implementation projection, and does not
  authorize Profile/UI mutation.
