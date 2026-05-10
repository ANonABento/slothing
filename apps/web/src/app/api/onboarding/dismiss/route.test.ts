import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getOnboardingState: vi.fn(),
  setOnboardingDismissedAt: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db/onboarding", () => ({
  getOnboardingState: mocks.getOnboardingState,
  setOnboardingDismissedAt: mocks.setOnboardingDismissedAt,
}));

import { GET, POST } from "./route";

describe("onboarding dismiss route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getOnboardingState.mockResolvedValue({
      dismissedAt: null,
      firstName: "Kevin",
    });
    mocks.setOnboardingDismissedAt.mockResolvedValue({
      dismissedAt: "2026-05-09T10:00:00.000Z",
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

  it("sets onboarding dismissal for the current user", async () => {
    const response = await POST();

    expect(mocks.setOnboardingDismissedAt).toHaveBeenCalledWith(
      "user-1",
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    );
    await expect(response.json()).resolves.toEqual({
      dismissedAt: "2026-05-09T10:00:00.000Z",
      firstName: "Kevin",
    });
  });

  it("returns auth errors without touching onboarding state", async () => {
    const authResponse = new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
    mocks.requireAuth.mockResolvedValue(authResponse);
    mocks.isAuthError.mockReturnValue(true);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mocks.setOnboardingDismissedAt).not.toHaveBeenCalled();
  });
});
