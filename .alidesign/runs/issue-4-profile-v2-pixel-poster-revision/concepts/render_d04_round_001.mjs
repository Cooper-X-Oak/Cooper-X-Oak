import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "d04-round-001");
const TOKENS = Object.freeze({ bone: "#F2EFE4", ink: "#0D100E", forest: "#347A55", signal: "#3B9648" });
const ROWS = Object.freeze([
  [[14,18]], [[12,20]], [[5,9],[11,21],[24,27]], [[3,29]], [[1,30]], [[0,30]], [[0,31]], [[1,31]],
  [[2,30]], [[5,28]], [[4,26]], [[8,25]], [[10,23]], [[11,21]], [[12,20]], [[13,19]],
  [[13,19]], [[13,18]], [[12,18]], [[12,19]], [[11,20]], [[8,12],[14,18],[20,23]], [[5,10],[14,18],[21,26]], [[3,7],[14,17],[24,28]],
]);

const VARIANTS = Object.freeze([
  { id: "01-shoulder-slice", rects: [[2,4,9,4],[4,8,8,2],[7,10,6,2],[10,12,4,2],[11,14,3,3],[12,17,2,4],[10,20,3,3]] },
  { id: "02-stepped-inset", rects: [[3,5,8,3],[5,8,7,2],[8,10,5,3],[10,13,4,2],[11,15,3,3],[12,18,2,3],[10,20,3,2]] },
  { id: "03-deep-left-cut", rects: [[1,5,10,3],[4,8,8,3],[7,11,7,2],[10,13,4,3],[11,16,3,3],[12,19,2,2],[9,20,4,3]] },
]);

const key = (x,y) => `${x},${y}`;
const oakCells = () => {
  const cells = new Set();
  ROWS.forEach((ranges,y) => ranges.forEach(([a,b]) => { for(let x=a;x<=b;x+=1) cells.add(key(x,y)); }));
  return cells;
};
const rectCells = (rects, oak) => {
  const cells = new Set();
  for (const [x,y,w,h] of rects) for(let yy=y;yy<y+h;yy+=1) for(let xx=x;xx<x+w;xx+=1) {
    if(oak.has(key(xx,yy))) cells.add(key(xx,yy));
  }
  return cells;
};
function assertConnected(cells,label) {
  const first=cells.values().next().value, seen=new Set([first]), queue=[first];
  while(queue.length){const [x,y]=queue.shift().split(",").map(Number);for(const n of [key(x+1,y),key(x-1,y),key(x,y+1),key(x,y-1)]) if(cells.has(n)&&!seen.has(n)){seen.add(n);queue.push(n);}}
  if(seen.size!==cells.size) throw new Error(`${label}: structure disconnected ${seen.size}/${cells.size}`);
}
function markup(cells,fill,prefix) {
  return [...cells].map(c=>c.split(",").map(Number)).sort(([ax,ay],[bx,by])=>ay-by||ax-bx)
    .map(([x,y])=>`<rect x="${x+2}" y="${y+2}" width="1" height="1" fill="${fill}" data-cell="${prefix}-${x}-${y}"/>`).join("\n  ");
}
function svg(oak,structure,mode,width,height) {
  const forest=new Set([...oak].filter(c=>!structure.has(c)));
  const bg=mode==="light"?TOKENS.bone:TOKENS.ink;
  const cut=mode==="light"?TOKENS.ink:TOKENS.bone;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 28" width="${width}" height="${height}" shape-rendering="crispEdges">
  <rect width="36" height="28" fill="${bg}" data-token="background"/>
  ${markup(forest,TOKENS.forest,"forest")}
  ${markup(structure,cut,"structure")}
  <rect x="1" y="18" width="1" height="1" fill="${TOKENS.signal}" data-token="signal"/>
</svg>\n`;
}

const oak=oakCells();
await mkdir(ROOT,{recursive:true});
const outputs=[];
for(const variant of VARIANTS){
  const structure=rectCells(variant.rects,oak);
  assertConnected(structure,variant.id);
  if(structure.size<60||structure.size>110) throw new Error(`${variant.id}: area ${structure.size} outside 60..110`);
  if([...structure].some(c=>{const [x,y]=c.split(",").map(Number);return y>=14&&x>14;})) throw new Error(`${variant.id}: structure crosses trunk center corridor`);
  if([...structure].some(c=>{const [x,y]=c.split(",").map(Number);return y>=21&&x>=20;})) throw new Error(`${variant.id}: structure touches right root`);
  for(const mode of ["light","dark"]){
    await writeFile(resolve(ROOT,`${variant.id}-${mode}-860.svg`),svg(oak,structure,mode,860,669),"utf8");
    await writeFile(resolve(ROOT,`${variant.id}-${mode}-320.svg`),svg(oak,structure,mode,320,249),"utf8");
  }
  outputs.push({id:variant.id,oakArea:oak.size,structureArea:structure.size,outerCellSetFrozen:true,trunkCenterMaxX:Math.max(...[...structure].filter(c=>Number(c.split(",")[1])>=14).map(c=>Number(c.split(",")[0]))),rightRootTouched:false});
}
await writeFile(resolve(ROOT,"manifest.json"),`${JSON.stringify({silhouette:"a-three-crown-positive-y",tokens:TOKENS,outputs},null,2)}\n`,"utf8");
console.log(JSON.stringify({root:ROOT,outputs},null,2));
