# Profile v2 canonical visual design

Status: canonical product declaration for `component_domain`.
Selected mother system: `03 — Ring Ledger`.
Decision basis: user decisions 53–65, with independent design-quality
adjudication in Codex task `019f664b-38d1-79f3-ba6b-2a9c059f5c6c`.

This declaration translates the selected concept into a GitHub Profile README.
It does not paste the concept board into production. Native GFM owns identity,
experiment facts, evidence, links, headings, and reading order. Local SVG owns
only the shallow identity geometry and the single Evidence threshold.

## Authority and conflict resolution

1. The user's locked positioning, dual-mark transition, evidence content,
   public Issue model, and decisions 61–65 are product authority.
2. GitHub GFM and `<picture>` theme behavior are platform authority.
3. `selected-art-direction.md` and `information-architecture.md` govern the
   Ring Ledger system and reading spine.
4. `$review-design-quality` governs general craft and accessibility only where
   the sources above are silent.

The old GitHub account avatar remains unchanged for launch. Ring Ledger is the
new README signature. No profile-setting mutation is authorized.

## `visual_design.asset_projection`

- One deterministic geometry model generates every Ring Ledger asset.
- Production exposes exactly two visual roles:
  `hero_signature` and `evidence_black_marker`.
- Each role has one light and one dark projection. Theme projections may change
  registered color tokens and the dark marker boundary; geometry, viewBox,
  path membership, order, crop, and safe edges remain identical.
- README `<picture>` selects only light/dark sources. There is no viewport media
  source and no third mobile content system.
- The same hero and marker assets must remain valid in 860px and 320px
  containers. Narrow screenshots are evidence projections, not runtime assets.
- SVGs contain no identity copy, experiment copy, proof text, URLs, CTA, remote
  resource, script, animation, filter, gradient, shadow, interaction hint, or
  window chrome.
- No visual role may be added during implementation or craft. A third role
  requires a new `component_domain` route and declaration revision.

### Registered tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `canvas` | `#F5F6F1` | `#0D1110` | Hero field |
| `ink` | `#111512` | `#F2F4EF` | Secondary Ring stroke and preview text |
| `forest` | `#173F2D` | `#85B99A` | Oak/Ring identity geometry |
| `muted` | `#5C655E` | `#9BA69E` | Preview-only supporting text |
| `rule` | `#CDD3CD` | `#607066` | Preview and optional asset boundary |
| `black-field` | `#111512` | `#020403` | The only author-defined black region |

Token changes require both a source update and contrast evidence. Forest and
key Ring geometry must maintain at least 3:1 non-text contrast in the rendered
theme. Native GFM controls body and link colors.

## `visual_design.hero_composition`

Production order is fixed:

```text
picture / full-width Ring Ledger signature
H1 / COOPER OAK
lead / Experiments in keeping humans in control of AI-assisted work.
H2 / 02 — Current experiment
```

- The signature viewBox is `1200 × 264`, a low 4.55:1 field.
- The Oak/Ring glyph is right-heavy and uses the source-model bounds
  `x=708, y=36, width=432, height=208` including stroke extents.
- The glyph therefore occupies 36% of signature width and 78.8% of signature
  height, above the locked 30% / 65% minimums.
- The right safe edge is 60 source units. The open left field is intentional
  counterspace, not a missing copy column.
- The image, only H1, and only lead are directly adjacent. There is no badge,
  eyebrow, divider banner, table, duplicated identity copy, or extra signature.
- Broken or hidden images promote the H1 and lead to a complete semantic first
  screen without changing content or order.

## `visual_design.evidence_field`

Production order is fixed:

```text
decorative picture / Evidence black marker, alt=""
H3 / Evidence
three natural-language proof sentences with real links
H3 / Next
```

- The marker is a full-width `1200 × 112` low black field made from the same
  Ring Ledger geometry model.
- It is the page's only author-defined black region and functions as a chapter
  threshold, not a content container or terminal window.
- The marker and `### Evidence` are directly adjacent. No explanatory copy,
  second visual module, or divider sits between them.
- The marker contains no text, link, proof URL, CTA, heading semantics, prompt,
  code, or focus target. Its README image alt is empty.
- Dark projection may use a registered forest/rule boundary so the field does
  not disappear into GitHub's dark canvas; it may not add glow, depth, or a
  second surface.
- Image failure must leave exactly one Evidence heading, three proof links, and
  the counterexample action elsewhere in the document.

## `visual_design.page_grammar`

Identity/Hero is implicit entry `01`; no eyebrow appears before H1. The native
GFM outline is fixed:

```text
# COOPER OAK
lead

## 02 — Current experiment
### Question
### Hypothesis
[Evidence black marker]
### Evidence
### Next

---

## 03 — Working principles
[exactly three native link rows]

---

## 04 — Open loop
[one continuity paragraph and one writing-loop-harness link]

---

## 05 — Discuss on GitHub
[one context sentence and one 提交反例 link]
```

- Page-level `02–05` numbers form the reading spine. Experiment fields form the
  second semantic layer. They do not share slash syntax, status syntax, tiny
  monospaced labels, or duplicate numbering.
- GFM headings use normal size and case with an em dash. No table, card, code
  block, blockquote container, badge, fake button, grid, or telemetry appears.
- There is exactly one thematic break between adjacent top-level entries and
  no field-level decorative rule.
- Principles are exactly three real links. Open loop names exactly one public
  repository. Discuss contains exactly one contextual `提交反例` link.
- Visual continuity comes from sequence, numbering, whitespace, evidence order,
  and the content relationship: identity ring → explicit experiment → sealed
  evidence → unfinished loop → counterexample feedback. Principles, Open loop,
  Discuss, and individual fields receive no Ring SVG.

## Content contract

- H1: `COOPER OAK`.
- Lead: `Experiments in keeping humans in control of AI-assisted work.`
- Current experiment: `Capability Routing`.
- Public question: how the workflow knows which specialist acts next and when
  it must stop because a required capability is missing.
- Hypothesis: required capability, applicable provider, authority inputs,
  expected outputs, deadline, and gate are explicit before irreversible work.
- Evidence links point to append-only records in public Issue #6:
  missing visual authority, provider precedence/applicability, and append-only
  route/evaluation history.
- Open loop: `writing-loop-harness` worked locally and was useful, but never
  became a clear installable tool. Closure is an installable tool, without date.
- CTA: the dedicated public experiment Issue, labeled `提交反例`.

## Acceptance and rejection

Accept only if 860px/320px × light/dark renders have no overflow, crop, tiny
text, duplicated semantics, or icon-pack regression; images disabled preserves
the full outline, facts, links, and CTA. Reject if key content enters SVG, a
mobile runtime asset is required, the hero glyph drops below its locked bounds,
Evidence becomes a code/terminal container, or a third asset role is added.
