import type { Opportunity } from "@/types";

export interface OpportunityCompanyMatch<
  T extends Pick<Opportunity, "company">,
> {
  opportunity: T;
  score: number;
  reason: "exact" | "contains" | "tokens";
}

const LEGAL_SUFFIXES = new Set([
  "inc",
  "incorporated",
  "llc",
  "ltd",
  "limited",
  "corp",
  "corporation",
  "company",
  "co",
  "plc",
]);

const SENDER_NOISE = new Set([
  "jobs",
  "careers",
  "talent",
  "recruiting",
  "recruiter",
  "notifications",
  "no",
  "reply",
  "noreply",
]);

export function normalizeCompanyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token && !LEGAL_SUFFIXES.has(token))
    .join(" ")
    .trim();
}

function senderDomainCandidates(from?: string): string[] {
  const email = from?.match(/@([a-z0-9.-]+)/i)?.[1];
  if (!email) return [];
  const domainParts = email
    .split(".")
    .filter(
      (part) => part && !["com", "org", "net", "io", "co"].includes(part),
    );
  return domainParts.filter((part) => !SENDER_NOISE.has(part));
}

function tokens(value: string): Set<string> {
  return new Set(normalizeCompanyName(value).split(/\s+/).filter(Boolean));
}

export function companySimilarity(candidate: string, company: string): number {
  const normalizedCandidate = normalizeCompanyName(candidate);
  const normalizedCompany = normalizeCompanyName(company);

  if (!normalizedCandidate || !normalizedCompany) return 0;
  if (normalizedCandidate === normalizedCompany) return 1;

  if (
    normalizedCandidate.includes(normalizedCompany) ||
    normalizedCompany.includes(normalizedCandidate)
  ) {
    return 0.88;
  }

  const candidateTokens = tokens(normalizedCandidate);
  const companyTokens = tokens(normalizedCompany);
  if (candidateTokens.size === 0 || companyTokens.size === 0) return 0;

  let overlap = 0;
  for (const token of candidateTokens) {
    if (companyTokens.has(token)) overlap += 1;
  }

  return (2 * overlap) / (candidateTokens.size + companyTokens.size);
}

export function matchOpportunityByCompany<
  T extends Pick<Opportunity, "company">,
>(
  opportunities: T[],
  input: {
    company?: string;
    subject?: string;
    body?: string;
    snippet?: string;
    from?: string;
  },
): OpportunityCompanyMatch<T> | null {
  const candidates = [
    input.company,
    input.subject,
    input.snippet,
    input.body,
    ...senderDomainCandidates(input.from),
  ].filter((value): value is string => Boolean(value?.trim()));

  const scored = opportunities
    .map((opportunity) => {
      const bestScore = Math.max(
        ...candidates.map((candidate) =>
          companySimilarity(candidate, opportunity.company),
        ),
        0,
      );
      const reason: OpportunityCompanyMatch<T>["reason"] =
        bestScore === 1 ? "exact" : bestScore >= 0.88 ? "contains" : "tokens";
      return { opportunity, score: bestScore, reason };
    })
    .filter((match) => match.score >= 0.72)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;
  if (scored[1] && scored[0].score - scored[1].score < 0.12) return null;

  return scored[0];
}
