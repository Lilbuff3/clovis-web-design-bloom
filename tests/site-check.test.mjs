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
// Fake Gemini responses only via injected EdgeDeps adapter; zero globalThis.fetch or process.env mutation.
import { createRateLimiter, deliverLeadAlert, oneLine } from '../src/lib/lead-delivery.ts';

assert.equal(oneLine('  Hello   world \n ', 10), 'Hello worl');
const testLimiter = createRateLimiter(2, 60_000);
assert.equal(testLimiter('1.2.3.4'), false);
assert.equal(testLimiter('1.2.3.4'), false);
assert.equal(testLimiter('1.2.3.4'), true);

const grounded = {
  candidates: [{
    content: { parts: [{ text: 'A Roofing is good.' }] },
    groundingMetadata: { groundingChunks: [{ maps: { title: 'A Roofing - Google Maps', uri: 'https://maps.google.com/?cid=1' } }] },
  }],
};
const ungrounded = { candidates: [{ content: { parts: [{ text: 'Try A Roofing.' }] } }] };
const ask = (who, deps) =>
  handler(new Request('http://test/api/ask-gemini', {
    method: 'POST',
    headers: { 'x-forwarded-for': who },
    body: JSON.stringify({ businessName: 'A Roofing', trade: 'roofer', city: 'Clovis, CA' }),
  }), deps);
const realWarn = console.warn;
console.warn = () => {}; // the endpoint logs each miss; expected here

try {
  let calls = 0;
  let res = await ask('retry-then-ok', {
    env: { GEMINI_API_KEY: 'fake-key-for-tests' },
    fetch: async () => Response.json(calls++ === 0 ? ungrounded : grounded),
  });
  assert.equal(res.status, 200);
  assert.equal(calls, 2);
  assert.equal((await res.json()).named, 'A Roofing');

  calls = 0;
  res = await ask('two-misses', {
    env: { GEMINI_API_KEY: 'fake-key-for-tests' },
    fetch: async () => (calls++, Response.json(ungrounded)),
  });
  assert.equal(res.status, 502);
  assert.equal(calls, 2);

  // When LEAD_ALERT_WEBHOOK_URL is configured, a completed audit sends a lead notification.
  let webhookHit = null;
  const webhookDeps = {
    env: { GEMINI_API_KEY: 'fake-key-for-tests', LEAD_ALERT_WEBHOOK_URL: 'https://ntfy.sh/test-topic' },
    fetch: async (url, init) => {
      if (String(url).includes('ntfy.sh')) {
        webhookHit = { url: String(url), body: init?.body };
        return new Response('ok', { status: 200 });
      }
      return Response.json(grounded);
    },
  };
  res = await ask('webhook-check', webhookDeps);
  assert.equal(res.status, 200);
  assert.ok(webhookHit, 'Expected LEAD_ALERT_WEBHOOK_URL to be called');
  assert.ok(String(webhookHit.body).includes('A Roofing'), 'Expected lead business name in webhook payload');
  assert.ok(String(webhookHit.body).includes('[ORGANIC CHECK]'), 'Expected [ORGANIC CHECK] tag for organic check');

  // Verify outreach link lead attribution
  webhookHit = null;
  res = await handler(new Request('http://test/api/ask-gemini', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'webhook-outreach-check' },
    body: JSON.stringify({ businessName: 'Olsen Roofing', trade: 'roofer', city: 'Clovis, CA', source: 'outreach' }),
  }), webhookDeps);
  assert.equal(res.status, 200);
  assert.ok(webhookHit, 'Expected LEAD_ALERT_WEBHOOK_URL to be called for outreach lead');
  assert.ok(String(webhookHit.body).includes('Olsen Roofing'), 'Expected outreach lead business name in webhook payload');
  assert.ok(String(webhookHit.body).includes('[OUTREACH LINK]'), 'Expected [OUTREACH LINK] tag for outreach');

  // Verify 429 on Maps grounding falls back to gemini-2.5-flash Google Search grounding
  let fallbackHit = false;
  res = await ask('maps-429-fallback', {
    env: { GEMINI_API_KEY: 'fake-key-for-tests' },
    fetch: async (url) => {
      if (String(url).includes('gemini-3.5-flash-lite')) {
        return new Response('rate limit', { status: 429 });
      }
      fallbackHit = String(url).includes('gemini-2.5-flash');
      return Response.json({
        candidates: [{
          content: { parts: [{ text: 'A Roofing: top local roofer in Clovis' }] },
          groundingMetadata: { groundingChunks: [{ web: { title: 'A Roofing', uri: 'https://example.com/a-roofing' } }] },
        }],
      });
    },
  });
  assert.equal(res.status, 200);
  assert.equal(fallbackHit, true, 'Expected 429 on Maps grounding to fall back to gemini-2.5-flash');
  assert.equal((await res.json()).named, 'A Roofing');
} finally {
  console.warn = realWarn;
}
console.log('Gemini retry, 429 fallback & lead webhook: 5 cases ✓');

// Test contact endpoint: api/contact.ts
import contactHandler from '../api/contact.ts';

