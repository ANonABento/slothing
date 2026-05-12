"use client";

import { Cpu, ExternalLink, Key } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageIconTile, PagePanel } from "@/components/ui/page-layout";

export function HelpCards() {
  const t = useTranslations("settings.help");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PagePanel className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <PageIconTile icon={Cpu} className="bg-success/10 text-success" />
          <h3 className="font-semibold">{t("ollama.title")}</h3>
        </div>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            {t("ollama.installFrom")}{" "}
            <a
              href="https://ollama.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 font-medium inline-flex items-center gap-1"
            >
              ollama.ai <ExternalLink className="h-3 w-3" />
            </a>
          </li>
          <li>
            {t("ollama.run")}{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              ollama pull llama3.2
            </code>
          </li>
          <li>{t("ollama.testConnection")}</li>
        </ol>
      </PagePanel>

      <PagePanel className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <PageIconTile icon={Key} />
          <h3 className="font-semibold">{t("apiKeys.title")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("apiKeys.description")}
        </p>
      </PagePanel>
    </div>
  );
}
