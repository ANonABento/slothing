import { getClient } from "./client";
import { nowIso } from "@/lib/format/time";
import { generateId } from "@/lib/utils";

export type ActivationEventName =
  | "waitlist_joined"
  | "opportunity_created"
  | "resume_uploaded"
  | "resume_tailored"
  | "extension_connected";

export interface TrackActivationEventInput {
  event: ActivationEventName;
  userId?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ActivationEvent {
  id: string;
  userId: string | null;
  event: ActivationEventName;
  source: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

let schemaReady = false;

export async function ensureProductAnalyticsSchema(): Promise<void> {
  if (schemaReady) return;
  await getClient().batch([
    `CREATE TABLE IF NOT EXISTS product_events (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      event TEXT NOT NULL,
      source TEXT,
      metadata_json TEXT,
      created_at TEXT NOT NULL
    )`,
    "CREATE INDEX IF NOT EXISTS idx_product_events_user_created ON product_events(user_id, created_at)",
    "CREATE INDEX IF NOT EXISTS idx_product_events_event_created ON product_events(event, created_at)",
  ]);
  schemaReady = true;
}

export async function trackActivationEvent(
  input: TrackActivationEventInput,
): Promise<ActivationEvent> {
  await ensureProductAnalyticsSchema();
  const id = generateId();
  const createdAt = nowIso();
  const metadataJson = input.metadata ? JSON.stringify(input.metadata) : null;

  await getClient().execute({
    sql: `
      INSERT INTO product_events (id, user_id, event, source, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      input.userId ?? null,
      input.event,
      input.source ?? null,
      metadataJson,
      createdAt,
    ],
  });

  return {
    id,
    userId: input.userId ?? null,
    event: input.event,
    source: input.source ?? null,
    metadata: input.metadata ?? null,
    createdAt,
  };
}

export async function getActivationFunnelCounts(
  userId?: string | null,
): Promise<Record<ActivationEventName, number>> {
  await ensureProductAnalyticsSchema();
  const result = await getClient().execute(
    userId
      ? {
          sql: "SELECT event, COUNT(*) as count FROM product_events WHERE user_id = ? GROUP BY event",
          args: [userId],
        }
      : "SELECT event, COUNT(*) as count FROM product_events GROUP BY event",
  );

  return (
    result.rows as unknown as Array<{
      event: ActivationEventName;
      count: number;
    }>
  ).reduce(
    (acc, row) => {
      acc[row.event] = Number(row.count) || 0;
      return acc;
    },
    {
      waitlist_joined: 0,
      opportunity_created: 0,
      resume_uploaded: 0,
      resume_tailored: 0,
      extension_connected: 0,
    } as Record<ActivationEventName, number>,
  );
}
