import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createUnsubscribeToken,
  verifyUnsubscribeToken,
} from "./unsubscribe-token";

describe("welcome unsubscribe tokens", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      WELCOME_EMAIL_SECRET: "test-secret",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("round trips a user id", () => {
    const token = createUnsubscribeToken("user-1");
    expect(verifyUnsubscribeToken(token)).toBe("user-1");
  });

  it("rejects tampered signatures", () => {
    const token = createUnsubscribeToken("user-1");
    expect(verifyUnsubscribeToken(`${token}x`)).toBeNull();
  });

  it("rejects wrong versions and empty user ids", () => {
    const [, encoded, signature] = createUnsubscribeToken("user-1").split(".");
    expect(verifyUnsubscribeToken(`v2.${encoded}.${signature}`)).toBeNull();

    const emptyUserToken = `v1.${Buffer.from("", "utf8").toString(
      "base64url",
    )}.${signature}`;
    expect(verifyUnsubscribeToken(emptyUserToken)).toBeNull();
  });
});
