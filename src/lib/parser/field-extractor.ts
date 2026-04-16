/**
 * Deterministic field extractor for resume sections.
 * Extracts structured data from section text using regex/heuristics.
 * No LLM calls — pure pattern matching.
 */

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
const DATE_REGEX = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s*\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s*\d{4}|\d{1,2}\/\d{4}|\d{4}|[Pp]resent|[Cc]urrent)/g;

export function extractContact(text: string): { contact: ContactInfo; remainingText: string } {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const email = text.match(EMAIL_REGEX)?.[0];
  const phone = text.match(PHONE_REGEX)?.[0];
  const linkedin = text.match(LINKEDIN_REGEX)?.[0];
  const github = text.match(GITHUB_REGEX)?.[0];
  const website = text.match(URL_REGEX)?.[0];

  const name = lines.find(
    (l) => !EMAIL_REGEX.test(l) && !PHONE_REGEX.test(l) && !URL_REGEX.test(l) && l.length > 1 && l.length < 60
  ) || "";

  const locationMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),?\s*[A-Z]{2}(?:\s+\d{5})?/);
  const location = locationMatch?.[0];

  let confidence = 0;
  if (name) confidence += 0.3;
  if (email) confidence += 0.3;
  if (phone) confidence += 0.2;
  if (location) confidence += 0.1;
  if (linkedin || github) confidence += 0.1;

  return {
    contact: { name, email, phone, location, linkedin, github, website, confidence },
    remainingText: text,
  };
}

function extractExperiences(text: string): Experience[] {
  const experiences: Experience[] = [];
  const lines = text.split("\n");
  let currentEntry: { title: string; company: string; dates: string; bullets: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const hasDate = DATE_REGEX.test(trimmed);
    DATE_REGEX.lastIndex = 0;

    if (hasDate) {
      if (currentEntry) {
        experiences.push({
          id: generateId(),
          company: currentEntry.company || "Unknown",
          title: currentEntry.title || "Unknown",
          startDate: currentEntry.dates.split(/[-–—]/)[0]?.trim() || "",
          endDate: currentEntry.dates.split(/[-–—]/)[1]?.trim() || "",
          current: /present|current/i.test(currentEntry.dates),
          description: currentEntry.bullets.join("\n"),
          highlights: currentEntry.bullets,
          skills: [],
        });
      }
      const dateStr = trimmed.match(DATE_REGEX)?.[0] || "";
      DATE_REGEX.lastIndex = 0;
      const titlePart = trimmed.replace(DATE_REGEX, "").replace(/[|•·,]/g, " ").trim();
      DATE_REGEX.lastIndex = 0;
      currentEntry = { title: titlePart, company: "", dates: dateStr, bullets: [] };
    } else if (currentEntry) {
      if (/^[•\-*]/.test(trimmed)) {
        currentEntry.bullets.push(trimmed.replace(/^[•\-*]\s*/, ""));
      } else if (!currentEntry.company && trimmed.length < 80) {
        currentEntry.company = trimmed;
      }
    }
  }

  if (currentEntry) {
    experiences.push({
      id: generateId(),
      company: currentEntry.company || "Unknown",
      title: currentEntry.title || "Unknown",
      startDate: currentEntry.dates.split(/[-–—]/)[0]?.trim() || "",
      endDate: currentEntry.dates.split(/[-–—]/)[1]?.trim() || "",
      current: /present|current/i.test(currentEntry.dates),
      description: currentEntry.bullets.join("\n"),
      highlights: currentEntry.bullets,
      skills: [],
    });
  }

  return experiences;
}

function extractEducation(text: string): Education[] {
  const education: Education[] = [];
  const degreePatterns = /(?:Bachelor|Master|PhD|Ph\.D|Associate|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA|M\.Eng)/i;
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (degreePatterns.test(line)) {
      const gpaMatch = text.match(/GPA[:\s]*(\d\.\d+)/i);
      education.push({
        id: generateId(),
        institution: lines[i + 1]?.trim() || lines[i - 1]?.trim() || "Unknown",
        degree: line,
        field: "",
        startDate: "",
        endDate: "",
        gpa: gpaMatch?.[1],
        highlights: [],
      });
    }
  }

  return education;
}

function extractSkills(text: string): Skill[] {
  const items = text.split(/[,|•·\n]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 50);
  return items.map((name) => ({
    id: generateId(),
    name,
    category: "technical" as const,
    proficiency: "intermediate" as const,
  }));
}

function extractProjects(text: string): Project[] {
  const projects: Project[] = [];
  const lines = text.split("\n");
  let current: { name: string; description: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^[A-Z]/.test(trimmed) && trimmed.length < 80 && !/^[•\-*]/.test(trimmed)) {
      if (current) {
        projects.push({ id: generateId(), name: current.name, description: current.description.trim(), url: undefined, technologies: [], highlights: [] });
      }
      current = { name: trimmed, description: "" };
    } else if (current) {
      current.description += " " + trimmed;
    }
  }
  if (current) {
    projects.push({ id: generateId(), name: current.name, description: current.description.trim(), url: undefined, technologies: [], highlights: [] });
  }

  return projects;
}

export function extractFieldsFromSections(sections: DetectedSection[]): ExtractedFields {
  const contactSection = sections.find((s) => s.type === "contact");
  const summarySection = sections.find((s) => s.type === "summary");
  const experienceSection = sections.find((s) => s.type === "experience");
  const educationSection = sections.find((s) => s.type === "education");
  const skillsSection = sections.find((s) => s.type === "skills");
  const projectsSection = sections.find((s) => s.type === "projects");

  const { contact } = contactSection ? extractContact(contactSection.content) : { contact: { name: "", confidence: 0 } as ContactInfo };

  return {
    contact,
    summary: summarySection?.content || "",
    experiences: experienceSection ? extractExperiences(experienceSection.content) : [],
    education: educationSection ? extractEducation(educationSection.content) : [],
    skills: skillsSection ? extractSkills(skillsSection.content) : [],
    projects: projectsSection ? extractProjects(projectsSection.content) : [],
  };
}
