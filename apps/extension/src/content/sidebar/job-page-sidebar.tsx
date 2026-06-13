import React, {
  FormEvent,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  SidebarLayout,
  SidebarPosition,
  BestFitResume,
  ExtensionResumeSummary,
  SimilarAnswer,
  ScrapedJob,
} from "@/shared/types";
import type { ResumeScore } from "@slothing/shared/scoring";
import { ChatPanel, type ChatIntent } from "./chat-panel";
import {
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_HEIGHT,
  SIDEBAR_MAX_HEIGHT,
} from "./storage";

export type SidebarAction = "tailor" | "coverLetter" | "save" | "autoFill";

export interface JobPageSidebarProps {
  scrapedJob: ScrapedJob;
  detectedFieldCount: number;
  detectedUploadCount: number;
  latestResume: ExtensionResumeSummary | null;
  score: ResumeScore | null;
  /**
   * Experiment #1 — variant for the profile picker ("treatment" shows the
   * resume selector + best-fit badge). Undefined/"control" hides it.
   */
  profilePickerVariant?: string;
  /** Experiment #1 — resumes ranked best-fit-first against this job. */
  bestFitResumes?: BestFitResume[];
  layout: SidebarLayout;
  onLayoutChange: (updates: Partial<SidebarLayout>) => void;
  onDismiss: () => Promise<void> | void;
  /** `baseResumeId` (from the picker) seeds the tailor from that resume. */
  onTailor: (baseResumeId?: string) => Promise<void>;
  onCoverLetter: () => Promise<void>;
  onSave: () => Promise<void>;
  onAutoFill: (options?: { overwriteExisting?: boolean }) => Promise<unknown>;
  onOpenLatestResume: () => Promise<void>;
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
type ActionFeedback = { action: SidebarAction; label: string } | null;
type AutoFillActionResult = {
  filled?: number;
  skipped?: number;
  errors?: number;
  conflicts?: number;
  alreadyFilled?: number;
  fromAnswerBank?: number;
};
type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  width: number;
  height: number;
};
type ResizeState = {
  pointerId: number;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  dirX: number;
};

const ACTION_LABELS: Record<SidebarAction, string> = {
  tailor: "Tailor",
  coverLetter: "Cover Letter",
  save: "Save",
  autoFill: "Auto-fill",
};

