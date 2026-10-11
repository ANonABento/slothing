import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

const state = vi.hoisted(() => ({
  prose:
    "Dear Hiring Manager,\n\nI cut calibration time 40%.\n\nKind regards,\nKevin",
  llmThrows: false,
  refunds: 0,
  bank: { experience: [{ id: "e1" }], skill: [], project: [], education: [] },
  job: {
    title: "Robotics Engineer",
    company: "Bracket Bot",
    description: "Build robots that calibrate themselves.",
  } as Record<string, unknown> | null,
  created: [] as Array<Record<string, unknown>>,
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

vi.mock("@/lib/cover-letter/generate", () => ({
  generateCoverLetter: vi.fn(async () => {
    if (state.llmThrows) throw new Error("llm down");
    return state.prose;
  }),
}));

vi.mock("@/lib/db", () => ({
  getProfile: () => ({
    contact: {
      name: "Kevin Jiang",
      email: "kevin@example.com",
      location: "Waterloo",
    },
  }),
}));

vi.mock("@/lib/db/profile-bank", () => ({
  getGroupedBankEntries: vi.fn(async () => state.bank),
}));

vi.mock("@/lib/db/jobs-async", () => ({
  getJob: vi.fn(async () => state.job),
}));

vi.mock("@/lib/db/tex-documents", () => ({
  createTexDocument: vi.fn(async (input: Record<string, unknown>) => {
    const doc = { id: `doc-${state.created.length + 1}`, ...input };
    state.created.push(doc);
    return doc;
  }),
}));

import { POST } from "./route";
import { scanSpans } from "@/lib/latex/scanner";
import { invokeRouteHandler, jsonRequest, routeContext } from "@/test/contract";

function post(body: Record<string, unknown>) {
  return invokeRouteHandler(
    POST,
    jsonRequest(
      "http://localhost/api/tex-documents/cover-letter",
      body,
      "POST",
    ),
    routeContext(),
  );
}

describe("POST /api/tex-documents/cover-letter", () => {
  it("creates a cover letter as a LaTeX document with addressable paragraphs", async () => {
    const response = await post({ opportunityId: "job-1" });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.document.kind).toBe("cover_letter");
    expect(body.paragraphCount).toBe(3);

    const paras = scanSpans(body.document.source).filter(
      (s) => s.kind === "para",
    );
    expect(paras).toHaveLength(3);
    expect(paras.every((s) => s.id !== null)).toBe(true);
  });

  it("titles the letter after the company", async () => {
    const body = await (await post({ opportunityId: "job-1" })).json();
    expect(body.document.title).toBe("Cover letter — Bracket Bot");
  });

  it("links the letter to the opportunity it was written for", async () => {
    const body = await (await post({ opportunityId: "job-1" })).json();
    expect(body.document.opportunityId).toBe("job-1");
  });

  it("accepts a raw job description with no saved opportunity", async () => {
    const body = await (
      await post({ jobDescription: "Build robots.", company: "Acme" })
    ).json();
    expect(body.document.title).toBe("Cover letter — Acme");
    expect(body.document.opportunityId).toBeNull();
  });

  it("404s for an opportunity that is not the user's", async () => {
    state.job = null;
    const response = await post({ opportunityId: "someone-elses" });
    expect(response.status).toBe(404);
    state.job = {
      title: "Robotics Engineer",
      company: "Bracket Bot",
      description: "Build robots that calibrate themselves.",
    };
  });

  it("refuses without a job description — there is nothing to write about", async () => {
    const response = await post({});
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("missing_job");
  });

  it("refuses on an empty bank rather than inventing a career", async () => {
    state.bank = { experience: [], skill: [], project: [], education: [] };
    const response = await post({ opportunityId: "job-1" });

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("empty_bank");
    state.bank = {
      experience: [{ id: "e1" }],
      skill: [],
      project: [],
      education: [],
    };
  });

  it("refunds the credit when the model fails", async () => {
    state.llmThrows = true;
    const before = state.refunds;

    const response = await post({ opportunityId: "job-1" });

    expect(response.status).toBe(502);
    expect(state.refunds).toBe(before + 1);
    state.llmThrows = false;
  });
});
