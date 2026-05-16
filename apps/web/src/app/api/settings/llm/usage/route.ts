import { NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getBentoRouterClient } from "@/lib/llm/bentorouter-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const client = await getBentoRouterClient();
  const rows = await client
    .api(authResult.userId)
    .usageReport({ userId: authResult.userId }, "task");
  return NextResponse.json({ rows });
}
