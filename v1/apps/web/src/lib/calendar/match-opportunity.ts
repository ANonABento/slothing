import type { Opportunity } from "@/types";
import {
  clampConfidence,
  formatEvidenceSnippet,
  REVIEW_CONFIDENCE_THRESHOLD,
} from "@/lib/status-automation/confidence";

export interface CalendarEventAttendee {
  email?: string;
  displayName?: string;
}

export interface CalendarInterviewEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  attendees?: CalendarEventAttendee[];
}

export interface OpportunityCalendarMatch {
  opportunity: Opportunity;
  score: number;
  confidence: number;
  evidence: string[];
  reason: string;
}

const INTERVIEW_KEYWORDS = [
  "interview",
  "onsite",
  "on site",
  "on-site",
  "phone screen",
  "screening",
  "technical",
  "recruiter",
  "hiring manager",
  "panel",
  "final round",
];

const COMPANY_SUFFIXES = new Set([
  "inc",
  "incorporated",
  "llc",
  "ltd",
  "limited",
  "corp",
  "corporation",
  "co",
  "company",
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function companyTokens(company: string): string[] {
  return normalizeText(company)
    .split(" ")
    .filter((part) => part.length > 1 && !COMPANY_SUFFIXES.has(part));
}

function textIncludesPhrase(text: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase);
  if (!normalizedPhrase) return false;
  return ` ${text} `.includes(` ${normalizedPhrase} `);
}

export function hasInterviewIntent(event: CalendarInterviewEvent): boolean {
  const haystack = normalizeText(
    [event.title, event.description, event.location].filter(Boolean).join(" "),
  );

  return INTERVIEW_KEYWORDS.some((keyword) =>
    textIncludesPhrase(haystack, keyword),
  );
}

function scoreOpportunity(
  event: CalendarInterviewEvent,
  opportunity: Opportunity,
): OpportunityCalendarMatch | null {
  const title = normalizeText(event.title);
  const body = normalizeText(
    [event.description, event.location].filter(Boolean).join(" "),
  );
  const attendees = event.attendees ?? [];
  const attendeeDisplayText = normalizeText(
    attendees
      .map((attendee) => attendee.displayName)
      .filter(Boolean)
      .join(" "),
  );
  const company = normalizeText(opportunity.company);
  const tokens = companyTokens(opportunity.company);

  let score = 0;
  const reasons: string[] = [];
  const evidence: string[] = [];

  if (company && textIncludesPhrase(title, company)) {
    score += 100;
    reasons.push("company in title");
    evidence.push(event.title);
  }
  if (company && textIncludesPhrase(body, company)) {
    score += 45;
    reasons.push("company in details");
    evidence.push(
      [event.description, event.location].filter(Boolean).join(" "),
    );
  }
  if (company && textIncludesPhrase(attendeeDisplayText, company)) {
    score += 30;
    reasons.push("company in attendee");
    evidence.push(attendees.map((attendee) => attendee.displayName).join(" "));
  }

  for (const token of tokens) {
    if (textIncludesPhrase(title, token)) score += 20;
    if (textIncludesPhrase(body, token)) score += 10;
    if (textIncludesPhrase(attendeeDisplayText, token)) score += 12;
  }

  const domainEvidence = attendees.some((attendee) => {
    const domain = attendee.email?.split("@")[1]?.split(".")[0];
    return domain ? tokens.includes(normalizeText(domain)) : false;
  });
  if (domainEvidence) {
    score += 70;
    reasons.push("company in attendee domain");
    evidence.push(
      attendees
        .map((attendee) => attendee.email)
        .filter(Boolean)
        .join(" "),
    );
  }

  if (score <= 0) return null;
  const confidence = clampConfidence(score / 120);
  if (confidence < REVIEW_CONFIDENCE_THRESHOLD) return null;

  return {
    opportunity,
    score,
    confidence,
    evidence: evidence
      .filter(Boolean)
      .slice(0, 2)
      .map((value) => formatEvidenceSnippet(value)),
    reason: reasons[0] ?? "company token match",
  };
}

export function matchOpportunityForCalendarEvent(
  event: CalendarInterviewEvent,
  opportunities: Opportunity[],
): OpportunityCalendarMatch | null {
  if (!hasInterviewIntent(event)) return null;

  const matches = opportunities
    .map((opportunity) => scoreOpportunity(event, opportunity))
    .filter((match): match is OpportunityCalendarMatch => match !== null)
    .sort((a, b) => b.score - a.score);

  return matches[0] ?? null;
}

export const __test = {
  normalizeText,
  companyTokens,
  INTERVIEW_KEYWORDS,
};
