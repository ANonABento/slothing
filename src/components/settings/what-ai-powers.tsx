"use client";

import { FileText, Mail, Sparkles } from "lucide-react";
import { PageIconTile, PageSection } from "@/components/ui/page-layout";

const FEATURE_DESCRIPTIONS = [
  {
    title: "Resume Parsing",
    description:
      "Extract skills, experience, and education from uploaded resumes automatically",
    icon: FileText,
    iconClassName: "text-info",
    color: "bg-info/10",
  },
  {
    title: "Resume Tailoring",
    description:
      "Generate job-specific resumes optimized for ATS and recruiter review",
    icon: Sparkles,
    iconClassName: "text-warning",
    color: "bg-warning/10",
  },
  {
    title: "Cover Letters",
    description:
      "Create personalized cover letters matching your profile to job requirements",
    icon: Mail,
    iconClassName: "text-accent",
    color: "bg-accent/10",
  },
];

export function WhatAiPowers() {
  return (
    <PageSection
      title="What AI Powers"
      description="Your configured provider enables these features."
      icon={Sparkles}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {FEATURE_DESCRIPTIONS.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
          >
            <PageIconTile
              icon={feature.icon}
              size="sm"
              className={feature.color}
              iconClassName={feature.iconClassName}
            />
            <div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
