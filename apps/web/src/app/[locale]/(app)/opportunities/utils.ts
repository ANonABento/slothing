import { parseToDate } from "@/lib/format/time";
import {
  CLOSED_SUB_STATUSES,
  DEFAULT_KANBAN_VISIBLE_LANES,
  KANBAN_LANE_GROUPS,
  KANBAN_LANE_IDS,
  inferLaneFromStatus,
  isClosedSubStatus,
  kanbanVisibleLanesSchema,
  normalizeKanbanVisibleLanes,
  type ClosedSubStatus,
  type KanbanLaneId,
} from "@/types/opportunity";
import type { BadgeProps } from "@/components/ui/badge";

export {
  CLOSED_SUB_STATUSES,
  DEFAULT_KANBAN_VISIBLE_LANES,
  KANBAN_LANE_GROUPS,
  KANBAN_LANE_IDS,
  inferLaneFromStatus,
  isClosedSubStatus,
  kanbanVisibleLanesSchema,
  normalizeKanbanVisibleLanes,
  type ClosedSubStatus,
  type KanbanLaneId,
};
export type OpportunityType = "job" | "hackathon";
export type OpportunitySource =
  | "waterlooworks"
  | "linkedin"
  | "indeed"
  | "greenhouse"
  | "lever"
  | "devpost"
  | "manual"
  | "url";
export type RemoteType = "remote" | "hybrid" | "onsite";
export type OpportunityJobType =
  | "co-op"
  | "full-time"
  | "part-time"
  | "contract"
  | "internship";
export type OpportunityLevel =
  | "junior"
  | "intermediate"
  | "senior"
  | "lead"
  | "principal"
  | "other"
  | "staff";
export type OpportunityStatus =
  | "pending"
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "expired"
  | "dismissed";
export type OpportunitySortOption =
  | "deadline"
  | "scrapedAt"
  | "company"
  | "salary";
export type OpportunityTypeTab = "all" | "job" | "hackathon";
export type OpportunityViewMode = "list" | "kanban";

export interface OpportunityOption<T extends string> {
  value: T;
  label: string;
}

