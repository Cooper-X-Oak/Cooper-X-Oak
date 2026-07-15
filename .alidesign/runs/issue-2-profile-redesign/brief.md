# Design run: issue-2-profile-redesign

- Project: `Cooper-X-Oak-profile-issue-2`
- Mode: `full`
- State: `accepted`
- Milestone: [M001](../../milestones/M001.md)
- Issue: [AD-001](../../issues/AD-001.md)
- Created: `2026-07-15T09:57:42.224560Z`

## Task

Redesign the Cooper Oak GitHub profile under GitHub Issue #2. Replace the
static evidence-console/dashboard shell with a GitHub-native, evidence-led
Brand Landing + Content/Documentation profile.

## Current authority and gaps

- **User direction:** use AliDesign engineering; current console treatment is
  rejected as generic, toy-like, and plastic. The original SignalOps reference
  may inform editorial clarity only; its dashboard page shape is not authority.
- **Primary visitor:** a technical peer or tool user arriving from GitHub
  activity who needs to decide whether to inspect Cooper's work.
- **Primary task:** understand Cooper Oak in five seconds, move to Selected
  Work, and open one credible project.
- **Primary action:** an ordinary GitHub Markdown link to `#selected-work`.
  It must not be styled inside a static image as a button.
- **Platform:** public GitHub Profile README rendered at the top of the profile;
  native Pins and contribution activity remain outside and below the README.
- **Product facts:** public GitHub bio, repository metadata, READMEs, release
  pages, and the existing authoring source. See `content-evidence.md`.
- **Brand basis:** the public avatar's exact two-color palette (`#6ed959`
  green on `#f0f0f0`) and pixel-cut geometry, translated into one editorial
  signature visual rather than a game HUD or control panel.
- **Language:** concise English-first copy with one supporting Chinese line;
  repository names and source-language terminology remain unchanged.
- **Repository delivery:** `$apply-repo-workflow` resolved to
  `github-standard-development`; GitHub Issue #2 and the isolated
  `feat/2-profile-redesign` worktree are established.
- **Known gap:** there is no verified website, social account, or contact URL.
  Contact conversion is excluded from v1 rather than filled with a placeholder.

## Required artifacts

- Keep specifications, IA, component/domain maps, interaction matrices, decisions, evidence, evaluation, and feedback for this run under this directory.

## Next legal transition

No further design-state transition is required. Continue the resolved
repository workflow with commit, branch push, draft PR, and the remaining
GitHub branch-render smoke check before merge.
