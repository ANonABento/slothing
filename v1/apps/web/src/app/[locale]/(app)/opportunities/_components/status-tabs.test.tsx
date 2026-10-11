import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatusTabs, type StatusTabOption } from "./status-tabs";

describe("StatusTabs", () => {
  const options: StatusTabOption[] = [
    { value: "all", label: "All", count: 12 },
    { value: "saved", label: "Saved", count: 4 },
    { value: "applied", label: "Applied", count: 3 },
  ];

  function findTab(label: string) {
    return screen
      .getAllByRole("tab")
      .find((node) =>
        node.textContent?.toLowerCase().startsWith(label.toLowerCase()),
      );
  }

  it("renders each option with its count", () => {
    render(
      <StatusTabs
        options={options}
        value="all"
        onChange={vi.fn()}
        ariaLabel="Status filter"
      />,
    );

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-label",
      "Status filter",
    );
    for (const option of options) {
      const tab = findTab(option.label);
      expect(tab).toBeDefined();
      expect(tab?.textContent).toContain(String(option.count));
    }
  });

  it("hides the count chip for zero-count tabs (UX audit DS-7)", () => {
    render(
      <StatusTabs
        options={[
          { value: "all", label: "All", count: 12 },
          { value: "offer", label: "Offer", count: 0 },
        ]}
        value="all"
        onChange={vi.fn()}
        ariaLabel="Status filter"
      />,
    );

    // The label still renders; the "0" count chip does not.
    const offerTab = findTab("Offer");
    expect(offerTab).toBeDefined();
    expect(offerTab?.textContent).toBe("Offer");
    expect(offerTab?.textContent).not.toContain("0");
    // Non-zero counts are unaffected.
    expect(findTab("All")?.textContent).toContain("12");
  });

  it("marks the active tab via aria-selected", () => {
    render(
      <StatusTabs
        options={options}
        value="saved"
        onChange={vi.fn()}
        ariaLabel="Status filter"
      />,
    );

    expect(findTab("Saved")).toHaveAttribute("aria-selected", "true");
    expect(findTab("All")).toHaveAttribute("aria-selected", "false");
  });

  it("fires onChange when a tab is clicked", () => {
    const handleChange = vi.fn();
    render(
      <StatusTabs
        options={options}
        value="all"
        onChange={handleChange}
        ariaLabel="Status filter"
      />,
    );

    const appliedTab = findTab("Applied");
    expect(appliedTab).toBeDefined();
    fireEvent.click(appliedTab!);
    expect(handleChange).toHaveBeenCalledWith("applied");
  });
});
