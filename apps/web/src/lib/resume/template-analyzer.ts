import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import type { TemplateStyles } from "./template-types";

/**
 * Analyzed template styles from an uploaded resume document.
 * Extends TemplateStyles with additional formatting metadata.
 */
export interface AnalyzedTemplate {
  styles: TemplateStyles;
  /** Approximate characters per line detected in the source document */
  charsPerLine: number;
  /** Margins detected from the document layout */
  margins: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  /** Spacing between sections */
  sectionGap: string;
}

const ANALYSIS_SYSTEM_PROMPT = `You are a resume formatting analyst. Given the text content of a resume document, analyze its formatting and layout characteristics. Return a JSON object with the following structure:

{
  "fontFamily": "detected or most likely font family with fallbacks (e.g. \"'Helvetica Neue', Arial, sans-serif\")",
  "fontSize": "body text size (e.g. \"11pt\")",
  "headerSize": "name/header size (e.g. \"20pt\")",
  "sectionHeaderSize": "section header size (e.g. \"12pt\")",
  "lineHeight": "line spacing ratio (e.g. \"1.4\")",
  "accentColor": "hex color for headers/accents (e.g. \"#2563eb\")",
  "layout": "single-column or two-column",
  "headerStyle": "centered, left, or minimal",
  "bulletStyle": "disc, dash, arrow, or none",
  "sectionDivider": "line, space, or none",
  "charsPerLine": 80,
  "margins": {
    "top": "0.5in",
    "bottom": "0.5in",
    "left": "0.75in",
    "right": "0.75in"
  },
  "sectionGap": "16px"
}

Analyze the text structure carefully:
- Count characters in typical lines to estimate chars per line
- Look at bullet characters (bullets, dashes, arrows) to determine bullet style
- Check if section headers appear centered or left-aligned
- Look for separator lines (----, ====) to determine section dividers
- Estimate font choices based on the document's apparent style (professional serif vs modern sans-serif)
- Detect layout from content flow (single vs two columns)

Return ONLY the JSON object, no other text.`;

/**
 * Analyze resume text using LLM to extract formatting characteristics.
 * Falls back to heuristic analysis if no LLM client is available.
 */
export async function analyzeTemplateWithLLM(
  text: string,
  llmClient: LLMClient | null,
): Promise<AnalyzedTemplate> {
  if (!llmClient) {
    return analyzeTemplateHeuristic(text);
  }

  try {
    const response = await llmClient.complete({
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze the formatting of this resume:\n\n${text.slice(0, 5000)}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 1024,
    });

    const parsed = parseJSONFromLLM<LLMAnalysisResult>(response);
    return normalizeAnalysisResult(parsed);
  } catch {
    return analyzeTemplateHeuristic(text);
  }
}

interface LLMAnalysisResult {
  fontFamily?: string;
  fontSize?: string;
  headerSize?: string;
  sectionHeaderSize?: string;
  lineHeight?: string;
  accentColor?: string;
  layout?: string;
  headerStyle?: string;
  bulletStyle?: string;
  sectionDivider?: string;
  charsPerLine?: number;
  margins?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  sectionGap?: string;
}

const VALID_LAYOUTS = ["single-column", "two-column"] as const;
const VALID_HEADER_STYLES = ["centered", "left", "minimal"] as const;
const VALID_BULLET_STYLES = ["disc", "dash", "arrow", "none"] as const;
const VALID_SECTION_DIVIDERS = ["line", "space", "none"] as const;

/**
 * Normalize and validate the LLM analysis result, applying defaults for missing/invalid fields.
 */
