import { describe, expect, it } from "vitest";
import type { TailoredResume } from "@/lib/resume/generator";
import { createTailorDiff } from "./diff";

const baseResume: TailoredResume = {
  contact: { name: "Jane Doe" },
  summary: "Product engineer building web tools.",
  experiences: [
    {
      company: "Acme",
      title: "Engineer",
      dates: "2020 - Present",
      highlights: ["Built dashboards.", "Maintained legacy reports."],
    },
  ],
  skills: ["React", "TypeScript"],
  education: [
    {
      institution: "State University",
      degree: "BS",
      field: "Computer Science",
      date: "2018",
    },
  ],
};

describe("createTailorDiff", () => {
  it("creates section counts for a tailored resume", () => {
    const tailoredResume: TailoredResume = {
      ...baseResume,
      summary: "Senior product engineer building analytics tools.",
      experiences: [
        {
          ...baseResume.experiences[0],
          highlights: ["Built dashboards."],
        },
      ],
      skills: ["React", "TypeScript", "GraphQL"],
    };

    const diff = createTailorDiff(baseResume, tailoredResume);

    expect(diff.counts.total).toBeGreaterThan(0);
    expect(
      diff.sections.find((section) => section.id === "summary")?.counts,
    ).toMatchObject({ reworded: 2 });
    expect(
      diff.sections.find((section) => section.id === "skills")?.counts,
    ).toMatchObject({ added: 1 });
    expect(
      diff.sections.find((section) => section.kind === "experience")?.counts,
    ).toMatchObject({ removed: 3 });
  });

  it("handles empty arrays without throwing", () => {
    const emptyResume: TailoredResume = {
      contact: { name: "Jane Doe" },
      summary: "",
      experiences: [],
      skills: [],
      education: [],
    };

    expect(createTailorDiff(emptyResume, emptyResume)).toMatchObject({
      counts: { total: 0 },
    });
  });
});
