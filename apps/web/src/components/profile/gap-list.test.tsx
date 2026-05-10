import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GapList } from "./gap-list";
import type { ProfileCompletenessGap } from "@/lib/profile/completeness";

const gaps: ProfileCompletenessGap[] = [
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
];

describe("GapList", () => {
  it("renders only the top 3 gaps", () => {
    render(<GapList gaps={gaps} onSelectGap={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /Add a professional summary/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Add a LinkedIn or GitHub URL/i }),
    ).not.toBeInTheDocument();
  });

  it("invokes the focus callback with the selected gap", () => {
    const onSelectGap = vi.fn();
    render(<GapList gaps={gaps} onSelectGap={onSelectGap} />);

    fireEvent.click(screen.getByRole("button", { name: /Add 2 more skills/i }));

    expect(onSelectGap).toHaveBeenCalledWith(gaps[1]);
  });
});
