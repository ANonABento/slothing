import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { DEV_AUTH_BYPASS_HEADER, isDevAuthBypassAllowed } from "@/auth.config";
import { routing } from "@/i18n";
import {
  applySecurityHeaders,
  buildContentSecurityPolicy,
  CSP_NONCE_HEADER,
} from "@/lib/security/headers";

const intlMiddleware = createMiddleware(routing);

function createCspNonce(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

function applyRequestHeaderOverrides(
  response: NextResponse,
  requestHeaders: Headers,
): void {
  const overrideHeaderName = "x-middleware-override-headers";
  const overrideResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  overrideResponse.headers.forEach((value, key) => {
    if (key === overrideHeaderName) {
      const existing = response.headers.get(overrideHeaderName);
      response.headers.set(
        overrideHeaderName,
        existing ? `${existing},${value}` : value,
      );
      return;
    }

    if (key.startsWith("x-middleware-request-")) {
      response.headers.set(key, value);
    }
  });
}

export default function middleware(request: NextRequest) {
  const nonce = createCspNonce();
  const cspHeaderValue = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);
  requestHeaders.set("Content-Security-Policy", cspHeaderValue);

  const response = request.nextUrl.pathname.startsWith("/api/")
    ? NextResponse.next()
    : intlMiddleware(request);

  applyRequestHeaderOverrides(response, requestHeaders);

  if (isDevAuthBypassAllowed()) {
    response.headers.set(
      DEV_AUTH_BYPASS_HEADER.name,
      DEV_AUTH_BYPASS_HEADER.value,
    );
  }

  return applySecurityHeaders(response, request, cspHeaderValue);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/(api|trpc)(.*)"],
};
