import type { ATSIssue, KeywordAnalysis } from "@/lib/ats/analyzer";
import type { ATSScanResult } from "@/lib/ats/scoring";
import type { GapItem } from "@/lib/tailor/analyze";
import type { TailoredResume } from "@/lib/resume/generator";
import type { Profile } from "@/types";

export type ResultQualityStatus =
  | "ready_to_apply"
  | "light_tailoring"
  | "needs_evidence"
  | "not_a_fit";

export type ResultQualityReason =
  | "strong_jd_match"
  | "moderate_jd_match"
  | "low_jd_match"
  | "critical_skills_missing"
  | "solid_evidence"
  | "weak_evidence"
  | "keyword_stuffing"
  | "contact_incomplete"
  | "no_job_description";

export interface ResultQualityRubric {
  status: ResultQualityStatus;
  label: string;
  rationale: string;
  nextActions: string[];
  reasons: ResultQualityReason[];
}

export interface ResultQualityInput {
  jdMatchScore?: number;
  missingKeywords?: string[];
  gaps?: GapItem[];
  atsIssues?: ATSIssue[];
  atsAxes?: ATSScanResult["axes"];
  keywords?: KeywordAnalysis[];
  matchedEntriesCount?: number;
  profile?: Profile;
  resume?: TailoredResume;
  hasJobDescription?: boolean;
}

const READY_JD_SCORE = 75;
const LIGHT_TAILORING_JD_SCORE = 45;
const NOT_A_FIT_JD_SCORE = 30;
const SOLID_EVIDENCE_SCORE = 65;
const WEAK_EVIDENCE_SCORE = 45;
const MANY_CRITICAL_SKILLS = 6;

const SKILL_INDICATORS = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "node",
  "sql",
  "aws",
  "docker",
  "kubernetes",
  "git",
  "linux",
  "api",
  "rest",
  "graphql",
  "css",
  "html",
  "angular",
  "vue",
  "swift",
  "kotlin",
  "rust",
  "go",
  "c++",
  "c#",
  ".net",
  "ruby",
  "php",
  "terraform",
  "ci/cd",
  "figma",
  "machine learning",
  "data science",
  "analytics",
  "tableau",
  "power bi",
  "excel",
  "salesforce",
];

