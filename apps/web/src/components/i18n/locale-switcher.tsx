"use client";

import { Globe2 } from "lucide-react";
import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales, type AppLocale } from "@/i18n";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const localeLang: Record<AppLocale, string> = {
  en: "en",
  es: "es",
  "zh-CN": "zh-CN",
  "pt-BR": "pt-BR",
  hi: "hi",
  fr: "fr",
  ja: "ja",
  ko: "ko",
};

function useLocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: string) {
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    router.replace(pathname, { locale: nextLocale as AppLocale });
  }

  return { locale, switchLocale };
}

function LocaleSwitcherItems() {
  const t = useTranslations("settings.language.options");

  return locales.map((option) => (
    <SelectItem key={option} value={option} lang={localeLang[option]}>
      {t(option)}
    </SelectItem>
  ));
}

type LocaleSwitcherDropdownProps = {
  className?: string;
};

export function LocaleSwitcherDropdown({
  className,
}: LocaleSwitcherDropdownProps) {
  const t = useTranslations("settings.language");
  const { locale, switchLocale } = useLocaleSwitcher();

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger aria-label={t("label")} className={className}>
        <SelectValue placeholder={t("label")} />
      </SelectTrigger>
      <SelectContent>
        <LocaleSwitcherItems />
      </SelectContent>
    </Select>
  );
}

type LocaleSwitcherCompactProps = {
  className?: string;
};

export function LocaleSwitcherCompact({
  className,
}: LocaleSwitcherCompactProps) {
  const t = useTranslations("marketing.nav.languageSwitcher");
  const { locale, switchLocale } = useLocaleSwitcher();
  const descriptionId = useId();

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span id={descriptionId} className="sr-only">
        {t("description")}
      </span>
      <Select value={locale} onValueChange={switchLocale}>
        <SelectTrigger
          aria-label={t("label")}
          aria-describedby={descriptionId}
          className="h-11 w-11 justify-center px-0 [&>svg:last-child]:hidden"
        >
          <Globe2 className="h-5 w-5" aria-hidden="true" />
          <SelectValue className="sr-only" />
        </SelectTrigger>
        <SelectContent align="end">
          <LocaleSwitcherItems />
        </SelectContent>
      </Select>
    </div>
  );
}
