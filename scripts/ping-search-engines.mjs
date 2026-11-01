#!/usr/bin/env node
/**
 * Submits all canonical cloviswebdesign.com URLs to IndexNow (Bing, ChatGPT Search,
 * DuckDuckGo, Yandex) so new/updated pages are crawled immediately upon deploy.
 */

import { CANONICAL_URLS } from '../src/lib/discovery.ts';

const HOST = 'cloviswebdesign.com';
const KEY = '8f4b2e9a1c7d4e6f8a2b3c4d5e6f7a8b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

export { CANONICAL_URLS };

export async function pingIndexNow(fetchImpl = globalThis.fetch) {
  const res = await fetchImpl('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: CANONICAL_URLS,
    }),
  });
  return { status: res.status, ok: res.ok || res.status === 202 };
}

import { pathToFileURL } from 'node:url';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await pingIndexNow();
  console.log(`IndexNow submission status: ${result.status} (ok=${result.ok})`);
  for (const u of CANONICAL_URLS) console.log(`  → ${u}`);
  if (!result.ok) process.exit(1);
}
