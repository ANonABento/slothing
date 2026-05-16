import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from "node:crypto";
import type { EncryptionAdapter } from "@anonabento/bento-router";

const SCHEME = "aes-256-gcm-v1";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;
const SALT = "slothing:bentorouter:provider-config";
const INFO = "slothing-provider-key-encryption";

let cachedKey: Buffer | null = null;

export class BentoRouterEncryptionConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BentoRouterEncryptionConfigError";
  }
}

export function resetBentoRouterEncryptionKeyForTests(): void {
  cachedKey = null;
}

export function getBentoRouterEncryptionKey(
  env: Record<string, string | undefined> = process.env,
): Buffer {
  if (cachedKey) return cachedKey;
  const secret = env.NEXTAUTH_SECRET?.trim();
  if (!secret) {
    throw new BentoRouterEncryptionConfigError(
      "NEXTAUTH_SECRET is required for BentoRouter provider-key encryption.",
    );
  }
  cachedKey = Buffer.from(
    hkdfSync(
      "sha256",
      Buffer.from(secret),
      Buffer.from(SALT),
      Buffer.from(INFO),
      KEY_BYTES,
    ),
  );
  return cachedKey;
}

export function createBentoRouterEncryptionAdapter(
  env: Record<string, string | undefined> = process.env,
): EncryptionAdapter {
  const key = getBentoRouterEncryptionKey(env);
  return {
    scheme: SCHEME,
    async encrypt(plaintext) {
      const iv = randomBytes(IV_BYTES);
      const cipher = createCipheriv("aes-256-gcm", key, iv);
      const ciphertext = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();
      return `${SCHEME}:${Buffer.concat([iv, ciphertext, tag]).toString("base64")}`;
    },
    async decrypt(stored) {
      const payload = stored.startsWith(`${SCHEME}:`)
        ? stored.slice(SCHEME.length + 1)
        : stored;
      const packed = Buffer.from(payload, "base64");
      if (packed.length < IV_BYTES + TAG_BYTES + 1) {
        throw new Error("Encrypted BentoRouter provider key is malformed.");
      }
      const iv = packed.subarray(0, IV_BYTES);
      const tag = packed.subarray(packed.length - TAG_BYTES);
      const ciphertext = packed.subarray(IV_BYTES, packed.length - TAG_BYTES);
      const decipher = createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag);
      return Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]).toString("utf8");
    },
  };
}
