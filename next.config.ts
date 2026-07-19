import type { NextConfig } from "next";

// Content-Security-Policy is set per request with a nonce in src/proxy.ts —
// a static header here would conflict (browsers enforce the intersection of
// multiple CSP headers). Only nonce-independent headers live below.
const securityHeaders = [
  // Vercel's edge already sends this on *.vercel.app, but the app must not
  // depend on platform defaults — set it explicitly with the same value so
  // HTTPS-only is guaranteed on any host (and visible to security scanners).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
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
