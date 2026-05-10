import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { nowEpoch } from "@/lib/format/time";
import { fireDueReminders } from "@/lib/reminders/fire-due";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = await requireCronAuth(request);
  if (authError) return authError;

  const startedAt = nowEpoch();

  try {
    const result = await fireDueReminders();

    return NextResponse.json({
      ok: true,
      cron: "reminders.tick",
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
