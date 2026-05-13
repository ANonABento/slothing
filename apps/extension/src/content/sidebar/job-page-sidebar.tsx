import React, { FormEvent, useMemo, useState } from "react";
import type { SimilarAnswer, ScrapedJob } from "@/shared/types";
import type { ResumeScore } from "@slothing/shared/scoring";
import { ChatPanel, type ChatIntent } from "./chat-panel";

export type SidebarAction = "tailor" | "coverLetter" | "save" | "autoFill";

export interface JobPageSidebarProps {
  scrapedJob: ScrapedJob;
  detectedFieldCount: number;
  score: ResumeScore | null;
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  onDismiss: () => Promise<void> | void;
  onTailor: () => Promise<void>;
  onCoverLetter: () => Promise<void>;
  onSave: () => Promise<void>;
  onAutoFill: () => Promise<void>;
  onSearchAnswers: (query: string) => Promise<SimilarAnswer[]>;
  onApplyAnswer: (answer: SimilarAnswer) => Promise<void> | void;
  /**
   * P4/#40 — Streaming AI assistant. Parent opens a chrome.runtime.connect
   * port, posts CHAT_STREAM_START, and forwards tokens via `onToken`.
   * Resolves on stream end; rejects with a user-friendly Error on failure.
   */
  onChatStream: (params: {
    prompt: string;
    intent: ChatIntent;
    onToken: (token: string) => void;
    signal: AbortSignal;
  }) => Promise<void>;
  /**
   * P4/#40 — Deep-link the user into /studio?mode=cover_letter with the
   * streamed cover-letter opener seeded as a query param.
   */
  onUseInCoverLetter: (seedText: string) => void;
}

type Notice = { kind: "success" | "error"; message: string } | null;

const ACTION_LABELS: Record<SidebarAction, string> = {
  tailor: "Tailor",
  coverLetter: "Cover Letter",
  save: "Save",
  autoFill: "Auto-fill",
};

