import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const TOKENS = Object.freeze({
  bone: "#F2EFE4",
  ink: "#0D100E",
  forest: "#347A55",
  signal: "#3B9648"
});

const ROWS = Object.freeze([
  [[6, 14], [18, 26]],
  [[4, 15], [17, 28]],
  [[2, 30]],
  [[1, 30]],
  [[0, 31]], [[0, 31]], [[0, 31]],
  [[1, 30]],
  [[2, 29]],
  [[3, 28]],
  [[4, 27]],
  [[4, 27]],
  [[4, 27]],
  [[6, 25]],
  [[8, 23]],
  [[11, 20]], [[11, 20]], [[11, 20]], [[12, 19]], [[12, 19]],
  [[9, 22]],
  [[6, 25]],
  [[4, 27]],
  [[4, 10], [14, 18], [22, 28]]
]);

const CUTOUTS = Object.freeze([
  [7, 14, 17],
  [8, 13, 18],
  [9, 12, 19],
  [10, 13, 18],
  [11, 14, 17],
  [12, 15, 16],
  [13, 15, 16],
  [14, 15, 16],
]);

const VARIANTS = Object.freeze([
  {
    id: "01-shoulder-weighted",
    title: "01 / SHOULDER-WEIGHTED",
    structureRects: [[7, 5, 7, 5], [10, 9, 4, 6], [12, 13, 3, 8], [8, 20, 5, 4]]
  },
  {
    id: "02-balanced",
    title: "02 / BALANCED",
    structureRects: [[8, 6, 6, 4], [10, 9, 4, 6], [12, 13, 3, 8], [7, 20, 6, 4]]
  },
  {
    id: "03-grounded",
    title: "03 / GROUNDED",
    structureRects: [[9, 6, 6, 5], [10, 10, 4, 5], [12, 13, 3, 8], [6, 20, 8, 4]]
  }
]);

function key(x, y) {
  return `${x},${y}`;
}

function oakCells() {
  const cells = new Set();
  ROWS.forEach((ranges, y) => {
    for (const [start, end] of ranges) {
      for (let x = start; x <= end; x += 1) cells.add(key(x, y));
    }
  });
  for (const [y, start, end] of CUTOUTS) {
    for (let x = start; x <= end; x += 1) cells.delete(key(x, y));
  }
  return cells;
}

function structureCells(rects, oak) {
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
    const current = queue.shift();
    const [x, y] = current.split(",").map(Number);
    for (const next of [key(x + 1, y), key(x - 1, y), key(x, y + 1), key(x, y - 1)]) {
      if (cells.has(next) && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  if (seen.size !== cells.size) throw new Error(`${label} is not four-neighbor connected.`);
}

function cellsMarkup(cells, fill, prefix) {
  return [...cells]
    .map((cell) => cell.split(",").map(Number))
    .sort(([ax, ay], [bx, by]) => ay - by || ax - bx)
    .map(([x, y]) => `<rect x="${20 + x}" y="${6 + y}" width="1" height="1" fill="${fill}" data-cell="${prefix}-${x}-${y}"/>`)
    .join("\n  ");
}

function renderSvg(variant, mode) {
  const oak = oakCells();
  const structure = structureCells(variant.structureRects, oak);
  assertConnected(oak, "Oak silhouette");
  assertConnected(structure, `${variant.id} structure plane`);
  if (structure.size < 78 || structure.size > 116) {
    throw new Error(`${variant.id} structure area ${structure.size}u² is outside 78–116u².`);
  }
  const forest = new Set([...oak].filter((cell) => !structure.has(cell)));
  const background = mode === "light" ? TOKENS.bone : TOKENS.ink;
  const structureFill = mode === "light" ? TOKENS.ink : TOKENS.bone;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 36" width="864" height="576" role="img" aria-labelledby="title desc" shape-rendering="crispEdges">
  <title id="title">${variant.title} — ${mode}</title>
  <desc id="desc">Offset full-tree pixel Oak poster concept with one embedded structure plane.</desc>
  <rect width="54" height="36" fill="${background}" data-token="background"/>
  ${cellsMarkup(forest, TOKENS.forest, "forest")}
  ${cellsMarkup(structure, structureFill, "structure")}
  <rect x="7" y="27" width="2" height="2" fill="${TOKENS.signal}" data-token="signal"/>
</svg>\n`;
}

const manifest = [];
await mkdir(ROOT, { recursive: true });
for (const variant of VARIANTS) {
  const oak = oakCells();
  const structure = structureCells(variant.structureRects, oak);
  for (const mode of ["light", "dark"]) {
    const filename = `${variant.id}-${mode}.svg`;
    await writeFile(resolve(ROOT, filename), renderSvg(variant, mode), "utf8");
    manifest.push({ filename, variant: variant.id, mode, oakArea: oak.size, structureArea: structure.size });
  }
}
await writeFile(resolve(ROOT, "manifest.json"), `${JSON.stringify({ tokens: TOKENS, variants: manifest }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ generated: manifest }, null, 2));
