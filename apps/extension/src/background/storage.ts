// Extension storage utilities

import type {
  ExtensionStorage,
  ExtensionSettings,
  ExtensionProfile,
} from "@/shared/types";
import { DEFAULT_SETTINGS, DEFAULT_API_BASE_URL } from "@/shared/types";

const STORAGE_KEY = "columbus_extension";

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
