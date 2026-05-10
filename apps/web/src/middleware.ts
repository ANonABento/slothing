import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n";
import { applySecurityHeaders } from "@/lib/security/headers";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = request.nextUrl.pathname.startsWith("/api/")
    ? NextResponse.next()
    : intlMiddleware(request);

  return applySecurityHeaders(response, request);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
