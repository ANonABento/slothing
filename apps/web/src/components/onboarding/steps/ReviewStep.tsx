"use client";

import { FileText, User, Briefcase, GraduationCap, Code } from "lucide-react";
import { useTranslations } from "next-intl";

const SECTIONS = [
  { icon: User, labelKey: "contactInfo" },
  { icon: Briefcase, labelKey: "workExperience" },
  { icon: GraduationCap, labelKey: "education" },
  { icon: Code, labelKey: "skillsProjects" },
] as const;

export function ReviewStep() {
  const t = useTranslations("onboarding.steps.review");

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg mb-6">
        <FileText className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <p className="text-base mt-2 text-muted-foreground">{t("description")}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {SECTIONS.map(({ icon: Icon, labelKey }) => (
          <div
            key={labelKey}
            className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground"
          >
            <Icon className="h-4 w-4 text-primary" />
            {t(`sections.${labelKey}`)}
          </div>
        ))}
      </div>
    </div>
  );
}
