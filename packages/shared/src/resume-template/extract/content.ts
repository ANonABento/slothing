import type {
  ResumeDocumentModel,
  RdmWork,
  RdmEducation,
  RdmProject,
  RdmSkillGroup,
  RdmProfile,
} from "../rdm";
import {
  allLines,
  dominantBodyFontSize,
  isSectionHeader,
  type PdfDocGeometry,
  type TextLine,
} from "./geometry";
import { labelSection, type SectionKind, type SectionLabeler } from "./labels";

/**
 * Deterministic CONTENT extraction (OpenResume's MIT pipeline, spec §10 / Phase 2):
 * pdf.js text items → lines (geometry.ts) → sections by header detection → per-field
 * heuristics → an RDM. Parser accuracy on real CVs is ~82% (Kickresume's self-report,
 * spec §10 gap #6), so this output is a DRAFT meant for the first-class import
 * review/correction UI — never a silent commit.
 */

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d[\d ().\-]{7,}\d)/;
const URL_RE =
  /((?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|dev|io|me|org|net|co|ai|app|xyz)(?:\/[\w./#?=&%-]*)?)/i;
const LOCATION_RE = /^[A-Za-z .'À-ſ-]+,\s*[A-Za-z .'À-ſ-]+$/;
const DATE_TOKEN_RE =
  /(\b(?:19|20)\d{2}\b|present|current|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(?:'?\d{2,4})?)/gi;
const BULLET_LEAD_RE = /^\s*[-•●·◦∙*▸►➤»‣>→–—‐]\s+/;

export interface ExtractedContent {
  rdm: ResumeDocumentModel;
  /** Headers we could not label — candidates for an LLM labeling pass in the app. */
  unknownHeaders: string[];
}

interface RawSection {
  kind: SectionKind;
  header: string;
  lines: TextLine[];
}

function stripBullet(text: string): string {
  return text.replace(BULLET_LEAD_RE, "").trim();
}

function isBullet(line: TextLine): boolean {
  return BULLET_LEAD_RE.test(line.text);
}

function extractDates(text: string): {
  start?: string;
  end?: string;
  rest: string;
} {
  const matches = [...text.matchAll(DATE_TOKEN_RE)].map((m) => m[0].trim());
  if (!matches.length) return { rest: text.trim() };
  const start = matches[0];
  const end = matches.length > 1 ? matches[matches.length - 1] : undefined;
  // Remove the matched date span and trailing separators from the line.
  let rest = text;
  for (const m of matches) rest = rest.replace(m, "");
  rest = rest
    .replace(/[–—|,;·•\-\s]+$/g, "")
    .replace(/^[–—|,;·•\-\s]+/g, "")
    .trim();
  return {
    start,
    end: end && /present|current/i.test(end) ? undefined : end,
    rest,
  };
}

function splitLead(text: string): { primary: string; secondary?: string } {
  const parts = text
    .split(/\s*(?:\||–|—|·|•|\bat\b|,)\s*/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) return { primary: text.trim() };
  return { primary: parts[0], secondary: parts.slice(1).join(", ") };
}

function partitionSections(
  lines: TextLine[],
  bodyFontSize: number,
): { profile: TextLine[]; sections: RawSection[] } {
  const profile: TextLine[] = [];
  const sections: RawSection[] = [];
  let current: RawSection | null = null;
  let seenHeader = false;

  for (const line of lines) {
    if (isSectionHeader(line, bodyFontSize)) {
      seenHeader = true;
      current = { kind: labelSection(line.text), header: line.text, lines: [] };
      sections.push(current);
      continue;
    }
    if (!seenHeader) profile.push(line);
    else if (current) current.lines.push(line);
  }
  return { profile, sections };
}

function parseProfile(
  profile: TextLine[],
  allText: string,
): ResumeDocumentModel["basics"] {
  // Name = the largest-font line in the profile band, else the first line.
  const byFont = [...profile].sort((a, b) => b.fontSize - a.fontSize);
  const name = (byFont[0]?.text ?? "").trim() || "Unknown";

  const email = EMAIL_RE.exec(allText)?.[0];
  const phone = PHONE_RE.exec(allText)?.[0]?.trim();

  let location: string | undefined;
  let headline: string | undefined;
  for (const l of profile) {
    if (l.text === name) continue;
    if (!location && LOCATION_RE.test(l.text) && !EMAIL_RE.test(l.text))
      location = l.text.trim();
    if (
      !headline &&
      !EMAIL_RE.test(l.text) &&
      !PHONE_RE.test(l.text) &&
      !URL_RE.test(l.text) &&
      !LOCATION_RE.test(l.text) &&
      l.text !== name &&
      l.text.length < 60
    ) {
      headline = l.text.trim();
    }
  }

  const profiles: RdmProfile[] = [];
  const linkedin = /((?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w/-]+)/i.exec(
    allText,
  )?.[0];
  const github = /((?:https?:\/\/)?(?:www\.)?github\.com\/[\w/-]+)/i.exec(
    allText,
  )?.[0];
  if (linkedin) profiles.push({ network: "LinkedIn", url: linkedin });
  if (github) profiles.push({ network: "GitHub", url: github });

  let website: string | undefined;
  const url = URL_RE.exec(allText)?.[0];
  if (
    url &&
    !/linkedin\.com|github\.com/i.test(url) &&
    (!email || !email.includes(url))
  )
    website = url;

  return {
    name,
    headline,
    email,
    phone,
    location,
    website,
    profiles: profiles.length ? profiles : undefined,
  };
}

function parseEntries(
  lines: TextLine[],
): {
  primary: string;
  secondary?: string;
  start?: string;
  end?: string;
  highlights: string[];
}[] {
  const entries: {
    primary: string;
    secondary?: string;
    start?: string;
    end?: string;
    highlights: string[];
  }[] = [];
  let current: (typeof entries)[number] | null = null;

  for (const line of lines) {
    if (isBullet(line)) {
      if (!current) current = { primary: "", highlights: [] };
      current.highlights.push(stripBullet(line.text));
      continue;
    }
    if (!line.text.trim()) continue;
    // A non-bullet line starts a new entry header.
    const { start, end, rest } = extractDates(line.text);
    const { primary, secondary } = splitLead(rest || line.text);
    current = { primary, secondary, start, end, highlights: [] };
    entries.push(current);
  }
  return entries.filter((e) => e.primary || e.highlights.length);
}

function parseSkills(lines: TextLine[]): RdmSkillGroup[] {
  const groups: RdmSkillGroup[] = [];
  for (const line of lines) {
    const text = stripBullet(line.text);
    if (!text) continue;
    const colon = text.indexOf(":");
    if (colon > 0 && colon < 40) {
      const name = text.slice(0, colon).trim();
      const keywords = splitKeywords(text.slice(colon + 1));
      if (keywords.length) groups.push({ name, keywords });
    } else {
      const keywords = splitKeywords(text);
      if (keywords.length) groups.push({ keywords });
    }
  }
  return groups;
}

function splitKeywords(text: string): string[] {
  return text
    .split(/[,•|/;·]|\s{2,}/)
    .map((k) => k.trim())
    .filter((k) => k.length > 0 && k.length < 40);
}

/**
 * Extract an RDM from parsed PDF geometry. Synchronous + deterministic; the optional
 * `labeler` (e.g. an LLM) is applied only to headers the keyword map could not
 * classify, keeping the LLM scoped to semantics (spec §3).
 */
export async function extractContent(
  doc: PdfDocGeometry,
  labeler?: SectionLabeler,
): Promise<ExtractedContent> {
  const lines = allLines(doc);
  const bodyFontSize = dominantBodyFontSize(lines);
  const allText = lines.map((l) => l.text).join("  ");
  const { profile, sections } = partitionSections(lines, bodyFontSize);

  // Optional semantic labeling pass for unknown headers.
  const unknownHeaders: string[] = [];
  for (const section of sections) {
    if (section.kind === "unknown") {
      if (labeler) {
        const labeled = await labeler(section.header);
        section.kind = labeled;
      }
      if (section.kind === "unknown") unknownHeaders.push(section.header);
    }
  }

  const basics = parseProfile(profile, allText);

  let summary: string | undefined;
  const work: RdmWork[] = [];
  const education: RdmEducation[] = [];
  const skills: RdmSkillGroup[] = [];
  const projects: RdmProject[] = [];

  for (const section of sections) {
    switch (section.kind) {
      case "summary":
        summary =
          section.lines
            .map((l) => l.text)
            .join(" ")
            .trim() || summary;
        break;
      case "experience":
        for (const e of parseEntries(section.lines)) {
          work.push({
            organization: e.secondary ?? "",
            position: e.primary,
            startDate: e.start,
            endDate: e.end,
            highlights: e.highlights,
          });
        }
        break;
      case "education":
        for (const e of parseEntries(section.lines)) {
          education.push({
            institution: e.secondary ?? e.primary,
            area: e.secondary ? e.primary : "",
            startDate: e.start,
            endDate: e.end,
            highlights: e.highlights.length ? e.highlights : undefined,
          });
        }
        break;
      case "skills":
        skills.push(...parseSkills(section.lines));
        break;
      case "projects":
        for (const e of parseEntries(section.lines)) {
          projects.push({ name: e.primary, highlights: e.highlights });
        }
        break;
      default:
        break;
    }
  }

  return {
    rdm: {
      basics,
      summary,
      work,
      education,
      skills,
      projects: projects.length ? projects : undefined,
    },
    unknownHeaders,
  };
}
