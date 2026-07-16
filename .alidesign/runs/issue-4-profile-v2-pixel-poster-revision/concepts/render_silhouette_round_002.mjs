import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "silhouette-round-002");
const INK = "#0D100E";
const BONE = "#F2EFE4";

const HYPOTHESES = Object.freeze([
  {
    id: "a-three-crown-positive-y",
    rows: [
      [[14, 18]], [[12, 20]], [[5, 9], [11, 21], [24, 27]], [[3, 29]],
      [[1, 30]], [[0, 30]], [[0, 31]], [[1, 31]],
      [[2, 30]], [[5, 28]], [[4, 26]], [[8, 25]],
      [[10, 23]], [[11, 21]], [[12, 20]], [[13, 19]],
      [[13, 19]], [[13, 18]], [[12, 18]], [[12, 19]],
      [[11, 20]], [[8, 12], [14, 18], [20, 23]], [[5, 10], [14, 18], [21, 26]], [[3, 7], [14, 17], [24, 28]],
    ],
  },
  {
    id: "b-exposed-branch-frame",
    rows: [
      [[14, 17]], [[12, 19]], [[4, 9], [11, 20], [24, 28]], [[2, 9], [11, 21], [23, 30]],
      [[1, 9], [11, 21], [23, 31]], [[1, 9], [11, 21], [23, 31]], [[3, 9], [11, 20], [23, 29]], [[5, 9], [12, 19], [22, 28]],
      [[8, 24]], [[9, 25]], [[10, 23]], [[11, 22]],
      [[12, 21]], [[13, 20]], [[13, 19]], [[14, 19]],
      [[13, 18]], [[13, 18]], [[12, 18]], [[12, 19]],
      [[11, 20]], [[7, 11], [14, 18], [20, 24]], [[4, 9], [14, 18], [22, 27]], [[2, 6], [14, 17], [25, 29]],
    ],
  },
  {
    id: "c-wind-shaped-offset",
    rows: [
      [[18, 23]], [[15, 26]], [[9, 28]], [[6, 30]],
      [[4, 31]], [[3, 31]], [[2, 31]], [[3, 30]],
      [[4, 29]], [[6, 27]], [[8, 25]], [[9, 23]],
      [[10, 22]], [[11, 21]], [[12, 20]], [[12, 19]],
      [[13, 19]], [[12, 18]], [[12, 18]], [[11, 18]],
      [[10, 20]], [[7, 12], [14, 18], [20, 23]], [[4, 9], [14, 18], [21, 26]], [[2, 6], [14, 17], [24, 29]],
    ],
  },
]);

const key = (x, y) => `${x},${y}`;

function cellsFor(rows) {
  const cells = new Set();
  rows.forEach((ranges, y) => ranges.forEach(([start, end]) => {
    for (let x = start; x <= end; x += 1) cells.add(key(x, y));
  }));
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
  if (seen.size !== cells.size) throw new Error(`${label}: disconnected (${seen.size}/${cells.size})`);
}

function enclosedBackgroundCells(cells) {
  const outside = new Set([key(-1, -1)]);
  const queue = [key(-1, -1)];
  while (queue.length) {
    const [x, y] = queue.shift().split(",").map(Number);
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      const next = key(nx, ny);
      if (nx >= -1 && nx <= 32 && ny >= -1 && ny <= 24 && !cells.has(next) && !outside.has(next)) {
        outside.add(next);
        queue.push(next);
      }
    }
  }
  const enclosed = [];
  for (let y = 0; y < 24; y += 1) for (let x = 0; x < 32; x += 1) {
    if (!cells.has(key(x, y)) && !outside.has(key(x, y))) enclosed.push(key(x, y));
  }
  return enclosed;
}

function longestRootRun(rows) {
  return Math.max(...rows.slice(21).flatMap((ranges) => ranges.map(([start, end]) => end - start + 1)));
}

function svg(cells, width, height) {
  const rects = [...cells]
    .map((cell) => cell.split(",").map(Number))
    .sort(([ax, ay], [bx, by]) => ay - by || ax - bx)
    .map(([x, y]) => `<rect x="${x + 2}" y="${y + 2}" width="1" height="1" fill="${INK}" data-cell="${x}-${y}"/>`)
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 28" width="${width}" height="${height}" shape-rendering="crispEdges">
  <rect width="36" height="28" fill="${BONE}"/>
  ${rects}
</svg>\n`;
}

await mkdir(ROOT, { recursive: true });
const manifest = [];
for (const hypothesis of HYPOTHESES) {
  if (hypothesis.rows.length !== 24) throw new Error(`${hypothesis.id}: expected 24 rows`);
  const cells = cellsFor(hypothesis.rows);
  assertConnected(cells, hypothesis.id);
  const enclosed = enclosedBackgroundCells(cells);
  if (enclosed.length !== 0) throw new Error(`${hypothesis.id}: enclosed background cells ${enclosed.join(" ")}`);
  const rootRun = longestRootRun(hypothesis.rows);
  if (rootRun > 10) throw new Error(`${hypothesis.id}: root run ${rootRun} exceeds 10u`);
  await writeFile(resolve(ROOT, `${hypothesis.id}-860.svg`), svg(cells, 860, 669), "utf8");
  await writeFile(resolve(ROOT, `${hypothesis.id}-320.svg`), svg(cells, 320, 249), "utf8");
  manifest.push({ id: hypothesis.id, area: cells.size, enclosedBackgroundCells: enclosed.length, longestRootRun: rootRun });
}
await writeFile(resolve(ROOT, "manifest.json"), `${JSON.stringify({ grid: "32x24", manifest }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ root: ROOT, manifest }, null, 2));
