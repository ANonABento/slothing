/**
 * @route DELETE /api/agent/tokens/[id]   Revoke a service token
 * @description Hard-revokes a long-lived service token. Destructive Pattern A
 *   (confirm dialog) in the UI.
 * @auth requireAuth (NextAuth + local-dev fallback)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { deleteServiceToken } from "@/lib/db/service-tokens";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const deleted = await deleteServiceToken(params.id, authResult.userId);
    if (!deleted) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Revoke service token error:", error);
    return NextResponse.json(
      { error: "Failed to revoke token" },
      { status: 500 },
    );
  }
}
