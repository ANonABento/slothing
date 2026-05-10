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

const STAR_DIMENSIONS: StarDimension[] = [
  "situation",
  "task",
  "action",
  "result",
];

const STAR_PATTERNS: Record<StarDimension, RegExp[]> = {
  situation: [
    /\b(?:context|background|problem|challenge|situation)\b/i,
    /\b(?:when|while|during|after|before)\b.{0,90}\b(?:team|project|launch|rollout|migration|customer|client|users?|deadline|incident|outage)\b/i,
    /\b(?:team|project|launch|rollout|migration|customer|client|users?)\b.{0,90}\b(?:struggled|blocked|missing|behind|late|slow|confusing|broken|risk|issue|constraint|friction|deadline)\b/i,
    /\b(?:blocked|missing|behind|late|slow|confusing|broken|risk|issue|constraint|friction|deadline)\b.{0,90}\b(?:team|project|launch|rollout|migration|customer|client|users?)\b/i,
  ],
  task: [
    /\b(?:task|goal|objective|responsibility|responsible|expected|asked|needed|owned|accountable)\b/i,
    /\b(?:my|our)\s+(?:role|goal|objective|responsibility|charter|focus)\b/i,
    /\b(?:i|we)\s+(?:had to|needed to|were asked to|were responsible for|owned|took ownership of|set out to)\b/i,
  ],
  action: [
    /\b(?:i|we)\s+(?:did|built|led|created|implemented|decided|launched|designed|coordinated|profiled|split|added|mapped|prioritized|tested|shipped|facilitated|debugged|redesigned|interviewed|documented|reviewed|trained|moved|automated|paired|met|worked)\b/i,
    /\b(?:steps|actions|approach)\b/i,
    /\b(?:built|created|implemented|launched|designed|coordinated|profiled|split|added|mapped|prioritized|tested|shipped|facilitated|debugged|redesigned|interviewed|documented|reviewed|trained|moved|automated)\b/i,
  ],
  result: [
    /\b(?:result|outcome|impact|learned|finished|landed|adopted|launched|shipped)\b/i,
    /\b(?:increased|reduced|improved|saved|grew|decreased|cut|raised|lowered|accelerated|shortened|resolved|unblocked)\b/i,
    /\b\d+(?:[.,]\d+)?\s?(?:%|percent|x|hours?|days?|weeks?|months?|years?|users?|customers?|people|tickets?|revenue|dollars?)\b/i,
    /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|dozen)\s+(?:hours?|days?|weeks?|months?|years?|users?|customers?|people|tickets?|teams?|milestones?)\b/i,
  ],
};

export function detectStarCoverage(transcript: string): StarCoverage {
  const coverage = STAR_DIMENSIONS.reduce(
    (current, dimension) => ({
      ...current,
      [dimension]: STAR_PATTERNS[dimension].some((pattern) =>
        pattern.test(transcript),
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
