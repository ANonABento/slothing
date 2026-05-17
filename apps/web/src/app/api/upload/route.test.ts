import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  saveDocument: vi.fn(),
  getDocumentByFileHash: vi.fn(),
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  getLLMConfig: vi.fn(),
  deleteSourceDocuments: vi.fn(),
  populateBankFromProfile: vi.fn(),
  extractTextFromFile: vi.fn(),
  classifyDocument: vi.fn(),
  smartParseResume: vi.fn(),
  isLLMConfigured: vi.fn(),
}));

vi.mock("fs/promises", () => {
  const mocked = {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    unlink: vi.fn().mockResolvedValue(undefined),
  };
  return { ...mocked, default: mocked };
});

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db", () => ({
  saveDocument: mocks.saveDocument,
  getDocumentByFileHash: mocks.getDocumentByFileHash,
  getProfile: mocks.getProfile,
  updateProfile: mocks.updateProfile,
  getLLMConfig: mocks.getLLMConfig,
}));

vi.mock("@/lib/llm/is-configured", () => ({
  isLLMConfigured: mocks.isLLMConfigured,
}));

vi.mock("@/lib/db/profile-bank", () => ({
  deleteSourceDocuments: mocks.deleteSourceDocuments,
}));

vi.mock("@/lib/resume/info-bank", () => ({
  populateBankFromProfile: mocks.populateBankFromProfile,
}));

vi.mock("@/lib/parser/pdf", () => ({
  extractTextFromFile: mocks.extractTextFromFile,
}));

vi.mock("@/lib/parser/document-classifier", () => ({
  classifyDocument: mocks.classifyDocument,
}));

vi.mock("@/lib/parser/smart-parser", () => ({
  smartParseResume: mocks.smartParseResume,
}));

import { POST } from "./route";

function uploadRequest(file: File, url = "http://localhost/api/upload") {
  const formData = {
    get: vi.fn().mockReturnValue(file),
  };
  return {
    nextUrl: new URL(url),
    formData: vi.fn().mockResolvedValue(formData),
  } as unknown as NextRequest;
}

function pdfFile(name = "test-resume.pdf") {
  const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
  return {
    name,
    type: "application/pdf",
    size: bytes.byteLength,
    arrayBuffer: vi.fn().mockResolvedValue(bytes.buffer),
  } as unknown as File;
}

function fileWithBytes(name: string, type: string, bytes: Uint8Array): File {
  return {
    name,
    type,
    size: bytes.byteLength,
    arrayBuffer: vi.fn().mockResolvedValue(bytes.buffer),
  } as unknown as File;
}

function exeMasqueradingAsPdf() {
  // PE/MZ header — Windows executable bytes claiming application/pdf MIME and
  // a .pdf filename. Magic-byte validation must reject this.
  const peHeader = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00]);
  return fileWithBytes("malicious.pdf", "application/pdf", peHeader);
}

