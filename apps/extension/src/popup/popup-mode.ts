// Single source of truth for "what is the popup looking at right now?".
//
// The popup used to gate each card on its own ad-hoc boolean (hasPageStatus,
// nothingDetected, showWwBulk, currentTabTitle, …). Those booleans overlapped,
// so a WaterlooWorks list page rendered BOTH a "No job detected" current-tab
// card AND the bulk-import card at once — the popup contradicting itself.
//
// derivePopupMode() collapses every detection signal into ONE discriminated
// union with a strict priority order, so exactly one primary surface renders.
// It is a pure function: trivial to unit-test against every combination.

import type { ScrapedJob } from "@/shared/types";

export type PageProbeState = "unknown" | "ready" | "needs-refresh";

export type BulkSourceKey =
  | "waterlooworks"
  | "greenhouse"
  | "lever"
  | "workday";

/** A bulk-scrapable listing surface (WaterlooWorks or a generic ATS board). */
export interface BulkListEntry {
  key: BulkSourceKey;
  label: string;
  rowCount: number;
  hasNextPage: boolean;
}

export interface PopupModeInput {
  pageProbeState: PageProbeState;
  workspaceVisible: boolean;
  detectedJob: ScrapedJob | null;
  hasForm: boolean;
  detectedFields: number;
  detectedUploadCount: number;
  /**
   * Already-detected bulk listing sources (WaterlooWorks / Greenhouse / Lever /
   * Workday), each with a positive row count. WaterlooWorks is just another
   * source here — it shares the generic detection path.
   */
  bulkSources: BulkListEntry[];
  /** Human label for the host when it's supported but nothing's detected yet. */
  supportedSite: string | null;
}

export type PopupMode =
  // Content script couldn't be reached on a supported host — needs a reload.
  | { kind: "needs-refresh" }
  // The on-page job workspace panel is open; the popup defers to it.
  | { kind: "workspace-active" }
  // A single posting was scraped. May also carry form/upload affordances.
  | {
      kind: "single-job";
      job: ScrapedJob;
      hasForm: boolean;
      detectedFields: number;
      uploadCount: number;
    }
  // A fillable application form (no distinct posting).
  | { kind: "application-form"; detectedFields: number; uploadCount: number }
  // One or more bulk-scrapable listing surfaces. Suppresses the single-job card.
  | { kind: "bulk-list"; sources: BulkListEntry[] }
  // Supported page finished probing but has nothing actionable ("No job detected").
  | { kind: "no-posting"; uploadCount: number }
  // Supported host, still scanning (probe not yet ready).
  | { kind: "scanning"; site: string }
  // Not a supported job site.
  | { kind: "unsupported" };

/** Listing surfaces with at least one row. */
export function collectBulkSources(input: PopupModeInput): BulkListEntry[] {
  return input.bulkSources.filter((s) => s.rowCount > 0);
}

/**
 * Resolve the single primary mode for the popup. Priority (highest first):
 *
 *   needs-refresh > workspace-active > single-job > application-form
 *     > bulk-list > no-posting > scanning > unsupported
 *
 * single-job/application-form rank above bulk-list because a specific posting or
 * fillable form is more actionable than a list; in practice they never co-occur
 * (a listing page has no scraped posting). bulk-list ranks above no-posting so a
 * detected list never renders the contradictory "No job detected" card.
 */
export function derivePopupMode(input: PopupModeInput): PopupMode {
  if (input.pageProbeState === "needs-refresh")
    return { kind: "needs-refresh" };
  if (input.workspaceVisible) return { kind: "workspace-active" };

  if (input.detectedJob) {
    return {
      kind: "single-job",
      job: input.detectedJob,
      hasForm: input.hasForm,
      detectedFields: input.detectedFields,
      uploadCount: input.detectedUploadCount,
    };
  }
  if (input.hasForm) {
    return {
      kind: "application-form",
      detectedFields: input.detectedFields,
      uploadCount: input.detectedUploadCount,
    };
  }

  const sources = collectBulkSources(input);
  if (sources.length > 0) return { kind: "bulk-list", sources };

  if (input.pageProbeState === "ready") {
    return { kind: "no-posting", uploadCount: input.detectedUploadCount };
  }
  if (input.supportedSite)
    return { kind: "scanning", site: input.supportedSite };
  return { kind: "unsupported" };
}
