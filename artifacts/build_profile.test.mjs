import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { renderOutputs, validateProfile } from "./build_profile.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await readFile(resolve(ROOT, "profile.json"), "utf8"));

function cloneProfile() {
  return structuredClone(source);
}

test("accepts the approved v2 profile contract", () => {
  assert.equal(validateProfile(cloneProfile()).version, 2);
});

test("rejects the retired v1 evidence-console contract", () => {
  const config = cloneProfile();
  config.version = 1;
  assert.throws(() => validateProfile(config), /rejected evidence-console schema/);
});

test("rejects missing or redirected primary action", () => {
  const config = cloneProfile();
  config.page.primaryAction.href = "https://example.com";
  assert.throws(() => validateProfile(config), /must resolve to #selected-work/);
});

test("rejects duplicate featured repositories", () => {
  const config = cloneProfile();
  config.featuredWork[2].repo = config.featuredWork[0].repo;
  config.featuredWork[2].url = config.featuredWork[0].url;
  assert.throws(() => validateProfile(config), /duplicates another selected project/);
});

test("rejects featured work without public proof", () => {
  const config = cloneProfile();
  config.featuredWork[0].evidence = [];
  assert.throws(() => validateProfile(config), /one or two proof links/);
});

test("rejects non-HTTPS evidence", () => {
  const config = cloneProfile();
  config.featuredWork[0].evidence[0].url = "http://github.com/Cooper-X-Oak/LongYinMod_RisingFame/releases/latest";
  assert.throws(() => validateProfile(config), /must use HTTPS/);
});

test("rejects URL traversal after canonical parsing", () => {
  const config = cloneProfile();
  config.featuredWork[0].evidence[0].url = "https://github.com/Cooper-X-Oak/LongYinMod_RisingFame/releases/../../outside";
  assert.throws(() => validateProfile(config), /canonical serialized URL|inside LongYinMod_RisingFame/);
});

test("rejects legacy dashboard fields anywhere in the model", () => {
  const config = cloneProfile();
  config.page.status = "BUILDING IN PUBLIC";
  assert.throws(() => validateProfile(config), /rejected evidence-console field/);
});

test("rejects prose that can inject GFM block structure", () => {
  for (const mutate of [
    (config) => { config.identity.supporting = "## Fake section"; },
    (config) => { config.featuredWork[0].summary = "---"; },
    (config) => { config.principles[0] = "- Unexpected nested list"; },
    (config) => { config.identity.origin = "1. Unexpected list"; }
  ]) {
    const config = cloneProfile();
    mutate(config);
    assert.throws(() => validateProfile(config), /GitHub Markdown block construct/);
  }
});

test("renders deterministically from one view model", () => {
  const first = renderOutputs(cloneProfile());
  const second = renderOutputs(cloneProfile());
  assert.deepEqual(first, second);
  assert.equal(Object.keys(first).length, 6);
});

test("generated surfaces exclude the rejected console language", () => {
  const outputs = renderOutputs(cloneProfile());
  const joined = Object.values(outputs).join("\n");
  assert.doesNotMatch(joined, /OPERATING STATE|CURRENT DECISION FOCUS|MODULE REGISTRY|PUBLIC LAB|Evidence Ledger|role="button"|<button/i);
  assert.match(outputs["README.md"], /^# Cooper Oak$/m);
  assert.match(outputs["profile.html"], /id="selected-work"/);
  const h1Position = outputs["profile.html"].indexOf("<h1");
  assert.doesNotMatch(outputs["profile.html"].slice(0, h1Position), /<h[2-6]\b/);
});

test("generated signature assets are local, static, and theme-aware", () => {
  const outputs = renderOutputs(cloneProfile());
  for (const [name, value] of Object.entries(outputs)) {
    if (!name.endsWith(".svg")) continue;
    const withoutNamespace = value.replace('xmlns="http://www.w3.org/2000/svg"', "");
    assert.doesNotMatch(withoutNamespace, /<script|<foreignObject|https?:\/\/|<animate|url\(/i);
    assert.match(value, /#6ed959/);
  }
  assert.match(outputs["README.md"], /prefers-color-scheme: dark/);
  assert.match(outputs["README.md"], /max-width: 600px/);
});

test("mobile signature and preview derive copy and avatar colors from the source", () => {
  const config = cloneProfile();
  config.theme.signature.category = "MODS · SKILLS · TESTED SYSTEMS";
  config.theme.colors.light.canvas = "#eeeeee";
  config.theme.colors.light.brand = "#55aa55";
  config.theme.colors.dark.brand = "#55aa55";
  const outputs = renderOutputs(config);
  assert.match(outputs["assets/profile-signature-mobile-light.svg"], />MODS · SKILLS<\/text>/);
  assert.match(outputs["assets/profile-signature-mobile-light.svg"], />TESTED SYSTEMS<\/text>/);
  assert.doesNotMatch(outputs["assets/profile-signature-mobile-light.svg"], /GAME MODS/);
  assert.match(outputs["profile.html"], /<rect width="180" height="180" fill="#eeeeee"/);
  assert.match(outputs["profile.html"], /<path fill="#55aa55"/);
});

test("all generated text uses the repository LF contract", () => {
  const outputs = renderOutputs(cloneProfile());
  for (const [name, value] of Object.entries(outputs)) {
    assert.doesNotMatch(value, /\r/, `${name} contains a carriage return.`);
  }
});

test("GFM links use angle-delimited destinations and preserve parentheses", () => {
  const config = cloneProfile();
  config.featuredWork[0].evidence[0].url = "https://github.com/Cooper-X-Oak/LongYinMod_RisingFame/releases/latest?label=(stable)";
  const outputs = renderOutputs(config);
  for (const project of config.featuredWork) {
    assert.match(outputs["README.md"], new RegExp(`\\]\\(<${project.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}>\\)`));
    for (const proof of project.evidence) {
      assert.ok(outputs["README.md"].includes(`](<${proof.url}>)`));
    }
  }
});
