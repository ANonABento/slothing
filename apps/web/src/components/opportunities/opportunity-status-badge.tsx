import {
  OPPORTUNITY_STATUSES,
  type OpportunityStatus,
} from "@slothing/shared/schemas";
import { cn } from "@/lib/utils";

// F2.1 + F4.3 fix: replaces the legacy `JobStatusBadge` which silently
// rendered canonical `OpportunityStatus="offer"` rows as "Saved" because the
// status keys disagreed between the storage layer (`offer`) and the badge
// label table (`offered`). The badge now operates against the canonical
// `OpportunityStatus` union from `@slothing/shared/schemas` so the type
// system enforces the value set.

const STATUS_CLASSES: Record<OpportunityStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  saved: "bg-muted text-muted-foreground",
  dismissed: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
  applied: "bg-info/15 text-info",
  interviewing: "bg-warning/15 text-warning",
  offer: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  pending: "Pending",
  saved: "Saved",
  applied: "Applied",
  // Mirrors the legacy badge's preference for the shorter "Interview" label
  // on dense surfaces (dashboard recent-applications table, kanban).
  interviewing: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  expired: "Expired",
  dismissed: "Dismissed",
};

const OPPORTUNITY_STATUS_VALUES = new Set<OpportunityStatus>(
  OPPORTUNITY_STATUSES,
);

function coerceStatus(status: string): OpportunityStatus {
  // Cached clients or legacy DB rows that escape the migration may still
  // surface `offered` / `withdrawn`; map them to the canonical equivalents
  // so the badge renders the right label and color.
  if (status === "offered") return "offer";
  if (status === "withdrawn") return "dismissed";
  if (OPPORTUNITY_STATUS_VALUES.has(status as OpportunityStatus)) {
    return status as OpportunityStatus;
  }
  return "saved";
}

interface OpportunityStatusBadgeProps {
  status: OpportunityStatus | string;
  className?: string;
}

export function OpportunityStatusBadge({
  status,
  className,
}: OpportunityStatusBadgeProps) {
  const canonical = coerceStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_CLASSES[canonical],
        className,
      )}
    >
      {STATUS_LABELS[canonical]}
    </span>
  );
}
