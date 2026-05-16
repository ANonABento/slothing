import { describe, expect, it, vi } from "vitest";
import type { JobDescription, LLMConfig, Profile } from "@/types";

const { completeMock } = vi.hoisted(() => ({
  completeMock: vi.fn(),
}));

vi.mock("@/lib/llm/client", () => ({
  getLLMUserId: vi.fn(() => "default"),
  runLLMTask: completeMock,
}));

import { buildTailoredResumePrompt, generateTailoredResume } from "./generator";

const llmConfig: LLMConfig = {
  provider: "openai",
  apiKey: "test",
  model: "gpt-test",
};

function makeProfile(): Profile {
  return {
    id: "profile-1",
    contact: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555-0100",
      location: "Austin, TX",
    },
    summary: "Frontend engineer who built GraphQL product dashboards.",
    experiences: [
      {
        id: "exp-1",
        company: "Acme",
        title: "Senior Engineer",
        startDate: "2021",
        endDate: "2024",
        current: false,
        description: "Built React and GraphQL workflows.",
        highlights: ["Launched GraphQL dashboard tooling"],
        skills: ["React", "GraphQL", "TypeScript"],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "State University",
        degree: "BS",
        field: "Computer Science",
        endDate: "2019",
        highlights: [],
      },
    ],
    skills: [
      { id: "skill-1", name: "React", category: "technical" },
      { id: "skill-2", name: "GraphQL", category: "technical" },
    ],
    projects: [],
    certifications: [],
  };
}

function makeJob(): JobDescription {
  return {
    id: "job-1",
    title: "Frontend Engineer",
    company: "TestCo",
    description: "Needs React, GraphQL, AWS, and Kubernetes.",
    requirements: [],
    responsibilities: [],
    keywords: ["React", "GraphQL", "AWS", "Kubernetes"],
    createdAt: "2026-05-10",
  };
}

describe("generateTailoredResume", () => {
  it("builds a JSON-only prompt with evidence and preservation rules", () => {
    const prompt = buildTailoredResumePrompt(makeProfile(), makeJob());

    expect(prompt).toContain("Every added keyword");
    expect(prompt).toContain("backed by the candidate profile");
    expect(prompt).toContain("Preserve contact details, education");
    expect(prompt).toContain("Return ONLY a JSON object");
  });

  it("allows source-backed GraphQL while filtering unsupported AWS and Kubernetes", async () => {
    completeMock.mockResolvedValueOnce(
      JSON.stringify({
        contact: { name: "Wrong Name" },
        summary: "React GraphQL engineer with AWS and Kubernetes depth.",
        experiences: [
          {
            company: "Acme",
            title: "Senior Engineer",
            dates: "2021 - 2024",
            highlights: [
              "Built GraphQL dashboards",
              "Deployed AWS Kubernetes platforms",
            ],
          },
        ],
        skills: ["React", "GraphQL", "AWS", "Kubernetes"],
        education: [
          {
            institution: "Invented University",
            degree: "PhD",
            field: "Cloud",
            date: "2025",
          },
        ],
      }),
    );

    const result = await generateTailoredResume(
      makeProfile(),
      makeJob(),
      llmConfig,
    );

    expect(result.contact).toEqual(makeProfile().contact);
    expect(result.education).toEqual([
      {
        institution: "State University",
        degree: "BS",
        field: "Computer Science",
        date: "2019",
      },
    ]);
    expect(result.skills).toEqual(["React", "GraphQL"]);
    expect(result.experiences[0].highlights).toEqual([
      "Built GraphQL dashboards",
    ]);
    expect(JSON.stringify(result)).not.toMatch(/AWS|Kubernetes/);
  });
});
