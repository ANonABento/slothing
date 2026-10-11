"use client";

/**
 * The clickable layer over a rendered PDF page.
 *
 * Rects come from the server-extracted hit map (`lib/latex/hitmap.ts`) NORMALISED to
 * 0..1 with a top-left origin, so positioning is percentage-based and survives any zoom
 * or container size without recomputation.
 *
 * A span that wraps across lines has SEVERAL rects sharing one id. They are rendered as
 * one visual unit and highlight together — hyperref emits one annotation per line box.
 */
import { useMemo, useState } from "react";

import type { HitMap, HitRect } from "@/lib/latex/hitmap";
import { cn } from "@/lib/utils";

/**
 * Overlay colours are inline-styled rather than tokenised, following the documented
 * precedent in `bank/preview/highlight-layer.tsx`: the PDF canvas is white regardless of
 * the app theme, so cream-on-white editorial tokens vanish, and Tailwind's opacity
 * modifiers silently resolve to `transparent` against hex CSS vars.
 */
const OVERLAY = {
  hover: "rgba(99, 102, 241, 0.14)",
  selected: "rgba(99, 102, 241, 0.26)",
  selectedOutline: "rgb(79, 70, 229)",
};

export interface SpanOverlayProps {
  hitMap: HitMap;
  /** 0-based, matching HitRect.page. */
  page: number;
  selectedSpanId: string | null;
  onSelect: (spanId: string) => void;
  /** Dim interaction while a stale preview is on screen after a failed compile. */
  muted?: boolean;
}

/** Group rects by span so one hover/selection lights every line of a wrapped bullet. */
export function groupRectsBySpan(
  hitMap: HitMap,
  page: number,
): Map<string, HitRect[]> {
  const grouped = new Map<string, HitRect[]>();
  for (const rect of hitMap.rects) {
    if (rect.page !== page) continue;
    const existing = grouped.get(rect.id);
    if (existing) existing.push(rect);
    else grouped.set(rect.id, [rect]);
  }
  return grouped;
}

/** Total area of a span's rects — used so a nested span always beats its container. */
export function spanArea(rects: HitRect[]): number {
  return rects.reduce((sum, rect) => sum + rect.w * rect.h, 0);
}

export function SpanOverlay({
  hitMap,
  page,
  selectedSpanId,
  onSelect,
  muted = false,
}: SpanOverlayProps) {
  // Hover is local state on purpose: pointer events at 60Hz must never touch the reducer
  // that holds the document source.
  const [hoveredSpanId, setHoveredSpanId] = useState<string | null>(null);

  const grouped = useMemo(() => groupRectsBySpan(hitMap, page), [hitMap, page]);

  // Smallest span first in DOM order would put big containers on top, so paint the
  // largest first and let the smallest sit above it — a nested item wins the click.
  const ordered = useMemo(
    () =>
      [...grouped.entries()].sort(([, a], [, b]) => spanArea(b) - spanArea(a)),
    [grouped],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0"
      data-testid="span-overlay"
    >
      {ordered.map(([spanId, rects]) => {
        const isSelected = spanId === selectedSpanId;
        const isHovered = spanId === hoveredSpanId;

        return rects.map((rect, index) => (
          <button
            key={`${spanId}-${index}`}
            type="button"
            data-span-id={spanId}
            aria-label={`Edit ${spanId}`}
            aria-pressed={isSelected}
            className={cn(
              "pointer-events-auto absolute rounded-sm transition-colors duration-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              muted && "opacity-50",
            )}
            style={{
              left: `${rect.x * 100}%`,
              top: `${rect.y * 100}%`,
              width: `${rect.w * 100}%`,
              height: `${rect.h * 100}%`,
              backgroundColor: isSelected
                ? OVERLAY.selected
                : isHovered
                  ? OVERLAY.hover
                  : "transparent",
              boxShadow: isSelected
                ? `inset 0 0 0 1.5px ${OVERLAY.selectedOutline}`
                : "none",
            }}
            onPointerEnter={() => setHoveredSpanId(spanId)}
            onPointerLeave={() =>
              setHoveredSpanId((current) =>
                current === spanId ? null : current,
              )
            }
            onClick={(event) => {
              event.stopPropagation();
              onSelect(spanId);
            }}
          />
        ));
      })}
    </div>
  );
}
