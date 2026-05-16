import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

import { POST } from "./route";

function postRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/export/latex", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("/api/export/latex POST", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
  });

  it("returns 401 when auth fails", async () => {
    mocks.requireAuth.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await POST(postRequest({ html: "<p>hi</p>" }));

    expect(response.status).toBe(401);
  });

  it("returns 400 when the JSON body is invalid", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/export/latex", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{not json",
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns 400 when html is missing", async () => {
    const response = await POST(postRequest({}));
    expect(response.status).toBe(400);
  });

  it("returns 400 when html is an empty string", async () => {
    const response = await POST(postRequest({ html: "" }));
    expect(response.status).toBe(400);
  });

  it("returns a .tex attachment for a valid request", async () => {
    const response = await POST(
      postRequest({
        html: "<h1>Resume</h1><p>Hello <strong>world</strong>.</p>",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/x-tex");
    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="resume.tex"',
    );

    const text = await response.text();
    expect(text).toContain("\\documentclass[11pt,letterpaper]{article}");
    expect(text).toContain("\\begin{document}");
    expect(text).toContain("\\section*{Resume}");
    expect(text).toContain("\\textbf{world}");
    expect(text).toContain("\\end{document}");
  });

  it("uses a sanitized custom filename when provided", async () => {
    const response = await POST(
      postRequest({
        html: "<p>x</p>",
        filename: "jane/doe.tex",
      }),
    );

    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="janedoe.tex"',
    );
  });

  it("appends .tex when the filename lacks the extension", async () => {
    const response = await POST(
      postRequest({
        html: "<p>x</p>",
        filename: "my-resume",
      }),
    );

    expect(response.headers.get("content-disposition")).toBe(
      'attachment; filename="my-resume.tex"',
    );
  });

  it("threads the title through to the LaTeX preamble", async () => {
    const response = await POST(
      postRequest({
        html: "<p>x</p>",
        title: "Jane Resume",
      }),
    );

    const text = await response.text();
    expect(text).toContain("pdftitle={Jane Resume}");
  });
});
