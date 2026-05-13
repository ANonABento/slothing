// P3/#38 — Passive LinkedIn capture.
//
// LinkedIn's TOS prohibits auto-navigation and their anti-bot is active, so
// this module is deliberately read-only. It runs *after* the content script
// has scraped a LinkedIn detail page the user is already viewing and:
//
//   1. Looks up the LinkedIn jobId against a session-scoped seen set
//      (`chrome.storage.session.linkedInSeen`) and short-circuits on hit.
//   2. Enforces a 50-capture-per-24h daily cap, keyed by a `{date, count}`
//      record in `chrome.storage.local`. Hitting the cap is a silent no-op
//      (no error toast, no enqueue).
//   3. Enqueues the scraped job via the existing `IMPORT_JOB` message, which
//      lands at `/api/opportunities/from-extension` and ends up in the review
//      queue.
//   4. Shows a one-shot "Saved for later" toast on the first capture per
//      session.
//
// Everything in this file is passive: no `.click()`, no list-page traversal,
// no DOM mutation other than mounting the toast element in document.body.
//
// Storage shapes:
//   chrome.storage.session[LINKEDIN_SEEN_KEY] : string[]      // job ids
//   chrome.storage.local[LINKEDIN_DAILY_KEY]  : { date: "YYYY-MM-DD",
//                                                 count: number }

import type {
  ExtensionMessage,
  ExtensionResponse,
  ScrapedJob,
} from "../../shared/types";

export const LINKEDIN_SEEN_KEY = "linkedInSeen";
export const LINKEDIN_DAILY_KEY = "slothingLinkedInDailyCap";
export const LINKEDIN_DAILY_CAP = 50;
export const LINKEDIN_TOAST_CLASS = "slothing-toast-linkedin-capture";

export interface LinkedInDailyCapState {
  /** Local-time `YYYY-MM-DD` stamp; rolls the counter when the date changes. */
  date: string;
  count: number;
}

export type CaptureResult =
  | "captured"
  | "deduped"
  | "capped"
  | "skipped"
  | "error";

