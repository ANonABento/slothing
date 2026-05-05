import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig, isNextAuthConfigured } from "@/auth.config";
import { applySecurityHeaders } from "@/lib/security/headers";

const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTE_PATTERNS = [
  /^\/$/, // Marketing landing page
  /^\/sign-in(?:\/.*)?$/,
  /^\/api\/auth(?:\/.*)?$/, // NextAuth handlers
  /^\/api\/webhooks(?:\/.*)?$/,
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

const middleware = isNextAuthConfigured()
  ? auth((request) => {
      const { pathname } = request.nextUrl;
      if (!request.auth && !isPublicPath(pathname)) {
        const signInUrl = new URL("/sign-in", request.nextUrl);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);
        return applySecurityHeaders(NextResponse.redirect(signInUrl), request);
      }
      return applySecurityHeaders(NextResponse.next(), request);
    })
  : (request: NextRequest) => applySecurityHeaders(NextResponse.next(), request);

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
