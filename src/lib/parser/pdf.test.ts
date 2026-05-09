import { describe, it, expect, vi } from "vitest";
import { extractTextFromDocx, extractTextFromFile } from "./pdf";
import pdfParse from "pdf-parse";

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi
      .fn()
      .mockResolvedValue({ value: "Extracted DOCX text content" }),
  },
}));

vi.mock("pdf-parse", () => ({
  default: vi.fn().mockResolvedValue({ text: "Extracted PDF text content" }),
}));

vi.mock("./ocr", () => ({
  needsOCRFallback: vi.fn().mockReturnValue(false),
  extractTextWithOCR: vi.fn().mockResolvedValue(""),
}));

vi.mock("fs", () => ({
  default: {
    readFileSync: vi
      .fn()
      .mockImplementation((_path: string, encoding?: string) => {
        if (encoding === "utf-8") return "Plain text file content";
        return Buffer.from("file content");
      }),
  },
}));

describe("extractTextFromDocx", () => {
  it("should extract text from a buffer using mammoth", async () => {
    const buffer = Buffer.from("fake docx content");
    const result = await extractTextFromDocx(buffer);
    expect(result).toBe("Extracted DOCX text content");
  });

  it("should call mammoth.extractRawText with the buffer", async () => {
    const mammoth = await import("mammoth");
    const buffer = Buffer.from("test");
    await extractTextFromDocx(buffer);
    expect(mammoth.default.extractRawText).toHaveBeenCalledWith({ buffer });
  });
});

describe("extractTextFromFile", () => {
  it("should route .docx files to DOCX extractor", async () => {
    const result = await extractTextFromFile("/tmp/resume.docx");
    expect(result).toBe("Extracted DOCX text content");
  });

  it("should route .pdf files to PDF extractor", async () => {
    const result = await extractTextFromFile("/tmp/resume.pdf");
    expect(result).toBe("Extracted PDF text content");
  });

  it("cleans UTF-16 PDF extraction artifacts", async () => {
    vi.mocked(pdfParse).mockResolvedValueOnce({
      text: "þÿ\0J\0o\0r\0d\0a\0n\nþÿ\0E\0X\0P\0E\0R\0I\0E\0N\0C\0E",
    } as Awaited<ReturnType<typeof pdfParse>>);

    const result = await extractTextFromFile("/tmp/resume.pdf");

    expect(result).toBe("Jordan\nEXPERIENCE");
  });

  it("cleans stray PDF accent artifacts inside technical terms", async () => {
    vi.mocked(pdfParse).mockResolvedValueOnce({
      text: "teleoperation of an 8Í-DOF robotic arm",
    } as Awaited<ReturnType<typeof pdfParse>>);

    const result = await extractTextFromFile("/tmp/resume.pdf");

    expect(result).toBe("teleoperation of an 8-DOF robotic arm");
  });

  it("should route .txt files to text reader", async () => {
    const result = await extractTextFromFile("/tmp/resume.txt");
    expect(typeof result).toBe("string");
  });

  it("should throw for unsupported file types", async () => {
    await expect(extractTextFromFile("/tmp/resume.jpg")).rejects.toThrow(
      "Unsupported file type: .jpg",
    );
  });
});
