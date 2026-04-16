import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState, getErrorMessage } from "./error-state";

describe("ErrorState", () => {
  it("should render default variant with title and message", () => {
    render(<ErrorState title="Test Error" message="Something broke" />);
    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("should render inline variant dismiss button with aria-label", () => {
    const onDismiss = vi.fn();
    render(
      <ErrorState variant="inline" onDismiss={onDismiss} />
    );
    const dismissBtn = screen.getByRole("button", { name: "Dismiss error" });
    expect(dismissBtn).toBeInTheDocument();
    fireEvent.click(dismissBtn);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("should render retry button with text in inline variant", () => {
    const onRetry = vi.fn();
    render(<ErrorState variant="inline" onRetry={onRetry} />);
    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should render card variant with retry and dismiss", () => {
    render(
      <ErrorState variant="card" onRetry={() => {}} onDismiss={() => {}} />
    );
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Dismiss")).toBeInTheDocument();
  });

  it("should render default variant with retry and dismiss", () => {
    render(
      <ErrorState onRetry={() => {}} onDismiss={() => {}} />
    );
    expect(screen.getByText("Try Again")).toBeInTheDocument();
    expect(screen.getByText("Dismiss")).toBeInTheDocument();
  });
});

describe("getErrorMessage", () => {
  it("should extract message from Error instance", () => {
    expect(getErrorMessage(new Error("test error"))).toBe("test error");
  });

  it("should return string errors as-is", () => {
    expect(getErrorMessage("string error")).toBe("string error");
  });

  it("should extract message from object with message property", () => {
    expect(getErrorMessage({ message: "obj error" })).toBe("obj error");
  });

  it("should extract error from object with error property", () => {
    expect(getErrorMessage({ error: "obj error" })).toBe("obj error");
  });

  it("should return fallback for unknown types", () => {
    expect(getErrorMessage(42)).toBe("An unexpected error occurred");
    expect(getErrorMessage(null)).toBe("An unexpected error occurred");
  });
});
