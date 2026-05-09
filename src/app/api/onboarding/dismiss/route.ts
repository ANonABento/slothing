import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { nowIso } from "@/lib/format/time";
import {
  getOnboardingState,
  setOnboardingDismissedAt,
} from "@/lib/db/onboarding";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const state = await getOnboardingState(auth.userId);
  return NextResponse.json(state);
}

export async function POST() {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  // Future restore hook: call setOnboardingDismissedAt(auth.userId, null).
  const state = await setOnboardingDismissedAt(auth.userId, nowIso());
  return NextResponse.json(state);
}
