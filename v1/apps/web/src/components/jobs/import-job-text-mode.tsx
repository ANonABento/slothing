"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImportJobActions } from "./import-job-actions";

interface ImportJobTextModeProps {
  jobUrl: string;
  jobText: string;
  parsing: boolean;
  onJobUrlChange: (value: string) => void;
  onJobTextChange: (value: string) => void;
  onCancel: () => void;
  onParse: () => void;
}

export function ImportJobTextMode({
  jobUrl,
  jobText,
  parsing,
  onJobUrlChange,
  onJobTextChange,
  onCancel,
  onParse,
}: ImportJobTextModeProps) {
  const t = useTranslations("jobs.import.textMode");

  return (
    <>
      <div className="space-y-2">
        <Label>{t("jobUrlLabel")}</Label>
        <Input
          value={jobUrl}
          onChange={(e) => onJobUrlChange(e.target.value)}
          placeholder={t("jobUrlPlaceholder")}
        />
        <p className="text-xs text-muted-foreground">{t("jobUrlHelp")}</p>
      </div>

      <div className="space-y-2">
        <Label>{t("jobContentLabel")}</Label>
        <Textarea
          rows={12}
          value={jobText}
          onChange={(e) => onJobTextChange(e.target.value)}
          placeholder={t("jobContentPlaceholder")}
          className="resize-none font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">{t("jobContentHelp")}</p>
      </div>

      <ImportJobActions
        disabled={parsing || !jobText.trim()}
        loading={parsing}
        icon={Sparkles}
        submitLabel={t("actions.parse")}
        onCancel={onCancel}
        onSubmit={onParse}
      />
    </>
  );
}
