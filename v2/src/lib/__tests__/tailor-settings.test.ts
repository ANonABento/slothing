import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateJSON } from "../llm";
import { resumeSystem, tailorResume, verbatim, writeCoverLetter } from "../tailor";
import type { Job, TailoredResume } from "../types";
import { profile } from "./fixture";

vi.mock("../llm", () => ({ generateJSON: vi.fn() }));
const llm = vi.mocked(generateJSON);

const job: Job = {
  id: "job_1",
  company: "Initech",
  title: "Staff Engineer",
  url: "",
  location: "",
  description: "GraphQL, CI, TypeScript",
  status: "saved",
  notes: "",
  createdAt: "",
  updatedAt: "",
};

// What a model typically returns: reworded bullets, one merging two sources, and its own summary.
const reworded: TailoredResume = {
  summary: "Staff-ready engineer who loves CI.",
  experience: [
    {
      sourceId: "exp_a",
      bullets: [
        { text: "Sped up CI 40% and moved services to GraphQL.", sourceIds: ["b1", "b2"] },
        { text: "Moved services to GraphQL again.", sourceIds: ["b2"] },
      ],
    },
  ],
  projects: [],
  educationIds: ["edu_a"],
  skills: [{ category: "Languages", items: ["TypeScript"] }],
};

beforeEach(() => llm.mockReset());

describe("verbatim (select only)", () => {
  it("replaces every bullet with its exact source text, splits merged bullets and drops repeats", () => {
    const doc = verbatim(profile, reworded);
    expect(doc.summary).toBe(profile.summary);
    expect(doc.experience[0].bullets).toEqual([
      { text: profile.experience[0].bullets[0].text, sourceIds: ["b1"] },
      { text: profile.experience[0].bullets[1].text, sourceIds: ["b2"] },
    ]);
  });

  it("leaves unknown citations for grounding to drop", () => {
    const doc = verbatim(profile, { ...reworded, experience: [{ sourceId: "exp_a", bullets: [{ text: "x", sourceIds: ["b3"] }] }] });
    expect(doc.experience[0].bullets).toEqual([{ text: "x", sourceIds: ["b3"] }]);
  });
});

describe("tailoring settings reach the model and the result", () => {
  it("each level asks for something different", () => {
    const prompts = (["select", "rephrase", "rewrite"] as const).map((latitude) => resumeSystem({ latitude, instructions: "" }));
    expect(new Set(prompts).size).toBe(3);
    expect(prompts[0]).toMatch(/Do NOT reword/);
    expect(prompts[2]).toMatch(/merge closely related bullets/);
  });

  it("extra instructions are appended to the resume and letter prompts, after the hard rules", async () => {
    const instructions = "Never use the word spearheaded.";
    expect(resumeSystem({ latitude: "rephrase", instructions })).toMatch(/rules above:\nNever use the word spearheaded\.$/);
    expect(resumeSystem({ latitude: "rephrase", instructions: "  " })).not.toMatch(/style preferences/);

    llm.mockResolvedValueOnce({ greeting: "Hi,", paragraphs: ["Hello."], closing: "Best," });
    await writeCoverLetter(profile, job, { latitude: "rephrase", instructions });
    expect(llm.mock.calls[0][1]).toContain(instructions);
  });

  it("select only returns the profile's exact words even when the model rewords", async () => {
    llm.mockResolvedValueOnce(structuredClone(reworded));
    const { doc, warnings } = await tailorResume(profile, job, { latitude: "select", instructions: "" });
    const sourceTexts = new Set(profile.experience.flatMap((e) => e.bullets.map((b) => b.text)));
    expect(doc.experience[0].bullets.every((b) => sourceTexts.has(b.text))).toBe(true);
    expect(doc.summary).toBe(profile.summary);
    expect(warnings).toEqual([]);
  });

  it("rephrase keeps the model's wording (still grounded)", async () => {
    llm.mockResolvedValueOnce(structuredClone(reworded));
    const { doc } = await tailorResume(profile, job, { latitude: "rephrase", instructions: "" });
    expect(doc.experience[0].bullets[0].text).toBe("Sped up CI 40% and moved services to GraphQL.");
    expect(doc.summary).toBe("Staff-ready engineer who loves CI.");
  });
});
