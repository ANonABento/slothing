import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DraftsSheet, type EmailDraftForSheet } from "./drafts-sheet";
import type { JobDescription } from "@/types";

const jobs = [
  { id: "job-1", title: "Designer", company: "Acme" },
] as JobDescription[];

function makeDraft(
  overrides: Partial<EmailDraftForSheet> = {},
): EmailDraftForSheet {
  return {
    id: "draft-1",
    type: "cold_outreach",
    jobId: "job-1",
    subject: "Hello Acme",
    body: "Body",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("DraftsSheet", () => {
  it("renders drafts and continues one", () => {
    const onLoadDraft = vi.fn();
    render(
      <DraftsSheet
        open
        onOpenChange={vi.fn()}
        drafts={[makeDraft()]}
        jobs={jobs}
        onLoadDraft={onLoadDraft}
        onDeleteDraft={vi.fn()}
      />,
    );

    expect(screen.getByText("Hello Acme")).toBeInTheDocument();
    expect(screen.getByText(/Cold Outreach/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onLoadDraft).toHaveBeenCalledWith(
      expect.objectContaining({ id: "draft-1" }),
    );
  });

  it("shows search after ten drafts and filters the list", () => {
    const drafts = Array.from({ length: 11 }, (_, index) =>
      makeDraft({
        id: `draft-${index}`,
        subject: index === 10 ? "Need reference" : `Hello ${index}`,
        type: index === 10 ? "reference_request" : "cold_outreach",
      }),
    );

    render(
      <DraftsSheet
        open
        onOpenChange={vi.fn()}
        drafts={drafts}
        jobs={jobs}
        onLoadDraft={vi.fn()}
        onDeleteDraft={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search drafts"), {
      target: { value: "reference" },
    });

    expect(screen.getByText("Need reference")).toBeInTheDocument();
    expect(screen.queryByText("Hello 1")).not.toBeInTheDocument();
  });

  it("renders only a visible window for large draft lists", () => {
    const drafts = Array.from({ length: 200 }, (_, index) =>
      makeDraft({
        id: `draft-${index}`,
        subject: `Draft ${index}`,
      }),
    );

    render(
      <DraftsSheet
        open
        onOpenChange={vi.fn()}
        drafts={drafts}
        jobs={jobs}
        onLoadDraft={vi.fn()}
        onDeleteDraft={vi.fn()}
      />,
    );

    expect(document.body.querySelectorAll("article").length).toBeLessThan(60);
    expect(screen.getByText("Draft 0")).toBeInTheDocument();
    expect(screen.queryByText("Draft 199")).not.toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(
      <DraftsSheet
        open
        onOpenChange={vi.fn()}
        drafts={[]}
        jobs={jobs}
        onLoadDraft={vi.fn()}
        onDeleteDraft={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "No drafts yet. Generated emails are saved here automatically.",
      ),
    ).toBeInTheDocument();
  });
});
