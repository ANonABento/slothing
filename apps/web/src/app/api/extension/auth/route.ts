import { nowEpoch, toIso } from "@/lib/format/time";
/**
 * @route POST /api/extension/auth
 * @route DELETE /api/extension/auth
 * @description Create a new extension session token (POST) or revoke an existing token (DELETE)
 * @auth requireAuth (NextAuth in prod, local-dev fallback when NextAuth env vars absent)
 * @response ExtensionAuthResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  createExtensionSession,
  deleteExtensionSessionByToken,
  deleteExtensionSessionsForUser,
  ensureExtensionSessionsColumnsAsync,
  EXTENSION_TOKEN_TTL_LOCALSTORAGE_MS,
  EXTENSION_TOKEN_TTL_RUNTIME_MS,
} from "@/lib/db/extension-sessions";
import { trackActivationEvent } from "@/lib/db/product-analytics";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

// POST - Create extension session token
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;
    const { userId } = authResult;

    const body = await request.json().catch(() => ({}));
    const { deviceInfo, userAgent, transport } = body as {
      deviceInfo?: string;
      userAgent?: string;
      transport?: "runtime" | "localstorage";
    };

    await ensureExtensionSessionsColumnsAsync();

    // Generate a secure token
    const token = `${randomUUID()}-${randomUUID()}`;
    const ttlMs =
      transport === "localstorage"
        ? EXTENSION_TOKEN_TTL_LOCALSTORAGE_MS
        : EXTENSION_TOKEN_TTL_RUNTIME_MS;
    const expiresAt = new Date(nowEpoch() + ttlMs);

    const id = randomUUID();

    await createExtensionSession({
      id,
      userId,
      token,
      deviceInfo,
      userAgent,
      expiresAt: toIso(expiresAt),
    });
    try {
      await trackActivationEvent({
        event: "extension_connected",
        userId,
        source: "api/extension/auth",
        metadata: { transport: transport ?? "runtime" },
      });
    } catch (analyticsError) {
      console.error("Extension analytics failed:", analyticsError);
    }

    return NextResponse.json({
      token,
      expiresAt: toIso(expiresAt),
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
      await deleteExtensionSessionByToken(token, userId);
    } else {
      await deleteExtensionSessionsForUser(userId);
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
