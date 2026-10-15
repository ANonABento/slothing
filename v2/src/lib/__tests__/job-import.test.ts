import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  embeddedGreenhouse,
  findJobPosting,
  fromJobPosting,
  greenhouseIds,
  htmlToText,
  importJobFromUrl,
  linkedInJobId,
  parseLinkedInFragment,
  parsePostingUrl,
} from "../job-import";
import { generateJSON } from "../llm";

vi.mock("../llm", () => ({ generateJSON: vi.fn() }));
const llm = vi.mocked(generateJSON);

const ld = (data: unknown) => `<html><head><script type="application/ld+json">${JSON.stringify(data)}</script></head><body></body></html>`;
const posting = {
  "@type": "JobPosting",
  title: "Credit Risk Associate",
  hiringOrganization: { "@type": "Organization", name: "Ramp" },
  jobLocation: { "@type": "Place", address: { addressLocality: "New York City", addressRegion: "NY", addressCountry: "USA" } },
  jobLocationType: "TELECOMMUTE",
  description: "<p>About the role.</p><ul><li>Underwrite credit</li><li>Build models</li></ul><p>Pay &amp; benefits.</p>",
};
const long = "Responsibilities include many things. ".repeat(20);

describe("htmlToText", () => {
  it("keeps paragraphs and list items, decodes entities", () => {
    expect(htmlToText(posting.description)).toBe("About the role.\n\n- Underwrite credit\n- Build models\n\nPay & benefits.");
  });

  it("decodes HTML that was escaped as text (LinkedIn)", () => {
    expect(htmlToText("&lt;strong&gt;Total Rewards&lt;br&gt;&lt;/strong&gt;Benefits &amp;amp; pay")).toBe("Total Rewards\nBenefits & pay");
  });

  it("drops scripts and styles", () => {
    expect(htmlToText("<style>p{}</style><p>Hi</p><script>alert(1)</script>")).toBe("Hi");
  });
});

describe("JSON-LD", () => {
  it("finds a JobPosting as an object, in an array, or in an @graph, with @type as a list", () => {
    expect(findJobPosting(ld(posting))?.title).toBe("Credit Risk Associate");
    expect(findJobPosting(ld([{ "@type": "Organization" }, posting]))?.title).toBe("Credit Risk Associate");
    expect(findJobPosting(ld({ "@graph": [{ "@type": "WebPage" }, { ...posting, "@type": ["JobPosting"] }] }))?.title).toBe("Credit Risk Associate");
    expect(findJobPosting(ld({ "@type": "Organization" }))).toBeNull();
    expect(findJobPosting(`<script type="application/ld+json">{not json</script>`)).toBeNull();
  });

  it("maps the fields, with remote added to the place", () => {
    expect(fromJobPosting(posting)).toEqual({
      title: "Credit Risk Associate",
      company: "Ramp",
      location: "New York City, NY, USA · Remote",
      description: "About the role.\n\n- Underwrite credit\n- Build models\n\nPay & benefits.",
    });
    expect(fromJobPosting({ ...posting, jobLocation: [{ address: { addressLocality: "Toronto" } }, { address: "Remote, Canada" }], jobLocationType: undefined }).location).toBe("Toronto · Remote, Canada");
  });
});

