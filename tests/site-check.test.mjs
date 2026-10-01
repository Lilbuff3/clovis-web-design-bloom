// "Yes. It found you." / "No. It doesn't." rests on this match.
// Node 22.18+ imports the .ts file directly (type stripping).
import assert from 'node:assert/strict';
import handler, { namedIn } from '../api/ask-gemini.ts';

const places = ['Olsen Roofing & Solar', 'Big Bros Dumpster Rentals', 'Joe’s Taquería'];
assert.equal(namedIn(places, 'Olsen Roofing'), 'Olsen Roofing & Solar');
assert.equal(namedIn(['Big Bros Dumpster Rental'], 'Big Bros Dumpster Rentals'), 'Big Bros Dumpster Rental');
assert.equal(namedIn(places, "Joe's Taqueria"), 'Joe’s Taquería');
assert.equal(namedIn(['Olson Roofing'], 'Olsen Roofing'), null);
assert.equal(namedIn(places, ''), null);
assert.equal(namedIn(places, 'The Company'), null); // nothing distinctive to look for
console.log('Gemini answer match: 6 cases ✓');

// When Gemini answers without Google Maps sources, the endpoint asks once more before giving up.
// Fake Gemini responses only; nothing leaves this machine.
process.env.GEMINI_API_KEY = 'fake-key-for-tests';
const grounded = {
  candidates: [{
    content: { parts: [{ text: 'A Roofing is good.' }] },
    groundingMetadata: { groundingChunks: [{ maps: { title: 'A Roofing - Google Maps', uri: 'https://maps.google.com/?cid=1' } }] },
  }],
};
const ungrounded = { candidates: [{ content: { parts: [{ text: 'Try A Roofing.' }] } }] };
const ask = (who) =>
  handler(new Request('http://test/api/ask-gemini', {
    method: 'POST',
    headers: { 'x-forwarded-for': who },
    body: JSON.stringify({ businessName: 'A Roofing', trade: 'roofer', city: 'Clovis, CA' }),
  }));
const realWarn = console.warn;
console.warn = () => {}; // the endpoint logs each miss; expected here

let calls = 0;
globalThis.fetch = async () => Response.json(calls++ === 0 ? ungrounded : grounded);
let res = await ask('retry-then-ok');
assert.equal(res.status, 200);
assert.equal(calls, 2);
assert.equal((await res.json()).named, 'A Roofing');

calls = 0;
globalThis.fetch = async () => (calls++, Response.json(ungrounded));
res = await ask('two-misses');
assert.equal(res.status, 502);
assert.equal(calls, 2);

console.warn = realWarn;
console.log('Gemini retry: 2 cases ✓');
