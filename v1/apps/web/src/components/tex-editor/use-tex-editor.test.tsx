import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { draftStorageKey, useTexEditor } from "./use-tex-editor";

const SOURCE = String.raw`\documentclass[11pt]{article}
\usepackage{slothing}
\slothingcontract{1}
\slothingset{ font = LatinModern, fontsize = 11pt, margin = 0.5in, sectionskip = 8pt, accent = {0,0,0}, columns = 1 }
\begin{document}
\slothingItem[id=itm-000001]{Original bullet text.}
\end{document}`;

const DOCUMENT = {
  id: "doc-1",
  title: "Resume",
  kind: "resume" as const,
  source: SOURCE,
  updatedAt: "2026-08-21T00:00:00.000Z",
};

interface Call {
  url: string;
  init?: RequestInit;
}

function makeTransport() {
  const calls: Call[] = [];
  const key = "a".repeat(64);

  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url: String(url), init });

    if (String(url).includes("/compile")) {
      return new Response(
        JSON.stringify({
          ok: true,
          key,
          hitMap: { rects: [], ids: ["itm-000001"] },
          log: { ok: true, entries: [], raw: "" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (String(url).includes("/pdf")) {
      return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
    }
    return new Response(
      JSON.stringify({ document: { updatedAt: "2026-08-21T00:01:00.000Z" } }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });

  const storage = new Map<string, string>();

  return {
    calls,
    key,
    runtime: {
      transport: { fetch: fetchMock as unknown as typeof fetch },
      now: () => "2026-08-21T00:00:00.000Z",
      storage: {
        getItem: (k: string) => storage.get(k) ?? null,
        setItem: (k: string, v: string) => void storage.set(k, v),
        removeItem: (k: string) => void storage.delete(k),
      },
    },
    storage,
    compiles: () => calls.filter((c) => c.url.includes("/compile")),
    saves: () => calls.filter((c) => c.init?.method === "PATCH"),
  };
}

function editOnce(
  result: { current: ReturnType<typeof useTexEditor> },
  text: string,
) {
  act(() => {
    result.current.editField("itm-000001", 0, { kind: "plain", text });
  });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("compile debounce", () => {
  it("coalesces rapid edits into a single compile carrying the final text", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    for (const text of ["one", "two", "three", "four", "five"]) {
      editOnce(result, text);
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
    }

    await act(async () => {
      vi.advanceTimersByTime(700);
    });

    await waitFor(() => expect(t.compiles().length).toBe(1));
    expect(String(t.compiles()[0].init?.body)).toContain("five");
  });

  it("does not compile before the debounce elapses", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    editOnce(result, "typing");
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(t.compiles()).toHaveLength(0);
  });

  it("compiles immediately for a settings change — a click must not wait 600ms", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    act(() => {
      result.current.editSettings({
        font: "Times",
        fontsize: "11pt",
        margin: "0.5in",
        sectionskip: "8pt",
        accent: "0,0,0",
        columns: 1,
      });
    });

    await waitFor(() => expect(t.compiles().length).toBe(1));
  });
});

describe("save cadence", () => {
  it("does NOT save per keystroke — version history would fill with noise", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    for (const text of ["a", "b", "c"]) {
      editOnce(result, text);
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
    }

    expect(t.saves()).toHaveLength(0);
  });

  it("saves once on an explicit commit, with the final source", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    editOnce(result, "first");
    editOnce(result, "second");

    await act(async () => {
      await result.current.commit("field edit");
    });

    await waitFor(() => expect(t.saves().length).toBe(1));
    const body = String(t.saves()[0].init?.body);
    expect(body).toContain("second");
    expect(body).toContain("field edit");
  });

  it("saves on the idle safety net for the user who walks away", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    editOnce(result, "abandoned mid-edit");
    await act(async () => {
      vi.advanceTimersByTime(6000);
    });

    await waitFor(() => expect(t.saves().length).toBe(1));
  });

  it("does not save when nothing changed", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    await act(async () => {
      await result.current.commit();
    });

    expect(t.saves()).toHaveLength(0);
  });
});

