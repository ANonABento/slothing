import { nowEpoch } from "@/lib/format/time";

/**
 * Server-side in-memory cache of uploaded PDF bytes, keyed by
 * (userId, documentId). Used by the review-modal document preview so the
 * client can render the same PDF that was just parsed without us having to
 * persist the bytes to disk or object storage.
 *
 * Lifetime: 24h TTL per entry (PF.3). Long enough for a user to come back
 * to a review session; short enough to bound memory.
 *
 * Scope: per-user. Lookups require the requesting user's ID to match the
 * cached entry's ownership — prevents cross-user PDF access through a
 * brute-forced documentId. (Open question #4 in the preview spec.)
 *
 * Stash on `globalThis` so Next.js dev-mode HMR (which reloads modules per
 * route, giving each route its own copy of module-level state) doesn't
 * split the cache into siblings that can't see each other's writes — the
 * symptom there is "upload succeeds but the preview endpoint 404s." A
 * single shared singleton survives reloads of either module.
 */

const TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  userId: string;
  bytes: Buffer;
  contentType: string;
  expiresAt: number;
}

const globalKey = "__slothing_pdf_cache__" as const;
interface GlobalWithCache {
  [globalKey]?: Map<string, CacheEntry>;
}
const globalSlot = globalThis as unknown as GlobalWithCache;
if (!globalSlot[globalKey]) {
  globalSlot[globalKey] = new Map<string, CacheEntry>();
}
const cache: Map<string, CacheEntry> = globalSlot[globalKey]!;

function pruneExpired(now: number = nowEpoch()): void {
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
}

export function cachePdfBytes(
  documentId: string,
  userId: string,
  bytes: Buffer,
  contentType: string = "application/pdf",
): void {
  pruneExpired();
  cache.set(documentId, {
    userId,
    bytes,
    contentType,
    expiresAt: nowEpoch() + TTL_MS,
  });
}

export function getCachedPdfBytes(
  documentId: string,
  userId: string,
): { bytes: Buffer; contentType: string } | null {
  const entry = cache.get(documentId);
  if (!entry) return null;
  if (entry.expiresAt <= nowEpoch()) {
    cache.delete(documentId);
    return null;
  }
  if (entry.userId !== userId) return null;
  return { bytes: entry.bytes, contentType: entry.contentType };
}

export function evictCachedPdf(documentId: string): void {
  cache.delete(documentId);
}

/**
 * Test-only helper. Wiping the cache between tests keeps assertions
 * deterministic.
 */
export function __resetPdfCacheForTests(): void {
  cache.clear();
}
