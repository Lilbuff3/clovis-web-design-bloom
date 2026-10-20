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

const realFetch = globalThis.fetch;
try {
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
  assert.ok(String(webhookHit.body).includes('[ORGANIC CHECK]'), 'Expected [ORGANIC CHECK] tag for organic check');

  // Verify outreach link lead attribution
  webhookHit = null;
  const askOutreach = (who) =>
    handler(new Request('http://test/api/ask-gemini', {
      method: 'POST',
      headers: { 'x-forwarded-for': who },
      body: JSON.stringify({ businessName: 'Olsen Roofing', trade: 'roofer', city: 'Clovis, CA', source: 'outreach' }),
    }));
  res = await askOutreach('webhook-outreach-check');
  assert.equal(res.status, 200);
  assert.ok(webhookHit, 'Expected LEAD_ALERT_WEBHOOK_URL to be called for outreach lead');
  assert.ok(String(webhookHit.body).includes('Olsen Roofing'), 'Expected outreach lead business name in webhook payload');
  assert.ok(String(webhookHit.body).includes('[OUTREACH LINK]'), 'Expected [OUTREACH LINK] tag for outreach');
  delete process.env.LEAD_ALERT_WEBHOOK_URL;
} finally {
  console.warn = realWarn;
  globalThis.fetch = realFetch;
}
console.log('Gemini retry & lead webhook: 4 cases ✓');

// Test contact endpoint: api/contact.ts
import contactHandler from '../api/contact.ts';

