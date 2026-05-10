import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  getStreakState: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db/streak", () => ({
  getStreakState: mocks.getStreakState,
}));

import { GET } from "./route";

describe("/api/streak route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getStreakState.mockReturnValue({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDay: null,
      weekDays: [],
      lifetime: {
        opportunitiesCreated: 0,
        opportunitiesApplied: 0,
        resumesTailored: 0,
        coverLetters: 0,
        emailsSent: 0,
        interviewsStarted: 0,
      },
      unlockedIds: [],
      unlocked: [],
    });
  });

  it("returns the authenticated user's streak state", async () => {
    const response = await GET();

    expect(mocks.getStreakState).toHaveBeenCalledWith("user-1");
    await expect(response.json()).resolves.toMatchObject({
      streak: {
        currentStreak: 0,
        lifetime: {
          opportunitiesApplied: 0,
        },
      },
    });
  });

  it("returns auth failures unchanged", async () => {
    const authResponse = Response.json({ error: "Unauthorized" }, { status: 401 });
    mocks.requireAuth.mockResolvedValue(authResponse);
    mocks.isAuthError.mockReturnValue(true);

    const response = await GET();

    expect(response.status).toBe(401);
  });
});
