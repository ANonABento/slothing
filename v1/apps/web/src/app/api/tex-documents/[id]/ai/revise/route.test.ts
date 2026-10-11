import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

const state = vi.hoisted(() => ({
  opportunityId: null as string | null,
  reviseResult: {
    bullet: "Cut calibration time 40% by rewriting the solver in Rust.",
    applied: true,
    ungroundedNumbers: [] as string[],
  },
  reviseCalls: [] as Array<{
    bullet: string;
    evidence: string;
    instruction: string;
  }>,
  gateRefunds: 0,
  llmConfig: { provider: "anthropic" } as unknown,
  shouldThrow: false,
  /** Flipped by the one test that asserts the limiter is wired up. */
  rateLimited: false,
}));

// The real limiter allows 10 LLM calls a minute, which this suite exceeds. Mock it so the
// other tests exercise route logic, and assert the limit explicitly in its own test.
vi.mock("@/lib/rate-limit", () => ({
  rateLimiters: {
    llm: () => ({ allowed: !state.rateLimited, resetAt: 0 }),
    standard: () => ({ allowed: true, resetAt: 0 }),
  },
  getClientIdentifier: () => "user-1",
}));

vi.mock("@/lib/db/tex-documents", () => ({
  getTexDocument: vi.fn(async (id: string, userId: string) =>
    id === "doc-1" && userId === "user-1"
      ? {
          id: "doc-1",
          userId: "user-1",
          kind: "resume",
          title: "Resume",
          source: SOURCE,
          contractVersion: 1,
          templateId: null,
          opportunityId: state.opportunityId,
          createdAt: "2026-08-21T00:00:00.000Z",
          updatedAt: "2026-08-21T00:00:00.000Z",
        }
      : null,
  ),
}));

vi.mock("@/lib/db/jobs-async", () => ({
  getJob: vi.fn(async () => ({
    title: "Robotics Engineer",
    company: "Acme",
    description: "Build robots.",
  })),
}));

vi.mock("@/lib/billing/ai-gate", () => ({
  gateOptionalAiFeature: vi.fn(async () => ({
    llmConfig: state.llmConfig,
    refund: () => {
      state.gateRefunds += 1;
    },
  })),
  isAiGateResponse: () => false,
}));

vi.mock("@/lib/bank/ai-authoring", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/bank/ai-authoring")
  >("@/lib/bank/ai-authoring");
  return {
    ...actual,
    reviseBullet: vi.fn(
      async (bullet: string, evidence: string, instruction: string) => {
        state.reviseCalls.push({ bullet, evidence, instruction });
        if (state.shouldThrow) throw new Error("llm down");
        return state.reviseResult;
      },
    ),
  };
});

const SOURCE = String.raw`\begin{document}
\slothingEntry[id=ent-brk001]{Bracket Bot}{Robotics Engineer}{2025--2026}{
  \begin{slothingItems}
    \slothingItem[id=itm-000001]{Cut calibration time 40\% by rewriting the solver.}
    \slothingItem[id=itm-rich01]{Shipped \slothingB{real-time} telemetry.}
  \end{slothingItems}
}
\end{document}`;

import { POST } from "./route";
import { invokeRouteHandler, jsonRequest, routeContext } from "@/test/contract";

function post(body: Record<string, unknown>, id = "doc-1") {
  return invokeRouteHandler(
    POST,
    jsonRequest(
      `http://localhost/api/tex-documents/${id}/ai/revise`,
      body,
      "POST",
    ),
    routeContext({ id }),
  );
}

