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
/** The job a tab is applying for, kept across the steps of a multi-page form on one site. */
export const jobKey = (tabId: number) => `job:${tabId}`;
export interface RememberedJob {
  jobId: string;
  /** The form's site: a form on another site in the same tab is a different application. */
  host: string;
}

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};
/** A page without its "#…": forms change the hash as you go, and it's still the same page. */
export const pageOf = (url: string) => url.split("#")[0];

/** The remembered job for a tab, if it was picked on this page's site. */
export async function rememberedJob(tabId: number, url: string): Promise<string | undefined> {
  const r = (await chrome.storage.session.get(jobKey(tabId)))[jobKey(tabId)] as RememberedJob | undefined;
  return r && r.host === hostOf(url) ? r.jobId : undefined;
}
