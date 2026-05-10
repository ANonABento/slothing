"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Home,
  Keyboard,
  Search,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  formatShortcutKeys,
  type ShortcutDefinition,
} from "@/lib/keyboard-shortcuts";
import type { Shortcut } from "@/components/keyboard-shortcuts";

export function ShortcutsHelpDialog({
  open,
  onOpenChange,
  shortcuts,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: Shortcut[];
}) {
  const navigationShortcuts = shortcuts.filter(
    (s) => s.category === "navigation",
  );
  const actionShortcuts = shortcuts.filter((s) => s.category === "actions");
  const generalShortcuts = shortcuts.filter((s) => s.category === "general");

  const icons: Record<string, React.ElementType> = {
    h: Home,
    b: FileText,
    t: Sparkles,
    s: Settings,
    "/": Search,
    u: Upload,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate faster with keyboard shortcuts across the app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {navigationShortcuts.length > 0 && (
            <ShortcutSection
              title="Navigation"
              shortcuts={navigationShortcuts}
              icons={icons}
              keyPrefix="nav"
            />
          )}

          {actionShortcuts.length > 0 && (
            <ShortcutSection
              title="Page Actions"
              shortcuts={actionShortcuts}
              icons={icons}
              keyPrefix="act"
            />
          )}

          {generalShortcuts.length > 0 && (
            <ShortcutSection
              title="General"
              shortcuts={generalShortcuts}
              icons={icons}
              keyPrefix="gen"
            />
          )}
        </div>

        <div className="border-t pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Press{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              ?
            </kbd>{" "}
            anytime to show this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutSection({
  title,
  shortcuts,
  icons,
  keyPrefix,
}: {
  title: string;
  shortcuts: Shortcut[];
  icons: Record<string, React.ElementType>;
  keyPrefix: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, i) => {
          const Icon = icons[shortcut.key];
          return (
            <div
              key={`${keyPrefix}-${shortcut.key}-${i}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm">{shortcut.description}</span>
              </div>
              <ShortcutKey shortcut={shortcut} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShortcutKey({ shortcut }: { shortcut: ShortcutDefinition }) {
  const isMac =
    typeof window !== "undefined" && navigator.platform.includes("Mac");
  const parts = formatShortcutKeys(shortcut, isMac);

  return (
    <div className="flex items-center gap-1">
      {parts.map((part, i) => (
        <kbd
          key={i}
          className="min-w-[24px] rounded bg-muted px-2 py-1 text-center font-mono text-xs"
        >
          {part}
        </kbd>
      ))}
    </div>
  );
}
