import test from "node:test";
import assert from "node:assert/strict";

const { contactMessage } = await import("../src/utils/sms.ts");

test("contactMessage reads as sentences for every mix of name and business", () => {
  const end = "I'm interested in a one-page site, hoping to get going ASAP. Can we talk?";
  const need = "A one-page site ($500)";
  assert.equal(contactMessage("", "", need, "ASAP"), `Hi, Adam! ${end}`);
  assert.equal(contactMessage(" Maria ", "", need, "ASAP"), `Hi, Adam! It's Maria. ${end}`);
  assert.equal(contactMessage("", "a taquería in Old Town.", need, "ASAP"), `Hi, Adam! I run a taquería in Old Town. ${end}`);
  assert.equal(contactMessage("Maria", "a taquería", need, "ASAP"), `Hi, Adam! It's Maria — I run a taquería. ${end}`);
});

test("contactMessage lowercases only the first letter of the pick", () => {
  assert.equal(contactMessage("", "", "Something bigger", "This month"), "Hi, Adam! I'm interested in something bigger, looking to start this month. Can we talk?");
  assert.equal(contactMessage("", "", "A few pages + Spanish", "Just looking"), "Hi, Adam! I'm interested in a few pages + Spanish, just looking for now. Can we talk?");
  assert.equal(contactMessage("", "", "Not sure yet", "Just looking"), "Hi, Adam! I'm not sure what I need yet, just looking for now. Can we talk?");
});
