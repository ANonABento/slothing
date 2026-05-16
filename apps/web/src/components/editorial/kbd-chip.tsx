import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KbdChipSize = "sm" | "md";

const sizeClass: Record<KbdChipSize, string> = {
  // 10px — AppBar search hint, sidebar shortcut hints
  sm: "text-[10px] px-1.5 py-px gap-0.5",
  // 11px — quick-action cards, larger surfaces
  md: "text-[11px] px-2 py-0.5 gap-1",
};

interface KbdChipProps {
  /**
   * Single key as a string ("K") or an array of key labels rendered
   * INSIDE one chip with a thin gap between them (e.g. `["⌘", "K"]`
   * renders as a single `[⌘ K]` chip — not two separate boxes).
   */
  children?: ReactNode;
  keys?: ReadonlyArray<string>;
  size?: KbdChipSize;
  className?: string;
}

export function KbdChip({
  children,
  keys,
  size = "sm",
  className,
}: KbdChipProps) {
  // Both single-key and multi-key forms render as ONE chip. Multi-key
  // tokens sit inside the chip with a small inline gap rather than as
  // separate boxes — that pattern (⌘ + U as two chips) read as broken
  // glyphs instead of a unified shortcut.
  const content =
    keys && keys.length > 0
      ? keys.map((key, i) => (
          <span key={`${key}-${i}`} className="leading-none">
            {key}
          </span>
        ))
      : children;
  const ariaLabel = keys && keys.length > 0 ? keys.join(" ") : undefined;

  return (
    <kbd
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-sm border border-rule bg-paper font-mono uppercase font-medium text-ink-3",
        sizeClass[size],
        className,
      )}
    >
      {content}
    </kbd>
  );
}
