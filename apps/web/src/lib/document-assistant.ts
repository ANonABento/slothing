import {
  buildDocumentRewritePrompt,
  type DocumentAssistantAction,
} from "@/lib/document-assistant-core";
import type { LLMConfig } from "@/types";

export * from "@/lib/document-assistant-core";

export async function rewriteDocumentSelection(
  options: {
    action: DocumentAssistantAction;
    selectedText: string;
    documentContent: string;
    jobDescription?: string;
  },
  llmConfig: LLMConfig,
): Promise<string> {
  const { getLLMUserId, runLLMTask } = await import("@/lib/llm/client");
  const result = await runLLMTask({
    task: "slothing.answer_generate",
    userId: getLLMUserId(llmConfig),
    messages: [
      {
        role: "system",
        content:
          "You are an expert job-search writing assistant. Rewrite only the selected document text and preserve the candidate's facts.",
      },
      {
        role: "user",
        content: buildDocumentRewritePrompt(options),
      },
    ],
    temperature: 0.4,
    maxTokens: 700,
  });

  return result.trim();
}
