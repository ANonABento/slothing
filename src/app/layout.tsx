import type { CSSProperties } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ensureEnvValidated } from "@/lib/env";
import { getSiteMetadata } from "@/lib/seo";
import { themeTokensToCssVariables } from "@/lib/theme/apply";
import { getTheme } from "@/lib/theme/registry";
import { AuthSessionProvider } from "@/components/auth/session-provider";

ensureEnvValidated();

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
      style={themeTokensToCssVariables(getTheme("default").light) as CSSProperties}
    >
      <body className="font-sans">
        <AuthSessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
