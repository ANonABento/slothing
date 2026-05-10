export type StarDimension = "situation" | "task" | "action" | "result";

export interface StarCoverage {
  situation: boolean;
  task: boolean;
  action: boolean;
  result: boolean;
  covered: StarDimension[];
  missing: StarDimension[];
  score: number;
}

const STAR_KEYWORDS: Record<StarDimension, string[]> = {
  situation: [
    "context",
    "background",
    "problem",
    "challenge",
    "when",
    "while",
    "team",
    "project",
    "situation",
  ],
  task: [
    "responsible",
    "goal",
    "needed",
    "asked",
    "objective",
    "owned",
    "task",
    "expected",
  ],
  action: [
    "i did",
    "i built",
    "i led",
    "i created",
    "i implemented",
    "i decided",
    "we decided",
    "steps",
    "built",
    "created",
    "implemented",
    "launched",
    "designed",
    "coordinated",
  ],
  result: [
    "result",
    "outcome",
    "impact",
    "increased",
    "reduced",
    "improved",
    "saved",
    "learned",
    "grew",
    "decreased",
  ],
};

const STAR_DIMENSIONS: StarDimension[] = [
  "situation",
  "task",
  "action",
  "result",
];

export function detectStarCoverage(transcript: string): StarCoverage {
  const normalized = transcript.toLowerCase();
  const coverage = STAR_DIMENSIONS.reduce(
    (current, dimension) => ({
      ...current,
      [dimension]: STAR_KEYWORDS[dimension].some((keyword) =>
        matchesKeyword(normalized, keyword),
      ),
    }),
    {} as Record<StarDimension, boolean>,
  );
  const covered = STAR_DIMENSIONS.filter((dimension) => coverage[dimension]);
  const missing = STAR_DIMENSIONS.filter((dimension) => !coverage[dimension]);

  return {
    ...coverage,
    covered,
    missing,
    score: covered.length,
  };
}

function matchesKeyword(transcript: string, keyword: string): boolean {
  const escapedKeyword = keyword.split(/\s+/).map(escapeRegExp).join("\\s+");
  return new RegExp(`\\b${escapedKeyword}\\b`, "i").test(transcript);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
