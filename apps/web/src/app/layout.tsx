import type { CSSProperties } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteMetadata } from "@/lib/seo";
import { themeTokensToCssVariables } from "@/lib/theme/apply";
import { getThemePreloadScript } from "@/lib/theme/preload-script";
import { getTheme } from "@/lib/theme/registry";
import { AuthSessionProvider } from "@/components/auth/session-provider";

export const metadata = getSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
