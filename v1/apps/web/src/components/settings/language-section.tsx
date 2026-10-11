"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcherDropdown } from "@/components/i18n/locale-switcher";
import { PageSection } from "@/components/ui/page-layout";

export function LanguageSection() {
  const t = useTranslations("settings.language");

  return (
    <PageSection
      title={t("title")}
      description={t("description")}
      icon={Languages}
    >
      <LocaleSwitcherDropdown />
    </PageSection>
  );
}