describe("draft mirror", () => {
  it("mirrors unsaved work to localStorage between commits", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    editOnce(result, "unsaved work");
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    const draft = t.storage.get(draftStorageKey("doc-1"));
    expect(draft).toBeDefined();
    expect(JSON.parse(String(draft)).source).toContain("unsaved work");
  });

  it("clears the draft once the work is safely saved", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    editOnce(result, "will be saved");
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });
    await act(async () => {
      await result.current.commit();
    });

    await waitFor(() =>
      expect(t.storage.get(draftStorageKey("doc-1"))).toBeUndefined(),
    );
  });
});

describe("first render", () => {
  // Regression: the shell originally called `commit()` on mount, which only flushes a
  // PENDING debounce. With no timer set there was nothing to flush, so the document never
  // compiled and the preview stayed blank. Caught in the browser, not by the suite.
  it("compileNow compiles without requiring an edit first", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    act(() => {
      result.current.compileNow();
    });

    await waitFor(() => expect(t.compiles().length).toBe(1));
  });

  // Regression: pending bytes were exposed from a ref. Mutating a ref does not re-render,
  // so the canvas never received them and the PDF never appeared.
  it("exposes fetched bytes as state so the canvas actually re-renders", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    expect(result.current.pendingBytes).toBeNull();

    act(() => {
      result.current.compileNow();
    });

    await waitFor(() => {
      expect(result.current.pendingBytes).not.toBeNull();
    });
    expect(result.current.pendingBytes?.key).toBe(t.key);
    expect(result.current.pendingBytes?.bytes.byteLength).toBe(3);
  });
});

describe("field editing", () => {
  it("rejects a plain write into a rich field and reports it", async () => {
    const rich = SOURCE.replace(
      "Original bullet text.",
      String.raw`Shipped \slothingB{real-time} telemetry.`,
    );
    const t = makeTransport();
    const { result } = renderHook(() =>
      useTexEditor({ ...DOCUMENT, source: rich }, t.runtime),
    );

    let accepted = true;
    act(() => {
      accepted = result.current.editField("itm-000001", 0, {
        kind: "plain",
        text: "flattened",
      });
    });

    expect(accepted).toBe(false);
    expect(result.current.state.document.source).toBe(rich);
  });

  it("records violations for invalid LaTeX and leaves the source alone", async () => {
    const t = makeTransport();
    const { result } = renderHook(() => useTexEditor(DOCUMENT, t.runtime));

    act(() => {
      result.current.editField("itm-000001", 0, {
        kind: "latex",
        latex: String.raw`\input{/etc/passwd}`,
      });
    });

    expect(result.current.state.fieldViolations["itm-000001:0"]).toBeDefined();
    expect(result.current.state.document.source).toBe(SOURCE);
  });
});

describe("failure handling", () => {
  it("suspends the loop when no engine is available, and stops compiling", async () => {
    const t = makeTransport();
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("/compile")) {
        return new Response(
          JSON.stringify({ code: "engine_unavailable", error: "no tectonic" }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("{}", { status: 200 });
    });

    const { result } = renderHook(() =>
      useTexEditor(DOCUMENT, {
        ...t.runtime,
        transport: { fetch: fetchMock as unknown as typeof fetch },
      }),
    );

    editOnce(result, "anything");
    await act(async () => {
      vi.advanceTimersByTime(700);
    });

    await waitFor(() =>
      expect(result.current.state.preview.phase.status).toBe("suspended"),
    );

    const compilesSoFar = fetchMock.mock.calls.length;
    editOnce(result, "more typing");
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    // No further hammering of a machine that has no engine.
    expect(fetchMock.mock.calls.length).toBe(compilesSoFar);
  });

  it("keeps the local source after a save failure so no work is lost", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes("/compile")) {
        return new Response(
          JSON.stringify({ key: "k", hitMap: null, log: {} }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      if (String(url).includes("/pdf"))
        return new Response(new Uint8Array([1]), { status: 200 });
      return new Response("{}", { status: 500 });
    });

    const { result } = renderHook(() =>
      useTexEditor(DOCUMENT, {
        now: () => "2026-08-21T00:00:00.000Z",
        transport: { fetch: fetchMock as unknown as typeof fetch },
        storage: {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        },
      }),
    );

    editOnce(result, "precious work");
    await act(async () => {
      await result.current.commit();
    });

    await waitFor(() => expect(result.current.state.save.status).toBe("error"));
    expect(result.current.state.document.source).toContain("precious work");
  });
});
