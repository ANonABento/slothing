// @vitest-environment jsdom
// @vitest-environment-options { "url": "https://anthropic.wd1.myworkdayjobs.com/External" }
import { describe, expect, it, beforeEach } from "vitest";

import { WorkdayOrchestrator } from "./workday-orchestrator";

function buildWorkdayPage(args: {
  tenant: string;
  rows: Array<{
    title: string;
    location?: string;
    reqId?: string;
    postedAt?: string;
  }>;
  totalPages?: number;
  currentPage?: number;
  nextPagesData?: Array<
    Array<{
      title: string;
      location?: string;
      reqId?: string;
      postedAt?: string;
    }>
  >;
  malformedAt?: number;
}) {
  const {
    tenant,
    rows,
    totalPages = 1,
    currentPage = 1,
    nextPagesData,
    malformedAt,
  } = args;

  document.body.innerHTML = `
    <header data-automation-id="header">
      <h1>${tenant}</h1>
    </header>
    <ul data-automation-id="jobResults">
      ${rows
        .map((r, i) => {
          if (malformedAt === i) {
            return `<li data-row="${i}"></li>`;
          }
          const reqId = r.reqId ?? `R-${1000 + i}`;
          return `
            <li data-row="${i}">
              <a data-automation-id="jobTitle" href="/en-US/${tenant.toLowerCase()}/job/Remote/${r.title.replace(/\s+/g, "-")}_${reqId}">
                ${r.title}
              </a>
              ${r.location ? `<dd data-automation-id="locations">${r.location}</dd>` : ""}
              <dd data-automation-id="requisitionId">${reqId}</dd>
              ${r.postedAt ? `<dd data-automation-id="postedOn">${r.postedAt}</dd>` : ""}
            </li>
          `;
        })
        .join("")}
    </ul>
    <nav aria-label="pagination">
      <button data-uxi-element-id="next" ${currentPage >= totalPages ? "disabled" : ""}>
        Next
      </button>
    </nav>
  `;

  if (nextPagesData) {
    const nextBtn = document.querySelector<HTMLButtonElement>(
      'button[data-uxi-element-id="next"]',
    );
    if (nextBtn && !nextBtn.hasAttribute("disabled")) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const next = currentPage + 1;
        if (next > totalPages) return;
        buildWorkdayPage({
          tenant,
          rows: nextPagesData[next - 1],
          totalPages,
          currentPage: next,
          nextPagesData,
        });
      });
    }
  }
}

describe("WorkdayOrchestrator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("canHandle", () => {
    it("accepts myworkdayjobs.com listing pages", () => {
      expect(
        WorkdayOrchestrator.canHandle(
          "https://anthropic.wd1.myworkdayjobs.com/External",
        ),
      ).toBe(true);
    });

    it("rejects the apply flow (out of scope for #39)", () => {
      expect(
        WorkdayOrchestrator.canHandle(
          "https://anthropic.wd1.myworkdayjobs.com/External/apply/123",
        ),
      ).toBe(false);
    });

    it("rejects other hosts", () => {
      expect(
        WorkdayOrchestrator.canHandle("https://boards.greenhouse.io/anthropic"),
      ).toBe(false);
    });
  });

  it("scrapeAllVisible returns a ScrapedJob per row", async () => {
    buildWorkdayPage({
      tenant: "Anthropic",
      rows: [
        {
          title: "Software Engineer",
          location: "San Francisco",
          reqId: "R-12345",
          postedAt: "Posted Yesterday",
        },
        { title: "Research Engineer", location: "Remote", reqId: "R-12346" },
      ],
    });
    const jobs = await new WorkdayOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toHaveLength(2);
    expect(jobs.map((j) => j.title)).toEqual([
      "Software Engineer",
      "Research Engineer",
    ]);
    expect(jobs.every((j) => j.company === "Anthropic")).toBe(true);
    expect(jobs.every((j) => j.source === "workday")).toBe(true);
    expect(jobs[0].sourceJobId).toBe("R-12345");
    expect(jobs[0].postedAt).toBe("Posted Yesterday");
    expect(jobs[1].location).toBe("Remote");
  });

  it("respects the 200-row session cap", async () => {
    const rows = Array.from({ length: 250 }, (_, i) => ({
      title: `Job ${i}`,
      location: "Remote",
    }));
    buildWorkdayPage({ tenant: "Anthropic", rows });
    const jobs = await new WorkdayOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toHaveLength(200);
  });

  it("isolates per-row errors without aborting the batch", async () => {
    buildWorkdayPage({
      tenant: "Anthropic",
      rows: [
        { title: "Job A" },
        { title: "ignored-malformed" },
        { title: "Job C" },
      ],
      malformedAt: 1,
    });
    const errors: string[] = [];
    const jobs = await new WorkdayOrchestrator().scrapeAllVisible({
      throttleMs: 0,
      onProgress: (p) => {
        for (const e of p.errors) if (!errors.includes(e)) errors.push(e);
      },
    });
    expect(jobs.map((j) => j.title)).toEqual(["Job A", "Job C"]);
    expect(errors.some((e) => e.includes("row 1"))).toBe(true);
  });

  it("scrapeAllPaginated walks pages until next is disabled", async () => {
    const pages = [
      [{ title: "P1-A" }, { title: "P1-B" }],
      [{ title: "P2-A" }],
    ];
    buildWorkdayPage({
      tenant: "Anthropic",
      rows: pages[0],
      totalPages: pages.length,
      currentPage: 1,
      nextPagesData: pages,
    });
    const jobs = await new WorkdayOrchestrator().scrapeAllPaginated({
      throttleMs: 0,
    });
    expect(jobs.map((j) => j.title)).toEqual(["P1-A", "P1-B", "P2-A"]);
  });

  it("returns empty array if there are no rows", async () => {
    document.body.innerHTML = "<main></main>";
    const jobs = await new WorkdayOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toEqual([]);
  });
});
