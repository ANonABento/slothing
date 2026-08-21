import { describe, expect, it } from "vitest";

import type { HitMap } from "@/lib/latex/hitmap";
import {
  initialTexEditorState,
  isDirty,
  previewIsStale,
  texEditorReducer,
  type TexEditorAction,
  type TexEditorState,
} from "./tex-editor-state";

const AT = "2026-08-21T00:00:00.000Z";
const MAP: HitMap = { rects: [], ids: ["itm-000001"] };

function start(): TexEditorState {
  return initialTexEditorState({
    id: "doc-1",
    title: "Resume",
    kind: "resume",
    source: "\\begin{document}a\\end{document}",
    updatedAt: AT,
  });
}

function run(
  state: TexEditorState,
  ...actions: TexEditorAction[]
): TexEditorState {
  return actions.reduce(texEditorReducer, state);
}

/** Compile, fetch, and decode one preview end to end. */
function renderPreview(
  state: TexEditorState,
  { seq, revision, key }: { seq: number; revision: number; key: string },
): TexEditorState {
  return run(
    state,
    { type: "COMPILE_STARTED", revision, seq, at: AT },
    { type: "COMPILE_SUCCEEDED", seq, revision, key, hitMap: MAP, at: AT },
    { type: "PREVIEW_RENDERED", key, pageCount: 1, at: AT },
  );
}

describe("editing", () => {
  it("bumps the revision and marks dirty", () => {
    const next = run(start(), {
      type: "SET_SOURCE",
      source: "changed",
      at: AT,
    });
    expect(next.document.revision).toBe(1);
    expect(next.save).toEqual({ status: "dirty", since: AT });
    expect(isDirty(next)).toBe(true);
  });

  it("ignores a write that does not change the source", () => {
    const state = start();
    expect(
      texEditorReducer(state, {
        type: "SET_SOURCE",
        source: state.document.source,
        at: AT,
      }),
    ).toBe(state);
  });

  it("does NOT disturb the on-screen preview", () => {
    const rendered = renderPreview(start(), { seq: 1, revision: 0, key: "k1" });
    const edited = run(rendered, {
      type: "SET_SOURCE",
      source: "changed",
      at: AT,
    });

    expect(edited.preview.displayed).toBe(rendered.preview.displayed);
    expect(previewIsStale(edited)).toBe(true);
  });
});

describe("never blank", () => {
  it("keeps the displayed preview when a compile fails", () => {
    const rendered = renderPreview(start(), { seq: 1, revision: 0, key: "k1" });
    const failed = run(
      rendered,
      { type: "SET_SOURCE", source: "broken", at: AT },
      { type: "COMPILE_STARTED", revision: 1, seq: 2, at: AT },
      {
        type: "COMPILE_FAILED",
        seq: 2,
        problem: { kind: "compile_failed", entries: [], at: AT },
      },
    );

    expect(failed.preview.displayed).toBe(rendered.preview.displayed);
    expect(failed.preview.problem).toMatchObject({ kind: "compile_failed" });
  });

  it("keeps the displayed preview when the bytes fail to decode", () => {
    const rendered = renderPreview(start(), { seq: 1, revision: 0, key: "k1" });
    const failed = run(
      rendered,
      { type: "COMPILE_STARTED", revision: 1, seq: 2, at: AT },
      {
        type: "COMPILE_SUCCEEDED",
        seq: 2,
        revision: 1,
        key: "k2",
        hitMap: MAP,
        at: AT,
      },
      { type: "PREVIEW_RENDER_FAILED", key: "k2", message: "boom", at: AT },
    );

    expect(failed.preview.displayed).toBe(rendered.preview.displayed);
    expect(failed.preview.incoming).toBeNull();
  });

  it("keeps the displayed preview when the engine disappears", () => {
    const rendered = renderPreview(start(), { seq: 1, revision: 0, key: "k1" });
    const failed = run(rendered, {
      type: "COMPILE_FAILED",
      seq: 2,
      problem: { kind: "engine_unavailable", message: "no tectonic", at: AT },
    });

    expect(failed.preview.displayed).toBe(rendered.preview.displayed);
    expect(failed.preview.phase).toMatchObject({
      status: "suspended",
      reason: "engine_unavailable",
    });
  });

  it("never mutates the document source on any failure path", () => {
    const state = renderPreview(start(), { seq: 1, revision: 0, key: "k1" });
    const source = state.document.source;

    for (const action of [
      {
        type: "COMPILE_FAILED",
        seq: 2,
        problem: { kind: "compile_failed", entries: [], at: AT },
      },
      {
        type: "COMPILE_FAILED",
        seq: 3,
        problem: { kind: "network", message: "offline", at: AT },
      },
      { type: "SAVE_FAILED", seq: 1, revision: 0, message: "db down" },
      { type: "PREVIEW_RENDER_FAILED", key: "k1", message: "bad pdf", at: AT },
    ] as TexEditorAction[]) {
      expect(texEditorReducer(state, action).document.source).toBe(source);
    }
  });
});

