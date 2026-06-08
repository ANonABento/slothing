// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { runDraftSubmission } from "./submit-runner";
import type { ApprovedDraftPayload } from "../../shared/types";

function leverPage(): Document {
  document.body.innerHTML = `
    <form class="application-form">
      <label for="q1">Why us?</label><textarea id="q1"></textarea>
      <button type="submit">Submit application</button>
    </form>
  `;
  return document;
}

const DRAFT: ApprovedDraftPayload = {
  id: "d1",
  jobId: "job-1",
  status: "approved",
  questions: [{ id: "q1", label: "Why us?" }],
  answers: [{ questionId: "q1", value: "Mission" }],
};

describe("runDraftSubmission", () => {
  it("submits and reports the result", async () => {
    const reporter = { reportSubmitResult: vi.fn().mockResolvedValue({}) };
    const result = await runDraftSubmission(DRAFT, reporter, {
      doc: leverPage(),
      host: "jobs.lever.co",
    });
    expect(result.ok).toBe(true);
    expect(reporter.reportSubmitResult).toHaveBeenCalledWith("d1", {
      ok: true,
      atsRef: undefined,
      error: undefined,
    });
  });

  it("does not report on a dry run", async () => {
    const reporter = { reportSubmitResult: vi.fn().mockResolvedValue({}) };
    const result = await runDraftSubmission(DRAFT, reporter, {
      doc: leverPage(),
      host: "jobs.lever.co",
      dryRun: true,
    });
    expect(result.dryRun).toBe(true);
    expect(reporter.reportSubmitResult).not.toHaveBeenCalled();
  });

  it("reports needs_human for unsupported hosts", async () => {
    const reporter = { reportSubmitResult: vi.fn().mockResolvedValue({}) };
    const result = await runDraftSubmission(DRAFT, reporter, {
      doc: leverPage(),
      host: "careers.example.com",
    });
    expect(result.needsHuman).toBe(true);
    expect(reporter.reportSubmitResult).toHaveBeenCalledWith(
      "d1",
      expect.objectContaining({ ok: false }),
    );
  });
});
