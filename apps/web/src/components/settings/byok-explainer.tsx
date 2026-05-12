"use client";

import { KeyRound, ShieldCheck, Sparkles, Wallet } from "lucide-react";

import { PageSection } from "@/components/ui/page-layout";

export function ByokExplainer() {
  return (
    <PageSection
      title="Bring Your Own Key (BYOK)"
      description="Run Slothing AI features against your own LLM provider — no credits from us, no markup. Your key is the only billing relationship."
      icon={KeyRound}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <BenefitCard
          icon={Wallet}
          title="Free on hosted"
          body="On the Hosted Free tier, BYOK is the only way to use AI features. You pay your LLM provider directly — nothing to us."
        />
        <BenefitCard
          icon={Sparkles}
          title="Any provider"
          body="OpenAI, Anthropic, OpenRouter, or a local Ollama instance. Switch any time without losing your account."
        />
        <BenefitCard
          icon={ShieldCheck}
          title="Encrypted at rest"
          body="Your key is encrypted in our database and only ever sent to the provider you chose. We never call your key from any other context."
        />
      </div>
      <p className="mt-4 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
        <strong className="font-medium text-foreground">Self-hosting?</strong>{" "}
        Slothing reads keys from the same settings table when running locally,
        but they never leave your machine — your database is on your disk.
      </p>
    </PageSection>
  );
}

interface BenefitCardProps {
  icon: typeof Wallet;
  title: string;
  body: string;
}

function BenefitCard({ icon: Icon, title, body }: BenefitCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Icon className="mb-2 h-5 w-5 text-primary" />
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
