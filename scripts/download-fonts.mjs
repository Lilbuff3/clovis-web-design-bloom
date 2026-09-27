import fs from 'node:fs';
import path from 'node:path';

const targetDir = path.resolve('public/fonts');
fs.mkdirSync(targetDir, { recursive: true });

const downloads = [
  {
    url: 'https://cdn.jsdelivr.net/npm/@fontsource-variable/fraunces@latest/files/fraunces-latin-full-normal.woff2',
    name: 'fraunces-variable.woff2',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/@fontsource-variable/fraunces@latest/files/fraunces-latin-full-italic.woff2',
    name: 'fraunces-italic-variable.woff2',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/@fontsource-variable/bricolage-grotesque@latest/files/bricolage-grotesque-latin-wght-normal.woff2',
    name: 'bricolage-grotesque-variable.woff2',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/@fontsource/dm-mono@latest/files/dm-mono-latin-400-normal.woff2',
    name: 'dm-mono-400.woff2',
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/@fontsource/dm-mono@latest/files/dm-mono-latin-500-normal.woff2',
    name: 'dm-mono-500.woff2',
  },
];

for (const item of downloads) {
  console.log(`Downloading ${item.name}...`);
  const res = await fetch(item.url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${item.url}: ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const destPath = path.join(targetDir, item.name);
  fs.writeFileSync(destPath, buf);
  console.log(`Saved ${item.name} (${buf.byteLength} bytes)`);
}
console.log('All fonts downloaded successfully.');
