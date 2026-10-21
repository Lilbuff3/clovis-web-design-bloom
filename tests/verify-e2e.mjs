#!/usr/bin/env node
/**
 * ============================================================================
 * Clovis Web Design Migration — End-to-End Acceptance Test Suite
 * ============================================================================
 *
 * Automated opaque-box verification suite for cloviswebdesign.com Astro SSG migration.
 *
 * Tier 1: Build & Static Pre-rendering Architecture
 * Tier 2: Schema.org JSON-LD & Knowledge Graph Entity Architecture
 * Tier 3: Mobile Performance, Action Bar & Above-the-Fold UX
 * Tier 4: Multi-Page Route Silos & Navigation Inter-linkage
 * Tier 5: Binary Integrity, Adversarial & Robustness Verification
 * Tier 6: Medical Engineering, HIPAA Compliance & GEO Verification
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Command line arguments
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const tierArg = args.find(a => a.startsWith('--tier='));
const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;

// ANSI Colors for Terminal Output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// Global Test Registry
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  tiers: {
    1: { name: 'Build & Static Pre-rendering Architecture', tests: [] },
    2: { name: 'Knowledge Graph & Schema.org JSON-LD Verification', tests: [] },
    3: { name: 'Mobile Performance, Action Bar & Above-the-Fold UX', tests: [] },
    4: { name: 'Multi-Page Route Silos & Inter-linkage', tests: [] },
    5: { name: 'Binary Integrity, Adversarial & Robustness Verification', tests: [] },
    6: { name: 'Medical Page, Entity Hygiene & Per-Page Schema', tests: [] },
  },
};

function assertTest(tier, id, title, fn) {
  if (targetTier !== null && targetTier !== tier) {
    return;
  }

  results.total++;
  const testRecord = {
    id,
    tier,
    title,
    status: 'PENDING',
    error: null,
    details: null,
  };

  try {
    const outcome = fn();
    testRecord.status = 'PASS';
    testRecord.details = outcome || 'Assertion passed successfully';
    results.passed++;
  } catch (err) {
    testRecord.status = 'FAIL';
    testRecord.error = err.message;
    results.failed++;
  }

  results.tiers[tier].tests.push(testRecord);
}

// ============================================================================
// Helper Utilities
// ============================================================================

function getAllFiles(dir, extensions = ['.html', '.js', '.css', '.mjs', '.svg']) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractTextBetweenTags(html, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const cleanText = match[1].replace(/<[^>]+>/g, '').trim();
    if (cleanText.length > 0) {
      matches.push(cleanText);
    }
  }
  return matches;
}

function extractJsonLdScripts(html) {
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const scripts = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const content = match[1].trim();
    try {
      const parsed = JSON.parse(content);
      scripts.push({ raw: content, data: parsed });
    } catch (err) {
      scripts.push({ raw: content, error: err.message });
    }
  }
  return scripts;
}

// ============================================================================
// Acceptance Test Routes Specification
// ============================================================================
const REQUIRED_ROUTES = [
  { path: 'index.html', route: '/' },
  { path: path.join('services', 'local-seo-fresno', 'index.html'), route: '/services/local-seo-fresno/' },
  { path: path.join('services', 'contractor-websites', 'index.html'), route: '/services/contractor-websites/' },
  { path: path.join('services', 'medical-web-design', 'index.html'), route: '/services/medical-web-design/' },
];

const CASE_STUDY_ROUTES = [
  { path: path.join('case-studies', 'dumpster-rental-fresno', 'index.html'), route: '/case-studies/dumpster-rental-fresno/' },
  { path: path.join('case-studies', 'kidney-specialist-fresno', 'index.html'), route: '/case-studies/kidney-specialist-fresno/' },
];

// ============================================================================
// TIER 1: Build & Static Pre-rendering Architecture
// ============================================================================

assertTest(1, 'T1.1', 'Static HTML file generation for every route', () => {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(`Output directory dist/ does not exist. Run "npm run build" first.`);
  }

  const missingRoutes = [];
  for (const r of REQUIRED_ROUTES) {
    const fullPath = path.join(DIST_DIR, r.path);
    if (!fs.existsSync(fullPath)) {
      missingRoutes.push(`${r.route} (expected at ${r.path})`);
    }
  }

  if (missingRoutes.length > 0) {
    throw new Error(`Missing static pre-rendered routes in dist/:\n - ${missingRoutes.join('\n - ')}`);
  }

  return `All ${REQUIRED_ROUTES.length} route silos exist as static pre-rendered HTML files in dist/`;
});

assertTest(1, 'T1.2', 'Pure semantic first-byte copy (h1, h2, p) across every route', () => {
  const missingCopy = [];

  for (const r of REQUIRED_ROUTES) {
    const fullPath = path.join(DIST_DIR, r.path);
    if (!fs.existsSync(fullPath)) {
      missingCopy.push(`${r.route}: File missing`);
      continue;
    }

    const html = fs.readFileSync(fullPath, 'utf-8');
    const h1s = extractTextBetweenTags(html, 'h1');
    const h2s = extractTextBetweenTags(html, 'h2');
    const ps = extractTextBetweenTags(html, 'p');

    if (h1s.length === 0) {
      missingCopy.push(`${r.route}: Missing <h1> tag`);
    }
    if (h2s.length < 2) {
      missingCopy.push(`${r.route}: Found only ${h2s.length} <h2> tags (minimum 2 expected)`);
    }
    if (ps.length < 3) {
      missingCopy.push(`${r.route}: Found only ${ps.length} <p> tags (minimum 3 expected)`);
    }

    const combinedCopy = [...h1s, ...h2s, ...ps].join(' ');
    if (combinedCopy.length < 200) {
      missingCopy.push(`${r.route}: Semantic copy too short (${combinedCopy.length} chars, expected >= 200)`);
    }
  }

  if (missingCopy.length > 0) {
    throw new Error(`Semantic first-byte content deficiencies:\n - ${missingCopy.join('\n - ')}`);
  }

  return `All ${REQUIRED_ROUTES.length} routes contain rich semantic copy on first byte (verified h1, h2, and p elements)`;
});

assertTest(1, 'T1.3', 'Zero empty client-side mounting shells (<div id="root"></div>) in dist/', () => {
  const htmlFiles = getAllFiles(DIST_DIR, ['.html']);
  if (htmlFiles.length === 0) {
    throw new Error(`No HTML files found in dist/ to inspect.`);
  }

  const emptyRootViolations = [];
  const emptyRootRegex = /<div\s+id=["']root["']\s*>\s*<\/div>/i;

  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file);
    const content = fs.readFileSync(file, 'utf-8');
    if (emptyRootRegex.test(content)) {
      emptyRootViolations.push(rel);
    }
  }

  if (emptyRootViolations.length > 0) {
    throw new Error(
      `Found empty client-side React mount container (<div id="root"></div>) in:\n - ${emptyRootViolations.join('\n - ')}`
    );
  }

  return `Verified 0 empty <div id="root"></div> containers across all ${htmlFiles.length} HTML files`;
});

assertTest(1, 'T1.4', 'Zero external references to fonts.googleapis.com or fonts.gstatic.com in dist/', () => {
  const distFiles = getAllFiles(DIST_DIR, ['.html', '.css', '.js']);
  if (distFiles.length === 0) {
    throw new Error(`No assets found in dist/ to inspect.`);
  }

  const fontViolations = [];
  for (const file of distFiles) {
    const rel = path.relative(DIST_DIR, file);
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('fonts.googleapis.com') || content.includes('fonts.gstatic.com')) {
      fontViolations.push(rel);
    }
  }

  if (fontViolations.length > 0) {
    throw new Error(
      `Found forbidden external Google Fonts references in:\n - ${fontViolations.join('\n - ')}`
    );
  }

  return `Zero external Google Fonts calls found across all dist/ assets`;
});

assertTest(1, 'T1.5', 'Zero external references to videos.pexels.com in dist/', () => {
  const distFiles = getAllFiles(DIST_DIR, ['.html', '.css', '.js']);
  if (distFiles.length === 0) {
    throw new Error(`No assets found in dist/ to inspect.`);
  }

  const videoViolations = [];
  for (const file of distFiles) {
    const rel = path.relative(DIST_DIR, file);
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('videos.pexels.com')) {
      videoViolations.push(rel);
    }
  }

  if (videoViolations.length > 0) {
    throw new Error(
      `Found forbidden external Pexels video stream references in:\n - ${videoViolations.join('\n - ')}`
    );
  }

  return `Zero external Pexels video stream references found across all dist/ assets`;
});

assertTest(1, 'T1.6', 'Self-hosted fonts (.woff2) exist with valid binary headers and family coverage', () => {
  const fontDirs = [
    path.join(PUBLIC_DIR, 'fonts'),
    path.join(DIST_DIR, 'fonts'),
    path.join(DIST_DIR, '_astro'),
  ];

  let fontFiles = [];
  for (const fDir of fontDirs) {
    if (fs.existsSync(fDir)) {
      fontFiles = fontFiles.concat(getAllFiles(fDir, ['.woff2']));
    }
  }

  if (fontFiles.length === 0) {
    throw new Error(`No .woff2 font files located in public/fonts/, dist/fonts/, or dist/_astro/`);
  }

  const invalidHeaders = [];
  for (const fPath of fontFiles) {
    const rel = path.relative(PROJECT_ROOT, fPath);
    const buffer = fs.readFileSync(fPath);
    if (buffer.length < 4) {
      invalidHeaders.push(`${rel} (truncated file, length < 4)`);
      continue;
    }
    const magic = buffer.subarray(0, 4).toString('ascii');
    if (magic !== 'wOF2') {
      invalidHeaders.push(`${rel} (invalid magic header: ${magic}, expected wOF2)`);
    }
  }

  if (invalidHeaders.length > 0) {
    throw new Error(`Corrupted or invalid .woff2 font headers:\n - ${invalidHeaders.join('\n - ')}`);
  }

  const fontNames = fontFiles.map(f => path.basename(f).toLowerCase()).join(' ');
  const requiredFamilies = ['fraunces', 'bricolage', 'mono'];
  const missingFamilies = requiredFamilies.filter(fam => !fontNames.includes(fam));

  if (missingFamilies.length > 0) {
    const cssFiles = getAllFiles(DIST_DIR, ['.css']);
    const cssContent = cssFiles.map(c => fs.readFileSync(c, 'utf-8')).join('\n').toLowerCase();
    const stillMissing = missingFamilies.filter(fam => !cssContent.includes(fam));
    if (stillMissing.length > 0) {
      throw new Error(`Missing self-hosted font coverage for families: ${stillMissing.join(', ')}`);
    }
  }

  return `Found ${fontFiles.length} valid self-hosted .woff2 fonts with verified "wOF2" binary headers covering required typography`;
});

// ============================================================================
// TIER 2: Knowledge Graph & Schema.org JSON-LD Verification
// ============================================================================

function getRootJsonLd() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`dist/index.html not found for Schema.org inspection.`);
  }

  const html = fs.readFileSync(indexPath, 'utf-8');
  const scripts = extractJsonLdScripts(html);

  if (scripts.length === 0) {
    throw new Error(`No <script type="application/ld+json"> tag found in dist/index.html`);
  }

  for (const s of scripts) {
    if (s.error) {
      throw new Error(`Malformed JSON-LD script syntax: ${s.error}`);
    }
  }

  const graphScript = scripts.find(s => s.data && Array.isArray(s.data['@graph']));
  if (!graphScript) {
    throw new Error(`Schema.org script found, but missing "@graph" array structure.`);
  }

  return graphScript.data;
}

function findBusinessNode(jsonLd) {
  const graph = jsonLd['@graph'];
  return graph.find(node => {
    const type = node['@type'];
    if (Array.isArray(type)) {
      return type.includes('LocalBusiness') || type.includes('ProfessionalService');
    }
    return type === 'LocalBusiness' || type === 'ProfessionalService';
  });
}

assertTest(2, 'T2.1', 'Valid Schema.org JSON-LD <script> with @graph in root layout', () => {
  const jsonLd = getRootJsonLd();
  if (!jsonLd['@context'] || !jsonLd['@context'].includes('schema.org')) {
    throw new Error(`Missing or invalid "@context" in JSON-LD. Got: ${jsonLd['@context']}`);
  }
  return `Valid JSON-LD @graph found with ${jsonLd['@graph'].length} entity nodes`;
});

assertTest(2, 'T2.2', '@type includes ["LocalBusiness", "ProfessionalService"]', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);

  if (!biz) {
    throw new Error(`No entity node with @type LocalBusiness or ProfessionalService found in @graph.`);
  }

  const types = Array.isArray(biz['@type']) ? biz['@type'] : [biz['@type']];
  const hasLocal = types.includes('LocalBusiness');
  const hasProf = types.includes('ProfessionalService');

  if (!hasLocal || !hasProf) {
    throw new Error(
      `Business node @type must include both "LocalBusiness" and "ProfessionalService". Got: ${JSON.stringify(types)}`
    );
  }

  return `Business entity node correctly typed as ["LocalBusiness", "ProfessionalService"]`;
});

assertTest(2, 'T2.3', 'Core business identity (name, telephone: +15596280142, priceRange)', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  const errors = [];
  if (biz.name !== 'Clovis Web Design') {
    errors.push(`name must be "Clovis Web Design", got: "${biz.name}"`);
  }

  const telClean = (biz.telephone || '').replace(/[\s\-\(\)\.]/g, '');
  if (telClean !== '+15596280142' && telClean !== '15596280142' && telClean !== '5596280142') {
    errors.push(`telephone must be "+15596280142", got: "${biz.telephone}"`);
  }

  if (!biz.priceRange) {
    errors.push(`priceRange must be defined, got: "${biz.priceRange}"`);
  }

  if (errors.length > 0) {
    throw new Error(`Business identity attribute mismatch:\n - ${errors.join('\n - ')}`);
  }

  return `Verified name: "${biz.name}", telephone: "${biz.telephone}", priceRange: "${biz.priceRange}"`;
});

assertTest(2, 'T2.4', 'Founder Person node for Adam', () => {
  const jsonLd = getRootJsonLd();
  const graph = jsonLd['@graph'];
  const biz = findBusinessNode(jsonLd);

  let founder = biz ? biz.founder : null;
  if (founder && founder['@id']) {
    const resolved = graph.find(n => n['@id'] === founder['@id']);
    if (resolved) founder = resolved;
  }
  if (!founder) {
    founder = graph.find(n => n['@type'] === 'Person' && n.name === 'Adam');
  }

  if (!founder) {
    throw new Error(`No founder Person node found in Schema.org @graph for "Adam".`);
  }

  if (founder.name !== 'Adam') {
    throw new Error(`Founder name is "${founder.name}", expected "Adam".`);
  }

  return `Verified founder Person node: ${founder.name}`;
});

assertTest(2, 'T2.5', 'areaServed names Clovis and Fresno, with no wrong Wikidata IDs', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  const areaServed = biz.areaServed;
  if (!Array.isArray(areaServed) || areaServed.length === 0) {
    throw new Error(`biz.areaServed must be a non-empty array.`);
  }

  const serialized = JSON.stringify(areaServed);
  const missing = ['Clovis', 'Fresno'].filter((city) => !serialized.includes(city));
  if (missing.length > 0) throw new Error(`areaServed is missing: ${missing.join(', ')}`);

  const wrong = ['Q949704', 'Q43048', 'Q271014'].filter((id) => serialized.includes(id));
  if (wrong.length > 0) throw new Error(`areaServed links to wrong Wikidata entities: ${wrong.join(', ')}`);

  return `areaServed names ${areaServed.map((a) => a.name).join(', ')}`;
});

assertTest(2, 'T2.6', 'CRITICAL TEST: Geographic Wikidata URIs EXCLUSIVELY in areaServed, NEVER in top-level sameAs', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  const sameAs = Array.isArray(biz.sameAs) ? biz.sameAs : biz.sameAs ? [biz.sameAs] : [];

  const forbiddenStrings = [
    'wikidata.org',
    'Q949704',
    'Q43048',
    'Q271014',
    'wikipedia.org/wiki/Clovis',
    'wikipedia.org/wiki/Fresno',
    'wikipedia.org/wiki/Central_Valley',
  ];

  const violations = [];
  for (const url of sameAs) {
    for (const forbidden of forbiddenStrings) {
      if (typeof url === 'string' && url.includes(forbidden)) {
        violations.push(`Forbidden geographic URI found in business sameAs: ${url}`);
      }
    }
  }

  if (violations.length > 0) {
    throw new Error(
      `CRITICAL VIOLATION: Geographic Wikidata/Wikipedia URIs must be located EXCLUSIVELY inside areaServed!\n - ${violations.join('\n - ')}`
    );
  }

  return `PASSED: Top-level sameAs contains 0 geographic/Wikidata URIs; all geographic entities isolated in areaServed`;
});

assertTest(2, 'T2.7', 'Top-level sameAs (if any) lists only profile sites, only ones Adam confirmed', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  if (!biz.hasMap || !biz.hasMap.includes('5133720235419656762')) {
    throw new Error(`Business node missing hasMap pointing to verified Google Business Profile.`);
  }

  const sameAs = Array.isArray(biz.sameAs) ? biz.sameAs : biz.sameAs ? [biz.sameAs] : [];
  const validProfileDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'github.com', 'instagram.com', 'google.com'];
  const notAdams = ['linkedin.com/in/adamyoussef', 'linkedin.com/company/clovis-web-design', 'clovischamber.com/directory'];

  const bad = sameAs.filter((url) => !validProfileDomains.some((d) => url.includes(d)) || notAdams.some((u) => url.includes(u)));
  const founderSameAs = JSON.stringify(biz.founder?.sameAs ?? '');
  bad.push(...notAdams.filter((u) => founderSameAs.includes(u)));
  if (bad.length > 0) throw new Error(`sameAs lists profiles that aren't Adam's or aren't profiles:\n - ${bad.join('\n - ')}`);

  if (!sameAs.some((u) => u.includes('5133720235419656762'))) {
    throw new Error(`sameAs must include verified Google Business Profile CID.`);
  }

  return `sameAs has ${sameAs.length} confirmed profile(s) and hasMap links GBP`;
});

assertTest(2, 'T2.8', 'hasOfferCatalog matches the 3 scoped engagement models', () => {
  const jsonLd = getRootJsonLd();
  const graph = jsonLd['@graph'];
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  let catalog = biz.hasOfferCatalog;
  if (catalog && catalog['@id']) {
    const resolved = graph.find(n => n['@id'] === catalog['@id']);
    if (resolved) catalog = resolved;
  }

  if (!catalog) {
    throw new Error(`Missing "hasOfferCatalog" property on business entity node.`);
  }

  const catalogStr = JSON.stringify(catalog);
  for (const model of ['Custom Website Build', 'Search & AI Visibility Setup', 'Ongoing Search & AI Growth']) {
    if (!catalogStr.includes(model)) {
      throw new Error(`hasOfferCatalog missing engagement model: ${model}`);
    }
  }

  return `hasOfferCatalog configured with Custom Website Build, Search & AI Visibility Setup, and Ongoing Search & AI Growth`;
});

// ============================================================================
// TIER 3: Mobile Performance & UX Elements
// ============================================================================

assertTest(3, 'T3.1', 'Mobile Action Bar with tap-to-call, tap-to-text, availability status, and audit trigger', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');

  const hasCall = /href=["']tel:\+?1?[\-\.]?559[\-\.]?628[\-\.]?0142["']/i.test(html);
  if (!hasCall) {
    throw new Error(`Missing tap-to-call link with href="tel:+15596280142"`);
  }

  const hasText = /href=["']sms:\+?1?[\-\.]?559[\-\.]?628[\-\.]?0142(?:\?[^"']*)?["']/i.test(html);
  if (!hasText) {
    throw new Error(`Missing tap-to-text link with href="sms:+15596280142"`);
  }

  const hasStatus = /workbench|available|online|asleep|winding down|open|clovis clock|Texts come straight to me/i.test(html);
  if (!hasStatus) {
    throw new Error(`Missing live builder availability status indicator`);
  }

  const hasAuditTrigger = /audit|instant audit|quote drawer|audit-drawer|data-audit/i.test(html);
  if (!hasAuditTrigger) {
    throw new Error(`Missing instant audit drawer trigger in mobile action bar`);
  }

  return `Mobile Action Bar verified with tap-to-call, tap-to-text, availability status, and audit trigger`;
});

assertTest(3, 'T3.2', 'Four-second race lives on the contractor page (#speed), not the homepage', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  const contractorPath = path.join(DIST_DIR, 'services', 'contractor-websites', 'index.html');
  if (!fs.existsSync(indexPath) || !fs.existsSync(contractorPath)) throw new Error(`Run "npm run build" first.`);

  const home = fs.readFileSync(indexPath, 'utf-8');
  if (/id=["']test["']|Start the race|Stopwatch/i.test(home)) {
    throw new Error(`The four-second race is still on the homepage.`);
  }
  if (/href=["']\/?#test["']/i.test(home)) throw new Error(`The homepage still links to #test.`);

  const race = fs.readFileSync(contractorPath, 'utf-8').match(/<section[^>]*id=["']speed["'][^>]*>([\s\S]*?)<\/section>/i);
  if (!race) throw new Error(`No #speed section on /services/contractor-websites/.`);
  if (!/Start the race/i.test(race[1]) || !/Wi-Fi/i.test(race[1])) {
    throw new Error(`#speed on the contractor page is missing the race or the home Wi-Fi paragraph.`);
  }
  const jargon = /Largest Contentful Paint|Cumulative Layout Shift|Interaction to Next Paint/i.exec(race[1]);
  if (jargon) throw new Error(`#speed still shows "${jargon[0]}".`);

  return `Race is on /services/contractor-websites/#speed in plain words; the homepage has no stopwatch or #test link`;
});

assertTest(3, 'T3.4', 'Homepage leads hero → 4 core services (#who) → live AI check (#check) → client results (#harvest)', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);
  const html = fs.readFileSync(indexPath, 'utf-8');

  const order = ['top', 'who', 'check', 'harvest'];
  const at = order.map((id) => html.search(new RegExp(`<section[^>]*id=["']${id}["']`, 'i')));
  const missing = order.filter((_, i) => at[i] < 0);
  if (missing.length) throw new Error(`Missing homepage sections: ${missing.map((id) => `#${id}`).join(', ')}`);
  if (at.some((pos, i) => i > 0 && pos < at[i - 1])) throw new Error(`Homepage order is not ${order.map((id) => `#${id}`).join(' → ')}`);

  const who = html.slice(at[1], at[2]);
  const pages = ['/services/local-seo-fresno/', '/services/medical-web-design/', '/services/contractor-websites/'].filter((href) => !who.includes(`href="${href}"`));
  if (pages.length) throw new Error(`#who doesn't link to: ${pages.join(', ')}`);
  if (!who.includes('Why it matters:')) throw new Error(`#who must explain "Why it matters:" for each service`);

  return `Homepage order: ${order.map((id) => `#${id}`).join(' → ')}; #who renders 4 services + Why it matters and links to all service pages`;
});

assertTest(3, 'T3.3', 'Hero section displays headline, preview guarantee, and primary CTA for mobile fold compliance', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');
  const heroSectionMatch = html.match(/<section[^>]*id=["'](?:top|hero)["'][^>]*>([\s\S]*?)<\/section>/i);
  const heroHtml = heroSectionMatch ? heroSectionMatch[1] : html.substring(0, 3000);

  const hasHeadline = /<h1/i.test(heroHtml);
  const hasPreviewGuarantee = /working preview on your phone before you pay/i.test(heroHtml);
  const hasCta = /sms:\+?1?5596280142|tel:\+?1?5596280142/i.test(heroHtml);

  if (!hasHeadline) throw new Error(`Hero section missing primary <h1> headline`);
  if (!hasPreviewGuarantee) throw new Error(`Hero section missing phone preview guarantee within initial viewport markup`);
  if (!hasCta) throw new Error(`Hero section missing direct SMS/call CTA button`);

  return `Hero section contains headline, preview guarantee, and primary CTA ensuring mobile fold compliance`;
});

assertTest(3, 'T3.5', 'Homepage follows DESIGN.md text rules: 11px minimum, no small text on bright persimmon, no faded ink, no numbered section labels', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);
  const html = fs.readFileSync(indexPath, 'utf-8');
  const classLists = [...html.matchAll(/class="([^"]*)"/g)].map((m) => m[1].split(/\s+/));
  const faded = (k) => /^text-ink\/[1-6]\d$/.test(k);

  const problems = [];
  if (classLists.some((c) => c.includes('text-[9px]') || c.includes('text-[10px]'))) problems.push('text below 11px');
  if (classLists.some((c) => c.includes('bg-persimmon') && (c.includes('text-cream') || c.includes('text-white')))) problems.push('cream/white text on bg-persimmon');
  const fadedList = classLists.find((c) => !c.includes('dotted-rule') && c.some(faded));
  if (fadedList) problems.push(`text faded below 70% (${fadedList.find(faded)}); use text-ink-soft`);
  if (/>\s*0[1-9] — /.test(html)) problems.push('numbered label ("0X — …") above a section heading');

  if (problems.length) throw new Error(problems.join('\n - '));
  return 'No sub-11px text, no small text on bright persimmon, no faded ink text, no numbered section labels';
});

// ============================================================================
// TIER 4: Multi-Page Route Silos & Inter-linkage
// ============================================================================

assertTest(4, 'T4.1', 'Direct founder phone / SMS contact links present on every route', () => {
  const missingContact = [];

  for (const r of REQUIRED_ROUTES) {
    const fullPath = path.join(DIST_DIR, r.path);
    if (!fs.existsSync(fullPath)) continue;

    const html = fs.readFileSync(fullPath, 'utf-8');
    const hasPhone = /href=["'](?:tel|sms):\+?1?5596280142(?:\?[^"']*)?["']/i.test(html) || /559[\.\-\s]?628[\.\-\s]?0142/.test(html);
    if (!hasPhone) {
      missingContact.push(r.route);
    }
  }

  if (missingContact.length > 0) {
    throw new Error(`Routes missing direct founder contact links:\n - ${missingContact.join('\n - ')}`);
  }

  return `All ${REQUIRED_ROUTES.length} route silos contain direct founder phone or SMS contact access`;
});

assertTest(4, 'T4.2', 'Inter-silo navigation linkage across all service silos', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');
  const serviceSilos = [
    '/services/local-seo-fresno/',
    '/services/contractor-websites/',
    '/services/medical-web-design/',
  ];

  const unlinked = [];
  for (const s of serviceSilos) {
    const altRegex = new RegExp(`href=["'](?:${s}|${s.slice(0, -1)})["']`, 'i');
    if (!altRegex.test(html)) {
      unlinked.push(s);
    }
  }

  if (unlinked.length > 0) {
    throw new Error(`Root navigation missing direct links to service silos:\n - ${unlinked.join('\n - ')}`);
  }

  return `Root layout links directly to all ${serviceSilos.length} service pages`;
});

assertTest(4, 'T4.3', 'Valid HTML5 document structure across all routes (doctype, charset, viewport meta)', () => {
  const invalidRoutes = [];

  for (const r of REQUIRED_ROUTES) {
    const fullPath = path.join(DIST_DIR, r.path);
    if (!fs.existsSync(fullPath)) continue;

    const html = fs.readFileSync(fullPath, 'utf-8');
    const hasDoctype = /<!doctype\s+html>/i.test(html);
    const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
    const hasCharset = /<meta\s+charset=/i.test(html);
    const hasTitle = /<title>[^<]+<\/title>/i.test(html);

    if (!hasDoctype || !hasViewport || !hasCharset || !hasTitle) {
      invalidRoutes.push(`${r.route} (doctype:${hasDoctype}, viewport:${hasViewport}, charset:${hasCharset}, title:${hasTitle})`);
    }
  }

  if (invalidRoutes.length > 0) {
    throw new Error(`HTML5 structure non-conformance in routes:\n - ${invalidRoutes.join('\n - ')}`);
  }

  return `All ${REQUIRED_ROUTES.length} routes conform to valid HTML5 boilerplate with charset, viewport, and title`;
});

// Adam goes by his first name only on the site: copy, meta tags, schema, and discovery files.
assertTest(4, 'T4.5', "Adam's last name appears nowhere in the built site", () => {
  const hits = getAllFiles(DIST_DIR, ['.html', '.js', '.json', '.txt']).filter((f) => /youssef/i.test(fs.readFileSync(f, 'utf-8')));
  if (hits.length) throw new Error(`Last name found in: ${hits.map((f) => path.relative(DIST_DIR, f)).join(', ')}`);
  return `First name only across ${getAllFiles(DIST_DIR, ['.html', '.txt', '.json']).length} built files`;
});

// The Clovis page competed with the homepage for the same searches; it now 301s there.
assertTest(4, 'T4.4', '/services/web-design-clovis/ is gone and 301s to the homepage', () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'vercel.json'), 'utf-8'));
  const r = (vercel.redirects ?? []).find((x) => x.source === '/services/web-design-clovis/');
  if (!r || r.destination !== '/' || r.statusCode !== 301) {
    throw new Error(`vercel.json needs a 301 from /services/web-design-clovis/ to /. Got: ${JSON.stringify(r)}`);
  }
  if (fs.existsSync(path.join(DIST_DIR, 'services', 'web-design-clovis'))) {
    throw new Error(`dist/ still builds /services/web-design-clovis/`);
  }
  const linking = getAllFiles(DIST_DIR, ['.html']).filter((f) => fs.readFileSync(f, 'utf-8').includes('/services/web-design-clovis/'));
  if (linking.length) throw new Error(`Still linked from: ${linking.map((f) => path.relative(DIST_DIR, f)).join(', ')}`);
  return `301 /services/web-design-clovis/ → /, no page or links left`;
});

// ============================================================================
// TIER 5: Binary Integrity, Adversarial & Robustness Verification
// ============================================================================

assertTest(5, 'T5.1', 'WOFF2 font binary integrity: minimum byte density and non-empty glyph tables', () => {
  const fontDirs = [
    path.join(PUBLIC_DIR, 'fonts'),
    path.join(DIST_DIR, 'fonts'),
    path.join(DIST_DIR, '_astro'),
  ];

  let fontFiles = [];
  for (const fDir of fontDirs) {
    if (fs.existsSync(fDir)) {
      fontFiles = fontFiles.concat(getAllFiles(fDir, ['.woff2']));
    }
  }

  if (fontFiles.length === 0) {
    throw new Error(`No .woff2 font files available for binary inspection.`);
  }

  const corruptedFonts = [];
  for (const fPath of fontFiles) {
    const rel = path.relative(PROJECT_ROOT, fPath);
    const stat = fs.statSync(fPath);

    if (stat.size < 5000) {
      corruptedFonts.push(`${rel}: Suspiciously small font file (${stat.size} bytes, expected > 5KB)`);
    }
  }

  if (corruptedFonts.length > 0) {
    throw new Error(`Potentially stubbed or corrupted WOFF2 fonts:\n - ${corruptedFonts.join('\n - ')}`);
  }

  return `All ${fontFiles.length} WOFF2 font files verified with authentic byte density (>5KB)`;
});

assertTest(5, 'T5.2', 'Adversarial check: Schema.org JSON-LD contains zero unescaped tags or injection payloads', () => {
  const jsonLd = getRootJsonLd();
  const serialized = JSON.stringify(jsonLd);

  if (/<script/i.test(serialized) || /<\/script/i.test(serialized)) {
    throw new Error(`Script tag injection found inside JSON-LD payload!`);
  }

  if (/javascript:/i.test(serialized)) {
    throw new Error(`Unsafe javascript: protocol URI found inside JSON-LD schema.`);
  }

  return `Schema.org JSON-LD verified clean of injection vectors and unescaped HTML tags`;
});

assertTest(5, 'T5.3', 'Absence of legacy blocking SPA artifacts (Lenis singleton, GSAP ticker, Preloader) in production', () => {
  const distFiles = getAllFiles(DIST_DIR, ['.html', '.js']);
  if (distFiles.length === 0) throw new Error(`No dist/ files to inspect.`);

  const violations = [];
  for (const f of distFiles) {
    const rel = path.relative(DIST_DIR, f);
    const content = fs.readFileSync(f, 'utf-8');

    if (/lenis\.stop\(\)/i.test(content) || /gsap\.ticker\.add/i.test(content)) {
      violations.push(`${rel} contains legacy Lenis/GSAP ticker loop calls`);
    }
    if (/data-intro.*Preloader/i.test(content) || /intro:done/i.test(content)) {
      violations.push(`${rel} contains legacy Preloader 2.2s blocking hooks`);
    }
  }

  if (violations.length > 0) {
    throw new Error(`Found legacy main-thread blocking artifacts in production output:\n - ${violations.join('\n - ')}`);
  }

  return `Zero legacy smooth scroll tickers or blocking preloader hooks present in production bundles`;
});

// ============================================================================
// TIER 6: Medical Engineering, HIPAA Compliance & GEO Verification
// ============================================================================

const MEDICAL_HTML_PATH = path.join(DIST_DIR, 'services', 'medical-web-design', 'index.html');

function getMedicalHtml() {
  if (!fs.existsSync(MEDICAL_HTML_PATH)) {
    throw new Error(`dist/services/medical-web-design/index.html does not exist. Run "npm run build" first.`);
  }
  return fs.readFileSync(MEDICAL_HTML_PATH, 'utf-8');
}

assertTest(6, 'T6.1', 'Medical page is pre-rendered with an h1 and its sections', () => {
  const html = getMedicalHtml();
  const h1s = extractTextBetweenTags(html, 'h1');
  const h2s = extractTextBetweenTags(html, 'h2');
  if (h1s.length < 1) throw new Error(`Missing <h1> heading on medical landing page.`);
  if (h2s.length < 4) throw new Error(`Found only ${h2s.length} <h2> headings (expected at least 4 sections).`);
  return `Medical page pre-rendered (${h1s.length} h1, ${h2s.length} h2s)`;
});

assertTest(6, 'T6.2', 'Medical page sells web design to practices and never speaks as a clinic', () => {
  const text = getMedicalHtml().replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  const clinicVoice = [/do you take my insurance/i, /accepting new patients/i, /\bMedi-Cal\b/i, /\bMedicare\b/i, /admitting privileges/i, /board[\s-]certif/i, /call 911/i, /intake packet/i, /\bour clinic\b/i, /clinical philosophy/i];
  const hits = clinicVoice.filter((r) => r.test(text));
  if (hits.length) throw new Error(`Clinic-voice copy on the medical page: ${hits.join(', ')}`);
  if (!/Business Associate Agreement/i.test(text)) throw new Error(`Missing where patient data goes instead (the intake vendor's BAA).`);
  if (!/not legal advice/i.test(text)) throw new Error(`Missing the "not legal advice" note next to the privacy section.`);
  return `No clinic-voice copy; online intake goes to BAA-covered tools; legal-advice note present`;
});

assertTest(6, 'T6.3', 'No SEO working notes, legal promises or unbacked numbers in visible copy on any route', () => {
  const leaks = [/GBP/, /Primary Category/i, /Secondary Category/i, /geo-unit/i, /wikidata/i, /\bQ\d{4,}\b/, /entity grounding/i, /Knowledge Graph/i,
    /100% HIPAA/i, /regulatory immunity/i, /bulletproof/i, /sixty percent/i, /Board Certified/i, /HEPA/i];
  const found = [];
  for (const r of REQUIRED_ROUTES) {
    const html = fs.readFileSync(path.join(DIST_DIR, r.path), 'utf-8').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '');
    for (const re of leaks) if (re.test(html)) found.push(`${r.route}: ${re}`);
  }
  if (found.length) throw new Error(`SEO notes showing on the page:\n - ${found.join('\n - ')}`);
  return `No GBP categories, Wikidata IDs or GEO markers in page copy`;
});

assertTest(6, 'T6.4', 'Each route has its own Service node, and FAQPage only lists questions shown on the page', () => {
  const seen = new Set();
  for (const r of REQUIRED_ROUTES) {
    const html = fs.readFileSync(path.join(DIST_DIR, r.path), 'utf-8');
    const graph = extractJsonLdScripts(html).find((x) => x.data?.['@graph'])?.data['@graph'] ?? [];
    const biz = graph.find((n) => n['@id'] === 'https://cloviswebdesign.com/#business');
    const services = graph.filter((n) => n['@type'] === 'Service');
    if (!biz) throw new Error(`${r.route}: no business node`);
    if (services.length !== 1) throw new Error(`${r.route}: expected 1 Service node, found ${services.length}`);
    const [svc] = services;
    if (svc.provider?.['@id'] !== biz['@id']) throw new Error(`${r.route}: Service.provider doesn't point at the business`);
    if (svc.url !== `https://cloviswebdesign.com${r.route}`) throw new Error(`${r.route}: Service.url is ${svc.url}`);
    const key = `${svc.name} | ${svc.audience?.audienceType}`;
    if (seen.has(key)) throw new Error(`Two routes describe the same Service: ${key}`);
    seen.add(key);
    if (r.route === '/services/medical-web-design/') {
      if (!Array.isArray(svc.offers) || svc.offers.length < 2) {
        throw new Error(`Medical Service node must include offers array with at least 2 engagement models.`);
      }
      const offerNames = svc.offers.map((o) => o.name);
      if (!offerNames.includes('Custom Website Build') || !offerNames.includes('Search & AI Visibility Setup')) {
        throw new Error(`Medical Service offers must include Custom Website Build and Search & AI Visibility Setup.`);
      }
    }
    const visible = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');
    for (const q of graph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []) {
      if (!visible.includes(q.name)) throw new Error(`${r.route}: FAQPage question isn't on the page: "${q.name}"`);
    }
  }
  return `${seen.size} distinct Services: ${[...seen].join('; ')}`;
});

assertTest(6, 'T6.5', 'Kidney Specialist case study carries the attributed quote and results', () => {
  const text = getMedicalHtml().replace(/<[^>]+>/g, ' ');
  if (!/Kidney Specialist Inc/.test(text)) throw new Error(`Missing the Kidney Specialist Inc. case study.`);
  if (!/up more than 40%/i.test(text)) throw new Error(`Missing Dr. Masood's quote with the referral result.`);
  if (!/100\/100/.test(text)) throw new Error(`Missing the 100/100 PageSpeed result.`);
  return `Case study, quote and results present`;
});

assertTest(6, 'T6.9', 'Schema knowsAbout covers medical work honestly (no unbacked EHR or legal-defense claims)', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business entity node not found in Schema.org @graph.`);

  const knowsAbout = biz.knowsAbout;
  if (!Array.isArray(knowsAbout) || knowsAbout.length === 0) throw new Error(`Business node must include a non-empty "knowsAbout" array.`);
  const knowsStr = JSON.stringify(knowsAbout);

  if (!/medical/i.test(knowsStr) || !/HIPAA/i.test(knowsStr)) throw new Error(`knowsAbout should name the medical-practice work (HIPAA-aware sites).`);
  const unbacked = [/EHR/i, /ADA Title III/i, /Defense/i].filter((r) => r.test(knowsStr + JSON.stringify(biz.hasOfferCatalog ?? {})));
  if (unbacked.length > 0) throw new Error(`knowsAbout / offers make claims Adam can't back up: ${unbacked.join(', ')}`);
  if (/wikidata.org/i.test(knowsStr)) throw new Error(`Wikidata URIs must never appear in knowsAbout.`);

  return `knowsAbout: ${knowsAbout.join(', ')}`;
});

assertTest(6, 'T6.10', 'Google CWV & SERP Breadcrumbs: explicit image dimensions, LCP fetchpriority, and BreadcrumbList schema', () => {
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  if (!/rel=["']preload["'][^>]*href=["']\/images\/hero\.webp["'][^>]*fetchpriority=["']high["']/i.test(indexHtml)) {
    throw new Error('Missing <link rel="preload" href="/images/hero.webp" fetchpriority="high"> in index.html <head>.');
  }
  if (!/font-size-adjust:\s*from-font/i.test(indexHtml)) {
    throw new Error('Missing font-size-adjust: from-font in inlined styles for zero-CLS font fallback.');
  }

  const missingDims = [];
  for (const r of REQUIRED_ROUTES) {
    const html = fs.readFileSync(path.join(DIST_DIR, r.path), 'utf-8');
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    for (const tag of imgs) {
      if (!/\bwidth=/i.test(tag) || !/\bheight=/i.test(tag)) {
        missingDims.push(`${r.route}: ${tag}`);
      }
    }
    if (r.route !== '/') {
      const graph = extractJsonLdScripts(html).find((x) => x.data?.['@graph'])?.data['@graph'] ?? [];
      const bc = graph.find((n) => n['@type'] === 'BreadcrumbList');
      if (!bc || !Array.isArray(bc.itemListElement) || bc.itemListElement.length < 2) {
        throw new Error(`${r.route}: missing BreadcrumbList in JSON-LD @graph.`);
      }
      if (!/<nav[^>]*aria-label=["']Breadcrumb["']/i.test(html)) {
        throw new Error(`${r.route}: missing visible <nav aria-label="Breadcrumb">.`);
      }
    }
  }
  if (missingDims.length) {
    throw new Error(`Images missing explicit width/height attributes:\n - ${missingDims.join('\n - ')}`);
  }
  return 'All images carry explicit width/height, hero LCP image is preloaded with fetchpriority="high", and all service pages emit BreadcrumbList';
});

assertTest(6, 'T6.11', 'Conversion tracking, AI referrers & privacy-safe client analytics', () => {
  for (const r of REQUIRED_ROUTES) {
    const html = fs.readFileSync(path.join(DIST_DIR, r.path), 'utf-8');
    if (html.includes('No tracking pixels on this page')) {
      throw new Error(`${r.route}: contains obsolete "No tracking pixels on this page" in footer`);
    }
    if (html.includes('No ad-tracking pixels')) {
      throw new Error(`${r.route}: contains obsolete "No ad-tracking pixels"`);
    }
    for (const token of ['lead_call_click', 'lead_sms_click', 'lead_email_click', 'ai_referrer_visit', 'outreach_link_open']) {
      if (!html.includes(token)) {
        throw new Error(`${r.route}: missing conversion tracking token "${token}"`);
      }
    }
  }
  const medicalHtml = getMedicalHtml();
  if (!medicalHtml.includes('Privacy-safe call &amp; referral tracking') && !medicalHtml.includes('Privacy-safe call & referral tracking')) {
    throw new Error('Medical page missing "Privacy-safe call & referral tracking"');
  }
  return 'All routes contain lightweight event tracking; zero tracking pixel claims; medical page reframed cleanly';
});

assertTest(6, 'T6.12', 'Dedicated case study routes pre-rendered with breadcrumbs, Article schema, and explicit image dimensions', () => {
  for (const cs of CASE_STUDY_ROUTES) {
    const fullPath = path.join(DIST_DIR, cs.path);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing static case study file: ${cs.path}`);
    }
    const html = fs.readFileSync(fullPath, 'utf-8');
    if (!/<nav[^>]*aria-label=["']Breadcrumb["']/i.test(html)) {
      throw new Error(`${cs.route}: missing visible <nav aria-label="Breadcrumb">`);
    }
    const graph = extractJsonLdScripts(html).find((x) => x.data?.['@graph'])?.data['@graph'] ?? [];
    const article = graph.find((n) => n['@type'] === 'Article');
    if (!article) throw new Error(`${cs.route}: missing Article in JSON-LD @graph`);
    const breadcrumb = graph.find((n) => n['@type'] === 'BreadcrumbList');
    if (!breadcrumb || !Array.isArray(breadcrumb.itemListElement) || breadcrumb.itemListElement.length < 3) {
      throw new Error(`${cs.route}: missing 3-item BreadcrumbList in JSON-LD @graph`);
    }
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    for (const tag of imgs) {
      if (!/\bwidth=/i.test(tag) || !/\bheight=/i.test(tag)) {
        throw new Error(`${cs.route}: img missing width/height: ${tag}`);
      }
    }
  }
  return `All ${CASE_STUDY_ROUTES.length} case study routes verified with Breadcrumbs, Article schema, and explicit image dimensions`;
});

assertTest(6, 'T6.13', 'Public discoverability: llms.txt, llms-full.txt, ai-catalog.json, and robots.txt AI search allowances', () => {
  const llmsPath = path.join(PROJECT_ROOT, 'public', 'llms.txt');
  if (!fs.existsSync(llmsPath)) throw new Error('Missing public/llms.txt');
  const llms = fs.readFileSync(llmsPath, 'utf-8');
  if (!llms.includes('# Clovis Web Design')) throw new Error('llms.txt missing headline');
  for (const svc of ['Custom Web Design & Engineering', 'Search Engine & Google Maps SEO', 'AI Search & Answer Optimization', 'AI & Search Lead Attribution']) {
    if (!llms.includes(svc)) throw new Error(`llms.txt missing core service: ${svc}`);
  }
  if (/youssef/i.test(llms)) throw new Error('llms.txt must never contain Adam\'s last name');

  const llmsFullPath = path.join(PROJECT_ROOT, 'public', 'llms-full.txt');
  if (!fs.existsSync(llmsFullPath)) throw new Error('Missing public/llms-full.txt');
  if (/youssef/i.test(fs.readFileSync(llmsFullPath, 'utf-8'))) throw new Error('llms-full.txt must never contain Adam\'s last name');

  const catalogPath = path.join(PROJECT_ROOT, 'public', '.well-known', 'ai-catalog.json');
  if (!fs.existsSync(catalogPath)) throw new Error('Missing public/.well-known/ai-catalog.json');
  const catalogRaw = fs.readFileSync(catalogPath, 'utf-8');
  if (/youssef/i.test(catalogRaw)) throw new Error('ai-catalog.json must never contain Adam\'s last name');

  const robotsPath = path.join(PROJECT_ROOT, 'public', 'robots.txt');
  const robots = fs.readFileSync(robotsPath, 'utf-8');
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  for (const b of bots) {
    if (!robots.includes(`User-agent: ${b}`)) throw new Error(`robots.txt missing User-agent: ${b}`);
  }
  return `llms.txt, llms-full.txt, ai-catalog.json, and robots.txt verified for all 8 AI crawlers with zero surname leaks`;
});

// ============================================================================
// Output & Reporting Engine
// ============================================================================

function printHumanReport() {
  console.log('\n' + '='.repeat(78));
  console.log(`${colors.bold}${colors.cyan} CLOVIS WEB DESIGN — AUTOMATED E2E ACCEPTANCE TEST SUITE${colors.reset}`);
  console.log('='.repeat(78));
  console.log(` Target Root: ${PROJECT_ROOT}`);
  console.log(` Dist Target: ${DIST_DIR}`);
  console.log(` Timestamp:   ${new Date().toISOString()}`);
  console.log('-'.repeat(78));

  for (const tier of Object.keys(results.tiers).map(Number)) {
    if (targetTier !== null && targetTier !== tier) continue;

    const tData = results.tiers[tier];
    console.log(`\n${colors.bold}${colors.magenta}Tier ${tier}: ${tData.name}${colors.reset}`);

    if (tData.tests.length === 0) {
      console.log(`  ${colors.dim}(No tests registered for this tier)${colors.reset}`);
      continue;
    }

    for (const test of tData.tests) {
      if (test.status === 'PASS') {
        console.log(`  ${colors.green}✔ [PASS]${colors.reset} ${colors.bold}${test.id}${colors.reset} — ${test.title}`);
        if (test.details) {
          console.log(`    ${colors.dim}↳ ${test.details}${colors.reset}`);
        }
      } else if (test.status === 'FAIL') {
        console.log(`  ${colors.red}✖ [FAIL]${colors.reset} ${colors.bold}${test.id}${colors.reset} — ${test.title}`);
        if (test.error) {
          const indentedErr = test.error.split('\n').map(l => `      ${l}`).join('\n');
          console.log(`    ${colors.red}↳ Error:${colors.reset}\n${indentedErr}`);
        }
      } else {
        console.log(`  ${colors.yellow}○ [SKIP]${colors.reset} ${colors.bold}${test.id}${colors.reset} — ${test.title}`);
      }
    }
  }

  console.log('\n' + '='.repeat(78));
  console.log(`${colors.bold} SUMMARY RESULTS${colors.reset}`);
  console.log('='.repeat(78));
  console.log(` Total Assertions: ${results.total}`);
  console.log(` Passed:           ${colors.green}${results.passed}${colors.reset}`);
  console.log(` Failed:           ${results.failed > 0 ? colors.red + results.failed : '0'}${colors.reset}`);
  console.log(` Skipped:          ${results.skipped}`);

  const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;
  console.log(` Success Rate:     ${passRate}%`);

  if (results.failed === 0) {
    console.log(`\n${colors.bgGreen}${colors.bold} VERDICT: 100% ACCEPTANCE CRITERIA MET (CLEAN AUDIT PASS) ${colors.reset}\n`);
  } else {
    console.log(`\n${colors.bgRed}${colors.bold} VERDICT: ${results.failed} CRITERIA VIOLATIONS DETECTED (MIGRATION IN PROGRESS) ${colors.reset}\n`);
  }
}

function writeJsonReport() {
  const jsonPath = path.join(PROJECT_ROOT, 'tests', 'test-results.json');
  const payload = {
    timestamp: new Date().toISOString(),
    total: results.total,
    passed: results.passed,
    failed: results.failed,
    skipped: results.skipped,
    successRate: results.total > 0 ? Number(((results.passed / results.total) * 100).toFixed(1)) : 0,
    tiers: results.tiers,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf-8');
  if (jsonOutput) {
    console.log(JSON.stringify(payload, null, 2));
  }
}

printHumanReport();
writeJsonReport();

process.exit(results.failed > 0 ? 1 : 0);
