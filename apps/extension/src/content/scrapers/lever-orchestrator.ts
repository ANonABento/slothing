// P3/#39 — Bulk-scrape orchestrator for Lever company pages.
//
// Walks the visible postings on a `jobs.lever.co/<company>` page (or one of
// the older `<company>.lever.co/<role>` variants), assembles a `ScrapedJob`
// from each row's listing-page metadata, and yields results. Two modes mirror
// the WaterlooWorks orchestrator:
//
//   scrapeAllVisible()   — current visible postings only
//   scrapeAllPaginated() — Lever boards are typically single-page, but we still
//                          probe for "Show more" / Next-style controls so the
//                          contract matches the popup expectation.
//
// Lever boards are public, intentionally syndicated by the hiring company, and
// have no anti-scrape posture. This orchestrator never visits the apply flow.
//
// Selectors observed on `jobs.lever.co/<company>` (2026-05):
//   - `.posting` per opening (canonical)
//   - title: `.posting-title h5` or `[data-qa="posting-name"]`
//   - location: `.posting-categories .location` or `.sort-by-location`
//   - commitment / type: `.posting-categories .commitment`
//   - posting URL: anchor wrapping the posting block
//   - company: logo alt or first path segment

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

const ROW_SELECTORS = [".posting", '[data-qa="posting-name"]'];
const NEXT_PAGE_SELECTORS = [
  'a[rel="next"]',
  'button[aria-label="Next" i]',
  'button[aria-label="Load more" i]',
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

export class LeverOrchestrator {
  static canHandle(url: string): boolean {
    return (
      /jobs\.lever\.co\//.test(url) ||
      /[\w-]+\.lever\.co\//.test(url)
    );
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
    const titleEl = row.querySelector(
      '.posting-title h5, .posting-name, [data-qa="posting-name"]',
    );
    const title = titleEl?.textContent?.trim();
    if (!title) {
      throw new Error("missing title");
    }

    // Lever wraps the posting in an anchor — either the title anchor or the
    // whole row. Either is fine.
    const anchor =
      row.querySelector<HTMLAnchorElement>(
        'a.posting-title, a[data-qa="posting-name"], a',
      ) || (row.matches("a") ? (row as HTMLAnchorElement) : null);
    const href = anchor?.getAttribute("href") || "";
    const url = href ? new URL(href, window.location.href).toString() : "";

    const locationEl = row.querySelector(
      '.posting-categories .location, .sort-by-location, .workplaceTypes, [data-qa="posting-location"]',
    );
    const location = locationEl?.textContent?.trim() || undefined;

    const commitmentEl = row.querySelector(
      ".posting-categories .commitment, .sort-by-commitment",
    );
    const commitment = commitmentEl?.textContent?.trim() || null;

    return {
      title,
      company,
      location,
      description: "",
      requirements: [],
      type: this.detectJobTypeFromCommitment(commitment),
      url: url || window.location.href,
      source: "lever",
      sourceJobId: this.extractJobIdFromUrl(url),
    };
  }

  private extractCompany(): string {
    // Logo alt — works for most boards.
    const logo = document.querySelector(
      ".main-header-logo img, .posting-header .logo img, header img",
    );
    const alt = logo?.getAttribute("alt");
    if (alt && alt.trim() && alt.trim() !== "Company Logo") return alt.trim();

    // Page title format: "Job Title - Company Name" or just "Company Name Jobs"
    const pageTitle = document.title;
    if (pageTitle) {
      const parts = pageTitle.split(" - ");
      if (parts.length >= 2) {
        return parts[parts.length - 1].replace(" Jobs", "").trim();
      }
      const trimmed = pageTitle.replace(/Jobs$/i, "").trim();
      if (trimmed) return trimmed;
    }

    // URL fallback: jobs.lever.co/<company>/...
    const match = window.location.href.match(/lever\.co\/([^/]+)/);
    if (match && match[1]) {
      return match[1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return "Unknown Employer";
  }

  private extractJobIdFromUrl(url: string): string | undefined {
    const match = url.match(/lever\.co\/[^/]+\/([a-f0-9-]+)/i);
    return match?.[1];
  }

  private detectJobTypeFromCommitment(
    commitment: string | null,
  ): "full-time" | "part-time" | "contract" | "internship" | undefined {
    if (!commitment) return undefined;
    const lower = commitment.toLowerCase();
    if (lower.includes("full-time") || lower.includes("full time"))
      return "full-time";
    if (lower.includes("part-time") || lower.includes("part time"))
      return "part-time";
    if (lower.includes("contract") || lower.includes("contractor"))
      return "contract";
    if (lower.includes("intern")) return "internship";
    return undefined;
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
