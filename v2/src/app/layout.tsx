import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Outfit } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const display = Outfit({ subsets: ["latin"], variable: "--font-display" });
const body = Geist({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = { title: "Slothing", description: "You're not lazy. Your job search system is." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <header className="border-b border-rule">
          <nav className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
            <Link href="/" className="font-display text-lg font-semibold tracking-tight">
              slothing<span className="text-brand">.</span>
            </Link>
            <Link href="/" className="text-sm text-ink-2 hover:text-ink">Jobs</Link>
            <Link href="/profile" className="text-sm text-ink-2 hover:text-ink">Profile</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
