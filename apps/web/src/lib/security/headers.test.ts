import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { applySecurityHeaders, CSP_NONCE_HEADER, __testables } from "./headers";

function makeRequest(
  url: string,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(new URL(url), {
    headers: new Headers(headers),
  });
}

function getDirective(csp: string | null, directive: string): string {
  return (
    csp
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${directive} `)) ?? ""
  );
}

describe("applySecurityHeaders", () => {
  it("sets a Content-Security-Policy that disallows object-src and frame-ancestors", () => {
    const res = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("https://taida.app/dashboard"),
    );
    const csp = res.headers.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("default-src 'self'");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("disallows unsafe-eval in production builds", () => {
    vi.stubEnv("NODE_ENV", "production");
    const csp = __testables.computeCspForTesting("testnonce");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("uses a nonce instead of unsafe-inline for production scripts", () => {
    vi.stubEnv("NODE_ENV", "production");
    const csp = __testables.computeCspForTesting("testnonce");
    const scriptSrc = getDirective(csp, "script-src");
    expect(scriptSrc).toBe("script-src 'self' 'nonce-testnonce'");
    expect(scriptSrc).not.toContain("unsafe-inline");
  });

  it("keeps unsafe-inline and unsafe-eval in development for Next HMR", () => {
    vi.stubEnv("NODE_ENV", "development");
    const csp = __testables.computeCspForTesting();
    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  });

  it("reads the production CSP nonce from the request header", () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("https://taida.app/", { [CSP_NONCE_HEADER]: "testnonce" }),
    );
    const csp = res.headers.get("Content-Security-Policy");
    const scriptSrc = getDirective(csp, "script-src");
    expect(scriptSrc).toBe("script-src 'self' 'nonce-testnonce'");
    expect(scriptSrc).not.toContain("unsafe-inline");
  });

  it("emits HSTS only over HTTPS", () => {
    const httpsRes = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("https://taida.app/"),
    );
    expect(httpsRes.headers.get("Strict-Transport-Security")).toContain(
      "max-age=31536000",
    );

    const httpRes = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("http://localhost:3000/"),
    );
    expect(httpRes.headers.get("Strict-Transport-Security")).toBeNull();
  });

  it("respects x-forwarded-proto for HSTS in proxied environments", () => {
    const res = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("http://internal:3000/", { "x-forwarded-proto": "https" }),
    );
    expect(res.headers.get("Strict-Transport-Security")).toBeTruthy();
  });

  it("locks down clickjacking and MIME sniffing", () => {
    const res = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("https://taida.app/"),
    );
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("disables sensitive Permissions-Policy features by default", () => {
    const res = applySecurityHeaders(
      NextResponse.next(),
      makeRequest("https://taida.app/"),
    );
    const policy = res.headers.get("Permissions-Policy");
    expect(policy).toContain("camera=()");
    expect(policy).toContain("geolocation=()");
    expect(policy).toContain("payment=()");
    // microphone allowed for interview voice mode
    expect(policy).toContain("microphone=(self)");
  });

  it("does not overwrite an existing CSP header", () => {
    const upstream = NextResponse.next();
    upstream.headers.set("Content-Security-Policy", "default-src 'self'");
    const res = applySecurityHeaders(
      upstream,
      makeRequest("https://taida.app/"),
    );
    expect(res.headers.get("Content-Security-Policy")).toBe(
      "default-src 'self'",
    );
  });
});
