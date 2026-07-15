# Profile specification

## L1 Positioning and intent

- **Definition:** A GitHub-native personal profile for Cooper Oak: a builder
  who publishes game mods, AI tools, and useful experiments in public.
- **Primary user:** A technical peer or tool user arriving from GitHub
  activity with limited attention and no prior context.
- **Primary outcome:** Within five seconds, the visitor understands who Cooper
  is, what he builds, and where to start; the visitor can then open one
  credible project.
- **Primary action:** Follow a normal text link to `#selected-work`, then choose
  one of three evidence-backed projects.
- **Delivery stage:** Release-quality public Profile README generated from a
  structured local source.
- **Scope:** Identity, short positioning, three selected projects, concise
  working principles, one repository-browse exit, one responsive editorial
  signature visual, semantic preview, and reproducible generation.
- **Non-goals:** A résumé, live dashboard, product console, repository catalog,
  contact funnel, real-time statistics page, skills badge wall, or replacement
  for GitHub Pins and contributions.

## L2 Information areas

1. **Signature visual:** Cooper Oak, three real disciplines, and public-building
   context. No controls, cards, KPIs, or microcopy.
2. **Positioning:** One short English paragraph and one Chinese line grounded in
   the public bio.
3. **Primary path:** `Selected work` anchor as the first link; latest release
   and all repositories are secondary text links.
4. **Selected work:** Exactly three projects with different proof types:
   released software, installable tool, and a tested system.
5. **Working principles:** Three evidence-grounded statements: ship artifacts
   people can use or verify; document setup and boundaries; use tests and
   public artifacts as proof.
6. **Exit:** One link to all repositories. Native GitHub Pins and contributions
   continue below the README and are not duplicated as custom cards.

## L3 Core flow and state transitions

```text
GitHub profile entry
  -> identify Cooper and the three work categories
  -> follow Selected work
  -> compare three concise project proofs
  -> open one repository, release, install path, test suite, or CI run
  -> return through the browser/GitHub navigation if desired
```

The README is static. It has navigation and outbound links, not application
state. Light/dark and desktop/narrow variants are rendering contexts, not
runtime modes exposed as controls.

## L4 Component behavior

- **Signature visual:** Responsive `<picture>` with informative alt text and
  four local SVG variants representing one composition.
- **Primary path:** Standard Markdown anchor link; visible as text outside the
  image and usable with keyboard navigation.
- **Project entry:** Markdown heading + one outcome sentence + one evidence
  sentence. The repository name and proof link are genuine anchors.
- **Principle:** Plain bullet text; never a card, badge, KPI, or status chip.
- **Secondary path:** Standard text links with lower placement and no visual
  competition with Selected work.

## L5 Boundary conditions

- **Empty:** Generation fails if identity, primary action, or any of the three
  selected projects is missing.
- **Loading:** Not applicable to the static README; local image files must be
  present before generation passes.
- **Partial:** Generation fails on duplicate projects, missing evidence URLs,
  placeholder copy, or unverified contact fields.
- **Error:** Broken local assets, invalid XML, bad anchors, or failed published
  links block release.
- **Permission:** All public claims and links must be viewable without private
  repository access.
- **Offline or timeout:** The README remains readable as native text even if an
  external project or release link is temporarily unavailable.
- **Recovery:** The visitor can scroll, use the anchor, or use normal browser
  back navigation. No custom recovery UI is necessary.
- **Growth:** Additional projects go to GitHub Pins or the repositories page;
  the selected list remains capped at three unless the spec is revised.
- **Localization:** English is primary; the supporting Chinese line must not
  duplicate whole sections or cause a second parallel information architecture.

## L6 Acceptance criteria

- A reviewer can state "game mods, AI tools, useful experiments" after a
  five-second first-screen scan.
- The first actionable link is `Selected work`; it resolves to the intended
  heading in GitHub-flavored Markdown.
- Exactly three selected projects appear once each, with a distinct real proof
  link and no invented metrics or state labels.
- The signature visual uses the avatar-derived green and pixel geometry but is
  unmistakably an editorial poster, not UI.
- No static image element resembles a button, focus state, selection state,
  toggle, live telemetry, or dashboard control.
- No source text smaller than 20px desktop or 26px mobile appears in generated
  SVGs; final rendered auxiliary text targets at least 13px.
- Light/dark desktop and narrow-screen renders preserve hierarchy without
  clipping, overflow, or illegible contrast.
- README content remains useful if images are unavailable because identity,
  project summaries, and links exist as native text.
- `profile.json` is the sole authoring source. `node artifacts/build_profile.mjs`,
  its `--check` mode, SVG XML parsing,
  published-link checks, and `git diff --check` pass.
- Release evaluation reaches 8.0 or above and has no configured blocker.

## Unknowns and blockers

- No verified contact or social destination exists. This is an accepted scope
  exclusion, not a blocker for a work-discovery profile.
- GitHub Pins currently show only `LongYinMod_RisingFame`; changing Pins is an
  external profile setting and is not part of Issue #2.
