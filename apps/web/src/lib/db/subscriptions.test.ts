import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let customers = new Map<string, Record<string, unknown>>();
  let subscriptions = new Map<string, Record<string, unknown>>();

  return {
    exec: vi.fn(),
    prepare: vi.fn((sql: string) => {
      if (sql.includes("INSERT INTO stripe_customers")) {
        return {
          run: vi.fn((userId, stripeCustomerId, email) => {
            const existing = customers.get(userId);
            customers.set(userId, {
              user_id: userId,
              stripe_customer_id: stripeCustomerId,
              email,
              created_at: existing?.created_at ?? "2026-05-13 10:00:00",
              updated_at: "2026-05-13 10:00:00",
            });
          }),
        };
      }
      if (sql.includes("FROM stripe_customers WHERE user_id")) {
        return { get: vi.fn((userId) => customers.get(userId)) };
      }
      if (sql.includes("FROM stripe_customers WHERE stripe_customer_id")) {
        return {
          get: vi.fn((stripeCustomerId) =>
            Array.from(customers.values()).find(
              (row) => row.stripe_customer_id === stripeCustomerId,
            ),
          ),
        };
      }
      if (sql.includes("INSERT INTO subscriptions")) {
        return {
          run: vi.fn(
            (
              id,
              userId,
              stripeCustomerId,
              planKey,
              status,
              stripePriceId,
              currentPeriodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd,
              canceledAt,
            ) => {
              const existing = subscriptions.get(id);
              subscriptions.set(id, {
                id,
                user_id: userId,
                stripe_customer_id: stripeCustomerId,
                plan_key: planKey,
                status,
                stripe_price_id: stripePriceId,
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                cancel_at_period_end: cancelAtPeriodEnd,
                canceled_at: canceledAt,
                created_at: existing?.created_at ?? "2026-05-13 10:00:00",
                updated_at: "2026-05-13 10:00:00",
              });
            },
          ),
        };
      }
      if (sql.includes("UPDATE subscriptions")) {
        return {
          run: vi.fn((canceledAt, id) => {
            const existing = subscriptions.get(id);
            if (!existing) return;
            subscriptions.set(id, {
              ...existing,
              status: "canceled",
              canceled_at: canceledAt ?? existing.canceled_at,
              updated_at: "2026-05-13 10:00:00",
            });
          }),
        };
      }
      if (sql.includes("FROM subscriptions WHERE id")) {
        return { get: vi.fn((id) => subscriptions.get(id)) };
      }
      if (sql.includes("status IN")) {
        return {
          get: vi.fn((userId) =>
            Array.from(subscriptions.values()).find(
              (row) =>
                row.user_id === userId &&
                (row.status === "active" || row.status === "trialing"),
            ),
          ),
        };
      }
      if (sql.includes("FROM subscriptions")) {
        return {
          get: vi.fn((userId) =>
            Array.from(subscriptions.values()).find(
              (row) => row.user_id === userId,
            ),
          ),
        };
      }
      return { run: vi.fn(), get: vi.fn(), all: vi.fn() };
    }),
    reset() {
      customers = new Map();
      subscriptions = new Map();
    },
  };
});

vi.mock("./legacy", () => ({
  default: {
    exec: mocks.exec,
    prepare: mocks.prepare,
  },
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

  it("upserts and reads a Stripe customer scoped to one user", () => {
    const customer = upsertStripeCustomer({
      userId: "user-1",
      stripeCustomerId: "cus_123",
      email: "sam@example.com",
    });

    expect(customer).toMatchObject({
      userId: "user-1",
      stripeCustomerId: "cus_123",
      email: "sam@example.com",
    });
    expect(getStripeCustomerByStripeId("cus_123")?.userId).toBe("user-1");
    expect(mocks.exec).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS stripe_customers"),
    );
  });

  it("upserts and reads the active user subscription", () => {
    upsertSubscription({
      id: "sub_123",
      userId: "user-1",
      stripeCustomerId: "cus_123",
      planKey: "pro_monthly",
      status: "active",
      stripePriceId: "price_monthly",
      currentPeriodStart: "2026-05-13T00:00:00.000Z",
      currentPeriodEnd: "2026-06-13T00:00:00.000Z",
    });

    const subscription = getActiveUserSubscription("user-1");

    expect(subscription).toMatchObject({
      id: "sub_123",
      userId: "user-1",
      planKey: "pro_monthly",
      status: "active",
      cancelAtPeriodEnd: false,
    });
  });

  it("marks deleted subscriptions as canceled", () => {
    upsertSubscription({
      id: "sub_123",
      userId: "user-1",
      stripeCustomerId: "cus_123",
      planKey: "pro_weekly",
      status: "active",
    });

    const subscription = markSubscriptionDeleted(
      "sub_123",
      "2026-05-13T12:00:00.000Z",
    );

    expect(subscription).toMatchObject({
      id: "sub_123",
      status: "canceled",
      canceledAt: "2026-05-13T12:00:00.000Z",
    });
    expect(getActiveUserSubscription("user-1")).toBeNull();
  });
});