export function JobPageSidebar(props: JobPageSidebarProps) {
  const [activeAction, setActiveAction] = useState<SidebarAction | null>(null);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [autoFillConflicts, setAutoFillConflicts] = useState(0);
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState<SimilarAnswer[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pickedResumeId, setPickedResumeId] = useState<string | null>(null);
  const [dockMenuOpen, setDockMenuOpen] = useState(false);
  const dragState = useRef<DragState | null>(null);
  const resizeState = useRef<ResizeState | null>(null);
  const dockWrapRef = useRef<HTMLDivElement | null>(null);

  // Close the dock-position menu on any pointer-down outside it. composedPath()
  // pierces the shadow root so the in-shadow dock-wrap is detected correctly.
  useEffect(() => {
    if (!dockMenuOpen) return;
    const onPointerDown = (event: Event) => {
      const path =
        (
          event as Event & { composedPath?: () => EventTarget[] }
        ).composedPath?.() ?? [];
      if (dockWrapRef.current && path.includes(dockWrapRef.current)) return;
      setDockMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [dockMenuOpen]);

  const bestFitResumes = props.bestFitResumes ?? [];
  const showResumePicker =
    props.profilePickerVariant === "treatment" && bestFitResumes.length > 0;
  // Default to the best-fit resume (first) until the user picks another.
  const selectedResumeId = pickedResumeId ?? bestFitResumes[0]?.id ?? null;

  const scoreValue = props.score?.overall ?? null;
  const jobMeta = useMemo(
    () =>
      [props.scrapedJob.company, props.scrapedJob.location]
        .filter(Boolean)
        .join(" / "),
    [props.scrapedJob.company, props.scrapedJob.location],
  );
  const sidebarClassName = `slothing-sidebar dock-${props.layout.dock}`;

  function sidebarStyle(): React.CSSProperties | undefined {
    if (props.layout.dock === "left") {
      return { left: 0, right: "auto" };
    }
    if (props.layout.dock === "floating" && props.layout.position) {
      return {
        left: `${props.layout.position.x}px`,
        right: "auto",
        top: `${props.layout.position.y}px`,
      };
    }
    return undefined;
  }

  // Applies the user's resized dimensions to the panel; undefined lets the CSS
  // defaults size it.
  function panelSizeStyle(): React.CSSProperties | undefined {
    const style: React.CSSProperties = {};
    if (props.layout.width) style.width = `${props.layout.width}px`;
    if (props.layout.height) style.height = `${props.layout.height}px`;
    return Object.keys(style).length > 0 ? style : undefined;
  }

  function startResize(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const panel = event.currentTarget.closest(".panel") as HTMLElement | null;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    resizeState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startW: rect.width,
      startH: rect.height,
      // Right-docked/floating panels grow leftward (negative X delta widens).
      dirX: props.layout.dock === "left" ? 1 : -1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.stopPropagation();
    event.preventDefault();
  }

  function moveResize(event: PointerEvent<HTMLElement>) {
    const state = resizeState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const maxW = Math.min(SIDEBAR_MAX_WIDTH, window.innerWidth - 24);
    const maxH = Math.min(SIDEBAR_MAX_HEIGHT, window.innerHeight - 24);
    const width = clampRange(
      state.startW + state.dirX * (event.clientX - state.startX),
      SIDEBAR_MIN_WIDTH,
      maxW,
    );
    const height = clampRange(
      state.startH + (event.clientY - state.startY),
      SIDEBAR_MIN_HEIGHT,
      maxH,
    );
    props.onLayoutChange({ width, height });
  }

  function endResize(event: PointerEvent<HTMLElement>) {
    const state = resizeState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    resizeState.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // The browser may release capture first if the pointer is canceled.
    }
  }

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, select, a")) return;

    const sidebar = event.currentTarget.closest(".slothing-sidebar");
    if (!sidebar) return;
    const rect = sidebar.getBoundingClientRect();
    const nextPosition = clampSidebarPosition(
      rect.left,
      rect.top,
      rect.width,
      rect.height,
    );
    props.onLayoutChange({ dock: "floating", position: nextPosition });
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: nextPosition.x,
      originY: nextPosition.y,
      width: rect.width,
      height: rect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const x = drag.originX + event.clientX - drag.startX;
    const y = drag.originY + event.clientY - drag.startY;
    props.onLayoutChange({
      dock: "floating",
      position: clampSidebarPosition(x, y, drag.width, drag.height),
    });
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragState.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // The browser may release capture first if the pointer is canceled.
    }
  }

  function floatAtCurrentPosition(event: React.MouseEvent<HTMLButtonElement>) {
    const sidebar = event.currentTarget.closest(".slothing-sidebar");
    if (!sidebar) return;
    const rect = sidebar.getBoundingClientRect();
    props.onLayoutChange({
      dock: "floating",
      position: clampSidebarPosition(
        rect.left,
        rect.top,
        rect.width,
        rect.height,
      ),
    });
  }

  async function runAction(
    action: SidebarAction,
    callback: () => Promise<unknown>,
  ) {
    setActiveAction(action);
    setActionFeedback(null);
    setNotice(null);

    try {
      const result = await callback();
      const fillResult = isAutoFillResult(result) ? result : null;
      if (action === "autoFill" && fillResult) {
        const conflicts = fillResult.conflicts ?? 0;
        setAutoFillConflicts(conflicts);
        const conflictCopy =
          conflicts > 0
            ? `. Skipped ${conflicts} field${conflicts === 1 ? "" : "s"} with existing values.`
            : "";
        const fromBank = fillResult.fromAnswerBank ?? 0;
        const bankCopy =
          fromBank > 0 ? ` (${fromBank} from your answer bank)` : "";
        setActionFeedback({
          action,
          label: `Filled ${fillResult.filled ?? 0}${bankCopy}${conflictCopy}`,
        });
        return;
      }
      setActionFeedback({
        action,
        label: action === "autoFill" ? "Fields updated" : "Done",
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

  if (props.layout.collapsed) {
    return (
      <aside
        className={sidebarClassName}
        style={sidebarStyle()}
        aria-label="Slothing job sidebar"
      >
        <button
          className="rail"
          type="button"
          onClick={() => props.onLayoutChange({ collapsed: false })}
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
    <aside
      className={sidebarClassName}
      style={sidebarStyle()}
      aria-label="Slothing job sidebar"
    >
      <div className="panel" style={panelSizeStyle()}>
        <header
          className="header"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          title="Drag to move"
        >
          <div className="header-main">
            <h2 className="title">{props.scrapedJob.title}</h2>
            <p className="company">{jobMeta || props.scrapedJob.company}</p>
          </div>
          <div className="icon-row">
            <div className="dock-wrap" ref={dockWrapRef}>
              <button
                className="icon-btn"
                type="button"
                aria-haspopup="menu"
                aria-expanded={dockMenuOpen}
                aria-label="Sidebar position"
                title="Position"
                onClick={() => setDockMenuOpen((open) => !open)}
              >
                &#8943;
              </button>
              {dockMenuOpen && (
                <div className="dock-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      props.onLayoutChange({ dock: "left" });
                      setDockMenuOpen(false);
                    }}
                  >
                    Dock left
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      props.onLayoutChange({ dock: "right" });
                      setDockMenuOpen(false);
                    }}
                  >
                    Dock right
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={(event) => {
                      floatAtCurrentPosition(event);
                      setDockMenuOpen(false);
                    }}
                  >
                    Float
                  </button>
                </div>
              )}
            </div>
            <button
              className="icon-btn"
              type="button"
              onClick={() => props.onLayoutChange({ collapsed: true })}
              aria-label="Collapse Slothing sidebar"
              title="Collapse"
            >
              &minus;
            </button>
            <button
              className="icon-btn"
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
            <div className="score-pill" aria-label="Match score value">
              <span>{scoreValue ?? "--"}</span>
              {scoreValue !== null && <small>/100</small>}
            </div>
          </section>

          {showResumePicker && (
            <section className="resume-picker" aria-label="Base resume">
              <label
                className="resume-picker-label"
                htmlFor="slothing-resume-picker"
              >
                Tailor from
              </label>
              <select
                id="slothing-resume-picker"
                className="resume-picker-select"
                value={selectedResumeId ?? ""}
                onChange={(event) => setPickedResumeId(event.target.value)}
                disabled={activeAction !== null}
              >
                {bestFitResumes.map((resume, index) => (
                  <option key={resume.id} value={resume.id}>
                    {index === 0 ? "★ " : ""}
                    {resume.name} — {resume.score}% fit
                  </option>
                ))}
              </select>
              {selectedResumeId === bestFitResumes[0]?.id && (
                <p className="resume-picker-note">
                  Best fit for this job ({bestFitResumes[0]?.score}% match).
                </p>
              )}
            </section>
          )}

          <section className="actions" aria-label="Job actions">
            <ActionButton
              label="Tailor resume"
              activeLabel="Tailoring..."
              active={activeAction === "tailor"}
              feedback={
                actionFeedback?.action === "tailor"
                  ? actionFeedback.label
                  : undefined
              }
              disabled={activeAction !== null}
              primary
              onClick={() =>
                runAction("tailor", () =>
                  props.onTailor(selectedResumeId ?? undefined),
                )
              }
            />
            <ActionButton
              label="Cover letter"
              activeLabel="Generating..."
              active={activeAction === "coverLetter"}
              feedback={
                actionFeedback?.action === "coverLetter"
                  ? actionFeedback.label
                  : undefined
              }
              disabled={activeAction !== null}
              onClick={() => runAction("coverLetter", props.onCoverLetter)}
            />
            <ActionButton
              label="Save job"
              activeLabel="Saving..."
              active={activeAction === "save"}
              feedback={actionFeedback?.action === "save" ? "Saved" : undefined}
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
              feedback={
                actionFeedback?.action === "autoFill"
                  ? actionFeedback.label
                  : undefined
              }
              disabled={activeAction !== null || props.detectedFieldCount === 0}
              onClick={() =>
                runAction("autoFill", () =>
                  props.onAutoFill({ overwriteExisting: false }),
                )
              }
            />
            {autoFillConflicts > 0 && (
              <ActionButton
                label={`Overwrite ${autoFillConflicts} skipped field${autoFillConflicts === 1 ? "" : "s"}`}
                activeLabel="Overwriting..."
                active={activeAction === "autoFill"}
                disabled={activeAction !== null}
                onClick={() =>
                  runAction("autoFill", () =>
                    props.onAutoFill({ overwriteExisting: true }),
                  )
                }
              />
            )}
          </section>

          {props.detectedUploadCount > 0 && (
            <section
              className="status-card"
              aria-label="Document upload handoff"
            >
              <strong>Resume upload detected</strong>
              <span>
                Slothing cannot attach files for you. Download your latest
                document, then upload it manually on this application.
              </span>
              {props.latestResume && (
                <span className="muted">{props.latestResume.name}</span>
              )}
              <button
                className="small-button"
                type="button"
                onClick={() => void props.onOpenLatestResume()}
              >
                {props.latestResume ? "Open latest resume" : "Open Studio"}
              </button>
            </section>
          )}

          {notice?.kind === "error" && (
            <div className={`status-card ${notice.kind}`} role="status">
              {notice.message}
            </div>
          )}

          <details className="utility-section">
            <summary>AI assistant</summary>
            <ChatPanel
              onStream={props.onChatStream}
              onUseInCoverLetter={props.onUseInCoverLetter}
            />
          </details>

          <details className="utility-section">
            <summary>Answer bank</summary>
            <section className="answer-bank" aria-label="Answer bank search">
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
              {searchError && (
                <p className="status-card error">{searchError}</p>
              )}
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
          </details>
        </div>
        <div
          className="resize-handle"
          role="separator"
          aria-label="Resize Slothing sidebar"
          title="Drag to resize"
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
        />
      </div>
    </aside>
  );
}

function isAutoFillResult(value: unknown): value is AutoFillActionResult {
  return Boolean(
    value &&
    typeof value === "object" &&
    ("filled" in value || "conflicts" in value || "skipped" in value),
  );
}

function clampRange(value: number, min: number, max: number): number {
  return Math.min(Math.max(Math.round(value), min), Math.max(min, max));
}

function clampSidebarPosition(
  x: number,
  y: number,
  width: number,
  height: number,
): SidebarPosition {
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  return {
    x: Math.min(Math.max(x, margin), maxX),
    y: Math.min(Math.max(y, margin), maxY),
  };
}

function ActionButton({
  label,
  activeLabel,
  active,
  feedback,
  disabled,
  primary,
  onClick,
}: {
  label: string;
  activeLabel: string;
  active: boolean;
  feedback?: string;
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
      <span>{active ? activeLabel : feedback || label}</span>
      {(active || feedback) && (
        <span className="action-status" aria-hidden="true">
          {feedback ? "Done" : "Working"}
        </span>
      )}
    </button>
  );
}
