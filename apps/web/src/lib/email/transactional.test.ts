import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isTransactionalEmailConfigured,
  sendTransactionalEmail,
} from "./transactional";

const originalEnv = { ...process.env };

describe("sendTransactionalEmail", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "jobs@example.com";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = { ...originalEnv };
  });

  it("detects required Resend config", () => {
    expect(isTransactionalEmailConfigured()).toBe(true);
    delete process.env.RESEND_API_KEY;
    expect(isTransactionalEmailConfigured()).toBe(false);
  });

  it("skips without calling fetch when unconfigured", async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      sendTransactionalEmail({
        to: "ada@example.com",
        subject: "Hello",
        html: "<p>Hello</p>",
      }),
    ).resolves.toEqual({ ok: true, skipped: true });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends the expected Resend request body", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 202,
    } as Response);

    const result = await sendTransactionalEmail({
      to: "ada@example.com",
      subject: "Hello",
      html: "<p>Hello</p>",
      text: "Hello",
      tags: [{ name: "type", value: "daily_digest" }],
    });

    expect(result).toEqual({ ok: true, status: 202 });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          from: "jobs@example.com",
          to: "ada@example.com",
          subject: "Hello",
          html: "<p>Hello</p>",
          text: "Hello",
          tags: [{ name: "type", value: "daily_digest" }],
        }),
      }),
    );
  });
});
