# Component and domain map

| Product meaning | Domain rule | Component or pattern | Token or source | States | Risk or permission notes |
|---|---|---|---|---|---|
| Cooper identity | Public display name and Bio are authoritative | `IdentityIntro` | GitHub profile API; native H1 | Static | Do not invent company, location, contact, or title |
| Brand recognition | Must relate to the public avatar, not a generic app | `SignaturePicture` | `brand`, `canvas`, pixel grid | Light/dark; desktop/mobile | Decorative/editorial only; no controls or sole copy |
| Primary task path | First action moves to Selected work | `PrimaryAnchor` | `#selected-work` | Link states supplied by GitHub | One instance; must resolve |
| Released software | Claim supported by public release and docs | `ProjectEntry` + release evidence | LongYin repository and releases | Link available/broken | Volatile counts excluded |
| Installable tool | Claim supported by public install path and release | `ProjectEntry` + install evidence | goal-to-do skill directory and v0.1.0 | Link available/broken | Do not imply adoption |
| Tested system | Claim supported by tests and passing CI | `ProjectEntry` + tests/CI evidence | valvetrade test files and run 28073647116 | Link available/broken | Call it a pipeline skeleton, not production deployment |
| Working method | Must be visible across selected evidence | `PrincipleList` | Content evidence | Static | No abstract methodology unsupported by all three works |
| More exploration | GitHub owns catalog and live repository metadata | `RepositoryExit` | Public repositories URL | Link available/broken | Do not clone Pins or list all projects |

## Existing components reused

- GitHub native headings, paragraphs, links, lists, anchors, responsive content
  column, Pins, repository metadata, and contribution activity.
- HTML `<picture>` support for theme and viewport source selection.
- Browser-native focus, visited, back, and link activation behavior.

## New component or system gaps

- One local `SignaturePicture` composition is needed because the old console
  assets conflict with the avatar and page type.
- The current generator lacks a semantic `ProjectEntry` model, one-primary-link
  contract, evidence kinds, cross-section uniqueness, and drift check.
- These gaps will be implemented in `profile.json` and
  `artifacts/build_profile.mjs` without a new framework or dependency.

## Sensitive data and dangerous operations

- No sensitive data is included. Missing contact data remains missing.
- No destructive or account-changing operation is represented in the profile.
- GitHub branch, PR, merge, and profile-setting mutations remain outside this
  component map and under the repository workflow.

## Semantics-ready gate evidence

- Every visible region maps to a real domain object and native semantic pattern.
- Release/install/tests claims have direct public proof.
- Deprecated dashboard objects are named and prohibited.
- Token source, component cap, responsive behavior, and error severity are
  explicit enough for deterministic implementation and evaluation.
