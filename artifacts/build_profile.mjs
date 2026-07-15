import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MODULE_PATH = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(MODULE_PATH), "..");
const CONFIG_PATH = resolve(ROOT, "profile.json");

const OUTPUT_PATHS = Object.freeze({
  "README.md": resolve(ROOT, "README.md"),
  "profile.html": resolve(ROOT, "profile.html"),
  "assets/profile-signature-light.svg": resolve(ROOT, "assets/profile-signature-light.svg"),
  "assets/profile-signature-dark.svg": resolve(ROOT, "assets/profile-signature-dark.svg"),
  "assets/profile-evidence-light.svg": resolve(ROOT, "assets/profile-evidence-light.svg"),
  "assets/profile-evidence-dark.svg": resolve(ROOT, "assets/profile-evidence-dark.svg")
});

const TOKEN_KEYS = Object.freeze(["canvas", "ink", "forest", "muted", "rule", "blackField"]);
const HEX_PATTERN = /^#[0-9A-F]{6}$/;
const PLACEHOLDER_PATTERN = /(?:^|[\s:])(?:TODO|TBD)(?:$|[\s:])|[Ll]orem ipsum|[Aa]dd your|[Yy]our (?:url|link|website)/;
const GFM_BLOCK_PATTERN = /^(?:#{1,6}(?:\s|$)|>|(?:[-+*]|\d+[.)])\s|(?:-{3,}|_{3,}|\*{3,})$)/;
const REPO_PATTERN = /^[A-Za-z0-9_.-]+$/;
const EXPERIMENT_ISSUE = "https://github.com/Cooper-X-Oak/Cooper-X-Oak/issues/6";

export const RING_LEDGER_MODEL = Object.freeze({
  hero: Object.freeze({
    role: "hero_signature",
    width: 1200,
    height: 264,
    glyphBounds: Object.freeze({ x: 708, y: 36, width: 432, height: 208 }),
    paths: Object.freeze([
      Object.freeze({ id: "ring-outer", d: "M720 184V96H792V48H1032V72H1128V168", token: "forest", strokeWidth: 24 }),
      Object.freeze({ id: "ring-inner", d: "M792 184V120H840V96H1008V120H1080V184", token: "ink", strokeWidth: 24 }),
      Object.freeze({ id: "ring-heart", d: "M864 184V152H984V184", token: "forest", strokeWidth: 24 }),
      Object.freeze({ id: "oak-ledger", d: "M924 152V232M924 184H852M924 208H1032M924 232H876", token: "forest", strokeWidth: 24 })
    ])
  }),
  evidence: Object.freeze({
    role: "evidence_black_marker",
    width: 1200,
    height: 112,
    paths: Object.freeze([
      Object.freeze({ id: "marker-outer", d: "M780 84V52H828V28H1020V40H1116V76", token: "rule", strokeWidth: 16 }),
      Object.freeze({ id: "marker-inner", d: "M840 84V64H888V52H1008V64H1068V84", token: "rule", strokeWidth: 16 }),
      Object.freeze({ id: "marker-ledger", d: "M948 52V100M948 76H888M948 88H1044", token: "rule", strokeWidth: 16 })
    ])
  })
});

const ASSET_REFS = Object.freeze({
  hero: Object.freeze({
    light: "./assets/profile-signature-light.svg",
    dark: "./assets/profile-signature-dark.svg"
  }),
  evidence: Object.freeze({
    light: "./assets/profile-evidence-light.svg",
    dark: "./assets/profile-evidence-dark.svg"
  })
});

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertKeys(value, allowed, path) {
  assert(isPlainObject(value), `${path} must be an object.`);
  const unexpected = Object.keys(value).filter((key) => !allowed.includes(key));
  const missing = allowed.filter((key) => !Object.hasOwn(value, key));
  assert(unexpected.length === 0, `${path} contains unsupported fields: ${unexpected.join(", ")}.`);
  assert(missing.length === 0, `${path} is missing required fields: ${missing.join(", ")}.`);
}

function requireLine(value, path, { allowEmpty = false } = {}) {
  assert(typeof value === "string", `${path} must be a string.`);
  if (allowEmpty && value === "") return value;
  assert(value.trim() === value && value.length > 0, `${path} must be a non-empty trimmed string.`);
  assert(!/[\r\n]/.test(value), `${path} must stay on one source line.`);
  assert(!PLACEHOLDER_PATTERN.test(value), `${path} contains placeholder copy.`);
  assert(!/[<>]/.test(value), `${path} must not contain raw HTML.`);
  assert(!GFM_BLOCK_PATTERN.test(value), `${path} must not begin a GitHub Markdown block construct.`);
  return value;
}

function requireHttps(value, path) {
  const source = requireLine(value, path);
  let url;
  try {
    url = new URL(source);
  } catch {
    fail(`${path} must be a valid URL.`);
  }
  assert(url.protocol === "https:", `${path} must use HTTPS.`);
  assert(url.hostname.length > 0, `${path} must include a public hostname.`);
  assert(!url.username && !url.password, `${path} must not contain credentials.`);
  assert(url.href === source, `${path} must use its canonical serialized URL.`);
  return url;
}

function requireGitHubUrl(value, path) {
  const url = requireHttps(value, path);
  assert(url.origin === "https://github.com", `${path} must stay on public GitHub.`);
  return url;
}

function validateTokens(tokens, path) {
  assertKeys(tokens, TOKEN_KEYS, path);
  for (const key of TOKEN_KEYS) {
    assert(HEX_PATTERN.test(tokens[key]), `${path}.${key} must be an uppercase six-digit hex color.`);
  }
}

export function validateProfile(config) {
  assertKeys(config, ["version", "github", "page", "identity", "experiment", "principles", "openLoop", "discuss", "theme"], "profile");
  assert(config.version === 3, "profile.json version must be 3 for the Ring Ledger contract.");

  assertKeys(config.github, ["username"], "profile.github");
  const username = requireLine(config.github.username, "profile.github.username");
  assert(REPO_PATTERN.test(username), "profile.github.username contains unsupported characters.");

  assertKeys(config.page, ["type", "primaryAudience"], "profile.page");
  assert(config.page.type === "github-profile-experiment-ledger", "profile.page.type must be github-profile-experiment-ledger.");
  requireLine(config.page.primaryAudience, "profile.page.primaryAudience");

  assertKeys(config.identity, ["name", "lead"], "profile.identity");
  assert(config.identity.name === "COOPER OAK", "The single identity heading must be COOPER OAK.");
  assert(config.identity.lead === "Experiments in keeping humans in control of AI-assisted work.", "The locked lead changed.");

  assertKeys(config.experiment, ["name", "context", "question", "hypothesis", "evidence", "next"], "profile.experiment");
  assert(config.experiment.name === "Capability Routing", "The current experiment must remain Capability Routing.");
  for (const key of ["context", "question", "hypothesis", "next"]) requireLine(config.experiment[key], `profile.experiment.${key}`);
  assert(Array.isArray(config.experiment.evidence) && config.experiment.evidence.length === 3, "profile.experiment.evidence must contain exactly three proof sentences.");
  const evidenceUrls = new Set();
  for (const [index, item] of config.experiment.evidence.entries()) {
    const path = `profile.experiment.evidence[${index}]`;
    assertKeys(item, ["statement", "url"], path);
    requireLine(item.statement, `${path}.statement`);
    const url = requireGitHubUrl(item.url, `${path}.url`);
    assert(url.pathname === "/Cooper-X-Oak/Cooper-X-Oak/issues/6", `${path}.url must point to the dedicated public experiment Issue.`);
    assert(/^#issuecomment-\d+$/.test(url.hash), `${path}.url must link a specific append-only evidence comment.`);
    assert(!evidenceUrls.has(url.href), `${path}.url duplicates another proof destination.`);
    evidenceUrls.add(url.href);
  }

  assert(Array.isArray(config.principles) && config.principles.length === 3, "profile.principles must contain exactly three linked principles.");
  const expectedPrinciples = ["Make control explicit.", "Route work to specialists.", "Claims need evidence."];
  for (const [index, item] of config.principles.entries()) {
    const path = `profile.principles[${index}]`;
    assertKeys(item, ["label", "url"], path);
    assert(item.label === expectedPrinciples[index], `${path}.label does not match the locked principle order.`);
    const url = requireGitHubUrl(item.url, `${path}.url`);
    assert(url.href === config.experiment.evidence[index].url, `${path}.url must point to its corresponding experiment proof.`);
  }

  assertKeys(config.openLoop, ["repo", "url", "continuity", "truth", "closure"], "profile.openLoop");
  assert(config.openLoop.repo === "writing-loop-harness", "The only Open loop must remain writing-loop-harness.");
  const openLoopUrl = requireGitHubUrl(config.openLoop.url, "profile.openLoop.url");
  assert(openLoopUrl.pathname === `/${username}/writing-loop-harness` && !openLoopUrl.search && !openLoopUrl.hash, "profile.openLoop.url must be the public writing-loop-harness repository.");
  for (const key of ["continuity", "truth", "closure"]) requireLine(config.openLoop[key], `profile.openLoop.${key}`);
  assert(config.openLoop.truth.includes(config.openLoop.repo), "profile.openLoop.truth must name the honest unfinished repository once.");

  assertKeys(config.discuss, ["context", "label", "url"], "profile.discuss");
  requireLine(config.discuss.context, "profile.discuss.context");
  assert(config.discuss.label === "提交反例", "The single discussion action must remain 提交反例.");
  assert(requireGitHubUrl(config.discuss.url, "profile.discuss.url").href === EXPERIMENT_ISSUE, "The discussion action must target the dedicated public experiment Issue.");

  assertKeys(config.theme, ["id", "tokens", "assets"], "profile.theme");
  assert(config.theme.id === "ring-ledger-v2", "profile.theme.id must be ring-ledger-v2.");
  assertKeys(config.theme.tokens, ["light", "dark"], "profile.theme.tokens");
  validateTokens(config.theme.tokens.light, "profile.theme.tokens.light");
  validateTokens(config.theme.tokens.dark, "profile.theme.tokens.dark");
  assertKeys(config.theme.assets, ["heroSignature", "evidenceBlackMarker"], "profile.theme.assets");
  assertKeys(config.theme.assets.heroSignature, ["alt", "width", "height"], "profile.theme.assets.heroSignature");
  assertKeys(config.theme.assets.evidenceBlackMarker, ["alt", "width", "height"], "profile.theme.assets.evidenceBlackMarker");
  assert(requireLine(config.theme.assets.heroSignature.alt, "profile.theme.assets.heroSignature.alt").length <= 80, "Hero alt text must remain concise.");
  requireLine(config.theme.assets.evidenceBlackMarker.alt, "profile.theme.assets.evidenceBlackMarker.alt", { allowEmpty: true });
  assert(config.theme.assets.evidenceBlackMarker.alt === "", "The Evidence black marker must remain decorative with empty alt text.");
  assert(config.theme.assets.heroSignature.width === RING_LEDGER_MODEL.hero.width && config.theme.assets.heroSignature.height === RING_LEDGER_MODEL.hero.height, "Hero asset dimensions changed from the canonical declaration.");
  assert(config.theme.assets.evidenceBlackMarker.width === RING_LEDGER_MODEL.evidence.width && config.theme.assets.evidenceBlackMarker.height === RING_LEDGER_MODEL.evidence.height, "Evidence marker dimensions changed from the canonical declaration.");

  return config;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function markdownText(value) {
  return String(value).replace(/([\\*_[\]<>])/g, "\\$1");
}

function markdownDestination(value) {
  return `<${value}>`;
}

function markdownLink(label, url) {
  return `[${markdownText(label)}](${markdownDestination(url)})`;
}

export function createViewModel(config) {
  validateProfile(config);
  return Object.freeze({
    username: config.github.username,
    page: config.page,
    identity: config.identity,
    experiment: config.experiment,
    principles: config.principles,
    openLoop: config.openLoop,
    discuss: config.discuss,
    theme: config.theme,
    assets: ASSET_REFS
  });
}

function renderPicture(view, role, indent = "") {
  const refs = view.assets[role];
  const declaration = role === "hero" ? view.theme.assets.heroSignature : view.theme.assets.evidenceBlackMarker;
  return [
    `${indent}<picture>`,
    `${indent}  <source media="(prefers-color-scheme: dark)" srcset="${refs.dark}">`,
    `${indent}  <img src="${refs.light}" alt="${escapeHtml(declaration.alt)}" width="${declaration.width}" height="${declaration.height}">`,
    `${indent}</picture>`
  ].join("\n");
}

function renderPath(path, tokens, indent = "  ") {
  return `${indent}<path id="${path.id}" d="${path.d}" fill="none" stroke="${tokens[path.token]}" data-token="${path.token}" stroke-width="${path.strokeWidth}" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges"/>`;
}

function renderHeroSvg(view, mode) {
  const model = RING_LEDGER_MODEL.hero;
  const tokens = view.theme.tokens[mode];
  const paths = model.paths.map((path) => renderPath(path, tokens, "    ")).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="ring-ledger-title ring-ledger-desc" data-role="${model.role}" viewBox="0 0 ${model.width} ${model.height}">
  <title id="ring-ledger-title">Ring Ledger Oak glyph</title>
  <desc id="ring-ledger-desc">Open stepped rings resolve into an Oak trunk and evidence ledger.</desc>
  <rect id="hero-field" width="${model.width}" height="${model.height}" fill="${tokens.canvas}" data-token="canvas"/>
  <path id="open-ledger-rule" d="M64 220H600" fill="none" stroke="${tokens.rule}" data-token="rule" stroke-width="2" shape-rendering="crispEdges"/>
  <rect id="ledger-origin" x="64" y="208" width="48" height="24" fill="${tokens.forest}" data-token="forest" shape-rendering="crispEdges"/>
  <g id="ring-ledger-glyph">
${paths}
  </g>
</svg>
`;
}

function renderEvidenceSvg(view, mode) {
  const model = RING_LEDGER_MODEL.evidence;
  const tokens = view.theme.tokens[mode];
  const paths = model.paths.map((path) => renderPath(path, tokens, "    ")).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-role="${model.role}" viewBox="0 0 ${model.width} ${model.height}">
  <rect id="black-field" width="${model.width}" height="${model.height}" fill="${tokens.blackField}" data-token="blackField"/>
  <path id="marker-rule" d="M80 56H640" fill="none" stroke="${tokens.rule}" data-token="rule" stroke-width="2" shape-rendering="crispEdges"/>
  <g id="ring-ledger-marker">
${paths}
  </g>
  <rect id="marker-boundary" x="1" y="1" width="1198" height="110" fill="none" stroke="${tokens.rule}" data-token="rule" stroke-width="2" shape-rendering="crispEdges"/>
</svg>
`;
}

export function normalizeThemeProjection(svg) {
  return svg.replace(/\b(fill|stroke)="#[0-9A-F]{6}" data-token="([A-Za-z]+)"/g, '$1="{{$2}}" data-token="$2"');
}

export function renderReadme(view) {
  const evidence = view.experiment.evidence
    .map((item, index) => `${index + 1}. ${markdownLink(item.statement, item.url)}`)
    .join("\n");
  const principles = view.principles
    .map((item) => `- ${markdownLink(item.label, item.url)}`)
    .join("\n");
  const linkedTruth = markdownText(view.openLoop.truth).replace(
    markdownText(view.openLoop.repo),
    markdownLink(view.openLoop.repo, view.openLoop.url)
  );

  return `${renderPicture(view, "hero")}

# ${markdownText(view.identity.name)}

${markdownText(view.identity.lead)}

## 02 — Current experiment

**${markdownText(view.experiment.name)}.** ${markdownText(view.experiment.context)}

### Question

${markdownText(view.experiment.question)}

### Hypothesis

${markdownText(view.experiment.hypothesis)}

${renderPicture(view, "evidence")}

### Evidence

${evidence}

### Next

${markdownText(view.experiment.next)}

---

## 03 — Working principles

${principles}

---

## 04 — Open loop

${markdownText(view.openLoop.continuity)} ${linkedTruth} ${markdownText(view.openLoop.closure)}

---

## 05 — Discuss on GitHub

${markdownText(view.discuss.context)} ${markdownLink(view.discuss.label, view.discuss.url)}.

<!-- Generated from profile.json by artifacts/build_profile.mjs. Do not edit by hand. -->
`;
}

function htmlLink(label, url) {
  return `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
}

export function renderPreview(view) {
  const evidence = view.experiment.evidence
    .map((item) => `          <li>${htmlLink(item.statement, item.url)}</li>`)
    .join("\n");
  const principles = view.principles
    .map((item) => `          <li>${htmlLink(item.label, item.url)}</li>`)
    .join("\n");
  const linkedTruth = escapeHtml(view.openLoop.truth).replace(
    escapeHtml(view.openLoop.repo),
    htmlLink(view.openLoop.repo, view.openLoop.url)
  );
  const light = view.theme.tokens.light;
  const dark = view.theme.tokens.dark;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(view.identity.name)} · GitHub Profile preview</title>
  <style>
    :root {
      color-scheme: light dark;
      --page: #ffffff;
      --ink: #1f2328;
      --muted: #59636e;
      --rule: #d1d9e0;
      --link: #0969da;
      --forest: ${light.forest};
    }
    * { box-sizing: border-box; }
    html { background: var(--page); }
    body {
      background: var(--page);
      color: var(--ink);
      font: 16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
    }
    a { color: var(--link); text-underline-offset: .2em; }
    a:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
    .platform-bar {
      border-bottom: 1px solid var(--rule);
      color: var(--muted);
      font-size: 13px;
      padding: 12px 24px;
    }
    .platform-bar strong { color: var(--ink); margin-right: 12px; }
    .profile-shell {
      display: grid;
      gap: 32px;
      grid-template-columns: 264px minmax(0, 860px);
      margin: 0 auto;
      max-width: 1216px;
      padding: 32px 24px 80px;
    }
    .native-profile { color: var(--muted); }
    .avatar {
      background: #F0F0F0;
      border: 1px solid var(--rule);
      border-radius: 50%;
      display: block;
      height: auto;
      max-width: 220px;
      width: 100%;
    }
    .native-name { color: var(--ink); font-size: 24px; font-weight: 600; margin: 16px 0 0; }
    .native-user { font-size: 20px; margin: 0 0 16px; }
    .native-note { font-size: 13px; }
    .readme { min-width: 0; }
    .readme picture, .readme img { display: block; max-width: 100%; }
    .readme img { height: auto; width: 100%; }
    .readme h1 {
      border-bottom: 1px solid var(--rule);
      font-size: 2em;
      line-height: 1.25;
      margin: 20px 0 8px;
      padding-bottom: .3em;
    }
    .lead { font-size: 20px; line-height: 1.45; margin: 0 0 40px; max-width: 42em; }
    .readme h2 {
      border-bottom: 1px solid var(--rule);
      font-size: 1.5em;
      line-height: 1.25;
      margin: 32px 0 16px;
      padding-bottom: .3em;
    }
    .readme h3 { font-size: 1.18em; line-height: 1.35; margin: 24px 0 8px; }
    .readme p { margin: 0 0 16px; }
    .experiment-name { color: var(--forest); font-weight: 700; }
    .evidence-marker { margin-top: 28px; }
    .readme ol, .readme ul { padding-left: 1.6em; }
    .readme li { margin: 8px 0; }
    .readme hr { border: 0; border-top: 1px solid var(--rule); margin: 36px 0 0; }
    @media (prefers-color-scheme: dark) {
      :root {
        --page: #0d1117;
        --ink: #e6edf3;
        --muted: #8d96a0;
        --rule: #30363d;
        --link: #4493f8;
        --forest: ${dark.forest};
      }
    }
    @media (max-width: 900px) {
      .profile-shell { grid-template-columns: 1fr; padding-top: 24px; }
      .native-profile { align-items: center; display: grid; gap: 0 16px; grid-template-columns: 72px 1fr; }
      .avatar { grid-row: 1 / span 3; max-width: 72px; }
      .native-name { font-size: 20px; margin-top: 0; }
      .native-user { font-size: 16px; margin-bottom: 0; }
      .native-note { grid-column: 1 / -1; }
    }
    @media (max-width: 480px) {
      .platform-bar { padding: 10px 12px; }
      .profile-shell { gap: 24px; padding: 16px 12px 64px; }
      .readme h1 { font-size: 1.75em; }
      .readme h2 { font-size: 1.35em; }
      .readme h3 { font-size: 1.12em; }
      .lead { font-size: 18px; margin-bottom: 32px; }
    }
  </style>
</head>
<body>
  <header class="platform-bar"><strong>${escapeHtml(view.username)}</strong>GitHub Profile content preview</header>
  <main class="profile-shell">
    <aside class="native-profile" aria-label="Native GitHub Profile context">
      <svg class="avatar" viewBox="0 0 180 180" role="img" aria-label="Current pixel-green Cooper Oak account avatar">
        <rect width="180" height="180" fill="#F0F0F0"/>
        <path fill="#6ed959" d="M24 24h36v60h18v18h24V84h18V24h36v78h-18v18h-18v18h-18v18H78v-18H60v-18H42v-18H24z"/>
      </svg>
      <p class="native-name">Cooper Oak</p>
      <p class="native-user">${escapeHtml(view.username)}</p>
      <p class="native-note">Account avatar remains unchanged for the launch transition. The README introduces Ring Ledger.</p>
    </aside>
    <article class="readme" aria-label="Generated Profile README">
${renderPicture(view, "hero", "      ")}
      <h1>${escapeHtml(view.identity.name)}</h1>
      <p class="lead">${escapeHtml(view.identity.lead)}</p>
      <section aria-labelledby="current-experiment">
        <h2 id="current-experiment">02 — Current experiment</h2>
        <p><span class="experiment-name">${escapeHtml(view.experiment.name)}.</span> ${escapeHtml(view.experiment.context)}</p>
        <h3>Question</h3>
        <p>${escapeHtml(view.experiment.question)}</p>
        <h3>Hypothesis</h3>
        <p>${escapeHtml(view.experiment.hypothesis)}</p>
        <div class="evidence-marker">
${renderPicture(view, "evidence", "          ")}
        </div>
        <h3>Evidence</h3>
        <ol>
${evidence}
        </ol>
        <h3>Next</h3>
        <p>${escapeHtml(view.experiment.next)}</p>
      </section>
      <hr>
      <section aria-labelledby="working-principles">
        <h2 id="working-principles">03 — Working principles</h2>
        <ul>
${principles}
        </ul>
      </section>
      <hr>
      <section aria-labelledby="open-loop">
        <h2 id="open-loop">04 — Open loop</h2>
        <p>${escapeHtml(view.openLoop.continuity)} ${linkedTruth} ${escapeHtml(view.openLoop.closure)}</p>
      </section>
      <hr>
      <section aria-labelledby="discuss-on-github">
        <h2 id="discuss-on-github">05 — Discuss on GitHub</h2>
        <p>${escapeHtml(view.discuss.context)} ${htmlLink(view.discuss.label, view.discuss.url)}.</p>
      </section>
    </article>
  </main>
</body>
</html>
`;
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function findHexColors(source) {
  return new Set(source.match(/#[0-9A-F]{6}/g) ?? []);
}

export function validateRingLedgerSvg(source, config, role) {
  const model = RING_LEDGER_MODEL[role];
  assert(source.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), `${role} SVG must declare UTF-8 XML.`);
  assert(source.includes('xmlns="http://www.w3.org/2000/svg"'), `${role} SVG must declare the SVG namespace.`);
  assert(source.includes(`data-role="${model.role}"`), `${role} SVG role changed.`);
  assert(source.includes(`viewBox="0 0 ${model.width} ${model.height}"`), `${role} SVG viewBox changed.`);
  assert(source.trimEnd().endsWith("</svg>"), `${role} SVG must close its root element.`);
  assert(!/<(?:script|foreignObject|animate|set|filter|linearGradient|radialGradient|text|style|a)\b/i.test(source), `${role} SVG contains prohibited content.`);
  const sourceWithoutNamespace = source.replace('xmlns="http://www.w3.org/2000/svg"', "");
  assert(!/\b(?:href|onclick|onload|onmouseover)=|javascript:|url\(|https?:\/\//i.test(sourceWithoutNamespace), `${role} SVG contains a link, event, script, or remote resource.`);
  assert(!/\brx=|\bry=|drop-shadow|box-shadow|cursor|button|selected|\bfocus\b|telemetry|status|dashboard/i.test(source), `${role} SVG contains rounded chrome, depth, or interaction language.`);
  const allowedColors = new Set([
    ...Object.values(config.theme.tokens.light),
    ...Object.values(config.theme.tokens.dark)
  ]);
  for (const color of findHexColors(source)) assert(allowedColors.has(color), `${role} SVG contains undeclared color ${color}.`);
  for (const path of model.paths) {
    assert(source.includes(`id="${path.id}" d="${path.d}"`), `${role} SVG is missing canonical path ${path.id}.`);
    assert(source.includes(`data-token="${path.token}"`), `${role} SVG is missing token ownership for ${path.id}.`);
  }
  assert(!/COOPER OAK|Experiments in keeping|Capability Routing|required visual provider|CloudAI|append-only|提交反例/i.test(source), `${role} SVG contains semantic Profile copy.`);
  if (role === "evidence") {
    assert(source.includes('aria-hidden="true"') && source.includes('focusable="false"'), "Evidence marker must remain decorative.");
    assert(!/<(?:title|desc)\b/i.test(source), "Evidence marker must not carry duplicate semantics.");
  }
}

export function validateOutputs(outputs, config) {
  const expectedNames = Object.keys(OUTPUT_PATHS);
  assert(Object.keys(outputs).length === expectedNames.length, "Generated output set is incomplete.");
  for (const name of expectedNames) assert(typeof outputs[name] === "string" && outputs[name].length > 0, `${name} was not generated.`);

  const readme = outputs["README.md"];
  const h1 = [...readme.matchAll(/^# (.+)$/gm)].map((match) => match[1]);
  const h2 = [...readme.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const h3 = [...readme.matchAll(/^### (.+)$/gm)].map((match) => match[1]);
  assert(JSON.stringify(h1) === JSON.stringify(["COOPER OAK"]), "README must contain exactly the locked H1.");
  assert(JSON.stringify(h2) === JSON.stringify(["02 — Current experiment", "03 — Working principles", "04 — Open loop", "05 — Discuss on GitHub"]), "README H2 ledger changed.");
  assert(JSON.stringify(h3) === JSON.stringify(["Question", "Hypothesis", "Evidence", "Next"]), "README experiment fields changed.");
  assert(countMatches(readme, /^---$/gm) === 3, "README must contain exactly three top-level thematic breaks.");
  assert(countMatches(readme, /^<picture>$/gm) === 2, "README must reference exactly the two approved visual roles.");
  assert(countMatches(readme, /media="\(prefers-color-scheme: dark\)"/g) === 2, "Each visual role must expose one dark theme source.");
  assert(!/max-width:|profile-signature-mobile|section-marker|<table|<button|role="button"|```|^>\s|badge|telemetry|dashboard|terminal|prompt/i.test(readme), "README contains a viewport asset, layout hack, fake control, or rejected UI language.");
  assert(readme.indexOf("profile-signature-light.svg") < readme.indexOf("# COOPER OAK"), "Hero signature must precede H1.");
  assert(readme.indexOf("# COOPER OAK") < readme.indexOf(config.identity.lead) && readme.indexOf(config.identity.lead) < readme.indexOf("## 02 — Current experiment"), "Hero semantic order changed.");
  assert(readme.indexOf("profile-evidence-light.svg") < readme.indexOf("### Evidence") && readme.indexOf("### Evidence") < readme.indexOf("### Next"), "Evidence marker adjacency or order changed.");
  assert(readme.includes('alt="" width="1200" height="112"'), "Evidence marker must use empty alt text.");
  const evidenceSection = readme.slice(readme.indexOf("### Evidence"), readme.indexOf("### Next"));
  assert(countMatches(evidenceSection, /^\d\. \[.+\]\(<https:\/\/github\.com\/.+\)$/gm) === 3, "Evidence must contain exactly three natural-language proof links.");
  assert(countMatches(readme, /^- \[.+\]\(<https:\/\/github\.com\/.+\)$/gm) === 3, "Working principles must contain exactly three native link rows.");
  assert(countMatches(readme, new RegExp(`\\[${config.openLoop.repo}\\]\\(<${config.openLoop.url}>\\)`, "g")) === 1, "Open loop must contain one writing-loop-harness record.");
  assert(countMatches(readme, new RegExp(`\\[${config.discuss.label}\\]\\(<${config.discuss.url}>\\)`, "g")) === 1, "Discuss must contain one contextual counterexample link.");
  assert(!PLACEHOLDER_PATTERN.test(readme), "README contains placeholder copy.");

  const preview = outputs["profile.html"];
  assert(preview.includes('<meta name="viewport"'), "Preview must declare a responsive viewport.");
  assert(!/<script\b|<button\b|role="button"|javascript:|display:\s*none/i.test(preview), "Preview must remain semantic, script-free, and visible by default.");
  assert(countMatches(preview, /<h1>/g) === 1 && countMatches(preview, /<h2 id=/g) === 4 && countMatches(preview, /<h3>/g) === 4, "Preview heading outline changed.");
  assert(countMatches(preview, /<hr>/g) === 3, "Preview must contain exactly three thematic breaks.");
  assert(countMatches(preview, /<picture>/g) === 2, "Preview must reference exactly two visual roles.");
  for (const item of config.experiment.evidence) assert(preview.includes(`href="${escapeHtml(item.url)}"`), `Preview is missing proof URL ${item.url}.`);
  assert(preview.includes(`href="${escapeHtml(config.openLoop.url)}"`), "Preview is missing the Open loop repository.");
  assert(preview.includes(`href="${escapeHtml(config.discuss.url)}"`), "Preview is missing the counterexample Issue.");

  const heroLight = outputs["assets/profile-signature-light.svg"];
  const heroDark = outputs["assets/profile-signature-dark.svg"];
  const evidenceLight = outputs["assets/profile-evidence-light.svg"];
  const evidenceDark = outputs["assets/profile-evidence-dark.svg"];
  validateRingLedgerSvg(heroLight, config, "hero");
  validateRingLedgerSvg(heroDark, config, "hero");
  validateRingLedgerSvg(evidenceLight, config, "evidence");
  validateRingLedgerSvg(evidenceDark, config, "evidence");
  assert(normalizeThemeProjection(heroLight) === normalizeThemeProjection(heroDark), "Hero light/dark geometry drifted.");
  assert(normalizeThemeProjection(evidenceLight) === normalizeThemeProjection(evidenceDark), "Evidence light/dark geometry drifted.");
  const bounds = RING_LEDGER_MODEL.hero.glyphBounds;
  assert(bounds.width / RING_LEDGER_MODEL.hero.width >= 0.3, "Hero glyph width fell below 30%.");
  assert(bounds.height / RING_LEDGER_MODEL.hero.height >= 0.65, "Hero glyph height fell below 65%.");
  assert(RING_LEDGER_MODEL.hero.width - (bounds.x + bounds.width) >= 60, "Hero right safe edge fell below 60 units.");

  for (const [name, output] of Object.entries(outputs)) {
    assert(!/\r/.test(output), `${name} contains a carriage return.`);
  }
}

export function renderOutputs(config) {
  const view = createViewModel(config);
  const outputs = {
    "README.md": renderReadme(view),
    "profile.html": renderPreview(view),
    "assets/profile-signature-light.svg": renderHeroSvg(view, "light"),
    "assets/profile-signature-dark.svg": renderHeroSvg(view, "dark"),
    "assets/profile-evidence-light.svg": renderEvidenceSvg(view, "light"),
    "assets/profile-evidence-dark.svg": renderEvidenceSvg(view, "dark")
  };
  validateOutputs(outputs, config);
  return outputs;
}

async function loadProfile() {
  const source = await readFile(CONFIG_PATH, "utf8");
  let config;
  try {
    config = JSON.parse(source);
  } catch (error) {
    fail(`profile.json is not valid JSON: ${error.message}`);
  }
  return validateProfile(config);
}

async function checkOutputs(outputs) {
  const drift = [];
  for (const [name, path] of Object.entries(OUTPUT_PATHS)) {
    let existing;
    try {
      existing = await readFile(path, "utf8");
    } catch {
      drift.push(`${name} (missing)`);
      continue;
    }
    if (existing !== outputs[name]) drift.push(name);
  }
  assert(drift.length === 0, `Generated output drift: ${drift.join(", ")}. Run node artifacts/build_profile.mjs.`);
}

async function writeOutputs(outputs) {
  await Promise.all(Object.entries(OUTPUT_PATHS).map(([name, path]) => writeFile(path, outputs[name], "utf8")));
}

export async function main(args = process.argv.slice(2)) {
  const unknown = args.filter((argument) => argument !== "--check");
  assert(unknown.length === 0, `Unknown argument(s): ${unknown.join(", ")}.`);
  const outputs = renderOutputs(await loadProfile());
  if (args.includes("--check")) {
    await checkOutputs(outputs);
    console.log(`Profile outputs are current (${Object.keys(outputs).length} files).`);
    return;
  }
  await writeOutputs(outputs);
  console.log(`Generated ${Object.keys(outputs).length} Profile v2 files from profile.json.`);
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
