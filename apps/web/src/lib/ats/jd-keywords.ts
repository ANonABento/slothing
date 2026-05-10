export interface JdKeyword {
  term: string;
  frequency: number;
  kind: "keyword" | "phrase";
}

interface KeywordCandidate extends JdKeyword {
  firstIndex: number;
  signal: number;
}

interface CanonicalTerm {
  term: string;
  aliases?: string[];
  signal?: number;
}

const DEFAULT_LIMIT = 30;

const STOP_WORDS = new Set([
  "a",
  "about",
  "across",
  "after",
  "all",
  "also",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "candidate",
  "candidates",
  "company",
  "during",
  "each",
  "etc",
  "for",
  "from",
  "have",
  "in",
  "including",
  "is",
  "job",
  "looking",
  "may",
  "must",
  "need",
  "of",
  "on",
  "or",
  "our",
  "position",
  "preferred",
  "requirements",
  "responsibilities",
  "responsibility",
  "role",
  "should",
  "team",
  "the",
  "their",
  "this",
  "to",
  "using",
  "we",
  "with",
  "work",
  "years",
  "you",
  "your",
]);

const FILLER_TERMS = new Set([
  "ability",
  "benefits",
  "bonus",
  "build",
  "building",
  "collaborate",
  "collaborates",
  "collaboration",
  "communication",
  "environment",
  "excellent",
  "experience",
  "familiarity",
  "fast",
  "help",
  "intern",
  "internship",
  "internships",
  "knowledge",
  "maintain",
  "management",
  "nice",
  "opportunity",
  "passion",
  "plus",
  "professional",
  "proven",
  "required",
  "skills",
  "strong",
  "support",
  "understanding",
  "use",
  "used",
  "uses",
  "write",
  "writes",
  "writing",
]);

const CANONICAL_TERMS: CanonicalTerm[] = [
  { term: ".net", aliases: ["dotnet", "dot net"] },
  { term: "accessibility", aliases: ["accessible ui", "a11y", "wcag"] },
  { term: "agile" },
  { term: "analytics" },
  { term: "angular" },
  { term: "api", aliases: ["apis"] },
  { term: "aws", aliases: ["amazon web services"] },
  { term: "azure" },
  { term: "c#" },
  { term: "c++" },
  { term: "ci/cd", aliases: ["ci cd", "cicd"] },
  { term: "css", aliases: ["css3"] },
  { term: "dashboard", aliases: ["dashboards"] },
  { term: "dashboard reporting", aliases: ["reporting dashboards"] },
  { term: "data analysis", aliases: ["data analytics"] },
  { term: "data pipelines", aliases: ["data pipeline"] },
  { term: "data science" },
  { term: "data visualization", aliases: ["data visualizations", "dataviz"] },
  { term: "deep learning" },
  { term: "docker" },
  { term: "etl" },
  { term: "excel" },
  { term: "figma" },
  { term: "front end", aliases: ["frontend", "front-end"] },
  { term: "gcp", aliases: ["google cloud"] },
  { term: "git" },
  { term: "go", aliases: ["golang"] },
  { term: "graphql", aliases: ["graph ql"] },
  { term: "html", aliases: ["html5"] },
  { term: "integration testing", aliases: ["integration tests"] },
  { term: "java" },
  { term: "javascript", aliases: ["js"] },
  { term: "jira" },
  { term: "kubernetes", aliases: ["k8s"] },
  { term: "linux" },
  { term: "machine learning", aliases: ["ml"] },
  { term: "mongodb", aliases: ["mongo"] },
  { term: "mysql" },
  { term: "next.js", aliases: ["nextjs", "next js"] },
  { term: "node.js", aliases: ["nodejs", "node js", "node"] },
  { term: "postgresql", aliases: ["postgres"] },
  { term: "power bi", aliases: ["powerbi"] },
  { term: "python" },
  { term: "react", aliases: ["react.js", "reactjs"] },
  { term: "redux" },
  { term: "responsive design", aliases: ["responsive ui", "responsive web"] },
  { term: "rest apis", aliases: ["rest api", "restful api", "restful apis"] },
  { term: "ruby" },
  { term: "rust" },
  { term: "salesforce" },
  { term: "scrum" },
  { term: "sql" },
  { term: "statistics", aliases: ["statistical analysis"] },
  { term: "swift" },
  { term: "tableau" },
  { term: "terraform" },
  { term: "testing", aliases: ["test automation"] },
  { term: "typescript", aliases: ["ts"] },
  {
    term: "unit testing",
    aliases: ["unit tests", "unit and integration tests"],
  },
  { term: "vue", aliases: ["vue.js", "vuejs"] },
  { term: "web performance", aliases: ["performance optimization"] },
  { term: "zustand" },
];

const KNOWN_TERMS = new Set(CANONICAL_TERMS.map(({ term }) => term));

const ALIAS_TO_CANONICAL = new Map<string, string>();
const CANONICAL_TO_ALIASES = new Map<string, string[]>();

