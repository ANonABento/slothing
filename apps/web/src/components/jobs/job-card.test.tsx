import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import type { JobDescription } from "@/types";
import { JobCard } from "./job-card";

type JobCardProps = ComponentProps<typeof JobCard>;

const job: JobDescription = {
  id: "job-1",
  title: "Frontend Engineer",
  company: "Acme",
  description: "Build product experiences",
  requirements: [],
  responsibilities: [],
  keywords: ["React", "TypeScript"],
  status: "saved",
  createdAt: "2026-05-01T00:00:00.000Z",
};

function renderJobCard(overrides: Partial<JobCardProps> = {}) {
  return render(
    <JobCard
      job={job}
      analyzing={false}
      generating={false}
      templates={[
        { id: "classic", name: "Classic", description: "Traditional" },
        { id: "modern", name: "Modern", description: "Modern" },
      ]}
      selectedTemplate="classic"
      expanded={false}
      atsAnalyzing={false}
      onSelectTemplate={vi.fn()}
      onAnalyze={vi.fn()}
      onGenerate={vi.fn()}
      onDelete={vi.fn()}
      onStatusChange={vi.fn()}
      onToggleExpand={vi.fn()}
      onAtsCheck={vi.fn()}
      onAtsDialogOpen={vi.fn()}
      onCoverLetter={vi.fn()}
      {...overrides}
    />,
  );
}

describe("JobCard", () => {
  it("renders the primary action cluster with inline match, ATS, resume, and cover letter actions", () => {
    renderJobCard();

    expect(
      screen.getByRole("button", { name: /Analyze Match/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ATS Check/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Resume$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cover Letter/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Company Research")).toBeInTheDocument();
  });

  it("invokes the analyze handler when Analyze Match is clicked", () => {
    const onAnalyze = vi.fn();
    renderJobCard({ onAnalyze });

    fireEvent.click(screen.getByRole("button", { name: /Analyze Match/i }));

    expect(onAnalyze).toHaveBeenCalledTimes(1);
  });

  it("invokes the cover letter handler when Cover Letter is clicked", () => {
    const onCoverLetter = vi.fn();
    renderJobCard({ onCoverLetter });

    fireEvent.click(screen.getByRole("button", { name: /Cover Letter/i }));

    expect(onCoverLetter).toHaveBeenCalledTimes(1);
  });
});
