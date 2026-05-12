// Content script entry point for Columbus extension

// Import styles for content script
import "./ui/styles.css";

import { FieldDetector } from "./auto-fill/field-detector";
import { FieldMapper } from "./auto-fill/field-mapper";
import { AutoFillEngine } from "./auto-fill/engine";
import { getScraperForUrl } from "./scrapers/scraper-registry";
import { WaterlooWorksOrchestrator } from "./scrapers/waterloo-works-orchestrator";
import { GreenhouseOrchestrator } from "./scrapers/greenhouse-orchestrator";
import { LeverOrchestrator } from "./scrapers/lever-orchestrator";
import { WorkdayOrchestrator } from "./scrapers/workday-orchestrator";
import type {
  AnswerBankMatch,
  ExtensionProfile,
  ScrapedJob,
  DetectedField,
  ExtensionSettings,
  SimilarAnswer,
} from "@/shared/types";
import { sendMessage, Messages } from "@/shared/messages";
import { showAppliedToast } from "./tracking/applied-toast";
import { SubmitWatcher, extractCompanyHint } from "./tracking/submit-watcher";
import { JobPageSidebarController } from "./sidebar/controller";
import { CorrectionsTracker } from "./corrections-tracker";
import { tryCaptureLinkedInJob } from "./scrapers/linkedin-passive-capture";
import {
  mountAnswerBankButton,
  shouldDecorateTextarea,
  unmountAllAnswerBankButtons,
} from "./ui/answer-bank-button";
import { MultistepController } from "./multistep/controller";

// Initialize components
const fieldDetector = new FieldDetector();
let autoFillEngine: AutoFillEngine | null = null;
let cachedProfile: ExtensionProfile | null = null;
let detectedFields: DetectedField[] = [];
const detectedFieldsByForm = new WeakMap<HTMLFormElement, DetectedField[]>();
const autofilledForms = new WeakSet<HTMLFormElement>();
let scrapedJob: ScrapedJob | null = null;
let jobDetectedForUrl: string | null = null;
let profileLoadPromise: Promise<ExtensionProfile | null> | null = null;
const sidebarController = new JobPageSidebarController();
const correctionsTracker = new CorrectionsTracker();
// P3 / #36 #37 — wires Workday + Greenhouse multi-step handlers. The
// controller itself decides per-URL whether it should attach.
const multistepController = new MultistepController({
  getProfile: () => loadProfileForSidebar(),
});
multistepController.init();

const submitWatcher = new SubmitWatcher({
  getDetectedFields: (form) => detectedFieldsByForm.get(form) || [],
  getScrapedJob: () => scrapedJob,
  getSettings: getExtensionSettings,
  wasAutofilled: (form) => autofilledForms.has(form),
  onTracked: async (payload) => {
    const response = await sendMessage<{ opportunityId: string }>(
      Messages.trackApplied(payload),
    );
    if (!response.success) {
      console.error("[Columbus] Failed to track application:", response.error);
      return;
    }

    showAppliedToast(extractCompanyHint(scrapedJob, payload.host), () => {
      sendMessage(Messages.openDashboard()).catch((err) =>
        console.error("[Columbus] Failed to open dashboard:", err),
      );
    });
  },
});

// Scan page on load
scanPage();
submitWatcher.attach();

// Re-scan on dynamic content changes
const observer = new MutationObserver(debounce(scanPage, 500));
observer.observe(document.body, { childList: true, subtree: true });

