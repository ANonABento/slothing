// P3/#39 — Bulk-scrape orchestrator for Greenhouse company boards.
//
// Walks the visible openings table on a `boards.greenhouse.io/<company>` page
// (and embedded board iframes that mount under the same host), assembles a
// `ScrapedJob` for each row using the meta we have on the listing page itself,
// and yields the result. Two modes mirror the WaterlooWorks orchestrator:
//
//   scrapeAllVisible()   — current page only
//   scrapeAllPaginated() — current page, then clicks "Next" if Greenhouse has
//                          paginated the board, repeating until no next link.
//
// Greenhouse boards are public, indexed by search engines, and intentionally
// syndicated by the hiring company — no anti-scrape posture. This orchestrator
// is part of the popup-driven UX (popup → BulkSourceCard → content script
// orchestrator) and never touches the apply flow.
//
// Selectors observed on `boards.greenhouse.io/<company>` (2026-05). Most
// Greenhouse boards still use the classic markup:
//   - `div.opening` per posting (newer boards: `.job-post`)
//   - `a` inside `div.opening` whose href points at `/<company>/jobs/<id>`
//   - `.location` sibling for the location
//   - department headings: `section.level-0 > h3`
//   - "Show more" / paginated load-more: rare for Greenhouse, but we look for
//     `a[rel="next"]` and a `button[aria-label="Next" i]` as defensive fallbacks.

import type { ScrapedJob } from "../../shared/types";

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
  /** Maximum number of jobs to scrape across all pages. Default 200. */
  maxJobs?: number;
  /** Maximum pages to traverse in paginated mode. Default 50. */
  maxPages?: number;
  /** ms to wait between row attempts and after page navigation. */
  throttleMs?: number;
  /** Called after each row attempt with cumulative progress. */
  onProgress?: (p: OrchestratorProgress) => void;
};

const DEFAULT_THROTTLE_MS = 50;
const MAX_JOBS_DEFAULT = 200;
const MAX_PAGES_DEFAULT = 50;

