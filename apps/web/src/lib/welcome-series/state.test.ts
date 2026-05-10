import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
}));

vi.mock("@/lib/db/legacy", () => ({
  default: { prepare: mocks.prepare },
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
    mocks.prepare.mockReturnValue({ run: vi.fn(), get: vi.fn() });
  });

  it("ensures columns once and swallows duplicate-column errors", () => {
    mocks.prepare.mockImplementation((sql: string) => ({
      run: vi.fn(() => {
        if (sql.includes("welcome_series_state")) {
          throw new Error("duplicate column name: welcome_series_state");
        }
      }),
    }));

    ensureWelcomeSeriesSchema();
    ensureWelcomeSeriesSchema();

    expect(mocks.prepare).toHaveBeenCalledTimes(3);
  });

  it("parses corrupt JSON as empty state", () => {
    expect(parseWelcomeSeriesState("{not-json")).toEqual({});
  });

  it("merges partial state updates", () => {
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("SELECT welcome_series_state")) {
        return {
          get: vi.fn(() => ({
            welcome_series_state: JSON.stringify({
              day1SentAt: "2026-05-01T00:00:00.000Z",
            }),
          })),
        };
      }
      return { run: vi.fn() };
    });

    expect(
      setWelcomeSeriesState("user-1", {
        day3SkippedAt: "2026-05-03T00:00:00.000Z",
      }),
    ).toMatchObject({
      day1SentAt: "2026-05-01T00:00:00.000Z",
      day3SkippedAt: "2026-05-03T00:00:00.000Z",
    });
  });

  it("reads missing state as empty", () => {
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("SELECT welcome_series_state")) {
        return { get: vi.fn(() => undefined) };
      }
      return { run: vi.fn() };
    });

    expect(getWelcomeSeriesState("user-1")).toEqual({});
  });
});
