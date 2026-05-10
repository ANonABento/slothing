import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  setDigestEnabled: vi.fn(),
  verifyDigestUnsubscribeToken: vi.fn(),
}));

vi.mock("@/lib/settings/digest", () => ({
  setDigestEnabled: mocks.setDigestEnabled,
}));

vi.mock("@/lib/digest/unsubscribe-token", () => ({
  verifyDigestUnsubscribeToken: mocks.verifyDigestUnsubscribeToken,
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
    mocks.verifyDigestUnsubscribeToken.mockReturnValue({
      valid: true,
      userId: "user-1",
    });
  });

  it("turns off daily digests for a valid token", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest(
        "http://localhost/api/email/unsubscribe?topic=daily-digest&token=abc",
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response.clone());
    expect(response.status).toBe(200);
    expect(mocks.setDigestEnabled).toHaveBeenCalledWith(false, "user-1");
  });

  it("rejects a tampered token", async () => {
    mocks.verifyDigestUnsubscribeToken.mockReturnValue({ valid: false });

    const response = await invokeRouteHandler(
      GET,
      getRequest(
        "http://localhost/api/email/unsubscribe?topic=daily-digest&token=bad",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    expect(mocks.setDigestEnabled).not.toHaveBeenCalled();
  });

  it("rejects a missing token", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/email/unsubscribe?topic=daily-digest"),
      routeContext(),
    );

    expect(response.status).toBe(400);
  });
});
