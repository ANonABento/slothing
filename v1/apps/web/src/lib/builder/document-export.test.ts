import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createDatedExportFilename,
  createDocumentFilename,
  createHtmlDocxExportPayload,
  createHtmlPdfExportPayload,
  downloadContentAsDocx,
  downloadHtmlAsPdf,
  HTML_DOCX_EXPORT_ENDPOINT,
  HTML_PDF_EXPORT_ENDPOINT,
} from "./document-export";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("createHtmlPdfExportPayload", () => {
  it("builds the resume export API PDF payload", () => {
    expect(createHtmlPdfExportPayload("<html>Doc</html>")).toEqual({
      html: "<html>Doc</html>",
      format: "pdf",
    });
  });

  it("includes page settings when exporting editor documents", () => {
    const pageSettings = {
      size: "letter" as const,
      marginPreset: "narrow" as const,
      margins: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
    };

    expect(
      createHtmlPdfExportPayload("<html>Doc</html>", pageSettings),
    ).toEqual({
      html: "<html>Doc</html>",
      format: "pdf",
      pageSettings,
    });
  });
});

describe("createHtmlDocxExportPayload", () => {
  it("builds the Studio DOCX export API payload", () => {
    const content = { type: "doc", content: [{ type: "paragraph" }] };

    expect(
      createHtmlDocxExportPayload(content, "resume", {
        templateId: "classic",
      }),
    ).toEqual({
      content,
      mode: "resume",
      format: "docx",
      templateId: "classic",
    });
  });

  it("includes page settings when exporting DOCX files", () => {
    const content = { type: "doc", content: [{ type: "paragraph" }] };
    const pageSettings = {
      size: "a4" as const,
      marginPreset: "narrow" as const,
      margins: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 },
    };

    expect(
      createHtmlDocxExportPayload(content, "cover_letter", {
        pageSettings,
      }),
    ).toEqual({
      content,
      mode: "cover_letter",
      format: "docx",
      pageSettings,
    });
  });
});

describe("createDocumentFilename", () => {
  it("normalizes labels into stable PDF filenames", () => {
    expect(createDocumentFilename("resume", "Senior Engineer / Acme")).toBe(
      "resume-senior-engineer-acme.pdf",
    );
  });

  it("falls back when the label has no filename-safe characters", () => {
    expect(createDocumentFilename("cover-letter", "!!!")).toBe(
      "cover-letter-document.pdf",
    );
  });

  it("supports custom extensions", () => {
    expect(createDocumentFilename("cover-letter", "Acme", "html")).toBe(
      "cover-letter-acme.html",
    );
  });
});

describe("createDatedExportFilename", () => {
  it("creates Slothing DOCX filenames with a local calendar date", () => {
    expect(
      createDatedExportFilename("resume", "docx", new Date(2026, 4, 10, 12)),
    ).toBe("slothing-resume-2026-05-10.docx");
  });
});

describe("downloadHtmlAsPdf", () => {
  it("posts HTML to the PDF export endpoint and clicks a download link", async () => {
    const blob = new Blob(["pdf"], { type: "application/pdf" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => blob,
    });
    vi.stubGlobal("fetch", fetchMock);
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:document");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await downloadHtmlAsPdf("<html>Doc</html>", "document.pdf");

    expect(fetchMock).toHaveBeenCalledWith(HTML_PDF_EXPORT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: "<html>Doc</html>",
        format: "pdf",
      }),
    });
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:document");
  });

  it("rejects blank HTML before calling the export endpoint", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(downloadHtmlAsPdf("  ", "document.pdf")).rejects.toThrow(
      "No document HTML available to export.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws when the PDF export endpoint fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        blob: async () => new Blob(),
      }),
    );

    await expect(
      downloadHtmlAsPdf("<html>Doc</html>", "document.pdf"),
    ).rejects.toThrow("Failed to export PDF.");
  });
});

describe("downloadContentAsDocx", () => {
  it("posts TipTap JSON to the DOCX endpoint and clicks a download link", async () => {
    const content = { type: "doc", content: [{ type: "paragraph" }] };
    const blob = new Blob(["docx"], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => blob,
    });
    vi.stubGlobal("fetch", fetchMock);
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:document");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    await downloadContentAsDocx(content, "document.docx", {
      mode: "resume",
      templateId: "classic",
    });

    expect(fetchMock).toHaveBeenCalledWith(HTML_DOCX_EXPORT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        mode: "resume",
        format: "docx",
        templateId: "classic",
      }),
    });
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:document");
  });

  it("rejects blank DOCX content before calling the export endpoint", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      downloadContentAsDocx({ type: "doc", content: [] }, "document.docx", {
        mode: "resume",
      }),
    ).rejects.toThrow("No document content available to export.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws when the DOCX export endpoint fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        blob: async () => new Blob(),
      }),
    );

    await expect(
      downloadContentAsDocx(
        { type: "doc", content: [{ type: "paragraph" }] },
        "document.docx",
        { mode: "resume" },
      ),
    ).rejects.toThrow("Failed to export DOCX.");
  });
});
