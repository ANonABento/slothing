import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getOnboardingState: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db/onboarding", () => ({
  getOnboardingState: mocks.getOnboardingState,
}));

import { GET } from "./route";

describe("onboarding state route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getOnboardingState.mockResolvedValue({
      dismissedAt: null,
      firstName: "Kevin",
    });
  });

  it("returns current onboarding state", async () => {
    const response = await GET();

    expect(mocks.getOnboardingState).toHaveBeenCalledWith("user-1");
    await expect(response.json()).resolves.toEqual({
      dismissedAt: null,
      firstName: "Kevin",
    });
  });

  it("returns auth errors without touching onboarding state", async () => {
    const authResponse = new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
      },
    );
    mocks.requireAuth.mockResolvedValue(authResponse);
    mocks.isAuthError.mockReturnValue(true);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mocks.getOnboardingState).not.toHaveBeenCalled();
  });
});
