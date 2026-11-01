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
  let cRes = await contactHandler(new Request('http://test/api/contact', { method: 'GET', headers: { 'x-forwarded-for': 'ip-1' } }), { env: {} });
  assert.equal(cRes.status, 405, 'Expected 405 for GET on contact endpoint');

  // 2. Input validation (missing reach)
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-2' },
    body: JSON.stringify({ name: 'Sarah', message: 'Hi Adam, auto-drafted message without reach' }),
  }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 when reach (phone/email) is missing');

  // 3. Fail-closed: 503 when LEAD_ALERT_WEBHOOK_URL is unset
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-3' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }), { env: {} });
  assert.equal(cRes.status, 503, 'Expected 503 when LEAD_ALERT_WEBHOOK_URL is unset');

  // 4. Fail-closed: 503 when webhook fetch returns non-2xx
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-4' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }), {
    env: { LEAD_ALERT_WEBHOOK_URL: 'https://ntfy.sh/test-topic' },
    fetch: async () => new Response('error', { status: 500 }),
  });
  assert.equal(cRes.status, 503, 'Expected 503 when webhook returns 500');

  // 5. Fail-closed: 503 when webhook fetch throws
  cRes = await contactHandler(new Request('http://test/api/contact', {
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
  cRes = await contactHandler(new Request('http://test/api/contact', {
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
  cRes = await contactHandler(new Request('http://test/api/contact', {
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
  cRes = await contactHandler(new Request('http://test/api/contact', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8a' }, body: 'null' }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 for JSON literal null body');

  cRes = await contactHandler(new Request('http://test/api/contact', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8b' }, body: '[]' }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 for JSON array body');

  cRes = await contactHandler(new Request('http://test/api/contact', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8c' }, body: '"plain string"' }), { env: {} });
  assert.equal(cRes.status, 400, 'Expected 400 for JSON primitive string body');

  let geminiNullRes = await handler(new Request('http://test/api/ask-gemini', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8d' }, body: 'null' }), { env: {} });
  assert.equal(geminiNullRes.status, 400, 'Expected 400 for JSON literal null body on ask-gemini');

  // 9. Non-ASCII in ntfy header: sanitized to ASCII without throwing ByteString TypeError
  contactWebhookHit = null;
  cRes = await contactHandler(new Request('http://test/api/contact', {
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
import {
  CANONICAL_URLS as DISCOVERY_URLS,
  buildLlmsTxt,
  buildLlmsFullTxt,
  buildSitemapXml,
  buildAiCatalog,
  syncDiscoveryManifests,
} from '../src/lib/discovery.ts';

syncDiscoveryManifests();

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

const llmsFullTxt = fs.readFileSync(new URL('../public/llms-full.txt', import.meta.url), 'utf8');
assert.equal(norm(llmsFullTxt), norm(buildLlmsFullTxt()), 'public/llms-full.txt must match buildLlmsFullTxt() from src/lib/discovery.ts');
assert.ok(llmsFullTxt.includes('# Clovis Web Design'));
assert.ok(llmsFullTxt.includes('## 3. Five Lifecycle Services'), 'llms-full.txt must reflect all 5 Lifecycle Pillars');
assert.ok(llmsFullTxt.includes('Brand Positioning & Conversion Copy'));
assert.ok(!/youssef/i.test(llmsFullTxt), 'llms-full.txt must never contain Adam\'s last name');

assert.equal(norm(sitemap), norm(buildSitemapXml()), 'public/sitemap.xml must match buildSitemapXml() from src/lib/discovery.ts');

const aiCatalogRaw = fs.readFileSync(new URL('../public/.well-known/ai-catalog.json', import.meta.url), 'utf8');
assert.equal(norm(aiCatalogRaw), norm(JSON.stringify(buildAiCatalog(), null, 2)), 'public/.well-known/ai-catalog.json must match buildAiCatalog()');
const aiCatalog = JSON.parse(aiCatalogRaw);
assert.equal(aiCatalog.$schema, 'https://json.schemastore.org/ard-schema.json');
assert.equal(aiCatalog.resources.length, DISCOVERY_URLS.length);
assert.ok(!aiCatalogRaw.includes('four core services'), 'ai-catalog.json must not reference outdated "four core services"');
assert.ok(!/youssef/i.test(aiCatalogRaw), 'ai-catalog.json must never contain Adam\'s last name');

const rootLayout = fs.readFileSync(new URL('../src/layouts/RootLayout.astro', import.meta.url), 'utf8');
assert.ok(rootLayout.includes('/_vercel/insights/script.js'), 'Expected Vercel Web Analytics script in RootLayout.astro');
assert.ok(rootLayout.includes('google-site-verification'), 'Expected Google Search Console verification tag in RootLayout.astro');
assert.ok(rootLayout.includes('rel="ai-catalog"'), 'Expected <link rel="ai-catalog"> in RootLayout.astro');
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

for (const eventName of ['lead_call_click', 'lead_sms_click', 'lead_email_click', 'ai_referrer_visit', 'outreach_link_open', 'ai_audit_run']) {
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
  console.log('Conversion and AI Referrer Tracking behavioral unit tests: 6 cases ✓');
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

  hooksMod.initDocumentReveal({
    innerHeight: 800,
    document: {
      documentElement: {},
      querySelectorAll: () => [aboveFoldStatic, belowFoldStatic, insideSsrIsland],
    },
    IntersectionObserver: FakeIntersectionObserver,
    MutationObserver: FakeMutationObserver,
  });

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

