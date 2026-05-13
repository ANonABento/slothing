// Extension storage utilities

import type {
  ExtensionStorage,
  ExtensionSettings,
  ExtensionProfile,
} from "@/shared/types";
import { DEFAULT_SETTINGS, DEFAULT_API_BASE_URL } from "@/shared/types";

const STORAGE_KEY = "slothing_extension";

export async function getStorage(): Promise<ExtensionStorage> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const stored = result[STORAGE_KEY] as
        | Partial<ExtensionStorage>
        | undefined;
      resolve({
        apiBaseUrl: DEFAULT_API_BASE_URL,
        ...stored,
        settings: { ...DEFAULT_SETTINGS, ...stored?.settings },
      });
    });
  });
}

export async function setStorage(
  updates: Partial<ExtensionStorage>,
): Promise<void> {
  const current = await getStorage();
  const updated = { ...current, ...updates };

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: updated }, resolve);
  });
}

export async function clearStorage(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(STORAGE_KEY, resolve);
  });
}

// Auth token helpers
export async function setAuthToken(
  token: string,
  expiresAt: string,
): Promise<void> {
  await setStorage({
    authToken: token,
    tokenExpiry: expiresAt,
    lastSeenAuthAt: new Date().toISOString(),
  });
}

/**
 * Records that we just observed a working authenticated state. Called by the
 * API client after a successful `isAuthenticated()` check so the popup can
 * distinguish a real logout from a service-worker state-loss event.
 *
 * Distinct from `setAuthToken` because we don't always have a fresh token to
 * write — sometimes we just verified the existing one.
 */
export async function markAuthSeen(): Promise<void> {
  await setStorage({ lastSeenAuthAt: new Date().toISOString() });
}

/**
 * "Session lost" view (popup, #27) shows when we have no `authToken` but
 * `lastSeenAuthAt` is within this window. Beyond the window we treat the
 * extension as a fresh install / true logout and show the normal hero.
 */
export const SESSION_LOST_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

/**
 * Returns true when the popup should render the "Session lost — reconnect"
 * branch instead of the unauthenticated hero. See #27.
 */
export function isSessionLost(
  storage: Pick<ExtensionStorage, "authToken" | "lastSeenAuthAt">,
  now: number = Date.now(),
): boolean {
  if (storage.authToken) return false;
  if (!storage.lastSeenAuthAt) return false;
  const lastSeen = new Date(storage.lastSeenAuthAt).getTime();
  if (!Number.isFinite(lastSeen)) return false;
  return now - lastSeen <= SESSION_LOST_WINDOW_MS;
}

export async function clearAuthToken(): Promise<void> {
  // NOTE: we intentionally do NOT clear `lastSeenAuthAt` here. A true logout
  // path (handleLogout) calls `forgetAuthHistory` afterwards; this helper is
  // also used when a token quietly expires or a 401 trips the api-client,
  // and in those cases the session-lost UI is exactly what we want to show.
  await setStorage({
    authToken: undefined,
    tokenExpiry: undefined,
    cachedProfile: undefined,
    profileCachedAt: undefined,
  });
}

/**
 * Wipes the "we've seen you before" breadcrumb so the popup shows the
 * unauthenticated hero on next open. Call this from explicit-logout flows.
 */
export async function forgetAuthHistory(): Promise<void> {
  await setStorage({ lastSeenAuthAt: undefined });
}

export async function getAuthToken(): Promise<string | null> {
  const storage = await getStorage();

  if (!storage.authToken) return null;

  // Check expiry
  if (storage.tokenExpiry) {
    const expiry = new Date(storage.tokenExpiry);
    if (expiry < new Date()) {
      await clearAuthToken();
      return null;
    }
  }

  return storage.authToken;
}

// Profile cache helpers
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCachedProfile(): Promise<ExtensionProfile | null> {
  const storage = await getStorage();

  if (!storage.cachedProfile || !storage.profileCachedAt) {
    return null;
  }

  const cachedAt = new Date(storage.profileCachedAt);
  if (Date.now() - cachedAt.getTime() > PROFILE_CACHE_TTL) {
    return null; // Cache expired
  }

  return storage.cachedProfile;
}

