import { describe, expect, it } from "vitest";

import { EMPTY_HIT_MAP, hitTest, rectsForSpan, type HitMap } from "./hitmap";

const MAP: HitMap = {
  ids: ["sec-a1", "itm-b2", "itm-c3"],
  rects: [
    // An enclosing section band.
    { id: "sec-a1", page: 0, x: 0.05, y: 0.05, w: 0.9, h: 0.3 },
    // A bullet wrapped over two lines — one id, two rects.
    { id: "itm-b2", page: 0, x: 0.1, y: 0.1, w: 0.8, h: 0.02 },
    { id: "itm-b2", page: 0, x: 0.1, y: 0.13, w: 0.35, h: 0.02 },
    // Same coordinates, different page.
    { id: "itm-c3", page: 1, x: 0.1, y: 0.1, w: 0.8, h: 0.02 },
  ],
};

describe("hitTest", () => {
  it("resolves a point to the span under it", () => {
    expect(hitTest(MAP, 0, 0.5, 0.11)).toBe("itm-b2");
  });

  it("prefers the smallest rect so a nested span beats its container", () => {
    // This point is inside BOTH the section band and the bullet.
    expect(hitTest(MAP, 0, 0.2, 0.11)).toBe("itm-b2");
    // Inside the section band only.
    expect(hitTest(MAP, 0, 0.5, 0.3)).toBe("sec-a1");
  });

  it("respects page boundaries", () => {
    expect(hitTest(MAP, 1, 0.5, 0.11)).toBe("itm-c3");
    expect(hitTest(MAP, 2, 0.5, 0.11)).toBeNull();
  });

  it("returns null for a miss rather than the nearest span", () => {
    expect(hitTest(MAP, 0, 0.99, 0.99)).toBeNull();
  });

  it("treats rect edges as inside", () => {
    expect(hitTest(MAP, 0, 0.1, 0.1)).toBe("itm-b2");
  });

  it("is empty-safe", () => {
    expect(hitTest(EMPTY_HIT_MAP, 0, 0.5, 0.5)).toBeNull();
  });
});

describe("rectsForSpan", () => {
  it("returns every rect for a span that wrapped across lines", () => {
    expect(rectsForSpan(MAP, "itm-b2")).toHaveLength(2);
  });

  it("returns nothing for an unknown span", () => {
    expect(rectsForSpan(MAP, "itm-zz")).toEqual([]);
  });
});
