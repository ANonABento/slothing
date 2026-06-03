import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/shared-resumes", () => ({
  ensureSharedResumesSchema: vi.fn(),
}));

vi.mock("@/lib/db/extension-sessions", () => ({
  ensureExtensionSessionsColumnsAsync: vi.fn(),
}));

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

import { runCleanupCron } from "./cleanup";

describe("runCleanupCron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes expired shares, sessions, extension tokens, and old cron logs", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rowsAffected: 2 })
      .mockResolvedValueOnce({ rowsAffected: 1 })
      .mockResolvedValueOnce({ rowsAffected: 3 })
      .mockResolvedValueOnce({ rowsAffected: 4 })
      .mockResolvedValueOnce({ rowsAffected: 5 });

    const result = await runCleanupCron(Date.parse("2026-05-18T03:00:00.000Z"));

    expect(result).toMatchObject({
      expiredShares: 2,
      expiredAuthSessions: 1,
      expiredVerificationTokens: 3,
      expiredExtensionSessions: 4,
      oldCronRuns: 5,
      errors: [],
    });
    expect(mocks.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "DELETE FROM shared_resumes WHERE expires_at <= ?",
      }),
    );
    expect(mocks.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "DELETE FROM session WHERE expires <= ?",
      }),
    );
    expect(mocks.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "DELETE FROM extension_sessions WHERE expires_at <= ?",
      }),
    );
    expect(mocks.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "DELETE FROM cron_runs WHERE started_at < ?",
      }),
    );
  });

  it("continues when an optional cleanup table is missing", async () => {
    mocks.execute
      .mockResolvedValueOnce({ rowsAffected: 1 })
      .mockImplementationOnce(() => {
        throw new Error("no such table: session");
      })
      .mockResolvedValue({ rowsAffected: 0 });

    const result = await runCleanupCron(1_000);

    expect(result.expiredShares).toBe(1);
    expect(result.errors).toEqual([
      "expiredAuthSessions: no such table: session",
    ]);
  });
});
