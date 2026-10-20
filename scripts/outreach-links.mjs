#!/usr/bin/env node
/**
 * Generates personalized 1-click AI-check outreach links and short SMS/email scripts
 * for local Clovis & Fresno businesses.
 *
 * Usage:
 *   node scripts/outreach-links.mjs "Olsen Roofing" "roofer" "Clovis, CA"
 *   node scripts/outreach-links.mjs
 */

export function buildAuditUrl(business, trade, city = 'Clovis, CA') {
  const params = new URLSearchParams({
    biz: business.trim(),
    trade: trade.trim(),
    city: city.trim() || 'Clovis, CA',
    autorun: '1',
  });
  return `https://cloviswebdesign.com/?${params.toString()}#check`;
}

export function buildOutreachCopy(business, trade, city = 'Clovis, CA', competitors = '') {
  const url = buildAuditUrl(business, trade, city);
  const compClean = competitors.trim();
  const sms = compClean
    ? `Hi — I asked Google's AI for a ${trade} in ${city} and noticed it recommended ${compClean} instead of ${business}. Here's the live check I ran for you: ${url} — Adam in Clovis, (559) 628-0142`
    : `Hi — I ran a quick check to see who Google's AI recommends when someone asks for a ${trade} in ${city}. Here's the live result for ${business}: ${url} — Adam in Clovis, (559) 628-0142`;
  const emailSubject = compClean
    ? `Google's AI recommended ${compClean} for a ${trade} in ${city}`
    : `Who Google's AI recommends for a ${trade} in ${city}`;
  const emailBody = `Hi ${business} team,

More customers in ${city} are asking Google's AI who to call instead of scrolling through ten links.

${compClean ? `I asked Google's AI (backed by live Google Maps data) for a ${trade} in ${city}, and it named ${compClean} ahead of ${business}.` : `I built a tool on my site that asks Google's AI (backed by live Google Maps data) for a ${trade} in ${city} and checks whether ${business} shows up.`}

You can run the live check for ${business} with one click here:
${url}

I'm an independent web developer based here in Clovis. I build fast, custom websites for Central Valley businesses (starting at $1,500, no monthly fees, and you own the code and domain).

If you'd like to talk about getting more calls from Google Search and Maps, reply here or text my cell at (559) 628-0142.

Best,
Adam
Clovis Web Design · (559) 628-0142`;

  return { url, sms, emailSubject, emailBody };
}

const DEFAULT_PROSPECTS = [
  { business: 'Olsen Roofing', trade: 'roofer', city: 'Clovis, CA', competitors: '' },
  { business: 'Clovis Plumbing Services', trade: 'plumber', city: 'Clovis, CA', competitors: '' },
  { business: 'Allbritten Plumbing Heating & Air', trade: 'HVAC contractor', city: 'Fresno, CA', competitors: '' },
  { business: 'Valley Concrete & Landscaping', trade: 'concrete contractor', city: 'Clovis, CA', competitors: '' },
  { business: 'Cut Right Tree Service', trade: 'tree service', city: 'Fresno, CA', competitors: '' },
  { business: 'Clovis Family Dental', trade: 'dentist', city: 'Clovis, CA', competitors: '' },
];

import { pathToFileURL } from 'node:url';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [biz, trade, city, competitors] = process.argv.slice(2);
  const list = biz && trade ? [{ business: biz, trade, city: city || 'Clovis, CA', competitors: competitors || '' }] : DEFAULT_PROSPECTS;

  for (const item of list) {
    const out = buildOutreachCopy(item.business, item.trade, item.city, item.competitors);
    console.log('='.repeat(72));
    console.log(`${item.business} (${item.trade} · ${item.city})`);
    console.log(`1-Click Audit URL: ${out.url}`);
    console.log(`\nSMS:\n${out.sms}`);
    console.log(`\nEmail Subject: ${out.emailSubject}`);
    console.log(`Email Body:\n${out.emailBody}\n`);
  }
}
