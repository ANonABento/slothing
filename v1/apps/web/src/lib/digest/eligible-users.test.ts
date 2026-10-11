import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

import { getEligibleDigestUsers } from "./eligible-users";

describe("getEligibleDigestUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("selects users with emails whose digest setting is enabled by default", async () => {
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          id: "user-1",
          email: "ada@example.com",
          name: "Ada",
          digest_enabled: "true",
        },
      ],
    });

    await expect(getEligibleDigestUsers()).resolves.toEqual([
      {
        userId: "user-1",
        email: "ada@example.com",
        name: "Ada",
        digestEnabled: true,
      },
    ]);
    expect(mocks.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining(
          "COALESCE(s.value, 'true') AS digest_enabled",
        ),
        args: [1000],
      }),
    );
  });
});
