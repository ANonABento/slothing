"use client";

import { EyeOff, Pin } from "lucide-react";

import type { Rank } from "@/lib/types";
import { cx } from "./ui";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

/** Pin (always include) and hide (never pick automatically). Clicking the active one returns to normal. */
export function RankToggle({ rank, onChange, what, vertical }: { rank: Rank; onChange: (r: Rank) => void; what: string; vertical?: boolean }) {
  const button = (target: Exclude<Rank, "normal">, Icon: typeof Pin, label: string, on: string) => {
    const active = rank === target;
    return (
      <button
        type="button"
        aria-pressed={active}
        aria-label={`${label} ${what}`}
        title={active ? `${label}ed: click to make it normal` : `${label} this ${what}`}
        onClick={() => onChange(active ? "normal" : target)}
        className={cx("grid h-8 w-8 place-items-center rounded-control transition-colors", focusRing, active ? on : "text-ink-3 opacity-60 hover:bg-rule-bg hover:text-ink hover:opacity-100")}
      >
        <Icon className="h-3.5 w-3.5" />
      </button>
    );
  };
  return (
    <div className={cx("flex shrink-0", vertical && "flex-col")}>
      {button("pinned", Pin, "Pin", "bg-brand-soft text-brand")}
      {button("hidden", EyeOff, "Hide", "bg-rule-bg text-ink")}
    </div>
  );
}

/** One line under an entry's header explaining a non-normal rank. */
export function RankNote({ rank }: { rank: Rank }) {
  if (rank === "normal") return null;
  return (
    <p className={cx("text-xs", rank === "pinned" ? "text-brand" : "text-ink-3")}>
      {rank === "pinned" ? "Pinned: always on tailored resumes." : "Hidden: never picked automatically. You can still add it by hand."}
    </p>
  );
}
