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
  "assets/profile-signature-mobile-light.svg": resolve(ROOT, "assets/profile-signature-mobile-light.svg"),
  "assets/profile-signature-mobile-dark.svg": resolve(ROOT, "assets/profile-signature-mobile-dark.svg")
});

const EVIDENCE_KINDS = new Set(["release", "documentation", "install", "tests", "ci"]);
const LEGACY_KEYS = new Set(["status", "loop", "flagships", "moduleGroups", "operatingMode"]);
const PLACEHOLDER_PATTERN = /(?:^|[\s:])(?:TODO|TBD)(?:$|[\s:])|[Ll]orem ipsum|[Aa]dd your|[Yy]our (?:url|link|website)/;
const REPO_PATTERN = /^[A-Za-z0-9_.-]+$/;
const HEX_PATTERN = /^#[0-9a-f]{6}$/;
const GFM_BLOCK_PATTERN = /^(?:#{1,6}(?:\s|$)|>|(?:[-+*]|\d+[.)])\s|(?:-{3,}|_{3,}|\*{3,})$)/;

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
  assert(unexpected.length === 0, `${path} contains unsupported fields: ${unexpected.join(", ")}.`);
}

function requireText(value, path) {
  assert(typeof value === "string" && value.trim() === value && value.length > 0, `${path} must be a non-empty trimmed string.`);
  assert(!/[\r\n]/.test(value), `${path} must stay on one source line.`);
  assert(!PLACEHOLDER_PATTERN.test(value), `${path} contains placeholder copy.`);
  assert(!/[<>]/.test(value), `${path} must not contain raw HTML.`);
  assert(!GFM_BLOCK_PATTERN.test(value), `${path} must not begin a GitHub Markdown block construct.`);
  return value;
}

function requireHttps(value, path) {
  const source = requireText(value, path);
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

function validateColorGroup(colors, path) {
  assertKeys(colors, ["canvas", "ink", "mutedInk", "brand", "rule"], path);
  for (const [key, value] of Object.entries(colors)) {
    assert(typeof value === "string" && HEX_PATTERN.test(value), `${path}.${key} must be a lowercase six-digit hex color.`);
  }
}

function scanLegacyKeys(value, path = "profile") {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanLegacyKeys(entry, `${path}[${index}]`));
    return;
  }
  if (!isPlainObject(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    assert(!LEGACY_KEYS.has(key), `${path}.${key} is a rejected evidence-console field; migrate to the v2 profile model.`);
    scanLegacyKeys(entry, `${path}.${key}`);
  }
}

