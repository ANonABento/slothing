import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  markUnsubscribed: vi.fn(),
  verifyUnsubscribeToken: vi.fn(),
  setDigestEnabled: vi.fn(),
  verifyDigestUnsubscribeToken: vi.fn(),
}));

vi.mock("@/lib/welcome-series/state", () => ({
  markUnsubscribed: mocks.markUnsubscribed,
}));

vi.mock("@/lib/welcome-series/unsubscribe-token", () => ({
  verifyUnsubscribeToken: mocks.verifyUnsubscribeToken,
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
  });

  describe("welcome-series", () => {
    it("returns 400 for missing tokens", async () => {
      mocks.verifyUnsubscribeToken.mockReturnValue(null);

      const response = await invokeRouteHandler(
        GET,
        getRequest("http://localhost/api/email/unsubscribe"),
        routeContext(),
      );

      expect(response.status).toBe(400);
      await expect(response.text()).resolves.toContain(
        "Invalid unsubscribe link",
      );
      expect(mocks.verifyUnsubscribeToken).toHaveBeenCalledWith("");
      expect(mocks.markUnsubscribed).not.toHaveBeenCalled();
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
      await expect(response.text()).resolves.toContain(
        "Invalid unsubscribe link",
      );
      expect(mocks.verifyUnsubscribeToken).toHaveBeenCalledWith("bad");
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
      expect(mocks.setDigestEnabled).not.toHaveBeenCalled();
    });
  });

  describe("daily-digest", () => {
    beforeEach(() => {
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
      expect(mocks.markUnsubscribed).not.toHaveBeenCalled();
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
      await expect(response.json()).resolves.toEqual({
        error: "Invalid unsubscribe link",
      });
      expect(mocks.verifyDigestUnsubscribeToken).toHaveBeenCalledWith("bad");
      expect(mocks.setDigestEnabled).not.toHaveBeenCalled();
    });

    it("rejects a missing token", async () => {
      const response = await invokeRouteHandler(
        GET,
        getRequest("http://localhost/api/email/unsubscribe?topic=daily-digest"),
        routeContext(),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid unsubscribe link",
      });
      expect(mocks.verifyDigestUnsubscribeToken).not.toHaveBeenCalled();
      expect(mocks.setDigestEnabled).not.toHaveBeenCalled();
    });
  });
});