describe("stale responses", () => {
  it("drops an out-of-order compile success and re-renders nothing", () => {
    const state = renderPreview(start(), { seq: 5, revision: 1, key: "k5" });
    const stale = texEditorReducer(state, {
      type: "COMPILE_SUCCEEDED",
      seq: 3,
      revision: 0,
      key: "k3",
      hitMap: MAP,
      at: AT,
    });
    // Object identity: a stale response must cost zero renders.
    expect(stale).toBe(state);
  });

  it("drops an out-of-order compile failure", () => {
    const state = renderPreview(start(), { seq: 5, revision: 1, key: "k5" });
    expect(
      texEditorReducer(state, {
        type: "COMPILE_FAILED",
        seq: 2,
        problem: { kind: "network", message: "late", at: AT },
      }),
    ).toBe(state);
  });

  it("drops a late decode whose key is no longer incoming", () => {
    const state = run(
      start(),
      { type: "COMPILE_STARTED", revision: 0, seq: 1, at: AT },
      {
        type: "COMPILE_SUCCEEDED",
        seq: 1,
        revision: 0,
        key: "k1",
        hitMap: MAP,
        at: AT,
      },
      { type: "COMPILE_STARTED", revision: 1, seq: 2, at: AT },
      {
        type: "COMPILE_SUCCEEDED",
        seq: 2,
        revision: 1,
        key: "k2",
        hitMap: MAP,
        at: AT,
      },
    );
    // k1's decode finally lands, but k2 is what we are waiting for.
    expect(
      texEditorReducer(state, {
        type: "PREVIEW_RENDERED",
        key: "k1",
        pageCount: 1,
        at: AT,
      }),
    ).toBe(state);
  });

  it("keeps save and compile sequencing independent", () => {
    const state = run(
      start(),
      { type: "COMPILE_STARTED", revision: 0, seq: 4, at: AT },
      {
        type: "COMPILE_SUCCEEDED",
        seq: 4,
        revision: 0,
        key: "k4",
        hitMap: MAP,
        at: AT,
      },
      { type: "SAVE_STARTED", revision: 0, seq: 1 },
      { type: "SAVE_SUCCEEDED", seq: 1, revision: 0, updatedAt: AT, at: AT },
    );
    expect(state.acceptedCompileSeq).toBe(4);
    expect(state.acceptedSaveSeq).toBe(1);
    expect(state.save.status).toBe("saved");
  });
});

describe("selection", () => {
  it("survives a recompile even when the new hit map omits the id", () => {
    const state = run(
      renderPreview(start(), { seq: 1, revision: 0, key: "k1" }),
      {
        type: "SELECT",
        spanId: "itm-000001",
        fieldIndex: 0,
        origin: "canvas",
      },
    );

    const recompiled = renderPreview(state, { seq: 2, revision: 0, key: "k2" });
    expect(recompiled.selection.spanId).toBe("itm-000001");
    expect(recompiled.selection.fieldIndex).toBe(0);
  });

  it("is untouched by every compile, save, and preview action", () => {
    const selected = run(start(), {
      type: "SELECT",
      spanId: "itm-000001",
      fieldIndex: 0,
      origin: "outline",
    });

    for (const action of [
      { type: "COMPILE_STARTED", revision: 1, seq: 9, at: AT },
      {
        type: "COMPILE_FAILED",
        seq: 9,
        problem: { kind: "network", message: "x", at: AT },
      },
      { type: "SAVE_STARTED", revision: 1, seq: 9 },
      { type: "SET_SOURCE", source: "totally different", at: AT },
    ] as TexEditorAction[]) {
      expect(texEditorReducer(selected, action).selection.spanId).toBe(
        "itm-000001",
      );
    }
  });

  it("no-ops when re-selecting the same field", () => {
    const selected = run(start(), {
      type: "SELECT",
      spanId: "itm-000001",
      fieldIndex: 0,
      origin: "canvas",
    });
    expect(
      texEditorReducer(selected, {
        type: "SELECT",
        spanId: "itm-000001",
        fieldIndex: 0,
        origin: "outline",
      }),
    ).toBe(selected);
  });
});

