import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..');
const source = JSON.parse(readFileSync(join(here, 'concept-boards.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(here, 'render-manifest.json'), 'utf8'));

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function parseTagNames(svg) {
  const allowed = new Set(['svg', 'title', 'desc', 'metadata', 'g', 'rect', 'path', 'line', 'text']);
  const stack = [];
  const tokens = svg.match(/<\/?[A-Za-z][^>]*>/g) ?? [];
  for (const token of tokens) {
    const closing = token.startsWith('</');
    const selfClosing = token.endsWith('/>');
    const name = token.match(/^<\/?([A-Za-z][\w:.-]*)/)?.[1];
    assert.ok(name, `Unparseable tag: ${token}`);
    assert.ok(allowed.has(name), `Unexpected SVG tag: ${name}`);
    if (closing) {
      assert.equal(stack.pop(), name, `Unbalanced closing tag: ${name}`);
    } else if (!selfClosing) {
      stack.push(name);
    }
  }
  assert.deepEqual(stack, [], 'SVG tags must be balanced');
}

function parsePng(path) {
  const bytes = readFileSync(path);
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  let offset = 8;
  let ihdr = null;
  const chunks = [];
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    assert.ok(dataEnd + 4 <= bytes.length, `Truncated PNG chunk ${type}`);
    chunks.push(type);
    if (type === 'IHDR') {
      ihdr = {
        width: bytes.readUInt32BE(dataStart),
        height: bytes.readUInt32BE(dataStart + 4),
        bitDepth: bytes[dataStart + 8],
        colorType: bytes[dataStart + 9],
      };
    }
    offset = dataEnd + 4;
    if (type === 'IEND') break;
  }
  assert.ok(ihdr, 'PNG must contain IHDR');
  return { ihdr, chunks };
}

test('input remains traceable to the current Cooper Oak avatar geometry', () => {
  const profile = readFileSync(join(repoRoot, 'profile.html'), 'utf8');
  assert.equal(source.source_avatar.view_box, '0 0 180 180');
  assert.equal(source.source_avatar.step, 18);
  assert.ok(profile.includes(`d="${source.source_avatar.path}"`));
  assert.ok(profile.includes(`fill="${source.source_avatar.fill}"`));
});

test('three boards remain constrained, accessible SVG review artifacts', () => {
  assert.equal(source.variants.length, 3);
  for (const variant of source.variants) {
    const path = join(here, 'boards', `${variant.id}.svg`);
    const svg = readFileSync(path, 'utf8');
    assert.match(svg, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.match(svg, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="1600" height="1000" viewBox="0 0 1600 1000"/);
    assert.match(svg, /<title id="title">/);
    assert.match(svg, /<desc id="desc">/);
    assert.match(svg, /<metadata>/);
    assert.match(svg, /CURRENT EXPERIMENT/);
    assert.match(svg, /CAPABILITY ROUTING/);
    assert.match(svg, /EXPERIMENTS IN KEEPING/);
    assert.match(svg, /HUMANS IN CONTROL OF/);
    assert.match(svg, /AI-ASSISTED WORK\./);
    assert.match(svg, /NARROW \/ 360/);
    const leadIndex = svg.indexOf('AI-ASSISTED WORK.');
    const experimentIndex = svg.indexOf('CURRENT EXPERIMENT / CAPABILITY ROUTING');
    const principlesIndex = svg.indexOf('MAKE CONTROL EXPLICIT');
    assert.ok(leadIndex < experimentIndex, `${variant.id}: experiment must follow the lead`);
    assert.ok(experimentIndex < principlesIndex, `${variant.id}: principles must follow the experiment`);
    for (const label of ['QUESTION', 'HYPOTHESIS', 'EVIDENCE', 'NEXT']) {
      const count = svg.match(new RegExp(`\\d\\d / ${label}`, 'g'))?.length ?? 0;
      assert.ok(count >= 2, `${variant.id}: ${label} must exist in desktop and narrow studies`);
    }
    assert.doesNotMatch(svg, /ONE OPEN LOOP AT A TIME|NO SHRUNK DESKTOP|>03<\/text>/);
    if (variant.id === '02-counterform-canopy') {
      assert.doesNotMatch(svg, /width="235" height="362" fill="#111512"/);
    }
    if (variant.id === '03-ring-ledger') {
      assert.doesNotMatch(svg, /<rect[^>]+fill="none"[^>]+stroke=/);
    }
    assert.doesNotMatch(svg, /<script|<foreignObject|<image|<animate|<set|<filter|<linearGradient|<radialGradient|<mask|<a\b/i);
    assert.doesNotMatch(svg, /\son[a-z]+\s*=|\shref\s*=|\sxlink:href\s*=|url\s*\(|\sr[xy]\s*=/i);
    const urls = svg.match(/https?:\/\/[^"'\s<]+/g) ?? [];
    assert.deepEqual(urls, ['http://www.w3.org/2000/svg']);
    parseTagNames(svg);
  }
});

test('PNG previews are static 1600 by 1000 review snapshots', () => {
  for (const variant of source.variants) {
    const png = parsePng(join(here, 'previews', `${variant.id}.png`));
    assert.deepEqual(
      { width: png.ihdr.width, height: png.ihdr.height },
      source.dimensions,
    );
    assert.equal(png.ihdr.bitDepth, 8);
    assert.ok([2, 6].includes(png.ihdr.colorType));
    assert.ok(!png.chunks.includes('acTL'), 'Concept PNG must not be animated');
  }
});

test('render manifest binds inputs, generator, renderer, fonts, SVGs and PNGs', () => {
  assert.equal(manifest.run_id, source.run_id);
  assert.equal(manifest.route_revision, source.route_revision);
  assert.equal(manifest.route_sha256, source.route_sha256);
  assert.equal(manifest.input.sha256, sha256(join(here, manifest.input.path)));
  assert.equal(manifest.generator.sha256, sha256(join(here, manifest.generator.path)));
  assert.equal(manifest.files.length, source.variants.length);
  assert.ok(existsSync(manifest.renderer.path));
  assert.equal(manifest.renderer.sha256, sha256(manifest.renderer.path));
  for (const font of manifest.fonts) {
    assert.ok(existsSync(font.path));
    assert.equal(font.sha256, sha256(font.path));
  }
  for (const entry of manifest.files) {
    assert.ok(source.variants.some((variant) => variant.id === entry.board_id));
    assert.equal(entry.svg.sha256, sha256(join(here, entry.svg.path)));
    assert.equal(entry.png.sha256, sha256(join(here, entry.png.path)));
  }
});
