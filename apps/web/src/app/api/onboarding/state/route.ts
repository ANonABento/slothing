import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { getOnboardingState } from "@/lib/db/onboarding";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const state = await getOnboardingState(auth.userId);
  return NextResponse.json(state);
}
