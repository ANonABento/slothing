import { createHmac, timingSafeEqual } from "node:crypto";

const CALENDAR_FEED_TOKEN_VERSION = "v1";

function getCalendarFeedSecret(): string {
  const secret = process.env.CALENDAR_FEED_SECRET || process.env.CLERK_SECRET_KEY;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "local-calendar-feed-secret";
  }

  throw new Error("CALENDAR_FEED_SECRET is required in production");
}

function signTokenPayload(userId: string): string {
  return createHmac("sha256", getCalendarFeedSecret())
    .update(`${CALENDAR_FEED_TOKEN_VERSION}:${userId}`)
    .digest("base64url");
}

export function createCalendarFeedToken(userId: string): string {
  const encodedUserId = Buffer.from(userId, "utf8").toString("base64url");
  const signature = signTokenPayload(userId);

  return `${CALENDAR_FEED_TOKEN_VERSION}.${encodedUserId}.${signature}`;
}

export function verifyCalendarFeedToken(token: string): string | null {
  const [version, encodedUserId, signature] = token.split(".");

  if (!version || !encodedUserId || !signature || version !== CALENDAR_FEED_TOKEN_VERSION) {
    return null;
  }

  let userId: string;
  try {
    userId = Buffer.from(encodedUserId, "base64url").toString("utf8");
  } catch {
    return null;
  }

  const expectedSignature = signTokenPayload(userId);
  const providedSignature = Buffer.from(signature, "utf8");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf8");

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return null;
  }

  return timingSafeEqual(providedSignature, expectedSignatureBuffer) ? userId : null;
}
