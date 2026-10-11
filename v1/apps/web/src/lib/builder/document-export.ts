import type { PageSettings } from "@/lib/editor/page-settings";
import type { TipTapJSONContent } from "@/lib/editor/types";
import { nowDate } from "@/lib/format/time";

export const HTML_PDF_EXPORT_ENDPOINT = "/api/resume/export";
export const HTML_DOCX_EXPORT_ENDPOINT = "/api/resume/export";

type DocxExportMode = "resume" | "cover_letter";
type DocxFilenameMode = "resume" | "cover-letter";

export function createHtmlPdfExportPayload(
  html: string,
  pageSettings?: PageSettings,
): {
  html: string;
  format: "pdf";
  pageSettings?: PageSettings;
} {
  const payload = {
    html,
    format: "pdf" as const,
  };
  return pageSettings ? { ...payload, pageSettings } : payload;
}

export function createHtmlDocxExportPayload(
  content: TipTapJSONContent,
  mode: DocxExportMode,
  options: {
    templateId?: string;
    pageSettings?: PageSettings;
  } = {},
): {
  content: TipTapJSONContent;
  mode: DocxExportMode;
  format: "docx";
  templateId?: string;
  pageSettings?: PageSettings;
} {
  return {
    content,
    mode,
    format: "docx",
    ...(options.templateId ? { templateId: options.templateId } : {}),
    ...(options.pageSettings ? { pageSettings: options.pageSettings } : {}),
  };
}

export function createDocumentFilename(
  prefix: string,
  label: string | null | undefined,
  extension = "pdf",
): string {
  const safeLabel = (label || "document")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${prefix}-${safeLabel || "document"}.${extension}`;
}

export function createDatedExportFilename(
  modeType: DocxFilenameMode,
  ext: string,
  now = nowDate(),
): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `slothing-${modeType}-${year}-${month}-${day}.${ext}`;
}

export async function downloadHtmlAsPdf(
  html: string,
  filename: string,
  pageSettings?: PageSettings,
): Promise<void> {
  if (!html.trim()) {
    throw new Error("No document HTML available to export.");
  }

  const response = await fetch(HTML_PDF_EXPORT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createHtmlPdfExportPayload(html, pageSettings)),
  });

  if (!response.ok) {
    throw new Error("Failed to export PDF.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  try {
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}

export async function downloadContentAsDocx(
  content: TipTapJSONContent | null | undefined,
  filename: string,
  options: {
    mode: DocxExportMode;
    templateId?: string;
    pageSettings?: PageSettings;
  },
): Promise<void> {
  if (
    !content ||
    !Array.isArray(content.content) ||
    content.content.length === 0
  ) {
    throw new Error("No document content available to export.");
  }

  const response = await fetch(HTML_DOCX_EXPORT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      createHtmlDocxExportPayload(content, options.mode, {
        templateId: options.templateId,
        pageSettings: options.pageSettings,
      }),
    ),
  });

  if (!response.ok) {
    throw new Error("Failed to export DOCX.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  try {
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
