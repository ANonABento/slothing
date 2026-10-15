"use client";

import { Eye, EyeOff, Pin, PinOff } from "lucide-react";

import type { Rank } from "@/lib/types";
import type { RowAction } from "./row-menu";
import { cx } from "./ui";

/** Pin (always include) and hide (never pick automatically), as RowMenu entries. Each undoes itself. */
export const rankActions = (rank: Rank, onChange: (r: Rank) => void): RowAction[] => [
  rank === "pinned"
    ? { label: "Unpin", icon: PinOff, onSelect: () => onChange("normal") }
    : { label: "Pin: always include", icon: Pin, onSelect: () => onChange("pinned") },
  rank === "hidden"
    ? { label: "Unhide", icon: Eye, onSelect: () => onChange("normal") }
    : { label: "Hide: never pick", icon: EyeOff, onSelect: () => onChange("hidden") },
];

/** A small marker for a pinned or hidden item; nothing when it's normal. */
export function RankBadge({ rank, className }: { rank: Rank; className?: string }) {
  if (rank === "normal") return null;
  const Icon = rank === "pinned" ? Pin : EyeOff;
  const label = rank === "pinned" ? "Pinned" : "Hidden";
  return (
    <span title={label} aria-label={label} className={cx("inline-flex shrink-0", rank === "pinned" ? "text-brand" : "text-ink-3", className)}>
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

/** One line inside an opened entry explaining a non-normal rank. */
export function RankNote({ rank }: { rank: Rank }) {
  if (rank === "normal") return null;
  return (
    <p className={cx("text-xs", rank === "pinned" ? "text-brand" : "text-ink-3")}>
      {rank === "pinned" ? "Pinned: always on tailored resumes." : "Hidden: never picked automatically. You can still add it by hand."}
    </p>
  );
}
