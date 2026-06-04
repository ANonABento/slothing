import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getGeneratedResume: vi.fn(),
  getResumeTemplate: vi.fn(),
  listResumeTemplates: vi.fn(),
  renderResumeHtmlForTemplate: vi.fn(),
  generatePDF: vi.fn(),
  convertContentToDocx: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db", () => ({
  getGeneratedResume: mocks.getGeneratedResume,
}));

vi.mock("@/lib/db/resume-templates", () => ({
  getResumeTemplate: mocks.getResumeTemplate,
  listResumeTemplates: mocks.listResumeTemplates,
}));

vi.mock("@/lib/resume/render-resume", () => ({
  renderResumeHtmlForTemplate: mocks.renderResumeHtmlForTemplate,
}));

vi.mock("@/lib/resume/pdf-export", () => ({
  generatePDF: mocks.generatePDF,
}));

vi.mock("@/lib/builder/docx-export", () => ({
  convertContentToDocx: mocks.convertContentToDocx,
}));

import { GET, POST } from "./route";

const resume = {
  contact: { name: "Jane Doe" },
  summary: "Builds reliable systems.",
  experiences: [],
  skills: [],
  education: [],
};

function exportRequest(body: unknown) {
  return new NextRequest("http://localhost/api/resume/export", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("resume export route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.getGeneratedResume.mockReturnValue({
      id: "resume-1",
      contentJson: JSON.stringify(resume),
    });
    mocks.getResumeTemplate.mockReturnValue(null);
    mocks.listResumeTemplates.mockReturnValue([]);
    mocks.renderResumeHtmlForTemplate.mockResolvedValue("<html>resume</html>");
    mocks.generatePDF.mockResolvedValue(new Uint8Array([1, 2, 3]));
    mocks.convertContentToDocx.mockResolvedValue(Buffer.from([4, 5, 6]));
  });

  it("lists imported (collapsed) templates alongside built-in export templates", async () => {
    mocks.listResumeTemplates.mockReturnValue([
      {
        id: "imported-1",
        name: "Imported Sidebar",
        description: null,
        sourceFilename: "resume.pdf",
        sourceType: "pdf",
        template: {
          id: "imported-1",
          name: "Imported Sidebar",
          grammar: { columns: "left-sidebar" },
          tokens: {},
        },
      },
    ]);

    const response = await GET();

    expect(mocks.listResumeTemplates).toHaveBeenCalledWith("user-1");
    await expect(response.json()).resolves.toMatchObject({
      templates: expect.arrayContaining([
        expect.objectContaining({
          id: "imported-1",
          type: "custom",
          layout: "two-column",
          sourceFilename: "resume.pdf",
        }),
      ]),
    });
  });

  it("renders saved resume HTML through the unified dispatch", async () => {
    const response = await POST(
      exportRequest({
        resumeId: "resume-1",
        templateId: "custom-template",
        format: "html",
      }),
    );

    expect(mocks.getGeneratedResume).toHaveBeenCalledWith("resume-1", "user-1");
    expect(mocks.renderResumeHtmlForTemplate).toHaveBeenCalledWith(
      resume,
      "custom-template",
      "user-1",
    );
    await expect(response.text()).resolves.toBe("<html>resume</html>");
  });

  it("uses the editor's page settings for a built-in template PDF", async () => {
    await POST(
      exportRequest({
        resumeId: "resume-1",
        templateId: "classic",
        format: "pdf",
      }),
    );

    expect(mocks.renderResumeHtmlForTemplate).toHaveBeenCalledWith(
      resume,
      "classic",
      "user-1",
    );
    expect(mocks.generatePDF).toHaveBeenCalledWith("<html>resume</html>", {
      format: "Letter",
      margin: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
    });
  });

  it("renders an imported (collapsed) template PDF borderless", async () => {
    mocks.getResumeTemplate.mockReturnValue({
      id: "imported-1",
      template: {
        id: "imported-1",
        grammar: { columns: "single" },
        tokens: {},
      },
    });

    await POST(
      exportRequest({
        resumeId: "resume-1",
        templateId: "imported-1",
        format: "pdf",
      }),
    );

    expect(mocks.generatePDF).toHaveBeenCalledWith("<html>resume</html>", {
      format: "Letter",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  });

  it("exports a resume DOCX from TipTap content", async () => {
    const content = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Hi" }] }],
    };

    const response = await POST(
      exportRequest({
        content,
        mode: "resume",
        templateId: "classic",
        format: "docx",
      }),
    );

    expect(mocks.convertContentToDocx).toHaveBeenCalledWith(
      expect.objectContaining({
        content,
        mode: "resume",
        title: "Classic Resume",
      }),
    );
    expect(response.headers.get("content-type")).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(Array.from(new Uint8Array(await response.arrayBuffer()))).toEqual([
      4, 5, 6,
    ]);
  });

  it("exports a cover letter DOCX from TipTap content", async () => {
    const content = {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "Hi" }] }],
    };

    await POST(
      exportRequest({
        content,
        mode: "cover_letter",
        templateId: "formal",
        format: "docx",
      }),
    );

    expect(mocks.convertContentToDocx).toHaveBeenCalledWith(
      expect.objectContaining({
        content,
        mode: "cover_letter",
        title: "Formal Cover Letter",
      }),
    );
  });

  it("rejects DOCX export without TipTap content", async () => {
    const response = await POST(
      exportRequest({ mode: "resume", format: "docx" }),
    );

    expect(response.status).toBe(400);
    expect(mocks.convertContentToDocx).not.toHaveBeenCalled();
  });
});
