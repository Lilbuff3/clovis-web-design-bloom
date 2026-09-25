/**
 * Cross-platform SMS URI generator.
 * Standard RFC 5724 specifies `sms:+15595753014?body=...` (required on Android and modern browsers).
 * Legacy iOS devices traditionally expected `sms:+15595753014&body=...`.
 * Passing `?&body=` breaks parameter parsing on Android Chrome and Samsung Internet.
 * This helper dynamically formats the appropriate query separator based on the client runtime.
 */
export function buildSmsHref(phone: string, body?: string): string {
  const cleanPhone = phone.replace(/^sms:/i, "");
  if (!body) return `sms:${cleanPhone}`;

  const encoded = encodeURIComponent(body);
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent || "");

  return isIOS ? `sms:${cleanPhone}&body=${encoded}` : `sms:${cleanPhone}?body=${encoded}`;
}

/** The Contact section's first text, written from what the visitor picked. Checked by scripts/test_sms.js. */
export function contactMessage(name: string, trade: string, need: string, when: string): string {
  const n = name.trim();
  const t = trade.trim().replace(/[.!]+$/, "");
  const intro = n ? `Hi, Adam! It's ${n}${t ? ` — I run ${t}.` : "."}` : `Hi, Adam!${t ? ` I run ${t}.` : ""}`;
  const pick = need.replace(/ \(.*\)/, "");
  const what = need === "Not sure yet" ? "I'm not sure what I need yet" : `I'm interested in ${pick[0].toLowerCase()}${pick.slice(1)}`;
  const w = when === "ASAP" ? "hoping to get going ASAP" : when === "This month" ? "looking to start this month" : "just looking for now";
  return `${intro} ${what}, ${w}. Can we talk?`;
}
