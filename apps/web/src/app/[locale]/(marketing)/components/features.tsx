import { Database, FileSearch, Wand2, ScanSearch } from "lucide-react";
import {
  MarketingSection,
  MarketingSectionHeader,
} from "@/components/marketing/section";

const features = [
  {
    icon: Database,
    title: "Career profile",
    description:
      "Upload resumes, cover letters, and career docs. Slothing organizes everything into a searchable career profile — your career history, always ready.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: FileSearch,
    title: "Smart Parser",
    description:
      "Deterministic section detection extracts experience, education, skills, and projects with precision. No LLM guesswork for structured data.",
    gradient: "from-rose-400 to-orange-400",
  },
  {
    icon: Wand2,
    title: "AI Tailoring",
    description:
      "Match your bank against any job description. Slothing generates a tailored resume that highlights exactly what the role demands.",
    gradient: "from-blue-500 to-indigo-400",
  },
  {
    icon: ScanSearch,
    title: "ATS Scanner",
    description:
      "Score your resume against real ATS criteria — keyword matching, formatting, section completeness. Fix issues before you apply.",
    gradient: "from-amber-400 to-orange-400",
  },
];

export function Features() {
  return (
    <MarketingSection id="features">
      <MarketingSectionHeader
        eyebrow={
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Features
          </span>
        }
        title={
          <>
            Your career data,{" "}
            <span className="gradient-text">working for you</span>
          </>
        }
        description="Slothing combines smart parsing with AI tailoring to turn your career history into job-winning resumes."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 ${feature.gradient} text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110`}
            >
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </MarketingSection>
  );
}
