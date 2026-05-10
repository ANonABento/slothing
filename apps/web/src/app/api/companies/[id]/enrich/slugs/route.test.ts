import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getJob: vi.fn(),
  setCompanyGithubSlug: vi.fn(),
  standard: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));
vi.mock("@/lib/db/jobs", () => ({ getJob: mocks.getJob }));
vi.mock("@/lib/db/company-research", () => ({
  setCompanyGithubSlug: mocks.setCompanyGithubSlug,
}));
vi.mock("@/lib/rate-limit", () => ({
  getClientIdentifier: () => "user:user-1",
  rateLimiters: { standard: mocks.standard },
}));

import { PATCH } from "./route";

const context = { params: { id: "job-1" } };

function jsonRequest(body: unknown) {
  return new NextRequest("http://localhost/api/companies/job-1/enrich/slugs", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("company enrichment GitHub slug route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.standard.mockReturnValue({ allowed: true, resetAt: 0 });
    mocks.getJob.mockReturnValue({
      id: "job-1",
      company: "Acme",
    });
    mocks.setCompanyGithubSlug.mockReturnValue("acme-inc");
  });

  it("normalizes and saves the GitHub slug for an owned opportunity", async () => {
    const response = await PATCH(
      jsonRequest({ githubSlug: " ACME-Inc " }),
      context,
    );

    expect(response.status).toBe(200);
    expect(mocks.setCompanyGithubSlug).toHaveBeenCalledWith(
      "user-1",
      "Acme",
      "acme-inc",
    );
    await expect(response.json()).resolves.toEqual({ githubSlug: "acme-inc" });
  });

  it("returns auth errors before reading the opportunity", async () => {
    const authError = NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
    mocks.requireAuth.mockResolvedValue(authError);
    mocks.isAuthError.mockReturnValue(true);

    const response = await PATCH(jsonRequest({ githubSlug: "acme" }), context);

    expect(response.status).toBe(401);
    expect(mocks.getJob).not.toHaveBeenCalled();
    expect(mocks.setCompanyGithubSlug).not.toHaveBeenCalled();
  });

  it("returns 404 when the opportunity is missing", async () => {
    mocks.getJob.mockReturnValue(null);

    const response = await PATCH(jsonRequest({ githubSlug: "acme" }), context);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Opportunity not found",
    });
  });

  it("returns 400 when the body is malformed JSON", async () => {
    mocks.setCompanyGithubSlug.mockReturnValue(null);

    const response = await PATCH(
      new NextRequest("http://localhost/api/companies/job-1/enrich/slugs", {
        method: "PATCH",
        body: "{",
        headers: { "content-type": "application/json" },
      }),
      context,
    );

    expect(response.status).toBe(400);
    expect(mocks.setCompanyGithubSlug).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({
      error: "Invalid JSON body",
    });
  });

  it("returns 400 for wrong GitHub slug types", async () => {
    const response = await PATCH(jsonRequest({ githubSlug: 123 }), context);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "githubSlug" }],
    });
    expect(mocks.setCompanyGithubSlug).not.toHaveBeenCalled();
  });

  it("clears the saved slug when the body omits a slug", async () => {
    mocks.setCompanyGithubSlug.mockReturnValue(null);

    const response = await PATCH(jsonRequest({}), context);

    expect(response.status).toBe(200);
    expect(mocks.setCompanyGithubSlug).toHaveBeenCalledWith(
      "user-1",
      "Acme",
      null,
    );
    await expect(response.json()).resolves.toEqual({ githubSlug: null });
  });
});
