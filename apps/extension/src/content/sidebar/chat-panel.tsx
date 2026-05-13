import React, { FormEvent, useCallback, useState } from "react";

/**
 * P4/#40 — Inline AI assistant chat panel for the job-page sidebar.
 *
 * One-shot per submission (no conversational history in v1 — see roadmap).
 * The parent wires `onStream` to a port-backed streaming function that yields
 * tokens; we render a spinner before the first token, then append tokens as
 * they arrive. When the active intent is `coverLetter` and the stream
 * completes successfully, we surface a "Use in cover letter" button which
 * deep-links into /studio?mode=cover_letter with the streamed text seeded.
 */

export type ChatIntent = "qualified" | "coverLetter" | "free";

export interface ChatPanelProps {
  /**
   * Hands a prompt + intent to the parent, which is responsible for opening a
   * chrome.runtime.connect port, posting CHAT_STREAM_START, and forwarding
   * tokens via `onToken`. Returns a Promise that resolves on stream end.
   */
  onStream: (params: {
    prompt: string;
    intent: ChatIntent;
    onToken: (token: string) => void;
    signal: AbortSignal;
  }) => Promise<void>;
  /**
   * Called when the user clicks "Use in cover letter" — opens
   * `/studio?mode=cover_letter&jobId=...&seed=...` in a new tab.
   */
  onUseInCoverLetter: (seedText: string) => void;
}

const QUALIFIED_PROMPT =
  "In 4 sentences, explain why I'm qualified for this role. Reference 1-2 specific items from my profile and tie them to the job's requirements. No fluff.";

const COVER_LETTER_PROMPT =
  "Draft only the OPENING PARAGRAPH of a cover letter for this role. 3-5 sentences. Hook the reader by tying one specific item from my profile to one specific need from the job. No salutation, no closing.";

/**
 * Truncation cap on the seed query-string parameter so we don't blow URL
 * limits. Studio re-renders the full text once the page loads, so this is
 * just for the deep-link payload.
 */
export const COVER_LETTER_SEED_MAX = 500;

export function ChatPanel(props: ChatPanelProps) {
  const [intent, setIntent] = useState<ChatIntent>("free");
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const run = useCallback(
    async (prompt: string, kind: ChatIntent) => {
      if (streaming) return;
      setStreaming(true);
      setIntent(kind);
      setOutput("");
      setError(null);
      setCompleted(false);

      const controller = new AbortController();
      try {
        await props.onStream({
          prompt,
          intent: kind,
          onToken: (token) => setOutput((prev) => prev + token),
          signal: controller.signal,
        });
        setCompleted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setStreaming(false);
      }
    },
    [props, streaming],
  );

  const handleQualified = () => {
    void run(QUALIFIED_PROMPT, "qualified");
  };

  const handleCoverLetter = () => {
    void run(COVER_LETTER_PROMPT, "coverLetter");
  };

  const handleFreeSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    void run(trimmed, "free");
  };

  const showCoverLetterCta =
    !streaming &&
    completed &&
    intent === "coverLetter" &&
    output.trim().length > 0;

  return (
    <section className="chat-panel" aria-label="AI assistant">
      <p className="section-title">AI assistant</p>

      <div className="chat-seed-row">
        <button
          type="button"
          className="small-button secondary"
          disabled={streaming}
          onClick={handleQualified}
        >
          Why am I qualified?
        </button>
        <button
          type="button"
          className="small-button secondary"
          disabled={streaming}
          onClick={handleCoverLetter}
        >
          Cover-letter opener
        </button>
      </div>

      <form className="chat-input-row" onSubmit={handleFreeSubmit}>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask anything about this job…"
          rows={2}
          disabled={streaming}
          aria-label="Ask the AI assistant"
        />
        <button
          type="submit"
          className="small-button"
          disabled={streaming || !draft.trim()}
        >
          {streaming && intent === "free" ? "…" : "Send"}
        </button>
      </form>

      <div
        className="chat-result"
        role="status"
        aria-live="polite"
        aria-busy={streaming}
      >
        {streaming && output.length === 0 && (
          <p className="chat-spinner">Thinking…</p>
        )}
        {output && <p className="chat-output">{output}</p>}
        {error && (
          <p className="status-card error chat-error" role="alert">
            {error}
          </p>
        )}
        {showCoverLetterCta && (
          <button
            type="button"
            className="small-button chat-use-cta"
            onClick={() =>
              props.onUseInCoverLetter(
                output.trim().slice(0, COVER_LETTER_SEED_MAX),
              )
            }
          >
            Use in cover letter
          </button>
        )}
      </div>
    </section>
  );
}
