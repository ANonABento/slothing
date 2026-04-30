import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  listOpportunities: vi.fn(),
  createJob: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/opportunities", () => ({
  listOpportunities: mocks.listOpportunities,
}));

vi.mock("@/lib/db/jobs", () => ({
  createJob: mocks.createJob,
}));

import { GET, POST } from "./route";

function jsonRequest(body: unknown) {
  return new NextRequest("http://localhost/api/opportunities", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("opportunities route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.listOpportunities.mockReturnValue([]);
  });

  it("lists opportunities for the authenticated user with parsed filters", async () => {
    const request = new NextRequest(
      "http://localhost/api/opportunities?status=saved",
    );

    const response = await GET(request);

    expect(mocks.listOpportunities).toHaveBeenCalledWith("user-1", ["saved"]);
    await expect(response.json()).resolves.toEqual({ opportunities: [] });
  });

  it("creates an opportunity after validating the request body", async () => {
    const job = {
      id: "job-1",
      title: "Frontend Engineer",
      company: "Acme",
      description: "Build user interfaces.",
      status: "pending",
      createdAt: "2026-04-29T12:00:00.000Z",
    };
    mocks.createJob.mockReturnValueOnce(job);

    const response = await POST(
      jsonRequest({
        type: "job",
        title: "Frontend Engineer",
        company: "Acme",
        source: "manual",
        summary: "Build user interfaces.",
      }),
    );

    expect(response.status).toBe(201);
    expect(mocks.createJob).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Frontend Engineer",
        company: "Acme",
        description: "Build user interfaces.",
        status: "pending",
      }),
    );
    await expect(response.json()).resolves.toEqual({ opportunity: job });
  });

  it("rejects invalid create payloads", async () => {
    const response = await POST(jsonRequest({ title: "Missing fields" }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error.fieldErrors).toBeDefined();
    expect(mocks.createJob).not.toHaveBeenCalled();
  });
});
