import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToastProvider } from "@/components/ui/toast";
import { getErrorToastDescription, useErrorToast } from "./use-error-toast";

function TestComponent({ error }: { error: unknown }) {
  const showErrorToast = useErrorToast();

  return (
    <button
      type="button"
      onClick={() =>
        showErrorToast(error, {
          title: "Could not finish action",
          fallbackDescription: "Please try again.",
        })
      }
    >
      Show error
    </button>
  );
}

function renderWithToast(error: unknown) {
  render(
    <ToastProvider>
      <TestComponent error={error} />
    </ToastProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Show error" }));
}

describe("getErrorToastDescription", () => {
  it("uses fallback descriptions for generic unknown errors", () => {
    expect(getErrorToastDescription(42, "Please try again.")).toBe(
      "Please try again.",
    );
  });

  it("uses the first line of error messages", () => {
    expect(
      getErrorToastDescription(new Error("Request failed\nstack line")),
    ).toBe("Request failed");
  });

  it("truncates very long messages", () => {
    const description = getErrorToastDescription("x".repeat(220));

    expect(description).toHaveLength(180);
    expect(description?.endsWith("...")).toBe(true);
  });
});

describe("useErrorToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders Error.message as the toast description", () => {
    renderWithToast(new Error("Network request failed"));

    expect(screen.getByText("Could not finish action")).toBeInTheDocument();
    expect(screen.getByText("Network request failed")).toBeInTheDocument();
  });

  it("renders string errors as the toast description", () => {
    renderWithToast("Permission denied");

    expect(screen.getByText("Permission denied")).toBeInTheDocument();
  });

  it("renders object error fields as the toast description", () => {
    renderWithToast({ error: "Drive is disconnected" });

    expect(screen.getByText("Drive is disconnected")).toBeInTheDocument();
  });

  it("uses the fallback description when no useful message is available", () => {
    renderWithToast({ nope: true });

    expect(screen.getByText("Please try again.")).toBeInTheDocument();
  });
});
