import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isReminderEmailConfigured, sendReminderEmail } from "./send-email";

describe("reminder email sender", () => {
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

  it("requires both Resend API key and from address", () => {
    expect(isReminderEmailConfigured({} as NodeJS.ProcessEnv)).toBe(false);
    expect(
      isReminderEmailConfigured({
        NODE_ENV: "test",
        RESEND_API_KEY: "key",
      }),
    ).toBe(false);
    expect(
      isReminderEmailConfigured({
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
      sendReminderEmail({
        to: "ada@example.com",
        reminderTitle: "Follow up",
        jobTitle: "Engineer",
        jobCompany: "Acme",
        jobId: "job-1",
        dueDate: "2026-05-10T12:00:00.000Z",
      }),
    ).resolves.toEqual({ ok: true, skipped: true });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("sends a Resend request when configured", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "Slothing <noreply@example.com>";
    process.env.NEXTAUTH_URL = "https://app.example.com";
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      status: 202,
    } as Response);

    const result = await sendReminderEmail({
      to: "ada@example.com",
      reminderTitle: "Follow up",
      jobTitle: "Engineer",
      jobCompany: "Acme",
      jobId: "job-1",
      dueDate: "2026-05-10T12:00:00.000Z",
    });

    expect(result).toEqual({ ok: true, status: 202 });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer resend-key",
          "Content-Type": "application/json",
        }),
      }),
    );
    const [, init] = vi.mocked(globalThis.fetch).mock.calls[0];
    const body = JSON.parse(String(init?.body));
    expect(body).toMatchObject({
      from: "Slothing <noreply@example.com>",
      to: "ada@example.com",
      subject: "Reminder: Follow up - Acme",
    });
    expect(body.html).toContain(
      "https://app.example.com/opportunities?id=job-1",
    );
  });

  it("returns a failure result for non-2xx responses", async () => {
    process.env.RESEND_API_KEY = "resend-key";
    process.env.EMAIL_FROM = "Slothing <noreply@example.com>";
    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => "rate limited",
    } as Response);

    await expect(
      sendReminderEmail({
        to: "ada@example.com",
        reminderTitle: "Follow up",
        jobTitle: "Engineer",
        jobCompany: "Acme",
        jobId: "job-1",
        dueDate: "2026-05-10T12:00:00.000Z",
      }),
    ).resolves.toEqual({
      ok: false,
      status: 429,
      error: "rate limited",
    });
  });
});
