import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/cron-auth", () => ({
  requireCronAuth: vi.fn(async () => null),
}));

import { GET } from "./route";
import { requireCronAuth } from "@/lib/cron-auth";
import {
  expectRouteResponseContract,
  getRequest,
  invokeRouteHandler,
  routeContext,
} from "@/test/contract";

describe("/api/cron/reminders/tick route contract", () => {
  beforeEach(() => {
    vi.mocked(requireCronAuth).mockResolvedValue(null);
  });

  it("returns the reminders tick stub when auth passes", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/cron/reminders/tick"),
      routeContext(),
    );

    await expectRouteResponseContract(response.clone());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      cron: "reminders.tick",
    });
  });

  it("propagates cron auth failures", async () => {
    vi.mocked(requireCronAuth).mockResolvedValueOnce(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/cron/reminders/tick"),
      routeContext(),
    );

    expect(response.status).toBe(401);
  });
});
