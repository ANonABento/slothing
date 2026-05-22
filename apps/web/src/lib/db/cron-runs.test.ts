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

import { listRecentCronRuns, recordCronRun } from "./cron-runs";

describe("cron run db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.batch.mockResolvedValue([]);
  });

  it("records cron run metadata", async () => {
    mocks.execute.mockResolvedValueOnce({ rows: [], rowsAffected: 1 });

    await recordCronRun({
      cron: "cleanup",
      status: "success",
      startedAt: "2026-05-18T03:00:00.000Z",
      durationMs: 12,
      summary: { deleted: 2 },
    });

    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO cron_runs"),
      args: [
        "cleanup",
        "success",
        "2026-05-18T03:00:00.000Z",
        expect.any(String),
        12,
        JSON.stringify({ deleted: 2 }),
        null,
      ],
    });
  });

  it("lists recent cron runs with parsed summaries", async () => {
    mocks.execute.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          cron: "cleanup",
          status: "success",
          started_at: "2026-05-18T03:00:00.000Z",
          finished_at: "2026-05-18T03:00:01.000Z",
          duration_ms: 1000,
          summary_json: '{"deleted":2}',
          error: null,
        },
      ],
    });

    await expect(listRecentCronRuns()).resolves.toEqual([
      {
        id: 1,
        cron: "cleanup",
        status: "success",
        startedAt: "2026-05-18T03:00:00.000Z",
        finishedAt: "2026-05-18T03:00:01.000Z",
        durationMs: 1000,
        summary: { deleted: 2 },
        error: null,
      },
    ]);
    expect(mocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("ORDER BY started_at DESC"),
      args: [50],
    });
  });
});
