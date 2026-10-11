import type { Profile } from "../types";

export const profile: Profile = {
  contact: { name: "Alex Rivera", email: "alex@example.com", phone: "555-0100", location: "Toronto, ON", links: ["github.com/alexr"] },
  summary: "Full-stack engineer focused on developer tools.",
  experience: [
    {
      id: "exp_a",
      company: "Acme & Co",
      title: "Senior Software Engineer",
      location: "Remote",
      start: "Jan 2022",
      end: "Present",
      bullets: [
        { id: "b1", text: "Cut CI time by 40% by parallelising the test suite across 12 runners." },
        { id: "b2", text: "Led migration of 3 services from REST to GraphQL using TypeScript." },
      ],
    },
    {
      id: "exp_b",
      company: "Startup_X",
      title: "Software Engineer",
      location: "Toronto, ON",
      start: "2019",
      end: "2021",
      bullets: [{ id: "b3", text: "Built the billing system handling $2M/yr in payments (Stripe, Postgres)." }],
    },
  ],
  education: [{ id: "edu_a", school: "University of Waterloo", degree: "BASc, Computer Engineering", location: "Waterloo, ON", start: "2015", end: "2019", details: "" }],
  projects: [{ id: "prj_a", name: "slothing", url: "github.com/alexr/slothing", bullets: [{ id: "b4", text: "Open-source job search assistant {with} 100% of #edge_cases ~covered^." }] }],
  skills: [{ id: "sk_a", category: "Languages", items: ["TypeScript", "Python", "SQL"] }],
};
