import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OpportunityStatus } from "@/app/[locale]/(app)/opportunities/utils";

// One source of truth for how an opportunity status is presented across
// list, kanban, review queue, and applications surfaces. Previously each
// surface picked its own Badge variant (or no badge at all) which made
// equal opportunities look different depending on which page you visited.

type StatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline";

interface StatusPresentation {
  variant: StatusVariant;
  label: string;
  // Optional override: `interviewing` wants a stronger blue than `applied`
  // so kanban/list visually escalate as the user progresses through the
  // funnel. Implemented as an extra className that fills the badge solid
  // instead of using the default `bg-info/10` tint.
  emphasizedClassName?: string;
}

const STATUS_PRESENTATION: Record<OpportunityStatus, StatusPresentation> = {
  pending: { variant: "warning", label: "Pending" },
  saved: { variant: "secondary", label: "Saved" },
  applied: { variant: "info", label: "Applied" },
  interviewing: {
    variant: "info",
    label: "Interviewing",
    emphasizedClassName: "bg-info text-info-foreground",
  },
  offer: { variant: "success", label: "Offer" },
  rejected: { variant: "destructive", label: "Rejected" },
  expired: { variant: "warning", label: "Expired" },
  dismissed: { variant: "secondary", label: "Dismissed" },
};

interface StatusPillProps {
  status: OpportunityStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const presentation = STATUS_PRESENTATION[status];
  return (
    <Badge
      variant={presentation.variant}
      className={cn(presentation.emphasizedClassName, className)}
    >
      {presentation.label}
    </Badge>
  );
}

export function getStatusPillLabel(status: OpportunityStatus) {
  return STATUS_PRESENTATION[status].label;
}
