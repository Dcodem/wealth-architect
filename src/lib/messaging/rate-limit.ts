import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_MESSAGES_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// ─── Upstash Redis (production) ─────────────────────────

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const upstashLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_MESSAGES_PER_HOUR, "1h"),
      prefix: "pa:rl",
    })
  : null;

// ─── In-memory fallback (local dev) ─────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

function getKey(sender: string, orgId: string): string {
  return `${orgId}:${sender}`;
}

function checkMemoryRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    memoryStore.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: MAX_MESSAGES_PER_HOUR - 1,
      resetAt: new Date(now + WINDOW_MS),
    };
  }

  if (entry.count >= MAX_MESSAGES_PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.windowStart + WINDOW_MS),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: MAX_MESSAGES_PER_HOUR - entry.count,
    resetAt: new Date(entry.windowStart + WINDOW_MS),
  };
}

// ─── Public API ─────────────────────────────────────────

export async function checkRateLimit(
  sender: string,
  orgId: string
): Promise<RateLimitResult> {
  const key = getKey(sender, orgId);

  if (upstashLimiter) {
    const result = await upstashLimiter.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: new Date(result.reset),
    };
  }

  return checkMemoryRateLimit(key);
}

/** Reset all rate limits — for testing only. */
export function resetRateLimits(): void {
  memoryStore.clear();
}
