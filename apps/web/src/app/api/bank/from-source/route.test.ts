import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  insertBankEntry: vi.fn(),
  standard: vi.fn(),
  getClientIdentifier: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));
vi.mock("@/lib/db/profile-bank", () => ({
  insertBankEntry: mocks.insertBankEntry,
}));
vi.mock("@/lib/rate-limit", () => ({
  rateLimiters: { standard: mocks.standard },
  getClientIdentifier: mocks.getClientIdentifier,
}));

import { POST } from "./route";

function req(body: unknown) {
  return new NextRequest("http://localhost/api/bank/from-source", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/bank/from-source", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "u1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getClientIdentifier.mockReturnValue("user:u1");
    mocks.standard.mockReturnValue({ allowed: true, remaining: 9, resetAt: 0 });
    let n = 0;
    mocks.insertBankEntry.mockImplementation(() =>
      n++ === 0 ? "proj1" : `bullet${n - 1}`,
    );
  });

  it("creates a project parent + canonical child bullets", async () => {
    const res = await POST(
      req({
        url: "https://github.com/Lironktf/flowTO",
        name: "FlowTO",
        technologies: ["Python", "cuGraph"],
        bullets: ["Built a digital twin", "Integrated a Nemotron copilot"],
      }),
    );
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toMatchObject({
      success: true,
      projectId: "proj1",
      name: "FlowTO",
    });
    expect(json.bulletIds).toHaveLength(2);

    // 1 project + 2 bullets
    expect(mocks.insertBankEntry).toHaveBeenCalledTimes(3);

    const [projectArg] = mocks.insertBankEntry.mock.calls[0];
    expect(projectArg).toMatchObject({
      category: "project",
      status: "verified",
      groundedIn: { kind: "url", url: "https://github.com/Lironktf/flowTO" },
    });
    expect(projectArg.content).toMatchObject({ name: "FlowTO", childCount: 2 });

    const [firstBullet] = mocks.insertBankEntry.mock.calls[1];
    expect(firstBullet).toMatchObject({
      category: "bullet",
      parentId: "proj1",
      componentType: "project",
      componentOrder: 0,
      status: "verified",
    });
    expect(firstBullet.content).toMatchObject({
      description: "Built a digital twin",
      parentId: "proj1",
      order: 0,
    });

    const [secondBullet] = mocks.insertBankEntry.mock.calls[2];
    expect(secondBullet.componentOrder).toBe(1);
  });

  it("rejects an empty bullet list (schema)", async () => {
    const res = await POST(req({ name: "X", bullets: [] }));
    expect(res.status).toBe(400);
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });

  it("429s when rate limited", async () => {
    mocks.standard.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: 0,
    });
    const res = await POST(req({ name: "X", bullets: ["a bullet"] }));
    expect(res.status).toBe(429);
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });
});
