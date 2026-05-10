import { createHmac, timingSafeEqual } from "node:crypto";

const WELCOME_SERIES_TOKEN_VERSION = "v1";
const WELCOME_SERIES_TOKEN_SCOPE = "welcome-unsubscribe";

function getWelcomeSeriesSecret(): string {
  const secret = process.env.WELCOME_EMAIL_SECRET || process.env.NEXTAUTH_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV !== "production") {
    return "local-welcome-secret";
  }

  throw new Error("WELCOME_EMAIL_SECRET is required in production");
}

function signTokenPayload(userId: string): string {
  return createHmac("sha256", getWelcomeSeriesSecret())
    .update(
      `${WELCOME_SERIES_TOKEN_VERSION}:${WELCOME_SERIES_TOKEN_SCOPE}:${userId}`,
    )
    .digest("base64url");
}

export function createUnsubscribeToken(userId: string): string {
  const encodedUserId = Buffer.from(userId, "utf8").toString("base64url");
  const signature = signTokenPayload(userId);

  return `${WELCOME_SERIES_TOKEN_VERSION}.${encodedUserId}.${signature}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const [version, encodedUserId, signature] = token.split(".");

  if (
    !version ||
    !encodedUserId ||
    !signature ||
    version !== WELCOME_SERIES_TOKEN_VERSION
  ) {
    return null;
  }

  let userId: string;
  try {
    userId = Buffer.from(encodedUserId, "base64url").toString("utf8");
  } catch {
    return null;
  }

  if (!userId) return null;

  const expectedSignature = signTokenPayload(userId);
  const providedSignature = Buffer.from(signature, "utf8");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf8");

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return null;
  }

  return timingSafeEqual(providedSignature, expectedSignatureBuffer)
    ? userId
    : null;
}
