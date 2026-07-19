import type { NextConfig } from "next";

/**
 * Content-Security-Policy for the public site.
 *
 * The site loads NO third-party scripts (no analytics, self-hosted `next/font`,
 * and `three`/`drei` pull no external assets), so a STATIC policy locks the page
 * down while preserving static rendering — no per-request nonce, no forced dynamic
 * pages. `'unsafe-inline'` is required on `script-src`/`style-src` because Next.js
 * injects an inline hydration bootstrap and the animation libs (Motion, GSAP) set
 * inline styles; the residual XSS risk is negligible here because the site has no
 * reflected-HTML sink (its one `dangerouslySetInnerHTML` is JSON-LD, escaped by
 * `serializeJsonLd` and a non-executable data block). The high-value directives —
 * `frame-ancestors 'none'` (clickjacking), `object-src 'none'`, `base-uri 'self'`,
 * `form-action 'self'` — are all strict. HSTS is already set by Vercel at the edge.
 */
// Next.js dev (HMR / React Fast Refresh) evaluates modules via `eval()`, which a
// strict `script-src` blocks — so `'unsafe-eval'` is added ONLY in development.
// Production ships without it (the deployed CSP is verified to have no 'unsafe-eval').
const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Belt-and-suspenders clickjacking defense for pre-CSP browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Suppress the `X-Powered-By: Next.js` header — no need to advertise the stack.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
