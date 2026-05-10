import type { AnswerBankEntry } from "./answer-bank";

export type AnswerComponentType =
  | "repeated_question"
  | "work_authorization"
  | "logistics"
  | "compensation"
  | "links";

export const ANSWER_COMPONENT_TYPES: AnswerComponentType[] = [
  "repeated_question",
  "work_authorization",
  "logistics",
  "compensation",
  "links",
];

export const ANSWER_COMPONENT_LABELS: Record<AnswerComponentType, string> = {
  repeated_question: "Repeated Questions",
  work_authorization: "Work Auth",
  logistics: "Logistics",
  compensation: "Compensation",
  links: "Links",
};

function includesAny(value: string, words: string[]): boolean {
  return words.some((word) => value.includes(word));
}

export function classifyAnswerComponent(
  entry: Pick<AnswerBankEntry, "question" | "answer" | "sourceUrl">,
): AnswerComponentType {
  const haystack = `${entry.question} ${entry.answer} ${entry.sourceUrl ?? ""}`
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (
    includesAny(haystack, [
      "sponsor",
      "sponsorship",
      "authorized",
      "authorization",
      "work permit",
      "citizen",
      "visa",
    ])
  ) {
    return "work_authorization";
  }

  if (
    includesAny(haystack, [
      "relocat",
      "remote",
      "hybrid",
      "start date",
      "availability",
      "available",
      "timezone",
    ])
  ) {
    return "logistics";
  }

  if (
    includesAny(haystack, [
      "salary",
      "compensation",
      "pay range",
      "hourly",
      "expected pay",
      "desired pay",
    ])
  ) {
    return "compensation";
  }

  if (
    includesAny(haystack, [
      "portfolio",
      "github",
      "linkedin",
      "website",
      "repo",
      "url",
      "link",
    ])
  ) {
    return "links";
  }

  if (
    includesAny(haystack, [
      "address",
      "phone",
      "name",
      "email",
      "school",
      "university",
      "gpa",
      "graduation",
      "pronoun",
    ])
  ) {
    return "logistics";
  }

  return "repeated_question";
}
