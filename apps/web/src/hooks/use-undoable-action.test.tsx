import { describe, expect, it, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ToastProvider } from "@/components/ui/toast";
import { useUndoableAction } from "./use-undoable-action";

function TestUndoableAction({
  action,
  undoAction,
}: {
  action: (value: string) => void;
  undoAction: (value: string) => void;
}) {
  const run = useUndoableAction({
    action,
    undoAction,
    message: "Item archived.",
    durationMs: 5000,
  });

  return (
    <button type="button" onClick={() => void run("item-1")}>
      Archive
    </button>
  );
}

describe("useUndoableAction", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs the action and displays an undo toast", async () => {
    const action = vi.fn();
    const undoAction = vi.fn();

    render(
      <ToastProvider>
        <TestUndoableAction action={action} undoAction={undoAction} />
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    });

    expect(action).toHaveBeenCalledWith("item-1");
    expect(await screen.findByText("Item archived.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("runs the undo action when Undo is clicked", async () => {
    const action = vi.fn();
    const undoAction = vi.fn();

    render(
      <ToastProvider>
        <TestUndoableAction action={action} undoAction={undoAction} />
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    });
    fireEvent.click(await screen.findByRole("button", { name: "Undo" }));

    expect(undoAction).toHaveBeenCalledWith("item-1");
    expect(screen.queryByText("Item archived.")).not.toBeInTheDocument();
  });

  it("expires the undo window after the configured duration", async () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const undoAction = vi.fn();

    render(
      <ToastProvider>
        <TestUndoableAction action={action} undoAction={undoAction} />
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    });
    act(() => {
      vi.advanceTimersByTime(5001);
    });

    expect(screen.queryByText("Item archived.")).not.toBeInTheDocument();
    expect(undoAction).not.toHaveBeenCalled();
  });
});
