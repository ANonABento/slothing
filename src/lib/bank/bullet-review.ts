import type { BankEntry } from "@/types";

export function getBankEntryParentId(entry: BankEntry): string | null {
  const parentId = entry.content.parentId;
  return typeof parentId === "string" && parentId.trim() ? parentId : null;
}

export function isBulletParent(entry: BankEntry): boolean {
  return entry.category === "experience" || entry.category === "project";
}

export function getBulletReviewReason(
  entry: BankEntry,
  entries: BankEntry[],
): string | null {
  if (entry.category !== "bullet") return null;

  const parentId = getBankEntryParentId(entry);
  if (!parentId) return "Missing parent";

  const parent = entries.find((candidate) => candidate.id === parentId);
  if (!parent) return "Parent not found";
  if (!isBulletParent(parent)) return "Invalid parent";

  const expectedParentType = parent.category;
  const parentType = stringValue(entry.content.parentType);
  const componentType = stringValue(entry.content.componentType);
  if (parentType && parentType !== expectedParentType) {
    return "Parent type mismatch";
  }
  if (componentType && componentType !== expectedParentType) {
    return "Parent type mismatch";
  }

  const sourceSection = normalizeSection(
    stringValue(entry.content.sourceSection),
  );
  if (
    sourceSection &&
    ((parent.category === "experience" && sourceSection !== "experience") ||
      (parent.category === "project" && sourceSection !== "project"))
  ) {
    return "Source section mismatch";
  }

  const parentLabel = stringValue(entry.content.parentLabel);
  if (
    parentLabel &&
    normalizeLabel(parentLabel) !== normalizeLabel(getEntryLabel(parent))
  ) {
    return "Parent label mismatch";
  }

  const parentKey = stringValue(entry.content.parentKey);
  if (parentKey && normalizeParentKey(parentKey) !== getParentKey(parent)) {
    return "Parent key mismatch";
  }

  if (
    parent.category === "experience" &&
    stringValue(entry.content.company) &&
    normalizeLabel(stringValue(entry.content.company)) !==
      normalizeLabel(stringValue(parent.content.company))
  ) {
    return "Parent company mismatch";
  }

  if (
    parent.category === "project" &&
    stringValue(entry.content.project) &&
    normalizeLabel(stringValue(entry.content.project)) !==
      normalizeLabel(stringValue(parent.content.name))
  ) {
    return "Parent project mismatch";
  }

  return null;
}

export function isBulletNeedsReview(
  entry: BankEntry,
  entries: BankEntry[],
): boolean {
  return getBulletReviewReason(entry, entries) !== null;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSection(value: string): string {
  const normalized = normalizeLabel(value);
  if (
    ["experience", "experiences", "work experience", "employment"].includes(
      normalized,
    )
  ) {
    return "experience";
  }
  if (["project", "projects"].includes(normalized)) {
    return "project";
  }
  return normalized;
}

function getEntryLabel(entry: BankEntry): string {
  const title = stringValue(entry.content.title);
  const company = stringValue(entry.content.company);
  const name = stringValue(entry.content.name);

  if (title || company) return [title, company].filter(Boolean).join(" at ");
  return name || "Component";
}

function getParentKey(entry: BankEntry): string {
  const company = stringValue(entry.content.company);
  const title = stringValue(entry.content.title);
  const startDate = stringValue(entry.content.startDate);
  const name = stringValue(entry.content.name);

  return [company, title, startDate, name]
    .filter(Boolean)
    .map((part) => normalizeLabel(part))
    .join("|");
}

function normalizeParentKey(value: string): string {
  return value.split("|").map(normalizeLabel).filter(Boolean).join("|");
}
