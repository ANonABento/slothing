import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { SectionList } from "./section-list";
import { createInitialSections } from "@/lib/builder/section-manager";
import type { BankEntry } from "@/types";

const entries: BankEntry[] = [
  {
    id: "entry-1",
    userId: "user-1",
    category: "experience",
    content: {
      title: "Senior Product Engineer",
      company: "ExampleWorks",
    },
    confidenceScore: 0.9,
    createdAt: "2026-05-16T00:00:00.000Z",
  },
  {
    id: "entry-2",
    userId: "user-1",
    category: "skill",
    content: { name: "TypeScript" },
    confidenceScore: 0.9,
    createdAt: "2026-05-16T00:00:00.000Z",
  },
];

function StatefulSectionList() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  return (
    <SectionList
      sections={createInitialSections()}
      entries={entries}
      selectedIds={selectedIds}
      onReorder={() => undefined}
      onToggleVisibility={() => undefined}
      onToggleEntry={(entryId) => {
        setSelectedIds((current) => {
          const next = new Set(current);
          if (next.has(entryId)) next.delete(entryId);
          else next.add(entryId);
          return next;
        });
      }}
      pickerOpen
      onPickerOpenChange={() => undefined}
    />
  );
}

describe("SectionList", () => {
  it("exposes bank picker rows as named checkboxes", () => {
    render(<StatefulSectionList />);

    const experience = screen.getByRole("checkbox", {
      name: "Senior Product Engineer at ExampleWorks",
    });
    const skill = screen.getByRole("checkbox", { name: "TypeScript" });

    expect(experience).not.toBeChecked();
    expect(skill).not.toBeChecked();
  });

  it("toggles the checkbox when the picker row label is clicked", () => {
    render(<StatefulSectionList />);

    const experience = screen.getByRole("checkbox", {
      name: "Senior Product Engineer at ExampleWorks",
    });
    fireEvent.click(
      screen.getByText("Senior Product Engineer at ExampleWorks"),
    );

    expect(experience).toBeChecked();
  });
});
