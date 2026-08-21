import { describe, expect, it } from "vitest";

import { cacheKey } from "./cache";

describe("cacheKey", () => {
  const SOURCE = "\\documentclass{article}\\begin{document}hi\\end{document}";

  it("is stable for identical input", () => {
    expect(cacheKey(SOURCE, "preview")).toBe(cacheKey(SOURCE, "preview"));
  });

  it("differs by mode — preview and export are different renders", () => {
    expect(cacheKey(SOURCE, "preview")).not.toBe(cacheKey(SOURCE, "export"));
  });

  it("differs when the source changes by a single character", () => {
    expect(cacheKey(SOURCE, "export")).not.toBe(
      cacheKey(`${SOURCE} `, "export"),
    );
  });

  it("is a hex digest, so it is always safe as a filename", () => {
    expect(cacheKey(SOURCE, "export")).toMatch(/^[0-9a-f]{64}$/);
  });
});
