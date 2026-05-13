import { Users, FileText, ScanSearch } from "lucide-react";
import {
  MarketingSection,
  MarketingSectionHeader,
} from "@/components/marketing/section";

const outcomes = [
  {
    icon: ScanSearch,
    title: "ATS-aware tailoring",
    description:
      "Slothing matches resume language against the exact ATS keywords most likely to be parsed.",
  },
  {
    icon: FileText,
    title: "One career profile, infinite resumes",
    description:
      "Upload once. Generate a tailored resume for every role in under a minute.",
  },
  {
    icon: Users,
    title: "Track every application",
    description:
      "Capture, prioritize, and follow up - never lose a promising lead in your inbox.",
  },
];

export function Testimonials() {
  return (
    <MarketingSection id="testimonials">
      <MarketingSectionHeader
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            How Slothing Helps
          </span>
        }
        title={
          <>
            Turn every application into a{" "}
            <span className="gradient-text">tailored opportunity</span>
          </>
        }
        description="Slothing helps you adapt your resume, manage applications, and keep your job search moving without relying on fabricated social proof."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {outcomes.map((outcome) => (
          <div
            key={outcome.title}
            className="relative rounded-2xl border bg-card p-8 transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
              <outcome.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">{outcome.title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {outcome.description}
            </p>
          </div>
        ))}
      </div>
    </MarketingSection>
  );
}
