import type { CSSProperties } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ensureEnvValidated } from "@/lib/env";
import { getSiteMetadata } from "@/lib/seo";
import { CSP_NONCE_HEADER } from "@/lib/security/headers";
import { themeTokensToCssVariables } from "@/lib/theme/apply";
import { getThemePreloadScript } from "@/lib/theme/preload-script";
import { getTheme } from "@/lib/theme/registry";
import { AuthSessionProvider } from "@/components/auth/session-provider";

ensureEnvValidated();

export const metadata = getSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = headers().get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <html
      lang="en"
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
          <ThemeProvider>{children}</ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
