"use client";

import { ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cx } from "./ui";

/**
 * A role, project or school as one collapsible row: title and details when closed, the editor when
 * open. Profile and the job resume both use it, so an entry looks the same in both places.
 */
export function EntryCard({
  title,
  meta,
  aside,
  defaultOpen,
  dim,
  children,
}: {
  title: ReactNode;
  /** Short details after the title, e.g. dates and bullet count. */
  meta?: ReactNode;
  /** Controls on the right of the header (pin/hide, include checkbox). Clicks here don't toggle. */
  aside?: ReactNode;
  defaultOpen?: boolean;
  dim?: boolean;
  /** Empty (undefined/null/false) for an entry with nothing to open, e.g. one left off a tailored resume. */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const openable = children !== undefined && children !== null && children !== false;
  return (
    <div className={cx("rounded-control border border-rule bg-page", dim && "opacity-60")}>
      <div className="flex min-h-11 items-center gap-2 pr-2">
        <button
          type="button"
          onClick={() => openable && setOpen((o) => !o)}
          aria-expanded={openable ? open : undefined}
          disabled={!openable}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-control py-2.5 pl-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default"
        >
          <ChevronRight className={cx("h-4 w-4 shrink-0 text-ink-3 transition-transform", open && "rotate-90", !openable && "invisible")} />
          <span className="min-w-0 truncate text-sm font-medium">{title}</span>
          {meta && <span className="hidden shrink-0 truncate font-mono text-xs text-ink-3 sm:inline">{meta}</span>}
        </button>
        {aside}
      </div>
      {openable && open && <div className="space-y-3 border-t border-rule p-4">{children}</div>}
    </div>
  );
}

/** "Jan 2022 – Present · 4 bullets", skipping empty parts. */
export const entryMeta = (...parts: (string | number | false | undefined)[]) =>
  parts.filter((p) => p !== "" && p !== false && p !== undefined).join(" · ");
export const dates = (start: string, end: string) => [start, end].filter(Boolean).join(" – ");
export const count = (n: number, what: string) => `${n} ${what}${n === 1 ? "" : "s"}`;
