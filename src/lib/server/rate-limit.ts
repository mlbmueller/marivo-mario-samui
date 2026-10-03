/**
 * Rate limiting for the inquiry endpoint. Server-only.
 *
 * - memory: per-instance counter. Fine for local development and a single preview
 *   instance, NOT sufficient for a distributed production deployment (each serverless
 *   instance has its own memory). The release check blocks production without a shared store.
 * - upstash: shared fixed-window counter via the Upstash Redis REST API
 *   (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN). No SDK dependency.
 */
type Env = Record<string, string | undefined>;

export interface RateLimiter {
  readonly kind: 'memory' | 'upstash';
  /** true = request allowed. Fails open only for the memory limiter's own errors (none). */
  hit(key: string): Promise<boolean>;
}

export const RATE_LIMIT = { max: 5, windowSeconds: 10 * 60 } as const;

export function memoryLimiter(max = RATE_LIMIT.max, windowSeconds = RATE_LIMIT.windowSeconds, now = () => Date.now()): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    kind: 'memory',
    async hit(key) {
      const t = now();
      if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= t) {
        hits.set(key, { count: 1, resetAt: t + windowSeconds * 1000 });
        return true;
      }
      entry.count += 1;
      return entry.count <= max;
    },
  };
}

export function upstashLimiter(url: string, token: string, fetchImpl: typeof fetch = fetch): RateLimiter {
  const base = url.replace(/\/+$/, '');
  return {
    kind: 'upstash',
    async hit(key) {
      const window = Math.floor(Date.now() / 1000 / RATE_LIMIT.windowSeconds);
      const redisKey = `inquiry-rl:${key}:${window}`;
      try {
        const res = await fetchImpl(`${base}/pipeline`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([
            ['INCR', redisKey],
            ['EXPIRE', redisKey, String(RATE_LIMIT.windowSeconds)],
          ]),
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return true;
        const data = (await res.json()) as { result?: number }[];
        const count = Number(data[0]?.result ?? 0);
        return count <= RATE_LIMIT.max;
      } catch {
        // Availability of the contact form is preferred over strict limiting if Redis is down.
        return true;
      }
    },
  };
}

let shared: RateLimiter | null = null;

export function getRateLimiter(env: Env = process.env): RateLimiter {
  if (shared) return shared;
  shared =
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
      ? upstashLimiter(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN)
      : memoryLimiter();
  return shared;
}
