import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  sendTransactionalEmail: vi.fn(),
  hasUserApplied: vi.fn(),
  hasUserBookedInterview: vi.fn(),
  getUsageStats: vi.fn(),
  getUserTier: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

vi.mock("@/lib/email/transactional", () => ({
  escapeHtml: (value: string) => value,
  sendTransactionalEmail: mocks.sendTransactionalEmail,
}));

vi.mock("@/lib/plan/tier", () => ({
  getUserTier: mocks.getUserTier,
}));

vi.mock("@/lib/welcome-series/predicates", () => ({
  hasUserApplied: mocks.hasUserApplied,
  hasUserBookedInterview: mocks.hasUserBookedInterview,
  getUsageStats: mocks.getUsageStats,
}));

import { processWelcomeSeriesForUser } from "./process";
import { resetWelcomeSeriesSchemaForTest } from "./state";

const now = new Date("2026-05-15T00:00:00.000Z");

describe("processWelcomeSeriesForUser", () => {
  beforeEach(() => {
    resetWelcomeSeriesSchemaForTest();
    vi.clearAllMocks();
    process.env.NEXTAUTH_URL = "https://app.example.com";
    mocks.sendTransactionalEmail.mockResolvedValue({ ok: true, status: 202 });
    mocks.hasUserApplied.mockResolvedValue(false);
    mocks.hasUserBookedInterview.mockResolvedValue(false);
    mocks.getUsageStats.mockResolvedValue({
      applicationCount: 3,
      tailoredResumeCount: 5,
    });
    mocks.getUserTier.mockReturnValue("free");
    mockDb({
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
      created_at: "2026-05-14T00:00:00.000Z",
      welcome_series_state: null,
    });
  });

  it("sends Day 1 when eligible and marks state", async () => {
    const result = await processWelcomeSeriesForUser("user-1", { now });

    expect(result.results[0]).toMatchObject({
      step: "day1",
      action: "sent",
    });
    expect(mocks.sendTransactionalEmail).toHaveBeenCalledTimes(1);
    expect(mocks.sendTransactionalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ada@example.com",
        subject: "Welcome — set up your profile in 5 min",
      }),
    );
    expect(lastStatePatch()).toMatchObject({
      day1SentAt: now.toISOString(),
    });
  });

  it("does not mark sent when transactional email is unconfigured", async () => {
    mocks.sendTransactionalEmail.mockResolvedValueOnce({
      ok: true,
      skipped: true,
    });

    const result = await processWelcomeSeriesForUser("user-1", { now });

    expect(result.results[0]).toMatchObject({
      step: "day1",
      action: "skipped",
      reason: "email-unconfigured",
    });
    expect(lastStatePatch()).toBeNull();
  });

  it("skips Day 3 when the user has already applied", async () => {
    mockDb({
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
      created_at: "2026-05-10T00:00:00.000Z",
      welcome_series_state: JSON.stringify({
        day1SentAt: "2026-05-11T00:00:00.000Z",
      }),
    });
    mocks.hasUserApplied.mockResolvedValue(true);

    const result = await processWelcomeSeriesForUser("user-1", { now });

    expect(result.results.find((step) => step.step === "day3")).toMatchObject({
      action: "skipped",
      reason: "already-applied",
    });
    expect(lastStatePatch()).toMatchObject({
      day3SkippedAt: now.toISOString(),
      day3SkipReason: "already-applied",
    });
  });

  it("skips Day 7 when an interview session exists", async () => {
    mockDb({
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
      created_at: "2026-05-01T00:00:00.000Z",
      welcome_series_state: JSON.stringify({
        day1SentAt: "2026-05-02T00:00:00.000Z",
        day3SentAt: "2026-05-04T00:00:00.000Z",
      }),
    });
    mocks.hasUserBookedInterview.mockResolvedValue(true);

    const result = await processWelcomeSeriesForUser("user-1", { now });

    expect(result.results.find((step) => step.step === "day7")).toMatchObject({
      action: "skipped",
      reason: "already-booked-interview",
    });
  });

  it("uses real stats in Day 14 and skips Pro users", async () => {
    mockDb({
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
      created_at: "2026-04-20T00:00:00.000Z",
      welcome_series_state: JSON.stringify({
        day1SentAt: "2026-04-21T00:00:00.000Z",
        day3SentAt: "2026-04-23T00:00:00.000Z",
        day7SentAt: "2026-04-27T00:00:00.000Z",
      }),
    });

    await processWelcomeSeriesForUser("user-1", { now });
    expect(mocks.sendTransactionalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Unlock more tailored applications with Pro",
        html: expect.stringContaining("3 opportunities"),
      }),
    );

    vi.clearAllMocks();
    resetWelcomeSeriesSchemaForTest();
    mockDb({
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
      created_at: "2026-04-20T00:00:00.000Z",
      welcome_series_state: JSON.stringify({
        day1SentAt: "2026-04-21T00:00:00.000Z",
        day3SentAt: "2026-04-23T00:00:00.000Z",
        day7SentAt: "2026-04-27T00:00:00.000Z",
      }),
    });
    mocks.getUserTier.mockReturnValue("pro");

    const result = await processWelcomeSeriesForUser("user-1", { now });
    expect(result.results.find((step) => step.step === "day14")).toMatchObject({
      action: "skipped",
      reason: "already-pro",
    });
    expect(mocks.sendTransactionalEmail).not.toHaveBeenCalled();
  });

  it("short-circuits missing email and unsubscribed users", async () => {
    mockDb({
      id: "user-1",
      email: null,
      name: "Ada Lovelace",
      created_at: "2026-05-01T00:00:00.000Z",
      welcome_series_state: null,
    });
    await expect(
      processWelcomeSeriesForUser("user-1", { now }),
    ).resolves.toEqual({
      results: [{ step: "all", action: "skipped", reason: "no-email" }],
    });

    mockDb({
      id: "user-1",
      email: "ada@example.com",
      name: "Ada Lovelace",
      created_at: "2026-05-01T00:00:00.000Z",
      welcome_series_state: JSON.stringify({
        unsubscribedAt: "2026-05-02T00:00:00.000Z",
      }),
    });
    await expect(
      processWelcomeSeriesForUser("user-1", { now }),
    ).resolves.toEqual({
      results: [{ step: "all", action: "skipped", reason: "unsubscribed" }],
    });
  });

  it("retries after send failure by leaving state untouched", async () => {
    mocks.sendTransactionalEmail.mockResolvedValueOnce({
      ok: false,
      status: 500,
      error: "boom",
    });

    const result = await processWelcomeSeriesForUser("user-1", { now });

    expect(result.results[0]).toMatchObject({
      step: "day1",
      action: "error",
      status: 500,
    });
    expect(lastStatePatch()).toBeNull();
  });
});

function mockDb(user: {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string | null;
  welcome_series_state: string | null;
}) {
  mocks.execute.mockImplementation((input: string | { sql: string }) => {
    const sql = typeof input === "string" ? input : input.sql;
    if (sql.includes("SELECT id, email, name")) {
      return Promise.resolve({ rows: [{ ...user }] });
    }
    if (sql.includes("SELECT welcome_series_state")) {
      return Promise.resolve({
        rows: [
          {
            welcome_series_state: user.welcome_series_state,
          },
        ],
      });
    }
    return Promise.resolve({ rows: [], rowsAffected: 1 });
  });
}

function lastStatePatch(): Record<string, unknown> | null {
  const calls = mocks.execute.mock.calls;
  const update = calls
    .map(([input]) => input)
    .filter(
      (input): input is { sql: string; args: unknown[] } =>
        typeof input !== "string" &&
        input.sql.includes("UPDATE `user` SET welcome_series_state"),
    )
    .at(-1);
  if (!update || typeof update.args[0] !== "string") return null;
  try {
    return JSON.parse(update.args[0]);
  } catch {
    return null;
  }
}
