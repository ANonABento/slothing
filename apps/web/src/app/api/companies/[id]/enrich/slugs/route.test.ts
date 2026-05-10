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

function request(body: unknown = { githubSlug: " anthropics " }) {
  return new NextRequest("http://localhost/api/companies/job-1/enrich/slugs", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

describe("company enrichment slug route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.standard.mockReturnValue({ allowed: true, resetAt: 0 });
    mocks.getJob.mockReturnValue({ id: "job-1", company: "Anthropic" });
    mocks.setCompanyGithubSlug.mockReturnValue("anthropics");
  });

  it("stores trimmed lowercase slugs", async () => {
    const response = await PATCH(request(), context);

    expect(mocks.setCompanyGithubSlug).toHaveBeenCalledWith(
      "user-1",
      "Anthropic",
      "anthropics",
    );
    await expect(response.json()).resolves.toEqual({
      githubSlug: "anthropics",
    });
  });

  it("clears the slug with an empty string", async () => {
    mocks.setCompanyGithubSlug.mockReturnValue(null);

    const response = await PATCH(request({ githubSlug: " " }), context);

    expect(mocks.setCompanyGithubSlug).toHaveBeenCalledWith(
      "user-1",
      "Anthropic",
      null,
    );
    await expect(response.json()).resolves.toEqual({ githubSlug: null });
  });

  it("returns 404 when the opportunity is missing", async () => {
    mocks.getJob.mockReturnValue(null);

    const response = await PATCH(request(), context);

    expect(response.status).toBe(404);
  });

  it("returns auth errors", async () => {
    const authError = NextResponse.json({ error: "nope" }, { status: 401 });
    mocks.requireAuth.mockResolvedValue(authError);
    mocks.isAuthError.mockReturnValue(true);

    const response = await PATCH(request(), context);

    expect(response.status).toBe(401);
  });
});
