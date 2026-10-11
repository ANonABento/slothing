import { BILLING_BOOTSTRAP_SQL } from "./bootstrap-sql";
import { getClient } from "./client";
import { nowIso } from "@/lib/format/time";

export type BillingPlanKey = "pro_monthly" | "pro_weekly";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid";

interface StripeCustomerRow {
  user_id: string;
  stripe_customer_id: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  plan_key: BillingPlanKey;
  status: SubscriptionStatus;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: 0 | 1;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StripeCustomerRecord {
  userId: string;
  stripeCustomerId: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  stripeCustomerId: string;
  planKey: BillingPlanKey;
  status: SubscriptionStatus;
  stripePriceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertStripeCustomerInput {
  userId: string;
  stripeCustomerId: string;
  email?: string | null;
}

export interface UpsertSubscriptionInput {
  id: string;
  userId: string;
  stripeCustomerId: string;
  planKey: BillingPlanKey;
  status: SubscriptionStatus;
  stripePriceId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
}

let ensured = false;

export async function ensureBillingSchema(): Promise<void> {
  if (ensured) return;

  // DDL co-located with `schema.ts: stripeCustomers` / `subscriptions`.
  // See `bootstrap-sql.ts`.
  await getClient().batch(
    BILLING_BOOTSTRAP_SQL.split(";")
      .map((sql) => sql.trim())
      .filter(Boolean)
      .map((sql) => ({ sql, args: [] })),
    "write",
  );

  ensured = true;
}

export async function upsertStripeCustomer(
  input: UpsertStripeCustomerInput,
): Promise<StripeCustomerRecord> {
  await ensureBillingSchema();

  await getClient().execute({
    sql: `INSERT INTO stripe_customers
       (user_id, stripe_customer_id, email, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       stripe_customer_id = excluded.stripe_customer_id,
       email = excluded.email,
       updated_at = CURRENT_TIMESTAMP`,
    args: [input.userId, input.stripeCustomerId, input.email ?? null],
  });

  const customer = await getStripeCustomerByUserId(input.userId);
  if (!customer) {
    throw new Error("Stripe customer upsert failed");
  }
  return customer;
}

export async function getStripeCustomerByUserId(
  userId: string,
): Promise<StripeCustomerRecord | null> {
  await ensureBillingSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM stripe_customers WHERE user_id = ?",
    args: [userId],
  });
  const row = result.rows[0] as unknown as StripeCustomerRow | undefined;
  return row ? mapCustomer(row) : null;
}

export async function getStripeCustomerByStripeId(
  stripeCustomerId: string,
): Promise<StripeCustomerRecord | null> {
  await ensureBillingSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM stripe_customers WHERE stripe_customer_id = ?",
    args: [stripeCustomerId],
  });
  const row = result.rows[0] as unknown as StripeCustomerRow | undefined;
  return row ? mapCustomer(row) : null;
}

export async function upsertSubscription(
  input: UpsertSubscriptionInput,
): Promise<SubscriptionRecord> {
  await ensureBillingSchema();

  await getClient().execute({
    sql: `INSERT INTO subscriptions
       (id, user_id, stripe_customer_id, plan_key, status, stripe_price_id,
        current_period_start, current_period_end, cancel_at_period_end,
        canceled_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       user_id = excluded.user_id,
       stripe_customer_id = excluded.stripe_customer_id,
       plan_key = excluded.plan_key,
       status = excluded.status,
       stripe_price_id = excluded.stripe_price_id,
       current_period_start = excluded.current_period_start,
       current_period_end = excluded.current_period_end,
       cancel_at_period_end = excluded.cancel_at_period_end,
       canceled_at = excluded.canceled_at,
       updated_at = CURRENT_TIMESTAMP`,
    args: [
      input.id,
      input.userId,
      input.stripeCustomerId,
      input.planKey,
      input.status,
      input.stripePriceId ?? null,
      input.currentPeriodStart ?? null,
      input.currentPeriodEnd ?? null,
      input.cancelAtPeriodEnd ? 1 : 0,
      input.canceledAt ?? null,
    ],
  });

  const subscription = await getSubscriptionById(input.id);
  if (!subscription) {
    throw new Error("Subscription upsert failed");
  }
  return subscription;
}

export async function getSubscriptionById(
  id: string,
): Promise<SubscriptionRecord | null> {
  await ensureBillingSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM subscriptions WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0] as unknown as SubscriptionRow | undefined;
  return row ? mapSubscription(row) : null;
}

export async function getUserSubscription(
  userId: string,
): Promise<SubscriptionRecord | null> {
  await ensureBillingSchema();
  const result = await getClient().execute({
    sql: `SELECT * FROM subscriptions
       WHERE user_id = ?
       ORDER BY updated_at DESC, created_at DESC
       LIMIT 1`,
    args: [userId],
  });
  const row = result.rows[0] as unknown as SubscriptionRow | undefined;
  return row ? mapSubscription(row) : null;
}

export async function getActiveUserSubscription(
  userId: string,
): Promise<SubscriptionRecord | null> {
  await ensureBillingSchema();
  const result = await getClient().execute({
    sql: `SELECT * FROM subscriptions
       WHERE user_id = ? AND status IN ('active', 'trialing')
       ORDER BY updated_at DESC, created_at DESC
       LIMIT 1`,
    args: [userId],
  });
  const row = result.rows[0] as unknown as SubscriptionRow | undefined;
  return row ? mapSubscription(row) : null;
}

export async function markSubscriptionDeleted(
  id: string,
  canceledAt: string | null = nowIso(),
): Promise<SubscriptionRecord | null> {
  await ensureBillingSchema();
  await getClient().execute({
    sql: `UPDATE subscriptions
     SET status = 'canceled',
         canceled_at = COALESCE(?, canceled_at),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    args: [canceledAt, id],
  });
  return await getSubscriptionById(id);
}

function mapCustomer(row: StripeCustomerRow): StripeCustomerRecord {
  return {
    userId: row.user_id,
    stripeCustomerId: row.stripe_customer_id,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSubscription(row: SubscriptionRow): SubscriptionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    stripeCustomerId: row.stripe_customer_id,
    planKey: row.plan_key,
    status: row.status,
    stripePriceId: row.stripe_price_id,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end === 1,
    canceledAt: row.canceled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
