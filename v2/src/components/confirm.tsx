"use client";

import { useCallback, useRef, useState } from "react";

import { Modal } from "./modal";
import { Button } from "./ui";

interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel?: string;
  destructive?: boolean;
}

/** Promise-based confirm: `if (await confirm({...})) doIt()`. Render `dialog` once. */
export function useConfirm() {
  const resolver = useRef<(ok: boolean) => void>(undefined);
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);

  const close = (ok: boolean) => {
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
    <Modal open={Boolean(opts)} onClose={() => close(false)} title={opts?.title}>
      {opts?.body && <p className="text-sm leading-6 text-ink-2">{opts.body}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => close(false)} autoFocus>Cancel</Button>
        <Button variant="primary" className={opts?.destructive ? "bg-warn hover:bg-warn" : ""} onClick={() => close(true)}>
          {opts?.confirmLabel ?? "Confirm"}
        </Button>
      </div>
    </Modal>
  );

  return { confirm, dialog };
}
