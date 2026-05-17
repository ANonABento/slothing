// F2.3 consolidation: the kanban primitives (`KANBAN_LANE_IDS`,
// `CLOSED_SUB_STATUSES`, `KANBAN_LANE_GROUPS`, `inferLaneFromStatus`,
// `isClosedSubStatus`, `normalizeKanbanVisibleLanes`, `kanbanLaneIdSchema`,
// `kanbanVisibleLanesSchema`, `DEFAULT_KANBAN_VISIBLE_LANES`) used to be
// copy-pasted in this file. They now live solely in
// `@slothing/shared/schemas`; this module is a thin pass-through so all
// `@/types/opportunity` import sites keep working without churn.

export {
  CLOSED_SUB_STATUSES,
  createOpportunitySchema,
  DEFAULT_KANBAN_VISIBLE_LANES,
  inferLaneFromStatus,
  isClosedSubStatus,
  KANBAN_LANE_GROUPS,
  KANBAN_LANE_IDS,
  kanbanLaneIdSchema,
  kanbanVisibleLanesSchema,
  normalizeKanbanVisibleLanes,
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
  ClosedSubStatus,
  CreateOpportunityInput,
  KanbanLaneId,
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
