import { afterEach, describe, expect, it } from "vitest";
import {
  signDigestUnsubscribeToken,
  verifyDigestUnsubscribeToken,
} from "./unsubscribe-token";

const originalSecret = process.env.NEXTAUTH_SECRET;

describe("digest unsubscribe tokens", () => {
  afterEach(() => {
    process.env.NEXTAUTH_SECRET = originalSecret;
  });

  it("round trips a signed user id", () => {
    process.env.NEXTAUTH_SECRET = "secret-1";

    const token = signDigestUnsubscribeToken("user-1");

    expect(verifyDigestUnsubscribeToken(token)).toEqual({
      valid: true,
      userId: "user-1",
    });
  });

  it("rejects tampered tokens", () => {
    process.env.NEXTAUTH_SECRET = "secret-1";
    const token = signDigestUnsubscribeToken("user-1");

    expect(verifyDigestUnsubscribeToken(`${token}x`)).toEqual({
      valid: false,
    });
  });

  it("rejects tokens signed with a different secret", () => {
    process.env.NEXTAUTH_SECRET = "secret-1";
    const token = signDigestUnsubscribeToken("user-1");
    process.env.NEXTAUTH_SECRET = "secret-2";

    expect(verifyDigestUnsubscribeToken(token)).toEqual({ valid: false });
  });
});
