import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CDP = "http://127.0.0.1:9224";
const target = (await (await fetch(`${CDP}/json/list`)).json()).find((item) => item.type === "page");
if (!target) throw new Error("No local CDP page target is available.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolveOpen, reject) => {
  socket.addEventListener("open", resolveOpen, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(message.error.message));
  else handler.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  const result = new Promise((resolveResult, reject) => pending.set(id, { resolve: resolveResult, reject }));
  socket.send(JSON.stringify({ id, method, params }));
  return result;
}

await command("Page.enable");
await command("Runtime.enable");
await command("Network.enable");
await command("Network.setCacheDisabled", { cacheDisabled: true });

const cases = [
  { id: "profile-860-light", width: 1280, height: 900, colorScheme: "light" },
  { id: "profile-860-dark", width: 1280, height: 900, colorScheme: "dark" },
  { id: "profile-320-light", width: 320, height: 800, colorScheme: "light" },
  { id: "profile-320-dark", width: 320, height: 800, colorScheme: "dark" },
  { id: "profile-320-images-disabled", width: 320, height: 800, colorScheme: "light", imagesDisabled: true }
];

const reports = [];
await mkdir(HERE, { recursive: true });
for (const item of cases) {
  await command("Emulation.setDeviceMetricsOverride", {
    width: item.width,
    height: item.height,
    deviceScaleFactor: 1,
    mobile: item.width <= 480
  });
  await command("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-color-scheme", value: item.colorScheme }]
  });
  await command("Network.setBlockedURLs", { urls: item.imagesDisabled ? ["*.svg"] : [] });
  await command("Page.navigate", { url: `http://127.0.0.1:8766/profile.html?case=${item.id}` });
  await new Promise((resolveWait) => setTimeout(resolveWait, 450));

  const evaluated = await command("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const inspect = (node) => {
      const rect = node.getBoundingClientRect();
      return {
        tag: node.tagName.toLowerCase(),
        text: (node.textContent || node.getAttribute("alt") || "").trim().replace(/\\s+/g, " ").slice(0, 100),
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        src: node.getAttribute("src") || ""
      };
    };
    const nodes = [...document.querySelectorAll("h1,h2,picture,img,a,table,th,td")].map(inspect);
    const links = nodes.filter((node) => node.tag === "a");
    const tables = nodes.filter((node) => node.tag === "table");
    return {
      innerWidth,
      clientWidth: viewportWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowNodes: nodes.filter((node) => node.left < -0.5 || node.right > viewportWidth + 0.5),
      links,
      tables,
      headings: nodes.filter((node) => node.tag === "h1" || node.tag === "h2"),
      hero: nodes.find((node) => node.src.includes("profile-signature")) || null,
      evidenceImage: nodes.find((node) => node.src.includes("profile-evidence")) || null,
      h1: nodes.find((node) => node.tag === "h1") || null
    };
  })()` });
  const metrics = evaluated.result.value;
  if (metrics.scrollWidth !== metrics.clientWidth || metrics.overflowNodes.length) {
    throw new Error(`${item.id} has horizontal overflow: ${JSON.stringify(metrics.overflowNodes)}`);
  }
  if (metrics.links.length !== 8 || metrics.links.some((link) => link.left < 0 || link.right > metrics.clientWidth)) {
    throw new Error(`${item.id} has a missing or out-of-bounds link.`);
  }
  if (metrics.tables.length !== 5 || metrics.tables.some((table) => table.width > metrics.clientWidth + 0.5)) {
    throw new Error(`${item.id} has a missing or out-of-bounds interface table.`);
  }
  if (metrics.headings.length !== 5) throw new Error(`${item.id} has an invalid heading outline.`);
  if (item.imagesDisabled) {
    if (!metrics.hero || metrics.hero.height > 32) throw new Error("Broken Hero did not collapse to one alt-text line.");
    if (!metrics.evidenceImage || metrics.evidenceImage.height > 1) throw new Error("Decorative Evidence image did not collapse.");
    if (!metrics.h1 || metrics.h1.top - metrics.hero.bottom > 32) throw new Error("H1 does not follow the broken Hero compactly.");
  }

  const layout = await command("Page.getLayoutMetrics");
  const screenshot = await command("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: item.width, height: Math.ceil(layout.cssContentSize.height), scale: 1 }
  });
  await writeFile(resolve(HERE, `${item.id}.png`), Buffer.from(screenshot.data, "base64"));
  reports.push({ ...item, metrics });
}

socket.close();
await writeFile(resolve(HERE, "production-metrics.json"), `${JSON.stringify(reports, null, 2)}\n`, "utf8");
console.log(JSON.stringify(reports.map(({ id, metrics }) => ({
  id,
  innerWidth: metrics.innerWidth,
  clientWidth: metrics.clientWidth,
  scrollWidth: metrics.scrollWidth,
  links: metrics.links.length,
  tables: metrics.tables.map((table) => ({ width: table.width, height: table.height })),
  overflowNodes: metrics.overflowNodes.length
})), null, 2));
