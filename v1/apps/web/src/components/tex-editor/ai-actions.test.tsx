import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AiActions, type AiProposal } from "./ai-actions";

const GOOD: AiProposal = {
  original: "Cut calibration time by rewriting the solver.",
  proposal: "Cut calibration time 40% by rewriting the solver in Rust.",
  applied: true,
  ungroundedNumbers: [],
  sources: ["this role's heading", "the text you are editing"],
  usedJobContext: false,
};

const REJECTED: AiProposal = {
  original: "Cut calibration time by rewriting the solver.",
  proposal: "Cut calibration time by rewriting the solver.",
  applied: false,
  ungroundedNumbers: ["87%"],
  sources: ["the text you are editing"],
  usedJobContext: false,
};

describe("AiActions", () => {
  it("offers the four grounded actions", () => {
    render(<AiActions onRequest={vi.fn()} onAccept={vi.fn()} />);
    for (const label of ["Rewrite", "Tighten", "Strengthen", "Quantify"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("shows a diff and writes NOTHING until the user accepts", async () => {
    const onRequest = vi.fn(async () => GOOD);
    const onAccept = vi.fn();
    render(<AiActions onRequest={onRequest} onAccept={onAccept} />);

    fireEvent.click(screen.getByRole("button", { name: "Tighten" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Accept/i }),
      ).toBeInTheDocument(),
    );
    // The proposal is on screen but nothing has been applied.
    expect(onAccept).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Accept/i }));
    expect(onAccept).toHaveBeenCalledWith(GOOD.proposal);
  });

  it("discards without writing", async () => {
    const onAccept = vi.fn();
    render(
      <AiActions onRequest={vi.fn(async () => GOOD)} onAccept={onAccept} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Rewrite" }));
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Discard/i }),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole("button", { name: /Discard/i }));

    expect(onAccept).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /Accept/i }),
      ).not.toBeInTheDocument(),
    );
  });

  it("says plainly when a rewrite was rejected for inventing a figure", async () => {
    render(
      <AiActions onRequest={vi.fn(async () => REJECTED)} onAccept={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Quantify" }));

    await waitFor(() =>
      expect(screen.getByText(/Rejected/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/87%/)).toBeInTheDocument();
    // A rejected rewrite offers no Accept button — there is nothing safe to accept.
    expect(
      screen.queryByRole("button", { name: /Accept/i }),
    ).not.toBeInTheDocument();
  });

  it("tells the user what the rewrite was based on", async () => {
    render(
      <AiActions onRequest={vi.fn(async () => GOOD)} onAccept={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Rewrite" }));

    await waitFor(() =>
      expect(screen.getByText(/Based on/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/the text you are editing/)).toBeInTheDocument();
  });

  it("mentions the job posting when one informed the rewrite", async () => {
    render(
      <AiActions
        onRequest={vi.fn(async () => ({ ...GOOD, usedJobContext: true }))}
        onAccept={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Strengthen" }));
    await waitFor(() =>
      expect(screen.getByText(/linked job posting/i)).toBeInTheDocument(),
    );
  });

  it("surfaces a failure without losing the buttons", async () => {
    render(
      <AiActions
        onRequest={vi.fn(async () => {
          throw new Error("AI is required for this.");
        })}
        onAccept={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Rewrite" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/AI is required/i),
    );
    expect(screen.getByRole("button", { name: "Rewrite" })).toBeEnabled();
  });

  it("explains why AI is unavailable on a rich field instead of failing silently", () => {
    render(
      <AiActions
        unavailableReason="Remove the formatting to use AI on this field."
        onRequest={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText(/Remove the formatting/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Rewrite" }),
    ).not.toBeInTheDocument();
  });
});
