import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Declarative GitHub profile generator.
 *
 * The pipeline is inspired by Profile Control Plane's reviewed-config approach.
 * The renderer is original and translates Cooper Oak's SignalOps design rules
 * into GitHub-safe, self-hosted static SVG without copying private product
 * assets, screenshots, fixtures, or brand marks.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(ROOT, "profile.evidence-console.json");
const EXPECTED_COLORS = new Set([
  "#ffffff",
  "#f5f5f5",
  "#000000",
  "#8c8c8c",
  "#dbdbdb",
  "#0382f7",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeMarkdown(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function shorten(value, maximumLength) {
  const text = String(value);
  return text.length <= maximumLength
    ? text
    : text.slice(0, maximumLength - 1).trimEnd() + "…";
}

function wrapWords(value, maximumLength) {
  const words = String(value).trim().split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (current && candidate.length > maximumLength) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function validateConfig(config) {
  assert(config.version === 1, "profile config version must be 1");
  assert(
    /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(
      config.github.username,
    ),
    "invalid GitHub username",
  );
  assert(
    config.theme.preset === "evidence-console",
    "theme preset must be evidence-console",
  );
  assert(config.theme.radius === 8, "theme radius must be 8");
  assert(config.theme.border === 1, "theme border must be 1");
  assert(config.theme.shadow === "none", "theme shadow must be none");
  assert(config.theme.gradient === "none", "theme gradient must be none");

  const configuredColors = new Set(
    config.theme.colors.map((color) => color.toLowerCase()),
  );
  assert(
    configuredColors.size === EXPECTED_COLORS.size &&
      [...EXPECTED_COLORS].every((color) => configuredColors.has(color)),
    "theme must use the fixed SignalOps six-color palette",
  );
  assert(config.status.length === 4, "exactly four status facts are required");
  assert(
    config.loop.length >= 4 && config.loop.length <= 6,
    "operating loop must contain four to six steps",
  );
  assert(
    config.flagships.length >= 3 && config.flagships.length <= 6,
    "selected systems must contain three to six repositories",
  );
  assert(config.moduleGroups.length <= 6, "too many module groups");

  const loopRepos = new Set(config.loop.map((item) => item.repo));
  assert(loopRepos.size === config.loop.length, "loop repositories must be unique");
  const flagshipRepos = new Set(config.flagships.map((item) => item.repo));
  assert(
    flagshipRepos.size === config.flagships.length,
    "selected repositories must be unique",
  );

  for (const item of config.flagships) {
    assert(
      item.proofUrl.startsWith("https://"),
      "evidence links must use HTTPS: " + item.repo,
    );
    assert(item.purpose.trim(), "missing project purpose: " + item.repo);
    assert(item.state.trim(), "missing project state: " + item.repo);
  }
}

function palette(mode) {
  return mode === "dark"
    ? {
        canvas: "#000000",
        surface: "#000000",
        subtle: "#000000",
        text: "#ffffff",
        textSecondary: "#f5f5f5",
        muted: "#8c8c8c",
        border: "#8c8c8c",
        control: "#f5f5f5",
        action: "#ffffff",
        actionText: "#000000",
        focus: "#0382f7",
      }
    : {
        canvas: "#ffffff",
        surface: "#ffffff",
        subtle: "#f5f5f5",
        text: "#000000",
        textSecondary: "#000000",
        muted: "#8c8c8c",
        border: "#dbdbdb",
        control: "#000000",
        action: "#000000",
        actionText: "#ffffff",
        focus: "#0382f7",
      };
}

function styleSheet() {
  return [
    "<style>",
    '.sans{font-family:system-ui,-apple-system,"Segoe UI","Helvetica Neue",Arial,sans-serif}',
    '.mono{font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace}',
    ".headline{font-weight:650;letter-spacing:-1.4px}",
    ".strong{font-weight:650}",
    ".meta{letter-spacing:1.2px}",
    "</style>",
  ].join("");
}

function svgStart(width, height, title, description) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      " " +
      height +
      '" role="img" aria-labelledby="title desc">',
    '<title id="title">' + escapeXml(title) + "</title>",
    '<desc id="desc">' + escapeXml(description) + "</desc>",
    styleSheet(),
  ].join("");
}

function svgText(x, y, value, options = {}) {
  const attrs = ['x="' + x + '"', 'y="' + y + '"'];
  if (options.className) attrs.push('class="' + options.className + '"');
  if (options.fill) attrs.push('fill="' + options.fill + '"');
  if (options.fontSize) attrs.push('font-size="' + options.fontSize + '"');
  if (options.fontWeight) attrs.push('font-weight="' + options.fontWeight + '"');
  if (options.textAnchor) attrs.push('text-anchor="' + options.textAnchor + '"');
  if (options.letterSpacing)
    attrs.push('letter-spacing="' + options.letterSpacing + '"');
  return "<text " + attrs.join(" ") + ">" + escapeXml(value) + "</text>";
}

function svgRect(x, y, width, height, options = {}) {
  const attrs = [
    'x="' + x + '"',
    'y="' + y + '"',
    'width="' + width + '"',
    'height="' + height + '"',
  ];
  if (options.rx !== undefined) attrs.push('rx="' + options.rx + '"');
  if (options.fill) attrs.push('fill="' + options.fill + '"');
  if (options.fillOpacity)
    attrs.push('fill-opacity="' + options.fillOpacity + '"');
  if (options.stroke) attrs.push('stroke="' + options.stroke + '"');
  if (options.strokeOpacity)
    attrs.push('stroke-opacity="' + options.strokeOpacity + '"');
  if (options.strokeWidth)
    attrs.push('stroke-width="' + options.strokeWidth + '"');
  return "<rect " + attrs.join(" ") + "/>";
}

function svgLine(x1, y1, x2, y2, color, opacity = 1) {
  return (
    '<path d="M' +
    x1 +
    " " +
    y1 +
    "H" +
    x2 +
    '" fill="none" stroke="' +
    color +
    '" stroke-width="1" stroke-opacity="' +
    opacity +
    '"/>'
  );
}

function renderMark(parts, p, x, y, size, mark) {
  parts.push(
    svgRect(x, y, size, size, {
      rx: 8,
      fill: p.action,
      stroke: p.action,
      strokeWidth: 1,
    }),
  );
  parts.push(
    svgText(x + size / 2, y + size * 0.64, mark, {
      className: "mono strong",
      fill: p.actionText,
      fontSize: Math.round(size * 0.34),
      textAnchor: "middle",
      letterSpacing: "0.5",
    }),
  );
}

function renderHeroDesktop(config, mode) {
  const p = palette(mode);
  const parts = [
    svgStart(
      1200,
      360,
      config.identity.name + " evidence console",
      "Identity, current operating state, and a six-step public building loop.",
    ),
    svgRect(0, 0, 1200, 360, { fill: p.canvas }),
    svgRect(1, 1, 1198, 358, {
      rx: 8,
      fill: p.canvas,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgLine(0, 64, 1200, 64, p.border),
  ];

  renderMark(parts, p, 24, 14, 40, config.identity.mark);
  parts.push(
    svgText(80, 31, config.identity.name.toUpperCase(), {
      className: "sans strong",
      fill: p.text,
      fontSize: 15,
    }),
    svgText(80, 50, config.identity.eyebrow, {
      className: "mono meta",
      fill: p.muted,
      fontSize: 10,
    }),
    svgRect(1000, 16, 176, 34, {
      rx: 8,
      fill: p.surface,
      stroke: p.control,
      strokeWidth: 1,
    }),
    svgRect(1000, 16, 3, 34, { fill: p.focus }),
    svgText(1088, 38, "BUILDING IN PUBLIC", {
      className: "mono strong",
      fill: p.text,
      fontSize: 10,
      textAnchor: "middle",
      letterSpacing: "0.8",
    }),
    svgText(32, 102, "01 / CURRENT MISSION", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 11,
    }),
    svgText(32, 156, config.identity.headline[0], {
      className: "sans headline",
      fill: p.text,
      fontSize: 44,
    }),
    svgText(32, 205, config.identity.headline[1], {
      className: "sans headline",
      fill: p.text,
      fontSize: 44,
    }),
    svgText(34, 238, config.identity.mission, {
      className: "sans",
      fill: p.textSecondary,
      fontSize: 15,
    }),
    svgText(34, 263, config.identity.tagline, {
      className: "sans",
      fill: p.muted,
      fontSize: 12,
    }),
    svgRect(760, 82, 416, 184, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(776, 108, "OPERATING STATE / FACTS", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 10,
    }),
    svgLine(760, 120, 1176, 120, p.border),
  );

  config.status.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 776 + column * 196;
    const y = 132 + row * 61;
    parts.push(
      svgRect(x, y, 184, 49, {
        rx: 8,
        fill: p.subtle,
        stroke: p.border,
        strokeWidth: 1,
      }),
      svgText(x + 12, y + 17, item.label, {
        className: "mono meta",
        fill: p.muted,
        fontSize: 8,
      }),
      svgText(x + 12, y + 36, item.value, {
        className: "sans strong",
        fill: p.text,
        fontSize: 12,
      }),
    );
  });

  config.loop.forEach((item, index) => {
    const x = 24 + index * 192;
    parts.push(
      svgRect(x, 286, 184, 50, {
        rx: 8,
        fill: item.role === "SHIP" ? p.action : p.surface,
        stroke: item.role === "SHIP" ? p.action : p.border,
        strokeWidth: 1,
      }),
      svgText(x + 12, 304, item.index + " / " + item.role, {
        className: "mono meta",
        fill: item.role === "SHIP" ? p.actionText : p.muted,
        fontSize: 8,
      }),
      svgText(x + 12, 324, shorten(item.repo, 23), {
        className: "mono strong",
        fill: item.role === "SHIP" ? p.actionText : p.text,
        fontSize: 10,
      }),
    );
  });

  parts.push("</svg>");
  return parts.join("");
}

function renderHeroMobile(config, mode) {
  const p = palette(mode);
  const parts = [
    svgStart(
      600,
      700,
      config.identity.name + " mobile evidence console",
      "Mobile profile identity, operating facts, and public building loop.",
    ),
    svgRect(0, 0, 600, 700, { fill: p.canvas }),
    svgRect(1, 1, 598, 698, {
      rx: 8,
      fill: p.canvas,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgLine(0, 68, 600, 68, p.border),
  ];

  renderMark(parts, p, 20, 14, 40, config.identity.mark);
  parts.push(
    svgText(76, 31, config.identity.name.toUpperCase(), {
      className: "sans strong",
      fill: p.text,
      fontSize: 15,
    }),
    svgText(76, 50, "BUILDER PROFILE / 2026", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 9,
    }),
    svgRect(398, 18, 178, 32, {
      rx: 8,
      fill: p.surface,
      stroke: p.control,
      strokeWidth: 1,
    }),
    svgRect(398, 18, 3, 32, { fill: p.focus }),
    svgText(487, 39, "BUILDING IN PUBLIC", {
      className: "mono strong",
      fill: p.text,
      fontSize: 9,
      textAnchor: "middle",
    }),
    svgText(24, 104, "01 / CURRENT MISSION", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 11,
    }),
    svgText(24, 151, config.identity.headline[0], {
      className: "sans headline",
      fill: p.text,
      fontSize: 36,
    }),
    svgText(24, 193, config.identity.headline[1], {
      className: "sans headline",
      fill: p.text,
      fontSize: 36,
    }),
    svgText(24, 228, config.identity.mission, {
      className: "sans",
      fill: p.textSecondary,
      fontSize: 15,
    }),
  );

  wrapWords(config.identity.tagline, 58)
    .slice(0, 2)
    .forEach((line, index) => {
      parts.push(
        svgText(24, 258 + index * 20, line, {
          className: "sans",
          fill: p.muted,
          fontSize: 12,
        }),
      );
    });

  parts.push(
    svgRect(24, 302, 552, 226, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(40, 330, "OPERATING STATE / FACTS", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 10,
    }),
    svgLine(24, 342, 576, 342, p.border),
  );

  config.status.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 40 + column * 268;
    const y = 358 + row * 79;
    parts.push(
      svgRect(x, y, 252, 63, {
        rx: 8,
        fill: p.subtle,
        stroke: p.border,
        strokeWidth: 1,
      }),
      svgText(x + 14, y + 22, item.label, {
        className: "mono meta",
        fill: p.muted,
        fontSize: 9,
      }),
      svgText(x + 14, y + 46, item.value, {
        className: "sans strong",
        fill: p.text,
        fontSize: 14,
      }),
    );
  });

  config.loop.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 24 + column * 280;
    const y = 548 + row * 44;
    const active = item.role === "SHIP";
    parts.push(
      svgRect(x, y, 272, 36, {
        rx: 8,
        fill: active ? p.action : p.surface,
        stroke: active ? p.action : p.border,
        strokeWidth: 1,
      }),
      svgText(x + 12, y + 13, item.index + " / " + item.role, {
        className: "mono strong",
        fill: active ? p.actionText : p.muted,
        fontSize: 8,
      }),
      svgText(x + 12, y + 29, shorten(item.repo, 31), {
        className: "mono",
        fill: active ? p.actionText : p.text,
        fontSize: 9,
      }),
    );
  });

  parts.push("</svg>");
  return parts.join("");
}

