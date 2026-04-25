export type InterviewQuestionCategory =
  | "behavioral"
  | "technical"
  | "situational"
  | "general";

export interface InterviewQuestion {
  question: string;
  category: InterviewQuestionCategory;
  suggestedAnswer?: string;
}

export interface FollowUpExchange {
  followUpQuestion: string;
  answer: string;
  feedback: string;
}

export interface CurrentFollowUp {
  question: string;
  reason: string;
  suggestedFocus: string[];
}

export interface InterviewSession {
  id?: string;
  jobId: string;
  questions: InterviewQuestion[];
  currentIndex: number;
  answers: string[];
  feedback: string[];
  followUps: FollowUpExchange[][];
  mode: "text" | "voice";
}

export interface PastSession {
  id: string;
  jobId: string;
  mode: "text" | "voice";
  status: "in_progress" | "completed";
  startedAt: string;
  completedAt?: string;
  questions: InterviewQuestion[];
  answers?: Array<{
    id: string;
    questionIndex: number;
    answer: string;
    feedback?: string;
  }>;
}
