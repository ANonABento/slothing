// Message passing utilities for extension communication

import type {
  AnswerBankMatch,
  ExtensionMessage,
  ExtensionResponse,
  ExtensionProfile,
  ExtensionResumeSummary,
  ScrapedJob,
  LearnedAnswer,
  SimilarAnswer,
  DetectedField,
  TrackedApplicationPayload,
  SaveCorrectionPayload,
} from "./types";

/**
 * Tailor-from-page payload (#34). `baseResumeId`, when present, asks the
 * tailor flow to seed from an existing saved resume instead of the master
 * profile. The popup populates this from its multi-resume picker dropdown.
 */
export interface TailorFromPagePayload {
  job: ScrapedJob;
  baseResumeId?: string;
}

// Type-safe message creators
export const Messages = {
  // Auth messages
  getAuthStatus: (): ExtensionMessage => ({ type: "GET_AUTH_STATUS" }),
  getSurfaceContext: (): ExtensionMessage => ({ type: "GET_SURFACE_CONTEXT" }),
  openAuth: (): ExtensionMessage => ({ type: "OPEN_AUTH" }),
  logout: (): ExtensionMessage => ({ type: "LOGOUT" }),

  // Profile messages
  getProfile: (): ExtensionMessage => ({ type: "GET_PROFILE" }),
  getSettings: (): ExtensionMessage => ({ type: "GET_SETTINGS" }),

  // Form filling messages
  fillForm: (fields: DetectedField[]): ExtensionMessage<DetectedField[]> => ({
    type: "FILL_FORM",
    payload: fields,
  }),

  // Scraping messages
  scrapeJob: (): ExtensionMessage => ({ type: "SCRAPE_JOB" }),
  scrapeJobList: (): ExtensionMessage => ({ type: "SCRAPE_JOB_LIST" }),
  importJob: (job: ScrapedJob): ExtensionMessage<ScrapedJob> => ({
    type: "IMPORT_JOB",
    payload: job,
  }),
  importJobsBatch: (jobs: ScrapedJob[]): ExtensionMessage<ScrapedJob[]> => ({
    type: "IMPORT_JOBS_BATCH",
    payload: jobs,
  }),
  trackApplied: (
    payload: TrackedApplicationPayload,
  ): ExtensionMessage<TrackedApplicationPayload> => ({
    type: "TRACK_APPLIED",
    payload,
  }),
  openDashboard: (): ExtensionMessage => ({ type: "OPEN_DASHBOARD" }),
  captureVisibleTab: (): ExtensionMessage => ({ type: "CAPTURE_VISIBLE_TAB" }),
  tailorFromPage: (
    job: ScrapedJob,
    baseResumeId?: string,
  ): ExtensionMessage<TailorFromPagePayload> => ({
    type: "TAILOR_FROM_PAGE",
    payload: { job, baseResumeId },
  }),
  generateCoverLetterFromPage: (
    job: ScrapedJob,
  ): ExtensionMessage<ScrapedJob> => ({
    type: "GENERATE_COVER_LETTER_FROM_PAGE",
    payload: job,
  }),
  /** #34 — fetch the user's recently-saved tailored resumes for the picker. */
  listResumes: (): ExtensionMessage => ({ type: "LIST_RESUMES" }),

  // Learning messages
  saveAnswer: (data: {
    question: string;
    answer: string;
    url?: string;
    company?: string;
  }): ExtensionMessage => ({
    type: "SAVE_ANSWER",
    payload: data,
  }),
  searchAnswers: (question: string): ExtensionMessage<string> => ({
    type: "SEARCH_ANSWERS",
    payload: question,
  }),
  matchAnswerBank: (payload: {
    q: string;
    limit?: number;
  }): ExtensionMessage<{ q: string; limit?: number }> => ({
    type: "MATCH_ANSWER_BANK",
    payload,
  }),

  jobDetected: (
    meta: Pick<ScrapedJob, "title" | "company" | "url">,
  ): ExtensionMessage<Pick<ScrapedJob, "title" | "company" | "url">> => ({
    type: "JOB_DETECTED",
    payload: meta,
  }),

  // WaterlooWorks-specific bulk scraping (driven from popup, executed in content
  // script by waterloo-works-orchestrator.ts).
  wwScrapeAllVisible: (): ExtensionMessage => ({
    type: "WW_SCRAPE_ALL_VISIBLE",
  }),
  wwScrapeAllPaginated: (opts?: {
    maxJobs?: number;
    maxPages?: number;
  }): ExtensionMessage<{ maxJobs?: number; maxPages?: number }> => ({
    type: "WW_SCRAPE_ALL_PAGINATED",
    payload: opts ?? {},
  }),
  wwGetPageState: (): ExtensionMessage => ({ type: "WW_GET_PAGE_STATE" }),

  // P3/#39 — Bulk scraping for public ATS board hosts. Popup → content-script.
  // Each pair mirrors the WW shape so the same `BulkSourceCard` UX can drive
  // every source. Each orchestrator caps at 200/session (overridable below).
  bulkGreenhouseGetPageState: (): ExtensionMessage => ({
    type: "BULK_GREENHOUSE_GET_PAGE_STATE",
  }),
  bulkGreenhouseScrapeVisible: (): ExtensionMessage => ({
    type: "BULK_GREENHOUSE_SCRAPE_VISIBLE",
  }),
  bulkGreenhouseScrapePaginated: (opts?: {
    maxJobs?: number;
    maxPages?: number;
  }): ExtensionMessage<{ maxJobs?: number; maxPages?: number }> => ({
    type: "BULK_GREENHOUSE_SCRAPE_PAGINATED",
    payload: opts ?? {},
  }),

  bulkLeverGetPageState: (): ExtensionMessage => ({
    type: "BULK_LEVER_GET_PAGE_STATE",
  }),
  bulkLeverScrapeVisible: (): ExtensionMessage => ({
    type: "BULK_LEVER_SCRAPE_VISIBLE",
  }),
  bulkLeverScrapePaginated: (opts?: {
    maxJobs?: number;
    maxPages?: number;
  }): ExtensionMessage<{ maxJobs?: number; maxPages?: number }> => ({
    type: "BULK_LEVER_SCRAPE_PAGINATED",
    payload: opts ?? {},
  }),

  bulkWorkdayGetPageState: (): ExtensionMessage => ({
    type: "BULK_WORKDAY_GET_PAGE_STATE",
  }),
  bulkWorkdayScrapeVisible: (): ExtensionMessage => ({
    type: "BULK_WORKDAY_SCRAPE_VISIBLE",
  }),
  bulkWorkdayScrapePaginated: (opts?: {
    maxJobs?: number;
    maxPages?: number;
  }): ExtensionMessage<{ maxJobs?: number; maxPages?: number }> => ({
    type: "BULK_WORKDAY_SCRAPE_PAGINATED",
    payload: opts ?? {},
  }),

  // P4/#40 — Helper for the chat-port start frame. The actual stream uses a
  // long-lived chrome.runtime.connect port (CHAT_PORT_NAME) rather than
  // chrome.runtime.sendMessage, but exposing a typed builder keeps callsites
  // self-documenting.
  chatStreamStart: (payload: {
    prompt: string;
    jobContext?: import("./types").ChatJobContext;
  }): import("./types").ChatStreamStartPayload => ({
    type: "CHAT_STREAM_START",
    prompt: payload.prompt,
    jobContext: payload.jobContext,
  }),

  // Corrections feedback loop (#33). Fired when a user edits an autofilled
  // field and the final value differs from the original suggestion — the
  // background forwards it to /api/extension/field-mappings/correct so
  // future autofills on the same domain prefer the corrected value.
  saveCorrection: (
    payload: SaveCorrectionPayload,
  ): ExtensionMessage<SaveCorrectionPayload> => ({
    type: "SAVE_CORRECTION",
    payload,
  }),

  // P3 / #36 #37 — multi-step form support (Workday, Greenhouse).
  /** Background → content: a step transition just fired for this tab. */
  multistepStepTransition: (payload: {
    url: string;
    transitionType: "webNavigation" | "fallback";
  }): ExtensionMessage<{
    url: string;
    transitionType: "webNavigation" | "fallback";
  }> => ({
    type: "MULTISTEP_STEP_TRANSITION",
    payload,
  }),
  /** Content → background: return the current tab id. */
  getTabId: (): ExtensionMessage => ({ type: "GET_TAB_ID" }),
  /**
   * Content → background: ensure the `webNavigation` permission is granted.
   * In Chrome MV3 it's declared at install time and the response is always
   * `{ granted: true }`. In Firefox MV2 the background calls
   * `browser.permissions.request(...)` and returns the user's verdict.
   */
  requestWebNavigationPermission: (): ExtensionMessage => ({
    type: "REQUEST_WEBNAVIGATION_PERMISSION",
  }),
  /** Content → background: is `webNavigation` currently usable? */
  hasWebNavigationPermission: (): ExtensionMessage => ({
    type: "HAS_WEBNAVIGATION_PERMISSION",
  }),
};

