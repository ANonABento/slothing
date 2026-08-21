/**
 * The tex-editor state machine — a PURE reducer. No I/O, no timers, no clock.
 * See docs/specs/latex-single-source-rebuild.md §7.2, and the PR 5 plan.
 *
 * Everything that matters about this editor is an invariant over state transitions:
 *   - the preview NEVER blanks (§5.5),
 *   - a stale compile response can never overwrite a newer one,
 *   - selection survives a recompile, because ids are stable and rects are not,
 *   - no failure path ever mutates the document source.
 *
 * Keeping those in a pure reducer means they are asserted synchronously in vitest with no
 * jsdom, no fake timers and no fetch — which is where most of this feature's risk lives.
 *
 * Every action carries `at: string` supplied by the caller so the reducer stays pure and
 * `nowIso()` stays confined to the hook (which also keeps forbidden-time-lint honest).
 */
import type { CompileLogEntry } from "@/lib/latex/compile";
import type { HitMap } from "@/lib/latex/hitmap";
import type { DocumentSettings } from "@/lib/latex/settings";
import type { InlineViolation } from "@/lib/latex/inline";
import type { TexDocumentKind } from "@/lib/db/tex-documents";

export type SelectionOrigin = "canvas" | "outline" | "diagnostic" | "restore";

export interface TexEditorDocumentSlice {
  id: string;
  title: string;
  kind: TexDocumentKind;
  /** The local .tex. Authoritative for the UI, mutated synchronously on every edit. */
  source: string;
  /** Monotonic; bumped on every local source mutation. Never resets. */
  revision: number;
  /** The revision the server has acknowledged. Dirty when it lags `revision`. */
  savedRevision: number;
  /** Server `updatedAt` at last ack. */
  savedUpdatedAt: string;
}

export type SaveState =
  | { status: "idle" }
  | { status: "dirty"; since: string }
  | { status: "saving"; revision: number; seq: number }
  | { status: "saved"; at: string }
  | { status: "error"; message: string; revision: number };

export type CompilePhase =
  | { status: "idle" }
  | { status: "compiling"; revision: number; seq: number; startedAt: string }
  | { status: "fetching"; revision: number; seq: number; key: string }
  | {
      status: "suspended";
      reason: "engine_unavailable" | "rate_limited";
      retryAt: string | null;
    };

/** A preview that has been compiled AND fully decoded. */
export interface RenderedPreview {
  key: string;
  revision: number;
  hitMap: HitMap;
  pageCount: number;
  renderedAt: string;
}

/** A preview that has compiled but whose bytes are still being fetched/decoded. */
export interface PendingPreview {
  key: string;
  revision: number;
  hitMap: HitMap;
}

export type PreviewProblem =
  | { kind: "compile_failed"; entries: CompileLogEntry[]; at: string }
  | { kind: "engine_unavailable"; message: string; at: string }
  | { kind: "rate_limited"; retryAt: string }
  | { kind: "network"; message: string; at: string }
  | { kind: "stale_key"; at: string };

export interface PreviewSlice {
  /** ON SCREEN. Replaced only by a fully decoded newer preview. Never nulled by a failure. */
  displayed: RenderedPreview | null;
  /** Compiled, bytes in flight. Discarded wholesale when superseded. */
  incoming: PendingPreview | null;
  phase: CompilePhase;
  /** Coexists with `displayed` — an error annotates the stale preview, it does not replace it. */
  problem: PreviewProblem | null;
  failureStreak: number;
}

export interface SelectionSlice {
  spanId: string | null;
  fieldIndex: number | null;
  /** A canvas selection must not scroll the canvas; an outline one must. */
  origin: SelectionOrigin | null;
}

export interface TexEditorState {
  document: TexEditorDocumentSlice;
  save: SaveState;
  preview: PreviewSlice;
  selection: SelectionSlice;
  compileSeq: number;
  acceptedCompileSeq: number;
  saveSeq: number;
  acceptedSaveSeq: number;
  settingsError: string | null;
  fieldViolations: Record<string, InlineViolation[]>;
  ui: { splitRatio: number; zoom: number };
}

