import type { JobSummary } from "@/lib/extension";
import type { PageKind } from "./watch";

/* Per-tab state the background worker keeps in session storage, and the side panel reads. */

export interface TabState {
  url: string;
  kind: PageKind;
  job: JobSummary | null;
  /** When you'd last seen this posting before now; null the first time. */
  before: string | null;
}

export const tabKey = (tabId: number) => `tab:${tabId}`;
/** The job a tab is applying for, kept across the steps of a multi-page form. */
export const jobKey = (tabId: number) => `job:${tabId}`;
