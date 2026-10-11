import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { requireCronAuth } from "./cron-auth";

function request(headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/cron/example", { headers });
}

describe("requireCronAuth", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns 401 when CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");

    const response = await requireCronAuth(request());

    expect(response).not.toBeNull();
    if (!response) return;
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
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

  it("rejects same-prefix tokens with different lengths", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");

    const response = await requireCronAuth(
      request({ authorization: "Bearer test-secret-extra" }),
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

  it("uses timingSafeEqual instead of direct string equality for token checks", () => {
    const source = readFileSync("src/lib/cron-auth.ts", "utf8");

    expect(source).toContain("timingSafeEqual");
    expect(source).not.toMatch(/header\s*[!=]==\s*`Bearer/);
    expect(source).not.toMatch(/token\s*[!=]==\s*secret/);
    expect(source).not.toMatch(
      /\b(actual|expected|token|secret|header)\s*[!=]==\s*(actual|expected|token|secret|header)\b/,
    );
  });
});
