import type { ResumeDocumentModel } from "./rdm";

/**
 * Golden RDM fixtures for tests + the playground. Keep these representative and
 * stable — Phase 1 render snapshots key off them. See spec §5 Phase 0.
 */

export const SAMPLE_SWE: ResumeDocumentModel = {
  basics: {
    name: "Avery Chen",
    headline: "Software Engineer",
    email: "avery.chen@example.com",
    phone: "(555) 010-2244",
    location: "Toronto, ON",
    website: "averychen.dev",
    profiles: [{ network: "GitHub", url: "github.com/averychen" }],
  },
  summary:
    "Backend engineer with 4 years building high-throughput services. Owns reliability and developer-experience tooling.",
  work: [
    {
      organization: "Northwind Systems",
      position: "Senior Software Engineer",
      location: "Toronto, ON",
      startDate: "2022",
      endDate: undefined,
      highlights: [
        "Cut p99 API latency 38% by introducing a read-through cache and query batching.",
        "Led migration of 40+ services to a shared async job runtime.",
      ],
    },
    {
      organization: "Brightloop",
      position: "Software Engineer",
      location: "Remote",
      startDate: "2020",
      endDate: "2022",
      highlights: [
        "Shipped the billing ledger handling $12M/yr with zero reconciliation errors.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Waterloo",
      area: "Computer Science",
      studyType: "B.S.",
      startDate: "2016",
      endDate: "2020",
      score: "3.8/4.0",
    },
  ],
  skills: [
    { name: "Languages", keywords: ["TypeScript", "Go", "Python", "SQL"] },
    { name: "Infra", keywords: ["Postgres", "Redis", "Kubernetes", "AWS"] },
  ],
  projects: [
    {
      name: "openledger",
      description: "Open-source double-entry ledger library.",
      url: "github.com/averychen/openledger",
      highlights: ["1.2k stars; used by 3 fintech startups in production."],
    },
  ],
};

export const SAMPLE_DESIGNER: ResumeDocumentModel = {
  basics: {
    name: "Mara Okafor",
    headline: "Product Designer",
    email: "mara@example.com",
    location: "Lisbon, PT",
    profiles: [{ network: "Dribbble", url: "dribbble.com/mara" }],
  },
  summary:
    "Product designer focused on design systems and accessible, content-first interfaces.",
  work: [
    {
      organization: "Cobalt",
      position: "Senior Product Designer",
      startDate: "2021",
      highlights: [
        "Built the company design system adopted across 6 product teams.",
        "Raised task-completion rate 22% in the onboarding redesign.",
      ],
    },
  ],
  education: [
    {
      institution: "Central Saint Martins",
      area: "Graphic Design",
      studyType: "BA",
    },
  ],
  skills: [
    { name: "Design", keywords: ["Figma", "Design systems", "Prototyping"] },
    { name: "Research", keywords: ["Usability testing", "Interviews"] },
  ],
};

export const SAMPLE_RDMS: ResumeDocumentModel[] = [SAMPLE_SWE, SAMPLE_DESIGNER];
