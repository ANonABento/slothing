import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { runGmailStatusDetectionForEnabledUsers } from "@/lib/email/gmail-status-detect";
import { nowEpoch } from "@/lib/format/time";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authError = await requireCronAuth(request);
  if (authError) return authError;

  const startedAt = nowEpoch();
  const result = await runGmailStatusDetectionForEnabledUsers();

  return NextResponse.json({
    ok: result.errors === 0,
    cron: "gmail.status-detect",
    processed: result.processed,
    scanned: result.scanned,
    matched: result.matched,
    updated: result.updated,
    skipped: result.skipped,
    errors: result.errors,
    durationMs: nowEpoch() - startedAt,
  });
}