describe("upload route dedupe flow", () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    debugSpy = vi.spyOn(console, "debug").mockImplementation(() => undefined);
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.getProfile.mockReturnValue(null);
    mocks.getLLMConfig.mockReturnValue(null);
    mocks.isLLMConfigured.mockReturnValue(false);
    mocks.extractTextFromFile.mockResolvedValue("resume text");
    mocks.classifyDocument.mockResolvedValue("resume");
    mocks.smartParseResume.mockResolvedValue({
      profile: {
        experiences: [
          {
            company: "Acme Corp",
            title: "Senior Developer",
          },
        ],
      },
      confidence: 0.9,
      sectionsDetected: ["experience"],
      llmUsed: false,
      llmSectionsCount: 0,
      warnings: [],
    });
    mocks.populateBankFromProfile.mockReturnValue({
      inserted: 1,
      updated: 0,
      skipped: 0,
    });
  });

  afterEach(() => {
    debugSpy.mockRestore();
  });

  it("rejects an .exe masquerading as a .pdf via magic-byte validation", async () => {
    const response = await POST(uploadRequest(exeMasqueradingAsPdf()));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("does not match"),
    });
    expect(mocks.saveDocument).not.toHaveBeenCalled();
    expect(mocks.extractTextFromFile).not.toHaveBeenCalled();
  });

  it("rejects a disallowed MIME type", async () => {
    const html = new Uint8Array([0x3c, 0x68, 0x74, 0x6d, 0x6c, 0x3e]);
    const response = await POST(
      uploadRequest(fileWithBytes("payload.html", "text/html", html)),
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("Invalid file type"),
    });
    expect(mocks.saveDocument).not.toHaveBeenCalled();
  });

  it("rejects invalid force query values", async () => {
    const response = await POST(
      uploadRequest(pdfFile(), "http://localhost/api/upload?force=maybe"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "force" }],
    });
    expect(mocks.extractTextFromFile).not.toHaveBeenCalled();
    expect(mocks.saveDocument).not.toHaveBeenCalled();
  });

  it("does not write per-request filenames, sizes, or hashes to debug logs", async () => {
    const rawFilename =
      "Jane_Doe_Private_Resume_2026_With_Confidential_Client_List.pdf";
    const expectedFileHash =
      "39d0e488b426fbbabef21b84b1f8195e16a1e55e39c25b2508d2576489c84214";
    const file = pdfFile(rawFilename);

    const response = await POST(uploadRequest(file));

    expect(response.status).toBe(200);
    const debugOutput = debugSpy.mock.calls
      .map((args: unknown[]) =>
        args
          .map((arg: unknown) =>
            typeof arg === "string" ? arg : JSON.stringify(arg),
          )
          .join(" "),
      )
      .join("\n");
    const debugFields = debugSpy.mock.calls.flatMap((args: unknown[]) =>
      args.filter(
        (arg): arg is Record<string, unknown> =>
          typeof arg === "object" && arg !== null && !Array.isArray(arg),
      ),
    );

    expect(debugOutput).not.toContain(rawFilename);
    expect(debugOutput).not.toContain(expectedFileHash);
    expect(debugFields).not.toContainEqual(
      expect.objectContaining({ filenameHash: expect.any(String) }),
    );
    expect(debugFields).not.toContainEqual(
      expect.objectContaining({ size: file.size }),
    );
    expect(debugFields).not.toContainEqual(
      expect.objectContaining({ fileHash: expectedFileHash }),
    );
  });

  it("returns 409 with existing document metadata when the file hash already exists", async () => {
    mocks.getDocumentByFileHash.mockReturnValueOnce({
      id: "doc-existing",
      filename: "test-resume.pdf",
      type: "resume",
      size: 5,
      path: "/tmp/test-resume.pdf",
      uploadedAt: "2024-01-01T09:00:00.000Z",
    });

    const response = await POST(uploadRequest(pdfFile()));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: "Duplicate file upload",
      existing: {
        id: "doc-existing",
        filename: "test-resume.pdf",
        uploaded_at: "2024-01-01T09:00:00.000Z",
      },
    });
    expect(mocks.saveDocument).not.toHaveBeenCalled();
  });

  it("deletes the previous source document and accepts the upload when forced", async () => {
    mocks.getDocumentByFileHash.mockReturnValueOnce({
      id: "doc-existing",
      filename: "test-resume.pdf",
      type: "resume",
      size: 5,
      path: "/tmp/test-resume.pdf",
      uploadedAt: "2024-01-01T09:00:00.000Z",
    });

    const response = await POST(
      uploadRequest(pdfFile(), "http://localhost/api/upload?force=true"),
    );

    expect(response.status).toBe(200);
    expect(mocks.deleteSourceDocuments).toHaveBeenCalledWith(
      ["doc-existing"],
      "user-1",
    );
    expect(mocks.saveDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: "test-resume.pdf",
        fileHash: expect.any(String),
      }),
      "user-1",
    );
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      entriesCreated: 1,
      document: {
        id: expect.any(String),
        filename: "test-resume.pdf",
      },
    });
    expect(mocks.populateBankFromProfile).toHaveBeenCalledWith(
      expect.objectContaining({ experiences: expect.any(Array) }),
      expect.any(String),
      "user-1",
    );
  });

  it("parses resume upload with deterministic parser only (no AI config)", async () => {
    await POST(uploadRequest(pdfFile()));

    expect(mocks.smartParseResume).toHaveBeenCalledWith("resume text", null);
    expect(mocks.classifyDocument).toHaveBeenCalledWith(
      "resume text",
      "test-resume.pdf",
      null,
    );
  });

  it("routes the classifier through the user's configured LLM provider", async () => {
    // Regression: previously the classifier received `null` even when the user
    // had configured OpenAI in /settings/llm, leaving the upstream code to
    // call Ollama via the default fallback. The classifier must now see the
    // exact provider/model the user selected.
    const userConfig = {
      provider: "openai" as const,
      model: "gpt-4o-mini",
      apiKey: "sk-user-key",
    };
    mocks.getLLMConfig.mockReturnValueOnce(userConfig);
    mocks.isLLMConfigured.mockReturnValueOnce(true);

    await POST(uploadRequest(pdfFile()));

    expect(mocks.getLLMConfig).toHaveBeenCalledWith("user-1");
    expect(mocks.isLLMConfigured).toHaveBeenCalledWith(userConfig);
    expect(mocks.classifyDocument).toHaveBeenCalledWith(
      "resume text",
      "test-resume.pdf",
      userConfig,
    );
    // Smart parser stays gated behind /api/parse — upload itself remains
    // deterministic regardless of provider config.
    expect(mocks.smartParseResume).toHaveBeenCalledWith("resume text", null);
  });

  it("passes null to the classifier when the user's LLM config is incomplete", async () => {
    // E.g. provider chosen but no apiKey + no env fallback. `isLLMConfigured`
    // returns false; the classifier must not see a half-baked config (which
    // would surface as a confusing 401/connection error from the provider).
    const incompleteConfig = {
      provider: "openai" as const,
      model: "gpt-4o-mini",
    };
    mocks.getLLMConfig.mockReturnValueOnce(incompleteConfig);
    mocks.isLLMConfigured.mockReturnValueOnce(false);

    await POST(uploadRequest(pdfFile()));

    expect(mocks.classifyDocument).toHaveBeenCalledWith(
      "resume text",
      "test-resume.pdf",
      null,
    );
  });

  it("skips smart resume parsing for non-resume documents", async () => {
    mocks.classifyDocument.mockResolvedValueOnce("cover_letter");

    const response = await POST(uploadRequest(pdfFile("cover-letter.pdf")));

    expect(response.status).toBe(200);
    expect(mocks.smartParseResume).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      entriesCreated: 0,
    });
  });

  it("auto-promotes parsed resume data into all structured profile sections", async () => {
    const parsedProfile = {
      contact: {
        name: "Ada Lovelace",
        email: "ada@example.com",
      },
      summary: "Analytical computing pioneer",
      experiences: [
        {
          id: "exp-1",
          company: "Analytical Engines",
          title: "Programmer",
          startDate: "1842",
          current: false,
          description: "Wrote notes",
          highlights: ["Wrote notes"],
          skills: ["Math"],
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Self-directed",
          degree: "Mathematics",
          field: "Computing",
          highlights: [],
        },
      ],
      skills: [
        {
          id: "skill-1",
          name: "Mathematics",
          category: "technical",
        },
      ],
      projects: [
        {
          id: "project-1",
          name: "Algorithm",
          description: "First published algorithm",
          technologies: ["Analytical Engine"],
          highlights: [],
        },
      ],
    };
    mocks.smartParseResume.mockResolvedValueOnce({
      profile: parsedProfile,
      confidence: 0.95,
      sectionsDetected: ["experience", "education", "skills", "projects"],
      llmUsed: false,
      llmSectionsCount: 0,
      warnings: [],
    });

    const response = await POST(uploadRequest(pdfFile()));

    expect(response.status).toBe(200);
    expect(mocks.populateBankFromProfile).toHaveBeenCalledWith(
      parsedProfile,
      expect.any(String),
      "user-1",
    );
    expect(mocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        contact: parsedProfile.contact,
        summary: parsedProfile.summary,
        experiences: parsedProfile.experiences,
        education: parsedProfile.education,
        skills: parsedProfile.skills,
        projects: parsedProfile.projects,
      }),
      "user-1",
    );
  });

  it("preserves manually edited contact fields during auto-promotion", async () => {
    mocks.getProfile.mockReturnValueOnce({
      id: "user-1",
      contact: {
        name: "Manual Name",
      },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    });
    mocks.smartParseResume.mockResolvedValueOnce({
      profile: {
        contact: {
          name: "Parsed Name",
          email: "parsed@example.com",
        },
      },
      confidence: 0.95,
      sectionsDetected: ["contact"],
      llmUsed: false,
      llmSectionsCount: 0,
      warnings: [],
    });

    const response = await POST(uploadRequest(pdfFile()));

    expect(response.status).toBe(200);
    expect(mocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        contact: {
          name: "Manual Name",
          email: "parsed@example.com",
        },
      }),
      "user-1",
    );
  });

  it("keeps upload successful when profile auto-promotion fails", async () => {
    mocks.updateProfile.mockImplementationOnce(() => {
      throw new Error("boom");
    });

    const response = await POST(uploadRequest(pdfFile()));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      entriesCreated: 1,
    });
    expect(mocks.saveDocument).toHaveBeenCalled();
    expect(mocks.populateBankFromProfile).toHaveBeenCalled();
  });
});
