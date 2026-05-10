import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
}));

vi.mock("@/lib/db/legacy", () => ({
  default: { prepare: mocks.prepare },
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

  it("detects applied jobs", () => {
    mocks.prepare.mockReturnValueOnce({ get: vi.fn(() => ({ found: 1 })) });
    expect(hasUserApplied("user-1")).toBe(true);
  });

  it("detects booked interview sessions", () => {
    mocks.prepare.mockReturnValueOnce({ get: vi.fn(() => undefined) });
    expect(hasUserBookedInterview("user-1")).toBe(false);
  });

  it("returns usage stats", () => {
    mocks.prepare
      .mockReturnValueOnce({ get: vi.fn(() => ({ count: 3 })) })
      .mockReturnValueOnce({ get: vi.fn(() => ({ count: 5 })) });

    expect(getUsageStats("user-1")).toEqual({
      applicationCount: 3,
      tailoredResumeCount: 5,
    });
  });
});
