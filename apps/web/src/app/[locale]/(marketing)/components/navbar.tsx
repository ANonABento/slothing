"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleSwitcherCompact } from "@/components/i18n/locale-switcher";
import { Link } from "@/i18n/navigation";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Extension", href: "/extension" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const callbackUrl = `/${locale}/dashboard`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm border-b py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-bg text-primary-foreground font-bold text-lg shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text">Slothing</span>
              <span className="text-2xs text-muted-foreground hidden sm:block">
                Resume Intelligence 怠惰
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              ),
            )}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcherCompact />
            <Button variant="ghost" asChild>
              <Link
                href={{ pathname: "/sign-in", query: { callbackUrl } }}
                prefetch={false}
              >
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="gradient-bg text-primary-foreground hover:opacity-90"
            >
              <Link
                href={{ pathname: "/sign-in", query: { callbackUrl } }}
                prefetch={false}
              >
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href.startsWith("#") ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    prefetch={false}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ),
              )}
              <LocaleSwitcherCompact className="mt-2" />
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" asChild>
                  <Link
                    href={{ pathname: "/sign-in", query: { callbackUrl } }}
                    prefetch={false}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="gradient-bg text-primary-foreground hover:opacity-90"
                >
                  <Link
                    href={{ pathname: "/sign-in", query: { callbackUrl } }}
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
