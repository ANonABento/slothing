export interface JdKeyword {
  term: string;
  frequency: number;
  kind: "keyword" | "phrase";
}

interface KeywordCandidate extends JdKeyword {
  firstIndex: number;
  signal: number;
}

const DEFAULT_LIMIT = 30;

const STOP_WORDS = new Set([
  "a",
  "about",
  "across",
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
  "etc",
  "for",
  "from",
  "have",
  "in",
  "including",
  "is",
  "job",
  "looking",
  "must",
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
  "build",
  "collaborate",
  "communication",
  "environment",
  "excellent",
  "experience",
  "fast",
  "help",
  "integration",
  "integrations",
  "knowledge",
  "management",
  "opportunity",
  "passion",
  "professional",
  "proven",
  "required",
  "skills",
  "strong",
  "support",
]);

const KNOWN_TECH_TERMS = [
  "node.js",
  "javascript",
  "typescript",
  "react",
  "next.js",
  "python",
  "java",
  "c++",
  "c#",
  "sql",
  "postgresql",
  "mysql",
  "aws",
  "azure",
  "gcp",
  "kubernetes",
  "docker",
  "graphql",
  "rest",
  "api",
  "apis",
  "machine learning",
  "data analysis",
  "project management",
  "customer success",
];

const KNOWN_TECH_TERM_SET = new Set(KNOWN_TECH_TERMS);
const KNOWN_SINGLE_TECH_TERMS = new Set(
  KNOWN_TECH_TERMS.filter((term) => !term.includes(" ")),
);

const WORD_RE = /[a-z0-9][a-z0-9+#.]*/g;

function normalizeInput(text: string) {
  return text
    .toLowerCase()
    .replace(/[•*]/g, " ")
    .replace(/[()[\]{}"'`]/g, " ")
    .replace(/[,:;!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeToken(token: string) {
  return token.replace(/^\.+|\.+$/g, "");
}

function tokenize(text: string) {
  return Array.from(normalizeInput(text).matchAll(WORD_RE), (match) =>
    normalizeToken(match[0]),
  ).filter(Boolean);
}

function isKeywordToken(token: string) {
  if (token.length < 2) return false;
  if (/^\d+$/.test(token)) return false;
  if (STOP_WORDS.has(token) || FILLER_TERMS.has(token)) return false;
  return /[a-z]/.test(token);
}

function isUsefulPhrase(tokens: string[]) {
  if (tokens.length < 2) return false;
  if (!tokens.every(isKeywordToken)) return false;
  if (tokens.some((token) => KNOWN_SINGLE_TECH_TERMS.has(token))) return false;
  if (tokens.every((token) => FILLER_TERMS.has(token))) return false;
  return tokens.join(" ").length >= 8;
}

function addCandidate(
  candidates: Map<string, KeywordCandidate>,
  term: string,
  kind: JdKeyword["kind"],
  firstIndex: number,
  signal: number,
) {
  const normalized = term.trim().replace(/\s+/g, " ");
  if (!normalized) return;

  const existing = candidates.get(normalized);
  if (existing) {
    existing.frequency += 1;
    existing.signal = Math.max(existing.signal, signal);
    existing.firstIndex = Math.min(existing.firstIndex, firstIndex);
    if (kind === "phrase") existing.kind = "phrase";
    return;
  }

  candidates.set(normalized, {
    term: normalized,
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

export function extractJdKeywords(
  text: string,
  options: { limit?: number } = {},
): JdKeyword[] {
  const normalizedText = normalizeInput(text);
  if (!normalizedText) return [];

  const limit = options.limit ?? DEFAULT_LIMIT;
  if (limit <= 0) return [];

  const candidates = new Map<string, KeywordCandidate>();
  const tokens = tokenize(text);

  for (const term of KNOWN_TECH_TERMS) {
    if (!term.includes(" ")) {
      tokens.forEach((token, index) => {
        if (token === term) {
          addCandidate(candidates, term, "keyword", index, 80);
        }
      });
      continue;
    }

    const regex = new RegExp(
      `(?<![a-z0-9+#])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9+#])`,
      "g",
    );
    const matches = Array.from(normalizedText.matchAll(regex));
    for (const match of matches) {
      addCandidate(
        candidates,
        term,
        term.includes(" ") ? "phrase" : "keyword",
        match.index,
        80,
      );
    }
  }

  tokens.forEach((token, index) => {
    if (isKeywordToken(token) && !KNOWN_TECH_TERM_SET.has(token)) {
      addCandidate(candidates, token, "keyword", index, 10);
    }
  });

  for (let index = 0; index < tokens.length; index += 1) {
    for (const size of [3, 2]) {
      const phraseTokens = tokens.slice(index, index + size);
      if (phraseTokens.length === size && isUsefulPhrase(phraseTokens)) {
        addCandidate(
          candidates,
          phraseTokens.join(" "),
          "phrase",
          index,
          size === 3 ? 45 : 35,
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
