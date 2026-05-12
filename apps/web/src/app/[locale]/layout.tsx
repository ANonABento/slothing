import "../globals.css";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { isAppLocale, localeDir, locales, type AppLocale } from "@/i18n";
import { ensureEnvValidated } from "@/lib/env";
import {
  CANONICAL_ROUTE_PATH_HEADER,
  getAlternateLanguages,
  getMetadataBase,
  getSiteMetadata,
} from "@/lib/seo";
import { CSP_NONCE_HEADER } from "@/lib/security/headers";
import { themeTokensToCssVariables } from "@/lib/theme/apply";
import { getThemePreloadScript } from "@/lib/theme/preload-script";
import { getTheme } from "@/lib/theme/registry";

ensureEnvValidated();

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
  const siteMetadata = getSiteMetadata();

  if (!isAppLocale(params.locale)) {
    return siteMetadata;
  }

  return {
    ...siteMetadata,
    alternates: {
      canonical: `/${params.locale}`,
      languages: getAlternateLanguages("/"),
    },
  };
}

function AlternateLanguageLinks({ path }: { path: string }) {
  const metadataBase = getMetadataBase();

  return Object.entries(getAlternateLanguages(path)).map(([language, href]) => (
    <link
      key={`hreflang-${language}`}
      rel="alternate"
      href={new URL(href, metadataBase).toString()}
      {...({ hreflang: language } as Record<string, string>)}
    />
  ));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  if (!isAppLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as AppLocale;
  const messages = await getMessages({ locale });
  const requestHeaders = headers();
  const nonce = requestHeaders.get(CSP_NONCE_HEADER) ?? undefined;
  const routePath = requestHeaders.get(CANONICAL_ROUTE_PATH_HEADER) ?? "/";

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      style={
        themeTokensToCssVariables(getTheme("default").light) as CSSProperties
      }
    >
      <head>
        <AlternateLanguageLinks path={routePath} />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: getThemePreloadScript() }}
        />
      </head>
      <body className="font-sans">
        <AuthSessionProvider>
          <ThemeProvider>
            <NextIntlClientProvider
              locale={locale}
              messages={messages}
              timeZone="UTC"
            >
              {children}
            </NextIntlClientProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
