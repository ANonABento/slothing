/**
 * @route GET /api/agent/settings
 * @route PUT /api/agent/settings
 * @description Read / update the signed-in user's agent autonomy policy from the
 *   settings UI.
 * @auth requireAuth (NextAuth in prod, local-dev fallback otherwise)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getAgentSettings, saveAgentSettings } from "@/lib/db/agent-settings";
import { agentPolicyUpdateSchema } from "@/lib/agent/policy";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const policy = await getAgentSettings(authResult.userId);
    return NextResponse.json({ policy });
  } catch (error) {
    console.error("Agent settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = agentPolicyUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const policy = await saveAgentSettings(authResult.userId, parsed.data);
    return NextResponse.json({ policy });
  } catch (error) {
    console.error("Agent settings save error:", error);
    return NextResponse.json(
      { error: "Failed to save agent settings" },
      { status: 500 },
    );
  }
}
