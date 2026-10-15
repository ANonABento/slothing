import { describe, expect, it } from "vitest";

import { addSource, hasTerm, keyTerms, keywordGap } from "../gap";
import { profileAsTailored } from "../resolve";
import type { TailoredResume } from "../types";
import { profile } from "./fixture";

const job = {
  company: "Globex",
  title: "Platform Engineer",
  description: `Globex is hiring. You will speed up CI pipelines and own our GraphQL APIs.
    We care about CI reliability, CI cost and GraphQL schema design. GraphQL experience is a must.
    Experience with Kubernetes, Kubernetes operators and Kubernetes upgrades. Machine learning, machine learning, machine learning.
    Globex offers great benefits, dental and vision. Equal opportunity employer. Benefits benefits benefits.`,
};

describe("keyTerms", () => {
  const labels = () => keyTerms(job).map((t) => t.label);

  it("takes title words, and words and phrases the posting repeats", () => {
    expect(labels()).toEqual(expect.arrayContaining(["Platform", "Engineer", "CI", "GraphQL", "Kubernetes"]));
  });

  it("leaves out the company's name and posting boilerplate", () => {
    expect(labels().map((l) => l.toLowerCase())).not.toContain("globex");
    expect(labels().map((l) => l.toLowerCase())).not.toContain("benefits");
  });

  it("prefers a phrase over its words when they always occur together", () => {
    expect(labels()).toContain("machine learning");
    expect(labels()).not.toContain("machine");
    expect(labels()).not.toContain("learning");
  });

  it("counts one of your skills even when the posting names it once", () => {
    const once = { ...job, description: `${job.description} Bonus: Python.` };
    expect(keyTerms(once).map((t) => t.term)).not.toContain("python");
    expect(keyTerms(once, ["Python (pandas)", "SQL"]).map((t) => t.term)).toContain("python");
  });
});

describe("hasTerm", () => {
  it("matches plurals and phrases the way the scorer does", () => {
    expect(hasTerm("Maintained three GraphQL APIs", "api")).toBe(true);
    expect(hasTerm("Applied machine learning to churn", "machine learning")).toBe(true);
    expect(hasTerm("Learning about the machine", "machine learning")).toBe(false);
  });
});

describe("keywordGap", () => {
  const empty: TailoredResume = { ...profileAsTailored(profile), experience: [], projects: [], skills: [] };
  const status = (doc: TailoredResume, term: string) => keywordGap(profile, job, doc).find((g) => g.term.term === term)?.status;

  it("says whether each term is on the resume, in the profile, or missing", () => {
    expect(status(profileAsTailored(profile), "ci")).toEqual({ kind: "on" });
    expect(status(profileAsTailored(profile), "kubernete")?.kind).toBe("missing");
    const gql = status(empty, "graphql");
    expect(gql?.kind).toBe("profile");
    expect(gql?.kind === "profile" && gql.sources.map((s) => s.type === "bullet" && s.bulletId)).toEqual(["b2"]);
  });

  it("adds a profile bullet, bringing its entry onto the resume", () => {
    const gql = status(empty, "graphql");
    if (gql?.kind !== "profile") throw new Error("expected a profile term");
    const doc = addSource(empty, gql.sources[0]);
    expect(doc.experience).toEqual([{ sourceId: "exp_a", bullets: [{ text: profile.experience[0].bullets[1].text, sourceIds: ["b2"] }] }]);
    expect(status(doc, "graphql")).toEqual({ kind: "on" });
  });

  it("shows at most a few terms that aren't in the profile", () => {
    const words = "alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima".split(" ");
    const many = { ...job, description: `${job.description} ${words.map((w) => `${w} ${w} ${w}`).join(". ")}` };
    const gap = keywordGap(profile, many, profileAsTailored(profile));
    expect(gap.filter((g) => g.status.kind === "missing").length).toBe(8);
    expect(gap.filter((g) => g.status.kind === "on").map((g) => g.term.term)).toEqual(expect.arrayContaining(["ci", "graphql"]));
  });

  it("offers skills from the profile and adds them to their group", () => {
    const sqlJob = { ...job, description: `${job.description} SQL, SQL and more SQL.` };
    const st = keywordGap(profile, sqlJob, empty).find((g) => g.term.term === "sql")?.status;
    if (st?.kind !== "profile") throw new Error("expected a profile term");
    expect(st.sources).toEqual([{ type: "skill", category: "Languages", skill: "SQL" }]);
    expect(addSource(empty, st.sources[0]).skills).toEqual([{ category: "Languages", items: ["SQL"] }]);
  });
});
