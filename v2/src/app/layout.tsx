import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Outfit } from "next/font/google";

import { Sidebar } from "@/components/sidebar";
import { llmInfo } from "@/lib/llm";
import "./globals.css";

const display = Outfit({ subsets: ["latin"], variable: "--font-display" });
const body = Geist({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Slothing", description: "You're not lazy. Your job search system is." };

// Light (cream) is the default, as in v1. Runs before paint so a stored dark choice doesn't flash.
const THEME_SCRIPT = `try{if(localStorage.getItem("slothing:theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
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
