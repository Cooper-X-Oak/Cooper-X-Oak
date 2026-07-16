import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FOREST_PROJECTION = process.env.D03_PROJECTION === "forest";
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), FOREST_PROJECTION ? "d03-projection-round-001" : "d04-round-002");
const TOKENS = Object.freeze({ bone: "#F2EFE4", ink: "#0D100E", forest: "#347A55", signal: "#3B9648", structureLight: "#5C8E70", structureDark: "#285F45" });
const ROWS = Object.freeze([
  [[14,18]], [[12,20]], [[5,9],[11,21],[24,27]], [[3,29]], [[1,30]], [[0,30]], [[0,31]], [[1,31]],
  [[2,30]], [[5,28]], [[4,26]], [[8,25]], [[10,23]], [[11,21]], [[12,20]], [[13,19]],
  [[13,19]], [[13,18]], [[12,18]], [[12,19]], [[11,20]], [[8,12],[14,18],[20,23]], [[5,10],[14,18],[21,26]], [[3,7],[14,17],[24,28]],
]);
const STRUCTURE_ROWS = Object.freeze({
  5:[[2,11]], 6:[[2,11]], 7:[[4,12]], 8:[[5,14]], 9:[[6,14]], 10:[[6,14]],
  11:[[13,14]], 12:[[13,13]], 13:[[13,13]], 14:[[13,13]], 15:[[13,13]], 16:[[13,13]],
  17:[[13,13]], 18:[[12,13]], 19:[[12,12]], 20:[[11,12]],
  21:[[9,12]], 22:[[7,10]],
});

const key=(x,y)=>`${x},${y}`;
function rowsToCells(rows){const cells=new Set();rows.forEach((ranges,y)=>ranges.forEach(([a,b])=>{for(let x=a;x<=b;x+=1)cells.add(key(x,y));}));return cells;}
function structureCells(){const cells=new Set();for(const [y,ranges] of Object.entries(STRUCTURE_ROWS))for(const [a,b] of ranges)for(let x=a;x<=b;x+=1)cells.add(key(x,Number(y)));return cells;}
function canonical(cells){return [...cells].map(c=>c.split(",").map(Number)).sort(([ax,ay],[bx,by])=>ay-by||ax-bx).map(([x,y])=>`${x},${y}`).join(";");}
function sha(cells){return createHash("sha256").update(canonical(cells)).digest("hex");}
function assertConnected(cells){const first=cells.values().next().value,seen=new Set([first]),q=[first];while(q.length){const[x,y]=q.shift().split(",").map(Number);for(const n of[key(x+1,y),key(x-1,y),key(x,y+1),key(x,y-1)])if(cells.has(n)&&!seen.has(n)){seen.add(n);q.push(n);}}if(seen.size!==cells.size)throw new Error(`disconnected ${seen.size}/${cells.size}`);}
function markup(cells,fill,prefix){return[...cells].map(c=>c.split(",").map(Number)).sort(([ax,ay],[bx,by])=>ay-by||ax-bx).map(([x,y])=>`<rect x="${x+2}" y="${y+2}" width="1" height="1" fill="${fill}" data-cell="${prefix}-${x}-${y}"/>`).join("\n  ");}
function svg(oak,structure,mode,width,height){const forest=new Set([...oak].filter(c=>!structure.has(c)));const bg=mode==="light"?TOKENS.bone:TOKENS.ink;const cut=FOREST_PROJECTION?(mode==="light"?TOKENS.structureLight:TOKENS.structureDark):(mode==="light"?TOKENS.ink:TOKENS.bone);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 28" width="${width}" height="${height}" shape-rendering="crispEdges">
  <rect width="36" height="28" fill="${bg}" data-token="background"/>
  ${markup(forest,TOKENS.forest,"forest")}
  ${markup(structure,cut,"structure")}
  <rect x="1" y="18" width="1" height="1" fill="${TOKENS.signal}" data-token="signal"/>
</svg>\n`;}

const oak=rowsToCells(ROWS), structure=structureCells();
if([...structure].some(c=>!oak.has(c)))throw new Error("structure leaves frozen silhouette");
assertConnected(structure);
const shoulder=[...structure].filter(c=>{const y=Number(c.split(",")[1]);return y>=5&&y<=10;});
const spine=[...structure].filter(c=>{const y=Number(c.split(",")[1]);return y>=11&&y<=20;});
const root=[...structure].filter(c=>Number(c.split(",")[1])>=21);
if(structure.size<78||structure.size>82)throw new Error(`area ${structure.size}`);
if(shoulder.length<56||shoulder.length>62)throw new Error(`shoulder ${shoulder.length}`);
if(spine.length<10||spine.length>14)throw new Error(`spine ${spine.length}`);
if(root.length<6||root.length>10)throw new Error(`root ${root.length}`);
const widths=Object.fromEntries([...new Set([...structure].map(c=>Number(c.split(",")[1])))].sort((a,b)=>a-b).map(y=>[y,[...structure].filter(c=>Number(c.split(",")[1])===y).length]));
if(Object.entries(widths).some(([y,w])=>Number(y)>=14&&Number(y)<=20&&w>2))throw new Error("spine exceeds 2u");

await mkdir(ROOT,{recursive:true});
for(const mode of["light","dark"]){await writeFile(resolve(ROOT,`04-shallow-facet-${mode}-860.svg`),svg(oak,structure,mode,860,669),"utf8");await writeFile(resolve(ROOT,`04-shallow-facet-${mode}-320.svg`),svg(oak,structure,mode,320,249),"utf8");}
const manifest={id:"04-shallow-facet",projection:FOREST_PROJECTION?"forest-family-a":"polar-legacy",silhouette:"a-three-crown-positive-y",silhouetteArea:oak.size,silhouetteCellSha256:sha(oak),structureArea:structure.size,structureCellSha256:sha(structure),posterArea:1944,posterShare:Number((structure.size/1944).toFixed(5)),shoulderArea:shoulder.length,spineArea:spine.length,rootExitArea:root.length,perRowWidth:widths,outerCellSetFrozen:true,rightRootTouched:false,tokens:TOKENS};
await writeFile(resolve(ROOT,"manifest.json"),`${JSON.stringify(manifest,null,2)}\n`,"utf8");
console.log(JSON.stringify({root:ROOT,...manifest},null,2));
