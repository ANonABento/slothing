import { NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  getPromptVariantStats,
  seedDefaultPromptVariant,
} from "@/lib/db/prompt-variants";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  await seedDefaultPromptVariant(authResult.userId);
  const stats = await getPromptVariantStats(authResult.userId);
  return NextResponse.json({ stats });
}
