import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let balances = new Map<string, Record<string, unknown>>();
  let transactions = new Map<string, Record<string, unknown>>();

  const insertTransaction = (
    id: string,
    userId: string,
    delta: number,
    reason: string,
    feature: string | null,
    refId: string | null,
  ) => {
    transactions.set(id, {
      id,
      user_id: userId,
      delta,
      reason,
      feature,
      ref_id: refId,
      created_at: "2026-05-13 10:00:00",
    });
  };

  return {
    exec: vi.fn(),
    transaction: vi.fn((fn: () => unknown) => fn),
    prepare: vi.fn((sql: string) => {
      if (sql.includes("SELECT * FROM credit_balances")) {
        return { get: vi.fn((userId) => balances.get(userId)) };
      }
      if (sql.includes("SELECT * FROM credit_transactions WHERE id")) {
        return { get: vi.fn((id) => transactions.get(id)) };
      }
      if (sql.includes("WHERE user_id = ? AND reason = ? AND ref_id = ?")) {
        return {
          get: vi.fn((userId, reason, refId) =>
            Array.from(transactions.values()).find(
              (row) =>
                row.user_id === userId &&
                row.reason === reason &&
                row.ref_id === refId,
            ),
          ),
        };
      }
      if (sql.includes("SELECT * FROM credit_transactions")) {
        return {
          all: vi.fn((userId, limit) =>
            Array.from(transactions.values())
              .filter((row) => row.user_id === userId)
              .slice(0, limit),
          ),
        };
      }
      if (
        sql.includes("INSERT INTO credit_balances") &&
        sql.includes("balance = credit_balances.balance - excluded.balance")
      ) {
        return {
          run: vi.fn((userId, cost) => {
            const current = Number(balances.get(userId)?.balance ?? 0);
            balances.set(userId, {
              user_id: userId,
              balance: current - cost,
              updated_at: "2026-05-13 10:00:00",
            });
          }),
        };
      }
      if (sql.includes("INSERT INTO credit_balances")) {
        return {
          run: vi.fn((userId, balance) => {
            balances.set(userId, {
              user_id: userId,
              balance,
              updated_at: "2026-05-13 10:00:00",
            });
          }),
        };
      }
      if (sql.includes("INSERT INTO credit_transactions")) {
        return {
          run: vi.fn(insertTransaction),
        };
      }
      return { run: vi.fn(), get: vi.fn(), all: vi.fn() };
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

vi.mock("./legacy", () => ({
  default: {
    exec: mocks.exec,
    prepare: mocks.prepare,
    transaction: mocks.transaction,
  },
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

  it("grants plan credits with a 2x rollover cap and idempotent invoice ref", () => {
    mocks.setBalance("user-1", 1800);

    const balance = grantPlanCredits("user-1", "pro_monthly", "in_123");
    const replayed = grantPlanCredits("user-1", "pro_monthly", "in_123");

    expect(balance.balance).toBe(2000);
    expect(replayed.balance).toBe(2000);
    expect(getCreditTransactions("user-1")).toHaveLength(1);
  });

  it("deducts the configured feature cost atomically", () => {
    mocks.setBalance("user-1", 10);

    const transaction = deductCredits("user-1", "tailor", "resume-1");

    expect(transaction).toMatchObject({
      userId: "user-1",
      delta: -5,
      reason: "usage",
      feature: "tailor",
      refId: "resume-1",
    });
    expect(getCreditBalance("user-1").balance).toBe(5);
  });

  it("throws without writing a usage transaction when balance is too low", () => {
    mocks.setBalance("user-1", 1);

    expect(() => deductCredits("user-1", "ats", "scan-1")).toThrow(
      InsufficientCreditsError,
    );
    expect(getCreditTransactions("user-1")).toHaveLength(0);
  });

  it("refunds the same feature cost after a failed LLM call", () => {
    mocks.setBalance("user-1", 0);

    const transaction = refundCredits("user-1", "cover_letter", "letter-1");

    expect(transaction).toMatchObject({
      delta: 3,
      reason: "refund",
      feature: "cover_letter",
    });
    expect(getCreditBalance("user-1").balance).toBe(3);
  });
});
