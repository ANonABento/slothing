import { describe, expect, it } from "vitest";

import {
  buildSpanEvidence,
  isSpanAiActionId,
  SPAN_AI_ACTIONS,
} from "./ai-revise";
import { buildDocumentModel } from "./document-model";

const DOC = String.raw`\begin{document}
\slothingSection[id=sec-exp001]{Experience}
\slothingEntry[id=ent-brk001]{Bracket Bot}{Robotics Engineer}{2025--2026}{
  \begin{slothingItems}
    \slothingItem[id=itm-000001]{Cut calibration time 40\% by rewriting the solver.}
    \slothingItem[id=itm-000002]{Shipped real-time telemetry to production.}
  \end{slothingItems}
}
\slothingEntry[id=ent-other1]{Other Co}{Intern}{2024}{
  \begin{slothingItems}
    \slothingItem[id=itm-000003]{Built an unrelated internal tool.}
  \end{slothingItems}
}
\end{document}`;

const model = buildDocumentModel(DOC);

describe("buildSpanEvidence", () => {
  it("includes the line being revised", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    expect(evidence.target).toBe(
      "Cut calibration time 40% by rewriting the solver.",
    );
    expect(evidence.evidence).toContain("Cut calibration time 40%");
  });

  it("includes the role heading for context", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    // `2025--2026` stays as written: latexToPlainText deliberately does not convert
    // LaTeX dash ligatures. Converting would break the plain-text round trip, which would
    // push every dated entry into read-only rich mode.
    expect(evidence.evidence).toContain(
      "ROLE: Bracket Bot — Robotics Engineer — 2025--2026",
    );
  });

  it("includes sibling bullets from the same role", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    expect(evidence.evidence).toContain("Shipped real-time telemetry");
  });

  it("EXCLUDES bullets from a different role — facts must not leak between entries", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    expect(evidence.evidence).not.toContain("unrelated internal tool");
    expect(evidence.evidence).not.toContain("Other Co");
  });

  it("does not list the target itself as a sibling", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    const bulletLines = evidence.evidence
      .split("\n")
      .filter((line) => line.startsWith("- "));
    expect(bulletLines).toHaveLength(1);
    expect(bulletLines[0]).toContain("telemetry");
  });

  it("names its sources so the UI can tell the user what was used", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    expect(evidence.sources).toEqual([
      "this role's heading",
      "the other bullets in this role",
      "the text you are editing",
    ]);
  });

  it("works for a lone bullet with no siblings", () => {
    const evidence = buildSpanEvidence(model, "itm-000003", 0)!;
    expect(evidence.evidence).toContain("ROLE: Other Co");
    expect(evidence.evidence).not.toContain("OTHER BULLETS");
  });

  it("handles a top-level span with no parent entry", () => {
    const evidence = buildSpanEvidence(model, "sec-exp001", 0)!;
    expect(evidence.target).toBe("Experience");
    expect(evidence.evidence).toContain("Experience");
  });

  it("returns null for an unknown span or field", () => {
    expect(buildSpanEvidence(model, "itm-zzzzzz", 0)).toBeNull();
    expect(buildSpanEvidence(model, "itm-000001", 9)).toBeNull();
  });

  it("gives the model plain text, never raw LaTeX escapes", () => {
    const evidence = buildSpanEvidence(model, "itm-000001", 0)!;
    expect(evidence.evidence).not.toContain("\\%");
    expect(evidence.evidence).toContain("40%");
  });
});

describe("SPAN_AI_ACTIONS", () => {
  it("maps onto the existing grounded revise presets", () => {
    expect(SPAN_AI_ACTIONS.map((a) => a.id)).toEqual([
      "rephrase",
      "shorter",
      "impact",
      "metric",
    ]);
  });

  it("validates action ids", () => {
    expect(isSpanAiActionId("shorter")).toBe(true);
    expect(isSpanAiActionId("delete-everything")).toBe(false);
  });
});
