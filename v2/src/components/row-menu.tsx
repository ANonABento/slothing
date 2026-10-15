"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cx } from "./ui";

export interface RowAction {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

const MENU_H = 220; // roughly five items; decides whether to open upwards

/** Every action for one row (pin, hide, move, remove) behind a single "⋯" button. */
export function RowMenu({ actions, label }: { actions: (RowAction | false | null | undefined)[]; label: string }) {
  const items = actions.filter(Boolean) as RowAction[];
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [active, setActive] = useState(0);

  const enabled = items.map((a, i) => (a.disabled ? -1 : i)).filter((i) => i >= 0);
  const show = () => {
    const r = trigger.current?.getBoundingClientRect();
    setUp(Boolean(r && window.innerHeight - r.bottom < MENU_H && r.top > MENU_H));
    setActive(enabled[0] ?? 0);
    setOpen(true);
  };
  const hide = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const run = (i: number) => {
    const a = items[i];
    if (!a || a.disabled) return;
    hide();
    a.onSelect();
  };

  useEffect(() => {
    if (!open) return;
    menu.current?.focus();
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && hide(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const step = (d: number) => {
    const at = enabled.indexOf(active);
    setActive(enabled[(at + d + enabled.length) % enabled.length] ?? 0);
  };

  return (
    <div ref={root} className="relative shrink-0">
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? hide() : show())}
        className={cx(
          "grid h-8 w-8 place-items-center rounded-control text-ink-3 transition-colors hover:bg-rule-bg hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          open && "bg-rule-bg text-ink",
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          ref={menu}
          id={id}
          role="menu"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={(e) => {
            const keys: Record<string, () => void> = {
              ArrowDown: () => step(1),
              ArrowUp: () => step(-1),
              Enter: () => run(active),
              " ": () => run(active),
              Escape: () => hide(),
              Tab: () => hide(false),
            };
            if (keys[e.key]) {
              if (e.key !== "Tab") e.preventDefault();
              keys[e.key]();
            }
          }}
          className={cx(
            "absolute right-0 z-30 min-w-44 rounded-card border border-rule bg-paper p-1 shadow-panel focus:outline-none",
            up ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          {items.map((a, i) => (
            <div
              key={a.label}
              id={`${id}-${i}`}
              role="menuitem"
              aria-disabled={a.disabled || undefined}
              onPointerEnter={() => !a.disabled && setActive(i)}
              onClick={() => run(i)}
              className={cx(
                "flex cursor-pointer items-center gap-2 rounded-chip px-2.5 py-1.5 text-sm",
                a.disabled ? "cursor-default text-ink-3 opacity-50" : i === active ? "bg-rule-bg text-ink" : "text-ink-2",
                a.danger && !a.disabled && "text-warn",
              )}
            >
              {a.icon && <a.icon className="h-3.5 w-3.5 shrink-0" />}
              {a.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