export type TexEditorAction =
  | { type: "SET_SOURCE"; source: string; at: string }
  | { type: "SET_SETTINGS_ERROR"; message: string | null }
  | { type: "SET_FIELD_VIOLATIONS"; key: string; violations: InlineViolation[] }
  | {
      type: "SELECT";
      spanId: string | null;
      fieldIndex: number | null;
      origin: SelectionOrigin | null;
    }
  | { type: "COMPILE_STARTED"; revision: number; seq: number; at: string }
  | {
      type: "COMPILE_SUCCEEDED";
      seq: number;
      revision: number;
      key: string;
      hitMap: HitMap;
      at: string;
    }
  | { type: "COMPILE_FAILED"; seq: number; problem: PreviewProblem }
  | { type: "PREVIEW_RENDERED"; key: string; pageCount: number; at: string }
  | { type: "PREVIEW_RENDER_FAILED"; key: string; message: string; at: string }
  | { type: "SAVE_STARTED"; revision: number; seq: number }
  | {
      type: "SAVE_SUCCEEDED";
      seq: number;
      revision: number;
      updatedAt: string;
      at: string;
    }
  | { type: "SAVE_FAILED"; seq: number; revision: number; message: string }
  | { type: "MARK_DIRTY"; at: string }
  | { type: "RESUME_COMPILING" }
  | { type: "SET_SPLIT_RATIO"; ratio: number }
  | { type: "SET_ZOOM"; zoom: number };

export const DEFAULT_SPLIT_RATIO = 0.62;

export function initialTexEditorState(document: {
  id: string;
  title: string;
  kind: TexDocumentKind;
  source: string;
  updatedAt: string;
}): TexEditorState {
  return {
    document: {
      id: document.id,
      title: document.title,
      kind: document.kind,
      source: document.source,
      revision: 0,
      savedRevision: 0,
      savedUpdatedAt: document.updatedAt,
    },
    save: { status: "idle" },
    preview: {
      displayed: null,
      incoming: null,
      phase: { status: "idle" },
      problem: null,
      failureStreak: 0,
    },
    selection: { spanId: null, fieldIndex: null, origin: null },
    compileSeq: 0,
    acceptedCompileSeq: 0,
    saveSeq: 0,
    acceptedSaveSeq: 0,
    settingsError: null,
    fieldViolations: {},
    ui: { splitRatio: DEFAULT_SPLIT_RATIO, zoom: 1 },
  };
}

export function isDirty(state: TexEditorState): boolean {
  return state.document.revision !== state.document.savedRevision;
}

/** True when what is on screen no longer reflects the local source. */
export function previewIsStale(state: TexEditorState): boolean {
  const displayed = state.preview.displayed;
  return !displayed || displayed.revision !== state.document.revision;
}

export function isCompileSuspended(state: TexEditorState): boolean {
  return state.preview.phase.status === "suspended";
}

