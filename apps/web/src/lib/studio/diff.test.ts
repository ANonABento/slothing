import { describe, expect, it } from "vitest";
import type { BuilderDraftState } from "@/lib/builder/version-history";
import {
  createStudioVersionDiff,
  extractComparableStudioSections,
} from "./diff";

const baseState: BuilderDraftState = {
  documentMode: "resume",
  selectedIds: [],
  sections: [],
  templateId: "classic",
  html: "",
};

describe("extractComparableStudioSections", () => {
  it("extracts resume sections from TipTap resumeSection nodes", () => {
    const sections = extractComparableStudioSections({
      ...baseState,
      content: {
        type: "doc",
        content: [
          {
            type: "resumeSection",
            attrs: { title: "Experience" },
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Built APIs" }],
              },
            ],
          },
        ],
      },
    });

    expect(sections).toEqual([
      { id: "experience-0", label: "Experience", text: "Built APIs" },
    ]);
  });

  it("extracts cover letter paragraphs as comparable sections", () => {
    const sections = extractComparableStudioSections({
      ...baseState,
      documentMode: "cover_letter",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello team." }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "I can help." }],
          },
        ],
      },
    });

    expect(sections.map((section) => section.label)).toEqual([
      "Opening",
      "Paragraph 2",
    ]);
  });

  it("falls back to stripped HTML for older snapshots", () => {
    expect(
      extractComparableStudioSections({
        ...baseState,
        html: "<section><h1>Experience</h1><p>Built &amp; shipped APIs.</p></section>",
      }),
    ).toEqual([
      {
        id: "document",
        label: "Document",
        text: "Experience Built & shipped APIs.",
      },
    ]);
  });
});

describe("createStudioVersionDiff", () => {
  it("aligns sections and returns section and total counts", () => {
    const compared: BuilderDraftState = {
      ...baseState,
      content: {
        type: "doc",
        content: [
          {
            type: "resumeSection",
            attrs: { title: "Experience" },
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Built APIs" }],
              },
            ],
          },
        ],
      },
    };
    const current: BuilderDraftState = {
      ...baseState,
      content: {
        type: "doc",
        content: [
          {
            type: "resumeSection",
            attrs: { title: "Experience" },
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Built secure APIs" }],
              },
            ],
          },
        ],
      },
    };

    const diff = createStudioVersionDiff(compared, current);

    expect(diff.sections[0]?.label).toBe("Experience");
    expect(diff.sections[0]?.counts).toMatchObject({ added: 1, total: 1 });
    expect(diff.totals).toMatchObject({ added: 1, total: 1 });
  });
});
