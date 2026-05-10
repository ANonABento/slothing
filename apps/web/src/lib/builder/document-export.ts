import type { PageSettings } from "@/lib/editor/page-settings";

export const HTML_PDF_EXPORT_ENDPOINT = "/api/resume/export";

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

export function createDocumentFilename(
  prefix: string,
  label: string | null | undefined,
  extension = "pdf"
): string {
  const safeLabel = (label || "document")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${prefix}-${safeLabel || "document"}.${extension}`;
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