export function texEditorReducer(
  state: TexEditorState,
  action: TexEditorAction,
): TexEditorState {
  switch (action.type) {
    case "SET_SOURCE": {
      if (action.source === state.document.source) return state;
      return {
        ...state,
        document: {
          ...state.document,
          source: action.source,
          revision: state.document.revision + 1,
        },
        save:
          state.save.status === "saving"
            ? state.save
            : { status: "dirty", since: action.at },
        // Deliberately does NOT touch preview.displayed. The old render stays on screen
        // until a newer one has fully decoded.
      };
    }

    case "MARK_DIRTY":
      return isDirty(state) && state.save.status !== "saving"
        ? { ...state, save: { status: "dirty", since: action.at } }
        : state;

    case "SET_SETTINGS_ERROR":
      return state.settingsError === action.message
        ? state
        : { ...state, settingsError: action.message };

    case "SET_FIELD_VIOLATIONS": {
      const next = { ...state.fieldViolations };
      if (action.violations.length === 0) delete next[action.key];
      else next[action.key] = action.violations;
      return { ...state, fieldViolations: next };
    }

    case "SELECT":
      if (
        state.selection.spanId === action.spanId &&
        state.selection.fieldIndex === action.fieldIndex
      ) {
        return state;
      }
      return {
        ...state,
        selection: {
          spanId: action.spanId,
          fieldIndex: action.fieldIndex,
          origin: action.origin,
        },
      };

    case "COMPILE_STARTED":
      return {
        ...state,
        compileSeq: action.seq,
        preview: {
          ...state.preview,
          phase: {
            status: "compiling",
            revision: action.revision,
            seq: action.seq,
            startedAt: action.at,
          },
        },
      };

    case "COMPILE_SUCCEEDED": {
      // Stale or out-of-order: return the IDENTICAL object so React re-renders nothing.
      if (action.seq <= state.acceptedCompileSeq) return state;
      return {
        ...state,
        acceptedCompileSeq: action.seq,
        preview: {
          ...state.preview,
          incoming: {
            key: action.key,
            revision: action.revision,
            hitMap: action.hitMap,
          },
          phase: {
            status: "fetching",
            revision: action.revision,
            seq: action.seq,
            key: action.key,
          },
          // A successful compile clears a previous compile error, but the banner for it
          // only disappears once the new render lands — see PREVIEW_RENDERED.
          failureStreak: 0,
        },
      };
    }

    case "COMPILE_FAILED": {
      if (action.seq <= state.acceptedCompileSeq) return state;
      const suspended =
        action.problem.kind === "engine_unavailable" ||
        action.problem.kind === "rate_limited";
      return {
        ...state,
        acceptedCompileSeq: action.seq,
        preview: {
          ...state.preview,
          // `displayed` is untouched. This is the never-blank invariant.
          incoming: null,
          problem: action.problem,
          failureStreak: state.preview.failureStreak + 1,
          phase: suspended
            ? {
                status: "suspended",
                reason:
                  action.problem.kind === "engine_unavailable"
                    ? "engine_unavailable"
                    : "rate_limited",
                retryAt:
                  action.problem.kind === "rate_limited"
                    ? action.problem.retryAt
                    : null,
              }
            : { status: "idle" },
        },
      };
    }

    case "PREVIEW_RENDERED": {
      const incoming = state.preview.incoming;
      // A late decode of a superseded PDF. Drop it.
      if (!incoming || incoming.key !== action.key) return state;
      return {
        ...state,
        preview: {
          displayed: {
            key: incoming.key,
            revision: incoming.revision,
            hitMap: incoming.hitMap,
            pageCount: action.pageCount,
            renderedAt: action.at,
          },
          incoming: null,
          phase: { status: "idle" },
          problem: null,
          failureStreak: 0,
        },
      };
    }

    case "PREVIEW_RENDER_FAILED": {
      const incoming = state.preview.incoming;
      if (!incoming || incoming.key !== action.key) return state;
      return {
        ...state,
        preview: {
          ...state.preview,
          incoming: null,
          phase: { status: "idle" },
          problem: { kind: "network", message: action.message, at: action.at },
          failureStreak: state.preview.failureStreak + 1,
        },
      };
    }

    case "RESUME_COMPILING":
      return state.preview.phase.status === "suspended"
        ? {
            ...state,
            preview: {
              ...state.preview,
              phase: { status: "idle" },
              problem: null,
            },
          }
        : state;

    case "SAVE_STARTED":
      return {
        ...state,
        saveSeq: action.seq,
        save: { status: "saving", revision: action.revision, seq: action.seq },
      };

    case "SAVE_SUCCEEDED": {
      if (action.seq <= state.acceptedSaveSeq) return state;
      const stillDirty = state.document.revision !== action.revision;
      return {
        ...state,
        acceptedSaveSeq: action.seq,
        document: {
          ...state.document,
          savedRevision: action.revision,
          savedUpdatedAt: action.updatedAt,
        },
        save: stillDirty
          ? { status: "dirty", since: action.at }
          : { status: "saved", at: action.at },
      };
    }

    case "SAVE_FAILED":
      if (action.seq <= state.acceptedSaveSeq) return state;
      return {
        ...state,
        acceptedSaveSeq: action.seq,
        // The source is untouched; the draft mirror still holds the work.
        save: {
          status: "error",
          message: action.message,
          revision: action.revision,
        },
      };

    case "SET_SPLIT_RATIO":
      return { ...state, ui: { ...state.ui, splitRatio: action.ratio } };

    case "SET_ZOOM":
      return { ...state, ui: { ...state.ui, zoom: action.zoom } };

    default:
      return state;
  }
}
