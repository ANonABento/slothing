import { describe, it, expect } from "vitest";
import {
  analyzeTemplateHeuristic,
  normalizeAnalysisResult,
  analyzeTemplateWithLLM,
} from "./template-analyzer";

describe("analyzeTemplateHeuristic", () => {
  it("detects dash bullet style", () => {
    const text = `John Doe
Software Engineer

Experience
- Built web applications using React
- Managed team of 5 developers
- Improved performance by 40%`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.bulletStyle).toBe("dash");
  });

  it("detects arrow bullet style", () => {
    const text = `Jane Smith
Product Manager

→ Led product launch for mobile app
→ Increased user retention by 25%
→ Managed cross-functional team`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.bulletStyle).toBe("arrow");
  });

  it("detects disc bullet style", () => {
    const text = `John Doe
Developer

• Developed REST APIs
• Created CI/CD pipelines
• Wrote unit tests`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.bulletStyle).toBe("disc");
  });

  it("detects no bullet style when none present", () => {
    const text = `John Doe
Developer

Built web applications using React and TypeScript
Managed a team of five developers on major projects
Improved application performance significantly`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.bulletStyle).toBe("none");
  });

  it("detects line section dividers", () => {
    const text = `John Doe
====================
Experience
--------------------
Software Engineer at Tech Corp`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.sectionDivider).toBe("line");
  });

  it("defaults to space section divider when no lines", () => {
    const text = `John Doe
Software Engineer

Experience
Built web applications using React and TypeScript`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.sectionDivider).toBe("space");
  });

  it("estimates characters per line from content", () => {
    const text = `John Doe - Software Engineer with extensive experience
This is a line that has about fifty characters in it roughly
Another line of similar length for consistent measurement now
Yet another line to help with the average calculation testing`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.charsPerLine).toBeGreaterThan(40);
    expect(result.charsPerLine).toBeLessThan(100);
  });

  it("defaults charsPerLine to 80 when no content lines", () => {
    const text = `Name
Title
City`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.charsPerLine).toBe(80);
  });

  it("detects centered header style", () => {
    // First line must have left padding > 20% of the avg chars per line
    // avg content line length ~70 chars, so padding needs to be > 14 chars
    const text = `                              John Doe
Experience at Company A with many responsibilities listed here right now
Another line of content that is reasonably long for measurement purposes here`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.headerStyle).toBe("centered");
  });

  it("detects left header style", () => {
    const text = `John Doe
Software Engineer at Tech Corp
Built web applications using React and TypeScript and various other frameworks
Managed development team and coordinated sprints for cross-functional projects`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.headerStyle).toBe("left");
  });

  it("detects two-column layout from tab-heavy content", () => {
    const lines = Array.from({ length: 20 }, (_, i) =>
      i % 2 === 0
        ? `Skill ${i}\tExpert\tUsed for ${i} years`
        : `Project ${i}\tLead\tTeam of ${i}`
    ).join("\n");

    const result = analyzeTemplateHeuristic(lines);

    expect(result.styles.layout).toBe("two-column");
  });

  it("detects single-column layout for normal text", () => {
    const text = `John Doe
Software Engineer

Experience
Built web applications using React
Managed team of 5 developers`;

    const result = analyzeTemplateHeuristic(text);

    expect(result.styles.layout).toBe("single-column");
  });

  it("returns complete AnalyzedTemplate structure", () => {
    const text = `John Doe - Resume\n- Experience at Company A\n- Education at University B`;
    const result = analyzeTemplateHeuristic(text);

    expect(result).toHaveProperty("styles");
    expect(result).toHaveProperty("charsPerLine");
    expect(result).toHaveProperty("margins");
    expect(result).toHaveProperty("sectionGap");
    expect(result.styles).toHaveProperty("fontFamily");
    expect(result.styles).toHaveProperty("fontSize");
    expect(result.styles).toHaveProperty("headerSize");
    expect(result.styles).toHaveProperty("sectionHeaderSize");
    expect(result.styles).toHaveProperty("lineHeight");
    expect(result.styles).toHaveProperty("accentColor");
    expect(result.styles).toHaveProperty("layout");
    expect(result.styles).toHaveProperty("headerStyle");
    expect(result.styles).toHaveProperty("bulletStyle");
    expect(result.styles).toHaveProperty("sectionDivider");
    expect(result.margins).toHaveProperty("top");
    expect(result.margins).toHaveProperty("bottom");
    expect(result.margins).toHaveProperty("left");
    expect(result.margins).toHaveProperty("right");
  });
});

