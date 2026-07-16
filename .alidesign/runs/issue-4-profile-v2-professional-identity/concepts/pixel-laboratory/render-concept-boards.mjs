import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  closeSync,
  readFileSync,
  readSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const inputPath = join(here, 'concept-boards.json');
const source = JSON.parse(readFileSync(inputPath, 'utf8'));
const checkOnly = process.argv.includes('--check');

function hashBuffer(value) {
  return createHash('sha256').update(value).digest('hex');
}

function hashFile(path) {
  const hash = createHash('sha256');
  const handle = openSync(path, 'r');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    while (true) {
      const count = readSync(handle, buffer, 0, buffer.length, null);
      if (count === 0) break;
      hash.update(buffer.subarray(0, count));
    }
  } finally {
    closeSync(handle);
  }
  return hash.digest('hex');
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function text(x, y, value, options = {}) {
  const {
    size = 18,
    weight = 400,
    fill = source.palette.ink,
    family = source.type.sans,
    spacing = 0,
    anchor = 'start',
  } = options;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${escapeXml(family)}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

function line(x1, y1, x2, y2, color = source.palette.rule, width = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
}

function rect(x, y, width, height, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"${extra}/>`;
}

function lines(x, y, values, options = {}) {
  const step = options.step ?? Math.round((options.size ?? 18) * 1.2);
  return values.map((value, index) => text(x, y + index * step, value, options)).join('\n');
}

function metadataFor(variant, inputSha) {
  return escapeXml(JSON.stringify({
    run_id: source.run_id,
    board_id: variant.id,
    route_revision: source.route_revision,
    route_sha256: source.route_sha256,
    input_sha256: inputSha,
    artifact_role: 'reversible concept board; not a Profile asset',
  }));
}

function svgShell(variant, body, inputSha) {
  const { width, height } = source.dimensions;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">Pixel Laboratory ${escapeXml(variant.name)} concept board</title>
  <desc id="desc">A reversible Cooper Oak identity concept showing an abstract Oak glyph, editorial hero, current Capability Routing experiment, and narrow-layout study.</desc>
  <metadata>${metadataFor(variant, inputSha)}</metadata>
  ${body}
</svg>
`;
}

function boardHeader(variant, number) {
  const p = source.palette;
  return [
    rect(0, 0, 1600, 1000, p.paper),
    text(72, 54, `PIXEL LABORATORY / VARIANT ${String(number).padStart(2, '0')}`, {
      size: 13, weight: 700, fill: p.forest, family: source.type.mono, spacing: 1.4,
    }),
    text(72, 92, variant.name, { size: 22, weight: 700, spacing: 0.4 }),
    text(72, 120, variant.thesis, { size: 15, fill: p.muted }),
    line(72, 139, 1528, 139, p.ink, 2),
    line(1272, 139, 1272, 948, p.rule, 1),
    text(1312, 169, 'NARROW / 360', {
      size: 12, weight: 700, fill: p.forest, family: source.type.mono, spacing: 1.2,
    }),
    text(72, 976, `RISK / ${variant.risk}`, {
      size: 12, fill: p.muted, family: source.type.mono, spacing: 0.3,
    }),
  ].join('\n');
}

function branchGlyph(x, y, unit, background = source.palette.paper) {
  const p = source.palette;
  return `<g aria-label="Abstract Oak branch glyph">
    ${rect(x + 2 * unit, y, 3 * unit, unit, p.forest)}
    ${rect(x + 4 * unit, y + unit, unit, unit, p.forest)}
    ${rect(x + 7 * unit, y + unit, 3 * unit, unit, p.forest)}
    ${rect(x + unit, y + 2 * unit, 5 * unit, unit, p.forest)}
    ${rect(x + 6 * unit, y + 2 * unit, 5 * unit, 2 * unit, p.forest)}
    ${rect(x, y + 4 * unit, 4 * unit, 2 * unit, p.forest)}
    ${rect(x + 3 * unit, y + 5 * unit, 6 * unit, unit, p.forest)}
    ${rect(x + 4 * unit, y + 6 * unit, 3 * unit, unit, p.forest)}
    ${rect(x + 5 * unit, y + 7 * unit, unit, 3 * unit, p.forest)}
    ${rect(x + 4 * unit, y + 10 * unit, 3 * unit, unit, p.forest)}
  </g>`;
}

function counterformGlyph(x, y, width, height, background = source.palette.paper) {
  const p = source.palette;
  const unit = Math.min(width, height) / 11;
  const baseX = x + (width - 11 * unit) / 2;
  const baseY = y + (height - 11 * unit) / 2;
  return `<g aria-label="Abstract Oak counterform glyph">
    ${rect(baseX + unit, baseY + unit, 3 * unit, 2 * unit, p.forest)}
    ${rect(baseX, baseY + 3 * unit, 5 * unit, 2 * unit, p.forest)}
    ${rect(baseX + 2 * unit, baseY + 5 * unit, 3 * unit, unit, p.forest)}
    ${rect(baseX + 7 * unit, baseY, 3 * unit, 2 * unit, p.forest)}
    ${rect(baseX + 6 * unit, baseY + 2 * unit, 5 * unit, 3 * unit, p.forest)}
    ${rect(baseX + 6 * unit, baseY + 5 * unit, 3 * unit, unit, p.forest)}
    ${rect(baseX + 4 * unit, baseY + 6 * unit, 3 * unit, unit, p.forest)}
    ${rect(baseX + 5 * unit, baseY + 7 * unit, unit, 3 * unit, p.forest)}
    ${rect(baseX + 4 * unit, baseY + 10 * unit, 3 * unit, unit, p.forest)}
  </g>`;
}

function ringGlyph(x, y, size, background = source.palette.paper) {
  const p = source.palette;
  const unit = size / 12;
  const stroke = Math.max(6, Math.round(size / 20));
  const path = (value, color) => `<path d="${value}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges"/>`;
  const point = (xUnit, yUnit) => `${x + xUnit * unit} ${y + yUnit * unit}`;
  return `<g aria-label="Abstract Oak growth-ring glyph">
    ${path(`M ${point(1, 6)} V ${y + 3 * unit} H ${x + 3 * unit} V ${y + unit} H ${x + 8 * unit} V ${y + 2 * unit} H ${x + 10.5 * unit} V ${y + 5.5 * unit}`, p.forest)}
    ${path(`M ${point(3, 6)} V ${y + 4 * unit} H ${x + 4 * unit} V ${y + 3 * unit} H ${x + 7.5 * unit} V ${y + 4 * unit} H ${x + 9 * unit} V ${y + 6 * unit}`, p.ink)}
    ${path(`M ${point(5, 6)} V ${y + 5 * unit} H ${x + 7 * unit} V ${y + 6 * unit}`, p.forest)}
    ${path(`M ${point(6, 5)} V ${y + 10.5 * unit} M ${point(6, 7.25)} H ${x + 4.5 * unit} M ${point(6, 8.5)} H ${x + 8.5 * unit} M ${point(6, 9.75)} H ${x + 4 * unit} M ${point(6, 10.5)} H ${x + 9 * unit}`, p.forest)}
  </g>`;
}

function experimentRows(layout) {
  const p = source.palette;
  const rows = [
    ['QUESTION', source.content.question],
    ['HYPOTHESIS', source.content.hypothesis],
    ['EVIDENCE', source.content.evidence],
    ['NEXT', source.content.next],
  ];
  const pieces = [
    text(layout.x, layout.y, source.content.section, {
      size: 13, weight: 700, fill: p.forest, family: source.type.mono, spacing: 1,
    }),
    line(layout.x, layout.y + 22, layout.right, layout.y + 22, p.ink, 2),
  ];
  rows.forEach(([label, value], index) => {
    const rowY = layout.y + 66 + index * layout.rowHeight;
    pieces.push(text(layout.x, rowY, `${String(index + 1).padStart(2, '0')} / ${label}`, {
      size: 12, weight: 700, fill: index === 0 ? p.forest : p.muted,
      family: source.type.mono, spacing: 0.8,
    }));
    if (label === 'EVIDENCE') {
      pieces.push(lines(layout.textX, rowY - 5, [
        'The local contract rejects missing visual providers, seals route history',
        'and keeps UI mutation closed until required capability work exists.',
      ], {
        size: layout.textSize ?? 16,
        weight: 400,
        fill: p.ink,
        step: 19,
      }));
    } else {
      pieces.push(text(layout.textX, rowY, value, {
        size: layout.textSize ?? 16,
        weight: index === 0 ? 700 : 400,
        fill: p.ink,
      }));
    }
    if (index < rows.length - 1) {
      pieces.push(line(layout.x, rowY + (label === 'EVIDENCE' ? 34 : 28), layout.right, rowY + (label === 'EVIDENCE' ? 34 : 28), p.rule, 1));
    }
  });
  return pieces.join('\n');
}

function principleRail(x, y, width) {
  const p = source.palette;
  const gap = width / 3;
  return source.content.principles.map((value, index) => {
    const px = x + index * gap;
    return `${rect(px, y - 12, 10, 10, index === 0 ? p.forest : p.ink)}\n${text(px + 18, y, value, {
      size: 11, weight: 700, family: source.type.mono, spacing: 0.5,
    })}`;
  }).join('\n');
}

function workingPrinciples(x, y, width) {
  const p = source.palette;
  return [
    text(x, y, 'WORKING PRINCIPLES', {
      size: 12, weight: 700, fill: p.forest, family: source.type.mono, spacing: 0.8,
    }),
    line(x, y + 18, x + width, y + 18, p.rule, 1),
    principleRail(x, y + 56, width),
  ].join('\n');
}

function narrowStudy(variantIndex) {
  const p = source.palette;
  const x = 1312;
  const parts = [];
  if (variantIndex === 0) parts.push(branchGlyph(x + 53, 184, 10));
  if (variantIndex === 1) parts.push(counterformGlyph(x + 25, 184, 166, 121));
  if (variantIndex === 2) parts.push(ringGlyph(x + 38, 178, 140));
  parts.push(text(x, 326, source.content.name, { size: 15, weight: 700, spacing: 0.8 }));
  parts.push(lines(x, 354, [
    'EXPERIMENTS IN',
    'KEEPING HUMANS',
    'IN CONTROL OF',
    'AI-ASSISTED WORK.',
  ], { size: 17, weight: 700, step: 22 }));
  parts.push(line(x, 448, 1528, 448, p.ink, 2));
  parts.push(text(x, 474, 'CURRENT EXPERIMENT /', {
    size: 9, weight: 700, fill: p.forest, family: source.type.mono, spacing: 0.55,
  }));
  parts.push(text(x, 489, 'CAPABILITY ROUTING', {
    size: 9, weight: 700, fill: p.forest, family: source.type.mono, spacing: 0.55,
  }));
  const narrowRows = [
    ['01 / QUESTION', source.content.narrow_experiment.question, 518],
    ['02 / HYPOTHESIS', source.content.narrow_experiment.hypothesis, 568],
    ['03 / EVIDENCE', source.content.narrow_experiment.evidence, 632],
    ['04 / NEXT', source.content.narrow_experiment.next, 696],
  ];
  narrowRows.forEach(([label, value, rowY], index) => {
    parts.push(text(x, rowY, label, {
      size: 9, weight: 700, fill: index === 0 ? p.forest : p.muted,
      family: source.type.mono, spacing: 0.45,
    }));
    parts.push(lines(x, rowY + 18, value, {
      size: 11, weight: index === 0 ? 700 : 400, step: 15,
    }));
  });
  parts.push(line(x, 754, 1528, 754, p.rule, 1));
  parts.push(text(x, 779, 'WORKING PRINCIPLES', {
    size: 9, weight: 700, fill: p.forest, family: source.type.mono, spacing: 0.55,
  }));
  source.content.principles.forEach((value, index) => {
    parts.push(text(x, 808 + index * 23, value, {
      size: 9, weight: 700, family: source.type.mono, spacing: 0.15,
    }));
  });
  return parts.join('\n');
}

function renderBranchRegister(variant, inputSha) {
  const p = source.palette;
  const body = [
    boardHeader(variant, 1),
    line(72, 164, 336, 164, p.soft, 1),
    line(72, 212, 336, 212, p.soft, 1),
    line(72, 260, 336, 260, p.soft, 1),
    line(72, 308, 336, 308, p.soft, 1),
    line(72, 356, 336, 356, p.soft, 1),
    line(72, 404, 336, 404, p.soft, 1),
    branchGlyph(72, 166, 24),
    text(400, 188, source.content.name, { size: 16, weight: 700, spacing: 1.4 }),
    lines(400, 238, source.content.lead, { size: 49, weight: 700, step: 57 }),
    text(400, 410, 'AI WORKFLOW EXPERIMENTER / CURRENTLY TESTING CAPABILITY ROUTING', {
      size: 13, weight: 700, fill: p.forest, family: source.type.mono, spacing: 0.7,
    }),
    experimentRows({ x: 72, y: 500, textX: 320, right: 1224, rowHeight: 72, textSize: 14 }),
    workingPrinciples(72, 844, 1152),
    narrowStudy(0),
  ].join('\n');
  return svgShell(variant, body, inputSha);
}

function renderCounterformCanopy(variant, inputSha) {
  const p = source.palette;
  const body = [
    boardHeader(variant, 2),
    counterformGlyph(72, 166, 352, 314),
    text(476, 188, source.content.name, { size: 16, weight: 700, spacing: 1.4 }),
    lines(476, 238, source.content.lead, { size: 44, weight: 700, step: 53 }),
    line(476, 409, 1224, 409, p.ink, 2),
    experimentRows({ x: 72, y: 520, textX: 320, right: 1224, rowHeight: 68, textSize: 14 }),
    workingPrinciples(72, 854, 1152),
    narrowStudy(1),
  ].join('\n');
  return svgShell(variant, body, inputSha);
}

function renderRingLedger(variant, inputSha) {
  const p = source.palette;
  const body = [
    boardHeader(variant, 3),
    text(72, 188, source.content.name, { size: 16, weight: 700, spacing: 1.4 }),
    lines(72, 238, source.content.lead, { size: 44, weight: 700, step: 53 }),
    text(72, 402, 'AI WORKFLOW EXPERIMENTER / CURRENTLY TESTING CAPABILITY ROUTING', {
      size: 13, weight: 700, fill: p.forest, family: source.type.mono, spacing: 0.65,
    }),
    ringGlyph(858, 166, 338),
    experimentRows({ x: 72, y: 530, textX: 320, right: 1224, rowHeight: 68, textSize: 14 }),
    workingPrinciples(72, 859, 1152),
    narrowStudy(2),
  ].join('\n');
  return svgShell(variant, body, inputSha);
}

function browserCandidates() {
  const explicit = process.env.CONCEPT_BROWSER ? [process.env.CONCEPT_BROWSER] : [];
  return [
    ...explicit,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  ];
}

function findBrowser() {
  const browser = browserCandidates().find((candidate) => candidate && existsSync(candidate));
  if (!browser) throw new Error('No supported local Chromium browser found. Set CONCEPT_BROWSER.');
  return browser;
}

function fileVersion(path) {
  const escaped = path.replaceAll("'", "''");
  const result = spawnSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    `(Get-Item -LiteralPath '${escaped}').VersionInfo.FileVersion`,
  ], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) return 'unknown';
  return result.stdout.trim() || 'unknown';
}

function rasterize(browser, svg, target) {
  const temp = mkdtempSync(join(tmpdir(), 'cooper-concept-render-'));
  const wrapper = join(temp, 'board.html');
  const userData = join(temp, 'browser-profile');
  mkdirSync(userData, { recursive: true });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1600px;height:1000px;overflow:hidden;background:#F5F6F1}svg{display:block;width:1600px;height:1000px}</style></head><body>${svg.replace(/^<\?xml[^>]+>\s*/, '')}</body></html>`;
  writeFileSync(wrapper, html, 'utf8');
  try {
    const result = spawnSync(browser, [
      '--headless=new',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-sync',
      '--disable-default-apps',
      '--disable-gpu',
      '--no-first-run',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1600,1000',
      `--user-data-dir=${userData}`,
      `--screenshot=${target}`,
      pathToFileURL(wrapper).href,
    ], { encoding: 'utf8', timeout: 60000, windowsHide: true });
    if (result.status !== 0 || !existsSync(target)) {
      throw new Error(`Chromium screenshot failed: ${result.stderr || result.stdout}`);
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

function relativePosix(root, path) {
  return relative(root, path).replaceAll('\\', '/');
}

function generate(outputRoot) {
  const boardsDir = join(outputRoot, 'boards');
  const previewsDir = join(outputRoot, 'previews');
  mkdirSync(boardsDir, { recursive: true });
  mkdirSync(previewsDir, { recursive: true });

  const browser = findBrowser();
  const inputBytes = readFileSync(inputPath);
  const inputSha = hashBuffer(inputBytes);
  const generatorSha = hashFile(fileURLToPath(import.meta.url));
  const renderers = [renderBranchRegister, renderCounterformCanopy, renderRingLedger];
  const files = [];

  source.variants.forEach((variant, index) => {
    const svg = renderers[index](variant, inputSha);
    const svgPath = join(boardsDir, `${variant.id}.svg`);
    const pngPath = join(previewsDir, `${variant.id}.png`);
    writeFileSync(svgPath, svg, 'utf8');
    rasterize(browser, svg, pngPath);
    files.push({
      board_id: variant.id,
      svg: { path: relativePosix(outputRoot, svgPath), sha256: hashFile(svgPath) },
      png: { path: relativePosix(outputRoot, pngPath), sha256: hashFile(pngPath) },
    });
  });

  const fonts = [
    'C:\\Windows\\Fonts\\arial.ttf',
    'C:\\Windows\\Fonts\\arialbd.ttf',
  ].map((path) => {
    if (!existsSync(path)) throw new Error(`Required review font is missing: ${path}`);
    return { path, sha256: hashFile(path), size: statSync(path).size };
  });

  const manifest = {
    schema_version: 1,
    run_id: source.run_id,
    route_revision: source.route_revision,
    route_sha256: source.route_sha256,
    dimensions: source.dimensions,
    input: { path: 'concept-boards.json', sha256: inputSha },
    generator: { path: 'render-concept-boards.mjs', sha256: generatorSha },
    renderer: {
      path: browser,
      file_version: fileVersion(browser),
      sha256: hashFile(browser),
      size: statSync(browser).size,
    },
    fonts,
    files,
  };
  writeFileSync(join(outputRoot, 'render-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function assertSame(pathA, pathB) {
  const a = readFileSync(pathA);
  const b = readFileSync(pathB);
  if (!a.equals(b)) {
    throw new Error(`Generated output is stale: ${relativePosix(here, pathB)}`);
  }
}

if (checkOnly) {
  const temp = mkdtempSync(join(tmpdir(), 'cooper-concept-check-'));
  try {
    generate(temp);
    for (const variant of source.variants) {
      assertSame(join(temp, 'boards', `${variant.id}.svg`), join(here, 'boards', `${variant.id}.svg`));
      assertSame(join(temp, 'previews', `${variant.id}.png`), join(here, 'previews', `${variant.id}.png`));
    }
    assertSame(join(temp, 'render-manifest.json'), join(here, 'render-manifest.json'));
    console.log('Pixel Laboratory concept boards are current.');
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
} else {
  generate(here);
  console.log('Generated three Pixel Laboratory concept boards.');
}
