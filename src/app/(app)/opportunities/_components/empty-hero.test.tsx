import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OpportunitiesEmptyHero } from "./empty-hero";

describe("OpportunitiesEmptyHero", () => {
  it("renders copy and wires both calls to action", () => {
    const onAdd = vi.fn();
    const onImport = vi.fn();

    render(<OpportunitiesEmptyHero onAdd={onAdd} onImport={onImport} />);

    expect(
      screen.getByRole("heading", { name: "Track your first opportunity" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Save a role to start tracking applications, deadlines, and tailored documents.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /add opportunity/i }));
    fireEvent.click(screen.getByRole("button", { name: /import from csv/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onImport).toHaveBeenCalledTimes(1);
  });
});
