import type { CSSProperties } from "react";
import "./globals.css";
import { headers } from "next/headers";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isAppLocale, localeDir } from "@/i18n";
import { ensureEnvValidated } from "@/lib/env";
import { getSiteMetadata } from "@/lib/seo";
import { themeTokensToCssVariables } from "@/lib/theme/apply";
import { getThemePreloadScript } from "@/lib/theme/preload-script";
import { getTheme } from "@/lib/theme/registry";

ensureEnvValidated();

export const metadata = getSiteMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestLocale = headers().get("x-next-intl-locale") ?? undefined;
  const locale = isAppLocale(requestLocale) ? requestLocale : defaultLocale;

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
        <script dangerouslySetInnerHTML={{ __html: getThemePreloadScript() }} />
      </head>
      <body className="font-sans">
        <AuthSessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
