import { describe, expect, it, vi } from "vitest";

// Mock the scorer so ranking is tested independently of scoring internals:
// score = number of times "win" appears in the candidate's flattened text.
vi.mock("@/lib/scoring", () => ({
  scoreResume: ({ rawText }: { rawText?: string }) => ({
    overall: (rawText?.match(/win/g) ?? []).length,
  }),
}));

import { extractResumeText, rankResumesByFit } from "./best-fit";
import type { JobDescription, Profile } from "@/types";

const profile = {} as Profile;
const job = {} as JobDescription;

describe("extractResumeText", () => {
  it("flattens every string leaf of a JSON blob", () => {
    const json = JSON.stringify({
      summary: "alpha",
      experience: [{ title: "beta", bullets: ["gamma", "delta"] }],
      skills: { primary: "epsilon" },
    });
    const text = extractResumeText(json);
    for (const word of ["alpha", "beta", "gamma", "delta", "epsilon"]) {
      expect(text).toContain(word);
    }
  });

  it("falls back to the raw value when the content is not JSON", () => {
    expect(extractResumeText("just plain text")).toBe("just plain text");
  });
});

describe("rankResumesByFit", () => {
  it("orders candidates best-fit first", () => {
    const ranked = rankResumesByFit({
      profile,
      job,
      candidates: [
        { id: "a", name: "A", contentJson: JSON.stringify(["win"]) },
        { id: "b", name: "B", contentJson: JSON.stringify(["win win win"]) },
        { id: "c", name: "C", contentJson: JSON.stringify(["no match"]) },
      ],
    });
    expect(ranked.map((r) => r.id)).toEqual(["b", "a", "c"]);
    expect(ranked[0]).toEqual({ id: "b", name: "B", score: 3 });
  });

  it("breaks ties on original (most-recent-first) order", () => {
    const ranked = rankResumesByFit({
      profile,
      job,
      candidates: [
        { id: "newest", name: "N", contentJson: JSON.stringify(["win"]) },
        { id: "older", name: "O", contentJson: JSON.stringify(["win"]) },
      ],
    });
    expect(ranked.map((r) => r.id)).toEqual(["newest", "older"]);
  });
});
