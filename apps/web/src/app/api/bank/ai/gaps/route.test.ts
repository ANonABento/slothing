import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getBankEntries: vi.fn(),
  getGroupedBankEntries: vi.fn(),
  classifyJobGaps: vi.fn(),
  analyzeJobFit: vi.fn(),
  extractKeywords: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (v: unknown) => v instanceof Response,
}));
vi.mock("@/lib/db/profile-bank", () => ({
  getBankEntries: mocks.getBankEntries,
  getGroupedBankEntries: mocks.getGroupedBankEntries,
}));
vi.mock("@/lib/bank/ai-authoring", () => ({
  classifyJobGaps: mocks.classifyJobGaps,
}));
vi.mock("@/lib/tailor/analyze", () => ({
  analyzeJobFit: mocks.analyzeJobFit,
  extractKeywords: mocks.extractKeywords,
}));

import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new NextRequest("http://localhost/api/bank/ai/gaps", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("POST /api/bank/ai/gaps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.getBankEntries.mockReturnValue([]);
    mocks.getGroupedBankEntries.mockReturnValue({});
    mocks.extractKeywords.mockReturnValue(["go", "kubernetes", "graphql"]);
    mocks.analyzeJobFit.mockReturnValue({
      keywordsMissing: ["kubernetes", "graphql"],
      matchScore: 62,
    });
    mocks.classifyJobGaps.mockReturnValue({
      strengthenable: [{ keyword: "kubernetes", entryIds: ["e1"] }],
      gaps: ["graphql"],
    });
  });

  it("classifies missing JD keywords into strengthenable vs gaps", async () => {
    const response = await post({
      jobDescription: "We use Kubernetes + GraphQL",
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      strengthenable: [{ keyword: "kubernetes", entryIds: ["e1"] }],
      gaps: ["graphql"],
      matchScore: 62,
    });
    // classifyJobGaps is fed the analyzer's missing keywords + the flat bank.
    expect(mocks.classifyJobGaps).toHaveBeenCalledWith(
      ["kubernetes", "graphql"],
      [],
    );
  });

  it("400s on an empty job description", async () => {
    const response = await post({ jobDescription: "   " });
    expect(response.status).toBe(400);
    expect(mocks.classifyJobGaps).not.toHaveBeenCalled();
  });

  it("propagates the auth failure response", async () => {
    mocks.requireAuth.mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
    );
    const response = await post({ jobDescription: "Kubernetes" });
    expect(response.status).toBe(401);
    expect(mocks.classifyJobGaps).not.toHaveBeenCalled();
  });
});
