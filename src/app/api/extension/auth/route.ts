/**
 * @route POST /api/extension/auth
 * @route DELETE /api/extension/auth
 * @description Create a new extension session token (POST) or revoke an existing token (DELETE)
 * @auth requireAuth (NextAuth in prod, local-dev fallback when NextAuth env vars absent)
 * @response ExtensionAuthResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import db from "@/lib/db/legacy";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// POST - Create extension session token
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;
    const { userId } = authResult;

    const body = await request.json().catch(() => ({}));
    const { deviceInfo } = body as { deviceInfo?: string };

    // Generate a secure token
    const token = `${randomUUID()}-${randomUUID()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const id = randomUUID();

    // Insert new session
    db.prepare(
      `
      INSERT INTO extension_sessions (id, user_id, token, device_info, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    ).run(id, userId, token, deviceInfo || null, expiresAt.toISOString());

    return NextResponse.json({
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Extension auth error:", error);
    return NextResponse.json(
      { error: "Failed to create extension session" },
      { status: 500 },
    );
  }
}

// DELETE - Revoke extension session
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;
    const { userId } = authResult;

    const token = request.headers.get("X-Extension-Token");
    if (token) {
      // Revoke specific token
      db.prepare(
        `DELETE FROM extension_sessions WHERE token = ? AND user_id = ?`,
      ).run(token, userId);
    } else {
      // Revoke all tokens for user
      db.prepare(`DELETE FROM extension_sessions WHERE user_id = ?`).run(
        userId,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Extension revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke session" },
      { status: 500 },
    );
  }
}
