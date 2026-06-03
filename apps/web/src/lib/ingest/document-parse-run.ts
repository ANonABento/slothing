import {
  getDocumentArtifact,
  getLatestDocumentArtifact,
  type DocumentArtifact,
} from "@/lib/db/document-artifacts";
import {
  saveDocumentParseRun,
  type DocumentParseRun,
  type ParseWarning,
} from "@/lib/db/document-parse-runs";
import type { LLMConfig } from "@/types";
import { normalizeAiSourceCitedParseResult } from "./ai-parse-run-normalizer";
import { parseResumeWithAiSourceCitations } from "./ai-source-cited-parser";
import { parseResumeV2FromSourceMap } from "@/lib/ingest/parse-resume-v2";

export class DocumentParseRunError extends Error {
  readonly status: number;
  readonly publicMessage: string;

  constructor(publicMessage: string, status = 500, cause?: unknown) {
    super(publicMessage);
    this.name = "DocumentParseRunError";
    this.status = status;
    this.publicMessage = publicMessage;
    this.cause = cause;
  }
}

export interface CreateBasicDocumentParseRunInput {
  documentId: string;
  userId: string;
  artifactId?: string;
}

export interface CreateAiDocumentParseRunInput extends CreateBasicDocumentParseRunInput {
  llmConfig: LLMConfig;
}

export async function resolveReadyDocumentArtifact({
  documentId,
  userId,
  artifactId,
}: CreateBasicDocumentParseRunInput): Promise<DocumentArtifact> {
  const artifact = artifactId
    ? await getDocumentArtifact(artifactId, userId)
    : await getLatestDocumentArtifact(documentId, userId);

  if (!artifact || artifact.documentId !== documentId) {
    throw new DocumentParseRunError("Document artifact not found", 404);
  }
  if (artifact.status === "failed") {
    throw new DocumentParseRunError("Document artifact is not ready", 409);
  }
  return artifact;
}

export async function createBasicDocumentParseRun({
  documentId,
  userId,
  artifactId,
}: CreateBasicDocumentParseRunInput): Promise<DocumentParseRun> {
  try {
    const artifact = await resolveReadyDocumentArtifact({
      documentId,
      userId,
      artifactId,
    });

    const structured = parseResumeV2FromSourceMap(artifact.sourceMap);
    const warnings: ParseWarning[] = structured.warnings.map((message) => ({
      code: "parser_warning",
      message,
      severity: "warning",
    }));

    return await saveDocumentParseRun({
      documentId,
      artifactId: artifact.id,
      userId,
      mode: "basic",
      status: "ready",
      confidence: structured.confidence,
      warnings,
      structured,
    });
  } catch (error) {
    if (error instanceof DocumentParseRunError) throw error;
    throw new DocumentParseRunError(
      "Failed to create document parse run",
      500,
      error,
    );
  }
}

export async function createAiDocumentParseRun({
  documentId,
  userId,
  artifactId,
  llmConfig,
}: CreateAiDocumentParseRunInput): Promise<DocumentParseRun> {
  try {
    const artifact = await resolveReadyDocumentArtifact({
      documentId,
      userId,
      artifactId,
    });
    const result = await parseResumeWithAiSourceCitations({
      sourceMap: artifact.sourceMap,
      llmConfig,
    });
    const structured = normalizeAiSourceCitedParseResult(
      result,
      artifact.sourceMap,
    );
    const warnings: ParseWarning[] = result.validation.warnings.map(
      (warning) => ({
        code: warning.code,
        message: warning.message,
        sourceSpanIds: warning.sourceSpanIds,
        severity: "warning",
      }),
    );

    return await saveDocumentParseRun({
      documentId,
      artifactId: artifact.id,
      userId,
      mode: "ai",
      parserVersion: "ai-source-cited-v1",
      status: "ready",
      confidence: structured.confidence,
      warnings,
      structured,
    });
  } catch (error) {
    if (error instanceof DocumentParseRunError) throw error;
    throw new DocumentParseRunError(
      "Failed to create AI document parse run",
      500,
      error,
    );
  }
}
