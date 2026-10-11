import type { BankEntry, ContactInfo, GroupedBankEntries } from "@/types";
import type { EvalCase } from "./types.js";

const EMPTY_GROUPED_BANK_ENTRIES: GroupedBankEntries = {
  experience: [],
  skill: [],
  project: [],
  education: [],
  paragraph: [],
  bullet: [],
  achievement: [],
  certification: [],
  hackathon: [],
};

function makeEntry(
  testCase: EvalCase,
  category: BankEntry["category"],
  content: Record<string, unknown>,
  index = 0,
): BankEntry {
  return {
    id: `eval-${category}-${index}-${testCase.id}`,
    userId: "eval-user",
    category,
    content,
    confidenceScore: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

export function profileToBankEntries(testCase: EvalCase): GroupedBankEntries {
  const resume = testCase.structuredResume;

  // Golden-set path: build the same structured entries the real bank holds, so the
  // deterministic base generator (which reads experience/skill/education) produces a real
  // résumé. Without this it saw only a single "bullet" entry and emitted nothing.
  if (resume) {
    return {
      ...EMPTY_GROUPED_BANK_ENTRIES,
      experience: resume.experience.map((exp, i) =>
        makeEntry(
          testCase,
          "experience",
          {
            company: exp.company,
            title: exp.title,
            startDate: String(exp.startYear),
            endDate: exp.endYear ? String(exp.endYear) : "",
            highlights: exp.bullets,
          },
          i,
        ),
      ),
      skill: resume.skills.map((name, i) =>
        makeEntry(testCase, "skill", { name }, i),
      ),
      education: resume.education.map((ed, i) =>
        makeEntry(
          testCase,
          "education",
          {
            institution: ed.school,
            degree: ed.degree,
            field: resume.subfield ?? "",
            endDate: String(ed.year),
          },
          i,
        ),
      ),
      project: resume.projects.map((proj, i) =>
        makeEntry(
          testCase,
          "project",
          { name: proj.name, description: proj.description },
          i,
        ),
      ),
    };
  }

  // Fallback (manual test-cases.ts cases that only carry a prose profile).
  return {
    ...EMPTY_GROUPED_BANK_ENTRIES,
    bullet: [
      makeEntry(testCase, "bullet", {
        text: testCase.candidateProfile,
        description: testCase.candidateProfile,
        highlights: [testCase.candidateProfile],
      }),
    ],
  };
}

export function profileToContactInfo(testCase: EvalCase): ContactInfo {
  const resume = testCase.structuredResume;
  return {
    name: resume?.candidateName ?? `Eval Candidate ${testCase.id}`,
    email: "candidate@example.com",
    location: resume?.location ?? "Remote",
  };
}

export function inferJobMetadata(testCase: EvalCase): {
  jobTitle: string;
  company: string;
} {
  const [firstLine = "Target Role"] = testCase.jobDescription
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const atIndex = firstLine.toLowerCase().indexOf(" at ");
  if (atIndex > 0) {
    return {
      jobTitle: firstLine.slice(0, atIndex).trim(),
      company: firstLine.slice(atIndex + 4).trim() || "Target Company",
    };
  }

  return {
    jobTitle: firstLine,
    company: "Target Company",
  };
}
