# Information-architecture variants

Status: D02 selected through the user-appointed design controller.

All variants preserve real GFM identity, proof, links, image failure, and a
single-column reading order. They differ in first-screen priority rather than
styling alone.

## A — Horizontal monument

A 3:2 image with the Oak on the right and deliberate negative space on the
left, followed by native identity and content. Good fit for GitHub width and a
cross-row diagonal; risk: an under-scaled Oak or filled negative space would
repeat the rejected banner pattern.

## B — Central colossus

A 4:3 image with a centered tree occupying 65%–75%, followed by identity as a
caption. Strong immediate recognition and narrow stability; risk: reads as an
enlarged avatar/logo and consumes too much of the first screen.

## C — Bleed crop

A wide field that enlarges the Oak beyond one or two edges. Strong poster
tension; rejected because crop removes the canopy/trunk/root evidence required
for unprompted Oak recognition and makes mobile correctness fragile.

## D — Selected: offset full-tree poster

A corrected A with one fixed `54u × 36u` canvas and the complete Oak at
`(20u, 6u, 32u, 24u)`. The left side stays active and mostly empty; no pseudo
coordinates or identity copy enters the image. The visual line is completed by
the left-aligned native H1 and lead immediately beneath it.

Selection basis: only D combines a complete tree, strong rightward weight,
GitHub-width compatibility, true 320px scaling, real GFM, and zero fake UI.
