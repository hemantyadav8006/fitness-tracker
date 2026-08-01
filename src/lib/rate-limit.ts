/**
 * Fixed-window in-memory rate limiter.
 *
 * Suitable for single-node / low-traffic and as a first line of defense on
 * serverless (each isolate has its own map; pair with edge middleware).
 * Swap for Redis / Upstash when you need cross-instance consistency.
 */

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/** Periodic cleanup so the map does not grow without bound in long-lived processes. */
const MAX_BUCKETS = 10_000;

function pruneIfNeeded(now: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // If still huge, drop oldest half by reset time
  if (buckets.size >= MAX_BUCKETS) {
    const entries = [...buckets.entries()].sort(
      (a, b) => a[1].resetAt - b[1].resetAt,
    );
    for (let i = 0; i < Math.floor(entries.length / 2); i++) {
      buckets.delete(entries[i][0]);
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  pruneIfNeeded(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

/** Client IP best-effort for rate-limit keys (Vercel / proxies). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
