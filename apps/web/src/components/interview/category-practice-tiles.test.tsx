import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryPracticeTiles } from "./category-practice-tiles";

describe("CategoryPracticeTiles", () => {
  it("starts quick practice for the clicked category", () => {
    const onStartQuickPractice = vi.fn();

    render(
      <CategoryPracticeTiles
        pastSessions={[]}
        onStartQuickPractice={onStartQuickPractice}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Behavioral/i }));

    expect(onStartQuickPractice).toHaveBeenCalledWith("behavioral");
  });

  it("renders category practice stats", () => {
    render(
      <CategoryPracticeTiles
        pastSessions={[
          {
            id: "session-1",
            jobId: null,
            category: "behavioral",
            mode: "generic-text",
            status: "completed",
            startedAt: new Date().toISOString(),
            questions: [],
          },
        ]}
        onStartQuickPractice={vi.fn()}
      />,
    );

    expect(screen.getByText(/1 session/)).toBeInTheDocument();
  });
});
