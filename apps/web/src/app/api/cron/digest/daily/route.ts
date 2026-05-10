import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { runDailyDigest } from "@/lib/digest/daily";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = await requireCronAuth(request);
  if (authError) return authError;

  const result = await runDailyDigest();

  return NextResponse.json({
    ok: result.ok,
    cron: "digest.daily",
    sent: result.sent,
    skipped: result.skipped,
    errors: result.errors,
    duration_ms: result.duration_ms,
  });
}
