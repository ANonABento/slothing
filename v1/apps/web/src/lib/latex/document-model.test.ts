import { beforeEach, describe, expect, it } from "vitest";

import {
  breadcrumbFor,
  buildDocumentModel,
  fieldsFor,
  flattenOutline,
  resetDocumentModelCache,
} from "./document-model";

const DOC = String.raw`\documentclass[11pt]{article}
\usepackage{slothing}
\slothingcontract{1}
\slothingset{ font = Times, accent = {20,40,90} }
\begin{document}
\slothingHeader[id=hdr-000001]{Kevin Jiang}{kevin@example.com}

\slothingSection[id=sec-exp001]{Experience}
\slothingEntry[id=ent-brk001]{Bracket Bot}{Robotics Engineer}{2025--2026}{
  \begin{slothingItems}
    \slothingItem[id=itm-plain1]{Cut calibration time 40\% by rewriting it.}
    \slothingItem[id=itm-rich01]{Shipped \slothingB{real-time} telemetry.}
  \end{slothingItems}
}

\slothingSection[id=sec-skl001]{Skills}
\slothingSkills[id=skl-000001]{TypeScript, Rust}
\end{document}`;

beforeEach(() => {
  resetDocumentModelCache();
});

describe("buildDocumentModel", () => {
  it("indexes every id-bearing span", () => {
    const model = buildDocumentModel(DOC);
    expect([...model.byId.keys()]).toEqual([
      "hdr-000001",
      "sec-exp001",
      "ent-brk001",
      "itm-plain1",
      "itm-rich01",
      "sec-skl001",
      "skl-000001",
    ]);
  });

  it("nests items under their entry and leaves sections at the root", () => {
    const { outline } = buildDocumentModel(DOC);
    expect(outline.map((n) => n.spanId)).toEqual([
      "hdr-000001",
      "sec-exp001",
      "ent-brk001",
      "sec-skl001",
      "skl-000001",
    ]);
    const entry = outline.find((n) => n.spanId === "ent-brk001");
    expect(entry?.children.map((c) => c.spanId)).toEqual([
      "itm-plain1",
      "itm-rich01",
    ]);
  });

  it("labels outline nodes with readable text, not LaTeX", () => {
    const { outline } = buildDocumentModel(DOC);
    const entry = outline.find((n) => n.spanId === "ent-brk001");
    expect(entry?.label).toBe("Bracket Bot");
    expect(entry?.children[1].label).toBe("Shipped real-time telemetry.");
  });

  it("describes an entry's fields from SPAN_SHAPES, excluding the structural body", () => {
    const fields = fieldsFor(buildDocumentModel(DOC), "ent-brk001");
    expect(fields.map((f) => f.label)).toEqual([
      "Organisation",
      "Role",
      "Dates",
    ]);
    expect(fields[0].raw).toBe("Bracket Bot");
  });

  it("shows plain fields as plain text and rich fields as their LaTeX", () => {
    const model = buildDocumentModel(DOC);
    const [plain] = fieldsFor(model, "itm-plain1");
    const [rich] = fieldsFor(model, "itm-rich01");

    expect(plain.mode).toBe("plain");
    expect(plain.display).toBe("Cut calibration time 40% by rewriting it.");

    expect(rich.mode).toBe("rich");
    // Critical: a rich field is NEVER shown as its lossy projection.
    expect(rich.display).toBe(rich.raw);
    expect(rich.display).toContain("\\slothingB{real-time}");
  });

  it("reads settings", () => {
    const { settings } = buildDocumentModel(DOC);
    expect(settings.ok).toBe(true);
    if (settings.ok) expect(settings.value.font).toBe("Times");
  });

  it("reports unreadable settings instead of throwing and blanking the editor", () => {
    const rogue = DOC.replace("font = Times", "wobble = 3");
    const { settings, spans } = buildDocumentModel(rogue);
    expect(settings.ok).toBe(false);
    // The rest of the model is still usable.
    expect(spans.length).toBeGreaterThan(0);
  });

  it("tolerates a malformed macro without losing the rest of the document", () => {
    const broken = `${DOC}\n\\slothingItem[id=itm-broken]{unclosed`;
    expect(buildDocumentModel(broken).byId.size).toBe(7);
  });

  it("flags a document that carries no settings block as unstyleable", () => {
    // An imported third-party .tex brings its own preamble; writing settings into it
    // would throw, so the panel must not offer the controls.
    const imported = String.raw`\documentclass{article}
\usepackage{titlesec}
\begin{document}
\section{Experience}
\end{document}`;
    expect(buildDocumentModel(imported).editableSettings).toBe(false);
    expect(buildDocumentModel(DOC).editableSettings).toBe(true);
  });

  it("returns an identical object for an identical source", () => {
    expect(buildDocumentModel(DOC)).toBe(buildDocumentModel(DOC));
  });

  it("rebuilds when the source changes by one character", () => {
    expect(buildDocumentModel(DOC)).not.toBe(buildDocumentModel(`${DOC} `));
  });
});

describe("breadcrumbFor", () => {
  it("walks from the outermost ancestor down to the span", () => {
    const model = buildDocumentModel(DOC);
    expect(breadcrumbFor(model, "itm-rich01").map((n) => n.spanId)).toEqual([
      "ent-brk001",
      "itm-rich01",
    ]);
  });

  it("is a single hop for a top-level span", () => {
    const model = buildDocumentModel(DOC);
    expect(breadcrumbFor(model, "sec-exp001").map((n) => n.spanId)).toEqual([
      "sec-exp001",
    ]);
  });

  it("is empty with no selection or an unknown id", () => {
    const model = buildDocumentModel(DOC);
    expect(breadcrumbFor(model, null)).toEqual([]);
    expect(breadcrumbFor(model, "itm-zzzzzz")).toEqual([]);
  });
});

describe("flattenOutline", () => {
  it("returns document order for keyboard traversal", () => {
    const model = buildDocumentModel(DOC);
    expect(flattenOutline(model.outline).map((n) => n.spanId)).toEqual([
      "hdr-000001",
      "sec-exp001",
      "ent-brk001",
      "itm-plain1",
      "itm-rich01",
      "sec-skl001",
      "skl-000001",
    ]);
  });
});
