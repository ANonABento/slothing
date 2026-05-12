// Background service worker for Columbus extension

import type {
  ExtensionMessage,
  ExtensionResponse,
  ScrapedJob,
  TrackedApplicationPayload,
} from "@/shared/types";
import type { TailorFromPagePayload } from "@/shared/messages";
import { getAPIClient, resetAPIClient } from "./api-client";
import {
  getStorage,
  setAuthToken,
  clearAuthToken,
  forgetAuthHistory,
  getCachedProfile,
  setCachedProfile,
  getApiBaseUrl,
  getSettings,
  isSessionLost,
  getSessionAuthCache,
  setSessionAuthCache,
  clearSessionAuthCache,
} from "./storage";
import { setBadgeForTab, clearBadgeForTab } from "./badge";

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    handleMessage(message, sender)
      .then(sendResponse)
      .catch((error) => {
        console.error("[Columbus] Message handler error:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate async response
    return true;
  },
);

async function handleMessage(
  message: ExtensionMessage,
  sender: chrome.runtime.MessageSender,
): Promise<ExtensionResponse> {
  switch (message.type) {
    case "GET_AUTH_STATUS":
      return handleGetAuthStatus();

    case "OPEN_AUTH":
      return handleOpenAuth();

    case "LOGOUT":
      return handleLogout();

    case "GET_PROFILE":
      return handleGetProfile();

    case "GET_SETTINGS":
      return handleGetSettings();

    case "IMPORT_JOB":
      return handleImportJob(message.payload as ScrapedJob);

    case "IMPORT_JOBS_BATCH":
      return handleImportJobsBatch(message.payload as ScrapedJob[]);

    case "TRACK_APPLIED":
      return handleTrackApplied(message.payload as TrackedApplicationPayload);

    case "OPEN_DASHBOARD":
      return handleOpenDashboard();

    case "CAPTURE_VISIBLE_TAB":
      return handleCaptureVisibleTab();

    case "TAILOR_FROM_PAGE":
      return handleTailorFromPage(
        message.payload as TailorFromPagePayload | ScrapedJob,
      );

    case "GENERATE_COVER_LETTER_FROM_PAGE":
      return handleGenerateCoverLetterFromPage(message.payload as ScrapedJob);

    case "LIST_RESUMES":
      return handleListResumes();

    case "SAVE_ANSWER":
      return handleSaveAnswer(
        message.payload as {
          question: string;
          answer: string;
          url?: string;
          company?: string;
        },
      );

    case "SEARCH_ANSWERS":
      return handleSearchAnswers(message.payload as string);

    case "GET_LEARNED_ANSWERS":
      return handleGetLearnedAnswers();

    case "DELETE_ANSWER":
      return handleDeleteAnswer(message.payload as string);

    case "JOB_DETECTED": {
      const tabId = sender.tab?.id;
      if (!tabId) return { success: false, error: "No tab ID in sender" };
      await setBadgeForTab(tabId);
      return { success: true };
    }

    case "AUTH_CALLBACK": {
      // Sent by the content script when it picks up a localStorage-transported
      // token from the Slothing connect page (the localStorage path is used on
      // browsers without externally_connectable — Firefox in particular).
      const payload = message as {
        type: string;
        token?: string;
        expiresAt?: string;
      };
      if (!payload.token || !payload.expiresAt) {
        return { success: false, error: "Missing token or expiresAt" };
      }
      try {
        await setAuthToken(payload.token, payload.expiresAt);
        resetAPIClient();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: (error as Error).message,
        };
      }
    }

    default:
      return { success: false, error: `Unknown message type: ${message.type}` };
  }
}

