import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InterviewActiveSession } from "./interview-active-session";
import type { InterviewSession } from "@/types/interview";

vi.mock("@/hooks/useVoiceInput", () => ({
  useVoiceInput: () => ({
    isListening: false,
    isSupported: true,
    transcript: "",
    interimTranscript: "",
    resetTranscript: vi.fn(),
    startListening: vi.fn(),
    stopListening: vi.fn(),
  }),
}));

vi.mock("@/hooks/useVoiceOutput", () => ({
  useVoiceOutput: () => ({
    isSpeaking: false,
    speak: vi.fn(),
    stop: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-error-toast", () => ({
  useErrorToast: () => vi.fn(),
}));

const baseSession: InterviewSession = {
  id: "session-1",
  jobId: null,
  category: "behavioral",
  questions: [
    {
      question: "Tell me about a challenge.",
      category: "behavioral",
      suggestedAnswer: "Use STAR.",
    },
  ],
  currentIndex: 0,
  answers: [],
  feedback: [],
  followUps: [],
  mode: "generic-text",
};

const defaultProps = {
  currentAnswer: "A concise answer",
  onChangeAnswer: vi.fn(),
  submitting: false,
  onSubmitAnswer: vi.fn(),
  onSkipQuestion: vi.fn(),
  onEndInterview: vi.fn(),
  followUpMode: false,
  currentFollowUp: null,
  loadingFollowUp: false,
  onRequestFollowUp: vi.fn(),
  onSubmitFollowUp: vi.fn(),
  onSkipFollowUp: vi.fn(),
};

describe("InterviewActiveSession", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("fires skip question from the skip button", () => {
    render(<InterviewActiveSession session={baseSession} {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Skip/i }));

    expect(defaultProps.onSkipQuestion).toHaveBeenCalled();
  });

  it("uses the current question as the answer textarea accessible name", () => {
    render(<InterviewActiveSession session={baseSession} {...defaultProps} />);

    expect(
      screen.getByRole("textbox", { name: /Tell me about a challenge/i }),
    ).toBeInTheDocument();
  });

  it("renders timer controls when time expires", () => {
    render(
      <InterviewActiveSession
        session={{
          ...baseSession,
          timer: { enabled: true, remainingMs: 0, extended: false },
        }}
        {...defaultProps}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Take 30s more/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit what I have/i }),
    ).toBeInTheDocument();
  });
});
