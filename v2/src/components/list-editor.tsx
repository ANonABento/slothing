"use client";

import type { ReactNode } from "react";

import { Button } from "./ui";

/** Generic ordered list with move/remove controls. */
export function ListEditor<T>({
  items,
  onChange,
  render,
  addLabel,
  onAdd,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (next: T) => void, index: number) => ReactNode;
  addLabel?: string;
  onAdd?: () => T;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="group flex gap-2">
          <div className="min-w-0 flex-1">{render(item, (n) => onChange(items.map((x, k) => (k === i ? n : x))), i)}</div>
          <div className="flex shrink-0 flex-col opacity-40 transition-opacity group-hover:opacity-100">
            <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="px-1 text-xs text-ink-3 hover:text-ink">▲</button>
            <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="px-1 text-xs text-ink-3 hover:text-ink">▼</button>
            <button type="button" aria-label="Remove" onClick={() => onChange(items.filter((_, k) => k !== i))} className="px-1 text-xs text-ink-3 hover:text-warn">✕</button>
          </div>
        </div>
      ))}
      {onAdd && (
        <Button type="button" variant="ghost" className="text-xs" onClick={() => onChange([...items, onAdd()])}>
          + {addLabel ?? "Add"}
        </Button>
      )}
    </div>
  );
}
