import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  getDraft: vi.fn(),
  countSubmittedSince: vi.fn(),
  getJob: vi.fn(),
  getJobMatchScore: vi.fn(),
  getAgentSettings: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));
vi.mock("@/lib/db/application-drafts", () => ({
  getDraft: mocks.getDraft,
  countSubmittedSince: mocks.countSubmittedSince,
}));
vi.mock("@/lib/db/jobs-async", () => ({ getJob: mocks.getJob }));
vi.mock("@/lib/db/job-match-score", () => ({
  getJobMatchScore: mocks.getJobMatchScore,
}));
vi.mock("@/lib/db/agent-settings", () => ({
  getAgentSettings: mocks.getAgentSettings,
}));

import { GET } from "./route";
import { DEFAULT_AGENT_POLICY } from "@/lib/agent/policy";

const ctx = { params: { id: "d1" } };
function request() {
  return new NextRequest(
    "http://localhost/api/extension/drafts/d1/submit-authorization",
  );
}

const AUTO_POLICY = {
  ...DEFAULT_AGENT_POLICY,
  autonomy: "auto_submit" as const,
  dryRun: false,
  matchThreshold: 0.5,
  salaryFloor: 100000,
  companyBlocklist: ["acme"],
  dailySubmitCap: 5,
};

describe("submit-authorization route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockResolvedValue({
      success: true,
      userId: "user-1",
    });
    mocks.getDraft.mockResolvedValue({
      id: "d1",
      jobId: "job-1",
      status: "approved",
    });
    mocks.getJob.mockResolvedValue({ company: "Globex", salary: "$150,000" });
    mocks.getJobMatchScore.mockResolvedValue(0.8);
    mocks.getAgentSettings.mockResolvedValue(AUTO_POLICY);
    mocks.countSubmittedSince.mockResolvedValue(0);
  });

  it("rejects unauthenticated requests", async () => {
    mocks.requireExtensionAuth.mockResolvedValueOnce({
      success: false,
      response: NextResponse.json({ error: "no token" }, { status: 401 }),
    });
    const res = await GET(request(), ctx);
    expect(res.status).toBe(401);
  });

  it("404s a missing draft", async () => {
    mocks.getDraft.mockResolvedValueOnce(null);
    const res = await GET(request(), ctx);
    expect(res.status).toBe(404);
  });

  it("authorizes a clean approved draft under cap", async () => {
    const res = await GET(request(), ctx);
    const body = (await res.json()) as {
      authorized: boolean;
      reasons: string[];
    };
    expect(body.authorized).toBe(true);
    expect(body.reasons).toEqual([]);
  });

  it("blocks when the daily cap is reached", async () => {
    mocks.countSubmittedSince.mockResolvedValueOnce(5);
    const res = await GET(request(), ctx);
    const body = (await res.json()) as {
      authorized: boolean;
      reasons: string[];
    };
    expect(body.authorized).toBe(false);
    expect(body.reasons).toContain("daily_cap_reached");
  });

  it("blocks a blocklisted company", async () => {
    mocks.getJob.mockResolvedValueOnce({ company: "Acme", salary: "$150,000" });
    const res = await GET(request(), ctx);
    const body = (await res.json()) as {
      authorized: boolean;
      reasons: string[];
    };
    expect(body.authorized).toBe(false);
    expect(body.reasons).toContain("company_blocklisted");
  });
});
