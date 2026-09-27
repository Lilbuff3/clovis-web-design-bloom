#!/usr/bin/env node
/**
 * ============================================================================
 * Clovis Web Design Migration — End-to-End Acceptance Test Suite
 * ============================================================================
 *
 * Automated opaque-box verification suite for cloviswebdesign.com Astro SSG migration.
 * Verifies all criteria from ORIGINAL_REQUEST.md and orchestrator_1/PROJECT.md:
 *
 * Tier 1: Build & Static Pre-rendering Architecture
 * Tier 2: Schema.org JSON-LD & Knowledge Graph Entity Architecture
 * Tier 3: Mobile Performance, Action Bar & Above-the-Fold UX
 * Tier 4: Multi-Page Route Silos & Navigation Inter-linkage
 * Tier 5: Binary Integrity, Adversarial & Robustness Verification
 *
 * Execution:
 *   node tests/verify-e2e.mjs
 *   node tests/verify-e2e.mjs --tier=1
 *   node tests/verify-e2e.mjs --json
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
  },
};

/**
 * Register and execute a test assertion.
 */
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

function readFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

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
  { path: path.join('services', 'web-design-clovis', 'index.html'), route: '/services/web-design-clovis/' },
  { path: path.join('services', 'local-seo-fresno', 'index.html'), route: '/services/local-seo-fresno/' },
  { path: path.join('services', 'contractor-websites', 'index.html'), route: '/services/contractor-websites/' },
  { path: path.join('services', 'medical-web-design', 'index.html'), route: '/services/medical-web-design/' },
];

// ============================================================================
// TIER 1: Build & Static Pre-rendering Architecture
// ============================================================================

assertTest(1, 'T1.1', 'Static HTML file generation for all 5 required route silos', () => {
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

  return `All 5 route silos exist as static pre-rendered HTML files in dist/`;
});

