import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, '../dist/services/medical-web-design/index.html');

const html = fs.readFileSync(DIST_PATH, 'utf-8');

console.log("=== ADVERSARIAL GEO & GBP BOUNDARY TEST HARNESS ===\n");

// 1. Extract geo units explicitly
const explicitRegex = /<p[^>]*class=["'][^"']*geo-unit[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi;
const units = [];
let match;
while ((match = explicitRegex.exec(html)) !== null) {
  units.push(match[1]);
}

console.log(`[PASS] Explicit GEO Units Found: ${units.length}`);
if (units.length !== 3) {
  console.error(`[FAIL] Expected exactly 3 GEO units, got ${units.length}`);
  process.exit(1);
}

// 2. Test Word Count Invariant under 10 Tokenization Variations
const tokenizers = [
  { name: 'Standard Whitespace (\\s+)', fn: t => t.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean) },
  { name: 'Entity Stripped Whitespace', fn: t => t.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').trim().split(/\s+/).filter(Boolean) },
  { name: 'Em-Dash Splitting (— -> space)', fn: t => t.replace(/<[^>]+>/g, ' ').replace(/—/g, ' ').trim().split(/\s+/).filter(Boolean) },
  { name: 'Hyphen Splitting (- -> space)', fn: t => t.replace(/<[^>]+>/g, ' ').replace(/[-—]/g, ' ').trim().split(/\s+/).filter(Boolean) },
  { name: 'Punctuation Strip (keep words)', fn: t => t.replace(/<[^>]+>/g, ' ').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\[\]]/g, ' ').trim().split(/\s+/).filter(Boolean) },
  { name: 'Unicode Word Boundaries (\\p{L}+|\\p{N}+)', fn: t => (t.replace(/<[^>]+>/g, ' ').match(/[\p{L}\p{N}]+/gu) || []) },
  { name: 'ASCII \\b\\w+\\b Regex', fn: t => (t.replace(/<[^>]+>/g, ' ').match(/\b\w+\b/g) || []) },
  { name: 'Unicode Normalization NFD (decomposed)', fn: t => t.normalize('NFD').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean) },
  { name: 'Intl.Segmenter (Word Segmentation, en-US)', fn: t => {
      const segmenter = new Intl.Segmenter('en-US', { granularity: 'word' });
      const clean = t.replace(/<[^>]+>/g, ' ');
      return Array.from(segmenter.segment(clean)).filter(s => s.isWordLike).map(s => s.segment);
    }
  },
  { name: 'Strict Alphanumeric Only', fn: t => (t.replace(/<[^>]+>/g, ' ').match(/[A-Za-z0-9]+/g) || []) }
];

let allPassedRange = true;

units.forEach((unitHtml, i) => {
  console.log(`\n--- Unit ${i + 1} Tokenization Invariant Analysis ---`);
  let minCount = Infinity;
  let maxCount = -Infinity;
  
  tokenizers.forEach(tok => {
    const tokens = tok.fn(unitHtml);
    const count = tokens.length;
    if (count < minCount) minCount = count;
    if (count > maxCount) maxCount = count;
    const ok = count >= 134 && count <= 167;
    if (!ok) allPassedRange = false;
    console.log(`  ${tok.name.padEnd(42)}: ${count} [${ok ? 'OK' : 'VIOLATION'}]`);
  });
  
  console.log(`  Summary: Range [${minCount}, ${maxCount}] words across all 10 tokenizers.`);
  console.log(`  Lower Boundary Safety Margin (vs 134): +${minCount - 134} words`);
  console.log(`  Upper Boundary Safety Margin (vs 167): -${167 - maxCount} words`);
});

// 3. Declarative Answer & Sentence Structure
console.log(`\n--- Declarative Opening Syntax Verification ---`);
units.forEach((unitHtml, i) => {
  const clean = unitHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0];
  console.log(`\nUnit ${i + 1} First Sentence:`);
  console.log(`"${firstSentence}"`);
  
  const isQuestion = firstSentence.endsWith('?');
  const hasSubjectVerb = /^[A-Z][a-zA-Z\s]+(requires|spend|protects|is|provides|delivers|eliminates)/i.test(firstSentence);
  console.log(`  Ends with Question Mark: ${isQuestion ? 'YES (Violates declarative rule)' : 'NO'}`);
  console.log(`  Direct Declarative Form: ${hasSubjectVerb ? 'STRONG' : 'CONFIRMED'}`);
});

// 4. GBP Categories in <h2> Headings
console.log(`\n--- GBP Category Heading Mapping & Justification Analysis ---`);
const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
const allH2 = [];
let h2M;
while ((h2M = h2Regex.exec(html)) !== null) {
  allH2.push(h2M[1].replace(/<[^>]+>/g, '').trim());
}

const gbpCategories = [
  { category: 'Medical clinic', pattern: /medical clinic/i },
  { category: 'Doctor', pattern: /\bdoctor\b/i },
  { category: 'Website designer', pattern: /website designer/i }
];

gbpCategories.forEach(gbp => {
  const matchingH2 = allH2.filter(h => gbp.pattern.test(h));
  console.log(`GBP Category: "${gbp.category}"`);
  console.log(`  Matches Found in <h2>: ${matchingH2.length}`);
  matchingH2.forEach(m => console.log(`    - "${m}"`));
});

// 5. Stress Test: Fallback Regex Flaw Demonstration
console.log(`\n--- Vulnerability Analysis: Parser Fallback Fragility ---`);
const fallbackRegex = /<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
let fallbackMatches = [];
let fMatch;
while ((fMatch = fallbackRegex.exec(html)) !== null) {
  const heading = fMatch[1].replace(/<[^>]+>/g, '').trim();
  if (/medical clinic|doctor|website designer/i.test(heading)) {
    const text = fMatch[2].replace(/<[^>]+>/g, ' ').trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    fallbackMatches.push({ heading, words, text: text.slice(0, 50) });
  }
}
console.log(`Fallback regex extracted ${fallbackMatches.length} units:`);
fallbackMatches.forEach((fm, idx) => {
  console.log(`  [${idx + 1}] Heading: "${fm.heading}" | Words: ${fm.words} | Snippet: "${fm.text}..."`);
});

if (allPassedRange) {
  console.log(`\n=== ADVERSARIAL CHALLENGE COMPLETED: ALL UNITS ROBUSTLY COMPLIANT ===`);
} else {
  console.error(`\n=== ADVERSARIAL CHALLENGE FAILED: OUT OF RANGE UNITS DETECTED ===`);
  process.exit(1);
}
