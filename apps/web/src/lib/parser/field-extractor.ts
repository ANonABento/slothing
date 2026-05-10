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
const BULLET_MARKER_REGEX = /^[•●○■▪▸\-–—*]$/;
const BULLET_LINE_REGEX = /^[•●○■▪▸\-–—*]\s*/;
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
  if (/^languages?$/.test(normalized)) return "language";
  if (/^tools?$/.test(normalized)) return "tool";
  if (/^(?:soft skills?|interpersonal)$/.test(normalized)) return "soft";
  if (/^(?:frameworks?|libraries?|databases?)$/.test(normalized)) {
    return "technical";
  }
  return "technical";
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
    .map((line) => line.trim())
    .filter(Boolean);
  let pendingBullet: string | null = null;

  function flushPendingBullet() {
    if (pendingBullet?.trim()) {
      normalized.push(`• ${pendingBullet.trim()}`);
    }
    pendingBullet = null;
  }

  for (const line of rawLines) {
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
      if (isLikelyEntryHeader(line) || isLikelySectionHeader(line)) {
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
  // Split on dash/em-dash or " to "
  const parts = dateStr.split(/\s*[-–—]\s*|\s+to\s+/i);
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
    lines.find(
      (l) =>
        !EMAIL_REGEX.test(l) &&
        !PHONE_REGEX.test(l) &&
        !URL_REGEX.test(l) &&
        l.length > 1 &&
        l.length < 60,
    ) || "";

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

    const titlePart = removeDateRange(line);
    return { title: titlePart, company: "", dates: dateStr, bullets: [] };
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (hasDateRange(trimmed)) {
      pushCurrentEntry();
      const dateStr = extractDateRange(trimmed);
      currentEntry = parseHeader(trimmed, dateStr);
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
    }
  }

  pushCurrentEntry();
  return experiences;
}

// Degree patterns for education parsing
const DEGREE_PATTERNS =
  /(?:Bachelor(?:'s)?|Master(?:'s)?|PhD|Ph\.D\.?|Doctorate|Associate(?:'s)?|B\.S\.?|B\.A\.?|BASc|B\.A\.Sc\.?|M\.S\.?|M\.A\.?|MBA|M\.Eng\.?|B\.Eng\.?|J\.D\.?|M\.D\.?|Doctor\s+of)/i;

// Abbreviated degree initials (B.S., M.S., MBA, Ph.D., …)
const DEGREE_ABBR_REGEX =
  /(?:B\.S\.?|B\.A\.?|BASc|B\.A\.Sc\.?|M\.S\.?|M\.A\.?|MBA|M\.Eng\.?|B\.Eng\.?|J\.D\.?|M\.D\.?|Ph\.D\.?)/i;
// Pattern for "B.S. in Computer Science"
const SHORT_DEGREE_FIELD_REGEX =
  /(?:B\.S\.?|B\.A\.?|BASc|B\.A\.Sc\.?|M\.S\.?|M\.A\.?|MBA|M\.Eng\.?|B\.Eng\.?|J\.D\.?|M\.D\.?|Ph\.D\.?)\s+(?:in\s+)?(.+?)(?:\s*[,|—–]|\s*$)/i;

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

    if (DEGREE_PATTERNS.test(line)) {
      const sameLineParts = line
        .split(/\s+[—–]\s+/)
        .map((part) => part.trim())
        .filter(Boolean);
      const degreeLine =
        sameLineParts.length > 1 && !DEGREE_PATTERNS.test(sameLineParts[0])
          ? sameLineParts.slice(1).join(" — ")
          : line;
      const sameLineInstitution =
        sameLineParts.length > 1 && !DEGREE_PATTERNS.test(sameLineParts[0])
          ? sameLineParts[0]
          : undefined;
      // Parse degree and field
      const { degree, field } = parseDegreeAndField(stripDateRange(degreeLine));

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
      .map((item) => item.trim())
      .filter((item) => {
        const normalized = item.toLowerCase();
        return (
          item.length >= 2 &&
          item.length <= 50 &&
          /[\p{L}\p{N}]/u.test(item) &&
          !ORPHAN_SKILL_LABELS.has(normalized)
        );
      });

    for (const name of items) {
      const dedupeKey = name.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      skills.push({
        id: generateId(),
        name,
        category,
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
