import type { Metadata } from "next";
import { ScannerForm } from "@/components/ats/scanner-form";
import { ShieldCheck, Zap, Eye, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker | Slothing",
  description:
    "Check your resume's ATS compatibility score for free. Upload a PDF, import a job URL, and get private in-browser scoring feedback.",
  keywords: [
    "free ATS resume checker",
    "ATS score checker",
    "resume scanner",
    "applicant tracking system",
    "resume optimization",
  ],
  openGraph: {
    title: "Free ATS Resume Checker",
    description:
      "Instant ATS compatibility score with actionable improvement suggestions. No sign-up required.",
    type: "website",
  },
};

const BENEFITS = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Score in under a second, no signup required",
  },
  {
    icon: Eye,
    title: "Detailed Breakdown",
    description: "Five scoring axes: parseability, sections, keywords, dates, and content",
  },
  {
    icon: Sparkles,
    title: "Free and Private",
    description: "Your resume is scored in your browser and nothing is stored",
  },
];

export default function ATSScannerPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Free ATS Resume Scanner
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            88% of employers say their ATS filters out qualified candidates
            before a human reviews them. Check yours in seconds.
            <sup className="ml-1 align-super text-xs">
              <a
                href="https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Source: Harvard Business School, Hidden Workers (2021)
              </a>
            </sup>
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center p-4">
              <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="font-medium text-sm">{title}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>

        {/* Scanner Form */}
        <ScannerForm />
      </div>
    </div>
  );
}
