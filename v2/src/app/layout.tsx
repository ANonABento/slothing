import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Outfit } from "next/font/google";

import { Sidebar } from "@/components/sidebar";
import { getSettings } from "@/lib/db";
import { llmInfo } from "@/lib/llm";
import "./globals.css";

const display = Outfit({ subsets: ["latin"], variable: "--font-display" });
const body = Geist({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Slothing", description: "You're not lazy. Your job search system is." };

// The theme is rendered server-side from Settings. Only "system" needs the OS preference, so this
// runs before paint (no flash) and keeps following the OS while the page is open.
const SYSTEM_THEME_SCRIPT = `(function(){var h=document.documentElement;if(h.dataset.mode!=="system")return;var m=matchMedia("(prefers-color-scheme: dark)");function s(){if(h.dataset.mode==="system")h.dataset.theme=m.matches?h.dataset.dark:h.dataset.light}s();m.addEventListener("change",s)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { appearance } = getSettings();
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      data-theme={appearance.mode === "dark" ? appearance.dark : appearance.light}
      data-mode={appearance.mode}
      data-light={appearance.light}
      data-dark={appearance.dark}
      // The system-theme script may change data-theme before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SYSTEM_THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
          <Sidebar llm={llmInfo()} />
          <main className="min-w-0 flex-1 lg:overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
