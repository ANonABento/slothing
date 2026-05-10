"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageSection } from "@/components/ui/page-layout";
import { locales, type AppLocale } from "@/i18n";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSection() {
  const t = useTranslations("settings.language");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  function handleLanguageChange(nextLocale: string) {
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    router.replace(pathname, { locale: nextLocale as AppLocale });
  }

  return (
    <PageSection
      title={t("title")}
      description={t("description")}
      icon={Languages}
    >
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger aria-label={t("label")}>
          <SelectValue placeholder={t("label")} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`options.${option}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PageSection>
  );
}
