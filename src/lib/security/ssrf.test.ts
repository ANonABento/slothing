import { describe, expect, it } from "vitest";
import {
  assertSafeOutboundUrl,
  isBlockedIPv4,
  SsrfBlockedError,
} from "./ssrf";

describe("isBlockedIPv4", () => {
  it("blocks private and reserved ranges", () => {
    expect(isBlockedIPv4("10.0.0.1")).toBe(true);
    expect(isBlockedIPv4("172.16.5.5")).toBe(true);
    expect(isBlockedIPv4("192.168.1.1")).toBe(true);
    expect(isBlockedIPv4("127.0.0.1")).toBe(true);
    expect(isBlockedIPv4("169.254.169.254")).toBe(true); // AWS metadata
    expect(isBlockedIPv4("0.0.0.1")).toBe(true);
    expect(isBlockedIPv4("224.1.1.1")).toBe(true);
  });

  it("permits public IPs", () => {
    expect(isBlockedIPv4("8.8.8.8")).toBe(false);
    expect(isBlockedIPv4("1.1.1.1")).toBe(false);
    expect(isBlockedIPv4("142.250.190.78")).toBe(false);
  });
});

describe("assertSafeOutboundUrl", () => {
  it("rejects malformed URLs", async () => {
    await expect(assertSafeOutboundUrl("not a url")).rejects.toThrow(
      SsrfBlockedError,
    );
  });

  it("rejects non-http(s) schemes", async () => {
    await expect(assertSafeOutboundUrl("file:///etc/passwd")).rejects.toThrow(
      SsrfBlockedError,
    );
    await expect(
      assertSafeOutboundUrl("javascript:alert(1)"),
    ).rejects.toThrow(SsrfBlockedError);
    await expect(
      assertSafeOutboundUrl("gopher://example.com/"),
    ).rejects.toThrow(SsrfBlockedError);
  });

  it("rejects loopback / .local hostnames before DNS lookup", async () => {
    await expect(
      assertSafeOutboundUrl("http://localhost:8080/admin"),
    ).rejects.toThrow(SsrfBlockedError);
    await expect(
      assertSafeOutboundUrl("http://router.local/"),
    ).rejects.toThrow(SsrfBlockedError);
  });

  it("rejects IP literals in private ranges", async () => {
    await expect(
      assertSafeOutboundUrl("http://127.0.0.1/admin"),
    ).rejects.toThrow(SsrfBlockedError);
    await expect(
      assertSafeOutboundUrl("http://169.254.169.254/latest/meta-data/"),
    ).rejects.toThrow(SsrfBlockedError);
    await expect(
      assertSafeOutboundUrl("http://10.0.0.5/"),
    ).rejects.toThrow(SsrfBlockedError);
  });

  it("rejects public hostnames that DNS-resolve to private IPs (DNS rebinding)", async () => {
    await expect(
      assertSafeOutboundUrl("https://evil.example.com/", {
        dnsLookup: async () => "127.0.0.1",
      }),
    ).rejects.toThrow(SsrfBlockedError);

    await expect(
      assertSafeOutboundUrl("https://evil.example.com/", {
        dnsLookup: async () => "169.254.169.254",
      }),
    ).rejects.toThrow(/private\/reserved IP/);
  });

  it("permits public hostnames that DNS-resolve to public IPs", async () => {
    const result = await assertSafeOutboundUrl(
      "https://www.linkedin.com/jobs/view/123",
      {
        dnsLookup: async () => "108.174.10.10",
      },
    );
    expect(result.hostname).toBe("www.linkedin.com");
  });

  it("enforces an allowlist when provided", async () => {
    await expect(
      assertSafeOutboundUrl("https://random.example.com/", {
        allowedHosts: ["linkedin.com", "indeed.com"],
        dnsLookup: async () => "8.8.8.8",
      }),
    ).rejects.toThrow(/not on the allow list/);

    const ok = await assertSafeOutboundUrl(
      "https://www.linkedin.com/jobs/view/1",
      {
        allowedHosts: ["linkedin.com"],
        dnsLookup: async () => "8.8.8.8",
      },
    );
    expect(ok.hostname).toBe("www.linkedin.com");
  });
});