/** YYYY-MM-DD in the user's local timezone — same calendar day the user sees. */
export function localDateStamp(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ---- session-scoped seen set --------------------------------------------

/**
 * Reads the current session's seen list. Returns `[]` when
 * `chrome.storage.session` is unavailable (older browsers) or the entry is
 * missing — both branches are safe because a missing seen entry just means
 * "no captures yet this session", which is the correct default.
 */
export async function getLinkedInSeenIds(): Promise<string[]> {
  const session = chrome.storage?.session;
  if (!session) return [];
  return new Promise((resolve) => {
    session.get(LINKEDIN_SEEN_KEY, (result) => {
      const value = result?.[LINKEDIN_SEEN_KEY];
      if (Array.isArray(value)) {
        // Defensive — filter to strings only so a malformed write can't crash
        // the rest of the capture pipeline.
        resolve(value.filter((id): id is string => typeof id === "string"));
      } else {
        resolve([]);
      }
    });
  });
}

/**
 * Appends a jobId to the session-scoped seen list. No-ops when the session
 * store is unavailable — the daily cap is the safety net on browsers without
 * `chrome.storage.session`.
 */
export async function addLinkedInSeenId(jobId: string): Promise<void> {
  const session = chrome.storage?.session;
  if (!session) return;
  const current = await getLinkedInSeenIds();
  if (current.includes(jobId)) return;
  const next = [...current, jobId];
  return new Promise((resolve) => {
    session.set({ [LINKEDIN_SEEN_KEY]: next }, () => resolve());
  });
}

// ---- daily cap counter --------------------------------------------------

/**
 * Reads the daily-cap counter from `chrome.storage.local`. Returns a fresh
 * `{date, count: 0}` when:
 *   - nothing has been written yet,
 *   - the stored stamp is from a previous local-time day (cross-day reset),
 *   - the value is malformed.
 */
export async function getLinkedInDailyCapState(
  now: Date = new Date(),
): Promise<LinkedInDailyCapState> {
  const today = localDateStamp(now);
  const local = chrome.storage?.local;
  if (!local) return { date: today, count: 0 };

  return new Promise((resolve) => {
    local.get(LINKEDIN_DAILY_KEY, (result) => {
      const stored = result?.[LINKEDIN_DAILY_KEY] as
        | Partial<LinkedInDailyCapState>
        | undefined;
      if (
        stored &&
        typeof stored.date === "string" &&
        typeof stored.count === "number" &&
        stored.date === today
      ) {
        resolve({ date: stored.date, count: stored.count });
      } else {
        // Stale day / missing / malformed — same behaviour: today's count = 0.
        resolve({ date: today, count: 0 });
      }
    });
  });
}

/**
 * Increments the daily-cap counter and persists it. Returns the new state so
 * callers don't need a second read to display the running tally.
 */
export async function incrementLinkedInDailyCap(
  now: Date = new Date(),
): Promise<LinkedInDailyCapState> {
  const current = await getLinkedInDailyCapState(now);
  const next: LinkedInDailyCapState = {
    date: current.date,
    count: current.count + 1,
  };
  const local = chrome.storage?.local;
  if (!local) return next;
  return new Promise((resolve) => {
    local.set({ [LINKEDIN_DAILY_KEY]: next }, () => resolve(next));
  });
}

// ---- toast --------------------------------------------------------------

/**
 * Mounts a non-blocking toast announcing the running session capture count.
 * Idempotent: any prior LinkedIn-capture toast is removed first so a rapid
 * second capture doesn't stack toasts on top of each other.
 *
 * The toast is the ONLY DOM mutation this module performs on a LinkedIn page,
 * and it's appended to `document.body` rather than spliced into LinkedIn's
 * own markup. This keeps us off the anti-bot radar (we're not touching their
 * elements) and makes the "no DOM mutation beyond toast container" test
 * cheap to assert.
 */
export function showLinkedInCaptureToast(count: number): void {
  if (typeof document === "undefined" || !document.body) return;
  document.querySelector(`.${LINKEDIN_TOAST_CLASS}`)?.remove();

  const toast = document.createElement("div");
  toast.className = `slothing-toast ${LINKEDIN_TOAST_CLASS}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  // Pluralisation is local rather than via @slothing/web's pluralize() because
  // this content script can't pull in the web workspace's helpers without
  // bloating the bundle.
  const noun = count === 1 ? "job" : "jobs";
  toast.textContent = `Saved for later — ${count} LinkedIn ${noun} captured this session.`;

  const dismiss = () => toast.remove();
  window.setTimeout(dismiss, 5000);

  document.body.appendChild(toast);
}

// ---- orchestrator -------------------------------------------------------

/**
 * Type for the message-sender dependency. Matches the signature of
 * `sendMessage` in `@/shared/messages` but accepts any compatible function so
 * tests can inject a mock without pulling in the chrome runtime.
 */
export type SendMessageFn = <T>(
  message: ExtensionMessage,
) => Promise<ExtensionResponse<T>>;

export interface PassiveCaptureDeps {
  sendMessage: SendMessageFn;
  /**
   * Constructor for `IMPORT_JOB`-shaped messages. Injected so we don't pull
   * in `@/shared/messages` at test time (its imports drag in `chrome.runtime`).
   */
  buildImportMessage: (job: ScrapedJob) => ExtensionMessage<ScrapedJob>;
  /** Toast callback so tests can verify without touching the DOM. */
  showToast?: (count: number) => void;
  now?: () => Date;
}

interface SessionCaptureState {
  toastShown: boolean;
}

const sessionState: SessionCaptureState = { toastShown: false };

/** Test hook — resets the in-memory "first capture this session" flag. */
export function resetLinkedInCaptureSessionState(): void {
  sessionState.toastShown = false;
}

/**
 * Main entry point. Call once per LinkedIn detail-page scrape. The caller is
 * responsible for ensuring `job.source === "linkedin"` and `job.sourceJobId`
 * is set before invoking this function — passing an unrelated job here is a
 * no-op (`skipped`) rather than an error to keep the integration point in
 * `content/index.ts` ergonomic.
 */
export async function tryCaptureLinkedInJob(
  job: ScrapedJob,
  deps: PassiveCaptureDeps,
): Promise<CaptureResult> {
  if (job.source !== "linkedin") return "skipped";
  const jobId = job.sourceJobId;
  if (!jobId) return "skipped";

  const now = (deps.now || (() => new Date()))();

  // 1. Session-scoped dedupe — visiting the same job twice in one session
  //    must not double-enqueue.
  const seen = await getLinkedInSeenIds();
  if (seen.includes(jobId)) return "deduped";

  // 2. Daily cap — hitting 50/day is a silent no-op. We intentionally do NOT
  //    show an error toast (per #38 acceptance: "no error toast").
  const cap = await getLinkedInDailyCapState(now);
  if (cap.count >= LINKEDIN_DAILY_CAP) return "capped";

  // 3. Enqueue. We update the seen set and the daily counter BEFORE awaiting
  //    the network call so a slow response can't let a duplicate slip
  //    through if the user navigates back to the same job before the first
  //    request completes. If the network call fails we still consume one
  //    daily-cap slot — that's the conservative behaviour for an anti-spam
  //    rate limiter.
  await addLinkedInSeenId(jobId);
  const nextCap = await incrementLinkedInDailyCap(now);

  try {
    const response = await deps.sendMessage(deps.buildImportMessage(job));
    if (!response.success) {
      // Background already logs the underlying error; we just bail so the
      // toast doesn't claim a successful capture.
      return "error";
    }
  } catch {
    return "error";
  }

  // 4. First-capture-of-session toast only. We use the running session
  //    counter for the displayed number rather than the daily count because
  //    "captured this session" is what the copy promises.
  if (!sessionState.toastShown) {
    sessionState.toastShown = true;
    const sessionCount = (await getLinkedInSeenIds()).length;
    const showToast = deps.showToast || showLinkedInCaptureToast;
    showToast(sessionCount);
  }

  // Hint to the caller for tests/logs. The daily counter is included for
  // observability but isn't part of the user-facing flow.
  void nextCap;
  return "captured";
}
