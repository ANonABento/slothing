import { NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getStreakState } from "@/lib/db/streak";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    return NextResponse.json({
      streak: getStreakState(authResult.userId),
    });
  } catch (error) {
    console.error("Get streak error:", error);
    return NextResponse.json(
      { error: "Failed to get streak state" },
      { status: 500 },
    );
  }
}
