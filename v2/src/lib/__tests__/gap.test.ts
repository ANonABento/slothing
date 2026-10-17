import { describe, expect, it } from "vitest";

import { addSource, fitOf, hasTerm, keyTerms, keywordGap, spelledAs } from "../gap";
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

  it("names the tools a posting lists, even once, but not the places or customers it lists", () => {
    const tools = {
      ...job,
      description: `${job.description}
      Improve observability (OpenTelemetry, Grafana).
      Nice to have:
      - ClickHouse
      - Terraform
      Offices in Toronto, Canada and Austin, Texas. Trusted by Acme, Initech and Umbrella.`,
    };
    const labels = keyTerms(tools).map((t) => t.label);
    expect(labels).toEqual(expect.arrayContaining(["OpenTelemetry", "Grafana", "ClickHouse", "Terraform"]));
    for (const l of ["Canada", "Texas", "Acme", "Initech"]) expect(labels).not.toContain(l);
  });

  it("doesn't read the verb as a skill spelled like one", () => {
    const go = { ...job, description: `${job.description} You'll go beyond the basics.` };
    expect(keyTerms(go, ["Go"]).map((t) => t.term)).not.toContain("go");
    expect(keyTerms({ ...go, description: `${go.description} We write Go.` }, ["Go"]).map((t) => t.term)).toContain("go");
  });

  it("leaves out seniority and legal footnotes", () => {
    const senior = {
      ...job,
      title: "Senior Platform Engineer",
      description: `${job.description}\nFortune 500® is a registered trademark of Fortune Media IP Limited. Fortune and Fortune Media are not affiliated with Globex.`,
    };
    const labels = keyTerms(senior).map((t) => t.label.toLowerCase());
    expect(labels).not.toContain("senior");
    expect(labels.some((l) => l.includes("fortune"))).toBe(false);
  });
});

describe("spelledAs", () => {
  it("matches an acronym to its spelled-out form, either way round", () => {
    expect(spelledAs("Registered Nurse in the ICU", { term: "rn", label: "RN" })).toBe("Registered Nurse");
    expect(spelledAs("Grew traffic with SEO", { term: "search engine", label: "Search Engine Optimization" })).toBe("SEO");
    expect(spelledAs("Nursing for patients", { term: "rn", label: "RN" })).toBeNull();
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

describe("fitOf", () => {
  const posting = (title: string, description: string) => ({ company: "Initech", title, description });

  it("counts the posting's key terms your profile has, and names the ones it doesn't", () => {
    const fit = fitOf(profile, posting(
      "Software Engineer",
      `You'll work in TypeScript, GraphQL, Postgres, Rust and Kafka. Own CI pipelines, CI speed and CI cost.
      Build billing for payments: billing APIs, billing reports and payments retries. Payments matter here.`,
    ))!;
    expect(fit.total).toBeGreaterThanOrEqual(6);
    expect(fit.have).toBeGreaterThan(fit.total / 2);
    expect(fit.band).toBe("strong");
    expect(fit.missing).toEqual(expect.arrayContaining(["Rust"]));
  });

  it("is weak for a posting in another field", () => {
    const fit = fitOf(profile, posting("Registered Nurse", "ICU nursing. Patient care, patient safety and patient charting. Telemetry, ventilators, BLS and ACLS. Night shifts in the ICU."))!;
    expect(fit.band).toBe("weak");
  });

  it("ignores the kind of position: an internship isn't missing experience", () => {
    const fit = fitOf(profile, posting("Software Engineer Intern, Summer 2027 (Co-op)", "TypeScript, GraphQL, Postgres, CI and billing. CI CI CI."))!;
    expect(fit.missing.map((m) => m.toLowerCase())).not.toEqual(expect.arrayContaining(["intern"]));
    expect(fit.missing.map((m) => m.toLowerCase())).not.toEqual(expect.arrayContaining(["summer"]));
  });

  it("says nothing without a description or with too little to go on", () => {
    expect(fitOf(profile, posting("Software Engineer", ""))).toBeNull();
    expect(fitOf(profile, posting("Engineer", "Apply now."))).toBeNull();
  });
});
