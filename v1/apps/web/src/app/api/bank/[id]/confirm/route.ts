import { NextRequest, NextResponse } from "next/server";

import { requireAuth, isAuthError } from "@/lib/auth";
import { nowIso } from "@/lib/format/time";
import { setBankEntryStatus } from "@/lib/db/profile-bank";

interface ConfirmParams {
  params: { id: string };
}

/**
 * @route POST /api/bank/[id]/confirm
 * @description Confirm an AI-drafted bank entry into a verified fact (AI Bank Authoring
 *   spec §2). Verifying sets `verified_at`. Until confirmed, tailoring never treats the
 *   entry as fact. Scoped by user_id — a missing/foreign id 404s.
 * @auth Required
 */
export async function POST(_request: NextRequest, { params }: ConfirmParams) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const ok = setBankEntryStatus(
    params.id,
    authResult.userId,
    "verified",
    nowIso(),
  );
  if (!ok) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    id: params.id,
    status: "verified",
  });
}
