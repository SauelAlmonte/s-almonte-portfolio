/**
 * Validate a user-supplied location before it is rendered as an anchor `href`.
 *
 * Only two shapes are allowed: a site-relative path (`/resume.pdf` — but not a
 * protocol-relative `//host/…`) or an absolute http(s) URL. Everything else
 * (`javascript:`, `data:`, `vbscript:`, …) returns `null` so the caller renders
 * no link at all. React escapes markup but passes `href` schemes through, so
 * this scheme check is the one defense that matters for text-input → `href`
 * flows. Mirrors the shapes `normalizeDownloadUrl` accepts on the public
 * landing path (src/lib/resume/get-resume-for-landing.ts).
 */
export function safeHref(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return /^https?:\/\//i.test(value) ? value : null;
}
