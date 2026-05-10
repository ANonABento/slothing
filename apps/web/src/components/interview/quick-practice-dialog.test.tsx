import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickPracticeDialog } from "./quick-practice-dialog";

describe("QuickPracticeDialog", () => {
  it("submits with the default category and timer choice", () => {
    const onSubmit = vi.fn();

    render(
      <QuickPracticeDialog
        open
        defaultCategory="technical"
        defaultQuestionCount={10}
        defaultDifficulty="senior"
        defaultTimerEnabled
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Start/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      category: "technical",
      questionCount: 10,
      difficulty: "senior",
      timerEnabled: true,
    });
  });
});
