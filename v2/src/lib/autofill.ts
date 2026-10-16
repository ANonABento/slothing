import { z } from "zod";

import { bestAnswer, matchOption } from "./answers";
import type { Answer, Profile } from "./types";

/* ─── Filling an application form, no AI ───
 * The extension reads a form's fields (label, name, type, options) and sends them here; this decides
 * what goes in each one. Identity fields (name, email, links, current role) come from the profile,
 * file inputs get the job's tailored resume or letter, and every other question is looked up in the
 * answer bank. Nothing is invented: a question with no saved answer is left for you (or an AI draft
 * you ask for). Ported in spirit from v1's field-patterns.ts, much smaller.
 */

export const FIELD_KINDS = ["text", "email", "tel", "url", "number", "date", "textarea", "select", "radio", "file"] as const;

export const FormField = z.object({
  /** Stable for one read of the page: frame + position. */
  id: z.string(),
  kind: z.enum(FIELD_KINDS),
  label: z.string().default(""),
  name: z.string().default(""),
  placeholder: z.string().default(""),
  autocomplete: z.string().default(""),
  /** Option texts for a select or radio group. */
  options: z.array(z.string()).default([]),
  required: z.boolean().default(false),
  /** What's in it now: text, or the chosen option's text. "" when empty or on a placeholder option. */
  value: z.string().default(""),
});
export type FormField = z.infer<typeof FormField>;

export type ProfileKey =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "phone"
  | "city"
  | "location"
  | "linkedin"
  | "github"
  | "twitter"
  | "website"
  | "currentCompany"
  | "currentTitle"
  | "school"
  | "degree";

export type FieldRole = { type: "profile"; key: ProfileKey } | { type: "file"; doc: "resume" | "letter" } | { type: "question" };

