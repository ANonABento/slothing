import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  markUnsubscribed: vi.fn(),
  verifyUnsubscribeToken: vi.fn(),
}));

vi.mock("@/lib/welcome-series/state", () => ({
  markUnsubscribed: mocks.markUnsubscribed,
}));

vi.mock("@/lib/welcome-series/unsubscribe-token", () => ({
  verifyUnsubscribeToken: mocks.verifyUnsubscribeToken,
}));

import { GET } from "./route";
import {
  expectRouteResponseContract,
  getRequest,
  invokeRouteHandler,
  routeContext,
} from "@/test/contract";

describe("/api/email/unsubscribe route contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid tokens", async () => {
    mocks.verifyUnsubscribeToken.mockReturnValue(null);

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/email/unsubscribe?token=bad"),
      routeContext(),
    );

    await expectRouteResponseContract(response.clone());
    expect(response.status).toBe(400);
    expect(mocks.markUnsubscribed).not.toHaveBeenCalled();
  });

  it("marks a valid token unsubscribed and is replay safe", async () => {
    mocks.verifyUnsubscribeToken.mockReturnValue("user-1");

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/email/unsubscribe?token=good"),
      routeContext(),
    );
    const replay = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/email/unsubscribe?token=good"),
      routeContext(),
    );

    expect(response.status).toBe(200);
    expect(replay.status).toBe(200);
    expect(mocks.markUnsubscribed).toHaveBeenCalledTimes(2);
    expect(mocks.markUnsubscribed).toHaveBeenCalledWith("user-1");
  });
});
