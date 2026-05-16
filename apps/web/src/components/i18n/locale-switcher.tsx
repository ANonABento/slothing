"use client";

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

// Two-character display label per locale. Avoids the awkward "ZH-CN"/"PT-BR"
// chrome look when capitalized; callers wanting the full code should fall back
// to the locale value directly.
const localeShortLabel: Record<AppLocale, string> = {
  en: "EN",
  es: "ES",
  "zh-CN": "中",
  "pt-BR": "PT",
  hi: "हि",
  fr: "FR",
  ja: "日",
  ko: "한",
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
          // h-9 matches the marketing navbar's Sign In / Get Started
          // controls so the trigger sits on the same baseline. h-11
          // overhung the navbar and visually collided with the brand
          // subtitle below it. Globe icon dropped — the two-letter
          // code (EN / FR / 日 …) reads as language without it.
          className="h-9 w-auto gap-1 px-2.5 [&>span]:line-clamp-none"
          lang={localeLang[locale]}
        >
          <span className="text-xs font-semibold uppercase tracking-wide">
            {localeShortLabel[locale]}
          </span>
          {/* SelectValue carries the full language name for screen readers; */}
          {/* the visible chip stays compact via the localeShortLabel above. */}
          <span className="sr-only">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent align="end">
          <LocaleSwitcherItems />
        </SelectContent>
      </Select>
    </div>
  );
}
