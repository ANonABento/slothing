// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  WaterlooWorksOrchestrator,
  getWaterlooWorksBulkState,
  getWaterlooWorksRows,
} from "./waterloo-works-orchestrator";

// Helper to build a postings-list page with N rows. Each row's title link, when
// clicked, mutates the DOM to put a single posting panel in place (simulating
// the side-panel that the live UI shows). A "next page" link is wired up to
// replace the row text content so the orchestrator can detect a page change.
function buildPostingsPage(args: {
  rowTitles: string[];
  totalPages: number;
  currentPage: number;
  nextPagesData?: string[][]; // ordered list of titles per page (index 0 = page 1)
}) {
  const { rowTitles, totalPages, currentPage, nextPagesData } = args;

  document.body.className = "new-student__posting-search";
  document.body.innerHTML = `
    <table class="data-viewer-table">
      <tbody>
        ${rowTitles
          .map(
            (t, i) => `
          <tr class="table__row--body" data-id="page${currentPage}-row${i}">
            <td><a href="javascript:void(0)" class="overflow--ellipsis">${t}</a></td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>
    <div class="pagination">
      <a
        class="pagination__link${currentPage >= totalPages ? " disabled" : ""}"
        aria-label="Go to next page"
        href="javascript:void(0)"
      >next</a>
    </div>
  `;

  // Wire next-page on the link itself so test isolation is automatic — no
  // document-level listeners that leak across tests.
  if (nextPagesData) {
    const nextLink = document.querySelector<HTMLAnchorElement>(
      'a.pagination__link[aria-label="Go to next page"]',
    );
    if (nextLink && !nextLink.classList.contains("disabled")) {
      nextLink.addEventListener("click", (e) => {
        e.preventDefault();
        const next = currentPage + 1;
        if (next > totalPages) return;
        buildPostingsPage({
          rowTitles: nextPagesData[next - 1],
          totalPages,
          currentPage: next,
          nextPagesData,
        });
      });
    }
  }

  // Wire the row clicks: clicking a title link adds (or replaces) a posting
  // detail panel as a SIBLING of the postings table so the table stays in the
  // DOM for subsequent iterations — mirroring the real WW side-panel UX.
  for (const a of Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a.overflow--ellipsis"),
  )) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const t = a.textContent || "";
      const id = `${100 + Math.floor(Math.random() * 9000)}`;
      // Remove any previously-attached panel first
      document.querySelector("#test-posting-panel")?.remove();
      const panel = document.createElement("section");
      panel.id = "test-posting-panel";
      panel.innerHTML = `
        <div class="dashboard-header__posting-title">
          <i>fiber_manual_record</i>
          ${id}
          <h2>${t}</h2>
        </div>
        <div class="tag__key-value-list js--question--container">
          <span class="label">Job Title:</span>
          <div class="value">${t}</div>
        </div>
        <div class="tag__key-value-list js--question--container">
          <span class="label">Organization:</span>
          <div class="value">Test Employer</div>
        </div>
        <div class="tag__key-value-list js--question--container">
          <span class="label">Job Summary:</span>
          <div class="value"><p>${t} role description.</p></div>
        </div>
        <div class="tag__key-value-list js--question--container">
          <span class="label">Job - City:</span>
          <div class="value">Toronto</div>
        </div>
      `;
      document.body.appendChild(panel);
    });
  }
}

// (next-page wiring moved into buildPostingsPage via the nextPagesData arg)

describe("WaterlooWorksOrchestrator", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.className = "";
    // jsdom doesn't natively support arrow-key navigation etc; we're fine with
    // direct clicks via element.click().
  });

  it("scrapeAllVisible iterates rows and returns scraped jobs", async () => {
    buildPostingsPage({
      rowTitles: ["Job A", "Job B", "Job C"],
      totalPages: 1,
      currentPage: 1,
    });

    const o = new WaterlooWorksOrchestrator();
    const progressEvents: Array<{ scrapedCount: number; lastTitle?: string }> =
      [];
    const jobs = await o.scrapeAllVisible({
      throttleMs: 0,
      onProgress: (p) =>
        progressEvents.push({
          scrapedCount: p.scrapedCount,
          lastTitle: p.lastTitle,
        }),
    });
    expect(jobs.length).toBe(3);
    expect(jobs.map((j) => j.title)).toEqual(["Job A", "Job B", "Job C"]);
    expect(progressEvents.length).toBeGreaterThanOrEqual(3);
    expect(progressEvents.at(-1)?.scrapedCount).toBe(3);
  });

  it("detects live-style WaterlooWorks rows without legacy row classes", () => {
    document.body.className = "new-student__posting-search";
    document.body.innerHTML = `
      <table>
        <thead>
          <tr><th>Job Title</th><th>Location</th><th>Openings</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="javascript:void(0)">AI Toolchain Software Developer</a></td>
            <td>Waterloo</td>
            <td>8</td>
          </tr>
          <tr>
            <td><a href="javascript:void(0)">Verification and Validation</a></td>
            <td>Waterloo</td>
            <td>32</td>
          </tr>
        </tbody>
      </table>
      <a aria-label="Go to next page" href="javascript:void(0)">Next</a>
    `;

    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBe(2);
    expect(getWaterlooWorksRows().length).toBe(2);
  });

  it('detects body rows whose lead cell is a <th scope="row"> (live data-viewer DOM)', () => {
    // Regression: the live WaterlooWorks data viewer renders each posting row
    // with a <th scope="row"> lead cell (checkbox + Save/Remove/Apply actions)
    // and a <th scope="col"> header row. A naive "row has a <th> -> skip" check
    // wrongly dropped every posting, so the popup never offered the bulk card.
    document.body.className = "new-student__posting-search";
    document.body.innerHTML = `
      <table class="data-viewer-table">
        <thead>
          <tr class="table__row--header">
            <th scope="col">Select</th>
            <th scope="col">ID</th>
            <th scope="col">Job Title</th>
            <th scope="col">Organization</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row--body">
            <th scope="row">
              <input type="checkbox" id="resultRow_1" value="1" />
              <button aria-label="Save to My Jobs Folder" type="button"></button>
              <button aria-label="Remove from search results" type="button"></button>
              <button aria-label="Apply" type="button"></button>
            </th>
            <td>475442</td>
            <td><a href="javascript:void(0)">Building and Systems Engineering Intern</a></td>
            <td>Acme Corp</td>
          </tr>
          <tr class="table__row--body">
            <th scope="row">
              <input type="checkbox" id="resultRow_2" value="2" />
            </th>
            <td>475382</td>
            <td><a href="javascript:void(0)">Software Developer Back-End C#, .NET</a></td>
            <td>LVM Tech</td>
          </tr>
        </tbody>
      </table>
      <a class="pagination__link" aria-label="Go to next page" href="javascript:void(0)">next</a>
    `;

    // 3 <tr> total (1 header + 2 body); only the 2 body rows must be detected.
    expect(document.querySelectorAll("table tbody tr").length).toBe(2);
    const rows = getWaterlooWorksRows();
    expect(rows.length).toBe(2);
    // The detected rows must be the body rows (carry the title link), never the
    // column-header row.
    expect(
      rows.every((r) => r.querySelector("td a[href='javascript:void(0)']")),
    ).toBe(true);
  });

  it("getWaterlooWorksBulkState detects a list and suppresses on a detail panel", () => {
    buildPostingsPage({
      rowTitles: ["Job A", "Job B", "Job C"],
      totalPages: 2,
      currentPage: 1,
    });

    let state = getWaterlooWorksBulkState();
    expect(state).toEqual({ detected: true, rowCount: 3, hasNextPage: true });

    // Opening a posting detail panel makes the list a non-active surface — the
    // bulk card must yield to the single-posting flow (rowCount 0).
    const panel = document.createElement("section");
    panel.innerHTML =
      '<div class="dashboard-header__posting-title">A Job</div>';
    document.body.appendChild(panel);

    state = getWaterlooWorksBulkState();
    expect(state.detected).toBe(false);
    expect(state.rowCount).toBe(0);
  });

  it("scrapeAllVisible respects maxJobs cap", async () => {
    buildPostingsPage({
      rowTitles: ["A", "B", "C", "D", "E"],
      totalPages: 1,
      currentPage: 1,
    });
    const o = new WaterlooWorksOrchestrator();
    const jobs = await o.scrapeAllVisible({ throttleMs: 0, maxJobs: 2 });
    expect(jobs.length).toBe(2);
  });

  it("scrapeAllPaginated walks multiple pages until next is disabled", async () => {
    const pages = [["P1-Job1", "P1-Job2"], ["P2-Job1", "P2-Job2"], ["P3-Only"]];
    buildPostingsPage({
      rowTitles: pages[0],
      totalPages: pages.length,
      currentPage: 1,
      nextPagesData: pages,
    });

    const o = new WaterlooWorksOrchestrator();
    const jobs = await o.scrapeAllPaginated({ throttleMs: 0, maxPages: 10 });
    const titles = jobs.map((j) => j.title);
    expect(titles).toEqual([
      "P1-Job1",
      "P1-Job2",
      "P2-Job1",
      "P2-Job2",
      "P3-Only",
    ]);
  });

  it("scrapeAllPaginated stops at maxPages even if more pages exist", async () => {
    const pages = [["P1-Job1"], ["P2-Job1"], ["P3-Job1"]];
    buildPostingsPage({
      rowTitles: pages[0],
      totalPages: pages.length,
      currentPage: 1,
      nextPagesData: pages,
    });

    const o = new WaterlooWorksOrchestrator();
    const jobs = await o.scrapeAllPaginated({ throttleMs: 0, maxPages: 2 });
    expect(jobs.map((j) => j.title)).toEqual(["P1-Job1", "P2-Job1"]);
  });

  it("returns empty array if there are no rows", async () => {
    document.body.innerHTML =
      '<table class="data-viewer-table"><tbody></tbody></table>';
    const jobs = await new WaterlooWorksOrchestrator().scrapeAllVisible({
      throttleMs: 0,
    });
    expect(jobs).toEqual([]);
  });
});
