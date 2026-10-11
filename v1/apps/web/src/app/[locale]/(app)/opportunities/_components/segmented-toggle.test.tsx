import { fireEvent, render, screen } from "@testing-library/react";
import { List, LayoutGrid } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedToggle } from "./segmented-toggle";

describe("SegmentedToggle", () => {
  const options = [
    { value: "list", label: "List", icon: List },
    { value: "kanban", label: "Kanban", icon: LayoutGrid },
  ] as const;

  it("renders options and marks the active value", () => {
    render(
      <SegmentedToggle
        ariaLabel="Opportunity view mode"
        options={options}
        value="list"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("group")).toHaveAttribute(
      "aria-label",
      "Opportunity view mode",
    );
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Kanban" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the clicked option", () => {
    const onChange = vi.fn();

    render(
      <SegmentedToggle
        ariaLabel="Opportunity view mode"
        options={options}
        value="list"
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Kanban" }));
    expect(onChange).toHaveBeenCalledWith("kanban");
  });
});
