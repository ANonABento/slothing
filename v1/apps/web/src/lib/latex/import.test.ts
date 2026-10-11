import { describe, expect, it } from "vitest";

import {
  assessImport,
  assessImportability,
  explainCompileFailure,
  MAX_TEX_BYTES,
  titleFromFilename,
} from "./import";

const JAKES_STYLE = String.raw`\documentclass[letterpaper,11pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec, enumitem}
\begin{document}
\section{Experience}
\resumeSubheading{Bracket Bot}{2025--2026}
\end{document}`;

const OURS = String.raw`\documentclass[11pt]{article}
\usepackage{slothing}
\begin{document}
\slothingItem[id=itm-000001]{A bullet.}
\end{document}`;

describe("assessImportability", () => {
  it("accepts a complete third-party document", () => {
    expect(assessImportability(JAKES_STYLE, "resume.tex")).toBeNull();
  });

  it("rejects an empty file", () => {
    expect(assessImportability("   ", "resume.tex")?.code).toBe("empty");
  });

  it("rejects a non-.tex filename", () => {
    expect(assessImportability(JAKES_STYLE, "resume.pdf")?.code).toBe(
      "not_tex",
    );
  });

  it("accepts .TEX regardless of case", () => {
    expect(assessImportability(JAKES_STYLE, "RESUME.TEX")).toBeNull();
  });

  it("rejects a fragment with no document environment", () => {
    expect(
      assessImportability(
        "\\section{Experience}\n\\item Some bullet",
        "frag.tex",
      )?.code,
    ).toBe("no_document_body");
  });

  it("rejects something far too large to be a résumé", () => {
    const huge = `\\begin{document}${"x".repeat(MAX_TEX_BYTES + 1)}\\end{document}`;
    expect(assessImportability(huge, "resume.tex")?.code).toBe("too_large");
  });

  it("does not require a filename", () => {
    expect(assessImportability(JAKES_STYLE)).toBeNull();
  });
});

describe("assessImport", () => {
  it("reports a third-party document as importable but not addressable", () => {
    const assessment = assessImport(JAKES_STYLE);
    expect(assessment.annotated).toBe(false);
    expect(assessment.spanCount).toBe(0);
    expect(assessment.usesSlothingPackage).toBe(false);
  });

  it("recognises one of our own documents", () => {
    const assessment = assessImport(OURS);
    expect(assessment.annotated).toBe(true);
    expect(assessment.spanCount).toBe(1);
    expect(assessment.usesSlothingPackage).toBe(true);
  });

  it("lists required packages, including comma-separated ones", () => {
    expect(assessImport(JAKES_STYLE).packages).toEqual([
      "enumitem",
      "fullpage",
      "latexsym",
      "titlesec",
    ]);
  });

  it("picks up \\RequirePackage as well as \\usepackage", () => {
    expect(
      assessImport(
        String.raw`\RequirePackage{geometry}\begin{document}\end{document}`,
      ).packages,
    ).toEqual(["geometry"]);
  });
});

describe("explainCompileFailure", () => {
  it("turns a missing .sty into something actionable", () => {
    const message = explainCompileFailure(
      "! LaTeX Error: File `fontawesome5.sty' not found.",
    );
    expect(message).toContain("fontawesome5");
    expect(message).toContain("does not have available");
  });

  it("explains an undefined control sequence as a likely missing class file", () => {
    expect(explainCompileFailure("! Undefined control sequence.")).toContain(
      "class file or style file",
    );
  });

  it("returns null when it has nothing useful to add", () => {
    expect(
      explainCompileFailure("! Something entirely unexpected."),
    ).toBeNull();
  });
});

describe("titleFromFilename", () => {
  it("makes a readable title from a filename", () => {
    expect(titleFromFilename("kevin_jiang_resume.tex")).toBe(
      "Kevin jiang resume",
    );
  });

  it("falls back when there is no usable name", () => {
    expect(titleFromFilename(undefined)).toBe("Imported résumé");
    expect(titleFromFilename(".tex")).toBe("Imported résumé");
  });
});
