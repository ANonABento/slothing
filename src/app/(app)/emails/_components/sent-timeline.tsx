"use client";

import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { TimeAgo } from "@/components/format/time-ago";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EmailTemplateType, JobDescription } from "@/types";

export interface EmailSendForTimeline {
  id: string;
  type: EmailTemplateType;
  jobId?: string;
  recipient: string;
  subject: string;
  body: string;
  inReplyToDraftId?: string;
  gmailMessageId?: string;
  status: "sent" | "failed";
  errorMessage?: string;
  sentAt: string;
}

interface SentTimelineProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sends: EmailSendForTimeline[];
  jobs: JobDescription[];
  selectedJobId?: string;
}

export function SentTimeline({
  open,
  onOpenChange,
  sends,
  jobs,
  selectedJobId,
}: SentTimelineProps) {
  const [expandedSendId, setExpandedSendId] = useState<string | null>(null);
  const [companyOnly, setCompanyOnly] = useState(false);
  const selectedJob = selectedJobId
    ? jobs.find((job) => job.id === selectedJobId)
    : undefined;

  const filteredSends = useMemo(() => {
    if (!companyOnly || !selectedJob) return sends;
    return sends.filter((send) => send.jobId === selectedJob.id);
  }, [companyOnly, selectedJob, sends]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 flex h-dvh max-h-dvh w-full max-w-lg translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none p-0 sm:rounded-none">
        <DialogHeader className="border-b p-5 pr-14">
          <DialogTitle>Sent ({sends.length})</DialogTitle>
          <DialogDescription>
            Emails sent through Gmail appear in this timeline.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 border-b p-4">
          <Button
            variant={companyOnly ? "outline" : "default"}
            size="sm"
            onClick={() => setCompanyOnly(false)}
          >
            All
          </Button>
          <Button
            variant={companyOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setCompanyOnly(true)}
            disabled={!selectedJob}
          >
            This company
          </Button>
          {selectedJob ? (
            <span className="truncate text-xs text-muted-foreground">
              {selectedJob.company}
            </span>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto">
          {sends.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              No sent emails yet. Sending via Gmail will record here
              automatically.
            </div>
          ) : filteredSends.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No sent emails match this company.
            </div>
          ) : (
            <div className="divide-y">
              {filteredSends.map((send) => {
                const expanded = expandedSendId === send.id;

                return (
                  <article key={send.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {send.recipient}
                        </p>
                        <h3 className="mt-1 truncate text-sm">
                          {send.subject}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground">
                          <TimeAgo date={send.sentAt} />
                        </p>
                      </div>
                      <span
                        className={
                          send.status === "failed"
                            ? "rounded-md bg-destructive/15 px-2 py-1 text-xs font-medium text-destructive"
                            : "rounded-md bg-success/15 px-2 py-1 text-xs font-medium text-success"
                        }
                      >
                        {send.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedSendId(expanded ? null : send.id)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                    {expanded ? (
                      <pre className="mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
                        {send.body}
                      </pre>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
