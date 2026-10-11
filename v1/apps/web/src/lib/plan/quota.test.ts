import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkTailorQuota, getMonthlyTailorCount } from "./quota";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
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

const { getUserTier } = await import("./tier");

describe("tailor quota", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockMonthlyCount(count: number) {
    mocks.execute.mockResolvedValueOnce({ rows: [{ count }] });
    return mocks.execute;
  }

  it("counts generated resumes from the current UTC month", async () => {
    const execute = mockMonthlyCount(2);

    await expect(getMonthlyTailorCount("user-1")).resolves.toBe(2);
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        args: ["user-1", "2026-05-01T00:00:00.000Z"],
      }),
    );
  });

  it("allows free users below the monthly limit", async () => {
    mockMonthlyCount(4);
    vi.mocked(getUserTier).mockReturnValueOnce("free");

    await expect(checkTailorQuota("user-1")).resolves.toMatchObject({
      allowed: true,
      tier: "free",
      used: 4,
      limit: 5,
      resetAt: "2026-06-01T00:00:00.000Z",
    });
  });

  it("blocks free users at the monthly limit", async () => {
    mockMonthlyCount(5);
    vi.mocked(getUserTier).mockReturnValueOnce("free");

    await expect(checkTailorQuota("user-1")).resolves.toMatchObject({
      allowed: false,
      used: 5,
      limit: 5,
    });
  });

  it("always allows pro and student tiers", async () => {
    mockMonthlyCount(25);
    vi.mocked(getUserTier).mockReturnValueOnce("pro");

    await expect(checkTailorQuota("user-1")).resolves.toMatchObject({
      allowed: true,
      used: 25,
      limit: Infinity,
    });

    vi.mocked(getUserTier).mockReturnValueOnce("student");
    mocks.execute.mockResolvedValueOnce({ rows: [{ count: 25 }] });
    await expect(checkTailorQuota("user-1")).resolves.toMatchObject({
      allowed: true,
      limit: Infinity,
    });
  });
});
