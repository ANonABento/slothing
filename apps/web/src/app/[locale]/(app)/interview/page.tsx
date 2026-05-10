"use client";

import { Suspense, useCallback, useState } from "react";
import { Sparkles } from "lucide-react";
import { InterviewSkeleton } from "@/components/skeletons/interview-skeleton";
import { InterviewActiveSession } from "@/components/interview/interview-active-session";
import { InterviewJobSelection } from "@/components/interview/interview-job-selection";
import { InterviewSummary } from "@/components/interview/interview-summary";
import { QuickPracticeDialog } from "@/components/interview/quick-practice-dialog";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { AppPage, PageContent, PageHeader } from "@/components/ui/page-layout";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useFollowUp } from "@/hooks/useFollowUp";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import type {
  InterviewDifficulty,
  SessionQuestionCategory,
} from "@/lib/constants";
import type { InterviewMode, PastSession } from "@/types/interview";

const QUESTION_COUNT_STORAGE_KEY = "taida:interview:question-count";
const TIMER_STORAGE_KEY = "taida:interview:timer-enabled";

export default function InterviewPage() {
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("mid");
  const [quickPracticeOpen, setQuickPracticeOpen] = useState(false);
  const [quickPracticeCategory, setQuickPracticeCategory] =
    useState<SessionQuestionCategory | null>(null);
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
    (
      jobId: string,
      mode: InterviewMode,
      options: { questionCount: number; timerEnabled: boolean },
    ) => {
      followUp.resetFollowUp();
      void interview.startInterview(jobId, mode, difficulty, options);
    },
    [difficulty, followUp, interview],
  );

  const openQuickPractice = useCallback(
    (category?: SessionQuestionCategory) => {
      setQuickPracticeCategory(category || null);
      setQuickPracticeOpen(true);
    },
    [],
  );

  const handleQuickPracticeSubmit = useCallback(
    (options: {
      category: SessionQuestionCategory;
      questionCount: number;
      difficulty: InterviewDifficulty;
      timerEnabled: boolean;
    }) => {
      setQuickPracticeOpen(false);
      followUp.resetFollowUp();
      window.localStorage.setItem(
        QUESTION_COUNT_STORAGE_KEY,
        String(options.questionCount),
      );
      window.localStorage.setItem(
        TIMER_STORAGE_KEY,
        String(options.timerEnabled),
      );
      void interview.startInterview(null, "generic-text", options.difficulty, {
        category: options.category,
        questionCount: options.questionCount,
        timerEnabled: options.timerEnabled,
      });
    },
    [followUp, interview],
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
    return <InterviewSkeleton />;
  }

  return (
    <AppPage className="pb-0">
      <PageHeader
        width="wide"
        icon={Sparkles}
        title="Interview Preparation"
        description="Practice with AI-generated questions tailored to your target jobs and receive instant feedback."
      />

      <PageContent>
        {!interview.session ? (
          <Suspense fallback={<SkeletonCard />}>
            <InterviewJobSelection
              jobs={interview.jobs}
              selectedJob={interview.selectedJob}
              generating={interview.generating}
              onStartInterview={handleStartInterview}
              onStartQuickPractice={openQuickPractice}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              pastSessions={interview.pastSessions}
              onResumeSession={handleResumeSession}
              onDeleteSession={(sessionId) =>
                void handleDeleteSession(sessionId)
              }
            />
          </Suspense>
        ) : isComplete ? (
          <Suspense fallback={<SkeletonCard />}>
            <InterviewSummary
              session={interview.session}
              selectedJob={selectedJobData}
              onReset={resetInterview}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<SkeletonCard />}>
            <InterviewActiveSession
              session={interview.session}
              selectedJobData={selectedJobData}
              currentAnswer={interview.currentAnswer}
              onChangeAnswer={interview.setCurrentAnswer}
              submitting={interview.submitting || followUp.submittingFollowUp}
              onSubmitAnswer={() => void interview.submitAnswer()}
              onSkipQuestion={async () => {
                const confirmed = await confirm({
                  title: "Skip this question?",
                  description:
                    "It will be marked as skipped in your summary so you can revisit it later.",
                  confirmLabel: "Skip",
                });
                if (confirmed) {
                  await interview.skipQuestion();
                }
              }}
              onEndInterview={resetInterview}
              followUpMode={followUp.followUpMode}
              currentFollowUp={followUp.currentFollowUp}
              loadingFollowUp={followUp.loadingFollowUp}
              onRequestFollowUp={() => void followUp.requestFollowUp()}
              onSubmitFollowUp={() => void followUp.submitFollowUpAnswer()}
              onSkipFollowUp={followUp.skipFollowUp}
            />
          </Suspense>
        )}
      </PageContent>
      <QuickPracticeDialog
        open={quickPracticeOpen}
        defaultCategory={quickPracticeCategory}
        defaultQuestionCount={Number(
          typeof window !== "undefined"
            ? window.localStorage.getItem(QUESTION_COUNT_STORAGE_KEY) || 5
            : 5,
        )}
        defaultDifficulty={difficulty}
        defaultTimerEnabled={
          typeof window !== "undefined" &&
          window.localStorage.getItem(TIMER_STORAGE_KEY) === "true"
        }
        onOpenChange={setQuickPracticeOpen}
        onSubmit={handleQuickPracticeSubmit}
      />
      {confirmDialog}
    </AppPage>
  );
}
