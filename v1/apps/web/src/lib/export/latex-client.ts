/**
 * Client-side helper that posts a Tiptap-rendered HTML string to
 * `/api/export/latex` and triggers a browser download of the resulting `.tex`
 * file.
 *
 * Designed to be wired into the Studio sub-bar's "LaTeX (.tex)" export action.
 */

export interface DownloadLatexOptions {
  /**
   * Document title — used for the LaTeX `pdftitle` metadata. Has no effect on
   * the suggested filename; pass `filename` for that.
   */
  title?: string;
  /**
   * Override fetch (useful in tests). Defaults to the global `fetch`.
   */
  fetchImpl?: typeof fetch;
}

export class LatexExportError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "LatexExportError";
    this.status = status;
  }
}

/**
 * POST `{ html, filename, title }` to `/api/export/latex` and trigger a
 * browser download. Resolves once the download has been kicked off; throws
 * `LatexExportError` if the request fails or if the browser environment is
 * missing required APIs.
 */
export async function downloadLatex(
  html: string,
  filename: string = "resume.tex",
  options: DownloadLatexOptions = {},
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new LatexExportError("downloadLatex must be called in the browser");
  }
  if (!html || !html.trim()) {
    throw new LatexExportError("Cannot export an empty document");
  }

  const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);

  let response: Response;
  try {
    response = await fetchImpl("/api/export/latex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename, title: options.title }),
    });
  } catch (err) {
    throw new LatexExportError(
      err instanceof Error ? err.message : "Network error",
    );
  }

  if (!response.ok) {
    let message = `LaTeX export failed (${response.status})`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore — non-JSON error body
    }
    throw new LatexExportError(message, response.status);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename.toLowerCase().endsWith(".tex")
      ? filename
      : `${filename}.tex`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    URL.revokeObjectURL(url);
  }
}
