// Fill the empty #root of each built page with server-rendered markup, so crawlers that
// don't run JavaScript see the text. Pages listed with a `head` (src/entry-server.tsx) are
// new files: a copy of index.html with their own title, canonical, meta and JSON-LD.
// main.tsx still uses createRoot, which replaces this markup on load, so it can never cause
// a hydration mismatch.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EMPTY = '<div id="root"></div>';
const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function withHead(html, { url, title, description, jsonLd }) {
  const swaps = [
    [/<title>.*?<\/title>/s, `<title>${attr(title)}</title>`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`],
    [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${attr(description)}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${attr(title)}" />`],
    [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${attr(description)}" />`],
    [/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`],
    [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${attr(title)}" />`],
    [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${attr(description)}" />`],
    [
      /<script type="application\/ld\+json">.*?<\/script>/s,
      `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
    ],
  ];
  for (const [re, to] of swaps) {
    if (!re.test(html)) throw new Error(`index.html has no tag matching ${re}`);
    html = html.replace(re, () => to); // a function, so "$5,000" isn't read as a replacement pattern
  }
  return html;
}

const template = fs.readFileSync(path.join(root, "dist/index.html"), "utf-8");
const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
try {
  const { pages } = await vite.ssrLoadModule("/src/entry-server.tsx");
  for (const { file, render, head } of pages) {
    const full = path.join(root, file);
    const html = head ? withHead(template, head) : fs.readFileSync(full, "utf-8");
    if (!html.includes(EMPTY)) throw new Error(`${file}: no empty ${EMPTY} to fill`);
    const body = render();
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, html.replace(EMPTY, () => `<div id="root">${body}</div>`));
    console.log(`prerendered ${file} (+${Math.round(body.length / 1024)} KB)`);
  }
} finally {
  await vite.close();
}
