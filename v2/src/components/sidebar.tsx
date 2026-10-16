"use client";

import { Briefcase, MessageSquareText, Moon, Puzzle, Settings2, Sparkles, Sun, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { setThemeModeAction } from "@/app/actions";
import { PLANNED, V1_URL } from "@/lib/roadmap";
import { safe } from "@/lib/safe";
import { MODE_SAVED_EVENT, THEME_EVENT } from "@/lib/theme";
import { DARK_THEMES } from "@/lib/types";
import { Eyebrow, IconButton, cx } from "./ui";

const GROUPS = [
  { label: "Pipeline", items: [{ href: "/", label: "Jobs", icon: Briefcase }] },
  {
    label: "You",
    items: [
      { href: "/profile", label: "Profile", icon: UserRound },
      { href: "/answers", label: "Answers", icon: MessageSquareText },
      { href: "/extension", label: "Extension", icon: Puzzle },
      { href: "/settings", label: "Settings", icon: Settings2 },
    ],
  },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" || path.startsWith("/jobs") : path.startsWith(href));

const isDarkTheme = (t: string | undefined) => (DARK_THEMES as readonly string[]).includes(t ?? "");

/** Flips between your light and dark themes (picked in Settings → Appearance) and saves the choice. */
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  // Both toggles (mobile row + desktop footer) follow the <html> attribute, so they never disagree.
  useEffect(() => {
    const sync = () => setDark(isDarkTheme(document.documentElement.dataset.theme));
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);
  const flip = () => {
    const h = document.documentElement;
    const mode = dark ? "light" : "dark";
    h.dataset.mode = mode;
    h.dataset.theme = mode === "dark" ? h.dataset.dark : h.dataset.light;
    window.dispatchEvent(new Event(THEME_EVENT));
    void safe(() => setThemeModeAction(mode)).then((r) => r.ok && window.dispatchEvent(new CustomEvent(MODE_SAVED_EVENT, { detail: mode })));
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
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
          <Image src="/brand/slothing-mark.png" alt="" width={32} height={32} className="h-8 w-8 rounded-control" priority />
          <div className="min-w-0 leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">Slothing</div>
            <div className="hidden text-xs text-ink-3 lg:block">Job search workspace</div>
          </div>
        </Link>
        {/* Mobile: nav collapses into this row */}
        {/* Labels from sm up; on a phone the row only fits icons. */}
        <nav className="flex min-w-0 items-center gap-1 lg:hidden">
          {GROUPS.flatMap((g) => g.items).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={cx("flex h-9 shrink-0 items-center gap-1.5 rounded-control px-2.5 text-sm font-medium sm:px-3", isActive(path, href) ? "bg-paper text-ink shadow-paper" : "text-ink-2")}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>

      <nav className="hidden flex-1 flex-col overflow-y-auto px-3 py-2 lg:flex">
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

        {/* Roadmap placeholders (desktop only), muted so they never read as working pages. */}
        <div>
          <Eyebrow className="px-2 pb-1.5 pt-4">Planned</Eyebrow>
          <div className="space-y-0.5">
            {PLANNED.map(({ slug, label, icon: Icon }) => {
              const href = `/planned/${slug}`;
              const active = path === href;
              return (
                <Link
                  key={slug}
                  href={href}
                  className={cx(
                    "flex h-9 items-center gap-2.5 rounded-control border px-2.5 text-sm transition-all",
                    active ? "border-rule bg-paper text-ink-2 shadow-paper" : "border-transparent text-ink-3 hover:border-rule hover:bg-paper hover:text-ink-2",
                  )}
                >
                  <Icon className="h-4 w-4 opacity-70" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="hidden space-y-2 border-t border-rule p-3 lg:block">
        <Link href="/settings" className="flex items-start gap-2 rounded-control border border-rule bg-paper px-3 py-2.5 shadow-paper transition-colors hover:border-rule-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
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
        </Link>
        <div className="flex items-center justify-between px-1">
          <Eyebrow>
            v2 · local ·{" "}
            <a href={V1_URL} target="_blank" rel="noreferrer" className="hover:text-ink" title="The archived v1 app (start it with npm run v1)">
              open v1
            </a>
          </Eyebrow>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