async function scanPage() {
  // Detect forms
  const forms = document.querySelectorAll("form");
  for (const form of forms) {
    const fields = fieldDetector.detectFields(form);
    if (fields.length > 0) {
      detectedFieldsByForm.set(form, fields);
      detectedFields = fields;
      console.log("[Columbus] Detected fields:", fields.length);
    }
  }

  // P2/#35 — decorate long essay textareas with the inline answer-bank
  // popover. This runs in addition to the field detector above because the
  // textareas we care about often aren't owned by a recognised form (some
  // ATS portals use bare <textarea> with dynamic labels).
  scanForAnswerBankTextareas();

  // Check for job listing
  const scraper = getScraperForUrl(window.location.href);
  let nextScrapedJob: ScrapedJob | null = null;
  if (scraper.canHandle(window.location.href)) {
    try {
      nextScrapedJob = await scraper.scrapeJobListing();
      scrapedJob = nextScrapedJob;
      if (nextScrapedJob) {
        console.log("[Columbus] Scraped job:", nextScrapedJob.title);
        if (jobDetectedForUrl !== window.location.href) {
          jobDetectedForUrl = window.location.href;
          sendMessage(
            Messages.jobDetected({
              title: nextScrapedJob.title,
              company: nextScrapedJob.company,
              url: nextScrapedJob.url,
            }),
          ).catch((err) =>
            console.error("[Columbus] Failed to notify job detected:", err),
          );

          // P3/#38 — passive LinkedIn capture. Only runs on detail pages the
          // user navigated to themselves; the scraper already enforces this
          // because `sourceJobId` is only populated when the URL matches the
          // `/jobs/view/:id` pattern. Failures here are fire-and-forget so a
          // capture hiccup never blocks the visible scrape/sidebar UX.
          if (nextScrapedJob.source === "linkedin") {
            void tryCaptureLinkedInJob(nextScrapedJob, {
              sendMessage,
              buildImportMessage: Messages.importJob,
            }).catch((err) =>
              console.warn("[Columbus] LinkedIn passive capture failed:", err),
            );
          }
        }
      }
    } catch (err) {
      console.error("[Columbus] Scrape error:", err);
    }
  }

  if (!nextScrapedJob && scrapedJob?.url !== window.location.href) {
    scrapedJob = null;
  }

  void updateSidebar();
}

// Handle messages from popup and background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message)
    .then(sendResponse)
    .catch((err) => sendResponse({ success: false, error: err.message }));
  return true; // Async response
});

async function handleMessage(message: { type: string; payload?: unknown }) {
  switch (message.type) {
    case "GET_PAGE_STATUS":
      return {
        hasForm: detectedFields.length > 0,
        hasJobListing: scrapedJob !== null,
        detectedFields: detectedFields.length,
        scrapedJob,
      };

    case "TRIGGER_FILL":
      return handleFillForm();

    case "TRIGGER_IMPORT":
      if (scrapedJob) {
        return sendMessage(Messages.importJob(scrapedJob));
      }
      return { success: false, error: "No job detected" };

    case "SCRAPE_JOB":
      const scraper = getScraperForUrl(window.location.href);
      if (scraper.canHandle(window.location.href)) {
        scrapedJob = await scraper.scrapeJobListing();
        return { success: true, data: scrapedJob };
      }
      return { success: false, error: "No scraper available for this site" };

    case "SCRAPE_JOB_LIST":
      const listScraper = getScraperForUrl(window.location.href);
      if (listScraper.canHandle(window.location.href)) {
        const jobs = await listScraper.scrapeJobList();
        return { success: true, data: jobs };
      }
      return { success: false, error: "No scraper available for this site" };

    case "WW_GET_PAGE_STATE":
      return getWwPageState();

    case "WW_SCRAPE_ALL_VISIBLE":
      return runWwBulkScrape({ paginated: false });

    case "WW_SCRAPE_ALL_PAGINATED":
      return runWwBulkScrape({
        paginated: true,
        ...(message.payload as object),
      });

    // P3/#39 — Generic bulk-scrape orchestrators for public ATS hosts.
    case "BULK_GREENHOUSE_GET_PAGE_STATE":
      return getBulkSourcePageState("greenhouse");
    case "BULK_GREENHOUSE_SCRAPE_VISIBLE":
      return runBulkSourceScrape("greenhouse", { paginated: false });
    case "BULK_GREENHOUSE_SCRAPE_PAGINATED":
      return runBulkSourceScrape("greenhouse", {
        paginated: true,
        ...(message.payload as object),
      });

    case "BULK_LEVER_GET_PAGE_STATE":
      return getBulkSourcePageState("lever");
    case "BULK_LEVER_SCRAPE_VISIBLE":
      return runBulkSourceScrape("lever", { paginated: false });
    case "BULK_LEVER_SCRAPE_PAGINATED":
      return runBulkSourceScrape("lever", {
        paginated: true,
        ...(message.payload as object),
      });

    case "BULK_WORKDAY_GET_PAGE_STATE":
      return getBulkSourcePageState("workday");
    case "BULK_WORKDAY_SCRAPE_VISIBLE":
      return runBulkSourceScrape("workday", { paginated: false });
    case "BULK_WORKDAY_SCRAPE_PAGINATED":
      return runBulkSourceScrape("workday", {
        paginated: true,
        ...(message.payload as object),
      });

    case "MULTISTEP_STEP_TRANSITION":
      // P3 / #36 #37 — background's webNavigation listener saw a step
      // transition for this tab. The controller dispatches to the active
      // provider handler (Workday / Greenhouse), which re-fills the new DOM.
      await multistepController.onWebNavigationTransition();
      return { success: true };

    default:
      return { success: false, error: `Unknown message type: ${message.type}` };
  }
}

