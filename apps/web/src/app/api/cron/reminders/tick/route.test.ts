import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fireDueReminders: vi.fn(),
}));

vi.mock("@/lib/reminders/fire-due", () => ({
  fireDueReminders: mocks.fireDueReminders,
}));

import { POST } from "./route";
import {
  expectRouteResponseContract,
  invokeRouteHandler,
  jsonRequest,
  resetContractMocks,
  routeContext,
} from "@/test/contract";

describe("/api/cron/reminders/tick route contract", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    resetContractMocks();
    vi.clearAllMocks();
    process.env = {
      ...originalEnv,
      CRON_SECRET: "test-secret",
    };
    mocks.fireDueReminders.mockResolvedValue({
      fired: 1,
      errors: 0,
      results: [],
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 401 without authorization", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/cron/reminders/tick"),
      routeContext(),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: "Unauthorized",
    });
  });

  it("returns 401 with the wrong bearer token", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/cron/reminders/tick", {}, "POST", {
        Authorization: "Bearer wrong",
      }),
      routeContext(),
    );

    expect(response.status).toBe(401);
  });

  it("fires reminders with the correct bearer token", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/cron/reminders/tick", {}, "POST", {
        Authorization: "Bearer test-secret",
      }),
      routeContext(),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      fired: 1,
      errors: 0,
      durationMs: expect.any(Number),
    });
  });

  it("returns the route response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/cron/reminders/tick", {}, "POST", {
        Authorization: "Bearer test-secret",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns a 500 body when firing throws", async () => {
    mocks.fireDueReminders.mockRejectedValue(new Error("db unavailable"));

    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/cron/reminders/tick", {}, "POST", {
        Authorization: "Bearer test-secret",
      }),
      routeContext(),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: "db unavailable",
    });
  });
});
