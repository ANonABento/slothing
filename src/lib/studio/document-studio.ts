import {
  createInitialSections,
  type SectionState,
} from "@/lib/builder/section-manager";
import { BANK_CATEGORIES, type BankCategory } from "@/types";

export const STUDIO_DOCUMENT_MODES = ["resume", "cover-letter"] as const;

export type StudioDocumentType = (typeof STUDIO_DOCUMENT_MODES)[number];
export type StudioDocumentMode = StudioDocumentType;

export interface StudioDocument {
  id: string;
  name: string;
  type: StudioDocumentType;
  templateId: string;
  content: string;
  sections: SectionState[];
  selectedEntryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export const STUDIO_ROUTE = "/studio";
export const STUDIO_MODE_SEARCH_PARAM = "mode";
export const STUDIO_DOCUMENT_STORAGE_KEY = "studio.documents.v1";
export const DEFAULT_STUDIO_DOCUMENT_MODE: StudioDocumentMode = "resume";
export const DEFAULT_STUDIO_TEMPLATE_ID = "classic";

const DEFAULT_STUDIO_CONTENT: Record<StudioDocumentType, string> = {
  resume: "",
  "cover-letter": "",
};

const DEFAULT_STUDIO_DOCUMENT_NAMES: Record<StudioDocumentType, string> = {
  resume: "Untitled Resume",
  "cover-letter": "Untitled Cover Letter",
};

interface CreateStudioDocumentOptions {
  id?: string;
  name?: string;
  now?: string;
  templateId?: string;
  content?: string;
  sections?: SectionState[];
  selectedEntryIds?: string[];
}

function getNow() {
  return new Date().toISOString();
}

function createDocumentId(type: StudioDocumentType) {
  const randomValue =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${type}-${randomValue}`;
}

function isBankCategory(value: unknown): value is BankCategory {
  return (
    typeof value === "string" &&
    BANK_CATEGORIES.includes(value as BankCategory)
  );
}

export function isStudioDocumentMode(
  value: string | null | undefined
): value is StudioDocumentMode {
  return STUDIO_DOCUMENT_MODES.includes(value as StudioDocumentMode);
}

export function getStudioModeFromSearchParam(
  value: string | null | undefined
): StudioDocumentMode {
  return isStudioDocumentMode(value) ? value : DEFAULT_STUDIO_DOCUMENT_MODE;
}

export function getStudioModeHref(mode: StudioDocumentMode): string {
  return mode === DEFAULT_STUDIO_DOCUMENT_MODE
    ? STUDIO_ROUTE
    : `${STUDIO_ROUTE}?${STUDIO_MODE_SEARCH_PARAM}=${mode}`;
}

export function getDefaultStudioContent(mode: StudioDocumentMode): string {
  return DEFAULT_STUDIO_CONTENT[mode];
}

export function createStudioDocument(
  type: StudioDocumentType,
  options: CreateStudioDocumentOptions = {}
): StudioDocument {
  const now = options.now ?? getNow();
  return {
    id: options.id ?? createDocumentId(type),
    name: options.name ?? DEFAULT_STUDIO_DOCUMENT_NAMES[type],
    type,
    templateId: options.templateId ?? DEFAULT_STUDIO_TEMPLATE_ID,
    content: options.content ?? getDefaultStudioContent(type),
    sections: options.sections ?? createInitialSections(),
    selectedEntryIds: options.selectedEntryIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

function isSectionState(value: unknown): value is SectionState {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "visible" in value &&
    isBankCategory((value as { id: unknown }).id) &&
    typeof (value as { visible: unknown }).visible === "boolean"
  );
}

function normalizeDocument(value: unknown): StudioDocument | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<StudioDocument>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    !isStudioDocumentMode(candidate.type) ||
    typeof candidate.createdAt !== "string" ||
    typeof candidate.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name.trim() || DEFAULT_STUDIO_DOCUMENT_NAMES[candidate.type],
    type: candidate.type,
    templateId:
      typeof candidate.templateId === "string"
        ? candidate.templateId
        : DEFAULT_STUDIO_TEMPLATE_ID,
    content: typeof candidate.content === "string" ? candidate.content : "",
    sections:
      Array.isArray(candidate.sections) && candidate.sections.every(isSectionState)
        ? candidate.sections
        : createInitialSections(),
    selectedEntryIds: Array.isArray(candidate.selectedEntryIds)
      ? candidate.selectedEntryIds.filter((id): id is string => typeof id === "string")
      : [],
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
}

export function ensureStudioDocuments(
  documents: StudioDocument[],
  now = getNow()
): StudioDocument[] {
  const normalized = documents.filter(
    (document, index, list) =>
      list.findIndex((candidate) => candidate.id === document.id) === index
  );

  for (const type of STUDIO_DOCUMENT_MODES) {
    if (!normalized.some((document) => document.type === type)) {
      normalized.push(createStudioDocument(type, { now }));
    }
  }

  return normalized;
}

export function parseStudioDocuments(value: string | null): StudioDocument[] {
  if (!value) return ensureStudioDocuments([]);

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return ensureStudioDocuments([]);
    return ensureStudioDocuments(
      parsed
        .map((document) => normalizeDocument(document))
        .filter((document): document is StudioDocument => Boolean(document))
    );
  } catch {
    return ensureStudioDocuments([]);
  }
}

export function loadStudioDocuments(storage: Storage | undefined): StudioDocument[] {
  if (!storage) return ensureStudioDocuments([]);
  return parseStudioDocuments(storage.getItem(STUDIO_DOCUMENT_STORAGE_KEY));
}

export function saveStudioDocuments(
  storage: Storage | undefined,
  documents: StudioDocument[]
): void {
  if (!storage) return;
  storage.setItem(STUDIO_DOCUMENT_STORAGE_KEY, JSON.stringify(documents));
}

export function getDocumentsForType(
  documents: StudioDocument[],
  type: StudioDocumentType
): StudioDocument[] {
  return documents.filter((document) => document.type === type);
}

export function getActiveStudioDocument(
  documents: StudioDocument[],
  type: StudioDocumentType,
  activeId?: string
): StudioDocument {
  const typeDocuments = getDocumentsForType(documents, type);
  return (
    typeDocuments.find((document) => document.id === activeId) ??
    typeDocuments[0] ??
    createStudioDocument(type)
  );
}

export function renameStudioDocument(
  documents: StudioDocument[],
  id: string,
  name: string,
  now = getNow()
): StudioDocument[] {
  const nextName = name.trim();
  if (!nextName) return documents;

  return documents.map((document) =>
    document.id === id
      ? { ...document, name: nextName, updatedAt: now }
      : document
  );
}

export function updateStudioDocument(
  documents: StudioDocument[],
  id: string,
  updates: Partial<
    Pick<
      StudioDocument,
      "content" | "sections" | "selectedEntryIds" | "templateId"
    >
  >,
  now = getNow()
): StudioDocument[] {
  let changed = false;
  const nextDocuments = documents.map((document) => {
    if (document.id !== id) return document;

    const hasUpdates = Object.entries(updates).some(
      ([key, value]) => document[key as keyof StudioDocument] !== value
    );
    if (!hasUpdates) return document;

    changed = true;
    return { ...document, ...updates, updatedAt: now };
  });

  if (!changed) return documents;
  return nextDocuments;
}

export function deleteStudioDocument(
  documents: StudioDocument[],
  id: string,
  now = getNow()
): { documents: StudioDocument[]; activeDocument: StudioDocument } {
  const deletedDocument = documents.find((document) => document.id === id);
  if (!deletedDocument) {
    const activeDocument = getActiveStudioDocument(documents, "resume");
    return { documents, activeDocument };
  }

  const remaining = documents.filter((document) => document.id !== id);
  const sameTypeRemaining = getDocumentsForType(remaining, deletedDocument.type);
  if (sameTypeRemaining.length > 0) {
    return { documents: remaining, activeDocument: sameTypeRemaining[0] };
  }

  const replacement = createStudioDocument(deletedDocument.type, { now });
  return {
    documents: [...remaining, replacement],
    activeDocument: replacement,
  };
}
