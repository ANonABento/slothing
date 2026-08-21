/**
 * Transport for the tex editor.
 *
 * Every HTTP outcome is normalized into a discriminated union here, so the reducer and the
 * hook never touch a `Response`, a status code, or a thrown fetch. That is what makes the
 * failure paths — 422 compile error, 503 no engine, 429 rate limited, 409 evicted cache —
 * testable by stubbing `fetch` and asserting a plain object.
 */
import type { CompileLog } from "@/lib/latex/compile";
import type { HitMap } from "@/lib/latex/hitmap";

export type CompileMode = "preview" | "export";

export type CompileOutcome =
  | { ok: true; key: string; hitMap: HitMap | null; log: CompileLog }
  | { ok: false; kind: "compile_failed"; log: CompileLog }
  | { ok: false; kind: "engine_unavailable"; message: string }
  | { ok: false; kind: "rate_limited"; retryAfterMs: number }
  | { ok: false; kind: "network"; message: string };

export type SaveOutcome =
  | { ok: true; updatedAt: string }
  | { ok: false; message: string };

export type PdfOutcome =
  | { ok: true; bytes: Uint8Array }
  | { ok: false; kind: "stale_key" }
  | { ok: false; kind: "network"; message: string };

export interface TexEditorTransport {
  fetch: typeof fetch;
}

const defaultTransport: TexEditorTransport = {
  fetch: (...args) => fetch(...args),
};

/** Backoff for a rate-limited compile: 2s, 4s, 8s, capped. */
export function rateLimitDelayMs(failureStreak: number): number {
  return Math.min(8000, 2000 * 2 ** Math.max(0, failureStreak - 1));
}

function networkMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Network request failed";
}

export async function compileDocument(
  documentId: string,
  source: string,
  mode: CompileMode,
  options: { signal?: AbortSignal; transport?: TexEditorTransport } = {},
): Promise<CompileOutcome> {
  const transport = options.transport ?? defaultTransport;
  let response: Response;

  try {
    response = await transport.fetch(
      `/api/tex-documents/${encodeURIComponent(documentId)}/compile`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, source }),
        signal: options.signal,
      },
    );
  } catch (error) {
    return { ok: false, kind: "network", message: networkMessage(error) };
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await response.json()) as Record<string, unknown>;
  } catch {
    // A body-less error response is still a usable signal via its status.
  }

  if (response.ok) {
    return {
      ok: true,
      key: String(body.key ?? ""),
      hitMap: (body.hitMap as HitMap | null) ?? null,
      log: body.log as CompileLog,
    };
  }

  if (response.status === 503) {
    return {
      ok: false,
      kind: "engine_unavailable",
      message: String(body.error ?? "No LaTeX engine is available."),
    };
  }
  if (response.status === 429) {
    const header = Number(response.headers.get("retry-after"));
    return {
      ok: false,
      kind: "rate_limited",
      retryAfterMs:
        Number.isFinite(header) && header > 0 ? header * 1000 : 2000,
    };
  }
  if (response.status === 422) {
    return { ok: false, kind: "compile_failed", log: body.log as CompileLog };
  }
  return {
    ok: false,
    kind: "network",
    message: String(body.error ?? `Compile failed (${response.status})`),
  };
}

export async function saveDocument(
  documentId: string,
  source: string,
  options: {
    label?: string;
    signal?: AbortSignal;
    keepalive?: boolean;
    transport?: TexEditorTransport;
  } = {},
): Promise<SaveOutcome> {
  const transport = options.transport ?? defaultTransport;

  try {
    const response = await transport.fetch(
      `/api/tex-documents/${encodeURIComponent(documentId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          options.label ? { source, label: options.label } : { source },
        ),
        signal: options.signal,
        keepalive: options.keepalive,
      },
    );

    if (!response.ok) {
      return { ok: false, message: `Could not save (${response.status})` };
    }
    const body = (await response.json()) as {
      document?: { updatedAt?: string };
    };
    return { ok: true, updatedAt: body.document?.updatedAt ?? "" };
  } catch (error) {
    return { ok: false, message: networkMessage(error) };
  }
}

export async function fetchPdfByKey(
  documentId: string,
  key: string,
  options: { signal?: AbortSignal; transport?: TexEditorTransport } = {},
): Promise<PdfOutcome> {
  const transport = options.transport ?? defaultTransport;

  try {
    const response = await transport.fetch(
      `/api/tex-documents/${encodeURIComponent(documentId)}/pdf?key=${encodeURIComponent(key)}`,
      { signal: options.signal },
    );

    // The cache entry was evicted. Recompiling regenerates it — a self-healing path.
    if (response.status === 409) return { ok: false, kind: "stale_key" };
    if (!response.ok) {
      return {
        ok: false,
        kind: "network",
        message: `Could not load the preview (${response.status})`,
      };
    }
    return { ok: true, bytes: new Uint8Array(await response.arrayBuffer()) };
  } catch (error) {
    return { ok: false, kind: "network", message: networkMessage(error) };
  }
}

export interface AiProposalOutcome {
  original: string;
  proposal: string;
  applied: boolean;
  ungroundedNumbers: string[];
  sources: string[];
  usedJobContext: boolean;
}

/**
 * Ask for a grounded revision of one field. Returns a PROPOSAL — nothing is written until
 * the user accepts it, at which point it goes through the normal field-write path.
 */
export async function requestAiRevision(
  documentId: string,
  input: {
    spanId: string;
    fieldIndex: number;
    action: string;
    source: string;
  },
  options: { transport?: TexEditorTransport } = {},
): Promise<AiProposalOutcome> {
  const transport = options.transport ?? defaultTransport;
  const response = await transport.fetch(
    `/api/tex-documents/${encodeURIComponent(documentId)}/ai/revise`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!response.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "The AI request failed.",
    );
  }
  return body as unknown as AiProposalOutcome;
}

export type AnnotateOutcome =
  | {
      ok: true;
      annotated: string;
      spanCount: number;
      summary: string;
    }
  | {
      ok: false;
      reason: string;
      issues: Array<{ code: string; message: string }>;
    };

/**
 * Ask for structural annotation of an imported document. Returns a PROPOSAL — the
 * document is only changed if the user accepts it.
 */
export async function requestAnnotation(
  documentId: string,
  source: string,
  options: { transport?: TexEditorTransport } = {},
): Promise<AnnotateOutcome> {
  const transport = options.transport ?? defaultTransport;
  const response = await transport.fetch(
    `/api/tex-documents/${encodeURIComponent(documentId)}/annotate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    },
  );

  const body = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!response.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Annotation failed.",
    );
  }
  return body as unknown as AnnotateOutcome;
}

/** The URL for a download. Export always follows a save, so the saved-source key matches. */
export function exportDownloadUrl(documentId: string): string {
  return `/api/tex-documents/${encodeURIComponent(documentId)}/pdf?mode=export&download=true`;
}
