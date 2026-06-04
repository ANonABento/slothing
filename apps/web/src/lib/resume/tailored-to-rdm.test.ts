import { describe, expect, it } from "vitest";

import { resumeDocumentModelSchema } from "@slothing/shared/resume-template";
import { tailoredResumeToRdm } from "./tailored-to-rdm";
import type { TailoredResume } from "./generator";

const SAMPLE: TailoredResume = {
  contact: {
    name: "Avery Chen",
    email: "avery@example.com",
    phone: "555-1212",
    location: "Toronto, ON",
    headline: "Software Engineer",
    website: "averychen.dev",
    linkedin: "linkedin.com/in/avery",
    github: "github.com/avery",
  },
  summary: "Backend engineer.",
  experiences: [
    {
      company: "Northwind",
      title: "Senior SWE",
      dates: "2022 – Present",
      highlights: ["Cut latency 38%."],
    },
    {
      company: "Globex",
      title: "SWE",
      dates: "2019 – 2022",
      highlights: ["Shipped billing."],
    },
  ],
  skills: ["TypeScript", "Go"],
  education: [
    {
      institution: "Waterloo",
      degree: "B.S.",
      field: "Computer Science",
      date: "2015 - 2019",
    },
  ],
  projects: [
    {
      name: "openledger",
      description: "OSS ledger",
      highlights: ["1.2k stars"],
    },
  ],
  certifications: ["AWS SA"],
  awards: ["Hackathon winner"],
};

describe("tailoredResumeToRdm bridge", () => {
  const rdm = tailoredResumeToRdm(SAMPLE);

  it("produces a schema-valid RDM", () => {
    expect(resumeDocumentModelSchema.safeParse(rdm).success).toBe(true);
  });

  it("maps contact → basics incl. linkedin/github profiles", () => {
    expect(rdm.basics.name).toBe("Avery Chen");
    expect(rdm.basics.headline).toBe("Software Engineer");
    expect(rdm.basics.profiles?.map((p) => p.network)).toEqual([
      "LinkedIn",
      "GitHub",
    ]);
  });

  it("splits the dates string into start/end and treats Present as open-ended", () => {
    expect(rdm.work[0]).toMatchObject({
      organization: "Northwind",
      position: "Senior SWE",
      startDate: "2022",
    });
    expect(rdm.work[0].endDate).toBeUndefined();
    expect(rdm.work[1]).toMatchObject({ startDate: "2019", endDate: "2022" });
  });

  it("maps education fields and the dash-separated date", () => {
    expect(rdm.education[0]).toMatchObject({
      institution: "Waterloo",
      studyType: "B.S.",
      area: "Computer Science",
      startDate: "2015",
      endDate: "2019",
    });
  });

  it("folds certifications + awards into labelled skill groups (no data loss)", () => {
    const labels = rdm.skills.map((g) => g.name ?? "(skills)");
    expect(labels).toContain("Certifications");
    expect(labels).toContain("Awards");
    expect(
      rdm.skills.find((g) => g.name === "Certifications")?.keywords,
    ).toEqual(["AWS SA"]);
  });

  it("carries projects through", () => {
    expect(rdm.projects?.[0]).toMatchObject({
      name: "openledger",
      description: "OSS ledger",
    });
  });
});
