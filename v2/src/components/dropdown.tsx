"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cx, fieldClass } from "./ui";

export interface DropdownOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Plain text for type-ahead when `label` isn't a string. */
  text?: string;
}

const MENU_MAX_H = 288; // matches max-h-72 below; used to decide whether to open upwards

/**
 * The one select control. Styled from the same field tokens as Input, keyboard-driven
 * (arrows, Home/End, type-ahead, Enter, Esc), and disabled by an enclosing <fieldset disabled>.
 * Pass `value={null}` with a `placeholder` to use it as a picker that triggers an action.
 */
export function Dropdown<T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  disabled,
  align = "start",
  size = "md",
  className,
}: {
  options: DropdownOption<T>[];
  value: T | null;
  onChange: (v: T) => void;
  placeholder?: ReactNode;
  /** Accessible name for the trigger. */
  label: string;
  disabled?: boolean;
  align?: "start" | "end";
  /** "sm" lines up with small buttons. */
  size?: "sm" | "md";
  className?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [active, setActive] = useState(0);
  const typed = useRef({ text: "", at: 0 });
  const selected = options.find((o) => o.value === value);

  const show = (index = Math.max(0, options.findIndex((o) => o.value === value))) => {
    const r = trigger.current?.getBoundingClientRect();
    setUp(Boolean(r && window.innerHeight - r.bottom < MENU_MAX_H && r.top > window.innerHeight - r.bottom));
    setActive(index);
    setOpen(true);
  };
  const hide = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const choose = (i: number) => {
    const o = options[i];
    if (o) onChange(o.value);
    hide();
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && hide(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => Math.min(last, a + 1)),
      ArrowUp: () => setActive((a) => Math.max(0, a - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: () => hide(),
      Tab: () => hide(false),
    };
    if (moves[e.key]) {
      if (e.key !== "Tab") e.preventDefault();
      return moves[e.key]();
    }
    if (e.key.length === 1) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + e.key.toLowerCase(), at: now };
      const hit = options.findIndex((o) => (o.text ?? String(o.label)).toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
    }
  };

  return (
    <div ref={root} className={cx("relative", className)}>
      <button
        ref={trigger}
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? hide() : show())}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            show();
          }
        }}
        className={cx(fieldClass, "flex items-center gap-2 text-left", size === "sm" ? "h-8 text-sm" : "h-10", open && "border-brand ring-2 ring-brand-soft")}
      >
        <span className={cx("min-w-0 flex-1 truncate", !selected && "text-ink-3")}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cx("h-4 w-4 shrink-0 text-ink-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          ref={list}
          id={id}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKey}
          className={cx(
            "absolute z-30 max-h-72 min-w-full overflow-y-auto rounded-card border border-rule bg-paper p-1 shadow-panel focus:outline-none",
            up ? "bottom-full mb-1" : "top-full mt-1",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              data-index={i}
              role="option"
              aria-selected={o.value === value}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cx("flex cursor-pointer items-start gap-2 rounded-chip px-2.5 py-2 text-sm", i === active ? "bg-rule-bg text-ink" : "text-ink-2")}
            >
              <span className="min-w-0 flex-1">{o.label}</span>
              {o.value === value && <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
