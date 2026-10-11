import { describe, expect, it } from "vitest";

import { backingScale, fitScale } from "./load-pdfjs";

describe("fitScale", () => {
  it("fits the page to the container width", () => {
    // 612pt page in a 644px container leaves 612 usable after padding → 1.0
    expect(fitScale(612, 644, 1)).toBeCloseTo(1, 5);
  });

  it("multiplies by the user's zoom", () => {
    expect(fitScale(612, 644, 2)).toBeCloseTo(2, 5);
  });

  it("clamps to a sane range rather than producing a degenerate canvas", () => {
    expect(fitScale(612, 644, 99)).toBe(2.5);
    expect(fitScale(612, 644, 0.001)).toBe(0.25);
  });

  it("falls back to the raw zoom before the container has been measured", () => {
    expect(fitScale(612, 0, 1.5)).toBe(1.5);
    expect(fitScale(0, 644, 1.5)).toBe(1.5);
  });

  it("never shrinks below a readable minimum width", () => {
    // A very narrow container still renders at the 240px floor, not sub-pixel.
    expect(fitScale(612, 10, 1)).toBeCloseTo(240 / 612, 5);
  });
});

describe("backingScale", () => {
  it("renders at device pixel ratio so text is not soft on retina", () => {
    expect(backingScale(2)).toBe(2);
  });

  it("caps at 2 — 3x costs memory for no visible gain", () => {
    expect(backingScale(3)).toBe(2);
  });

  it("never goes below 1", () => {
    expect(backingScale(0.5)).toBe(1);
    expect(backingScale(undefined)).toBe(1);
  });
});
