import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getBentoRouterClient: vi.fn(),
  listConfiguredProviders: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/llm/bentorouter-client", () => ({
  getBentoRouterClient: mocks.getBentoRouterClient,
}));

import { GET } from "./route";

const originalNextAuthSecret = process.env.NEXTAUTH_SECRET;

describe("GET /api/settings/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXTAUTH_SECRET = "test-secret";
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getBentoRouterClient.mockResolvedValue({
      api: () => ({
        listConfiguredProviders: mocks.listConfiguredProviders,
      }),
    });
    mocks.listConfiguredProviders.mockResolvedValue([]);
  });

  afterEach(() => {
    process.env.NEXTAUTH_SECRET = originalNextAuthSecret;
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

  it("does not construct provider encryption when the auth secret is absent", async () => {
    delete process.env.NEXTAUTH_SECRET;

    const response = await GET();

    expect(mocks.getBentoRouterClient).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({
      configured: false,
      provider: null,
      providerCount: 0,
    });
  });
});
