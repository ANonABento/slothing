// Waterloo Works job scraper (University of Waterloo co-op portal).
//
// Targets the modern student posting-search UI (body.new-student__posting-search).
// The legacy Orbis-era selectors (#postingDiv, .posting-details, .job-listing-table)
// are no longer present on the production site; this scraper does not try to
// support both — if WW reverts or a different surface appears, add a branch.

import { BaseScraper } from "./base-scraper";
import type { ScrapedJob } from "../../shared/types";

// Field labels from the live UI. Each entry lists prefixes we want to match
// against the .label text (which is normalized — trailing colons and whitespace
// stripped before comparison). The first matching candidate wins per row.
const FIELD_LABELS = {
  title: ["Job Title"],
  summary: ["Job Summary"],
  responsibilities: ["Job Responsibilities", "Responsibilities"],
  requirements: [
    "Required Skills",
    "Targeted Skills",
    "Targeted Degrees and Disciplines",
  ],
  organization: ["Organization", "Employer", "Company"],
  // Modern WW splits location across multiple labelled rows; we collect each
  // piece separately and stitch them in composeLocation().
  locationCity: ["Job - City"],
  locationRegion: ["Job - Province/State", "Job - Province / State"],
  locationCountry: ["Job - Country"],
  locationFull: [
    "Job Location",
    "Location",
    "Job - City, Province / State, Country",
  ],
  employmentArrangement: ["Employment Location Arrangement"],
  workTerm: ["Work Term"],
  workTermDuration: ["Work Term Duration"],
  level: ["Level"],
  openings: ["Number of Job Openings"],
  deadline: ["Application Deadline", "Deadline"],
  salary: [
    "Compensation and Benefits Information",
    "Compensation and Benefits",
    "Compensation",
    "Salary",
  ],
  jobType: ["Job Type"],
} as const;

type FieldKey = keyof typeof FIELD_LABELS;
type FieldBag = Partial<Record<FieldKey, string>>;

export class WaterlooWorksScraper extends BaseScraper {
  readonly source = "waterlooworks";
  readonly urlPatterns = [/waterlooworks\.uwaterloo\.ca/];

  canHandle(url: string): boolean {
    return this.urlPatterns.some((p) => p.test(url));
  }

  async scrapeJobListing(): Promise<ScrapedJob | null> {
    if (this.isLoginPage()) {
      console.log("[Columbus] Waterloo Works: Please log in first");
      return null;
    }

    try {
      await this.waitForElement(".dashboard-header__posting-title", 3000);
    } catch {
      // No posting panel open — not a scrape error, just nothing to scrape.
      return null;
    }

    const { sourceJobId, title: panelTitle } = this.parsePostingHeader();
    const fields = this.collectFields();

    const title = fields.title || panelTitle;
    const company = fields.organization;
    const description = this.composeDescription(fields);

    if (!title || !description) {
      console.log(
        "[Columbus] Waterloo Works scraper: Missing title or description",
      );
      return null;
    }

    const location = this.composeLocation(fields);

    return {
      title,
      company: company || "Unknown Employer",
      location,
      description,
      requirements:
        this.parseBulletList(fields.requirements) ||
        this.extractRequirements(description),
      responsibilities: this.parseBulletList(fields.responsibilities),
      keywords: this.extractKeywords(description),
      // Slothing's extension schema caps optional strings at 500 chars and
      // WaterlooWorks puts the full benefits blurb in "Compensation and
      // Benefits". Take the first line/sentence so wage ranges survive.
      salary: this.condenseSalary(fields.salary),
      type: this.detectJobType(fields.jobType || description) || "internship",
      remote: this.detectRemoteFromFields(fields, location, description),
      url: window.location.href,
      source: this.source,
      sourceJobId,
      deadline: fields.deadline,
    };
  }

  async scrapeJobList(): Promise<ScrapedJob[]> {
    // Modern WaterlooWorks renders the postings list in a virtualized SPA view
    // and the row summaries don't include full descriptions. Bulk-import from
    // the list view is provided by the orchestrator (see
    // waterloo-works-orchestrator.ts), which walks each row, opens its detail
    // panel, and calls scrapeJobListing() per row. scrapeJobList() itself stays
    // empty so the generic auto-detect path doesn't accidentally pick it up.
    return [];
  }

  private isLoginPage(): boolean {
    const url = window.location.href.toLowerCase();
    return (
      url.includes("/cas/") ||
      url.includes("/login") ||
      url.includes("/signin") ||
      document.querySelector('input[type="password"]') !== null
    );
  }

