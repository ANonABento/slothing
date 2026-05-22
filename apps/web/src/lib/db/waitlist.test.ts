import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "waitlist-1",
}));

import { createWaitlistEntry, listWaitlistEntries } from "./waitlist";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("waitlist db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.includes("SELECT id, email, source, interest, created_at")) {
          return Promise.resolve(
            result([
              {
                id: "waitlist-1",
                email: "avery@example.com",
                source: "pricing",
                interest: "Hosted launch",
                created_at: "2026-05-18T12:00:00.000Z",
              },
            ]),
          );
        }
        return Promise.resolve(result([], 1));
      },
    );
  });

  it("normalizes and upserts waitlist entries", async () => {
    const entry = await createWaitlistEntry({
      email: " Avery@Example.com ",
      source: " pricing ",
      interest: " Hosted launch ",
    });

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("ON CONFLICT(email) DO UPDATE"),
      args: [
        "waitlist-1",
        "avery@example.com",
        "pricing",
        "Hosted launch",
        expect.any(String),
      ],
    });
    expect(entry.email).toBe("avery@example.com");
  });

  it("bounds waitlist list limits", async () => {
    await listWaitlistEntries(1000);

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("LIMIT ?"),
      args: [500],
    });
  });
});
