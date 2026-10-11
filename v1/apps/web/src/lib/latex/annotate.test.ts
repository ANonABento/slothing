import { describe, expect, it } from "vitest";

import {
  buildAnnotatePrompt,
  checkAnnotationShape,
  contentWords,
  summarizeAnnotation,
} from "./annotate";
import { compareRenderedText, normalizePdfText } from "./pdf-text";

const ORIGINAL = String.raw`\documentclass{article}
\usepackage{titlesec}
\begin{document}
\section{Experience}
\begin{itemize}
  \item Cut calibration time 40\% by rewriting the solver.
  \item Shipped real-time telemetry.
\end{itemize}
\end{document}`;

const GOOD = String.raw`\documentclass{article}
\usepackage{titlesec}
\begin{document}
\slothingSection[id=sec-a1b2c3]{Experience}
\begin{itemize}
  \slothingItem[id=itm-d4e5f6]{Cut calibration time 40\% by rewriting the solver.}
  \slothingItem[id=itm-a7b8c9]{Shipped real-time telemetry.}
\end{itemize}
\end{document}`;

describe("checkAnnotationShape — accepting good work", () => {
  it("accepts an annotation that only wraps existing content", () => {
    const result = checkAnnotationShape(ORIGINAL, GOOD);
    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.spanCount).toBe(3);
    expect(result.byKind).toEqual({ section: 1, item: 2 });
  });

  it("accepts a partial annotation — wrapping some structure is fine", () => {
    const partial = ORIGINAL.replace(
      "\\section{Experience}",
      "\\slothingSection[id=sec-a1b2c3]{Experience}",
    );
    expect(checkAnnotationShape(ORIGINAL, partial).ok).toBe(true);
  });
});

describe("checkAnnotationShape — rejecting bad work", () => {
  it("rejects an annotation that changed the wording", () => {
    const reworded = GOOD.replace(
      "Shipped real-time telemetry.",
      "Delivered real-time telemetry systems.",
    );
    const result = checkAnnotationShape(ORIGINAL, reworded);
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.code)).toContain("content_lost");
  });

  it("rejects an annotation that invented a metric", () => {
    const embellished = GOOD.replace("40\\%", "87\\%");
    const result = checkAnnotationShape(ORIGINAL, embellished);
    expect(result.ok).toBe(false);
    expect(result.issues.map((i) => i.code)).toEqual(
      expect.arrayContaining(["content_lost", "content_added"]),
    );
  });

  it("rejects an annotation that dropped a bullet entirely", () => {
    const dropped = GOOD.replace(
      "  \\slothingItem[id=itm-a7b8c9]{Shipped real-time telemetry.}\n",
      "",
    );
    expect(
      checkAnnotationShape(ORIGINAL, dropped).issues.map((i) => i.code),
    ).toContain("content_lost");
  });

  it("rejects a malformed macro that would not compile", () => {
    const malformed = GOOD.replace(
      "\\slothingItem[id=itm-d4e5f6]{Cut calibration time 40\\% by rewriting the solver.}",
      "\\slothingItem[id=itm-d4e5f6]{Cut calibration time 40\\% by rewriting the solver.",
    );
    expect(
      checkAnnotationShape(ORIGINAL, malformed).issues.map((i) => i.code),
    ).toContain("malformed_macro");
  });

  it("rejects duplicate span ids", () => {
    const duplicated = GOOD.replace("itm-a7b8c9", "itm-d4e5f6");
    expect(
      checkAnnotationShape(ORIGINAL, duplicated).issues.map((i) => i.code),
    ).toContain("duplicate_id");
  });

  it("rejects a malformed span id", () => {
    const badId = GOOD.replace("id=sec-a1b2c3", "id=section-one");
    expect(
      checkAnnotationShape(ORIGINAL, badId).issues.map((i) => i.code),
    ).toContain("bad_id");
  });

  it("rejects an annotation that added no structure at all", () => {
    expect(
      checkAnnotationShape(ORIGINAL, ORIGINAL).issues.map((i) => i.code),
    ).toContain("no_spans");
  });
});

describe("marks — annotating a foreign document", () => {
  // \slothingItem emits its own \item, so it cannot wrap a bullet that already lives in
  // someone else's list. \slothingMark renders nothing of its own, which is the only safe
  // way to annotate a .tex we did not generate.
  const FOREIGN = String.raw`\begin{document}
\resumeItem{Cut calibration time 40\% by rewriting the solver.}
\end{document}`;
  const MARKED = String.raw`\begin{document}
\resumeItem{\slothingMark[id=mrk-a1b2c3]{Cut calibration time 40\% by rewriting the solver.}}
\end{document}`;

  it("accepts a mark that wraps existing text", () => {
    const result = checkAnnotationShape(FOREIGN, MARKED);
    expect(result.ok).toBe(true);
    expect(result.byKind).toEqual({ mark: 1 });
  });

  it("still catches a mark that altered the text it wrapped", () => {
    const tampered = MARKED.replace("40\\%", "87\\%");
    expect(checkAnnotationShape(FOREIGN, tampered).ok).toBe(false);
  });

  it("summarises marks as editable fields", () => {
    expect(summarizeAnnotation({ mark: 9 })).toBe("9 editable fields");
    expect(summarizeAnnotation({ mark: 1 })).toBe("1 editable field");
  });
});

describe("contentWords", () => {
  it("ignores LaTeX control sequences and keeps prose", () => {
    const words = contentWords(
      String.raw`\section{Experience} \item Cut cost 40\%`,
    );
    expect(words).toContain("experience");
    expect(words).toContain("cut");
    expect(words).not.toContain("section");
    expect(words).not.toContain("item");
  });

  it("keeps figures, so an invented metric is detectable", () => {
    expect(contentWords(String.raw`Cut cost 40\% in Q3`)).toContain("40");
  });
});

describe("summarizeAnnotation", () => {
  it("describes the structure in words a person can judge", () => {
    expect(summarizeAnnotation({ section: 2, entry: 3, item: 11 })).toBe(
      "2 sections, 3 roles, 11 bullets",
    );
  });

  it("uses singulars correctly", () => {
    expect(summarizeAnnotation({ section: 1, item: 1 })).toBe(
      "1 section, 1 bullet",
    );
  });

  it("handles finding nothing", () => {
    expect(summarizeAnnotation({})).toBe("no structure");
  });
});

describe("render comparison", () => {
  it("treats reflowed whitespace as identical — LaTeX may rewrap", () => {
    expect(
      compareRenderedText("Kevin Jiang\nExperience", "Kevin Jiang   Experience")
        .identical,
    ).toBe(true);
  });

  it("normalises ligatures and smart quotes", () => {
    expect(normalizePdfText("ﬁnance ‘quoted’")).toBe("finance 'quoted'");
  });

  it("catches a real content change and says where", () => {
    const result = compareRenderedText("Cut cost 40%", "Cut cost 87%");
    expect(result.identical).toBe(false);
    expect(result.divergenceAt).toBe(9);
  });
});

describe("buildAnnotatePrompt", () => {
  it("states the do-not-change rule before anything else", () => {
    const prompt = buildAnnotatePrompt(ORIGINAL);
    expect(prompt).toContain("Do NOT change");
    expect(prompt).toContain("character-for-character identical");
    // Leaving structure alone must be presented as acceptable, or the model will force it.
    expect(prompt).toContain("LEAVE IT ALONE");
  });

  it("includes the source", () => {
    expect(buildAnnotatePrompt(ORIGINAL)).toContain("\\section{Experience}");
  });
});
