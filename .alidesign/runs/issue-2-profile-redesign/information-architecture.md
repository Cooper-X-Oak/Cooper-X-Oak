# Information architecture

Selected candidate: **Variant A — Flagship-first Evidence Landing**.

## Primary task and starting point

- **Entry:** A visitor arrives at the GitHub Profile through activity, a pull
  request, an issue, a repository, or a direct profile link.
- **Start:** A short signature strip and native `# Cooper Oak` identity.
- **Primary task:** Understand the work categories, follow `Selected work`,
  and open one credible project.
- **Fallback path:** A visitor who ignores the anchor naturally reaches the
  same section by scrolling.

## Selected structure

```text
Editorial signature strip (one visual, no product UI)
  -> Native identity and positioning
  -> One primary link: See selected work
  -> Selected work
       1. LongYinMod_RisingFame — released software
       2. goal-to-do — installable tool
       3. valvetrade-pipeline — tested system
  -> How I work — three evidence-grounded plain-text principles
  -> Browse all repositories — one secondary exit
  -> GitHub-native Pins, contributions, and activity outside README
```

## Regions and responsibilities

### 1. Signature strip

- Establish a memorable brand relationship with the public avatar.
- Use `#6ed959`, `#f0f0f0`, black/white, and the avatar's pixel-cut geometry.
- May display `COOPER OAK` as a visual signature, but must not contain the only
  copy of identity, positioning, or navigation.
- Must not contain cards, buttons, badges, focus lines, rows, KPIs, status
  labels, dashboard chrome, or simulated controls.

### 2. Native identity

- `# Cooper Oak` as the sole README H1.
- Positioning: game mods, AI tools, and weird useful projects, built in public.
- One concise supporting Chinese sentence.
- The 2026 start and 100-project goal may appear as supporting context, never
  as metrics, KPIs, or the primary headline.

### 3. Primary path

- `[See selected work ↓](#selected-work)`.
- Standard Markdown text link, placed before all secondary links.
- No top navigation bar and no adjacent three-link menu.

### 4. Selected work

- Exactly three vertically stacked project entries.
- Each entry has a repository heading, one outcome-oriented sentence, and one
  proof sentence with genuine links.
- Evidence order is intentional:
  1. public releases and support boundary;
  2. install path and release;
  3. tests and successful CI.
- Project maturity is expressed by direct proof, not a badge or self-issued
  state label.

### 5. How I work

- Three short bullets: ship artifacts people can download, install, or verify;
  document setup, support boundaries, and failure modes; use tests and public
  artifacts as proof.
- Adds method context without repeating project names or creating an Operating
  Loop diagram.

### 6. Repository exit

- One ordinary link to all public repositories.
- No repeated footer navigation and no custom clone of GitHub Pins.

## Information hierarchy

1. Identity and work categories.
2. Primary path to work.
3. Strongest credible proof.
4. Breadth across tool and system work.
5. Working method.
6. Continued exploration through native GitHub.

Volatile star, fork, download, and release counts inform selection but do not
appear in published copy. GitHub's native UI already presents current counts.

## Navigation, entry, return, and recovery paths

- The only in-page navigation is the `#selected-work` anchor.
- Repository, release, install, test, and CI links open real public destinations.
- Return uses browser history or GitHub navigation; the README invents no back
  or recovery control.
- If the signature image fails, native headings, copy, and links retain the
  complete task path.

## Content growth and localization

- Selected work stays capped at three. Adding one requires replacing one and
  recording the evidence-ranking decision.
- A repository appears once in README content.
- Additional experiments belong on the repositories page or in GitHub Pins.
- English carries global technical scanning. Chinese appears once for personal
  voice, not as a parallel duplicated document.
- Repository names retain their real spelling and may wrap naturally.
- No font size reduction is allowed to keep long names on one line.

## Responsive transformations

### Desktop

- Single column at GitHub's native README width.
- Signature strip is shallow; identity, link, and beginning of Selected work
  remain visible without a full-screen takeover.
- Project entries are separated by native headings and spacing, not cards.

### Narrow screen

- Same semantic order; no columns, tables, fixed-width HTML, or horizontal
  scrolling.
- Use a mobile signature asset with a crop/composition designed for narrow
  width rather than shrinking the desktop artwork.
- Project names wrap; proof links sit on their own readable line.
- Image content is never required to understand or navigate the profile.

## Alternatives considered and tradeoffs

### Variant A — Flagship-first Evidence Landing (selected)

```text
identity -> primary path -> three ordered proofs -> principles -> repositories
```

- Best five-second clarity and shortest route to credible work.
- Preserves breadth without pretending all projects have equal maturity.
- Lowest risk of recreating a template or card wall.

### Variant B — Three Practice Lanes (rejected)

```text
identity -> Game Mods -> AI Tools -> Systems/Research -> principles
```

- Strong breadth communication.
- Rejected because equal lanes flatten evidence maturity, invite a three-card
  grid, and force a choice before the strongest proof is clear.

### Variant C — Build-in-public Narrative (rejected)

```text
identity -> 2026 origin story -> current direction -> work -> principles
```

- Strong personal narrative.
- Rejected because it delays the project-opening task, increases maintenance,
  and risks turning the 100-project goal into the product.

## Structure-ready gate evidence

- Entry, start, primary task, fallback path, and exits are explicit.
- Three alternatives change task priority rather than surface styling.
- The selected order matches the verified evidence hierarchy.
- Desktop and mobile transformations are defined without desktop shrinkage.
- Content caps prevent a return to Module Registry repetition.
- Signature visual responsibility and prohibited UI semantics are explicit.
- No unresolved structural decision can materially change implementation.
