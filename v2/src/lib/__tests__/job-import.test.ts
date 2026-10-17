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
  postingKey,
  workdayCompany,
  linkedInTitle,
  readJob,
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

describe("readJob", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    llm.mockReset();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });
  const blank = { url: "", description: "", company: "", title: "" };

  it("uses a pasted description as is, without fetching the link, and fills blanks by AI", async () => {
    llm.mockResolvedValueOnce({ company: "Bistro", title: "Line Cook", location: "Austin, TX" });
    const job = await readJob({ ...blank, url: "https://bistro.example.com/jobs/1", description: "  Cook things.  ", title: "Sous Chef" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(job).toEqual({ company: "Bistro", title: "Sous Chef", location: "Austin, TX", description: "Cook things.", url: "https://bistro.example.com/jobs/1" });
  });

  it("skips AI when company and title are typed, and keeps going when AI fails", async () => {
    expect(await readJob({ ...blank, description: "x", company: "A", title: "B" })).toMatchObject({ company: "A", title: "B" });
    expect(llm).not.toHaveBeenCalled();
    llm.mockRejectedValueOnce(new Error("no key"));
    expect(await readJob({ ...blank, description: "x" })).toMatchObject({ company: "", title: "", description: "x" });
  });

  it("reads a link alone, with typed fields winning", async () => {
    fetchMock.mockResolvedValueOnce(new Response(ld({ ...posting, description: `<p>${long}</p>` }), { headers: { "content-type": "text/html" } }));
    const job = await readJob({ ...blank, url: "jobs.ashbyhq.com/ramp/abc", company: "Ramp Inc." });
    expect(job).toMatchObject({ company: "Ramp Inc.", title: "Credit Risk Associate", url: "https://jobs.ashbyhq.com/ramp/abc" });
  });

  it("needs a link or a description", async () => {
    await expect(readJob({ ...blank, company: "A" })).rejects.toThrow(/link or its description/);
  });
});

describe("postingKey", () => {
  it("matches an application form to its posting", () => {
    expect(postingKey("https://jobs.lever.co/acme/1234-abcd/apply")).toBe(postingKey("https://jobs.lever.co/acme/1234-abcd"));
    expect(postingKey("https://jobs.ashbyhq.com/ramp/uuid-1/application?src=x")).toBe(postingKey("jobs.ashbyhq.com/ramp/uuid-1"));
    expect(postingKey("https://job-boards.greenhouse.io/gitlab/jobs/8864819002#app")).toBe("greenhouse:8864819002");
    expect(postingKey("https://careers.airbnb.com/positions/?gh_jid=8864819002")).toBe("greenhouse:8864819002");
    expect(postingKey("https://www.linkedin.com/jobs/search/?currentJobId=42&keywords=x")).toBe("linkedin:42");
  });
  it("keeps different postings apart, and is blank for junk", () => {
    expect(postingKey("https://jobs.lever.co/acme/1")).not.toBe(postingKey("https://jobs.lever.co/acme/2"));
    expect(postingKey("not a link")).toBe("");
  });
});

describe("workdayCompany", () => {
  const url = (h: string) => new URL(`https://${h}/External/job/x`);
  it("uses the tenant, spelled as the legal entity spells it", () => {
    expect(workdayCompany(url("nvidia.wd5.myworkdayjobs.com"), "IN02 NVIDIA GraphicsPLtd,Pune")).toBe("NVIDIA");
    expect(workdayCompany(url("acme.wd1.myworkdayjobs.com"), "Holdco 12 LLC")).toBe("Acme");
    expect(workdayCompany(url("jobs.lever.co"), "Spotify")).toBe("Spotify");
  });
});

describe("linkedInTitle", () => {
  it("reads LinkedIn's page title", () => {
    expect(linkedInTitle("(3) Staff Engineer | Acme | LinkedIn")).toEqual({ title: "Staff Engineer", company: "Acme" });
    expect(linkedInTitle("Jobs | LinkedIn")).toBeNull();
  });
});
