/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach.
 *
 * For production, consider using Redis-based rate limiting.
 */

interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests allowed in window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every minute
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanup(windowMs: number): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    for (const [key, entry] of entries) {
      // Remove timestamps older than the window
      entry.timestamps = entry.timestamps.filter((t: number) => now - t < windowMs);
      // Remove entry if no timestamps left
      if (entry.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000); // Run every minute
}

/**
 * Check if a request is rate limited.
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { windowMs, maxRequests } = config;
  const now = Date.now();

  // Start cleanup process if not already running
  startCleanup(windowMs);

  // Get or create entry for this identifier
  let entry = rateLimitStore.get(identifier);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(identifier, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  // Calculate remaining requests
  const remaining = Math.max(0, maxRequests - entry.timestamps.length);

  // Calculate when the oldest request will expire
  const oldestTimestamp = entry.timestamps[0] || now;
  const resetAt = oldestTimestamp + windowMs;

  // Check if allowed
  if (entry.timestamps.length >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Record this request
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: remaining - 1,
    resetAt,
  };
}

/**
 * Create a rate limiter with preset configuration.
 *
 * @param config - Rate limit configuration
 * @returns Rate limit check function
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (identifier: string) => checkRateLimit(identifier, config);
}

// Preset rate limiters for common use cases
export const rateLimiters = {
  /**
   * LLM operations - expensive, limit to 10 per minute
   */
  llm: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  }),

  /**
   * Standard API calls - 60 per minute
   */
  standard: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  }),

  /**
   * Auth operations - 5 per minute (prevent brute force)
   */
  auth: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  }),
};

/**
 * Get client identifier from request (IP address or user ID)
 *
 * @param request - The incoming request
 * @param userId - Optional user ID for authenticated requests
 * @returns Unique identifier for rate limiting
 */
export function getClientIdentifier(
  request: Request,
  userId?: string
): string {
  // Prefer user ID if available (authenticated requests)
  if (userId) {
    return `user:${userId}`;
  }

  // Fall back to IP address
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  // Get the first IP if there are multiple (proxy chain)
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  return `ip:${ip}`;
}
