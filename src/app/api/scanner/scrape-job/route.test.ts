import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  scrapeOpportunityFromUrl: vi.fn(),
}));

vi.mock("@/lib/opportunities/scrape", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/opportunities/scrape")>();
  return {
    ...actual,
    scrapeOpportunityFromUrl: mocks.scrapeOpportunityFromUrl,
  };
});

import { OpportunityScrapeError } from "@/lib/opportunities/scrape";
import { POST } from "./route";

function scrapeRequest(body: unknown, ip = "198.51.100.10") {
  return new NextRequest("http://localhost/api/scanner/scrape-job", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
  });
}

describe("scanner scrape-job route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.scrapeOpportunityFromUrl.mockResolvedValue({
      title: "Software Engineer",
      company: "Acme",
      description: "Build React applications",
      requirements: ["React"],
      responsibilities: [],
      keywords: ["React"],
      remote: false,
      status: "saved",
      source: "greenhouse",
      url: "https://boards.greenhouse.io/acme/jobs/123",
    });
  });

  it("returns a scraped opportunity for a supported Greenhouse URL without auth", async () => {
    const response = await POST(
      scrapeRequest({ url: "https://boards.greenhouse.io/acme/jobs/123" }),
    );

    expect(response.status).toBe(200);
    expect(mocks.scrapeOpportunityFromUrl).toHaveBeenCalledWith(
      "https://boards.greenhouse.io/acme/jobs/123",
    );
    await expect(response.json()).resolves.toMatchObject({
      opportunity: {
        title: "Software Engineer",
        source: "greenhouse",
      },
    });
  });

  it("maps unsupported-site errors to 400 responses", async () => {
    mocks.scrapeOpportunityFromUrl.mockRejectedValueOnce(
      new OpportunityScrapeError(
        "unsupported_site",
        "This URL is not from a supported job board.",
      ),
    );

    const response = await POST(
      scrapeRequest({ url: "https://example.com/job" }, "198.51.100.11"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "This URL is not from a supported job board.",
      code: "unsupported_site",
    });
  });

  it("rejects malformed JSON", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/scanner/scrape-job", {
        method: "POST",
        body: "{",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "198.51.100.12",
        },
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "A valid JSON body with a URL is required.",
      code: "invalid_url",
    });
  });

  it("enforces IP rate limits", async () => {
    let response = new Response(null);
    for (let i = 0; i < 61; i++) {
      response = await POST(
        scrapeRequest(
          { url: "https://boards.greenhouse.io/acme/jobs/123" },
          "198.51.100.99",
        ),
      );
    }

    expect(response.status).toBe(429);
  });
});
