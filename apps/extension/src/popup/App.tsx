import React, { useEffect, useState } from "react";
import type { ExtensionProfile, ScrapedJob } from "@/shared/types";
import { formatRelative } from "@slothing/shared/formatters";
import { scoreResume } from "@slothing/shared/scoring";
import { sendMessage, Messages } from "@/shared/messages";

type ViewState = "loading" | "unauthenticated" | "authenticated" | "error";
type PageAction = "tailor" | "cover-letter" | "import";

interface PageStatus {
  hasForm: boolean;
  hasJobListing: boolean;
  detectedFields: number;
  scrapedJob: ScrapedJob | null;
}

type WwPageKind = "list" | "detail" | "other";
interface WwPageState {
  kind: WwPageKind;
  rowCount: number;
  hasNextPage: boolean;
  currentPage?: string;
}

type WwBulkMode = "visible" | "paginated";
interface WwBulkResult {
  imported: number;
  attempted: number;
  pages: number;
  errors: string[];
}

export default function App() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<ExtensionProfile | null>(null);
  const [pageStatus, setPageStatus] = useState<PageStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionInFlight, setActionInFlight] = useState<PageAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<PageAction | null>(null);
  const [wwState, setWwState] = useState<WwPageState | null>(null);
  const [wwBulkInFlight, setWwBulkInFlight] = useState<WwBulkMode | null>(null);
  const [wwBulkResult, setWwBulkResult] = useState<WwBulkResult | null>(null);
  const [wwBulkError, setWwBulkError] = useState<string | null>(null);
  const profileScore = profile ? scoreResume({ profile }).overall : null;

  useEffect(() => {
    checkAuthStatus();
    checkPageStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkAuthStatus() {
    try {
      const response = await sendMessage(Messages.getAuthStatus());
      if (response.success && response.data) {
        const { isAuthenticated } = response.data as {
          isAuthenticated: boolean;
        };
        if (isAuthenticated) {
          setViewState("authenticated");
          loadProfile();
        } else {
          setViewState("unauthenticated");
        }
      } else {
        setViewState("unauthenticated");
      }
    } catch (err) {
      setError((err as Error).message);
      setViewState("error");
    }
  }

  async function loadProfile() {
    const response = await sendMessage<ExtensionProfile>(Messages.getProfile());
    if (response.success && response.data) {
      setProfile(response.data);
    }
  }

  async function checkPageStatus() {
    // Get current tab and send message to content script
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: "GET_PAGE_STATUS",
        });
        if (response) {
          setPageStatus(response);
        }
      } catch {
        // Content script not loaded
      }
      // Probe for WaterlooWorks-specific state when applicable
      if (tab.url && /waterlooworks\.uwaterloo\.ca/.test(tab.url)) {
        try {
          const r = await chrome.tabs.sendMessage(tab.id, {
            type: "WW_GET_PAGE_STATE",
          });
          if (r?.success) setWwState(r.data);
        } catch {
          // Content script not yet loaded — that's ok, button section just hides.
        }
      }
    }
  }

  async function handleWwBulkScrape(mode: WwBulkMode) {
    setWwBulkInFlight(mode);
    setWwBulkError(null);
    setWwBulkResult(null);
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) throw new Error("No active tab");
      const message =
        mode === "visible"
          ? Messages.wwScrapeAllVisible()
          : Messages.wwScrapeAllPaginated();
      const response: {
        success: boolean;
        data?: WwBulkResult;
        error?: string;
      } = await chrome.tabs.sendMessage(tab.id, message);
      if (response?.success && response.data) {
        setWwBulkResult(response.data);
      } else {
        setWwBulkError(response?.error || "Bulk scrape failed");
      }
    } catch (err) {
      setWwBulkError((err as Error).message);
    } finally {
      setWwBulkInFlight(null);
    }
  }

  async function handleConnect() {
    await sendMessage(Messages.openAuth());
    window.close();
  }

  async function handleLogout() {
    await sendMessage(Messages.logout());
    setViewState("unauthenticated");
    setProfile(null);
  }

  async function handleFillForm() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_FILL" });
      window.close();
    }
  }

  async function handleImportJob() {
    if (!pageStatus?.scrapedJob) return;

    setActionInFlight("import");
    setActionError(null);
    try {
      const response = await sendMessage(
        Messages.importJob(pageStatus.scrapedJob),
      );
      if (response.success) {
        setActionSuccess("import");
        setTimeout(() => window.close(), 1500);
      } else {
        setActionError(response.error || "Failed to import job");
      }
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setActionInFlight(null);
    }
  }

  async function handleGenerateFromPage(action: Exclude<PageAction, "import">) {
    if (!pageStatus?.scrapedJob) return;

    setActionInFlight(action);
    setActionError(null);
    try {
      const message =
        action === "tailor"
          ? Messages.tailorFromPage(pageStatus.scrapedJob)
          : Messages.generateCoverLetterFromPage(pageStatus.scrapedJob);
      const response = await sendMessage<{ url: string }>(message);
      if (response.success && response.data?.url) {
        chrome.tabs.create({ url: response.data.url });
        setActionSuccess(action);
        setTimeout(() => window.close(), 1500);
      } else {
        setActionError(response.error || "Failed to generate document");
      }
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setActionInFlight(null);
    }
  }

  async function handleOpenDashboard() {
    const response = await sendMessage(Messages.getAuthStatus());
    const data = response.data as { apiBaseUrl: string } | undefined;
    const baseUrl = data?.apiBaseUrl || "http://localhost:3000";
    chrome.tabs.create({ url: `${baseUrl}/dashboard` });
    window.close();
  }

  if (viewState === "loading") {
    return (
      <div className="popup-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <div className="popup-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => checkAuthStatus()}>Retry</button>
        </div>
      </div>
    );
  }

  if (viewState === "unauthenticated") {
    return (
      <div className="popup-container">
        <div className="header">
          <h1>Slothing</h1>
          <p className="subtitle">Job Application Assistant</p>
        </div>
        <div className="content">
          <p>
            Connect your Slothing account to start auto-filling job
            applications.
          </p>
          <button className="primary" onClick={handleConnect}>
            Connect Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="header">
        <h1>Slothing</h1>
        {profile && (
          <p className="subtitle">
            {profile.contact?.name || "No profile name"}
          </p>
        )}
      </div>

      <div className="content">
        {/* Page Actions */}
        {pageStatus && (
          <div className="section">
            <h3>Current Page</h3>

            {pageStatus.hasForm && (
              <div className="action-card">
                <div className="action-info">
                  <span className="action-title">
                    Application Form Detected
                  </span>
                  <span className="action-subtitle">
                    {pageStatus.detectedFields} fields found
                  </span>
                </div>
                <button className="primary small" onClick={handleFillForm}>
                  Fill Form
                </button>
              </div>
            )}

            {pageStatus.hasJobListing && pageStatus.scrapedJob && (
              <div className="action-card">
                <div className="action-info">
                  <span className="action-title">
                    {pageStatus.scrapedJob.title}
                  </span>
                  <span className="action-subtitle">
                    {pageStatus.scrapedJob.company}
                  </span>
                </div>
                {actionSuccess ? (
                  <span className="success-badge">
                    {actionSuccess === "import"
                      ? "Imported!"
                      : "Generated! Opening..."}
                  </span>
                ) : (
                  <div className="action-stack">
                    <button
                      className="primary small"
                      onClick={() => handleGenerateFromPage("tailor")}
                      disabled={actionInFlight !== null}
                    >
                      {actionInFlight === "tailor"
                        ? "Tailoring..."
                        : "Tailor my resume for this"}
                    </button>
                    <button
                      className="secondary small"
                      onClick={() => handleGenerateFromPage("cover-letter")}
                      disabled={actionInFlight !== null}
                    >
                      {actionInFlight === "cover-letter"
                        ? "Generating..."
                        : "Generate cover letter"}
                    </button>
                    <button
                      className="text-button small"
                      onClick={handleImportJob}
                      disabled={actionInFlight !== null}
                    >
                      {actionInFlight === "import"
                        ? "Importing..."
                        : "Just import"}
                    </button>
                    {actionError && (
                      <p className="error-inline">{actionError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!pageStatus.hasForm && !pageStatus.hasJobListing && !wwState && (
              <p className="muted">
                No job application form or listing detected on this page.
              </p>
            )}
          </div>
        )}

        {/* WaterlooWorks bulk-scrape section */}
        {wwState && wwState.kind !== "other" && (
          <div className="section">
            <h3>Detected: WaterlooWorks</h3>
            <div className="ww-bulk">
              <button
                className="primary small"
                onClick={handleImportJob}
                disabled={
                  wwState.kind !== "detail" ||
                  !pageStatus?.scrapedJob ||
                  actionInFlight !== null
                }
                title={
                  wwState.kind !== "detail"
                    ? "Click into a posting row to open its details first."
                    : ""
                }
              >
                {actionInFlight === "import"
                  ? "Importing..."
                  : "Import this job"}
              </button>
              <button
                className="secondary small"
                onClick={() => handleWwBulkScrape("visible")}
                disabled={
                  wwBulkInFlight !== null ||
                  wwState.kind !== "list" ||
                  wwState.rowCount === 0
                }
                title={
                  wwState.kind !== "list"
                    ? "Open the postings list view to enable bulk scrape."
                    : ""
                }
              >
                {wwBulkInFlight === "visible"
                  ? "Scraping..."
                  : `Scrape all visible${wwState.rowCount ? ` (${wwState.rowCount})` : ""}`}
              </button>
              <button
                className="secondary small"
                onClick={() => handleWwBulkScrape("paginated")}
                disabled={
                  wwBulkInFlight !== null ||
                  wwState.kind !== "list" ||
                  wwState.rowCount === 0
                }
                title={
                  wwState.kind !== "list"
                    ? "Open the postings list view to enable bulk scrape."
                    : "Walks every page in your current filter set; capped at 200 jobs."
                }
              >
                {wwBulkInFlight === "paginated"
                  ? "Scraping all pages..."
                  : "Scrape entire filtered set"}
              </button>

              {wwBulkResult && (
                <p className="muted">
                  Imported {wwBulkResult.imported} / attempted{" "}
                  {wwBulkResult.attempted}
                  {wwBulkResult.pages > 1
                    ? ` across ${wwBulkResult.pages} pages`
                    : ""}
                  {wwBulkResult.errors.length > 0
                    ? ` · ${wwBulkResult.errors.length} errors`
                    : ""}
                </p>
              )}
              {wwBulkError && <p className="error-inline">{wwBulkError}</p>}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="secondary" onClick={handleOpenDashboard}>
              Open Dashboard
            </button>
            <button
              className="secondary"
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Profile Preview */}
        {profile && (
          <div className="section">
            <h3>Profile</h3>
            <div className="profile-preview">
              {profile.contact?.email && <p>{profile.contact.email}</p>}
              {profile.computed?.currentTitle &&
                profile.computed?.currentCompany && (
                  <p className="muted">
                    {profile.computed.currentTitle} at{" "}
                    {profile.computed.currentCompany}
                  </p>
                )}
              {profile.skills && profile.skills.length > 0 && (
                <div className="skills-preview">
                  {profile.skills.slice(0, 5).map((skill) => (
                    <span key={skill.id} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
                  {profile.skills.length > 5 && (
                    <span className="skill-tag more">
                      +{profile.skills.length - 5}
                    </span>
                  )}
                </div>
              )}
              {profileScore !== null && (
                <p className="muted">Profile score {profileScore}/100</p>
              )}
              {profile.updatedAt && (
                <p className="muted">
                  Updated {formatRelative(profile.updatedAt)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="footer">
        <button className="text-button" onClick={handleLogout}>
          Disconnect
        </button>
      </div>
    </div>
  );
}
