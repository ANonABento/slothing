// P3/#39 — Bulk-scrape orchestrator for Workday job-listing pages.
//
// Targets the listing surface at `<tenant>.<region>.myworkdayjobs.com/<board>`
// (or the legacy `*.workdayjobs.com/<board>`). Walks the visible job rows,
// builds a `ScrapedJob` from each, and yields the result. Two modes mirror the
// WaterlooWorks orchestrator:
//
//   scrapeAllVisible()   — current visible rows only
//   scrapeAllPaginated() — clicks Workday's "Next page" arrow until exhausted
//                          or the 200/session cap hits.
//
// **NOT** the apply flow. Workday's apply funnel is a separate surface (#36).
// This orchestrator hard-stops if it sees that we've navigated off a listing
// view by checking for the canonical `[data-automation-id="jobSearch"]`
// container or a recognisable job row before each iteration.
//
// Workday boards are public, intentionally syndicated by the hiring tenant,
// and have no anti-scrape posture on listing pages.
//
// Selectors observed on `*.myworkdayjobs.com/*` listing pages (2026-05):
//   - rows: `[data-automation-id="jobResults"] li` or
//           `li.css-1q2dra3` (older skin) or
//           `[role="listitem"]` inside the results region
//   - title: `[data-automation-id="jobTitle"]` (an anchor)
//   - location: `[data-automation-id="locations"]`
//   - posted at: `[data-automation-id="postedOn"]`
//   - req id: `[data-automation-id="requisitionId"]`
//   - next page: `button[data-uxi-element-id="next"]` or
//                `nav[aria-label="pagination"] button[aria-label="next" i]`

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

const ROW_SELECTORS = [
  '[data-automation-id="jobResults"] li',
  '[data-automation-id="jobResults"] [role="listitem"]',
  'ul[role="list"] li[data-automation-id*="job"]',
  "li.css-1q2dra3",
];
const NEXT_PAGE_SELECTORS = [
  'button[data-uxi-element-id="next"]',
  'nav[aria-label="pagination"] button[aria-label*="next" i]',
  'button[aria-label="next" i]',
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

export class WorkdayOrchestrator {
  /**
   * Detect a Workday LISTING page (not the apply flow). We accept the public
   * tenant hosts and require either the job-results region or a recognisable
   * job-card row in the DOM — never the apply funnel.
   */
  static canHandle(url: string): boolean {
    if (!/\.(my)?workdayjobs\.com\//.test(url)) return false;
    // The apply flow lives under `/apply/` or includes `/apply` in the path —
    // bail out so we don't blow up an apply form mid-flight.
    if (/\/apply(\b|\/)/.test(url)) return false;
    return true;
  }

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

  private scrapeRow(row: Element, company: string): ScrapedJob | null {
    const titleEl = row.querySelector<HTMLAnchorElement>(
      '[data-automation-id="jobTitle"]',
    );
    const title = titleEl?.textContent?.trim();
    if (!title) {
      throw new Error("missing title");
    }

    const href = titleEl?.getAttribute("href") || "";
    const url = href ? new URL(href, window.location.href).toString() : "";

    const locationEl = row.querySelector(
      '[data-automation-id="locations"], [data-automation-id="locationLabel"]',
    );
    const location = locationEl?.textContent?.trim() || undefined;

    const reqIdEl = row.querySelector(
      '[data-automation-id="requisitionId"]',
    );
    const sourceJobId =
      reqIdEl?.textContent?.trim() || this.extractJobIdFromUrl(url);

    const postedEl = row.querySelector('[data-automation-id="postedOn"]');
    const postedAt = postedEl?.textContent?.trim() || undefined;

    return {
      title,
      company,
      location,
      description: "",
      requirements: [],
      url: url || window.location.href,
      source: "workday",
      sourceJobId,
      postedAt,
    };
  }

  /**
   * Workday boards typically show the tenant name in the header banner. Try a
   * few common slots, then fall back to the first label-style hostname
   * fragment.
   */
  private extractCompany(): string {
    const labelled = document.querySelector(
      '[data-automation-id="pageHeader"], [data-automation-id="companyLogo"] img, [data-automation-id="header"] h1',
    );
    if (labelled instanceof HTMLImageElement && labelled.alt) {
      return labelled.alt.trim();
    }
    const text = labelled?.textContent?.trim();
    if (text) return text;

    const ogSiteName = document
      .querySelector('meta[property="og:site_name"]')
      ?.getAttribute("content");
    if (ogSiteName) return ogSiteName.trim();

    // Hostname is typically `<tenant>.<region>.myworkdayjobs.com`.
    const tenant = window.location.hostname.split(".")[0];
    if (tenant) {
      return tenant.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return "Unknown Employer";
  }

  private extractJobIdFromUrl(url: string): string | undefined {
    // Workday URLs end in /job/.../R-12345 or _R-12345 — pull the requisition.
    const match = url.match(/[_/]([Rr]-?\d{3,})(?:[/?#]|$)/);
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
      if (out.length > 0) break;
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
      nextBtn.hasAttribute("disabled") ||
      nextBtn.getAttribute("aria-disabled") === "true" ||
      nextBtn.classList.contains("disabled")
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
