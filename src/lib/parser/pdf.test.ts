import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock mammoth before importing the module
vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(),
  },
}));

// Mock pdf-parse
vi.mock("pdf-parse", () => ({
  default: vi.fn(),
}));

// Mock fs
vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

import mammoth from "mammoth";
import fs from "fs";
import { extractTextFromDocx, extractTextFromFile } from "./pdf";

describe("extractTextFromDocx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract text from a docx file", async () => {
    const mockBuffer = Buffer.from("fake docx content");
    vi.mocked(fs.readFileSync).mockReturnValue(mockBuffer);
    vi.mocked(mammoth.extractRawText).mockResolvedValue({
      value: "John Doe\nSoftware Engineer\nExperience: 5 years",
      messages: [],
    });

    const result = await extractTextFromDocx("/path/to/resume.docx");

    expect(result).toBe("John Doe\nSoftware Engineer\nExperience: 5 years");
    expect(mammoth.extractRawText).toHaveBeenCalledWith({ buffer: mockBuffer });
  });

  it("should resolve relative paths to absolute", async () => {
    const mockBuffer = Buffer.from("fake docx content");
    vi.mocked(fs.readFileSync).mockReturnValue(mockBuffer);
    vi.mocked(mammoth.extractRawText).mockResolvedValue({
      value: "text",
      messages: [],
    });

    await extractTextFromDocx("relative/path/resume.docx");

    const calledPath = vi.mocked(fs.readFileSync).mock.calls[0][0] as string;
    expect(calledPath).toContain("relative/path/resume.docx");
    expect(calledPath.startsWith("/")).toBe(true);
  });

  it("should return empty string for empty docx", async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(""));
    vi.mocked(mammoth.extractRawText).mockResolvedValue({
      value: "",
      messages: [],
    });

    const result = await extractTextFromDocx("/path/to/empty.docx");
    expect(result).toBe("");
  });

  it("should propagate mammoth errors", async () => {
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from("bad"));
    vi.mocked(mammoth.extractRawText).mockRejectedValue(
      new Error("Could not read DOCX file")
    );

    await expect(extractTextFromDocx("/path/to/bad.docx")).rejects.toThrow(
      "Could not read DOCX file"
    );
  });
});

describe("extractTextFromFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should route .docx files to extractTextFromDocx", async () => {
    const mockBuffer = Buffer.from("fake docx");
    vi.mocked(fs.readFileSync).mockReturnValue(mockBuffer);
    vi.mocked(mammoth.extractRawText).mockResolvedValue({
      value: "docx content",
      messages: [],
    });

    const result = await extractTextFromFile("/path/to/resume.docx");
    expect(result).toBe("docx content");
    expect(mammoth.extractRawText).toHaveBeenCalled();
  });

  it("should route .txt files to fs.readFileSync", async () => {
    vi.mocked(fs.readFileSync).mockReturnValue("plain text content" as any);

    const result = await extractTextFromFile("/path/to/resume.txt");
    expect(result).toBe("plain text content");
  });

  it("should throw for unsupported file types", async () => {
    await expect(extractTextFromFile("/path/to/file.jpg")).rejects.toThrow(
      "Unsupported file type: .jpg"
    );
  });
});
