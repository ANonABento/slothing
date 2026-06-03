import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  batch: vi.fn(),
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => ({
    batch: mocks.batch,
    execute: mocks.execute,
  }),
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-send-id",
}));

import {
  createEmailSend,
  getFailedEmailSends,
  getEmailSends,
  getRecentEmailSendForRecipient,
  hasDigestSentSince,
  hasDailyDigestSentSince,
  markEmailSendStatus,
} from "./email-sends";

describe("Email Send Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.batch.mockResolvedValue([]);
  });

  it("creates a sent email row", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

    const send = await createEmailSend(
      {
        type: "cold_outreach",
        recipient: "sam@example.com",
        subject: "Hello",
        body: "Quick intro",
        gmailMessageId: "gmail-1",
      },
      "user-1",
    );

    expect(send.id).toBe("test-send-id");
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO email_sends"),
      args: [
        "test-send-id",
        "user-1",
        "cold_outreach",
        null,
        "sam@example.com",
        "Hello",
        "Quick intro",
        null,
        "gmail-1",
        "sent",
        null,
        expect.any(String),
      ],
    });
  });

  it("lists sends scoped to the user ordered by sent date", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    await expect(
      getEmailSends("user-1", { limit: 25, offset: 5 }),
    ).resolves.toEqual([]);
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("ORDER BY sent_at DESC"),
      args: ["user-1", 25, 5],
    });
  });

  it("looks up recent sends by recipient and template type", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    const result = await getRecentEmailSendForRecipient(
      "user-1",
      "sam@example.com",
      "cold_outreach",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result).toBeNull();
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining(
        "recipient = ? AND type = ? AND sent_at >= ?",
      ),
      args: [
        "user-1",
        "sam@example.com",
        "cold_outreach",
        "2026-01-01T00:00:00.000Z",
      ],
    });
  });

  it("checks whether a daily digest has already been sent since a timestamp", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [{ id: "send-1" }] });

    await expect(
      hasDailyDigestSentSince("user-1", "2026-05-10T00:00:00.000Z"),
    ).resolves.toBe(true);
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("type = 'daily_digest' AND sent_at >= ?"),
      args: ["user-1", "2026-05-10T00:00:00.000Z"],
    });
  });

  it("checks digest idempotency by digest type and sent status", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    await expect(
      hasDigestSentSince("user-1", "daily_digest", "2026-05-01T00:00:00.000Z"),
    ).resolves.toBe(false);
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining(
        "type = ? AND status = 'sent' AND sent_at >= ?",
      ),
      args: ["user-1", "daily_digest", "2026-05-01T00:00:00.000Z"],
    });
  });

  it("lists failed sends oldest-first for retries", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [] });

    await expect(getFailedEmailSends({ limit: 10 })).resolves.toEqual([]);
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("ORDER BY sent_at ASC"),
      args: [10],
    });
  });

  it("updates send status after a retry attempt", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

    await expect(markEmailSendStatus("send-1", "user-1", "sent")).resolves.toBe(
      true,
    );
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("UPDATE email_sends"),
      args: ["sent", null, expect.any(String), "send-1", "user-1"],
    });
  });
});
