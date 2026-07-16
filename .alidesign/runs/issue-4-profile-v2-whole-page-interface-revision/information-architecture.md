# Information architecture — editorial control ledger

## Selected structure

```text
Frozen Pixel Oak Hero
Opening register
  Identity / name + lead
  Active record / Capability Routing + public experiment state
Experiment ledger
  Question / field + declaration
  Hypothesis / field + declaration
  Frozen Evidence root field
  Evidence / three numbered public records
  Next / field + declaration
Operating strip
  01 explicit control / 02 specialist routing / 03 evidence
Closing matrix
  Open loop / honest unfinished repository record
  Discuss / counterexample context + sole action
```

## Why this is materially different

The old structure gave every section the same visual behavior: heading,
paragraph, whitespace, rule. The selected structure uses four distinct content
grammars with project-specific meanings: identity register, field/value ledger,
numbered operating strip, and record/action close. Removing the SVGs does not
remove these differences.

## Rejected alternatives

- **More section illustrations:** changes assets, not the page system, and
  repeats the defect the user identified.
- **Full dashboard:** invents product telemetry and controls that do not exist.
- **Pure one-column typographic polish:** remains the old structure with smaller
  cosmetic changes.

## Responsive contract

- The opening register and closing matrix may use two columns at roomy widths,
  but every cell contains ordinary wrapping prose and no fixed-width child.
- At 320px, the browser may compress the two columns; each cell must remain
  readable without page-level horizontal overflow. If evidence shows prose
  becomes unusably narrow, the implementation must fall back to one column in
  the local preview and use a single-column semantic projection in README.
- The experiment ledger uses a short label column and a flexible declaration
  column. Labels may wrap; declarations must never clip.
- The operating strip contains only short 3–6 word links.

## Failure behavior

With images disabled, the Hero collapses to concise alt text, the decorative
Evidence image collapses to zero, and the opening register, ledger, operating
strip, closing record, and action remain complete.
