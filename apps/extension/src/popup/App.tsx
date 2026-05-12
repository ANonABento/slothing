import React, { useEffect, useState } from "react";
import type {
  ExtensionProfile,
  ExtensionResumeSummary,
  ScrapedJob,
} from "@/shared/types";
import { formatRelative } from "@slothing/shared/formatters";
import { scoreResume } from "@slothing/shared/scoring";
import { sendMessage, Messages } from "@/shared/messages";
import { messageForError } from "@/shared/error-messages";
import { opportunityDetailUrl, opportunityReviewUrl } from "./deep-links";

/** Sentinel value used for the picker's "Master profile" option (#34). */
const MASTER_RESUME_OPTION = "__master__";

type ViewState =
  | "loading"
  | "unauthenticated"
  | "session-lost"
  | "authenticated"
  | "error";
type PageAction = "tailor" | "cover-letter" | "import";

/**
 * Success state for the single-job action card. `opportunityId` is populated
 * for imports so the popup can render a "View in tracker →" deep-link (#31).
 */
interface ActionSuccess {
  action: PageAction;
  opportunityId?: string;
}

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
  const [actionSuccess, setActionSuccess] = useState<ActionSuccess | null>(
    null,
  );
  // Cached so the success row can render "View in tracker" links without
  // querying GET_AUTH_STATUS again. Populated from the auth-status response
  // on first load and kept stable for the lifetime of the popup.
  const [apiBaseUrl, setApiBaseUrl] = useState<string | null>(null);
  const [wwState, setWwState] = useState<WwPageState | null>(null);
  const [wwBulkInFlight, setWwBulkInFlight] = useState<WwBulkMode | null>(null);
  const [wwBulkResult, setWwBulkResult] = useState<WwBulkResult | null>(null);
  const [wwBulkError, setWwBulkError] = useState<string | null>(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  // #34 — multi-resume picker. Loaded lazily once we know we're authenticated;
  // selection defaults to the master profile and is reset whenever a new
  // success/error finishes so a follow-up tailor starts from a clean slate.
  const [resumeOptions, setResumeOptions] = useState<ExtensionResumeSummary[]>(
    [],
  );
  const [selectedResumeId, setSelectedResumeId] =
    useState<string>(MASTER_RESUME_OPTION);
  const profileScore = profile ? scoreResume({ profile }).overall : null;

  useEffect(() => {
    checkAuthStatus();
    checkPageStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function checkAuthStatus() {
    try {
      const response = await sendMessage(Messages.getAuthStatus());
      if (response.success && response.data) {
        const {
          isAuthenticated,
          sessionLost,
          apiBaseUrl: url,
        } = response.data as {
          isAuthenticated: boolean;
          sessionLost?: boolean;
          apiBaseUrl?: string;
        };
        if (url) setApiBaseUrl(url);
        if (isAuthenticated) {
          setViewState("authenticated");
          loadProfile();
        } else if (sessionLost) {
          setViewState("session-lost");
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
    // Fire-and-forget the resume list (#34). Failure is non-fatal — the picker
    // just doesn't render, falling back to the previous master-only flow.
    loadResumes();
  }

  async function loadResumes() {
    try {
      const response = await sendMessage<{
        resumes: ExtensionResumeSummary[];
      }>(Messages.listResumes());
      if (response.success && response.data?.resumes) {
        setResumeOptions(response.data.resumes);
      }
    } catch {
      // Non-fatal: leave the picker hidden.
    }
  }

  async function checkPageStatus() {
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
      if (tab.url && /waterlooworks\.uwaterloo\.ca/.test(tab.url)) {
        try {
          const r = await chrome.tabs.sendMessage(tab.id, {
            type: "WW_GET_PAGE_STATE",
          });
          if (r?.success) setWwState(r.data);
        } catch {
          // Content script not yet loaded
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
        setWwBulkError(
          messageForError(new Error(response?.error || "Bulk scrape failed")),
        );
      }
    } catch (err) {
      setWwBulkError(messageForError(err));
    } finally {
      setWwBulkInFlight(null);
    }
  }

  async function handleConnect() {
    await sendMessage(Messages.openAuth());
    window.close();
  }

  async function handleLogout() {
    if (!confirmingLogout) {
      setConfirmingLogout(true);
      setTimeout(() => setConfirmingLogout(false), 4000);
      return;
    }
    await sendMessage(Messages.logout());
    setViewState("unauthenticated");
    setProfile(null);
    setConfirmingLogout(false);
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
      const response = await sendMessage<{
        opportunityIds?: string[];
      }>(Messages.importJob(pageStatus.scrapedJob));
      if (response.success) {
        // Capture the opportunity id so the success row can deep-link into
        // /opportunities/[id] (#31). The import endpoint guarantees at least
        // one id on success, but be defensive about the array shape.
        const opportunityId = response.data?.opportunityIds?.[0];
        setActionSuccess({ action: "import", opportunityId });
        // Don't auto-close anymore — the success row now offers a follow-up
        // action ("View in tracker →"), so leave the popup open until the
        // user dismisses or clicks through.
      } else {
        setActionError(
          messageForError(new Error(response.error || "Failed to import job")),
        );
      }
    } catch (err) {
      setActionError(messageForError(err));
    } finally {
      setActionInFlight(null);
    }
  }

  async function handleGenerateFromPage(action: Exclude<PageAction, "import">) {
    if (!pageStatus?.scrapedJob) return;
    setActionInFlight(action);
    setActionError(null);
    try {
      // #34 — only thread `baseResumeId` through when the user actually picked
      // a non-master resume. Cover-letter generation doesn't take a base today,
      // so we only honor the selection for the tailor action.
      const baseResumeId =
        action === "tailor" && selectedResumeId !== MASTER_RESUME_OPTION
          ? selectedResumeId
          : undefined;
      const message =
        action === "tailor"
          ? Messages.tailorFromPage(pageStatus.scrapedJob, baseResumeId)
          : Messages.generateCoverLetterFromPage(pageStatus.scrapedJob);
      const response = await sendMessage<{ url: string }>(message);
      if (response.success && response.data?.url) {
        chrome.tabs.create({ url: response.data.url });
        setActionSuccess({ action });
        setTimeout(() => window.close(), 1500);
      } else {
        setActionError(
          messageForError(
            new Error(response.error || "Failed to generate document"),
          ),
        );
      }
    } catch (err) {
      setActionError(messageForError(err));
    } finally {
      setActionInFlight(null);
    }
  }

  async function handleOpenDashboard() {
    const baseUrl = await resolveApiBaseUrl();
    chrome.tabs.create({ url: `${baseUrl}/dashboard` });
    window.close();
  }

  /**
   * Resolves the configured Slothing API base URL, preferring the value we
   * cached at first paint (`apiBaseUrl`) and falling back to a fresh
   * GET_AUTH_STATUS roundtrip if we haven't seen one yet. Used by all the
   * deep-link handlers (#31).
   */
  async function resolveApiBaseUrl(): Promise<string> {
    if (apiBaseUrl) return apiBaseUrl;
    const response = await sendMessage(Messages.getAuthStatus());
    const data = response.data as { apiBaseUrl?: string } | undefined;
    return data?.apiBaseUrl || "http://localhost:3000";
  }

  /** Opens the imported opportunity in a new tab and closes the popup. (#31) */
  async function handleViewOpportunity(opportunityId: string) {
    const baseUrl = await resolveApiBaseUrl();
    chrome.tabs.create({ url: opportunityDetailUrl(baseUrl, opportunityId) });
    window.close();
  }

  /** Opens the review queue for the user to triage their bulk imports. (#31) */
  async function handleViewReviewQueue() {
    const baseUrl = await resolveApiBaseUrl();
    chrome.tabs.create({ url: opportunityReviewUrl(baseUrl) });
    window.close();
  }

  function profileInitial(): string {
    const name = profile?.contact?.name?.trim();
    if (name) return name.charAt(0).toUpperCase();
    const email = profile?.contact?.email;
    return email ? email.charAt(0).toUpperCase() : "S";
  }

  if (viewState === "loading") {
    return (
      <div className="popup">
        <div className="state-center">
          <div className="spinner" />
          <p className="state-text">Connecting…</p>
        </div>
      </div>
    );
  }

  if (viewState === "error") {
    return (
      <div className="popup">
        <div className="state-center">
          <div className="state-icon error" aria-hidden>
            !
          </div>
          <h2 className="state-title">Something went wrong</h2>
          <p className="state-text">{error}</p>
          <button className="btn primary" onClick={() => checkAuthStatus()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (viewState === "unauthenticated") {
    return (
      <div className="popup">
        <div className="hero">
          <div className="hero-mark">S</div>
          <h1 className="hero-title">Slothing</h1>
          <p className="hero-sub">
            Auto-fill applications. Import jobs. Track everything.
          </p>
          <button className="btn primary block" onClick={handleConnect}>
            Connect account
          </button>
          <p className="hero-foot">You'll sign in once — Slothing remembers.</p>
        </div>
      </div>
    );
  }

  if (viewState === "session-lost") {
    return (
      <div className="popup">
        <div className="hero session-lost">
          <div className="hero-mark warn" aria-hidden>
            !
          </div>
          <h1 className="hero-title">Session lost</h1>
          <p className="hero-sub">
            Slothing got reset by your browser. Reconnect to pick up where you
            left off — your profile and data are safe.
          </p>
          <button className="btn primary block" onClick={handleConnect}>
            Reconnect
          </button>
          <p className="hero-foot">Takes about five seconds.</p>
        </div>
      </div>
    );
  }

  const detectedJob = pageStatus?.scrapedJob;
  const showWwBulk = wwState && wwState.kind === "list";
  const showImportJobCard =
    detectedJob ||
    (wwState && wwState.kind === "detail" && pageStatus?.scrapedJob);
  const nothingDetected =
    !pageStatus?.hasForm && !showImportJobCard && !showWwBulk;

  return (
    <div className="popup">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span className="brand-name">Slothing</span>
        </div>
        <span className="pill ok" title="Extension connected">
          <span className="pill-dot" />
          Connected
        </span>
      </header>

      <section className="profile-card">
        <div className="avatar">{profileInitial()}</div>
        <div className="profile-meta">
          <div className="profile-name">
            {profile?.contact?.name ||
              profile?.contact?.email ||
              "Set up your profile"}
          </div>
          <div className="profile-sub">
            {profile?.computed?.currentTitle &&
            profile?.computed?.currentCompany
              ? `${profile.computed.currentTitle} · ${profile.computed.currentCompany}`
              : profile?.contact?.email ||
                "Add your work history so Slothing can tailor"}
          </div>
        </div>
        {profileScore !== null ? (
          <div
            className={`score ${profileScore >= 80 ? "high" : profileScore >= 50 ? "mid" : "low"}`}
            title="Profile completeness"
          >
            <span className="score-num">{profileScore}</span>
            <span className="score-unit">/100</span>
          </div>
        ) : (
          <button className="btn ghost tight" onClick={handleOpenDashboard}>
            Open
          </button>
        )}
      </section>

      <main className="content">
        {pageStatus?.hasForm && (
          <article className="card accent">
            <header className="card-head">
              <span className="card-title">Application form detected</span>
              <span className="badge">{pageStatus.detectedFields} fields</span>
            </header>
            <button className="btn primary block" onClick={handleFillForm}>
              Auto-fill form
            </button>
          </article>
        )}

        {showImportJobCard && detectedJob && (
          <article className="card">
            <header className="card-head">
              <span className="card-title clip" title={detectedJob.title}>
                {detectedJob.title}
              </span>
              <span className="card-sub clip">{detectedJob.company}</span>
            </header>
            {actionSuccess ? (
              <div className="success-row">
                <span className="check">✓</span>
                <span className="success-label">
                  {actionSuccess.action === "import"
                    ? "Imported to opportunities"
                    : "Opening tab…"}
                </span>
                {actionSuccess.action === "import" &&
                  actionSuccess.opportunityId && (
                    <button
                      className="success-link"
                      onClick={() =>
                        handleViewOpportunity(actionSuccess.opportunityId!)
                      }
                    >
                      View in tracker →
                    </button>
                  )}
              </div>
            ) : (
              <>
                {resumeOptions.length > 0 && (
                  <label className="resume-picker">
                    <span className="resume-picker-label">Base on</span>
                    <select
                      className="resume-picker-select"
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      disabled={actionInFlight !== null}
                      aria-label="Choose the resume to tailor from"
                    >
                      <option value={MASTER_RESUME_OPTION}>
                        Master profile
                      </option>
                      {resumeOptions.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <div className="action-grid">
                  <button
                    className="btn primary"
                    onClick={() => handleGenerateFromPage("tailor")}
                    disabled={actionInFlight !== null}
                  >
                    {actionInFlight === "tailor"
                      ? "Tailoring…"
                      : "Tailor resume"}
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleGenerateFromPage("cover-letter")}
                    disabled={actionInFlight !== null}
                  >
                    {actionInFlight === "cover-letter"
                      ? "Writing…"
                      : "Cover letter"}
                  </button>
                  <button
                    className="btn ghost full"
                    onClick={handleImportJob}
                    disabled={actionInFlight !== null}
                  >
                    {actionInFlight === "import"
                      ? "Importing…"
                      : "Just import to tracker"}
                  </button>
                </div>
              </>
            )}
            {actionError && <p className="inline-error">{actionError}</p>}
          </article>
        )}

        {showWwBulk && wwState && (
          <article className="card">
            <header className="card-head">
              <span className="card-title">WaterlooWorks list</span>
              <span className="badge">
                {wwState.rowCount} row{wwState.rowCount === 1 ? "" : "s"}
              </span>
            </header>
            <div className="action-grid">
              <button
                className="btn primary full"
                onClick={() => handleWwBulkScrape("visible")}
                disabled={wwBulkInFlight !== null || wwState.rowCount === 0}
              >
                {wwBulkInFlight === "visible"
                  ? "Scraping visible…"
                  : `Scrape ${wwState.rowCount} visible`}
              </button>
              <button
                className="btn full"
                onClick={() => handleWwBulkScrape("paginated")}
                disabled={wwBulkInFlight !== null || wwState.rowCount === 0}
                title="Walks every page in your current filter set; capped at 200 jobs."
              >
                {wwBulkInFlight === "paginated"
                  ? "Walking pages…"
                  : "Scrape filtered set"}
              </button>
            </div>
            {wwBulkResult && (
              <div className="bulk-result">
                <p className="inline-note">
                  Imported {wwBulkResult.imported}/{wwBulkResult.attempted}
                  {wwBulkResult.pages > 1 && ` · ${wwBulkResult.pages} pages`}
                  {wwBulkResult.errors.length > 0 &&
                    ` · ${wwBulkResult.errors.length} errors`}
                </p>
                {wwBulkResult.imported > 0 && (
                  <button
                    className="success-link"
                    onClick={handleViewReviewQueue}
                  >
                    View tracker →
                  </button>
                )}
              </div>
            )}
            {wwBulkError && <p className="inline-error">{wwBulkError}</p>}
          </article>
        )}

        {nothingDetected && (
          <div className="idle">
            <p className="idle-title">No job detected on this page</p>
            <p className="idle-sub">
              Open a posting on any of these and Slothing wakes up:
            </p>
            <div className="site-chips">
              <span className="site-chip">LinkedIn</span>
              <span className="site-chip">Indeed</span>
              <span className="site-chip">Greenhouse</span>
              <span className="site-chip">Lever</span>
              <span className="site-chip">WaterlooWorks</span>
              <span className="site-chip">Workday</span>
            </div>
          </div>
        )}

        <div className="quick-row">
          <button className="quick" onClick={handleOpenDashboard}>
            <span className="quick-icon" aria-hidden>
              ↗
            </span>
            <span>Dashboard</span>
          </button>
          <button
            className="quick"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            <span className="quick-icon" aria-hidden>
              ⚙
            </span>
            <span>Settings</span>
          </button>
        </div>
      </main>

      <footer className="footbar">
        <button
          className={`link ${confirmingLogout ? "warn" : ""}`}
          onClick={handleLogout}
        >
          {confirmingLogout ? "Click again to disconnect" : "Disconnect"}
        </button>
        {profile?.updatedAt && (
          <span className="updated">
            Synced {formatRelative(profile.updatedAt)}
          </span>
        )}
      </footer>
    </div>
  );
}
