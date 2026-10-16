import { AnswerBank } from "@/components/answer-bank";
import { COMMON_QUESTIONS, bestAnswer } from "@/lib/answers";
import { listAnswers } from "@/lib/db";
import { llmConfigured } from "@/lib/llm";

export const dynamic = "force-dynamic";

export default function AnswersPage() {
  const answers = listAnswers();
  // Common questions without a saved question like them yet (answered or not), so the bank starts with what every form asks.
  const asked = answers.map((a) => ({ ...a, answer: " " }));
  const suggestions = COMMON_QUESTIONS.filter((q) => !bestAnswer(q, asked));
  return <AnswerBank answers={answers} suggestions={suggestions} llm={llmConfigured()} />;
}
