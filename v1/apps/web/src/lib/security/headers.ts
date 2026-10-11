import type { NextRequest, NextResponse } from "next/server";

/**
 * Build a Content-Security-Policy header value.
 *
 * Notes on the chosen directives:
 * - `script-src` uses a per-request nonce in production so Next.js bootstrap
 *   scripts and intentionally-inline app scripts can run without allowing
 *   arbitrary inline script execution. `'unsafe-inline'` and `'unsafe-eval'`
 *   are permitted in dev only — Next dev mode needs them for hot module
 *   replacement and reliable local hydration.
 * - `style-src` allows `'unsafe-inline'` for Tailwind/CSS-in-JS runtime styles.
 * - `connect-src` includes Google (NextAuth callbacks) and the configured LLM
 *   providers — outbound fetches happen server-side, not from the browser, so
 *   we keep the list conservative.
 * - `frame-ancestors 'none'` is enforced by both CSP and X-Frame-Options.
 * - `object-src 'none'` blocks Flash/legacy plugin XSS vectors.
 */
export const CSP_NONCE_HEADER = "x-csp-nonce";

export function buildContentSecurityPolicy(nonce?: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  const scriptSrc = isProduction
    ? ["'self'", ...(nonce ? [`'nonce-${nonce}'`] : [])]
    : ["'self'", "'unsafe-inline'", "'unsafe-eval'"];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https:",
      "https://lh3.googleusercontent.com",
    ],
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      "https://accounts.google.com",
      "https://oauth2.googleapis.com",
      "https://www.googleapis.com",
    ],
    "frame-src": ["'self'", "https://accounts.google.com"],
    "frame-ancestors": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "worker-src": ["'self'", "blob:"],
  };

  return Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");
}

const PERMISSIONS_POLICY =
  "camera=(), microphone=(self), geolocation=(), payment=(), usb=()";

/**
 * Apply security headers to an outgoing response. Called from middleware so
 * every request — page or API — picks up the same defenses.
 *
 * Headers applied:
 * - Content-Security-Policy: limits where scripts/styles/connections can come
 *   from (XSS / data-exfiltration defense).
 * - Strict-Transport-Security: forces HTTPS for one year, preload-eligible.
 *   Only emitted when the request is HTTPS so dev (http://localhost) stays
 *   functional.
 * - X-Frame-Options: legacy clickjacking defense; CSP frame-ancestors covers
 *   modern browsers.
 * - X-Content-Type-Options: blocks MIME-sniffing-based XSS.
 * - Referrer-Policy: leaks no path or query data to cross-origin destinations.
 * - Permissions-Policy: disables camera/geolocation/payment/usb by default.
 *   Microphone is allowed for the interview prep voice mode.
 * - X-DNS-Prefetch-Control: opt-in DNS prefetching.
 */
export function applySecurityHeaders(
  response: NextResponse,
  request: NextRequest,
  cspHeaderValue = buildContentSecurityPolicy(
    request.headers.get(CSP_NONCE_HEADER) ?? undefined,
  ),
): NextResponse {
  const headers = response.headers;

  if (!headers.has("Content-Security-Policy")) {
    headers.set("Content-Security-Policy", cspHeaderValue);
  }
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", PERMISSIONS_POLICY);
  headers.set("X-DNS-Prefetch-Control", "on");

  // Only emit HSTS over HTTPS so local http://localhost dev still works.
  const proto =
    request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol;
  if (proto.startsWith("https")) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  return response;
}

// Exported for unit tests that don't have access to a real NextResponse.
export const __testables = {
  computeCspForTesting: buildContentSecurityPolicy,
};
