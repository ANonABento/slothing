import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

const state = vi.hoisted(() => ({
  llmResponse: "",
  llmThrows: false,
  /** Text each compiled PDF extracts to, keyed by whether the source was annotated. */
  renderedBefore: "Experience Cut calibration time 40% Shipped telemetry",
  renderedAfter: "Experience Cut calibration time 40% Shipped telemetry",
  compileThrows: false,
  refunds: 0,
  compileCount: 0,
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimiters: { llm: () => ({ allowed: true, resetAt: 0 }) },
  getClientIdentifier: () => "user-1",
}));

vi.mock("@/lib/billing/ai-gate", () => ({
  gateOptionalAiFeature: vi.fn(async () => ({
    llmConfig: { provider: "anthropic" },
    refund: () => {
      state.refunds += 1;
    },
  })),
  isAiGateResponse: () => false,
}));

vi.mock("@/lib/llm/client", () => ({
  LLMClient: class {
    async complete() {
      if (state.llmThrows) throw new Error("llm down");
      return state.llmResponse;
    }
  },
}));

vi.mock("@/lib/llm/json", () => ({
  parseJSONFromLLM: (raw: string) => JSON.parse(raw),
}));

vi.mock("@/lib/latex/compile", () => ({
  compile: vi.fn(async ({ source }: { source: string }) => {
    state.compileCount += 1;
    if (state.compileThrows) throw new Error("compile failed");
    const annotated = source.includes("slothing");
    return {
      pdf: new TextEncoder().encode(
        annotated ? state.renderedAfter : state.renderedBefore,
      ),
      synctex: null,
      log: { ok: true, entries: [], raw: "" },
      hitMap: null,
    };
  }),
}));

vi.mock("@/lib/latex/pdf-text", async () => {
  const actual = await vi.importActual<typeof import("@/lib/latex/pdf-text")>(
    "@/lib/latex/pdf-text",
  );
  return {
    ...actual,
    // The fake compiler encodes the extracted text directly into the "PDF".
    extractPdfText: async (pdf: Uint8Array) =>
      actual.normalizePdfText(new TextDecoder().decode(pdf)),
  };
});

const ORIGINAL = String.raw`\begin{document}
\section{Experience}
\item Cut calibration time 40\% by rewriting the solver.
\end{document}`;

vi.mock("@/lib/db/tex-documents", () => ({
  getTexDocument: vi.fn(async (id: string, userId: string) =>
    id === "doc-1" && userId === "user-1"
      ? { id: "doc-1", userId: "user-1", source: ORIGINAL, title: "Imported" }
      : null,
  ),
}));

import { POST, explainLlmFailure } from "./route";
import { invokeRouteHandler, jsonRequest, routeContext } from "@/test/contract";

function annotated(body: string) {
  return JSON.stringify({ annotated: body });
}

const GOOD = String.raw`\begin{document}
\slothingSection[id=sec-a1b2c3]{Experience}
\slothingItem[id=itm-d4e5f6]{Cut calibration time 40\% by rewriting the solver.}
\end{document}`;

function post(id = "doc-1") {
  return invokeRouteHandler(
    POST,
    jsonRequest(
      `http://localhost/api/tex-documents/${id}/annotate`,
      {},
      "POST",
    ),
    routeContext({ id }),
  );
}

describe("POST /api/tex-documents/[id]/annotate", () => {
  it("proposes an annotation and summarises what it found", async () => {
    state.llmResponse = annotated(GOOD);
    const body = await (await post()).json();

    expect(body.ok).toBe(true);
    expect(body.annotated).toBe(GOOD);
    expect(body.spanCount).toBe(2);
    expect(body.summary).toBe("1 section, 1 bullet");
  });

  it("never applies the annotation itself", async () => {
    state.llmResponse = annotated(GOOD);
    const body = await (await post()).json();
    // Only a proposal comes back; persisting is the client's explicit next step.
    expect(body).not.toHaveProperty("document");
  });

  it("REJECTS an annotation that changes what the document renders", async () => {
    state.llmResponse = annotated(GOOD);
    state.renderedAfter =
      "Experience Cut calibration time 87% Shipped telemetry";

    const body = await (await post()).json();

    expect(body.ok).toBe(false);
    expect(body.reason).toBe("render_changed");
    expect(body.issues[0].message).toContain("does not render identically");
    state.renderedAfter = state.renderedBefore;
  });

  it("rejects on structure before spending any compile", async () => {
    state.compileCount = 0;
    // Reworded content — caught by the cheap check.
    state.llmResponse = annotated(
      GOOD.replace("Cut calibration time", "Reduced calibration duration"),
    );

    const body = await (await post()).json();

    expect(body.ok).toBe(false);
    expect(body.reason).toBe("structure");
    expect(state.compileCount).toBe(0);
  });

  it("rejects and refunds when verification cannot run", async () => {
    state.llmResponse = annotated(GOOD);
    state.compileThrows = true;
    const before = state.refunds;

    const body = await (await post()).json();

    expect(body.ok).toBe(false);
    expect(body.reason).toBe("verification_failed");
    expect(state.refunds).toBe(before + 1);
    state.compileThrows = false;
  });

  it("refunds when the model fails", async () => {
    state.llmThrows = true;
    const before = state.refunds;

    const response = await post();

    expect(response.status).toBe(502);
    expect(state.refunds).toBe(before + 1);
    state.llmThrows = false;
  });

  it("refunds when a rejected proposal is discarded", async () => {
    state.llmResponse = annotated(ORIGINAL); // no spans added
    const before = state.refunds;

    const body = await (await post()).json();

    expect(body.ok).toBe(false);
    expect(state.refunds).toBe(before + 1);
  });

  it("404s for another user's document", async () => {
    state.llmResponse = annotated(GOOD);
    expect((await post("someone-elses")).status).toBe(404);
  });
});

describe("explainLlmFailure", () => {
  it("names a missing key as the fixable thing it is", () => {
    expect(
      explainLlmFailure(new Error("OpenAI API error: invalid api key")),
    ).toMatch(/provider key in Settings/);
    expect(explainLlmFailure(new Error("401 Unauthorized"))).toMatch(
      /provider key in Settings/,
    );
  });

  it("distinguishes an unreachable provider from a bad answer", () => {
    expect(explainLlmFailure(new Error("fetch failed"))).toMatch(
      /could not be reached/,
    );
  });

  it("reassures that the document is untouched when the model just fails", () => {
    // The user's fear on any AI error is that it half-rewrote their resume.
    expect(
      explainLlmFailure(new Error("no annotated source returned")),
    ).toMatch(/unchanged/);
  });

  it("survives a thrown non-Error", () => {
    expect(() => explainLlmFailure("boom")).not.toThrow();
    expect(explainLlmFailure("boom")).toBeTruthy();
  });
});
