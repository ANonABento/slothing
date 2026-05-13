export type PdfLayoutFindingType =
  | "multi-column"
  | "reading-order"
  | "header-footer"
  | "table-grid";

export interface PdfTextItem {
  text: string;
  /** X coordinate in CSS/pdf points from the left edge. */
  x: number;
  /** Y coordinate in CSS/pdf points from the top edge. */
  y: number;
  width: number;
  height: number;
  order: number;
}

export interface PdfPageLayout {
  pageNumber: number;
  width: number;
  height: number;
  items: PdfTextItem[];
}

export interface PdfLayoutFinding {
  type: PdfLayoutFindingType;
  severity: "info" | "warning" | "error";
  pageNumber: number;
  title: string;
  evidence: string;
  recommendation: string;
}

export interface PdfLayoutReport {
  pageCount: number;
  hasMultiColumnRisk: boolean;
  hasHeaderFooterRisk: boolean;
  hasTableRisk: boolean;
  hasReadingOrderRisk: boolean;
  findings: PdfLayoutFinding[];
}

interface ColumnBand {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  count: number;
}

const CONTACT_PATTERN =
  /(?:[\w.+-]+@[\w-]+\.[\w.-]+|\b(?:https?:\/\/|linkedin\.com|github\.com)\S*|\b(?:\+?\d[\d(). -]{7,}\d)\b)/i;

function usefulItems(page: PdfPageLayout): PdfTextItem[] {
  return page.items
    .filter((item) => item.text.trim().length > 0 && item.width > 0)
    .sort((a, b) => a.order - b.order);
}

function bucket(value: number, size: number): number {
  return Math.round(value / size) * size;
}

function detectColumnBands(
  page: PdfPageLayout,
  items: ReadonlyArray<PdfTextItem>,
): ColumnBand[] {
  if (items.length < 10) return [];

  const buckets = new Map<number, PdfTextItem[]>();
  const bucketSize = Math.max(24, page.width * 0.04);
  for (const item of items) {
    const xBucket = bucket(item.x, bucketSize);
    buckets.set(xBucket, [...(buckets.get(xBucket) ?? []), item]);
  }

  return [...buckets.entries()]
    .filter(([, bucketItems]) => bucketItems.length >= 4)
    .map(([, bucketItems]) => {
      const minX = Math.min(...bucketItems.map((item) => item.x));
      const maxX = Math.max(...bucketItems.map((item) => item.x + item.width));
      const minY = Math.min(...bucketItems.map((item) => item.y));
      const maxY = Math.max(...bucketItems.map((item) => item.y + item.height));
      return {
        minX,
        maxX,
        minY,
        maxY,
        count: bucketItems.length,
      };
    })
    .sort((a, b) => a.minX - b.minX);
}

function verticalOverlapRatio(a: ColumnBand, b: ColumnBand): number {
  const overlap = Math.max(
    0,
    Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY),
  );
  const shorter = Math.min(a.maxY - a.minY, b.maxY - b.minY);
  return shorter > 0 ? overlap / shorter : 0;
}

function findColumnPair(
  page: PdfPageLayout,
  bands: ReadonlyArray<ColumnBand>,
): [ColumnBand, ColumnBand] | null {
  for (let i = 0; i < bands.length; i += 1) {
    for (let j = i + 1; j < bands.length; j += 1) {
      const left = bands[i];
      const right = bands[j];
      const gap = right.minX - left.maxX;
      if (
        gap >= page.width * 0.08 &&
        left.count >= 5 &&
        right.count >= 5 &&
        verticalOverlapRatio(left, right) >= 0.45
      ) {
        return [left, right];
      }
    }
  }
  return null;
}

function detectReadingOrderRisk(
  items: ReadonlyArray<PdfTextItem>,
  columns: [ColumnBand, ColumnBand] | null,
): boolean {
  if (!columns || items.length < 12) return false;
  const [left, right] = columns;
  const midpoint = (left.maxX + right.minX) / 2;
  const ordered = [...items].sort((a, b) => a.order - b.order);
  let switches = 0;
  let previous: "left" | "right" | null = null;

  for (const item of ordered) {
    const column = item.x < midpoint ? "left" : "right";
    if (previous && previous !== column) switches += 1;
    previous = column;
  }

  return switches >= 4;
}

