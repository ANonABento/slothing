"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { CardTitle, Eyebrow, IconButton, cx } from "./ui";

const WIDTHS = { sm: "w-[min(28rem,calc(100vw-2rem))]", md: "w-[min(36rem,calc(100vw-2rem))]" } as const;

/** The one modal surface (native <dialog>: focus trap, Esc, top layer). Controlled by `open`. */
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  size = "sm",
  closeButton = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  eyebrow?: ReactNode;
  size?: keyof typeof WIDTHS;
  closeButton?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className={cx(WIDTHS[size], "rounded-card border border-rule bg-paper p-0 text-ink shadow-panel backdrop:bg-scrim")}
    >
      {open && (
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              <CardTitle>{title}</CardTitle>
            </div>
            {closeButton && (
              <IconButton label="Close" size="sm" onClick={onClose} className="-mr-1 -mt-1">
                <X className="h-4 w-4" />
              </IconButton>
            )}
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
