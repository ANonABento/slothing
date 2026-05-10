import type { Opportunity } from "@/types";
import {
  clampConfidence,
  formatEvidenceSnippet,
} from "@/lib/status-automation/confidence";

export interface OpportunityCompanyMatch<
  T extends Pick<Opportunity, "company">,
> {
  opportunity: T;
  score: number;
  confidence: number;
  reason:
    | "company_exact"
    | "company_in_subject"
    | "company_in_snippet"
    | "company_in_body"
    | "sender_domain"
    | "token_overlap";
  evidence: string[];
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

type CandidateSource = "company" | "subject" | "snippet" | "body" | "domain";

interface CompanyCandidate {
  value: string;
  source: CandidateSource;
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
  const candidates: CompanyCandidate[] = [
    { value: input.company ?? "", source: "company" as const },
    { value: input.subject ?? "", source: "subject" as const },
    { value: input.snippet ?? "", source: "snippet" as const },
    { value: input.body ?? "", source: "body" as const },
    ...senderDomainCandidates(input.from).map((value) => ({
      value,
      source: "domain" as const,
    })),
  ].filter((candidate) => Boolean(candidate.value.trim()));

  const scored = opportunities
    .map((opportunity) => {
      const best = candidates.reduce<{
        rawScore: number;
        weightedScore: number;
        candidate?: CompanyCandidate;
      }>(
        (current, candidate) => {
          const rawScore = companySimilarity(
            candidate.value,
            opportunity.company,
          );
          const sourceWeight =
            candidate.source === "domain"
              ? 0.68
              : candidate.source === "body"
                ? 0.9
                : 1;
          const weightedScore = rawScore * sourceWeight;
          return weightedScore > current.weightedScore
            ? { rawScore, weightedScore, candidate }
            : current;
        },
        { rawScore: 0, weightedScore: 0 },
      );
      const reason: OpportunityCompanyMatch<T>["reason"] =
        best.candidate?.source === "domain"
          ? "sender_domain"
          : best.candidate?.source === "subject"
            ? best.rawScore >= 0.88
              ? "company_in_subject"
              : "token_overlap"
            : best.candidate?.source === "snippet"
              ? "company_in_snippet"
              : best.candidate?.source === "body"
                ? "company_in_body"
                : best.rawScore === 1
                  ? "company_exact"
                  : "token_overlap";
      return {
        opportunity,
        score: best.weightedScore,
        confidence: clampConfidence(best.weightedScore),
        reason,
        evidence: best.candidate
          ? [formatEvidenceSnippet(best.candidate.value)]
          : [],
      };
    })
    .filter((match) => match.score >= 0.55)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;
  if (scored[1] && scored[0].score - scored[1].score < 0.12) return null;

  return scored[0];
}
