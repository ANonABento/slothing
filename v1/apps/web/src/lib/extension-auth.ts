import { nowDate, nowIso, parseToDate } from "@/lib/format/time";
// Extension authentication utilities
import { NextRequest, NextResponse } from "next/server";
import {
  deleteExtensionSession,
  getExtensionSessionByToken,
  touchExtensionSession,
} from "@/lib/db/extension-sessions";
import {
  calculateQuestionSimilarity,
  normalizeQuestion,
} from "@/lib/answers/answer-bank";

export type ExtensionAuthResult =
  | { success: true; userId: string }
  | { success: false; response: NextResponse };

/**
 * Validate extension token and return user ID
 */
export async function requireExtensionAuth(
  request: NextRequest,
): Promise<ExtensionAuthResult> {
  const token = request.headers.get("X-Extension-Token");

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "No token provided" },
        { status: 401 },
      ),
    };
  }

  try {
    const session = await getExtensionSessionByToken(token);

    if (!session) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Invalid token" },
          { status: 401 },
        ),
      };
    }

    // Check expiry
    const expiresAt = parseToDate(session.expires_at)!;
    if (expiresAt < nowDate()) {
      await deleteExtensionSession(session.id, session.user_id);
      return {
        success: false,
        response: NextResponse.json(
          { error: "Token expired" },
          { status: 401 },
        ),
      };
    }

    // Update last used
    await touchExtensionSession(session.id, session.user_id, nowIso());

    return {
      success: true,
      userId: session.user_id,
    };
  } catch (error) {
    console.error("Extension auth error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 },
      ),
    };
  }
}

export { normalizeQuestion };

export const calculateSimilarity = calculateQuestionSimilarity;
