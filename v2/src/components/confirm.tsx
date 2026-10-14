"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "./ui";

interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel?: string;
  destructive?: boolean;
}

/** Promise-based confirm built on <dialog>: `if (await confirm({...})) doIt()`. Render `dialog` once. */
export function useConfirm() {
  const ref = useRef<HTMLDialogElement>(null);
  const resolver = useRef<(ok: boolean) => void>(undefined);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);

  useEffect(() => {
    if (opts) ref.current?.showModal();
  }, [opts]);

  const close = (ok: boolean) => {
    ref.current?.close();
    resolver.current?.(ok);
    resolver.current = undefined;
    setOpts(null);
  };

  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpts(o);
      }),
    [],
  );

  const dialog = (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        close(false);
      }}
      className="w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-rule bg-paper p-0 text-ink shadow-panel backdrop:bg-[color-mix(in_srgb,var(--ink)_35%,transparent)]"
    >
      {opts && (
        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <h2 className="font-display text-lg font-semibold tracking-tight">{opts.title}</h2>
            {opts.body && <p className="text-sm leading-6 text-ink-2">{opts.body}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => close(false)} autoFocus>Cancel</Button>
            <Button variant="primary" className={opts.destructive ? "bg-warn hover:bg-warn" : ""} onClick={() => close(true)}>
              {opts.confirmLabel ?? "Confirm"}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );

  return { confirm, dialog };
}
