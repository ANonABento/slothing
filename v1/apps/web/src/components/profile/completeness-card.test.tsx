import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CompletenessCard } from "./completeness-card";
import messages from "@/messages/en.json";

function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("CompletenessCard", () => {
  it("renders the score, quick-win count, and progress value", () => {
    renderWithIntl(
      <CompletenessCard
        result={{
          score: 73,
          gaps: [
            {
              id: "summary",
              label: "Add a professional summary",
              points: 10,
              priority: 0,
              focus: { tab: "overview", fieldId: "summaryText" },
            },
            {
              id: "skills",
              label: "Add 2 more skills",
              points: 10,
              priority: 1,
              focus: { tab: "overview", sectionId: "skills" },
            },
            {
              id: "education",
              label: "Add your education",
              points: 10,
              priority: 2,
              focus: { tab: "overview", sectionId: "education" },
            },
            {
              id: "social-url",
              label: "Add a LinkedIn or GitHub URL",
              points: 10,
              priority: 3,
              focus: { tab: "overview", fieldId: "linkedin" },
            },
          ],
        }}
        onSelectGap={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Profile is 73% complete · 4 quick wins available"),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "73",
    );
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("renders complete state without actionable gaps", () => {
    renderWithIntl(
      <CompletenessCard
        result={{ score: 100, gaps: [] }}
        onSelectGap={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Profile is 100% complete · 0 quick wins available"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Everything essential is filled in."),
    ).toBeInTheDocument();
  });
});
