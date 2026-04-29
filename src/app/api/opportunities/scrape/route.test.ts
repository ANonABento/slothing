import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  scrapeOpportunityFromUrl: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/opportunities/scrape", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/opportunities/scrape")>();
  return {
    ...actual,
    scrapeOpportunityFromUrl: mocks.scrapeOpportunityFromUrl,
  };
});

import { OpportunityScrapeError } from "@/lib/opportunities/scrape";
import { POST } from "./route";

function scrapeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/opportunities/scrape", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

function malformedScrapeRequest() {
  return new NextRequest("http://localhost/api/opportunities/scrape", {
    method: "POST",
    body: "{",
    headers: { "content-type": "application/json" },
  });
}

describe("opportunities scrape route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
  });

  it("returns a scraped opportunity for an authenticated request", async () => {
    const opportunity = {
      title: "Engineer",
      company: "Acme",
      description: "Build software",
      requirements: [],
      responsibilities: [],
      keywords: [],
      remote: false,
      status: "saved",
      source: "lever",
      url: "https://jobs.lever.co/acme/123",
    };
    mocks.scrapeOpportunityFromUrl.mockResolvedValueOnce(opportunity);

    const response = await POST(scrapeRequest({ url: "https://jobs.lever.co/acme/123" }));

    expect(mocks.scrapeOpportunityFromUrl).toHaveBeenCalledWith("https://jobs.lever.co/acme/123");
    await expect(response.json()).resolves.toEqual({ opportunity });
  });

  it("rejects requests without a URL", async () => {
    const response = await POST(scrapeRequest({}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "A URL is required.",
      code: "invalid_url",
    });
    expect(mocks.scrapeOpportunityFromUrl).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON gracefully", async () => {
    const response = await POST(malformedScrapeRequest());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "A valid JSON body with a URL is required.",
      code: "invalid_url",
    });
    expect(mocks.scrapeOpportunityFromUrl).not.toHaveBeenCalled();
  });

  it("maps scraper errors to graceful API responses", async () => {
    mocks.scrapeOpportunityFromUrl.mockRejectedValueOnce(
      new OpportunityScrapeError(
        "unsupported_site",
        "This URL is not from a supported job board."
      )
    );

    const response = await POST(scrapeRequest({ url: "https://example.com/job" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "This URL is not from a supported job board.",
      code: "unsupported_site",
    });
  });
});