describe("POST /api/tex-documents/[id]/ai/revise", () => {
  it("proposes a revision without writing it", async () => {
    const response = await post({
      spanId: "itm-000001",
      fieldIndex: 0,
      action: "shorter",
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.original).toBe(
      "Cut calibration time 40% by rewriting the solver.",
    );
    expect(body.proposal).toContain("Rust");
    expect(body.applied).toBe(true);
    // Nothing is persisted — the client applies it through the normal write path.
    expect(body).not.toHaveProperty("source");
    expect(body).not.toHaveProperty("document");
  });

  it("grounds the prompt in this role only", async () => {
    state.reviseCalls.length = 0;
    await post({ spanId: "itm-000001", fieldIndex: 0, action: "impact" });

    const call = state.reviseCalls.at(-1)!;
    expect(call.evidence).toContain("ROLE: Bracket Bot");
    expect(call.evidence).toContain("THE LINE BEING REVISED:");
    expect(call.instruction).toContain("impact");
  });

  it("reports a revision that was rejected for inventing facts", async () => {
    state.reviseResult = {
      bullet: "Cut calibration time 40% by rewriting the solver.",
      applied: false,
      ungroundedNumbers: ["87%"],
    };
    const body = await (
      await post({ spanId: "itm-000001", fieldIndex: 0, action: "metric" })
    ).json();

    expect(body.applied).toBe(false);
    expect(body.ungroundedNumbers).toEqual(["87%"]);
    state.reviseResult = {
      bullet: "Cut calibration time 40% by rewriting the solver in Rust.",
      applied: true,
      ungroundedNumbers: [],
    };
  });

  it("refuses a rich field rather than silently flattening its formatting", async () => {
    const response = await post({
      spanId: "itm-rich01",
      fieldIndex: 0,
      action: "shorter",
    });
    expect(response.status).toBe(422);
    expect((await response.json()).code).toBe("rich_field");
  });

  it("rejects an unknown action", async () => {
    const response = await post({
      spanId: "itm-000001",
      fieldIndex: 0,
      action: "delete-everything",
    });
    expect(response.status).toBe(400);
  });

  it("404s for a field that is not in the document", async () => {
    const response = await post({
      spanId: "itm-zzzzzz",
      fieldIndex: 0,
      action: "shorter",
    });
    expect(response.status).toBe(404);
  });

  it("404s for another user's document", async () => {
    const response = await post(
      { spanId: "itm-000001", fieldIndex: 0, action: "shorter" },
      "someone-elses",
    );
    expect(response.status).toBe(404);
  });

  it("passes job context only when the document is linked to an opportunity", async () => {
    const without = await (
      await post({ spanId: "itm-000001", fieldIndex: 0, action: "impact" })
    ).json();
    expect(without.usedJobContext).toBe(false);

    state.opportunityId = "job-1";
    const withJob = await (
      await post({ spanId: "itm-000001", fieldIndex: 0, action: "impact" })
    ).json();
    expect(withJob.usedJobContext).toBe(true);
    state.opportunityId = null;
  });

  it("revises the unsaved source when the editor supplies one", async () => {
    state.reviseCalls.length = 0;
    const edited = SOURCE.replace(
      "Cut calibration time 40\\% by rewriting the solver.",
      "A totally different unsaved bullet.",
    );
    await post({
      spanId: "itm-000001",
      fieldIndex: 0,
      action: "shorter",
      source: edited,
    });
    expect(state.reviseCalls.at(-1)!.bullet).toBe(
      "A totally different unsaved bullet.",
    );
  });

  it("rate-limits AI calls with the stricter LLM limiter", async () => {
    state.rateLimited = true;
    const response = await post({
      spanId: "itm-000001",
      fieldIndex: 0,
      action: "shorter",
    });
    expect(response.status).toBe(429);
    expect((await response.json()).code).toBe("rate_limited");
    state.rateLimited = false;
  });

  it("refunds the AI credit when the model call fails", async () => {
    state.shouldThrow = true;
    const before = state.gateRefunds;
    const response = await post({
      spanId: "itm-000001",
      fieldIndex: 0,
      action: "shorter",
    });
    expect(response.status).toBe(502);
    expect(state.gateRefunds).toBe(before + 1);
    state.shouldThrow = false;
  });
});
