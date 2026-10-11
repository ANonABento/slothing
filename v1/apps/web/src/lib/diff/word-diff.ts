export type WordDiffSegmentType =
  | "unchanged"
  | "added"
  | "removed"
  | "reworded";

export type WordDiffSegmentSide = "before" | "after" | "both";

export interface WordDiffSegment {
  type: WordDiffSegmentType;
  text: string;
  side?: WordDiffSegmentSide;
  beforeText?: string;
  afterText?: string;
}

export interface WordDiffCounts {
  added: number;
  removed: number;
  reworded: number;
  unchanged?: number;
  total: number;
}

type DiffOperation = {
  type: "unchanged" | "added" | "removed";
  tokens: string[];
};

const TOKEN_PATTERN = /\s+|[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*|[^\s]/gu;
const WORD_PATTERN = /[\p{L}\p{N}]/u;

export function diffWords(before: string, after: string): WordDiffSegment[] {
  if (before === after) {
    return before ? [{ type: "unchanged", text: before, side: "both" }] : [];
  }

  const beforeTokens = tokenize(before);
  const afterTokens = tokenize(after);

  if (beforeTokens.length === 0) return createSingleSegment("added", after);
  if (afterTokens.length === 0) return createSingleSegment("removed", before);

  return mergeRewordedOperations(
    compactOperations(diffTokenOperations(beforeTokens, afterTokens)),
  );
}

export function countWordsInDiff(segments: WordDiffSegment[]): WordDiffCounts {
  const counts = emptyCounts();

  for (const segment of segments) {
    if (segment.type === "added") {
      counts.added += countWordTokens(segment.text);
    } else if (segment.type === "removed") {
      counts.removed += countWordTokens(segment.text);
    } else if (segment.type === "reworded") {
      counts.reworded += Math.max(
        countWordTokens(segment.beforeText ?? segment.text),
        countWordTokens(segment.afterText ?? segment.text),
      );
    }
  }

  counts.total = counts.added + counts.removed + counts.reworded;
  return counts;
}

export function summarizeWordDiff(segments: WordDiffSegment[]): WordDiffCounts {
  const counts = emptyCounts();

  for (const segment of segments) {
    if (segment.type === "unchanged") {
      counts.unchanged += countWordTokens(segment.text);
    } else if (segment.type === "added") {
      counts.added += countWordTokens(segment.text);
    } else if (segment.type === "removed") {
      counts.removed += countWordTokens(segment.text);
    } else if (segment.type === "reworded") {
      counts.reworded += Math.max(
        countWordTokens(segment.beforeText ?? segment.text),
        countWordTokens(segment.afterText ?? segment.text),
      );
    }
  }

  counts.total = counts.added + counts.removed + counts.reworded;
  return counts;
}

function emptyCounts(): Required<WordDiffCounts> {
  return {
    added: 0,
    removed: 0,
    reworded: 0,
    unchanged: 0,
    total: 0,
  };
}

function createSingleSegment(
  type: "added" | "removed",
  text: string,
): WordDiffSegment[] {
  if (!text) return [];
  return [{ type, text, side: type === "added" ? "after" : "before" }];
}

function tokenize(text: string): string[] {
  return text.match(TOKEN_PATTERN) ?? [];
}

function isMeaningfulToken(token: string): boolean {
  return WORD_PATTERN.test(token);
}

function countWordTokens(text: string): number {
  return tokenize(text).filter(isMeaningfulToken).length;
}

function diffTokenOperations(
  beforeTokens: string[],
  afterTokens: string[],
): DiffOperation[] {
  const table: number[][] = Array.from(
    { length: beforeTokens.length + 1 },
    () => Array(afterTokens.length + 1).fill(0),
  );

  for (let i = beforeTokens.length - 1; i >= 0; i -= 1) {
    for (let j = afterTokens.length - 1; j >= 0; j -= 1) {
      table[i]![j] =
        beforeTokens[i] === afterTokens[j]
          ? (table[i + 1]?.[j + 1] ?? 0) + 1
          : Math.max(table[i + 1]?.[j] ?? 0, table[i]?.[j + 1] ?? 0);
    }
  }

  const operations: DiffOperation[] = [];
  let i = 0;
  let j = 0;

  while (i < beforeTokens.length && j < afterTokens.length) {
    if (beforeTokens[i] === afterTokens[j]) {
      operations.push({ type: "unchanged", tokens: [beforeTokens[i]!] });
      i += 1;
      j += 1;
    } else if ((table[i + 1]?.[j] ?? 0) >= (table[i]?.[j + 1] ?? 0)) {
      operations.push({ type: "removed", tokens: [beforeTokens[i]!] });
      i += 1;
    } else {
      operations.push({ type: "added", tokens: [afterTokens[j]!] });
      j += 1;
    }
  }

  while (i < beforeTokens.length) {
    operations.push({ type: "removed", tokens: [beforeTokens[i]!] });
    i += 1;
  }

  while (j < afterTokens.length) {
    operations.push({ type: "added", tokens: [afterTokens[j]!] });
    j += 1;
  }

  return operations;
}

function compactOperations(operations: DiffOperation[]): DiffOperation[] {
  const compacted: DiffOperation[] = [];

  for (const operation of operations) {
    const previous = compacted[compacted.length - 1];
    if (previous?.type === operation.type) {
      previous.tokens.push(...operation.tokens);
    } else {
      compacted.push({ type: operation.type, tokens: [...operation.tokens] });
    }
  }

  return compacted;
}

function mergeRewordedOperations(
  operations: DiffOperation[],
): WordDiffSegment[] {
  const segments: WordDiffSegment[] = [];

  for (let i = 0; i < operations.length; i += 1) {
    const operation = operations[i];
    const next = operations[i + 1];

    if (
      operation?.type === "removed" &&
      next?.type === "added" &&
      hasMeaningfulText(operation.tokens) &&
      hasMeaningfulText(next.tokens)
    ) {
      const beforeText = operation.tokens.join("");
      const afterText = next.tokens.join("");
      segments.push({
        type: "reworded",
        text: afterText,
        side: "both",
        beforeText,
        afterText,
      });
      i += 1;
      continue;
    }

    if (!operation) continue;
    const text = operation.tokens.join("");
    if (!text) continue;
    segments.push({
      type: operation.type,
      text,
      side:
        operation.type === "unchanged"
          ? "both"
          : operation.type === "added"
            ? "after"
            : "before",
    });
  }

  return mergeAdjacentRewordedSegments(segments);
}

function hasMeaningfulText(tokens: string[]): boolean {
  return tokens.some(isMeaningfulToken);
}

function mergeAdjacentRewordedSegments(
  segments: WordDiffSegment[],
): WordDiffSegment[] {
  const merged: WordDiffSegment[] = [];

  for (const segment of segments) {
    const previous = merged[merged.length - 1];
    const separator =
      previous?.type === "unchanged" && !hasMeaningfulText([previous.text])
        ? previous
        : null;
    const beforeSeparator = separator ? merged[merged.length - 2] : null;

    if (
      segment.type === "reworded" &&
      separator &&
      beforeSeparator?.type === "reworded"
    ) {
      beforeSeparator.text += separator.text + segment.text;
      beforeSeparator.beforeText =
        (beforeSeparator.beforeText ?? "") +
        separator.text +
        (segment.beforeText ?? segment.text);
      beforeSeparator.afterText =
        (beforeSeparator.afterText ?? beforeSeparator.text) +
        separator.text +
        (segment.afterText ?? segment.text);
      merged.pop();
      continue;
    }

    merged.push({ ...segment });
  }

  return merged;
}
