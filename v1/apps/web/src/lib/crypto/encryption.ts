import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm" as const;
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;
const ENVELOPE_PREFIX = "enc:v1:";

const STATIC_DEV_KEY_SEED =
  "slothing-dev-encryption-key-do-not-use-in-prod-deterministic-seed";

let cachedKey: Buffer | null = null;

export class EncryptionConfigError extends Error {
  readonly code = "encryption_config" as const;
  constructor(message: string) {
    super(message);
    this.name = "EncryptionConfigError";
  }
}

export class EncryptionFormatError extends Error {
  readonly code = "encryption_format" as const;
  constructor(message: string) {
    super(message);
    this.name = "EncryptionFormatError";
  }
}

function deriveDevKey(): Buffer {
  const seed = Buffer.from(STATIC_DEV_KEY_SEED, "utf8");
  const padded = Buffer.alloc(KEY_BYTES);
  seed.copy(padded, 0, 0, Math.min(seed.length, KEY_BYTES));
  return padded;
}

function loadKeyFromEnv(): Buffer {
  const raw = process.env.SLOTHING_ENCRYPTION_KEY;
  if (raw && raw.length > 0) {
    const decoded = Buffer.from(raw, "base64");
    if (decoded.length !== KEY_BYTES) {
      throw new EncryptionConfigError(
        `SLOTHING_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes; got ${decoded.length}. Generate one with: openssl rand -base64 32`,
      );
    }
    return decoded;
  }

  if (process.env.NODE_ENV === "production") {
    throw new EncryptionConfigError(
      "SLOTHING_ENCRYPTION_KEY is required in production. Generate one with: openssl rand -base64 32",
    );
  }

  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "[slothing] SLOTHING_ENCRYPTION_KEY not set; falling back to a deterministic dev key. This is unsafe for any non-local environment.",
    );
  }
  return deriveDevKey();
}

export function getMasterKey(): Buffer {
  if (!cachedKey) {
    cachedKey = loadKeyFromEnv();
  }
  return cachedKey;
}

export function resetMasterKeyCacheForTests(): void {
  cachedKey = null;
}

export function isEncryptedEnvelope(value: string): boolean {
  return typeof value === "string" && value.startsWith(ENVELOPE_PREFIX);
}

export function encryptString(plaintext: string, key: Buffer = getMasterKey()): string {
  if (typeof plaintext !== "string") {
    throw new TypeError("encryptString requires a string");
  }
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const packed = Buffer.concat([iv, ciphertext, tag]).toString("base64");
  return `${ENVELOPE_PREFIX}${packed}`;
}

export function decryptString(envelope: string, key: Buffer = getMasterKey()): string {
  if (!isEncryptedEnvelope(envelope)) {
    throw new EncryptionFormatError(
      "Value is not an encrypted envelope (missing enc:v1: prefix)",
    );
  }
  const packed = Buffer.from(envelope.slice(ENVELOPE_PREFIX.length), "base64");
  if (packed.length < IV_BYTES + TAG_BYTES + 1) {
    throw new EncryptionFormatError("Encrypted envelope is malformed");
  }
  const iv = packed.subarray(0, IV_BYTES);
  const tag = packed.subarray(packed.length - TAG_BYTES);
  const ciphertext = packed.subarray(IV_BYTES, packed.length - TAG_BYTES);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

export function tryDecryptOrPassthrough(
  value: string,
  key: Buffer = getMasterKey(),
): string {
  if (!isEncryptedEnvelope(value)) {
    return value;
  }
  return decryptString(value, key);
}
