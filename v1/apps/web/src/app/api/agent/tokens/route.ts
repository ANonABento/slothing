/**
 * @route GET  /api/agent/tokens   List the user's service tokens (metadata only)
 * @route POST /api/agent/tokens   Mint a new service token (returns the secret ONCE)
 * @description Long-lived tokens for headless agents / the hosted runner.
 * @auth requireAuth (NextAuth + local-dev fallback)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { createServiceToken, listServiceTokens } from "@/lib/db/service-tokens";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const tokens = await listServiceTokens(authResult.userId);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("List service tokens error:", error);
    return NextResponse.json(
      { error: "Failed to list service tokens" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  let label = "";
  try {
    const body = (await request.json()) as { label?: unknown };
    if (typeof body.label === "string") label = body.label.slice(0, 120).trim();
  } catch {
    // Empty body is fine — label is optional.
  }

  try {
    const token = await createServiceToken(authResult.userId, label);
    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error("Create service token error:", error);
    return NextResponse.json(
      { error: "Failed to create service token" },
      { status: 500 },
    );
  }
}
