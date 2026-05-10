import { NextRequest, NextResponse } from "next/server";

const CRON_AUTH_HEADER = "authorization";

let warnedAboutMissingSecret = false;

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
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "CRON_SECRET not configured" },
        { status: 500 },
      );
    }

    if (!warnedAboutMissingSecret) {
      console.warn(
        "[cron-auth] CRON_SECRET unset; allowing request in non-production env",
      );
      warnedAboutMissingSecret = true;
    }

    return null;
  }

  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
