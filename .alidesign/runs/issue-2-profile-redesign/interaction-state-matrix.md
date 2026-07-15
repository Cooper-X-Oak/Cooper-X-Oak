# Interaction-state matrix

The Profile README is static. Interaction readiness means every visual promise
matches native browser/GitHub behavior and all non-ideal render contexts remain
understandable; it does not mean inventing application states.

| Element or flow | Trigger | State | Visible feedback | Keyboard/focus | Recovery | Evidence required |
|---|---|---|---|---|---|---|
| Profile entry | Open Profile | Default | Signature, H1, positioning, and Selected work path render in order | Page headings and links enter normal document order | Scroll if anchor is ignored | Desktop/narrow light/dark screenshots; heading profile |
| Signature picture | Theme or viewport source selection | Light/dark; desktop/mobile | Correct local asset appears without clipping | Image is not focusable | Alt text and native identity remain if image fails | Source/media inspection; broken-image test |
| Primary anchor | Click, Enter, or keyboard activation | Link focused/activated | Browser moves to `Selected work` heading | Native visible focus is preserved; Enter activates | Natural scroll reaches the same heading | Anchor existence and click smoke |
| Project repository link | Click or keyboard activation | Link focused/visited | Browser navigates to the public repository | Native focus and visited behavior | Browser Back returns to Profile | HTTP check and click smoke |
| Release/install/test/CI proof | Click or keyboard activation | Link focused/visited | Browser opens the exact public evidence destination | Native focus; no custom target behavior | Project repository link remains available if one proof destination fails | HTTP check and link-to-claim mapping |
| Repository exit | Click or keyboard activation | Link focused/visited | Browser opens public repositories page | Native focus | Browser Back returns to Profile | HTTP check and click smoke |
| Long repository name | Narrow width or zoom | Wrapped | Heading wraps without clipping or smaller font | No change | Continue reading vertically | 320px and 200% zoom screenshot |
| Light/dark scheme | OS/browser preference changes | Theme variant | Signature palette changes; native Markdown remains readable | No control required | Native text remains if wrong asset is blocked | Both scheme screenshots and contrast checks |
| External link unavailable | Network or GitHub error | Destination failure | GitHub/browser owns error surface; Profile copy stays intact | Browser controls remain available | Back to Profile, choose another proof | Link check result; no fake local error component |
| Image unavailable | Missing/corrupt local asset | Partial render | Concise alt plus all native copy and links remain | No focus trap | Continue through native content | Broken-asset simulation or DOM inspection |

## Main path

```text
Open Profile
  -> read Cooper Oak and work categories
  -> activate Selected work
  -> inspect three ordered projects
  -> activate repository or proof link
  -> use browser/GitHub navigation to return
```

Every step uses native headings and anchors. There is no script, custom router,
dialog, drawer, selection model, or hidden state.

## Loading, empty, partial, and delayed states

- **Loading:** GitHub and the browser own document/image loading. No skeleton or
  spinner is added to static Markdown.
- **Empty:** The generator rejects missing identity, primary action, selected
  projects, principles, or proof; an empty public state must not be generated.
- **Partial:** Missing image is tolerated because native content is complete.
  Missing link or selected project blocks generation/evaluation.
- **Delayed external destination:** The current Profile remains readable; no
  local simulated progress state is appropriate.

## Error, timeout, offline, and permission states

- All selected destinations must be public at release evaluation.
- HTTP/network failure is reported by the browser or GitHub destination.
- Offline reading may retain native README text; outbound proof cannot be
  guaranteed and is not disguised with a fake fallback.
- Private or permission-gated proof is prohibited by validation and content
  review.

## Destructive action, cancel, retry, undo, and resume

- Not applicable to the Profile artifact.
- Browser refresh/back provide retry and return.
- Repository-development mutations remain governed by the GitHub workflow and
  are not represented as page controls.

## Pointer, touch, narrow screen, zoom, and reduced motion

- Links remain native-size inline targets with readable surrounding copy.
- No hover-only disclosure.
- 320px/390px layouts remain a single vertical document without horizontal
  scroll; project names wrap naturally.
- 200% zoom preserves the reading order and does not clip the signature.
- No animation exists, so reduced-motion requires no alternate behavior.

## Intentionally excluded states and rationale

- **Hover/active/selected/disabled:** No custom control exists.
- **Focus artwork:** Focus belongs to real native links, never the SVG.
- **Loading/error cards:** GitHub/browser own network rendering.
- **Live status and telemetry:** No real-time data source exists.
- **Carousel/tabs/accordion:** They add hidden state and have no task value.
- **Contact/form states:** No verified contact destination is in scope.

## Behavior-ready gate evidence

- Every apparent action maps to a real link and native browser behavior.
- Image, link failure, theme, narrow width, zoom, and keyboard behavior are
  defined with evidence methods.
- Unsupported application states are explicitly excluded rather than faked.
- No interaction decision remains that would change the implementation model.
