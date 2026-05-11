import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { defineRouting } from "next-intl/routing";

export { localeDir } from "@/i18n/dir";

export const locales = [
  "en",
  "es",
  "zh-CN",
  "pt-BR",
  "hi",
  "fr",
  "ja",
  "ko",
] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale = "en" satisfies AppLocale;
export const localePrefix = "always" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
  },
});

export function isAppLocale(locale: string | undefined): locale is AppLocale {
  return Boolean(locale && locales.includes(locale as AppLocale));
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!isAppLocale(locale)) {
    notFound();
  }

  return {
    locale,
    timeZone: "UTC",
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
