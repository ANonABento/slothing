import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  setOnboardingDismissedAt: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db/onboarding", () => ({
  setOnboardingDismissedAt: mocks.setOnboardingDismissedAt,
}));

import { POST } from "./route";

describe("onboarding dismiss route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.setOnboardingDismissedAt.mockResolvedValue({
      dismissedAt: "2026-05-09T10:00:00.000Z",
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
    const authResponse = new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
      },
    );
    mocks.requireAuth.mockResolvedValue(authResponse);
    mocks.isAuthError.mockReturnValue(true);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mocks.setOnboardingDismissedAt).not.toHaveBeenCalled();
  });
});
