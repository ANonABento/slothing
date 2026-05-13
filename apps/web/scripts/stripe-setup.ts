#!/usr/bin/env tsx
/**
 * Idempotent Stripe product + price provisioner for Slothing Cloud.
 * Run once per Stripe account (test or live) before going live.
 *
 *   pnpm --filter @slothing/web stripe:setup
 *   pnpm --filter @slothing/web stripe:setup --write-config
 *
 * Identifies products it owns via metadata.slothing_product = pro_monthly | pro_weekly.
 * Re-running is safe: existing products are reused; mismatched prices trigger a new
 * price + default_price swap (Stripe prices are immutable, the old one is archived).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  getStripe,
  PLANS,
  type PlanConfig,
} from "../src/cloud/billing/stripe-client";

const WRITE_CONFIG = process.argv.includes("--write-config");
const CONFIG_PATH = join(
  process.cwd(),
  "src",
  "cloud",
  "billing",
  "stripe-config.json",
);

interface ProvisionedPlan {
  productKey: PlanConfig["productKey"];
  productId: string;
  priceId: string;
}

async function findProduct(plan: PlanConfig) {
  const stripe = getStripe();
  // List is more reliable than search (search has ~1min indexing lag).
  for await (const product of stripe.products.list({
    active: true,
    limit: 100,
  })) {
    if (product.metadata.slothing_product === plan.productKey) return product;
  }
  return null;
}

async function findOrCreateProduct(plan: PlanConfig) {
  const stripe = getStripe();
  const existing = await findProduct(plan);
  if (existing) {
    if (
      existing.name !== plan.name ||
      existing.description !== plan.description
    ) {
      console.log(`  -> updating product metadata for ${plan.productKey}`);
      return stripe.products.update(existing.id, {
        name: plan.name,
        description: plan.description,
      });
    }
    console.log(`  OK reusing product ${existing.id} (${plan.productKey})`);
    return existing;
  }
  console.log(`  + creating product ${plan.productKey}`);
  return stripe.products.create({
    name: plan.name,
    description: plan.description,
    metadata: { slothing_product: plan.productKey },
  });
}

async function findOrCreatePrice(productId: string, plan: PlanConfig) {
  const stripe = getStripe();
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  const match = prices.data.find(
    (p) =>
      p.unit_amount === plan.amountCents &&
      p.currency === plan.currency &&
      p.recurring?.interval === plan.interval,
  );
  if (match) {
    console.log(`  OK reusing price ${match.id}`);
    return match;
  }
  console.log(
    `  + creating price for ${plan.productKey} (${plan.amountCents} cents / ${plan.interval})`,
  );
  const created = await stripe.prices.create({
    product: productId,
    unit_amount: plan.amountCents,
    currency: plan.currency,
    recurring: { interval: plan.interval },
    metadata: { slothing_product: plan.productKey },
  });
  for (const stale of prices.data) {
    console.log(`  - archiving stale price ${stale.id}`);
    await stripe.prices.update(stale.id, { active: false });
  }
  return created;
}

async function ensureDefaultPrice(productId: string, priceId: string) {
  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  if (product.default_price !== priceId) {
    console.log(`  -> setting default_price=${priceId}`);
    await stripe.products.update(productId, { default_price: priceId });
  }
}

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local first (use a test key for dev).",
    );
    process.exit(1);
  }
  console.log("Provisioning Stripe products + prices for Slothing Cloud...\n");
  const provisioned: ProvisionedPlan[] = [];
  for (const plan of PLANS) {
    console.log(
      `Plan: ${plan.name} ($${(plan.amountCents / 100).toFixed(2)} / ${plan.interval})`,
    );
    const product = await findOrCreateProduct(plan);
    const price = await findOrCreatePrice(product.id, plan);
    await ensureDefaultPrice(product.id, price.id);
    provisioned.push({
      productKey: plan.productKey,
      productId: product.id,
      priceId: price.id,
    });
    console.log("");
  }
  console.log("Done. Price IDs:");
  for (const p of provisioned) {
    console.log(`  ${p.productKey}: ${p.priceId}`);
  }
  if (WRITE_CONFIG) {
    writeFileSync(CONFIG_PATH, `${JSON.stringify(provisioned, null, 2)}\n`);
    console.log(`\nWrote ${CONFIG_PATH} (gitignored).`);
  } else {
    console.log(
      "\nTip: re-run with --write-config to persist these to stripe-config.json.",
    );
  }
}

main().catch((err) => {
  console.error("stripe-setup failed:", err);
  process.exit(1);
});
