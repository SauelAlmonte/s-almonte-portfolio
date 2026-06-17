import "server-only";

/**
 * Lightweight in-memory per-IP rate limiter for the public chat endpoint.
 *
 * Tradeoff (documented on purpose): the Map lives in a single warm serverless
 * instance, so the limit is per-instance and resets on cold start. That is
 * acceptable for a personal portfolio — it stops casual spam and runaway cost
 * without any external service. To make it durable + cross-instance, replace
 * this module with an Upstash Redis (`@upstash/ratelimit`) implementation; the
 * call site in route.ts stays identical.
 */

const WINDOW_MS = 60_000; // 1 minute
/** Exported so the route can report the cap to the client for the visible counter. */
export const RATE_LIMIT_MAX = 12; // messages per IP per window

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    sweep(now);
    return result(true, 1, 0);
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return result(false, RATE_LIMIT_MAX, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
  return result(true, bucket.count, 0);
}

function result(allowed: boolean, used: number, retryAfterSeconds: number): RateLimitResult {
  return {
    allowed,
    limit: RATE_LIMIT_MAX,
    used,
    remaining: Math.max(0, RATE_LIMIT_MAX - used),
    retryAfterSeconds,
  };
}

/** Drop expired buckets opportunistically so the Map can't grow unbounded. */
function sweep(now: number): void {
  if (buckets.size < 1000) return;
  for (const [ip, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(ip);
  }
}

/**
 * Derive a client IP from proxy headers, preferring the one a client CAN'T
 * forge. On Vercel, `x-real-ip` is set by the platform to the true client IP,
 * whereas the left-most entry of `x-forwarded-for` can be spoofed by a
 * client-supplied header to rotate past the per-IP limit — so we trust
 * `x-real-ip` first and only fall back to `x-forwarded-for` (e.g. local dev or
 * other proxies). Falls back to a shared constant bucket if both are absent
 * (still rate-limited — safe-by-default rather than fail-open per request).
 */
export function getClientIp(headers: Headers): string {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return "unknown";
}
