// @vitest-environment jsdom
// @vitest-environment-options { "url": "https://boards.greenhouse.io/anthropic" }
import { describe, expect, it, beforeEach } from "vitest";

import { GreenhouseOrchestrator } from "./greenhouse-orchestrator";

/**
 * Build a hand-crafted Greenhouse board page with `n` openings spread across
 * one or more "pages". The next-page link, when clicked, rebuilds the body
 * with the next batch — mirroring the live SPA-ish swap that Greenhouse uses
 * on the rare paginated boards.
 */
function buildBoardPage(args: {
  company: string;
  rows: Array<{
    title: string;
    location?: string;
    jobId?: string;
  }>;
  totalPages?: number;
  currentPage?: number;
  nextPagesData?: Array<Array<{ title: string; location?: string; jobId?: string }>>;
  malformedAt?: number; // index of a row to corrupt (no title) to test error isolation
}) {
  const {
    company,
    rows,
    totalPages = 1,
    currentPage = 1,
    nextPagesData,
    malformedAt,
  } = args;

  // jsdom location is configured via @vitest-environment-options at the top
  // of this file (https://boards.greenhouse.io/anthropic). We don't try to
  // mutate it per-test — the test fixtures stay independent of location.

  document.head.innerHTML = `
    <meta property="og:site_name" content="${company}" />
  `;

  document.body.innerHTML = `
    <div id="main">
      <section class="level-0">
        <h3>Engineering</h3>
        ${rows
          .map((r, i) => {
            if (malformedAt === i) {
              // Malformed row: no title text, no anchor — orchestrator should
              // record an error and continue.
              return `<div class="opening" data-row="${i}"></div>`;
            }
            const id = r.jobId ?? `${1000 + i}`;
            return `
              <div class="opening" data-row="${i}">
                <a class="opening-title" href="/${company.toLowerCase()}/jobs/${id}">
                  ${r.title}
                </a>
                <span class="location">${r.location ?? "Remote"}</span>
              </div>
            `;
          })
          .join("")}
      </section>
      <div class="pagination">
        <a rel="next" href="javascript:void(0)" class="${currentPage >= totalPages ? "disabled" : ""}">Next</a>
      </div>
    </div>
  `;

  if (nextPagesData) {
    const nextLink = document.querySelector<HTMLAnchorElement>(
      'a[rel="next"]',
    );
    if (nextLink && !nextLink.classList.contains("disabled")) {
      nextLink.addEventListener("click", (e) => {
        e.preventDefault();
        const next = currentPage + 1;
        if (next > totalPages) return;
        buildBoardPage({
          company,
          rows: nextPagesData[next - 1],
          totalPages,
          currentPage: next,
          nextPagesData,
        });
      });
    }
  }
}

describe("GreenhouseOrchestrator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  describe("canHandle", () => {
    it("accepts boards.greenhouse.io URLs", () => {
      expect(
        GreenhouseOrchestrator.canHandle(
          "https://boards.greenhouse.io/anthropic",
        ),
      ).toBe(true);
    });

    it("accepts company subdomain greenhouse URLs", () => {
      expect(
        GreenhouseOrchestrator.canHandle(
          "https://anthropic.greenhouse.io/jobs/123",
        ),
      ).toBe(true);
    });

    it("rejects other hosts", () => {
      expect(
        GreenhouseOrchestrator.canHandle("https://jobs.lever.co/anthropic"),
      ).toBe(false);
      expect(
        GreenhouseOrchestrator.canHandle("https://linkedin.com/jobs/view/1"),
      ).toBe(false);
    });
  });

  it("scrapeAllVisible returns one ScrapedJob per opening", async () => {
    buildBoardPage({
      company: "Anthropic",
      rows: [
        { title: "Software Engineer, Frontier", location: "San Francisco" },
        { title: "Research Engineer", location: "Remote" },
        { title: "PMM, Claude Code" },
      ],
    });

    const orchestrator = new GreenhouseOrchestrator();
    const progress: Array<{ scrapedCount: number; lastTitle?: string }> = [];
    const jobs = await orchestrator.scrapeAllVisible({
      throttleMs: 0,
      onProgress: (p) =>
        progress.push({ scrapedCount: p.scrapedCount, lastTitle: p.lastTitle }),
    });

    expect(jobs).toHaveLength(3);
    expect(jobs.map((j) => j.title)).toEqual([
      "Software Engineer, Frontier",
      "Research Engineer",
      "PMM, Claude Code",
    ]);
    expect(jobs.every((j) => j.company === "Anthropic")).toBe(true);
    expect(jobs.every((j) => j.source === "greenhouse")).toBe(true);
    expect(jobs[0].location).toBe("San Francisco");
    expect(jobs[0].sourceJobId).toBe("1000");
    expect(progress.at(-1)?.scrapedCount).toBe(3);
  });

  it("respects the 200-row session cap", async () => {
    // Build 250 rows; orchestrator default cap is 200.
    const rows = Array.from({ length: 250 }, (_, i) => ({
      title: `Job ${i}`,
      location: "Remote",
    }));
    buildBoardPage({ company: "Anthropic", rows });

    const jobs = await new GreenhouseOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toHaveLength(200);
    expect(jobs[199].title).toBe("Job 199");
  });

  it("respects an explicit maxJobs override below 200", async () => {
    buildBoardPage({
      company: "Anthropic",
      rows: [{ title: "A" }, { title: "B" }, { title: "C" }, { title: "D" }],
    });
    const jobs = await new GreenhouseOrchestrator().scrapeAllVisible({
      throttleMs: 0,
      maxJobs: 2,
    });
    expect(jobs).toHaveLength(2);
  });

  it("isolates per-row errors without aborting the batch", async () => {
    buildBoardPage({
      company: "Anthropic",
      rows: [
        { title: "Job A" },
        { title: "ignored-because-malformed" },
        { title: "Job C" },
      ],
      malformedAt: 1,
    });
    const errors: string[] = [];
    const jobs = await new GreenhouseOrchestrator().scrapeAllVisible({
      throttleMs: 0,
      onProgress: (p) => {
        for (const e of p.errors) if (!errors.includes(e)) errors.push(e);
      },
    });
    expect(jobs.map((j) => j.title)).toEqual(["Job A", "Job C"]);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors[0]).toContain("row 1");
  });

  it("scrapeAllPaginated walks multiple pages", async () => {
    const pages = [
      [{ title: "P1-A" }, { title: "P1-B" }],
      [{ title: "P2-A" }],
      [{ title: "P3-A" }, { title: "P3-B" }],
    ];
    buildBoardPage({
      company: "Anthropic",
      rows: pages[0],
      totalPages: pages.length,
      currentPage: 1,
      nextPagesData: pages,
    });
    const jobs = await new GreenhouseOrchestrator().scrapeAllPaginated({
      throttleMs: 0,
      maxPages: 10,
    });
    expect(jobs.map((j) => j.title)).toEqual([
      "P1-A",
      "P1-B",
      "P2-A",
      "P3-A",
      "P3-B",
    ]);
  });

  it("returns empty array if there are no rows", async () => {
    document.body.innerHTML = "<main></main>";
    const jobs = await new GreenhouseOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toEqual([]);
  });
});
