import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  listConfiguredProviders: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/llm/bentorouter-client", () => ({
  getBentoRouterClient: vi.fn(async () => ({
    api: () => ({
      listConfiguredProviders: mocks.listConfiguredProviders,
    }),
  })),
}));

import { GET } from "./route";

describe("GET /api/settings/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.listConfiguredProviders.mockResolvedValue([]);
  });

  it("reports no configured providers for the authenticated user", async () => {
    const response = await GET();

    expect(mocks.listConfiguredProviders).toHaveBeenCalledWith("user-1");
    await expect(response.json()).resolves.toEqual({
      configured: false,
      provider: null,
      providerCount: 0,
    });
  });

  it("reports provider count without exposing provider secrets", async () => {
    mocks.listConfiguredProviders.mockResolvedValue([
      { id: "openai", type: "openai", userId: "user-1" },
      { id: "openrouter", type: "openrouter", userId: "user-1" },
    ]);

    const response = await GET();

    await expect(response.json()).resolves.toEqual({
      configured: true,
      provider: "bentorouter",
      providerCount: 2,
    });
  });
});
