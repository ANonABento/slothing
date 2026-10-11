import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isCloudBuild: vi.fn(),
  getActiveUserSubscription: vi.fn(),
}));

vi.mock("@/lib/cloud-flag", () => ({
  isCloudBuild: mocks.isCloudBuild,
}));

vi.mock("@/lib/db/subscriptions", () => ({
  getActiveUserSubscription: mocks.getActiveUserSubscription,
}));

import { getUserPlan } from "./plans";

describe("getUserPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isCloudBuild.mockReturnValue(true);
    mocks.getActiveUserSubscription.mockResolvedValue(null);
  });

  it("always returns self-host outside cloud builds", async () => {
    mocks.isCloudBuild.mockReturnValue(false);

    await expect(getUserPlan("user-1")).resolves.toBe("self-host");
    expect(mocks.getActiveUserSubscription).not.toHaveBeenCalled();
  });

  it("returns hosted-free without an active subscription", async () => {
    await expect(getUserPlan("user-1")).resolves.toBe("hosted-free");
  });

  it("maps active Stripe plan keys to user plans", async () => {
    mocks.getActiveUserSubscription.mockResolvedValue({
      planKey: "pro_weekly",
    });
    await expect(getUserPlan("user-1")).resolves.toBe("pro-weekly");

    mocks.getActiveUserSubscription.mockResolvedValue({
      planKey: "pro_monthly",
    });
    await expect(getUserPlan("user-1")).resolves.toBe("pro-monthly");
  });
});
