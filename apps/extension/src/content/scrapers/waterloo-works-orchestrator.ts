// Orchestrator for bulk WaterlooWorks scraping. Walks the visible postings
// table, opens each row's detail panel, runs the single-posting scraper, and
// yields the results. Two modes:
//
//   scrapeAllVisible()   — current page only
//   scrapeAllPaginated() — current page, then clicks "Next page" and repeats
//                          until there is no next page (or the hard cap hits).
//
// Lives in the content script. Pagination + row clicks rely on selectors
// observed on the live modern WW UI in 2026-05. If WW redesigns again, the
// orchestrator will return [] gracefully (no exceptions thrown to the caller).

import type { ScrapedJob } from "../../shared/types";
import { WaterlooWorksScraper } from "./waterloo-works-scraper";

export type OrchestratorProgress = {
  scrapedCount: number;
  attemptedCount: number;
  currentPage: number;
  totalRowsOnPage: number;
  lastTitle?: string;
  done: boolean;
  errors: string[];
};

export type OrchestratorOptions = {
  // Maximum number of jobs to scrape across all pages. Default 200.
  maxJobs?: number;
  // Maximum pages to traverse in paginated mode. Default 50.
  maxPages?: number;
  // ms to wait between actions (row click, panel close, page change). Lower
  // values are faster but more likely to race against the SPA's DOM updates.
  throttleMs?: number;
  // Called after each row attempt with cumulative progress. Used to drive the
  // popup progress UI.
  onProgress?: (p: OrchestratorProgress) => void;
};

const DEFAULT_THROTTLE_MS = 500;
const ROW_SELECTORS = [
  "table.data-viewer-table tbody tr.table__row--body",
  "table.data-viewer-table tbody tr",
  "table tbody tr.table__row--body",
  "table tbody tr",
] as const;
const ROW_TITLE_LINK_SELECTOR = "td a[href='javascript:void(0)']";
const POSTING_PANEL_SELECTOR = ".dashboard-header__posting-title";
const NEXT_PAGE_SELECTOR = 'a.pagination__link[aria-label="Go to next page"]';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function isHidden(el: HTMLAnchorElement | HTMLElement | null): boolean {
  if (!el) return true;
  return el.classList.contains("disabled");
}

export function getWaterlooWorksRows(): HTMLElement[] {
  for (const selector of ROW_SELECTORS) {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    ).filter(isLikelyPostingRow);
    if (rows.length > 0) return dedupeElements(rows);
  }

  const linkRows = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      "table a[href='javascript:void(0)'], table button",
    ),
  )
    .map((el) => el.closest<HTMLElement>("tr"))
    .filter((row): row is HTMLElement => !!row)
    .filter(isLikelyPostingRow);
  return dedupeElements(linkRows);
}

