import { scoreResume } from "@/lib/scoring";
import type { JobDescription, Profile } from "@/types";

export const DEFAULT_MIN_MATCH_SCORE = 30;

export interface DigestMatch {
  job: JobDescription;
  score: number;
  reasons: string[];
}

export function scoreOpportunity({
  profile,
  job,
}: {
  profile: Profile;
  job: JobDescription;
}): DigestMatch {
  const result = scoreResume({ profile, job });
  const keywordScore = result.subScores.keywordMatch;
  const reasons = [...keywordScore.evidence, ...keywordScore.notes]
    .filter(Boolean)
    .slice(0, 3);

  return {
    job,
    score: result.overall,
    reasons,
  };
}

export function selectTopMatches(
  profile: Profile,
  jobs: JobDescription[],
  k = 5,
  minScore = DEFAULT_MIN_MATCH_SCORE,
): DigestMatch[] {
  return jobs
    .map((job) => scoreOpportunity({ profile, job }))
    .filter((match) => match.score >= minScore)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.job.createdAt !== a.job.createdAt) {
        return b.job.createdAt.localeCompare(a.job.createdAt);
      }
      return b.job.id.localeCompare(a.job.id);
    })
    .slice(0, k);
}
