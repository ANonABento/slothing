import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { isAppLocale, locales, type AppLocale } from "@/i18n";
import { getAlternateLanguages } from "@/lib/seo";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Metadata {
  if (!isAppLocale(params.locale)) {
    return {};
  }

  return {
    alternates: {
      canonical: `/${params.locale}`,
      languages: getAlternateLanguages("/"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  if (!isAppLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as AppLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
