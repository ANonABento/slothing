import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

const CRON_AUTH_HEADER = "authorization";
const BEARER_PREFIX = "Bearer ";

/**
 * Vercel evaluates cron schedules in UTC and sends
 * Authorization: Bearer ${CRON_SECRET} to scheduled requests.
 */
export async function requireCronAuth(
  request: NextRequest,
): Promise<NextResponse | null> {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get(CRON_AUTH_HEADER);

  if (!secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = header?.startsWith(BEARER_PREFIX)
    ? header.slice(BEARER_PREFIX.length)
    : "";

  if (!constantTimeEquals(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

function constantTimeEquals(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}
