/** Deterministic field extractor for resume sections — no LLM calls. */

import type { Experience, Education, Skill, Project } from "@/types";
import type { Section as DetectedSection } from "./section-detector";
import { generateId } from "@/lib/utils";

export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  confidence: number;
}

export interface ExtractedFields {
  contact: ContactInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

const EMAIL_REGEX = /[\w.+-]+@[\w.-]+\.\w{2,}/;
const PHONE_REGEX = /(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[\w-]+/i;
const GITHUB_REGEX = /github\.com\/[\w-]+/i;
const URL_REGEX = /https?:\/\/[\w.-]+\.\w{2,}[\w/.-]*/;
const BULLET_MARKER_REGEX = /^[•●○◦■▪▸→✓\-–—*]$/;
const BULLET_LINE_REGEX = /^[•●○◦■▪▸→✓\-–—*]\s*/;
const SKILL_SPLIT_REGEX = /[,;|•·]/;
const SKILL_LABEL_REGEX = /^([\p{L}\s/&+-]{2,32}):\s*(.+)$/u;
const ORPHAN_SKILL_LABELS = new Set([
  "language",
  "languages",
  "tool",
  "tools",
  "framework",
  "frameworks",
  "library",
  "libraries",
  "database",
  "databases",
  "soft skill",
  "soft skills",
  "interpersonal",
]);

function skillCategoryForLabel(label: string | undefined): Skill["category"] {
  const normalized = label?.toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized) return "technical";
  if (/^languages?(?: spoken| proficiency| skills)?$/.test(normalized)) {
    return "language";
  }
  if (/^tools?$/.test(normalized)) return "tool";
  if (/^(?:soft skills?|interpersonal)$/.test(normalized)) return "soft";
  if (/^(?:frameworks?|libraries?|databases?)$/.test(normalized)) {
    return "technical";
  }
  return "technical";
}

function isLikelyTableHeader(line: string): boolean {
  const normalized = line
    .toLowerCase()
    .replace(/[|:,/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return false;

  const tokens = new Set(normalized.split(" "));
  const experienceHeaderHits = [
    "role",
    "title",
    "organization",
    "company",
    "employer",
    "dates",
    "date",
    "location",
  ].filter((token) => tokens.has(token)).length;
  const educationHeaderHits = [
    "institution",
    "school",
    "credential",
    "degree",
    "dates",
    "date",
  ].filter((token) => tokens.has(token)).length;

  return experienceHeaderHits >= 3 || educationHeaderHits >= 3;
}

function normalizedTableCell(line: string): string {
  return line.toLowerCase().replace(/\s+/g, " ").trim();
}

function isExperienceTableHeaderSequence(
  lines: string[],
  index: number,
): boolean {
  const cells = lines.slice(index, index + 4).map(normalizedTableCell);
  return (
    /^(role|title|position)$/.test(cells[0] || "") &&
    /^(organization|company|employer)$/.test(cells[1] || "") &&
    /^(dates?|date range)$/.test(cells[2] || "") &&
    /^location$/.test(cells[3] || "")
  );
}

function parseExperienceTableRowSequence(lines: string[], index: number) {
  const [title, company, dates, location] = lines
    .slice(index, index + 4)
    .map((line) => line.trim());

  if (
    !title ||
    !company ||
    !hasDateRange(dates) ||
    hasDateRange(title) ||
    hasDateRange(company) ||
    hasDateRange(location) ||
    !isJobTitle(title) ||
    BULLET_LINE_REGEX.test(title) ||
    BULLET_LINE_REGEX.test(company) ||
    BULLET_LINE_REGEX.test(location) ||
    isLikelySectionHeader(title) ||
    isLikelySectionHeader(location) ||
    isLikelyTableHeader(title) ||
    normalizedTableCell(title) === "institution"
  ) {
    return null;
  }

  return {
    title,
    company,
    location: location || undefined,
    dates: extractDateRange(dates),
    bullets: [],
  };
}

function isEducationTableHeaderSequence(
  lines: string[],
  index: number,
): boolean {
  const cells = lines.slice(index, index + 3).map(normalizedTableCell);
  return (
    /^(institution|school)$/.test(cells[0] || "") &&
    /^(credential|degree)$/.test(cells[1] || "") &&
    /^(dates?|date range)$/.test(cells[2] || "")
  );
}

// Month names (abbreviated and full) for building date patterns
const MONTH_NAMES =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sept?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const MONTH_ABBR_TICK =
  "(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)\\.?\\s*'\\d{2}";
const SEASON = "(?:Spring|Summer|Fall|Autumn|Winter)\\s+\\d{4}";

// Single date token: "January 2020", "Jan 2020", "Jan. 2020", "01/2020", "2020", "Jan '20", "Summer 2019"
const DATE_TOKEN = `(?:${MONTH_NAMES}\\.?\\s*\\d{4}|${MONTH_ABBR_TICK}|${SEASON}|\\d{4}-\\d{2}|\\d{1,2}\\/\\d{4}|\\d{4})`;
// End token: same as date token + Present/Current
const END_TOKEN = `(?:${DATE_TOKEN}|[Pp]resent|[Cc]urrent)`;
// Full date range: "Jan 2020 - Present", "2020-2024", etc.
const DATE_RANGE_REGEX = new RegExp(
  `${DATE_TOKEN}\\s*[-–—]\\s*${END_TOKEN}`,
  "g",
);
// Also match " to " as separator: "January 2020 to Present"
const DATE_RANGE_TO_REGEX = new RegExp(
  `${DATE_TOKEN}\\s+to\\s+${END_TOKEN}`,
  "gi",
);
const DATE_RANGE_PARTS_REGEX = new RegExp(
  `^\\s*(${DATE_TOKEN})\\s*(?:[-–—]|to)\\s*(${END_TOKEN})\\s*$`,
  "i",
);
const SPACED_DATE_RANGE_PARTS_REGEX = new RegExp(
  `^\\s*(${DATE_TOKEN})\\s+[-–—]\\s+(${END_TOKEN})\\s*$`,
  "i",
);
const YEAR_ONLY_DATE_RANGE_PARTS_REGEX =
  /^\s*(\d{4})\s*[-–—]\s*(\d{4}|present|current)\s*$/i;
const SINGLE_YEAR_REGEX = /\b(?:19|20)\d{2}\b/;

export function hasDateRange(line: string): boolean {
  DATE_RANGE_REGEX.lastIndex = 0;
  DATE_RANGE_TO_REGEX.lastIndex = 0;
  return DATE_RANGE_REGEX.test(line) || DATE_RANGE_TO_REGEX.test(line);
}

export function extractDateRange(line: string): string {
  DATE_RANGE_REGEX.lastIndex = 0;
  DATE_RANGE_TO_REGEX.lastIndex = 0;
  return (
    line.match(DATE_RANGE_REGEX)?.[0] ||
    line.match(DATE_RANGE_TO_REGEX)?.[0] ||
    ""
  );
}

function removeDateRange(line: string): string {
  DATE_RANGE_REGEX.lastIndex = 0;
  DATE_RANGE_TO_REGEX.lastIndex = 0;
  return line
    .replace(DATE_RANGE_REGEX, "")
    .replace(DATE_RANGE_TO_REGEX, "")
    .replace(/[|•·,]/g, " ")
    .trim();
}

function stripDateRange(line: string): string {
  DATE_RANGE_REGEX.lastIndex = 0;
  DATE_RANGE_TO_REGEX.lastIndex = 0;
  return line
    .replace(DATE_RANGE_REGEX, "")
    .replace(DATE_RANGE_TO_REGEX, "")
    .replace(/\s*(?:[-–—|•·,])\s*$/, "")
    .trim();
}

function extractSingleYear(line: string): string {
  return line.match(SINGLE_YEAR_REGEX)?.[0] ?? "";
}

function stripSingleYear(line: string): string {
  return line
    .replace(SINGLE_YEAR_REGEX, "")
    .replace(/\s*(?:[-–—|•·,])\s*$/, "")
    .trim();
}

function isLikelySectionHeader(line: string): boolean {
  const cleaned = line.replace(/[^\p{L}\p{N}\s&/]/gu, "").trim();
  return (
    cleaned.length >= 3 &&
    cleaned.length <= 50 &&
    cleaned === cleaned.toUpperCase() &&
    /[A-Z]{3,}/.test(cleaned)
  );
}

function isLikelyEntryHeader(line: string): boolean {
  return hasDateRange(line) || (line.includes("|") && line.length < 180);
}

function normalizeResumeLines(text: string): string[] {
  const normalized: string[] = [];
  const rawLines = text
    .split("\n")
    .map((line) => line.trim().replace(/^#{1,6}\s+/, ""))
    .filter(Boolean);
  let pendingBullet: string | null = null;

  function flushPendingBullet() {
    if (pendingBullet?.trim()) {
      normalized.push(`• ${pendingBullet.trim()}`);
    }
    pendingBullet = null;
  }

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const nextLine = rawLines[i + 1] || "";

    if (BULLET_MARKER_REGEX.test(line)) {
      flushPendingBullet();
      pendingBullet = "";
      continue;
    }

    if (
      BULLET_LINE_REGEX.test(line) &&
      line.replace(BULLET_LINE_REGEX, "").trim()
    ) {
      flushPendingBullet();
      pendingBullet = line.replace(BULLET_LINE_REGEX, "").trim();
      continue;
    }

    if (pendingBullet !== null) {
      if (
        isLikelyEntryHeader(line) ||
        isLikelySectionHeader(line) ||
        (pendingBullet !== "" && line.length < 120 && hasDateRange(nextLine))
      ) {
        flushPendingBullet();
        normalized.push(line);
      } else {
        pendingBullet = `${pendingBullet} ${line}`.trim();
      }
      continue;
    }

    normalized.push(line);
  }

  flushPendingBullet();
  return normalized;
}

export function splitDateRange(dateStr: string): {
  start: string;
  end: string;
} {
  const trimmed = dateStr.trim();
  const match =
    trimmed.match(DATE_RANGE_TO_REGEX) && trimmed.match(DATE_RANGE_PARTS_REGEX);
  const spacedMatch = trimmed.match(SPACED_DATE_RANGE_PARTS_REGEX);
  const yearOnlyMatch = trimmed.match(YEAR_ONLY_DATE_RANGE_PARTS_REGEX);

  if (match) {
    return { start: match[1].trim(), end: match[2].trim() };
  }
  if (spacedMatch) {
    return { start: spacedMatch[1].trim(), end: spacedMatch[2].trim() };
  }
  if (yearOnlyMatch) {
    return { start: yearOnlyMatch[1].trim(), end: yearOnlyMatch[2].trim() };
  }

  // Fallback for unexpected formats. Keep ISO-like YYYY-MM tokens intact by
  // only splitting on spaced separators here.
  const parts = trimmed.split(/\s+[-–—]\s+|\s+to\s+/i);
  return {
    start: parts[0]?.trim() || "",
    end: parts[1]?.trim() || "",
  };
}

// Job title keywords for detecting titles vs company names
const JOB_TITLE_KEYWORDS =
  /\b(?:Engineer|Developer|Manager|Director|Analyst|Designer|Lead|Senior|Junior|Intern|Architect|Consultant|Coordinator|Specialist|Administrator|Associate|Assistant|Officer|VP|Vice\s+President|CTO|CEO|CFO|COO|Head\s+of|Principal|Staff|Technician|Supervisor|Representative|Strategist|Scientist|Researcher|Fellow)\b/i;

export function isJobTitle(text: string): boolean {
  return JOB_TITLE_KEYWORDS.test(text);
}

export function extractContact(text: string): {
  contact: ContactInfo;
  remainingText: string;
} {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const email = text.match(EMAIL_REGEX)?.[0];
  const phone = text.match(PHONE_REGEX)?.[0];
  const linkedin = text.match(LINKEDIN_REGEX)?.[0];
  const github = text.match(GITHUB_REGEX)?.[0];
  const website = text.match(URL_REGEX)?.[0];

  const name =
    lines
      .find(
        (l) =>
          !EMAIL_REGEX.test(l) &&
          !PHONE_REGEX.test(l) &&
          !URL_REGEX.test(l) &&
          l.length > 1 &&
          l.length < 60,
      )
      ?.replace(/^#{1,6}\s+/, "") || "";

  const locationMatch = text.match(
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),?\s*[A-Z]{2}(?:\s+\d{5})?/,
  );
  const location = locationMatch?.[0];

  let confidence = 0;
  if (name) confidence += 0.3;
  if (email) confidence += 0.3;
  if (phone) confidence += 0.2;
  if (location) confidence += 0.1;
  if (linkedin || github) confidence += 0.1;

  return {
    contact: {
      name,
      email,
      phone,
      location,
      linkedin,
      github,
      website,
      confidence,
    },
    remainingText: text,
  };
}

export function extractExperiences(text: string): Experience[] {
  const experiences: Experience[] = [];
  const lines = normalizeResumeLines(text);
  let currentEntry: {
    title: string;
    company: string;
    location?: string;
    dates: string;
    bullets: string[];
  } | null = null;
  let pendingHeader = "";

  function pushCurrentEntry() {
    if (!currentEntry) return;
    const { start, end } = splitDateRange(currentEntry.dates);
    experiences.push({
      id: generateId(),
      company: currentEntry.company || "Unknown",
      title: currentEntry.title || "Unknown",
      location: currentEntry.location,
      startDate: start,
      endDate: end,
      current: /present|current/i.test(currentEntry.dates),
      description: currentEntry.bullets.join("\n"),
      highlights: currentEntry.bullets,
      skills: [],
    });
  }

  function parseHeader(line: string, dateStr: string) {
    const withoutDates = stripDateRange(line)
      .replace(/\s*[-–—]\s*$/, "")
      .trim();
    const pipeParts = withoutDates
      .split(/\s*\|\s*/)
      .map((part) => part.trim())
      .filter((part) => part && !/^[-–—]+$/.test(part));
    if (pipeParts.length >= 2) {
      return {
        title: pipeParts[0],
        company: pipeParts[1],
        location: pipeParts.slice(2).join(" | ") || undefined,
        dates: dateStr,
        bullets: [],
      };
    }

    const parts = withoutDates
      .split(/\s+(?:[—–]|\||-)\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      return {
        title: parts[0],
        company: parts[1],
        location: parts.slice(2).join(" — ") || undefined,
        dates: dateStr,
        bullets: [],
      };
    }

    const atMatch = withoutDates.match(/^(.+?)\s+at\s+(.+)$/i);
    if (atMatch) {
      return {
        title: atMatch[1].trim(),
        company: atMatch[2].trim(),
        dates: dateStr,
        bullets: [],
      };
    }

    const commaParts = withoutDates
      .split(/\s*,\s*/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (commaParts.length >= 2 && isJobTitle(commaParts[0])) {
      return {
        title: commaParts[0],
        company: commaParts[1],
        location: commaParts.slice(2).join(", ") || undefined,
        dates: dateStr,
        bullets: [],
      };
    }

    const titlePart = removeDateRange(line);
    return { title: titlePart, company: "", dates: dateStr, bullets: [] };
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    const nextLine = lines[i + 1]?.trim() || "";

    if (isExperienceTableHeaderSequence(lines, i)) {
      i += 3;
      continue;
    }

    const tableRow = parseExperienceTableRowSequence(lines, i);
    if (tableRow) {
      pushCurrentEntry();
      currentEntry = tableRow;
      pendingHeader = "";
      i += 3;
      continue;
    }

    if (
      currentEntry &&
      currentEntry.bullets.length > 0 &&
      !BULLET_LINE_REGEX.test(trimmed) &&
      trimmed.length < 120 &&
      hasDateRange(nextLine)
    ) {
      pushCurrentEntry();
      currentEntry = null;
      pendingHeader = trimmed;
      continue;
    }

    if (isLikelyTableHeader(trimmed)) {
      continue;
    }

    if (hasDateRange(trimmed)) {
      pushCurrentEntry();
      const dateStr = extractDateRange(trimmed);
      currentEntry = parseHeader(
        pendingHeader ? `${pendingHeader} ${trimmed}` : trimmed,
        dateStr,
      );
      pendingHeader = "";
    } else if (currentEntry) {
      if (BULLET_LINE_REGEX.test(trimmed)) {
        currentEntry.bullets.push(trimmed.replace(BULLET_LINE_REGEX, ""));
      } else if (
        currentEntry.company &&
        !isLikelyEntryHeader(trimmed) &&
        !(trimmed.length < 80 && isJobTitle(trimmed) && !currentEntry.title)
      ) {
        if (currentEntry.bullets.length > 0 && trimmed.length < 100) {
          const lastIndex = currentEntry.bullets.length - 1;
          currentEntry.bullets[lastIndex] =
            `${currentEntry.bullets[lastIndex]} ${trimmed}`.trim();
        } else {
          currentEntry.bullets.push(trimmed);
        }
      } else if (trimmed.length < 80) {
        // Use job title keywords to disambiguate title vs company
        if (!currentEntry.title && isJobTitle(trimmed)) {
          currentEntry.title = trimmed;
        } else if (
          currentEntry.title &&
          isJobTitle(trimmed) &&
          !currentEntry.company
        ) {
          // Current title might actually be company, this is the real title
          currentEntry.company = currentEntry.title;
          currentEntry.title = trimmed;
        } else if (!currentEntry.company) {
          // If title exists but no company, and this line doesn't look like a title
          if (
            currentEntry.title &&
            !isJobTitle(currentEntry.title) &&
            isJobTitle(trimmed)
          ) {
            currentEntry.company = currentEntry.title;
            currentEntry.title = trimmed;
          } else {
            currentEntry.company = trimmed;
          }
        }
      }
    } else if (
      trimmed.length < 120 &&
      hasDateRange(nextLine) &&
      !isLikelyTableHeader(trimmed)
    ) {
      pendingHeader = trimmed;
    }
  }

  pushCurrentEntry();
  return experiences;
}

// Degree patterns for education parsing
const DEGREE_PATTERNS =
  /(?:Bachelor(?:'s)?|Master(?:'s)?|PhD|Ph\.D\.?|Doctorate|Associate(?:'s)?|B\.S\.?|B\.A\.?|BMath|BASc|B\.A\.Sc\.?|M\.S\.?|M\.A\.?|MBA|M\.Eng\.?|B\.Eng\.?|J\.D\.?|M\.D\.?|Doctor\s+of)/i;

// Abbreviated degree initials (B.S., M.S., MBA, Ph.D., …)
const DEGREE_ABBR_REGEX =
  /(?:B\.S\.?|B\.A\.?|BMath|BASc|B\.A\.Sc\.?|M\.S\.?|M\.A\.?|MBA|M\.Eng\.?|B\.Eng\.?|J\.D\.?|M\.D\.?|Ph\.D\.?)/i;
// Pattern for "B.S. in Computer Science"
const SHORT_DEGREE_FIELD_REGEX =
  /(?:B\.S\.?|B\.A\.?|BMath|BASc|B\.A\.Sc\.?|M\.S\.?|M\.A\.?|MBA|M\.Eng\.?|B\.Eng\.?|J\.D\.?|M\.D\.?|Ph\.D\.?)\s+(?:in\s+)?(.+?)(?:\s*[,|—–]|\s*$)/i;

// GPA patterns
const GPA_LABEL_REGEX = /GPA[:\s]*(\d\.\d+)/i;

// Latin honors to approximate GPA
const HONORS_GPA: Record<string, string> = {
  "summa cum laude": "3.9",
  "magna cum laude": "3.7",
  "cum laude": "3.5",
};

export function parseDegreeAndField(line: string): {
  degree: string;
  field: string;
} {
  // Try "Bachelor of Science in Mechanical Engineering" — with explicit "in" separator
  const longWithIn = line.match(
    /((?:Bachelor(?:'s)?|Master(?:'s)?|Associate(?:'s)?|Doctor(?:ate)?)\s+of\s+\w+(?:\s+\w+)*?)\s+in\s+(.+?)(?:\s*[,|]|\s*$)/i,
  );
  if (longWithIn) {
    return { degree: longWithIn[1].trim(), field: longWithIn[2].trim() };
  }

  // Try "Master of Business Administration" — no "in", field is what comes after "of"
  const longMatch = line.match(
    /((?:Bachelor(?:'s)?|Master(?:'s)?|Associate(?:'s)?|Doctor(?:ate)?)\s+of)\s+(.+?)(?:\s*[,|]|\s*$)/i,
  );
  if (longMatch) {
    return { degree: longMatch[0].trim(), field: longMatch[2].trim() };
  }

  // Try "B.S. in Computer Science" pattern
  const shortMatch = line.match(SHORT_DEGREE_FIELD_REGEX);
  if (shortMatch) {
    const degreeAbbr = line.match(DEGREE_ABBR_REGEX)?.[0] || "";
    return { degree: degreeAbbr.trim(), field: shortMatch[1]?.trim() || "" };
  }

  // Try "Master's in X" pattern
  const mastersIn = line.match(
    /(?:Bachelor(?:'s)?|Master(?:'s)?|Associate(?:'s)?)\s+in\s+(.+?)(?:\s*[,|]|\s*$)/i,
  );
  if (mastersIn) {
    const degreeType =
      line.match(/(?:Bachelor(?:'s)?|Master(?:'s)?|Associate(?:'s)?)/i)?.[0] ||
      "";
    return { degree: degreeType.trim(), field: mastersIn[1]?.trim() || "" };
  }

  // Fallback: whole line is degree, no field extracted
  return { degree: line.trim(), field: "" };
}

export function extractGpa(text: string): string | undefined {
  // Check for explicit GPA label
  const labelMatch = text.match(GPA_LABEL_REGEX);
  if (labelMatch) return labelMatch[1];

  // Check for numeric GPA pattern (e.g., "3.8/4.0")
  const numericMatch = text.match(/(\d\.\d+)\s*\/\s*4\.0/);
  if (numericMatch) return numericMatch[1];

  // Check for Latin honors
  const lowerText = text.toLowerCase();
  for (const [honor, gpa] of Object.entries(HONORS_GPA)) {
    if (lowerText.includes(honor)) return gpa;
  }

  return undefined;
}

export function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  const lines = normalizeResumeLines(text);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (isEducationTableHeaderSequence(lines, i)) {
      i += 2;
      continue;
    }

    if (
      line.length < 100 &&
      lines[i + 1] &&
      DEGREE_PATTERNS.test(lines[i + 1]) &&
      hasDateRange(lines[i + 2] || "") &&
      !DEGREE_PATTERNS.test(line) &&
      !isLikelyTableHeader(line)
    ) {
      const { degree, field } = parseDegreeAndField(lines[i + 1].trim());
      const { start, end } = splitDateRange(extractDateRange(lines[i + 2]));
      education.push({
        id: generateId(),
        institution: line,
        degree,
        field,
        startDate: start,
        endDate: end,
        gpa: extractGpa([line, lines[i + 1], lines[i + 2]].join(" ")),
        highlights: [],
      });
      i += 2;
      continue;
    }

    if (DEGREE_PATTERNS.test(line)) {
      const commaParts = line
        .split(/\s*,\s*/)
        .map((part) => part.trim())
        .filter(Boolean);
      const degreePartIndex = commaParts.findIndex((part) =>
        DEGREE_PATTERNS.test(part),
      );
      const commaInstitution =
        degreePartIndex > 0
          ? commaParts.slice(0, degreePartIndex).join(", ")
          : undefined;
      const commaDegreeLine =
        degreePartIndex > 0
          ? commaParts.slice(degreePartIndex).join(", ")
          : undefined;
      const sameLineParts = line
        .split(/\s+[—–]\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
      const pipeParts = stripDateRange(line)
        .split(/\s*\|\s*/)
        .map((part) => part.trim())
        .filter(Boolean);
      const pipeDegreePartIndex = pipeParts.findIndex((part) =>
        DEGREE_PATTERNS.test(part),
      );
      const pipeInstitution =
        pipeDegreePartIndex > 0
          ? pipeParts[pipeDegreePartIndex - 1]
          : undefined;
      const pipeDegreeLine =
        pipeDegreePartIndex >= 0 ? pipeParts[pipeDegreePartIndex] : undefined;
      const degreeLine =
        pipeDegreeLine ||
        commaDegreeLine ||
        (sameLineParts.length > 1 && !DEGREE_PATTERNS.test(sameLineParts[0])
          ? sameLineParts.slice(1).join(" — ")
          : line);
      const sameLineInstitution =
        pipeInstitution ||
        commaInstitution ||
        (sameLineParts.length > 1 && !DEGREE_PATTERNS.test(sameLineParts[0])
          ? sameLineParts[0]
          : undefined);
      // Parse degree and field
      const { degree, field } = parseDegreeAndField(
        stripSingleYear(stripDateRange(degreeLine)),
      );

      // Extract GPA from current line and up to 4 following lines
      // (GPA can appear after degree, institution, and date range)
      const contextLines = [
        line,
        lines[i + 1] || "",
        lines[i + 2] || "",
        lines[i + 3] || "",
        lines[i + 4] || "",
      ].join(" ");
      const gpa = extractGpa(contextLines);

      // Extract dates from line or nearby lines
      let startDate = "";
      let endDate = "";
      const dateContext = [
        line,
        lines[i + 1] || "",
        lines[i + 2] || "",
        lines[i + 3] || "",
        lines[i - 1] || "",
      ].join(" ");
      if (hasDateRange(dateContext)) {
        const dateStr = extractDateRange(dateContext);
        const parts = splitDateRange(dateStr);
        startDate = parts.start;
        endDate = parts.end;
      } else {
        endDate = extractSingleYear(dateContext);
      }

      // Institution: look at adjacent lines for non-degree, non-date text
      let institution = sameLineInstitution || "Unknown";
      for (const offset of [1, -1]) {
        if (sameLineInstitution) break;
        const adjacentLine = lines[i + offset]?.trim();
        if (
          adjacentLine &&
          !DEGREE_PATTERNS.test(adjacentLine) &&
          !hasDateRange(adjacentLine) &&
          !isLikelyTableHeader(adjacentLine) &&
          adjacentLine.length > 2 &&
          adjacentLine.length < 100
        ) {
          // Skip lines that look like GPA or honors
          if (/^(?:GPA|cum laude|\d\.\d)/i.test(adjacentLine)) continue;
          institution = adjacentLine;
          break;
        }
      }

      education.push({
        id: generateId(),
        institution,
        degree,
        field,
        startDate,
        endDate,
        gpa,
        highlights: [],
      });
    }
  }

  return education;
}

function normalizeSkillName(item: string): string {
  return item
    .replace(/\s+/g, " ")
    .replace(/[.,;:]+$/g, "")
    .trim();
}

function expandSkillItems(
  item: string,
  category: Skill["category"],
): Array<{ name: string; category: Skill["category"] }> {
  const cleaned = normalizeSkillName(item);
  const isLanguageItem =
    category === "language" || /\bbilingual\b/i.test(cleaned);
  if (!isLanguageItem) {
    return [{ name: cleaned, category }];
  }

  const languageText = cleaned
    .replace(/\b(?:bilingual|fluent|native|professional)\b(?:\s+in)?/gi, "")
    .trim();
  const parts = languageText
    .split(/\s*(?:\/|&|\band\b)\s*/i)
    .map(normalizeSkillName)
    .filter((part) => part.length >= 2);

  const names = parts.length > 1 ? parts : [cleaned];
  return names.map((name) => ({ name, category: "language" }));
}

export function extractSkills(text: string): Skill[] {
  const skills: Skill[] = [];
  const seen = new Set<string>();
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const labeled = line.match(SKILL_LABEL_REGEX);
    const category = skillCategoryForLabel(labeled?.[1]);
    const content = labeled ? labeled[2] : line;
    const items = content
      .split(SKILL_SPLIT_REGEX)
      .flatMap((item) => expandSkillItems(item, category))
      .map((item) => ({ ...item, name: normalizeSkillName(item.name) }))
      .filter((item) => {
        const normalized = item.name.toLowerCase();
        return (
          item.name.length >= 2 &&
          item.name.length <= 50 &&
          /[\p{L}\p{N}]/u.test(item.name) &&
          !ORPHAN_SKILL_LABELS.has(normalized)
        );
      });

    for (const { name, category: itemCategory } of items) {
      const dedupeKey = name.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      skills.push({
        id: generateId(),
        name,
        category: itemCategory,
      });
    }
  }

  return skills;
}

function extractProjects(text: string): Project[] {
  const projects: Project[] = [];
  const lines = normalizeResumeLines(text);
  let current: {
    name: string;
    description: string;
    technologies: string[];
    highlights: string[];
  } | null = null;

  function pushCurrent() {
    if (!current) return;
    projects.push({
      id: generateId(),
      name: current.name,
      description: current.description.trim(),
      url: undefined,
      technologies: current.technologies,
      highlights: current.highlights,
    });
  }

  function parseProjectHeader(line: string) {
    const cleanedLine = line.replace(/[^\p{L}\p{N}\s|.+#/-]/gu, "").trim();
    const parts = cleanedLine
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
    return {
      name: parts[0] || line.trim(),
      technologies: parts.slice(1),
    };
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (BULLET_LINE_REGEX.test(trimmed)) {
      const bullet = trimmed.replace(BULLET_LINE_REGEX, "").trim();
      if (current && bullet) {
        current.highlights.push(bullet);
        current.description += (current.description ? " " : "") + bullet;
      }
    } else if (/^[A-Z0-9]/.test(trimmed) && trimmed.length < 180) {
      pushCurrent();
      const { name, technologies } = parseProjectHeader(trimmed);
      current = { name, description: "", technologies, highlights: [] };
    } else if (current) {
      current.description += " " + trimmed;
    }
  }
  pushCurrent();

  return projects;
}

export function extractFieldsFromSections(
  sections: DetectedSection[],
): ExtractedFields {
  const contactSection = sections.find((s) => s.type === "contact");
  const summarySection = sections.find((s) => s.type === "summary");
  const experienceSection = sections.find((s) => s.type === "experience");
  const educationSection = sections.find((s) => s.type === "education");
  const skillsSection = sections.find((s) => s.type === "skills");
  const projectsSection = sections.find((s) => s.type === "projects");

  const { contact } = contactSection
    ? extractContact(contactSection.content)
    : { contact: { name: "", confidence: 0 } as ContactInfo };

  return {
    contact,
    summary: summarySection?.content || "",
    experiences: experienceSection
      ? extractExperiences(experienceSection.content)
      : [],
    education: educationSection
      ? extractEducation(educationSection.content)
      : [],
    skills: skillsSection ? extractSkills(skillsSection.content) : [],
    projects: projectsSection ? extractProjects(projectsSection.content) : [],
  };
}