function isWaterlooWorks(): boolean {
  return /waterlooworks\.uwaterloo\.ca/.test(window.location.href);
}

function getWwPageState() {
  if (!isWaterlooWorks()) {
    return {
      success: true,
      data: { kind: "other", rowCount: 0, hasNextPage: false },
    };
  }
  const rows = document.querySelectorAll(
    "table.data-viewer-table tbody tr.table__row--body",
  );
  const nextBtn = document.querySelector<HTMLAnchorElement>(
    'a.pagination__link[aria-label="Go to next page"]',
  );
  const currentPage = document
    .querySelector<HTMLAnchorElement>("a.pagination__link.active")
    ?.textContent?.trim();
  const hasDetail = !!document.querySelector(
    ".dashboard-header__posting-title",
  );
  return {
    success: true,
    data: {
      kind: hasDetail ? "detail" : rows.length > 0 ? "list" : "other",
      rowCount: rows.length,
      hasNextPage: !!nextBtn && !nextBtn.classList.contains("disabled"),
      currentPage,
    },
  };
}

// P3/#39 — Generic bulk-source plumbing for Greenhouse/Lever/Workday.
type BulkSource = "greenhouse" | "lever" | "workday";

interface BulkOrchestratorLike {
  scrapeAllVisible(opts: {
    throttleMs?: number;
    maxJobs?: number;
    onProgress?: (p: {
      scrapedCount: number;
      attemptedCount: number;
      currentPage: number;
      totalRowsOnPage: number;
      done: boolean;
      errors: string[];
    }) => void;
  }): Promise<ScrapedJob[]>;
  scrapeAllPaginated(opts: {
    throttleMs?: number;
    maxJobs?: number;
    maxPages?: number;
    onProgress?: (p: {
      scrapedCount: number;
      attemptedCount: number;
      currentPage: number;
      totalRowsOnPage: number;
      done: boolean;
      errors: string[];
    }) => void;
  }): Promise<ScrapedJob[]>;
}

function getOrchestratorForSource(source: BulkSource): BulkOrchestratorLike {
  switch (source) {
    case "greenhouse":
      return new GreenhouseOrchestrator();
    case "lever":
      return new LeverOrchestrator();
    case "workday":
      return new WorkdayOrchestrator();
  }
}

function isBulkSourceHandled(source: BulkSource, url: string): boolean {
  switch (source) {
    case "greenhouse":
      return GreenhouseOrchestrator.canHandle(url);
    case "lever":
      return LeverOrchestrator.canHandle(url);
    case "workday":
      return WorkdayOrchestrator.canHandle(url);
  }
}

/**
 * Selectors used to count visible rows for the popup's "Detected: <source> —
 * N rows" badge. Each list mirrors the orchestrator's row selectors but stays
 * out-of-band so we can probe the page cheaply without instantiating the
 * orchestrator just to count.
 */
