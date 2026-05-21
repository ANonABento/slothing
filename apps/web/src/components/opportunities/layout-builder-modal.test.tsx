/**
 * Covers the v2 modal redesign (2026-05-20): nearly full-screen modal
 * with no Customize/Preview toggle. The canvas IS the preview because
 * cells render real chunks against the layout-preview fixture.
 *
 * Pins:
 *   - The modal renders the builder canvas directly when open.
 *   - The old segmented control (Customize | Preview) is gone.
 *   - DialogContent carries the near-full-screen size class so future
 *     refactors don't silently shrink the modal back to small.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LayoutBuilderModal } from "./layout-builder-modal";
import { ToastProvider } from "@/components/ui/toast";
import { DEFAULT_BENTO_LAYOUT } from "@/lib/opportunities/default-bento";

// react-grid-layout uses ResizeObserver + WidthProvider. Stub for jsdom.
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
  return render(
    <ToastProvider>
      <LayoutBuilderModal
        open
        onOpenChange={overrides.onOpenChange ?? vi.fn()}
        value={DEFAULT_BENTO_LAYOUT}
        onPersisted={overrides.onPersisted ?? vi.fn()}
        {...overrides}
      />
    </ToastProvider>,
  );
}

describe("LayoutBuilderModal — v2 (no preview toggle)", () => {
  it("renders the builder canvas directly when open", () => {
    renderModal();
    // The builder always renders the cells. Pin via the chunk-drag
    // aria-labels — every visible chunk carries one.
    expect(
      screen.getAllByRole("button", { name: /^Drag / }).length,
    ).toBeGreaterThan(0);
  });

  it("drops the Customize/Preview segmented control entirely", () => {
    renderModal();
    // No buttons titled exactly "Customize" or "Preview" remain.
    expect(screen.queryByRole("button", { name: /^Customize$/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /^Preview$/ })).toBeNull();
    // No preview-grid marker (was used in P1 to detect the BentoGrid swap).
    expect(screen.queryByTestId("layout-builder-preview")).toBeNull();
  });

  it("DialogContent carries the near-full-screen sizing class", () => {
    const { container } = renderModal();
    // Find the element carrying the sizing class — Radix renders the
    // overlay + DialogContent as siblings inside the document root, so
    // searching by class is more reliable than walking a single
    // role='dialog' wrapper.
    const sized = container.ownerDocument.querySelector(
      "[class*='w-[min(98vw,1700px)]']",
    ) as HTMLElement | null;
    expect(sized).not.toBeNull();
    // Both width + height pins land — keeps a future refactor from
    // silently shrinking the modal back to the old 1200px size.
    expect(sized!.className).toMatch(/h-\[min\(96vh,1000px\)\]/);
  });
});