{
  // 1. Method validation
  let cRes = await contactHandler(new Request('http://test/api/contact/', { method: 'GET', headers: { 'x-forwarded-for': 'ip-1' } }), { env: {} });
  assert.equal(cRes.status, 405, 'Expected 405 for GET on contact endpoint');

  // 2. Input validation (missing reach)
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-2' },
    body: JSON.stringify({ name: 'Sarah', message: 'Hi Adam, auto-drafted message without reach' }),
  }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 when reach (phone/email) is missing');

  // 3. Fail-closed: 503 when LEAD_ALERT_WEBHOOK_URL is unset
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-3' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }), { env: {} });
  assert.equal(cRes.status, 503, 'Expected 503 when LEAD_ALERT_WEBHOOK_URL is unset');

  // 4. Fail-closed: 503 when webhook fetch returns non-2xx
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-4' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }), {
    env: { LEAD_ALERT_WEBHOOK_URL: 'https://ntfy.sh/test-topic' },
    fetch: async () => new Response('error', { status: 500 }),
  });
  assert.equal(cRes.status, 503, 'Expected 503 when webhook returns 500');

  // 5. Fail-closed: 503 when webhook fetch throws
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-5' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }), {
    env: { LEAD_ALERT_WEBHOOK_URL: 'https://ntfy.sh/test-topic' },
    fetch: async () => { throw new Error('network down'); },
  });
  assert.equal(cRes.status, 503, 'Expected 503 when webhook fetch throws');

  // 6. Success: 200 when webhook succeeds (ntfy)
  let contactWebhookHit = null;
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-6' },
    body: JSON.stringify({ name: 'Sarah', reach: '559-555-0123', trade: 'Bakery', message: 'Hi Adam' }),
  }), {
    env: { LEAD_ALERT_WEBHOOK_URL: 'https://ntfy.sh/test-topic' },
    fetch: async (url, init) => {
      contactWebhookHit = { url: String(url), body: init?.body, headers: init?.headers };
      return new Response('ok', { status: 200 });
    },
  });
  assert.equal(cRes.status, 200, 'Expected 200 when webhook succeeds');
  assert.ok(contactWebhookHit, 'Expected webhook fetch to be invoked');
  assert.ok(String(contactWebhookHit.body).includes('Sarah'), 'Expected name in contact webhook body');
  assert.ok(String(contactWebhookHit.body).includes('559-555-0123'), 'Expected reach in contact webhook body');

  // 7. Success: 200 when webhook succeeds (generic JSON webhook)
  contactWebhookHit = null;
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-7' },
    body: JSON.stringify({ name: 'Sarah', reach: 'sarah@example.com', message: 'Hi Adam' }),
  }), {
    env: { LEAD_ALERT_WEBHOOK_URL: 'https://discord.com/api/webhooks/test' },
    fetch: async (url, init) => {
      contactWebhookHit = { url: String(url), body: init?.body, headers: init?.headers };
      return new Response('ok', { status: 200 });
    },
  });
  assert.equal(cRes.status, 200, 'Expected 200 for generic JSON webhook');
  assert.ok(contactWebhookHit, 'Expected generic webhook fetch to be invoked');
  const parsedPayload = JSON.parse(contactWebhookHit.body);
  assert.equal(parsedPayload.name, 'Sarah');
  assert.equal(parsedPayload.reach, 'sarah@example.com');

  // 8. Body type validation: literal null and non-object payloads return 400 without crashing
  cRes = await contactHandler(new Request('http://test/api/contact/', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8a' }, body: 'null' }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 for JSON literal null body');

  cRes = await contactHandler(new Request('http://test/api/contact/', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8b' }, body: '[]' }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 for JSON array body');

  cRes = await contactHandler(new Request('http://test/api/contact/', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8c' }, body: '"plain string"' }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 for JSON primitive string body');

  let geminiNullRes = await handler(new Request('http://test/api/ask-gemini', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8d' }, body: 'null' }), { env: {} });
  assert.equal(geminiNullRes.status, 400, 'Expected 400 for JSON literal null body on ask-gemini');

  // 9. Non-ASCII in ntfy header: sanitized to ASCII without throwing ByteString TypeError
  contactWebhookHit = null;
  cRes = await contactHandler(new Request('http://test/api/contact/', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-9' },
    body: JSON.stringify({ name: '🌮 Taco Shop — Best in Clovis', reach: '559-555-0199', message: 'Taco catering inquiry' }),
  }), {
    env: { LEAD_ALERT_WEBHOOK_URL: 'https://ntfy.sh/test-topic' },
    fetch: async (url, init) => {
      // Directly test that headers satisfy WebIDL ByteString (Node Headers will throw if character code > 255)
      const h = new Headers(init?.headers);
      contactWebhookHit = { url: String(url), body: init?.body, headers: Object.fromEntries(h.entries()) };
      return new Response('ok', { status: 200 });
    },
  });
  assert.equal(cRes.status, 200, 'Expected 200 when lead name contains emojis and Unicode');
  assert.ok(contactWebhookHit, 'Expected webhook fetch to be invoked');
  assert.ok(contactWebhookHit.headers.title, 'Expected title header in ntfy webhook');
  assert.ok(!/[^\x20-\x7E]/.test(contactWebhookHit.headers.title), 'Expected ASCII-only Title header for ntfy');
  assert.ok(contactWebhookHit.headers.title.includes('Taco Shop'), 'Expected sanitized business name in title');
  assert.ok(String(contactWebhookHit.body).includes('🌮 Taco Shop — Best in Clovis'), 'Expected full unicode preserved in webhook body');
}

console.log('Contact API endpoint & fail-closed routing: 9 cases ✓');

// Verify personalized outreach audit link generator and sitemap/robots discovery files.
import fs from 'node:fs';
import { buildAuditUrl, buildOutreachCopy } from '../scripts/outreach-links.mjs';

const auditUrl = buildAuditUrl('Olsen Roofing', 'roofer', 'Clovis, CA');
assert.equal(auditUrl, 'https://cloviswebdesign.com/?biz=Olsen+Roofing&trade=roofer&city=Clovis%2C+CA&autorun=1#check');

const rivalCopy = buildOutreachCopy('Valley Roofing', 'roofer', 'Clovis, CA', 'Olsen Roofing and Cen-Cal Roofing');
assert.ok(rivalCopy.sms.includes('Olsen Roofing and Cen-Cal Roofing instead of Valley Roofing'));
assert.ok(rivalCopy.emailSubject.includes('Olsen Roofing and Cen-Cal Roofing'));

const robots = fs.readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
assert.ok(robots.includes('Sitemap: https://cloviswebdesign.com/sitemap.xml'));
for (const bot of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended']) {
  assert.ok(robots.includes(`User-agent: ${bot}`), `Expected User-agent: ${bot} in robots.txt`);
}

const sitemap = fs.readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
for (const canonical of [
  'https://cloviswebdesign.com/',
  'https://cloviswebdesign.com/services/',
  'https://cloviswebdesign.com/packages/',
  'https://cloviswebdesign.com/services/medical-web-design/',
  'https://cloviswebdesign.com/services/contractor-websites/',
  'https://cloviswebdesign.com/services/local-seo-fresno/',
  'https://cloviswebdesign.com/case-studies/dumpster-rental-fresno/',
  'https://cloviswebdesign.com/case-studies/kidney-specialist-fresno/',
]) {
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `Missing ${canonical} in sitemap.xml`);
}
assert.ok(!sitemap.includes('/services/web-design-clovis/'), 'Retired route must not appear in sitemap.xml');

// Public llms.txt, llms-full.txt & ai-catalog.json discoverability verification
import os from 'node:os';
import path from 'node:path';
import {
  CANONICAL_URLS as DISCOVERY_URLS,
  buildLlmsTxt,
  buildLlmsFullTxt,
  buildSitemapXml,
  buildAiCatalog,
  syncDiscoveryManifests,
} from '../src/lib/discovery.ts';

const norm = (s) => s.replace(/\r\n/g, '\n').trim();
const llmsTxt = fs.readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8');
assert.equal(norm(llmsTxt), norm(buildLlmsTxt()), 'public/llms.txt must match buildLlmsTxt() from src/lib/discovery.ts');
assert.ok(llmsTxt.includes('# Clovis Web Design'));
assert.ok(llmsTxt.includes('Brand Positioning & Conversion Copy'));
assert.ok(llmsTxt.includes('Custom Web Design & Engineering'));
assert.ok(llmsTxt.includes('Search Engine & Google Maps SEO'));
assert.ok(llmsTxt.includes('AI Search & Answer Optimization'));
assert.ok(llmsTxt.includes('AI & Search Lead Attribution'));
assert.ok(llmsTxt.includes('Custom Website Build'));
assert.ok(llmsTxt.includes('Search & AI Visibility Setup'));
assert.ok(llmsTxt.includes('Ongoing Search & AI Growth'));
assert.ok(llmsTxt.includes('/case-studies/dumpster-rental-fresno/'));
assert.ok(llmsTxt.includes('/case-studies/kidney-specialist-fresno/'));
assert.ok(llmsTxt.includes('(559) 628-0142'));
assert.ok(!/youssef/i.test(llmsTxt), 'llms.txt must never contain Adam\'s last name');
assert.ok(!/\bundefined\b|\bNaN\b/i.test(llmsTxt), 'llms.txt must never contain uninterpolated undefined/NaN values');
assert.ok(llmsTxt.includes('Fresno & Clovis, CA'), 'llms.txt must include Big Bros case study location');
assert.ok(llmsTxt.includes('Dr. Sheikh Mohammad Masood, MD'), 'llms.txt must include Dr. Masood attribution');

const llmsFullTxt = fs.readFileSync(new URL('../public/llms-full.txt', import.meta.url), 'utf8');
assert.equal(norm(llmsFullTxt), norm(buildLlmsFullTxt()), 'public/llms-full.txt must match buildLlmsFullTxt() from src/lib/discovery.ts');
assert.ok(llmsFullTxt.includes('# Clovis Web Design'));
assert.ok(llmsFullTxt.includes('## 3. Five Lifecycle Services'), 'llms-full.txt must reflect all 5 Lifecycle Pillars');
assert.ok(llmsFullTxt.includes('Brand Positioning & Conversion Copy'));
assert.ok(!/youssef/i.test(llmsFullTxt), 'llms-full.txt must never contain Adam\'s last name');
assert.ok(!/\bundefined\b|\bNaN\b/i.test(llmsFullTxt), 'llms-full.txt must never contain uninterpolated undefined/NaN values');
assert.ok(llmsFullTxt.includes('Dr. Sheikh Mohammad Masood, MD'), 'llms-full.txt must include Dr. Masood attribution');

assert.equal(norm(sitemap), norm(buildSitemapXml()), 'public/sitemap.xml must match buildSitemapXml() from src/lib/discovery.ts');

const aiCatalogRaw = fs.readFileSync(new URL('../public/.well-known/ai-catalog.json', import.meta.url), 'utf8');
assert.equal(norm(aiCatalogRaw), norm(JSON.stringify(buildAiCatalog(), null, 2)), 'public/.well-known/ai-catalog.json must match buildAiCatalog()');
const aiCatalog = JSON.parse(aiCatalogRaw);
assert.equal(aiCatalog.$schema, 'https://json.schemastore.org/ard-schema.json');
assert.equal(aiCatalog.resources.length, DISCOVERY_URLS.length);
assert.ok(aiCatalog.tools.every((t) => t.endpoint.endsWith('/')), 'All ai-catalog.json tool endpoints must end with a trailing slash');
assert.ok(!aiCatalogRaw.includes('four core services'), 'ai-catalog.json must not reference outdated "four core services"');
assert.ok(!/youssef/i.test(aiCatalogRaw), 'ai-catalog.json must never contain Adam\'s last name');

// Non-mutating test of syncDiscoveryManifests against an OS temporary directory
{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cwd-discovery-'));
  try {
    syncDiscoveryManifests(tmpDir);
    assert.equal(norm(fs.readFileSync(path.join(tmpDir, 'llms.txt'), 'utf8')), norm(buildLlmsTxt()));
    assert.equal(norm(fs.readFileSync(path.join(tmpDir, 'llms-full.txt'), 'utf8')), norm(buildLlmsFullTxt()));
    assert.equal(norm(fs.readFileSync(path.join(tmpDir, 'sitemap.xml'), 'utf8')), norm(buildSitemapXml()));
    assert.equal(
      norm(fs.readFileSync(path.join(tmpDir, '.well-known', 'ai-catalog.json'), 'utf8')),
      norm(JSON.stringify(buildAiCatalog(), null, 2))
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

const rootLayout = fs.readFileSync(new URL('../src/layouts/RootLayout.astro', import.meta.url), 'utf8');
assert.ok(rootLayout.includes('/_vercel/insights/script.js'), 'Expected Vercel Web Analytics script in RootLayout.astro');
assert.ok(rootLayout.includes('google-site-verification'), 'Expected Google Search Console verification tag in RootLayout.astro');
assert.ok(rootLayout.includes('rel="ai-catalog"'), 'Expected <link rel="ai-catalog"> in RootLayout.astro');
assert.ok(rootLayout.includes('rel="describedby" href="/llms.txt"'), 'Expected llms.txt v2 <link rel="describedby" href="/llms.txt"> in RootLayout.astro');
assert.ok(rootLayout.includes('INLINE_ANALYTICS_SCRIPT'), 'Expected RootLayout.astro to inline INLINE_ANALYTICS_SCRIPT from outreach-analytics.ts');

import {
  INLINE_ANALYTICS_SCRIPT,
  buildAuditUrl as buildCanonicalAuditUrl,
  initClientAnalytics,
  parseAuditSearch,
} from '../src/lib/outreach-analytics.ts';

assert.equal(buildCanonicalAuditUrl('Olsen Roofing', 'roofer', 'Clovis, CA'), auditUrl);
const parsedOutreach = parseAuditSearch('?biz=Olsen+Roofing&trade=roofer&city=Clovis%2C+CA&autorun=1', '#check');
assert.equal(parsedOutreach.biz, 'Olsen Roofing');
assert.equal(parsedOutreach.trade, 'roofer');
assert.equal(parsedOutreach.city, 'Clovis, CA');
assert.equal(parsedOutreach.autorun, true);
assert.equal(parsedOutreach.isOutreach, true);
assert.equal(parsedOutreach.shouldAutorun, true);

for (const eventName of ['lead_call_click', 'lead_sms_click', 'lead_email_click', 'ai_referrer_visit', 'outreach_link_open', 'ai_audit_run', 'ai_citation_view']) {
  assert.ok(INLINE_ANALYTICS_SCRIPT.includes(eventName), `INLINE_ANALYTICS_SCRIPT must contain event tracker for ${eventName}`);
}

const contactSrc = fs.readFileSync(new URL('../src/components/Contact.tsx', import.meta.url), 'utf8');
assert.ok(!contactSrc.includes('No tracking pixels on this page'), 'Footer in Contact.tsx must not contain "No tracking pixels on this page"');
assert.ok(contactSrc.includes('Built in Clovis, CA · Serving Fresno'), 'Footer in Contact.tsx must contain location attribution');
assert.ok(contactSrc.includes('toolname: "contact_adam"'), 'Contact.tsx must include WebMCP toolname attribute');

const medicalSrc = fs.readFileSync(new URL('../src/pages/services/medical-web-design.astro', import.meta.url), 'utf8');
assert.ok(!medicalSrc.includes('No ad-tracking pixels'), 'medical-web-design.astro must not contain "No ad-tracking pixels"');
assert.ok(medicalSrc.includes('Privacy-safe call &amp; referral tracking') || medicalSrc.includes('Privacy-safe call & referral tracking'), 'medical-web-design.astro must contain "Privacy-safe call & referral tracking"');
assert.ok(medicalSrc.includes("offers: [offer('Custom Website Build'), offer('Search & AI Visibility Setup')]"), 'Expected offers in medical-web-design.astro schema');
assert.ok(medicalSrc.includes('/case-studies/kidney-specialist-fresno/'), 'medical-web-design.astro must link to Kidney Specialist case study');

const localSeoSrc = fs.readFileSync(new URL('../src/pages/services/local-seo-fresno.astro', import.meta.url), 'utf8');
assert.ok(localSeoSrc.includes('<LeadLeakAudit client:visible />'), 'local-seo-fresno.astro must embed LeadLeakAudit');
assert.ok(localSeoSrc.includes('Foundational setup vs. ongoing monthly growth'), 'local-seo-fresno.astro must explain foundational vs growth');
assert.ok(localSeoSrc.includes('Why AI and Google pick different businesses'), 'local-seo-fresno.astro must explain why AI and Google pick different businesses');
assert.ok(localSeoSrc.includes('/case-studies/dumpster-rental-fresno/'), 'local-seo-fresno.astro must link to Big Bros case study');

const auditSrc = fs.readFileSync(new URL('../src/components/LeadLeakAudit.tsx', import.meta.url), 'utf8');
assert.ok(auditSrc.includes('ai_audit_run'), 'LeadLeakAudit.tsx must dispatch ai_audit_run');
assert.ok(auditSrc.includes('toolname: "audit_ai_visibility"'), 'LeadLeakAudit.tsx must include WebMCP toolname attribute');

// Behavioral unit test for client analytics module through its public interface (no regex scraping)
{
  const dispatchedEvents = [];
  const mockStorage = new Map();
  const mockSessionStorage = {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
  };

  const listeners = {};
  const mockWindow = {
    addEventListener: (type, cb) => { listeners[type] = cb; },
    location: { search: '?biz=Acme+Roofing&trade=roofer&city=Clovis,+CA', hash: '#check' },
    va: (action, payload) => { dispatchedEvents.push({ provider: 'va', action, payload }); },
    gtag: (action, name, payload) => { dispatchedEvents.push({ provider: 'gtag', action, name, payload }); },
  };

  const docListeners = {};
  const mockDoc = {
    addEventListener: (type, cb) => { docListeners[type] = cb; },
    referrer: 'https://chatgpt.com/',
  };

  initClientAnalytics({ window: mockWindow, document: mockDoc, sessionStorage: mockSessionStorage });

  // Check outreach_link_open was tracked
  const outreachEvt = dispatchedEvents.find(e => e.payload?.name === 'outreach_link_open');
  assert.ok(outreachEvt, 'Expected outreach_link_open event to be dispatched');
  assert.equal(outreachEvt.payload.biz, 'Acme Roofing');
  assert.equal(mockSessionStorage.getItem('cw_outreach_Acme Roofing_roofer'), '1');

  // Check ai_referrer_visit was tracked
  const aiRefEvt = dispatchedEvents.find(e => e.payload?.name === 'ai_referrer_visit');
  assert.ok(aiRefEvt, 'Expected ai_referrer_visit event to be dispatched');
  assert.equal(aiRefEvt.payload.engine, 'chatgpt.com');
  assert.equal(mockSessionStorage.getItem('cw_ai_ref_tracked'), 'chatgpt.com');

  // Check click delegation on tel:, sms:, mailto:
  assert.ok(docListeners.click, 'Expected click listener registered on document');

  // Simulate tel click
  docListeners.click({
    target: {
      closest: (sel) => sel === 'a' ? { href: 'tel:+15596280142', getAttribute: () => 'tel:+15596280142', textContent: 'Call (559) 628-0142' } : null
    }
  });
  const callEvt = dispatchedEvents.find(e => e.payload?.name === 'lead_call_click');
  assert.ok(callEvt, 'Expected lead_call_click event to be dispatched');
  assert.equal(callEvt.payload.href, undefined, 'lead_call_click must not include raw href');

  // Simulate sms click
  docListeners.click({
    target: {
      closest: (sel) => sel === 'a' ? { href: 'sms:+15596280142?body=test', getAttribute: () => 'sms:+15596280142?body=test', textContent: 'Text Adam' } : null
    }
  });
  const smsEvt = dispatchedEvents.find(e => e.payload?.name === 'lead_sms_click');
  assert.ok(smsEvt, 'Expected lead_sms_click event to be dispatched');
  assert.equal(smsEvt.payload.href, undefined, 'lead_sms_click must not leak drafted SMS body in href');

  // Simulate mailto click
  docListeners.click({
    target: {
      closest: (sel) => sel === 'a' ? { href: 'mailto:adam@cloviswebdesign.com', getAttribute: () => 'mailto:adam@cloviswebdesign.com', textContent: 'Email' } : null
    }
  });
  const emailEvt = dispatchedEvents.find(e => e.payload?.name === 'lead_email_click');
  assert.ok(emailEvt, 'Expected lead_email_click event to be dispatched');
  assert.equal(emailEvt.payload.href, undefined, 'lead_email_click must not leak drafted email body in href');

  // Simulate custom event ai_audit_run
  assert.ok(listeners.ai_audit_run, 'Expected ai_audit_run listener on window');
  listeners.ai_audit_run({ detail: { business: 'Test Co', trade: 'plumber', city: 'Clovis, CA', source: 'organic' } });
  const auditEvt = dispatchedEvents.find(e => e.payload?.name === 'ai_audit_run');
  assert.ok(auditEvt, 'Expected ai_audit_run event to be dispatched');
  assert.equal(auditEvt.payload.business, 'Test Co');

  // Verify sessionStorage deduplication: re-running does NOT fire duplicate events
  const countBefore = dispatchedEvents.length;
  initClientAnalytics({ window: mockWindow, document: mockDoc, sessionStorage: mockSessionStorage });
  const countAfter = dispatchedEvents.length;
  assert.equal(countAfter, countBefore, 'SessionStorage must guard against duplicate outreach and AI referrer events');

  // Verify Layer 2 UTM fallback when document.referrer is stripped (e.g. mobile webview or rel="noreferrer")
  // and Layer 3 scroll-to-text fragment (#:~:text=) deep-citation listener
  const utmEvents = [];
  const utmStorage = new Map();
  initClientAnalytics({
    window: {
      addEventListener: () => {},
      location: {
        search: '?utm_source=chatgpt.com',
        hash: '',
        pathname: '/services/local-seo-fresno/',
        href: 'https://cloviswebdesign.com/services/local-seo-fresno/?utm_source=chatgpt.com#:~:text=Four-Directory%20Profile%20Alignment',
      },
      va: (action, payload) => { utmEvents.push(payload); },
    },
    document: {
      addEventListener: () => {},
      referrer: '',
    },
    sessionStorage: {
      getItem: (k) => utmStorage.get(k) || null,
      setItem: (k, v) => utmStorage.set(k, String(v)),
    },
  });
  const utmRefEvt = utmEvents.find(e => e?.name === 'ai_referrer_visit');
  assert.ok(utmRefEvt, 'Expected ai_referrer_visit from utm_source=chatgpt.com even when document.referrer is empty');
  assert.equal(utmRefEvt.engine, 'chatgpt.com');
  assert.equal(utmRefEvt.referrer, 'utm:chatgpt.com');

  const citationEvt = utmEvents.find(e => e?.name === 'ai_citation_view');
  assert.ok(citationEvt, 'Expected ai_citation_view from #:~:text= scroll-to-text fragment');
  assert.equal(citationEvt.citation_text_snippet, 'Four-Directory Profile Alignment');
  assert.equal(citationEvt.page_location, '/services/local-seo-fresno/');
  console.log('Conversion and AI Referrer Tracking behavioral unit tests: 8 cases ✓');
}

import { CANONICAL_URLS, pingIndexNow } from '../scripts/ping-search-engines.mjs';
let indexNowPayload = null;
const pingRes = await pingIndexNow(async (url, init) => {
  indexNowPayload = JSON.parse(init.body);
  return new Response('', { status: 202 });
});
assert.equal(pingRes.ok, true);
assert.deepEqual(indexNowPayload.urlList, CANONICAL_URLS);
console.log('Outreach URLs, Analytics & SEO discovery files: 5 cases ✓');

// Verify Requirement R3: 4 Core Services, 3 Scoped Engagement Models & Side-by-Side Compare Table
import { services, plans, hasOfferCatalog } from '../src/lib/data.ts';

// 1. Services integrity (4 Core Services + Why Each Matters)
assert.equal(services.length, 5, 'Expected 5 lifecycle agency services');
for (const s of services) {
  assert.ok(s.title && s.title.length > 5, 'Service must have a title');
  assert.ok(s.what && s.what.length > 20, `${s.title} must explain what it is`);
  assert.ok(s.whyItMatters && s.whyItMatters.length > 20, `${s.title} must explain why it matters`);
}

// 2. Scoped Engagement Models integrity
assert.equal(plans.length, 3, 'Expected exactly 3 scoped engagement models');
assert.equal(plans[0].name, 'Custom Website Build');
assert.equal(plans[1].name, 'Search & AI Visibility Setup');
assert.equal(plans[2].name, 'Ongoing Search & AI Growth');
for (const p of plans) {
  assert.equal(p.not.length, 0, `${p.name} must have zero negative bullets`);
  assert.ok(p.items.length >= 5, `${p.name} must list at least 5 deliverables`);
}

// 3. Offer Catalog schema matches visible engagement models
assert.equal(hasOfferCatalog.itemListElement.length, 3);
for (const p of plans) {
  const matchedOffer = hasOfferCatalog.itemListElement.find(o => o.name === p.name);
  assert.ok(matchedOffer, `Expected ${p.name} in hasOfferCatalog`);
}

// 4. Chrome.tsx breakpoint verification
const chromeSrc = fs.readFileSync(new URL('../src/components/Chrome.tsx', import.meta.url), 'utf8');
assert.ok(chromeSrc.includes('lg:flex'), 'Chrome.tsx must contain lg:flex for desktop nav');
assert.ok(chromeSrc.includes('lg:hidden'), 'Chrome.tsx must contain lg:hidden for hamburger menu');

// 5. Season.tsx / #compare side-by-side static table verification
const seasonSrc = fs.readFileSync(new URL('../src/components/Season.tsx', import.meta.url), 'utf8');
assert.ok(seasonSrc.includes('<table'), 'Season.tsx must render semantic table in #compare');
assert.ok(seasonSrc.includes('Typical agency'), 'Season.tsx #compare must contain "Typical agency"');
assert.ok(seasonSrc.includes('With me'), 'Season.tsx #compare must contain "With me"');
assert.ok(!seasonSrc.includes('text-ink/60'), 'Season.tsx must not use text-ink/60 (must use text-ink-soft)');

// 6. Check dist/index.html if built
const distIndexPath = new URL('../dist/index.html', import.meta.url);
if (fs.existsSync(distIndexPath)) {
  const distHtml = fs.readFileSync(distIndexPath, 'utf8');
  assert.ok(distHtml.includes('Typical agency'), 'dist/index.html must render "Typical agency"');
  assert.ok(distHtml.includes('With me'), 'dist/index.html must render "With me"');
  assert.ok(distHtml.includes('Why it matters:'), 'dist/index.html must explain "Why it matters:" for each service');
  assert.ok(distHtml.includes('Custom Website Build'), 'dist/index.html must render "Custom Website Build"');
  assert.ok(distHtml.includes('Search &amp; AI Visibility Setup') || distHtml.includes('Search & AI Visibility Setup'), 'dist/index.html must render "Search & AI Visibility Setup"');
  assert.ok(distHtml.includes('Ongoing Search &amp; AI Growth') || distHtml.includes('Ongoing Search & AI Growth'), 'dist/index.html must render "Ongoing Search & AI Growth"');
}

console.log('Requirement R3 (4 Core Services, 3 Scoped Engagement Models, Compare Table & Navigation): 6 suites ✓');

// Verify Requirement R4: Case Studies, Schema/GEO, Service Pages & llms.txt
import { business, cases } from '../src/lib/data.ts';

// 1. Business Schema GEO & Google Business Profile linking
assert.equal(business.hasMap, 'https://maps.google.com/?cid=5133720235419656762');
assert.deepEqual(business.sameAs, ['https://maps.google.com/?cid=5133720235419656762']);

// 2. Cases caseStudyPath
assert.equal(cases[0].caseStudyPath, '/case-studies/kidney-specialist-fresno/');
assert.equal(cases[1].caseStudyPath, '/case-studies/dumpster-rental-fresno/');

// 3. Harvest.tsx links to case study pages
const harvestSrc = fs.readFileSync(new URL('../src/components/Harvest.tsx', import.meta.url), 'utf8');
assert.ok(harvestSrc.includes('c.caseStudyPath'), 'Harvest.tsx must link to c.caseStudyPath');
assert.ok(harvestSrc.includes('Read full case study →'), 'Harvest.tsx must render "Read full case study →"');

// Verify consolidated document reveal observer seam (zero useGlobalReveal across components)
import * as hooksMod from '../src/lib/hooks.ts';
assert.equal(typeof hooksMod.initDocumentReveal, 'function', 'Expected initDocumentReveal exported from src/lib/hooks.ts');
assert.equal(hooksMod.useGlobalReveal, undefined, 'useGlobalReveal should be deleted after consolidating reveal into RootLayout');
{
  const observedEls = [];
  let mutationCallback = null;

  const makeEl = (top, inSsrIsland = false) => {
    const attrs = new Map();
    return {
      getBoundingClientRect: () => ({ top }),
      setAttribute: (k, v) => attrs.set(k, v),
      hasAttribute: (k) => attrs.has(k),
      closest: (sel) => (sel === 'astro-island[ssr]' && inSsrIsland ? {} : null),
    };
  };

  const aboveFoldStatic = makeEl(120, false);
  const belowFoldStatic = makeEl(1200, false);
  const insideSsrIsland = makeEl(200, true);
  let islandHydrated = false;
  const hydratedIslandChild = {
    getBoundingClientRect: () => ({ top: 200 }),
    attrs: new Map(),
    setAttribute(k, v) { this.attrs.set(k, v); },
    hasAttribute(k) { return this.attrs.has(k); },
    closest: (sel) => (sel === 'astro-island[ssr]' && !islandHydrated ? {} : null),
  };

  class FakeIntersectionObserver {
    observe(el) { observedEls.push(el); }
    unobserve() {}
    disconnect() {}
  }

  class FakeMutationObserver {
    constructor(cb) { mutationCallback = cb; }
    observe() {}
    disconnect() {}
  }

  const revealDocListeners = {};
  hooksMod.initDocumentReveal({
    innerHeight: 800,
    document: {
      documentElement: {},
      querySelectorAll: () => [aboveFoldStatic, belowFoldStatic, insideSsrIsland],
      addEventListener: (type, cb, capture) => { revealDocListeners[`${type}:${Boolean(capture)}`] = cb; },
    },
    IntersectionObserver: FakeIntersectionObserver,
    MutationObserver: FakeMutationObserver,
  });

  // Verify :user-invalid to aria-invalid="true" synchronization on capture-phase blur/input
  assert.equal(typeof revealDocListeners['blur:true'], 'function', 'Expected capture-phase blur listener');
  assert.equal(typeof revealDocListeners['input:true'], 'function', 'Expected capture-phase input listener');
  let isUserInvalid = true;
  const fakeFieldAttrs = new Map();
  const fakeField = {
    matches: (sel) => sel === 'input, textarea, select' ? true : sel === ':user-invalid' ? isUserInvalid : false,
    setAttribute: (k, v) => fakeFieldAttrs.set(k, v),
    getAttribute: (k) => fakeFieldAttrs.get(k) ?? null,
    removeAttribute: (k) => fakeFieldAttrs.delete(k),
  };
  revealDocListeners['blur:true']({ target: fakeField });
  assert.equal(fakeField.getAttribute('aria-invalid'), 'true', 'Field matching :user-invalid on blur must receive aria-invalid="true"');
  isUserInvalid = false;
  revealDocListeners['input:true']({ target: fakeField });
  assert.equal(fakeField.getAttribute('aria-invalid'), null, 'Field no longer matching :user-invalid on input must have aria-invalid removed');

  assert.equal(aboveFoldStatic.hasAttribute('data-in'), true, 'Above-the-fold static element should be stamped immediately');
  assert.equal(belowFoldStatic.hasAttribute('data-in'), false, 'Below-the-fold static element should wait for intersection');
  assert.equal(observedEls.includes(belowFoldStatic), true, 'Below-the-fold static element should be observed');
  assert.equal(insideSsrIsland.hasAttribute('data-in'), false, 'SSR island element must not be stamped before hydration');
  assert.equal(observedEls.includes(insideSsrIsland), false, 'SSR island element must not be observed before hydration');

  // Simulate Astro island finishing hydration (ssr attribute removed)
  islandHydrated = true;
  mutationCallback([{
    type: 'attributes',
    attributeName: 'ssr',
    target: {
      hasAttribute: (k) => k === 'ssr' ? false : false,
      querySelectorAll: () => [hydratedIslandChild],
    },
  }]);
  assert.equal(hydratedIslandChild.hasAttribute('data-in'), true, 'Hydrated island element above fold should be stamped upon ssr removal');
}

// 4. Static case study pages generation verification
for (const p of ['case-studies/dumpster-rental-fresno/index.html', 'case-studies/kidney-specialist-fresno/index.html']) {
  const csPath = new URL(`../dist/${p}`, import.meta.url);
  if (fs.existsSync(csPath)) {
    const csHtml = fs.readFileSync(csPath, 'utf8');
    assert.ok(csHtml.includes('aria-label="Breadcrumb"'), `${p} must include Breadcrumb nav`);
    assert.ok(csHtml.includes('"@type":"Article"') || csHtml.includes('"@type": "Article"'), `${p} must include Article schema`);
    assert.ok(csHtml.includes('"@type":"BreadcrumbList"') || csHtml.includes('"@type": "BreadcrumbList"'), `${p} must include BreadcrumbList schema`);
    assert.ok(!/youssef/i.test(csHtml), `${p} must never contain Adam's last name`);
  }
}

console.log('Requirement R4 (Case Studies, Schema/GEO, Service Pages & llms.txt): 4 suites ✓');

// Verify browser-serialized inline scripts (and raw .ts function bodies before Node type-stripping)
// parse as valid standard JS, ai_audit_run deduplication, trailing-slash contact fetch, P2.1 voice/404, and P3 cleanup
import { modularChannels } from '../src/lib/data.ts';
{
  // 1. Browser-serialized inline scripts AND raw .ts source function bodies must parse cleanly via new Function()
  assert.doesNotThrow(() => new Function(INLINE_ANALYTICS_SCRIPT), 'INLINE_ANALYTICS_SCRIPT must be valid browser JS without interior TS syntax');
  assert.doesNotThrow(() => new Function(hooksMod.INLINE_REVEAL_SCRIPT), 'INLINE_REVEAL_SCRIPT must be valid browser JS without interior TS syntax');

  const analyticsRawTs = fs.readFileSync(new URL('../src/lib/outreach-analytics.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const hooksRawTs = fs.readFileSync(new URL('../src/lib/hooks.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  for (const [label, src, marker] of [
    ['parseAuditSearch', analyticsRawTs, 'export const parseAuditSearch'],
    ['initClientAnalytics', analyticsRawTs, 'export const initClientAnalytics'],
    ['initDocumentReveal', hooksRawTs, 'export const initDocumentReveal'],
  ]) {
    const startIdx = src.indexOf(marker);
    assert.ok(startIdx !== -1, `Missing ${marker} in source`);
    const fnStart = src.indexOf('= function', startIdx);
    const fnEnd = src.indexOf('\n};', fnStart);
    assert.ok(fnStart !== -1 && fnEnd !== -1, `Expected '= function ... \\n};' for ${label}`);
    const rawFnExpr = src.slice(fnStart + 2, fnEnd + 2).trim();
    assert.doesNotThrow(
      () => new Function(`return (${rawFnExpr});`),
      `Raw unstripped .ts source of ${label} must be valid standard JS with zero interior TypeScript syntax`
    );
  }

  // 2. LeadLeakAudit.tsx must dispatch CustomEvent("ai_audit_run") once without duplicate direct .va/.gtag calls
  assert.ok(auditSrc.includes('new CustomEvent("ai_audit_run"'), 'LeadLeakAudit.tsx must dispatch CustomEvent("ai_audit_run")');
  assert.ok(!auditSrc.includes('.va?.("event"'), 'LeadLeakAudit.tsx must not fire duplicate direct .va?.("event") call');
  assert.ok(!auditSrc.includes('.gtag?.("event"'), 'LeadLeakAudit.tsx must not fire duplicate direct .gtag?.("event") call');

  // 3. Contact.tsx must fetch /api/contact/ with a trailing slash to avoid 308 redirect under trailingSlash: 'always'
  const contactSrc = fs.readFileSync(new URL('../src/components/Contact.tsx', import.meta.url), 'utf8');
  assert.ok(contactSrc.includes('fetch("/api/contact/"'), 'Contact.tsx must POST to "/api/contact/" with a trailing slash');

  // 4. modularChannels in data.ts must hold 6 customizable growth channels and be imported by Story.tsx
  assert.equal(modularChannels.length, 6, 'Expected 6 customizable growth channels in modularChannels');
  const storySrc = fs.readFileSync(new URL('../src/components/Story.tsx', import.meta.url), 'utf8');
  assert.ok(storySrc.includes('modularChannels'), 'Story.tsx must import and render modularChannels from @/lib/data');

  // 5. P2.1 First-person voice & 404 recovery links
  const page404Src = fs.readFileSync(new URL('../src/pages/404.astro', import.meta.url), 'utf8');
  assert.ok(page404Src.includes('text me at (559) 628-0142'), '404.astro description must use first-person "text me"');
  assert.ok(!page404Src.includes('text Adam at'), '404.astro must not use third-person "text Adam"');
  assert.ok(page404Src.includes('href="/services/"'), '404.astro must include /services/ recovery card');
  assert.ok(page404Src.includes('href="/packages/"'), '404.astro must include /packages/ recovery card');
  assert.ok(page404Src.includes('Search, Google Maps &amp; AI Marketing'), '404.astro must use updated Search, Google Maps & AI Marketing label');

  const mobileBarSrc = fs.readFileSync(new URL('../src/components/MobileActionBar.astro', import.meta.url), 'utf8');
  assert.ok(mobileBarSrc.includes('aria-label="Call me"'), 'MobileActionBar.astro must use aria-label="Call me"');
  assert.ok(mobileBarSrc.includes('aria-label="Text me"'), 'MobileActionBar.astro must use aria-label="Text me"');
  assert.ok(!mobileBarSrc.includes('aria-label="Call Adam"') && !mobileBarSrc.includes('aria-label="Text Adam"'), 'MobileActionBar.astro must not use third-person aria-labels');
  assert.ok(mobileBarSrc.includes('closedby="any"'), 'MobileActionBar.astro <dialog> must declare closedby="any"');

  const indexCssSrc = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  assert.ok(indexCssSrc.includes('@view-transition'), 'src/index.css must enable cross-document @view-transition');
  assert.ok(indexCssSrc.includes('dialog::backdrop') && indexCssSrc.includes('overscroll-behavior: contain'), 'src/index.css must contain scroll-chaining under modal dialog');

  assert.ok(auditSrc.includes('AbortSignal.timeout(16_000)'), 'LeadLeakAudit.tsx must guard fetch with AbortSignal.timeout(16_000)');

  const heroSrc = fs.readFileSync(new URL('../src/components/Hero.tsx', import.meta.url), 'utf8');
  assert.ok(heroSrc.includes('Clovis, CA · Working directly with me'), 'Hero.tsx ClovisClock SSR fallback must use first-person "with me"');
  assert.ok(!heroSrc.includes('Working directly with Adam'), 'Hero.tsx must not use third-person "with Adam"');
  assert.ok(heroSrc.includes('fetchPriority={idx === 0 ? "high" : "low"}'), 'Hero.tsx must prioritize foreground showcase pane and deprioritize background pane');

  // 6. P3 Chrome.tsx dead exports, deleted files & package-lock sync
  assert.ok(!chromeSrc.includes('export function Marquee'), 'Chrome.tsx must not export unused Marquee');
  assert.ok(!chromeSrc.includes('export function SunCursor'), 'Chrome.tsx must not export unused SunCursor');
  assert.ok(!chromeSrc.includes('export function ChapterIndicator'), 'Chrome.tsx must not export unused ChapterIndicator');
  assert.ok(chromeSrc.includes('aria-current='), 'Chrome.tsx Nav must indicate current page with aria-current');

  for (const deletedRel of [
    '../src/components/index.ts',
    '../src/styles/global.css',
    '../src/utils/cn.ts',
    '../scripts/clean-legacy.mjs',
    '../scripts/build-and-verify-m1.mjs',
    '../public/images/bigbros.jpg',
    '../public/images/hands-craft.jpg',
    '../public/images/seedling.jpg',
    '../public/images/studio-still-life.jpg',
    '../public/images/valley-orchard.jpg',
    '../public/videos',
  ]) {
    assert.equal(fs.existsSync(new URL(deletedRel, import.meta.url)), false, `Expected legacy file/dir ${deletedRel} to be deleted`);
  }

  const pkgJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const pkgLock = JSON.parse(fs.readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  assert.deepEqual(
    Object.keys(pkgJson.dependencies).sort(),
    Object.keys(pkgLock.packages[''].dependencies).sort(),
    'package.json and package-lock.json root dependencies must be in sync'
  );
}
console.log('Inline script JS syntax, ai_audit_run deduplication, /api/contact/, P2.1 & P3 hygiene: 6 suites ✓');
