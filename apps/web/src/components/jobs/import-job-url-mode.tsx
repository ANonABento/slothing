"use client";

import { Link } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImportJobActions } from "./import-job-actions";

interface ImportJobUrlModeProps {
  jobUrl: string;
  fetchingUrl: boolean;
  onJobUrlChange: (value: string) => void;
  onCancel: () => void;
  onFetch: () => void;
}

export function ImportJobUrlMode({
  jobUrl,
  fetchingUrl,
  onJobUrlChange,
  onCancel,
  onFetch,
}: ImportJobUrlModeProps) {
  const t = useTranslations("jobs.import.urlMode");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t("jobUrlLabel")}</Label>
        <Input
          value={jobUrl}
          onChange={(e) => onJobUrlChange(e.target.value)}
          placeholder={t("jobUrlPlaceholder")}
        />
        <p className="text-xs text-muted-foreground">{t("jobUrlHelp")}</p>
      </div>

      <div className="rounded-md bg-warning/10 border-[length:var(--border-width)] border-warning/20 p-3 text-sm text-warning">
        {t("fetchingNote")}
      </div>

      <ImportJobActions
        disabled={fetchingUrl || !jobUrl.trim()}
        loading={fetchingUrl}
        icon={Link}
        submitLabel={t("actions.fetch")}
        onCancel={onCancel}
        onSubmit={onFetch}
      />
    </div>
  );
}
