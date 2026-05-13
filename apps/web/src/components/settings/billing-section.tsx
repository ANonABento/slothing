"use client";

import { CreditCard } from "lucide-react";

import { PortalButton } from "@/components/billing/billing-actions";
import { CreditHistory } from "@/components/billing/credit-status";
import { PageSection } from "@/components/ui/page-layout";

export function BillingSection() {
  return (
    <div className="space-y-6">
      <PageSection
        icon={CreditCard}
        title="Billing"
        description="Manage your Slothing Pro subscription, payment method, invoices, and cancellation through Stripe."
      >
        <PortalButton className="max-w-xs" />
      </PageSection>
      <CreditHistory />
    </div>
  );
}
