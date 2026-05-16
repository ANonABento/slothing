import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ConditionalTooltip,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

describe("Tooltip primitive", () => {
  it("ConditionalTooltip passes children through when `when` is false", () => {
    const { container } = render(
      <TooltipProvider>
        <ConditionalTooltip when={false} label="Tip">
          <button>Anchor</button>
        </ConditionalTooltip>
      </TooltipProvider>,
    );

    expect(screen.getByRole("button", { name: "Anchor" })).toBeInTheDocument();
    // No tooltip plumbing should render — bare child is the only output.
    // The container has exactly one element child.
    expect(container.children).toHaveLength(1);
  });

  it("ConditionalTooltip wraps in Radix Tooltip when `when` is true", () => {
    render(
      <TooltipProvider>
        <ConditionalTooltip when label="Sidebar tooltip">
          <button>Anchor</button>
        </ConditionalTooltip>
      </TooltipProvider>,
    );

    // Radix sets data-state on the trigger so we can confirm the
    // tooltip machinery is present without depending on portal output.
    const trigger = screen.getByRole("button", { name: "Anchor" });
    expect(trigger).toHaveAttribute("data-state");
  });

  it("composes Tooltip + Trigger + Content without throwing", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>open me</button>
          </TooltipTrigger>
          <TooltipContent>label</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByRole("button", { name: "open me" })).toBeInTheDocument();
  });
});
