import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(HERE, "round-002");
const CDP = "http://127.0.0.1:9223";
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

const cases = [
  { id: "profile-v2-poster-860-light", width: 1280, height: 900, colorScheme: "light" },
  { id: "profile-v2-poster-860-dark", width: 1280, height: 900, colorScheme: "dark" },
  { id: "profile-v2-poster-320-light", width: 320, height: 800, colorScheme: "light" },
  { id: "profile-v2-poster-320-dark", width: 320, height: 800, colorScheme: "dark" },
  { id: "profile-v2-poster-320-images-disabled", width: 320, height: 800, colorScheme: "light", imagesDisabled: true }
];

const reports = [];
await mkdir(OUTPUT_DIR, { recursive: true });
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
  await command("Page.navigate", { url: `http://127.0.0.1:8765/profile.html?case=${item.id}` });
  await new Promise((resolveWait) => setTimeout(resolveWait, 350));
  const evaluated = await command("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const nodes = [...document.querySelectorAll("h1,h2,h3,picture,img,a")];
    const bounds = nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        tag: node.tagName.toLowerCase(),
        text: (node.textContent || node.getAttribute("alt") || "").trim().slice(0, 80),
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        src: node.getAttribute("src") || ""
      };
    });
    return {
      innerWidth,
      clientWidth: viewportWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowNodes: bounds.filter((node) => node.left < -0.5 || node.right > viewportWidth + 0.5),
      links: bounds.filter((node) => node.tag === "a"),
      hero: bounds.find((node) => node.src.includes("profile-signature")) || null,
      evidenceImage: bounds.find((node) => node.src.includes("profile-evidence")) || null,
      h1: bounds.find((node) => node.tag === "h1") || null
    };
  })()` });
  const metrics = evaluated.result.value;
  if (metrics.scrollWidth !== metrics.clientWidth || metrics.overflowNodes.length) {
    throw new Error(`${item.id} has horizontal overflow.`);
  }
  if (metrics.links.some((link) => link.left < 0 || link.right > metrics.clientWidth)) {
    throw new Error(`${item.id} has an out-of-bounds link.`);
  }
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
    clip: {
      x: 0,
      y: 0,
      width: item.width,
      height: Math.ceil(layout.cssContentSize.height),
      scale: 1
    }
  });
  await writeFile(resolve(OUTPUT_DIR, `${item.id}.png`), Buffer.from(screenshot.data, "base64"));
  reports.push({ ...item, metrics });
}

socket.close();
await writeFile(resolve(OUTPUT_DIR, "production-metrics.json"), `${JSON.stringify(reports, null, 2)}\n`, "utf8");
console.log(JSON.stringify(reports.map(({ id, metrics }) => ({ id, ...metrics, links: metrics.links.length })), null, 2));
