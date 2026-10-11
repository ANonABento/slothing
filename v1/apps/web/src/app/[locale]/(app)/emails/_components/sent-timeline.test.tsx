import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SentTimeline, type EmailSendForTimeline } from "./sent-timeline";
import type { Opportunity } from "@/types/opportunity";

const jobs = [
  {
    id: "job-1",
    type: "job",
    title: "Engineer",
    company: "Acme",
    source: "manual",
    summary: "Build product flows",
    status: "saved",
    tags: [],
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "job-2",
    type: "job",
    title: "Designer",
    company: "Nimbus",
    source: "manual",
    summary: "Design product flows",
    status: "saved",
    tags: [],
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
] satisfies Opportunity[];

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

  it("renders only a visible window for large sent lists", () => {
    const sends = Array.from({ length: 200 }, (_, index) =>
      makeSend({
        id: `send-${index}`,
        recipient: `person-${index}@example.com`,
        subject: `Sent ${index}`,
      }),
    );

    render(
      <SentTimeline
        open
        onOpenChange={vi.fn()}
        sends={sends}
        jobs={jobs}
        selectedJobId="job-1"
      />,
    );

    expect(document.body.querySelectorAll("article").length).toBeLessThan(60);
    expect(screen.getByText("person-0@example.com")).toBeInTheDocument();
    expect(
      screen.queryByText("person-199@example.com"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /View/ })[0]);
    expect(screen.getByText("Full sent body")).toBeInTheDocument();
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
