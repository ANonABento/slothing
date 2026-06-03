import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

import {
  getUsageStats,
  hasUserApplied,
  hasUserBookedInterview,
} from "./predicates";

describe("welcome series predicates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("detects applied jobs", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ found: 1 }] });
    await expect(hasUserApplied("user-1")).resolves.toBe(true);
  });

  it("detects booked interview sessions", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });
    await expect(hasUserBookedInterview("user-1")).resolves.toBe(false);
  });

  it("returns usage stats", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rows: [{ count: 3 }] })
      .mockResolvedValueOnce({ rows: [{ count: 5 }] });

    await expect(getUsageStats("user-1")).resolves.toEqual({
      applicationCount: 3,
      tailoredResumeCount: 5,
    });
  });
});
