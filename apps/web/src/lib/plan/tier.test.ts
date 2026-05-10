import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getTierLimits,
  getUserTier,
  PLAN_TIER_SETTING_KEY,
  setUserTier,
} from "./tier";
import {
  FREE_TIER_TAILOR_MONTHLY_LIMIT,
  PRO_TIER_TAILOR_MONTHLY_LIMIT,
} from "@/lib/constants";

vi.mock("@/lib/db/queries", () => ({
  getSetting: vi.fn(),
  setSetting: vi.fn(),
}));

const { getSetting, setSetting } = await import("@/lib/db/queries");

describe("plan tier settings", () => {
  beforeEach(() => {
    vi.mocked(getSetting).mockReset();
    vi.mocked(setSetting).mockReset();
  });

  it("defaults to the free tier when no setting exists", () => {
    vi.mocked(getSetting).mockReturnValueOnce(null);

    expect(getUserTier("user-1")).toBe("free");
    expect(getSetting).toHaveBeenCalledWith(PLAN_TIER_SETTING_KEY, "user-1");
  });

  it("returns a saved valid tier", () => {
    vi.mocked(getSetting).mockReturnValueOnce("student");

    expect(getUserTier("user-1")).toBe("student");
  });

  it("falls back to free for invalid stored values", () => {
    vi.mocked(getSetting).mockReturnValueOnce("enterprise");

    expect(getUserTier("user-1")).toBe("free");
  });

  it("persists normalized tier values", () => {
    expect(setUserTier("user-1", "pro")).toBe("pro");
    expect(setSetting).toHaveBeenCalledWith(
      PLAN_TIER_SETTING_KEY,
      "pro",
      "user-1",
    );
  });

  it("returns quota limits for tiers", () => {
    expect(getTierLimits("free").tailorMonthlyLimit).toBe(
      FREE_TIER_TAILOR_MONTHLY_LIMIT,
    );
    expect(getTierLimits("pro").tailorMonthlyLimit).toBe(
      PRO_TIER_TAILOR_MONTHLY_LIMIT,
    );
  });
});
