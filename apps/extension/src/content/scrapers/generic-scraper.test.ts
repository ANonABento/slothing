// @vitest-environment jsdom
// @vitest-environment-options { "url": "https://careers.example.test/jobs/principal-platform-engineer" }

import { beforeEach, describe, expect, it } from "vitest";

import { GenericScraper } from "./generic-scraper";

describe("GenericScraper", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  it("extracts a complete JSON-LD-only job posting from an unknown board", async () => {
    document.body.innerHTML = `
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": "Principal Platform Engineer",
          "datePosted": "2026-05-12",
          "employmentType": "FULL_TIME",
          "hiringOrganization": { "name": "Mosaic Robotics" },
          "jobLocation": {
            "address": {
              "addressLocality": "Remote",
              "addressRegion": "Canada",
              "addressCountry": "CA"
            }
          },
          "baseSalary": {
            "currency": "CAD",
            "value": { "minValue": 190000, "maxValue": 240000 }
          },
          "description": "<p>Build distributed robotics tools.</p><ul><li>Lead TypeScript, Node.js, PostgreSQL, and Kubernetes platform work.</li><li>Partner with a fully distributed remote team.</li></ul>"
        }
      </script>
      <nav>Careers navigation</nav>
    `;

    const job = await new GenericScraper().scrapeJobListing();

    expect(job).toMatchObject({
      title: "Principal Platform Engineer",
      company: "Mosaic Robotics",
      location: "Remote, Canada, CA",
      salary: "CAD 190,000 - 240,000",
      type: "full-time",
      remote: true,
      source: "example",
      postedAt: "2026-05-12",
    });
    expect(job?.description).toContain("Build distributed robotics tools.");
    expect(job?.keywords).toEqual(
      expect.arrayContaining([
        "typescript",
        "node.js",
        "postgresql",
        "kubernetes",
      ]),
    );
    expect(job?.url).toBe(
      "https://careers.example.test/jobs/principal-platform-engineer",
    );
  });

  it("falls back to visible selectors when malformed structured data exists", async () => {
    document.head.innerHTML = `<title>Senior Frontend Engineer | Careers</title>`;
    document.body.innerHTML = `
      <script type="application/ld+json">{ not valid json }</script>
      <article>
        <h1 class="job-title">Senior Frontend Engineer</h1>
        <div class="company-name">ExampleWorks</div>
        <div class="job-location">Toronto, ON hybrid</div>
        <section class="job-description">
          We need a full-time React and TypeScript engineer with GraphQL,
          accessibility, and performance experience. Remote considered for
          exceptional candidates. Salary is $150,000 - $185,000 per year.
        </section>
      </article>
    `;

    const job = await new GenericScraper().scrapeJobListing();

    expect(job).toMatchObject({
      title: "Senior Frontend Engineer",
      company: "ExampleWorks",
      location: "Toronto, ON hybrid",
      salary: "$150,000 - $185,000 per year",
      type: "full-time",
      remote: true,
      source: "example",
    });
    expect(job?.keywords).toEqual(
      expect.arrayContaining(["react", "typescript", "graphql"]),
    );
  });
});
