import { Component, type ErrorInfo, type ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { ToastProvider, useToast } from "./toast";

// Test component that uses the useToast hook
function TestComponent() {
  const { addToast, toasts, removeToast } = useToast();

  return (
    <div>
      <button
        onClick={() =>
          addToast({
            type: "success",
            title: "Success!",
            description: "Operation completed",
          })
        }
        data-testid="add-success"
      >
        Add Success Toast
      </button>
      <button
        onClick={() =>
          addToast({
            type: "error",
            title: "Error!",
            description: "Something went wrong",
          })
        }
        data-testid="add-error"
      >
        Add Error Toast
      </button>
      <button
        onClick={() =>
          addToast({
            type: "warning",
            title: "Warning!",
            description: "Be careful",
          })
        }
        data-testid="add-warning"
      >
        Add Warning Toast
      </button>
      <button
        onClick={() =>
          addToast({ type: "info", title: "Info", description: "FYI" })
        }
        data-testid="add-info"
      >
        Add Info Toast
      </button>
      <div data-testid="toast-count">{toasts.length}</div>
      {toasts.length > 0 && (
        <button
          onClick={() => removeToast(toasts[0].id)}
          data-testid="remove-toast"
        >
          Remove First Toast
        </button>
      )}
    </div>
  );
}

class HookErrorBoundary extends Component<
  {
    children: ReactNode;
    onError: (error: Error) => void;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="hook-error-boundary" />;
    }

    return this.props.children;
  }
}

describe("Toast", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    consoleErrorSpy = null;
    vi.useRealTimers();
  });

  it("should throw error when useToast is used outside ToastProvider", () => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <HookErrorBoundary onError={onError}>
        <TestComponent />
      </HookErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "useToast must be used within a ToastProvider",
      }),
    );
    expect(screen.getByTestId("hook-error-boundary")).toBeInTheDocument();
  });

  it("should render children within ToastProvider", () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child content</div>
      </ToastProvider>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should add toast on button click", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Operation completed")).toBeInTheDocument();
  });

  it("should remove toast manually", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByTestId("remove-toast"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
  });

  it("should auto-remove toast after 5 seconds", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");

    // Advance time past the 5 second auto-remove threshold
    act(() => {
      vi.advanceTimersByTime(5001);
    });

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
  });

  it("should render success toast with correct styling", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));
    const toast = screen
      .getByText("Success!")
      .closest(".animate-slide-in-right");
    expect(toast?.className).toContain("border-success/40");
    expect(toast?.className).toContain("bg-card");
  });

  it("should render error toast with correct styling", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-error"));
    const toast = screen.getByText("Error!").closest(".animate-slide-in-right");
    expect(toast?.className).toContain("border-destructive/40");
    expect(toast?.className).toContain("bg-card");
  });

  it("should render warning toast with correct styling", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-warning"));
    const toast = screen
      .getByText("Warning!")
      .closest(".animate-slide-in-right");
    expect(toast?.className).toContain("border-warning/40");
    expect(toast?.className).toContain("bg-card");
  });

  it("should render info toast with correct styling", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-info"));
    const toast = screen.getByText("Info").closest(".animate-slide-in-right");
    expect(toast?.className).toContain("border-info/40");
    expect(toast?.className).toContain("bg-card");
  });

  it("should stack multiple toasts", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));
    fireEvent.click(screen.getByTestId("add-error"));
    fireEvent.click(screen.getByTestId("add-warning"));

    expect(screen.getByTestId("toast-count")).toHaveTextContent("3");
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Error!")).toBeInTheDocument();
    expect(screen.getByText("Warning!")).toBeInTheDocument();
  });

  it("should render close button on each toast", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));

    // Find the close button (X icon button)
    const toast = screen
      .getByText("Success!")
      .closest(".animate-slide-in-right");
    const closeButton = toast?.querySelector("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("should remove toast when close button is clicked", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success"));
    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");

    const toast = screen
      .getByText("Success!")
      .closest(".animate-slide-in-right");
    const closeButton = toast?.querySelector("button");
    fireEvent.click(closeButton!);

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
  });
});
