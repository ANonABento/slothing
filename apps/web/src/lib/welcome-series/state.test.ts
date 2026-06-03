import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));

import {
  ensureWelcomeSeriesSchema,
  getWelcomeSeriesState,
  parseWelcomeSeriesState,
  resetWelcomeSeriesSchemaForTest,
  setWelcomeSeriesState,
} from "./state";

describe("welcome series state", () => {
  beforeEach(() => {
    resetWelcomeSeriesSchemaForTest();
    vi.clearAllMocks();
    mocks.execute.mockResolvedValue({ rows: [], rowsAffected: 1 });
  });

  it("ensures columns once and swallows duplicate-column errors", async () => {
    mocks.execute.mockImplementation((sql: string) => {
      if (sql.includes("welcome_series_state")) {
        throw new Error("duplicate column name: welcome_series_state");
      }
      return Promise.resolve({ rows: [], rowsAffected: 1 });
    });

    await ensureWelcomeSeriesSchema();
    await ensureWelcomeSeriesSchema();

    expect(mocks.execute).toHaveBeenCalledTimes(3);
  });

  it("parses corrupt JSON as empty state", () => {
    expect(parseWelcomeSeriesState("{not-json")).toEqual({});
  });

  it("merges partial state updates", async () => {
    mocks.execute.mockImplementation((input: string | { sql: string }) => {
      const sql = typeof input === "string" ? input : input.sql;
      if (sql.includes("SELECT welcome_series_state")) {
        return Promise.resolve({
          rows: [
            {
              welcome_series_state: JSON.stringify({
                day1SentAt: "2026-05-01T00:00:00.000Z",
              }),
            },
          ],
        });
      }
      return Promise.resolve({ rows: [], rowsAffected: 1 });
    });

    await expect(
      setWelcomeSeriesState("user-1", {
        day3SkippedAt: "2026-05-03T00:00:00.000Z",
      }),
    ).resolves.toMatchObject({
      day1SentAt: "2026-05-01T00:00:00.000Z",
      day3SkippedAt: "2026-05-03T00:00:00.000Z",
    });
  });

  it("reads missing state as empty", async () => {
    mocks.execute.mockImplementation((input: string | { sql: string }) => {
      const sql = typeof input === "string" ? input : input.sql;
      if (sql.includes("SELECT welcome_series_state")) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [], rowsAffected: 1 });
    });

    await expect(getWelcomeSeriesState("user-1")).resolves.toEqual({});
  });
});