describe("suspension", () => {
  it("suspends on rate limiting with a retry time", () => {
    const state = texEditorReducer(start(), {
      type: "COMPILE_FAILED",
      seq: 1,
      problem: { kind: "rate_limited", retryAt: "2026-08-21T00:00:04.000Z" },
    });
    expect(state.preview.phase).toEqual({
      status: "suspended",
      reason: "rate_limited",
      retryAt: "2026-08-21T00:00:04.000Z",
    });
  });

  it("stays suspended across further edits — the loop does not restart itself", () => {
    const suspended = texEditorReducer(start(), {
      type: "COMPILE_FAILED",
      seq: 1,
      problem: { kind: "engine_unavailable", message: "none", at: AT },
    });
    const edited = texEditorReducer(suspended, {
      type: "SET_SOURCE",
      source: "changed",
      at: AT,
    });
    expect(edited.preview.phase.status).toBe("suspended");
  });

  it("resumes only on an explicit action", () => {
    const suspended = texEditorReducer(start(), {
      type: "COMPILE_FAILED",
      seq: 1,
      problem: { kind: "rate_limited", retryAt: AT },
    });
    const resumed = texEditorReducer(suspended, { type: "RESUME_COMPILING" });
    expect(resumed.preview.phase.status).toBe("idle");
    expect(resumed.preview.problem).toBeNull();
  });

  it("counts consecutive failures for backoff", () => {
    let state = start();
    for (const seq of [1, 2, 3]) {
      state = texEditorReducer(state, {
        type: "COMPILE_FAILED",
        seq,
        problem: { kind: "network", message: "x", at: AT },
      });
    }
    expect(state.preview.failureStreak).toBe(3);
  });
});

describe("saving", () => {
  it("clears dirty when the saved revision catches up", () => {
    const state = run(
      start(),
      { type: "SET_SOURCE", source: "v1", at: AT },
      { type: "SAVE_STARTED", revision: 1, seq: 1 },
      { type: "SAVE_SUCCEEDED", seq: 1, revision: 1, updatedAt: AT, at: AT },
    );
    expect(isDirty(state)).toBe(false);
    expect(state.save.status).toBe("saved");
  });

  it("stays dirty when the user edited again mid-save", () => {
    const state = run(
      start(),
      { type: "SET_SOURCE", source: "v1", at: AT },
      { type: "SAVE_STARTED", revision: 1, seq: 1 },
      { type: "SET_SOURCE", source: "v2", at: AT },
      { type: "SAVE_SUCCEEDED", seq: 1, revision: 1, updatedAt: AT, at: AT },
    );
    expect(isDirty(state)).toBe(true);
    expect(state.save.status).toBe("dirty");
  });

  it("surfaces a save failure without losing the local source", () => {
    const state = run(
      start(),
      { type: "SET_SOURCE", source: "v1", at: AT },
      { type: "SAVE_STARTED", revision: 1, seq: 1 },
      { type: "SAVE_FAILED", seq: 1, revision: 1, message: "db down" },
    );
    expect(state.save).toMatchObject({ status: "error", message: "db down" });
    expect(state.document.source).toBe("v1");
    expect(isDirty(state)).toBe(true);
  });
});

describe("field violations", () => {
  it("records and clears per field", () => {
    const withViolation = texEditorReducer(start(), {
      type: "SET_FIELD_VIOLATIONS",
      key: "itm-1:0",
      violations: [{ kind: "unbalanced-braces" }],
    });
    expect(withViolation.fieldViolations["itm-1:0"]).toHaveLength(1);

    const cleared = texEditorReducer(withViolation, {
      type: "SET_FIELD_VIOLATIONS",
      key: "itm-1:0",
      violations: [],
    });
    expect(cleared.fieldViolations).toEqual({});
  });
});
