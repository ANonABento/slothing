import { beforeEach, describe, expect, it } from "vitest";
import {
  BentoRouterEncryptionConfigError,
  createBentoRouterEncryptionAdapter,
  resetBentoRouterEncryptionKeyForTests,
} from "./encryption";

describe("BentoRouter provider-key encryption", () => {
  beforeEach(() => {
    resetBentoRouterEncryptionKeyForTests();
  });

  it("round-trips provider keys with NEXTAUTH_SECRET-derived AES-GCM", async () => {
    const adapter = createBentoRouterEncryptionAdapter({
      NEXTAUTH_SECRET: "test-secret-with-enough-entropy",
    });

    const encrypted = await adapter.encrypt("sk-test");

    expect(adapter.scheme).toBe("aes-256-gcm-v1");
    expect(encrypted).toMatch(/^aes-256-gcm-v1:/);
    expect(encrypted).not.toContain("sk-test");
    await expect(adapter.decrypt(encrypted)).resolves.toBe("sk-test");
  });

  it("throws when NEXTAUTH_SECRET is missing", () => {
    expect(() => createBentoRouterEncryptionAdapter({})).toThrow(
      BentoRouterEncryptionConfigError,
    );
  });
});
