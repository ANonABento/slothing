import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_VERSION = "v1";
const TOKEN_TOPIC = "daily-digest";
let warnedAboutDevSecret = false;

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXTAUTH_SECRET is required for digest unsubscribe tokens",
    );
  }

  if (!warnedAboutDevSecret) {
    console.warn(
      "[digest] NEXTAUTH_SECRET unset; using development unsubscribe token secret",
    );
    warnedAboutDevSecret = true;
  }

  return "development-digest-unsubscribe-secret";
}

function encode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function signDigestUnsubscribeToken(userId: string): string {
  const payload = `${userId}:${TOKEN_TOPIC}:${TOKEN_VERSION}`;
  return `${encode(payload)}.${signPayload(payload)}`;
}

export function verifyDigestUnsubscribeToken(
  token: string,
): { valid: true; userId: string } | { valid: false } {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return { valid: false };
  }

  try {
    const payload = decode(encodedPayload);
    const expected = signPayload(payload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return { valid: false };
    }

    const [userId, topic, version] = payload.split(":");
    if (!userId || topic !== TOKEN_TOPIC || version !== TOKEN_VERSION) {
      return { valid: false };
    }

    return { valid: true, userId };
  } catch {
    return { valid: false };
  }
}
