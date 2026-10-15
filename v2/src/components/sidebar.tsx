"use client";

import { Briefcase, Moon, Sparkles, Sun, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Eyebrow, IconButton, cx } from "./ui";

const GROUPS = [
  { label: "Pipeline", items: [{ href: "/", label: "Jobs", icon: Briefcase }] },
  { label: "You", items: [{ href: "/profile", label: "Profile", icon: UserRound }] },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" || path.startsWith("/jobs") : path.startsWith(href));

const THEME_EVENT = "slothing:theme";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  // Both toggles (mobile row + desktop footer) follow the <html> attribute, so they never disagree.
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);
  const flip = () => {
    const next = !dark;
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("slothing:theme", next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  const Icon = dark ? Sun : Moon;
  return (
    <IconButton onClick={flip} label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <Icon className="h-4 w-4" />
    </IconButton>
  );
}

export function Sidebar({ llm }: { llm: { provider: string; model: string } | null }) {
  const path = usePathname();
  return (
    <aside className="flex shrink-0 flex-col border-b border-rule bg-page lg:w-[248px] lg:border-b-0 lg:border-r">
      <div className="flex h-14 items-center justify-between gap-2 px-4 lg:h-bar lg:border-b lg:border-rule">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image src="/brand/slothing-mark.png" alt="" width={32} height={32} className="h-8 w-8 rounded-control" priority />
          <div className="min-w-0 leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">Slothing</div>
            <div className="hidden text-xs text-ink-3 lg:block">Job search workspace</div>
          </div>
        </Link>
        {/* Mobile: nav collapses into this row */}
        <nav className="flex items-center gap-1 lg:hidden">
          {GROUPS.flatMap((g) => g.items).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cx("flex h-9 items-center gap-1.5 rounded-control px-3 text-sm font-medium", isActive(path, href) ? "bg-paper text-ink shadow-paper" : "text-ink-2")}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>

      <nav className="hidden flex-1 flex-col px-3 py-2 lg:flex">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <Eyebrow className="px-2 pb-1.5 pt-4">{g.label}</Eyebrow>
            <div className="space-y-0.5">
              {g.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(path, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cx(
                      "flex h-10 items-center gap-2.5 rounded-control border px-2.5 text-nav font-medium transition-all",
                      active ? "border-rule bg-paper font-semibold text-ink shadow-paper-elevated" : "border-transparent text-ink-2 hover:border-rule hover:bg-paper hover:text-ink",
                    )}
                  >
                    <Icon className={cx("h-[18px] w-[18px]", active ? "text-brand" : "text-ink-3")} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="hidden space-y-2 border-t border-rule p-3 lg:block">
        <div className="flex items-start gap-2 rounded-control border border-rule bg-paper px-3 py-2.5 shadow-paper">
          <Sparkles className={cx("mt-0.5 h-4 w-4 shrink-0", llm ? "text-brand" : "text-ink-3")} />
          <div className="min-w-0 text-xs leading-snug">
            {llm ? (
              <>
                <div className="font-semibold text-ink">AI · {llm.provider}</div>
                <div className="truncate text-ink-3" title={llm.model}>{llm.model}</div>
              </>
            ) : (
              <>
                <div className="font-semibold text-ink">AI not connected</div>
                <div className="text-ink-3">Add a key to v2/.env.local</div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <Eyebrow>v2 · local</Eyebrow>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
