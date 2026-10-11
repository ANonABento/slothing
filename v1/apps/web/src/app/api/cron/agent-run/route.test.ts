import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireCronAuth: vi.fn(),
  listUsersWithActiveAgent: vi.fn(),
  getAgentSettings: vi.fn(),
  listDrafts: vi.fn(),
  listServiceTokens: vi.fn(),
  recordCronRun: vi.fn(),
}));

vi.mock("@/lib/cron-auth", () => ({ requireCronAuth: mocks.requireCronAuth }));
vi.mock("@/lib/db/agent-settings", () => ({
  listUsersWithActiveAgent: mocks.listUsersWithActiveAgent,
  getAgentSettings: mocks.getAgentSettings,
}));
vi.mock("@/lib/db/application-drafts", () => ({
  listDrafts: mocks.listDrafts,
}));
vi.mock("@/lib/db/service-tokens", () => ({
  listServiceTokens: mocks.listServiceTokens,
}));
vi.mock("@/lib/db/cron-runs", () => ({ recordCronRun: mocks.recordCronRun }));

import { GET } from "./route";
import { DEFAULT_AGENT_POLICY } from "@/lib/agent/policy";

const request = () => new NextRequest("http://localhost/api/cron/agent-run");

describe("agent-run cron route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireCronAuth.mockResolvedValue(null);
    mocks.getAgentSettings.mockResolvedValue({
      ...DEFAULT_AGENT_POLICY,
      autonomy: "auto_submit",
      dryRun: false,
    });
    mocks.recordCronRun.mockResolvedValue(undefined);
  });

  it("401s when cron auth fails", async () => {
    mocks.requireCronAuth.mockResolvedValueOnce(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );
    const res = await GET(request());
    expect(res.status).toBe(401);
    expect(mocks.listUsersWithActiveAgent).not.toHaveBeenCalled();
  });

  it("processes only users with a service token and records the run", async () => {
    mocks.listUsersWithActiveAgent.mockResolvedValueOnce([
      { userId: "u1", autonomy: "auto_submit" },
      { userId: "u2", autonomy: "draft" },
    ]);
    // u1 opted in (has token); u2 has none → skipped.
    mocks.listServiceTokens.mockImplementation((userId: string) =>
      Promise.resolve(userId === "u1" ? [{ id: "t1" }] : []),
    );
    mocks.listDrafts.mockResolvedValue([{ id: "d1" }, { id: "d2" }]);

    const res = await GET(request());
    const body = (await res.json()) as {
      activeUsers: number;
      processed: number;
      skippedNoToken: number;
      totalApprovedDrafts: number;
      users: Array<{ userId: string; wouldSubmitUnattended: boolean }>;
    };

    expect(body.activeUsers).toBe(2);
    expect(body.processed).toBe(1);
    expect(body.skippedNoToken).toBe(1);
    expect(body.totalApprovedDrafts).toBe(2);
    expect(body.users[0]?.userId).toBe("u1");
    expect(body.users[0]?.wouldSubmitUnattended).toBe(true);
    expect(mocks.recordCronRun).toHaveBeenCalledWith(
      expect.objectContaining({ status: "success" }),
    );
  });
});
