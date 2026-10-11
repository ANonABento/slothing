import { describe, expect, it } from "vitest";

import {
  isValidInline,
  latexToPlainText,
  plainTextToLatex,
  validateInlineSubset,
} from "./inline";

describe("plainTextToLatex", () => {
  it("escapes the characters that would otherwise be markup", () => {
    expect(plainTextToLatex("100% of $5 & rising_fast")).toBe(
      String.raw`100\% of \$5 \& rising\_fast`,
    );
  });
});

describe("validateInlineSubset", () => {
  it("accepts escaped text with the three allowed macros", () => {
    expect(
      isValidInline(
        String.raw`Shipped \slothingB{real-time} \slothingI{telemetry} to \slothingLink{https://example.com}{prod} at 40\%`,
      ),
    ).toBe(true);
  });

  it("rejects any other macro — this is the AI security boundary", () => {
    const violations = validateInlineSubset(String.raw`\input{/etc/passwd}`);
    expect(violations).toContainEqual(
      expect.objectContaining({ kind: "disallowed-macro", macro: "input" }),
    );
  });

  it("rejects shell-escape attempts", () => {
    expect(isValidInline(String.raw`\write18{rm -rf /}`)).toBe(false);
  });

  it("rejects unbalanced braces that would swallow the rest of the document", () => {
    expect(validateInlineSubset("text {")).toContainEqual({
      kind: "unbalanced-braces",
    });
    expect(validateInlineSubset("text }")).toContainEqual({
      kind: "unbalanced-braces",
    });
  });

  it("rejects a link with a non-http scheme", () => {
    expect(
      validateInlineSubset(String.raw`\slothingLink{javascript:alert(1)}{x}`),
    ).toContainEqual(expect.objectContaining({ kind: "unsafe-url" }));
  });

  it("allows mailto links", () => {
    expect(
      isValidInline(String.raw`\slothingLink{mailto:a@b.com}{email}`),
    ).toBe(true);
  });

  it("reports every violation, not just the first, so a retry can be specific", () => {
    const violations = validateInlineSubset(
      String.raw`\input{x} and \usepackage{y}`,
    );
    expect(
      violations.filter((v) => v.kind === "disallowed-macro"),
    ).toHaveLength(2);
  });
});

describe("latexToPlainText", () => {
  it("unwraps the allowed macros for display in the inspector", () => {
    expect(
      latexToPlainText(
        String.raw`Shipped \slothingB{real-time} to \slothingLink{https://x.com}{prod} at 40\%`,
      ),
    ).toBe("Shipped real-time to prod at 40%");
  });

  it("round-trips plain text through escaping", () => {
    const original = "Cut cost by 40% & shipped $2M_value";
    expect(latexToPlainText(plainTextToLatex(original))).toBe(original);
  });
});
