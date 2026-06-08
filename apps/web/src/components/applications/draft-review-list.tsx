"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, FileText, Loader2, ShieldAlert, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StandardEmptyState } from "@/components/ui/page-layout";
import { useUndoableAction } from "@/hooks/use-undoable-action";
import { readJsonResponse } from "@/lib/http";
import {
  isGrounded,
  type ApplicationDraft,
  type DraftAnswer,
} from "@/lib/agent/draft";

function confidenceTone(confidence: number): "default" | "secondary" {
  return confidence >= 0.7 ? "default" : "secondary";
}

export function DraftReviewList() {
  const [drafts, setDrafts] = useState<ApplicationDraft[]>([]);
  const [edits, setEdits] = useState<Record<string, DraftAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/applications/drafts");
      const data = await readJsonResponse<{ drafts: ApplicationDraft[] }>(
        response,
        "Failed to load drafts",
      );
      setDrafts(data.drafts);
      setEdits(Object.fromEntries(data.drafts.map((d) => [d.id, d.answers])));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setAnswerValue = (
    draftId: string,
    questionId: string,
    value: string,
  ) => {
    setEdits((prev) => ({
      ...prev,
      [draftId]: (prev[draftId] ?? []).map((a) =>
        a.questionId === questionId ? { ...a, value } : a,
      ),
    }));
  };

  const patchDraft = async (
    draftId: string,
    body: {
      answers?: DraftAnswer[];
      status?: "approved" | "rejected" | "pending_review";
    },
  ) => {
    const response = await fetch(`/api/applications/drafts/${draftId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await readJsonResponse<unknown>(response, "Failed to update draft");
  };

  const removeFromList = (draftId: string) =>
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));

  const reject = useUndoableAction<string>({
    action: async (draftId) => {
      await patchDraft(draftId, { status: "rejected" });
      removeFromList(draftId);
    },
    undoAction: async (draftId) => {
      await patchDraft(draftId, { status: "pending_review" });
      await load();
    },
    message: "Draft rejected",
    description: "It won't be submitted.",
  });

  const approve = async (draftId: string) => {
    setBusyId(draftId);
    try {
      await patchDraft(draftId, {
        answers: edits[draftId],
        status: "approved",
      });
      removeFromList(draftId);
    } finally {
      setBusyId(null);
    }
  };

  const saveEdits = async (draftId: string) => {
    setBusyId(draftId);
    try {
      await patchDraft(draftId, { answers: edits[draftId] });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading drafts…
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <StandardEmptyState
        icon={FileText}
        title="No drafts to review"
        description="When your agent drafts applications overnight, they'll appear here for you to approve, edit, or reject."
      />
    );
  }

  return (
    <div className="space-y-5">
      {drafts.map((draft) => {
        const answers = edits[draft.id] ?? draft.answers;
        const questionLabel = (questionId: string) =>
          draft.questions.find((q) => q.id === questionId)?.label ?? questionId;
        const busy = busyId === draft.id;
        return (
          <Card key={draft.id}>
            <CardHeader>
              <CardTitle>Drafted application</CardTitle>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {draft.authoredBy} · job {draft.jobId}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {answers.map((answer) => {
                const grounded = isGrounded(answer);
                return (
                  <div key={answer.questionId} className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor={`${draft.id}-${answer.questionId}`}
                        className="text-sm font-medium text-foreground"
                      >
                        {questionLabel(answer.questionId)}
                      </label>
                      <Badge variant={confidenceTone(answer.confidence)}>
                        {Math.round(answer.confidence * 100)}% confident
                      </Badge>
                      {!grounded && (
                        <Badge variant="destructive">
                          <ShieldAlert className="mr-1 h-3 w-3" /> Ungrounded
                        </Badge>
                      )}
                    </div>
                    <Textarea
                      id={`${draft.id}-${answer.questionId}`}
                      value={answer.value}
                      rows={3}
                      onChange={(e) =>
                        setAnswerValue(
                          draft.id,
                          answer.questionId,
                          e.target.value,
                        )
                      }
                    />
                    {grounded ? (
                      <p className="text-xs text-muted-foreground">
                        Grounded in: {answer.source || answer.groundedIn}
                      </p>
                    ) : (
                      <p className="text-xs text-destructive">
                        No supporting evidence — verify before approving.
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  type="button"
                  onClick={() => void approve(draft.id)}
                  disabled={busy}
                >
                  {busy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void saveEdits(draft.id)}
                  disabled={busy}
                >
                  Save edits
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void reject(draft.id)}
                  disabled={busy}
                >
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
