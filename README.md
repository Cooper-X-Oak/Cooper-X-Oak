<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/profile-signature-dark.svg">
  <img src="./assets/profile-signature-light.svg" alt="Ring Ledger Oak glyph." width="1200" height="264">
</picture>

# COOPER OAK

Experiments in keeping humans in control of AI-assisted work.

## 02 — Current experiment

**Capability Routing.** A bounded workflow experiment: name the required specialist and the stopping condition before irreversible work.

### Question

How should an AI-assisted workflow know which specialist must act next—and when must it stop because the required capability is missing?

### Hypothesis

Before irreversible work, declare the required capability, applicable provider, authority inputs, expected outputs, deadline, and gate. If a required capability is unresolved, the workflow stops.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/profile-evidence-dark.svg">
  <img src="./assets/profile-evidence-light.svg" alt="" width="1200" height="112">
</picture>

### Evidence

1. [A missing required visual provider blocks UI mutation instead of letting a generic fallback improvise the design.](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6#issuecomment-4982339925>)
2. [An applicable brand or platform provider beats a generic provider, while a CloudAI-scoped provider is excluded from this GitHub Profile.](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6#issuecomment-4982340403>)
3. [Route revisions and evaluation rounds stay append-only, so later decisions cannot silently rewrite earlier evidence.](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6#issuecomment-4982340744>)

### Next

Test the contract beyond this Profile and collect the smallest counterexamples where it routes the wrong specialist or closes the gate at the wrong time.

---

## 03 — Working principles

- [Make control explicit.](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6#issuecomment-4982339925>)
- [Route work to specialists.](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6#issuecomment-4982340403>)
- [Claims need evidence.](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6#issuecomment-4982340744>)

---

## 04 — Open loop

Older repositories record a path from trial and error toward finishing and clarifying work. [writing-loop-harness](<https://github.com/Cooper-X-Oak/writing-loop-harness>) worked locally and was useful, but it never became a clear, installable tool. The loop closes when it becomes installable—not when it gets a more ambitious label.

---

## 05 — Discuss on GitHub

I am looking for cases where the routing contract chooses the wrong specialist or stops at the wrong boundary. [提交反例](<https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6>).

<!-- Generated from profile.json by artifacts/build_profile.mjs. Do not edit by hand. -->