export interface SaveCorrectionResponse extends ExtensionResponse<{
  saved: boolean;
  hitCount: number;
}> {}

// Response type helpers
export interface AuthStatusResponse extends ExtensionResponse<{
  isAuthenticated: boolean;
  apiBaseUrl: string;
  /**
   * True when we recently observed a working auth state but the token is
   * currently missing (e.g. after a service-worker reload corrupted storage).
   * The popup uses this to render a distinct "session lost" reconnect view
   * instead of the fresh-install hero. See #27.
   */
  sessionLost?: boolean;
}> {}

export interface ProfileResponse extends ExtensionResponse<ExtensionProfile> {}

export interface ImportJobResponse extends ExtensionResponse<{
  imported: number;
  opportunityIds: string[];
  pendingCount: number;
  dedupedIds?: string[];
}> {}

export interface TrackAppliedResponse extends ExtensionResponse<{
  opportunityId: string;
  deduped: boolean;
}> {}

export interface TailorFromPageResponse extends ExtensionResponse<{
  url: string;
  opportunityId: string;
  resumeId: string;
}> {}

export interface GenerateCoverLetterFromPageResponse extends ExtensionResponse<{
  url: string;
  opportunityId: string;
  coverLetterId: string;
}> {}

export interface SearchAnswersResponse extends ExtensionResponse<
  SimilarAnswer[]
