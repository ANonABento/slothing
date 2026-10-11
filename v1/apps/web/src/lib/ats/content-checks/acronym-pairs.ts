// Acronym ↔ spelled-out pair detector.
//
// Research is explicit: different ATS parsers index acronyms differently.
// Workday's core search treats "ML" and "Machine Learning" as distinct
// tokens (no synonym expansion). Including both forms on first occurrence
// covers both indexing paths.
//
// We pair-match known acronyms and surface ones that appear in only one form.

export interface AcronymPair {
  acronym: string;
  expansion: string;
  /**
   * Optional canonical regex for the expansion, in case it has variants.
   * Falls back to a word-boundary match on `expansion` if omitted.
   */
  expansionPattern?: RegExp;
}

export const ACRONYM_PAIRS: ReadonlyArray<AcronymPair> = [
  { acronym: "ML", expansion: "Machine Learning" },
  { acronym: "AI", expansion: "Artificial Intelligence" },
  { acronym: "NLP", expansion: "Natural Language Processing" },
  { acronym: "CV", expansion: "Computer Vision" },
  { acronym: "DL", expansion: "Deep Learning" },
  { acronym: "RL", expansion: "Reinforcement Learning" },
  { acronym: "LLM", expansion: "Large Language Model" },
  { acronym: "API", expansion: "Application Programming Interface" },
  { acronym: "REST", expansion: "Representational State Transfer" },
  { acronym: "CI", expansion: "Continuous Integration" },
  { acronym: "CD", expansion: "Continuous Delivery" },
  {
    acronym: "CI/CD",
    expansion: "Continuous Integration and Continuous Delivery",
  },
  { acronym: "SaaS", expansion: "Software as a Service" },
  { acronym: "PaaS", expansion: "Platform as a Service" },
  { acronym: "IaaS", expansion: "Infrastructure as a Service" },
  { acronym: "AWS", expansion: "Amazon Web Services" },
  { acronym: "GCP", expansion: "Google Cloud Platform" },
  { acronym: "K8s", expansion: "Kubernetes" },
  { acronym: "DB", expansion: "Database" },
  { acronym: "SQL", expansion: "Structured Query Language" },
  { acronym: "ETL", expansion: "Extract Transform Load" },
  { acronym: "ELT", expansion: "Extract Load Transform" },
  { acronym: "OOP", expansion: "Object Oriented Programming" },
  { acronym: "TDD", expansion: "Test Driven Development" },
  { acronym: "BDD", expansion: "Behavior Driven Development" },
  { acronym: "MVC", expansion: "Model View Controller" },
  { acronym: "MVP", expansion: "Minimum Viable Product" },
  { acronym: "PM", expansion: "Product Manager" },
  { acronym: "PMO", expansion: "Project Management Office" },
  { acronym: "QA", expansion: "Quality Assurance" },
  { acronym: "UX", expansion: "User Experience" },
  { acronym: "UI", expansion: "User Interface" },
  { acronym: "SEO", expansion: "Search Engine Optimization" },
  { acronym: "SEM", expansion: "Search Engine Marketing" },
  { acronym: "CRM", expansion: "Customer Relationship Management" },
  { acronym: "ERP", expansion: "Enterprise Resource Planning" },
  { acronym: "HR", expansion: "Human Resources" },
  { acronym: "ATS", expansion: "Applicant Tracking System" },
  { acronym: "OKR", expansion: "Objectives and Key Results" },
  { acronym: "KPI", expansion: "Key Performance Indicator" },
  { acronym: "ROI", expansion: "Return on Investment" },
  { acronym: "B2B", expansion: "Business to Business" },
  { acronym: "B2C", expansion: "Business to Consumer" },
  { acronym: "EHR", expansion: "Electronic Health Record" },
  { acronym: "EMR", expansion: "Electronic Medical Record" },
  { acronym: "GIS", expansion: "Geographic Information System" },
  { acronym: "PR", expansion: "Pull Request" },
  { acronym: "SRE", expansion: "Site Reliability Engineering" },
  { acronym: "DevOps", expansion: "Development Operations" },
  { acronym: "DBA", expansion: "Database Administrator" },
];

export type AcronymGap =
  | { kind: "expansion-missing"; acronym: string; expansion: string }
  | { kind: "acronym-missing"; acronym: string; expansion: string };

export interface AcronymPairReport {
  /** Pairs where both forms appeared at least once. */
  paired: AcronymPair[];
  /** Pairs where only one form appeared — the other is missing. */
  gaps: AcronymGap[];
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasToken(text: string, token: string, caseSensitive = false): boolean {
  const flags = caseSensitive ? "" : "i";
  // Allow + and # in tech tokens (C++, C#), and / for CI/CD
  const pattern = new RegExp(
    `(^|[^A-Za-z0-9+#/])${escapeRegExp(token)}($|[^A-Za-z0-9+#/])`,
    flags,
  );
  return pattern.test(text);
}

export function analyzeAcronymPairs(
  text: string,
  pairs: ReadonlyArray<AcronymPair> = ACRONYM_PAIRS,
): AcronymPairReport {
  const paired: AcronymPair[] = [];
  const gaps: AcronymGap[] = [];

  for (const pair of pairs) {
    // Acronyms are checked case-sensitive to avoid false positives like "ai"
    // inside words. Expansions are case-insensitive.
    const hasAcronym = hasToken(text, pair.acronym, true);
    const hasExpansion = pair.expansionPattern
      ? pair.expansionPattern.test(text)
      : hasToken(text, pair.expansion, false);

    if (hasAcronym && hasExpansion) {
      paired.push(pair);
    } else if (hasAcronym && !hasExpansion) {
      gaps.push({
        kind: "expansion-missing",
        acronym: pair.acronym,
        expansion: pair.expansion,
      });
    } else if (!hasAcronym && hasExpansion) {
      gaps.push({
        kind: "acronym-missing",
        acronym: pair.acronym,
        expansion: pair.expansion,
      });
    }
  }

  return { paired, gaps };
}
