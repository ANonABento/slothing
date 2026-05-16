"use client";

import { Bot } from "lucide-react";
import { BentoRouterSettingsSection } from "@/components/settings/llm/bentorouter-settings-section";
import { PromptVariantsSection } from "@/components/settings/prompt-variants-section";
import { AppPage, PageContent, PageHeader } from "@/components/ui/page-layout";

export default function SettingsLLMPage() {
  return (
    <AppPage>
      <PageHeader
        width="wide"
        icon={Bot}
        title="AI providers"
        description="Manage provider keys, task policies, and usage."
      />
      <PageContent width="wide" className="space-y-6">
        <BentoRouterSettingsSection />
        <PromptVariantsSection />
      </PageContent>
    </AppPage>
  );
}