async function handleTailorFromPage(
  payload: TailorFromPagePayload | ScrapedJob,
): Promise<ExtensionResponse> {
  // Support both the new wrapped payload ({job, baseResumeId}) used by the
  // popup picker (#34) and the legacy bare ScrapedJob still sent by the
  // content-script Tailor action. The "url" presence on the inner object is
  // the cheapest discriminator (ScrapedJob has it, TailorFromPagePayload
  // doesn't).
  const isLegacy = "url" in payload && !("job" in payload);
  const job: ScrapedJob = isLegacy
    ? (payload as ScrapedJob)
    : (payload as TailorFromPagePayload).job;
  const baseResumeId = isLegacy
    ? undefined
    : (payload as TailorFromPagePayload).baseResumeId;

  try {
    const client = await getAPIClient();
    const result = await client.tailorFromJob(job, baseResumeId);
    const apiBaseUrl = await getApiBaseUrl();
    const resumeId = result.savedResume.id;

    const studioParams = new URLSearchParams({
      from: "extension",
      tailorId: resumeId,
    });
    if (baseResumeId) {
      studioParams.set("baseResumeId", baseResumeId);
    }

    return {
      success: true,
      data: {
        url: `${apiBaseUrl}/studio?${studioParams.toString()}`,
        opportunityId: result.opportunityId,
        resumeId,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleListResumes(): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const resumes = await client.listResumes();
    return { success: true, data: { resumes } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleGenerateCoverLetterFromPage(
  job: ScrapedJob,
): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const result = await client.generateCoverLetterFromJob(job);
    const apiBaseUrl = await getApiBaseUrl();
    const coverLetterId = result.savedCoverLetter.id;

    return {
      success: true,
      data: {
        url: `${apiBaseUrl}/cover-letter?from=extension&id=${encodeURIComponent(coverLetterId)}`,
        opportunityId: result.opportunityId,
        coverLetterId,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleGetAuthStatus(): Promise<ExtensionResponse> {
  // Fast-path (#30): return a cached verdict if it's <60s old, then
  // revalidate in the background so a flipped server state still
  // self-corrects on the *next* popup open.
  try {
    const cached = await getSessionAuthCache();
    if (cached) {
      const apiBaseUrl = await getApiBaseUrl();
      const storage = await getStorage();
      const sessionLost = !cached.authenticated && isSessionLost(storage);

      // Fire-and-forget revalidation. We deliberately don't await it so
      // the popup gets its response immediately.
      void revalidateAuthInBackground();

      return {
        success: true,
        data: {
          isAuthenticated: cached.authenticated,
          apiBaseUrl,
          sessionLost,
        },
      };
    }
  } catch {
    // Cache lookup failure is non-fatal; fall through to the verify path.
  }

  try {
    const client = await getAPIClient();
    const isAuthenticated = await client.isAuthenticated();
    const apiBaseUrl = await getApiBaseUrl();
    const storage = await getStorage();
    const sessionLost = !isAuthenticated && isSessionLost(storage);

    await setSessionAuthCache(isAuthenticated);

    return {
      success: true,
      data: { isAuthenticated, apiBaseUrl, sessionLost },
    };
  } catch (error) {
    const apiBaseUrl = await getApiBaseUrl();
    const storage = await getStorage().catch(() => null);
    const sessionLost = storage ? isSessionLost(storage) : false;
    return {
      success: true,
      data: { isAuthenticated: false, apiBaseUrl, sessionLost },
    };
  }
}

/**
 * Background revalidation that runs after we return a cached verdict.
 * Refreshes the session cache so subsequent reads stay fresh; on a 401
 * the api-client's authenticatedFetch clears `authToken` + the cache
 * already.
 */
async function revalidateAuthInBackground(): Promise<void> {
  try {
    const client = await getAPIClient();
    const verdict = await client.isAuthenticated();
    await setSessionAuthCache(verdict);
  } catch {
    // Network blip — leave the cache alone; next miss will revalidate.
  }
}

async function handleOpenAuth(): Promise<ExtensionResponse> {
  try {
    const apiBaseUrl = await getApiBaseUrl();
    // Pass extension ID so the connect page can deliver the token back via
    // chrome.runtime.sendMessage(extensionId, ...). The page is a regular web
    // page and cannot resolve the calling extension by passing undefined.
    const authUrl = `${apiBaseUrl}/extension/connect?extensionId=${chrome.runtime.id}`;

    await chrome.tabs.create({ url: authUrl });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleLogout(): Promise<ExtensionResponse> {
  try {
    await clearAuthToken();
    // Explicit logout — also drop the "we've seen you before" breadcrumb so
    // the popup doesn't fall into the #27 "session lost" branch.
    await forgetAuthHistory();
    // And the fast-path cache (#30) so the next popup open re-verifies.
    await clearSessionAuthCache();
    resetAPIClient();
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleGetProfile(): Promise<ExtensionResponse> {
  try {
    // Check cache first
    const cached = await getCachedProfile();
    if (cached) {
      return { success: true, data: cached };
    }

    // Fetch from API
    const client = await getAPIClient();
    const profile = await client.getProfile();

    // Cache the profile
    await setCachedProfile(profile);

    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleGetSettings(): Promise<ExtensionResponse> {
  try {
    return { success: true, data: await getSettings() };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleImportJob(job: ScrapedJob): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const result = await client.importJob(job);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleImportJobsBatch(
  jobs: ScrapedJob[],
): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const result = await client.importJobsBatch(jobs);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleTrackApplied(
  payload: TrackedApplicationPayload,
): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const result = await client.trackApplied(payload);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleOpenDashboard(): Promise<ExtensionResponse> {
  try {
    const apiBaseUrl = await getApiBaseUrl();
    await chrome.tabs.create({ url: `${apiBaseUrl}/dashboard` });
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleCaptureVisibleTab(): Promise<ExtensionResponse> {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(undefined, {
      format: "jpeg",
      quality: 35,
    });
    return { success: true, data: { dataUrl } };
  } catch {
    return { success: false };
  }
}

async function handleSaveAnswer(data: {
  question: string;
  answer: string;
  url?: string;
  company?: string;
}): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const result = await client.saveLearnedAnswer({
      question: data.question,
      answer: data.answer,
      sourceUrl: data.url,
      sourceCompany: data.company,
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleSearchAnswers(
  question: string,
): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const results = await client.searchSimilarAnswers(question);
    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleGetLearnedAnswers(): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    const answers = await client.getLearnedAnswers();
    return { success: true, data: answers };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function handleDeleteAnswer(id: string): Promise<ExtensionResponse> {
  try {
    const client = await getAPIClient();
    await client.deleteLearnedAnswer(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Handle auth callback from Columbus web app
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (
      message.type === "AUTH_CALLBACK" &&
      message.token &&
      message.expiresAt
    ) {
      setAuthToken(message.token, message.expiresAt)
        .then(() => {
          resetAPIClient();
          sendResponse({ success: true });
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true;
    }
  },
);

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  switch (command) {
    case "fill-form":
      chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_FILL" });
      break;
    case "import-job":
      chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_IMPORT" });
      break;
  }
});

// Clear badge when a tab navigates to a new URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading" && changeInfo.url) {
    clearBadgeForTab(tabId).catch(() => {});
  }
});

// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[Columbus] Extension installed");
    // Could open onboarding page here
  } else if (details.reason === "update") {
    console.log(
      "[Columbus] Extension updated to",
      chrome.runtime.getManifest().version,
    );
  }
});

console.log("[Columbus] Background service worker started");
