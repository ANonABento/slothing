import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

// The classes must live inside vi.hoisted: vi.mock factories are hoisted above ordinary
// declarations, so a class defined below would not exist yet when the factory runs.
const state = vi.hoisted(() => {
  class FakeCompileError extends Error {
    constructor(
      message: string,
      readonly log: { ok: boolean; entries: unknown[]; raw: string },
    ) {
      super(message);
    }
  }
  class FakeEngineUnavailable extends Error {}

  return {
    created: [] as Array<Record<string, unknown>>,
    compileBehaviour: "ok" as "ok" | "compile_failed" | "engine_unavailable",
    compileCalls: [] as Array<Record<string, unknown>>,
    missingPackageLog: "! LaTeX Error: File `fontawesome5.sty' not found.",
    FakeCompileError,
    FakeEngineUnavailable,
  };
});

vi.mock("@/lib/latex/compile", () => ({
  compile: vi.fn(async (input: Record<string, unknown>) => {
    state.compileCalls.push(input);
    if (state.compileBehaviour === "engine_unavailable") {
      throw new state.FakeEngineUnavailable("no engine");
    }
    if (state.compileBehaviour === "compile_failed") {
      throw new state.FakeCompileError("nope", {
        ok: false,
        entries: [],
        raw: state.missingPackageLog,
      });
    }
    return {
      pdf: new Uint8Array([37, 80, 68, 70]),
      synctex: null,
      log: {},
      hitMap: null,
    };
  }),
  CompileError: state.FakeCompileError,
  EngineUnavailableError: state.FakeEngineUnavailable,
}));

vi.mock("@/lib/latex/cache", () => ({
  cacheKey: () => "a".repeat(64),
  writeCachedPdf: vi.fn(async () => undefined),
}));

vi.mock("@/lib/db/tex-documents", () => ({
  createTexDocument: vi.fn(async (input: Record<string, unknown>) => {
    const doc = { id: `doc-${state.created.length + 1}`, ...input };
    state.created.push(doc);
    return doc;
  }),
}));

import { POST } from "./route";
import { invokeRouteHandler, jsonRequest, routeContext } from "@/test/contract";

const THIRD_PARTY = String.raw`\documentclass[letterpaper,11pt]{article}
\usepackage{titlesec, enumitem}
\begin{document}
\section{Experience}
Bracket Bot, Robotics Engineer
\end{document}`;

const OURS = String.raw`\documentclass[11pt]{article}
\usepackage{slothing}
\begin{document}
\slothingItem[id=itm-000001]{A bullet.}
\end{document}`;

function importSource(body: Record<string, unknown>) {
  return invokeRouteHandler(
    POST,
    jsonRequest("http://localhost/api/tex-documents/import", body, "POST"),
    routeContext(),
  );
}

describe("POST /api/tex-documents/import", () => {
  it("imports a third-party .tex verbatim", async () => {
    const response = await importSource({
      source: THIRD_PARTY,
      filename: "jake_resume.tex",
    });
    const body = await response.json();

    expect(response.status).toBe(201);
    // The source is stored byte-for-byte — we do not reinterpret someone's document.
    expect(body.document.source).toBe(THIRD_PARTY);
    expect(body.document.title).toBe("Jake resume");
  });

  it("reports a third-party document as importable but not annotated", async () => {
    const body = await (
      await importSource({ source: THIRD_PARTY, filename: "r.tex" })
    ).json();

    expect(body.annotated).toBe(false);
    expect(body.spanCount).toBe(0);
    expect(body.packages).toEqual(["enumitem", "titlesec"]);
  });

  it("recognises one of our own documents as already annotated", async () => {
    const body = await (
      await importSource({ source: OURS, filename: "mine.tex" })
    ).json();
    expect(body.annotated).toBe(true);
    expect(body.spanCount).toBe(1);
  });

  it("compiles with fetching allowed, since an import may need unknown packages", async () => {
    state.compileCalls.length = 0;
    await importSource({ source: THIRD_PARTY, filename: "r.tex" });

    expect(state.compileCalls.at(-1)).toMatchObject({
      allowFetch: true,
      mode: "export",
    });
  });

  it("refuses to save a document that does not compile", async () => {
    state.compileBehaviour = "compile_failed";
    const before = state.created.length;

    const response = await importSource({
      source: THIRD_PARTY,
      filename: "r.tex",
    });
    const body = await response.json();

    expect(response.status).toBe(422);
    // Naming the package beats "compile failed".
    expect(body.error).toContain("fontawesome5");
    expect(state.created.length).toBe(before);
    state.compileBehaviour = "ok";
  });

  it("explains that imports need an engine when none is installed", async () => {
    state.compileBehaviour = "engine_unavailable";
    const response = await importSource({
      source: THIRD_PARTY,
      filename: "r.tex",
    });

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("engine_unavailable");
    state.compileBehaviour = "ok";
  });

  it("rejects a fragment before spending a compile on it", async () => {
    state.compileCalls.length = 0;
    const response = await importSource({
      source: "\\section{Experience}",
      filename: "fragment.tex",
    });

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("no_document_body");
    expect(state.compileCalls).toHaveLength(0);
  });

  it("rejects a non-.tex upload", async () => {
    const response = await importSource({
      source: THIRD_PARTY,
      filename: "resume.docx",
    });
    expect((await response.json()).code).toBe("not_tex");
  });

  it("requires a source", async () => {
    const response = await importSource({ filename: "r.tex" });
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("missing_source");
  });

  it("honours an explicit title over the filename guess", async () => {
    const body = await (
      await importSource({
        source: THIRD_PARTY,
        filename: "r.tex",
        title: "My Real Résumé",
      })
    ).json();
    expect(body.document.title).toBe("My Real Résumé");
  });

  // The multipart branch is not unit-tested: jsdom lacks real File/FormData semantics and
  // the shared test setup requires jsdom, so it cannot run in the node environment. It is
  // verified against the running server instead.
});
