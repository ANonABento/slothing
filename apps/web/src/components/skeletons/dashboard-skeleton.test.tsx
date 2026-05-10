import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPageSkeleton, DashboardSkeleton } from "./dashboard-skeleton";

describe("DashboardSkeleton", () => {
  it("renders the dashboard content shape", () => {
    render(<DashboardSkeleton />);
    expect(
      document.querySelectorAll("[data-skeleton='true']").length,
    ).toBeGreaterThan(30);
  });

  it("renders inside the app page shell for route loading", () => {
    const { container } = render(<DashboardPageSkeleton />);
    expect(container.firstElementChild?.className).toContain("min-h-screen");
  });
});
