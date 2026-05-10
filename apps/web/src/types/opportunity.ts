import { z } from "zod";

import type { OpportunityStatus } from "@slothing/shared/schemas";

export {
  createOpportunitySchema,
  OPPORTUNITY_JOB_TYPES,
  OPPORTUNITY_LEVELS,
  OPPORTUNITY_REMOTE_TYPES,
  OPPORTUNITY_SOURCES,
  OPPORTUNITY_STATUSES,
  OPPORTUNITY_TYPES,
  opportunityFiltersSchema,
  opportunityJobTypeSchema,
  opportunityLevelSchema,
  opportunityRemoteTypeSchema,
  opportunitySchema,
  opportunitySourceSchema,
  opportunityStatusChangeSchema,
  opportunityStatusSchema,
  opportunityTypeSchema,
  updateOpportunitySchema,
} from "@slothing/shared/schemas";

export type {
  CreateOpportunityInput,
  Opportunity,
  OpportunityFilters,
  OpportunityJobType,
  OpportunityLevel,
  OpportunityRemoteType,
  OpportunitySource,
  OpportunityStatus,
  OpportunityStatusChangeInput,
  OpportunityType,
  UpdateOpportunityInput,
} from "@slothing/shared/schemas";

export const KANBAN_LANE_IDS = [
  "pending",
  "saved",
  "applied",
  "interviewing",
  "offer",
  "closed",
] as const;

export const CLOSED_SUB_STATUSES = [
  "rejected",
  "expired",
  "dismissed",
] as const;

export type KanbanLaneId = (typeof KANBAN_LANE_IDS)[number];
export type ClosedSubStatus = (typeof CLOSED_SUB_STATUSES)[number];

export const KANBAN_LANE_GROUPS: Record<
  KanbanLaneId,
  readonly OpportunityStatus[]
> = {
  pending: ["pending"],
  saved: ["saved"],
  applied: ["applied"],
  interviewing: ["interviewing"],
  offer: ["offer"],
  closed: CLOSED_SUB_STATUSES,
};

export const DEFAULT_KANBAN_VISIBLE_LANES: readonly KanbanLaneId[] =
  KANBAN_LANE_IDS;

const STATUS_TO_KANBAN_LANE = Object.fromEntries(
  KANBAN_LANE_IDS.flatMap((lane) =>
    KANBAN_LANE_GROUPS[lane].map((status) => [status, lane] as const),
  ),
) as Record<OpportunityStatus, KanbanLaneId>;

export function inferLaneFromStatus(status: OpportunityStatus): KanbanLaneId {
  return STATUS_TO_KANBAN_LANE[status];
}

export function isClosedSubStatus(
  status: OpportunityStatus,
): status is ClosedSubStatus {
  return (CLOSED_SUB_STATUSES as readonly OpportunityStatus[]).includes(status);
}

export function normalizeKanbanVisibleLanes(input: unknown): KanbanLaneId[] {
  const parsedInput =
    typeof input === "string" ? parseJsonSafely(input) : input;
  if (!Array.isArray(parsedInput)) {
    return [...DEFAULT_KANBAN_VISIBLE_LANES];
  }

  const selected = KANBAN_LANE_IDS.filter((lane) => parsedInput.includes(lane));

  return selected.length > 0 ? selected : [...DEFAULT_KANBAN_VISIBLE_LANES];
}

function parseJsonSafely(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export const kanbanLaneIdSchema = z.enum(KANBAN_LANE_IDS);
export const kanbanVisibleLanesSchema = z
  .array(kanbanLaneIdSchema)
  .min(1, "At least one kanban lane must remain visible");
