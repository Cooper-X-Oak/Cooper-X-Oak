# Cooper-X-Oak-profile Rules

## Branch convention
- Prefixes: feat/ fix/ docs/ refactor/ chore/ test/
- Naming: <type>/<topic> or <type>/<issue>-<topic>

## Source of truth (on conflict, this wins)
- `profile.evidence-console.json` is the authoring source for the current profile.
- `README.md`, `profile.html`, and `assets/profile-*` are generated outputs; do not hand-edit them.
- The rendered GitHub profile and `profile.html` are the visual acceptance surfaces.

## Temp artifacts (never commit)
- .scratch/ .temp/ .draft/ -> gitignored

## Verify / test
- Regenerate and run built-in contract checks: `node artifacts/build_evidence_console.mjs`.
- Visual: serve the repository locally and open `profile.html`; review desktop/mobile and light/dark renders.
- Run `git diff --check` and parse every generated SVG as XML before publishing.
- Legacy spring hero only: `python artifacts/make_premium_hero.py` (requires Pillow).

## Code conventions
- The evidence-console palette is fixed to `#ffffff`, `#f5f5f5`, `#000000`, `#8c8c8c`, `#dbdbdb`, and `#0382f7`.
- Generated profile SVGs use 8px structural radii, 1px borders, no gradients, no shadows, no continuous animation, and no remote assets.
- `assets/` also holds legacy SVG/PNG/GIF hero and HUD art; keep the `?v=` cache-bust suffix when updating a legacy asset in place.
- artifacts/ holds generation tooling and source renders; treat as build inputs, not the published profile.
- README.md is the published GitHub profile surface.
