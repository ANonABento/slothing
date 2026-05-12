// Message passing utilities for extension communication

import type {
  ExtensionMessage,
  ExtensionResponse,
  ExtensionProfile,
  ScrapedJob,
  LearnedAnswer,
  SimilarAnswer,
  DetectedField,
  TrackedApplicationPayload,
} from "./types";

// Type-safe message creators
export const Messages = {
  // Auth messages
  getAuthStatus: (): ExtensionMessage => ({ type: "GET_AUTH_STATUS" }),
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
  tailorFromPage: (job: ScrapedJob): ExtensionMessage<ScrapedJob> => ({
    type: "TAILOR_FROM_PAGE",
    payload: job,
  }),
  generateCoverLetterFromPage: (
    job: ScrapedJob,
  ): ExtensionMessage<ScrapedJob> => ({
    type: "GENERATE_COVER_LETTER_FROM_PAGE",
    payload: job,
  }),

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
};

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
