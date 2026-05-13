import { describe, expect, it } from "vitest";
import { analyzePdfLayout, type PdfPageLayout, type PdfTextItem } from ".";

function item(
  text: string,
  x: number,
  y: number,
  order: number,
  width = 180,
): PdfTextItem {
  return {
    text,
    x,
    y,
    width,
    height: 12,
    order,
  };
}

function page(items: PdfTextItem[]): PdfPageLayout {
  return {
    pageNumber: 1,
    width: 612,
    height: 792,
    items,
  };
}

describe("analyzePdfLayout", () => {
  it("keeps a normal single-column PDF clean", () => {
    const report = analyzePdfLayout([
      page(
        Array.from({ length: 14 }, (_, index) =>
          item(`Single column bullet ${index + 1}`, 72, 90 + index * 28, index),
        ),
      ),
    ]);

    expect(report.findings).toEqual([]);
    expect(report.hasMultiColumnRisk).toBe(false);
  });

  it("flags dense two-column layouts", () => {
    const left = Array.from({ length: 8 }, (_, index) =>
      item(`Left item ${index + 1}`, 54, 100 + index * 30, index * 2, 180),
    );
    const right = Array.from({ length: 8 }, (_, index) =>
      item(
        `Right item ${index + 1}`,
        340,
        100 + index * 30,
        index * 2 + 1,
        190,
      ),
    );

    const report = analyzePdfLayout([page([...left, ...right])]);

    expect(report.hasMultiColumnRisk).toBe(true);
    expect(report.hasReadingOrderRisk).toBe(true);
    expect(report.findings.map((finding) => finding.type)).toEqual(
      expect.arrayContaining(["multi-column", "reading-order"]),
    );
  });

  it("flags contact information in header and footer regions", () => {
    const report = analyzePdfLayout([
      page([
        item("jordan@example.com", 72, 24, 0),
        item("Experience", 72, 110, 1),
        item("Built systems.", 72, 140, 2),
        item("linkedin.com/in/jordan", 72, 760, 3),
      ]),
    ]);

    expect(report.hasHeaderFooterRisk).toBe(true);
    expect(
      report.findings.filter((finding) => finding.type === "header-footer"),
    ).toHaveLength(1);
  });

  it("flags table-like grids of short aligned fragments", () => {
    const items: PdfTextItem[] = [];
    let order = 0;
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        items.push(
          item(`Cell ${row}-${col}`, 70 + col * 110, 120 + row * 26, order, 70),
        );
        order += 1;
      }
    }

    const report = analyzePdfLayout([page(items)]);

    expect(report.hasTableRisk).toBe(true);
    expect(report.findings.map((finding) => finding.type)).toContain(
      "table-grid",
    );
  });
});
