import { describe, expect, it } from "vitest";

import { detectDocumentKind } from "./detect-kind";

const wrap = (body: string) =>
  `\\documentclass{article}\n\\begin{document}\n${body}\n\\end{document}`;

describe("detectDocumentKind", () => {
  it("reads our own paragraph macros as a cover letter", () => {
    const guess = detectDocumentKind(
      wrap("\\slothingPara[id=par-000001]{Hello.}"),
    );
    expect(guess.kind).toBe("cover_letter");
    expect(guess.confidence).toBe("strong");
  });

  it("reads our own section macros as a resume", () => {
    const guess = detectDocumentKind(
      wrap("\\slothingSection[id=sec-000001]{Experience}"),
    );
    expect(guess.kind).toBe("resume");
    expect(guess.confidence).toBe("strong");
  });

  it.each([
    "Dear Hiring Manager,",
    "To whom it may concern,",
    "Dear Ms. Okonkwo,",
    "Sincerely,\\\\ Jamie",
    "Kind regards,",
  ])("treats %j as letter prose", (body) => {
    expect(detectDocumentKind(wrap(body)).kind).toBe("cover_letter");
  });

  it("ignores salutations that only appear in the preamble", () => {
    const source = `\\newcommand{\\greeting}{Dear Hiring Manager}\n${wrap("\\section{Experience}")}`;
    expect(detectDocumentKind(source).kind).toBe("resume");
  });

  it("falls back to the filename when the body says nothing", () => {
    expect(detectDocumentKind(wrap("Text."), "my-cover-letter.tex").kind).toBe(
      "cover_letter",
    );
    expect(detectDocumentKind(wrap("Text."), "jane-cv.tex").kind).toBe("cv");
    expect(detectDocumentKind(wrap("Text."), "curriculum_vitae.tex").kind).toBe(
      "cv",
    );
  });

  it("does not read 'cv' or 'cover' out of the middle of a longer word", () => {
    // "discovery" contains "cover"; "cvs" contains "cv". Substring matching would
    // mislabel both, and a wrong kind is worse than the default.
    expect(detectDocumentKind(wrap("Text."), "discovery-notes.tex").kind).toBe(
      "resume",
    );
    expect(detectDocumentKind(wrap("Text."), "cvs-pharmacy.tex").kind).toBe(
      "resume",
    );
  });

  it("prefers document evidence over a careless file name", () => {
    const guess = detectDocumentKind(
      wrap("Dear Hiring Manager,\n\nI am writing to apply."),
      "resume-final-v3.tex",
    );
    expect(guess.kind).toBe("cover_letter");
    expect(guess.confidence).toBe("strong");
  });

  it("defaults to resume, weakly, with nothing to go on", () => {
    const guess = detectDocumentKind(wrap("Some text."), "untitled.tex");
    expect(guess).toMatchObject({ kind: "resume", confidence: "weak" });
    expect(guess.reason).toBeTruthy();
  });
});
