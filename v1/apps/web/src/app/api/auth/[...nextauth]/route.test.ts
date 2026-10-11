import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const nextAuthHandlers = {
  GET: vi.fn(),
  POST: vi.fn(),
};

vi.mock("@/auth", () => ({
  handlers: nextAuthHandlers,
}));

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

  nextAuthHandlers.GET.mockReset();
  nextAuthHandlers.POST.mockReset();
  vi.resetModules();
});

describe("/api/auth/[...nextauth]", () => {
  it("returns a structured 503 disabled response instead of invoking NextAuth when auth env is missing", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.NEXTAUTH_SECRET;

    const route = await importRoute();
    const response = await route.GET(
      new NextRequest("http://localhost/api/auth/csrf"),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      error: "auth_disabled",
      message: "Authentication is not configured on this instance.",
      missing: ["GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET"],
      docs: "https://slothing.dev/docs/self-hosting#auth",
    });
    expect(nextAuthHandlers.GET).not.toHaveBeenCalled();
  });

  it("delegates to NextAuth handlers unchanged when auth is configured", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    process.env.NEXTAUTH_SECRET = "test-nextauth-secret";

    const expectedResponse = Response.json({ ok: true });
    nextAuthHandlers.GET.mockResolvedValue(expectedResponse);

    const route = await importRoute();
    const request = new NextRequest("http://localhost/api/auth/session");
    const response = await route.GET(request);

    expect(response).toBe(expectedResponse);
    expect(nextAuthHandlers.GET).toHaveBeenCalledWith(request);
  });
});