export async function setCachedProfile(
  profile: ExtensionProfile,
): Promise<void> {
  await setStorage({
    cachedProfile: profile,
    profileCachedAt: new Date().toISOString(),
  });
}

export async function clearCachedProfile(): Promise<void> {
  await setStorage({
    cachedProfile: undefined,
    profileCachedAt: undefined,
  });
}

// Settings helpers
export async function getSettings(): Promise<ExtensionSettings> {
  const storage = await getStorage();
  return storage.settings;
}

export async function updateSettings(
  updates: Partial<ExtensionSettings>,
): Promise<ExtensionSettings> {
  const storage = await getStorage();
  const updated = { ...storage.settings, ...updates };
  await setStorage({ settings: updated });
  return updated;
}

// API URL helper
export async function setApiBaseUrl(url: string): Promise<void> {
  await setStorage({ apiBaseUrl: url });
}

export async function getApiBaseUrl(): Promise<string> {
  const storage = await getStorage();
  return storage.apiBaseUrl;
}

// ---- Session-scoped auth cache (#30) ------------------------------------
//
// `chrome.storage.session` is in-memory only — it survives suspending the
// service worker but is wiped on browser restart, which is exactly what we
// want for a short-lived auth verdict cache. Using session (not local)
// also means we never persist the verdict to disk.
//
// The cache stores `{ authenticated: boolean, at: ISO string }` so the
// popup can return a result in <50ms on the second open within a minute,
// while the background script revalidates in the background.

export const AUTH_CACHE_TTL_MS = 60 * 1000;
const AUTH_CACHE_KEY = "slothing_auth_cache";

export interface AuthCacheEntry {
  authenticated: boolean;
  at: string;
}

/**
 * Reads the session-scoped auth verdict cache. Returns null when:
 * - the entry has never been written,
 * - the entry is older than AUTH_CACHE_TTL_MS,
 * - the entry's timestamp is unparseable, or
 * - chrome.storage.session is unavailable (e.g. older browsers).
 *
 * Optional `now` parameter exists for tests.
 */
export async function getSessionAuthCache(
  now: number = Date.now(),
): Promise<AuthCacheEntry | null> {
  const sessionStore = chrome.storage?.session;
  if (!sessionStore) return null;

  return new Promise((resolve) => {
    sessionStore.get(AUTH_CACHE_KEY, (result) => {
      const entry = result?.[AUTH_CACHE_KEY] as AuthCacheEntry | undefined;
      if (!entry || typeof entry.at !== "string") {
        resolve(null);
        return;
      }
      const at = new Date(entry.at).getTime();
      if (!Number.isFinite(at)) {
        resolve(null);
        return;
      }
      if (now - at > AUTH_CACHE_TTL_MS) {
        resolve(null);
        return;
      }
      resolve({ authenticated: !!entry.authenticated, at: entry.at });
    });
  });
}

/**
 * Writes a fresh verdict to the session-scoped cache. No-ops when
 * chrome.storage.session is unavailable so callers don't need to guard.
 */
export async function setSessionAuthCache(
  authenticated: boolean,
): Promise<void> {
  const sessionStore = chrome.storage?.session;
  if (!sessionStore) return;
  const entry: AuthCacheEntry = {
    authenticated,
    at: new Date().toISOString(),
  };
  return new Promise((resolve) => {
    sessionStore.set({ [AUTH_CACHE_KEY]: entry }, () => resolve());
  });
}

/**
 * Drops the cached verdict. Call this on any 401 so the next popup open
 * doesn't trust a stale "authenticated" answer.
 */
export async function clearSessionAuthCache(): Promise<void> {
  const sessionStore = chrome.storage?.session;
  if (!sessionStore) return;
  return new Promise((resolve) => {
    sessionStore.remove(AUTH_CACHE_KEY, () => resolve());
  });
}
