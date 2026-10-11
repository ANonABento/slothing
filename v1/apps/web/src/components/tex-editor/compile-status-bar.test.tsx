import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CompileStatusBar } from "./compile-status-bar";

const AT = "2026-08-21T00:00:00.000Z";

describe("CompileStatusBar", () => {
  it("renders nothing when idle — no chrome on a healthy document", () => {
    const { container } = render(
      <CompileStatusBar
        busy={false}
        problem={null}
        suspended={false}
        onRetry={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("stays silent for the first 250ms so a fast compile does not flicker a bar", () => {
    vi.useFakeTimers();
    try {
      const { container } = render(
        <CompileStatusBar
          busy
          problem={null}
          suspended={false}
          onRetry={vi.fn()}
        />,
      );
      expect(container).toBeEmptyDOMElement();
    } finally {
      vi.useRealTimers();
    }
  });

  it("explains a compile failure and says the old preview is still shown", () => {
    render(
      <CompileStatusBar
        busy={false}
        suspended={false}
        onRetry={vi.fn()}
        problem={{
          kind: "compile_failed",
          at: AT,
          entries: [
            {
              severity: "error",
              message: "Undefined control sequence",
              line: 12,
            },
          ],
        }}
      />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/line 12/)).toBeInTheDocument();
    expect(screen.getByText(/last version that compiled/i)).toBeInTheDocument();
  });

  it("offers the Overleaf route when no engine is installed", () => {
    render(
      <CompileStatusBar
        busy={false}
        suspended
        onRetry={vi.fn()}
        problem={{ kind: "engine_unavailable", message: "none", at: AT }}
      />,
    );
    expect(screen.getByText(/No LaTeX engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Overleaf/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("reports an expired preview as recompiling, not as a failure", () => {
    render(
      <CompileStatusBar
        busy={false}
        suspended={false}
        onRetry={vi.fn()}
        problem={{ kind: "stale_key", at: AT }}
      />,
    );
    expect(screen.getByText(/expired — recompiling/i)).toBeInTheDocument();
  });

  it("is additive: it never renders a replacement for the document", () => {
    // The bar is a sibling banner, not a takeover. It has no full-height container and
    // no backdrop, so whatever it sits above stays visible.
    const { container } = render(
      <CompileStatusBar
        busy={false}
        suspended={false}
        onRetry={vi.fn()}
        problem={{ kind: "compile_failed", at: AT, entries: [] }}
      />,
    );
    expect(container.querySelector(".fixed, .inset-0, .absolute")).toBeNull();
  });
});
