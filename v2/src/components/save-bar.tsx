"use client";

import { useEffect } from "react";

import { Button } from "./ui";

/** Warn before closing/reloading the tab with unsaved edits. */
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}

/** Sticks to the bottom of its scroll container while there are unsaved changes. */
export function SaveBar({
  dirty,
  pending,
  onSave,
  onDiscard,
  label = "Save",
}: {
  dirty: boolean;
  pending?: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  label?: string;
}) {
  useUnsavedGuard(dirty);
  if (!dirty) return null;
  return (
    <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-xl border border-ink bg-paper px-4 py-2.5 shadow-panel">
      <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
      <span className="text-sm font-medium">Unsaved changes</span>
      <div className="ml-auto flex gap-2">
        {onDiscard && (
          <Button size="sm" variant="ghost" onClick={onDiscard} disabled={pending}>
            Discard
          </Button>
        )}
        <Button size="sm" variant="primary" onClick={onSave} disabled={pending}>
          {pending ? "Saving…" : label}
        </Button>
      </div>
    </div>
  );
}
