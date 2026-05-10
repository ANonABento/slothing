import type { MetricScore } from "../types.js";

const DEFAULT_WEIGHTS: Record<string, number> = {
  keyword_overlap: 0.5,
  action_verbs: 0.2,
  length: 0.2,
  missing_keywords: 0.1,
};

export function aggregateMetrics(
  metrics: MetricScore[],
  weights: Record<string, number> = DEFAULT_WEIGHTS,
): number {
  if (metrics.some((metric) => metric.name === "error" && metric.score > 0)) {
    return 0;
  }

  let weightedTotal = 0;
  let totalWeight = 0;
  for (const metric of metrics) {
    const weight = weights[metric.name] ?? 0;
    if (weight <= 0) continue;
    weightedTotal += metric.score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Number((weightedTotal / totalWeight).toFixed(4)) : 0;
}
