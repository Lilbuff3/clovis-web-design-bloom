// Fill the empty #root of dist/index.html and dist/boost.html with server-rendered markup,
// so crawlers that don't run JavaScript see the text. main.tsx still uses createRoot, which
// replaces this markup on load, so it can never cause a hydration mismatch.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EMPTY = '<div id="root"></div>';

const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
try {
  const { renderHome, renderBoost } = await vite.ssrLoadModule("/src/entry-server.tsx");
  for (const [file, render] of [
    ["dist/index.html", renderHome],
    ["dist/boost.html", renderBoost],
    ["dist/boost/index.html", renderBoost],
  ]) {
    const full = path.join(root, file);
    const html = fs.readFileSync(full, "utf-8");
    if (!html.includes(EMPTY)) throw new Error(`${file}: no empty ${EMPTY} to fill`);
    const body = render();
    fs.writeFileSync(full, html.replace(EMPTY, `<div id="root">${body}</div>`));
    console.log(`prerendered ${file} (+${Math.round(body.length / 1024)} KB)`);
  }
} finally {
  await vite.close();
}
