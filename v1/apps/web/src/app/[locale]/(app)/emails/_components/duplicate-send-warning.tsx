"use client";

import { AlertTriangle } from "lucide-react";
import { TimeAgo } from "@/components/format/time-ago";

interface DuplicateSendWarningProps {
  recipient: string;
  sentAt: string;
}

export function DuplicateSendWarning({
  recipient,
  sentAt,
}: DuplicateSendWarningProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        You already sent this template type to {recipient}{" "}
        <TimeAgo date={sentAt} />.
      </p>
    </div>
  );
}
