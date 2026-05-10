"use client";

import { Loader2, Settings } from "lucide-react";
import { DataManagement } from "@/components/settings/data-management";
import { EvalHealthSection } from "@/components/settings/eval-health-section";
import { GoogleIntegration } from "@/components/settings/google-integration";
import { HelpCards } from "@/components/settings/help-cards";
import { KanbanLanesSection } from "@/components/settings/kanban-lanes-section";
import { LLMProviderConfig } from "@/components/settings/llm-provider-config";
import { LocaleSection } from "@/components/settings/locale-section";
import { LanguageSection } from "@/components/settings/language-section";
import {
  LLMProviderSelector,
  PROVIDERS,
} from "@/components/settings/llm-provider-selector";
import { OllamaWarning } from "@/components/settings/ollama-warning";
import { OpportunityReviewSection } from "@/components/settings/opportunity-review-section";
import { ThemeSection } from "@/components/settings/theme-section";
import { WhatAiPowers } from "@/components/settings/what-ai-powers";
import { PromptVariantsSection } from "@/components/settings/prompt-variants-section";
import {
  AppPage,
  PageContent,
  PageHeader,
  PageLoadingState,
} from "@/components/ui/page-layout";
import { useDataIO } from "./use-data-io";
import { useLLMSettings } from "./use-llm-settings";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const llmSettings = useLLMSettings();
  const dataIO = useDataIO();
  const selectedProvider = PROVIDERS.find(
    (provider) => provider.value === llmSettings.config.provider,
  );

  if (llmSettings.loading) {
    return <PageLoadingState icon={Loader2} label={t("loading")} />;
  }

  return (
    <AppPage>
      <PageHeader
        width="wide"
        icon={Settings}
        title={t("title")}
        description={t("description")}
      />

      <PageContent width="wide">
        <div className="space-y-8">
          <div className="space-y-6">
            <LLMProviderSelector
              provider={llmSettings.config.provider}
              apiKey={llmSettings.config.apiKey}
              onProviderChange={llmSettings.updateConfig}
            />
            {llmSettings.config.provider === "ollama" && <OllamaWarning />}
            <div className="grid gap-6 lg:grid-cols-2">
              <LLMProviderConfig
                config={llmSettings.config}
                selectedProvider={selectedProvider}
                models={llmSettings.availableModels}
                saving={llmSettings.saving}
                testing={llmSettings.testing}
                hasChanges={llmSettings.hasChanges}
                testResult={llmSettings.testResult}
                onConfigChange={llmSettings.updateConfig}
                onSave={() => void llmSettings.saveSettings()}
                onTestConnection={() => void llmSettings.testConnection()}
              />
              <WhatAiPowers />
            </div>
            <PromptVariantsSection />
            <HelpCards />
            <EvalHealthSection />
          </div>

          <div className="space-y-6">
            <ThemeSection />
            <div className="grid gap-6 lg:grid-cols-2">
              <LocaleSection />
              <LanguageSection />
            </div>
            <OpportunityReviewSection />
            <KanbanLanesSection />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DataManagement
              exporting={dataIO.exporting}
              importing={dataIO.importing}
              importResult={dataIO.importResult}
              showImportPreview={dataIO.showImportPreview}
              onExport={(type) => void dataIO.exportData(type)}
              onImportFile={dataIO.handleFileImport}
              onFullImportPreview={dataIO.handleFullImportPreview}
              onConfirmFullImport={dataIO.confirmFullImport}
              onCancelImportPreview={dataIO.clearImportPreview}
            />
            <GoogleIntegration />
          </div>
        </div>
      </PageContent>
    </AppPage>
  );
}
