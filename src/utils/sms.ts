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
