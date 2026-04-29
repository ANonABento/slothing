import { JSDOM } from "jsdom";
import {
  getScraperForUrl,
  hasSpecializedScraper,
} from "../../../columbus-extension/src/content/scrapers/scraper-registry";
import type { ScrapedJob } from "../../../columbus-extension/src/shared/types";
import type { JobDescription } from "@/types";

export type SupportedOpportunitySource =
  | "linkedin"
  | "indeed"
  | "greenhouse"
  | "lever"
  | "waterlooworks";

export type OpportunityScrapeErrorCode =
  | "invalid_url"
  | "unsupported_site"
  | "rate_limited"
  | "fetch_failed"
  | "scrape_failed";

export interface ScrapedOpportunity
  extends Omit<JobDescription, "id" | "createdAt" | "appliedAt" | "notes"> {
  source: SupportedOpportunitySource;
  sourceJobId?: string;
  postedAt?: string;
}

export class OpportunityScrapeError extends Error {
  constructor(
    public readonly code: OpportunityScrapeErrorCode,
    message: string,
    public readonly status = 400
  ) {
    super(message);
    this.name = "OpportunityScrapeError";
  }
}

interface GlobalDomSnapshot {
  window: typeof globalThis.window | undefined;
  document: typeof globalThis.document | undefined;
  navigator: typeof globalThis.navigator | undefined;
  MutationObserver: typeof globalThis.MutationObserver | undefined;
}

const SOURCE_LABELS: Record<SupportedOpportunitySource, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  greenhouse: "Greenhouse",
  lever: "Lever",
  waterlooworks: "WaterlooWorks",
};

let domScrapeQueue = Promise.resolve();

function isSameHostOrSubdomain(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

export function normalizeOpportunityUrl(rawUrl: string): string {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new OpportunityScrapeError("invalid_url", "Please enter a valid URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new OpportunityScrapeError("invalid_url", "Only http and https URLs are supported.");
  }

  return parsed.toString();
}

export function detectOpportunitySource(url: string): SupportedOpportunitySource | null {
  const host = new URL(url).hostname.toLowerCase();

  if (isSameHostOrSubdomain(host, "linkedin.com")) return "linkedin";
  if (isSameHostOrSubdomain(host, "indeed.com")) return "indeed";
  if (isSameHostOrSubdomain(host, "greenhouse.io")) return "greenhouse";
  if (isSameHostOrSubdomain(host, "lever.co")) return "lever";
  if (isSameHostOrSubdomain(host, "waterlooworks.uwaterloo.ca")) {
    return "waterlooworks";
  }

  return null;
}

export function toScrapedOpportunity(scrapedJob: ScrapedJob): ScrapedOpportunity {
  const source = scrapedJob.source as SupportedOpportunitySource;

  return {
    title: scrapedJob.title,
    company: scrapedJob.company,
    location: scrapedJob.location,
    type: scrapedJob.type,
    remote: scrapedJob.remote ?? false,
    salary: scrapedJob.salary,
    description: scrapedJob.description,
    requirements: scrapedJob.requirements ?? [],
    responsibilities: scrapedJob.responsibilities ?? [],
    keywords: scrapedJob.keywords ?? [],
    url: scrapedJob.url,
    status: "saved",
    deadline: scrapedJob.deadline,
    source,
    sourceJobId: scrapedJob.sourceJobId,
    postedAt: scrapedJob.postedAt,
  };
}

async function fetchOpportunityHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TaidaBot/1.0; +https://taida.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new OpportunityScrapeError(
        "rate_limited",
        "The job board rate limited the scrape request. Please try again later.",
        429
      );
    }

    if (!response.ok) {
      throw new OpportunityScrapeError(
        "fetch_failed",
        `The job board returned ${response.status} ${response.statusText || "while fetching the URL"}.`
      );
    }

    return response.text();
  } catch (error) {
    if (error instanceof OpportunityScrapeError) throw error;
    const message = error instanceof Error && error.name === "AbortError"
      ? "The job board took too long to respond."
      : "Could not fetch the job posting.";
    throw new OpportunityScrapeError("fetch_failed", message);
  } finally {
    clearTimeout(timeout);
  }
}

function installDom(html: string, url: string): { restore: () => void } {
  const dom = new JSDOM(html, { url });
  const snapshot: GlobalDomSnapshot = {
    window: globalThis.window,
    document: globalThis.document,
    navigator: globalThis.navigator,
    MutationObserver: globalThis.MutationObserver,
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: dom.window,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: dom.window.document,
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: dom.window.navigator,
  });
  Object.defineProperty(globalThis, "MutationObserver", {
    configurable: true,
    value: dom.window.MutationObserver,
  });

  return {
    restore: () => {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: snapshot.window,
      });
      Object.defineProperty(globalThis, "document", {
        configurable: true,
        value: snapshot.document,
      });
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: snapshot.navigator,
      });
      Object.defineProperty(globalThis, "MutationObserver", {
        configurable: true,
        value: snapshot.MutationObserver,
      });
      dom.window.close();
    },
  };
}

async function withSerializedScraperDom<T>(
  html: string,
  url: string,
  scrape: () => Promise<T>
): Promise<T> {
  let releaseQueue: () => void = () => {};
  const previousScrape = domScrapeQueue;
  const currentScrape = new Promise<void>((resolve) => {
    releaseQueue = resolve;
  });

  domScrapeQueue = previousScrape.catch(() => undefined).then(() => currentScrape);

  await previousScrape.catch(() => undefined);

  try {
    const dom = installDom(html, url);
    try {
      return await scrape();
    } finally {
      dom.restore();
    }
  } finally {
    releaseQueue();
  }
}

export async function scrapeOpportunityFromHtml(
  url: string,
  html: string
): Promise<ScrapedOpportunity> {
  const normalizedUrl = normalizeOpportunityUrl(url);
  const source = detectOpportunitySource(normalizedUrl);

  if (!source || !hasSpecializedScraper(normalizedUrl)) {
    throw new OpportunityScrapeError(
      "unsupported_site",
      "This URL is not from a supported job board. Supported sites are LinkedIn, Indeed, Greenhouse, Lever, and WaterlooWorks."
    );
  }

  return withSerializedScraperDom(html, normalizedUrl, async () => {
    const scraper = getScraperForUrl(normalizedUrl);
    const scrapedJob = await scraper.scrapeJobListing();

    if (!scrapedJob?.title || !scrapedJob.company || !scrapedJob.description) {
      throw new OpportunityScrapeError(
        "scrape_failed",
        `${SOURCE_LABELS[source]} did not expose enough job details to import.`
      );
    }

    return toScrapedOpportunity({ ...scrapedJob, source, url: normalizedUrl });
  });
}

export async function scrapeOpportunityFromUrl(url: string): Promise<ScrapedOpportunity> {
  const normalizedUrl = normalizeOpportunityUrl(url);
  const source = detectOpportunitySource(normalizedUrl);

  if (!source || !hasSpecializedScraper(normalizedUrl)) {
    throw new OpportunityScrapeError(
      "unsupported_site",
      "This URL is not from a supported job board. Supported sites are LinkedIn, Indeed, Greenhouse, Lever, and WaterlooWorks."
    );
  }

  const html = await fetchOpportunityHtml(normalizedUrl);
  return scrapeOpportunityFromHtml(normalizedUrl, html);
}
