import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getJob: vi.fn(),
  getCompanyEnrichment: vi.fn(),
  getCompanyGithubSlug: vi.fn(),
  isEnrichmentStale: vi.fn(),
  enrichCompany: vi.fn(),
  standard: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));
vi.mock("@/lib/db/jobs", () => ({ getJob: mocks.getJob }));
vi.mock("@/lib/db/company-research", () => ({
  getCompanyEnrichment: mocks.getCompanyEnrichment,
  getCompanyGithubSlug: mocks.getCompanyGithubSlug,
  isEnrichmentStale: mocks.isEnrichmentStale,
}));
vi.mock("@/lib/enrichment", () => ({ enrichCompany: mocks.enrichCompany }));
vi.mock("@/lib/rate-limit", () => ({
  getClientIdentifier: () => "user:user-1",
  rateLimiters: { standard: mocks.standard },
}));

import { GET, POST } from "./route";

const context = { params: { id: "job-1" } };
const snapshot = {
  version: 1 as const,
  github: null,
  news: { ok: true as const, data: { headlines: [] } },
  levels: null,
  blog: null,
  hn: null,
  enrichedAt: "2026-05-01T00:00:00.000Z",
};

function request(url = "http://localhost/api/companies/job-1/enrich") {
  return new NextRequest(url, { method: "POST", body: "{}" });
}

describe("company enrichment route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.standard.mockReturnValue({ allowed: true, resetAt: 0 });
    mocks.getJob.mockReturnValue({
      id: "job-1",
      company: "Acme",
      url: "https://acme.com/jobs",
    });
    mocks.getCompanyEnrichment.mockReturnValue(null);
    mocks.getCompanyGithubSlug.mockReturnValue(null);
    mocks.isEnrichmentStale.mockReturnValue(false);
    mocks.enrichCompany.mockResolvedValue(snapshot);
  });

  it("returns cached enrichment for GET", async () => {
    mocks.getCompanyEnrichment.mockReturnValue({
      snapshot,
      enrichedAt: snapshot.enrichedAt,
    });

    const response = await GET(
      new NextRequest("http://localhost/api/companies/job-1/enrich"),
      context,
    );

    await expect(response.json()).resolves.toEqual({
      snapshot,
      enrichedAt: snapshot.enrichedAt,
    });
  });

  it("returns cached snapshot for POST when fresh", async () => {
    mocks.getCompanyEnrichment.mockReturnValue({
      snapshot,
      enrichedAt: snapshot.enrichedAt,
    });

    const response = await POST(request(), context);

    await expect(response.json()).resolves.toMatchObject({
      fromCache: true,
      snapshot,
    });
    expect(mocks.enrichCompany).not.toHaveBeenCalled();
  });

  it("bypasses cache on refresh", async () => {
    mocks.getCompanyEnrichment.mockReturnValue({
      snapshot,
      enrichedAt: snapshot.enrichedAt,
    });

    const response = await POST(
      request("http://localhost/api/companies/job-1/enrich?refresh=true"),
      context,
    );

    expect(mocks.enrichCompany).toHaveBeenCalledWith({
      companyName: "Acme",
      companyUrl: "https://acme.com/jobs",
      githubOrg: null,
      userId: "user-1",
    });
    await expect(response.json()).resolves.toMatchObject({ fromCache: false });
  });

  it("forwards the stored GitHub override when the body lacks one", async () => {
    mocks.getCompanyGithubSlug.mockReturnValue("anthropics");

    await POST(request(), context);

    expect(mocks.enrichCompany).toHaveBeenCalledWith({
      companyName: "Acme",
      companyUrl: "https://acme.com/jobs",
      githubOrg: "anthropics",
      userId: "user-1",
    });
  });

  it("returns 404 when the opportunity is missing", async () => {
    mocks.getJob.mockReturnValue(null);

    const response = await POST(request(), context);

    expect(response.status).toBe(404);
  });

  it("returns auth errors", async () => {
    const authError = NextResponse.json({ error: "nope" }, { status: 401 });
    mocks.requireAuth.mockResolvedValue(authError);
    mocks.isAuthError.mockReturnValue(true);

    const response = await POST(request(), context);

    expect(response.status).toBe(401);
  });
});
