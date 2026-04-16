/**
 * Deterministic resume field extractor — regex/pattern-based, zero LLM calls.
 * Extracts structured data from resume section text.
 * Deterministic field extractor for resume sections.
 * Extracts structured data from detected sections without LLM.
 */

import type {
  ContactInfo,
  Experience,
  Education,
  Skill,
  Project,
} from "@/types";
import { generateId } from "@/lib/utils";

// ─── Confidence helpers ──────────────────────────────────────────────

export interface ExtractedContact extends ContactInfo {
  confidence: number;
}

export interface ExtractedExperience extends Experience {
  confidence: number;
}

export interface ExtractedEducation extends Education {
  confidence: number;
}

export interface ExtractedSkill extends Skill {
  confidence: number;
}

export interface ExtractedProject extends Project {
  confidence: number;
}

function clampConfidence(n: number): number {
  return Math.max(0, Math.min(1, n));
}

// ─── Shared regex patterns ───────────────────────────────────────────

const EMAIL_RE = /[\w.+-]+@[\w.-]+\.\w{2,}/;
const PHONE_RE = /(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i;
const WEBSITE_RE =
  /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w]{2,}(?:\.[\w]{2,})?(?:\/[\w./-]*)?/i;
const LOCATION_RE =
  /([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*),\s*([A-Z]{2})\b/;
const REMOTE_RE = /\bremote\b/i;

// Date patterns
const MONTH_NAMES =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_RANGE_RE = new RegExp(
  `(${MONTH_NAMES}\\s*\\d{4}|\\d{1,2}\\/\\d{4}|\\d{4})` +
    `\\s*[-–—to]+\\s*` +
    `(${MONTH_NAMES}\\s*\\d{4}|\\d{1,2}\\/\\d{4}|\\d{4}|[Pp]resent|[Cc]urrent)`,
  "i"
);

const SINGLE_DATE_RE = new RegExp(
  `(${MONTH_NAMES}\\s*\\d{4}|\\d{1,2}\\/\\d{4}|\\d{4})`,
  "i"
);

// ─── Title heuristics ────────────────────────────────────────────────

const TITLE_KEYWORDS = [
  "engineer",
  "developer",
  "manager",
  "analyst",
  "designer",
  "architect",
  "director",
  "lead",
  "consultant",
  "specialist",
  "coordinator",
  "administrator",
  "intern",
  "associate",
  "senior",
  "junior",
  "principal",
  "staff",
  "vp",
  "president",
  "officer",
  "scientist",
  "researcher",
  "technician",
  "strategist",
  "recruiter",
  "accountant",
  "advisor",
];

const TITLE_RE = new RegExp(
  `\\b(${TITLE_KEYWORDS.join("|")})\\b`,
  "i"
);

// ─── Degree heuristics ──────────────────────────────────────────────

const DEGREE_PATTERNS = [
  /\b(?:Bachelor(?:'s)?|B\.?S\.?|B\.?A\.?|B\.?Eng\.?)\b/i,
  /\b(?:Master(?:'s)?|M\.?S\.?|M\.?A\.?|M\.?Eng\.?|MBA)\b/i,
  /\b(?:Doctor(?:ate)?|Ph\.?D\.?|D\.?Sc\.?)\b/i,
  /\b(?:Associate(?:'s)?|A\.?S\.?|A\.?A\.?)\b/i,
  /\bDiploma\b/i,
];

const GPA_RE = /(?:GPA|gpa)[:\s]*(\d\.\d+)(?:\s*\/\s*(\d\.\d+))?/;
const GPA_SLASH_RE = /(\d\.\d+)\s*\/\s*(4\.0|4\.00)/;

// ─── Skill categories ───────────────────────────────────────────────

const PROGRAMMING_LANGUAGES = new Set([
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "c++",
  "c#",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "scala",
  "r",
  "matlab",
  "perl",
  "lua",
  "haskell",
  "elixir",
  "dart",
  "objective-c",
  "sql",
  "html",
  "css",
  "bash",
  "shell",
  "powershell",
]);

const FRAMEWORKS = new Set([
  "react",
  "angular",
  "vue",
  "svelte",
  "next.js",
  "nextjs",
  "nuxt",
  "express",
  "fastapi",
  "django",
  "flask",
  "spring",
  "rails",
  "laravel",
  "tailwind",
  "bootstrap",
  "node.js",
  "nodejs",
  ".net",
  "dotnet",
  "redux",
  "graphql",
  "rest",
  "gatsby",
  "remix",
]);

const TOOLS = new Set([
  "git",
  "docker",
  "kubernetes",
  "aws",
  "gcp",
  "azure",
  "jenkins",
  "terraform",
  "ansible",
  "ci/cd",
  "jira",
  "figma",
  "webpack",
  "vite",
  "postgres",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "elasticsearch",
  "kafka",
  "rabbitmq",
  "linux",
  "nginx",
  "apache",
  "vercel",
  "heroku",
  "firebase",
  "supabase",
  "prisma",
  "drizzle",
]);

const SOFT_SKILLS = new Set([
  "leadership",
  "communication",
  "teamwork",
  "problem-solving",
  "problem solving",
  "critical thinking",
  "time management",
  "project management",
  "agile",
  "scrum",
  "mentoring",
  "collaboration",
  "presentation",
  "public speaking",
  "negotiation",
  "analytical",
  "creativity",
  "adaptability",
]);

// ─── 1. Contact extraction ──────────────────────────────────────────

export function extractContact(text: string): ExtractedContact {
  const lines = text.split("\n").map((l) => l.trim());
  let hits = 0;
  const total = 7; // name, email, phone, location, linkedin, github, website

  // Name: first non-empty line that isn't an email/phone/URL
  let name = "";
  for (const line of lines) {
    if (!line) continue;
    if (EMAIL_RE.test(line) && line.indexOf("@") < 5) continue;
    if (/^[\d(+]/.test(line) && PHONE_RE.test(line)) continue;
    if (/^https?:\/\//i.test(line)) continue;
    name = line.replace(/[|•·,].*$/, "").trim();
    if (name) {
      hits++;
import type { DetectedSection } from "./section-detector";

// ─── Contact extraction ─────────────────────────────────────────────

const EMAIL_RE = /[\w.+-]+@[\w.-]+\.\w{2,}/;
const PHONE_RE = /(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_RE = /linkedin\.com\/in\/[\w-]+/i;
const GITHUB_RE = /github\.com\/[\w-]+/i;
const WEBSITE_RE = /https?:\/\/(?!.*(?:linkedin|github)\.com)[\w.-]+\.\w{2,}[^\s,]*/i;
const LOCATION_RE =
  /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),?\s+([A-Z]{2})\b/; // "City, ST"

export function extractContact(text: string): { contact: ContactInfo; confidence: number } {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const email = text.match(EMAIL_RE)?.[0];
  const phone = text.match(PHONE_RE)?.[0];
  const linkedin = text.match(LINKEDIN_RE)?.[0];
  const github = text.match(GITHUB_RE)?.[0];
  const website = text.match(WEBSITE_RE)?.[0];
  const locationMatch = text.match(LOCATION_RE);
  const location = locationMatch ? locationMatch[0] : undefined;

  // Name is typically the first non-empty line that isn't an email/phone/URL
  let name = "";
  for (const line of lines) {
    if (EMAIL_RE.test(line) && line.length < 60) continue;
    if (PHONE_RE.test(line) && line.length < 30) continue;
    if (/^https?:\/\//.test(line)) continue;
    // Likely the name if short and contains letters
    if (line.length < 50 && /[a-zA-Z]/.test(line)) {
      name = line.replace(/[|•·,]+$/, "").trim();
      break;
    }
  }

  const emailMatch = text.match(EMAIL_RE);
  const email = emailMatch?.[0];
  if (email) hits++;

  const phoneMatch = text.match(PHONE_RE);
  const phone = phoneMatch?.[0]?.trim();
  if (phone) hits++;

  const locationMatch = text.match(LOCATION_RE);
  const remoteMatch = text.match(REMOTE_RE);
  const location = locationMatch
    ? `${locationMatch[1]}, ${locationMatch[2]}`
    : remoteMatch
      ? "Remote"
      : undefined;
  if (location) hits++;

  const linkedinMatch = text.match(LINKEDIN_RE);
  const linkedin = linkedinMatch?.[0];
  if (linkedin) hits++;

  const githubMatch = text.match(GITHUB_RE);
  const github = githubMatch?.[0];
  if (github) hits++;

  // Website: match URLs that aren't linkedin, github, or email domains
  let website: string | undefined;
  const urlMatches = text.match(
    new RegExp(WEBSITE_RE.source, "gi")
  );
  // Collect email domains to exclude
  const emailDomains = new Set<string>();
  const allEmails = text.match(new RegExp(EMAIL_RE.source, "gi"));
  if (allEmails) {
    for (const em of allEmails) {
      const domain = em.split("@")[1];
      if (domain) emailDomains.add(domain.toLowerCase());
    }
  }
  if (urlMatches) {
    for (const url of urlMatches) {
      const lower = url.toLowerCase();
      if (
        !lower.includes("linkedin.com") &&
        !lower.includes("github.com") &&
        !url.includes("@") &&
        !emailDomains.has(lower.replace(/^(?:https?:\/\/)?(?:www\.)?/, "")) &&
        /\.\w{2,}/.test(url)
      ) {
        website = url;
        hits++;
        break;
  // Confidence based on how many fields we found
  const fields = [name, email, phone, linkedin, github, location].filter(Boolean);
  const confidence = Math.min(1.0, fields.length / 4);

  return {
    contact: { name, email, phone, location, linkedin, github, website },
    confidence,
  };
}

// ─── Summary extraction ─────────────────────────────────────────────

export function extractSummary(section: DetectedSection): { summary: string; confidence: number } {
  // Remove the heading line, return the rest as summary text
  const lines = section.text.split("\n");
  const body = lines.slice(1).join("\n").trim();
  const confidence = body.length > 20 ? 0.9 : 0.4;
  return { summary: body, confidence };
}

// ─── Experience extraction ──────────────────────────────────────────

const DATE_RE =
  /\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}\b/i;
const DATE_RANGE_RE =
  /\b((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4})\s*[-–—to]+\s*((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?\d{4}|[Pp]resent|[Cc]urrent)\b/i;

/**
 * Split an experience section into individual job entries.
 * Each entry typically starts with a line containing a date range.
 */
export function extractExperiences(section: DetectedSection): {
  experiences: Experience[];
  confidence: number;
} {
  const lines = section.text.split("\n");
  // Skip the heading line
  const body = lines.slice(1);

  const entries: string[][] = [];
  let current: string[] = [];

  for (const line of body) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Blank line might separate entries
      continue;
    }

    // A date range line right after a non-date line belongs to the same entry (title + dates)
    const hasDate = DATE_RANGE_RE.test(trimmed);
    const prevHasDate = current.length > 0 && current.some((l) => DATE_RANGE_RE.test(l));

    // Start new entry if: this line has a date range AND previous entry already has dates
    // (meaning this is a new job entry, not the date line for the current title)
    if (hasDate && prevHasDate && current.length > 0) {
      entries.push([...current]);
      current = [trimmed];
    } else {
      current.push(trimmed);
    }
  }
  if (current.length > 0) entries.push(current);

  const experiences: Experience[] = [];

  for (const entry of entries) {
    const fullText = entry.join("\n");
    const dateMatch = fullText.match(DATE_RANGE_RE);

    // First line is often "Title at Company" or "Company — Title"
    const firstLine = entry[0];
    const { title, company } = parseTitleCompany(firstLine);

    // Highlights are bullet points
    const highlights: string[] = [];
    for (const line of entry.slice(1)) {
      const cleaned = line.replace(/^[-•*▪▸►◦]\s*/, "").trim();
      if (cleaned && !DATE_RANGE_RE.test(cleaned)) {
        highlights.push(cleaned);
      }
    }

    const isCurrent = dateMatch
      ? /present|current/i.test(dateMatch[2])
      : false;

    experiences.push({
      id: generateId(),
      company,
      title,
      startDate: dateMatch?.[1] || "",
      endDate: isCurrent ? undefined : dateMatch?.[2],
      current: isCurrent,
      description: highlights[0] || "",
      highlights,
      skills: [],
    });
  }

  // Confidence: higher if we found date ranges and multiple entries
  const hasEntries = experiences.length > 0;
  const hasDates = experiences.some((e) => e.startDate);
  const confidence = hasEntries ? (hasDates ? 0.8 : 0.5) : 0.2;

  return { experiences, confidence };
}

function parseTitleCompany(line: string): { title: string; company: string } {
  // Remove date ranges from the line
  const cleaned = line.replace(DATE_RANGE_RE, "").trim();

  // Try "Title at Company" or "Title, Company"
  const atMatch = cleaned.match(/^(.+?)\s+(?:at|@)\s+(.+)$/i);
  if (atMatch) return { title: atMatch[1].trim(), company: atMatch[2].trim() };

  // Try "Company — Title" or "Company | Title"
  const dashMatch = cleaned.match(/^(.+?)\s*[—–|]\s*(.+)$/);
  if (dashMatch) return { company: dashMatch[1].trim(), title: dashMatch[2].trim() };

  // Try "Company, Title" (only if no other separator found)
  const commaMatch = cleaned.match(/^(.+?),\s+(.+)$/);
  if (commaMatch) return { company: commaMatch[1].trim(), title: commaMatch[2].trim() };

  // Fallback: entire line is the title
  return { title: cleaned, company: "" };
}

// ─── Education extraction ───────────────────────────────────────────

const DEGREE_RE = /\b(bachelor|master|ph\.?d|associate|diploma|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a)\b/i;
const DEGREE_CAPTURE_RE = /\b(bachelor|master|ph\.?d|associate|diploma|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a)[^,\n]*/i;

export function extractEducation(section: DetectedSection): {
  education: Education[];
  confidence: number;
} {
  const lines = section.text.split("\n").slice(1); // skip heading
  const entries: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // New entry when we see a degree keyword or institution after content
    if (
      current.length > 0 &&
      DEGREE_RE.test(trimmed) &&
      !current.some((l) => DEGREE_RE.test(l))
    ) {
      entries.push([...current]);
      current = [trimmed];
    } else {
      current.push(trimmed);
    }
  }
  if (current.length > 0) entries.push(current);

  const education: Education[] = [];

  for (const entry of entries) {
    const fullText = entry.join("\n");
    const dateMatch = fullText.match(DATE_RANGE_RE) || fullText.match(DATE_RE);

    const degreeMatch = fullText.match(DEGREE_CAPTURE_RE);
    const degree = degreeMatch?.[0]?.trim() || entry[0];

    // Try to find "in Field" or "of Field"
    const fieldMatch = fullText.match(/\b(?:in|of)\s+([A-Z][^\n,]+)/i);
    const field = fieldMatch?.[1]?.trim() || "";

    // Institution: look for "University", "College", "Institute", etc.
    const instMatch = fullText.match(
      /\b[\w\s]*(University|College|Institute|School|Academy)[\w\s]*/i
    );
    const institution = instMatch?.[0]?.trim() || "";

    // GPA
    const gpaMatch = fullText.match(/\bGPA[:\s]*(\d+\.\d+)/i);
    const gpa = gpaMatch?.[1];

    education.push({
      id: generateId(),
      institution,
      degree,
      field,
      startDate: dateMatch?.[1],
      endDate: dateMatch?.[2],
      gpa,
      highlights: [],
    });
  }

  const confidence = education.length > 0 ? 0.7 : 0.2;
  return { education, confidence };
}

// ─── Skills extraction ──────────────────────────────────────────────

export function extractSkills(section: DetectedSection): {
  skills: Skill[];
  confidence: number;
} {
  const lines = section.text.split("\n").slice(1); // skip heading
  const body = lines.join("\n");

  // Skills are often comma-separated, bullet-separated, or one per line
  const skillNames: string[] = [];

  // First, try line-by-line parsing (handles "Category: skill1, skill2" format)
  let hasCategories = false;
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*▪▸►◦]\s*/, "").trim();
    if (!cleaned || cleaned.length >= 50) continue;

    const colonSplit = cleaned.match(/^[^:]+:\s*(.+)$/);
    if (colonSplit) {
      hasCategories = true;
      const items = colonSplit[1].split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      skillNames.push(...items);
    }
  }

  // If no "Category: items" lines found, try comma/semicolon/bullet split of full body
  if (!hasCategories) {
    const commaGroups = body.split(/[,;•|▪▸►◦]/).map((s) => s.trim()).filter(Boolean);
    if (commaGroups.length > 2) {
      for (const g of commaGroups) {
        const cleaned = g.replace(/^[-*]\s*/, "").trim();
        if (cleaned && cleaned.length < 40 && !cleaned.includes("\n")) {
          skillNames.push(cleaned);
        }
      }
    }
  }

  return {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    confidence: clampConfidence(hits / total),
  };
}

// ─── 2. Experience extraction ───────────────────────────────────────

function splitEntries(text: string): string[] {
  const lines = text.split("\n");
  const entries: string[] = [];
  // Fallback: one skill per line
  if (skillNames.length === 0) {
    for (const line of lines) {
      const cleaned = line.replace(/^[-•*▪▸►◦]\s*/, "").trim();
      if (cleaned && cleaned.length < 50) {
        skillNames.push(cleaned);
      }
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const skills: Skill[] = [];
  for (const name of skillNames) {
    const lower = name.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    skills.push({
      id: generateId(),
      name,
      category: categorizeSkill(name),
    });
  }

  const confidence = skills.length > 0 ? 0.8 : 0.2;
  return { skills, confidence };
}

function categorizeSkill(name: string): Skill["category"] {
  const lower = name.toLowerCase();
  const techKeywords = [
    "javascript", "typescript", "python", "java", "c++", "c#", "rust", "go",
    "react", "angular", "vue", "node", "express", "django", "flask", "spring",
    "sql", "nosql", "mongodb", "postgres", "mysql", "redis", "aws", "azure",
    "gcp", "docker", "kubernetes", "terraform", "git", "ci/cd", "graphql",
    "rest", "api", "html", "css", "sass", "tailwind", "webpack", "vite",
    "linux", "bash", "shell", "swift", "kotlin", "ruby", "php", "scala",
    "machine learning", "deep learning", "data science", "ai",
  ];
  const toolKeywords = [
    "jira", "confluence", "figma", "sketch", "photoshop", "illustrator",
    "slack", "notion", "trello", "asana", "github", "gitlab", "bitbucket",
    "jenkins", "circleci", "datadog", "splunk", "tableau", "excel",
    "vs code", "vscode", "intellij", "xcode",
  ];
  const softKeywords = [
    "leadership", "communication", "teamwork", "problem solving",
    "time management", "collaboration", "mentoring", "agile", "scrum",
    "project management", "strategic", "analytical", "creative",
  ];
  const langKeywords = [
    "english", "spanish", "french", "german", "mandarin", "chinese",
    "japanese", "korean", "portuguese", "arabic", "hindi", "italian",
    "russian", "dutch",
  ];

  if (techKeywords.some((k) => lower.includes(k))) return "technical";
  if (toolKeywords.some((k) => lower.includes(k))) return "tool";
  if (softKeywords.some((k) => lower.includes(k))) return "soft";
  if (langKeywords.some((k) => lower.includes(k))) return "language";
  return "other";
}

// ─── Projects extraction ────────────────────────────────────────────

export function extractProjects(section: DetectedSection): {
  projects: Project[];
  confidence: number;
} {
  const lines = section.text.split("\n").slice(1); // skip heading
  const entries: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.length > 0) {
        entries.push(current.join("\n"));
        entries.push([...current]);
        current = [];
      }
      continue;
    }

    // New entry heuristic: line has a date range and current block already has content
    if (current.length > 0 && DATE_RANGE_RE.test(trimmed) && !isBullet(trimmed)) {
      // Check if previous lines also had a date — if so, this is a new entry
      const prevText = current.join("\n");
      if (DATE_RANGE_RE.test(prevText)) {
        entries.push(prevText);
        current = [trimmed];
        continue;
      }
    }

    current.push(trimmed);
  }

  if (current.length > 0) {
    entries.push(current.join("\n"));
  }

  return entries;
}

function isBullet(line: string): boolean {
  return /^[•\-*▪◦●]\s/.test(line.trim()) || /^\d+[.)]\s/.test(line.trim());
}

function extractBullets(lines: string[]): string[] {
  return lines
    .filter((l) => isBullet(l.trim()))
    .map((l) => l.trim().replace(/^[•\-*▪◦●]\s*/, "").replace(/^\d+[.)]\s*/, ""));
}

export function extractExperiences(text: string): ExtractedExperience[] {
  const entries = splitEntries(text);
  const results: ExtractedExperience[] = [];

  for (const entry of entries) {
    const lines = entry.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let hits = 0;
    const total = 5; // company, title, dates, location, bullets

    // Extract date range
    const dateMatch = entry.match(DATE_RANGE_RE);
    let startDate = "";
    let endDate: string | undefined;
    let current = false;
    if (dateMatch) {
      startDate = dateMatch[1];
      const endRaw = dateMatch[2];
      if (/present|current/i.test(endRaw)) {
        current = true;
        endDate = "Present";
      } else {
        endDate = endRaw;
      }
      hits++;
    }

    // Extract location
    const locMatch = entry.match(LOCATION_RE);
    const remMatch = entry.match(REMOTE_RE);
    const location = locMatch
      ? `${locMatch[1]}, ${locMatch[2]}`
      : remMatch
        ? "Remote"
        : undefined;
    if (location) hits++;

    // Extract bullets
    const bullets = extractBullets(lines);
    if (bullets.length > 0) hits++;

    // Find title and company from non-bullet, non-date lines
    const headerLines = lines.filter(
      (l) => !isBullet(l) && !DATE_RANGE_RE.test(l)
    );

    let title = "";
    let company = "";

    // Strategy: look for lines matching title keywords
    for (const hl of headerLines) {
      // Remove location and date fragments for cleaner matching
      const clean = hl
        .replace(LOCATION_RE, "")
        .replace(REMOTE_RE, "")
        .replace(DATE_RANGE_RE, "")
        .trim();
      if (!clean) continue;

      if (TITLE_RE.test(clean) && !title) {
        title = clean.replace(/[|,]\s*$/, "").trim();
        hits++;
      } else if (!company) {
        company = clean.replace(/[|,]\s*$/, "").trim();
        hits++;
      }
    }

    // If we found a date range line that also contains title/company info, parse it
    if (!title && !company && dateMatch) {
      const dateLine = lines.find((l) => DATE_RANGE_RE.test(l)) || "";
      const beforeDate = dateLine.split(DATE_RANGE_RE)[0].trim();
      if (beforeDate) {
        if (TITLE_RE.test(beforeDate)) {
          title = beforeDate.replace(/[|,–—-]\s*$/, "").trim();
          hits++;
        } else {
          company = beforeDate.replace(/[|,–—-]\s*$/, "").trim();
          hits++;
        }
      }
    }

    // Swap if title looks more like company (no title keywords but company slot has them)
    if (!title && company && TITLE_RE.test(company)) {
      title = company;
      company = "";
    }

    // Skip entries with almost no useful data
    if (!title && !company && bullets.length === 0 && !dateMatch) continue;

    results.push({
      id: generateId(),
      company,
      title,
      location,
      startDate,
      endDate,
      current,
      description: bullets[0] || "",
      highlights: bullets,
      skills: [],
      confidence: clampConfidence(hits / total),
    });
  }

  return results;
}

// ─── 3. Education extraction ────────────────────────────────────────

export function extractEducation(text: string): ExtractedEducation[] {
  const entries = splitEntries(text);
  const results: ExtractedEducation[] = [];

  for (const entry of entries) {
    const lines = entry.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let hits = 0;
    const total = 5; // degree, institution, field, dates, gpa

    // Find degree
    let degree = "";
    let degreeLine = "";
    for (const line of lines) {
      for (const pattern of DEGREE_PATTERNS) {
        const match = line.match(pattern);
        if (match) {
          degree = match[0];
          degreeLine = line;
          hits++;
          break;
        }
      }
      if (degree) break;
    }

    // If no degree keyword found, skip this entry
    if (!degree && !DATE_RANGE_RE.test(entry)) continue;

    // Extract field of study from degree line
    let field = "";
    if (degreeLine) {
      // Patterns like "B.S. in Computer Science" or "Bachelor of Science, Computer Science"
      const fieldMatch = degreeLine.match(
        /(?:in|of|,)\s+([A-Z][A-Za-z\s&]+?)(?:\s*[,|(\n]|$)/
      );
      if (fieldMatch) {
        field = fieldMatch[1].trim();
        hits++;
      }
    }

    // Extract dates
    const dateMatch = entry.match(DATE_RANGE_RE);
    let startDate: string | undefined;
    let endDate: string | undefined;
    if (dateMatch) {
      startDate = dateMatch[1];
      endDate = /present|current/i.test(dateMatch[2]) ? "Present" : dateMatch[2];
      hits++;
    } else {
      const singleDate = entry.match(SINGLE_DATE_RE);
      if (singleDate) {
        endDate = singleDate[1];
        hits++;
      }
    }

    // Extract GPA
    let gpa: string | undefined;
    const gpaMatch = entry.match(GPA_RE) || entry.match(GPA_SLASH_RE);
    if (gpaMatch) {
      gpa = gpaMatch[2] ? `${gpaMatch[1]}/${gpaMatch[2]}` : gpaMatch[1];
      hits++;
    }

    // Institution: line that isn't the degree line and isn't a bullet
    let institution = "";
    for (const line of lines) {
      if (line === degreeLine) continue;
      if (isBullet(line)) continue;
      if (DATE_RANGE_RE.test(line) && !line.replace(DATE_RANGE_RE, "").trim()) continue;
      const clean = line
        .replace(DATE_RANGE_RE, "")
        .replace(SINGLE_DATE_RE, "")
        .replace(GPA_RE, "")
        .replace(GPA_SLASH_RE, "")
        .replace(LOCATION_RE, "")
        .trim();
      if (clean && clean.length > 2) {
        institution = clean.replace(/[|,]\s*$/, "").trim();
        hits++;
        break;
      }
    }

    // If degree line contains institution too (e.g., "B.S. Computer Science, MIT")
    if (!institution && degreeLine) {
      // Take the part after removing degree and field
      const remaining = degreeLine
        .replace(DEGREE_PATTERNS.find((p) => p.test(degreeLine)) || "", "")
        .replace(/(?:in|of)\s+[A-Z][A-Za-z\s&]+/, "")
        .replace(/[,|]\s*/, "")
        .trim();
      if (remaining && remaining.length > 2) {
        institution = remaining;
        hits++;
      }
    }

    // Highlights: bullets
    const highlights = extractBullets(lines);

    results.push({
      id: generateId(),
      institution,
      degree,
      field,
      startDate,
      endDate,
      gpa,
      highlights,
      confidence: clampConfidence(hits / total),
    });
  }

  return results;
}

// ─── 4. Skills extraction ───────────────────────────────────────────

function categorizeSkill(
  name: string
): Skill["category"] {
  const lower = name.toLowerCase().trim();
  if (PROGRAMMING_LANGUAGES.has(lower) || FRAMEWORKS.has(lower)) return "technical";
  if (TOOLS.has(lower)) return "tool";
  if (SOFT_SKILLS.has(lower)) return "soft";
  // Check partial matches for multi-word entries
  for (const s of Array.from(SOFT_SKILLS)) {
    if (lower.includes(s) || s.includes(lower)) return "soft";
  }
  return "other";
}

export function extractSkills(text: string): ExtractedSkill[] {
  const skills: ExtractedSkill[] = [];
  const seen = new Set<string>();

  // Split by common delimiters: comma, pipe, bullet, newline
  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Remove category headers like "Languages:", "Frameworks:", "Tools:"
    const withoutHeader = trimmed.replace(
      /^(?:Languages|Frameworks|Libraries|Tools|Technologies|Technical Skills|Soft Skills|Programming|Databases|Cloud|DevOps|Other)[:\s-]*/i,
      ""
    );

    // Split by comma, pipe, bullet, semicolon
    const items = withoutHeader
      .split(/[,|;•·▪◦●]|\s{2,}/)
      .map((s) => s.replace(/^[-*]\s*/, "").trim())
      .filter((s) => s.length > 0 && s.length < 50);

    for (const item of items) {
      const normalized = item.toLowerCase().trim();
      if (seen.has(normalized)) continue;
      if (normalized.length < 1) continue;
      seen.add(normalized);

      const category = categorizeSkill(item);
      // Confidence: known categories get higher confidence
      const confidence = category !== "other" ? 0.9 : 0.6;

      skills.push({
        id: generateId(),
        name: item,
        category,
        confidence,
      });
    }
  }

  return skills;
}

// ─── 5. Projects extraction ─────────────────────────────────────────

const URL_RE = /(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[\w]{2,}(?:\/[\w./?=&#-]*)?/gi;

export function extractProjects(text: string): ExtractedProject[] {
  const entries = splitEntries(text);
  const results: ExtractedProject[] = [];

  for (const entry of entries) {
    const lines = entry.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let hits = 0;
    const total = 4; // name, description, technologies, url

    // Name: first non-bullet line
    let name = "";
    for (const line of lines) {
      if (!isBullet(line)) {
        name = line
          .replace(DATE_RANGE_RE, "")
          .replace(URL_RE, "")
          .replace(/[|–—-]\s*$/, "")
          .trim();
        if (name) {
          hits++;
          break;
        }
      }
    }

    // URL
    const urlMatches = entry.match(URL_RE);
    let url: string | undefined;
    if (urlMatches) {
      // Prefer github links
      url =
        urlMatches.find((u) => /github\.com/i.test(u)) || urlMatches[0];
      hits++;
    }

    // Bullets as highlights
    const highlights = extractBullets(lines);
    const description = highlights[0] || "";
    if (description) hits++;

    // Technologies: look for "Technologies:", "Tech Stack:", "Built with:" or bracketed lists
    let technologies: string[] = [];
    for (const line of lines) {
      const techMatch = line.match(
        /(?:Technologies|Tech Stack|Built with|Tools used|Stack)\s*[:\-–]\s*(.*)/i
      );
      if (techMatch) {
        technologies = techMatch[1]
          .split(/[,|;]/)
          .map((s) => s.trim())
          .filter(Boolean);
        hits++;
        break;
      }
      // Bracketed: [React, Node.js, PostgreSQL]
      const bracketMatch = line.match(/\[([^\]]+)\]/);
      if (bracketMatch) {
        technologies = bracketMatch[1]
          .split(/[,|;]/)
          .map((s) => s.trim())
          .filter(Boolean);
        hits++;
        break;
      }
    }

    if (!name && highlights.length === 0) continue;

    results.push({
      id: generateId(),
      name,
      description,
      url,
      technologies,
      highlights,
      confidence: clampConfidence(hits / total),
    });
  }

  return results;
    // New entry if line doesn't start with a bullet and we have content
    if (current.length > 0 && !/^[-•*▪▸►◦]/.test(trimmed) && !trimmed.startsWith(" ")) {
      entries.push([...current]);
      current = [trimmed];
    } else {
      current.push(trimmed);
    }
  }
  if (current.length > 0) entries.push(current);

  const projects: Project[] = [];
  for (const entry of entries) {
    const name = entry[0].replace(/^[-•*]\s*/, "").trim();
    const highlights: string[] = [];
    const technologies: string[] = [];

    for (const line of entry.slice(1)) {
      const cleaned = line.replace(/^[-•*▪▸►◦]\s*/, "").trim();
      // Look for tech stack line
      const techMatch = cleaned.match(/^(?:tech(?:nolog(?:y|ies))?|stack|built\s+with|tools?)[:\s]+(.+)$/i);
      if (techMatch) {
        technologies.push(
          ...techMatch[1].split(/[,;]/).map((t) => t.trim()).filter(Boolean)
        );
      } else if (cleaned) {
        highlights.push(cleaned);
      }
    }

    // Try to extract URL from name or highlights
    const urlMatch = entry.join(" ").match(/https?:\/\/[^\s)]+/);

    projects.push({
      id: generateId(),
      name,
      description: highlights[0] || "",
      url: urlMatch?.[0],
      technologies,
      highlights,
    });
  }

  const confidence = projects.length > 0 ? 0.7 : 0.2;
  return { projects, confidence };
}

// ─── Main extractor ─────────────────────────────────────────────────

export interface ExtractedFields {
  contact: ContactInfo;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  sectionConfidences: Record<string, number>;
}

/**
 * Extract structured fields from detected sections.
 * Returns extracted data and per-section confidence scores.
 */
export function extractFieldsFromSections(sections: DetectedSection[]): ExtractedFields {
  let contact: ContactInfo = { name: "" };
  let summary: string | undefined;
  const experiences: Experience[] = [];
  const education: Education[] = [];
  const skills: Skill[] = [];
  const projects: Project[] = [];
  const sectionConfidences: Record<string, number> = {};

  for (const section of sections) {
    switch (section.type) {
      case "contact": {
        const result = extractContact(section.text);
        contact = result.contact;
        sectionConfidences["contact"] = result.confidence;
        break;
      }
      case "summary": {
        const result = extractSummary(section);
        summary = result.summary;
        sectionConfidences["summary"] = result.confidence;
        break;
      }
      case "experience": {
        const result = extractExperiences(section);
        experiences.push(...result.experiences);
        sectionConfidences["experience"] = result.confidence;
        break;
      }
      case "education": {
        const result = extractEducation(section);
        education.push(...result.education);
        sectionConfidences["education"] = result.confidence;
        break;
      }
      case "skills": {
        const result = extractSkills(section);
        skills.push(...result.skills);
        sectionConfidences["skills"] = result.confidence;
        break;
      }
      case "projects": {
        const result = extractProjects(section);
        projects.push(...result.projects);
        sectionConfidences["projects"] = result.confidence;
        break;
      }
      default:
        // unknown sections get their detected confidence
        sectionConfidences[`unknown_${section.startLine}`] = section.confidence;
        break;
    }
  }

  return { contact, summary, experiences, education, skills, projects, sectionConfidences };
}