export function getWaterlooWorksNextPageLink(): HTMLAnchorElement | null {
  return (
    document.querySelector<HTMLAnchorElement>(NEXT_PAGE_SELECTOR) ||
    Array.from(document.querySelectorAll<HTMLAnchorElement>("a, button"))
      .filter((el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement)
      .find((el) =>
        /next/i.test(el.getAttribute("aria-label") || el.textContent || ""),
      ) ||
    null
  );
}

function isLikelyPostingRow(row: HTMLElement): boolean {
  const text = normalizeText(row.textContent || "");
  if (!text) return false;
  if (
    /^(job title|organization|work term|location|level|applications?)$/i.test(
      text,
    )
  ) {
    return false;
  }
  if (row.querySelector("th")) return false;
  if (row.querySelector(ROW_TITLE_LINK_SELECTOR)) return true;
  if (row.querySelector("a, button")) return text.length > 8;
  const cells = row.querySelectorAll("td, [role='cell']");
  return cells.length >= 2 && text.length > 12;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function dedupeElements<T extends HTMLElement>(items: T[]): T[] {
  return Array.from(new Set(items));
}

async function waitFor(
  predicate: () => boolean,
  timeoutMs: number,
  intervalMs = 100,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return true;
    await sleep(intervalMs);
  }
  return false;
}

export class WaterlooWorksOrchestrator {
  private scraper = new WaterlooWorksScraper();

  /** Scrape every row visible on the current page. */
  async scrapeAllVisible(
    opts: OrchestratorOptions = {},
  ): Promise<ScrapedJob[]> {
    const { jobs } = await this.scrapeCurrentPage({
      scrapedSoFar: 0,
      pageIndex: 1,
      opts,
      errors: [],
    });
    return jobs;
  }

  /** Walk every row across every page (capped by maxJobs / maxPages). */
  async scrapeAllPaginated(
    opts: OrchestratorOptions = {},
  ): Promise<ScrapedJob[]> {
    const maxJobs = opts.maxJobs ?? 200;
    const maxPages = opts.maxPages ?? 50;
    const throttle = opts.throttleMs ?? DEFAULT_THROTTLE_MS;

    const allJobs: ScrapedJob[] = [];
    const errors: string[] = [];
    let pageIndex = 1;

    while (pageIndex <= maxPages && allJobs.length < maxJobs) {
      const { jobs, stopReason } = await this.scrapeCurrentPage({
        scrapedSoFar: allJobs.length,
        pageIndex,
        opts: { ...opts, maxJobs },
        errors,
      });
      allJobs.push(...jobs);

      if (stopReason === "cap-hit") break;

      // Try to go to the next page
      const advanced = await this.goToNextPage(throttle);
      if (!advanced) break;
      pageIndex++;
    }

    opts.onProgress?.({
      scrapedCount: allJobs.length,
      attemptedCount: allJobs.length,
      currentPage: pageIndex,
      totalRowsOnPage: this.getRows().length,
      done: true,
      errors,
    });

    return allJobs;
  }

  private async scrapeCurrentPage(args: {
    scrapedSoFar: number;
    pageIndex: number;
    opts: OrchestratorOptions;
    errors: string[];
  }): Promise<{ jobs: ScrapedJob[]; stopReason?: "cap-hit" }> {
    const { scrapedSoFar, pageIndex, opts, errors } = args;
    const maxJobs = opts.maxJobs ?? 200;
    const throttle = opts.throttleMs ?? DEFAULT_THROTTLE_MS;

    const rows = this.getRows();
    const jobs: ScrapedJob[] = [];

    for (let i = 0; i < rows.length; i++) {
      if (scrapedSoFar + jobs.length >= maxJobs) {
        return { jobs, stopReason: "cap-hit" };
      }

      // Re-fetch the row each iteration — the DOM may rebuild after panel close.
      const liveRows = this.getRows();
      const row = liveRows[i];
      if (!row) break;

      const titleLink = row.querySelector<HTMLAnchorElement>(
        ROW_TITLE_LINK_SELECTOR,
      );
      const expectedTitle = titleLink?.textContent?.trim();
      if (!titleLink) continue;

      // Capture the panel's current title so we can detect when the new
      // posting's content has actually rendered (the panel may already be
      // visible from a previous row).
      const previousPanelTitle = document
        .querySelector(POSTING_PANEL_SELECTOR + " h2")
        ?.textContent?.trim();

      titleLink.click();

      const opened = await waitFor(
        () => !!document.querySelector(POSTING_PANEL_SELECTOR),
        5000,
      );
      if (!opened) {
        errors.push(`row ${i} (${expectedTitle}): panel did not open`);
        continue;
      }

      // Wait for the panel's h2 to update (or appear for the first time) AND
      // for posting-specific field rows to be present. We check for a
      // recognisable label like "Job Title" — search filters share the same
      // .tag__key-value-list class so a non-zero count is not a reliable
      // signal that the posting body has rendered.
      const fullyRendered = await waitFor(() => {
        const h2 = document
          .querySelector(POSTING_PANEL_SELECTOR + " h2")
          ?.textContent?.trim();
        if (!h2) return false;
        if (previousPanelTitle && h2 === previousPanelTitle) return false;
        const labels = Array.from(
          document.querySelectorAll(
            ".tag__key-value-list.js--question--container .label",
          ),
        ).map((el) => (el.textContent || "").trim().toLowerCase());
        return labels.some(
          (l) => l.startsWith("job title") || l.startsWith("organization"),
        );
      }, 8000);

      if (!fullyRendered) {
        errors.push(`row ${i} (${expectedTitle}): panel never fully rendered`);
        continue;
      }
      await sleep(throttle);

      let job: ScrapedJob | null = null;
      try {
        job = await this.scraper.scrapeJobListing();
      } catch (err) {
        errors.push(
          `row ${i} (${expectedTitle}): ${String(err).slice(0, 200)}`,
        );
      }
      if (job) jobs.push(job);

      opts.onProgress?.({
        scrapedCount: scrapedSoFar + jobs.length,
        attemptedCount: scrapedSoFar + i + 1,
        currentPage: pageIndex,
        totalRowsOnPage: liveRows.length,
        lastTitle: job?.title || expectedTitle,
        done: false,
        errors,
      });

      // No need to explicitly close the panel — clicking the next row replaces
      // its content. We only stop here if this was the last row on the page.
      await sleep(throttle);
    }

    return { jobs };
  }

  private async goToNextPage(throttleMs: number): Promise<boolean> {
    const nextBtn =
      document.querySelector<HTMLAnchorElement>(NEXT_PAGE_SELECTOR);
    if (!nextBtn || isHidden(nextBtn)) return false;

    // Capture the first row's signature to detect when the page has changed.
    const beforeSig = this.firstRowSignature();
    nextBtn.click();

    const changed = await waitFor(
      () => this.firstRowSignature() !== beforeSig && this.getRows().length > 0,
      8000,
    );
    if (!changed) return false;
    await sleep(throttleMs);
    return true;
  }

  private getRows(): HTMLElement[] {
    return getWaterlooWorksRows();
  }

  private firstRowSignature(): string {
    const row = this.getRows()[0];
    return row?.textContent?.trim().slice(0, 120) || "";
  }
}
