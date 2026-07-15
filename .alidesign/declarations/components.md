# Component declaration

## Available primitives and source

- GitHub-flavored Markdown: H1/H2/H3, paragraph, strong/emphasis, list, rule,
  relative image, anchor link, and `<picture>`.
- Local SVG: rectangles, paths, lines, groups, title, and description only.
- Semantic preview HTML: `header`, `main`, `article`, `section`, heading,
  paragraph, list, `picture`, `img`, and real `a` elements.

## Semantic component map

| Component | Meaning | Required content |
|---|---|---|
| `SignaturePicture` | Non-interactive brand preface | Local light/dark desktop/mobile sources and concise alt |
| `IdentityIntro` | Native identity and positioning | One H1, one positioning line, one supporting Chinese line/context |
| `PrimaryAnchor` | First task path | Label and `#selected-work` href |
| `ProjectEntry` | One selected public work | Repo name/link, one summary, evidence links |
| `EvidenceLink` | Verifiable support for a claim | Allowed proof kind, label, public HTTPS URL |
| `PrincipleList` | Evidence-grounded working behavior | Exactly three plain bullets |
| `RepositoryExit` | Secondary exploration path | One public repositories URL |

## Easily confused components and selection rules

- Use `PrimaryAnchor`, never a button image or badge, for Selected work.
- Use an `EvidenceLink`, never a status chip, to express release/install/tests.
- Use `ProjectEntry`, never a card, table row, system module, or registry item.
- Use `SignaturePicture`, never an app header, dashboard hero, logo tile, HUD,
  KPI grid, navigation bar, or control surface.
- Use native GitHub Pins for repository cards and current platform statistics.

## Required states and accessibility behavior

- Links inherit GitHub/browser default, visited, focus, and activation behavior.
- Preview links are real anchors with visible focus; no CSS removes outlines.
- Missing image: alt text plus complete native content preserves the task.
- Long repository name: wraps naturally.
- Dark/light and desktop/mobile variants preserve the same semantics.

## Composition and responsive rules

- Order is fixed by selected IA; the generator cannot rearrange from visual
  preferences.
- `SignaturePicture` appears at most once.
- `PrimaryAnchor` appears once before any secondary exit.
- Exactly three `ProjectEntry` instances; repo keys are unique.
- Each project has one summary and one or two tightly related proof links.
- No columns or tables at any viewport.

## Deprecated components

- `EvidenceConsoleHero`, `OperatingLoop`, `StatusFact`, `SelectedSystemRow`,
  `EvidenceLedger`, `ModuleRegistry`, fake `BuildingInPublicButton`, generic
  `CO` app mark, fixed active row, and all dashboard state labels.

## Missing component process

- Record a real task gap in the active AliDesign run.
- Prefer native GitHub Markdown/HTML semantics.
- Add a component only after its meaning, states, responsive behavior, and
  evaluation check are declared. Do not solve gaps with arbitrary SVG boxes.
