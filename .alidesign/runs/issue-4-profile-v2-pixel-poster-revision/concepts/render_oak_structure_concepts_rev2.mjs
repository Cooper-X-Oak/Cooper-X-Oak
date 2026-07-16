import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "revision-002");
const TOKENS = Object.freeze({
  bone: "#F2EFE4",
  ink: "#0D100E",
  forest: "#347A55",
  signal: "#3B9648"
});

// A connected 32u × 24u Oak: arched crown, open Y, continuous trunk and roots.
// Ranges are inclusive and expressed in Oak-local coordinates.
const ROWS = Object.freeze([
  [[13, 18]],
  [[10, 21]],
  [[7, 24]],
  [[4, 27]],
  [[3, 28]],
  [[1, 30]],
  [[0, 31]],
  [[0, 31]],
  [[1, 12], [19, 30]],
  [[2, 13], [18, 29]],
  [[3, 13], [18, 28]],
  [[4, 13], [18, 27]],
  [[5, 13], [18, 26]],
  [[6, 13], [18, 25]],
  [[7, 15], [16, 24]],
  [[8, 15], [16, 23]],
  [[9, 16], [15, 22]],
  [[10, 21]],
  [[12, 19]],
  [[12, 19]],
  [[11, 20]],
  [[9, 22]],
  [[6, 13], [15, 16], [18, 25]],
  [[3, 10], [15, 16], [21, 28]]
]);

const VARIANTS = Object.freeze([
  {
    id: "01-shoulder-weighted",
    structureRects: [[5, 5, 7, 6], [8, 9, 5, 6], [10, 13, 4, 5], [12, 17, 3, 4], [9, 20, 5, 4]]
  },
  {
    id: "02-balanced",
    structureRects: [[6, 6, 6, 5], [8, 10, 5, 5], [10, 13, 4, 5], [12, 17, 3, 5], [8, 21, 6, 3]]
  },
  {
    id: "03-grounded",
    structureRects: [[7, 7, 6, 4], [9, 10, 4, 5], [10, 14, 4, 4], [12, 17, 3, 6], [7, 21, 8, 3]]
  }
]);

const key = (x, y) => `${x},${y}`;

function cellsFromRows() {
  const cells = new Set();
  ROWS.forEach((ranges, y) => {
    for (const [start, end] of ranges) {
      for (let x = start; x <= end; x += 1) cells.add(key(x, y));
    }
  });
  return cells;
}

function cellsFromRects(rects, oak) {
  const cells = new Set();
  for (const [x, y, width, height] of rects) {
    for (let yy = y; yy < y + height; yy += 1) {
      for (let xx = x; xx < x + width; xx += 1) {
        if (oak.has(key(xx, yy))) cells.add(key(xx, yy));
      }
    }
  }
  return cells;
}

function assertConnected(cells, label) {
  const first = cells.values().next().value;
  const seen = new Set([first]);
  const queue = [first];
  while (queue.length) {
    const [x, y] = queue.shift().split(",").map(Number);
    for (const next of [key(x + 1, y), key(x - 1, y), key(x, y + 1), key(x, y - 1)]) {
      if (cells.has(next) && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  if (seen.size !== cells.size) throw new Error(`${label} is not four-neighbor connected.`);
}

function holes(cells) {
  const outside = new Set();
  const queue = [key(-1, -1)];
  outside.add(queue[0]);
  while (queue.length) {
    const [x, y] = queue.shift().split(",").map(Number);
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const next = key(nx, ny);
      if (nx < -1 || nx > 32 || ny < -1 || ny > 24 || cells.has(next) || outside.has(next)) continue;
      outside.add(next);
      queue.push(next);
    }
  }
  let count = 0;
  for (let y = 0; y < 24; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      const cell = key(x, y);
      if (!cells.has(cell) && !outside.has(cell)) count += 1;
    }
  }
  return count;
}

function markup(cells, fill, prefix, offsetX = 20, offsetY = 6) {
  return [...cells]
    .map((cell) => cell.split(",").map(Number))
    .sort(([ax, ay], [bx, by]) => ay - by || ax - bx)
    .map(([x, y]) => `<rect x="${offsetX + x}" y="${offsetY + y}" width="1" height="1" fill="${fill}" data-cell="${prefix}-${x}-${y}"/>`)
    .join("\n  ");
}

function renderPoster(variant, mode) {
  const oak = cellsFromRows();
  const structure = cellsFromRects(variant.structureRects, oak);
  const forest = new Set([...oak].filter((cell) => !structure.has(cell)));
  const background = mode === "light" ? TOKENS.bone : TOKENS.ink;
  const structureFill = mode === "light" ? TOKENS.ink : TOKENS.bone;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 36" width="864" height="576" role="img" aria-label="Pixel oak monument concept" shape-rendering="crispEdges">
  <rect width="54" height="36" fill="${background}"/>
  ${markup(forest, TOKENS.forest, "forest")}
  ${markup(structure, structureFill, "structure")}
  <rect x="7" y="27" width="2" height="2" fill="${TOKENS.signal}" data-token="signal"/>
</svg>\n`;
}

function renderMonochrome() {
  const oak = cellsFromRows();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" width="640" height="480" role="img" aria-label="Monochrome pixel oak silhouette" shape-rendering="crispEdges">
  <rect width="32" height="24" fill="${TOKENS.bone}"/>
  ${markup(oak, TOKENS.ink, "silhouette", 0, 0)}
</svg>\n`;
}

function pairwise(a, b) {
  const intersection = [...a].filter((cell) => b.has(cell)).length;
  const union = new Set([...a, ...b]).size;
  return {
    intersection,
    symmetricDifference: union - intersection,
    jaccard: Number((intersection / union).toFixed(3))
  };
}

const oak = cellsFromRows();
assertConnected(oak, "Oak silhouette");

await mkdir(ROOT, { recursive: true });
await writeFile(resolve(ROOT, "00-monochrome-silhouette.svg"), renderMonochrome(), "utf8");

const structures = new Map();
const outputs = [];
for (const variant of VARIANTS) {
  const structure = cellsFromRects(variant.structureRects, oak);
  assertConnected(structure, `${variant.id} structure`);
  if (holes(structure) !== 0) throw new Error(`${variant.id} structure contains a hole.`);
  if (structure.size < 78 || structure.size > 116) {
    throw new Error(`${variant.id} structure area ${structure.size} is outside 78–116u².`);
  }
  structures.set(variant.id, structure);
  for (const mode of ["light", "dark"]) {
    const filename = `${variant.id}-${mode}.svg`;
    await writeFile(resolve(ROOT, filename), renderPoster(variant, mode), "utf8");
    outputs.push({ filename, variant: variant.id, mode, oakArea: oak.size, structureArea: structure.size });
  }
}

const comparisons = [];
for (let i = 0; i < VARIANTS.length; i += 1) {
  for (let j = i + 1; j < VARIANTS.length; j += 1) {
    const left = VARIANTS[i].id;
    const right = VARIANTS[j].id;
    comparisons.push({ left, right, ...pairwise(structures.get(left), structures.get(right)) });
  }
}

await writeFile(resolve(ROOT, "manifest.json"), `${JSON.stringify({ revision: 2, tokens: TOKENS, oakArea: oak.size, outputs, comparisons }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ root: ROOT, oakArea: oak.size, outputs, comparisons }, null, 2));
