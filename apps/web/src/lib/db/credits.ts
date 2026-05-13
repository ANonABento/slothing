import { randomUUID } from "crypto";

import db from "./legacy";
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

export function ensureCreditSchema(): void {
  if (ensured) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS credit_balances (
      user_id TEXT PRIMARY KEY NOT NULL DEFAULT 'default',
      balance INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS credit_transactions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL DEFAULT 'default',
      delta INTEGER NOT NULL,
      reason TEXT NOT NULL,
      feature TEXT,
      ref_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created
      ON credit_transactions(user_id, created_at);
  `);

  ensured = true;
}

export function getCreditBalance(userId: string): CreditBalanceRecord {
  ensureCreditSchema();
  const row = db
    .prepare("SELECT * FROM credit_balances WHERE user_id = ?")
    .get(userId) as CreditBalanceRow | undefined;

  if (row) return mapBalance(row);
  return { userId, balance: 0, updatedAt: nowIso() };
}

export function getCreditTransactions(
  userId: string,
  limit = 30,
): CreditTransactionRecord[] {
  ensureCreditSchema();
  const rows = db
    .prepare(
      `SELECT * FROM credit_transactions
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .all(userId, limit) as CreditTransactionRow[];
  return rows.map(mapTransaction);
}

export function grantPlanCredits(
  userId: string,
  planKey: CreditPlanKey,
  refId: string,
): CreditBalanceRecord {
  const amount = PLAN_CREDIT_GRANTS[planKey];
  return addCredits({
    userId,
    delta: amount,
    reason: "invoice_paid",
    refId,
    cap: amount * 2,
    idempotent: true,
  });
}

export function deductCredits(
  userId: string,
  feature: CreditFeature,
  refId: string,
): CreditTransactionRecord {
  const cost = CREDIT_COSTS[feature];
  ensureCreditSchema();

  const transaction = db.transaction(() => {
    const balance = getCreditBalance(userId).balance;
    if (balance < cost) {
      throw new InsufficientCreditsError(userId, feature, cost, balance);
    }

    db.prepare(
      `INSERT INTO credit_balances (user_id, balance, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         balance = credit_balances.balance - excluded.balance,
         updated_at = CURRENT_TIMESTAMP`,
    ).run(userId, cost);

    return insertTransaction({
      userId,
      delta: -cost,
      reason: "usage",
      feature,
      refId,
    });
  });

  return transaction();
}

export function refundCredits(
  userId: string,
  feature: CreditFeature,
  refId: string,
): CreditTransactionRecord {
  return addCredits({
    userId,
    delta: CREDIT_COSTS[feature],
    reason: "refund",
    feature,
    refId,
  }).transaction;
}

function addCredits(input: {
  userId: string;
  delta: number;
  reason: CreditReason;
  feature?: CreditFeature | null;
  refId?: string | null;
  cap?: number;
  idempotent?: boolean;
}): CreditBalanceRecord & { transaction: CreditTransactionRecord } {
  ensureCreditSchema();

  const transaction = db.transaction(() => {
    if (input.idempotent && input.refId) {
      const existing = db
        .prepare(
          `SELECT * FROM credit_transactions
           WHERE user_id = ? AND reason = ? AND ref_id = ?
           LIMIT 1`,
        )
        .get(input.userId, input.reason, input.refId) as
        | CreditTransactionRow
        | undefined;
      if (existing) {
        const balance = getCreditBalance(input.userId);
        return { ...balance, transaction: mapTransaction(existing) };
      }
    }

    const current = getCreditBalance(input.userId).balance;
    const nextBalance =
      typeof input.cap === "number"
        ? Math.min(current + input.delta, input.cap)
        : current + input.delta;
    const actualDelta = nextBalance - current;

    db.prepare(
      `INSERT INTO credit_balances (user_id, balance, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id) DO UPDATE SET
         balance = excluded.balance,
         updated_at = CURRENT_TIMESTAMP`,
    ).run(input.userId, nextBalance);

    const inserted = insertTransaction({
      userId: input.userId,
      delta: actualDelta,
      reason: input.reason,
      feature: input.feature ?? null,
      refId: input.refId ?? null,
    });
    return { ...getCreditBalance(input.userId), transaction: inserted };
  });

  return transaction();
}

function insertTransaction(input: {
  userId: string;
  delta: number;
  reason: CreditReason;
  feature?: CreditFeature | null;
  refId?: string | null;
}): CreditTransactionRecord {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO credit_transactions
       (id, user_id, delta, reason, feature, ref_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.userId,
    input.delta,
    input.reason,
    input.feature ?? null,
    input.refId ?? null,
  );

  const row = db
    .prepare("SELECT * FROM credit_transactions WHERE id = ?")
    .get(id) as CreditTransactionRow | undefined;
  if (!row) throw new Error("Credit transaction insert failed");
  return mapTransaction(row);
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