// Selectors. Multiple variants because Greenhouse boards drift slowly — some
// older boards use `.opening`, newer ones use `.job-post`, and the
// `[data-mapped="true"]` attribute appears on a different generation again.
const ROW_SELECTORS = [
  "div.opening",
  ".job-post",
  '[data-mapped="true"]',
  "section.level-0 div.opening",
];
const NEXT_PAGE_SELECTORS = [
  'a[rel="next"]',
  'a[aria-label="Next page" i]',
  'button[aria-label="Next" i]',
  ".pagination .next a",
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

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

export class GreenhouseOrchestrator {
  /** Quick detection helper used by content-script entry. */
  static canHandle(url: string): boolean {
    return (
      /boards\.greenhouse\.io\//.test(url) ||
      /[\w-]+\.greenhouse\.io\//.test(url) ||
      /greenhouse\.io\/embed\/job_board/.test(url)
    );
  }

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

  /** Walk every row on every page (capped by maxJobs / maxPages). */
  async scrapeAllPaginated(
    opts: OrchestratorOptions = {},
  ): Promise<ScrapedJob[]> {
    const maxJobs = opts.maxJobs ?? MAX_JOBS_DEFAULT;
    const maxPages = opts.maxPages ?? MAX_PAGES_DEFAULT;
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
    const maxJobs = opts.maxJobs ?? MAX_JOBS_DEFAULT;
    const throttle = opts.throttleMs ?? DEFAULT_THROTTLE_MS;

    const rows = this.getRows();
    const jobs: ScrapedJob[] = [];
    const company = this.extractCompany();

    for (let i = 0; i < rows.length; i++) {
      if (scrapedSoFar + jobs.length >= maxJobs) {
        return { jobs, stopReason: "cap-hit" };
      }
      const row = rows[i];

      let job: ScrapedJob | null = null;
      try {
        job = this.scrapeRow(row, company);
      } catch (err) {
        // Per-row error isolation — never abort the whole batch.
        errors.push(`row ${i}: ${String(err).slice(0, 200)}`);
      }
      if (job) jobs.push(job);

      opts.onProgress?.({
        scrapedCount: scrapedSoFar + jobs.length,
        attemptedCount: scrapedSoFar + i + 1,
        currentPage: pageIndex,
        totalRowsOnPage: rows.length,
        lastTitle: job?.title,
        done: false,
        errors,
      });

      if (throttle > 0) await sleep(throttle);
    }

    return { jobs };
  }

  /**
   * Build a ScrapedJob from a single Greenhouse listing row. We rely on the
   * listing-page metadata only (title, location, URL, sourceJobId) — fetching
   * the full description per row would require visiting each posting URL,
   * which is out of scope for the bulk orchestrator (#39). The description
   * is left empty so the import endpoint backfills/marks it as needing review.
   */
  private scrapeRow(row: Element, company: string): ScrapedJob | null {
    const titleEl = row.querySelector<HTMLAnchorElement>(
      "a.opening-title, .opening-title a, a",
    );
    const title =
      titleEl?.textContent?.trim() ||
      row.querySelector(".job-title")?.textContent?.trim() ||
      "";
    if (!title) {
      throw new Error("missing title");
    }

    // Prefer the closest anchor with an href — Greenhouse markup often wraps
    // the entire row in an anchor.
    const anchor =
      titleEl ||
      row.querySelector<HTMLAnchorElement>('a[href*="/jobs/"]') ||
      (row.matches("a") ? (row as HTMLAnchorElement) : null);
    const href = anchor?.getAttribute("href") || "";
    const url = href ? new URL(href, window.location.href).toString() : "";

    const locationEl = row.querySelector(
      ".location, .job-location, .opening-location",
    );
    const location = locationEl?.textContent?.trim() || undefined;

    const sourceJobId = this.extractJobIdFromUrl(url);

    return {
      title,
      company,
      location,
      // Bulk mode: listing-page snippets are short and inconsistent across
      // Greenhouse boards, so leave description empty rather than ship junk.
      description: "",
      requirements: [],
      url: url || window.location.href,
      source: "greenhouse",
      sourceJobId,
    };
  }

  /**
   * Extract the hiring company. Greenhouse boards use one of:
   *   - <meta property="og:site_name">  ← most reliable
   *   - `#header .company-name`
   *   - first segment of the URL path: `boards.greenhouse.io/<company>/...`
   */
  private extractCompany(): string {
    const ogSiteName = document
      .querySelector('meta[property="og:site_name"]')
      ?.getAttribute("content");
    if (ogSiteName) return ogSiteName.trim();

    const header = document.querySelector(
      "#header .company-name, .company-name",
    );
    const headerText = header?.textContent?.trim();
    if (headerText) return headerText;

    const match = window.location.pathname.match(/^\/([^/]+)/);
    if (match && match[1] && match[1] !== "embed" && match[1] !== "jobs") {
      return match[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return "Unknown Employer";
  }

  private extractJobIdFromUrl(url: string): string | undefined {
    const match = url.match(/\/jobs\/(\d+)/);
    return match?.[1];
  }

  private getRows(): Element[] {
    const seen = new Set<Element>();
    const out: Element[] = [];
    for (const selector of ROW_SELECTORS) {
      for (const el of Array.from(document.querySelectorAll(selector))) {
        if (!seen.has(el)) {
          seen.add(el);
          out.push(el);
        }
      }
      if (out.length > 0) {
        // Take the first selector that yielded matches — keeps row order stable.
        break;
      }
    }
    return out;
  }

  private async goToNextPage(throttleMs: number): Promise<boolean> {
    let nextBtn: HTMLElement | null = null;
    for (const selector of NEXT_PAGE_SELECTORS) {
      nextBtn = document.querySelector<HTMLElement>(selector);
      if (nextBtn) break;
    }
    if (!nextBtn) return false;
    if (
      nextBtn.classList.contains("disabled") ||
      nextBtn.getAttribute("aria-disabled") === "true"
    ) {
      return false;
    }

    const beforeSig = this.firstRowSignature();
    nextBtn.click();

    const changed = await waitFor(
      () => this.firstRowSignature() !== beforeSig && this.getRows().length > 0,
      8000,
    );
    if (!changed) return false;
    if (throttleMs > 0) await sleep(throttleMs);
    return true;
  }

  private firstRowSignature(): string {
    const row = this.getRows()[0];
    return row?.textContent?.trim().slice(0, 120) || "";
  }
}