describe("URLs", () => {
  it("reads Greenhouse boards and ids", () => {
    expect(greenhouseIds(new URL("https://job-boards.greenhouse.io/gitlab/jobs/8864819002"))).toEqual({ board: "gitlab", id: "8864819002" });
    expect(greenhouseIds(new URL("https://boards.greenhouse.io/embed/job_app?for=acme&token=123"))).toEqual({ board: "acme", id: "123" });
    expect(greenhouseIds(new URL("https://jobs.lever.co/acme/123"))).toBeNull();
  });

  it("finds the Greenhouse board behind a company career site", () => {
    const url = new URL("https://careers.airbnb.com/positions/7839229?gh_jid=7839229");
    expect(embeddedGreenhouse(url, `<script src="https://boards.greenhouse.io/embed/job_board/js?for=airbnbjobs"></script>`)).toEqual({ boards: ["airbnbjobs", "airbnb"], id: "7839229" });
    expect(embeddedGreenhouse(url, "")).toEqual({ boards: ["airbnb"], id: "7839229" });
    expect(embeddedGreenhouse(new URL("https://acme.com/jobs/1"), "")).toBeNull();
    const own = `<a href="https://job-boards.greenhouse.io/mozilla/jobs/7137777">Apply</a><a href="https://job-boards.greenhouse.io/mozilla/jobs/8188870">Other</a>`;
    expect(embeddedGreenhouse(new URL("https://www.mozilla.org/en-US/careers/position/gh/7137777/"), own)).toEqual({ boards: ["mozilla"], id: "7137777" });
    expect(embeddedGreenhouse(new URL("https://www.mozilla.org/en-US/careers/"), own)).toBeNull();
  });

  it("reads LinkedIn job ids from view, slug and search links", () => {
    expect(linkedInJobId(new URL("https://www.linkedin.com/jobs/view/4456293071/"))).toBe("4456293071");
    expect(linkedInJobId(new URL("https://www.linkedin.com/jobs/view/registered-nurse-at-osf-healthcare-4456293071"))).toBe("4456293071");
    expect(linkedInJobId(new URL("https://www.linkedin.com/jobs/search/?currentJobId=4479094842&keywords=nurse"))).toBe("4479094842");
    expect(linkedInJobId(new URL("https://www.linkedin.com/in/someone"))).toBeNull();
  });

  it("accepts links without a scheme and rejects non-links", () => {
    expect(parsePostingUrl("jobs.lever.co/acme/1").href).toBe("https://jobs.lever.co/acme/1");
    expect(() => parsePostingUrl("not a link")).toThrow(/doesn't look like a link/);
    expect(() => parsePostingUrl("ftp://example.com/job")).toThrow(/http/);
  });
});

describe("parseLinkedInFragment", () => {
  it("reads title, company, location and description by class name", () => {
    const html = `<h2 class="top-card-layout__title font-sans">Registered Nurse - ICU</h2>
      <a class="topcard__org-name-link topcard__flavor--black-link" href="#">
        Saint Joseph Hospital </a>
      <span class="topcard__flavor topcard__flavor--bullet"> Elgin, IL </span>
      <div class="show-more-less-html__markup relative">${"<p>Care for patients in the ICU.</p>".repeat(5)}</div><button>Show more</button>`;
    expect(parseLinkedInFragment(html)).toEqual({
      title: "Registered Nurse - ICU",
      company: "Saint Joseph Hospital",
      location: "Elgin, IL",
      description: Array(5).fill("Care for patients in the ICU.").join("\n\n"),
    });
  });
});

describe("importJobFromUrl", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    llm.mockReset();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });
  const page = (body: string, status = 200, type = "text/html") => new Response(body, { status, headers: { "content-type": type } });

  it("uses Greenhouse's API for Greenhouse links", async () => {
    fetchMock.mockResolvedValueOnce(page(JSON.stringify({ title: "Benefits Analyst", company_name: "GitLab", location: { name: "Remote" }, content: "&lt;p&gt;Run benefits.&lt;/p&gt;" }), 200, "application/json"));
    const job = await importJobFromUrl("https://job-boards.greenhouse.io/gitlab/jobs/1");
    expect(fetchMock.mock.calls[0][0]).toBe("https://boards-api.greenhouse.io/v1/boards/gitlab/jobs/1");
    expect(job).toEqual({ title: "Benefits Analyst", company: "GitLab", location: "Remote", description: "Run benefits.", url: "https://job-boards.greenhouse.io/gitlab/jobs/1" });
  });

  it("reads JSON-LD from other pages without calling AI", async () => {
    fetchMock.mockResolvedValueOnce(page(ld({ ...posting, description: `<p>${long}</p>` })));
    const job = await importJobFromUrl("https://jobs.ashbyhq.com/ramp/abc");
    expect(job.company).toBe("Ramp");
    expect(llm).not.toHaveBeenCalled();
  });

  it("falls back to AI on the page text when there's no structured data", async () => {
    fetchMock.mockResolvedValueOnce(page(`<body><nav>Menu</nav><h1>Line Cook</h1><p>${long}</p></body>`));
    llm.mockResolvedValueOnce({ company: "Bistro", title: "Line Cook", location: "Austin, TX", description: long.trim(), isJobPosting: true });
    const job = await importJobFromUrl("https://bistro.example.com/careers/line-cook");
    expect(llm.mock.calls[0][2]).toContain("Line Cook");
    expect(job).toMatchObject({ company: "Bistro", title: "Line Cook" });
  });

  it("reads a LinkedIn page's JSON-LD when the guest endpoint is rate limited", async () => {
    fetchMock.mockResolvedValueOnce(page("", 429)).mockResolvedValueOnce(page(ld({ ...posting, title: "Registered Nurse", description: `<p>${long}</p>` })));
    const job = await importJobFromUrl("https://www.linkedin.com/jobs/view/registered-nurse-at-osf-4456293071");
    expect(fetchMock.mock.calls[0][0]).toBe("https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/4456293071");
    expect(job.title).toBe("Registered Nurse");
    expect(job.url).toBe("https://www.linkedin.com/jobs/view/4456293071");
    fetchMock.mockResolvedValueOnce(page("", 429)).mockResolvedValueOnce(page("<body>Sign in</body>"));
    await expect(importJobFromUrl("https://www.linkedin.com/jobs/view/4456293071")).rejects.toThrow(/429/);
    expect(llm).not.toHaveBeenCalled();
  });

  it("explains pages it can't read", async () => {
    fetchMock.mockResolvedValueOnce(page(`<body><div id="root"></div><script src="app.js"></script></body>`));
    await expect(importJobFromUrl("https://acme.wd5.myworkdayjobs.com/en-US/careers/job/123")).rejects.toThrow(/JavaScript/);
    fetchMock.mockResolvedValueOnce(page("", 404));
    await expect(importJobFromUrl("https://jobs.lever.co/acme/gone")).rejects.toThrow(/doesn't exist/);
    fetchMock.mockResolvedValueOnce(page("%PDF", 200, "application/pdf"));
    await expect(importJobFromUrl("https://acme.com/job.pdf")).rejects.toThrow(/PDF/);
    fetchMock.mockResolvedValueOnce(page(`<body><p>${long}</p></body>`));
    llm.mockResolvedValueOnce({ company: "", title: "", location: "", description: "", isJobPosting: false });
    await expect(importJobFromUrl("https://acme.com/careers")).rejects.toThrow(/single job posting/);
  });
});
