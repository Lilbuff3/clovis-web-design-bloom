// The site check fetches whatever address a visitor types, so the URL filter is a security boundary.
// Node 22.18+ imports the .ts file directly (type stripping).
import assert from 'node:assert/strict';
import { normalizeUrl } from '../api/teardown.ts';
import { namedIn } from '../api/ask-gemini.ts';

const ok = {
  'kidneyspecialistinc.com': 'https://kidneyspecialistinc.com/',
  'http://bigbrosdumpster.com/': 'http://bigbrosdumpster.com/',
  '  https://www.example.com/about  ': 'https://www.example.com/about',
};
for (const [input, href] of Object.entries(ok)) assert.equal(normalizeUrl(input)?.href, href, input);

const blocked = [
  '', 'localhost', 'http://localhost:3000', 'http://127.0.0.1', 'http://0x7f.1', 'http://2130706433',
  'http://[::1]/', 'http://169.254.169.254/latest/meta-data', 'http://10.0.0.1', 'printer.local', 'db.internal',
  'https://user:pass@example.com', 'example.com:8080', 'ftp://example.com', 'javascript:alert(1)',
  'file:///etc/passwd', `${'a'.repeat(200)}.com`,
];
for (const input of blocked) assert.equal(normalizeUrl(input), null, input);

console.log(`site-check URL filter: ${Object.keys(ok).length} allowed, ${blocked.length} blocked ✓`);

// "✓ Gemini named you" / "✗ You weren't in Gemini's answer" rests on this match.
const places = ['Olsen Roofing & Solar', 'Big Bros Dumpster Rentals', 'Joe’s Taquería'];
assert.equal(namedIn(places, 'Olsen Roofing', ''), 'Olsen Roofing & Solar');
assert.equal(namedIn(['Big Bros Dumpster Rental'], 'Big Bros Dumpster Rentals', ''), 'Big Bros Dumpster Rental');
assert.equal(namedIn(places, '', 'https://www.bigbrosdumpster.com/'), 'Big Bros Dumpster Rentals');
assert.equal(namedIn(places, "Joe's Taqueria", ''), 'Joe’s Taquería');
assert.equal(namedIn(['Olson Roofing'], 'Olsen Roofing', ''), null);
assert.equal(namedIn(places, '', ''), null);
assert.equal(namedIn(places, 'The Company', 'abc.com'), null); // nothing distinctive to look for
console.log('Gemini answer match: 7 cases ✓');
