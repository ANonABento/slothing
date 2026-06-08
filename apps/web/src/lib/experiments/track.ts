import { getClient } from "@/lib/db/client";
import {
  ensureProductAnalyticsSchema,
  recordProductEvent,
} from "@/lib/db/product-analytics";

/**
 * Experiment telemetry on top of the shared `product_events` table.
 *
 * Convention: `source` = the experiment key, `metadata.variant` = the assigned
 * variant. Exposure is logged once per assignment; outcome events reuse the
 * same shape so `getExperimentResults` can pivot event counts by variant.
 */

export const EXPERIMENT_EXPOSURE_EVENT = "experiment_exposure";

/** Log that `userId` was shown the given variant of an experiment. */
export function trackExposure(
  experimentKey: string,
  variant: string,
  userId?: string | null,
): Promise<unknown> {
  return recordProductEvent({
    event: EXPERIMENT_EXPOSURE_EVENT,
    source: experimentKey,
    userId,
    metadata: { variant },
  });
}

/** Log an outcome event (e.g. `resume_tailored`) attributed to a variant. */
export function trackExperimentEvent(
  experimentKey: string,
  variant: string,
  event: string,
  userId?: string | null,
  metadata?: Record<string, unknown> | null,
): Promise<unknown> {
  return recordProductEvent({
    event,
    source: experimentKey,
    userId,
    metadata: { ...(metadata ?? {}), variant },
  });
}

export interface ExperimentResultRow {
  variant: string;
  event: string;
  count: number;
}

/**
 * Per-variant event counts for an experiment. Raw counts only — significance
 * is left to the reader (the table is a funnel counter, not a stats engine).
 */
export async function getExperimentResults(
  experimentKey: string,
): Promise<ExperimentResultRow[]> {
  await ensureProductAnalyticsSchema();
  const result = await getClient().execute({
    sql: `
      SELECT
        COALESCE(json_extract(metadata_json, '$.variant'), 'unknown') AS variant,
        event AS event,
        COUNT(*) AS count
      FROM product_events
      WHERE source = ?
      GROUP BY variant, event
      ORDER BY variant, event
    `,
    args: [experimentKey],
  });

  return (
    result.rows as unknown as Array<{
      variant: string;
      event: string;
      count: number;
    }>
  ).map((row) => ({
    variant: String(row.variant),
    event: String(row.event),
    count: Number(row.count) || 0,
  }));
}
