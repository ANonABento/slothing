import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  gate: vi.fn(),
  isAiGateResponse: vi.fn(),
  standard: vi.fn(),
  getClientIdentifier: vi.fn(),
  reviseBullet: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));
vi.mock("@/lib/billing/ai-gate", () => ({
  gateOptionalAiFeature: mocks.gate,
  isAiGateResponse: mocks.isAiGateResponse,
}));
vi.mock("@/lib/rate-limit", () => ({
  rateLimiters: { standard: mocks.standard },
  getClientIdentifier: mocks.getClientIdentifier,
}));
vi.mock("@/lib/bank/ai-authoring", () => ({
  reviseBullet: mocks.reviseBullet,
  REVISE_PRESETS: { shorter: "x", impact: "x", metric: "x", rephrase: "x" },
}));

import { POST } from "./route";

function req(body: unknown) {
  return new NextRequest("http://localhost/api/bank/ai/revise", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/bank/ai/revise", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "u1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getClientIdentifier.mockReturnValue("user:u1");
    mocks.standard.mockReturnValue({ allowed: true, remaining: 9, resetAt: 0 });
    mocks.isAiGateResponse.mockReturnValue(false);
    mocks.gate.mockResolvedValue({
      llmConfig: { provider: "openai", apiKey: "k", model: "m" },
      refund: vi.fn(),
    });
  });

  it("returns the revised bullet and applied flag", async () => {
    mocks.reviseBullet.mockResolvedValue({
      bullet: "Tighter bullet",
      applied: true,
      ungroundedNumbers: [],
    });
    const res = await POST(
      req({
        bullet: "Original bullet",
        evidence: "some evidence",
        preset: "shorter",
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({
      success: true,
      bullet: "Tighter bullet",
      applied: true,
    });
  });

  it("402s when no LLM is available", async () => {
    mocks.gate.mockResolvedValue({ llmConfig: null, refund: vi.fn() });
    const res = await POST(
      req({ bullet: "b", evidence: "e", preset: "shorter" }),
    );
    expect(res.status).toBe(402);
    expect(mocks.reviseBullet).not.toHaveBeenCalled();
  });

  it("429s when rate limited", async () => {
    mocks.standard.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: 0,
    });
    const res = await POST(
      req({ bullet: "b", evidence: "e", preset: "shorter" }),
    );
    expect(res.status).toBe(429);
  });

  it("refunds and 502s when the LLM call throws", async () => {
    const refund = vi.fn();
    mocks.gate.mockResolvedValue({
      llmConfig: { provider: "openai", apiKey: "k", model: "m" },
      refund,
    });
    mocks.reviseBullet.mockRejectedValue(new Error("fetch failed"));
    const res = await POST(
      req({ bullet: "b", evidence: "e", instruction: "tighten" }),
    );
    expect(res.status).toBe(502);
    expect(refund).toHaveBeenCalled();
  });

  it("400s on an empty bullet (schema)", async () => {
    const res = await POST(req({ bullet: "", evidence: "e" }));
    expect(res.status).toBe(400);
  });
});
