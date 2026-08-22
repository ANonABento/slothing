/**
 * Structured content → an annotated .tex document.
 * See docs/specs/latex-single-source-rebuild.md §8, §10.
 *
 * This is the FORWARD direction only, and deliberately so: structured data → macros is
 * deterministic and easy. Once generated, the .tex is the artifact of record and every
 * later edit is a span patch — we never regenerate over a user's document and silently
 * discard what they changed. That asymmetry is the whole point of the rebuild.
 */
import { createSpanId, CONTRACT_VERSION, type SpanKind } from "./contract";
import { plainTextToLatex } from "./inline";
import {
  DEFAULT_SETTINGS,
  renderSettingsBlock,
  type DocumentSettings,
} from "./settings";

export interface GenerateEntry {
  organisation: string;
  role: string;
  dates: string;
  bullets: string[];
}

export interface GenerateSection {
  title: string;
  entries?: GenerateEntry[];
  /** A prose/list section such as Skills. */
  text?: string;
}

export interface GenerateInput {
  name: string;
  contact: string;
  sections: GenerateSection[];
  settings?: Partial<DocumentSettings>;
}

export interface GenerateCoverLetterInput {
  name: string;
  contact: string;
  paragraphs: string[];
  settings?: Partial<DocumentSettings>;
}

/** Fresh ids for every generated span, so the document is addressable from render one. */
function id(kind: SpanKind): string {
  return createSpanId(kind);
}

function preamble(settings: DocumentSettings): string {
  return `\\documentclass[${settings.fontsize},letterpaper]{article}
\\usepackage{slothing}
\\slothingcontract{${CONTRACT_VERSION}}

\\slothingset{${renderSettingsBlock(settings)}}
`;
}

function resolveSettings(
  partial: Partial<DocumentSettings> | undefined,
): DocumentSettings {
  return { ...DEFAULT_SETTINGS, ...(partial ?? {}) };
}

/** Generate an annotated resume/CV. */
export function generateResumeTex(input: GenerateInput): string {
  const settings = resolveSettings(input.settings);
  const body: string[] = [];

  body.push(
    `\\slothingHeader[id=${id("header")}]{${plainTextToLatex(input.name)}}{${plainTextToLatex(input.contact)}}`,
  );

  for (const section of input.sections) {
    body.push("");
    body.push(
      `\\slothingSection[id=${id("section")}]{${plainTextToLatex(section.title)}}`,
    );

    if (section.text) {
      body.push(
        `\\slothingSkills[id=${id("skills")}]{${plainTextToLatex(section.text)}}`,
      );
    }

    for (const entry of section.entries ?? []) {
      const items = entry.bullets
        .map(
          (bullet) =>
            `    \\slothingItem[id=${id("item")}]{${plainTextToLatex(bullet)}}`,
        )
        .join("\n");

      /**
       * An entry with no bullets gets NO list.
       *
       * An itemize containing no \item is a hard LaTeX error, not an empty render — this
       * previously produced documents that could never compile, which is exactly what an
       * education row (institution, degree, dates, no bullets) looks like.
       */
      const listBlock = items
        ? `
  \\begin{slothingItems}
${items}
  \\end{slothingItems}
`
        : "";

      body.push(
        `\\slothingEntry[id=${id("entry")}]{${plainTextToLatex(entry.organisation)}}{${plainTextToLatex(entry.role)}}{${plainTextToLatex(entry.dates)}}{${listBlock}}`,
      );
    }
  }

  return `${preamble(settings)}
\\begin{document}
${body.join("\n")}
\\end{document}
`;
}

/** Generate an annotated cover letter — same contract, same engine, same editor. */
export function generateCoverLetterTex(
  input: GenerateCoverLetterInput,
): string {
  const settings = resolveSettings(input.settings);
  const body: string[] = [
    `\\slothingHeader[id=${id("header")}]{${plainTextToLatex(input.name)}}{${plainTextToLatex(input.contact)}}`,
    "",
  ];

  for (const paragraph of input.paragraphs) {
    body.push(
      `\\slothingPara[id=${id("para")}]{${plainTextToLatex(paragraph)}}`,
    );
  }

  return `${preamble(settings)}
\\begin{document}
${body.join("\n")}
\\end{document}
`;
}
