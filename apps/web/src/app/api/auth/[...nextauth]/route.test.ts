import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const ORIGINAL_GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const ORIGINAL_GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ORIGINAL_NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

async function importRoute() {
  vi.resetModules();
  return import("./route");
}

afterEach(() => {
  if (ORIGINAL_GOOGLE_ID === undefined) delete process.env.GOOGLE_CLIENT_ID;
  else process.env.GOOGLE_CLIENT_ID = ORIGINAL_GOOGLE_ID;

  if (ORIGINAL_GOOGLE_SECRET === undefined) {
    delete process.env.GOOGLE_CLIENT_SECRET;
  } else {
    process.env.GOOGLE_CLIENT_SECRET = ORIGINAL_GOOGLE_SECRET;
  }

  if (ORIGINAL_NEXTAUTH_SECRET === undefined)
    delete process.env.NEXTAUTH_SECRET;
  else process.env.NEXTAUTH_SECRET = ORIGINAL_NEXTAUTH_SECRET;

  vi.resetModules();
});

describe("/api/auth/[...nextauth]", () => {
  it("returns an intentional disabled response instead of invoking NextAuth when the secret is missing", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    delete process.env.NEXTAUTH_SECRET;

    const route = await importRoute();
    const response = await route.GET(
      new NextRequest("http://localhost/api/auth/session"),
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "NextAuth is disabled in local development.",
    });
  });
});
