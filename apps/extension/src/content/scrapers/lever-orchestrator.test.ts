// @vitest-environment jsdom
// @vitest-environment-options { "url": "https://jobs.lever.co/anthropic" }
import { describe, expect, it, beforeEach } from "vitest";

import { LeverOrchestrator } from "./lever-orchestrator";

function buildLeverPage(args: {
  company: string;
  rows: Array<{
    title: string;
    location?: string;
    commitment?: string;
    jobId?: string;
  }>;
  totalPages?: number;
  currentPage?: number;
  nextPagesData?: Array<
    Array<{
      title: string;
      location?: string;
      commitment?: string;
      jobId?: string;
    }>
  >;
  malformedAt?: number;
}) {
  const {
    company,
    rows,
    totalPages = 1,
    currentPage = 1,
    nextPagesData,
    malformedAt,
  } = args;
  document.title = `${company} Jobs`;
  document.body.innerHTML = `
    <div class="main-header-logo"><img alt="${company}" /></div>
    <div class="postings">
      ${rows
        .map((r, i) => {
          if (malformedAt === i) {
            return `<div class="posting" data-row="${i}"></div>`;
          }
          const id = r.jobId ?? `${1000 + i}`;
          return `
            <div class="posting" data-row="${i}">
              <a class="posting-title" href="https://jobs.lever.co/${company.toLowerCase()}/${id}-uuid">
                <h5 data-qa="posting-name">${r.title}</h5>
                <div class="posting-categories">
                  ${r.location ? `<span class="location">${r.location}</span>` : ""}
                  ${r.commitment ? `<span class="commitment">${r.commitment}</span>` : ""}
                </div>
              </a>
            </div>
          `;
        })
        .join("")}
    </div>
    <div class="pagination">
      <a rel="next" href="javascript:void(0)" class="${currentPage >= totalPages ? "disabled" : ""}">Next</a>
    </div>
  `;

  if (nextPagesData) {
    const nextLink = document.querySelector<HTMLAnchorElement>('a[rel="next"]');
    if (nextLink && !nextLink.classList.contains("disabled")) {
      nextLink.addEventListener("click", (e) => {
        e.preventDefault();
        const next = currentPage + 1;
        if (next > totalPages) return;
        buildLeverPage({
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

describe("LeverOrchestrator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.title = "";
  });

  describe("canHandle", () => {
    it("accepts jobs.lever.co URLs", () => {
      expect(
        LeverOrchestrator.canHandle("https://jobs.lever.co/anthropic"),
      ).toBe(true);
    });

    it("rejects other hosts", () => {
      expect(
        LeverOrchestrator.canHandle("https://boards.greenhouse.io/anthropic"),
      ).toBe(false);
    });
  });

  it("scrapeAllVisible returns a ScrapedJob per posting", async () => {
    buildLeverPage({
      company: "Anthropic",
      rows: [
        { title: "Frontier Engineer", location: "SF", commitment: "Full-time" },
        {
          title: "Research Scientist",
          location: "Remote",
          commitment: "Full-time",
        },
        { title: "PMM", commitment: "Contract" },
      ],
    });
    const orchestrator = new LeverOrchestrator();
    const jobs = await orchestrator.scrapeAllVisible({ throttleMs: 0 });
    expect(jobs).toHaveLength(3);
    expect(jobs.map((j) => j.title)).toEqual([
      "Frontier Engineer",
      "Research Scientist",
      "PMM",
    ]);
    expect(jobs.every((j) => j.company === "Anthropic")).toBe(true);
    expect(jobs.every((j) => j.source === "lever")).toBe(true);
    expect(jobs[0].type).toBe("full-time");
    expect(jobs[2].type).toBe("contract");
  });

  it("respects the 200-row session cap", async () => {
    const rows = Array.from({ length: 250 }, (_, i) => ({
      title: `Job ${i}`,
      commitment: "Full-time",
    }));
    buildLeverPage({ company: "Anthropic", rows });
    const jobs = await new LeverOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toHaveLength(200);
  });

  it("isolates per-row errors without aborting the batch", async () => {
    buildLeverPage({
      company: "Anthropic",
      rows: [
        { title: "Job A" },
        { title: "ignored-malformed" },
        { title: "Job C" },
      ],
      malformedAt: 1,
    });
    const errors: string[] = [];
    const jobs = await new LeverOrchestrator().scrapeAllVisible({
      throttleMs: 0,
      onProgress: (p) => {
        for (const e of p.errors) if (!errors.includes(e)) errors.push(e);
      },
    });
    expect(jobs.map((j) => j.title)).toEqual(["Job A", "Job C"]);
    expect(errors.some((e) => e.includes("row 1"))).toBe(true);
  });

  it("scrapeAllPaginated walks multiple pages until disabled", async () => {
    const pages = [[{ title: "P1-A" }, { title: "P1-B" }], [{ title: "P2-A" }]];
    buildLeverPage({
      company: "Anthropic",
      rows: pages[0],
      totalPages: pages.length,
      currentPage: 1,
      nextPagesData: pages,
    });
    const jobs = await new LeverOrchestrator().scrapeAllPaginated({
      throttleMs: 0,
    });
    expect(jobs.map((j) => j.title)).toEqual(["P1-A", "P1-B", "P2-A"]);
  });

  it("returns empty array if there are no postings", async () => {
    document.body.innerHTML = "<main></main>";
    const jobs = await new LeverOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toEqual([]);
  });
});
