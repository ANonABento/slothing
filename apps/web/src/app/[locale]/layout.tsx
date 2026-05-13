import "../globals.css";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { GeistSans } from "geist/font/sans";
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

// Geist Sans ships from Vercel's `geist` package (next/font/google doesn't expose it on Next 14.2).
// GeistSans.variable already maps to --font-geist-sans; alias to --font-geist via className.
const geistVariable = GeistSans.variable;
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500"],
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["700"],
  display: "swap",
});

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
      hrefLang={language}
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
  // Only forward the per-request nonce to the inline script in production,
  // where the CSP actually consumes it. In dev the CSP falls back to
  // 'unsafe-inline' (see lib/security/headers.ts), and emitting the dynamic
  // nonce attribute causes a hydration mismatch on every page render.
  const nonce =
    process.env.NODE_ENV === "production"
      ? (requestHeaders.get(CSP_NONCE_HEADER) ?? undefined)
      : undefined;
  const routePath = requestHeaders.get(CANONICAL_ROUTE_PATH_HEADER) ?? "/";

  const fontClassName = `${geistVariable} ${jetbrainsMono.variable} ${outfit.variable}`;

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      data-palette="cream"
      data-accent="rust"
      data-display="outfit"
      data-radius="soft"
      className={fontClassName}
      style={
        themeTokensToCssVariables(getTheme("slothing").light) as CSSProperties
      }
    >
      <head>
        <AlternateLanguageLinks path={routePath} />
        <script
          {...(nonce ? { nonce } : {})}
          dangerouslySetInnerHTML={{ __html: getThemePreloadScript() }}
        />
      </head>
      <body className="font-body">
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
