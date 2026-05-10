import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
}));

vi.mock("@/lib/db/legacy", () => ({
  default: { prepare: mocks.prepare },
}));

import { getEligibleDigestUsers } from "./eligible-users";

describe("getEligibleDigestUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("selects users with emails whose digest setting is enabled by default", () => {
    const all = vi.fn(() => [
      {
        id: "user-1",
        email: "ada@example.com",
        name: "Ada",
        digest_enabled: "true",
      },
    ]);
    mocks.prepare.mockReturnValue({ all });

    expect(getEligibleDigestUsers()).toEqual([
      {
        userId: "user-1",
        email: "ada@example.com",
        name: "Ada",
        digestEnabled: true,
      },
    ]);
    expect(mocks.prepare).toHaveBeenCalledWith(
      expect.stringContaining("COALESCE(s.value, 'true') AS digest_enabled"),
    );
    expect(all).toHaveBeenCalledWith(1000);
  });
});
