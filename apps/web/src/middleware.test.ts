import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import middleware from "./middleware";

const ORIGINAL_ALLOW_UNAUTHED_DEV = process.env.SLOTHING_ALLOW_UNAUTHED_DEV;

beforeEach(() => {
  delete process.env.SLOTHING_ALLOW_UNAUTHED_DEV;
  vi.stubEnv("NODE_ENV", "test");
});

afterEach(() => {
  if (ORIGINAL_ALLOW_UNAUTHED_DEV === undefined) {
    delete process.env.SLOTHING_ALLOW_UNAUTHED_DEV;
  } else {
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = ORIGINAL_ALLOW_UNAUTHED_DEV;
  }
  vi.unstubAllEnvs();
});

describe("middleware", () => {
  it("adds the dev auth bypass header only when the explicit dev bypass is active", () => {
    const request = new NextRequest("http://localhost/api/profile");

    expect(middleware(request).headers.get("X-Slothing-Dev-Auth")).toBeNull();

    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = "1";

    expect(middleware(request).headers.get("X-Slothing-Dev-Auth")).toBe(
      "default-user",
    );
  });

  it("does not add the dev auth bypass header in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = "1";

    const response = middleware(
      new NextRequest("http://localhost/api/profile"),
    );

    expect(response.headers.get("X-Slothing-Dev-Auth")).toBeNull();
  });

  it("preserves next-intl request overrides when adding the CSP nonce", () => {
    const response = middleware(new NextRequest("http://localhost/en"));
    const overriddenHeaders =
      response.headers.get("x-middleware-override-headers")?.split(",") ?? [];

    expect(
      response.headers.get("x-middleware-request-x-next-intl-locale"),
    ).toBe("en");
    expect(overriddenHeaders).toContain("x-next-intl-locale");
    expect(overriddenHeaders).toContain("x-csp-nonce");
  });
});
