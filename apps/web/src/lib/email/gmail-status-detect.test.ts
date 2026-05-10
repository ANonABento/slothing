import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/google/client", () => ({
  isGoogleConnectedForUser: vi.fn(async () => true),
}));

vi.mock("@/lib/google/gmail", () => ({
  searchStatusChangeEmailsForUser: vi.fn(async () => []),
}));

vi.mock("@/lib/opportunities", () => ({
  listAllOpportunities: vi.fn(() => []),
  changeOpportunityStatus: vi.fn(),
}));

vi.mock("@/lib/db/notifications", () => ({
  createNotification: vi.fn(),
}));

vi.mock("@/lib/settings/gmail-auto-status", () => ({
  getGmailAutoStatusEnabled: vi.fn(() => true),
  getGmailLastScannedAt: vi.fn(() => null),
  listGmailAutoStatusEnabledUserIds: vi.fn(async () => ["user-1"]),
  setGmailLastScannedAt: vi.fn(),
}));

import { createNotification } from "@/lib/db/notifications";
import { searchStatusChangeEmailsForUser } from "@/lib/google/gmail";
import {
  changeOpportunityStatus,
  listAllOpportunities,
} from "@/lib/opportunities";
import { getGmailAutoStatusEnabled } from "@/lib/settings/gmail-auto-status";
import {
  runGmailStatusDetectionForEnabledUsers,
  runGmailStatusDetectionForUser,
} from "./gmail-status-detect";

describe("runGmailStatusDetectionForUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("skips disabled users", async () => {
    vi.mocked(getGmailAutoStatusEnabled).mockReturnValueOnce(false);

    await expect(
      runGmailStatusDetectionForUser("user-1"),
    ).resolves.toMatchObject({ processed: 1, skipped: 1, scanned: 0 });
  });

  it("advances matched opportunities and creates a notification", async () => {
    vi.mocked(searchStatusChangeEmailsForUser).mockResolvedValueOnce([
      {
        id: "message-1",
        threadId: "thread-1",
        subject: "Thank you for applying to Acme",
        from: "Acme Talent <talent@acme.com>",
        to: "me@example.com",
        date: new Date("2026-05-01T00:00:00Z"),
        snippet: "Thank you for applying",
        body: "Thank you for applying to Acme.",
        labels: ["INBOX"],
      },
    ]);
    vi.mocked(listAllOpportunities).mockReturnValueOnce([
      {
        id: "opp-1",
        type: "job",
        title: "Engineer",
        company: "Acme Inc.",
        source: "manual",
        status: "saved",
        tags: [],
        summary: "",
        createdAt: "2026-05-01T00:00:00Z",
        updatedAt: "2026-05-01T00:00:00Z",
      },
    ]);
    vi.mocked(changeOpportunityStatus).mockReturnValueOnce({
      id: "opp-1",
      type: "job",
      title: "Engineer",
      company: "Acme Inc.",
      source: "manual",
      status: "applied",
      tags: [],
      summary: "",
      createdAt: "2026-05-01T00:00:00Z",
      updatedAt: "2026-05-01T00:00:00Z",
    });

    await expect(
      runGmailStatusDetectionForUser("user-1"),
    ).resolves.toMatchObject({
      processed: 1,
      scanned: 1,
      matched: 1,
      updated: 1,
    });
    expect(changeOpportunityStatus).toHaveBeenCalledWith(
      "opp-1",
      "applied",
      "user-1",
    );
    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "application_update",
        title: "Application status updated from Gmail",
      }),
      "user-1",
    );
  });

  it("does not downgrade a later status", async () => {
    vi.mocked(searchStatusChangeEmailsForUser).mockResolvedValueOnce([
      {
        id: "message-1",
        threadId: "thread-1",
        subject: "Thank you for applying to Acme",
        from: "Acme Talent <talent@acme.com>",
        to: "me@example.com",
        date: new Date("2026-05-01T00:00:00Z"),
        snippet: "",
        body: "Thank you for applying to Acme.",
        labels: ["INBOX"],
      },
    ]);
    vi.mocked(listAllOpportunities).mockReturnValueOnce([
      {
        id: "opp-1",
        type: "job",
        title: "Engineer",
        company: "Acme",
        source: "manual",
        status: "interviewing",
        tags: [],
        summary: "",
        createdAt: "2026-05-01T00:00:00Z",
        updatedAt: "2026-05-01T00:00:00Z",
      },
    ]);

    await expect(
      runGmailStatusDetectionForUser("user-1"),
    ).resolves.toMatchObject({ matched: 1, updated: 0 });
    expect(changeOpportunityStatus).not.toHaveBeenCalled();
  });
});

describe("runGmailStatusDetectionForEnabledUsers", () => {
  it("aggregates enabled users", async () => {
    await expect(
      runGmailStatusDetectionForEnabledUsers(),
    ).resolves.toMatchObject({ processed: 1 });
  });
});
