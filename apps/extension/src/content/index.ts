// Content script entry point for Columbus extension

// Import styles for content script
import "./ui/styles.css";

import { FieldDetector } from "./auto-fill/field-detector";
import { FieldMapper } from "./auto-fill/field-mapper";
import { AutoFillEngine } from "./auto-fill/engine";
import { getScraperForUrl } from "./scrapers/scraper-registry";
import { WaterlooWorksOrchestrator } from "./scrapers/waterloo-works-orchestrator";
import type {
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

  // Fill the form
  const result = await autoFillEngine.fillForm(detectedFields);
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

function pickUpSlothingToken(): boolean {
  try {
    const raw = localStorage.getItem(SLOTHING_TOKEN_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { token?: string; expiresAt?: string };
    if (!parsed?.token || !parsed?.expiresAt) return false;
    chrome.runtime.sendMessage(
      {
        type: "AUTH_CALLBACK",
        token: parsed.token,
        expiresAt: parsed.expiresAt,
      },
      (response: { success?: boolean } | undefined) => {
        if (response?.success) {
          try {
            localStorage.removeItem(SLOTHING_TOKEN_KEY);
          } catch {
            // ignore quota/security errors
          }
          console.log("[Columbus] picked up localStorage token");
        }
      },
    );
    return true;
  } catch {
    return false;
  }
}

if (
  /(^|\.)localhost(:|$)|^127\.0\.0\.1(:|$)|^\[::1\](:|$)/.test(
    window.location.host,
  )
) {
  if (!pickUpSlothingToken()) {
    let elapsedMs = 0;
    const intervalId = setInterval(() => {
      elapsedMs += 500;
      if (pickUpSlothingToken() || elapsedMs >= 30_000) {
        clearInterval(intervalId);
      }
    }, 500);
  }
}
