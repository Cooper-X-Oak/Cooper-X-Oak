# Visual design specification — native Pixel Oak interface

## Core concept

The Profile is an **open control ledger**: a square, inspectable interface made
from GitHub-native borders, headings, ordered proof, and real links. Pixel Oak
supplies identity; the rest of the page supplies professional information
design.

## Frozen visuals

The following files are immutable inputs:

- `assets/profile-signature-light.svg`
- `assets/profile-signature-dark.svg`
- `assets/profile-evidence-light.svg`
- `assets/profile-evidence-dark.svg`

They retain their existing markup, geometry, tokens, and bytes. The generator
may reference them but must not produce changed bytes.

## Opening register

- Hero remains full width and first.
- Below it, identity and active experiment are composed as one two-cell register
  at roomy widths.
- Identity cell contains the unique H1 and lead.
- Active cell contains a small `NOW / ACTIVE` label, `Capability Routing`, and the
  bounded public-experiment context. It is informational, not a status widget.

## Experiment ledger

- One square table expresses actual field/value semantics.
- Label column: Question, Hypothesis, Evidence, Next.
- Declaration column: the real corresponding content.
- The Evidence black marker is a full-width table row immediately before the
  Evidence declaration row. It is decorative and keeps empty alt text.
- Proof remains an ordered list of exactly three descriptive links.

## Operating strip

- Three equal conceptual entries: `01 / Make control explicit`, `02 / Route
  work to specialists`, `03 / Claims need evidence`.
- Each entry is a real link, not a badge, metric, or control.
- Numbering makes the pixel/editorial rhythm visible without another asset.

## Closing matrix

- Open Loop and Discuss are adjacent responsibilities at roomy widths.
- Open Loop is a record: repository continuity and honest unfinished state.
- Discuss is the action: counterexample context and the only final CTA.
- On narrow widths, readability outranks preserved columns; the implementation
  must pass observable 320px line and bounds checks.

## Platform projection

Use native HTML/GFM nodes and GitHub's own table/heading/link rendering. No
style attribute, class contract, custom CSS, inline color, or sanitizer-sensitive
behavior is required for the published README. `profile.html` may mirror the
same semantics for local evidence but must not claim CSS behavior exists on
GitHub.
