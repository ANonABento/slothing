"use client";

import { useCallback, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { InterviewActiveSession } from "@/components/interview/interview-active-session";
import { InterviewJobSelection } from "@/components/interview/interview-job-selection";
import { InterviewSummary } from "@/components/interview/interview-summary";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  AppPage,
  PageContent,
  PageHeader,
  PageLoadingState,
} from "@/components/ui/page-layout";
import { useFollowUp } from "@/hooks/useFollowUp";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import type { InterviewDifficulty } from "@/lib/constants";
import type { InterviewMode, PastSession } from "@/types/interview";

export default function InterviewPage() {
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("mid");
  const interview = useInterviewSession();
  const { confirm, dialog: confirmDialog } = useConfirmDialog();
  const followUp = useFollowUp({
    session: interview.session,
    setSession: interview.setSession,
    currentAnswer: interview.currentAnswer,
    setCurrentAnswer: interview.setCurrentAnswer,
  });

  const selectedJobData = interview.jobs.find(
    (job) => job.id === interview.selectedJob,
  );
  const isComplete =
    interview.session &&
    interview.session.currentIndex >= interview.session.questions.length;

  const resetInterview = useCallback(() => {
    followUp.resetFollowUp();
    interview.resetSession();
  }, [followUp, interview]);

  const handleStartInterview = useCallback(
    (jobId: string, mode: InterviewMode) => {
      followUp.resetFollowUp();
      void interview.startInterview(jobId, mode, difficulty);
    },
    [difficulty, followUp, interview],
  );

  const handleResumeSession = useCallback(
    (pastSession: PastSession) => {
      followUp.resetFollowUp();
      interview.resumeSession(pastSession);
    },
    [followUp, interview],
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      const confirmed = await confirm({
        title: "Delete this interview session?",
        description:
          "This permanently removes the practice session, answers, and feedback history.",
        confirmLabel: "Delete",
      });
      if (confirmed) {
        await interview.deleteSession(sessionId);
      }
    },
    [confirm, interview],
  );

  if (interview.loading) {
    return (
      <PageLoadingState icon={Loader2} label="Loading interview prep..." />
    );
  }

  return (
    <AppPage className="pb-0">
      <PageHeader
        width="wide"
        icon={Sparkles}
        title="Interview Preparation"
        description="Practice with AI-generated questions tailored to your target jobs and receive instant feedback."
      />

      <PageContent className={!interview.session ? "max-w-4xl" : undefined}>
        {!interview.session ? (
          <InterviewJobSelection
            jobs={interview.jobs}
            selectedJob={interview.selectedJob}
            generating={interview.generating}
            onStartInterview={handleStartInterview}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            pastSessions={interview.pastSessions}
            onResumeSession={handleResumeSession}
            onDeleteSession={(sessionId) => void handleDeleteSession(sessionId)}
          />
        ) : isComplete ? (
          <InterviewSummary
            session={interview.session}
            selectedJob={selectedJobData}
            onReset={resetInterview}
          />
        ) : (
          <InterviewActiveSession
            session={interview.session}
            selectedJobData={selectedJobData}
            currentAnswer={interview.currentAnswer}
            onChangeAnswer={interview.setCurrentAnswer}
            submitting={interview.submitting || followUp.submittingFollowUp}
            onSubmitAnswer={() => void interview.submitAnswer()}
            onEndInterview={resetInterview}
            followUpMode={followUp.followUpMode}
            currentFollowUp={followUp.currentFollowUp}
            loadingFollowUp={followUp.loadingFollowUp}
            onRequestFollowUp={() => void followUp.requestFollowUp()}
            onSubmitFollowUp={() => void followUp.submitFollowUpAnswer()}
            onSkipFollowUp={followUp.skipFollowUp}
          />
        )}
      </PageContent>
      {confirmDialog}
    </AppPage>
  );
}