export function JobPageSidebar(props: JobPageSidebarProps) {
  const [activeAction, setActiveAction] = useState<SidebarAction | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState<SimilarAnswer[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const scoreValue = props.score?.overall ?? null;
  const scoreDegrees = Math.round(((scoreValue ?? 0) / 100) * 360);
  const jobMeta = useMemo(
    () =>
      [props.scrapedJob.company, props.scrapedJob.location]
        .filter(Boolean)
        .join(" / "),
    [props.scrapedJob.company, props.scrapedJob.location],
  );

  async function runAction(
    action: SidebarAction,
    callback: () => Promise<void>,
  ) {
    setActiveAction(action);
    setNotice(null);

    try {
      await callback();
      setNotice({
        kind: "success",
        message:
          action === "autoFill"
            ? "Application fields updated."
            : `${ACTION_LABELS[action]} complete.`,
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message: (error as Error).message || `${ACTION_LABELS[action]} failed.`,
      });
    } finally {
      setActiveAction(null);
    }
  }

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearching(true);
    setSearchError(null);
    try {
      setAnswers(await props.onSearchAnswers(trimmed));
    } catch (error) {
      setSearchError((error as Error).message || "Answer search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function copyAnswer(answer: SimilarAnswer) {
    await navigator.clipboard.writeText(answer.answer);
    setNotice({ kind: "success", message: "Answer copied." });
  }

  if (props.isCollapsed) {
    return (
      <aside className="slothing-sidebar" aria-label="Slothing job sidebar">
        <button
          className="rail"
          type="button"
          onClick={() => props.onCollapseChange(false)}
          aria-label="Open Slothing sidebar"
          title="Open Slothing sidebar"
        >
          <span className="rail-score">{scoreValue ?? "--"}</span>
          <span className="rail-label">Slothing</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="slothing-sidebar" aria-label="Slothing job sidebar">
      <div className="panel">
        <header className="header">
          <div>
            <p className="brand">Slothing</p>
            <h2 className="title">{props.scrapedJob.title}</h2>
            <p className="company">{jobMeta || props.scrapedJob.company}</p>
          </div>
          <div className="icon-row">
            <button
              className="icon-button"
              type="button"
              onClick={() => props.onCollapseChange(true)}
              aria-label="Collapse Slothing sidebar"
              title="Collapse"
            >
              &rsaquo;
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => void props.onDismiss()}
              aria-label="Dismiss Slothing sidebar for this domain"
              title="Dismiss for this domain"
            >
              &times;
            </button>
          </div>
        </header>

        <div className="body">
          <section className="score-card" aria-label="Match score">
            <div
              className="score-number"
              style={
                { "--score-deg": `${scoreDegrees}deg` } as React.CSSProperties
              }
            >
              <span>{scoreValue ?? "--"}</span>
            </div>
            <div>
              <p className="score-label">
                {scoreValue === null ? "Profile needed" : "Match score"}
              </p>
              <p className="score-note">
                {scoreValue === null
                  ? "Connect your profile to score this job."
                  : "Based on your profile and this job description."}
              </p>
            </div>
          </section>

          <section className="actions" aria-label="Job actions">
            <ActionButton
              label="Tailor resume"
              activeLabel="Tailoring..."
              active={activeAction === "tailor"}
              disabled={activeAction !== null}
              primary
              onClick={() => runAction("tailor", props.onTailor)}
            />
            <ActionButton
              label="Cover letter"
              activeLabel="Generating..."
              active={activeAction === "coverLetter"}
              disabled={activeAction !== null}
              onClick={() => runAction("coverLetter", props.onCoverLetter)}
            />
            <ActionButton
              label="Save job"
              activeLabel="Saving..."
              active={activeAction === "save"}
              disabled={activeAction !== null}
              onClick={() => runAction("save", props.onSave)}
            />
            <ActionButton
              label={
                props.detectedFieldCount > 0
                  ? `Auto-fill ${props.detectedFieldCount} fields`
                  : "Auto-fill"
              }
              activeLabel="Filling..."
              active={activeAction === "autoFill"}
              disabled={activeAction !== null || props.detectedFieldCount === 0}
              onClick={() => runAction("autoFill", props.onAutoFill)}
            />
          </section>

          {notice && (
            <div className={`status-card ${notice.kind}`} role="status">
              {notice.message}
            </div>
          )}

          <ChatPanel
            onStream={props.onChatStream}
            onUseInCoverLetter={props.onUseInCoverLetter}
          />

          <section className="answer-bank" aria-label="Answer bank search">
            <p className="section-title">Answer bank</p>
            <form className="search-row" onSubmit={handleSearch}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search saved answers"
                aria-label="Search saved answers"
              />
              <button type="submit" disabled={searching || !query.trim()}>
                {searching ? "..." : "Search"}
              </button>
            </form>
            {searchError && <p className="status-card error">{searchError}</p>}
            <div className="results">
              {answers.map((answer) => (
                <article className="result" key={answer.id}>
                  <p className="result-question">{answer.question}</p>
                  <p className="result-answer">{answer.answer}</p>
                  <p className="result-meta">
                    {Math.round(answer.similarity * 100)}% match / used{" "}
                    {answer.timesUsed} times
                  </p>
                  <div className="result-actions">
                    <button
                      className="small-button secondary"
                      type="button"
                      onClick={() => copyAnswer(answer)}
                    >
                      Copy
                    </button>
                    <button
                      className="small-button"
                      type="button"
                      onClick={() => void props.onApplyAnswer(answer)}
                    >
                      Apply
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

function ActionButton({
  label,
  activeLabel,
  active,
  disabled,
  primary,
  onClick,
}: {
  label: string;
  activeLabel: string;
  active: boolean;
  disabled: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`action-button${primary ? " primary" : ""}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      <span>{active ? activeLabel : label}</span>
      <span aria-hidden="true">-&gt;</span>
    </button>
  );
}
