import type Stripe from "stripe";

import { getStripe, type PlanConfig, type PlanKey } from "./stripe-client";

export async function getActivePriceForPlan(plan: PlanConfig): Promise<string> {
  const stripe = getStripe();
  const product = await findProductByPlanKey(stripe, plan.productKey);
  if (!product) {
    throw new Error(
      `Stripe product for ${plan.productKey} is missing. Run pnpm --filter @slothing/web stripe:setup.`,
    );
  }

  if (typeof product.default_price === "string") {
    return product.default_price;
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 10,
  });
  const match = prices.data.find(
    (price) =>
      price.unit_amount === plan.amountCents &&
      price.currency === plan.currency &&
      price.recurring?.interval === plan.interval,
  );
  if (!match) {
    throw new Error(
      `Stripe price for ${plan.productKey} is missing. Run pnpm --filter @slothing/web stripe:setup.`,
    );
  }
  return match.id;
}

export function getPlanKeyFromPrice(price: Stripe.Price): PlanKey | null {
  const metadataValue = price.metadata.slothing_product;
  if (metadataValue === "pro_monthly" || metadataValue === "pro_weekly") {
    return metadataValue;
  }

  const product = price.product;
  if (
    typeof product === "object" &&
    product !== null &&
    !product.deleted &&
    (product.metadata.slothing_product === "pro_monthly" ||
      product.metadata.slothing_product === "pro_weekly")
  ) {
    return product.metadata.slothing_product;
  }

  return null;
}

async function findProductByPlanKey(stripe: Stripe, planKey: PlanKey) {
  for await (const product of stripe.products.list({
    active: true,
    limit: 100,
  })) {
    if (product.metadata.slothing_product === planKey) return product;
  }
  return null;
}
