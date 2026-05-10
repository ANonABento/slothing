import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { checkTailorQuota, getMonthlyTailorCount } from "./quota";

vi.mock("@/lib/db/legacy", () => ({
  default: {
    prepare: vi.fn(),
  },
}));

vi.mock("@/lib/format/time", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/format/time")>(
      "@/lib/format/time",
    );

  return {
    ...actual,
    nowIso: vi.fn(() => "2026-05-10T12:30:00.000Z"),
  };
});

vi.mock("./tier", async () => {
  const actual = await vi.importActual<typeof import("./tier")>("./tier");
  return {
    ...actual,
    getUserTier: vi.fn(() => "free"),
  };
});

const db = (await import("@/lib/db/legacy")).default;
const { getUserTier } = await import("./tier");

describe("tailor quota", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockMonthlyCount(count: number) {
    const get = vi.fn().mockReturnValue({ count });
    (db.prepare as Mock).mockReturnValue({ get });
    return get;
  }

  it("counts generated resumes from the current UTC month", () => {
    const get = mockMonthlyCount(2);

    expect(getMonthlyTailorCount("user-1")).toBe(2);
    expect(get).toHaveBeenCalledWith("user-1", "2026-05-01T00:00:00.000Z");
  });

  it("allows free users below the monthly limit", () => {
    mockMonthlyCount(4);
    vi.mocked(getUserTier).mockReturnValueOnce("free");

    expect(checkTailorQuota("user-1")).toMatchObject({
      allowed: true,
      tier: "free",
      used: 4,
      limit: 5,
      resetAt: "2026-06-01T00:00:00.000Z",
    });
  });

  it("blocks free users at the monthly limit", () => {
    mockMonthlyCount(5);
    vi.mocked(getUserTier).mockReturnValueOnce("free");

    expect(checkTailorQuota("user-1")).toMatchObject({
      allowed: false,
      used: 5,
      limit: 5,
    });
  });

  it("always allows pro and student tiers", () => {
    mockMonthlyCount(25);
    vi.mocked(getUserTier).mockReturnValueOnce("pro");

    expect(checkTailorQuota("user-1")).toMatchObject({
      allowed: true,
      used: 25,
      limit: Infinity,
    });

    vi.mocked(getUserTier).mockReturnValueOnce("student");
    expect(checkTailorQuota("user-1")).toMatchObject({
      allowed: true,
      limit: Infinity,
    });
  });
});
