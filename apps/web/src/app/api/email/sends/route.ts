/**
 * @route GET /api/email/sends
 * @route POST /api/email/sends
 * @description List sent emails or record a sent email
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";
import { createEmailSend, getEmailSends } from "@/lib/db/email-sends";
import { createEmailSendSchema } from "@/lib/constants";
import { requireAuth, isAuthError } from "@/lib/auth";
import { safeTrackActivity } from "@/lib/streak/track";

export const dynamic = "force-dynamic";

function parseIntegerParam(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const sends = getEmailSends(authResult.userId, {
      limit: parseIntegerParam(searchParams.get("limit"), 50),
      offset: parseIntegerParam(searchParams.get("offset"), 0),
      jobId: searchParams.get("jobId") || undefined,
    });

    return NextResponse.json({ sends });
  } catch (error) {
    console.error("Get email sends error:", error);
    return NextResponse.json({ sends: [] });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const rawData = await request.json();
    const parseResult = createEmailSendSchema.safeParse(rawData);

    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    if (parseResult.data.type === "daily_digest") {
      return NextResponse.json(
        { error: "daily_digest is a system email type" },
        { status: 400 },
      );
    }

    const send = createEmailSend(parseResult.data, authResult.userId);
    const { unlocked } =
      send.status === "sent"
        ? await safeTrackActivity(authResult.userId, "email_sent")
        : { unlocked: [] };
    return NextResponse.json({ send, unlocked });
  } catch (error) {
    console.error("Create email send error:", error);
    return NextResponse.json(
      { error: "Failed to record sent email" },
      { status: 500 },
    );
  }
}
