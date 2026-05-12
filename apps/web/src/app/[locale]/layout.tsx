import "../globals.css";
import type { CSSProperties } from "react";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { isAppLocale, localeDir, locales, type AppLocale } from "@/i18n";
import { ensureEnvValidated } from "@/lib/env";
import { getSiteMetadata } from "@/lib/seo";
import { CSP_NONCE_HEADER } from "@/lib/security/headers";
import { themeTokensToCssVariables } from "@/lib/theme/apply";
import { getThemePreloadScript } from "@/lib/theme/preload-script";
import { getTheme } from "@/lib/theme/registry";

ensureEnvValidated();

export const metadata = getSiteMetadata();

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
  const nonce = headers().get(CSP_NONCE_HEADER) ?? undefined;

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
