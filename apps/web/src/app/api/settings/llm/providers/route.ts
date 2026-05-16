import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getBentoRouterClient } from "@/lib/llm/bentorouter-client";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const client = await getBentoRouterClient();
  const api = client.api(authResult.userId);
  const [providers, tasks, models] = await Promise.all([
    api.listConfiguredProviders(authResult.userId),
    api.listTasks("slothing"),
    api.listModels(),
  ]);

  return NextResponse.json({ providers, tasks, models });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const client = await getBentoRouterClient();
    const provider = await client.api(authResult.userId).addConfiguredProvider({
      type: body.type,
      displayName: body.displayName,
      apiKey: body.apiKey,
      baseUrl: body.baseUrl || undefined,
      defaultModel: body.defaultModel || undefined,
      userId: authResult.userId,
    });

    return NextResponse.json({ provider }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to add provider.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    if (typeof body.id !== "string" || !body.id) {
      return NextResponse.json(
        { error: "Provider id is required." },
        { status: 400 },
      );
    }
    const client = await getBentoRouterClient();
    await client
      .api(authResult.userId)
      .removeConfiguredProvider(authResult.userId, body.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to remove provider.",
      },
      { status: 400 },
    );
  }
}
