"use client";

import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";

import { useConfirm } from "./confirm";
import type { RowAction } from "./row-menu";
import { Button, IconButton } from "./ui";

/** Move and remove for one item, for rows that put them in their own menu (`controls="menu"`). */
export interface ItemControls {
  moveUp: (() => void) | null;
  moveDown: (() => void) | null;
  remove: () => void;
}

/** The standard move/remove entries for a RowMenu. */
export const itemActions = (c: ItemControls): RowAction[] => [
  { label: "Move up", icon: ArrowUp, onSelect: () => c.moveUp?.(), disabled: !c.moveUp },
  { label: "Move down", icon: ArrowDown, onSelect: () => c.moveDown?.(), disabled: !c.moveDown },
  { label: "Remove", icon: Trash2, onSelect: c.remove, danger: true },
];

/** Ordered list with move/remove controls. Pass `getKey` when items have stable ids so focus survives reordering. */
export function ListEditor<T>({
  items,
  onChange,
  render,
  getKey,
  addLabel,
  onAdd,
  itemLabel = "item",
  confirmRemove,
  controls = "column",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, update: (next: T) => void, controls: ItemControls) => ReactNode;
  getKey?: (item: T, index: number) => string;
  addLabel?: string;
  onAdd?: () => T;
  itemLabel?: string;
  /** Return a description to confirm before removing (e.g. a whole role with its bullets), or null to remove at once. */
  confirmRemove?: (item: T) => string | null;
  /** "menu": no buttons beside the item; the row puts move/remove in its own menu via `itemActions`. */
  controls?: "column" | "menu";
}) {
  const { confirm, dialog } = useConfirm();
  const remove = async (i: number) => {
    const what = confirmRemove?.(items[i]);
    if (what && !(await confirm({ title: `Remove ${itemLabel}?`, body: what, confirmLabel: "Remove", destructive: true }))) return;
    onChange(items.filter((_, k) => k !== i));
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {dialog}
      {items.map((item, i) => (
        <div key={getKey ? getKey(item, i) : i} className="group flex gap-1.5">
          <div className="min-w-0 flex-1">
            {render(item, (n) => onChange(items.map((x, k) => (k === i ? n : x))), {
              moveUp: i > 0 ? () => move(i, -1) : null,
              moveDown: i < items.length - 1 ? () => move(i, 1) : null,
              remove: () => remove(i),
            })}
          </div>
          {controls === "column" && <div className="flex shrink-0 flex-col opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            <IconButton size="sm" label={`Move ${itemLabel} up`} onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></IconButton>
            <IconButton size="sm" label={`Move ${itemLabel} down`} onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconButton>
            <IconButton size="sm" label={`Remove ${itemLabel}`} danger onClick={() => remove(i)}><X className="h-3.5 w-3.5" /></IconButton>
          </div>}
        </div>
      ))}
      {onAdd && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange([...items, onAdd()])}>
          <Plus className="h-3.5 w-3.5" /> {addLabel ?? "Add"}
        </Button>
      )}
    </div>
  );
}
