import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  RING_LEDGER_MODEL,
  normalizeThemeProjection,
  renderOutputs,
  validateOutputs,
  validateProfile,
  validateRingLedgerSvg
} from "./build_profile.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await readFile(resolve(ROOT, "profile.json"), "utf8"));

function cloneProfile() {
  return structuredClone(source);
}

function hexToRgb(hex) {
  return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((value) => value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test("accepts the approved Pixel Oak source contract", () => {
  assert.equal(validateProfile(cloneProfile()).version, 3);
});

test("rejects the retired editorial-v1 source contract", () => {
  const config = cloneProfile();
  config.version = 2;
  assert.throws(() => validateProfile(config), /version must be 3/);
});

test("rejects unsupported source fields instead of silently rendering them", () => {
  const config = cloneProfile();
  config.page.status = "BUILDING IN PUBLIC";
  assert.throws(() => validateProfile(config), /unsupported fields: status/);
});

test("locks the single native H1 and lead", () => {
  for (const mutate of [
    (config) => { config.identity.name = "Cooper Oak"; },
    (config) => { config.identity.lead = "Building AI systems in public."; }
  ]) {
    const config = cloneProfile();
    mutate(config);
    assert.throws(() => validateProfile(config), /single identity heading|locked lead/);
  }
});

test("requires exactly three distinct Issue-comment proof destinations", () => {
  const missing = cloneProfile();
  missing.experiment.evidence.pop();
  assert.throws(() => validateProfile(missing), /exactly three proof sentences/);

  const duplicate = cloneProfile();
  duplicate.experiment.evidence[2].url = duplicate.experiment.evidence[1].url;
  assert.throws(() => validateProfile(duplicate), /duplicates another proof destination/);

  const issueRoot = cloneProfile();
  issueRoot.experiment.evidence[0].url = issueRoot.discuss.url;
  assert.throws(() => validateProfile(issueRoot), /specific append-only evidence comment/);
});

test("locks principle order and proof relationship", () => {
  const config = cloneProfile();
  config.principles.reverse();
  assert.throws(() => validateProfile(config), /locked principle order/);
});

test("keeps writing-loop-harness as the only honest Open loop", () => {
  const config = cloneProfile();
  config.openLoop.repo = "goal-to-do";
  assert.throws(() => validateProfile(config), /only Open loop/);
});

test("keeps the counterexample action on the dedicated public Issue", () => {
  const config = cloneProfile();
  config.discuss.url = "https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/4";
  assert.throws(() => validateProfile(config), /dedicated public experiment Issue/);
});

test("rejects prose that can inject GFM block structure", () => {
  for (const mutate of [
    (config) => { config.experiment.question = "## Fake section"; },
    (config) => { config.experiment.evidence[0].statement = "- Fake nested list"; },
    (config) => { config.openLoop.closure = "---"; }
  ]) {
    const config = cloneProfile();
    mutate(config);
    assert.throws(() => validateProfile(config), /GitHub Markdown block construct/);
  }
});

test("renders deterministically from one source model", () => {
  const first = renderOutputs(cloneProfile());
  const second = renderOutputs(cloneProfile());
  assert.deepEqual(first, second);
  assert.equal(Object.keys(first).length, 6);
});

test("renders the exact native GFM ledger grammar", () => {
  const readme = renderOutputs(cloneProfile())["README.md"];
  assert.deepEqual([...readme.matchAll(/^# (.+)$/gm)].map((match) => match[1]), ["COOPER OAK"]);
  assert.deepEqual([...readme.matchAll(/^## (.+)$/gm)].map((match) => match[1]), [
    "02 — Current experiment",
    "03 — Working principles",
    "04 — Open loop",
    "05 — Discuss on GitHub"
  ]);
  assert.deepEqual([...readme.matchAll(/^### (.+)$/gm)].map((match) => match[1]), ["Question", "Hypothesis", "Evidence", "Next"]);
  assert.equal([...readme.matchAll(/^---$/gm)].length, 3);
});

test("freezes production assets to two visual roles with theme projections", () => {
  const outputs = renderOutputs(cloneProfile());
  const names = Object.keys(outputs).filter((name) => name.endsWith(".svg"));
  assert.deepEqual(names, [
    "assets/profile-signature-light.svg",
    "assets/profile-signature-dark.svg",
    "assets/profile-evidence-light.svg",
    "assets/profile-evidence-dark.svg"
  ]);
  assert.doesNotMatch(outputs["README.md"], /max-width:|mobile|section-marker/i);
  assert.equal([...outputs["README.md"].matchAll(/^<picture>$/gm)].length, 2);
});

test("keeps every identity, experiment, proof, and action out of SVG", () => {
  const config = cloneProfile();
  const outputs = renderOutputs(config);
  const svg = Object.entries(outputs)
    .filter(([name]) => name.endsWith(".svg"))
    .map(([, value]) => value)
    .join("\n");
  for (const forbidden of [
    config.identity.name,
    config.identity.lead,
    config.experiment.name,
    ...config.experiment.evidence.map((item) => item.statement),
    config.discuss.label,
    config.discuss.url
  ]) assert.ok(!svg.includes(forbidden), `SVG duplicated semantic content: ${forbidden}`);
});

test("keeps light and dark geometry structurally identical", () => {
  const outputs = renderOutputs(cloneProfile());
  assert.equal(
    normalizeThemeProjection(outputs["assets/profile-signature-light.svg"]),
    normalizeThemeProjection(outputs["assets/profile-signature-dark.svg"])
  );
  assert.equal(
    normalizeThemeProjection(outputs["assets/profile-evidence-light.svg"]),
    normalizeThemeProjection(outputs["assets/profile-evidence-dark.svg"])
  );
});

test("keeps the Pixel Oak above the locked 30 by 65 percent bounds", () => {
  const { glyphBounds, viewBoxWidth, viewBoxHeight } = RING_LEDGER_MODEL.hero;
  assert.ok(glyphBounds.width / viewBoxWidth >= 0.3);
  assert.ok(glyphBounds.height / viewBoxHeight >= 0.65);
  assert.ok(viewBoxWidth - (glyphBounds.x + glyphBounds.width) >= 2);
});

test("freezes the D03/D04 silhouette and structure topology", () => {
  const canonicalRows = (rows) => {
    const cells = [];
    rows.forEach((ranges, y) => ranges.forEach(([start, end]) => {
      for (let x = start; x <= end; x += 1) cells.push([x, y]);
    }));
    return cells.sort(([ax, ay], [bx, by]) => ay - by || ax - bx).map(([x, y]) => `${x},${y}`).join(";");
  };
  const structureRows = [];
  for (const [y, ranges] of Object.entries(RING_LEDGER_MODEL.hero.structureRows)) structureRows[Number(y)] = ranges;
  const hash = (value) => createHash("sha256").update(value).digest("hex");
  assert.equal(hash(canonicalRows(RING_LEDGER_MODEL.hero.silhouetteRows)), "395c18d10bb21004519f0134ac2dfbeb4b2686323d9b357fd46c4958e2335203");
  assert.equal(hash(canonicalRows(structureRows)), "0c0c241fcce8c7c888e7c1ae36cd8863e4b2c474d9bebcf00d92a5fb01ebdd7e");
});

test("keeps all generated SVG local, static, flat, and parseable by contract", () => {
  const config = cloneProfile();
  const outputs = renderOutputs(config);
  validateRingLedgerSvg(outputs["assets/profile-signature-light.svg"], config, "hero");
  validateRingLedgerSvg(outputs["assets/profile-signature-dark.svg"], config, "hero");
  validateRingLedgerSvg(outputs["assets/profile-evidence-light.svg"], config, "evidence");
  validateRingLedgerSvg(outputs["assets/profile-evidence-dark.svg"], config, "evidence");
  for (const [name, value] of Object.entries(outputs)) {
    if (!name.endsWith(".svg")) continue;
    const withoutNamespace = value.replace('xmlns="http://www.w3.org/2000/svg"', "");
    assert.doesNotMatch(withoutNamespace, /<script|<foreignObject|https?:\/\/|<animate|<filter|Gradient|url\(|<text/i);
    assert.match(value, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.match(value, /<\/svg>\n$/);
  }
});

test("meets non-text contrast for Hero and Evidence geometry", () => {
  const config = cloneProfile();
  for (const mode of ["light", "dark"]) {
    const tokens = config.theme.tokens[mode];
    assert.ok(contrast(tokens.forest, tokens.canvas) >= 3, `${mode} Hero forest contrast failed`);
    assert.ok(contrast(tokens.structure, tokens.canvas) >= 2.5, `${mode} Hero structure visibility failed`);
    assert.ok(contrast(tokens.structure, tokens.forest) < 2, `${mode} structure must remain subordinate to the Oak`);
    assert.ok(contrast(tokens.rule, tokens.blackField) >= 3, `${mode} Evidence rule contrast failed`);
  }
});

test("rejects viewport assets and a third visual role even after generation", () => {
  const config = cloneProfile();
  const outputs = renderOutputs(config);
  outputs["README.md"] = outputs["README.md"].replace(
    '<source media="(prefers-color-scheme: dark)"',
    '<source media="(max-width: 600px)" srcset="./assets/mobile.svg">\n  <source media="(prefers-color-scheme: dark)"'
  );
  assert.throws(() => validateOutputs(outputs, config), /viewport asset|theme source/);
});

test("keeps the Evidence marker decorative and adjacent to native semantics", () => {
  const outputs = renderOutputs(cloneProfile());
  const readme = outputs["README.md"];
  assert.match(readme, /profile-evidence-light\.svg" alt="">\n<\/picture>\n\n### Evidence/);
  assert.doesNotMatch(readme, /<img[^>]+\b(?:width|height)=/i);
  assert.match(outputs["assets/profile-evidence-light.svg"], /aria-hidden="true" focusable="false"/);
  assert.doesNotMatch(outputs["assets/profile-evidence-light.svg"], /<title|<desc|>Evidence<|issuecomment|提交反例/i);
});

test("keeps the generated preview semantic, responsive, and script-free", () => {
  const preview = renderOutputs(cloneProfile())["profile.html"];
  assert.match(preview, /<meta name="viewport"/);
  assert.equal([...preview.matchAll(/<h1>/g)].length, 1);
  assert.equal([...preview.matchAll(/<h2 id=/g)].length, 4);
  assert.equal([...preview.matchAll(/<h3>/g)].length, 4);
  assert.equal([...preview.matchAll(/<hr>/g)].length, 3);
  assert.doesNotMatch(preview, /<script|<button|role="button"|display:\s*none|javascript:/i);
});

test("all generated text uses the repository LF contract", () => {
  const outputs = renderOutputs(cloneProfile());
  for (const [name, value] of Object.entries(outputs)) assert.doesNotMatch(value, /\r/, `${name} contains a carriage return.`);
});