try {
  // 1. Method validation
  let cRes = await contactHandler(new Request('http://test/api/contact', { method: 'GET', headers: { 'x-forwarded-for': 'ip-1' } }));
  assert.equal(cRes.status, 405, 'Expected 405 for GET on contact endpoint');

  // 2. Input validation (missing reach)
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-2' },
    body: JSON.stringify({ name: 'Sarah', message: 'Hi Adam, auto-drafted message without reach' }),
  }));
  assert.equal(cRes.status, 400, 'Expected 400 when reach (phone/email) is missing');

  // 3. Fail-closed: 503 when LEAD_ALERT_WEBHOOK_URL is unset
  delete process.env.LEAD_ALERT_WEBHOOK_URL;
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-3' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }));
  assert.equal(cRes.status, 503, 'Expected 503 when LEAD_ALERT_WEBHOOK_URL is unset');

  // 4. Fail-closed: 503 when webhook fetch returns non-2xx
  process.env.LEAD_ALERT_WEBHOOK_URL = 'https://ntfy.sh/test-topic';
  globalThis.fetch = async () => new Response('error', { status: 500 });
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-4' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }));
  assert.equal(cRes.status, 503, 'Expected 503 when webhook returns 500');

  // 5. Fail-closed: 503 when webhook fetch throws
  globalThis.fetch = async () => { throw new Error('network down'); };
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-5' },
    body: JSON.stringify({ name: 'Bob', reach: '559-555-0100', message: 'Hello' }),
  }));
  assert.equal(cRes.status, 503, 'Expected 503 when webhook fetch throws');

  // 6. Success: 200 when webhook succeeds (ntfy)
  let contactWebhookHit = null;
  globalThis.fetch = async (url, init) => {
    contactWebhookHit = { url: String(url), body: init?.body, headers: init?.headers };
    return new Response('ok', { status: 200 });
  };
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-6' },
    body: JSON.stringify({ name: 'Sarah', reach: '559-555-0123', trade: 'Bakery', message: 'Hi Adam' }),
  }));
  assert.equal(cRes.status, 200, 'Expected 200 when webhook succeeds');
  assert.ok(contactWebhookHit, 'Expected webhook fetch to be invoked');
  assert.ok(String(contactWebhookHit.body).includes('Sarah'), 'Expected name in contact webhook body');
  assert.ok(String(contactWebhookHit.body).includes('559-555-0123'), 'Expected reach in contact webhook body');

  // 7. Success: 200 when webhook succeeds (generic JSON webhook)
  process.env.LEAD_ALERT_WEBHOOK_URL = 'https://discord.com/api/webhooks/test';
  contactWebhookHit = null;
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-7' },
    body: JSON.stringify({ name: 'Sarah', reach: 'sarah@example.com', message: 'Hi Adam' }),
  }));
  assert.equal(cRes.status, 200, 'Expected 200 for generic JSON webhook');
  assert.ok(contactWebhookHit, 'Expected generic webhook fetch to be invoked');
  const parsedPayload = JSON.parse(contactWebhookHit.body);
  assert.equal(parsedPayload.name, 'Sarah');
  assert.equal(parsedPayload.reach, 'sarah@example.com');
  delete process.env.LEAD_ALERT_WEBHOOK_URL;

  // 8. Body type validation: literal null and non-object payloads return 400 without crashing
  cRes = await contactHandler(new Request('http://test/api/contact', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8a' }, body: 'null' }));
  assert.equal(cRes.status, 400, 'Expected 400 for JSON literal null body');

  cRes = await contactHandler(new Request('http://test/api/contact', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8b' }, body: '[]' }));
  assert.equal(cRes.status, 400, 'Expected 400 for JSON array body');

  cRes = await contactHandler(new Request('http://test/api/contact', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8c' }, body: '"plain string"' }));
  assert.equal(cRes.status, 400, 'Expected 400 for JSON primitive string body');

  let geminiNullRes = await handler(new Request('http://test/api/ask-gemini', { method: 'POST', headers: { 'x-forwarded-for': 'ip-8d' }, body: 'null' }));
  assert.equal(geminiNullRes.status, 400, 'Expected 400 for JSON literal null body on ask-gemini');

  // 9. Non-ASCII in ntfy header: sanitized to ASCII without throwing ByteString TypeError
  process.env.LEAD_ALERT_WEBHOOK_URL = 'https://ntfy.sh/test-topic';
  contactWebhookHit = null;
  globalThis.fetch = async (url, init) => {
    // Directly test that headers satisfy WebIDL ByteString (Node Headers will throw if character code > 255)
    const h = new Headers(init?.headers);
    contactWebhookHit = { url: String(url), body: init?.body, headers: Object.fromEntries(h.entries()) };
    return new Response('ok', { status: 200 });
  };
  cRes = await contactHandler(new Request('http://test/api/contact', {
    method: 'POST',
    headers: { 'x-forwarded-for': 'ip-9' },
    body: JSON.stringify({ name: '🌮 Taco Shop — Best in Clovis', reach: '559-555-0199', message: 'Taco catering inquiry' }),
  }));
  assert.equal(cRes.status, 200, 'Expected 200 when lead name contains emojis and Unicode');
  assert.ok(contactWebhookHit, 'Expected webhook fetch to be invoked');
  assert.ok(contactWebhookHit.headers.title, 'Expected title header in ntfy webhook');
  assert.ok(!/[^\x20-\x7E]/.test(contactWebhookHit.headers.title), 'Expected ASCII-only Title header for ntfy');
  assert.ok(contactWebhookHit.headers.title.includes('Taco Shop'), 'Expected sanitized business name in title');
  assert.ok(String(contactWebhookHit.body).includes('🌮 Taco Shop — Best in Clovis'), 'Expected full unicode preserved in webhook body');
  delete process.env.LEAD_ALERT_WEBHOOK_URL;
} finally {
  globalThis.fetch = realFetch;
  delete process.env.LEAD_ALERT_WEBHOOK_URL;
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

// Public llms.txt discoverability verification
const llmsTxt = fs.readFileSync(new URL('../public/llms.txt', import.meta.url), 'utf8');
assert.ok(llmsTxt.includes('# Clovis Web Design'));
assert.ok(llmsTxt.includes('Starter ($1,500)'));
assert.ok(llmsTxt.includes('Growth ($2,500)'));
assert.ok(llmsTxt.includes('Flagship (From $3,500)'));
assert.ok(llmsTxt.includes('Care Plan ($99/mo)'));
assert.ok(llmsTxt.includes('Care Plus ($249/mo)'));
assert.ok(llmsTxt.includes('/case-studies/dumpster-rental-fresno/'));
assert.ok(llmsTxt.includes('/case-studies/kidney-specialist-fresno/'));
assert.ok(llmsTxt.includes('(559) 628-0142'));
assert.ok(!/youssef/i.test(llmsTxt), 'llms.txt must never contain Adam\'s last name');

const rootLayout = fs.readFileSync(new URL('../src/layouts/RootLayout.astro', import.meta.url), 'utf8');
assert.ok(rootLayout.includes('/_vercel/insights/script.js'), 'Expected Vercel Web Analytics script in RootLayout.astro');
assert.ok(rootLayout.includes('google-site-verification'), 'Expected Google Search Console verification tag in RootLayout.astro');
for (const eventName of ['lead_call_click', 'lead_sms_click', 'lead_email_click', 'ai_referrer_visit', 'outreach_link_open', 'ai_audit_run']) {
  assert.ok(rootLayout.includes(eventName), `RootLayout.astro must contain event tracker for ${eventName}`);
}

const contactSrc = fs.readFileSync(new URL('../src/components/Contact.tsx', import.meta.url), 'utf8');
assert.ok(!contactSrc.includes('No tracking pixels on this page'), 'Footer in Contact.tsx must not contain "No tracking pixels on this page"');
assert.ok(contactSrc.includes('Built in Clovis, CA · Serving Fresno &amp; the Central Valley') || contactSrc.includes('Built in Clovis, CA · Serving Fresno & the Central Valley'), 'Footer in Contact.tsx must contain location attribution');

const medicalSrc = fs.readFileSync(new URL('../src/pages/services/medical-web-design.astro', import.meta.url), 'utf8');
assert.ok(!medicalSrc.includes('No ad-tracking pixels'), 'medical-web-design.astro must not contain "No ad-tracking pixels"');
assert.ok(medicalSrc.includes('Privacy-safe call &amp; referral tracking') || medicalSrc.includes('Privacy-safe call & referral tracking'), 'medical-web-design.astro must contain "Privacy-safe call & referral tracking"');
assert.ok(medicalSrc.includes("offers: [offer('Growth'), offer('Flagship')]") || medicalSrc.includes('offers: [offer("Growth"), offer("Flagship")]'), 'Expected offers in medical-web-design.astro schema');
assert.ok(medicalSrc.includes('/case-studies/kidney-specialist-fresno/'), 'medical-web-design.astro must link to Kidney Specialist case study');

const localSeoSrc = fs.readFileSync(new URL('../src/pages/services/local-seo-fresno.astro', import.meta.url), 'utf8');
assert.ok(localSeoSrc.includes('<LeadLeakAudit client:visible />'), 'local-seo-fresno.astro must embed LeadLeakAudit');
assert.ok(localSeoSrc.includes('Foundational setup vs. ongoing monthly growth'), 'local-seo-fresno.astro must explain foundational vs growth');
assert.ok(localSeoSrc.includes('/case-studies/dumpster-rental-fresno/'), 'local-seo-fresno.astro must link to Big Bros case study');

const auditSrc = fs.readFileSync(new URL('../src/components/LeadLeakAudit.tsx', import.meta.url), 'utf8');
assert.ok(auditSrc.includes('ai_audit_run'), 'LeadLeakAudit.tsx must dispatch ai_audit_run');

// Behavioral unit test for RootLayout event tracking logic
{
  const scriptMatch = rootLayout.match(/<!-- Lightweight Conversion & AI Referrer Event Tracking -->\s*<script is:inline>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'Expected tracking script block in RootLayout.astro');
  const scriptContent = scriptMatch[1];

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

  const fn = new Function('window', 'document', 'sessionStorage', 'URLSearchParams', 'URL', scriptContent);
  fn(mockWindow, mockDoc, mockSessionStorage, URLSearchParams, URL);

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
  fn(mockWindow, mockDoc, mockSessionStorage, URLSearchParams, URL);
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

// Verify Requirement R3: Plans, Care Plans & Side-by-Side Compare Table
import { care, plans, hasOfferCatalog } from '../src/lib/data.ts';

// 1. Plans integrity
assert.equal(plans.length, 3, 'Expected exactly 3 pricing plans');
assert.equal(plans[0].price, '$1,500');
assert.equal(plans[0].not.length, 0, 'Starter plan must have zero negative bullets');
assert.equal(plans[1].price, '$2,500');
assert.equal(plans[2].price, 'From $3,500', 'Flagship price display must be "From $3,500"');

for (const p of plans) {
  const itemsStr = p.items.join(' ');
  assert.ok(itemsStr.includes('preview before you pay'), `${p.name} must include working phone preview before payment`);
  assert.ok(itemsStr.includes('15-minute call'), `${p.name} must include done-for-you words from 15-minute call`);
  assert.ok(itemsStr.includes('tracking'), `${p.name} must include call & search tracking`);
  assert.ok(itemsStr.includes('90 days of free fixes'), `${p.name} must include 90 days of free fixes after launch`);
}

// 2. Care plans integrity
assert.equal(care.length, 2, 'Expected exactly 2 care plans (no $0 plan)');
assert.equal(care[0].name, 'Care Plan');
assert.equal(care[0].price, '$99');
assert.ok(care[0].blurb.includes('text-me updates'), 'Care Plan blurb must mention text-me updates');
assert.equal(care[1].name, 'Care Plus');
assert.equal(care[1].price, '$249');
assert.ok(care[1].blurb.includes('town and service pages') || care[1].blurb.includes('town'), 'Care Plus blurb must mention new town/service pages');
assert.ok(!care.some(c => c.name === 'No plan'), 'No plan must be removed from care array');

// 3. Offer Catalog schema matches visible prices
const flagshipOffer = hasOfferCatalog.itemListElement.find(o => o.name === 'Flagship');
assert.ok(flagshipOffer, 'Expected Flagship offer in hasOfferCatalog');
assert.equal(flagshipOffer.price, '3500');

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
  assert.ok(distHtml.includes('From $3,500'), 'dist/index.html must render "From $3,500"');
  assert.ok(!distHtml.includes('No multi-page site or blog'), 'dist/index.html must not contain negative bullets');
  assert.ok(!distHtml.includes('No plan'), 'dist/index.html must not contain "No plan"');
}

console.log('Requirement R3 (Pricing, Care Plans, Compare Table & Navigation): 6 suites ✓');

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



