/**
 * Validate a user-supplied location before it is rendered as an anchor `href`.
 *
 * React escapes markup but passes `href` schemes through, so a `javascript:`
 * URL executes on click — the scheme is the attack surface. Rather than
 * inspect-and-return the input (which leaves the scheme attacker-controlled as
 * far as dataflow analysis can prove), the result is REBUILT with a constant
 * prefix so the scheme can never come from the input:
 *
 * - site-relative input → `"/" + rest` (also collapses protocol-relative
 *   `//host/…` into a local path instead of a foreign origin)
 * - absolute input → parsed with `new URL`, admitted only for http(s), and
 *   re-emitted from a constant `https:`/`http:` prefix (credentials dropped)
 * - everything else → `null`; callers render no link at all
 *
 * Mirrors the shapes `normalizeDownloadUrl` accepts on the public landing path
 * (src/lib/resume/get-resume-for-landing.ts).
 */
export function safeHref(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith("/")) {
    return "/" + value.replace(/^\/+/, "");
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const rest = "//" + url.host + url.pathname + url.search + url.hash;
  if (url.protocol === "https:") return "https:" + rest;
  if (url.protocol === "http:") return "http:" + rest;
  return null;
}
