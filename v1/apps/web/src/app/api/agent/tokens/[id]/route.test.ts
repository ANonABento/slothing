import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(() => false),
  deleteServiceToken: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));
vi.mock("@/lib/db/service-tokens", () => ({
  deleteServiceToken: mocks.deleteServiceToken,
}));

import { DELETE } from "./route";

const ctx = { params: { id: "t1" } };
const req = () =>
  new NextRequest("http://localhost/api/agent/tokens/t1", { method: "DELETE" });

describe("agent token revoke route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
  });

  it("revokes an owned token", async () => {
    mocks.deleteServiceToken.mockResolvedValueOnce(true);
    const res = await DELETE(req(), ctx);
    expect(res.status).toBe(200);
    expect(mocks.deleteServiceToken).toHaveBeenCalledWith("t1", "user-1");
  });

  it("404s when nothing was deleted", async () => {
    mocks.deleteServiceToken.mockResolvedValueOnce(false);
    const res = await DELETE(req(), ctx);
    expect(res.status).toBe(404);
  });
});
