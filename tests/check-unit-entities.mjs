import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, '../dist/services/medical-web-design/index.html');

const html = fs.readFileSync(DIST_PATH, 'utf-8');

const geoUnitRegex = /<(?:div|p|section)[^>]*(?:data-geo-unit=["']true["']|class=["'][^"']*geo-unit[^"']*["'])[^>]*>([\s\S]*?)<\/(?:div|p|section)>/gi;
let units = [];
let match;
while ((match = geoUnitRegex.exec(html)) !== null) {
  units.push(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

const entities = ['Fresno', 'Clovis', 'Madera', 'Central Valley'];

units.forEach((u, i) => {
  console.log(`\n--- Unit ${i + 1} ---`);
  console.log(`Text: "${u.slice(0, 80)}..."`);
  entities.forEach(ent => {
    const reg = new RegExp(`\\b${ent}\\b`, 'gi');
    const matches = u.match(reg);
    console.log(`  ${ent.padEnd(16)}: ${matches ? matches.length + ' occurrences' : 'MISSING'}`);
  });
});
