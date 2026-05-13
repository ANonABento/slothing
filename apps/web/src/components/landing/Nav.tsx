"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/use-theme";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  const { isDark, toggleDark } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rule bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-wrap items-center justify-between gap-6 px-5 py-[18px] md:px-10 md:py-[22px]">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[22px] font-bold tracking-display text-ink"
        >
          <Image
            src="/landing/logo.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          Slothing
        </Link>

        <nav className="hidden items-center gap-7 text-[14px] text-ink-2 md:flex">
          <a href="#features" className="hover:text-ink">
            Product
          </a>
          <a href="#how" className="hover:text-ink">
            How it works
          </a>
          <a href="#pricing" className="hover:text-ink">
            Pricing
          </a>
          <a
            href="https://github.com/ANonABento/slothing"
            className="hover:text-ink"
          >
            Open source
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleDark}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rule bg-paper text-ink transition-colors hover:border-rule-strong"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <Link
            href="/sign-in"
            className="hidden text-[14px] text-ink-2 hover:text-ink md:inline"
          >
            Sign in
          </Link>
          <Button asChild size="sm">
            <Link href="/sign-in">Get started free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
