import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  getAgentSettings: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/agent-settings", () => ({
  getAgentSettings: mocks.getAgentSettings,
}));

import { GET } from "./route";
import { DEFAULT_AGENT_POLICY } from "@/lib/agent/policy";

function request() {
  return new NextRequest("http://localhost/api/extension/agent-policy");
}

describe("extension agent-policy route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an unauthenticated request", async () => {
    mocks.requireExtensionAuth.mockResolvedValueOnce({
      success: false,
      response: NextResponse.json(
        { error: "No token provided" },
        { status: 401 },
      ),
    });

    const res = await GET(request());
    expect(res.status).toBe(401);
    expect(mocks.getAgentSettings).not.toHaveBeenCalled();
  });

  it("returns the policy + capability flags for an authed user", async () => {
    mocks.requireExtensionAuth.mockResolvedValueOnce({
      success: true,
      userId: "user-1",
    });
    mocks.getAgentSettings.mockResolvedValueOnce({
      ...DEFAULT_AGENT_POLICY,
      autonomy: "auto_submit",
      dryRun: false,
    });

    const res = await GET(request());
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      policy: { autonomy: string };
      capabilities: { canSubmit: boolean; canSubmitUnattended: boolean };
    };
    expect(body.policy.autonomy).toBe("auto_submit");
    expect(body.capabilities.canSubmit).toBe(true);
    expect(body.capabilities.canSubmitUnattended).toBe(true);
    expect(mocks.getAgentSettings).toHaveBeenCalledWith("user-1");
  });

  it("keeps submission disabled while dry-run is on", async () => {
    mocks.requireExtensionAuth.mockResolvedValueOnce({
      success: true,
      userId: "user-1",
    });
    mocks.getAgentSettings.mockResolvedValueOnce({
      ...DEFAULT_AGENT_POLICY,
      autonomy: "auto_submit",
      dryRun: true,
    });

    const res = await GET(request());
    const body = (await res.json()) as {
      capabilities: { canSubmit: boolean };
    };
    expect(body.capabilities.canSubmit).toBe(false);
  });
});