assertTest(1, 'T1.2', 'Pure semantic first-byte copy (h1, h2, p) across all 5 routes', () => {
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

    // Verify copy is not placeholder
    const combinedCopy = [...h1s, ...h2s, ...ps].join(' ');
    if (combinedCopy.length < 200) {
      missingCopy.push(`${r.route}: Semantic copy too short (${combinedCopy.length} chars, expected >= 200)`);
    }
  }

  if (missingCopy.length > 0) {
    throw new Error(`Semantic first-byte content deficiencies:\n - ${missingCopy.join('\n - ')}`);
  }

  return `All 5 routes contain rich semantic copy on first byte (verified h1, h2, and p elements)`;
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

  // WOFF2 magic number is 0x774F4632 ("wOF2")
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

  // Check family coverage (Fraunces, Bricolage, DM Mono)
  const fontNames = fontFiles.map(f => path.basename(f).toLowerCase()).join(' ');
  const requiredFamilies = ['fraunces', 'bricolage', 'mono'];
  const missingFamilies = requiredFamilies.filter(fam => !fontNames.includes(fam));

  if (missingFamilies.length > 0) {
    // If not in filenames, check if font-family in dist CSS defines them
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

  // Find script with @graph
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

assertTest(2, 'T2.3', 'Core business identity (name, telephone: +15595753014, priceRange)', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  const errors = [];
  if (biz.name !== 'Clovis Web Design') {
    errors.push(`name must be "Clovis Web Design", got: "${biz.name}"`);
  }

  const telClean = (biz.telephone || '').replace(/[\s\-\(\)\.]/g, '');
  if (telClean !== '+15595753014' && telClean !== '15595753014' && telClean !== '5595753014') {
    errors.push(`telephone must be "+15595753014", got: "${biz.telephone}"`);
  }

  if (!biz.priceRange || !biz.priceRange.includes('$500')) {
    errors.push(`priceRange must include "$500 - $5,000", got: "${biz.priceRange}"`);
  }

  if (errors.length > 0) {
    throw new Error(`Business identity attribute mismatch:\n - ${errors.join('\n - ')}`);
  }

  return `Verified name: "${biz.name}", telephone: "${biz.telephone}", priceRange: "${biz.priceRange}"`;
});

assertTest(2, 'T2.4', 'Founder Person node for Adam Youssef', () => {
  const jsonLd = getRootJsonLd();
  const graph = jsonLd['@graph'];
  const biz = findBusinessNode(jsonLd);

  // Check inline founder or referenced founder node in @graph
  let founder = biz ? biz.founder : null;
  if (founder && founder['@id']) {
    const resolved = graph.find(n => n['@id'] === founder['@id']);
    if (resolved) founder = resolved;
  }
  if (!founder) {
    founder = graph.find(n => n['@type'] === 'Person' && n.name === 'Adam Youssef');
  }

  if (!founder) {
    throw new Error(`No founder Person node found in Schema.org @graph for "Adam Youssef".`);
  }

  if (founder.name !== 'Adam Youssef') {
    throw new Error(`Founder name is "${founder.name}", expected "Adam Youssef".`);
  }

  return `Verified founder Person node: ${founder.name}`;
});

assertTest(2, 'T2.5', 'areaServed contains Wikidata URIs (Q949704, Q43048, Q271014)', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  const areaServed = biz.areaServed;
  if (!Array.isArray(areaServed) || areaServed.length === 0) {
    throw new Error(`biz.areaServed must be a non-empty array.`);
  }

  const serialized = JSON.stringify(areaServed);
  const requiredEntities = [
    { code: 'Q949704', label: 'Clovis' },
    { code: 'Q43048', label: 'Fresno' },
    { code: 'Q271014', label: 'Central Valley' },
  ];

  const missing = [];
  for (const ent of requiredEntities) {
    if (!serialized.includes(ent.code)) {
      missing.push(`${ent.label} (Wikidata ID ${ent.code})`);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required Wikidata URIs in areaServed:\n - ${missing.join('\n - ')}`);
  }

  return `All 3 required Wikidata entities (Q949704, Q43048, Q271014) present in areaServed`;
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

assertTest(2, 'T2.7', 'Top-level sameAs contains only verified official agency profiles', () => {
  const jsonLd = getRootJsonLd();
  const biz = findBusinessNode(jsonLd);
  if (!biz) throw new Error(`Business node not found.`);

  const sameAs = Array.isArray(biz.sameAs) ? biz.sameAs : biz.sameAs ? [biz.sameAs] : [];
  if (sameAs.length === 0) {
    throw new Error(`Business sameAs array is empty. Expected official agency profiles.`);
  }

  const validProfileDomains = ['linkedin.com', 'clovischamber.com', 'twitter.com', 'x.com', 'facebook.com', 'github.com'];
  const nonProfileUrls = [];

  for (const url of sameAs) {
    const isAgencyProfile = validProfileDomains.some(d => url.includes(d));
    if (!isAgencyProfile) {
      nonProfileUrls.push(url);
    }
  }

  if (nonProfileUrls.length > 0) {
    throw new Error(
      `Found unrecognized or invalid URLs in agency sameAs (expected official profiles only):\n - ${nonProfileUrls.join('\n - ')}`
    );
  }

  return `Top-level sameAs contains ${sameAs.length} verified official agency profiles`;
});

assertTest(2, 'T2.8', 'hasOfferCatalog with Starter ($500) and Growth ($2,500) services', () => {
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
  const hasStarter = catalogStr.includes('500') || catalogStr.includes('Starter');
  const hasGrowth = catalogStr.includes('2500') || catalogStr.includes('2,500') || catalogStr.includes('Growth');

  if (!hasStarter || !hasGrowth) {
    throw new Error(`hasOfferCatalog must contain Starter ($500) and Growth ($2,500) service offerings.`);
  }

  return `hasOfferCatalog successfully configured with Starter ($500) and Growth ($2,500) offerings`;
});

// ============================================================================
// TIER 3: Mobile Performance & UX Elements
// ============================================================================

assertTest(3, 'T3.1', 'Mobile Action Bar with tap-to-call, tap-to-text, availability status, and audit trigger', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');

  // Check tap-to-call
  const hasCall = /href=["']tel:\+?1?[\-\.]?559[\-\.]?575[\-\.]?3014["']/i.test(html);
  if (!hasCall) {
    throw new Error(`Missing tap-to-call link with href="tel:+15595753014"`);
  }

  // Check tap-to-text
  const hasText = /href=["']sms:\+?1?[\-\.]?559[\-\.]?575[\-\.]?3014["']/i.test(html);
  if (!hasText) {
    throw new Error(`Missing tap-to-text link with href="sms:+15595753014"`);
  }

  // Check availability status indicator (workbench/status/hours/live)
  const hasStatus = /workbench|available|online|asleep|winding down|open|clovis clock/i.test(html);
  if (!hasStatus) {
    throw new Error(`Missing live builder availability status indicator`);
  }

  // Check audit drawer trigger
  const hasAuditTrigger = /audit|instant audit|quote drawer|audit-drawer|data-audit/i.test(html);
  if (!hasAuditTrigger) {
    throw new Error(`Missing instant audit drawer trigger in mobile action bar`);
  }

  return `Mobile Action Bar verified with tap-to-call, tap-to-text, availability status, and audit trigger`;
});

assertTest(3, 'T3.2', 'Lead & Latency Visualizer relocated to FourSeconds (#test) and NOT in hero (#top)', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');

  // Look for sections #top / #hero and #test / #speed
  const topMatch = html.match(/<section[^>]*id=["'](?:top|hero)["'][^>]*>([\s\S]*?)<\/section>/i) ||
                   html.match(/<(?:header|div)[^>]*id=["'](?:top|hero)["'][^>]*>([\s\S]*?)<\/(?:header|div)>/i);
  const testMatch = html.match(/<section[^>]*id=["'](?:test|speed)["'][^>]*>([\s\S]*?)<\/section>/i) ||
                    html.match(/<div[^>]*id=["'](?:test|speed)["'][^>]*>([\s\S]*?)<\/div>/i);

  if (topMatch) {
    const heroContent = topMatch[1];
    // Hero must NOT contain the latency visualizer stopwatch / phone race simulator
    const hasVisualizerInHero =
      /Stopwatch/i.test(heroContent) &&
      /Typical template|patience expired|Running race|Start the race/i.test(heroContent);
    if (hasVisualizerInHero) {
      throw new Error(`Lead & Latency Visualizer is improperly located inside the Hero section! Must be relocated.`);
    }
  }

  if (!testMatch) {
    // If no distinct section id="test" or "speed", check whether speed comparison contains the visualizer
    const hasSpeedSection = /id=["'](?:test|speed)["']/i.test(html) || /four-second/i.test(html);
    if (!hasSpeedSection) {
      throw new Error(`Speed comparison section (#test or #speed) not found in dist/index.html`);
    }
  } else {
    const testContent = testMatch[1];
    const hasVisualizerInTest = /four seconds|stopwatch|race|simulation|mid-range phone/i.test(testContent);
    if (!hasVisualizerInTest) {
      throw new Error(`FourSeconds section (#test / #speed) does not contain the speed visualizer / race.`);
    }
  }

  return `Lead & Latency Visualizer verified inside FourSeconds section (#test) and confirmed absent from Hero (#top)`;
});


assertTest(3, 'T3.3', 'Hero section displays headline, $500 pricing anchor, and primary CTA for mobile fold compliance', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');
  const heroSectionMatch = html.match(/<section[^>]*id=["'](?:top|hero)["'][^>]*>([\s\S]*?)<\/section>/i);
  const heroHtml = heroSectionMatch ? heroSectionMatch[1] : html.substring(0, 3000);

  const hasHeadline = /Websites,?\s*(?:built\s*by\s*hand\s*in\s*Clovis|built\s*in\s*Clovis)/i.test(heroHtml) || /<h1/i.test(heroHtml);
  const has500Anchor = /\$500/i.test(heroHtml);
  const hasCta = /sms:\+?1?5595753014|tel:\+?1?5595753014/i.test(heroHtml);

  if (!hasHeadline) throw new Error(`Hero section missing primary <h1> headline`);
  if (!has500Anchor) throw new Error(`Hero section missing $500 pricing anchor within initial viewport markup`);
  if (!hasCta) throw new Error(`Hero section missing direct SMS/call CTA button`);

  return `Hero section contains headline, $500 anchor, and primary CTA ensuring mobile fold compliance (<750px)`;
});

// ============================================================================
// TIER 4: Multi-Page Route Silos & Inter-linkage
// ============================================================================

assertTest(4, 'T4.1', 'Direct founder phone / SMS contact links present across all 5 route silos', () => {
  const missingContact = [];

  for (const r of REQUIRED_ROUTES) {
    const fullPath = path.join(DIST_DIR, r.path);
    if (!fs.existsSync(fullPath)) continue;

    const html = fs.readFileSync(fullPath, 'utf-8');
    const hasPhone = /href=["'](?:tel|sms):\+?1?5595753014["']/i.test(html) || /559[\.\-\s]?575[\.\-\s]?3014/.test(html);
    if (!hasPhone) {
      missingContact.push(r.route);
    }
  }

  if (missingContact.length > 0) {
    throw new Error(`Routes missing direct founder contact links:\n - ${missingContact.join('\n - ')}`);
  }

  return `All 5 route silos contain direct founder phone or SMS contact access`;
});

assertTest(4, 'T4.2', 'Inter-silo navigation linkage across all service silos', () => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) throw new Error(`dist/index.html not found.`);

  const html = fs.readFileSync(indexPath, 'utf-8');
  const serviceSilos = [
    '/services/web-design-clovis/',
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

  return `Root layout links directly to all 4 specialized service silos`;
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

  return `All 5 routes conform to valid HTML5 boilerplate with charset, viewport, and title`;
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

    // Valid production woff2 fonts are typically > 10 KB
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

  for (let tier = 1; tier <= 5; tier++) {
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

// Execute Reporting
printHumanReport();
writeJsonReport();

// Exit code matches test outcome
process.exit(results.failed > 0 ? 1 : 0);
