// "Yes. It found you." / "No. It doesn't." rests on this match.
// Node 22.18+ imports the .ts file directly (type stripping).
import assert from 'node:assert/strict';
import { namedIn } from '../api/ask-gemini.ts';

const places = ['Olsen Roofing & Solar', 'Big Bros Dumpster Rentals', 'Joe’s Taquería'];
assert.equal(namedIn(places, 'Olsen Roofing'), 'Olsen Roofing & Solar');
assert.equal(namedIn(['Big Bros Dumpster Rental'], 'Big Bros Dumpster Rentals'), 'Big Bros Dumpster Rental');
assert.equal(namedIn(places, "Joe's Taqueria"), 'Joe’s Taquería');
assert.equal(namedIn(['Olson Roofing'], 'Olsen Roofing'), null);
assert.equal(namedIn(places, ''), null);
assert.equal(namedIn(places, 'The Company'), null); // nothing distinctive to look for
console.log('Gemini answer match: 6 cases ✓');
