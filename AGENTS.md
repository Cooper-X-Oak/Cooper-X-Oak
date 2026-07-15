# Cooper-X-Oak-profile Rules

## Repository workflow
- Before any repository file, Git, or GitHub mutation, use
  `$apply-repo-workflow`.
- workflow.default: `github-standard-development`
- workflow.allowed: `github-standard-development`, `read-only-review`
- If workflow resolution or preflight fails, remain read-only and report the
  blocker.

## Branch convention
- Prefixes: feat/ fix/ docs/ refactor/ chore/ test/
- Naming: <type>/<topic> or <type>/<issue>-<topic>

## Source of truth (on conflict, this wins)
- `profile.json` is the authoring source for the current profile.
- `README.md`, `profile.html`, and `assets/profile-signature-*` are generated outputs; do not hand-edit them.
- The rendered GitHub profile and `profile.html` are the visual acceptance surfaces.

## Design workflow
- For profile information architecture, visual design, or design review, use
  `$alidesign-engineering` with `.alidesign/` as the local control directory.
- Keep identity, project claims, and proof links grounded in public repository
  evidence. Do not invent product status, metrics, contact routes, or controls.

## Temp artifacts (never commit)
- .scratch/ .temp/ .draft/ -> gitignored

## Verify / test
- Regenerate: `node artifacts/build_profile.mjs`.
- Run contract tests: `node --test artifacts/build_profile.test.mjs`.
- Check generated-output drift: `node artifacts/build_profile.mjs --check`.
- Visual: serve the repository locally and open `profile.html`; review desktop/mobile and light/dark renders.
- Run `git diff --check` and parse every generated SVG as XML before publishing.
- Legacy spring hero only: `python artifacts/make_premium_hero.py` (requires Pillow).

## Code conventions
- Profile structure and tokens come from `profile.json` and the active
  `.alidesign/` declarations; the generator must not hard-code a dashboard
  template around the content.
- The profile may use one shallow editorial signature visual. It must not use
  cards, fake controls, telemetry, gradients, shadows, animation, or remote assets.
- `assets/` also holds legacy SVG/PNG/GIF hero and HUD art; keep the `?v=` cache-bust suffix when updating a legacy asset in place.
- artifacts/ holds generation tooling and source renders; treat as build inputs, not the published profile.
- README.md is the published GitHub profile surface.
