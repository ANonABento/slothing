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
    mocks.getActiveUserSubscription.mockReturnValue(null);
  });

  it("always returns self-host outside cloud builds", () => {
    mocks.isCloudBuild.mockReturnValue(false);

    expect(getUserPlan("user-1")).toBe("self-host");
    expect(mocks.getActiveUserSubscription).not.toHaveBeenCalled();
  });

  it("returns hosted-free without an active subscription", () => {
    expect(getUserPlan("user-1")).toBe("hosted-free");
  });

  it("maps active Stripe plan keys to user plans", () => {
    mocks.getActiveUserSubscription.mockReturnValue({ planKey: "pro_weekly" });
    expect(getUserPlan("user-1")).toBe("pro-weekly");

    mocks.getActiveUserSubscription.mockReturnValue({ planKey: "pro_monthly" });
    expect(getUserPlan("user-1")).toBe("pro-monthly");
  });
});