export interface OpportunityFilterOptions {
  tags: string[];
  techStacks: string[];
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  company: string;
  division?: string;
  source: OpportunitySource;
  sourceUrl?: string;
  sourceId?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  region?: string;
  remoteType?: RemoteType;
  additionalLocationInfo?: string;
  jobType?: OpportunityJobType;
  level?: OpportunityLevel;
  openings?: number;
  workTerm?: string;
  applicationMethod?: string;
  requiredDocuments?: string[];
  targetedDegrees?: string[];
  targetedClusters?: string[];
  prizes?: string[];
  teamSize?: { min: number; max: number };
  tracks?: string[];
  submissionUrl?: string;
  summary: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  techStack?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  benefits?: string[];
  deadline?: string;
  additionalInfo?: string;
  status: OpportunityStatus;
  scrapedAt?: string;
  savedAt?: string;
  appliedAt?: string;
  tags: string[];
  notes?: string;
  linkedResumeId?: string;
  linkedCoverLetterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityFilters {
  searchQuery: string;
  typeTab: OpportunityTypeTab;
  status: OpportunityStatus | "all";
  source: OpportunitySource | "all";
  tag: string;
  remoteType: RemoteType | "all";
  techStack: string;
  sortBy: OpportunitySortOption;
}

export const DEFAULT_OPPORTUNITY_FILTERS: OpportunityFilters = {
  searchQuery: "",
  typeTab: "all",
  status: "all",
  source: "all",
  tag: "all",
  remoteType: "all",
  techStack: "all",
  sortBy: "deadline",
};

export const OPPORTUNITIES_VIEW_STORAGE_KEY = "get_me_job_opportunities_view";

export const OPPORTUNITY_TYPE_OPTIONS: OpportunityOption<OpportunityType>[] = [
  { value: "job", label: "Job" },
  { value: "hackathon", label: "Hackathon" },
];

export const OPPORTUNITY_TYPE_TAB_OPTIONS: OpportunityOption<OpportunityTypeTab>[] =
  [
    { value: "job", label: "Roles" },
    { value: "hackathon", label: "Hackathons" },
    { value: "all", label: "All" },
  ];

export const OPPORTUNITY_STATUS_OPTIONS: OpportunityOption<
  OpportunityStatus | "all"
>[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
  { value: "dismissed", label: "Dismissed" },
];

const OPPORTUNITY_STATUS_VALUES = new Set<OpportunityStatus>(
  OPPORTUNITY_STATUS_OPTIONS.filter(
    (option): option is OpportunityOption<OpportunityStatus> =>
      option.value !== "all",
  ).map((option) => option.value),
);

export function parseOpportunityStatusSearchParam(
  value: string | null | undefined,
): OpportunityStatus[] {
  if (!value) return [];

  const statuses: OpportunityStatus[] = [];
  const seenStatuses = new Set<OpportunityStatus>();

  for (const rawStatus of value.split(",")) {
    const normalizedStatus = normalizeOpportunityStatusSearchValue(rawStatus);
    if (!normalizedStatus || seenStatuses.has(normalizedStatus)) continue;

    statuses.push(normalizedStatus);
    seenStatuses.add(normalizedStatus);
  }

  return statuses;
}

export function getOpportunityFiltersFromStatusSearchParam(
  value: string | null | undefined,
): OpportunityFilters {
  const statuses = parseOpportunityStatusSearchParam(value);
  return {
    ...DEFAULT_OPPORTUNITY_FILTERS,
    status: statuses.length === 1 ? statuses[0] : "all",
  };
}

function normalizeOpportunityStatusSearchValue(
  value: string,
): OpportunityStatus | null {
  const status = value.trim();
  const normalizedStatus =
    status === "offered"
      ? "offer"
      : status === "withdrawn"
        ? "dismissed"
        : status;

  return OPPORTUNITY_STATUS_VALUES.has(normalizedStatus as OpportunityStatus)
    ? (normalizedStatus as OpportunityStatus)
    : null;
}

export const OPPORTUNITY_KANBAN_COLUMNS: readonly OpportunityOption<OpportunityStatus>[] =
  OPPORTUNITY_STATUS_OPTIONS.filter(
    (option): option is OpportunityOption<OpportunityStatus> =>
      option.value !== "all",
  );

export const KANBAN_LANE_LABELS: Record<KanbanLaneId, string> = {
  pending: "Pending",
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  closed: "Closed",
};

export const KANBAN_LANE_OPTIONS: readonly OpportunityOption<KanbanLaneId>[] =
  KANBAN_LANE_IDS.map((lane) => ({
    value: lane,
    label: KANBAN_LANE_LABELS[lane],
  }));

export const CLOSED_SUB_STATUS_LABELS: Record<ClosedSubStatus, string> = {
  rejected: "Rejected",
  expired: "Expired",
  dismissed: "Dismissed",
};

export const CLOSED_SUB_STATUS_BADGE_VARIANTS: Record<
  ClosedSubStatus,
  BadgeProps["variant"]
> = {
  rejected: "destructive",
  expired: "warning",
  dismissed: "secondary",
};

export const OPPORTUNITY_SOURCE_OPTIONS: OpportunityOption<
  OpportunitySource | "all"
>[] = [
  { value: "all", label: "All sources" },
  { value: "waterlooworks", label: "WaterlooWorks" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "greenhouse", label: "Greenhouse" },
  { value: "lever", label: "Lever" },
  { value: "devpost", label: "Devpost" },
  { value: "manual", label: "Manual" },
  { value: "url", label: "URL" },
];

export const REMOTE_TYPE_OPTIONS: OpportunityOption<RemoteType | "all">[] = [
  { value: "all", label: "Any remote type" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Onsite" },
];

export const OPPORTUNITY_JOB_TYPE_OPTIONS: OpportunityOption<OpportunityJobType>[] =
  [
    { value: "co-op", label: "Co-op" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
  ];

export const OPPORTUNITY_LEVEL_OPTIONS: OpportunityOption<OpportunityLevel>[] =
  [
    { value: "junior", label: "Junior" },
    { value: "intermediate", label: "Mid" },
    { value: "senior", label: "Senior" },
    { value: "staff", label: "Staff" },
    { value: "lead", label: "Lead" },
    { value: "principal", label: "Principal" },
    { value: "other", label: "Other" },
  ];

export const OPPORTUNITY_SORT_OPTIONS: OpportunityOption<OpportunitySortOption>[] =
  [
    { value: "deadline", label: "Deadline" },
    { value: "scrapedAt", label: "Date scraped" },
    { value: "company", label: "Company" },
    { value: "salary", label: "Salary" },
  ];

export const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    type: "job",
    title: "Frontend Platform Engineer",
    company: "Northstar Labs",
    source: "greenhouse",
    sourceUrl: "https://example.com/northstar-frontend",
    city: "Toronto",
    province: "ON",
    country: "Canada",
    remoteType: "hybrid",
    jobType: "full-time",
    level: "intermediate",
    summary:
      "Build reusable product surfaces, design system primitives, and workflow tooling for hiring teams.",
    responsibilities: [
      "Own React feature delivery",
      "Partner with design on component quality",
    ],
    requiredSkills: ["React", "TypeScript", "Accessibility"],
    preferredSkills: ["Next.js", "Testing Library"],
    techStack: ["React", "TypeScript", "Next.js"],
    salaryMin: 125000,
    salaryMax: 158000,
    salaryCurrency: "CAD",
    deadline: "2026-05-18",
    status: "saved",
    scrapedAt: "2026-04-25T14:00:00.000Z",
    tags: ["frontend", "platform"],
    createdAt: "2026-04-25T14:00:00.000Z",
    updatedAt: "2026-04-25T14:00:00.000Z",
  },
  {
    id: "opp-2",
    type: "hackathon",
    title: "Climate Data Sprint",
    company: "Open Data Collective",
    source: "devpost",
    sourceUrl: "https://example.com/climate-sprint",
    city: "Remote",
    country: "Global",
    remoteType: "remote",
    summary:
      "Prototype tools that turn climate datasets into practical local planning insights.",
    requiredSkills: ["Data visualization", "APIs"],
    techStack: ["Python", "Mapbox", "React"],
    prizes: ["$10,000 grand prize", "Cloud credits"],
    teamSize: { min: 2, max: 5 },
    tracks: ["Climate", "Civic tech"],
    deadline: "2026-05-05",
    status: "pending",
    scrapedAt: "2026-04-27T11:00:00.000Z",
    tags: ["climate", "portfolio"],
    createdAt: "2026-04-27T11:00:00.000Z",
    updatedAt: "2026-04-27T11:00:00.000Z",
  },
  {
    id: "opp-3",
    type: "job",
    title: "AI Product Engineer",
    company: "Cedar Systems",
    source: "linkedin",
    sourceUrl: "https://example.com/cedar-ai-product",
    city: "New York",
    province: "NY",
    country: "United States",
    remoteType: "remote",
    jobType: "contract",
    level: "senior",
    summary:
      "Ship applied AI features for operations teams using eval-driven product development.",
    responsibilities: [
      "Integrate LLM workflows",
      "Improve reliability metrics",
    ],
    requiredSkills: ["TypeScript", "LLM evaluation", "PostgreSQL"],
    preferredSkills: ["Drizzle", "Next.js"],
    techStack: ["TypeScript", "PostgreSQL", "Next.js"],
    salaryMin: 155000,
    salaryMax: 190000,
    salaryCurrency: "USD",
    deadline: "2026-06-01",
    status: "interviewing",
    scrapedAt: "2026-04-22T09:00:00.000Z",
    tags: ["ai", "backend"],
    createdAt: "2026-04-22T09:00:00.000Z",
    updatedAt: "2026-04-28T16:00:00.000Z",
  },
  {
    id: "opp-4",
    type: "hackathon",
    title: "Fintech Builder Weekend",
    company: "Ledger Guild",
    source: "manual",
    city: "Montreal",
    province: "QC",
    country: "Canada",
    remoteType: "onsite",
    summary:
      "Weekend build event for payment, budgeting, and financial literacy prototypes.",
    requiredSkills: ["Product design", "APIs"],
    techStack: ["Node.js", "React Native"],
    prizes: ["Mentorship", "$3,000 sponsor prize"],
    teamSize: { min: 1, max: 4 },
    tracks: ["Payments", "Financial literacy"],
    deadline: "2026-05-30",
    status: "saved",
    scrapedAt: "2026-04-20T10:00:00.000Z",
    tags: ["fintech", "mobile"],
    createdAt: "2026-04-20T10:00:00.000Z",
    updatedAt: "2026-04-20T10:00:00.000Z",
  },
];

export function filterOpportunities(
  opportunities: Opportunity[],
  filters: OpportunityFilters,
  allowedStatuses: readonly OpportunityStatus[] = [],
): Opportunity[] {
  const allowedStatusSet =
    allowedStatuses.length > 0 ? new Set(allowedStatuses) : null;
  return [...opportunities]
    .filter(
      (opportunity) =>
        (!allowedStatusSet || allowedStatusSet.has(opportunity.status)) &&
        matchesOpportunityFilters(opportunity, filters),
    )
    .sort((a, b) => sortOpportunities(a, b, filters.sortBy));
}

type WritableStorageLike = Pick<Storage, "setItem">;

export function getOpportunitiesViewStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function parseOpportunityViewMode(
  value: string | null | undefined,
): OpportunityViewMode {
  return value === "kanban" ? "kanban" : "list";
}

export function readOpportunityViewMode(
  storage: Pick<Storage, "getItem"> | null | undefined,
): OpportunityViewMode {
  if (!storage) return "list";

  try {
    return parseOpportunityViewMode(
      storage.getItem(OPPORTUNITIES_VIEW_STORAGE_KEY),
    );
  } catch {
    return "list";
  }
}

export function writeOpportunityViewMode(
  storage: WritableStorageLike | null | undefined,
  mode: OpportunityViewMode,
): void {
  if (!storage) return;

  try {
    storage.setItem(OPPORTUNITIES_VIEW_STORAGE_KEY, mode);
  } catch {
    // Keep the in-memory mode when localStorage writes are unavailable.
  }
}

export function groupOpportunitiesByStatus(
  opportunities: Opportunity[],
): Record<OpportunityStatus, Opportunity[]> {
  const grouped = OPPORTUNITY_KANBAN_COLUMNS.reduce(
    (acc, column) => {
      acc[column.value] = [];
      return acc;
    },
    {} as Record<OpportunityStatus, Opportunity[]>,
  );

  for (const opportunity of opportunities) {
    grouped[opportunity.status].push(opportunity);
  }

  return grouped;
}

export function groupOpportunitiesByLane(
  opportunities: Opportunity[],
  lanes: readonly KanbanLaneId[] = KANBAN_LANE_IDS,
): Record<KanbanLaneId, Opportunity[]> {
  const grouped = KANBAN_LANE_IDS.reduce(
    (acc, lane) => {
      acc[lane] = [];
      return acc;
    },
    {} as Record<KanbanLaneId, Opportunity[]>,
  );
  const visibleLaneSet = new Set<KanbanLaneId>(lanes);

  for (const opportunity of opportunities) {
    const lane = inferLaneFromStatus(opportunity.status);
    if (visibleLaneSet.has(lane)) {
      grouped[lane].push(opportunity);
    }
  }

  return grouped;
}

export function hasActiveOpportunityFilters(
  filters: Pick<
    OpportunityFilters,
    | "searchQuery"
    | "typeTab"
    | "status"
    | "source"
    | "tag"
    | "remoteType"
    | "techStack"
  >,
): boolean {
  return Boolean(
    filters.searchQuery.trim() ||
    filters.typeTab !== DEFAULT_OPPORTUNITY_FILTERS.typeTab ||
    filters.status !== DEFAULT_OPPORTUNITY_FILTERS.status ||
    filters.source !== DEFAULT_OPPORTUNITY_FILTERS.source ||
    filters.tag !== DEFAULT_OPPORTUNITY_FILTERS.tag ||
    filters.remoteType !== DEFAULT_OPPORTUNITY_FILTERS.remoteType ||
    filters.techStack !== DEFAULT_OPPORTUNITY_FILTERS.techStack,
  );
}

export function countActiveOpportunityFilters(
  filters: Pick<
    OpportunityFilters,
    | "searchQuery"
    | "typeTab"
    | "status"
    | "source"
    | "tag"
    | "remoteType"
    | "techStack"
  >,
): number {
  return [
    filters.searchQuery.trim(),
    filters.typeTab !== DEFAULT_OPPORTUNITY_FILTERS.typeTab,
    filters.status !== DEFAULT_OPPORTUNITY_FILTERS.status,
    filters.source !== DEFAULT_OPPORTUNITY_FILTERS.source,
    filters.tag !== DEFAULT_OPPORTUNITY_FILTERS.tag,
    filters.remoteType !== DEFAULT_OPPORTUNITY_FILTERS.remoteType,
    filters.techStack !== DEFAULT_OPPORTUNITY_FILTERS.techStack,
  ].filter(Boolean).length;
}

export function getOpportunityFilterOptions(
  opportunities: Opportunity[],
): OpportunityFilterOptions {
  return {
    tags: uniqueSorted(
      opportunities.flatMap((opportunity) => opportunity.tags),
    ),
    techStacks: uniqueSorted(
      opportunities.flatMap((opportunity) => opportunity.techStack ?? []),
    ),
  };
}

export function formatOpportunityLocation(opportunity: Opportunity): string {
  const pieces = [
    opportunity.city,
    opportunity.province,
    opportunity.country,
  ].filter(Boolean);
  if (pieces.length > 0) return pieces.join(", ");
  return opportunity.remoteType
    ? capitalize(opportunity.remoteType)
    : "Location TBD";
}

export function formatOpportunitySalary(opportunity: Opportunity): string {
  if (opportunity.salaryMin == null && opportunity.salaryMax == null)
    return "Compensation TBD";

  const formatter = getCurrencyFormatter(opportunity.salaryCurrency);

  if (opportunity.salaryMin != null && opportunity.salaryMax != null) {
    return `${formatter.format(opportunity.salaryMin)} - ${formatter.format(opportunity.salaryMax)}`;
  }

  if (opportunity.salaryMin != null)
    return `From ${formatter.format(opportunity.salaryMin)}`;
  return `Up to ${formatter.format(opportunity.salaryMax ?? 0)}`;
}

export function formatOpportunityDate(value: string): string {
  const parsedDate = parseDateOnly(value) ?? parseGenericDate(value);
  if (!parsedDate) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
}

export function buildOpportunityTeamSize(
  minValue: string,
  maxValue: string,
): Opportunity["teamSize"] {
  const sizes = [
    parseOptionalNumber(minValue),
    parseOptionalNumber(maxValue),
  ].filter((value): value is number => value != null && value > 0);

  if (sizes.length === 0) return undefined;

  if (sizes.length === 1) {
    const [teamSize] = sizes;
    return { min: teamSize, max: teamSize };
  }

  return {
    min: Math.min(...sizes),
    max: Math.max(...sizes),
  };
}

export function splitDelimitedList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function trimToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function matchesOpportunityFilters(
  opportunity: Opportunity,
  filters: OpportunityFilters,
): boolean {
  const query = filters.searchQuery.trim().toLowerCase();
  if (query && !getSearchableOpportunityText(opportunity).includes(query)) {
    return false;
  }

  if (filters.typeTab !== "all" && opportunity.type !== filters.typeTab) {
    return false;
  }

  if (filters.status !== "all" && opportunity.status !== filters.status) {
    return false;
  }

  if (filters.source !== "all" && opportunity.source !== filters.source) {
    return false;
  }

  if (
    filters.remoteType !== "all" &&
    opportunity.remoteType !== filters.remoteType
  ) {
    return false;
  }

  if (filters.tag !== "all" && !opportunity.tags.includes(filters.tag)) {
    return false;
  }

  if (
    filters.techStack !== "all" &&
    !(opportunity.techStack ?? []).includes(filters.techStack)
  ) {
    return false;
  }

  return true;
}

function sortOpportunities(
  a: Opportunity,
  b: Opportunity,
  sortBy: OpportunitySortOption,
): number {
  switch (sortBy) {
    case "deadline":
      return compareOptionalDates(a.deadline, b.deadline);
    case "scrapedAt":
      return compareOptionalDates(b.scrapedAt, a.scrapedAt);
    case "company":
      return (
        a.company.localeCompare(b.company) || a.title.localeCompare(b.title)
      );
    case "salary":
      return getSalarySortValue(b) - getSalarySortValue(a);
    default:
      return 0;
  }
}

function compareOptionalDates(a?: string, b?: string): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const dateA = parseComparableDate(a);
  const dateB = parseComparableDate(b);
  if (dateA == null && dateB == null) return 0;
  if (dateA == null) return 1;
  if (dateB == null) return -1;
  return dateA - dateB;
}

function getSalarySortValue(opportunity: Opportunity): number {
  return opportunity.salaryMax ?? opportunity.salaryMin ?? 0;
}

function getSearchableOpportunityText(opportunity: Opportunity): string {
  return [
    opportunity.title,
    opportunity.company,
    opportunity.division,
    opportunity.summary,
    ...(opportunity.responsibilities ?? []),
    ...(opportunity.requiredSkills ?? []),
    ...(opportunity.preferredSkills ?? []),
    ...(opportunity.techStack ?? []),
    ...opportunity.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getCurrencyFormatter(currencyValue?: string): Intl.NumberFormat {
  const currency = currencyValue?.trim().toUpperCase() || "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }
}

function parseComparableDate(value: string): number | undefined {
  return (parseDateOnly(value) ?? parseGenericDate(value))?.getTime();
}

function parseDateOnly(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  return parseToDate(value) ?? undefined;
}

function parseGenericDate(value: string): Date | undefined {
  return parseToDate(value) ?? undefined;
}
