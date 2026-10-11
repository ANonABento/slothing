import { getClient } from "./client";
import { nowIso } from "@/lib/format/time";
import { generateId } from "@/lib/utils";

export type WebVitalName = "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
export type WebVitalRating = "good" | "needs-improvement" | "poor";

export interface RecordWebVitalInput {
  metricId: string;
  name: WebVitalName;
  value: number;
  delta: number;
  rating: WebVitalRating;
  navigationType?: string | null;
  pathname?: string | null;
  userAgent?: string | null;
}

export interface WebVitalRecord extends RecordWebVitalInput {
  id: string;
  createdAt: string;
}

let schemaReady = false;

export async function ensureWebVitalsSchema(): Promise<void> {
  if (schemaReady) return;
  await getClient().batch([
    `CREATE TABLE IF NOT EXISTS web_vitals (
      id TEXT PRIMARY KEY NOT NULL,
      metric_id TEXT NOT NULL,
      name TEXT NOT NULL,
      value REAL NOT NULL,
      delta REAL NOT NULL,
      rating TEXT NOT NULL,
      navigation_type TEXT,
      pathname TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL
    )`,
    "CREATE INDEX IF NOT EXISTS idx_web_vitals_name_created ON web_vitals(name, created_at)",
    "CREATE INDEX IF NOT EXISTS idx_web_vitals_path_created ON web_vitals(pathname, created_at)",
  ]);
  schemaReady = true;
}

export async function recordWebVital(
  input: RecordWebVitalInput,
): Promise<WebVitalRecord> {
  await ensureWebVitalsSchema();
  const id = generateId();
  const createdAt = nowIso();

  await getClient().execute({
    sql: `
      INSERT INTO web_vitals (
        id, metric_id, name, value, delta, rating, navigation_type, pathname,
        user_agent, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      input.metricId,
      input.name,
      input.value,
      input.delta,
      input.rating,
      input.navigationType ?? null,
      input.pathname ?? null,
      input.userAgent ?? null,
      createdAt,
    ],
  });

  return { ...input, id, createdAt };
}
