import { readFile } from "node:fs/promises";
import type { DocumentArtifact, DocumentParseRun } from "@/lib/db";
import { saveDocumentArtifact } from "@/lib/db";
import {
  createParserV2Diagnostic,
  createParserV2SourceRefs,
  isParsedResumeV2Result,
} from "./diagnostics";
import { extractDocumentSourceMap } from "./extract-document";
import { createBasicDocumentParseRun } from "./document-parse-run";
import { buildParseRunReviewEntries } from "./parse-run-bank-import";
import {
  parseDocumentUploadType,
  persistDocumentUpload,
  type PersistDocumentUploadResult,
} from "./document-upload";
import type { BankEntry, Document } from "@/types";

export interface ParserV2UploadReviewInput {
  file: File;
  userId: string;
  documentType?: FormDataEntryValue | null;
  replaceExisting?: boolean;
}

export interface ParserV2UploadReviewResult {
  upload: PersistDocumentUploadResult;
  document: Document;
  artifact?: DocumentArtifact;
  parseRun?: DocumentParseRun;
  entries: BankEntry[];
  sourceText: string;
  sourceRefs: ReturnType<typeof createParserV2SourceRefs>;
  diagnostic: ReturnType<typeof createParserV2Diagnostic> | null;
}

export async function createParserV2UploadReview({
  file,
  userId,
  documentType,
  replaceExisting = false,
}: ParserV2UploadReviewInput): Promise<ParserV2UploadReviewResult> {
  const upload = await persistDocumentUpload({
    file,
    userId,
    documentType: parseDocumentUploadType(documentType ?? "resume"),
    replaceExisting,
  });

  if (upload.duplicate) {
    return {
      upload,
      document: upload.document,
      entries: [],
      sourceText: "",
      sourceRefs: [],
      diagnostic: null,
    };
  }

  const buffer = await readFile(upload.document.path);
  const extracted = await extractDocumentSourceMap({
    buffer,
    filename: upload.document.filename,
    mimeType: upload.document.mimeType,
  });
  const artifact = saveDocumentArtifact({
    documentId: upload.document.id,
    userId,
    extractorVersion: extracted.extractorVersion,
    status: "ready",
    sourceMap: extracted.sourceMap,
    links: extracted.links,
    ocrUsed: extracted.ocrUsed,
  });
  const parseRun = createBasicDocumentParseRun({
    documentId: upload.document.id,
    userId,
    artifactId: artifact.id,
  });
  if (!isParsedResumeV2Result(parseRun.structured)) {
    throw new Error("Parser-v2 parse run did not return resume structure");
  }
  const entries = buildParseRunReviewEntries({
    parseRun,
    sourceMap: artifact.sourceMap,
  });

  return {
    upload,
    document: upload.document,
    artifact,
    parseRun,
    entries,
    sourceText: artifact.sourceMap.rawText,
    sourceRefs: createParserV2SourceRefs(
      artifact.sourceMap,
      parseRun.structured,
    ),
    diagnostic: createParserV2Diagnostic(
      artifact.sourceMap,
      parseRun.structured,
    ),
  };
}
