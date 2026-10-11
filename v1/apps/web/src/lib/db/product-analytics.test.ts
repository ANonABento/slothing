import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "event-1",
}));

import {
  getActivationFunnelCounts,
  trackActivationEvent,
} from "./product-analytics";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("product analytics db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.includes("SELECT event, COUNT(*)")) {
          return Promise.resolve(
            result([
              { event: "waitlist_joined", count: 1 },
              { event: "resume_tailored", count: 2 },
            ]),
          );
        }
        return Promise.resolve(result([], 1));
      },
    );
  });

  it("records activation events with metadata", async () => {
    const event = await trackActivationEvent({
      event: "waitlist_joined",
      source: "pricing",
      metadata: { interest: "Hosted launch" },
    });

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO product_events"),
      args: [
        "event-1",
        null,
        "waitlist_joined",
        "pricing",
        JSON.stringify({ interest: "Hosted launch" }),
        expect.any(String),
      ],
    });
    expect(event.id).toBe("event-1");
  });

  it("returns funnel counts with zero defaults", async () => {
    await expect(getActivationFunnelCounts("user-1")).resolves.toMatchObject({
      waitlist_joined: 1,
      opportunity_created: 0,
      resume_tailored: 2,
    });

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("WHERE user_id = ?"),
      args: ["user-1"],
    });
  });
});
