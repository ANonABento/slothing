import { NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getBentoRouterClient } from "@/lib/llm/bentorouter-client";

export const dynamic = "force-dynamic";

/**
 * Lightweight endpoint to check if LLM is configured.
 * Used by sidebar status indicator — returns only boolean + provider count.
 */
export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const client = await getBentoRouterClient();
    const providers = await client
      .api(authResult.userId)
      .listConfiguredProviders(authResult.userId);
    const configured = providers.length > 0;

    return NextResponse.json({
      configured,
      provider: configured ? "bentorouter" : null,
      providerCount: providers.length,
    });
  } catch (error) {
    console.error("LLM status check error:", error);
    return NextResponse.json({ configured: false, provider: null });
  }
}