> {}

export interface ListResumesResponse extends ExtensionResponse<{
  resumes: ExtensionResumeSummary[];
}> {}

export interface MatchAnswerBankResponse extends ExtensionResponse<
  AnswerBankMatch[]
> {}

export type WwPageKind = "list" | "detail" | "other";

export interface WwPageStateResponse extends ExtensionResponse<{
  kind: WwPageKind;
  rowCount: number;
  hasNextPage: boolean;
  currentPage?: string;
}> {}

export interface WwBulkScrapeResponse extends ExtensionResponse<{
  imported: number;
  attempted: number;
  pages: number;
  duplicateCount?: number;
  dedupedIds?: string[];
  errors: string[];
}> {}

/** P3/#39 — Page-state probe for the generic bulk sources (GH/Lever/Workday). */
export interface BulkSourcePageStateResponse extends ExtensionResponse<{
  detected: boolean;
  rowCount: number;
  hasNextPage: boolean;
}> {}

/**
 * P3/#39 — Result of a bulk scrape run against one of the generic ATS sources.
 * Shape mirrors `WwBulkScrapeResponse` so the popup can render every source
 * with the same `BulkSourceCard` component without per-source casts.
 */
export interface BulkSourceScrapeResponse extends ExtensionResponse<{
  imported: number;
  attempted: number;
  pages: number;
  duplicateCount?: number;
  dedupedIds?: string[];
  errors: string[];
}> {}

// Send message to background script
export async function sendMessage<T>(
  message: ExtensionMessage,
): Promise<ExtensionResponse<T>> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: ExtensionResponse<T>) => {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(response || { success: false, error: "No response received" });
      }
    });
  });
}

// Send message to content script in specific tab
export async function sendToTab<T>(
  tabId: number,
  message: ExtensionMessage,
): Promise<ExtensionResponse<T>> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      message,
      (response: ExtensionResponse<T>) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(
            response || { success: false, error: "No response received" },
          );
        }
      },
    );
  });
}

// Send message to all content scripts
export async function broadcastMessage<T>(
  message: ExtensionMessage,
): Promise<void> {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch {
        // Tab might not have content script loaded
      }
    }
  }
}
