import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let balances = new Map<string, Record<string, unknown>>();
  let transactions = new Map<string, Record<string, unknown>>();

  function apply(sql: string, args: unknown[]) {
    if (sql.includes("INSERT INTO credit_balances")) {
      const userId = String(args[0]);
      const value = Number(args[1]);
      const current = Number(balances.get(userId)?.balance ?? 0);
      balances.set(userId, {
        user_id: userId,
        balance: sql.includes("credit_balances.balance - excluded.balance")
          ? current - value
          : value,
        updated_at: "2026-05-13 10:00:00",
      });
      return;
    }

    if (sql.includes("INSERT INTO credit_transactions")) {
      transactions.set(String(args[0]), {
        id: args[0],
        user_id: args[1],
        delta: args[2],
        reason: args[3],
        feature: args[4],
        ref_id: args[5],
        created_at: "2026-05-13 10:00:00",
      });
    }
  }

  return {
    batch: vi.fn(
      async (statements: Array<{ sql: string; args?: unknown[] }>) => {
        for (const statement of statements) {
          apply(statement.sql, statement.args ?? []);
        }
        return [];
      },
    ),
    execute: vi.fn(async (statement: { sql: string; args?: unknown[] }) => {
      const { sql, args = [] } = statement;

      if (sql.includes("SELECT * FROM credit_balances")) {
        return {
          rows: balances.get(String(args[0]))
            ? [balances.get(String(args[0]))]
            : [],
        };
      }

      if (sql.includes("WHERE user_id = ? AND reason = ? AND ref_id = ?")) {
        return {
          rows: [
            Array.from(transactions.values()).find(
              (row) =>
                row.user_id === args[0] &&
                row.reason === args[1] &&
                row.ref_id === args[2],
            ),
          ].filter(Boolean),
        };
      }

      if (sql.includes("SELECT * FROM credit_transactions")) {
        return {
          rows: Array.from(transactions.values())
            .filter((row) => row.user_id === args[0])
            .slice(0, Number(args[1] ?? 30)),
        };
      }

      return { rows: [] };
    }),
    setBalance(userId: string, balance: number) {
      balances.set(userId, {
        user_id: userId,
        balance,
        updated_at: "2026-05-13 10:00:00",
      });
    },
    reset() {
      balances = new Map();
      transactions = new Map();
    },
  };
});

vi.mock("./client", () => ({
  getClient: () => ({
    batch: mocks.batch,
    execute: mocks.execute,
  }),
}));

import {
  deductCredits,
  getCreditBalance,
  getCreditTransactions,
  grantPlanCredits,
  InsufficientCreditsError,
  refundCredits,
} from "./credits";

describe("credit ledger helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reset();
  });

  it("grants plan credits with a 2x rollover cap and idempotent invoice ref", async () => {
    mocks.setBalance("user-1", 1800);

    const balance = await grantPlanCredits("user-1", "pro_monthly", "in_123");
    const replayed = await grantPlanCredits("user-1", "pro_monthly", "in_123");

    expect(balance.balance).toBe(2000);
    expect(replayed.balance).toBe(2000);
    await expect(getCreditTransactions("user-1")).resolves.toHaveLength(1);
  });

  it("deducts the configured feature cost atomically", async () => {
    mocks.setBalance("user-1", 10);

    const transaction = await deductCredits("user-1", "tailor", "resume-1");

    expect(transaction).toMatchObject({
      userId: "user-1",
      delta: -5,
      reason: "usage",
      feature: "tailor",
      refId: "resume-1",
    });
    await expect(getCreditBalance("user-1")).resolves.toMatchObject({
      balance: 5,
    });
  });

  it("throws without writing a usage transaction when balance is too low", async () => {
    mocks.setBalance("user-1", 1);

    await expect(deductCredits("user-1", "ats", "scan-1")).rejects.toThrow(
      InsufficientCreditsError,
    );
    await expect(getCreditTransactions("user-1")).resolves.toHaveLength(0);
  });

  it("refunds the same feature cost after a failed LLM call", async () => {
    mocks.setBalance("user-1", 0);

    const transaction = await refundCredits(
      "user-1",
      "cover_letter",
      "letter-1",
    );

    expect(transaction).toMatchObject({
      delta: 3,
      reason: "refund",
      feature: "cover_letter",
    });
    await expect(getCreditBalance("user-1")).resolves.toMatchObject({
      balance: 3,
    });
  });
});
