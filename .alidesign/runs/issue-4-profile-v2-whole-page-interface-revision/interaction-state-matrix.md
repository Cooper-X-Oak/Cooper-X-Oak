# Interaction and state matrix

| State | Expected behavior | Evidence |
|---|---|---|
| Desktop light | Full Hero; opening register, ledger, strip, and close form one page system. | 860px screenshot + DOM metrics. |
| Desktop dark | Same structure; native GitHub surface and dark SVG projection remain coherent. | 860px screenshot + DOM metrics. |
| True 320 light/dark | No page overflow, clipping, or out-of-bounds link; text remains readable. | CDP metrics + screenshots. |
| Images disabled | Hero becomes concise alt line; decorative Evidence image consumes no meaningful space; all content/actions remain. | 320px screenshot + DOM/link comparison. |
| Keyboard/link traversal | Eight real links follow reading order and keep meaningful names. | DOM/link index. |
| Motion | Not applicable: static GitHub README; no animation is introduced. | Static source check. |
| Loading/error controls | Not applicable: no custom control or asynchronous application state. | Source and rendered DOM check. |

Craft remains required despite motion and application interaction being
not-applicable.
