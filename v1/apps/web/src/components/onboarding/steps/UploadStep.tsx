"use client";

import { Upload, FileUp } from "lucide-react";
import { useTranslations } from "next-intl";

export function UploadStep() {
  const t = useTranslations("onboarding.steps.upload");

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg mb-6">
        <Upload className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <p className="text-base mt-2 text-muted-foreground">{t("description")}</p>
      <div className="mt-6 rounded-xl border-2 border-dashed border-muted-foreground/25 p-8 flex flex-col items-center gap-3 text-muted-foreground">
        <FileUp className="h-8 w-8" />
        <p className="text-sm">
          {t.rich("dropHint", {
            documents: (chunks) => (
              <span className="font-medium text-primary">{chunks}</span>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
