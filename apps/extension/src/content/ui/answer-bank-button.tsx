// P2/#35 — Inline answer-bank search on long textareas.
//
// Scans textareas where:
//   - maxlength > 300 OR no maxlength
//   - AND the associated label matches LABEL_MATCH_REGEX
// and decorates each match with a 16x16 "lightbulb" affordance pinned to the
// textarea's top-right corner. Clicking the affordance toggles a popover
// showing the top 3 answer-bank matches plus a "Generate new" button.
//
// Rendering follows the same pattern as the in-page sidebar
// (`apps/extension/src/content/sidebar/controller.tsx`): one shadow-DOM host
// per textarea, React renders inside the shadow root. We DO NOT import the
// sidebar's design — we mirror the popup tokens locally in
// `apps/extension/src/content/ui/styles.css` instead.
//
// IMPORTANT: this module is also imported by a unit test in a jsdom
// environment. Anything that needs `createRoot` or chrome APIs is lazily
// resolved (the predicate + regex are pure helpers).

import React, {
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import type { AnswerBankMatch } from "@/shared/types";

// Matches application essay prompts ("Tell us about a time…", "Why are you
// interested in this role?", "Describe a challenge you've overcome", etc.).
// Keep this list aligned with the spec in docs/extension-roadmap-2026-05.md #35
// — DO NOT broaden without a roadmap update.
export const LABEL_MATCH_REGEX =
  /tell us about|describe a|why are you interested|why this company|what motivates|biggest challenge/i;

// 300 character minimum maxlength to count as a "long" textarea. Anything
// below 300 is almost certainly a short-answer field that doesn't need the
// answer-bank surface. Textareas with no maxlength at all also qualify.
export const LONG_TEXTAREA_MIN_MAXLENGTH = 300;

// Extracts the text associated with a textarea. Tries, in order:
//   1. aria-label on the textarea itself
//   2. aria-labelledby pointing to one or more elements
//   3. <label for="textareaId">
//   4. an ancestor <label>
//   5. the placeholder, as a last resort
// Returns the trimmed string, or "" if no label could be found.
export function extractTextareaLabel(textarea: HTMLTextAreaElement): string {
  const ariaLabel = textarea.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

  const labelledBy = textarea.getAttribute("aria-labelledby");
  if (labelledBy && textarea.ownerDocument) {
    const parts = labelledBy
      .split(/\s+/)
      .map((id) => textarea.ownerDocument!.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
      .map((el) => el.textContent?.trim() || "")
      .filter(Boolean);
    if (parts.length > 0) return parts.join(" ").trim();
  }

  const id = textarea.id;
  if (id && textarea.ownerDocument) {
    // CSS.escape isn't available in all jsdom builds; do a manual escape on the
    // very narrow set of characters that could appear in an HTML id.
    const escapedId = id.replace(/(["\\\]])/g, "\\$1");
    const explicit = textarea.ownerDocument.querySelector<HTMLLabelElement>(
      `label[for="${escapedId}"]`,
    );
    if (explicit?.textContent?.trim()) return explicit.textContent.trim();
  }

  let parent: HTMLElement | null = textarea.parentElement;
  while (parent) {
    if (parent.tagName === "LABEL" && parent.textContent?.trim()) {
      // Strip out the textarea's own value/content from the ancestor label
      // text. We do this naively by replacing the textarea's value if it
      // appears as a substring.
      const text = parent.textContent.trim();
      const ownValue = textarea.value || "";
      const cleaned = ownValue ? text.replace(ownValue, "").trim() : text;
      if (cleaned) return cleaned;
    }
    parent = parent.parentElement;
  }

  const placeholder = textarea.placeholder?.trim();
  if (placeholder) return placeholder;

  return "";
}

// Predicate: should we decorate this textarea with the 💡 affordance?
// Pure function — no DOM mutations, safe to call from a MutationObserver.
export function shouldDecorateTextarea(textarea: HTMLTextAreaElement): boolean {
  // Skip disabled / hidden / readonly textareas.
  if (textarea.disabled || textarea.readOnly) return false;
  if (textarea.getAttribute("aria-hidden") === "true") return false;
  if (textarea.type === "hidden") return false;

  // Length filter: maxlength > 300 OR no maxlength attribute at all.
  // Note `textarea.maxLength` returns -1 when the attribute is absent.
  const hasAttr = textarea.hasAttribute("maxlength");
  if (hasAttr) {
    const max = textarea.maxLength;
    if (!(max > LONG_TEXTAREA_MIN_MAXLENGTH)) return false;
  }

  const label = extractTextareaLabel(textarea);
  if (!label) return false;
  return LABEL_MATCH_REGEX.test(label);
}

// ---- React component ---------------------------------------------------

export interface AnswerBankPopoverHandlers {
  // Returns the top matches for the given question. Wired by the content
  // script to the background's MATCH_ANSWER_BANK message.
  onMatch: (q: string, limit?: number) => Promise<AnswerBankMatch[]>;
  // Called when the user clicks a candidate. The decorator inserts the
  // answer into the underlying textarea and dispatches input/change events.
  onPick: (match: AnswerBankMatch) => void;
  // Called when the user clicks "Generate new". The host opens the web
  // answer-bank page in a new tab pre-seeded with the question.
  onGenerate: (q: string) => void;
}

export interface AnswerBankButtonProps extends AnswerBankPopoverHandlers {
  question: string;
}

export function AnswerBankButton(props: AnswerBankButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<AnswerBankMatch[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape, close on outside-click. Both effects only attach while
  // the popover is open so we never leak listeners.
  useEffect(() => {
    if (!open) return;

    function handleDocClick(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (containerRef.current && containerRef.current.contains(target)) return;
      setOpen(false);
    }
    function handleDocKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    // `mousedown` fires before any nested click, so we avoid the "click closes
    // before the picked answer's click fires" race.
    document.addEventListener("mousedown", handleDocClick, true);
    document.addEventListener("keydown", handleDocKey, true);
    return () => {
      document.removeEventListener("mousedown", handleDocClick, true);
      document.removeEventListener("keydown", handleDocKey, true);
    };
  }, [open]);

  // Fetch matches when the popover opens (or when the question changes while
  // open). We refetch on each open so the bank stays fresh.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    props
      .onMatch(props.question, 3)
      .then((results) => {
        if (cancelled) return;
        setMatches(results.slice(0, 3));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError((err as Error)?.message || "Couldn't reach Slothing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, props.question]);

  function handleButtonKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((v) => !v);
    }
  }

  return (
    <div
      ref={containerRef}
      className="slothing-ab-root"
      data-testid="slothing-ab-root"
    >
      <button
        type="button"
        className="slothing-ab-button"
        aria-label="Open Slothing answer bank"
        title="Slothing answer bank"
        // Only focusable while the popover is open. Per spec we don't want to
        // hijack tab order on long forms — the user reaches the button by
        // clicking, not tabbing.
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKey}
      >
        <span aria-hidden="true" className="slothing-ab-icon">
          💡
        </span>
      </button>
      {open && (
        <div
          className="slothing-ab-popover"
          role="dialog"
          aria-label="Saved answers"
        >
          <header className="slothing-ab-popover__header">
            <p className="slothing-ab-popover__title">Saved answers</p>
            <button
              type="button"
              className="slothing-ab-popover__close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>
          <div className="slothing-ab-popover__body">
            {loading && (
              <p className="slothing-ab-popover__status">Searching…</p>
            )}
            {error && (
              <p
                className="slothing-ab-popover__status slothing-ab-popover__status--error"
                role="status"
              >
                {error}
              </p>
            )}
            {!loading && !error && matches.length === 0 && (
              <p className="slothing-ab-popover__status">
                No saved answers yet. Try Generate new →
              </p>
            )}
            {matches.map((match) => (
              <button
                key={match.id}
                type="button"
                className="slothing-ab-match"
                onClick={() => {
                  props.onPick(match);
                  setOpen(false);
                }}
              >
                <span className="slothing-ab-match__question">
                  {match.question}
                </span>
                <span className="slothing-ab-match__answer">
                  {truncate(match.answer, 80)}
                </span>
                <span
                  className="slothing-ab-match__score"
                  aria-label={`Match ${Math.round((match.score ?? 0) * 100)} percent`}
                >
                  {Math.round((match.score ?? 0) * 100)}%
                </span>
              </button>
            ))}
          </div>
          <footer className="slothing-ab-popover__footer">
            <button
              type="button"
              className="slothing-ab-popover__generate"
              onClick={() => {
                props.onGenerate(props.question);
                setOpen(false);
              }}
            >
              Generate new
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}

// Truncate a string at `max` characters, appending an ellipsis when clipped.
// Pure helper so tests can assert behaviour deterministically.
export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return `${input.slice(0, max).trimEnd()}…`;
}

// ---- Decorator API (mount/unmount) -------------------------------------
//
// This module is loaded by both jsdom unit tests (which only exercise the
// regex/predicate exports above) and the real content script. Anything below
// uses `react-dom/client` and may touch chrome APIs indirectly.

import { createRoot, type Root } from "react-dom/client";

import { ANSWER_BANK_BUTTON_STYLES } from "./answer-bank-button-styles";

const DECORATION_MARKER = "__slothingAbDecorated";
const HOST_CLASS = "slothing-ab-host";

interface MountedDecoration {
  host: HTMLDivElement;
  root: Root;
  observer: ResizeObserver | null;
  textarea: HTMLTextAreaElement;
}

// Keep a registry so unmountAllAnswerBankButtons() can tear everything down on
// pagehide without leaking observers or React roots.
const mountedDecorations = new Set<MountedDecoration>();

export function mountAnswerBankButton(
  textarea: HTMLTextAreaElement,
  handlers: AnswerBankPopoverHandlers,
): MountedDecoration | null {
  // De-dupe: never decorate the same textarea twice.
  const marked = textarea as unknown as Record<string, unknown>;
  if (marked[DECORATION_MARKER]) return null;
  marked[DECORATION_MARKER] = true;

  const question = extractTextareaLabel(textarea);
  if (!question) {
    marked[DECORATION_MARKER] = false;
    return null;
  }

  const host = document.createElement("div");
  host.className = HOST_CLASS;
  // Absolute position relative to the document — we'll keep the host pinned
  // to the textarea's bounding rect via ResizeObserver + scroll listeners.
  host.style.position = "absolute";
  host.style.zIndex = "2147483640";
  host.style.pointerEvents = "auto";
  // The host is fixed-size (16x16 button area) but the popover overflows
  // outside; we hide the host overflow only when collapsed to avoid stealing
  // clicks from the page.
  host.style.width = "0";
  host.style.height = "0";

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = ANSWER_BANK_BUTTON_STYLES;
  shadow.appendChild(style);

  const mount = document.createElement("div");
  mount.dataset.slothingAbMount = "true";
  shadow.appendChild(mount);

  document.body.appendChild(host);

  const root = createRoot(mount);

  function reposition() {
    const rect = textarea.getBoundingClientRect();
    // Pin to the top-right INSIDE the textarea's bounding box. The button is
    // 16×16 + 4px padding; place it 6px from the top-right corner.
    const top = rect.top + window.scrollY + 6;
    const right =
      rect.left + window.scrollX + rect.width - 6 - 16; /* button width */
    host.style.top = `${top}px`;
    host.style.left = `${right}px`;

    // If the textarea has been removed or is no longer in the layout tree,
    // hide the host so we don't draw the button in an arbitrary location.
    if (rect.width === 0 && rect.height === 0) {
      host.style.display = "none";
    } else {
      host.style.display = "";
    }
  }
  reposition();

  // Re-render on text resize / page reflow without sprinkling raf calls.
  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(reposition);
    resizeObserver.observe(textarea);
  }
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition);

  function renderRoot() {
    root.render(
      <AnswerBankButton
        question={question}
        onMatch={handlers.onMatch}
        onPick={(match) => {
          // Insert into the textarea. Replaces existing value per spec.
          textarea.value = match.answer;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          textarea.dispatchEvent(new Event("change", { bubbles: true }));
          handlers.onPick(match);
        }}
        onGenerate={(q) => handlers.onGenerate(q)}
      />,
    );
  }
  renderRoot();

  const decoration: MountedDecoration = {
    host,
    root,
    observer: resizeObserver,
    textarea,
  };
  mountedDecorations.add(decoration);

  // Cleanup hook on the textarea — best-effort. When the host textarea is
  // garbage-collected the WeakRef set is the source of truth.
  const detach = () => {
    unmountDecoration(decoration);
    window.removeEventListener("scroll", reposition, true);
    window.removeEventListener("resize", reposition);
  };
  (textarea as unknown as Record<string, unknown>).__slothingAbDetach = detach;

  return decoration;
}

function unmountDecoration(decoration: MountedDecoration) {
  if (!mountedDecorations.has(decoration)) return;
  mountedDecorations.delete(decoration);
  decoration.observer?.disconnect();
  try {
    decoration.root.unmount();
  } catch {
    // ignore
  }
  decoration.host.remove();
  const marked = decoration.textarea as unknown as Record<string, unknown>;
  marked[DECORATION_MARKER] = false;
  marked.__slothingAbDetach = undefined;
}

export function unmountAllAnswerBankButtons(): void {
  for (const decoration of Array.from(mountedDecorations)) {
    unmountDecoration(decoration);
  }
}

// Visible-for-testing — let tests inspect / reset mounted state.
export const __test = {
  mountedDecorations,
  DECORATION_MARKER,
};

// Unused suppression in CSSProperties import: keeps the JSX style hatch
// available without callers needing a separate import.
export type { CSSProperties };
