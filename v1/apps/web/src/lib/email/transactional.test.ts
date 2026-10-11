import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isTransactionalEmailConfigured,
  sendTransactionalEmail,
} from "./transactional";

describe("transactional email sender", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = vi.fn() as typeof fetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requires a Resend key and from address", () => {
    expect(isTransactionalEmailConfigured({} as NodeJS.ProcessEnv)).toBe(false);
    expect(
      isTransactionalEmailConfigured({
        NODE_ENV: "test",
        RESEND_API_KEY: "key",
      }),
    ).toBe(false);
    expect(
      isTransactionalEmailConfigured({
        NODE_ENV: "test",
        RESEND_API_KEY: "key",
        EMAIL_FROM: "Slothing <noreply@example.com>",
      }),
    ).toBe(true);
  });

  it("skips when email is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;

    await expect(
      sendTransactionalEmail({
        to: "ada@example.com",
        subject: "Hello",
        html: "<p>Hello</p>",
      }),
    ).resolves.toEqual({ ok: true, skipped: true });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("sends a Resend request with optional text and tags", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "Slothing <noreply@example.com>";
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      status: 202,
    } as Response);

    await expect(
      sendTransactionalEmail({
        to: "ada@example.com",
        subject: "Hello",
        html: "<p>Hello</p>",
        text: "Hello",
        tags: [{ name: "kind", value: "welcome-series" }],
      }),
    ).resolves.toEqual({ ok: true, status: 202 });

    const [, init] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(init).toMatchObject({
      method: "POST",
      headers: expect.objectContaining({
        Authorization: "Bearer resend-key",
        "Content-Type": "application/json",
      }),
    });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      from: "Slothing <noreply@example.com>",
      to: "ada@example.com",
      subject: "Hello",
      text: "Hello",
      tags: [{ name: "kind", value: "welcome-series" }],
    });
  });

  it("includes daily digest tags when provided", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "jobs@example.com";
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      status: 202,
    } as Response);

    await sendTransactionalEmail({
      to: "ada@example.com",
      subject: "Hello",
      html: "<p>Hello</p>",
      text: "Hello",
      tags: [{ name: "type", value: "daily_digest" }],
    });

    const [, init] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({
      from: "jobs@example.com",
      tags: [{ name: "type", value: "daily_digest" }],
    });
  });

  it("returns non-2xx failures", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "Slothing <noreply@example.com>";
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "rate limited",
    } as Response);

    await expect(
      sendTransactionalEmail({
        to: "ada@example.com",
        subject: "Hello",
        html: "<p>Hello</p>",
      }),
    ).resolves.toEqual({ ok: false, status: 429, error: "rate limited" });
  });
});
