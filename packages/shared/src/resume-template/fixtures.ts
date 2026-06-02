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

/** Minimal RDM — only the required fields. Proves short content does not break layout. */
export const SAMPLE_MINIMAL: ResumeDocumentModel = {
  basics: { name: "Sam Lee" },
  work: [{ organization: "Acme", position: "Engineer", highlights: [] }],
  education: [],
  skills: [],
};

/** Overflowing RDM — far more than one page. Proves long content reflows, never clips. */
export const SAMPLE_LONG: ResumeDocumentModel = {
  basics: {
    name: "Jordan Rivera-Montgomery",
    headline: "Principal Platform Engineer & Engineering Manager",
    email: "jordan.rivera.montgomery@verylongexampledomain.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, California, United States",
    website: "jordanrivera.engineering",
    profiles: [
      { network: "GitHub", url: "github.com/jordanrm" },
      { network: "LinkedIn", url: "linkedin.com/in/jordanriveramontgomery" },
    ],
  },
  summary:
    "Platform engineer and manager with 12+ years scaling distributed systems across fintech, healthcare, and consumer products. Repeatedly took teams from zero to production-critical infrastructure serving tens of millions of requests per second while keeping cost, reliability, and developer experience in balance.",
  work: Array.from({ length: 8 }, (_, i) => ({
    organization: `Company ${i + 1} Holdings International`,
    position: i % 2 === 0 ? "Principal Engineer" : "Engineering Manager",
    location: "Remote",
    startDate: String(2024 - i),
    endDate: i === 0 ? undefined : String(2024 - i + 1),
    highlights: Array.from(
      { length: 4 },
      (_, j) =>
        `Drove a multi-quarter initiative #${j + 1} that reduced operational cost by ${10 + j * 7}% while improving p99 latency, partnering across ${3 + j} teams to land it without a single customer-facing regression.`,
    ),
  })),
  education: [
    {
      institution: "Massachusetts Institute of Technology",
      area: "Electrical Engineering and Computer Science",
      studyType: "M.Eng.",
      startDate: "2010",
      endDate: "2012",
      score: "4.9/5.0",
      highlights: [
        "Thesis on fault-tolerant consensus under adversarial network partitions.",
      ],
    },
    {
      institution: "University of California, Berkeley",
      area: "Computer Science",
      studyType: "B.S.",
      endDate: "2010",
    },
  ],
  skills: [
    {
      name: "Languages",
      keywords: ["Rust", "Go", "TypeScript", "Python", "Java", "C++", "Elixir"],
    },
    {
      name: "Infrastructure",
      keywords: [
        "Kubernetes",
        "Terraform",
        "AWS",
        "GCP",
        "Kafka",
        "Postgres",
        "Redis",
        "ClickHouse",
      ],
    },
    {
      name: "Practices",
      keywords: ["SRE", "Incident command", "Capacity planning", "Mentorship"],
    },
  ],
  projects: Array.from({ length: 3 }, (_, i) => ({
    name: `open-project-${i + 1}`,
    description: "An open-source library with meaningful production adoption.",
    url: `github.com/jordanrm/open-project-${i + 1}`,
    highlights: [
      `${(i + 1) * 800} GitHub stars; depended on by multiple Fortune-500 engineering orgs.`,
    ],
  })),
};

/**
 * Adversarial content — characters that are markup-significant in HTML and/or Typst
 * (`< > & " ' # * _ [ ] $ ` @ \`). Renderers MUST escape these so both backends stay
 * well-formed and Typst still compiles. Guards the escaping invariants.
 */
export const SAMPLE_TRICKY: ResumeDocumentModel = {
  basics: {
    name: 'A. "Ace" <O\'Brien> & Co. #1',
    headline: "C++ / C# developer — 100% [test] *coverage*",
    email: "ace+resume@example.com",
    location: "Saint-Étienne, Côte d'Ivoire",
  },
  summary:
    "Reduced cost by 50% using $variables, _underscores_, #hashes, and <brackets> — all literal.",
  work: [
    {
      organization: "Tom & Jerry, Inc.",
      position: 'Lead "Hacker"',
      startDate: "2021",
      highlights: [
        "Shipped a feature using `code`, [links](x), and 2*3 = 6 calculations safely.",
      ],
    },
  ],
  education: [
    {
      institution: "École Polytechnique",
      area: "Maths & CS",
      studyType: "M.Sc.",
    },
  ],
  skills: [
    { name: "Stack <T>", keywords: ["C++", "C#", "F#", "Obj-C", "a/b"] },
  ],
};

export const SAMPLE_RDMS: ResumeDocumentModel[] = [SAMPLE_SWE, SAMPLE_DESIGNER];

/** Full fixture set including edge cases — drives Phase 1 content-resilience tests. */
export const ALL_FIXTURES: { name: string; rdm: ResumeDocumentModel }[] = [
  { name: "swe", rdm: SAMPLE_SWE },
  { name: "designer", rdm: SAMPLE_DESIGNER },
  { name: "minimal", rdm: SAMPLE_MINIMAL },
  { name: "long", rdm: SAMPLE_LONG },
  { name: "tricky", rdm: SAMPLE_TRICKY },
];
