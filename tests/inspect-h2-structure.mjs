import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, '../dist/services/medical-web-design/index.html');

const html = fs.readFileSync(DIST_PATH, 'utf-8');

// Find all <h2> tags and their immediate next sibling elements
const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
let match;
let h2List = [];
while ((match = h2Regex.exec(html)) !== null) {
  const index = match.index;
  const endIndex = h2Regex.lastIndex;
  const headingText = match[1].replace(/<[^>]+>/g, '').trim();
  
  // Look at text immediately after </h2>
  const afterH2 = html.slice(endIndex, endIndex + 2000);
  // Find first tag after h2
  const nextTagMatch = afterH2.match(/^\s*<([a-z0-9]+)[^>]*>([\s\S]*?)<\/\1>/i);
  
  h2List.push({
    heading: headingText,
    nextTag: nextTagMatch ? nextTagMatch[1] : 'none',
    nextContentSnippet: nextTagMatch ? nextTagMatch[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) : 'none',
    hasGeoUnitClass: nextTagMatch ? /class=["'][^"']*geo-unit[^"']*["']/.test(nextTagMatch[0]) : false,
    hasDataGeoUnit: nextTagMatch ? /data-geo-unit=["']true["']/.test(nextTagMatch[0]) : false
  });
}

console.log(JSON.stringify(h2List, null, 2));
