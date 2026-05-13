import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { isAuthError, requireAuth } from "@/lib/auth";
import {
  getStripeCustomerByStripeId,
  getStripeCustomerByUserId,
  markSubscriptionDeleted,
  upsertStripeCustomer,
  upsertSubscription,
  type SubscriptionStatus,
} from "@/lib/db/subscriptions";
import { grantPlanCredits } from "@/lib/db/credits";
import { toNullableIso } from "@/lib/format/time";

import { getPlanByKey, getStripe } from "./stripe-client";
import { getActivePriceForPlan, getPlanKeyFromPrice } from "./stripe-products";

export const BILLING_RETURN_PATH = "/settings";

export async function createCheckoutSession(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json().catch(() => ({}));
    const planKey = typeof body.plan === "string" ? body.plan : "";
    const plan = getPlanByKey(planKey);
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid billing plan" },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const existingCustomer = getStripeCustomerByUserId(authResult.userId);
    const priceId = await getActivePriceForPlan(plan);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: existingCustomer?.stripeCustomerId,
      client_reference_id: authResult.userId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: new URL(
        `${BILLING_RETURN_PATH}?billing=success`,
        request.nextUrl.origin,
      ).toString(),
      cancel_url: new URL(
        `${BILLING_RETURN_PATH}?billing=cancelled`,
        request.nextUrl.origin,
      ).toString(),
      metadata: {
        user_id: authResult.userId,
        plan_key: plan.productKey,
      },
      subscription_data: {
        metadata: {
          user_id: authResult.userId,
          plan_key: plan.productKey,
        },
      },
      allow_promotion_codes: true,
    });

    if (session.customer && typeof session.customer === "string") {
      upsertStripeCustomer({
        userId: authResult.userId,
        stripeCustomerId: session.customer,
        email: session.customer_details?.email ?? null,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to start checkout" },
      { status: 500 },
    );
  }
}

export async function createCustomerPortalSession(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const customer = getStripeCustomerByUserId(authResult.userId);
    if (!customer) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 },
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: new URL(
        BILLING_RETURN_PATH,
        request.nextUrl.origin,
      ).toString(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create customer portal session error:", error);
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 500 },
    );
  }
}

export async function handleStripeWebhook(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await syncSubscription(event.data.object);
        break;
      case "customer.subscription.deleted":
        markSubscriptionDeleted(
          event.data.object.id,
          unixToIso(event.data.object.canceled_at),
        );
        break;
      case "invoice.paid":
        await syncInvoiceSubscription(event.data.object);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    return NextResponse.json(
      { error: "Failed to process Stripe webhook" },
      { status: 500 },
    );
  }
}

async function syncInvoiceSubscription(invoice: Stripe.Invoice) {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const subscription = await getStripe().subscriptions.retrieve(
    subscriptionId,
    {
      expand: ["items.data.price.product", "customer"],
    },
  );
  const synced = await syncSubscription(subscription);
  if (synced) {
    grantPlanCredits(synced.userId, synced.planKey, invoice.id);
  }
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  if (!customerId) return null;

  const userId = await resolveUserIdForSubscription(subscription, customerId);
  if (!userId) return null;

  const price = subscription.items.data[0]?.price;
  const planKey = price ? getPlanKeyFromPrice(price) : null;
  if (!planKey) return null;

  upsertStripeCustomer({
    userId,
    stripeCustomerId: customerId,
    email: getCustomerEmail(subscription.customer),
  });

  return upsertSubscription({
    id: subscription.id,
    userId,
    stripeCustomerId: customerId,
    planKey,
    status: subscription.status as SubscriptionStatus,
    stripePriceId: price.id,
    currentPeriodStart: unixToIso(getSubscriptionPeriod(subscription, "start")),
    currentPeriodEnd: unixToIso(getSubscriptionPeriod(subscription, "end")),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: unixToIso(subscription.canceled_at),
  });
}

async function resolveUserIdForSubscription(
  subscription: Stripe.Subscription,
  customerId: string,
): Promise<string | null> {
  const metadataUserId = subscription.metadata.user_id;
  if (metadataUserId) return metadataUserId;

  const customer = getStripeCustomerByStripeId(customerId);
  if (customer) return customer.userId;

  const checkoutSession = await findCheckoutSessionForSubscription(
    subscription.id,
  );
  return (
    checkoutSession?.client_reference_id ??
    checkoutSession?.metadata?.user_id ??
    null
  );
}

async function findCheckoutSessionForSubscription(subscriptionId: string) {
  const sessions = await getStripe().checkout.sessions.list({
    subscription: subscriptionId,
    limit: 1,
  });
  return sessions.data[0] ?? null;
}

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
) {
  return typeof customer === "string" ? customer : customer.id;
}

function getCustomerEmail(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
) {
  if (typeof customer === "string" || customer.deleted) return null;
  return customer.email ?? null;
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = invoice.parent;
  if (parent?.type === "subscription_details") {
    const subscription = parent.subscription_details?.subscription;
    if (!subscription) return null;
    return typeof subscription === "string" ? subscription : subscription.id;
  }

  const legacyInvoice = invoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null;
  };
  const subscription = legacyInvoice.subscription;
  if (!subscription) return null;
  return typeof subscription === "string" ? subscription : subscription.id;
}

function getSubscriptionPeriod(
  subscription: Stripe.Subscription,
  field: "start" | "end",
) {
  const legacySubscription = subscription as Stripe.Subscription & {
    current_period_start?: number | null;
    current_period_end?: number | null;
  };

  if (field === "start") return legacySubscription.current_period_start ?? null;
  return legacySubscription.current_period_end ?? null;
}

function unixToIso(value: number | null | undefined): string | null {
  return typeof value === "number" ? toNullableIso(value * 1000) : null;
}
