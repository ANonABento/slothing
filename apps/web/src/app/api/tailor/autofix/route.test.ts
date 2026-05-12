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

import { buildTailorAutofixPrompt } from "@/lib/tailor/prompt-builders";
import { POST } from "./route";
import {
  expectRouteResponseContract,
  getRequest,
  invalidJsonRequest,
  invokeRouteHandler,
  jsonRequest,
  representativeBody,
  resetContractMocks,
  routeContext,
  setAuthFailure,
  setAuthSuccess,
} from "@/test/contract";

describe("/api/tailor/autofix route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tailor/autofix",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tailor/autofix",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });

  it("returns an HTTP error response for malformed mutation input", async () => {
    setAuthSuccess();

    const response = await invokeRouteHandler(
      POST,
      invalidJsonRequest("http://localhost/api/tailor/autofix", "POST"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expectRouteResponseContract(response);
  });

  it("returns validation errors for missing required fields", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tailor/autofix",
        { keywordsMissing: ["React"], jobDescription: "Build apps" },
        "POST",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "resume" }],
    });
  });

  it("returns validation errors for wrong field types", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tailor/autofix",
        {
          resume: 123,
          keywordsMissing: ["React"],
          jobDescription: "Build apps",
        },
        "POST",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "resume" }],
    });
  });

  it("builds prompt rules that refuse unsupported keywords and preserve trusted fields", () => {
    const prompt = buildTailorAutofixPrompt({
      resume: {
        contact: { name: "Jane Doe", email: "jane@example.com" },
        summary: "Frontend engineer with GraphQL experience.",
        experiences: [
          {
            company: "Acme",
            title: "Senior Engineer",
            dates: "2021 - 2024",
            highlights: ["Built GraphQL dashboards"],
          },
        ],
        skills: ["React", "GraphQL"],
        education: [
          {
            institution: "State University",
            degree: "BS",
            field: "Computer Science",
            date: "2019",
          },
        ],
      },
      keywordsMissing: ["GraphQL", "AWS", "Kubernetes"],
      jobDescription: "Needs GraphQL, AWS, and Kubernetes.",
    });

    expect(prompt).toContain(
      "Only modify summary, experience highlights, and skills",
    );
    expect(prompt).toContain("Add GraphQL only when");
    expect(prompt).toContain("Refuse or omit AWS, Kubernetes");
    expect(prompt).toContain("Preserve contact info and education exactly");
    expect(prompt).toContain("Preserve companies, titles, and dates exactly");
    expect(prompt).toContain("Return schema-valid JSON only");
  });
});
