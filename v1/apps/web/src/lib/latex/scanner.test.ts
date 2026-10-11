import { describe, expect, it } from "vitest";

import { createSpanId, isSpanId } from "./contract";
import { findSpan, parseIdOption, patchSpanField, scanSpans } from "./scanner";

const DOC = String.raw`\documentclass[11pt]{article}
\usepackage{slothing}
\slothingcontract{1}
\slothingset{ font = LatinModern, accent = {20,40,90} }
\begin{document}
\slothingHeader[id=hdr-000001]{Kevin Jiang}{kevin@example.com}

\slothingSection[id=sec-a3f91c]{Experience}
\slothingEntry[id=ent-7b21e4]{Bracket Bot}{Robotics Engineer}{2025--2026}{
  \begin{slothingItems}
    \slothingItem[id=itm-c4d883]{Cut calibration time 40\% by rewriting it.}
    \slothingItem[id=itm-91ea27]{Shipped \slothingB{real-time} telemetry.}
  \end{slothingItems}
}
% a comment mentioning \slothingItem{not real}
\end{document}`;

describe("scanSpans", () => {
  it("finds every contract span including ones nested in an entry body", () => {
    const spans = scanSpans(DOC);
    expect(spans.map((s) => s.id)).toEqual([
      "hdr-000001",
      "sec-a3f91c",
      "ent-7b21e4",
      "itm-c4d883",
      "itm-91ea27",
    ]);
  });

  it("ignores contract macros inside comments", () => {
    const spans = scanSpans(DOC);
    expect(spans.filter((s) => s.kind === "item")).toHaveLength(2);
  });

  it("links nested items to their parent entry", () => {
    const spans = scanSpans(DOC);
    const item = findSpan(spans, "itm-c4d883");
    expect(item?.parentId).toBe("ent-7b21e4");
    expect(findSpan(spans, "ent-7b21e4")?.childIds).toContain("itm-91ea27");
  });

  it("captures each brace argument of a 4-arity entry", () => {
    const entry = findSpan(scanSpans(DOC), "ent-7b21e4");
    expect(entry?.args).toHaveLength(4);
    expect(entry?.args[0].text).toBe("Bracket Bot");
    expect(entry?.args[1].text).toBe("Robotics Engineer");
    expect(entry?.args[2].text).toBe("2025--2026");
  });

  it("does not mistake an escaped brace for a group delimiter", () => {
    const src = String.raw`\slothingItem[id=itm-aaaaaa]{cost \{fixed\} and \% done}`;
    const span = scanSpans(src)[0];
    expect(span.args[0].text).toBe(String.raw`cost \{fixed\} and \% done`);
  });

  it("skips a malformed macro rather than guessing at its extent", () => {
    const src = String.raw`\slothingItem[id=itm-bbbbbb]{unclosed`;
    expect(scanSpans(src)).toHaveLength(0);
  });
});

describe("patchSpanField", () => {
  it("rewrites only the targeted field and leaves every other byte untouched", () => {
    const next = patchSpanField(DOC, "itm-c4d883", 0, "Replaced text.");
    expect(next).toContain(
      String.raw`\slothingItem[id=itm-c4d883]{Replaced text.}`,
    );
    // Everything around it survives byte-for-byte.
    expect(next.slice(0, DOC.indexOf("Cut calibration"))).toBe(
      DOC.slice(0, DOC.indexOf("Cut calibration")),
    );
    expect(next).toContain(
      String.raw`% a comment mentioning \slothingItem{not real}`,
    );
    expect(next).toContain(String.raw`\slothingB{real-time}`);
  });

  it("round-trips: patching a field to its own value is a no-op", () => {
    const spans = scanSpans(DOC);
    let out = DOC;
    for (const span of spans) {
      span.args.forEach((arg, index) => {
        if (span.id) out = patchSpanField(out, span.id, index, arg.text);
      });
    }
    expect(out).toBe(DOC);
  });

  it("throws for an unknown span id rather than silently doing nothing", () => {
    expect(() => patchSpanField(DOC, "itm-zzzzzz", 0, "x")).toThrow(
      /No span with id/,
    );
  });

  it("throws for a field index the span does not have", () => {
    expect(() => patchSpanField(DOC, "itm-c4d883", 3, "x")).toThrow(
      /no field at index/,
    );
  });
});

describe("span ids", () => {
  it("mints opaque prefixed ids", () => {
    const id = createSpanId("item");
    expect(id).toMatch(/^itm-[0-9a-f]{6}$/);
    expect(isSpanId(id)).toBe(true);
  });

  it("does not collide across a large batch", () => {
    const ids = new Set(
      Array.from({ length: 500 }, () => createSpanId("section")),
    );
    expect(ids.size).toBeGreaterThan(490);
  });

  it("reads an id out of an optional-argument body", () => {
    expect(parseIdOption("id=itm-c4d883")).toBe("itm-c4d883");
    expect(parseIdOption("tone=muted, id=sec-a1b2c3")).toBe("sec-a1b2c3");
    expect(parseIdOption("tone=muted")).toBeNull();
  });
});
