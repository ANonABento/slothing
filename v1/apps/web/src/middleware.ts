import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { DEV_AUTH_BYPASS_HEADER, isDevAuthBypassAllowed } from "@/auth.config";
import { locales, routing } from "@/i18n";
import {
  applySecurityHeaders,
  buildContentSecurityPolicy,
  CSP_NONCE_HEADER,
} from "@/lib/security/headers";
import {
  CANONICAL_ROUTE_PATH_HEADER,
  getAlternateLinksHeader,
} from "@/lib/seo";

const intlMiddleware = createMiddleware(routing);

function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto ?? request.nextUrl.protocol.replace(":", "")}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function getCanonicalRoutePath(pathname: string) {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }

  return pathname || "/";
}

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
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const canonicalRoutePath = isApiRoute
    ? undefined
    : getCanonicalRoutePath(request.nextUrl.pathname);
  const requestHeaders = new Headers();
  requestHeaders.set(CSP_NONCE_HEADER, nonce);
  if (canonicalRoutePath) {
    requestHeaders.set(CANONICAL_ROUTE_PATH_HEADER, canonicalRoutePath);
  }

  const response = isApiRoute ? NextResponse.next() : intlMiddleware(request);

  if (canonicalRoutePath) {
    response.headers.set(
      "Link",
      getAlternateLinksHeader(canonicalRoutePath, getRequestOrigin(request)),
    );
  }

  // Header overrides drop original request headers in Next.js 14 — only apply
  // them on HTML routes that need the CSP nonce. API routes must keep their
  // original headers (X-Extension-Token, Authorization, Cookie, …).
  if (!isApiRoute) {
    applyRequestHeaderOverrides(response, requestHeaders);
  }

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
