import { auth } from "@/auth";
import { NextResponse } from "next/server";

/** Next.js 16+: `middleware` renamed to `proxy` (same matcher + auth behavior). */

/**
 * Per-request-nonce CSP. `strict-dynamic` lets the nonced Next.js bootstrap
 * load its chunks, so production script-src carries no `unsafe-inline`.
 * Requires every page to render dynamically (the root layout reads
 * `headers()`) — cached HTML would carry stale nonces. Dev additionally needs
 * `unsafe-eval` (HMR module evaluation) and a `ws:` connect-src (HMR socket).
 * `style-src` allows only self + nonce for <style>/<link> elements;
 * `style-src-attr 'unsafe-inline'` covers the style="" attributes React SSRs
 * for the animation stack (attributes cannot load code — the narrow scope).
 * Non-CSP security headers stay in next.config.ts.
 */
function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoggedIn = !!req.auth;
    const isLoginPage = pathname === "/admin/login";
    if (!isLoginPage && !isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  // Next.js reads the request's Content-Security-Policy header and stamps the
  // nonce onto its own inline bootstrap scripts.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("content-security-policy", csp);
  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
