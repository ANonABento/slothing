"use client";

import { CreditCard } from "lucide-react";

import { PortalButton } from "@/components/billing/billing-actions";

export function BillingSection() {
  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">Billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your Slothing Pro subscription, payment method, invoices,
            and cancellation through Stripe.
          </p>
          <PortalButton className="mt-4 max-w-xs" />
        </div>
      </div>
    </section>
  );
}
