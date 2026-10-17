import { describe, expect, it } from "vitest";

import { profileAsTailored, resolveResume } from "../resolve";
import { groundResume, letterWarnings, unsupportedNumbers } from "../tailor";
import { profile } from "./fixture";

describe("groundResume", () => {
  it("keeps grounded bullets and identity comes from the profile", () => {
    const { doc, warnings } = groundResume(profile, {
      summary: "Engineer who ships.",
      experience: [{ sourceId: "exp_a", bullets: [{ text: "Reduced CI time 40% with parallel test runners.", sourceIds: ["b1"] }] }],
      projects: [],
      extras: [],
      educationIds: [],
      skills: [{ category: "Languages", items: ["typescript"] }],
    });
    expect(warnings).toEqual([]);
    const r = resolveResume(profile, doc);
    expect(r.experience[0]).toMatchObject({ company: "Acme & Co", title: "Senior Software Engineer", start: "Jan 2022" });
    expect(r.skills[0].items).toEqual(["TypeScript"]);
    expect(r.education).toHaveLength(0); // hand edits may remove education entirely
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
      extras: [],
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

  it("reads spelled-out numbers, and the message agrees with how many there are", () => {
    const { warnings } = groundResume(profile, {
      ...profileAsTailored(profile),
      experience: [{ sourceId: "exp_a", bullets: [{ text: "Cut CI time by 40% across twelve runners with ten engineers.", sourceIds: ["b1"] }] }],
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0].message).toContain("10, which isn't");
    const two = unsupportedNumbers("Twenty-five services and 60% faster", "12 runners");
    expect(two).toEqual(["25", "60%"]);
    expect(unsupportedNumbers("one of three teams", "3 teams")).toEqual([]);
  });

  it("flags the posting's wording in the summary and in bullets whose source doesn't say it", () => {
    const job = {
      title: "Platform Engineer",
      company: "Globex",
      description: "We run Kubernetes everywhere. Kubernetes operators, Kubernetes upgrades. Observability (Grafana, OpenTelemetry). GraphQL APIs.",
    };
    const { warnings } = groundResume(
      profile,
      {
        ...profileAsTailored(profile),
        summary: "Engineer with deep Kubernetes experience.",
        experience: [
          {
            sourceId: "exp_a",
            bullets: [
              { text: "Cut CI time by 40% with Grafana dashboards.", sourceIds: ["b1"] },
              { text: "Moved 3 services to GraphQL.", sourceIds: ["b2"] },
            ],
          },
        ],
      },
      job,
    );
    expect(warnings.map((w) => w.kind)).toEqual(["posting", "posting"]);
    expect(warnings[0]).toMatchObject({ where: "summary" });
    expect(warnings[0].message).toContain("“Kubernetes”");
    expect(warnings[1].message).toContain("“Grafana”");
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

describe("unsupportedNumbers", () => {
  it.each([
    ["Grew 5 accounts", "Grew 5 key accounts"],
    ["Mentored 3 engineers", "Mentored 3 bright engineers"],
    ["Cut costs 40 percent", "Cut costs by 40%"],
    ["Version 3.0", "Version 3"],
    ["Served 1,200 users", "Served 1200 users"],
    ["Ran 3 services", "Ran 3+ services"],
  ])("accepts %s given %s", (text, source) => {
    expect(unsupportedNumbers(text, source)).toEqual([]);
  });

  it.each([
    ["$3M in revenue", "3 months", "3m"],
    ["Led 20 engineers", "Led 2 engineers", "20"],
    ["Improved 3x", "Improved by 3", "3x"],
  ])("flags %s given %s", (text, source, flagged) => {
    expect(unsupportedNumbers(text, source)).toContain(flagged);
  });
});

describe("letterWarnings", () => {
  const letter = (p: string) => ({ greeting: "", closing: "", paragraphs: [p] });

  it("ignores ids and contact details as sources", () => {
    // 555 and 0100 appear only in the phone number; 12 and 40 are real bullet facts.
    expect(letterWarnings(profile, letter("I led 555 people and cut CI 40% across 12 runners."))[0].message).toContain("555");
  });

  it("says when a number comes from the posting, and flags claims in the posting's words", () => {
    const job = { title: "Platform Engineer", company: "Globex", description: "We process 5 billion events a day on Kubernetes. Kubernetes, Kubernetes." };
    const w = letterWarnings(profile, letter("I'd love to help Globex scale to 5 billion events. I have run Kubernetes clusters for years."), job);
    expect(w.map((x) => x.message)).toEqual([
      "Mentions 5 from the posting. Fine if it's about the job, not a claim about you.",
      "Says you have “Kubernetes”, which isn't in your profile. It's from the posting.",
    ]);
    // About the job, not you: not a claim.
    expect(letterWarnings(profile, letter("I want to work on your Kubernetes platform."), job)).toEqual([]);
  });

  it("doesn't let the posting vouch for experience, but allows its years", () => {
    const job = { title: "Intern", company: "Initech", description: "Winter 2027 term. 5+ years experience required." };
    const w = letterWarnings(profile, letter("I have 5+ years of experience and am excited for the Winter 2027 term."), job);
    expect(w).toHaveLength(1);
    expect(w[0].message).toContain("5+");
    expect(w[0].message).not.toContain("2027");
  });
});
