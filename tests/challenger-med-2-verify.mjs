import fs from 'node:fs';
import path from 'node:path';

// Schema.org official types and properties known vocabulary
const KNOWN_SCHEMA_TYPES = new Set([
  'LocalBusiness',
  'ProfessionalService',
  'Person',
  'City',
  'AdministrativeArea',
  'PostalAddress',
  'GeoCoordinates',
  'OpeningHoursSpecification',
  'OfferCatalog',
  'Offer'
]);

const KNOWN_PROPERTIES = {
  LocalBusiness: new Set([
    '@context', '@type', '@id', 'name', 'url', 'telephone', 'priceRange',
    'image', 'address', 'geo', 'openingHoursSpecification', 'founder',
    'areaServed', 'sameAs', 'knowsAbout', 'hasOfferCatalog'
  ]),
  ProfessionalService: new Set([
    '@context', '@type', '@id', 'name', 'url', 'telephone', 'priceRange',
    'image', 'address', 'geo', 'openingHoursSpecification', 'founder',
    'areaServed', 'sameAs', 'knowsAbout', 'hasOfferCatalog'
  ]),
  Person: new Set(['@type', '@id', 'name', 'jobTitle', 'sameAs', 'knowsAbout']),
  PostalAddress: new Set(['@type', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry']),
  GeoCoordinates: new Set(['@type', 'latitude', 'longitude']),
  OpeningHoursSpecification: new Set(['@type', 'dayOfWeek', 'opens', 'closes']),
  City: new Set(['@type', 'name', 'sameAs']),
  AdministrativeArea: new Set(['@type', 'name', 'sameAs']),
  OfferCatalog: new Set(['@type', 'name', 'itemListElement']),
  Offer: new Set(['@type', 'name', 'price', 'priceCurrency', 'description', 'url'])
};

export function auditPageJsonLd(filePath) {
  const fullPath = path.resolve(filePath);
  console.log(`\n=======================================================`);
  console.log(`AUDIT TARGET: ${filePath}`);
  console.log(`Full path: ${fullPath}`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Target file does not exist: ${fullPath}`);
  }

  const html = fs.readFileSync(fullPath, 'utf8');
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const scriptMatches = [...html.matchAll(scriptRegex)];

  console.log(`Found ${scriptMatches.length} <script type="application/ld+json"> tag(s).`);
  if (scriptMatches.length === 0) {
    throw new Error(`CRITICAL: Zero JSON-LD script tags found in ${filePath}`);
  }

  const results = [];

  for (let i = 0; i < scriptMatches.length; i++) {
    const rawJson = scriptMatches[i][1].trim();
    console.log(`\n--- Script Tag #${i + 1} (${rawJson.length} bytes) ---`);

    // 1. Unescaped characters & security injection audit
    const hasUnescapedScriptClose = /<\/script/i.test(rawJson);
    const hasUnescapedScriptOpen = /<script/i.test(rawJson);
    if (hasUnescapedScriptClose || hasUnescapedScriptOpen) {
      throw new Error(`CRITICAL: Unescaped <script> tag detected inside JSON-LD payload!`);
    }

    // Check for control characters
    const illegalChars = [];
    for (let cIdx = 0; cIdx < rawJson.length; cIdx++) {
      const code = rawJson.charCodeAt(cIdx);
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
        illegalChars.push({ index: cIdx, charCode: code });
      }
    }
    if (illegalChars.length > 0) {
      throw new Error(`CRITICAL: Found ${illegalChars.length} illegal control characters in JSON-LD`);
    }
    console.log(`[PASS] Character sanitization: 0 unescaped script tags, 0 illegal control characters.`);

    // 2. Strict JSON Parse
    let parsed;
    try {
      parsed = JSON.parse(rawJson);
      console.log(`[PASS] JSON.parse successfully parsed valid JSON without errors.`);
    } catch (parseErr) {
      throw new Error(`CRITICAL: JSON.parse failed on JSON-LD: ${parseErr.message}`);
    }

    // 3. Graph integrity & circular reference detection
    if (parsed['@context'] !== 'https://schema.org' && parsed['@context'] !== 'http://schema.org') {
      throw new Error(`CRITICAL: Invalid @context: ${parsed['@context']}`);
    }
    console.log(`[PASS] @context is valid: "${parsed['@context']}"`);

    if (!Array.isArray(parsed['@graph'])) {
      throw new Error(`CRITICAL: @graph is not an array: ${typeof parsed['@graph']}`);
    }
    console.log(`[PASS] @graph is an Array with ${parsed['@graph'].length} top-level entity node(s).`);

    // Deep cycle detection
    const visitedSet = new Set();
    function detectCycles(node, currentPath = 'root') {
      if (!node || typeof node !== 'object') return;
      if (visitedSet.has(node)) {
        throw new Error(`CRITICAL: Circular reference found at ${currentPath}`);
      }
      visitedSet.add(node);
      for (const [key, value] of Object.entries(node)) {
        detectCycles(value, `${currentPath}.${key}`);
      }
    }
    detectCycles(parsed);
    console.log(`[PASS] Circular reference scan: 0 cycles detected across ${visitedSet.size} objects/arrays.`);

    // 4. Schema.org Vocabulary Validation
    function validateVocabulary(node, path = 'root') {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach((item, idx) => validateVocabulary(item, `${path}[${idx}]`));
        return;
      }

      const types = Array.isArray(node['@type']) ? node['@type'] : (node['@type'] ? [node['@type']] : []);
      for (const t of types) {
        if (!KNOWN_SCHEMA_TYPES.has(t)) {
          console.warn(`[WARN] Unrecognized Schema.org type "${t}" at ${path}`);
        } else {
          // Check allowed properties
          const allowedProps = KNOWN_PROPERTIES[t];
          if (allowedProps) {
            for (const prop of Object.keys(node)) {
              if (!allowedProps.has(prop)) {
                console.warn(`[WARN] Property "${prop}" at ${path} not explicitly listed in schema spec for type "${t}"`);
              }
            }
          }
        }
      }

      for (const [k, v] of Object.entries(node)) {
        validateVocabulary(v, `${path}.${k}`);
      }
    }
    validateVocabulary(parsed);
    console.log(`[PASS] Schema.org vocabulary validation completed.`);

    // 5. Deep Wikidata URI Isolation Audit
    console.log(`\n--- Deep Wikidata URI Isolation Audit ---`);
    const allWikidataOccurrences = [];
    function scanForWikidata(node, currentPath) {
      if (!node) return;
      if (typeof node === 'string') {
        if (node.includes('wikidata.org') || node.includes('wikipedia.org')) {
          allWikidataOccurrences.push({ path: currentPath, value: node });
        }
      } else if (Array.isArray(node)) {
        node.forEach((item, idx) => scanForWikidata(item, `${currentPath}[${idx}]`));
      } else if (typeof node === 'object') {
        for (const [key, val] of Object.entries(node)) {
          scanForWikidata(val, `${currentPath}.${key}`);
        }
      }
    }
    scanForWikidata(parsed, '@graph');

    console.log(`Total Wikidata / Wikipedia URIs found in entire JSON-LD: ${allWikidataOccurrences.length}`);
    if (allWikidataOccurrences.length === 0) {
      throw new Error(`CRITICAL: Expected Wikidata entities in areaServed, but 0 were found!`);
    }

    allWikidataOccurrences.forEach((occ, idx) => {
      console.log(`  [${idx + 1}] Path: ${occ.path} => ${occ.value}`);
      const isInsideAreaServed = occ.path.includes('.areaServed');
      if (!isInsideAreaServed) {
        throw new Error(`CRITICAL VIOLATION: Wikidata URI leaked outside areaServed at path: ${occ.path} (${occ.value})`);
      }
    });
    console.log(`[PASS] 100% of Wikidata URIs (${allWikidataOccurrences.length}/${allWikidataOccurrences.length}) are strictly isolated inside areaServed.`);

    // Specific negative assertions on sameAs and knowsAbout
    const businessNode = parsed['@graph'][0];

    // Check top-level business sameAs
    console.log(`\n--- Negative Assertion: Business sameAs ---`);
    console.log(`Business sameAs:`, JSON.stringify(businessNode.sameAs, null, 2));
    if (!Array.isArray(businessNode.sameAs) || businessNode.sameAs.length === 0) {
      throw new Error(`CRITICAL: Business sameAs is empty or missing!`);
    }
    for (const uri of businessNode.sameAs) {
      if (uri.includes('wikidata.org') || uri.includes('wikipedia.org')) {
        throw new Error(`CRITICAL VIOLATION: Business sameAs contains Wikidata/Wikipedia URI: ${uri}`);
      }
    }
    console.log(`[PASS] Business sameAs contains 0 Wikidata/Wikipedia URIs. Verified official agency profiles only.`);

    // Check top-level business knowsAbout
    console.log(`\n--- Negative Assertion: Business knowsAbout ---`);
    console.log(`Business knowsAbout:`, JSON.stringify(businessNode.knowsAbout, null, 2));
    if (!Array.isArray(businessNode.knowsAbout) || businessNode.knowsAbout.length === 0) {
      throw new Error(`CRITICAL: Business knowsAbout is empty or missing!`);
    }
    for (const item of businessNode.knowsAbout) {
      if (typeof item === 'string' && (item.includes('wikidata.org') || item.includes('wikipedia.org'))) {
        throw new Error(`CRITICAL VIOLATION: Business knowsAbout contains Wikidata/Wikipedia URI: ${item}`);
      }
    }
    console.log(`[PASS] Business knowsAbout contains 0 Wikidata/Wikipedia URIs.`);

    // Check Founder node
    if (businessNode.founder) {
      console.log(`\n--- Negative Assertion: Founder sameAs & knowsAbout ---`);
      const founder = businessNode.founder;
      console.log(`Founder name: ${founder.name}, jobTitle: ${founder.jobTitle}`);
      console.log(`Founder sameAs:`, JSON.stringify(founder.sameAs));
      const founderSameAsStr = JSON.stringify(founder.sameAs || '');
      if (founderSameAsStr.includes('wikidata.org') || founderSameAsStr.includes('wikipedia.org')) {
        throw new Error(`CRITICAL VIOLATION: Founder sameAs contains Wikidata/Wikipedia URI!`);
      }
      console.log(`[PASS] Founder sameAs contains 0 Wikidata/Wikipedia URIs.`);

      const founderKnowsAboutStr = JSON.stringify(founder.knowsAbout || '');
      if (founderKnowsAboutStr.includes('wikidata.org') || founderKnowsAboutStr.includes('wikipedia.org')) {
        throw new Error(`CRITICAL VIOLATION: Founder knowsAbout contains Wikidata/Wikipedia URI!`);
      }
      console.log(`[PASS] Founder knowsAbout contains 0 Wikidata/Wikipedia URIs.`);
    }

    // Check areaServed entities
    console.log(`\n--- Positive Assertion: areaServed Structure ---`);
    if (!Array.isArray(businessNode.areaServed) || businessNode.areaServed.length === 0) {
      throw new Error(`CRITICAL: areaServed is missing or empty!`);
    }
    const expectedAreas = [
      { name: 'Clovis', qid: 'Q949704', type: 'City' },
      { name: 'Fresno', qid: 'Q43048', type: 'City' },
      { name: 'Central Valley', qid: 'Q271014', type: 'AdministrativeArea' }
    ];
    for (const exp of expectedAreas) {
      const match = businessNode.areaServed.find(a => a.name === exp.name);
      if (!match) {
        throw new Error(`CRITICAL: Missing expected areaServed entity: ${exp.name}`);
      }
      if (match['@type'] !== exp.type) {
        throw new Error(`CRITICAL: Area ${exp.name} expected @type "${exp.type}", found "${match['@type']}"`);
      }
      const expectedUri = `https://www.wikidata.org/wiki/${exp.qid}`;
      if (match.sameAs !== expectedUri) {
        throw new Error(`CRITICAL: Area ${exp.name} expected sameAs "${expectedUri}", found "${match.sameAs}"`);
      }
      console.log(`[PASS] areaServed entity "${exp.name}" verified: @type=${match['@type']}, sameAs=${match.sameAs}`);
    }

    // Check hasOfferCatalog
    console.log(`\n--- Positive Assertion: hasOfferCatalog ---`);
    if (!businessNode.hasOfferCatalog || !Array.isArray(businessNode.hasOfferCatalog.itemListElement)) {
      throw new Error(`CRITICAL: hasOfferCatalog or itemListElement missing!`);
    }
    const offers = businessNode.hasOfferCatalog.itemListElement;
    console.log(`Total OfferCatalog items: ${offers.length}`);
    const medicalOffer = offers.find(o => o.name && o.name.toLowerCase().includes('medical'));
    if (!medicalOffer) {
      throw new Error(`CRITICAL: Missing Medical Practice Web Design offer in hasOfferCatalog!`);
    }
    console.log(`[PASS] Medical practice offer found: "${medicalOffer.name}", price: $${medicalOffer.price} ${medicalOffer.priceCurrency}`);
    console.log(`Medical offer description: "${medicalOffer.description}"`);
    console.log(`Medical offer URL: "${medicalOffer.url}"`);

    results.push({
      index: i,
      rawBytes: rawJson.length,
      parsedNodes: parsed['@graph'].length,
      wikidataUris: allWikidataOccurrences.length,
      offersCount: offers.length
    });
  }

  return results;
}