export function validateProfile(config) {
  assert(isPlainObject(config), "profile.json must contain an object.");
  if (config.version === 1) {
    fail("profile.json version 1 is the rejected evidence-console schema; migrate to version 2.");
  }
  assert(config.version === 2, "profile.json version must be 2.");
  assertKeys(config, ["version", "github", "page", "identity", "theme", "featuredWork", "principles"], "profile");
  scanLegacyKeys(config);

  assertKeys(config.github, ["username"], "profile.github");
  const username = requireText(config.github.username, "profile.github.username");
  assert(REPO_PATTERN.test(username), "profile.github.username contains unsupported characters.");

  assertKeys(config.page, ["type", "primaryAudience", "primaryAction", "repositoryExit"], "profile.page");
  assert(config.page.type === "brand-landing-content-docs", "profile.page.type must be brand-landing-content-docs.");
  requireText(config.page.primaryAudience, "profile.page.primaryAudience");
  assertKeys(config.page.primaryAction, ["label", "href"], "profile.page.primaryAction");
  requireText(config.page.primaryAction.label, "profile.page.primaryAction.label");
  assert(config.page.primaryAction.href === "#selected-work", "The single primary action must resolve to #selected-work.");
  assertKeys(config.page.repositoryExit, ["label", "url"], "profile.page.repositoryExit");
  requireText(config.page.repositoryExit.label, "profile.page.repositoryExit.label");
  const repositoryExit = requireHttps(config.page.repositoryExit.url, "profile.page.repositoryExit.url");
  assert(repositoryExit.origin === "https://github.com" && repositoryExit.pathname === `/${username}`, "The repository exit must stay on the public GitHub profile.");
  assert(repositoryExit.searchParams.get("tab") === "repositories" && [...repositoryExit.searchParams].length === 1 && !repositoryExit.hash, "The repository exit must target the GitHub repositories tab without extra state.");

  assertKeys(config.identity, ["name", "positioning", "supporting", "origin"], "profile.identity");
  for (const key of ["name", "positioning", "supporting", "origin"]) {
    requireText(config.identity[key], `profile.identity.${key}`);
  }

  assertKeys(config.theme, ["id", "colors", "signature"], "profile.theme");
  assert(config.theme.id === "profile-editorial-v1", "profile.theme.id must be profile-editorial-v1.");
  assertKeys(config.theme.colors, ["light", "dark"], "profile.theme.colors");
  validateColorGroup(config.theme.colors.light, "profile.theme.colors.light");
  validateColorGroup(config.theme.colors.dark, "profile.theme.colors.dark");
  assert(config.theme.colors.light.brand === config.theme.colors.dark.brand, "The avatar-derived brand color must be stable across themes.");

  assertKeys(config.theme.signature, ["alt", "category", "metadata", "desktop", "mobile"], "profile.theme.signature");
  for (const key of ["alt", "category", "metadata"]) {
    requireText(config.theme.signature[key], `profile.theme.signature.${key}`);
  }
  const categoryParts = config.theme.signature.category.split(" · ");
  assert(categoryParts.length === 3 && categoryParts.every(Boolean), "Signature category must contain exactly three disciplines separated by ' · '.");
  assert(config.theme.signature.alt.length <= 100, "Signature alt text must remain concise.");
  assertKeys(config.theme.signature.desktop, ["width", "height"], "profile.theme.signature.desktop");
  assertKeys(config.theme.signature.mobile, ["width", "height"], "profile.theme.signature.mobile");
  assert(config.theme.signature.desktop.width === 1200 && config.theme.signature.desktop.height === 240, "Desktop signature must use the declared 1200 × 240 viewBox.");
  assert(config.theme.signature.mobile.width === 600 && config.theme.signature.mobile.height === 260, "Mobile signature must use the declared 600 × 260 viewBox.");

  assert(Array.isArray(config.featuredWork) && config.featuredWork.length === 3, "profile.featuredWork must contain exactly three projects.");
  const repos = new Set();
  for (const [index, project] of config.featuredWork.entries()) {
    const path = `profile.featuredWork[${index}]`;
    assertKeys(project, ["repo", "url", "summary", "evidence"], path);
    const repo = requireText(project.repo, `${path}.repo`);
    assert(REPO_PATTERN.test(repo), `${path}.repo contains unsupported characters.`);
    assert(!repos.has(repo.toLowerCase()), `${path}.repo duplicates another selected project.`);
    repos.add(repo.toLowerCase());
    const repositoryPath = `/${username}/${repo}`;
    const url = requireHttps(project.url, `${path}.url`);
    assert(url.origin === "https://github.com" && url.pathname === repositoryPath && !url.search && !url.hash, `${path}.url must be the selected public repository URL.`);
    requireText(project.summary, `${path}.summary`);
    assert(Array.isArray(project.evidence) && project.evidence.length >= 1 && project.evidence.length <= 2, `${path}.evidence must contain one or two proof links.`);
    const evidenceLabels = new Set();
    for (const [evidenceIndex, evidence] of project.evidence.entries()) {
      const evidencePath = `${path}.evidence[${evidenceIndex}]`;
      assertKeys(evidence, ["kind", "label", "url"], evidencePath);
      assert(EVIDENCE_KINDS.has(evidence.kind), `${evidencePath}.kind is unsupported.`);
      const label = requireText(evidence.label, `${evidencePath}.label`);
      assert(!evidenceLabels.has(label.toLowerCase()), `${evidencePath}.label is duplicated.`);
      evidenceLabels.add(label.toLowerCase());
      const proofUrl = requireHttps(evidence.url, `${evidencePath}.url`);
      assert(proofUrl.origin === "https://github.com", `${evidencePath}.url must stay on GitHub.`);
      assert(proofUrl.pathname === repositoryPath || proofUrl.pathname.startsWith(`${repositoryPath}/`), `${evidencePath}.url must point to evidence inside ${repo}.`);
    }
  }

  assert(Array.isArray(config.principles) && config.principles.length === 3, "profile.principles must contain exactly three evidence-grounded principles.");
  const principles = new Set();
  for (const [index, principle] of config.principles.entries()) {
    const text = requireText(principle, `profile.principles[${index}]`);
    assert(!principles.has(text.toLowerCase()), `profile.principles[${index}] duplicates another principle.`);
    principles.add(text.toLowerCase());
  }

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

function escapeXml(value) {
  return escapeHtml(value);
}

function markdownText(value) {
  return String(value).replace(/([\\*_[\]<>])/g, "\\$1");
}

function markdownDestination(value) {
  return `<${value}>`;
}

function inlineHtml(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
}

export function createViewModel(config) {
  validateProfile(config);
  return Object.freeze({
    username: config.github.username,
    page: config.page,
    identity: config.identity,
    theme: config.theme,
    projects: config.featuredWork,
    principles: config.principles,
    assets: Object.freeze({
      light: "./assets/profile-signature-light.svg",
      dark: "./assets/profile-signature-dark.svg",
      mobileLight: "./assets/profile-signature-mobile-light.svg",
      mobileDark: "./assets/profile-signature-mobile-dark.svg"
    })
  });
}

function renderPicture(view, indent = "") {
  const alt = escapeHtml(view.theme.signature.alt);
  return [
    `${indent}<picture>`,
    `${indent}  <source media="(prefers-color-scheme: dark) and (max-width: 600px)" srcset="${view.assets.mobileDark}">`,
    `${indent}  <source media="(prefers-color-scheme: dark)" srcset="${view.assets.dark}">`,
    `${indent}  <source media="(max-width: 600px)" srcset="${view.assets.mobileLight}">`,
    `${indent}  <img src="${view.assets.light}" alt="${alt}" width="1200">`,
    `${indent}</picture>`
  ].join("\n");
}

function renderDesktopSignature(view, mode) {
  const colors = view.theme.colors[mode];
  const title = escapeXml(view.identity.name.toUpperCase());
  const category = escapeXml(view.theme.signature.category);
  const metadata = escapeXml(view.theme.signature.metadata);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="signature-title signature-desc" viewBox="0 0 1200 240">
  <title id="signature-title">${title}</title>
  <desc id="signature-desc">${escapeXml(view.theme.signature.alt)}</desc>
  <rect width="1200" height="240" fill="${colors.canvas}"/>
  <text x="48" y="96" fill="${colors.ink}" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800">${title}</text>
  <text x="50" y="144" fill="${colors.ink}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600">${category}</text>
  <rect x="48" y="180" width="168" height="8" fill="${colors.brand}"/>
  <rect x="216" y="183" width="576" height="2" fill="${colors.rule}"/>
  <text x="48" y="220" fill="${colors.mutedInk}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500">${metadata}</text>
  <rect x="888" y="0" width="72" height="72" fill="${colors.brand}"/>
  <rect x="1080" y="0" width="72" height="72" fill="${colors.brand}"/>
  <rect x="936" y="72" width="96" height="72" fill="${colors.brand}"/>
  <rect x="1032" y="72" width="96" height="72" fill="${colors.brand}"/>
  <rect x="984" y="144" width="96" height="96" fill="${colors.brand}"/>
</svg>
`;
}

function signatureCategoryLines(category) {
  const [first, second, third] = category.split(" · ");
  return [`${first} · ${second}`, third];
}

function renderMobileSignature(view, mode) {
  const colors = view.theme.colors[mode];
  const title = escapeXml(view.identity.name.toUpperCase());
  const metadata = escapeXml(view.theme.signature.metadata);
  const categoryLines = signatureCategoryLines(view.theme.signature.category).map(escapeXml);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="signature-title signature-desc" viewBox="0 0 600 260">
  <title id="signature-title">${title}</title>
  <desc id="signature-desc">${escapeXml(view.theme.signature.alt)}</desc>
  <rect width="600" height="260" fill="${colors.canvas}"/>
  <text x="32" y="82" fill="${colors.ink}" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800">${title}</text>
  <text x="32" y="136" fill="${colors.ink}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600">${categoryLines[0]}</text>
  <text x="32" y="174" fill="${colors.ink}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600">${categoryLines[1]}</text>
  <text x="32" y="226" fill="${colors.mutedInk}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500">${metadata}</text>
  <rect x="520" y="0" width="48" height="48" fill="${colors.brand}"/>
  <rect x="568" y="48" width="32" height="48" fill="${colors.brand}"/>
  <rect x="536" y="96" width="64" height="48" fill="${colors.brand}"/>
  <rect x="568" y="144" width="32" height="116" fill="${colors.brand}"/>
  <rect x="32" y="246" width="200" height="14" fill="${colors.brand}"/>
</svg>
`;
}

export function renderReadme(view) {
  const projectBlocks = view.projects.map((project) => {
    const proofs = project.evidence
      .map((evidence) => `[${markdownText(evidence.label)}](${markdownDestination(evidence.url)})`)
      .join(" · ");
    return `### [${markdownText(project.repo)}](${markdownDestination(project.url)})\n\n${markdownText(project.summary)}\n\n${proofs}`;
  });
  const principles = view.principles.map((principle) => `- ${markdownText(principle)}`).join("\n");

  return `${renderPicture(view)}

# ${markdownText(view.identity.name)}

**${markdownText(view.identity.positioning)}**

${markdownText(view.identity.supporting)}

${markdownText(view.identity.origin)}

[${markdownText(view.page.primaryAction.label)}](${view.page.primaryAction.href})

---

## Selected work

${projectBlocks.join("\n\n")}

## How I work

${principles}

[${markdownText(view.page.repositoryExit.label)}](${markdownDestination(view.page.repositoryExit.url)})

<!-- Generated from profile.json by artifacts/build_profile.mjs. Do not edit by hand. -->
`;
}

function renderProjectHtml(project) {
  const evidence = project.evidence
    .map((entry) => `<a href="${escapeHtml(entry.url)}">${escapeHtml(entry.label)}</a>`)
    .join(' <span aria-hidden="true">·</span> ');
  return `        <section class="project">
          <h3><a href="${escapeHtml(project.url)}">${escapeHtml(project.repo)}</a></h3>
          <p>${inlineHtml(project.summary)}</p>
          <p class="evidence">${evidence}</p>
        </section>`;
}

export function renderPreview(view) {
  const projectBlocks = view.projects.map(renderProjectHtml).join("\n");
  const principles = view.principles.map((principle) => `          <li>${escapeHtml(principle)}</li>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>${escapeHtml(view.identity.name)} — profile preview</title>
  <style>
    :root {
      color-scheme: light dark;
      --page: #ffffff;
      --ink: #1f2328;
      --muted: #636c76;
      --rule: #d0d7de;
      --link: #0969da;
      --code: #eff1f3;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: auto; }
    body {
      margin: 0;
      background: var(--page);
      color: var(--ink);
      font: 16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    a { color: var(--link); text-underline-offset: .2em; }
    a:focus-visible { outline: 3px solid var(--link); outline-offset: 3px; }
    .context {
      border-bottom: 1px solid var(--rule);
      color: var(--muted);
      padding: 14px 24px;
    }
    .context strong { color: var(--ink); margin-right: 12px; }
    .layout {
      display: grid;
      gap: 32px;
      grid-template-columns: 260px minmax(0, 860px);
      margin: 0 auto;
      max-width: 1216px;
      padding: 32px 24px 80px;
    }
    .identity { min-width: 0; }
    .avatar {
      background: ${view.theme.colors.light.canvas};
      border-radius: 50%;
      display: block;
      height: auto;
      max-width: 180px;
      width: 100%;
    }
    .identity-name { font-size: 24px; font-weight: 600; line-height: 1.25; margin: 16px 0 0; }
    .username { color: var(--muted); font-size: 18px; margin: 0 0 16px; }
    .bio { margin: 0; }
    .readme { min-width: 0; }
    .readme picture, .readme picture img { display: block; width: 100%; }
    .readme h1 {
      border-bottom: 1px solid var(--rule);
      font-size: 2em;
      line-height: 1.25;
      margin: 24px 0 16px;
      padding-bottom: .3em;
    }
    .readme h2 {
      border-bottom: 1px solid var(--rule);
      font-size: 1.5em;
      line-height: 1.25;
      margin: 32px 0 16px;
      padding-bottom: .3em;
    }
    .readme h3 { font-size: 1.25em; line-height: 1.3; margin: 24px 0 8px; overflow-wrap: anywhere; }
    .readme p { margin: 0 0 16px; }
    .supporting { font-size: 17px; }
    .origin { color: var(--muted); }
    .primary { display: inline-block; font-weight: 600; margin: 4px 0 8px; }
    .project { border: 0; margin: 0; padding: 0; }
    .project .evidence { font-size: 14px; }
    code { background: var(--code); border-radius: 3px; padding: .15em .35em; }
    ul { padding-left: 1.5em; }
    .repository-exit { font-weight: 600; margin-top: 24px; }
    @media (prefers-color-scheme: dark) {
      :root {
        --page: #0d1117;
        --ink: #e6edf3;
        --muted: #8d96a0;
        --rule: #30363d;
        --link: #4493f8;
        --code: #161b22;
      }
    }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; padding-top: 24px; }
      .identity { align-items: center; display: grid; gap: 0 16px; grid-template-columns: 72px 1fr; }
      .avatar { grid-row: 1 / span 3; max-width: 72px; }
      .identity-name { margin-top: 0; }
      .username { margin-bottom: 0; }
      .bio { grid-column: 1 / -1; margin-top: 12px; }
    }
    @media (max-width: 480px) {
      .context { padding: 12px 16px; }
      .context span { display: block; }
      .layout { gap: 24px; padding: 20px 16px 64px; }
      .readme h1 { font-size: 1.75em; }
      .readme h2 { font-size: 1.35em; }
      .readme h3 { font-size: 1.15em; }
    }
  </style>
</head>
<body>
  <header class="context"><strong>${escapeHtml(view.username)}</strong><span>GitHub profile content preview</span></header>
  <main class="layout">
    <aside class="identity" aria-label="Native GitHub profile context">
      <svg class="avatar" viewBox="0 0 180 180" role="img" aria-label="Pixel-green Cooper Oak avatar motif">
        <rect width="180" height="180" fill="${view.theme.colors.light.canvas}"/>
        <path fill="${view.theme.colors.light.brand}" d="M24 24h36v60h18v18h24V84h18V24h36v78h-18v18h-18v18h-18v18H78v-18H60v-18H42v-18H24z"/>
      </svg>
      <p class="identity-name">${escapeHtml(view.identity.name)}</p>
      <p class="username">${escapeHtml(view.username)}</p>
      <p class="bio">${escapeHtml(view.identity.positioning)}</p>
    </aside>
    <article class="readme" aria-label="Generated profile README">
${renderPicture(view, "      ")}
      <h1>${escapeHtml(view.identity.name)}</h1>
      <p><strong>${escapeHtml(view.identity.positioning)}</strong></p>
      <p class="supporting" lang="zh-CN">${escapeHtml(view.identity.supporting)}</p>
      <p class="origin">${escapeHtml(view.identity.origin)}</p>
      <p><a class="primary" href="${escapeHtml(view.page.primaryAction.href)}">${escapeHtml(view.page.primaryAction.label)}</a></p>
      <section id="selected-work" aria-labelledby="selected-work-heading">
        <h2 id="selected-work-heading">Selected work</h2>
${projectBlocks}
      </section>
      <section aria-labelledby="how-i-work">
        <h2 id="how-i-work">How I work</h2>
        <ul>
${principles}
        </ul>
      </section>
      <p class="repository-exit"><a href="${escapeHtml(view.page.repositoryExit.url)}">${escapeHtml(view.page.repositoryExit.label)}</a></p>
    </article>
  </main>
</body>
</html>
`;
}

function findHexColors(source) {
  return new Set((source.match(/#[0-9a-fA-F]{6}/g) ?? []).map((color) => color.toLowerCase()));
}

export function validateSignatureSvg(source, config, mobile) {
  assert(source.startsWith("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"), "Signature SVG must declare UTF-8 XML.");
  assert(source.includes('xmlns="http://www.w3.org/2000/svg"'), "Signature SVG must declare the SVG namespace.");
  assert(source.trimEnd().endsWith("</svg>"), "Signature SVG must close its root element.");
  assert(!/<(?:script|foreignObject|animate|set|filter|linearGradient|radialGradient)\b/i.test(source), "Signature SVG contains a prohibited active or decorative-depth element.");
  const sourceWithoutNamespace = source.replace('xmlns="http://www.w3.org/2000/svg"', "");
  assert(!/\b(?:href|onclick|onload|onmouseover)=|javascript:|url\(|https?:\/\//i.test(sourceWithoutNamespace), "Signature SVG must not contain links, events, scripts, or remote resources.");
  assert(!/\brx=|\bry=|drop-shadow|box-shadow/i.test(source), "Signature SVG must use flat square geometry.");
  assert(!/button|selected|focus|telemetry|status|dashboard/i.test(source), "Signature SVG must not imply application controls or telemetry.");
  const allowedColors = new Set([
    ...Object.values(config.theme.colors.light),
    ...Object.values(config.theme.colors.dark)
  ]);
  for (const color of findHexColors(source)) {
    assert(allowedColors.has(color), `Signature SVG contains undeclared color ${color}.`);
  }
  const minimumSize = mobile ? 26 : 20;
  const fontSizes = [...source.matchAll(/font-size="(\d+)"/g)].map((match) => Number(match[1]));
  assert(fontSizes.length >= 3, "Signature SVG must expose its text sizes for validation.");
  assert(fontSizes.every((size) => size >= minimumSize), `Signature SVG text must be at least ${minimumSize}px in this variant.`);
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

export function validateOutputs(outputs, config) {
  const expectedNames = Object.keys(OUTPUT_PATHS);
  assert(Object.keys(outputs).length === expectedNames.length, "Generated output set is incomplete.");
  for (const name of expectedNames) {
    assert(typeof outputs[name] === "string" && outputs[name].length > 0, `${name} was not generated.`);
  }

  const readme = outputs["README.md"];
  assert(countMatches(readme, /^# .+$/gm) === 1, "README must contain exactly one H1.");
  assert(countMatches(readme, /^## Selected work$/gm) === 1, "README must contain exactly one Selected work section.");
  assert(countMatches(readme, /^## How I work$/gm) === 1, "README must contain exactly one How I work section.");
  assert(countMatches(readme, /^## .+$/gm) === 2, "README must contain exactly the two approved H2 sections.");
  assert(countMatches(readme, /^### .+$/gm) === 3, "README must contain exactly three project H3 headings.");
  assert(countMatches(readme, /^#{1,6} .+$/gm) === 6, "README contains a heading outside the approved IA.");
  assert(countMatches(readme, /^(?:---+|___+|\*{3,})$/gm) === 1, "README must contain only the approved structural divider.");
  assert(countMatches(readme, /^- .+$/gm) === 3, "README must contain exactly the three approved principle bullets.");
  assert(readme.indexOf("# Cooper Oak") < readme.indexOf("## Selected work") && readme.indexOf("## Selected work") < readme.indexOf("## How I work"), "README section order does not match the approved IA.");
  assert(countMatches(readme, new RegExp(`\\[${config.page.primaryAction.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\(#selected-work\\)`, "g")) === 1, "README must expose exactly one primary action.");
  for (const project of config.featuredWork) {
    const escapedRepo = project.repo.replaceAll("_", "\\_");
    assert(countMatches(readme, new RegExp(`^### \\[${escapedRepo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`, "gm")) === 1, `README must contain one heading for ${project.repo}.`);
    assert(readme.includes(`](<${project.url}>)`), `README is missing the canonical repository URL for ${project.repo}.`);
    for (const proof of project.evidence) {
      assert(readme.includes(`](<${proof.url}>)`), `README is missing proof URL ${proof.url}.`);
    }
  }
  assert(readme.includes(`](<${config.page.repositoryExit.url}>)`), "README is missing the canonical repository-exit URL.");
  assert(!/OPERATING STATE|CURRENT DECISION FOCUS|MODULE REGISTRY|PUBLIC LAB|Evidence Ledger|MAP.+ALIGN.+ORCHESTRATE|<button|role="button"|dashboard|telemetry/i.test(readme), "README contains rejected dashboard or fake-control language.");
  assert(!PLACEHOLDER_PATTERN.test(readme), "README contains placeholder copy.");

  const preview = outputs["profile.html"];
  assert(preview.includes('<meta name="viewport"'), "Preview must declare a responsive viewport.");
  assert(preview.includes('id="selected-work"'), "Preview primary anchor target is missing.");
  assert(!/<script\b|<button\b|role="button"|javascript:/i.test(preview), "Preview must remain semantic, script-free, and free of fake controls.");
  assert(!/<h[2-6]\b/i.test(preview.slice(0, preview.indexOf("<h1"))), "Preview must not place a lower-level heading before its H1.");
  for (const project of config.featuredWork) {
    assert(preview.includes(`>${escapeHtml(project.repo)}</a>`), `Preview is missing ${project.repo}.`);
    for (const proof of project.evidence) {
      assert(preview.includes(`href="${escapeHtml(proof.url)}"`), `Preview is missing proof URL ${proof.url}.`);
    }
  }

  validateSignatureSvg(outputs["assets/profile-signature-light.svg"], config, false);
  validateSignatureSvg(outputs["assets/profile-signature-dark.svg"], config, false);
  validateSignatureSvg(outputs["assets/profile-signature-mobile-light.svg"], config, true);
  validateSignatureSvg(outputs["assets/profile-signature-mobile-dark.svg"], config, true);
}

export function renderOutputs(config) {
  const view = createViewModel(config);
  const outputs = {
    "README.md": renderReadme(view),
    "profile.html": renderPreview(view),
    "assets/profile-signature-light.svg": renderDesktopSignature(view, "light"),
    "assets/profile-signature-dark.svg": renderDesktopSignature(view, "dark"),
    "assets/profile-signature-mobile-light.svg": renderMobileSignature(view, "light"),
    "assets/profile-signature-mobile-dark.svg": renderMobileSignature(view, "dark")
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
  const checkOnly = args.includes("--check");
  const config = await loadProfile();
  const outputs = renderOutputs(config);
  if (checkOnly) {
    await checkOutputs(outputs);
    console.log(`Profile outputs are current (${Object.keys(outputs).length} files).`);
    return;
  }
  await writeOutputs(outputs);
  console.log(`Generated ${Object.keys(outputs).length} profile files from profile.json.`);
}

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
