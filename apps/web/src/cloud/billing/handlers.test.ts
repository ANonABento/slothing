import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getStripe: vi.fn(),
  getActivePriceForPlan: vi.fn(),
  getStripeCustomerByUserId: vi.fn(),
  getStripeCustomerByStripeId: vi.fn(),
  upsertStripeCustomer: vi.fn(),
  upsertSubscription: vi.fn(),
  markSubscriptionDeleted: vi.fn(),
  grantPlanCredits: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db/subscriptions", () => ({
  getStripeCustomerByUserId: mocks.getStripeCustomerByUserId,
  getStripeCustomerByStripeId: mocks.getStripeCustomerByStripeId,
  upsertStripeCustomer: mocks.upsertStripeCustomer,
  upsertSubscription: mocks.upsertSubscription,
  markSubscriptionDeleted: mocks.markSubscriptionDeleted,
}));

vi.mock("@/lib/db/credits", () => ({
  grantPlanCredits: mocks.grantPlanCredits,
}));

vi.mock("./stripe-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./stripe-client")>();
  return {
    ...actual,
    getStripe: mocks.getStripe,
  };
});

vi.mock("./stripe-products", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./stripe-products")>();
  return {
    ...actual,
    getActivePriceForPlan: mocks.getActivePriceForPlan,
  };
});

import {
  createCheckoutSession,
  createCustomerPortalSession,
  handleStripeWebhook,
} from "./handlers";

describe("cloud billing handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.getStripeCustomerByUserId.mockReturnValue(null);
    mocks.getStripeCustomerByStripeId.mockReturnValue(null);
    mocks.getActivePriceForPlan.mockResolvedValue("price_monthly");
    mocks.upsertSubscription.mockImplementation((input) => input);
  });

  it("creates a checkout session for a valid plan", async () => {
    const create = vi.fn().mockResolvedValue({
      url: "https://checkout.stripe.test/session",
      customer: "cus_123",
      customer_details: { email: "sam@example.com" },
    });
    mocks.getStripe.mockReturnValue({
      checkout: { sessions: { create } },
    });

    const response = await createCheckoutSession(
      request("http://localhost/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan: "pro_monthly" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://checkout.stripe.test/session",
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        client_reference_id: "user-1",
        line_items: [{ price: "price_monthly", quantity: 1 }],
      }),
    );
    expect(mocks.upsertStripeCustomer).toHaveBeenCalledWith({
      userId: "user-1",
      stripeCustomerId: "cus_123",
      email: "sam@example.com",
    });
  });

  it("rejects invalid checkout plans", async () => {
    const response = await createCheckoutSession(
      request("http://localhost/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan: "enterprise" }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("creates a customer portal session for an existing customer", async () => {
    mocks.getStripeCustomerByUserId.mockReturnValue({
      stripeCustomerId: "cus_123",
    });
    const create = vi.fn().mockResolvedValue({
      url: "https://billing.stripe.test/session",
    });
    mocks.getStripe.mockReturnValue({
      billingPortal: { sessions: { create } },
    });

    const response = await createCustomerPortalSession(
      request("http://localhost/api/billing/portal", { method: "POST" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://billing.stripe.test/session",
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ customer: "cus_123" }),
    );
  });

  it("verifies webhook signatures and syncs subscription updates", async () => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    const constructEvent = vi.fn().mockReturnValue({
      type: "customer.subscription.updated",
      data: {
        object: subscriptionEvent(),
      },
    });
    mocks.getStripe.mockReturnValue({
      webhooks: { constructEvent },
      checkout: { sessions: { list: vi.fn() } },
    });

    const response = await handleStripeWebhook(
      request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "sig_test" },
      }),
    );

    expect(response.status).toBe(200);
    expect(constructEvent).toHaveBeenCalledWith("{}", "sig_test", "whsec_test");
    expect(mocks.upsertSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "sub_123",
        userId: "user-1",
        stripeCustomerId: "cus_123",
        planKey: "pro_monthly",
        status: "active",
      }),
    );
  });

  it("grants plan credits when an invoice is paid", async () => {
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    const subscription = subscriptionEvent();
    const constructEvent = vi.fn().mockReturnValue({
      type: "invoice.paid",
      data: {
        object: {
          id: "in_123",
          parent: {
            type: "subscription_details",
            subscription_details: { subscription: "sub_123" },
          },
        },
      },
    });
    const retrieve = vi.fn().mockResolvedValue(subscription);
    mocks.getStripe.mockReturnValue({
      webhooks: { constructEvent },
      subscriptions: { retrieve },
    });

    const response = await handleStripeWebhook(
      request("http://localhost/api/billing/webhook", {
        method: "POST",
        body: "{}",
        headers: { "stripe-signature": "sig_test" },
      }),
    );

    expect(response.status).toBe(200);
    expect(retrieve).toHaveBeenCalledWith("sub_123", {
      expand: ["items.data.price.product", "customer"],
    });
    expect(mocks.grantPlanCredits).toHaveBeenCalledWith(
      "user-1",
      "pro_monthly",
      "in_123",
    );
  });
});

function request(
  url: string,
  init: ConstructorParameters<typeof NextRequest>[1],
): NextRequest {
  return new NextRequest(url, init);
}

function subscriptionEvent() {
  return {
    id: "sub_123",
    customer: { id: "cus_123", email: "sam@example.com", deleted: false },
    metadata: { user_id: "user-1" },
    status: "active",
    cancel_at_period_end: false,
    canceled_at: null,
    current_period_start: 1770000000,
    current_period_end: 1772600000,
    items: {
      data: [
        {
          price: {
            id: "price_monthly",
            metadata: { slothing_product: "pro_monthly" },
          },
        },
      ],
    },
  };
}
