import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getBentoRouterClient } from "@/lib/llm/bentorouter-client";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const patch = await request.json();
    const client = await getBentoRouterClient();
    const task = await client
      .api(authResult.userId)
      .updateTaskPolicy(decodeURIComponent(params.taskId), patch);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update policy.",
      },
      { status: 400 },
    );
  }
}
