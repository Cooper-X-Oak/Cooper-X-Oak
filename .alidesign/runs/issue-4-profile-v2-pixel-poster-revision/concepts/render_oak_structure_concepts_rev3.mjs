import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "revision-006");
const TOKENS = Object.freeze({ bone: "#F2EFE4", ink: "#0D100E", forest: "#347A55", signal: "#3B9648" });
const ROWS = Object.freeze([
  [[13,18]], [[10,21]], [[7,24]], [[4,27]], [[3,28]], [[1,30]], [[0,31]], [[0,31]],
  [[1,12],[19,30]], [[2,13],[18,29]], [[3,13],[18,28]], [[4,13],[18,27]],
  [[5,13],[18,26]], [[6,13],[18,25]], [[7,15],[16,24]], [[8,15],[16,23]],
  [[9,16],[15,22]], [[10,21]], [[12,19]], [[12,19]], [[11,20]], [[9,22]],
  [[6,13],[15,16],[18,25]], [[3,10],[15,16],[21,28]]
]);
const VARIANTS = Object.freeze([
  { id: "02b-balanced-inset", rects: [[2,5,10,3],[4,8,7,2],[9,10,2,4],[10,14,3,3],[12,17,2,4],[8,21,5,3]] }
]);

const key = (x,y) => `${x},${y}`;
function oakCells() {
  const cells = new Set();
  ROWS.forEach((ranges,y) => ranges.forEach(([a,b]) => { for (let x=a;x<=b;x+=1) cells.add(key(x,y)); }));
  return cells;
}
function rectCells(rects, oak) {
  const cells = new Set();
  rects.forEach(([x,y,w,h]) => { for(let yy=y;yy<y+h;yy+=1) for(let xx=x;xx<x+w;xx+=1) if(oak.has(key(xx,yy))) cells.add(key(xx,yy)); });
  return cells;
}
function assertConnected(cells,label) {
  const first = cells.values().next().value;
  const seen = new Set([first]);
  const queue = [first];
  while(queue.length) {
    const [x,y] = queue.shift().split(",").map(Number);
    [key(x+1,y),key(x-1,y),key(x,y+1),key(x,y-1)].forEach((next) => {
      if(cells.has(next) && !seen.has(next)) { seen.add(next); queue.push(next); }
    });
  }
  if(seen.size !== cells.size) throw new Error(`${label} is not connected`);
}
function holes(cells) {
  const outside = new Set([key(-1,-1)]); const queue=[key(-1,-1)];
  while(queue.length) {
    const [x,y]=queue.shift().split(",").map(Number);
    [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].forEach(([nx,ny]) => {
      const n=key(nx,ny);
      if(nx>=-1&&nx<=32&&ny>=-1&&ny<=24&&!cells.has(n)&&!outside.has(n)){outside.add(n);queue.push(n);}
    });
  }
  let count=0;
  for(let y=0;y<24;y+=1) for(let x=0;x<32;x+=1) if(!cells.has(key(x,y))&&!outside.has(key(x,y))) count+=1;
  return count;
}
function markup(cells,fill,prefix,ox=20,oy=6) {
  return [...cells].map(c=>c.split(",").map(Number)).sort(([ax,ay],[bx,by])=>ay-by||ax-bx)
    .map(([x,y])=>`<rect x="${ox+x}" y="${oy+y}" width="1" height="1" fill="${fill}" data-cell="${prefix}-${x}-${y}"/>`).join("\n  ");
}
function svg(variant,mode,width,height) {
  const oak=oakCells(); const structure=rectCells(variant.rects,oak); const forest=new Set([...oak].filter(c=>!structure.has(c)));
  const bg=mode==="light"?TOKENS.bone:TOKENS.ink; const cut=mode==="light"?TOKENS.ink:TOKENS.bone;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 36" width="${width}" height="${height}" role="img" aria-label="Pixel oak monument concept" shape-rendering="crispEdges">
  <rect width="54" height="36" fill="${bg}" data-token="background"/>
  ${markup(forest,TOKENS.forest,"forest")}
  ${markup(structure,cut,"structure")}
  <rect x="7" y="27" width="2" height="2" fill="${TOKENS.signal}" data-token="signal"/>
</svg>\n`;
}
function pairwise(a,b){const i=[...a].filter(c=>b.has(c)).length;const u=new Set([...a,...b]).size;return{intersection:i,symmetricDifference:u-i,jaccard:Number((i/u).toFixed(3))};}

const oak=oakCells(); assertConnected(oak,"oak");
await mkdir(ROOT,{recursive:true});
const structures=new Map(); const outputs=[];
for(const variant of VARIANTS){
  const structure=rectCells(variant.rects,oak); assertConnected(structure,variant.id);
  if(holes(structure)!==0) throw new Error(`${variant.id} contains a hole`);
  if(structure.size<78||structure.size>116) throw new Error(`${variant.id} area ${structure.size} outside 78–116`);
  structures.set(variant.id,structure);
  for(const mode of ["light","dark"]){
    const desktop=`${variant.id}-${mode}.svg`; const narrow=`${variant.id}-${mode}-320.svg`;
    await writeFile(resolve(ROOT,desktop),svg(variant,mode,864,576),"utf8");
    await writeFile(resolve(ROOT,narrow),svg(variant,mode,320,213),"utf8");
    outputs.push({variant:variant.id,mode,desktop,narrow,oakArea:oak.size,structureArea:structure.size});
  }
}
const comparisons=[];
for(let i=0;i<VARIANTS.length;i+=1) for(let j=i+1;j<VARIANTS.length;j+=1){const a=VARIANTS[i].id,b=VARIANTS[j].id;comparisons.push({left:a,right:b,...pairwise(structures.get(a),structures.get(b))});}
await writeFile(resolve(ROOT,"manifest.json"),`${JSON.stringify({revision:3,tokens:TOKENS,oakArea:oak.size,outputs,comparisons},null,2)}\n`,"utf8");
console.log(JSON.stringify({root:ROOT,oakArea:oak.size,outputs,comparisons},null,2));
