import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import db from "@/lib/db/legacy";
import { nowEpoch } from "@/lib/format/time";
import { ensureWelcomeSeriesSchema } from "@/lib/welcome-series/state";
import { processWelcomeSeriesForUser } from "@/lib/welcome-series/process";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface UserIdRow {
  id: string;
}

export async function GET(request: NextRequest) {
  const authError = await requireCronAuth(request);
  if (authError) return authError;

  const startedAt = nowEpoch();

  try {
    ensureWelcomeSeriesSchema();

    const users = db
      .prepare("SELECT id FROM `user` WHERE email IS NOT NULL LIMIT 200")
      .all() as UserIdRow[];

    let sent = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      const result = await processWelcomeSeriesForUser(user.id);
      for (const step of result.results) {
        if (step.action === "sent") sent += 1;
        if (step.action === "skipped" || step.action === "already-complete") {
          skipped += 1;
        }
        if (step.action === "error") errors += 1;
      }
    }

    return NextResponse.json({
      ok: true,
      cron: "follow-ups",
      processed: users.length,
      sent,
      skipped,
      errors,
      durationMs: nowEpoch() - startedAt,
    });
  } catch (error) {
    console.error("Welcome series cron failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Welcome series cron failed",
      },
      { status: 500 },
    );
  }
}
