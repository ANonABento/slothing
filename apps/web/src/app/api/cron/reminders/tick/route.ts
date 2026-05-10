import { NextRequest, NextResponse } from "next/server";
import { nowEpoch } from "@/lib/format/time";
import { fireDueReminders } from "@/lib/reminders/fire-due";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const startedAt = nowEpoch();

  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await fireDueReminders();

    return NextResponse.json({
      ok: true,
      fired: result.fired,
      errors: result.errors,
      durationMs: nowEpoch() - startedAt,
    });
  } catch (error) {
    console.error("Reminder cron tick failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Cron tick failed",
      },
      { status: 500 },
    );
  }
}

function isAuthorizedCronRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV === "test" && !process.env.CRON_SECRET) {
    return true;
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  return request.headers.get("authorization") === `Bearer ${secret}`;
}
