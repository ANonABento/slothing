import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, routing } from "@/i18n";
import { applySecurityHeaders } from "@/lib/security/headers";
import { getAlternateLinksHeader } from "@/lib/seo";

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

export default function middleware(request: NextRequest) {
  const response = request.nextUrl.pathname.startsWith("/api/")
    ? NextResponse.next()
    : intlMiddleware(request);

  if (!request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set(
      "Link",
      getAlternateLinksHeader(
        getCanonicalRoutePath(request.nextUrl.pathname),
        getRequestOrigin(request),
      ),
    );
  }

  return applySecurityHeaders(response, request);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
