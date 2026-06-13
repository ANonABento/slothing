// Layer 2 — resolve a company logo from a third-party service by domain, in the
// background service worker (not bound by page CSP), and hand back a data: URL
// the injected sidebar can render anywhere. Results are cached per-domain.
//
// Requires host_permissions for logo.clearbit.com + icons.duckduckgo.com so the
// SW fetch can read the image bytes cross-origin.

const CACHE_KEY = "slothing:logoCache";
const POSITIVE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30d
const NEGATIVE_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3d
const MAX_BYTES = 256 * 1024;

export interface LogoCacheEntry {
  dataUrl: string | null;
  at: string;
}

async function readCache(): Promise<Record<string, LogoCacheEntry>> {
  return new Promise((resolve) => {
    chrome.storage.local.get(CACHE_KEY, (result) => {
      const value = result?.[CACHE_KEY];
      resolve(value && typeof value === "object" ? value : {});
    });
  });
}

async function writeCacheEntry(
  domain: string,
  entry: LogoCacheEntry,
): Promise<void> {
  const cache = await readCache();
  cache[domain] = entry;
  return new Promise((resolve) => {
    chrome.storage.local.set({ [CACHE_KEY]: cache }, () => resolve());
  });
}

function isFresh(entry: LogoCacheEntry, now: number): boolean {
  const at = new Date(entry.at).getTime();
  if (!Number.isFinite(at)) return false;
  const ttl = entry.dataUrl ? POSITIVE_TTL_MS : NEGATIVE_TTL_MS;
  return now - at <= ttl;
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { credentials: "omit" });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "";
    if (!type.startsWith("image/")) return null;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) return null;
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return `data:${type};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

/**
 * Returns a data: URL for the domain's logo, or null. Cache-first; on a miss it
 * tries Clearbit (real logos) then a DuckDuckGo favicon, and caches either the
 * hit or the miss (shorter TTL) so we don't refetch on every page view.
 */
export async function resolveCompanyLogoDataUrl(
  domainInput: string,
  now: number = Date.now(),
): Promise<string | null> {
  const domain = (domainInput || "").trim().toLowerCase();
  if (!domain || !domain.includes(".")) return null;

  const cache = await readCache();
  const cached = cache[domain];
  if (cached && isFresh(cached, now)) return cached.dataUrl;

  let dataUrl = await fetchAsDataUrl(
    `https://logo.clearbit.com/${encodeURIComponent(domain)}?size=64&format=png`,
  );
  if (!dataUrl) {
    dataUrl = await fetchAsDataUrl(
      `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
    );
  }

  await writeCacheEntry(domain, { dataUrl, at: new Date(now).toISOString() });
  return dataUrl;
}
