import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requireCronAuth } from "./cron-auth";

function request(headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/cron/example", { headers });
}

describe("requireCronAuth", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("fails closed in production when CRON_SECRET is unset", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CRON_SECRET", "");

    const response = await requireCronAuth(request());

    expect(response).not.toBeNull();
    if (!response) return;
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "CRON_SECRET not configured",
    });
  });

  it("allows non-production requests when CRON_SECRET is unset", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("CRON_SECRET", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(requireCronAuth(request())).resolves.toBeNull();
    expect(warn).toHaveBeenCalledWith(
      "[cron-auth] CRON_SECRET unset; allowing request in non-production env",
    );
  });

  it("allows requests with the configured bearer token", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    await expect(
      requireCronAuth(request({ authorization: "Bearer test-secret" })),
    ).resolves.toBeNull();
  });

  it("rejects requests with a missing authorization header", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    const response = await requireCronAuth(request());

    expect(response).not.toBeNull();
    if (!response) return;
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("rejects requests without the Bearer scheme", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    const response = await requireCronAuth(
      request({ authorization: "test-secret" }),
    );

    expect(response).not.toBeNull();
    if (!response) return;
    expect(response.status).toBe(401);
  });

  it("rejects requests with the wrong bearer token", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    const response = await requireCronAuth(
      request({ authorization: "Bearer wrong-secret" }),
    );

    expect(response).not.toBeNull();
    if (!response) return;
    expect(response.status).toBe(401);
  });

  it("accepts Authorization header casing from Vercel", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    await expect(
      requireCronAuth(request({ Authorization: "Bearer test-secret" })),
    ).resolves.toBeNull();
  });
});
