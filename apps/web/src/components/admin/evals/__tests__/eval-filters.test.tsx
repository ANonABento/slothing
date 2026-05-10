import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EvalFilters } from "../eval-filters";

describe("EvalFilters", () => {
  it("emits model and range changes", () => {
    const onModelChange = vi.fn();
    const onRangeChange = vi.fn();

    render(
      <EvalFilters
        model="all"
        evalSet="all"
        range="30d"
        evalSets={[{ key: "set-1", label: "default-4", size: 4 }]}
        onModelChange={onModelChange}
        onEvalSetChange={vi.fn()}
        onRangeChange={onRangeChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "GPT-5.5" }));
    fireEvent.click(screen.getByRole("button", { name: "7d" }));

    expect(onModelChange).toHaveBeenCalledWith("gpt55");
    expect(onRangeChange).toHaveBeenCalledWith("7d");
  });
});
