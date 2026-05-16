import fs from "fs/promises";
import os from "os";
import path from "path";
import { detectSections } from "@/lib/parser/section-detector";
import { extractTextFromFile } from "@/lib/parser/pdf";
import {
  analyzeTemplateWithLLM,
  type AnalyzedTemplate,
} from "@/lib/resume/template-analyzer";
import {
  mergeAnalyzedAndSignals,
  type ImportedTemplate,
  type TemplateStyleSignals,
} from "./template-schema";

export interface ExtractTemplateOptions {
  buffer: Buffer;
  filename: string;
  mimeType?: string;
  llmUserId?: string | null;
}

export interface ExtractTemplateResult {
  template: ImportedTemplate;
  warnings: string[];
  sectionsFound: string[];
}

const DEFAULT_ANALYZED_TEMPLATE: AnalyzedTemplate = {
  styles: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: "11pt",
    headerSize: "20pt",
    sectionHeaderSize: "12pt",
    lineHeight: "1.4",
    accentColor: "#333333",
    layout: "single-column",
    headerStyle: "left",
    bulletStyle: "disc",
    sectionDivider: "line",
  },
  charsPerLine: 80,
  margins: {
    top: "0.5in",
    bottom: "0.5in",
    left: "0.75in",
    right: "0.75in",
  },
  sectionGap: "16px",
};

export function getTemplateSourceType(
  filename: string,
  mimeType?: string,
): "pdf" | "docx" | null {
  const lowerName = filename.toLowerCase();
  const lowerMime = mimeType?.toLowerCase() ?? "";
  if (lowerName.endsWith(".pdf") || lowerMime.includes("pdf")) return "pdf";
  if (
    lowerName.endsWith(".docx") ||
    lowerMime.includes("wordprocessingml.document")
  ) {
    return "docx";
  }
  return null;
}

export async function extractTemplateFromFile({
  buffer,
  filename,
  mimeType,
  llmUserId = null,
}: ExtractTemplateOptions): Promise<ExtractTemplateResult> {
  const sourceType = getTemplateSourceType(filename, mimeType);
  if (!sourceType) {
    throw new Error("Unsupported template file type");
  }

  const warnings: string[] = [];
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "slothing-template-"),
  );
  const tempFile = path.join(tempDir, `template.${sourceType}`);

  try {
    await fs.writeFile(tempFile, buffer);
    const text = (await extractTextFromFile(tempFile)).trim();

    if (text.length < 25) {
      warnings.push(
        "We could not extract much text from this file, so the template uses default resume styling.",
      );
    }

    const analyzed =
      text.length >= 25
        ? await analyzeTemplateWithLLM(text, llmUserId)
        : DEFAULT_ANALYZED_TEMPLATE;
    const sections = text.length >= 25 ? detectSections(text) : [];

    if (sections.length === 0) {
      warnings.push(
        "We couldn't detect distinct resume sections. You can still save the template and tune it in the editor.",
      );
    }

    const signals =
      sourceType === "docx"
        ? extractDocxStyleSignals(buffer)
        : extractPdfStyleSignals();
    const detectedSections = sections.map((section) => ({
      type: section.type,
      label: section.type,
    }));
    const template = mergeAnalyzedAndSignals(analyzed, signals, {
      detectedSections,
      source: { filename, type: sourceType },
    });

    return {
      template,
      warnings,
      sectionsFound: detectedSections.map((section) => section.label),
    };
  } finally {
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

function extractDocxStyleSignals(buffer: Buffer): TemplateStyleSignals {
  const xml = buffer.toString("utf8");
  const margins = extractDocxMargins(xml);
  const pageSize = extractDocxPageSize(xml);
  const font = extractDocxFont(xml);
  const accentColor = extractDocxAccentColor(xml);

  return {
    pageSize,
    margins,
    styles: {
      ...(font ? { fontFamily: font } : {}),
      ...(accentColor ? { accentColor } : {}),
    },
  };
}

function extractPdfStyleSignals(): TemplateStyleSignals {
  return { pageSize: "letter" };
}

function extractDocxMargins(
  xml: string,
): TemplateStyleSignals["margins"] | undefined {
  const marginMatch = xml.match(/<w:pgMar\b[^>]*>/);
  if (!marginMatch) return undefined;
  const tag = marginMatch[0];
  const top = readTwipsAttribute(tag, "top");
  const bottom = readTwipsAttribute(tag, "bottom");
  const left = readTwipsAttribute(tag, "left");
  const right = readTwipsAttribute(tag, "right");

  return {
    ...(top ? { top } : {}),
    ...(bottom ? { bottom } : {}),
    ...(left ? { left } : {}),
    ...(right ? { right } : {}),
  };
}

function extractDocxPageSize(xml: string): string | undefined {
  const sizeMatch = xml.match(/<w:pgSz\b[^>]*>/);
  if (!sizeMatch) return undefined;
  const width = readNumberAttribute(sizeMatch[0], "w");
  const height = readNumberAttribute(sizeMatch[0], "h");
  if (!width || !height) return undefined;

  const min = Math.min(width, height);
  const max = Math.max(width, height);
  if (Math.abs(min - 12240) < 120 && Math.abs(max - 15840) < 120) {
    return "letter";
  }
  if (Math.abs(min - 11906) < 120 && Math.abs(max - 16838) < 120) {
    return "a4";
  }
  return `${width}x${height}twip`;
}

function extractDocxFont(xml: string): string | undefined {
  const fontMatch = xml.match(/w:(?:ascii|hAnsi)="([^"]+)"/);
  return fontMatch?.[1] ? `"${fontMatch[1]}", Arial, sans-serif` : undefined;
}

function extractDocxAccentColor(xml: string): string | undefined {
  const colorMatch = xml.match(/w:color="([0-9A-Fa-f]{6})"/);
  return colorMatch?.[1] ? `#${colorMatch[1]}` : undefined;
}

function readNumberAttribute(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`w:${name}="(\\d+)"`));
  return match?.[1] ? Number(match[1]) : null;
}

function readTwipsAttribute(tag: string, name: string): string | null {
  const value = readNumberAttribute(tag, name);
  if (!value) return null;
  return `${Number(value / 1440)
    .toFixed(2)
    .replace(/\.?0+$/, "")}in`;
}
