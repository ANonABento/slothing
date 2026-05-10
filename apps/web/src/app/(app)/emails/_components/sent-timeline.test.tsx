import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SentTimeline, type EmailSendForTimeline } from "./sent-timeline";
import type { JobDescription } from "@/types";

const jobs = [
  { id: "job-1", title: "Engineer", company: "Acme" },
  { id: "job-2", title: "Designer", company: "Nimbus" },
] as JobDescription[];

function makeSend(
  overrides: Partial<EmailSendForTimeline> = {},
): EmailSendForTimeline {
  return {
    id: "send-1",
    type: "recruiter_reply",
    jobId: "job-1",
    recipient: "recruiter@example.com",
    subject: "Interested",
    body: "Full sent body",
    status: "sent",
    sentAt: "2026-05-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("SentTimeline", () => {
  it("renders sends and toggles the read-only body", () => {
    render(
      <SentTimeline
        open
        onOpenChange={vi.fn()}
        sends={[makeSend()]}
        jobs={jobs}
        selectedJobId="job-1"
      />,
    );

    expect(screen.getByText("recruiter@example.com")).toBeInTheDocument();
    expect(screen.queryByText("Full sent body")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /View/ }));
    expect(screen.getByText("Full sent body")).toBeInTheDocument();
  });

  it("filters to the selected company", () => {
    render(
      <SentTimeline
        open
        onOpenChange={vi.fn()}
        sends={[
          makeSend({ id: "send-1", subject: "Acme note", jobId: "job-1" }),
          makeSend({ id: "send-2", subject: "Nimbus note", jobId: "job-2" }),
        ]}
        jobs={jobs}
        selectedJobId="job-1"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "This company" }));

    expect(screen.getByText("Acme note")).toBeInTheDocument();
    expect(screen.queryByText("Nimbus note")).not.toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(
      <SentTimeline
        open
        onOpenChange={vi.fn()}
        sends={[]}
        jobs={jobs}
        selectedJobId="job-1"
      />,
    );

    expect(
      screen.getByText(
        /No sent emails yet. Sending via Gmail will record here/,
      ),
    ).toBeInTheDocument();
  });
});
