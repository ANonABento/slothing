// P3/#39 — Generic "Detected: <source> — N rows" card used by the popup for
// each bulk-scrape source (WaterlooWorks, Greenhouse, Lever, Workday). Lifts
// the existing WW-specific block in App.tsx into a reusable shape so adding a
// new source becomes a one-line change.
//
// Renders:
//   <header> "<sourceLabel> list" + "N rows" badge
//   <action-grid> "Scrape N visible" + "Scrape filtered set"
//   <bulk-result> imported/attempted/pages summary + optional "View tracker →"
//   <inline-error> if a run failed
//
// Visual tokens come from `popup/styles.css` (semantic violet/cream palette).
// No hardcoded colors, no inline color styles.

import React from "react";

export type BulkScrapeMode = "visible" | "paginated";

export interface BulkScrapeResult {
  imported: number;
  attempted: number;
  pages: number;
  errors: string[];
}

export interface BulkSourceCardProps {
  /** Human-readable source name shown in the card header & badge ("Greenhouse"). */
  sourceLabel: string;
  /** Row count detected on the current page. */
  detectedCount: number;
  /** Which mode (if any) is currently running. `null` when idle. */
  busy: BulkScrapeMode | null;
  /** Last completed result for this source (renders the imported/attempted line). */
  lastResult: BulkScrapeResult | null;
  /** Error string from the last failed attempt, if any. */
  lastError: string | null;
  /** Called when the user clicks "Scrape N visible". */
  onScrapeVisible: () => void;
  /** Called when the user clicks "Scrape filtered set" (paginated mode). */
  onScrapePaginated: () => void;
  /** Optional: rendered as a deep-link when the result has imports > 0. */
  onViewTracker?: () => void;
}

export function BulkSourceCard(props: BulkSourceCardProps) {
  const {
    sourceLabel,
    detectedCount,
    busy,
    lastResult,
    lastError,
    onScrapeVisible,
    onScrapePaginated,
    onViewTracker,
  } = props;

  const disabled = busy !== null || detectedCount === 0;

  return (
    <article className="card" data-bulk-source={sourceLabel.toLowerCase()}>
      <header className="card-head">
        <span className="card-title">{sourceLabel} list</span>
        <span className="badge">
          {detectedCount} row{detectedCount === 1 ? "" : "s"}
        </span>
      </header>
      <div className="action-grid">
        <button
          className="btn primary full"
          onClick={onScrapeVisible}
          disabled={disabled}
        >
          {busy === "visible"
            ? "Scraping visible…"
            : `Scrape ${detectedCount} visible`}
        </button>
        <button
          className="btn full"
          onClick={onScrapePaginated}
          disabled={disabled}
          title={`Walks every page in your current filter set; capped at 200 jobs.`}
        >
          {busy === "paginated" ? "Walking pages…" : "Scrape filtered set"}
        </button>
      </div>
      {lastResult && (
        <div className="bulk-result">
          <p className="inline-note">
            Imported {lastResult.imported}/{lastResult.attempted}
            {lastResult.pages > 1 && ` · ${lastResult.pages} pages`}
            {lastResult.errors.length > 0 &&
              ` · ${lastResult.errors.length} errors`}
          </p>
          {lastResult.imported > 0 && onViewTracker && (
            <button className="success-link" onClick={onViewTracker}>
              View tracker →
            </button>
          )}
        </div>
      )}
      {lastError && <p className="inline-error">{lastError}</p>}
    </article>
  );
}
