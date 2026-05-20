/**
 * Covers P1 of docs/bento-builder-modal-redesign-spec.md — mode toggle
 * + modal frame collapse:
 *   - The Customize|Preview toggle renders, defaults to Customize.
 *   - Clicking Preview swaps the canvas for a <BentoGrid> render
 *     (data-testid="layout-builder-preview").
 *   - Re-opening the modal resets mode to Customize so users always
 *     return to the editing default.
 */
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LayoutBuilderModal } from "./layout-builder-modal";
import { ToastProvider } from "@/components/ui/toast";
import { DEFAULT_BENTO_LAYOUT } from "@/lib/opportunities/default-bento";

// react-grid-layout uses ResizeObserver + WidthProvider. Stub both for
// the jsdom environment so the canvas can mount without throwing.
class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  const g = globalThis as { ResizeObserver?: typeof ResizeObserver };
  g.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
  vi.spyOn(global, "fetch").mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderModal(
  overrides: Partial<React.ComponentProps<typeof LayoutBuilderModal>> = {},
) {
  const onOpenChange = overrides.onOpenChange ?? vi.fn();
  const onPersisted = overrides.onPersisted ?? vi.fn();
  return render(
    <ToastProvider>
      <LayoutBuilderModal
        open
        onOpenChange={onOpenChange}
        value={DEFAULT_BENTO_LAYOUT}
        onPersisted={onPersisted}
        {...overrides}
      />
    </ToastProvider>,
  );
}

describe("LayoutBuilderModal — mode toggle (P1)", () => {
  it("renders the Customize|Preview segmented control with Customize active by default", () => {
    renderModal();

    const customize = screen.getByRole("button", { name: /^Customize$/ });
    const preview = screen.getByRole("button", { name: /^Preview$/ });

    expect(customize).toHaveAttribute("aria-pressed", "true");
    expect(preview).toHaveAttribute("aria-pressed", "false");

    // Customize default → builder renders (look for the desktop tab
    // inside the builder). Preview canvas marker should not exist yet.
    expect(screen.queryByTestId("layout-builder-preview")).toBeNull();
  });

  it("clicking Preview swaps the canvas for <BentoGrid> via the preview marker", () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /^Preview$/ }));

    expect(screen.getByRole("button", { name: /^Preview$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /^Customize$/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // BentoGrid renders inside the marker. The marker is sufficient
    // signal; rendering details belong to bento-grid tests.
    expect(screen.getByTestId("layout-builder-preview")).toBeInTheDocument();
  });

  it("clicking Customize after Preview restores the builder canvas", () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /^Preview$/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Customize$/ }));

    expect(screen.getByRole("button", { name: /^Customize$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByTestId("layout-builder-preview")).toBeNull();
  });

  it("re-opening the modal resets mode to Customize", () => {
    const { rerender } = renderModal();

    fireEvent.click(screen.getByRole("button", { name: /^Preview$/ }));
    expect(screen.getByRole("button", { name: /^Preview$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // Close + reopen — the open-effect should re-init mode.
    rerender(
      <ToastProvider>
        <LayoutBuilderModal
          open={false}
          onOpenChange={vi.fn()}
          value={DEFAULT_BENTO_LAYOUT}
          onPersisted={vi.fn()}
        />
      </ToastProvider>,
    );
    act(() => {
      rerender(
        <ToastProvider>
          <LayoutBuilderModal
            open
            onOpenChange={vi.fn()}
            value={DEFAULT_BENTO_LAYOUT}
            onPersisted={vi.fn()}
          />
        </ToastProvider>,
      );
    });

    expect(screen.getByRole("button", { name: /^Customize$/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByTestId("layout-builder-preview")).toBeNull();
  });
});
