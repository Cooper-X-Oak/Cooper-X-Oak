# Concept selection — round 003

Status: **awaiting design-controller review**

Owner: D01 `visual_design.oak_monument_skeleton` in `component_domain`.

## Why this round exists

Recognition proxy round 001 failed mathematically after two isolated observers identified the previous silhouette as a pixel trophy at both 860 px and 320 px. The design controller directed a silhouette-only revision before any D04 structure layer could be reconsidered.

## Candidates

Three mutually exclusive 32 × 24 monochrome hypotheses were generated:

1. `a-three-crown-positive-y`
2. `b-exposed-branch-frame`
3. `c-wind-shaped-offset`

Each candidate has an 860 projection and a 320 projection under `concepts/silhouette-round-002/`. No candidate includes D04, forest/signal color, copy, or production markup.

## Mechanical checks

| Candidate | Filled cells | Four-neighbor connected | Enclosed background | Longest root run |
|---|---:|---|---:|---:|
| A | 403 | yes | 0 | 6u |
| B | 336 | yes | 0 | 6u |
| C | 387 | yes | 0 | 6u |

The 860 and 320 SVGs are emitted from the same cell set and rendered with crisp nearest-neighbor geometry.

## Gate status

- No candidate is selected.
- No recognition proxy has started for this round.
- D04 remains paused.
- The UI mutation barrier remains closed.
- `profile.json`, the production generator, README, and production SVGs remain untouched.
- The appointed design controller must first remove obvious object-category failures and nominate at most one candidate for a fresh five-actor blind proxy.
