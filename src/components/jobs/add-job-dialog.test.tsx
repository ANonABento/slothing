import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { AddJobDialog } from "./add-job-dialog";

function renderDialog(props?: Partial<ComponentProps<typeof AddJobDialog>>) {
  return render(
    <ToastProvider>
      <AddJobDialog
        open
        onOpenChange={vi.fn()}
        onCreated={vi.fn()}
        {...props}
      />
    </ToastProvider>
  );
}

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText("Software Engineer"), {
    target: { value: "Frontend Engineer" },
  });
  fireEvent.change(screen.getByPlaceholderText("Acme Corp"), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByPlaceholderText("Paste the full job description here..."), {
    target: { value: "Build user interfaces." },
  });
}

describe("AddJobDialog", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows an error toast and leaves the dialog open when creation fails", async () => {
    const onOpenChange = vi.fn();
    const onCreated = vi.fn();
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Job could not be saved" }),
    } as Response);

    renderDialog({ onOpenChange, onCreated });
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Add Job" }));

    await waitFor(() => {
      expect(screen.getByText("Could not add job")).toBeInTheDocument();
    });
    expect(screen.getByText("Job could not be saved")).toBeInTheDocument();
    expect(screen.getByText("Add New Job")).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });
});
