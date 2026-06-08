// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { SubmitOrchestrator, buildAnswerFills } from "./submit-orchestrator";
import type { ApprovedDraftPayload } from "../../shared/types";

function greenhousePage(): Document {
  document.body.innerHTML = `
    <form id="application-form">
      <label for="q1">Why this company?</label>
      <textarea id="q1"></textarea>
      <label for="q2">Years of Go</label>
      <input id="q2" />
      <button type="submit">Submit application</button>
    </form>
  `;
  return document;
}

const DRAFT: ApprovedDraftPayload = {
  id: "d1",
  jobId: "job-1",
  status: "approved",
  questions: [
    { id: "q1", label: "Why this company?" },
    { id: "q2", label: "Years of Go" },
  ],
  answers: [
    { questionId: "q1", value: "Mission fit." },
    { questionId: "q2", value: "6" },
  ],
};

describe("buildAnswerFills", () => {
  it("joins answers to their question labels", () => {
    expect(buildAnswerFills(DRAFT)).toEqual([
      { questionId: "q1", label: "Why this company?", value: "Mission fit." },
      { questionId: "q2", label: "Years of Go", value: "6" },
    ]);
  });
});

describe("SubmitOrchestrator", () => {
  it("refuses to submit a draft that is not approved (gate)", async () => {
    const orch = new SubmitOrchestrator(
      greenhousePage(),
      "boards.greenhouse.io",
    );
    const result = await orch.submit({ ...DRAFT, status: "pending_review" });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/only approved/i);
  });

  it("marks unsupported ATS hosts needs_human", async () => {
    const orch = new SubmitOrchestrator(
      greenhousePage(),
      "careers.example.com",
    );
    const result = await orch.submit(DRAFT);
    expect(result.ok).toBe(false);
    expect(result.needsHuman).toBe(true);
  });

  it("fills but does not submit on dry-run", async () => {
    const doc = greenhousePage();
    let clicked = false;
    doc
      .querySelector("button")!
      .addEventListener("click", () => (clicked = true));
    const orch = new SubmitOrchestrator(doc, "boards.greenhouse.io");
    const result = await orch.submit(DRAFT, { dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(result.filled).toBe(2);
    expect(clicked).toBe(false);
    expect((doc.querySelector("#q1") as HTMLTextAreaElement).value).toBe(
      "Mission fit.",
    );
  });

  it("fills and clicks submit for an approved greenhouse draft", async () => {
    const doc = greenhousePage();
    let clicked = false;
    doc
      .querySelector("button")!
      .addEventListener("click", () => (clicked = true));
    const orch = new SubmitOrchestrator(doc, "boards.greenhouse.io");
    const result = await orch.submit(DRAFT);
    expect(result.ok).toBe(true);
    expect(result.filled).toBe(2);
    expect(clicked).toBe(true);
  });
});
