// Content script entry point for Columbus extension

// Import styles for content script
import "./ui/styles.css";

import { FieldDetector } from "./auto-fill/field-detector";
import { FieldMapper } from "./auto-fill/field-mapper";
import { AutoFillEngine } from "./auto-fill/engine";
import { getScraperForUrl } from "./scrapers/scraper-registry";
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

    default:
      return { success: false, error: `Unknown message type: ${message.type}` };
  }
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
