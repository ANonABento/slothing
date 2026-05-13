import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Required when SLOTHING_CLOUD=1. See .env.example.',
    );
  }
  cached = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
    appInfo: {
      name: 'Slothing',
      url: 'https://slothing.work',
    },
  });
  return cached;
}

export const PRO_MONTHLY = {
  productKey: 'pro_monthly',
  name: 'Slothing Pro Monthly',
  description: 'Unlimited features, 1000 credits per month, priority email support.',
  amountCents: 1999,
  currency: 'usd',
  interval: 'month' as const,
  creditsPerCycle: 1000,
};

export const PRO_WEEKLY = {
  productKey: 'pro_weekly',
  name: 'Slothing Pro Weekly',
  description:
    'Same Pro features, billed weekly. 250 credits per week. Cancel any time - built for short job-search sprints.',
  amountCents: 699,
  currency: 'usd',
  interval: 'week' as const,
  creditsPerCycle: 250,
};

export const PLANS = [PRO_MONTHLY, PRO_WEEKLY] as const;
export type PlanConfig = (typeof PLANS)[number];
