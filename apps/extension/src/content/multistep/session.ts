// Multi-step session state (P3 / #36 / #37).
//
// When the user confirms "Auto-fill this application" on a multi-step ATS
// flow (Workday, Greenhouse), we capture a snapshot of the profile + base
// resume + job URL and persist it under `chrome.storage.session` keyed by
// the current tabId. Each subsequent step transition — either via the
// webNavigation listener (preferred) or via the prompted fallback toast —
// looks up this snapshot to fill the next page without re-asking the user.
//
// The session naturally clears on:
// - explicit `clearSession` (submit click, "No" on the fallback toast)
// - tab close (chrome wipes session storage when the tab is gone — we also
//   clear on `pagehide` as a belt-and-suspenders for bfcache restores)
// - 30 minutes of inactivity (`confirmedAt` TTL)
//
// We deliberately use `chrome.storage.session` instead of in-memory state so
// the session survives content-script re-injection when Workday/Greenhouse
// blow away the DOM between steps. The TTL is enforced on read, not on write,
// because session storage doesn't expose TTLs natively.

import type { ExtensionProfile } from "@/shared/types";

/** TTL after which a captured session is considered stale and ignored. */
export const MULTISTEP_SESSION_TTL_MS = 30 * 60 * 1000;

/** Storage key under chrome.storage.session. Keyed by tabId. */
const MULTISTEP_SESSION_KEY = "columbus_multistep_sessions";

/** ATS provider that owns this multi-step session. */
export type MultistepProvider = "workday" | "greenhouse";

/**
 * Snapshot of "the user confirmed they want to auto-fill this application".
 * Held in chrome.storage.session for the duration of the flow.
 */
export interface MultistepSession {
  /** Tab the application is running in. */
  tabId: number;
  /** Provider — controls which content-script handler picks up step events. */
  provider: MultistepProvider;
  /** Canonical URL of the job posting (the page where the user clicked "Auto-fill"). */
  jobUrl: string;
  /** Profile snapshot at the moment of confirmation — frozen so later edits don't surprise the user mid-flow. */
  profile: ExtensionProfile;
  /** Optional saved-resume id picked from the popup multi-resume picker (#34). */
  baseResumeId?: string;
  /** ISO timestamp when the user confirmed. */
  confirmedAt: string;
}

type SessionMap = Record<string, MultistepSession>;

/**
 * chrome.storage.session is MV3-only. In MV2 (Firefox) we fall back to
 * `chrome.storage.local` with the same TTL gating — the data is wiped on
 * `chrome.runtime.onInstalled` / first read after the TTL passes, so the
 * "session" semantics are preserved at the cost of one extra disk hit.
 */
function getSessionArea(): chrome.storage.StorageArea {
  // The `session` API is only present in MV3. webextension-polyfill exposes
  // `local` in both manifest versions, so it's a safe last resort.
  const area = (
    chrome.storage as unknown as { session?: chrome.storage.StorageArea }
  ).session;
  return area ?? chrome.storage.local;
}

async function readMap(): Promise<SessionMap> {
  return new Promise((resolve) => {
    getSessionArea().get(MULTISTEP_SESSION_KEY, (result) => {
      const raw =
        (result?.[MULTISTEP_SESSION_KEY] as SessionMap | undefined) ?? {};
      resolve(raw);
    });
  });
}

async function writeMap(map: SessionMap): Promise<void> {
  return new Promise((resolve) => {
    getSessionArea().set({ [MULTISTEP_SESSION_KEY]: map }, () => resolve());
  });
}

function isExpired(
  session: MultistepSession,
  now: number = Date.now(),
): boolean {
  const confirmed = Date.parse(session.confirmedAt);
  if (!Number.isFinite(confirmed)) return true;
  return now - confirmed > MULTISTEP_SESSION_TTL_MS;
}

/**
 * Persist a new (or refreshed) session snapshot.
 *
 * Calling this again with the same tabId overwrites the existing snapshot —
 * intentionally — because the user has just re-confirmed.
 */
export async function setSession(session: MultistepSession): Promise<void> {
  const map = await readMap();
  map[String(session.tabId)] = session;
  await writeMap(map);
}

/**
 * Look up the live session for a tab, returning `null` if absent, expired,
 * or pointing at a different ATS provider than the caller expects.
 *
 * Expired entries are evicted opportunistically on read so we don't leak
 * stale snapshots into long-lived storage.
 */
export async function getSession(
  tabId: number,
  provider?: MultistepProvider,
): Promise<MultistepSession | null> {
  const map = await readMap();
  const entry = map[String(tabId)];
  if (!entry) return null;
  if (isExpired(entry)) {
    delete map[String(tabId)];
    await writeMap(map);
    return null;
  }
  if (provider && entry.provider !== provider) return null;
  return entry;
}

/**
 * Drop the session for a tab. Called on submit click, on tab close, and when
 * the user says "No" to the prompted fallback toast.
 */
export async function clearSession(tabId: number): Promise<void> {
  const map = await readMap();
  if (!(String(tabId) in map)) return;
  delete map[String(tabId)];
  await writeMap(map);
}

/**
 * Sweep every expired entry. Called from the background on startup to keep
 * the session-area small if the browser crashed mid-flow.
 */
export async function purgeExpiredSessions(
  now: number = Date.now(),
): Promise<void> {
  const map = await readMap();
  let changed = false;
  for (const [key, entry] of Object.entries(map)) {
    if (isExpired(entry, now)) {
      delete map[key];
      changed = true;
    }
  }
  if (changed) await writeMap(map);
}

/**
 * Read every live session — used by the background webNavigation listener
 * to decide whether the tab it just saw a history-update on is one we own.
 */
export async function listSessions(): Promise<MultistepSession[]> {
  const map = await readMap();
  const now = Date.now();
  return Object.values(map).filter((entry) => !isExpired(entry, now));
}
