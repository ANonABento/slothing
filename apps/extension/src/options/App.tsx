import React, { useEffect, useRef, useState } from "react";
import type {
  ExtensionSettings,
  LearnedAnswer,
  SiteRule,
  SiteRuleMode,
} from "@/shared/types";
import { DEFAULT_SETTINGS, DEFAULT_API_BASE_URL } from "@/shared/types";
import { normalizeRuleHost } from "@/shared/site-rules";
import {
  updateSettings,
  getSettings,
  getApiBaseUrl,
  setApiBaseUrl,
  getEffectiveSiteRules,
  addSiteRule,
  updateSiteRule,
  removeSiteRule,
} from "../background/storage";
import { messageForError } from "@/shared/error-messages";
import {
  AUTO_SAVE_DEBOUNCE_MS,
  SAVED_LINGER_MS,
  labelForStatus,
  type OptionsSaveStatus,
} from "./save-status";

export default function OptionsApp() {
  const [settings, setSettingsState] =
    useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_BASE_URL);
  const [learnedAnswers, setLearnedAnswers] = useState<LearnedAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  // Manage-sites allow/block list (#redesign).
  const [siteRules, setSiteRules] = useState<SiteRule[]>([]);
  const [siteRulesStatus, setSiteRulesStatus] = useState<OptionsSaveStatus>({
    state: "idle",
  });
  const [newHost, setNewHost] = useState("");
  const [newHostError, setNewHostError] = useState<string | null>(null);
  const siteRulesFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Save-status indicator (see save-status.ts). One per surface so the URL
  // save button doesn't flicker the checkbox area, and vice versa.
  const [apiUrlStatus, setApiUrlStatus] = useState<OptionsSaveStatus>({
    state: "idle",
  });
  const [settingsStatus, setSettingsStatus] = useState<OptionsSaveStatus>({
    state: "idle",
  });

  // Auto-save debounce — a single timer is enough because we only ever
  // need to flush the latest settings object. The pending changes ref
  // accumulates updates that arrive within the debounce window.
  const pendingSettingsRef = useRef<Partial<ExtensionSettings>>({});
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const apiSavedFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    loadSettings();
    loadLearnedAnswers();

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (savedFadeTimerRef.current) clearTimeout(savedFadeTimerRef.current);
      if (apiSavedFadeTimerRef.current)
        clearTimeout(apiSavedFadeTimerRef.current);
      if (siteRulesFadeTimerRef.current)
        clearTimeout(siteRulesFadeTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSettings() {
    try {
      const [settingsData, url, rules] = await Promise.all([
        getSettings(),
        getApiBaseUrl(),
        getEffectiveSiteRules(),
      ]);
      setSettingsState(settingsData);
      setApiUrl(url);
      setSiteRules(rules);
    } catch (err) {
      setSettingsStatus({ state: "error", error: messageForError(err) });
    } finally {
      setLoading(false);
    }
  }

  // All site-rule mutations flow through here so the status badge + persisted
  // list stay in sync. getEffectiveSiteRules (returned by each mutation) keeps
  // the app-host system row present.
  async function runSiteRuleMutation(fn: () => Promise<SiteRule[]>) {
    setSiteRulesStatus({ state: "saving" });
    if (siteRulesFadeTimerRef.current) {
      clearTimeout(siteRulesFadeTimerRef.current);
      siteRulesFadeTimerRef.current = null;
    }
    try {
      setSiteRules(await fn());
      setSiteRulesStatus({ state: "saved" });
      siteRulesFadeTimerRef.current = setTimeout(() => {
        setSiteRulesStatus({ state: "idle" });
        siteRulesFadeTimerRef.current = null;
      }, SAVED_LINGER_MS);
    } catch (err) {
      setSiteRulesStatus({ state: "error", error: messageForError(err) });
    }
  }

  function handleToggleSiteMode(host: string, mode: SiteRuleMode) {
    void runSiteRuleMutation(() => updateSiteRule(host, mode));
  }

  function handleRemoveSite(host: string) {
    void runSiteRuleMutation(() => removeSiteRule(host));
  }

  function handleAddSite() {
    const normalized = normalizeRuleHost(newHost);
    const valid =
      !!normalized &&
      !/\s/.test(normalized) &&
      (normalized.includes(".") || normalized.includes(":"));
    if (!valid) {
      setNewHostError("Enter a valid site, e.g. boards.example.com");
      return;
    }
    const appHost = siteRules.find((r) => r.system)?.host;
    if (appHost && normalized === appHost) {
      setNewHostError("Your Slothing app host is always blocked.");
      return;
    }
    setNewHostError(null);
    setNewHost("");
    // New manual entries default to "block" — the common intent is "stop
    // running here". The user can flip to allow afterward.
    void runSiteRuleMutation(() => addSiteRule(normalized, "block"));
  }

  async function loadLearnedAnswers() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "GET_AUTH_STATUS",
      });
      if (!response?.data?.isAuthenticated) return;

      // Fetch learned answers via background script
      const result = await chrome.runtime.sendMessage({
        type: "GET_LEARNED_ANSWERS",
      });
      if (result?.success && result.data) {
        setLearnedAnswers(result.data);
      }
    } catch (err) {
      console.error("Failed to load learned answers:", err);
    }
  }

  async function handleDeleteAnswer(id: string) {
    try {
      const result = await chrome.runtime.sendMessage({
        type: "DELETE_ANSWER",
        payload: id,
      });
      if (result?.success) {
        setLearnedAnswers((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete answer:", err);
    }
  }

  /**
   * Updates a single setting locally and schedules a debounced flush.
   * Multiple rapid changes (range slider drag, repeated checkbox clicks)
   * coalesce into a single updateSettings call after AUTO_SAVE_DEBOUNCE_MS
   * of quiet.
   */
  function handleSettingChange(
    key: keyof ExtensionSettings,
    value: boolean | number,
  ) {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
    pendingSettingsRef.current = {
      ...pendingSettingsRef.current,
      [key]: value,
    };

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (savedFadeTimerRef.current) {
      clearTimeout(savedFadeTimerRef.current);
      savedFadeTimerRef.current = null;
    }

    debounceTimerRef.current = setTimeout(() => {
      flushSettings();
    }, AUTO_SAVE_DEBOUNCE_MS);
  }

  async function flushSettings() {
    const pending = pendingSettingsRef.current;
    pendingSettingsRef.current = {};
    if (Object.keys(pending).length === 0) return;

    setSettingsStatus({ state: "saving" });
    try {
      await updateSettings(pending);
      setSettingsStatus({ state: "saved" });
      savedFadeTimerRef.current = setTimeout(() => {
        setSettingsStatus({ state: "idle" });
        savedFadeTimerRef.current = null;
      }, SAVED_LINGER_MS);
    } catch (err) {
      setSettingsStatus({ state: "error", error: messageForError(err) });
    }
  }

  async function handleApiUrlChange() {
    setApiUrlStatus({ state: "saving" });
    if (apiSavedFadeTimerRef.current) {
      clearTimeout(apiSavedFadeTimerRef.current);
      apiSavedFadeTimerRef.current = null;
    }
    try {
      await setApiBaseUrl(apiUrl);
      setApiUrlStatus({ state: "saved" });
      apiSavedFadeTimerRef.current = setTimeout(() => {
        setApiUrlStatus({ state: "idle" });
        apiSavedFadeTimerRef.current = null;
      }, SAVED_LINGER_MS);
    } catch (err) {
      setApiUrlStatus({ state: "error", error: messageForError(err) });
    }
  }

  if (loading) {
    return (
      <div className="options-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="options-container">
      <header>
        <img
          className="header-mark"
          src={chrome.runtime.getURL("brand/slothing-mark.png")}
          alt=""
        />
        <div className="header-text">
          <h1>Slothing Settings</h1>
          <p className="subtitle">
            Connection, autofill, learning, and tracking
          </p>
        </div>
      </header>

      <div className="settings-grid">
        <section className="settings-card connection-card">
          <h2>Connection</h2>
          <div className="setting-group">
            <label>
              <span>Slothing API URL</span>
              <small>The URL where your Slothing app is running</small>
            </label>
            <div className="input-group">
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder={DEFAULT_API_BASE_URL}
              />
              <button
                onClick={handleApiUrlChange}
                disabled={apiUrlStatus.state === "saving"}
              >
                {apiUrlStatus.state === "saving" ? "Saving…" : "Save"}
              </button>
              <SaveStatusBadge status={apiUrlStatus} />
            </div>
          </div>
        </section>

        <section className="settings-card autofill-card">
          <div className="section-head">
            <h2>Auto-Fill</h2>
            <SaveStatusBadge status={settingsStatus} />
          </div>
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoFillEnabled}
                onChange={(e) =>
                  handleSettingChange("autoFillEnabled", e.target.checked)
                }
              />
              <span>Enable auto-fill</span>
            </label>
            <small>
              Automatically detect form fields on job application pages
            </small>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.showConfidenceIndicators}
                onChange={(e) =>
                  handleSettingChange(
                    "showConfidenceIndicators",
                    e.target.checked,
                  )
                }
              />
              <span>Show confidence indicators</span>
            </label>
            <small>Display confidence levels for detected fields</small>
          </div>

          <div className="setting-group">
            <label>
              <span>Minimum confidence threshold</span>
              <small>Only fill fields with confidence above this level</small>
            </label>
            <div className="range-group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.minimumConfidence}
                onChange={(e) =>
                  handleSettingChange(
                    "minimumConfidence",
                    parseFloat(e.target.value),
                  )
                }
              />
              <span>{Math.round(settings.minimumConfidence * 100)}%</span>
            </div>
          </div>
        </section>

        <section className="settings-card compact-card">
          <div className="section-head">
            <h2>Learning</h2>
            <SaveStatusBadge status={settingsStatus} />
          </div>
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.learnFromAnswers}
                onChange={(e) =>
                  handleSettingChange("learnFromAnswers", e.target.checked)
                }
              />
              <span>Learn from my answers</span>
            </label>
            <small>
              Save answers to custom questions for future suggestions
            </small>
          </div>
        </section>

        <section className="settings-card tracking-card">
          <div className="section-head">
            <h2>Tracking</h2>
            <SaveStatusBadge status={settingsStatus} />
          </div>
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoTrackApplicationsEnabled}
                onChange={(e) =>
                  handleSettingChange(
                    "autoTrackApplicationsEnabled",
                    e.target.checked,
                  )
                }
              />
              <span>Track submitted applications</span>
            </label>
            <small>
              Create an applied opportunity when an autofilled application form
              is submitted
            </small>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.captureScreenshotEnabled}
                onChange={(e) =>
                  handleSettingChange(
                    "captureScreenshotEnabled",
                    e.target.checked,
                  )
                }
              />
              <span>Capture screenshot when tracking</span>
            </label>
            <small>Off by default; form values are never captured</small>
          </div>
        </section>

        <section className="settings-card compact-card">
          <div className="section-head">
            <h2>Notifications</h2>
            <SaveStatusBadge status={settingsStatus} />
          </div>
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifyOnJobDetected}
                onChange={(e) =>
                  handleSettingChange("notifyOnJobDetected", e.target.checked)
                }
              />
              <span>Show badge when job detected</span>
            </label>
            <small>
              Display a badge on the extension icon when a job listing is found
            </small>
          </div>
        </section>

        <section className="settings-card about-card">
          <h2>About</h2>
          <p className="about">
            Slothing Browser Extension v{chrome.runtime.getManifest().version}
          </p>
          <p className="about">
            <a
              href="https://github.com/ANonABento/slothing"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </section>
      </div>

      {learnedAnswers.length > 0 && (
        <section className="settings-card saved-answers-card">
          <h2>Saved Answers ({learnedAnswers.length})</h2>
          <div className="answers-list">
            {learnedAnswers.map((answer) => (
              <div key={answer.id} className="answer-item">
                <div className="answer-question">{answer.question}</div>
                <div className="answer-text">{answer.answer}</div>
                <div className="answer-meta">
                  {answer.sourceCompany && <span>{answer.sourceCompany}</span>}
                  <span>Used {answer.timesUsed}x</span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteAnswer(answer.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="settings-card manage-sites-card">
        <div className="section-head">
          <h2>Manage sites</h2>
          <SaveStatusBadge status={siteRulesStatus} />
        </div>
        <p className="about">
          Allow keeps Slothing active on a site; Block turns it off completely
          (no scraping, sidebar, autofill, or answer bank). Sites that
          aren&apos;t listed use the default behavior. Your Slothing app host is
          always blocked so its own pages are never detected as jobs.
        </p>

        <div className="site-rules-list">
          {siteRules.map((rule) => (
            <div key={rule.host} className="site-rule-row">
              <span className="site-rule-host">{rule.host}</span>
              {rule.system ? (
                <span
                  className="site-rule-locked"
                  title="Your Slothing app host is always blocked"
                >
                  Blocked (system)
                </span>
              ) : (
                <>
                  <div
                    className="site-rule-toggle"
                    role="group"
                    aria-label={`Mode for ${rule.host}`}
                  >
                    <button
                      type="button"
                      className={rule.mode === "allow" ? "active" : ""}
                      aria-pressed={rule.mode === "allow"}
                      onClick={() => handleToggleSiteMode(rule.host, "allow")}
                    >
                      Allow
                    </button>
                    <button
                      type="button"
                      className={
                        rule.mode === "block" ? "active block" : "block"
                      }
                      aria-pressed={rule.mode === "block"}
                      onClick={() => handleToggleSiteMode(rule.host, "block")}
                    >
                      Block
                    </button>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleRemoveSite(rule.host)}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="input-group">
          <input
            type="text"
            value={newHost}
            placeholder="boards.example.com"
            aria-label="Add a site to block"
            onChange={(e) => {
              setNewHost(e.target.value);
              setNewHostError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSite();
            }}
          />
          <button type="button" onClick={handleAddSite}>
            Add
          </button>
        </div>
        {newHostError && <small className="field-error">{newHostError}</small>}
      </section>
    </div>
  );
}

interface SaveStatusBadgeProps {
  status: OptionsSaveStatus;
}

function SaveStatusBadge({ status }: SaveStatusBadgeProps) {
  if (status.state === "idle") return null;
  const label = labelForStatus(status);
  return (
    <span
      className={`save-status save-status-${status.state}`}
      role="status"
      aria-live="polite"
    >
      {label}
    </span>
  );
}
