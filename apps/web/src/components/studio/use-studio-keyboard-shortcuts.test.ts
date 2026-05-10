import { renderHook } from "@testing-library/react";
import { useCallback } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Shortcut } from "@/components/keyboard-shortcuts";
import { useStudioKeyboardShortcuts } from "./use-studio-keyboard-shortcuts";

const registerShortcuts = vi.hoisted(() => vi.fn());

vi.mock("@/components/keyboard-shortcuts", () => ({
  useRegisterShortcuts: registerShortcuts,
}));

describe("useStudioKeyboardShortcuts", () => {
  beforeEach(() => {
    registerShortcuts.mockClear();
  });

  it("registers the Studio shortcut definitions", () => {
    const handlers = {
      onSave: vi.fn(),
      onExport: vi.fn(),
      onToggleAiPanel: vi.fn(),
      onToggleFilesPanel: vi.fn(),
      onTogglePreviewOnly: vi.fn(),
      onCommandPalette: vi.fn(),
    };

    renderHook(() => useStudioKeyboardShortcuts(handlers));

    expect(registerShortcuts).toHaveBeenCalledOnce();
    expect(registerShortcuts).toHaveBeenCalledWith(
      "studio",
      expect.arrayContaining([
        expect.objectContaining({
          key: "s",
          ctrl: true,
          description: "Save document",
          category: "actions",
        }),
        expect.objectContaining({
          key: "e",
          ctrl: true,
          description: "Export",
          category: "actions",
        }),
        expect.objectContaining({
          key: "/",
          ctrl: true,
          description: "Toggle AI panel",
          category: "actions",
        }),
        expect.objectContaining({
          key: "b",
          ctrl: true,
          description: "Toggle files panel",
          category: "actions",
        }),
        expect.objectContaining({
          key: "p",
          ctrl: true,
          description: "Preview only",
          category: "actions",
        }),
        expect.objectContaining({
          key: "k",
          ctrl: true,
          description: "Focus AI assistant",
          category: "actions",
        }),
      ]),
    );

    const shortcuts = registerShortcuts.mock.calls[0][1] as Shortcut[];
    expect(shortcuts).toHaveLength(6);

    shortcuts.find((shortcut) => shortcut.key === "s")?.action();
    shortcuts.find((shortcut) => shortcut.key === "e")?.action();
    shortcuts.find((shortcut) => shortcut.key === "/")?.action();
    shortcuts.find((shortcut) => shortcut.key === "b")?.action();
    shortcuts.find((shortcut) => shortcut.key === "p")?.action();
    shortcuts.find((shortcut) => shortcut.key === "k")?.action();

    expect(handlers.onSave).toHaveBeenCalledOnce();
    expect(handlers.onExport).toHaveBeenCalledOnce();
    expect(handlers.onToggleAiPanel).toHaveBeenCalledOnce();
    expect(handlers.onToggleFilesPanel).toHaveBeenCalledOnce();
    expect(handlers.onTogglePreviewOnly).toHaveBeenCalledOnce();
    expect(handlers.onCommandPalette).toHaveBeenCalledOnce();
  });

  it("keeps the shortcut list stable when handler refs are stable", () => {
    function useStableStudioShortcuts() {
      const onSave = useCallback(() => {}, []);
      const onExport = useCallback(() => {}, []);
      const onToggleAiPanel = useCallback(() => {}, []);
      const onToggleFilesPanel = useCallback(() => {}, []);
      const onTogglePreviewOnly = useCallback(() => {}, []);
      const onCommandPalette = useCallback(() => {}, []);

      useStudioKeyboardShortcuts({
        onSave,
        onExport,
        onToggleAiPanel,
        onToggleFilesPanel,
        onTogglePreviewOnly,
        onCommandPalette,
      });
    }

    const { rerender } = renderHook(() => useStableStudioShortcuts());
    const firstShortcuts = registerShortcuts.mock.calls[0]?.[1];

    rerender();

    expect(registerShortcuts).toHaveBeenCalledTimes(2);
    expect(registerShortcuts.mock.calls[1]?.[1]).toBe(firstShortcuts);
  });
});
