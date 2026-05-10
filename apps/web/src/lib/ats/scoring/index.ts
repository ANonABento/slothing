import type { JobDescription, Profile } from "@/types";
import { scoreToLetterGrade } from "@/lib/ats/analyzer";
import type {
  ATSAnalysisResult,
  ATSIssue,
  KeywordAnalysis,
} from "@/lib/ats/analyzer";
import { nowDate, nowIso, parseToDate } from "@/lib/format/time";
import { extractJdKeywords } from "@/lib/ats/jd-keywords";
import {
  analyzeKeywordEvidence,
  type KeywordEvidenceSegment,
} from "@/lib/ats/keyword-evidence";
import type { ATSScanResult, AxisKey, AxisScore, FileMeta } from "./types";

export type { ATSScanResult, AxisKey, AxisScore, FileMeta } from "./types";

const AXIS_WEIGHTS: Record<AxisKey, number> = {
  parseability: 0.2,
  sectionCompleteness: 0.2,
  keywordMatch: 0.3,
  datesAndTenure: 0.1,
  contentQuality: 0.2,
};

const PROBLEMATIC_CHARACTERS = [
  { char: "\u2022", name: "bullet point" },
  { char: "\u2013", name: "en dash" },
  { char: "\u2014", name: "em dash" },
  { char: "\u201c", name: "curly quote" },
  { char: "\u201d", name: "curly quote" },
  { char: "\u2018", name: "curly apostrophe" },
  { char: "\u2019", name: "curly apostrophe" },
  { char: "\u2026", name: "ellipsis" },
];

const ACTION_VERBS = [
  "achieved",
  "analyzed",
  "architected",
  "built",
  "collaborated",
  "created",
  "delivered",
  "designed",
  "developed",
  "drove",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "optimized",
  "reduced",
  "resolved",
  "shipped",
  "streamlined",
  "supported",
  "transformed",
];

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordBoundaryRegex(term: string, flags = "") {
  return new RegExp(`\\b${escapeRegExp(term)}\\b`, flags);
}

function containsWord(text: string, term: string) {
  return wordBoundaryRegex(term).test(text);
}

function profileText(profile: Profile) {
  const parts = [
    profile.contact?.name,
    profile.contact?.email,
    profile.contact?.phone,
    profile.summary,
    ...profile.experiences.flatMap((exp) => [
      exp.title,
      exp.company,
      exp.description,
      ...exp.highlights,
      ...exp.skills,
      exp.startDate,
      exp.endDate,
    ]),
    ...profile.education.flatMap((edu) => [
      edu.institution,
      edu.degree,
      edu.field,
      ...edu.highlights,
    ]),
    ...profile.skills.map((skill) => skill.name),
    ...profile.projects.flatMap((project) => [
      project.name,
      project.description,
      ...project.highlights,
      ...project.technologies,
    ]),
    ...profile.certifications.map((cert) => cert.name),
  ];
  return parts.filter(Boolean).join("\n");
}

function axis(
  key: AxisKey,
  label: string,
  score: number,
  notes: string[],
  evidence: string[],
): AxisScore {
  return {
    key,
    label,
    score: clampScore(score),
    weight: AXIS_WEIGHTS[key],
    notes,
    evidence,
  };
}

function issue(
  type: ATSIssue["type"],
  category: ATSIssue["category"],
  title: string,
  description: string,
  suggestion: string,
): ATSIssue {
  return { type, category, title, description, suggestion };
}

