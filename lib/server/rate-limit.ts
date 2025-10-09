import type { NextApiRequest } from 'next';

type RateLimitBucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export interface RateLimitOptions {
  /** Number of requests allowed within the window */
  max: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  retryAfterSeconds?: number;
}

export function getClientKey(req: NextApiRequest): string {
  const forwarded = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
  return (
    forwarded ||
    req.headers['x-real-ip']?.toString() ||
    req.socket.remoteAddress ||
    'global'
  );
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + options.windowMs });
    return { success: true };
  }

  if (bucket.count >= options.max) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((bucket.expiresAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true };
}

export function resetRateLimitBuckets(): void {
  buckets.clear();
}