function renderLoopDesktop(config, mode) {
  const p = palette(mode);
  const parts = [
    svgStart(
      1200,
      430,
      config.identity.name + " operating loop",
      "A linear public workflow and an evidence ledger for selected repositories.",
    ),
    svgRect(0, 0, 1200, 430, { fill: p.canvas }),
    svgRect(1, 1, 1198, 428, {
      rx: 8,
      fill: p.canvas,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(24, 36, "02 / OPERATING LOOP", {
      className: "mono strong meta",
      fill: p.text,
      fontSize: 12,
    }),
    svgText(1176, 36, "EVIDENCE → BUILD → SHIP → LEARN", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 10,
      textAnchor: "end",
    }),
    svgLine(0, 58, 1200, 58, p.border),
    svgRect(24, 78, 344, 328, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(42, 106, "PUBLIC BUILDING LOOP", {
      className: "sans strong",
      fill: p.text,
      fontSize: 17,
    }),
    svgText(42, 126, "Six inspectable steps. One active shipping mode.", {
      className: "sans",
      fill: p.muted,
      fontSize: 11,
    }),
    svgLine(24, 140, 368, 140, p.border),
  ];

  config.loop.forEach((item, index) => {
    const y = 152 + index * 40;
    const active = item.role === "SHIP";
    parts.push(
      svgRect(40, y, 312, 32, {
        rx: 8,
        fill: active ? p.action : p.subtle,
        stroke: active ? p.action : p.border,
        strokeWidth: 1,
      }),
    );
    if (active) parts.push(svgRect(40, y, 3, 32, { fill: p.focus }));
    parts.push(
      svgText(54, y + 21, item.index, {
        className: "mono",
        fill: active ? p.actionText : p.muted,
        fontSize: 9,
      }),
      svgText(84, y + 21, item.role, {
        className: "mono strong",
        fill: active ? p.actionText : p.text,
        fontSize: 10,
      }),
      svgText(164, y + 21, shorten(item.repo, 25), {
        className: "mono",
        fill: active ? p.actionText : p.textSecondary,
        fontSize: 9,
      }),
    );
  });

  parts.push(
    svgRect(392, 78, 784, 116, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(412, 104, "CURRENT DECISION FOCUS", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 9,
    }),
    svgText(412, 141, "BUILD SMALL. SHIP REAL. LEARN IN PUBLIC.", {
      className: "sans headline",
      fill: p.text,
      fontSize: 28,
    }),
    svgText(412, 169, "Keep the claim, evidence, support boundary, and next action in the same surface.", {
      className: "sans",
      fill: p.textSecondary,
      fontSize: 12,
    }),
    svgRect(1014, 96, 138, 32, {
      rx: 8,
      fill: p.action,
      stroke: p.action,
      strokeWidth: 1,
    }),
    svgText(1083, 117, "MODE / SHIPPING", {
      className: "mono strong",
      fill: p.actionText,
      fontSize: 9,
      textAnchor: "middle",
    }),
    svgRect(392, 210, 784, 196, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgRect(393, 211, 782, 29, { fill: p.subtle }),
    svgText(410, 230, "ROLE", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 8,
    }),
    svgText(500, 230, "SYSTEM", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 8,
    }),
    svgText(780, 230, "EVIDENCE", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 8,
    }),
    svgText(994, 230, "STATE", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 8,
    }),
  );

  config.flagships.forEach((item, index) => {
    const y = 240 + index * 27.5;
    parts.push(
      svgLine(392, y, 1176, y, p.border, index === 0 ? 1 : 0.75),
      svgText(410, y + 18, item.role, {
        className: "mono strong",
        fill: p.text,
        fontSize: 9,
      }),
      svgText(500, y + 18, shorten(item.repo, 31), {
        className: "mono",
        fill: p.textSecondary,
        fontSize: 9,
      }),
      svgText(780, y + 18, item.proofLabel, {
        className: "sans",
        fill: p.textSecondary,
        fontSize: 10,
      }),
      svgText(994, y + 18, item.state, {
        className: "mono",
        fill: p.muted,
        fontSize: 8,
      }),
    );
  });

  parts.push("</svg>");
  return parts.join("");
}

