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
        className={cn(
          "group block rounded-lg border border-primary/20 bg-primary/5 p-3 text-left shadow-sm transition-colors",
          "hover:border-primary/35 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        )}
        aria-label={a11yT("installTheSlothingBrowserExtension")}
      >
        <div className="flex min-h-[96px] flex-col justify-between gap-3 pr-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Puzzle className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-5 text-foreground">
                Capture jobs from any site &rarr;
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Install the Slothing extension
              </span>
            </span>
          </div>
          <span className="text-xs font-medium text-primary">
            Chrome, Edge, and Firefox
          </span>
        </div>
      </Link>
      <button
        type="button"
        className="absolute right-2 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={a11yT("dismissExtensionPromo")}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          localStorage.setItem(DISMISS_STORAGE_KEY, "true");
          setVisible(false);
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export { DISMISS_STORAGE_KEY, EXTENSION_CONNECTED_STORAGE_KEY };
