import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { HitMap } from "@/lib/latex/hitmap";

import { SpanOverlay, groupRectsBySpan, spanArea } from "./span-overlay";

const MAP: HitMap = {
  ids: ["sec-a1", "itm-b2", "itm-c3"],
  rects: [
    { id: "sec-a1", page: 0, x: 0.05, y: 0.05, w: 0.9, h: 0.3 },
    // A bullet wrapped over two lines: one id, two rects.
    { id: "itm-b2", page: 0, x: 0.1, y: 0.1, w: 0.8, h: 0.02 },
    { id: "itm-b2", page: 0, x: 0.1, y: 0.13, w: 0.35, h: 0.02 },
    { id: "itm-c3", page: 1, x: 0.1, y: 0.1, w: 0.8, h: 0.02 },
  ],
};

describe("groupRectsBySpan", () => {
  it("groups every rect of a wrapped span under one id", () => {
    expect(groupRectsBySpan(MAP, 0).get("itm-b2")).toHaveLength(2);
  });

  it("excludes other pages", () => {
    expect(groupRectsBySpan(MAP, 0).has("itm-c3")).toBe(false);
    expect(groupRectsBySpan(MAP, 1).has("itm-c3")).toBe(true);
  });
});

describe("spanArea", () => {
  it("sums the rects so a nested span measures smaller than its container", () => {
    const grouped = groupRectsBySpan(MAP, 0);
    expect(spanArea(grouped.get("itm-b2")!)).toBeLessThan(
      spanArea(grouped.get("sec-a1")!),
    );
  });
});

describe("SpanOverlay", () => {
  it("renders one button per rect, positioned as percentages", () => {
    render(
      <SpanOverlay
        hitMap={MAP}
        page={0}
        selectedSpanId={null}
        onSelect={vi.fn()}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3); // 1 section + 2 bullet lines

    const first = buttons.find((b) => b.dataset.spanId === "sec-a1")!;
    expect(first.style.left).toBe("5%");
    expect(first.style.width).toBe("90%");
  });

  it("paints larger spans first so a nested span sits above its container", () => {
    render(
      <SpanOverlay
        hitMap={MAP}
        page={0}
        selectedSpanId={null}
        onSelect={vi.fn()}
      />,
    );
    const ids = screen.getAllByRole("button").map((b) => b.dataset.spanId);
    expect(ids[0]).toBe("sec-a1");
  });

  it("reports the span id on click", () => {
    const onSelect = vi.fn();
    render(
      <SpanOverlay
        hitMap={MAP}
        page={0}
        selectedSpanId={null}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(
      screen.getAllByRole("button").find((b) => b.dataset.spanId === "itm-b2")!,
    );
    expect(onSelect).toHaveBeenCalledWith("itm-b2");
  });

  it("marks every rect of the selected span, not just the first line", () => {
    render(
      <SpanOverlay
        hitMap={MAP}
        page={0}
        selectedSpanId="itm-b2"
        onSelect={vi.fn()}
      />,
    );
    const selected = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(selected).toHaveLength(2);
  });

  it("highlights on hover so the document reads as clickable", () => {
    render(
      <SpanOverlay
        hitMap={MAP}
        page={0}
        selectedSpanId={null}
        onSelect={vi.fn()}
      />,
    );
    const button = screen
      .getAllByRole("button")
      .find((b) => b.dataset.spanId === "itm-b2")!;

    expect(button.style.backgroundColor).toBe("transparent");
    fireEvent.pointerEnter(button);
    expect(button.style.backgroundColor).not.toBe("transparent");
    fireEvent.pointerLeave(button);
    expect(button.style.backgroundColor).toBe("transparent");
  });

  it("renders nothing for a page with no rects", () => {
    render(
      <SpanOverlay
        hitMap={MAP}
        page={7}
        selectedSpanId={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
