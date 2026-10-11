import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  exec: vi.fn(),
  prepare: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    exec: mocks.exec,
    prepare: mocks.prepare,
  },
}));

import { getOnboardingState, setOnboardingDismissedAt } from "./onboarding";

describe("onboarding database helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.exec.mockResolvedValue(undefined);
  });

  it("returns empty state without creating a missing user row", async () => {
    const get = vi.fn().mockResolvedValue(undefined);
    mocks.prepare.mockReturnValue({ get });

    await expect(getOnboardingState("missing-user")).resolves.toEqual({
      dismissedAt: null,
      firstName: null,
    });

    expect(mocks.prepare).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith("missing-user");
  });

  it("extracts the first name from the user record", async () => {
    const get = vi.fn().mockResolvedValue({
      onboarding_dismissed_at: "2026-05-09T10:00:00.000Z",
      name: "Kevin Jiang",
    });
    mocks.prepare.mockReturnValue({ get });

    await expect(getOnboardingState("user-1")).resolves.toEqual({
      dismissedAt: "2026-05-09T10:00:00.000Z",
      firstName: "Kevin",
    });
  });

  it("upserts a user row before setting dismissal", async () => {
    const run = vi.fn().mockResolvedValue({ changes: 1 });
    const get = vi.fn().mockResolvedValue({
      onboarding_dismissed_at: "2026-05-09T10:00:00.000Z",
      name: null,
    });
    mocks.prepare
      .mockReturnValueOnce({ run })
      .mockReturnValueOnce({ run })
      .mockReturnValueOnce({ get });

    await expect(
      setOnboardingDismissedAt("user-1", "2026-05-09T10:00:00.000Z"),
    ).resolves.toEqual({
      dismissedAt: "2026-05-09T10:00:00.000Z",
      firstName: null,
    });

    expect(run).toHaveBeenNthCalledWith(1, "user-1");
    expect(run).toHaveBeenNthCalledWith(
      2,
      "2026-05-09T10:00:00.000Z",
      "user-1",
    );
  });

  it("allows clearing dismissal for the future restore path", async () => {
    const run = vi.fn().mockResolvedValue({ changes: 1 });
    const get = vi.fn().mockResolvedValue({
      onboarding_dismissed_at: null,
      name: null,
    });
    mocks.prepare
      .mockReturnValueOnce({ run })
      .mockReturnValueOnce({ run })
      .mockReturnValueOnce({ get });

    await expect(setOnboardingDismissedAt("user-1", null)).resolves.toEqual({
      dismissedAt: null,
      firstName: null,
    });

    expect(run).toHaveBeenNthCalledWith(2, null, "user-1");
  });
});
