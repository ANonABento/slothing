import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

vi.mock("@/lib/llm/client", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/llm/client"),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { buildProfileSummary, buildSystemPrompt } from "./prompt";
import { POST } from "./route";
import {
  expectRouteResponseContract,
  invalidJsonRequest,
  invokeRouteHandler,
  jsonRequest,
  resetContractMocks,
  routeContext,
  setAuthFailure,
  setAuthSuccess,
} from "@/test/contract";

describe("/api/extension/chat route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("rejects unauthenticated calls", async () => {
    setAuthFailure();
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/extension/chat",
        { prompt: "hi", jobContext: { title: "FE" } },
        "POST",
        { "x-extension-token": "bad" },
      ),
      routeContext(),
    );
    expect(response.status).toBe(401);
  });

  it("rejects an invalid body", async () => {
    setAuthSuccess();
    const response = await invokeRouteHandler(
      POST,
      invalidJsonRequest("http://localhost/api/extension/chat", "POST"),
      routeContext(),
    );
    await expectRouteResponseContract(response);
    expect([400, 415]).toContain(response.status);
  });

  it("rejects when prompt is missing", async () => {
    setAuthSuccess();
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/extension/chat",
        { jobContext: {} },
        "POST",
      ),
      routeContext(),
    );
    expect(response.status).toBe(400);
  });
});

describe("buildProfileSummary", () => {
  it("falls back to a not-connected sentence when profile is null", () => {
    const result = buildProfileSummary(null);
    expect(result).toMatch(/not connected/i);
  });

  it("renders name, summary, top experience, and skills", () => {
    const result = buildProfileSummary({
      contact: { name: "Ada Lovelace", email: "ada@example.com" },
      summary: "Frontend engineer.",
      experiences: [
        {
          title: "Senior Engineer",
          company: "Acme",
          description: "Shipped React features.",
        },
      ],
      skills: [{ name: "TypeScript" }, { name: "React" }],
    });
    expect(result).toContain("Ada Lovelace");
    expect(result).toContain("Frontend engineer.");
    expect(result).toContain("Senior Engineer at Acme");
    expect(result).toContain("TypeScript, React");
  });

  it("clamps experience description length", () => {
    const longDesc = "x".repeat(500);
    const result = buildProfileSummary({
      contact: { name: "A" },
      experiences: [{ title: "T", company: "C", description: longDesc }],
      skills: [],
    });
    // 240 chars max in the rendered description
    expect(result).not.toContain(longDesc);
    expect(result).toContain("x".repeat(240));
  });
});

describe("buildSystemPrompt", () => {
  it("includes the profile block and the no-job-context fallback", () => {
    const out = buildSystemPrompt("Name: Test", undefined);
    expect(out).toContain("PROFILE:\nName: Test");
    expect(out).toContain("(no job context provided)");
  });

  it("includes job title, company, and truncated description", () => {
    const out = buildSystemPrompt("p", {
      title: "FE Engineer",
      company: "Acme",
      description: "y".repeat(5000),
      requirements: ["TS"],
    });
    expect(out).toContain("Title: FE Engineer");
    expect(out).toContain("Company: Acme");
    expect(out).toContain("Requirements: TS");
    // Description is truncated to 2400 chars
    expect(out).not.toContain("y".repeat(5000));
    expect(out).toContain("y".repeat(2400));
  });
});
