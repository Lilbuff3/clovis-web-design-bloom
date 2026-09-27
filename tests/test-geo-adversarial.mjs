import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, '../dist/services/medical-web-design/index.html');

if (!fs.existsSync(DIST_PATH)) {
  console.error(`Dist file not found at ${DIST_PATH}`);
  process.exit(1);
}

const html = fs.readFileSync(DIST_PATH, 'utf-8');

// 1. Extract <h2> and corresponding geo-unit paragraphs
const geoUnitRegex = /<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<p[^>]*class=["'][^"']*geo-unit[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;

let matches = [];
let match;
while ((match = geoUnitRegex.exec(html)) !== null) {
  matches.push({
    headingRaw: match[1],
    headingClean: match[1].replace(/<[^>]+>/g, '').trim(),
    bodyRaw: match[2],
    bodyClean: match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  });
}

console.log(`Found ${matches.length} GEO unit pairs in dist file.\n`);

// Tokenization strategies
const strategies = {
  // Strategy 1: Naive split on whitespace
  naiveWhitespace: (text) => text.split(/\s+/).filter(Boolean),
  
  // Strategy 2: verify-e2e.mjs implementation (strip tags, strip &...;, trim, split \s+)
  verifyE2eMethod: (text) => {
    const clean = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/&#[0-9]+;/g, ' ')
      .trim();
    return clean.split(/\s+/).filter(w => w.length > 0);
  },

  // Strategy 3: Em-dash and dash separated (em-dash — treated as delimiter)
  emDashSplit: (text) => {
    const clean = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/&#[0-9]+;/g, ' ')
      .replace(/[—–]/g, ' ')
      .trim();
    return clean.split(/\s+/).filter(w => w.length > 0);
  },

  // Strategy 4: Hyphens also split (all hyphens treated as separate words)
  hyphenSplit: (text) => {
    const clean = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/&#[0-9]+;/g, ' ')
      .replace(/[—–-]/g, ' ')
      .trim();
    return clean.split(/\s+/).filter(w => w.length > 0);
  },

  // Strategy 5: Standard word characters regex \b\w+\b
  wordRegex: (text) => {
    const clean = text.replace(/<[^>]+>/g, ' ');
    return clean.match(/\b[A-Za-z0-9_]+\b/g) || [];
  },

  // Strategy 6: Natural Language Toolkit / Google NLP approximation:
  // Word tokens stripped of outer punctuation, but hyphenated compound words kept as single token, em-dash split
  nlpCompoundTokens: (text) => {
    const clean = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/&#[0-9]+;/g, ' ')
      .replace(/[—–]/g, ' ')
      .replace(/[§]/g, '') // remove section symbol if isolated
      .trim();
    const rawTokens = clean.split(/\s+/).filter(Boolean);
    // Strip leading/trailing quotes, periods, commas, colons, brackets
    return rawTokens
      .map(t => t.replace(/^[“"‘'(\[]+/, '').replace(/[”"’')\].,;:!?]+$/, ''))
      .filter(t => t.length > 0);
  },

  // Strategy 7: Strict dictionary words (only alphabetic tokens)
  alphaOnly: (text) => {
    const clean = text.replace(/<[^>]+>/g, ' ');
    return clean.match(/[A-Za-z]+/g) || [];
  }
};

matches.forEach((m, idx) => {
  console.log(`================================================================`);
  console.log(`UNIT ${idx + 1}`);
  console.log(`Heading: "${m.headingClean}"`);
  console.log(`Body Snippet: "${m.bodyClean.slice(0, 100)}..."`);
  console.log(`----------------------------------------------------------------`);
  
  for (const [name, fn] of Object.entries(strategies)) {
    const tokens = fn(m.bodyRaw);
    const count = tokens.length;
    const inRange = count >= 134 && count <= 167;
    console.log(`  ${name.padEnd(20)}: ${count.toString().padStart(3)} words | ${inRange ? 'PASS [134-167]' : 'FAIL OUT OF RANGE'}`);
  }
});