function renderLoopMobile(config, mode) {
  const p = palette(mode);
  const parts = [
    svgStart(
      600,
      990,
      config.identity.name + " mobile operating loop",
      "Mobile decision focus, workflow steps, and selected-system evidence cards.",
    ),
    svgRect(0, 0, 600, 990, { fill: p.canvas }),
    svgRect(1, 1, 598, 988, {
      rx: 8,
      fill: p.canvas,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(24, 36, "02 / OPERATING LOOP", {
      className: "mono strong meta",
      fill: p.text,
      fontSize: 12,
    }),
    svgText(576, 36, "EVIDENCE → SHIP → LEARN", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 9,
      textAnchor: "end",
    }),
    svgLine(0, 58, 600, 58, p.border),
    svgRect(24, 78, 552, 146, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(42, 105, "CURRENT DECISION FOCUS", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 9,
    }),
    svgText(42, 145, "BUILD SMALL. SHIP REAL.", {
      className: "sans headline",
      fill: p.text,
      fontSize: 28,
    }),
    svgText(42, 179, "LEARN IN PUBLIC.", {
      className: "sans headline",
      fill: p.text,
      fontSize: 28,
    }),
    svgText(42, 204, "Claims, evidence, boundaries, and next actions stay together.", {
      className: "sans",
      fill: p.textSecondary,
      fontSize: 11,
    }),
    svgRect(24, 244, 552, 320, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(42, 272, "PUBLIC BUILDING LOOP", {
      className: "sans strong",
      fill: p.text,
      fontSize: 17,
    }),
    svgText(558, 272, "MODE / SHIPPING", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 9,
      textAnchor: "end",
    }),
    svgLine(24, 286, 576, 286, p.border),
  ];

  config.loop.forEach((item, index) => {
    const y = 300 + index * 42;
    const active = item.role === "SHIP";
    parts.push(
      svgRect(40, y, 520, 34, {
        rx: 8,
        fill: active ? p.action : p.subtle,
        stroke: active ? p.action : p.border,
        strokeWidth: 1,
      }),
    );
    if (active) parts.push(svgRect(40, y, 3, 34, { fill: p.focus }));
    parts.push(
      svgText(54, y + 22, item.index + " / " + item.role, {
        className: "mono strong",
        fill: active ? p.actionText : p.text,
        fontSize: 10,
      }),
      svgText(168, y + 22, shorten(item.repo, 31), {
        className: "mono",
        fill: active ? p.actionText : p.textSecondary,
        fontSize: 10,
      }),
      svgText(544, y + 22, item.state, {
        className: "mono",
        fill: active ? p.actionText : p.muted,
        fontSize: 8,
        textAnchor: "end",
      }),
    );
  });

  parts.push(
    svgRect(24, 584, 552, 382, {
      rx: 8,
      fill: p.surface,
      stroke: p.border,
      strokeWidth: 1,
    }),
    svgText(42, 612, "SELECTED SYSTEMS / EVIDENCE", {
      className: "mono meta",
      fill: p.muted,
      fontSize: 10,
    }),
    svgLine(24, 626, 576, 626, p.border),
  );

  config.flagships.forEach((item, index) => {
    const y = 640 + index * 53;
    parts.push(
      svgRect(40, y, 520, 45, {
        rx: 8,
        fill: p.subtle,
        stroke: p.border,
        strokeWidth: 1,
      }),
      svgText(54, y + 18, item.role + " / " + shorten(item.repo, 34), {
        className: "mono strong",
        fill: p.text,
        fontSize: 10,
      }),
      svgText(54, y + 35, "PROOF / " + item.proofLabel, {
        className: "sans",
        fill: p.textSecondary,
        fontSize: 10,
      }),
      svgText(546, y + 35, item.state, {
        className: "mono",
        fill: p.muted,
        fontSize: 8,
        textAnchor: "end",
      }),
    );
  });

  parts.push("</svg>");
  return parts.join("");
}

function renderPicture(baseName, alt) {
  return [
    "<picture>",
    '  <source media="(prefers-color-scheme: dark) and (max-width: 600px)" srcset="assets/' +
      baseName +
      '-mobile-dark.svg">',
    '  <source media="(prefers-color-scheme: light) and (max-width: 600px)" srcset="assets/' +
      baseName +
      '-mobile-light.svg">',
    '  <source media="(prefers-color-scheme: dark)" srcset="assets/' +
      baseName +
      '-dark.svg">',
    '  <source media="(prefers-color-scheme: light)" srcset="assets/' +
      baseName +
      '-light.svg">',
    '  <img alt="' +
      escapeXml(alt) +
      '" src="assets/' +
      baseName +
      '-light.svg" width="100%">',
    "</picture>",
  ].join("\n");
}

function renderReadme(config) {
  const username = config.github.username;
  const selected = config.flagships
    .map((item) => {
      const repoUrl = "https://github.com/" + username + "/" + item.repo;
      return [
        "### " +
          escapeMarkdown(item.role) +
          " / [" +
          escapeMarkdown(item.repo) +
          "](" +
          repoUrl +
          ")",
        escapeMarkdown(item.purpose),
        "**Evidence:** [" +
          escapeMarkdown(item.proofLabel) +
          "](" +
          item.proofUrl +
          ") · **State:** " +
          escapeMarkdown(item.state),
      ].join("\n\n");
    })
    .join("\n\n");

  const modules = config.moduleGroups
    .map((group) => {
      const rows = group.projects
        .map((project) => {
          return (
            "- [" +
            escapeMarkdown(project.repo) +
            "](https://github.com/" +
            username +
            "/" +
            project.repo +
            ") — " +
            escapeMarkdown(project.description)
          );
        })
        .join("\n");
      return [
        "<details>",
        "<summary><strong>" +
          escapeXml(group.name) +
          "</strong> · " +
          group.projects.length +
          " public modules</summary>",
        "",
        rows,
        "",
        "</details>",
      ].join("\n");
    })
    .join("\n\n");

  const principles = config.principles
    .map((principle) => "- " + escapeMarkdown(principle))
    .join("\n");
  const links = config.links
    .map((link) => {
      return '<a href="' + escapeXml(link.url) + '">' + escapeXml(link.label) + "</a>";
    })
    .join(" · ");

  return [
    renderPicture(
      "profile-hero",
      config.identity.name + " evidence-console profile",
    ),
    "",
    "<p align=\"center\">" + links + "</p>",
    "",
    config.identity.tagline,
    "",
    "> " + config.identity.mission,
    "",
    "## Selected systems",
    "",
    selected,
    "",
    "## Operating loop",
    "",
    renderPicture(
      "profile-loop",
      config.identity.name + " public operating loop and evidence ledger",
    ),
    "",
    "**MAP → ALIGN → ORCHESTRATE → GUARD → SHIP → VERIFY**",
    "",
    "## Module registry",
    "",
    modules,
    "",
    "## Operating principles",
    "",
    principles,
    "",
    "<p align=\"center\">" + links + "</p>",
    "",
    "<!-- Generated from profile.evidence-console.json. The visual architecture is inspired by Profile Control Plane; published claims and links are limited to public Cooper-X-Oak repositories. -->",
    "",
  ].join("\n");
}

function renderPreview() {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>Cooper Oak / Evidence Console Preview</title>",
    "<style>",
    "*{box-sizing:border-box}",
    'body{margin:0;background:#f5f5f5;color:#000000;font-family:system-ui,-apple-system,"Segoe UI","Helvetica Neue",Arial,sans-serif}',
    "main{max-width:1280px;margin:0 auto;padding:24px}",
    "header,section{background:#ffffff;border:1px solid #dbdbdb;border-radius:8px;padding:16px;margin-bottom:20px}",
    "h1,h2,p{margin:0}",
    "h1{font-size:24px;margin-bottom:8px}",
    "h2{font-size:16px;margin-bottom:12px}",
    'code{font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;font-size:12px;color:#8c8c8c}',
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}",
    ".frame{border:1px solid #dbdbdb;border-radius:8px;padding:12px;background:#ffffff}",
    ".frame.dark{border-color:#8c8c8c;background:#000000;color:#ffffff}",
    ".frame img{display:block;width:100%;height:auto}",
    ".mobile{max-width:600px;margin:0 auto}",
    "@media(max-width:900px){.grid{grid-template-columns:1fr}main{padding:12px}}",
    "</style>",
    "</head>",
    "<body>",
    "<main>",
    "<header>",
    "<h1>Cooper Oak / Evidence Console</h1>",
    "<p><code>Generated from profile.evidence-console.json · no remote assets · light, dark, desktop, and mobile</code></p>",
    "</header>",
    "<section>",
    "<h2>Desktop hero</h2>",
    '<div class="grid">',
    '<div class="frame"><img src="./assets/profile-hero-light.svg" alt="Light desktop hero"></div>',
    '<div class="frame dark"><img src="./assets/profile-hero-dark.svg" alt="Dark desktop hero"></div>',
    "</div>",
    "</section>",
    "<section>",
    "<h2>Desktop operating loop</h2>",
    '<div class="grid">',
    '<div class="frame"><img src="./assets/profile-loop-light.svg" alt="Light desktop loop"></div>',
    '<div class="frame dark"><img src="./assets/profile-loop-dark.svg" alt="Dark desktop loop"></div>',
    "</div>",
    "</section>",
    "<section>",
    "<h2>Mobile variants</h2>",
    '<div class="grid">',
    '<div class="frame mobile"><img src="./assets/profile-hero-mobile-light.svg" alt="Light mobile hero"><br><img src="./assets/profile-loop-mobile-light.svg" alt="Light mobile loop"></div>',
    '<div class="frame dark mobile"><img src="./assets/profile-hero-mobile-dark.svg" alt="Dark mobile hero"><br><img src="./assets/profile-loop-mobile-dark.svg" alt="Dark mobile loop"></div>',
    "</div>",
    "</section>",
    "</main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function validateSvg(name, content) {
  const forbidden = [
    /<script/i,
    /<foreignObject/i,
    /<linearGradient/i,
    /<filter/i,
    /@keyframes/i,
    /\banimation\s*:/i,
    /javascript:/i,
    /\son[a-z]+\s*=/i,
    /\b(?:href|src)\s*=\s*["']https?:/i,
  ];
  for (const pattern of forbidden) {
    assert(!pattern.test(content), name + " contains forbidden SVG content: " + pattern);
  }

  const colors = [...content.matchAll(/#[0-9A-Fa-f]{6}/g)].map((match) =>
    match[0].toLowerCase(),
  );
  for (const color of colors) {
    assert(EXPECTED_COLORS.has(color), name + " contains unregistered color " + color);
  }

  for (const match of content.matchAll(/\brx="([^"]+)"/g)) {
    assert(match[1] === "8", name + " contains a non-8px structural radius");
  }
  assert(
    content.includes('xmlns="http://www.w3.org/2000/svg"'),
    name + " is missing the SVG namespace",
  );
  assert(content.endsWith("</svg>"), name + " is not a complete SVG document");
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  validateConfig(config);

  const files = new Map([
    [
      "assets/profile-hero-light.svg",
      renderHeroDesktop(config, "light"),
    ],
    ["assets/profile-hero-dark.svg", renderHeroDesktop(config, "dark")],
    [
      "assets/profile-hero-mobile-light.svg",
      renderHeroMobile(config, "light"),
    ],
    [
      "assets/profile-hero-mobile-dark.svg",
      renderHeroMobile(config, "dark"),
    ],
    [
      "assets/profile-loop-light.svg",
      renderLoopDesktop(config, "light"),
    ],
    ["assets/profile-loop-dark.svg", renderLoopDesktop(config, "dark")],
    [
      "assets/profile-loop-mobile-light.svg",
      renderLoopMobile(config, "light"),
    ],
    [
      "assets/profile-loop-mobile-dark.svg",
      renderLoopMobile(config, "dark"),
    ],
    ["README.md", renderReadme(config)],
    ["profile.html", renderPreview()],
  ]);

  for (const [relativePath, content] of files) {
    if (relativePath.endsWith(".svg")) validateSvg(relativePath, content);
    await writeFile(join(ROOT, relativePath), content, "utf8");
  }

  console.log(
    "Generated " +
      files.size +
      " files from " +
      CONFIG_PATH.replace(ROOT, "."),
  );
}

await main();