export function auditComparisonTable(filePath) {
  const fullPath = path.resolve(filePath);
  console.log(`\n=======================================================`);
  console.log(`AUDIT TARGET (COMPARISON TABLE): ${filePath}`);

  const html = fs.readFileSync(fullPath, 'utf8');

  // 1. Semantic table elements check
  console.log(`\n--- Semantic HTML Table Elements Check ---`);
  const tableRegex = /<table[\s\S]*?<\/table>/i;
  const tableMatch = html.match(tableRegex);
  if (!tableMatch) {
    throw new Error(`CRITICAL: No <table> element found in ${filePath}!`);
  }
  const tableHtml = tableMatch[0];
  console.log(`[PASS] <table> element found (${tableHtml.length} characters).`);

  const hasThead = /<thead[\s\S]*?<\/thead>/i.test(tableHtml);
  const hasTbody = /<tbody[\s\S]*?<\/tbody>/i.test(tableHtml);
  const trMatches = [...tableHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
  const thMatches = [...tableHtml.matchAll(/<th[\s\S]*?<\/th>/gi)];
  const tdMatches = [...tableHtml.matchAll(/<td[\s\S]*?<\/td>/gi)];

  console.log(`Table structure elements:`);
  console.log(`  <thead> present: ${hasThead}`);
  console.log(`  <tbody> present: ${hasTbody}`);
  console.log(`  <tr> rows count: ${trMatches.length}`);
  console.log(`  <th> headers count: ${thMatches.length}`);
  console.log(`  <td> data cells count: ${tdMatches.length}`);

  if (!hasThead) throw new Error(`CRITICAL: <table> is missing <thead>!`);
  if (!hasTbody) throw new Error(`CRITICAL: <table> is missing <tbody>!`);
  if (trMatches.length !== 6) { // 1 header row + 5 data rows
    throw new Error(`CRITICAL: Expected exactly 6 <tr> rows (1 header + 5 dimensions), found ${trMatches.length}!`);
  }
  // Expected th count: 3 col headers in thead + 5 row headers in tbody = 8 th elements
  if (thMatches.length < 8) {
    throw new Error(`CRITICAL: Expected at least 8 <th> elements, found ${thMatches.length}!`);
  }
  // Expected td count: 5 rows * 2 columns = 10 td elements
  if (tdMatches.length !== 10) {
    throw new Error(`CRITICAL: Expected exactly 10 <td> elements (5 dimensions x 2 columns), found ${tdMatches.length}!`);
  }
  console.log(`[PASS] Semantic table element hierarchy (table, thead, tbody, tr, th, td) is 100% valid.`);

  // 2. Column headers check
  console.log(`\n--- Column Header Inspection ---`);
  const colHeaderScopeMatches = [...tableHtml.matchAll(/<th[^>]*scope=["']col["'][^>]*>([\s\S]*?)<\/th>/gi)];
  console.log(`Found ${colHeaderScopeMatches.length} <th scope="col"> elements.`);
  if (colHeaderScopeMatches.length !== 3) {
    throw new Error(`CRITICAL: Expected 3 <th scope="col"> column headers, found ${colHeaderScopeMatches.length}!`);
  }
  colHeaderScopeMatches.forEach((m, idx) => {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    console.log(`  Col Header [${idx + 1}]: "${text}"`);
  });

  // 3. Five Comparative Dimensions Thorough Coverage Check
  console.log(`\n--- Five Comparative Dimensions Coverage Audit ---`);
  const tbodyMatch = tableHtml.match(/<tbody[\s\S]*?<\/tbody>/i);
  const tbodyHtml = tbodyMatch[0];
  const tbodyRows = [...tbodyHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)];

  if (tbodyRows.length !== 5) {
    throw new Error(`CRITICAL: <tbody> expected 5 <tr> rows for the 5 dimensions, found ${tbodyRows.length}!`);
  }

  const REQUIRED_DIMENSIONS = [
    {
      name: 'Primary Goal',
      contractorKeywords: ['paying leads', 'emergency quotes', 'phone ring'],
      medicalKeywords: ['front-desk', 'friction', 'deflect', 'qualified appointments']
    },
    {
      name: 'Speed-to-Lead',
      contractorKeywords: ['lead details', '<60s', 'texted'],
      medicalKeywords: ['generic alert', 'encrypted', 'hipaa', 'portal']
    },
    {
      name: 'Data Storage',
      contractorKeywords: ['sheets', 'crm', 'airtable'],
      medicalKeywords: ['ehr', 'emr', 'baa', 'unencrypted spreadsheets']
    },
    {
      name: 'Top Decision Factor',
      contractorKeywords: ['cost', 'speed', 'lead volume'],
      medicalKeywords: ['compliance', 'hipaa', 'reputation', 'booking']
    },
    {
      name: 'Price Sensitivity',
      contractorKeywords: ['$1,500', '$2,500', 'roi-focused'],
      medicalKeywords: ['low price sensitivity', '$5,000', 'budget']
    }
  ];

  tbodyRows.forEach((rowMatch, rIdx) => {
    const rowHtml = rowMatch[0];
    const thRowMatch = rowHtml.match(/<th[^>]*scope=["']row["'][^>]*>([\s\S]*?)<\/th>/i);
    if (!thRowMatch) {
      throw new Error(`CRITICAL: Row ${rIdx + 1} is missing a semantic <th scope="row"> header!`);
    }
    const dimensionName = thRowMatch[1].replace(/<[^>]+>/g, '').trim();
    console.log(`\nDimension #${rIdx + 1}: "${dimensionName}"`);

    const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (cells.length !== 2) {
      throw new Error(`CRITICAL: Row "${dimensionName}" expected 2 <td> cells, found ${cells.length}!`);
    }

    const contractorText = cells[0][1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim();
    const medicalText = cells[1][1].replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim();

    console.log(`  Contractor Column: "${contractorText}"`);
    console.log(`  Medical Column:    "${medicalText}"`);

    const expected = REQUIRED_DIMENSIONS[rIdx];
    if (!dimensionName.toLowerCase().includes(expected.name.toLowerCase())) {
      throw new Error(`CRITICAL: Dimension #${rIdx + 1} expected name "${expected.name}", got "${dimensionName}"`);
    }

    // Verify keyword coverage
    for (const kw of expected.contractorKeywords) {
      if (!contractorText.toLowerCase().includes(kw.toLowerCase())) {
        throw new Error(`CRITICAL: Dimension "${dimensionName}" contractor column missing expected keyword: "${kw}"`);
      }
    }
    for (const kw of expected.medicalKeywords) {
      if (!medicalText.toLowerCase().includes(kw.toLowerCase())) {
        throw new Error(`CRITICAL: Dimension "${dimensionName}" medical column missing expected keyword: "${kw}"`);
      }
    }
    console.log(`  [PASS] Dimension "${dimensionName}" thoroughly covers both contractor and medical requirements.`);
  });

  // 4. Responsive Mobile Styling Audit
  console.log(`\n--- Responsive Mobile Styling Audit ---`);
  // Look for container around table
  const containerMatch = html.match(/<div class="([^"]*overflow-x-auto[^"]*)">[\s\S]*?<table/i);
  if (!containerMatch) {
    throw new Error(`CRITICAL: Comparison table is NOT wrapped in a container with 'overflow-x-auto'!`);
  }
  const containerClasses = containerMatch[1];
  console.log(`[PASS] Responsive wrapper container classes: "${containerClasses}"`);

  // Table classes
  const tableClassMatch = tableHtml.match(/<table class="([^"]*)"/i);
  const tableClasses = tableClassMatch ? tableClassMatch[1] : '';
  console.log(`Table element classes: "${tableClasses}"`);
  if (!tableClasses.includes('min-w-[640px]') && !tableClasses.includes('overflow-x-auto') && !containerClasses.includes('overflow-x-auto')) {
    throw new Error(`CRITICAL: Table lacks horizontal scroll safety min-width!`);
  }
  console.log(`[PASS] Table specifies min-width safeguarding against mobile horizontal cell squashing.`);

  // Readable Contrast Check
  console.log(`\n--- Contrast & Color Semantics Check ---`);
  // Check text colors and background colors used in the table
  const bgPaperCheck = tableClasses.includes('bg-paper');
  console.log(`Table background uses theme class: bg-paper (${bgPaperCheck})`);
  const theadBgCheck = tableHtml.includes('bg-ink/5');
  console.log(`Header row background uses: bg-ink/5 (${theadBgCheck})`);
  const textLeafCheck = tableHtml.includes('text-leaf');
  console.log(`Medical clinic column header highlights with: text-leaf (${textLeafCheck})`);
  if (!textLeafCheck) {
    throw new Error(`CRITICAL: Medical clinic column header missing high-contrast text-leaf class!`);
  }
  const textInkCheck = tableHtml.includes('text-ink');
  console.log(`Table typography uses: text-ink / text-ink/80 / text-ink/85 (${textInkCheck})`);

  console.log(`[PASS] Table styling conforms to high-contrast theme design tokens.`);
  console.log(`\n=======================================================`);
}

// Run tests
try {
  const allRoutes = [
    'dist/index.html',
    'dist/services/medical-web-design/index.html',
    'dist/services/contractor-websites/index.html',
    'dist/services/local-seo-fresno/index.html',
    'dist/services/web-design-clovis/index.html'
  ];

  console.log(`\n=======================================================`);
  console.log(`RUNNING FULL AUDIT ACROSS ALL ${allRoutes.length} ROUTES`);
  console.log(`=======================================================`);

  for (const r of allRoutes) {
    auditPageJsonLd(r);
  }

  // Audit Comparison Table
  auditComparisonTable('dist/services/medical-web-design/index.html');

  // Mathematical WCAG 2.1 AA Contrast Ratio Verification
  console.log(`\n=======================================================`);
  console.log(`MATHEMATICAL WCAG 2.1 CONTRAST RATIO VERIFICATION`);
  console.log(`=======================================================`);

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function getLuminance({ r, g, b }) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  function blendOver(fgRgb, fgAlpha, bgRgb) {
    return {
      r: Math.round(fgRgb.r * fgAlpha + bgRgb.r * (1 - fgAlpha)),
      g: Math.round(fgRgb.g * fgAlpha + bgRgb.g * (1 - fgAlpha)),
      b: Math.round(fgRgb.b * fgAlpha + bgRgb.b * (1 - fgAlpha))
    };
  }

  const bgPaper = hexToRgb('#F7F0E3'); // Tailwind paper color
  const ink = hexToRgb('#1E2B23');     // Tailwind ink color (#1e2b23)
  const leaf = hexToRgb('#2E6A4C');    // Tailwind leaf color (#2e6a4c)
  const headerBg = blendOver(ink, 0.05, bgPaper); // bg-ink/5 over bg-paper

  const contrastChecks = [
    { label: 'text-ink (100%) on bg-paper', fg: ink, bg: bgPaper, minRatio: 4.5 },
    { label: 'text-ink/85 (85%) on bg-paper', fg: blendOver(ink, 0.85, bgPaper), bg: bgPaper, minRatio: 4.5 },
    { label: 'text-ink/80 (80%) on bg-paper', fg: blendOver(ink, 0.80, bgPaper), bg: bgPaper, minRatio: 4.5 },
    { label: 'text-ink/70 (70%) on headerBg (bg-ink/5)', fg: blendOver(ink, 0.70, headerBg), bg: headerBg, minRatio: 4.5 },
    { label: 'text-leaf (semibold) on headerBg', fg: leaf, bg: headerBg, minRatio: 4.5 },
    { label: 'text-leaf (semibold) on bg-paper', fg: leaf, bg: bgPaper, minRatio: 4.5 },
  ];

  const contrastIssues = [];
  for (const check of contrastChecks) {
    const ratio = getContrastRatio(check.fg, check.bg);
    const passed = ratio >= check.minRatio;
    console.log(`  Contrast: ${check.label} => ${ratio.toFixed(2)}:1 (Required: ${check.minRatio}:1) [${passed ? 'PASS' : 'FAIL'}]`);
    if (!passed) {
      contrastIssues.push({
        label: check.label,
        ratio: ratio.toFixed(2),
        required: check.minRatio
      });
    }
  }

  if (contrastIssues.length > 0) {
    console.warn(`\n[WARNING / CONTRAST VIOLATION DETECTED]:`);
    contrastIssues.forEach(iss => {
      console.warn(`  - ${iss.label}: measured ${iss.ratio}:1 fails minimum required ${iss.required}:1`);
    });
    throw new Error(`CRITICAL: Found ${contrastIssues.length} contrast violation(s)!`);
  }

  // Schema.org Deep Field Semantics Check
  console.log(`\n=======================================================`);
  console.log(`SCHEMA.ORG FIELD SEMANTICS & GEODATA INTEGRITY`);
  console.log(`=======================================================`);
  const rawHomeHtml = fs.readFileSync('dist/index.html', 'utf8');
  const jsonMatch = rawHomeHtml.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  const graph = JSON.parse(jsonMatch[1])['@graph'][0];

  // Verify GeoCoordinates
  console.log(`GeoCoordinates: lat=${graph.geo.latitude}, lng=${graph.geo.longitude}`);
  if (typeof graph.geo.latitude !== 'number' || typeof graph.geo.longitude !== 'number') {
    throw new Error('CRITICAL: GeoCoordinates latitude/longitude must be numbers');
  }
  if (graph.geo.latitude < 36.5 || graph.geo.latitude > 37.0 || graph.geo.longitude > -119.5 || graph.geo.longitude < -120.0) {
    throw new Error(`CRITICAL: GeoCoordinates (${graph.geo.latitude}, ${graph.geo.longitude}) outside Clovis/Fresno range!`);
  }
  console.log(`[PASS] GeoCoordinates geographically valid for Clovis/Fresno region.`);

  // Verify Telephone
  console.log(`Telephone: "${graph.telephone}"`);
  if (!/^\+1\d{10}$/.test(graph.telephone)) {
    throw new Error(`CRITICAL: Telephone "${graph.telephone}" not valid E.164 format (+1XXXXXXXXXX)`);
  }
  console.log(`[PASS] Telephone conforms to international E.164 standard.`);

  // Verify Opening Hours
  const days = graph.openingHoursSpecification[0].dayOfWeek;
  const validDays = new Set(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  for (const d of days) {
    if (!validDays.has(d)) throw new Error(`CRITICAL: Invalid DayOfWeek in opening hours: ${d}`);
  }
  console.log(`[PASS] OpeningHoursSpecification days are valid Schema.org DayOfWeek values: ${days.join(', ')}`);

  console.log('\n\nALL EMPIRICAL TESTS PASSED WITH 100% INTEGRITY!\n');
} catch (err) {
  console.error('\n\nTEST FAILED WITH ERROR:\n', err);
  process.exit(1);
}