function scoreParseability(text: string, fileMeta?: FileMeta) {
  const notes: string[] = [];
  const evidence: string[] = [];
  const issues: ATSIssue[] = [];
  let score = 100;

  const foundProblematic = PROBLEMATIC_CHARACTERS.filter(({ char }) =>
    text.includes(char),
  );
  if (foundProblematic.length > 0) {
    score -= Math.min(20, foundProblematic.length * 4);
    notes.push("Special characters can be misread by older parsers.");
    evidence.push(
      `Found ${foundProblematic.length} non-ASCII formatting character(s).`,
    );
    issues.push(
      issue(
        "warning",
        "formatting",
        "Special characters detected",
        "Some ATS parsers may misread decorative punctuation or bullets.",
        "Replace decorative bullets, dashes, and quotes with plain text equivalents.",
      ),
    );
  }

  const badChars = (
    text.match(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []
  ).length;
  if (badChars > 0) {
    score -= Math.min(25, badChars * 3);
    notes.push("Encoding artifacts were detected.");
    evidence.push(`${badChars} control or replacement character(s).`);
  }

  const veryLongLines = text
    .split(/\n|[.]/)
    .filter((line) => line.length > 200).length;
  if (veryLongLines > 3) {
    score -= 12;
    notes.push("Very long lines may indicate table-style formatting.");
    evidence.push(`${veryLongLines} unusually long text runs.`);
    issues.push(
      issue(
        "warning",
        "formatting",
        "Potential table formatting",
        "Long text runs can come from tables or multi-column layouts that ATS parsers flatten poorly.",
        "Use simple section headings and short bullet points.",
      ),
    );
  }

  if (!profileHasEmailLikeText(text)) {
    score -= 15;
    notes.push("No email address was detected in parseable text.");
    issues.push(
      issue(
        "error",
        "formatting",
        "Missing email address",
        "No email address found in contact information.",
        "Add a professional email address near the top of the resume.",
      ),
    );
  }

  if (fileMeta) {
    if (fileMeta.parseConfidence < 0.5) {
      score -= 20;
      notes.push("The deterministic parser returned low confidence.");
      evidence.push(
        `Parser confidence ${Math.round(fileMeta.parseConfidence * 100)}%.`,
      );
    }
    if (
      fileMeta.mimeType === "application/pdf" &&
      fileMeta.sizeBytes > 250_000 &&
      text.trim().length < 500
    ) {
      score -= 25;
      notes.push("This may be an image-only PDF.");
      issues.push(
        issue(
          "error",
          "formatting",
          "Low extracted text",
          "The uploaded PDF yielded very little parseable text.",
          "Upload a text-based PDF or paste the resume text manually.",
        ),
      );
    }
    evidence.push(`${fileMeta.sectionsDetected.length} section(s) detected.`);
  }

  return {
    axis: axis("parseability", "Parseability", score, notes, evidence),
    issues,
  };
}

function profileHasEmailLikeText(text: string) {
  return /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
}

function scoreSections(profile: Profile) {
  const notes: string[] = [];
  const evidence: string[] = [];
  const issues: ATSIssue[] = [];
  let score = 100;

  if (!profile.contact?.name || !profile.contact?.email) {
    score -= 20;
    notes.push("Contact block is incomplete.");
    issues.push(
      issue(
        "error",
        "structure",
        "Incomplete contact section",
        "ATS workflows rely on structured contact fields.",
        "Include your name and email in a simple header.",
      ),
    );
  }
  if (profile.experiences.length === 0) {
    score -= 25;
    notes.push("No work experience section was parsed.");
    issues.push(
      issue(
        "error",
        "structure",
        "Missing work experience",
        "No work experience entries found.",
        "Add experience with job titles, employers, dates, and bullets.",
      ),
    );
  }
  if (profile.education.length === 0) {
    score -= 15;
    notes.push("No education section was parsed.");
    issues.push(
      issue(
        "warning",
        "structure",
        "Missing education",
        "No education entries found.",
        "Add your educational background where relevant.",
      ),
    );
  }
  if (profile.skills.length < 3) {
    score -= 20;
    notes.push("Skills section has fewer than three detected skills.");
    issues.push(
      issue(
        "error",
        "structure",
        "Thin skills section",
        "ATS keyword filters often use structured skills.",
        "Add a concise skills section with relevant tools and competencies.",
      ),
    );
  }
  if (
    !profile.summary ||
    profile.summary.length < 50 ||
    profile.summary.length > 500
  ) {
    score -= 8;
    notes.push("Professional summary is missing, too short, or too long.");
  }

  const thinEntries = profile.experiences.filter(
    (exp) => exp.highlights.length === 0 && exp.description.length < 80,
  ).length;
  if (thinEntries > 0) {
    score -= Math.min(15, thinEntries * 5);
    notes.push("Some experience entries lack achievement detail.");
  }

  evidence.push(
    `${profile.experiences.length} experience, ${profile.education.length} education, ${profile.skills.length} skill entries.`,
  );
  return {
    axis: axis(
      "sectionCompleteness",
      "Section completeness",
      score,
      notes,
      evidence,
    ),
    issues,
  };
}

function extractKeywords(text: string) {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "your",
    "you",
    "our",
    "are",
    "will",
    "have",
    "has",
    "was",
    "were",
    "job",
    "role",
    "team",
    "work",
    "working",
    "experience",
    "years",
    "candidate",
    "company",
  ]);
  const freq: Record<string, number> = {};
  for (const word of normalizeText(text).split(" ")) {
    const clean = word.replace(/^[^a-z0-9+#.]+|[^a-z0-9+#.]+$/g, "");
    if (clean.length > 2 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

function rawTextSegments(text: string): KeywordEvidenceSegment[] {
  return text
    .split(/\n|(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 120)
    .map((line) => ({
      text: line,
      location: "raw text",
      kind: "raw" as const,
      evidencePreferred: /^[-*•]\s+/.test(line),
    }));
}

function isEvidenceLikeExperienceText(text: string) {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  const hasAction = ACTION_VERBS.some((verb) => containsWord(normalized, verb));
  const hasResult =
    /\b(\d+%|\$\d+|\b\d+x\b|\b\d+\s+(users|customers|clients|projects|people|engineers|reports|hours|minutes|dashboards|tests)\b|latency|revenue|coverage|conversion|retention|performance|production|impact|saved|faster|slower)\b/i.test(
      text,
    );
  const enoughContext = text.trim().split(/\s+/).length >= 8;

  return (hasAction && enoughContext) || hasResult;
}

function profileSegments(
  profile: Profile,
  rawText: string,
): KeywordEvidenceSegment[] {
  const segments: KeywordEvidenceSegment[] = [];

  if (profile.summary) {
    segments.push({
      text: profile.summary,
      location: "summary",
      kind: "summary",
    });
  }

  if (profile.skills.length > 0) {
    segments.push({
      text: profile.skills.map((skillItem) => skillItem.name).join(", "),
      location: "skills",
      kind: "skills",
    });
  }

  for (const experience of profile.experiences) {
    const location = `experience: ${experience.title || experience.company || "role"}`;
    const hasRoleEvidence = [
      experience.description,
      ...experience.highlights,
    ].some((textValue) =>
      isEvidenceLikeExperienceText(String(textValue || "")),
    );

    for (const textValue of [
      experience.title,
      experience.company,
      experience.description,
      ...experience.highlights,
    ].filter(Boolean)) {
      segments.push({
        text: textValue,
        location,
        kind: "experience",
        evidencePreferred: experience.highlights.includes(textValue),
      });
    }
    if (experience.skills.length > 0) {
      segments.push({
        text: experience.skills.join(", "),
        location: `${location} skills`,
        kind: "skills",
        evidencePreferred: hasRoleEvidence,
      });
    }
  }

  for (const project of profile.projects) {
    const location = `project: ${project.name || "project"}`;
    const hasProjectEvidence = [
      project.description,
      ...project.highlights,
    ].some((textValue) =>
      isEvidenceLikeExperienceText(String(textValue || "")),
    );

    for (const textValue of [
      project.name,
      project.description,
      ...project.highlights,
    ].filter(Boolean)) {
      segments.push({
        text: textValue,
        location,
        kind: "project",
        evidencePreferred: project.highlights.includes(textValue),
      });
    }
    if (project.technologies.length > 0) {
      segments.push({
        text: project.technologies.join(", "),
        location: `${location} technologies`,
        kind: "skills",
        evidencePreferred: hasProjectEvidence,
      });
    }
  }

  for (const education of profile.education) {
    segments.push({
      text: [
        education.institution,
        education.degree,
        education.field,
        ...education.highlights,
      ]
        .filter(Boolean)
        .join(" "),
      location: "education",
      kind: "education",
    });
  }

  for (const certification of profile.certifications) {
    segments.push({
      text: [certification.name, certification.issuer]
        .filter(Boolean)
        .join(" "),
      location: "certification",
      kind: "certification",
    });
  }

  const raw = rawText.trim() || profile.rawText || "";
  if (raw) segments.push(...rawTextSegments(raw));

  return segments.filter((segment) => segment.text.trim().length > 0);
}

function uniqueNormalizedKeywords(keywords: string[]) {
  return Array.from(new Set(keywords.map(normalizeText).filter(Boolean)));
}

function buildJobKeywords(job: JobDescription) {
  const explicit = uniqueNormalizedKeywords([
    ...job.keywords,
    ...job.requirements.flatMap((requirement) =>
      extractJdKeywords(requirement, { limit: 8 }).map(
        (keyword) => keyword.term,
      ),
    ),
  ]);

  if (explicit.length >= 4) return explicit.slice(0, 24);

  return uniqueNormalizedKeywords([
    ...explicit,
    ...extractJdKeywords(
      [job.title, job.description, ...job.requirements, ...job.responsibilities]
        .filter(Boolean)
        .join("\n"),
      { limit: 24 },
    ).map((keyword) => keyword.term),
  ]).slice(0, 24);
}

function scoreKeywords(profile: Profile, text: string, job?: JobDescription) {
  const keywords: KeywordAnalysis[] = [];
  const issues: ATSIssue[] = [];
  const notes: string[] = [];
  const evidence: string[] = [];
  const normalizedResume = normalizeText(text || profileText(profile));
  const importantKeywords = job
    ? buildJobKeywords(job)
    : extractKeywords(normalizedResume).slice(0, 10);

  if (importantKeywords.length === 0) {
    return {
      axis: axis(
        "keywordMatch",
        "Keyword match",
        80,
        ["No job description supplied; using neutral keyword baseline."],
        [],
      ),
      keywords,
      issues,
      keywordEvidence: undefined,
    };
  }

  const keywordEvidence = analyzeKeywordEvidence(
    importantKeywords,
    profileSegments(profile, text),
  );
  const weightedMatches = keywordEvidence.matches.reduce(
    (sum, match) => sum + match.scoreWeight,
    0,
  );

  for (const match of keywordEvidence.matches) {
    keywords.push({
      keyword: match.keyword,
      found: match.status !== "missing",
      frequency: match.frequency,
      locations: match.locations,
      matchType: match.matchType,
      matchedTerm: match.matchedTerm,
      status: match.status,
      evidenceSnippets: match.evidenceSnippets,
    });
  }

  let score = job ? (weightedMatches / importantKeywords.length) * 100 : 85;
  const stuffed = keywordEvidence.stuffed;
  if (job && stuffed.length > 0) {
    const penalty = Math.min(20, 8 + stuffed.length * 4);
    score -= penalty;
    notes.push("Some JD terms repeat without enough supporting evidence.");
    issues.push(
      issue(
        "warning",
        "keywords",
        "Keyword stuffing or thin evidence",
        "Some keywords appear repeatedly without supporting bullets or projects.",
        "Use keywords naturally inside specific achievements instead of repeating them.",
      ),
    );
  }

  if (job && score < 50) {
    issues.push(
      issue(
        "error",
        "keywords",
        "Low keyword match",
        `Only ${Math.round(score)}% of target job keywords were found.`,
        "Add relevant job keywords naturally to skills and experience.",
      ),
    );
  } else if (job && score < 70) {
    issues.push(
      issue(
        "warning",
        "keywords",
        "Moderate keyword match",
        `${Math.round(score)}% of target job keywords were found.`,
        "Mirror more of the posting's important language where accurate.",
      ),
    );
  }

  notes.push(
    job
      ? "Compared JD terms as evidence-backed matches, mentions, and missing keywords."
      : "No job description supplied; keyword score uses a neutral baseline.",
  );
  evidence.push(
    `${keywordEvidence.matchedWithEvidence.length}/${keywords.length} keyword(s) matched with evidence; ${keywordEvidence.mentionedOnly.length} mentioned only.`,
  );
  for (const match of keywordEvidence.matches.slice(0, 8)) {
    if (match.status === "matched_with_evidence") {
      evidence.push(
        `${match.keyword} matched with evidence: "${match.evidenceSnippets[0]}"`,
      );
    } else if (match.status === "mentioned_only") {
      evidence.push(
        `${match.keyword} mentioned only in ${match.locations.join(", ")}.`,
      );
    } else {
      evidence.push(`${match.keyword} missing.`);
    }
  }
  keywordEvidence.warnings.forEach((warning) => notes.push(warning));

  return {
    axis: axis("keywordMatch", "Keyword match", score, notes, evidence),
    keywords,
    issues,
    keywordEvidence,
  };
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (lower.includes("present") || lower.includes("current")) return nowDate();
  const year = lower.match(/\b(19|20)\d{2}\b/)?.[0];
  if (!year) return null;
  const monthMap: Record<string, number> = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };
  const monthKey = Object.keys(monthMap).find((key) => lower.includes(key));
  const month = monthKey ? monthMap[monthKey] : 0;
  const monthStr = String(month + 1).padStart(2, "0");
  return parseToDate(`${year}-${monthStr}-01T00:00:00`);
}

function scoreDates(profile: Profile) {
  const notes: string[] = [];
  const evidence: string[] = [];
  const issues: ATSIssue[] = [];
  let score = 100;
  const missingStart = profile.experiences.filter(
    (exp) => !exp.startDate,
  ).length;
  if (missingStart > 0) {
    score -= Math.min(50, missingStart * 22);
    notes.push("Some roles are missing start dates.");
    issues.push(
      issue(
        "error",
        "structure",
        "Missing dates",
        "Some experience entries do not include start dates.",
        "Add month/year or year ranges to each role.",
      ),
    );
  }

  const ranges = profile.experiences
    .map((exp) => ({
      start: parseDate(exp.startDate),
      end: parseDate(exp.endDate) || (exp.current ? nowDate() : null),
    }))
    .filter((range): range is { start: Date; end: Date | null } =>
      Boolean(range.start),
    )
    .sort((a, b) => b.start.getTime() - a.start.getTime());

  let largeGaps = 0;
  for (let i = 0; i < ranges.length - 1; i++) {
    const newer = ranges[i];
    const older = ranges[i + 1];
    if (!older.end) continue;
    const gapMonths =
      (newer.start.getTime() - older.end.getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    if (gapMonths > 12) largeGaps += 1;
  }
  if (largeGaps > 0) {
    score -= Math.min(20, largeGaps * 10);
    notes.push("Large unexplained employment gaps may trigger rigid filters.");
  }

  evidence.push(
    `${profile.experiences.length - missingStart}/${profile.experiences.length} role(s) include start dates.`,
  );
  return {
    axis: axis("datesAndTenure", "Dates & tenure", score, notes, evidence),
    issues,
  };
}

function scoreContent(profile: Profile, text: string) {
  const notes: string[] = [];
  const evidence: string[] = [];
  const issues: ATSIssue[] = [];
  let score = 100;
  const normalized = normalizeText(text || profileText(profile));
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const actionVerbCount = ACTION_VERBS.filter((verb) =>
    containsWord(normalized, verb),
  ).length;
  const quantified = (
    text.match(
      /\d+%|\$\d+|\b\d+x\b|\bteam of \d+\b|\b\d+\s+(users|clients|projects|people|engineers|reports|hours)\b/gi,
    ) || []
  ).length;

  if (actionVerbCount < 5 && profile.experiences.length > 0) {
    score -= 15;
    notes.push("Few strong action verbs were detected.");
    issues.push(
      issue(
        "warning",
        "content",
        "Few action verbs",
        "Resume bullets could better show ownership and impact.",
        "Start bullets with verbs like Led, Built, Improved, Reduced, or Shipped.",
      ),
    );
  }
  if (quantified === 0 && profile.experiences.length > 0) {
    score -= 18;
    notes.push("No quantified achievements were detected.");
    issues.push(
      issue(
        "warning",
        "content",
        "Missing quantified achievements",
        "Metrics help ATS-adjacent ranking and recruiter scanning.",
        "Add numbers such as percentages, revenue, volume, team size, or time saved.",
      ),
    );
  }
  if (wordCount < 150) {
    score -= 20;
    notes.push("Resume text is very short.");
  } else if (wordCount > 1000) {
    score -= 10;
    notes.push("Resume text is unusually long.");
  } else if (wordCount < 300 || wordCount > 700) {
    score -= 5;
    notes.push("Resume length is outside the 300-700 word target band.");
  }

  evidence.push(
    `${wordCount} words, ${actionVerbCount} action verbs, ${quantified} quantified result(s).`,
  );
  return {
    axis: axis("contentQuality", "Content quality", score, notes, evidence),
    issues,
  };
}

function buildSummary(overall: number) {
  if (overall >= 80)
    return "Your resume is well-optimized for ATS parsing and job matching. A few targeted edits can still improve ranking.";
  if (overall >= 60)
    return "Your resume has a solid ATS foundation, but the scanner found issues that may reduce visibility.";
  if (overall >= 40)
    return "Your resume may struggle in ATS workflows. Fix the highest-priority parsing, section, and keyword gaps first.";
  return "Your resume needs significant ATS improvements before applying. Start with contact, sections, dates, and basic parseability.";
}

function buildRecommendations(
  issues: ATSIssue[],
  axes: Record<AxisKey, AxisScore>,
) {
  const recommendations: string[] = [];
  if (axes.keywordMatch.score < 70)
    recommendations.push(
      "Add more accurate keywords from the target job posting.",
    );
  if (axes.sectionCompleteness.score < 70)
    recommendations.push(
      "Use standard Contact, Summary, Experience, Education, and Skills sections.",
    );
  if (axes.datesAndTenure.score < 70)
    recommendations.push("Add clear month/year or year ranges to every role.");
  if (axes.contentQuality.score < 70)
    recommendations.push(
      "Rewrite bullets with action verbs and measurable outcomes.",
    );
  if (axes.parseability.score < 70)
    recommendations.push(
      "Simplify formatting so the resume extracts cleanly as text.",
    );
  for (const item of issues
    .filter((item) => item.type === "error")
    .slice(0, 3)) {
    if (!recommendations.includes(item.suggestion))
      recommendations.push(item.suggestion);
  }
  return recommendations.slice(0, 5);
}

export function scanResume(
  profile: Profile,
  rawText?: string,
  job?: JobDescription,
  fileMeta?: FileMeta,
): ATSScanResult {
  const text = rawText?.trim() || profile.rawText || profileText(profile);
  const parseability = scoreParseability(text, fileMeta);
  const sections = scoreSections(profile);
  const keywords = scoreKeywords(profile, text, job);
  const dates = scoreDates(profile);
  const content = scoreContent(profile, text);
  const axes = {
    parseability: parseability.axis,
    sectionCompleteness: sections.axis,
    keywordMatch: keywords.axis,
    datesAndTenure: dates.axis,
    contentQuality: content.axis,
  };
  const issues = [
    ...parseability.issues,
    ...sections.issues,
    ...keywords.issues,
    ...dates.issues,
    ...content.issues,
  ];
  const overall = clampScore(
    Object.values(axes).reduce(
      (sum, item) => sum + item.score * item.weight,
      0,
    ),
  );
  const legacy: ATSAnalysisResult = {
    score: {
      overall,
      formatting: axes.parseability.score,
      structure: Math.round(
        (axes.sectionCompleteness.score + axes.datesAndTenure.score) / 2,
      ),
      content: axes.contentQuality.score,
      keywords: axes.keywordMatch.score,
    },
    issues,
    keywords: keywords.keywords,
    summary: buildSummary(overall),
    recommendations: buildRecommendations(issues, axes),
  };

  return {
    overall,
    letterGrade: scoreToLetterGrade(overall),
    axes,
    issues,
    keywords: keywords.keywords,
    keywordEvidence: keywords.keywordEvidence,
    summary: legacy.summary,
    recommendations: legacy.recommendations,
    scannedAt: nowIso(),
    legacy,
  };
}
