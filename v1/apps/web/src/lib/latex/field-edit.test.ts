import { describe, expect, it } from "vitest";

import {
  classifyField,
  fieldDisplayText,
  flattenToPlain,
  writeField,
} from "./field-edit";
import { plainTextToLatex } from "./inline";

const DOC = String.raw`\begin{document}
\slothingItem[id=itm-plain1]{Cut calibration time 40\% by rewriting it.}
\slothingItem[id=itm-rich01]{Shipped \slothingB{real-time} telemetry.}
\end{document}`;

describe("classifyField", () => {
  // The rule IS the round trip, so the table asserts the rule and the property together.
  const cases: Array<[string, "plain" | "rich", string]> = [
    ["Plain sentence.", "plain", "ordinary prose"],
    [String.raw`Cut cost 40\% in Q3`, "plain", "escaped percent"],
    [String.raw`A \& B and \$5M and x\_y`, "plain", "the full escape set"],
    [String.raw`Shipped \slothingB{real-time} telemetry`, "rich", "bold macro"],
    [String.raw`\slothingI{italic}`, "rich", "italic macro"],
    [String.raw`See \slothingLink{https://x.com}{docs}`, "rich", "link macro"],
    [
      "  leading and trailing  ",
      "rich",
      "whitespace latexToPlainText would trim",
    ],
    [String.raw`\unknownmacro{x}`, "rich", "a macro we do not own"],
  ];

  for (const [raw, expected, why] of cases) {
    it(`classifies ${expected} — ${why}`, () => {
      expect(classifyField(raw)).toBe(expected);
    });
  }

  it("is exactly the lossless-round-trip property, not a heuristic", () => {
    for (const [raw] of cases) {
      const roundTrips = plainTextToLatex(fieldDisplayText(raw)) === raw;
      expect(classifyField(raw) === "plain").toBe(roundTrips);
    }
  });
});

describe("writeField — plain", () => {
  it("escapes and patches only the targeted field", () => {
    const result = writeField(
      DOC,
      "itm-plain1",
      0,
      "Cut calibration time 40\\% by rewriting it.",
      {
        kind: "plain",
        text: "Saved $2M & 40% of time",
      },
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.source).toContain(String.raw`Saved \$2M \& 40\% of time`);
    // The neighbouring rich bullet is untouched.
    expect(result.source).toContain(String.raw`\slothingB{real-time}`);
  });

  it("REFUSES a plain write into a rich field and returns the source byte-identical", () => {
    const result = writeField(
      DOC,
      "itm-rich01",
      0,
      String.raw`Shipped \slothingB{real-time} telemetry.`,
      { kind: "plain", text: "Shipped real-time telemetry." },
    );
    expect(result).toMatchObject({ ok: false, reason: "mode_mismatch" });
    expect(result.source).toBe(DOC);
  });

  it("re-derives the mode from stored content, not from the caller's claim", () => {
    // A stale UI thinks the field is plain. Stored content says otherwise. Storage wins.
    const result = writeField(DOC, "itm-rich01", 0, String.raw`\slothingI{x}`, {
      kind: "plain",
      text: "overwrite me",
    });
    expect(result.ok).toBe(false);
    expect(result.source).toBe(DOC);
  });
});

describe("writeField — latex", () => {
  it("accepts the allowed inline subset", () => {
    const result = writeField(DOC, "itm-rich01", 0, String.raw`\slothingB{a}`, {
      kind: "latex",
      latex: String.raw`Now \slothingI{italic} and \slothingLink{https://x.com}{a link}`,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects a disallowed macro without touching the source", () => {
    const result = writeField(DOC, "itm-rich01", 0, String.raw`\slothingB{a}`, {
      kind: "latex",
      latex: String.raw`\input{/etc/passwd}`,
    });
    expect(result).toMatchObject({ ok: false, reason: "invalid_latex" });
    expect(result.source).toBe(DOC);
    if (result.ok || result.reason !== "invalid_latex") return;
    expect(result.violations[0]).toMatchObject({ kind: "disallowed-macro" });
  });

  it("rejects unbalanced braces that would swallow the document", () => {
    const result = writeField(DOC, "itm-plain1", 0, "plain", {
      kind: "latex",
      latex: "runaway {",
    });
    expect(result).toMatchObject({ ok: false, reason: "invalid_latex" });
    expect(result.source).toBe(DOC);
  });

  it("rejects an unsafe link scheme", () => {
    const result = writeField(DOC, "itm-plain1", 0, "plain", {
      kind: "latex",
      latex: String.raw`\slothingLink{javascript:alert(1)}{x}`,
    });
    expect(result).toMatchObject({ ok: false, reason: "invalid_latex" });
    expect(result.source).toBe(DOC);
  });
});

describe("writeField — missing targets", () => {
  it("reports an unknown span without throwing", () => {
    const result = writeField(DOC, "itm-zzzzzz", 0, "x", {
      kind: "plain",
      text: "y",
    });
    expect(result).toMatchObject({ ok: false, reason: "not_found" });
    expect(result.source).toBe(DOC);
  });

  it("reports a field index the span does not have", () => {
    const result = writeField(DOC, "itm-plain1", 7, "x", {
      kind: "plain",
      text: "y",
    });
    expect(result).toMatchObject({ ok: false, reason: "not_found" });
    expect(result.source).toBe(DOC);
  });
});

describe("flattenToPlain", () => {
  it("drops formatting and yields something that classifies plain", () => {
    const flattened = flattenToPlain(
      String.raw`Shipped \slothingB{real-time} telemetry at 40\%`,
    );
    expect(classifyField(flattened)).toBe("plain");
    expect(fieldDisplayText(flattened)).toBe(
      "Shipped real-time telemetry at 40%",
    );
  });
});
