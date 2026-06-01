# Cooper-X-Oak-profile Rules

## Branch convention
- Prefixes: feat/ fix/ docs/ refactor/ chore/ test/
- Naming: <type>/<topic> or <type>/<issue>-<topic>

## Source of truth (on conflict, this wins)
- README.md and the rendered GitHub profile (profile.html preview)

## Temp artifacts (never commit)
- .scratch/ .temp/ .draft/ -> gitignored

## Verify / test
- Visual: open profile.html in a browser; confirm assets/ SVGs render.
- Regenerate hero art: `python artifacts/make_premium_hero.py` (requires Pillow).

## Code conventions
- assets/ holds versioned SVG/PNG/GIF hero and HUD art; keep the `?v=` cache-bust suffix in README image URLs when updating an asset in place.
- artifacts/ holds generation tooling and source renders; treat as build inputs, not the published profile.
- README.md is the published GitHub profile surface.
