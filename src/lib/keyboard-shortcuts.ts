/**
 * Pure utility functions for keyboard shortcut matching.
 * Separated from React components for testability.
 */

export interface ShortcutDefinition {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  description: string;
  category: "navigation" | "actions" | "general";
}

export interface ShortcutEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

/**
 * Check if a keyboard event matches a shortcut definition.
 */
export function matchesShortcut(event: ShortcutEvent, shortcut: ShortcutDefinition): boolean {
  // For ctrl shortcuts, accept either ctrlKey or metaKey (Cmd on Mac)
  const ctrlMatch = shortcut.ctrl
    ? (event.ctrlKey || event.metaKey)
    : !event.ctrlKey && !event.metaKey;

  // meta specifically requires metaKey only
  const metaMatch = shortcut.meta ? event.metaKey : true;

  const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

  // Special case: ? is Shift+/ on most keyboards
  const keyMatch =
    event.key.toLowerCase() === shortcut.key.toLowerCase() ||
    (shortcut.key === "?" && event.key === "/" && event.shiftKey) ||
    (shortcut.key === "/" && event.key === "/");

  // For ctrl/meta shortcuts, ignore shift matching (Cmd+Enter may send shift)
  if (shortcut.ctrl || shortcut.meta) {
    return keyMatch && (shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true) && (shortcut.meta ? event.metaKey : true);
  }

  return keyMatch && ctrlMatch && metaMatch && shiftMatch;
}

/**
 * Check if the event target is an input element where shortcuts should be suppressed.
 */
export function isInputTarget(target: HTMLElement): boolean {
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

/**
 * Format a shortcut for display, respecting platform conventions.
 */
export function formatShortcutKeys(shortcut: ShortcutDefinition, isMac: boolean): string[] {
  const parts: string[] = [];

  if (shortcut.ctrl) {
    parts.push(isMac ? "⌘" : "Ctrl");
  }
  if (shortcut.shift) {
    parts.push("⇧");
  }

  const displayKey = shortcut.key === "Enter" ? "↵" : shortcut.key.toUpperCase();
  parts.push(displayKey);

  return parts;
}
