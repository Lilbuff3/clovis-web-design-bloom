import test from "node:test";
import assert from "node:assert/strict";

// Create a DOM/browser mock environment before importing or running utm functions
class MockSessionStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

// Import tested module functions after setting mock window globals
const mockStorage = new MockSessionStorage();
let replaceStateCalls = [];

globalThis.window = {
  sessionStorage: mockStorage,
  location: {
    pathname: "/",
    search: "",
    hash: "",
  },
  history: {
    state: null,
    replaceState(state, title, url) {
      replaceStateCalls.push({ state, title, url });
    },
  },
};
globalThis.document = {
  title: "Clovis Web Design",
};

// Now import the module dynamically or directly
const {
  isTrackingParam,
  getStoredUtm,
  saveTrackingParams,
  cleanTrackingUrl,
  silentClean,
  UTM_STORAGE_KEY,
} = await import("../src/utils/utm.ts");

function setupUrl(urlStr) {
  const url = new URL(urlStr, "https://cloviswebdesign.com");
  window.location.pathname = url.pathname;
  window.location.search = url.search;
  window.location.hash = url.hash;
  replaceStateCalls = [];
}

test("isTrackingParam correctly detects standard and custom tracking parameters", () => {
  // Standard UTMs
  assert.equal(isTrackingParam("utm_source"), true);
  assert.equal(isTrackingParam("utm_medium"), true);
  assert.equal(isTrackingParam("utm_campaign"), true);
  assert.equal(isTrackingParam("utm_term"), true);
  assert.equal(isTrackingParam("utm_content"), true);
  assert.equal(isTrackingParam("utm_id"), true);
  assert.equal(isTrackingParam("utm_custom_tag"), true);

  // Case insensitivity
  assert.equal(isTrackingParam("UTM_SOURCE"), true);
  assert.equal(isTrackingParam("Utm_Campaign"), true);

  // Ad and click IDs
  assert.equal(isTrackingParam("gclid"), true);
  assert.equal(isTrackingParam("fbclid"), true);
  assert.equal(isTrackingParam("msclkid"), true);
  assert.equal(isTrackingParam("twclid"), true);
  assert.equal(isTrackingParam("wbraid"), true);
  assert.equal(isTrackingParam("gbraid"), true);
  assert.equal(isTrackingParam("ttclid"), true);

  // Non-tracking parameters must NOT be classified as tracking
  assert.equal(isTrackingParam("ref"), false);
  assert.equal(isTrackingParam("page"), false);
  assert.equal(isTrackingParam("preview"), false);
  assert.equal(isTrackingParam("category"), false);
  assert.equal(isTrackingParam("id"), false);
  assert.equal(isTrackingParam(""), false);
});

test("Clean GBP tracking URL on root without hash", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/?utm_source=gbp&utm_medium=organic&utm_campaign=local_pack");

  const extracted = saveTrackingParams();
  assert.deepEqual(extracted, {
    utm_source: "gbp",
    utm_medium: "organic",
    utm_campaign: "local_pack",
  });

  const stored = getStoredUtm();
  assert.deepEqual(stored, {
    utm_source: "gbp",
    utm_medium: "organic",
    utm_campaign: "local_pack",
  });

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, true);
  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/");
  assert.equal(replaceStateCalls[0].title, "Clovis Web Design");
});

test("Clean GBP tracking URL with hash anchor (#contact)", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/?utm_source=gbp&utm_medium=organic&utm_campaign=local_pack#contact");

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, true);
  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/#contact");
});

test("Clean tracking URL on /boost subpage", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/boost?utm_source=gbp&utm_medium=organic&utm_campaign=local_pack");

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, true);
  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/boost");
});

test("Clean tracking URL on /boost subpage with hash (#boost-calc)", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/boost?gclid=test1234&utm_campaign=boost_promo#boost-calc");

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, true);
  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/boost#boost-calc");

  assert.deepEqual(getStoredUtm(), {
    gclid: "test1234",
    utm_campaign: "boost_promo",
  });
});

test("Preserves non-tracking query parameters while removing tracking parameters", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/?ref=partner&utm_source=gbp&view=compact#faq");

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, true);
  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/?ref=partner&view=compact#faq");

  assert.deepEqual(getStoredUtm(), {
    utm_source: "gbp",
  });
});

test("No-op when URL has no query parameters", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/#contact");

  const extracted = saveTrackingParams();
  assert.equal(extracted, null);

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, false);
  assert.equal(replaceStateCalls.length, 0);
  assert.equal(mockStorage.getItem(UTM_STORAGE_KEY), null);
});

test("No-op when URL only has non-tracking query parameters", () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/?preview=true&debug=1#contact");

  const extracted = saveTrackingParams();
  assert.equal(extracted, null);

  const cleaned = cleanTrackingUrl();
  assert.equal(cleaned, false);
  assert.equal(replaceStateCalls.length, 0);
  assert.equal(mockStorage.getItem(UTM_STORAGE_KEY), null);
});

test("Merges multiple tracking attribution touches in sessionStorage", () => {
  mockStorage.clear();

  // First touch
  setupUrl("https://cloviswebdesign.com/?utm_source=gbp&utm_medium=organic");
  saveTrackingParams();

  assert.deepEqual(getStoredUtm(), {
    utm_source: "gbp",
    utm_medium: "organic",
  });

  // Second touch adds campaign
  setupUrl("https://cloviswebdesign.com/?utm_campaign=local_pack&gclid=ad123");
  saveTrackingParams();

  assert.deepEqual(getStoredUtm(), {
    utm_source: "gbp",
    utm_medium: "organic",
    utm_campaign: "local_pack",
    gclid: "ad123",
  });
});

test("silentClean waits a tick before cleaning URL bar", async () => {
  mockStorage.clear();
  setupUrl("https://cloviswebdesign.com/?utm_source=gbp#contact");

  silentClean(10);

  // Immediately, attribution is already saved
  assert.deepEqual(getStoredUtm(), {
    utm_source: "gbp",
  });

  // But replaceState hasn't fired yet
  assert.equal(replaceStateCalls.length, 0);

  // Wait for tick
  await new Promise((resolve) => setTimeout(resolve, 20));

  // Now replaceState has cleaned the URL
  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/#contact");
});

test("Gracefully handles sessionStorage failures without throwing", () => {
  const brokenStorage = {
    getItem() {
      throw new Error("QuotaExceeded / SecurityError");
    },
    setItem() {
      throw new Error("QuotaExceeded / SecurityError");
    },
  };
  window.sessionStorage = brokenStorage;
  setupUrl("https://cloviswebdesign.com/?utm_source=gbp");

  assert.doesNotThrow(() => {
    saveTrackingParams();
  });

  assert.doesNotThrow(() => {
    cleanTrackingUrl();
  });

  assert.equal(replaceStateCalls.length, 1);
  assert.equal(replaceStateCalls[0].url, "/");

  window.sessionStorage = mockStorage;
});
