import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { runPersonalFactsMigration } from "@/lib/db/learned-answers-migration";

export const dynamic = "force-dynamic";

export async function POST() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const result = await runPersonalFactsMigration(authResult.userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Personal facts migration error:", error);
    return NextResponse.json(
      { error: "Failed to migrate personal facts" },
      { status: 500 },
    );
  }
}