for (const definition of CANONICAL_TERMS) {
  const aliases = [definition.term, ...(definition.aliases ?? [])].map((term) =>
    normalizeTermSyntax(term),
  );
  const uniqueAliases = Array.from(new Set(aliases));
  CANONICAL_TO_ALIASES.set(definition.term, uniqueAliases);
  for (const alias of uniqueAliases) {
    ALIAS_TO_CANONICAL.set(alias, definition.term);
  }
}

function escapeRegExp(term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTermSyntax(text: string) {
  return text
    .toLowerCase()
    .replace(/[•*]/g, " ")
    .replace(/[()[\]{}"'`]/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/[,:;!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+|\.+$/g, "");
}

function normalizeInput(text: string) {
  return normalizeTermSyntax(text);
}

function canonicalizeTerm(term: string) {
  const normalized = normalizeTermSyntax(term);
  return ALIAS_TO_CANONICAL.get(normalized) ?? normalized;
}

function addCandidate(
  candidates: Map<string, KeywordCandidate>,
  term: string,
  kind: JdKeyword["kind"],
  firstIndex: number,
  signal: number,
) {
  const canonical = canonicalizeTerm(term);
  if (
    !canonical ||
    STOP_WORDS.has(canonical) ||
    FILLER_TERMS.has(canonical) ||
    !KNOWN_TERMS.has(canonical)
  ) {
    return;
  }

  const existing = candidates.get(canonical);
  if (existing) {
    existing.frequency += 1;
    existing.signal = Math.max(existing.signal, signal);
    existing.firstIndex = Math.min(existing.firstIndex, firstIndex);
    if (kind === "phrase") existing.kind = "phrase";
    return;
  }

  candidates.set(canonical, {
    term: canonical,
    frequency: 1,
    kind,
    firstIndex,
    signal,
  });
}

function scoreCandidate(candidate: KeywordCandidate) {
  return (
    candidate.frequency * 100 +
    candidate.signal +
    (candidate.kind === "phrase" ? 30 : 0) -
    candidate.firstIndex / 1000
  );
}

export function getJdKeywordAliases(term: string): string[] {
  const canonical = canonicalizeTerm(term);
  const aliases = CANONICAL_TO_ALIASES.get(canonical) ?? [canonical];
  return Array.from(
    new Set([
      canonical,
      ...aliases,
      ...aliases.map(singularizeTerm),
      ...aliases.map(pluralizeTerm),
    ]),
  ).filter(Boolean);
}

export function singularizeTerm(term: string) {
  if (term.endsWith("ies") && term.length > 4) {
    return `${term.slice(0, -3)}y`;
  }
  if (term.endsWith("ses") || term.endsWith("xes")) {
    return term.slice(0, -2);
  }
  if (term.endsWith("s") && !term.endsWith("ss") && term.length > 3) {
    return term.slice(0, -1);
  }
  return term;
}

export function pluralizeTerm(term: string) {
  if (term.endsWith("y") && term.length > 3) {
    return `${term.slice(0, -1)}ies`;
  }
  if (term.endsWith("s")) {
    return term;
  }
  return `${term}s`;
}

export function extractJdKeywordTerms(
  text: string,
  options: { limit?: number } = {},
): string[] {
  return extractJdKeywords(text, options).map((keyword) => keyword.term);
}

export function extractJdKeywords(
  text: string,
  options: { limit?: number } = {},
): JdKeyword[] {
  const normalizedText = normalizeInput(text);
  if (!normalizedText) return [];

  const limit = options.limit ?? DEFAULT_LIMIT;
  if (limit <= 0) return [];

  const candidates = new Map<string, KeywordCandidate>();

  for (const definition of CANONICAL_TERMS) {
    const aliases = CANONICAL_TO_ALIASES.get(definition.term) ?? [
      definition.term,
    ];
    for (const alias of aliases) {
      const pattern = escapeRegExp(alias).replace(/\s+/g, "\\s+");
      const regex = new RegExp(
        `(^|[^a-z0-9+#])${pattern}(?=$|[^a-z0-9+#])`,
        "g",
      );
      for (const match of normalizedText.matchAll(regex)) {
        const matchedStart = match.index + (match[1]?.length ?? 0);
        const beforeMatch = normalizedText.slice(0, matchedStart).trimEnd();
        const previousChar = normalizedText[matchedStart - 1];
        if (
          definition.term === "api" &&
          (beforeMatch.endsWith("rest") || beforeMatch.endsWith("restful"))
        ) {
          continue;
        }
        if (
          alias.length <= 2 &&
          (previousChar === "." || previousChar === "/")
        ) {
          continue;
        }
        addCandidate(
          candidates,
          definition.term,
          definition.term.includes(" ") ? "phrase" : "keyword",
          matchedStart,
          definition.signal ?? 80,
        );
      }
    }
  }

  return Array.from(candidates.values())
    .sort((a, b) => {
      const byScore = scoreCandidate(b) - scoreCandidate(a);
      if (byScore !== 0) return byScore;
      return a.term.localeCompare(b.term);
    })
    .slice(0, limit)
    .map(({ term, frequency, kind }) => ({ term, frequency, kind }));
}
