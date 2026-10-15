"use client";

import { ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cx } from "./ui";

/**
 * A role, project or school as one collapsible row. Closed, it reads like the resume line: the title,
 * and under it the details in muted text. Profile and the job resume both use it, so an entry looks
 * the same in both places.
 */
export function EntryCard({
  title,
  subtitle,
  badge,
  aside,
  defaultOpen,
  dim,
  children,
}: {
  title: ReactNode;
  /** Second line: company, dates, tools… */
  subtitle?: ReactNode;
  /** A small marker after the title, shown only when there's something to say (pinned, hidden). */
  badge?: ReactNode;
  /** Controls on the right (a menu, an include switch). Clicks here don't toggle. */
  aside?: ReactNode;
  defaultOpen?: boolean;
  dim?: boolean;
  /** Empty (undefined/null/false) for an entry with nothing to open, e.g. one left off a tailored resume. */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const openable = children !== undefined && children !== null && children !== false;
  return (
    <div className="rounded-control border border-rule bg-page">
      <div className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={() => openable && setOpen((o) => !o)}
          aria-expanded={openable ? open : undefined}
          disabled={!openable}
          className={cx(
            "flex min-w-0 flex-1 items-start gap-2 rounded-control py-2.5 pl-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default",
            dim && "opacity-55",
          )}
        >
          <ChevronRight className={cx("mt-0.5 h-4 w-4 shrink-0 text-ink-3 transition-transform", open && "rotate-90", !openable && "invisible")} />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">{title}</span>
              {badge}
            </span>
            {subtitle && <span className="block truncate text-xs text-ink-3">{subtitle}</span>}
          </span>
        </button>
        {aside}
      </div>
      {openable && open && <div className="space-y-3 border-t border-rule p-4">{children}</div>}
    </div>
  );
}

/** Parts joined with " · ", skipping empty ones. */
export const joinParts = (...parts: (string | number | false | null | undefined)[]) =>
  parts.filter((p) => p !== "" && p !== false && p !== null && p !== undefined).join(" · ");
export const dates = (start: string, end: string) => [start, end].filter(Boolean).join(" – ");
export const count = (n: number, what: string) => `${n} ${what}${n === 1 ? "" : "s"}`;
