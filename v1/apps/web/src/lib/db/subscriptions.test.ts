import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let customers = new Map<string, Record<string, unknown>>();
  let subscriptions = new Map<string, Record<string, unknown>>();

  function apply(sql: string, args: unknown[]) {
    if (sql.includes("INSERT INTO stripe_customers")) {
      const userId = String(args[0]);
      const existing = customers.get(userId);
      customers.set(userId, {
        user_id: userId,
        stripe_customer_id: args[1],
        email: args[2],
        created_at: existing?.created_at ?? "2026-05-13 10:00:00",
        updated_at: "2026-05-13 10:00:00",
      });
      return;
    }

    if (sql.includes("INSERT INTO subscriptions")) {
      const id = String(args[0]);
      const existing = subscriptions.get(id);
      subscriptions.set(id, {
        id,
        user_id: args[1],
        stripe_customer_id: args[2],
        plan_key: args[3],
        status: args[4],
        stripe_price_id: args[5],
        current_period_start: args[6],
        current_period_end: args[7],
        cancel_at_period_end: args[8],
        canceled_at: args[9],
        created_at: existing?.created_at ?? "2026-05-13 10:00:00",
        updated_at: "2026-05-13 10:00:00",
      });
      return;
    }

    if (sql.includes("UPDATE subscriptions")) {
      const id = String(args[1]);
      const existing = subscriptions.get(id);
      if (!existing) return;
      subscriptions.set(id, {
        ...existing,
        status: "canceled",
        canceled_at: args[0] ?? existing.canceled_at,
        updated_at: "2026-05-13 10:00:00",
      });
    }
  }

  return {
    batch: vi.fn(async () => []),
    execute: vi.fn(async (statement: { sql: string; args?: unknown[] }) => {
      const { sql, args = [] } = statement;
      apply(sql, args);

      if (sql.includes("FROM stripe_customers WHERE user_id")) {
        return {
          rows: customers.get(String(args[0]))
            ? [customers.get(String(args[0]))]
            : [],
        };
      }
      if (sql.includes("FROM stripe_customers WHERE stripe_customer_id")) {
        return {
          rows: [
            Array.from(customers.values()).find(
              (row) => row.stripe_customer_id === args[0],
            ),
          ].filter(Boolean),
        };
      }
      if (sql.includes("FROM subscriptions WHERE id")) {
        return {
          rows: subscriptions.get(String(args[0]))
            ? [subscriptions.get(String(args[0]))]
            : [],
        };
      }
      if (sql.includes("status IN")) {
        return {
          rows: [
            Array.from(subscriptions.values()).find(
              (row) =>
                row.user_id === args[0] &&
                (row.status === "active" || row.status === "trialing"),
            ),
          ].filter(Boolean),
        };
      }
      if (sql.includes("FROM subscriptions")) {
        return {
          rows: [
            Array.from(subscriptions.values()).find(
              (row) => row.user_id === args[0],
            ),
          ].filter(Boolean),
        };
      }
      return { rows: [], rowsAffected: 1 };
    }),
    reset() {
      customers = new Map();
      subscriptions = new Map();
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
  getActiveUserSubscription,
  getStripeCustomerByStripeId,
  markSubscriptionDeleted,
  upsertStripeCustomer,
  upsertSubscription,
} from "./subscriptions";

describe("subscription database helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reset();
  });

  it("upserts and reads a Stripe customer scoped to one user", async () => {
    const customer = await upsertStripeCustomer({
      userId: "user-1",
      stripeCustomerId: "cus_123",
      email: "sam@example.com",
    });

    expect(customer).toMatchObject({
      userId: "user-1",
      stripeCustomerId: "cus_123",
      email: "sam@example.com",
    });
    await expect(getStripeCustomerByStripeId("cus_123")).resolves.toMatchObject(
      {
        userId: "user-1",
      },
    );
    expect(mocks.batch).toHaveBeenCalled();
  });

  it("upserts and reads the active user subscription", async () => {
    await upsertSubscription({
      id: "sub_123",
      userId: "user-1",
      stripeCustomerId: "cus_123",
      planKey: "pro_monthly",
      status: "active",
      stripePriceId: "price_monthly",
      currentPeriodStart: "2026-05-13T00:00:00.000Z",
      currentPeriodEnd: "2026-06-13T00:00:00.000Z",
    });

    const subscription = await getActiveUserSubscription("user-1");

    expect(subscription).toMatchObject({
      id: "sub_123",
      userId: "user-1",
      planKey: "pro_monthly",
      status: "active",
      cancelAtPeriodEnd: false,
    });
  });

  it("marks deleted subscriptions as canceled", async () => {
    await upsertSubscription({
      id: "sub_123",
      userId: "user-1",
      stripeCustomerId: "cus_123",
      planKey: "pro_weekly",
      status: "active",
    });

    const subscription = await markSubscriptionDeleted(
      "sub_123",
      "2026-05-13T12:00:00.000Z",
    );

    expect(subscription).toMatchObject({
      id: "sub_123",
      status: "canceled",
      canceledAt: "2026-05-13T12:00:00.000Z",
    });
    await expect(getActiveUserSubscription("user-1")).resolves.toBeNull();
  });
});
