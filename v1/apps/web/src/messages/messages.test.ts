import { describe, expect, it } from "vitest";

import { SESSION_QUESTION_CATEGORIES } from "@/lib/constants/interview";

import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import hi from "./hi.json";
import ja from "./ja.json";
import ko from "./ko.json";
import ptBR from "./pt-BR.json";
import zhCN from "./zh-CN.json";

type JsonValue = string | JsonRecord;
type JsonRecord = { [key: string]: JsonValue };
type FlatMessages = Record<string, string>;
type MessageFile = JsonRecord & {
  _meta?: {
    note?: string;
    source?: string;
    model?: string;
    generatedAt?: string;
  };
};

const locales = ["en", "es", "zh-CN", "pt-BR", "hi", "fr", "ja", "ko"] as const;
type AppLocale = (typeof locales)[number];

const nonEnglishLocales = locales.filter(
  (locale): locale is Exclude<AppLocale, "en"> => locale !== "en",
);

const files: Record<Exclude<AppLocale, "en">, MessageFile> = {
  es,
  "zh-CN": zhCN,
  "pt-BR": ptBR,
  hi,
  fr,
  ja,
  ko,
};

const allowlistIdenticalPaths = new Set([
  "nav.brand",
  "dashboard.stats.pipeline",
  "dashboard.pipeline.title",
  "opportunities.kanban",
  "opportunities.sources.waterlooworks",
  "opportunities.sources.linkedin",
  "opportunities.sources.indeed",
  "opportunities.sources.greenhouse",
  "opportunities.sources.lever",
  "opportunities.sources.devpost",
  "opportunities.sources.manual",
  "opportunities.sources.url",
  "jobs.import.editForm.fields.url",
  "opportunities.kanbanBoard.hiddenSummary",
]);

const brandTerms = [
  "Slothing",
  "ATS",
  "GitHub",
  "WaterlooWorks",
  "LinkedIn",
  "Indeed",
  "Greenhouse",
  "Lever",
  "Devpost",
  "URL",
];

const sourceMessages = flattenMessages(en);
const sourceKeys = Object.keys(sourceMessages).sort();
const languageOptionKeys = sourceKeys.filter((key) =>
  key.startsWith("settings.language.options."),
);
const localesWithReviewedNewStrings = ["fr", "pt-BR"] as const;

function flattenMessages(record: JsonRecord, prefix = ""): FlatMessages {
  const entries: FlatMessages = {};

  for (const [key, value] of Object.entries(record)) {
    if (key === "_meta") continue;

    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      entries[path] = value;
    } else {
      Object.assign(entries, flattenMessages(value, path));
    }
  }

  return entries;
}

function extractArgumentNames(message: string) {
  const argumentNames = new Set<string>();

  for (let index = 0; index < message.length; index += 1) {
    if (message[index] !== "{") continue;

    const start = index + 1;
    const argumentMatch = /^[\s]*([\w-]+)/u.exec(message.slice(start));
    if (!argumentMatch) continue;

    const argumentName = argumentMatch[1];
    const afterName = start + argumentMatch[0].length;
    const nextToken = message.slice(afterName).match(/^\s*([,}])/u)?.[1];
    if (!nextToken) continue;

    argumentNames.add(argumentName);

    if (nextToken === ",") {
      let depth = 1;
      for (let end = afterName + 1; end < message.length; end += 1) {
        if (message[end] === "{") depth += 1;
        if (message[end] === "}") depth -= 1;
        if (depth === 0) {
          index = end;
          break;
        }
      }
    }
  }

  return Array.from(argumentNames);
}

describe.each(nonEnglishLocales)("messages/%s.json", (locale) => {
  const messages = files[locale];
  const flatMessages = flattenMessages(messages);

  it("has translation metadata", () => {
    expect(messages._meta?.note).toBe("Auto-translated, needs human review.");
    expect(messages._meta?.source).toMatch(/^llm-/);
    expect(messages._meta?.model).toBeTruthy();
    expect(messages._meta?.generatedAt).toBeTruthy();
  });

  it("has the same leaf key set as English", () => {
    expect(Object.keys(flatMessages).sort()).toEqual(sourceKeys);
  });

  it("preserves ICU argument names", () => {
    for (const [key, value] of Object.entries(sourceMessages)) {
      const argumentNames = extractArgumentNames(value);

      for (const argumentName of argumentNames) {
        expect(
          flatMessages[key],
          `${key} should keep {${argumentName}}`,
        ).toContain(`{${argumentName}`);
      }
    }
  });

  it("keeps brand and integration names untranslated", () => {
    expect(flatMessages["nav.brand"]).toBe("Slothing");

    for (const [key, value] of Object.entries(sourceMessages)) {
      for (const brand of brandTerms) {
        if (value.includes(brand)) {
          expect(flatMessages[key], `${key} should keep ${brand}`).toContain(
            brand,
          );
        }
      }
    }
  });

  it("keeps language self-names verbatim", () => {
    for (const key of languageOptionKeys) {
      expect(flatMessages[key]).toBe(sourceMessages[key]);
    }
  });

  it("does not fall back to English for most UI strings", () => {
    const identicalStrings = Object.keys(sourceMessages).filter(
      (key) =>
        !allowlistIdenticalPaths.has(key) &&
        !languageOptionKeys.includes(key) &&
        sourceMessages[key] === flatMessages[key],
    );

    expect(identicalStrings.length).toBeLessThan(25);
  });
});

describe.each(localesWithReviewedNewStrings)(
  "messages/%s.json reviewed strings",
  (locale) => {
    it("has no unallowlisted English fallbacks", () => {
      const flatMessages = flattenMessages(files[locale]);
      const identicalStrings = Object.keys(sourceMessages).filter(
        (key) =>
          !allowlistIdenticalPaths.has(key) &&
          !languageOptionKeys.includes(key) &&
          sourceMessages[key] === flatMessages[key],
      );

      expect(identicalStrings).toEqual([]);
    });
  },
);

describe.each(locales)("messages/%s.json interview categories", (locale) => {
  // The interview Quick Practice dialog looks up category labels via
  // `t(\`categories.${category}\`)`. If the translation map drifts from the
  // SESSION_QUESTION_CATEGORIES enum, the dialog renders the raw key and
  // pollutes the console with IntlError. Pin the two together here.
  const messages = (
    locale === "en" ? en : files[locale as Exclude<AppLocale, "en">]
  ) as MessageFile;

  it("category keys match SESSION_QUESTION_CATEGORIES", () => {
    const categories = (messages.interview as JsonRecord | undefined)
      ?.quickPractice as JsonRecord | undefined;
    expect(categories).toBeDefined();
    const keys = Object.keys(
      (categories?.categories as JsonRecord) ?? {},
    ).sort();
    const expected = [...SESSION_QUESTION_CATEGORIES].sort();
    expect(keys).toEqual(expected);
  });
});
