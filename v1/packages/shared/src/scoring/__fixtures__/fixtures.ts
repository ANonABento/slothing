import type { JobDescription, Profile } from "../../types";

export function fixtureProfile(): Profile {
  return {
    id: "profile-1",
    contact: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      phone: "555-123-4567",
      location: "Denver, CO",
      linkedin: "linkedin.com/in/jordanlee",
    },
    summary:
      "Senior software engineer with 7 years of experience building reliable React, TypeScript, and Node.js products for SaaS teams.",
    experiences: [
      {
        id: "exp-1",
        title: "Senior Software Engineer",
        company: "Acme",
        startDate: "Jan 2021",
        endDate: "Present",
        current: true,
        description:
          "Led platform modernization for customer-facing analytics applications.",
        highlights: [
          "Built React and TypeScript dashboards used by 25,000 users.",
          "Improved API latency by 35% and reduced incident volume by 20%.",
          "Mentored team of 6 engineers and shipped Node.js services.",
          "Optimized PostgreSQL queries for 12 projects across analytics teams.",
          "Launched AWS services that supported 4 countries and 30 partners.",
          "Streamlined CI/CD workflows and delivered 2x faster releases.",
          "Designed customer reporting tools for 80 clients.",
          "Collaborated with product managers to transform SaaS onboarding.",
        ],
        skills: ["React", "TypeScript", "Node.js", "AWS"],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "State University",
        degree: "BS",
        field: "Computer Science",
        highlights: ["Dean's List"],
      },
    ],
    skills: [
      { id: "skill-1", name: "React", category: "technical" },
      { id: "skill-2", name: "TypeScript", category: "technical" },
      { id: "skill-3", name: "Node.js", category: "technical" },
      { id: "skill-4", name: "AWS", category: "technical" },
      { id: "skill-5", name: "PostgreSQL", category: "technical" },
    ],
    projects: [
      {
        id: "project-1",
        name: "Metrics Console",
        description: "Internal analytics platform for SaaS operations.",
        technologies: ["React", "GraphQL", "PostgreSQL"],
        highlights: ["Created GraphQL views for 10 customer success reports."],
      },
    ],
    certifications: [],
    rawText: "",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };
}

export function skeletalProfile(): Profile {
  return {
    id: "profile-empty",
    contact: { name: "" },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    rawText: "",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };
}

export function fixtureJob(): JobDescription {
  return {
    id: "job-1",
    title: "Senior Frontend Engineer",
    company: "Target",
    description:
      "We need a Senior Engineer with React, TypeScript, Node.js, AWS, API performance, analytics dashboards, PostgreSQL, mentoring, GraphQL, CI/CD, and SaaS experience.",
    requirements: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
    responsibilities: [],
    keywords: [
      "React",
      "TypeScript",
      "Node.js",
      "AWS",
      "PostgreSQL",
      "GraphQL",
      "SaaS",
      "analytics",
    ],
    createdAt: "2024-01-01",
  };
}

export function longRawText(profile = fixtureProfile()): string {
  const base = [
    profile.contact.name,
    profile.contact.email,
    profile.contact.phone,
    profile.contact.location,
    profile.contact.linkedin,
    profile.summary,
    ...profile.experiences.flatMap((experience) => [
      experience.title,
      experience.company,
      experience.description,
      ...experience.highlights,
      ...experience.skills,
    ]),
    ...profile.skills.map((skill) => skill.name),
    ...profile.projects.flatMap((project) => [
      project.name,
      project.description,
      ...project.highlights,
      ...project.technologies,
    ]),
  ]
    .filter(Boolean)
    .join(" ");

  return [
    base,
    "Partnered with design, product, and customer success leaders to plan pragmatic delivery milestones, review incidents, improve documentation, and mentor teammates through production launches.",
    "Built maintainable frontend systems with accessible components, observable services, disciplined release notes, and clear ownership boundaries for teams supporting enterprise customers.",
    "Improved product reliability by combining API performance analysis, database tuning, thoughtful TypeScript models, and weekly collaboration with stakeholders across engineering and support.",
    "Delivered roadmap commitments while balancing operational work, coaching engineers, refining testing practices, and communicating tradeoffs in language that helped nontechnical partners make decisions.",
    "Created dashboards and reporting workflows that gave leaders faster visibility into adoption trends, customer health, conversion funnels, and service quality across multiple product surfaces.",
    "Maintained a steady habit of writing concise documentation, sharing implementation context, reducing repeated support requests, and turning ambiguous requirements into tested production software.",
    "Expanded automated coverage across unit tests, integration tests, and deployment smoke checks so releases became more predictable for customer-facing SaaS analytics teams.",
    "Led planning rituals that prioritized measurable outcomes, clarified dependencies, protected focus time, and helped a distributed engineering group ship durable customer value.",
    "Supported hiring loops, onboarding plans, architecture discussions, incident reviews, and lightweight governance practices that made engineering standards easier to understand and repeat.",
    "Reduced ambiguity in complex initiatives by writing crisp proposals, validating assumptions with customers, aligning backend and frontend contracts, and tracking measurable delivery outcomes.",
    "Managed production readiness for launches by coordinating monitoring, rollback planning, accessibility checks, customer communication, and post-release follow-up across several stakeholder groups.",
    "Analyzed support trends and product analytics to identify high-friction workflows, prioritize fixes, improve team planning, and keep the roadmap connected to customer value.",
  ].join(" ");
}
