import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listConfiguredProviders: vi.fn(),
  migrateLegacyLLMSettingsForUser: vi.fn(),
  getUserPlan: vi.fn(),
  deductCredits: vi.fn(),
  refundCredits: vi.fn(),
}));

vi.mock("@/lib/llm/bentorouter-client", () => ({
  getBentoRouterClient: vi.fn(async () => ({
    api: () => ({
      listConfiguredProviders: mocks.listConfiguredProviders,
    }),
  })),
}));

vi.mock("@/lib/llm/migrate-legacy", () => ({
  migrateLegacyLLMSettingsForUser: mocks.migrateLegacyLLMSettingsForUser,
}));

vi.mock("@/lib/db/credits", () => ({
  deductCredits: mocks.deductCredits,
  refundCredits: mocks.refundCredits,
}));

vi.mock("./plans", () => ({
  getUserPlan: mocks.getUserPlan,
}));

import {
  gateAiFeature,
  gateOptionalAiFeature,
  isAiGateResponse,
} from "./ai-gate";

describe("gateAiFeature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SLOTHING_HOSTED_LLM_API_KEY;
    mocks.getUserPlan.mockReturnValue("hosted-free");
    mocks.listConfiguredProviders.mockResolvedValue([]);
    mocks.migrateLegacyLLMSettingsForUser.mockResolvedValue({
      migrated: false,
      taskCount: 0,
    });
    mocks.deductCredits.mockReturnValue({
      userId: "user-1",
      delta: -5,
      reason: "usage",
      feature: "tailor",
      refId: "job-1",
    });
  });

  it("lets self-host users pass with their configured provider", async () => {
    mocks.getUserPlan.mockReturnValue("self-host");
    mocks.listConfiguredProviders.mockResolvedValue([
      { id: "openai-personal" },
    ]);

    const result = await gateAiFeature("user-1", "tailor", "job-1");

    expect(isAiGateResponse(result)).toBe(false);
    if (!isAiGateResponse(result)) {
      expect(result.source).toBe("self-host");
      expect(result.llmConfig.userId).toBe("user-1");
    }
    expect(mocks.deductCredits).not.toHaveBeenCalled();
  });

  it("lets hosted BYOK users pass without deducting credits", async () => {
    mocks.listConfiguredProviders.mockResolvedValue([{ id: "anthropic-work" }]);

    const result = await gateAiFeature("user-1", "cover_letter", "letter-1");

    expect(isAiGateResponse(result)).toBe(false);
    if (!isAiGateResponse(result)) expect(result.source).toBe("byok");
    expect(mocks.deductCredits).not.toHaveBeenCalled();
  });

  it("returns 402 for hosted-free users without BYOK", async () => {
    const result = await gateAiFeature("user-1", "tailor", "job-1");

    expect(isAiGateResponse(result)).toBe(true);
    if (isAiGateResponse(result)) {
      expect(result.status).toBe(402);
      await expect(result.json()).resolves.toMatchObject({
        code: "billing_required",
      });
    }
  });

  it("deducts Pro credits and refunds on request", async () => {
    process.env.SLOTHING_HOSTED_LLM_API_KEY = "sk-hosted";
    mocks.getUserPlan.mockReturnValue("pro-monthly");

    const result = await gateAiFeature("user-1", "tailor", "job-1");

    expect(isAiGateResponse(result)).toBe(false);
    if (!isAiGateResponse(result)) {
      expect(result.source).toBe("credits");
      expect(result.llmConfig.apiKey).toBe("hosted");
      result.refund();
    }
    expect(mocks.deductCredits).toHaveBeenCalledWith(
      "user-1",
      "tailor",
      "job-1",
    );
    expect(mocks.refundCredits).toHaveBeenCalledWith(
      "user-1",
      "tailor",
      "job-1",
    );
  });

  it("lets self-host optional AI routes fall back without a provider", async () => {
    mocks.getUserPlan.mockReturnValue("self-host");

    const result = await gateOptionalAiFeature("user-1", "tailor", "upload-1");

    expect(isAiGateResponse(result)).toBe(false);
    if (!isAiGateResponse(result)) {
      expect(result.source).toBe("self-host");
      expect(result.llmConfig).toBeNull();
    }
    expect(mocks.deductCredits).not.toHaveBeenCalled();
  });
});