// Checked in order: the first rule whose pattern matches (and whose `not` doesn't) wins.
const RULES: { key: ProfileKey; auto?: string[]; re: RegExp; not?: RegExp }[] = [
  { key: "linkedin", re: /linked\s*in/i },
  { key: "github", re: /git\s*hub/i },
  { key: "twitter", re: /twitter|\bx\.com\b|\bx handle\b/i },
  { key: "email", auto: ["email"], re: /e-?mail/i, not: /confirm|re-?enter|referr|manager|recruiter/i },
  { key: "phone", auto: ["tel", "tel-national"], re: /phone|mobile|cell|telephone/i, not: /type|extension|ext\b|country code/i },
  { key: "firstName", auto: ["given-name"], re: /first\s*name|given\s*name|forename|first_name|fname/i, not: /prefer|legal last/i },
  { key: "lastName", auto: ["family-name"], re: /last\s*name|surname|family\s*name|last_name|lname/i },
  { key: "fullName", auto: ["name"], re: /^\W*(full\s*|legal\s*|your\s*)?name\W*$|full[\s_]*name|^candidate[\s_]*name/i, not: /company|school|university|reference|emergency|manager|recruiter|employer|referr|prefer/i },
  { key: "website", auto: ["url"], re: /website|portfolio|personal\s*(site|url|page)|blog/i, not: /company/i },
  { key: "currentCompany", auto: ["organization"], re: /(current|present|most recent)\s*(company|employer)|^\W*(company|employer)\W*$|company\s*name/i, not: /previous|past|former|why|applying/i },
  { key: "currentTitle", auto: ["organization-title"], re: /(current|present|most recent)\s*(job\s*)?(title|position|role)|^\W*(job\s*)?title\W*$/i, not: /previous|past|desired|applying/i },
  { key: "city", auto: ["address-level2"], re: /^\W*city\W*$|current\s*city|city\s*of\s*residence/i },
  { key: "location", re: /^\W*(current\s*)?location\W*$|where\s*are\s*you\s*(currently\s*)?(based|located)|location\s*\(city/i, not: /preferred|desired|willing|open to/i },
  { key: "school", re: /^\W*(school|university|college|institution)(\s*name)?\W*$/i },
  { key: "degree", re: /^\W*degree\W*$/i },
];

const RESUME = /resume|r[ée]sum[ée]|\bcv\b|curriculum/i;
const LETTER = /cover\s*letter|motivation\s*letter/i;

/** What a field asks for. Labels decide; name and placeholder only help when the label is empty or generic. */
export function classify(f: FormField): FieldRole {
  const hay = [f.label, f.name, f.placeholder].filter(Boolean).join(" ");
  if (f.kind === "file") return LETTER.test(hay) ? { type: "file", doc: "letter" } : RESUME.test(hay) || !f.label ? { type: "file", doc: "resume" } : { type: "question" };
  // A long-form question that mentions LinkedIn ("Tell us about your experience on LinkedIn") isn't the URL field.
  if (f.kind === "textarea" && f.label.length > 60) return { type: "question" };
  const auto = f.autocomplete.toLowerCase().split(/\s+/);
  for (const r of RULES) {
    if (r.auto?.some((a) => auto.includes(a))) return { type: "profile", key: r.key };
    // Label first: "name" attributes are often generated ("question_123").
    const text = f.label || [f.placeholder, f.name.replace(/[_\-[\]]+/g, " ")].join(" ");
    if (r.re.test(text) && !(r.not && r.not.test(text))) return { type: "profile", key: r.key };
  }
  return { type: "question" };
}

const isCurrent = (end: string) => !end.trim() || /present|current|now|today/i.test(end);
const withScheme = (u: string) => (!u || /^[a-z]+:\/\//i.test(u) ? u : `https://${u}`);

/** The profile's value for an identity field, or "" when the profile doesn't have it. */
export function profileValue(p: Profile, key: ProfileKey): string {
  // "Dana Smith, RN, CCRN": credentials after a comma aren't part of the name a form wants.
  const name = p.contact.name.split(",")[0].trim().replace(/\s+/g, " ");
  const parts = name.split(" ");
  const link = (re: RegExp) => withScheme(p.contact.links.find((l) => re.test(l.url))?.url ?? "");
  const current = p.experience.find((e) => isCurrent(e.end));
  switch (key) {
    case "firstName":
      return parts.length > 1 ? parts[0] : name;
    case "lastName":
      return parts.length > 1 ? parts.slice(1).join(" ") : "";
    case "fullName":
      return name;
    case "email":
      return p.contact.email.trim();
    case "phone":
      return p.contact.phone.trim();
    case "location":
      return p.contact.location.trim();
    case "city":
      return p.contact.location.split(/[,·]/)[0].trim();
    case "linkedin":
      return link(/linkedin\.com/i);
    case "github":
      return link(/github\.com/i);
    case "twitter":
      return link(/twitter\.com|(^|\/\/|\.)x\.com/i);
    case "website":
      return withScheme(p.contact.links.find((l) => l.url && !/linkedin\.com|github\.com|twitter\.com|(^|\/\/|\.)x\.com/i.test(l.url))?.url ?? "");
    case "currentCompany":
      return current?.company.trim() ?? "";
    case "currentTitle":
      return current?.title.trim() ?? "";
    case "school":
      return p.education[0]?.school.trim() ?? "";
    case "degree":
      return p.education[0]?.degree.trim() ?? "";
  }
}

/** What to put in one field. `option` is an index into the field's options (select, radio). */
export type Fill =
  | { id: string; source: "profile"; value: string; option?: number }
  | { id: string; source: "bank"; value: string; option?: number; answerId: string }
  | { id: string; source: "file"; doc: "resume" | "letter" };

export type Skip = { id: string; reason: "has-value" | "no-answer" | "no-option" | "no-profile-value" | "no-document" };

export interface FillPlan {
  fills: Fill[];
  skipped: Skip[];
}

const CHOICE = new Set(["select", "radio"]);

/**
 * Decide every field. A field that already has a value is kept (you typed it, or a previous fill did).
 * `docs` says which tailored documents the job has, so file inputs are only claimed when there's a PDF.
 */
export function planFill(fields: FormField[], profile: Profile, bank: Answer[], docs: { resume: boolean; letter: boolean }): FillPlan {
  const plan: FillPlan = { fills: [], skipped: [] };
  for (const f of fields) {
    const role = classify(f);
    if (role.type === "file") {
      if (docs[role.doc]) plan.fills.push({ id: f.id, source: "file", doc: role.doc });
      else plan.skipped.push({ id: f.id, reason: "no-document" });
      continue;
    }
    if (f.value.trim()) {
      plan.skipped.push({ id: f.id, reason: "has-value" });
      continue;
    }
    let value = "";
    let answerId = "";
    if (role.type === "profile") value = profileValue(profile, role.key);
    else {
      const hit = f.label.trim() ? bestAnswer(f.label, bank) : null;
      value = hit?.answer.answer ?? "";
      answerId = hit?.answer.id ?? "";
    }
    if (!value) {
      plan.skipped.push({ id: f.id, reason: role.type === "profile" ? "no-profile-value" : "no-answer" });
      continue;
    }
    let option: number | undefined;
    if (CHOICE.has(f.kind)) {
      option = matchOption(value, f.options);
      if (option < 0) {
        plan.skipped.push({ id: f.id, reason: "no-option" });
        continue;
      }
      value = f.options[option];
    }
    plan.fills.push(answerId ? { id: f.id, source: "bank", value, option, answerId } : { id: f.id, source: "profile", value, option });
  }
  return plan;
}

/* ─── Saving what you typed back to the bank ─── */

export interface AnswerProposal {
  fieldId: string;
  question: string;
  answer: string;
  /** "update": a saved answer to the same question says something else, and this replaces it. */
  status: "new" | "update";
  replaces?: { id: string; answer: string };
}

/** Questions on the form you answered, that the bank doesn't have this answer for. Identity and file fields aren't offered. */
export function proposeAnswers(fields: FormField[], bank: Answer[]): AnswerProposal[] {
  const seen = new Set<string>();
  return fields.flatMap((f): AnswerProposal[] => {
    const question = f.label.trim();
    const answer = f.value.trim();
    if (!question || !answer || f.kind === "file" || classify(f).type !== "question") return [];
    // A form that repeats a question (one per education entry) offers it once.
    const key = question.toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    const hit = bestAnswer(question, bank, { includeBlank: true });
    if (!hit) return [{ fieldId: f.id, question, answer, status: "new" }];
    if (hit.answer.answer.trim() === answer) return [];
    return [{ fieldId: f.id, question, answer, status: "update", replaces: { id: hit.answer.id, answer: hit.answer.answer } }];
  });
}