const BULK_ROW_SELECTORS: Record<BulkSource, string[]> = {
  greenhouse: [
    "div.opening",
    ".job-post",
    '[data-mapped="true"]',
    "section.level-0 div.opening",
  ],
  lever: [".posting", '[data-qa="posting-name"]'],
  workday: [
    '[data-automation-id="jobResults"] li',
    '[data-automation-id="jobResults"] [role="listitem"]',
    'ul[role="list"] li[data-automation-id*="job"]',
    "li.css-1q2dra3",
  ],
};

const BULK_NEXT_SELECTORS: Record<BulkSource, string[]> = {
  greenhouse: [
    'a[rel="next"]',
    'a[aria-label="Next page" i]',
    'button[aria-label="Next" i]',
    ".pagination .next a",
  ],
  lever: [
    'a[rel="next"]',
    'button[aria-label="Next" i]',
    'button[aria-label="Load more" i]',
  ],
  workday: [
    'button[data-uxi-element-id="next"]',
    'nav[aria-label="pagination"] button[aria-label*="next" i]',
    'button[aria-label="next" i]',
  ],
};

function countBulkRows(source: BulkSource): number {
  for (const selector of BULK_ROW_SELECTORS[source]) {
    const matches = document.querySelectorAll(selector);
    if (matches.length > 0) return matches.length;
  }
  return 0;
}

function bulkHasNextPage(source: BulkSource): boolean {
  for (const selector of BULK_NEXT_SELECTORS[source]) {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) continue;
    if (
      el.hasAttribute("disabled") ||
      el.getAttribute("aria-disabled") === "true" ||
      el.classList.contains("disabled")
    ) {
      continue;
    }
    return true;
  }
  return false;
}

function getBulkSourcePageState(source: BulkSource) {
  const url = window.location.href;
  if (!isBulkSourceHandled(source, url)) {
    return {
      success: true,
      data: { detected: false, rowCount: 0, hasNextPage: false },
    };
  }
  const rowCount = countBulkRows(source);
  return {
    success: true,
    data: {
      detected: rowCount > 0,
      rowCount,
      hasNextPage: bulkHasNextPage(source),
    },
  };
}

async function runBulkSourceScrape(
  source: BulkSource,
  opts: { paginated: boolean; maxJobs?: number; maxPages?: number },
) {
  const url = window.location.href;
  if (!isBulkSourceHandled(source, url)) {
    return { success: false, error: `Not a ${source} listing page` };
  }
  const orchestrator = getOrchestratorForSource(source);
  let errors: string[] = [];
  let pages = 1;
  const onProgress = (p: {
    scrapedCount: number;
    attemptedCount: number;
    currentPage: number;
    totalRowsOnPage: number;
    done: boolean;
    errors: string[];
  }) => {
    pages = p.currentPage;
    errors = p.errors;
    // Best-effort progress fan-out. The background routes it to the popup.
    sendMessage({
      type: `BULK_${source.toUpperCase()}_PROGRESS`,
      payload: p,
    } as never).catch(() => undefined);
  };

  const jobs = opts.paginated
    ? await orchestrator.scrapeAllPaginated({
        onProgress,
        maxJobs: opts.maxJobs,
        maxPages: opts.maxPages,
      })
    : await orchestrator.scrapeAllVisible({ onProgress });

  if (jobs.length === 0) {
    return {
      success: true,
      data: { imported: 0, attempted: 0, pages, errors },
    };
  }
  const importResp = await sendMessage<{
    imported: number;
    opportunityIds: string[];
    pendingCount: number;
    dedupedIds?: string[];
  }>(Messages.importJobsBatch(jobs));
  if (!importResp.success) {
    return {
      success: false,
      error: importResp.error || "Bulk import failed",
    };
  }
  return {
    success: true,
    data: {
      imported: importResp.data?.imported ?? jobs.length,
      attempted: jobs.length,
      pages,
      errors,
    },
  };
}

