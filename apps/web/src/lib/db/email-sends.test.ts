import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./legacy", () => ({
  default: {
    exec: vi.fn(),
    prepare: vi.fn(),
  },
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-send-id",
}));

import db from "./legacy";
import {
  createEmailSend,
  getEmailSends,
  getRecentEmailSendForRecipient,
} from "./email-sends";

describe("Email Send Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a sent email row", () => {
    const mockRun = vi.fn();
    (db.prepare as Mock).mockReturnValue({ run: mockRun });

    const send = createEmailSend(
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
    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO email_sends"),
    );
    expect(mockRun).toHaveBeenCalledWith(
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
    );
  });

  it("lists sends scoped to the user ordered by sent date", () => {
    const mockAll = vi.fn().mockReturnValue([]);
    (db.prepare as Mock).mockReturnValue({ all: mockAll });

    expect(getEmailSends("user-1", { limit: 25, offset: 5 })).toEqual([]);
    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("WHERE user_id = ?"),
    );
    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("ORDER BY sent_at DESC"),
    );
    expect(mockAll).toHaveBeenCalledWith("user-1", 25, 5);
  });

  it("looks up recent sends by recipient and template type", () => {
    const mockGet = vi.fn().mockReturnValue(undefined);
    (db.prepare as Mock).mockReturnValue({ get: mockGet });

    const result = getRecentEmailSendForRecipient(
      "user-1",
      "sam@example.com",
      "cold_outreach",
      "2026-01-01T00:00:00.000Z",
    );

    expect(result).toBeNull();
    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("recipient = ? AND type = ? AND sent_at >= ?"),
    );
    expect(mockGet).toHaveBeenCalledWith(
      "user-1",
      "sam@example.com",
      "cold_outreach",
      "2026-01-01T00:00:00.000Z",
    );
  });
});
