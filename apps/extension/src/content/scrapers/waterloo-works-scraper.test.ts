// @vitest-environment jsdom
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it, beforeEach } from "vitest";

import { WaterlooWorksScraper } from "./waterloo-works-scraper";

const FIXTURE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../tests/fixtures/waterloo-works-mock.html",
);

async function loadFixture() {
  const html = await readFile(FIXTURE, "utf8");
  // Extract just the body content + body class so we can mount it into JSDOM's
  // existing document without trying to replace the html element.
  const bodyMatch = html.match(/<body\s+class="([^"]+)">([\s\S]*?)<\/body>/i);
  if (!bodyMatch) throw new Error("fixture missing <body>");
  document.body.className = bodyMatch[1];
  document.body.innerHTML = bodyMatch[2];
}

describe("WaterlooWorksScraper (modern UI)", () => {
  beforeEach(() => {
    document.body.className = "";
    document.body.innerHTML = "";
  });

  it("canHandle accepts waterlooworks URLs", () => {
    const s = new WaterlooWorksScraper();
    expect(
      s.canHandle(
        "https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm",
      ),
    ).toBe(true);
    expect(s.canHandle("https://example.com")).toBe(false);
  });

  it("scrapeJobListing returns a job from the modern posting panel", async () => {
    await loadFixture();
    const job = await new WaterlooWorksScraper().scrapeJobListing();

    expect(job).not.toBeNull();
    expect(job!.source).toBe("waterlooworks");
    expect(job!.title).toBe(
      "Software Engineering Intern (Commercial Software)",
    );
    expect(job!.sourceJobId).toBe("469433");
    expect(job!.company).toBe("Acme Commercial Software Inc.");
    expect(job!.location).toBe("Toronto, Ontario, Canada");
    expect(job!.type).toBe("internship");
    expect(job!.deadline).toContain("June 15");
    expect(job!.salary).toMatch(/28-32|CAD/);
    expect(job!.remote).toBe(true); // "Hybrid" arrangement
  });

  it("description concatenates summary + responsibilities + skills sections", async () => {
    await loadFixture();
    const job = await new WaterlooWorksScraper().scrapeJobListing();

    expect(job!.description).toContain("Commercial Software team");
    expect(job!.description.toLowerCase()).toContain("responsibilities");
    expect(job!.description).toContain("Toronto office");
  });

  it("parses requirements and responsibilities as bullet lists when available", async () => {
    await loadFixture();
    const job = await new WaterlooWorksScraper().scrapeJobListing();

    expect(job!.requirements.length).toBeGreaterThan(0);
    expect(
      job!.requirements.some((r) => /TypeScript|JavaScript|Go|Python/.test(r)),
    ).toBe(true);
    expect(job!.responsibilities?.length).toBeGreaterThan(0);
  });

  it("scrapeJobList returns empty array (no bulk surface on modern UI)", async () => {
    await loadFixture();
    const jobs = await new WaterlooWorksScraper().scrapeJobList();
    expect(jobs).toEqual([]);
  });

  it("returns null when no posting panel is open", async () => {
    document.body.className = "dashboardController";
    document.body.innerHTML = "<main>Dashboard content</main>";
    const job = await new WaterlooWorksScraper().scrapeJobListing();
    expect(job).toBeNull();
  });

  it("returns null on a login page", async () => {
    document.body.innerHTML = '<input type="password" />';
    const job = await new WaterlooWorksScraper().scrapeJobListing();
    expect(job).toBeNull();
  });
});
