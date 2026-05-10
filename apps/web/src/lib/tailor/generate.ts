import type {
  BankEntry,
  GroupedBankEntries,
  LLMConfig,
  ContactInfo,
} from "@/types";
import type { TailoredResume } from "@/lib/resume/generator";
import { formatHackathonHighlights } from "@/lib/resume/hackathon-highlights";
import type { BankMatch } from "./analyze";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import { tailoredResumeSchema } from "@/lib/schemas/tailor";
import {
  filterUnsupportedClaims,
  getUnsupportedKeywords,
  stripUnsupportedClaims,
} from "@/lib/resume/generator";
import {
  getActivePromptVariant,
  DEFAULT_PROMPT_CONTENT,
  type PromptVariant,
} from "@/lib/db/prompt-variants";

export interface BankResumeInput {
  bankEntries: GroupedBankEntries;
  matchedEntries: BankMatch[];
  contact: ContactInfo;
  summary?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  userId: string;
}

export interface GenerateFromBankResult {
  resume: TailoredResume;
  baseResume: TailoredResume;
  promptVariantId: string | null;
}

/**
 * Generate a tailored resume from knowledge bank entries.
 * Uses LLM when available, falls back to keyword-based selection.
 * Returns the resume and the active prompt variant ID for result tracking.
 */
export async function generateFromBank(
  input: BankResumeInput,
  llmConfig: LLMConfig | null,
): Promise<GenerateFromBankResult> {
  const baseResume = generateBaseFromBank(input);
  if (llmConfig) {
    const activeVariant = getActivePromptVariant(input.userId);
    const resume = await generateWithLLM(input, llmConfig, activeVariant);
    return { resume, baseResume, promptVariantId: activeVariant?.id ?? null };
  }
  return { resume: baseResume, baseResume, promptVariantId: null };
}

async function generateWithLLM(
  input: BankResumeInput,
  llmConfig: LLMConfig,
  promptVariant: PromptVariant | null,
): Promise<TailoredResume> {
  const client = new LLMClient(llmConfig);
  const prompt = buildBankTailoredResumePrompt(input, promptVariant);

  const response = await client.complete({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
    maxTokens: 2000,
  });

  const parsed = parseJSONFromLLM<{
    summary?: string;
    experiences?: TailoredResume["experiences"];
    skills?: string[];
    education?: TailoredResume["education"];
  }>(response);
  const safeParsed = tailoredResumeSchema.partial().parse(parsed);
  const sourceEducation = mapBankEducation(input);
  const unsupportedKeywords = getUnsupportedKeywords(
    extractKeywordCandidates(input.jobDescription),
    buildBankEvidenceText(input),
  );

  return {
    contact: input.contact,
    summary: stripUnsupportedClaims(
      safeParsed.summary ||
        input.summary ||
        `Experienced professional seeking ${input.jobTitle} position.`,
      unsupportedKeywords,
    ),
    experiences: sanitizeExperiences(
      safeParsed.experiences || [],
      unsupportedKeywords,
    ),
    skills: filterUnsupportedClaims(
      safeParsed.skills || [],
      unsupportedKeywords,
    ),
    education: sourceEducation,
  };
}

export function buildBankTailoredResumePrompt(
  input: BankResumeInput,
  promptVariant: PromptVariant | null,
): string {
  const experienceEntries = formatBankCategory(input.bankEntries.experience);
  const skillEntries = formatBankCategory(input.bankEntries.skill);
  const educationEntries = formatBankCategory(input.bankEntries.education);
  const projectEntries = formatBankCategory(input.bankEntries.project);
  const hackathonEntries = formatBankCategory(input.bankEntries.hackathon);
  const bulletEntries = formatBankCategory(input.bankEntries.bullet);
  const achievementEntries = formatBankCategory(input.bankEntries.achievement);
  const certificationEntries = formatBankCategory(
    input.bankEntries.certification,
  );

  const instructions = promptVariant?.content ?? DEFAULT_PROMPT_CONTENT;

  return `Generate a tailored resume for this job using ONLY the knowledge bank entries provided. The resume must fit on ONE page.

CANDIDATE:
Name: ${input.contact.name}
Email: ${input.contact.email || "N/A"}
Phone: ${input.contact.phone || "N/A"}
Location: ${input.contact.location || "N/A"}
LinkedIn: ${input.contact.linkedin || "N/A"}
GitHub: ${input.contact.github || "N/A"}
Current Summary: ${input.summary || "N/A"}

KNOWLEDGE BANK - EXPERIENCES:
${experienceEntries}

KNOWLEDGE BANK - SKILLS:
${skillEntries}

KNOWLEDGE BANK - EDUCATION:
${educationEntries}

KNOWLEDGE BANK - PROJECTS:
${projectEntries}

KNOWLEDGE BANK - HACKATHONS:
${hackathonEntries}

KNOWLEDGE BANK - RESUME BULLETS:
${bulletEntries}

KNOWLEDGE BANK - ACHIEVEMENTS:
${achievementEntries}

KNOWLEDGE BANK - CERTIFICATIONS:
${certificationEntries}

JOB TARGET:
Title: ${input.jobTitle}
Company: ${input.company}
Description: ${input.jobDescription}

NON-OVERRIDABLE SAFETY RULES:
- Every added keyword, skill, tool, metric, employer, degree, certification, responsibility, and achievement must be backed by explicit knowledge bank evidence above
- Incorporate missing job keywords only when bank entries already support them; omit unsupported keywords rather than inventing support
- Do not invent metrics, tools, employers, degrees, certifications, dates, job titles, clients, or responsibilities
- Preserve contact details and education exactly from the source data; preserve employers, titles, and dates exactly for selected experiences
- If AWS, Kubernetes, or any other requested keyword is absent from the knowledge bank evidence, do not include it anywhere in the JSON
- Return schema-valid JSON only, with no markdown, labels, comments, or surrounding prose

STYLE AND PRIORITIZATION GUIDANCE:
${instructions}

Return ONLY a JSON object:
{
  "contact": ${JSON.stringify(input.contact)},
  "summary": "Tailored professional summary...",
  "experiences": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "dates": "Jan 2020 - Present",
      "highlights": ["Achievement 1 with supported metrics", "Achievement 2"]
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "education": [
    {
      "institution": "University",
      "degree": "Degree",
      "field": "Field",
      "date": "2020"
    }
  ]
}`;
}

