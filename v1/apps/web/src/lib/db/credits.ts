import { randomUUID } from "crypto";

import { CREDITS_BOOTSTRAP_SQL } from "./bootstrap-sql";
import { getClient } from "./client";
import { nowIso } from "@/lib/format/time";

export type CreditFeature =
  | "tailor"
  | "cover_letter"
  | "ats"
  | "interview_turn"
  | "document_assistant"
  | "email";

export type CreditReason = "invoice_paid" | "usage" | "refund" | "adjustment";

export const CREDIT_COSTS: Record<CreditFeature, number> = {
  tailor: 5,
  cover_letter: 3,
  ats: 2,
  interview_turn: 1,
  document_assistant: 1,
  email: 1,
};

export const PLAN_CREDIT_GRANTS = {
  pro_monthly: 1000,
  pro_weekly: 250,
} as const;

export type CreditPlanKey = keyof typeof PLAN_CREDIT_GRANTS;

interface CreditBalanceRow {
  user_id: string;
  balance: number;
  updated_at: string;
}

interface CreditTransactionRow {
  id: string;
  user_id: string;
  delta: number;
  reason: CreditReason;
  feature: CreditFeature | null;
  ref_id: string | null;
  created_at: string;
}

export interface CreditBalanceRecord {
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface CreditTransactionRecord {
  id: string;
  userId: string;
  delta: number;
  reason: CreditReason;
  feature: CreditFeature | null;
  refId: string | null;
  createdAt: string;
}

let ensured = false;

export async function ensureCreditSchema(): Promise<void> {
  if (ensured) return;

  // DDL co-located with the Drizzle table definitions — see
  // `bootstrap-sql.ts` for the column pins that fail to type-check if
  // a column is renamed in `schema.ts`.
  await getClient().batch(
    CREDITS_BOOTSTRAP_SQL.split(";")
      .map((sql) => sql.trim())
      .filter(Boolean)
      .map((sql) => ({ sql, args: [] })),
    "write",
  );

  ensured = true;
}

export async function getCreditBalance(
  userId: string,
): Promise<CreditBalanceRecord> {
  await ensureCreditSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM credit_balances WHERE user_id = ?",
    args: [userId],
  });
  const row = result.rows[0] as unknown as CreditBalanceRow | undefined;

  if (row) return mapBalance(row);
  return { userId, balance: 0, updatedAt: nowIso() };
}

export async function getCreditTransactions(
  userId: string,
  limit = 30,
): Promise<CreditTransactionRecord[]> {
  await ensureCreditSchema();
  const result = await getClient().execute({
    sql: `SELECT * FROM credit_transactions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
    args: [userId, limit],
  });
  const rows = result.rows as unknown as CreditTransactionRow[];
  return rows.map(mapTransaction);
}

export async function grantPlanCredits(
  userId: string,
  planKey: CreditPlanKey,
  refId: string,
): Promise<CreditBalanceRecord> {
  const amount = PLAN_CREDIT_GRANTS[planKey];
  return await addCredits({
    userId,
    delta: amount,
    reason: "invoice_paid",
    refId,
    cap: amount * 2,
    idempotent: true,
  });
}

export async function deductCredits(
  userId: string,
  feature: CreditFeature,
  refId: string,
): Promise<CreditTransactionRecord> {
  const cost = CREDIT_COSTS[feature];
  await ensureCreditSchema();

  const balance = (await getCreditBalance(userId)).balance;
  if (balance < cost) {
    throw new InsufficientCreditsError(userId, feature, cost, balance);
  }

  const transaction = buildTransaction({
    userId,
    delta: -cost,
    reason: "usage",
    feature,
    refId,
  });

  await getClient().batch(
    [
      {
        sql: `INSERT INTO credit_balances (user_id, balance, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         balance = credit_balances.balance - excluded.balance,
         updated_at = CURRENT_TIMESTAMP`,
        args: [userId, cost],
      },
      insertTransactionStatement(transaction),
    ],
    "write",
  );

  return transaction;
}

export async function refundCredits(
  userId: string,
  feature: CreditFeature,
  refId: string,
): Promise<CreditTransactionRecord> {
  return (
    await addCredits({
      userId,
      delta: CREDIT_COSTS[feature],
      reason: "refund",
      feature,
      refId,
    })
  ).transaction;
}

async function addCredits(input: {
  userId: string;
  delta: number;
  reason: CreditReason;
  feature?: CreditFeature | null;
  refId?: string | null;
  cap?: number;
  idempotent?: boolean;
}): Promise<CreditBalanceRecord & { transaction: CreditTransactionRecord }> {
  await ensureCreditSchema();

  if (input.idempotent && input.refId) {
    const existingResult = await getClient().execute({
      sql: `SELECT * FROM credit_transactions
           WHERE user_id = ? AND reason = ? AND ref_id = ?
           LIMIT 1`,
      args: [input.userId, input.reason, input.refId],
    });
    const existing = existingResult.rows[0] as unknown as
      | CreditTransactionRow
      | undefined;
    if (existing) {
      const balance = await getCreditBalance(input.userId);
      return { ...balance, transaction: mapTransaction(existing) };
    }
  }

  const current = (await getCreditBalance(input.userId)).balance;
  const nextBalance =
    typeof input.cap === "number"
      ? Math.min(current + input.delta, input.cap)
      : current + input.delta;
  const actualDelta = nextBalance - current;
  const transaction = buildTransaction({
    userId: input.userId,
    delta: actualDelta,
    reason: input.reason,
    feature: input.feature ?? null,
    refId: input.refId ?? null,
  });

  await getClient().batch(
    [
      {
        sql: `INSERT INTO credit_balances (user_id, balance, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         balance = excluded.balance,
         updated_at = CURRENT_TIMESTAMP`,
        args: [input.userId, nextBalance],
      },
      insertTransactionStatement(transaction),
    ],
    "write",
  );

  return {
    userId: input.userId,
    balance: nextBalance,
    updatedAt: nowIso(),
    transaction,
  };
}

function buildTransaction(input: {
  userId: string;
  delta: number;
  reason: CreditReason;
  feature?: CreditFeature | null;
  refId?: string | null;
}): CreditTransactionRecord {
  const id = randomUUID();
  return {
    id,
    userId: input.userId,
    delta: input.delta,
    reason: input.reason,
    feature: input.feature ?? null,
    refId: input.refId ?? null,
    createdAt: nowIso(),
  };
}

function insertTransactionStatement(transaction: CreditTransactionRecord) {
  return {
    sql: `INSERT INTO credit_transactions
       (id, user_id, delta, reason, feature, ref_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      transaction.id,
      transaction.userId,
      transaction.delta,
      transaction.reason,
      transaction.feature,
      transaction.refId,
    ],
  };
}

function mapBalance(row: CreditBalanceRow): CreditBalanceRecord {
  return {
    userId: row.user_id,
    balance: row.balance,
    updatedAt: row.updated_at,
  };
}

function mapTransaction(row: CreditTransactionRow): CreditTransactionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    delta: row.delta,
    reason: row.reason,
    feature: row.feature,
    refId: row.ref_id,
    createdAt: row.created_at,
  };
}

export class InsufficientCreditsError extends Error {
  readonly code = "insufficient_credits" as const;

  constructor(
    readonly userId: string,
    readonly feature: CreditFeature,
    readonly cost: number,
    readonly balance: number,
  ) {
    super(
      `Insufficient credits for ${feature}: ${balance} available, ${cost} required`,
    );
    this.name = "InsufficientCreditsError";
  }
}
