import { describe, expect, it } from "vitest";

import { profileAsTailored, resolveResume } from "../resolve";
import { groundResume } from "../tailor";
import { profile } from "./fixture";

describe("groundResume", () => {
  it("keeps grounded bullets and identity comes from the profile", () => {
    const { doc, warnings } = groundResume(profile, {
      summary: "Engineer who ships.",
      experience: [{ sourceId: "exp_a", bullets: [{ text: "Reduced CI time 40% with parallel test runners.", sourceIds: ["b1"] }] }],
      projects: [],
      educationIds: [],
      skills: [{ category: "Languages", items: ["typescript"] }],
    });
    expect(warnings).toEqual([]);
    const r = resolveResume(profile, doc);
    expect(r.experience[0]).toMatchObject({ company: "Acme & Co", title: "Senior Software Engineer", start: "Jan 2022" });
    expect(r.skills[0].items).toEqual(["TypeScript"]);
    expect(r.education).toHaveLength(1); // empty educationIds falls back to all
  });

  it("drops invented entries, uncited bullets, cross-entry citations and unknown skills", () => {
    const { doc, warnings } = groundResume(profile, {
      summary: "",
      experience: [
        { sourceId: "exp_fake", bullets: [{ text: "CTO", sourceIds: ["b1"] }] },
        {
          sourceId: "exp_b",
          bullets: [
            { text: "Built billing", sourceIds: ["b3"] },
            { text: "Did CI work", sourceIds: ["b1"] }, // b1 belongs to exp_a
            { text: "Invented", sourceIds: [] },
          ],
        },
      ],
      projects: [],
      educationIds: [],
      skills: [{ category: "Cloud", items: ["Kubernetes"] }],
    });
    expect(doc.experience).toHaveLength(1);
    expect(doc.experience[0].bullets.map((b) => b.text)).toEqual(["Built billing"]);
    expect(doc.skills).toEqual([]);
    expect(warnings).toHaveLength(4);
  });

  it("flags numbers that aren't in the cited source", () => {
    const { warnings } = groundResume(profile, {
      ...profileAsTailored(profile),
      experience: [{ sourceId: "exp_a", bullets: [{ text: "Cut CI time by 60% across 12 runners.", sourceIds: ["b1"] }] }],
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0].message).toContain("60%");
  });

  it("orders experience by profile order", () => {
    const { doc } = groundResume(profile, {
      ...profileAsTailored(profile),
      experience: [
        { sourceId: "exp_b", bullets: [{ text: "x", sourceIds: ["b3"] }] },
        { sourceId: "exp_a", bullets: [{ text: "y", sourceIds: ["b1"] }] },
      ],
    });
    expect(doc.experience.map((e) => e.sourceId)).toEqual(["exp_a", "exp_b"]);
  });
});
