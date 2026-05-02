/**
 * OAuth uses AUTH_URL / NEXTAUTH_URL as the issuer. In development,
 * copying production URLs (https + non-loopback, or *.vercel.app) makes Google
 * redirect back to Vercel while you browse localhost.
 *
 * Rewrites AUTH_URL/NEXTAUTH_URL to http://localhost:<PORT> in dev unless
 * you already pointed them at localhost/127.0.0.1.
 *
 * Set AUTH_FORCE_PRODUCTION_ORIGIN_DEV=1 to disable (ngrok / special cases).
 */

function normalizeDevAuthUrls(): void {
  if (process.env.NODE_ENV !== "development") return;
  const forceProduction =
    process.env.AUTH_FORCE_PRODUCTION_ORIGIN_DEV === "1" ||
    process.env.AUTH_FORCE_PRODUCTION_ORIGIN_DEV === "true";
  if (forceProduction) return;

  const current = (
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    ""
  );
  if (!current) return;

  const loopbackLike =
    /localhost/i.test(current) || /\b127\.0\.0\.1\b/.test(current);
  if (loopbackLike) return;

  const rewrite =
    /\.vercel\.app\b/i.test(current) || /^https:\/\//i.test(current);

  if (!rewrite) return;

  const port = process.env.PORT ?? "3000";
  const localhost = `http://localhost:${port}`;
  try {
    process.env.AUTH_URL = localhost;
    process.env.NEXTAUTH_URL = localhost;
  } catch {
    /* Some runtimes freeze process.env — set AUTH_URL in .env.local */
  }
}

normalizeDevAuthUrls();