export function generateBaseFromBank(input: BankResumeInput): TailoredResume {
  // Use matched entries sorted by relevance
  const usedEntryIds = new Set<string>();
  const topExperiences = input.matchedEntries
    .filter(
      (m) =>
        m.entry.category === "experience" || m.entry.category === "hackathon",
    )
    .slice(0, 3)
    .map((m) => {
      usedEntryIds.add(m.entry.id);
      return entryToResumeExperience(m.entry);
    });

  // If not enough matched experiences, fill from bank
  if (topExperiences.length < 2) {
    for (const entry of [
      ...input.bankEntries.experience,
      ...input.bankEntries.hackathon,
    ]) {
      if (topExperiences.length >= 3) break;
      if (!usedEntryIds.has(entry.id)) {
        topExperiences.push(entryToResumeExperience(entry));
        usedEntryIds.add(entry.id);
      }
    }
  }

  // Collect skills - prioritize matched ones
  const matchedSkillNames = new Set<string>();
  for (const m of input.matchedEntries) {
    if (m.entry.category === "skill") {
      matchedSkillNames.add(String(m.entry.content.name || ""));
    }
  }
  const bankSkillNames = input.bankEntries.skill
    .map((e) => String(e.content.name || ""))
    .filter(Boolean);
  const allSkills = [
    ...Array.from(matchedSkillNames),
    ...bankSkillNames.filter((s) => !matchedSkillNames.has(s)),
  ].slice(0, 15);

  // Education
  const education = input.bankEntries.education.map((e) => {
    const c = e.content;
    return {
      institution: String(c.institution || ""),
      degree: String(c.degree || ""),
      field: String(c.field || ""),
      date: String(c.endDate || ""),
    };
  });

  return {
    contact: input.contact,
    summary:
      input.summary ||
      `Experienced professional seeking ${input.jobTitle} position at ${input.company}.`,
    experiences: topExperiences,
    skills: allSkills,
    education,
  };
}

function formatBankCategory(entries: BankEntry[]): string {
  if (entries.length === 0) return "(none)";
  return entries
    .map((e, i) => `${i + 1}. ${JSON.stringify(e.content)}`)
    .join("\n");
}

function mapBankEducation(input: BankResumeInput): TailoredResume["education"] {
  return input.bankEntries.education.map((e) => {
    const c = e.content;
    return {
      institution: String(c.institution || ""),
      degree: String(c.degree || ""),
      field: String(c.field || ""),
      date: String(c.endDate || ""),
    };
  });
}

function buildBankEvidenceText(input: BankResumeInput): string {
  return JSON.stringify({
    summary: input.summary,
    bankEntries: input.bankEntries,
  }).toLowerCase();
}

function extractKeywordCandidates(jobDescription: string): string[] {
  const knownKeywords = jobDescription.match(
    /\b(?:AWS|Kubernetes|GraphQL|React|TypeScript|Python|Node\.js|Node|SQL)\b/g,
  );
  return Array.from(new Set(knownKeywords || []));
}

function sanitizeExperiences(
  experiences: TailoredResume["experiences"],
  unsupportedKeywords: string[],
): TailoredResume["experiences"] {
  return experiences.map((experience) => ({
    ...experience,
    highlights: filterUnsupportedClaims(
      experience.highlights,
      unsupportedKeywords,
    ),
  }));
}

function entryToResumeExperience(
  entry: BankEntry,
): TailoredResume["experiences"][number] {
  const c = entry.content;
  if (entry.category === "hackathon") {
    return {
      company: String(c.organizer || "Hackathon"),
      title: String(c.name || ""),
      dates: formatDateRange(c),
      highlights: formatHackathonHighlights(c).slice(0, 4),
    };
  }

  return {
    company: String(c.company || ""),
    title: String(c.title || ""),
    dates: formatDateRange(c),
    highlights: Array.isArray(c.highlights)
      ? c.highlights.map(String).slice(0, 4)
      : [],
  };
}

function formatDateRange(content: Record<string, unknown>): string {
  const start = content.startDate ? String(content.startDate) : "";
  const end = content.endDate ? String(content.endDate) : "";
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} - Present`;
  return end;
}
