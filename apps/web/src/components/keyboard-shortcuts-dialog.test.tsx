import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Shortcut } from "@/components/keyboard-shortcuts";
import { ShortcutsHelpDialog } from "./keyboard-shortcuts-dialog";

const originalPlatform = navigator.platform;

function setPlatform(platform: string) {
  Object.defineProperty(navigator, "platform", {
    configurable: true,
    value: platform,
  });
}

function renderDialog(shortcuts: Shortcut[]) {
  return render(
    <ShortcutsHelpDialog open onOpenChange={vi.fn()} shortcuts={shortcuts} />,
  );
}

const shortcuts: Shortcut[] = [
  {
    key: "h",
    description: "Go to Dashboard",
    category: "navigation",
    action: vi.fn(),
  },
  {
    key: "s",
    ctrl: true,
    description: "Save document",
    category: "actions",
    action: vi.fn(),
  },
  {
    key: "?",
    shift: true,
    description: "Show keyboard shortcuts",
    category: "general",
    action: vi.fn(),
  },
];

describe("ShortcutsHelpDialog", () => {
  afterEach(() => {
    setPlatform(originalPlatform);
  });

  it("renders shortcuts grouped by populated category", () => {
    renderDialog(shortcuts);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Page Actions")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Save document")).toBeInTheDocument();
    expect(screen.getByText("Show keyboard shortcuts")).toBeInTheDocument();
  });

  it("omits category headings when a category has no shortcuts", () => {
    renderDialog([
      {
        key: "s",
        ctrl: true,
        description: "Save document",
        category: "actions",
        action: vi.fn(),
      },
    ]);

    expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
    expect(screen.getByText("Page Actions")).toBeInTheDocument();
    expect(screen.queryByText("General")).not.toBeInTheDocument();
  });

  it("uses Mac shortcut glyphs on Mac platforms", () => {
    setPlatform("MacIntel");
    renderDialog(shortcuts);

    const saveRow =
      screen.getByText("Save document").parentElement?.parentElement;

    expect(saveRow).not.toBeNull();
    expect(within(saveRow!).getByText("⌘")).toBeInTheDocument();
    expect(within(saveRow!).queryByText("Ctrl")).not.toBeInTheDocument();
  });

  it("uses Ctrl shortcut labels on non-Mac platforms", () => {
    setPlatform("Win32");
    renderDialog(shortcuts);

    const saveRow =
      screen.getByText("Save document").parentElement?.parentElement;

    expect(saveRow).not.toBeNull();
    expect(within(saveRow!).getByText("Ctrl")).toBeInTheDocument();
    expect(within(saveRow!).queryByText("⌘")).not.toBeInTheDocument();
  });
});
