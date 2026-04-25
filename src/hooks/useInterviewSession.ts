"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { JobDescription } from "@/types";
import type { InterviewSession, PastSession } from "@/types/interview";

interface UseInterviewSessionReturn {
  jobs: JobDescription[];
  loading: boolean;
  pastSessions: PastSession[];
  session: InterviewSession | null;
  setSession: Dispatch<SetStateAction<InterviewSession | null>>;
  selectedJob: string | null;
  currentAnswer: string;
  setCurrentAnswer: Dispatch<SetStateAction<string>>;
  submitting: boolean;
  generating: boolean;
  startInterview: (
    jobId: string,
    mode: "text" | "voice",
    difficulty: string
  ) => Promise<void>;
  submitAnswer: () => Promise<void>;
  resumeSession: (pastSession: PastSession) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  resetSession: () => void;
}

export function useInterviewSession(): UseInterviewSessionReturn {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const activeRequestRef = useRef(0);

  const invalidatePendingRequests = useCallback(() => {
    activeRequestRef.current += 1;
    return activeRequestRef.current;
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPastSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/interview/sessions");
      const data = await res.json();
      setPastSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch past sessions:", error);
    }
  }, []);

  useEffect(() => {
    void fetchJobs();
    void fetchPastSessions();
  }, [fetchJobs, fetchPastSessions]);

  const completeSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch(`/api/interview/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        await fetchPastSessions();
      } catch (error) {
        console.error("Failed to complete session:", error);
      }
    },
    [fetchPastSessions]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await fetch(`/api/interview/sessions/${sessionId}`, {
          method: "DELETE",
        });
        await fetchPastSessions();
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    },
    [fetchPastSessions]
  );

  const resumeSession = useCallback(
    (pastSession: PastSession) => {
      const job = jobs.find((candidateJob) => candidateJob.id === pastSession.jobId);
      if (!job) return;

      invalidatePendingRequests();

      const answerMap = new Map(
        (pastSession.answers ?? []).map((answer) => [answer.questionIndex, answer])
      );
      const currentIndex = pastSession.questions.findIndex(
        (_, questionIndex) => !answerMap.has(questionIndex)
      );

      setSelectedJob(pastSession.jobId);
      setCurrentAnswer("");
      setSession({
        id: pastSession.id,
        jobId: pastSession.jobId,
        questions: pastSession.questions,
        currentIndex:
          currentIndex === -1 ? pastSession.questions.length : currentIndex,
        answers: pastSession.questions.map(
          (_, questionIndex) => answerMap.get(questionIndex)?.answer || ""
        ),
        feedback: pastSession.questions.map(
          (_, questionIndex) => answerMap.get(questionIndex)?.feedback || ""
        ),
        followUps: [],
        mode: pastSession.mode,
      });
    },
    [invalidatePendingRequests, jobs]
  );

  const startInterview = useCallback(
    async (jobId: string, mode: "text" | "voice", difficulty: string) => {
      const requestId = invalidatePendingRequests();
      setSelectedJob(jobId);
      setGenerating(true);

      try {
        const questionsRes = await fetch("/api/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, mode, difficulty }),
        });
        const questionsData = await questionsRes.json();

        if (!questionsData.questions) {
          throw new Error("Failed to generate questions");
        }

        const sessionRes = await fetch("/api/interview/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId,
            questions: questionsData.questions,
            mode,
          }),
        });
        const sessionData = await sessionRes.json();

        if (activeRequestRef.current !== requestId) {
          return;
        }

        setCurrentAnswer("");
        setSession({
          id: sessionData.session?.id,
          jobId,
          questions: questionsData.questions,
          currentIndex: 0,
          answers: [],
          feedback: [],
          followUps: [],
          mode,
        });
      } catch (error) {
        console.error("Failed to start interview:", error);
      } finally {
        if (activeRequestRef.current === requestId) {
          setGenerating(false);
        }
      }
    },
    [invalidatePendingRequests]
  );

  const submitAnswer = useCallback(async () => {
    if (!session || !currentAnswer.trim()) return;

    const submittingSession = session;
    setSubmitting(true);
    try {
      const apiUrl = submittingSession.id
        ? `/api/interview/sessions/${submittingSession.id}/answer`
        : "/api/interview/answer";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: submittingSession.jobId,
          questionIndex: submittingSession.currentIndex,
          answer: currentAnswer,
        }),
      });
      const data = await res.json();
      let completedSessionId: string | null = null;
      let shouldClearAnswer = false;

      setSession((currentSession) => {
        if (currentSession !== submittingSession) {
          return currentSession;
        }

        const newAnswers = [...currentSession.answers];
        newAnswers[currentSession.currentIndex] = currentAnswer;

        const newFeedback = [...currentSession.feedback];
        newFeedback[currentSession.currentIndex] = data.feedback || "";

        if (currentSession.currentIndex < currentSession.questions.length - 1) {
          shouldClearAnswer = true;
          return {
            ...currentSession,
            currentIndex: currentSession.currentIndex + 1,
            answers: newAnswers,
            feedback: newFeedback,
          };
        }

        completedSessionId = currentSession.id ?? null;
        return {
          ...currentSession,
          answers: newAnswers,
          feedback: newFeedback,
          currentIndex: currentSession.questions.length,
        };
      });

      if (shouldClearAnswer) {
        setCurrentAnswer("");
      }

      if (completedSessionId) {
        await completeSession(completedSessionId);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  }, [completeSession, currentAnswer, session]);

  const resetSession = useCallback(() => {
    invalidatePendingRequests();
    setSession(null);
    setSelectedJob(null);
    setCurrentAnswer("");
    setGenerating(false);
  }, [invalidatePendingRequests]);

  return {
    jobs,
    loading,
    pastSessions,
    session,
    setSession,
    selectedJob,
    currentAnswer,
    setCurrentAnswer,
    submitting,
    generating,
    startInterview,
    submitAnswer,
    resumeSession,
    deleteSession,
    resetSession,
  };
}
