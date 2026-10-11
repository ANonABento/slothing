import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS, readSettings, writeSettings } from "./settings";

const DOC = String.raw`\usepackage{slothing}
\slothingset{
  font        = Times,
  fontsize    = 11pt,
  margin      = 0.75in,
  sectionskip = 10pt,
  accent      = {20,40,90},
  columns     = 1,
}
\begin{document}
\slothingItem[id=itm-aaaaaa]{untouched}
\end{document}`;

describe("readSettings", () => {
  it("reads a full settings block, unwrapping brace-protected values", () => {
    expect(readSettings(DOC)).toEqual({
      font: "Times",
      fontsize: "11pt",
      margin: "0.75in",
      sectionskip: "10pt",
      accent: "20,40,90",
      columns: 1,
    });
  });

  it("falls back to defaults when the document has no block", () => {
    expect(readSettings("\\begin{document}\\end{document}")).toEqual(
      DEFAULT_SETTINGS,
    );
  });

  it("fills missing keys from defaults", () => {
    const partial = String.raw`\slothingset{ font = Helvetica }`;
    expect(readSettings(partial).font).toBe("Helvetica");
    expect(readSettings(partial).margin).toBe(DEFAULT_SETTINGS.margin);
  });

  it("rejects an unknown key instead of passing it through", () => {
    const rogue = String.raw`\slothingset{ font = Times, wobble = 3 }`;
    expect(() => readSettings(rogue)).toThrow();
  });

  it("rejects a value outside the closed set", () => {
    expect(() =>
      readSettings(String.raw`\slothingset{ font = Comic }`),
    ).toThrow();
    expect(() =>
      readSettings(String.raw`\slothingset{ margin = 10furlongs }`),
    ).toThrow();
  });
});

describe("writeSettings", () => {
  it("splices only the block and preserves the rest of the document", () => {
    const next = writeSettings(DOC, {
      ...readSettings(DOC),
      font: "Palatino",
      margin: "0.5in",
    });
    expect(readSettings(next).font).toBe("Palatino");
    expect(readSettings(next).margin).toBe("0.5in");
    expect(next).toContain(String.raw`\slothingItem[id=itm-aaaaaa]{untouched}`);
    expect(next).toContain("\\begin{document}");
  });

  it("round-trips read → write → read", () => {
    expect(readSettings(writeSettings(DOC, readSettings(DOC)))).toEqual(
      readSettings(DOC),
    );
  });

  it("refuses to invent a block that is not there", () => {
    expect(() => writeSettings("\\begin{document}", DEFAULT_SETTINGS)).toThrow(
      /no \\slothingset block/,
    );
  });
});