async function runWwBulkScrape(opts: {
  paginated: boolean;
  maxJobs?: number;
  maxPages?: number;
}) {
  if (!isWaterlooWorks()) {
    return { success: false, error: "Not a WaterlooWorks page" };
  }
  const orchestrator = new WaterlooWorksOrchestrator();
  let errors: string[] = [];
  let pages = 1;
  const onProgress = (p: {
    scrapedCount: number;
    attemptedCount: number;
    currentPage: number;
    totalRowsOnPage: number;
    done: boolean;
    errors: string[];
  }) => {
    pages = p.currentPage;
    errors = p.errors;
    // Fire-and-forget progress event to the background, which can fan it out
    // to the popup if open.
    sendMessage({
      type: "WW_BULK_PROGRESS",
      payload: p,
    } as never).catch(() => undefined);
  };
  const jobs = opts.paginated
    ? await orchestrator.scrapeAllPaginated({
        onProgress,
        maxJobs: opts.maxJobs,
        maxPages: opts.maxPages,
      })
    : await orchestrator.scrapeAllVisible({ onProgress });

  if (jobs.length === 0) {
    return {
      success: true,
      data: { imported: 0, attempted: 0, pages, errors },
    };
  }
  // Hand off to background to bulk-import to Slothing.
  const importResp = await sendMessage<{
    imported: number;
    opportunityIds: string[];
    pendingCount: number;
    dedupedIds?: string[];
  }>(Messages.importJobsBatch(jobs));
  if (!importResp.success) {
    return {
      success: false,
      error: importResp.error || "Bulk import failed",
    };
  }
  return {
    success: true,
    data: {
      imported: importResp.data?.imported ?? jobs.length,
      attempted: jobs.length,
      pages,
      errors,
    },
  };
}

async function handleFillForm() {
  if (detectedFields.length === 0) {
    return { success: false, error: "No fields detected" };
  }

  // Get profile if not cached
  if (!cachedProfile) {
    const response = await sendMessage<ExtensionProfile>(Messages.getProfile());
    if (!response.success || !response.data) {
      return { success: false, error: "Failed to load profile" };
    }
    cachedProfile = response.data;
  }

  // Create mapper and engine
  const mapper = new FieldMapper(cachedProfile);
  autoFillEngine = new AutoFillEngine(fieldDetector, mapper);

  // Read the cold-zone floor from settings. Defaults to the legacy 0.5 if
  // settings aren't available (e.g. transient background-storage failure).
  let minimumConfidence = 0.5;
  try {
    const settings = await getExtensionSettings();
    minimumConfidence = settings.minimumConfidence;
  } catch (err) {
    console.warn("[Columbus] Failed to load settings; using default 0.5", err);
  }

  // Fill the form. Hand each successful fill to the corrections tracker so
  // edits-after-fill flow back into the per-domain field mapping (#33).
  const result = await autoFillEngine.fillForm(detectedFields, {
    minimumConfidence,
    onFilled: ({ field, value }) => {
      correctionsTracker.track(field, value);
    },
  });
  if (result.filled >= 2) {
    for (const form of new Set(
      detectedFields
        .map((field) => field.element.closest("form"))
        .filter(
          (form): form is HTMLFormElement => form instanceof HTMLFormElement,
        ),
    )) {
      autofilledForms.add(form);
    }
  }
  return { success: true, data: result };
}

