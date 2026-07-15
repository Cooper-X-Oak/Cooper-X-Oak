# Design-system declaration

## Source of truth and version

- Task version: `profile-editorial-v1`.
- Content and selected theme values: `profile.json`.
- Semantic intent and restrictions: this declaration plus `craft.md`.
- Generated files are outputs and must pass `build_profile.mjs --check`.

## Color and semantic tokens

| Token | Light | Dark | Responsibility |
|---|---|---|---|
| `canvas` | `#f0f0f0` | `#111111` | Signature background, derived from avatar background in light mode |
| `ink` | `#111111` | `#f5f5f5` | Signature title and primary graphic contrast |
| `muted-ink` | `#4d4d4d` | `#c7c7c7` | Optional secondary signature text only |
| `brand` | `#6ed959` | `#6ed959` | Pixel mark and non-text accent derived from avatar |
| `rule` | `#c7c7c7` | `#3d444d` | One structural line when necessary |

- GitHub controls native Markdown link color; generated README does not imitate
  or override it.
- Brand green is primarily a shape/background accent. Do not use it for small
  text on the light canvas.
- No unregistered hex values in signature SVGs.

## Typography and language coverage

- README: GitHub's native typography and heading scale.
- Signature font stack: `Arial, Helvetica, sans-serif`; no remote fonts.
- Desktop signature title: 72px; category line: 26px; metadata minimum: 20px.
- Mobile signature title: 64px; category line: 30px; metadata minimum: 26px.
- Weight: 800 for the signature title, 600 for category line, 400–500 for any
  supporting line. Avoid multiple tiny weights or terminal-style letterspacing.
- Chinese copy stays in native Markdown to use the platform's fallback fonts.

## Spacing, sizing, geometry, and layout tokens

- Desktop signature viewBox: `1200 x 240`.
- Mobile signature viewBox: `600 x 260`.
- Safe edge: 48px desktop, 32px mobile.
- Spacing scale: 8, 16, 24, 32, 48, 64.
- Pixel motif uses rectangular modules aligned to a 24px or 32px grid.
- No universal radius token. The signature uses square geometry; README uses
  native GitHub styling.

## Surface, border, elevation, and layering tokens

- One flat canvas and one optional `rule` line.
- No card surfaces, nested panels, shadows, blur, gradients, elevation, app
  header, toolbar, button, or selected row.
- Depth is created only through scale, crop, and negative space.

## Motion and timing tokens

- None. Static Profile artifact; reduced-motion is inherently satisfied.

## Themes, responsive behavior, and platform variants

- `<picture>` selects desktop/mobile and light/dark signature assets.
- Desktop and mobile variants share content, palette, motif, and hierarchy.
- Mobile recomposes the motif and wraps the category line; it does not shrink
  desktop microcopy.
- Native README content remains one semantic document in all themes and widths.

## Known gaps and extension process

- The public avatar remains an external GitHub profile setting and is not
  replaced by this task.
- Any future contact CTA requires a verified destination and spec revision.
- Any fourth selected project requires a structure decision and replacement,
  not silent list growth.
- New visual tokens require a recorded AliDesign decision and evaluation; do
  not hardcode one-off colors or radii in the generator.