function detectHeaderFooterRisk(
  page: PdfPageLayout,
  items: ReadonlyArray<PdfTextItem>,
): string | null {
  const topLimit = page.height * 0.05;
  const bottomLimit = page.height * 0.94;
  const risky = items.filter(
    (item) =>
      (item.y <= topLimit || item.y + item.height >= bottomLimit) &&
      CONTACT_PATTERN.test(item.text),
  );
  if (risky.length === 0) return null;
  return risky
    .slice(0, 2)
    .map((item) => item.text.trim())
    .join("; ");
}

function detectTableRisk(
  page: PdfPageLayout,
  items: ReadonlyArray<PdfTextItem>,
): boolean {
  if (items.length < 12) return false;

  const xBuckets = new Map<number, number>();
  const yBuckets = new Map<number, number>();
  const shortItems = items.filter((item) => item.text.trim().length <= 28);
  for (const item of shortItems) {
    const xKey = bucket(item.x, Math.max(12, page.width * 0.02));
    const yKey = bucket(item.y, Math.max(8, page.height * 0.01));
    xBuckets.set(xKey, (xBuckets.get(xKey) ?? 0) + 1);
    yBuckets.set(yKey, (yBuckets.get(yKey) ?? 0) + 1);
  }

  const repeatedColumns = [...xBuckets.values()].filter((count) => count >= 3);
  const repeatedRows = [...yBuckets.values()].filter((count) => count >= 3);
  return repeatedColumns.length >= 3 && repeatedRows.length >= 3;
}

export function analyzePdfLayout(
  pages: ReadonlyArray<PdfPageLayout>,
): PdfLayoutReport {
  const findings: PdfLayoutFinding[] = [];

  for (const page of pages) {
    const items = usefulItems(page);
    const bands = detectColumnBands(page, items);
    const columnPair = findColumnPair(page, bands);

    if (columnPair) {
      findings.push({
        type: "multi-column",
        severity: "warning",
        pageNumber: page.pageNumber,
        title: "Multi-column PDF layout",
        evidence: `Page ${page.pageNumber} has two dense text bands with overlapping vertical ranges.`,
        recommendation:
          "Use a single-column resume for ATS uploads; keep design-heavy versions for direct human review.",
      });
    }

    if (detectReadingOrderRisk(items, columnPair)) {
      findings.push({
        type: "reading-order",
        severity: "warning",
        pageNumber: page.pageNumber,
        title: "Reading order may be scrambled",
        evidence: `Page ${page.pageNumber} alternates repeatedly between left and right text bands.`,
        recommendation:
          "Export an ATS copy where sections read top-to-bottom in one column.",
      });
    }

    const headerFooterEvidence = detectHeaderFooterRisk(page, items);
    if (headerFooterEvidence) {
      findings.push({
        type: "header-footer",
        severity: "info",
        pageNumber: page.pageNumber,
        title: "Contact text appears in a header/footer region",
        evidence: headerFooterEvidence,
        recommendation:
          "Put email, phone, and links in the document body near the top, not in a header or footer.",
      });
    }

    if (detectTableRisk(page, items)) {
      findings.push({
        type: "table-grid",
        severity: "warning",
        pageNumber: page.pageNumber,
        title: "Table-like text grid detected",
        evidence: `Page ${page.pageNumber} has many short fragments aligned into repeated rows and columns.`,
        recommendation:
          "Avoid tables and text boxes for resume layout; use plain headings and bullets.",
      });
    }
  }

  return {
    pageCount: pages.length,
    hasMultiColumnRisk: findings.some(
      (finding) => finding.type === "multi-column",
    ),
    hasHeaderFooterRisk: findings.some(
      (finding) => finding.type === "header-footer",
    ),
    hasTableRisk: findings.some((finding) => finding.type === "table-grid"),
    hasReadingOrderRisk: findings.some(
      (finding) => finding.type === "reading-order",
    ),
    findings,
  };
}