// Opens the web answer-bank page in a new tab, pre-seeded with the question
// label. Used by the "Generate new" button in the inline popover. The
// background returns the configured Slothing API base URL alongside the auth
// status, which is the same host the user's logged-in answer bank lives on.
async function openAnswerBankSeed(question: string) {
  const auth = await sendMessage<{ apiBaseUrl: string }>(
    Messages.getAuthStatus(),
  );
  const base =
    (auth.success && auth.data?.apiBaseUrl) || "http://localhost:3000";
  const url = `${base.replace(/\/$/, "")}/en/bank?seed=${encodeURIComponent(question)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// P2/#35 — scan textareas + decorate matches with the floating 💡 popover.
// Idempotent: the decorator marks each textarea so re-scans don't double-mount.
function scanForAnswerBankTextareas() {
  // querySelectorAll across the whole document. Workday/Greenhouse essay
  // fields don't always live inside a <form>, so we don't scope this to forms.
  const textareas = document.querySelectorAll<HTMLTextAreaElement>("textarea");
  for (const textarea of textareas) {
    try {
      if (!shouldDecorateTextarea(textarea)) continue;
      mountAnswerBankButton(textarea, {
        onMatch: async (q, limit) => {
          const response = await sendMessage<AnswerBankMatch[]>(
            Messages.matchAnswerBank({ q, limit: limit ?? 3 }),
          );
          if (!response.success) {
            throw new Error(
              response.error || "Couldn't reach the Slothing answer bank.",
            );
          }
          return response.data || [];
        },
        onPick: () => {
          // The decorator handles the DOM insertion (value + input/change
          // events). Nothing else to do here — kept as a hook for future
          // analytics / corrections (#33).
        },
        onGenerate: (q) => {
          // V1: ask the background to open the web answer-bank page with the
          // question pre-seeded. A streamed generation endpoint is deferred
          // to a follow-up (called out in the PR body).
          openAnswerBankSeed(q).catch((err) =>
            console.warn("[Columbus] open bank failed:", err),
          );
        },
      });
    } catch (err) {
      // A single textarea failure shouldn't abort the scan.
      console.warn("[Columbus] answer-bank decorate failed:", err);
    }
  }
}

async function getExtensionSettings(): Promise<ExtensionSettings> {
  const response = await sendMessage<ExtensionSettings>(Messages.getSettings());
  if (!response.success || !response.data) {
    throw new Error(response.error || "Failed to load extension settings");
  }
  return response.data;
}

async function updateSidebar() {
  const profile = await loadProfileForSidebar();
  await sidebarController.update({
    scrapedJob,
    detectedFieldCount: detectedFields.length,
    profile,
    onTailor: async () => {
      if (!scrapedJob) throw new Error("No job detected");
      const response = await sendMessage<{ url: string }>(
        Messages.tailorFromPage(scrapedJob),
      );
      if (!response.success || !response.data?.url) {
        throw new Error(response.error || "Failed to tailor resume");
      }
      window.open(response.data.url, "_blank", "noopener,noreferrer");
    },
    onCoverLetter: async () => {
      if (!scrapedJob) throw new Error("No job detected");
      const response = await sendMessage<{ url: string }>(
        Messages.generateCoverLetterFromPage(scrapedJob),
      );
      if (!response.success || !response.data?.url) {
        throw new Error(response.error || "Failed to generate cover letter");
      }
      window.open(response.data.url, "_blank", "noopener,noreferrer");
    },
    onSave: async () => {
      if (!scrapedJob) throw new Error("No job detected");
      const response = await sendMessage(Messages.importJob(scrapedJob));
      if (!response.success) {
        throw new Error(response.error || "Failed to save job");
      }
    },
    onAutoFill: async () => {
      // P3 / #36 #37 — Workday / Greenhouse get the multi-step pipeline so
      // subsequent steps in the application are filled automatically. Other
      // sites fall through to the single-page `handleFillForm` path.
      const provider = multistepController.init();
      if (provider) {
        const ok = await multistepController.confirm();
        if (!ok) {
          // The controller's confirm() returns false when there were no
          // fillable fields detected on the current page. Fall back to the
          // single-page path so users still get a meaningful error.
          const response = await handleFillForm();
          if (!response.success) {
            throw new Error(response.error || "Failed to auto-fill form");
          }
        }
        return;
      }

      const response = await handleFillForm();
      if (!response.success) {
        throw new Error(response.error || "Failed to auto-fill form");
      }
    },
    onSearchAnswers: async (query) => {
      const response = await sendMessage<SimilarAnswer[]>(
        Messages.searchAnswers(query),
      );
      if (!response.success) {
        throw new Error(response.error || "Answer search failed");
      }
      return response.data || [];
    },
    onApplyAnswer: (answer) => {
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      ) {
        active.value = answer.answer;
        active.dispatchEvent(new Event("input", { bubbles: true }));
        active.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
  });
}

async function loadProfileForSidebar(): Promise<ExtensionProfile | null> {
  if (cachedProfile) return cachedProfile;
  if (!profileLoadPromise) {
    profileLoadPromise = sendMessage<ExtensionProfile>(Messages.getProfile())
      .then((response) => {
        if (response.success && response.data) {
          cachedProfile = response.data;
          return response.data;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        profileLoadPromise = null;
      });
  }

  return profileLoadPromise;
}

window.addEventListener("pagehide", () => {
  submitWatcher.detach();
  sidebarController.destroy();
  correctionsTracker.clear();
  // P2/#35 — tear down every mounted answer-bank decoration so we don't leak
  // ResizeObservers or React roots when the page is bfcache-restored.
  unmountAllAnswerBankButtons();
  // P3 / #36 #37 — destroy the per-provider observers + dismiss any
  // in-flight fallback toast.
  multistepController.destroy();
});

// Utility: debounce function
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

console.log("[Columbus] Content script loaded");

// Pick up a localStorage-transported auth token from the Slothing connect page.
// Used on browsers that don't honor externally_connectable (Firefox in
// particular). The connect page writes the token under this key; we forward it
// to the background, which stores it in chrome.storage.local and clears the
// localStorage entry. Polls for ~30s in case the script runs before the page
// has written the key.
const SLOTHING_TOKEN_KEY = "columbus_extension_token";

// Returns "picked" when the token was forwarded to the background AND the
// localStorage entry was cleared (i.e., success), "empty" when there is
// nothing to do, or "pending" when a token is present but pickup is still in
// flight. The polling loop keeps going until the LS entry is gone (success)
// or the deadline lapses, so a single failed sendMessage doesn't strand the
// token forever on Firefox where this path is the only transport.
type PickupResult = "picked" | "empty" | "pending";

let pickupInFlight = false;

function pickUpSlothingToken(): PickupResult {
  try {
    const raw = localStorage.getItem(SLOTHING_TOKEN_KEY);
    if (!raw) return "empty";
    const parsed = JSON.parse(raw) as { token?: string; expiresAt?: string };
    if (!parsed?.token || !parsed?.expiresAt) {
      // Malformed payload — purge so we stop polling.
      try {
        localStorage.removeItem(SLOTHING_TOKEN_KEY);
      } catch {
        // ignore
      }
      return "empty";
    }
    if (pickupInFlight) return "pending";
    pickupInFlight = true;
    chrome.runtime.sendMessage(
      {
        type: "AUTH_CALLBACK",
        token: parsed.token,
        expiresAt: parsed.expiresAt,
      },
      (response: { success?: boolean } | undefined) => {
        pickupInFlight = false;
        if (response?.success) {
          try {
            localStorage.removeItem(SLOTHING_TOKEN_KEY);
          } catch {
            // ignore
          }
          console.log("[Columbus] picked up localStorage token");
        }
      },
    );
    return "pending";
  } catch {
    return "empty";
  }
}

if (
  /(^|\.)localhost(:|$)|^127\.0\.0\.1(:|$)|^\[::1\](:|$)/.test(
    window.location.host,
  )
) {
  // Initial probe: if there's nothing to pick up and we're not on the connect
  // page itself, there's no reason to poll — the page hasn't been opened.
  // On the connect page (or anywhere else if the user is about to land on
  // /extension/connect via SPA nav), keep polling for 30s.
  const initial = pickUpSlothingToken();
  const onConnectPath = /\/extension\/connect(\b|\/)/.test(
    window.location.pathname,
  );
  if (initial !== "empty" || onConnectPath) {
    let elapsedMs = 0;
    const intervalId = setInterval(() => {
      elapsedMs += 500;
      const result = pickUpSlothingToken();
      if (
        (result === "empty" && !pickupInFlight && elapsedMs > 2000) ||
        elapsedMs >= 30_000
      ) {
        clearInterval(intervalId);
      }
    }, 500);
  }
}
