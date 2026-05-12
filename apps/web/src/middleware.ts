import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
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
  const overrideResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  overrideResponse.headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
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

  return applySecurityHeaders(response, request, cspHeaderValue);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
