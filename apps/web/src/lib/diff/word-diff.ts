export type WordDiffSegmentType =
  | "unchanged"
  | "added"
  | "removed"
  | "reworded";

export type WordDiffSegmentSide = "before" | "after" | "both";

export interface WordDiffSegment {
  text: string;
  type: WordDiffSegmentType;
  side: WordDiffSegmentSide;
}

export interface WordDiffCounts {
  added: number;
  removed: number;
  reworded: number;
  unchanged: number;
  total: number;
}

interface DiffToken {
  text: string;
  normalized: string;
}

type DiffOp =
  | { type: "unchanged"; tokens: DiffToken[] }
  | { type: "added"; tokens: DiffToken[] }
  | { type: "removed"; tokens: DiffToken[] };

const WORD_PATTERN = /\S+/g;

function tokenizeWords(value: string): DiffToken[] {
  return Array.from(value.matchAll(WORD_PATTERN), (match) => ({
    text: match[0] ?? "",
    normalized: match[0] ?? "",
  }));
}

function joinTokens(tokens: DiffToken[]): string {
  return tokens.map((token) => token.text).join(" ");
}

function countWords(text: string): number {
  return tokenizeWords(text).length;
}

function pushOp(ops: DiffOp[], op: DiffOp): void {
  if (op.tokens.length === 0) return;

  const last = ops[ops.length - 1];
  if (last?.type === op.type) {
    last.tokens.push(...op.tokens);
    return;
  }

  ops.push({ type: op.type, tokens: [...op.tokens] } as DiffOp);
}

function buildLcsTable(before: DiffToken[], after: DiffToken[]): number[][] {
  const table = Array.from({ length: before.length + 1 }, () =>
    Array<number>(after.length + 1).fill(0),
  );

  for (let beforeIndex = before.length - 1; beforeIndex >= 0; beforeIndex--) {
    for (let afterIndex = after.length - 1; afterIndex >= 0; afterIndex--) {
      table[beforeIndex]![afterIndex] =
        before[beforeIndex]?.normalized === after[afterIndex]?.normalized
          ? 1 + (table[beforeIndex + 1]?.[afterIndex + 1] ?? 0)
          : Math.max(
              table[beforeIndex + 1]?.[afterIndex] ?? 0,
              table[beforeIndex]?.[afterIndex + 1] ?? 0,
            );
    }
  }

  return table;
}

function diffTokenOps(before: DiffToken[], after: DiffToken[]): DiffOp[] {
  const table = buildLcsTable(before, after);
  const ops: DiffOp[] = [];
  let beforeIndex = 0;
  let afterIndex = 0;

  while (beforeIndex < before.length && afterIndex < after.length) {
    if (before[beforeIndex]?.normalized === after[afterIndex]?.normalized) {
      pushOp(ops, { type: "unchanged", tokens: [before[beforeIndex]!] });
      beforeIndex++;
      afterIndex++;
      continue;
    }

    const removeScore = table[beforeIndex + 1]?.[afterIndex] ?? 0;
    const addScore = table[beforeIndex]?.[afterIndex + 1] ?? 0;
    if (addScore >= removeScore) {
      pushOp(ops, { type: "added", tokens: [after[afterIndex]!] });
      afterIndex++;
    } else {
      pushOp(ops, { type: "removed", tokens: [before[beforeIndex]!] });
      beforeIndex++;
    }
  }

  while (beforeIndex < before.length) {
    pushOp(ops, { type: "removed", tokens: [before[beforeIndex]!] });
    beforeIndex++;
  }

  while (afterIndex < after.length) {
    pushOp(ops, { type: "added", tokens: [after[afterIndex]!] });
    afterIndex++;
  }

  return ops;
}

function opToSegment(
  op: DiffOp,
  type: WordDiffSegmentType = op.type,
): WordDiffSegment {
  return {
    text: joinTokens(op.tokens),
    type,
    side:
      type === "unchanged"
        ? "both"
        : op.type === "removed"
          ? "before"
          : "after",
  };
}

export function diffWords(before: string, after: string): WordDiffSegment[] {
  const ops = diffTokenOps(tokenizeWords(before), tokenizeWords(after));
  const segments: WordDiffSegment[] = [];

  for (let index = 0; index < ops.length; index++) {
    const current = ops[index];
    const next = ops[index + 1];

    if (
      current?.type === "removed" &&
      next?.type === "added" &&
      current.tokens.length > 0 &&
      next.tokens.length > 0
    ) {
      segments.push(opToSegment(current, "reworded"));
      segments.push(opToSegment(next, "reworded"));
      index++;
      continue;
    }

    if (
      current?.type === "added" &&
      next?.type === "removed" &&
      current.tokens.length > 0 &&
      next.tokens.length > 0
    ) {
      segments.push(opToSegment(next, "reworded"));
      segments.push(opToSegment(current, "reworded"));
      index++;
      continue;
    }

    if (current) segments.push(opToSegment(current));
  }

  return segments;
}

export function summarizeWordDiff(segments: WordDiffSegment[]): WordDiffCounts {
  const counts: WordDiffCounts = {
    added: 0,
    removed: 0,
    reworded: 0,
    unchanged: 0,
    total: 0,
  };

  for (const segment of segments) {
    const words = countWords(segment.text);
    if (segment.type === "unchanged") counts.unchanged += words;
    if (segment.type === "added") counts.added += words;
    if (segment.type === "removed") counts.removed += words;
    if (segment.type === "reworded" && segment.side !== "before") {
      counts.reworded += words;
    }
  }

  counts.total = counts.added + counts.removed + counts.reworded;
  return counts;
}
