import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AnnotatePrompt } from "./annotate-prompt";
import type { AnnotateOutcome } from "./tex-editor-api";

const ACCEPTED: AnnotateOutcome = {
  ok: true,
  annotated: "\\slothingItem[id=itm-000001]{x}",
  spanCount: 14,
  summary: "3 sections, 2 roles, 9 bullets",
};

const REJECTED: AnnotateOutcome = {
  ok: false,
  reason: "render_changed",
  issues: [
    {
      code: "render_changed",
      message:
        "The annotated document does not render identically to the original.",
    },
  ],
};

describe("AnnotatePrompt", () => {
  it("offers to find structure", () => {
    render(<AnnotatePrompt onRequest={vi.fn()} onAccept={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /Find structure with AI/i }),
    ).toBeInTheDocument();
  });

  it("reports what it found and that the render is verified unchanged", async () => {
    render(
      <AnnotatePrompt
        onRequest={vi.fn(async () => ACCEPTED)}
        onAccept={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Find structure/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/3 sections, 2 roles, 9 bullets/),
      ).toBeInTheDocument(),
    );
    // The verification result is the thing worth showing — not a raw source diff.
    expect(screen.getByText(/render identically/i)).toBeInTheDocument();
  });

  it("applies nothing until the user accepts", async () => {
    const onAccept = vi.fn();
    render(
      <AnnotatePrompt
        onRequest={vi.fn(async () => ACCEPTED)}
        onAccept={onAccept}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Find structure/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Apply/i }),
      ).toBeInTheDocument(),
    );
    expect(onAccept).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Apply/i }));
    await waitFor(() =>
      expect(onAccept).toHaveBeenCalledWith(ACCEPTED.annotated),
    );
  });

  it("discards without applying", async () => {
    const onAccept = vi.fn();
    render(
      <AnnotatePrompt
        onRequest={vi.fn(async () => ACCEPTED)}
        onAccept={onAccept}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Find structure/i }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Discard/i }),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Discard/i }));

    expect(onAccept).not.toHaveBeenCalled();
  });

  it("says the document is unchanged when a proposal is rejected", async () => {
    render(
      <AnnotatePrompt
        onRequest={vi.fn(async () => REJECTED)}
        onAccept={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Find structure/i }));

    await waitFor(() =>
      expect(screen.getByText(/Annotation was discarded/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/Your document is unchanged/i)).toBeInTheDocument();
    // Nothing to accept when it was rejected.
    expect(
      screen.queryByRole("button", { name: /^Apply$/i }),
    ).not.toBeInTheDocument();
  });

  it("lets the user try again after a rejection", async () => {
    render(
      <AnnotatePrompt
        onRequest={vi.fn(async () => REJECTED)}
        onAccept={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Find structure/i }));
    await waitFor(() =>
      expect(screen.getByText(/Annotation was discarded/i)).toBeInTheDocument(),
    );

    expect(
      screen.getByRole("button", { name: /Find structure with AI/i }),
    ).toBeEnabled();
  });

  it("surfaces a request failure", async () => {
    render(
      <AnnotatePrompt
        onRequest={vi.fn(async () => {
          throw new Error("AI is required for this.");
        })}
        onAccept={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Find structure/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/AI is required/i),
    );
  });
});
