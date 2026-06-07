import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  gateOptionalAiFeature: vi.fn(),
  getBankEntryById: vi.fn(),
  insertBankEntry: vi.fn(),
  strengthenEntryHighlights: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (v: unknown) => v instanceof Response,
}));

vi.mock("@/lib/billing/ai-gate", () => ({
  gateOptionalAiFeature: mocks.gateOptionalAiFeature,
  isAiGateResponse: (v: unknown) => v instanceof Response,
}));

vi.mock("@/lib/db/profile-bank", () => ({
  getBankEntryById: mocks.getBankEntryById,
  insertBankEntry: mocks.insertBankEntry,
}));

vi.mock("@/lib/bank/ai-authoring", () => ({
  strengthenEntryHighlights: mocks.strengthenEntryHighlights,
  strengthenedDraftInput: (entry: { id: string }, highlights: string[]) => ({
    category: "experience",
    content: { highlights },
    status: "draft",
    authoredBy: "ai_strengthened",
    groundedIn: { kind: "entry", refId: entry.id },
  }),
}));

import { POST } from "./route";

const verifiedEntry = {
  id: "e1",
  userId: "user-1",
  category: "experience",
  content: { company: "Acme", title: "Engineer", highlights: ["Did a thing"] },
  confidenceScore: 0.9,
  createdAt: "2026-01-01",
};

function req(body: unknown) {
  return new NextRequest("http://localhost/api/bank/ai/draft", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/bank/ai/draft — strengthen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.getBankEntryById.mockReturnValue(verifiedEntry);
    mocks.gateOptionalAiFeature.mockResolvedValue({
      llmConfig: { provider: "openai", apiKey: "k", model: "m" },
      refund: vi.fn(),
    });
    mocks.strengthenEntryHighlights.mockResolvedValue(["Drove a thing"]);
    mocks.insertBankEntry.mockReturnValue("draft-1");
  });

  it("persists a DRAFT (ai_strengthened) and returns 201", async () => {
    const res = await POST(req({ mode: "strengthen", entryId: "e1" }));
    expect(res.status).toBe(201);
    const insertArg = mocks.insertBankEntry.mock.calls[0][0];
    expect(insertArg.status).toBe("draft");
    expect(insertArg.authoredBy).toBe("ai_strengthened");
    expect(insertArg.groundedIn).toEqual({ kind: "entry", refId: "e1" });
    await expect(res.json()).resolves.toMatchObject({
      success: true,
      id: "draft-1",
      status: "draft",
    });
  });

  it("404s for a missing/foreign entry", async () => {
    mocks.getBankEntryById.mockReturnValue(null);
    const res = await POST(req({ mode: "strengthen", entryId: "nope" }));
    expect(res.status).toBe(404);
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });

  it("402s when no AI provider is available (free user)", async () => {
    mocks.gateOptionalAiFeature.mockResolvedValue({
      llmConfig: null,
      refund: vi.fn(),
    });
    const res = await POST(req({ mode: "strengthen", entryId: "e1" }));
    expect(res.status).toBe(402);
    expect(mocks.strengthenEntryHighlights).not.toHaveBeenCalled();
    expect(mocks.insertBankEntry).not.toHaveBeenCalled();
  });
});
