"use client";

import { useEffect } from "react";

import { Button } from "./ui";

// One question per click, even when several editors on the page are dirty.
const asked = new WeakSet<Event>();

/**
 * Warn before unsaved edits are lost: closing or reloading the tab, or following an in-app link.
 * Links under `keepPrefix` are exempt (e.g. settings sections, which keep their edits).
 */
export function useUnsavedGuard(dirty: boolean, keepPrefix?: string) {
  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    // Capture phase runs before Next's <Link> handler, which skips navigation when the event is prevented.
    const onClick = (e: MouseEvent) => {
      if (asked.has(e) || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      if (keepPrefix && url.pathname.startsWith(keepPrefix)) return;
      asked.add(e);
      if (!window.confirm("You have unsaved changes. Leave this page and discard them?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty, keepPrefix]);
}

/** Sticks to the bottom of its scroll container while there are unsaved changes. */
export function SaveBar({
  dirty,
  pending,
  onSave,
  onDiscard,
  label = "Save",
  keepPrefix,
}: {
  dirty: boolean;
  pending?: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  label?: string;
  /** In-app links under this path don't count as leaving (see useUnsavedGuard). */
  keepPrefix?: string;
}) {
  useUnsavedGuard(dirty, keepPrefix);
  if (!dirty) return null;
  return (
    <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-card border border-ink bg-paper px-4 py-2.5 shadow-panel">
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