  private parsePostingHeader(): { sourceJobId?: string; title?: string } {
    const header = document.querySelector(".dashboard-header__posting-title");
    if (!header) return {};
    const h2Text = header.querySelector("h2")?.textContent?.trim();
    const idMatch = (header.textContent || "").match(/\b(\d{4,10})\b/);
    return { sourceJobId: idMatch?.[1], title: h2Text };
  }

  private collectFields(): FieldBag {
    const bag: FieldBag = {};
    const blocks = document.querySelectorAll(
      ".tag__key-value-list.js--question--container",
    );

    for (const block of blocks) {
      const labelRaw = block.querySelector(".label")?.textContent?.trim();
      if (!labelRaw) continue;
      const label = this.normalizeLabel(labelRaw);

      const valueEl = block.querySelector(".value");
      const value = valueEl
        ? valueEl.innerHTML
        : this.stripLabelFromBlock(block, labelRaw);
      if (!value) continue;

      this.assignField(bag, label, value);
    }
    return bag;
  }

  // "Work Term:  " → "work term"
  private normalizeLabel(label: string): string {
    return label
      .replace(/\s+/g, " ")
      .replace(/[:\s]+$/, "")
      .toLowerCase();
  }

  private stripLabelFromBlock(block: Element, label: string): string {
    const clone = block.cloneNode(true) as Element;
    clone.querySelector(".label")?.remove();
    return (
      clone.innerHTML.trim() ||
      clone.textContent?.replace(label, "").trim() ||
      ""
    );
  }

  private assignField(
    bag: FieldBag,
    normalizedLabel: string,
    htmlValue: string,
  ) {
    const cleaned = this.cleanDescription(htmlValue);
    for (const [key, candidates] of Object.entries(FIELD_LABELS) as [
      FieldKey,
      readonly string[],
    ][]) {
      if (candidates.some((c) => normalizedLabel.startsWith(c.toLowerCase()))) {
        if (!bag[key]) {
          bag[key] =
            key === "responsibilities" ||
            key === "requirements" ||
            key === "summary"
              ? htmlValue // keep HTML for bullet parsing
              : cleaned;
        }
        return;
      }
    }
  }

  private composeDescription(fields: FieldBag): string {
    const parts: string[] = [];
    if (fields.summary) parts.push(this.cleanDescription(fields.summary));
    if (fields.responsibilities) {
      parts.push("Responsibilities:");
      parts.push(this.cleanDescription(fields.responsibilities));
    }
    if (fields.requirements) {
      parts.push("Required Skills:");
      parts.push(this.cleanDescription(fields.requirements));
    }
    return parts.filter(Boolean).join("\n\n").trim();
  }

  private composeLocation(fields: FieldBag): string | undefined {
    if (fields.locationFull) return fields.locationFull;
    const pieces = [
      fields.locationCity,
      fields.locationRegion,
      fields.locationCountry,
    ]
      .map((p) => p?.trim())
      .filter((p): p is string => !!p && p.length > 0);
    return pieces.length > 0 ? pieces.join(", ") : undefined;
  }

  private detectRemoteFromFields(
    fields: FieldBag,
    location: string | undefined,
    description: string,
  ): boolean {
    const arrangement = (fields.employmentArrangement || "").toLowerCase();
    if (/remote|virtual|work from home|distributed/.test(arrangement))
      return true;
    if (/hybrid/.test(arrangement)) return true; // hybrid implies some remote
    return this.detectRemote(location || "") || this.detectRemote(description);
  }

  private condenseSalary(raw: string | undefined): string | undefined {
    if (!raw) return undefined;
    const trimmed = raw.trim();
    if (trimmed.length === 0) return undefined;
    // Prefer the first line / sentence — usually the wage range. If still too
    // long, hard-cap at 480 chars with an ellipsis so the schema validator
    // accepts it (limit is 500).
    const firstChunk = trimmed.split(/\n\n|\n(?=[A-Z])/)[0]?.trim() || trimmed;
    if (firstChunk.length <= 480) return firstChunk;
    return firstChunk.slice(0, 477) + "...";
  }

  private parseBulletList(html: string | undefined): string[] | undefined {
    if (!html) return undefined;
    const container = document.createElement("div");
    container.innerHTML = html;
    const items = Array.from(container.querySelectorAll("li"))
      .map((li) => li.textContent?.trim() || "")
      .filter((t) => t.length > 0);
    return items.length > 0 ? items : undefined;
  }
}