describe("normalizeAnalysisResult", () => {
  it("applies defaults for empty input", () => {
    const result = normalizeAnalysisResult({});

    expect(result.styles.fontFamily).toBe("'Helvetica Neue', Arial, sans-serif");
    expect(result.styles.fontSize).toBe("11pt");
    expect(result.styles.headerSize).toBe("20pt");
    expect(result.styles.sectionHeaderSize).toBe("12pt");
    expect(result.styles.lineHeight).toBe("1.4");
    expect(result.styles.accentColor).toBe("#333333");
    expect(result.styles.layout).toBe("single-column");
    expect(result.styles.headerStyle).toBe("left");
    expect(result.styles.bulletStyle).toBe("disc");
    expect(result.styles.sectionDivider).toBe("line");
    expect(result.charsPerLine).toBe(80);
    expect(result.margins.top).toBe("0.5in");
    expect(result.sectionGap).toBe("16px");
  });

  it("preserves valid values", () => {
    const result = normalizeAnalysisResult({
      fontFamily: "'Inter', sans-serif",
      fontSize: "10pt",
      headerSize: "24pt",
      sectionHeaderSize: "13pt",
      lineHeight: "1.6",
      accentColor: "#2563eb",
      layout: "two-column",
      headerStyle: "centered",
      bulletStyle: "arrow",
      sectionDivider: "space",
      charsPerLine: 65,
      margins: { top: "1in", bottom: "1in", left: "1in", right: "1in" },
      sectionGap: "20px",
    });

    expect(result.styles.fontFamily).toBe("'Inter', sans-serif");
    expect(result.styles.fontSize).toBe("10pt");
    expect(result.styles.accentColor).toBe("#2563eb");
    expect(result.styles.layout).toBe("two-column");
    expect(result.styles.headerStyle).toBe("centered");
    expect(result.styles.bulletStyle).toBe("arrow");
    expect(result.styles.sectionDivider).toBe("space");
    expect(result.charsPerLine).toBe(65);
    expect(result.margins.top).toBe("1in");
    expect(result.sectionGap).toBe("20px");
  });

  it("rejects invalid hex colors", () => {
    const result = normalizeAnalysisResult({
      accentColor: "not-a-color",
    });

    expect(result.styles.accentColor).toBe("#333333");
  });

  it("rejects invalid enum values", () => {
    const result = normalizeAnalysisResult({
      layout: "three-column" as never,
      headerStyle: "right" as never,
      bulletStyle: "star" as never,
      sectionDivider: "double-line" as never,
    });

    expect(result.styles.layout).toBe("single-column");
    expect(result.styles.headerStyle).toBe("left");
    expect(result.styles.bulletStyle).toBe("disc");
    expect(result.styles.sectionDivider).toBe("line");
  });

  it("rejects negative charsPerLine", () => {
    const result = normalizeAnalysisResult({ charsPerLine: -10 });
    expect(result.charsPerLine).toBe(80);
  });

  it("rejects zero charsPerLine", () => {
    const result = normalizeAnalysisResult({ charsPerLine: 0 });
    expect(result.charsPerLine).toBe(80);
  });

  it("handles partial margins", () => {
    const result = normalizeAnalysisResult({
      margins: { top: "1in" },
    });

    expect(result.margins.top).toBe("1in");
    expect(result.margins.bottom).toBe("0.5in");
    expect(result.margins.left).toBe("0.75in");
    expect(result.margins.right).toBe("0.75in");
  });
});

describe("analyzeTemplateWithLLM", () => {
  it("falls back to heuristic when no LLM client provided", async () => {
    const text = `John Doe
- Built web applications
- Managed team of developers`;

    const result = await analyzeTemplateWithLLM(text, null);

    expect(result.styles.bulletStyle).toBe("dash");
    expect(result).toHaveProperty("charsPerLine");
    expect(result).toHaveProperty("margins");
  });
});
