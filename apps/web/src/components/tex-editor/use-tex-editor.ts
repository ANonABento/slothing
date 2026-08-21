"use client";

/**
 * The tex editor's orchestration: debounce, single-flight, aborts, save cadence, and the
 * localStorage draft mirror. All state transitions live in the pure reducer next door; this
 * hook only decides WHEN to dispatch and performs I/O.
 *
 * Two loops run over one source and never block each other:
 *   - PREVIEW, fast and local-driven: 600ms debounce (or immediate for discrete controls)
 *     -> compile the LOCAL source -> fetch bytes by cache key -> decode -> swap.
 *   - SAVE, coarse and server-driven: commit boundaries only. `updateTexDocumentSource`
 *     writes a version row per distinct source, so saving per keystroke would spam history.
 *
 * `nowIso()` is called only here, so the reducer stays pure and fixed-clock testable.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { nowIso } from "@/lib/format/time";
import {
  buildDocumentModel,
  fieldsFor,
  type DocumentModel,
} from "@/lib/latex/document-model";
import { writeField, type FieldWrite } from "@/lib/latex/field-edit";
import { writeSettings, type DocumentSettings } from "@/lib/latex/settings";
import type { TexDocumentKind } from "@/lib/db/tex-documents";

import {
  compileDocument,
  fetchPdfByKey,
  rateLimitDelayMs,
  requestAiRevision,
  saveDocument,
  type AiProposalOutcome,
  type TexEditorTransport,
} from "./tex-editor-api";
import {
  initialTexEditorState,
  texEditorReducer,
  type SelectionOrigin,
  type TexEditorState,
} from "./tex-editor-state";

export const COMPILE_DEBOUNCE_MS = 600;
export const IDLE_SAVE_MS = 5000;
export const DRAFT_THROTTLE_MS = 1000;

export function draftStorageKey(documentId: string): string {
  return `taida:tex:draft:${documentId}`;
}

export interface TexEditorRuntime {
  transport?: TexEditorTransport;
  now?: () => string;
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
}

export interface TexEditorInitialDocument {
  id: string;
  title: string;
  kind: TexDocumentKind;
  source: string;
  updatedAt: string;
}

export interface UseTexEditorResult {
  state: TexEditorState;
  model: DocumentModel;
  /** Edit one field of one span. Rejections are surfaced, never silently swallowed. */
  editField: (spanId: string, fieldIndex: number, write: FieldWrite) => boolean;
  editSettings: (settings: DocumentSettings) => void;
  select: (
    spanId: string | null,
    fieldIndex: number | null,
    origin: SelectionOrigin | null,
  ) => void;
  /** Commit boundary — blur, Cmd+S, structural edit. Flushes both loops. */
  commit: (label?: string) => Promise<void>;
  /** Compile immediately, bypassing the debounce. Used for the first render. */
  compileNow: () => void;
  /** Ask for a grounded revision. Returns a proposal; writes nothing. */
  requestAi: (
    spanId: string,
    fieldIndex: number,
    action: string,
  ) => Promise<AiProposalOutcome>;
  retryCompile: () => void;
  setSplitRatio: (ratio: number) => void;
  setZoom: (zoom: number) => void;
  /** Called by the canvas once bytes have fully decoded. */
  notifyRendered: (key: string, pageCount: number) => void;
  notifyRenderFailed: (key: string, message: string) => void;
  /** Bytes for the currently incoming preview, or null. */
  pendingBytes: { key: string; bytes: Uint8Array } | null;
}

