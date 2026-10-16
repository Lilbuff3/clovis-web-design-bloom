// "Yes. It found you." / "No. It doesn't." rests on this match.
// Node 22.18+ imports the .ts file directly (type stripping).
import assert from 'node:assert/strict';
import handler, { namedIn } from '../api/ask-gemini.ts';

const places = ['Olsen Roofing & Solar', 'Big Bros Dumpster Rentals', 'Joe’s Taquería'];
assert.equal(namedIn(places, 'Olsen Roofing'), 'Olsen Roofing & Solar');
assert.equal(namedIn(['Big Bros Dumpster Rental'], 'Big Bros Dumpster Rentals'), 'Big Bros Dumpster Rental');
assert.equal(namedIn(places, "Joe's Taqueria"), 'Joe’s Taquería');
assert.equal(namedIn(['Olson Roofing'], 'Olsen Roofing'), null);
assert.equal(namedIn(places, ''), null);
assert.equal(namedIn(places, 'The Company'), null); // nothing distinctive to look for
console.log('Gemini answer match: 6 cases ✓');

// When Gemini answers without Google Maps sources, the endpoint asks once more before giving up.
// Fake Gemini responses only; nothing leaves this machine.
process.env.GEMINI_API_KEY = 'fake-key-for-tests';
const grounded = {
  candidates: [{
    content: { parts: [{ text: 'A Roofing is good.' }] },
    groundingMetadata: { groundingChunks: [{ maps: { title: 'A Roofing - Google Maps', uri: 'https://maps.google.com/?cid=1' } }] },
  }],
};
const ungrounded = { candidates: [{ content: { parts: [{ text: 'Try A Roofing.' }] } }] };
const ask = (who) =>
  handler(new Request('http://test/api/ask-gemini', {
    method: 'POST',
    headers: { 'x-forwarded-for': who },
    body: JSON.stringify({ businessName: 'A Roofing', trade: 'roofer', city: 'Clovis, CA' }),
  }));
const realWarn = console.warn;
console.warn = () => {}; // the endpoint logs each miss; expected here

let calls = 0;
globalThis.fetch = async () => Response.json(calls++ === 0 ? ungrounded : grounded);
let res = await ask('retry-then-ok');
assert.equal(res.status, 200);
assert.equal(calls, 2);
assert.equal((await res.json()).named, 'A Roofing');

calls = 0;
globalThis.fetch = async () => (calls++, Response.json(ungrounded));
res = await ask('two-misses');
assert.equal(res.status, 502);
assert.equal(calls, 2);

// When LEAD_ALERT_WEBHOOK_URL is configured, a completed audit sends a lead notification.
let webhookHit = null;
process.env.LEAD_ALERT_WEBHOOK_URL = 'https://ntfy.sh/test-topic';
globalThis.fetch = async (url, init) => {
  if (String(url).includes('ntfy.sh')) {
    webhookHit = { url: String(url), body: init?.body };
    return new Response('ok', { status: 200 });
  }
  return Response.json(grounded);
};
res = await ask('webhook-check');
assert.equal(res.status, 200);
assert.ok(webhookHit, 'Expected LEAD_ALERT_WEBHOOK_URL to be called');
assert.ok(String(webhookHit.body).includes('A Roofing'), 'Expected lead business name in webhook payload');
delete process.env.LEAD_ALERT_WEBHOOK_URL;

console.warn = realWarn;
console.log('Gemini retry & lead webhook: 3 cases ✓');

// Verify personalized outreach audit link generator and sitemap/robots discovery files.
import fs from 'node:fs';
import { buildAuditUrl } from '../scripts/outreach-links.mjs';

const auditUrl = buildAuditUrl('Olsen Roofing', 'roofer', 'Clovis, CA');
assert.equal(auditUrl, 'https://cloviswebdesign.com/?biz=Olsen+Roofing&trade=roofer&city=Clovis%2C+CA&autorun=1#check');

const robots = fs.readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
assert.ok(robots.includes('Sitemap: https://cloviswebdesign.com/sitemap.xml'));

const sitemap = fs.readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
for (const canonical of [
  'https://cloviswebdesign.com/',
  'https://cloviswebdesign.com/services/medical-web-design/',
  'https://cloviswebdesign.com/services/contractor-websites/',
  'https://cloviswebdesign.com/services/local-seo-fresno/',
]) {
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `Missing ${canonical} in sitemap.xml`);
}
assert.ok(!sitemap.includes('/services/web-design-clovis/'), 'Retired route must not appear in sitemap.xml');

const rootLayout = fs.readFileSync(new URL('../src/layouts/RootLayout.astro', import.meta.url), 'utf8');
assert.ok(rootLayout.includes('/_vercel/insights/script.js'), 'Expected Vercel Web Analytics script in RootLayout.astro');
assert.ok(rootLayout.includes('google-site-verification'), 'Expected Google Search Console verification tag in RootLayout.astro');

import { CANONICAL_URLS, pingIndexNow } from '../scripts/ping-search-engines.mjs';
let indexNowPayload = null;
const pingRes = await pingIndexNow(async (url, init) => {
  indexNowPayload = JSON.parse(init.body);
  return new Response('', { status: 202 });
});
assert.equal(pingRes.ok, true);
assert.deepEqual(indexNowPayload.urlList, CANONICAL_URLS);
console.log('Outreach URLs, Analytics & SEO discovery files: 5 cases ✓');

