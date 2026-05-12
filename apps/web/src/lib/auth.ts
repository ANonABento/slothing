import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, isDevAuthBypassAllowed, isNextAuthConfigured } from "@/auth";
import { requireExtensionAuth } from "@/lib/extension-auth";

export interface AuthResult {
  userId: string;
}

export interface AuthError {
  error: string;
  status: number;
}

const LOCAL_DEV_USER = "default";
const DEV_AUTH_WARNING =
  '[auth] DEV BYPASS: serving requests as userId="default"';

let hasLoggedDevAuthBypass = false;

function warnDevAuthBypassOnce() {
  if (hasLoggedDevAuthBypass) return;
  hasLoggedDevAuthBypass = true;
  console.warn(DEV_AUTH_WARNING);
}

function getLocalDevUserId(): string {
  warnDevAuthBypassOnce();
  try {
    return headers().get("x-get-me-job-e2e-user") || LOCAL_DEV_USER;
  } catch {
    return LOCAL_DEV_USER;
  }
}

/**
 * Get the current user ID from NextAuth.
 * Returns the userId if authenticated, null if not.
 * Falls back to the local dev user only when the explicit dev bypass is enabled.
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (!isNextAuthConfigured()) {
    return isDevAuthBypassAllowed() ? getLocalDevUserId() : null;
  }
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Require authentication for an API route.
 * Returns the userId if authenticated, or an error response if not.
 * Falls back to the local dev user only when the explicit dev bypass is enabled.
 */
export async function requireAuth(): Promise<AuthResult | NextResponse> {
  if (!isNextAuthConfigured()) {
    if (isDevAuthBypassAllowed()) {
      return { userId: getLocalDevUserId() };
    }

    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 },
    );
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { userId };
}

/**
 * Require a user for routes that may be called by either the web app or the
 * browser extension. When X-Extension-Token is present, that token wins even if
 * a browser session also exists, because extension requests represent the
 * connected extension account.
 */
export async function requireUserAuth(
  request: NextRequest,
): Promise<AuthResult | NextResponse> {
  if (request.headers.get("X-Extension-Token")) {
    const extensionAuth = requireExtensionAuth(request);
    return extensionAuth.success
      ? { userId: extensionAuth.userId }
      : extensionAuth.response;
  }

  return requireAuth();
}

/**
 * Type guard to check if the result is an error response.
 */
export function isAuthError(
  result: AuthResult | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}

export function __resetDevAuthBypassWarningForTests() {
  hasLoggedDevAuthBypass = false;
}
