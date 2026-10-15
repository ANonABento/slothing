import { describe, expect, it } from "vitest";

import { reuseIds } from "../import";
import { resolveResume } from "../resolve";
import { Profile, type TailoredResume } from "../types";
import { profile } from "./fixture";

describe("reuseIds", () => {
  it("keeps tailored resumes pointing at re-imported entries", () => {
    // A fresh import: same content, brand-new ids, one bullet reworded, one new role.
    const fresh = {
      ...profile,
      experience: [
        { ...profile.experience[0], id: "new1", company: "ACME & Co", bullets: [{ id: "nb1", text: "Cut CI time by 40% by parallelising the test suite across 12  runners." }, { id: "nb2", text: "A brand new bullet." }] },
        { ...profile.experience[1], id: "new2", bullets: profile.experience[1].bullets.map((b) => ({ ...b, id: `n${b.id}` })) },
        { id: "new3", company: "NewCo", title: "Intern", location: "", start: "", end: "", bullets: [] },
      ],
      education: profile.education.map((e) => ({ ...e, id: "newedu" })),
    };
    const merged = reuseIds({ ...profile, experience: profile.experience.map((e, i) => (i === 0 ? { ...e, rank: "pinned" as const, bullets: e.bullets.map((b) => ({ ...b, rank: "hidden" as const })) } : e)) }, Profile.parse(fresh));
    expect(merged.experience.map((e) => e.id)).toEqual(["exp_a", "exp_b", "new3"]);
    expect(merged.experience[0].bullets.map((b) => b.id)).toEqual(["b1", "nb2"]);
    expect(merged.education[0].id).toBe("edu_a");
    // Pins and hides survive a re-import for matched entries and bullets; new ones start normal.
    expect(merged.experience[0].rank).toBe("pinned");
    expect(merged.experience[0].bullets.map((b) => b.rank)).toEqual(["hidden", "normal"]);
    expect(merged.experience[2].rank).toBe("normal");

    const tailored: TailoredResume = { summary: "", experience: [{ sourceId: "exp_a", bullets: [{ text: "x", sourceIds: ["b1"] }] }], projects: [], educationIds: ["edu_a"], skills: [] };
    const r = resolveResume(merged, tailored);
    expect(r.experience).toHaveLength(1);
    expect(r.education).toHaveLength(1);
  });
});
