"use client";

import { useEffect, useState } from "react";
import { Puzzle, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  EXTENSION_CONNECTED_STORAGE_KEY,
  hasExtensionConnectionToken,
} from "@/lib/extension/detect";
import { cn } from "@/lib/utils";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

const DISMISS_STORAGE_KEY = "taida:sidebar:extension-card-dismissed";

export function SidebarExtensionCard({ collapsed }: { collapsed: boolean }) {
  const a11yT = useA11yTranslations();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (collapsed) {
      setVisible(false);
      return;
    }

    try {
      const dismissed = Boolean(localStorage.getItem(DISMISS_STORAGE_KEY));
      const connected = hasExtensionConnectionToken(localStorage);
      setVisible(!dismissed && !connected);
    } catch {
      setVisible(false);
    }
  }, [collapsed]);

  if (collapsed || !visible) return null;

  return (
    <div className="relative py-1">
      <Link
        href="/extension"
        // Editorial paper-card treatment instead of the heavy primary
        // tint. In light mode this is a subtle cream chip; in dark mode
        // it's the `--paper` (midnight-indigo paper) surface — both
        // recede into the sidebar so the card no longer dominates the
        // bottom of the nav.
        className={cn(
          "group block rounded-sm border border-rule bg-paper p-2.5 text-left transition-colors",
          "hover:border-rule-strong focus:outline-none focus:ring-2 focus:ring-ring",
        )}
        style={{
          backgroundColor: "var(--paper)",
          borderColor: "var(--rule)",
        }}
        aria-label={a11yT("installTheSlothingBrowserExtension")}
      >
        <div className="flex min-h-0 flex-col gap-2 pr-5">
          <div className="flex items-start gap-2">
            <span
              className="grid h-6 w-6 shrink-0 place-items-center rounded-sm"
              style={{
                backgroundColor: "var(--brand-soft)",
                color: "var(--brand-dark)",
              }}
            >
              <Puzzle className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0">
              <span
                className="block text-[12.5px] font-semibold leading-tight"
                style={{ color: "var(--ink)" }}
              >
                Capture jobs from any site &rarr;
              </span>
              <span
                className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: "var(--ink-3)" }}
              >
                Chrome · Edge · Firefox
              </span>
            </span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className="absolute right-1.5 top-2 grid h-5 w-5 place-items-center rounded-sm transition-colors hover:bg-rule-strong-bg focus:outline-none focus:ring-2 focus:ring-ring"
        style={{ color: "var(--ink-3)" }}
        aria-label={a11yT("dismissExtensionPromo")}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          localStorage.setItem(DISMISS_STORAGE_KEY, "true");
          setVisible(false);
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export { DISMISS_STORAGE_KEY, EXTENSION_CONNECTED_STORAGE_KEY };
