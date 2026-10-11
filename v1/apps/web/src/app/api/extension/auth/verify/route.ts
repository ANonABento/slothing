import { nowDate, nowIso, parseToDate } from "@/lib/format/time";
/**
 * @route GET /api/extension/auth/verify
 * @description Verify an extension authentication token
 * @auth Token header
 * @response ExtensionAuthVerifyResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import {
  deleteExtensionSession,
  getExtensionSessionByToken,
  touchExtensionSession,
} from "@/lib/db/extension-sessions";

export const dynamic = "force-dynamic";

// GET - Verify extension token
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("X-Extension-Token");
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const session = await getExtensionSessionByToken(token);

    if (!session) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check expiry
    const expiresAt = parseToDate(session.expires_at)!;
    if (expiresAt < nowDate()) {
      await deleteExtensionSession(session.id, session.user_id);
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    await touchExtensionSession(session.id, session.user_id, nowIso());

    return NextResponse.json({
      valid: true,
      userId: session.user_id,
      expiresAt: session.expires_at,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
