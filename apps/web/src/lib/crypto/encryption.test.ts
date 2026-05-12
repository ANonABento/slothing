import { randomBytes } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  EncryptionConfigError,
  EncryptionFormatError,
  decryptString,
  encryptString,
  getMasterKey,
  isEncryptedEnvelope,
  resetMasterKeyCacheForTests,
  tryDecryptOrPassthrough,
} from "./encryption";

const ORIGINAL_KEY = process.env.SLOTHING_ENCRYPTION_KEY;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

function setKey(buf: Buffer) {
  process.env.SLOTHING_ENCRYPTION_KEY = buf.toString("base64");
  resetMasterKeyCacheForTests();
}

function clearKey() {
  delete process.env.SLOTHING_ENCRYPTION_KEY;
  resetMasterKeyCacheForTests();
}

describe("encryption", () => {
  beforeEach(() => {
    setKey(randomBytes(32));
  });

  afterEach(() => {
    if (ORIGINAL_KEY) {
      process.env.SLOTHING_ENCRYPTION_KEY = ORIGINAL_KEY;
    } else {
      delete process.env.SLOTHING_ENCRYPTION_KEY;
    }
    process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    resetMasterKeyCacheForTests();
  });

  it("round-trips plaintext through encrypt -> decrypt", () => {
    const plaintext = "sk-test-1234567890abcdef";
    const envelope = encryptString(plaintext);
    expect(envelope).not.toBe(plaintext);
    expect(envelope.startsWith("enc:v1:")).toBe(true);
    expect(decryptString(envelope)).toBe(plaintext);
  });

  it("produces a fresh IV per encryption (ciphertext differs across calls)", () => {
    const a = encryptString("same-input");
    const b = encryptString("same-input");
    expect(a).not.toBe(b);
    expect(decryptString(a)).toBe("same-input");
    expect(decryptString(b)).toBe("same-input");
  });

  it("rejects a tampered envelope (auth tag fails)", () => {
    const envelope = encryptString("payload");
    // Flip a character inside the payload portion to corrupt it
    const payload = envelope.slice("enc:v1:".length);
    const mutated =
      "enc:v1:" +
      (payload[0] === "A" ? "B" : "A") +
      payload.slice(1);
    expect(() => decryptString(mutated)).toThrow();
  });

  it("isEncryptedEnvelope discriminates prefixed values", () => {
    expect(isEncryptedEnvelope("plain")).toBe(false);
    expect(isEncryptedEnvelope("enc:v1:" + Buffer.from("x").toString("base64"))).toBe(true);
  });

  it("tryDecryptOrPassthrough leaves plaintext untouched", () => {
    expect(tryDecryptOrPassthrough("sk-legacy-key")).toBe("sk-legacy-key");
  });

  it("tryDecryptOrPassthrough decrypts encrypted envelopes", () => {
    const envelope = encryptString("secret");
    expect(tryDecryptOrPassthrough(envelope)).toBe("secret");
  });

  it("decryptString throws EncryptionFormatError on plaintext input", () => {
    expect(() => decryptString("not-an-envelope")).toThrow(EncryptionFormatError);
  });

  it("getMasterKey throws in production when SLOTHING_ENCRYPTION_KEY is missing", () => {
    clearKey();
    process.env.NODE_ENV = "production";
    expect(() => getMasterKey()).toThrow(EncryptionConfigError);
  });

  it("getMasterKey throws if SLOTHING_ENCRYPTION_KEY is wrong length", () => {
    process.env.SLOTHING_ENCRYPTION_KEY = Buffer.from("too-short").toString("base64");
    resetMasterKeyCacheForTests();
    expect(() => getMasterKey()).toThrow(EncryptionConfigError);
  });

  it("getMasterKey falls back to a dev key when unset outside production", () => {
    clearKey();
    process.env.NODE_ENV = "test";
    expect(() => getMasterKey()).not.toThrow();
    const k = getMasterKey();
    expect(k.length).toBe(32);
  });
});
