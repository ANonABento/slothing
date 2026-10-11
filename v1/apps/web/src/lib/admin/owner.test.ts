import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  auth: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: mocks.auth,
  isNextAuthConfigured: mocks.configured,
}));

import { isOwner, parseOwnerEmails } from "./owner";

describe("admin owner helpers", () => {
  it("parses owner email lists case-insensitively", () => {
    expect(parseOwnerEmails({ OWNER_EMAIL: "A@X.com, b@y.com " })).toEqual([
      "a@x.com",
      "b@y.com",
    ]);
  });

  it("allows local dev when NextAuth is not configured", () => {
    mocks.configured.mockReturnValue(false);
    expect(isOwner(null, {})).toBe(true);
  });

  it("fails closed when NextAuth is configured without owner emails", () => {
    mocks.configured.mockReturnValue(true);
    expect(isOwner({ user: { email: "owner@example.com" } }, {})).toBe(false);
  });

  it("matches the configured owner email", () => {
    mocks.configured.mockReturnValue(true);
    expect(
      isOwner(
        { user: { email: "OWNER@example.com" } },
        { OWNER_EMAIL: "owner@example.com" },
      ),
    ).toBe(true);
  });
});
