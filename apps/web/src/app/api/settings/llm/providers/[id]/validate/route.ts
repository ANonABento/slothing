import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getBentoRouterClient } from "@/lib/llm/bentorouter-client";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  _context: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const body = await request.json();
  const client = await getBentoRouterClient();
  const result = await client.api(authResult.userId).validateProvider({
    type: body.type,
    apiKey: body.apiKey,
    baseUrl: body.baseUrl || undefined,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