export function useTexEditor(
  document: TexEditorInitialDocument,
  runtime: TexEditorRuntime = {},
): UseTexEditorResult {
  /**
   * The runtime is read through a ref, never through the closure.
   *
   * Callers naturally pass an inline object (`{transport: {fetch}}`), which is a new
   * identity every render. If callbacks closed over it, every effect depending on them
   * would re-run each render — and the unmount-flush effect below would then fire a save
   * on every render, an infinite loop. A ref makes the callbacks genuinely stable.
   */
  const runtimeRef = useRef(runtime);
  runtimeRef.current = runtime;
  const now = useCallback(() => (runtimeRef.current.now ?? nowIso)(), []);

  const [state, dispatch] = useReducer(
    texEditorReducer,
    document,
    initialTexEditorState,
  );

  const stateRef = useRef(state);
  stateRef.current = state;

  const compileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lifecycle = useRef<AbortController | null>(null);
  const pdfAbort = useRef<AbortController | null>(null);
  /** Single-flight: one compile at a time, with a coalescing slot for the newest source. */
  const compileInFlight = useRef(false);
  const compilePending = useRef(false);
  const seq = useRef({ compile: 0, save: 0 });
  /**
   * STATE, not a ref: the canvas receives these bytes as a prop, and a ref mutation does
   * not re-render, so the preview would stay blank forever.
   */
  const [pendingBytes, setPendingBytes] = useState<{
    key: string;
    bytes: Uint8Array;
  } | null>(null);

  const model = useMemo(
    () => buildDocumentModel(state.document.source),
    [state.document.source],
  );

  useEffect(() => {
    const controller = new AbortController();
    lifecycle.current = controller;
    return () => {
      controller.abort();
      pdfAbort.current?.abort();
      for (const timer of [compileTimer, idleSaveTimer, draftTimer]) {
        if (timer.current) clearTimeout(timer.current);
      }
    };
  }, [document.id]);

  const writeDraft = useCallback(
    (source: string, revision: number) => {
      const storage = runtimeRef.current.storage ?? safeStorage();
      if (!storage) return;
      try {
        storage.setItem(
          draftStorageKey(document.id),
          JSON.stringify({
            source,
            revision,
            baseUpdatedAt: stateRef.current.document.savedUpdatedAt,
          }),
        );
      } catch {
        // Quota or privacy mode. The editor still works; only the safety net is missing.
      }
    },
    [document.id],
  );

  const clearDraft = useCallback(() => {
    const storage = runtimeRef.current.storage ?? safeStorage();
    try {
      storage?.removeItem(draftStorageKey(document.id));
    } catch {
      // ignore
    }
  }, [document.id]);

  const runCompile = useCallback(async () => {
    if (compileInFlight.current) {
      compilePending.current = true;
      return;
    }
    const current = stateRef.current;
    if (current.preview.phase.status === "suspended") return;

    compileInFlight.current = true;
    const mySeq = ++seq.current.compile;
    const revision = current.document.revision;
    const source = current.document.source;

    dispatch({ type: "COMPILE_STARTED", revision, seq: mySeq, at: now() });

    // Deliberately NOT aborted when superseded: the server work is already paid for and its
    // cache entry is a real asset. Aborting the fetch would not stop Tectonic anyway.
    const outcome = await compileDocument(document.id, source, "preview", {
      transport: runtimeRef.current.transport,
    });

    compileInFlight.current = false;

    if (outcome.ok) {
      dispatch({
        type: "COMPILE_SUCCEEDED",
        seq: mySeq,
        revision,
        key: outcome.key,
        hitMap: outcome.hitMap ?? { rects: [], ids: [] },
        at: now(),
      });

      pdfAbort.current?.abort();
      const controller = new AbortController();
      pdfAbort.current = controller;

      const bytes = await fetchPdfByKey(document.id, outcome.key, {
        transport: runtimeRef.current.transport,
        signal: controller.signal,
      });

      if (bytes.ok) {
        setPendingBytes({ key: outcome.key, bytes: bytes.bytes });
      } else if (bytes.kind === "stale_key") {
        // The entry was evicted. Recompiling regenerates it.
        compilePending.current = true;
      } else {
        dispatch({
          type: "PREVIEW_RENDER_FAILED",
          key: outcome.key,
          message: bytes.message,
          at: now(),
        });
      }
    } else if (outcome.kind === "rate_limited") {
      dispatch({
        type: "COMPILE_FAILED",
        seq: mySeq,
        problem: { kind: "rate_limited", retryAt: now() },
      });
      const delay = rateLimitDelayMs(
        stateRef.current.preview.failureStreak + 1,
      );
      compileTimer.current = setTimeout(() => {
        dispatch({ type: "RESUME_COMPILING" });
        void runCompile();
      }, delay);
      return;
    } else if (outcome.kind === "engine_unavailable") {
      dispatch({
        type: "COMPILE_FAILED",
        seq: mySeq,
        problem: {
          kind: "engine_unavailable",
          message: outcome.message,
          at: now(),
        },
      });
      // Suspended until an explicit retry. Do not hammer a machine with no engine.
      return;
    } else if (outcome.kind === "compile_failed") {
      dispatch({
        type: "COMPILE_FAILED",
        seq: mySeq,
        problem: {
          kind: "compile_failed",
          entries: outcome.log?.entries ?? [],
          at: now(),
        },
      });
    } else {
      dispatch({
        type: "COMPILE_FAILED",
        seq: mySeq,
        problem: { kind: "network", message: outcome.message, at: now() },
      });
    }

    if (compilePending.current) {
      compilePending.current = false;
      // The user already waited through a full compile — no debounce this time.
      void runCompile();
    }
  }, [document.id, now]);

  const scheduleCompile = useCallback(
    (immediate = false) => {
      if (compileTimer.current) clearTimeout(compileTimer.current);
      if (immediate) {
        void runCompile();
        return;
      }
      compileTimer.current = setTimeout(() => {
        void runCompile();
      }, COMPILE_DEBOUNCE_MS);
    },
    [runCompile],
  );

  const runSave = useCallback(
    async (label?: string, keepalive?: boolean) => {
      const current = stateRef.current;
      if (current.document.revision === current.document.savedRevision) return;

      const mySeq = ++seq.current.save;
      const revision = current.document.revision;
      dispatch({ type: "SAVE_STARTED", revision, seq: mySeq });

      const outcome = await saveDocument(document.id, current.document.source, {
        label,
        keepalive,
        transport: runtimeRef.current.transport,
      });

      if (outcome.ok) {
        dispatch({
          type: "SAVE_SUCCEEDED",
          seq: mySeq,
          revision,
          updatedAt: outcome.updatedAt,
          at: now(),
        });
        clearDraft();
      } else {
        dispatch({
          type: "SAVE_FAILED",
          seq: mySeq,
          revision,
          message: outcome.message,
        });
      }
    },
    [clearDraft, document.id, now],
  );

  const afterSourceChange = useCallback(
    (source: string, options: { immediate?: boolean } = {}) => {
      dispatch({ type: "SET_SOURCE", source, at: now() });
      scheduleCompile(options.immediate);

      if (draftTimer.current) clearTimeout(draftTimer.current);
      draftTimer.current = setTimeout(() => {
        writeDraft(source, stateRef.current.document.revision);
      }, DRAFT_THROTTLE_MS);

      // Safety net for the user who types and walks away.
      if (idleSaveTimer.current) clearTimeout(idleSaveTimer.current);
      idleSaveTimer.current = setTimeout(() => {
        void runSave();
      }, IDLE_SAVE_MS);
    },
    [now, runSave, scheduleCompile, writeDraft],
  );

  const editField = useCallback(
    (spanId: string, fieldIndex: number, write: FieldWrite): boolean => {
      const current = stateRef.current;
      const fields = fieldsFor(
        buildDocumentModel(current.document.source),
        spanId,
      );
      const field = fields.find((f) => f.index === fieldIndex);
      if (!field) return false;

      const result = writeField(
        current.document.source,
        spanId,
        fieldIndex,
        field.raw,
        write,
      );

      const violationKey = `${spanId}:${fieldIndex}`;
      if (!result.ok) {
        dispatch({
          type: "SET_FIELD_VIOLATIONS",
          key: violationKey,
          violations:
            result.reason === "invalid_latex" ? result.violations : [],
        });
        return false;
      }

      dispatch({
        type: "SET_FIELD_VIOLATIONS",
        key: violationKey,
        violations: [],
      });
      afterSourceChange(result.source);
      return true;
    },
    [afterSourceChange],
  );

  const editSettings = useCallback(
    (settings: DocumentSettings) => {
      const current = stateRef.current;
      try {
        const next = writeSettings(current.document.source, settings);
        dispatch({ type: "SET_SETTINGS_ERROR", message: null });
        // Settings come from discrete controls; waiting 600ms after a click feels broken.
        afterSourceChange(next, { immediate: true });
      } catch (error) {
        dispatch({
          type: "SET_SETTINGS_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Could not apply settings.",
        });
      }
    },
    [afterSourceChange],
  );

  const select = useCallback(
    (
      spanId: string | null,
      fieldIndex: number | null,
      origin: SelectionOrigin | null,
    ) => {
      dispatch({ type: "SELECT", spanId, fieldIndex, origin });
    },
    [],
  );

  const commit = useCallback(
    async (label?: string) => {
      if (compileTimer.current) {
        clearTimeout(compileTimer.current);
        compileTimer.current = null;
        void runCompile();
      }
      if (idleSaveTimer.current) {
        clearTimeout(idleSaveTimer.current);
        idleSaveTimer.current = null;
      }
      await runSave(label);
    },
    [runCompile, runSave],
  );

  const requestAi = useCallback(
    (spanId: string, fieldIndex: number, action: string) =>
      // Always sends the LOCAL source, so the AI revises what the user can actually see.
      requestAiRevision(
        document.id,
        {
          spanId,
          fieldIndex,
          action,
          source: stateRef.current.document.source,
        },
        { transport: runtimeRef.current.transport },
      ),
    [document.id],
  );

  const compileNow = useCallback(() => {
    if (compileTimer.current) {
      clearTimeout(compileTimer.current);
      compileTimer.current = null;
    }
    void runCompile();
  }, [runCompile]);

  const retryCompile = useCallback(() => {
    dispatch({ type: "RESUME_COMPILING" });
    void runCompile();
  }, [runCompile]);

  /**
   * Flush on tab hide and on unmount so work is never stranded mid-edit.
   *
   * Deliberately keyed on the document id and reading `runSave` through a ref: depending
   * on the callback's identity would re-run this effect on every render, and its cleanup
   * would fire a save each time.
   */
  const runSaveRef = useRef(runSave);
  runSaveRef.current = runSave;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHide = () => {
      if (window.document.visibilityState === "hidden") {
        void runSaveRef.current(undefined, true);
      }
    };
    window.document.addEventListener("visibilitychange", onHide);
    return () => {
      window.document.removeEventListener("visibilitychange", onHide);
      void runSaveRef.current(undefined, true);
    };
  }, [document.id]);

  const notifyRendered = useCallback(
    (key: string, pageCount: number) => {
      dispatch({ type: "PREVIEW_RENDERED", key, pageCount, at: now() });
    },
    [now],
  );

  const notifyRenderFailed = useCallback(
    (key: string, message: string) => {
      dispatch({ type: "PREVIEW_RENDER_FAILED", key, message, at: now() });
    },
    [now],
  );

  return {
    state,
    model,
    editField,
    editSettings,
    select,
    commit,
    compileNow,
    requestAi,
    retryCompile,
    setSplitRatio: useCallback(
      (ratio: number) => dispatch({ type: "SET_SPLIT_RATIO", ratio }),
      [],
    ),
    setZoom: useCallback(
      (zoom: number) => dispatch({ type: "SET_ZOOM", zoom }),
      [],
    ),
    notifyRendered,
    notifyRenderFailed,
    pendingBytes,
  };
}

function safeStorage(): Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
> | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