const STATUS_LABELS: Record<ResultQualityStatus, string> = {
  ready_to_apply: "Ready to apply",
  light_tailoring: "Needs light tailoring",
  needs_evidence: "Needs evidence",
  not_a_fit: "Not a fit",
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

export function getCriticalMissingSkills(input: ResultQualityInput): string[] {
  const gapSkills =
    input.gaps
      ?.filter((gap) => gap.category === "skill")
      .map((gap) => gap.requirement) ?? [];
  const keywordSkills =
    input.missingKeywords?.filter((keyword) => {
      const normalized = normalize(keyword);
      return SKILL_INDICATORS.some(
        (skill) => normalized.includes(skill) || skill.includes(normalized),
      );
    }) ?? [];

  return uniqueStrings([...gapSkills, ...keywordSkills]).slice(0, 12);
}

export function detectKeywordStuffing(input: ResultQualityInput): boolean {
  const hasStuffingIssue = input.atsIssues?.some((issue) => {
    const text = `${issue.title} ${issue.description}`.toLowerCase();
    return text.includes("keyword stuffing");
  });
  if (hasStuffingIssue) return true;

  return (
    input.keywords?.some(
      (keyword) => keyword.found && keyword.frequency >= 8,
    ) ?? false
  );
}

function profileEvidenceText(profile?: Profile) {
  if (!profile) return "";
  return [
    profile.summary,
    ...profile.experiences.flatMap((experience) => [
      experience.description,
      ...experience.highlights,
      ...experience.skills,
    ]),
    ...profile.projects.flatMap((project) => [
      project.description,
      ...project.highlights,
      ...project.technologies,
    ]),
    ...profile.education.flatMap((education) => education.highlights),
    profile.rawText,
  ]
    .filter(Boolean)
    .join(" ");
}

function resumeEvidenceText(resume?: TailoredResume) {
  if (!resume) return "";
  return [
    resume.summary,
    resume.skills.join(" "),
    ...resume.experiences.flatMap((experience) => experience.highlights),
  ]
    .filter(Boolean)
    .join(" ");
}

export function scoreEvidenceQuality(input: ResultQualityInput): number {
  const contentQualityScore = input.atsAxes?.contentQuality.score;
  const matchedEntryScore =
    input.matchedEntriesCount === undefined
      ? undefined
      : clampScore(Math.min(90, input.matchedEntriesCount * 18));

  let profileScore = 0;
  if (input.profile) {
    const highlightCount =
      input.profile.experiences.reduce(
        (total, experience) => total + experience.highlights.length,
        0,
      ) +
      input.profile.projects.reduce(
        (total, project) => total + project.highlights.length,
        0,
      );
    const sectionScore =
      input.profile.experiences.length * 18 +
      input.profile.projects.length * 14 +
      highlightCount * 8 +
      input.profile.skills.length * 2;
    profileScore = clampScore(sectionScore);
  }

  let resumeScore = 0;
  if (input.resume) {
    const highlightCount = input.resume.experiences.reduce(
      (total, experience) => total + experience.highlights.length,
      0,
    );
    resumeScore = clampScore(
      input.resume.experiences.length * 24 +
        highlightCount * 12 +
        input.resume.skills.length * 3 +
        (input.resume.summary.length > 50 ? 10 : 0),
    );
  }

  const evidenceText = `${profileEvidenceText(input.profile)} ${resumeEvidenceText(input.resume)}`;
  const quantifiedBonus =
    /\b\d+[%x]?\b|\$|revenue|users|customers|latency|conversion|reduced|increased|improved/i.test(
      evidenceText,
    )
      ? 12
      : 0;
  const actionVerbBonus =
    /\b(built|created|delivered|designed|developed|improved|launched|led|optimized|reduced|shipped)\b/i.test(
      evidenceText,
    )
      ? 8
      : 0;

  const bestBase = Math.max(
    contentQualityScore ?? 0,
    matchedEntryScore ?? 0,
    profileScore,
    resumeScore,
  );

  return clampScore(bestBase + quantifiedBonus + actionVerbBonus);
}

function hasCompleteContact(input: ResultQualityInput) {
  const contact = input.profile?.contact ?? input.resume?.contact;
  return Boolean(contact?.email && contact?.phone);
}

function addAction(actions: string[], action: string) {
  if (!actions.includes(action) && actions.length < 3) {
    actions.push(action);
  }
}

function buildActions({
  status,
  input,
  criticalMissingSkills,
  evidenceScore,
  hasStuffing,
  contactComplete,
  hasJobDescription,
}: {
  status: ResultQualityStatus;
  input: ResultQualityInput;
  criticalMissingSkills: string[];
  evidenceScore: number;
  hasStuffing: boolean;
  contactComplete: boolean;
  hasJobDescription: boolean;
}) {
  const actions: string[] = [];

  if (!hasJobDescription) {
    addAction(actions, "Paste the target job description to judge role fit.");
  }
  if (!contactComplete) {
    addAction(actions, "Add a reachable email and phone number near the top.");
  }
  if (hasStuffing) {
    addAction(
      actions,
      "Replace repeated keywords with accomplishments that prove those skills.",
    );
  }
  if (criticalMissingSkills.length > 0) {
    addAction(
      actions,
      `Address the top missing skill${criticalMissingSkills.length === 1 ? "" : "s"}: ${criticalMissingSkills.slice(0, 3).join(", ")}.`,
    );
  }
  if (evidenceScore < SOLID_EVIDENCE_SCORE) {
    addAction(
      actions,
      "Add 2-3 bullets with projects, outcomes, metrics, or shipped work.",
    );
  }

  if (status === "ready_to_apply") {
    addAction(
      actions,
      "Apply with this version and keep the job description handy.",
    );
    addAction(actions, "Mirror one or two exact role phrases in your summary.");
  } else if (status === "not_a_fit") {
    addAction(
      actions,
      "Target a closer role or rebuild the resume around transferable evidence.",
    );
    addAction(
      actions,
      "Only add missing skills you can honestly support with examples.",
    );
  } else if (status === "light_tailoring") {
    addAction(actions, "Tune the summary and first two bullets to the role.");
  }

  addAction(
    actions,
    input.jdMatchScore !== undefined
      ? "Re-scan after edits and check that the guidance changes, not just the score."
      : "Re-scan after adding the job description and evidence.",
  );

  return actions.slice(0, 3);
}

export function evaluateResultQuality(
  input: ResultQualityInput,
): ResultQualityRubric {
  const hasJobDescription =
    input.hasJobDescription ?? input.jdMatchScore !== undefined;
  const jdMatchScore = input.jdMatchScore;
  const criticalMissingSkills = getCriticalMissingSkills(input);
  const criticalMissingCount = criticalMissingSkills.length;
  const evidenceScore = scoreEvidenceQuality(input);
  const hasStuffing = detectKeywordStuffing(input);
  const contactComplete = hasCompleteContact(input);
  const reasons: ResultQualityReason[] = [];

  if (!hasJobDescription) reasons.push("no_job_description");
  if (jdMatchScore !== undefined && jdMatchScore >= READY_JD_SCORE) {
    reasons.push("strong_jd_match");
  } else if (
    jdMatchScore !== undefined &&
    jdMatchScore >= LIGHT_TAILORING_JD_SCORE
  ) {
    reasons.push("moderate_jd_match");
  } else if (jdMatchScore !== undefined) {
    reasons.push("low_jd_match");
  }
  if (criticalMissingCount > 0) reasons.push("critical_skills_missing");
  if (evidenceScore >= SOLID_EVIDENCE_SCORE) {
    reasons.push("solid_evidence");
  } else if (evidenceScore < WEAK_EVIDENCE_SCORE) {
    reasons.push("weak_evidence");
  }
  if (hasStuffing) reasons.push("keyword_stuffing");
  if (!contactComplete) reasons.push("contact_incomplete");

  let status: ResultQualityStatus;
  if (
    hasJobDescription &&
    jdMatchScore !== undefined &&
    evidenceScore > 0 &&
    ((jdMatchScore < NOT_A_FIT_JD_SCORE && criticalMissingCount >= 3) ||
      criticalMissingCount >= MANY_CRITICAL_SKILLS ||
      (jdMatchScore < 20 &&
        evidenceScore < WEAK_EVIDENCE_SCORE &&
        criticalMissingCount >= 2))
  ) {
    status = "not_a_fit";
  } else if (hasStuffing || evidenceScore < WEAK_EVIDENCE_SCORE) {
    status = "needs_evidence";
  } else if (
    hasJobDescription &&
    jdMatchScore !== undefined &&
    jdMatchScore >= READY_JD_SCORE &&
    criticalMissingCount === 0 &&
    contactComplete &&
    evidenceScore >= SOLID_EVIDENCE_SCORE
  ) {
    status = "ready_to_apply";
  } else {
    status = "light_tailoring";
  }

  const rationaleByStatus: Record<ResultQualityStatus, string> = {
    ready_to_apply:
      "The resume has strong role alignment, complete contact details, and enough evidence to support the match.",
    light_tailoring: hasJobDescription
      ? "The resume is close, but a few missing skills or weaker signals should be tuned before applying."
      : "The resume has useful evidence, but a job description is needed before judging role fit.",
    needs_evidence: hasStuffing
      ? "Keywords are present, but the resume needs stronger proof through projects, outcomes, or quantified bullets."
      : "The match is not backed by enough concrete experience, project, or accomplishment evidence yet.",
    not_a_fit:
      "The job description and resume are far apart, with too many critical gaps for light tailoring.",
  };

  return {
    status,
    label: STATUS_LABELS[status],
    rationale: rationaleByStatus[status],
    nextActions: buildActions({
      status,
      input,
      criticalMissingSkills,
      evidenceScore,
      hasStuffing,
      contactComplete,
      hasJobDescription,
    }),
    reasons,
  };
}
