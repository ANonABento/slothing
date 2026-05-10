import type { BuilderDraftState } from "@/lib/builder/version-history";
import {
  diffWords,
  summarizeWordDiff,
  type WordDiffCounts,
  type WordDiffSegment,
} from "@/lib/diff/word-diff";
import type { TipTapJSONContent } from "@/lib/editor/types";

export interface ComparableStudioSection {
  id: string;
  label: string;
  text: string;
}

export interface StudioDiffSection {
  id: string;
  label: string;
  comparedText: string;
  currentText: string;
  segments: WordDiffSegment[];
  counts: WordDiffCounts;
}

export interface StudioDocumentDiff {
  sections: StudioDiffSection[];
  totals: WordDiffCounts;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripHtml(html: string): string {
  return normalizeText(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'"),
  );
}

function nodeText(node: TipTapJSONContent | undefined): string {
  if (!node) return "";
  const ownText = typeof node.text === "string" ? node.text : "";
  const childText = Array.isArray(node.content)
    ? node.content.map((child) => nodeText(child)).join(" ")
    : "";
  return normalizeText([ownText, childText].filter(Boolean).join(" "));
}

function sectionTitle(node: TipTapJSONContent, fallback: string): string {
  const attrs = isRecord(node.attrs) ? node.attrs : {};
  return typeof attrs.title === "string" && attrs.title.trim()
    ? attrs.title.trim()
    : fallback;
}

function createSectionId(label: string, index: number): string {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "section"}-${index}`;
}

function extractResumeSections(
  content: TipTapJSONContent,
): ComparableStudioSection[] {
  const sections: ComparableStudioSection[] = [];

  function visit(node: TipTapJSONContent): void {
    if (node.type === "resumeSection") {
      const label = sectionTitle(node, `Section ${sections.length + 1}`);
      sections.push({
        id: createSectionId(label, sections.length),
        label,
        text: nodeText(node),
      });
      return;
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) visit(child);
    }
  }

  visit(content);
  return sections.filter((section) => section.text.length > 0);
}

function extractCoverLetterSections(
  content: TipTapJSONContent,
): ComparableStudioSection[] {
  const paragraphs: ComparableStudioSection[] = [];

  function visit(node: TipTapJSONContent): void {
    if (node.type === "paragraph") {
      const text = nodeText(node);
      if (text) {
        const label =
          paragraphs.length === 0
            ? "Opening"
            : `Paragraph ${paragraphs.length + 1}`;
        paragraphs.push({
          id: createSectionId(label, paragraphs.length),
          label,
          text,
        });
      }
      return;
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) visit(child);
    }
  }

  visit(content);

  if (paragraphs.length <= 1) {
    return paragraphs.map((section) => ({
      ...section,
      id: "cover-letter",
      label: "Cover Letter",
    }));
  }

  return paragraphs;
}

export function extractComparableStudioSections(
  state: BuilderDraftState,
): ComparableStudioSection[] {
  if (state.content) {
    const sections =
      state.documentMode === "cover_letter"
        ? extractCoverLetterSections(state.content)
        : extractResumeSections(state.content);

    if (sections.length > 0) return sections;

    const text = nodeText(state.content);
    if (text) {
      return [{ id: "document", label: "Document", text }];
    }
  }

  const fallbackText = stripHtml(state.html);
  return fallbackText
    ? [{ id: "document", label: "Document", text: fallbackText }]
    : [];
}

function emptyCounts(): WordDiffCounts {
  return { added: 0, removed: 0, reworded: 0, unchanged: 0, total: 0 };
}

function addCounts(
  first: WordDiffCounts,
  second: WordDiffCounts,
): WordDiffCounts {
  return {
    added: first.added + second.added,
    removed: first.removed + second.removed,
    reworded: first.reworded + second.reworded,
    unchanged: first.unchanged + second.unchanged,
    total: first.total + second.total,
  };
}

export function createStudioVersionDiff(
  compared: BuilderDraftState,
  current: BuilderDraftState,
): StudioDocumentDiff {
  const comparedSections = extractComparableStudioSections(compared);
  const currentSections = extractComparableStudioSections(current);
  const comparedByLabel = new Map(
    comparedSections.map((section) => [section.label, section]),
  );
  const currentByLabel = new Map(
    currentSections.map((section) => [section.label, section]),
  );
  const labels = [
    ...comparedSections.map((section) => section.label),
    ...currentSections
      .map((section) => section.label)
      .filter((label) => !comparedByLabel.has(label)),
  ];

  const sections = labels.map((label, index) => {
    const comparedSection = comparedByLabel.get(label);
    const currentSection = currentByLabel.get(label);
    const comparedText = comparedSection?.text ?? "";
    const currentText = currentSection?.text ?? "";
    const segments = diffWords(comparedText, currentText);
    const counts = summarizeWordDiff(segments);

    return {
      id:
        comparedSection?.id ??
        currentSection?.id ??
        createSectionId(label, index),
      label,
      comparedText,
      currentText,
      segments,
      counts,
    };
  });

  return {
    sections,
    totals: sections.reduce(
      (totals, section) => addCounts(totals, section.counts),
      emptyCounts(),
    ),
  };
}
