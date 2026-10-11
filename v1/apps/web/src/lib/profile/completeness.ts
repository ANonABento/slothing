import type { Experience, Profile } from "@/types";

export type ProfileCompletenessGapId =
  | "contact-info"
  | "summary"
  | "experience-bullets"
  | "quantified-bullets"
  | "education"
  | "skills"
  | "career-depth"
  | "achievements"
  | "social-url";

export type ProfileCompletenessFocusTab =
  | "overview"
  | "preferences"
  | "privacy";

export interface ProfileCompletenessGap {
  id: ProfileCompletenessGapId;
  label: string;
  labelKey?: string;
  labelValues?: Record<string, string | number>;
  points: number;
  priority: number;
  focus: {
    tab: ProfileCompletenessFocusTab;
    fieldId?: string;
    sectionId?: string;
  };
}

export interface ProfileCompletenessResult {
  score: number;
  gaps: ProfileCompletenessGap[];
}

const QUANTIFIED_REGEX =
  /\d+%|\$[\d,]+(?:\.\d+)?[kKmMbB]?|\b\d+x\b|\bteam of \d+\b|\b\d+\s+(users|customers|clients|projects|people|engineers|reports|hours|members|countries|languages|states|cities|stores|partners|deals|leads)\b/gi;

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function countHighlights(experience: Experience): number {
  return experience.highlights.filter(hasText).length;
}

function getBestExperience(profile: Profile | null): Experience | undefined {
  return [...(profile?.experiences ?? [])].sort(
    (a, b) => countHighlights(b) - countHighlights(a),
  )[0];
}

function hasQuantifiedSignal(value: string): boolean {
  QUANTIFIED_REGEX.lastIndex = 0;
  return QUANTIFIED_REGEX.test(value);
}

function countQuantifiedBullets(profile: Profile | null): number {
  return (profile?.experiences ?? []).reduce(
    (count, experience) =>
      count +
      experience.highlights.filter((highlight) =>
        hasQuantifiedSignal(highlight),
      ).length,
    0,
  );
}

function makeGap(
  gap: Omit<ProfileCompletenessGap, "priority">,
  priority: number,
): ProfileCompletenessGap {
  return { ...gap, priority };
}

export function scoreProfile(
  profile: Profile | null,
): ProfileCompletenessResult {
  let score = 0;
  const gaps: ProfileCompletenessGap[] = [];
  let priority = 0;

  const contact = profile?.contact;
  const hasContactInfo = Boolean(
    hasText(contact?.name) &&
    hasText(contact?.email) &&
    hasText(contact?.headline),
  );
  if (hasContactInfo) {
    score += 10;
  } else {
    const fieldId = !hasText(contact?.name)
      ? "name"
      : !hasText(contact?.email)
        ? "email"
        : "headline";
    gaps.push(
      makeGap(
        {
          id: "contact-info",
          label: "Add your name, email, and headline",
          points: 10,
          focus: { tab: "overview", fieldId, sectionId: "identity" },
        },
        priority++,
      ),
    );
  }

  if (hasText(profile?.summary)) {
    score += 10;
  } else {
    gaps.push(
      makeGap(
        {
          id: "summary",
          label: "Add a professional summary",
          points: 10,
          focus: {
            tab: "overview",
            fieldId: "summaryText",
            sectionId: "summary",
          },
        },
        priority++,
      ),
    );
  }

  const bestExperience = getBestExperience(profile);
  const hasThreeBulletExperience = Boolean(
    bestExperience && countHighlights(bestExperience) >= 3,
  );
  if (hasThreeBulletExperience) {
    score += 20;
  } else {
    const experienceLabel = bestExperience?.company
      ? `Add ${Math.max(1, 3 - countHighlights(bestExperience))} more bullet${3 - countHighlights(bestExperience) === 1 ? "" : "s"} to your ${bestExperience.company} role`
      : "Add one experience with at least 3 bullets";
    const missing = bestExperience
      ? Math.max(1, 3 - countHighlights(bestExperience))
      : 3;
    gaps.push(
      makeGap(
        {
          id: "experience-bullets",
          label: experienceLabel,
          labelKey: bestExperience?.company
            ? "experience-bullets.role"
            : "experience-bullets.empty",
          labelValues: bestExperience?.company
            ? { missing, company: bestExperience.company }
            : { missing },
          points: 20,
          focus: { tab: "overview", sectionId: "experience" },
        },
        priority++,
      ),
    );
  }

  const quantifiedBullets = countQuantifiedBullets(profile);
  if (quantifiedBullets >= 2) {
    score += 10;
  } else {
    const missing = 2 - quantifiedBullets;
    const experienceName = bestExperience?.company
      ? ` to your ${bestExperience.company} role`
      : "";
    gaps.push(
      makeGap(
        {
          id: "quantified-bullets",
          label: `Add ${missing} quantified bullet${missing === 1 ? "" : "s"}${experienceName}`,
          labelKey: bestExperience?.company
            ? "quantified-bullets.role"
            : "quantified-bullets.empty",
          labelValues: bestExperience?.company
            ? { missing, company: bestExperience.company }
            : { missing },
          points: 10,
          focus: { tab: "overview", sectionId: "experience" },
        },
        priority++,
      ),
    );
  }

  if ((profile?.education.length ?? 0) > 0) {
    score += 10;
  } else {
    gaps.push(
      makeGap(
        {
          id: "education",
          label: "Add your education",
          points: 10,
          focus: { tab: "overview", sectionId: "education" },
        },
        priority++,
      ),
    );
  }

  const skillCount =
    profile?.skills.filter((skill) => hasText(skill.name)).length ?? 0;
  if (skillCount >= 5) {
    score += 10;
  } else {
    gaps.push(
      makeGap(
        {
          id: "skills",
          label: `Add ${5 - skillCount} more skill${5 - skillCount === 1 ? "" : "s"}`,
          labelValues: { missing: 5 - skillCount },
          points: 10,
          focus: { tab: "overview", sectionId: "skills" },
        },
        priority++,
      ),
    );
  }

  if (
    (profile?.projects.length ?? 0) > 0 ||
    (profile?.experiences.length ?? 0) >= 2
  ) {
    score += 10;
  } else {
    gaps.push(
      makeGap(
        {
          id: "career-depth",
          label: "Add a project or another experience",
          points: 10,
          focus: { tab: "overview", sectionId: "projects" },
        },
        priority++,
      ),
    );
  }

  if ((profile?.certifications.length ?? 0) > 0) {
    score += 10;
  } else {
    gaps.push(
      makeGap(
        {
          id: "achievements",
          label: "Add an achievement, award, or certification",
          points: 10,
          focus: { tab: "overview", sectionId: "achievements" },
        },
        priority++,
      ),
    );
  }

  if (hasText(contact?.linkedin) || hasText(contact?.github)) {
    score += 10;
  } else {
    gaps.push(
      makeGap(
        {
          id: "social-url",
          label: "Add a LinkedIn or GitHub URL",
          points: 10,
          focus: { tab: "overview", fieldId: "linkedin", sectionId: "contact" },
        },
        priority++,
      ),
    );
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    gaps,
  };
}

export function getCrossedCompletenessThresholds(
  previousScore: number,
  nextScore: number,
): number[] {
  if (nextScore <= previousScore) return [];
  return [50, 75, 90, 100].filter(
    (threshold) => previousScore < threshold && nextScore >= threshold,
  );
}