export function normalizeAnalysisResult(
  raw: LLMAnalysisResult,
): AnalyzedTemplate {
  return {
    styles: {
      fontFamily: raw.fontFamily || "'Helvetica Neue', Arial, sans-serif",
      fontSize: raw.fontSize || "11pt",
      headerSize: raw.headerSize || "20pt",
      sectionHeaderSize: raw.sectionHeaderSize || "12pt",
      lineHeight: raw.lineHeight || "1.4",
      accentColor: isValidHexColor(raw.accentColor)
        ? raw.accentColor!
        : "#333333",
      layout: isValidEnum(raw.layout, VALID_LAYOUTS)
        ? (raw.layout as TemplateStyles["layout"])
        : "single-column",
      headerStyle: isValidEnum(raw.headerStyle, VALID_HEADER_STYLES)
        ? (raw.headerStyle as TemplateStyles["headerStyle"])
        : "left",
      bulletStyle: isValidEnum(raw.bulletStyle, VALID_BULLET_STYLES)
        ? (raw.bulletStyle as TemplateStyles["bulletStyle"])
        : "disc",
      sectionDivider: isValidEnum(raw.sectionDivider, VALID_SECTION_DIVIDERS)
        ? (raw.sectionDivider as TemplateStyles["sectionDivider"])
        : "line",
    },
    charsPerLine:
      typeof raw.charsPerLine === "number" && raw.charsPerLine > 0
        ? raw.charsPerLine
        : 80,
    margins: {
      top: raw.margins?.top || "0.5in",
      bottom: raw.margins?.bottom || "0.5in",
      left: raw.margins?.left || "0.75in",
      right: raw.margins?.right || "0.75in",
    },
    sectionGap: raw.sectionGap || "16px",
  };
}

/**
 * Heuristic-based template analysis when no LLM is available.
 * Extracts formatting from text structure patterns.
 */
export function analyzeTemplateHeuristic(text: string): AnalyzedTemplate {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);

  // Detect bullet style
  let bulletStyle: TemplateStyles["bulletStyle"] = "disc";
  if (text.includes("→") || text.includes("▸")) {
    bulletStyle = "arrow";
  } else if (/^[\s]*[-–][\s]/m.test(text)) {
    bulletStyle = "dash";
  } else if (text.includes("•")) {
    bulletStyle = "disc";
  } else {
    bulletStyle = "none";
  }

  // Detect section dividers
  let sectionDivider: TemplateStyles["sectionDivider"] = "space";
  if (/[-=]{10,}/.test(text)) {
    sectionDivider = "line";
  }

  // Estimate characters per line
  const contentLines = lines.filter((l) => l.trim().length > 20);
  const charsPerLine =
    contentLines.length > 0
      ? Math.round(
          contentLines.reduce((sum, l) => sum + l.length, 0) /
            contentLines.length,
        )
      : 80;

  // Detect header style from first few lines (use raw line to preserve padding)
  const firstRawLine = lines[0] || "";
  const headerStyle: TemplateStyles["headerStyle"] =
    firstRawLine.trim().length > 0 &&
    lines.length > 1 &&
    isCentered(firstRawLine, charsPerLine)
      ? "centered"
      : "left";

  // Detect layout - two-column resumes often have pipe separators or tab-heavy lines
  const tabHeavyLines = lines.filter(
    (l) => (l.match(/\t/g) || []).length >= 2,
  ).length;
  const layout: TemplateStyles["layout"] =
    tabHeavyLines > lines.length * 0.3 ? "two-column" : "single-column";

  return {
    styles: {
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      fontSize: "11pt",
      headerSize: "20pt",
      sectionHeaderSize: "12pt",
      lineHeight: "1.4",
      accentColor: "#333333",
      layout,
      headerStyle,
      bulletStyle,
      sectionDivider,
    },
    charsPerLine,
    margins: {
      top: "0.5in",
      bottom: "0.5in",
      left: "0.75in",
      right: "0.75in",
    },
    sectionGap: "16px",
  };
}

/** Check if a string looks like a centered line (padded on left) */
function isCentered(line: string, avgLength: number): boolean {
  const leftPadding = line.length - line.trimStart().length;
  return leftPadding > avgLength * 0.2;
}

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{3,8}$/.test(value);
}

function isValidEnum<T extends string>(
  value: unknown,
  options: readonly T[],
): value is T {
  return (
    typeof value === "string" && (options as readonly string[]).includes(value)
  );
}
