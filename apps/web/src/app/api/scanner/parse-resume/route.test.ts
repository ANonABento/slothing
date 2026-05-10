import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  parsePdfResume: vi.fn(),
  parseResumeText: vi.fn(),
}));

vi.mock("@/lib/parsers/pdf-resume", () => ({
  parsePdfResume: mocks.parsePdfResume,
  parseResumeText: mocks.parseResumeText,
}));

import { POST } from "./route";

function requestWithFile(file: FileLike, ip = "203.0.113.10") {
  const body = {
    get: (key: string) => (key === "file" ? file : null),
  };
  return {
    headers: new Headers({ "x-forwarded-for": ip }),
    formData: async () => body,
  } as unknown as NextRequest;
}

interface FileLike {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

function scannerFile(
  bytes: Buffer | Uint8Array,
  name: string,
  type: string,
): FileLike {
  const buffer = Buffer.from(bytes);
  return {
    name,
    type,
    size: buffer.byteLength,
    arrayBuffer: async () =>
      buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ) as ArrayBuffer,
  };
}

function jsonRequest(body: unknown, ip = "203.0.113.11") {
  return new NextRequest("http://localhost/api/scanner/parse-resume", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
  });
}

function parsedResult(rawText = "Jordan Resume") {
  return {
    profile: { contact: { name: "Jordan", email: "jordan@example.com" } },
    sectionsDetected: ["contact", "experience"],
    confidence: 0.82,
    rawText,
    warnings: [],
  };
}

describe("scanner parse-resume route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.parsePdfResume.mockResolvedValue(parsedResult());
    mocks.parseResumeText.mockReturnValue(parsedResult("plain text"));
  });

  it("parses a PDF upload without requiring auth and omits rawText", async () => {
    const file = scannerFile(
      Buffer.from("%PDF-1.7\nresume"),
      "resume.pdf",
      "application/pdf",
    );

    const response = await POST(requestWithFile(file));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.parsePdfResume).toHaveBeenCalled();
    expect(body).toEqual({
      profile: { contact: { name: "Jordan", email: "jordan@example.com" } },
      sectionsDetected: ["contact", "experience"],
      confidence: 0.82,
      warnings: [],
    });
    expect(body.rawText).toBeUndefined();
  });

  it("supports text fallback requests", async () => {
    const response = await POST(jsonRequest({ text: "Jordan\nExperience" }));

    expect(response.status).toBe(200);
    expect(mocks.parseResumeText).toHaveBeenCalledWith("Jordan\nExperience");
  });

  it("rejects oversized files", async () => {
    const file = scannerFile(
      new Uint8Array(5 * 1024 * 1024 + 1),
      "resume.pdf",
      "application/pdf",
    );

    const response = await POST(requestWithFile(file, "203.0.113.12"));

    expect(response.status).toBe(413);
  });

  it("rejects unsupported MIME types", async () => {
    const file = scannerFile(
      Buffer.from("hello"),
      "resume.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    const response = await POST(requestWithFile(file, "203.0.113.13"));

    expect(response.status).toBe(415);
  });

  it("enforces IP rate limits", async () => {
    let response = new Response(null);
    for (let i = 0; i < 61; i++) {
      response = await POST(
        jsonRequest({ text: "Jordan\nExperience" }, "203.0.113.99"),
      );
    }

    expect(response.status).toBe(429);
  });
});
