import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const targetLocales = ["es", "zh-CN", "pt-BR", "hi", "fr", "ja", "ko"] as const;

type TargetLocale = (typeof targetLocales)[number];
type JsonValue = string | JsonRecord;
type JsonRecord = { [key: string]: JsonValue };
type FlatMessages = Record<string, string>;

type ProviderResult = {
  provider: "anthropic" | "openai";
  model: string;
  content: string;
};

const ANTHROPIC_MODEL =
  process.env.TRANSLATE_ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
const OPENAI_MODEL = process.env.TRANSLATE_OPENAI_MODEL ?? "gpt-4o-mini";

const localeNames: Record<TargetLocale, string> = {
  es: "Spanish (Latin America-neutral)",
  "zh-CN": "Simplified Chinese",
  "pt-BR": "Brazilian Portuguese",
  hi: "Hindi",
  fr: "French",
  ja: "Japanese",
  ko: "Korean",
};

const localeOverrides: Partial<Record<TargetLocale, Record<string, string>>> = {
  es: {
    "nav.groups.pipeline": "Pipeline",
  },
  fr: {
    "common.openSource": "Code source ouvert",
    "nav.groups.documents": "Fichiers",
    "nav.groups.pipeline": "Suivi",
    "nav.items.documents": "Fichiers",
    "dashboard.stats.documents": "Fichiers",
    "dashboard.stats.pipeline": "Suivi",
    "dashboard.pipeline.title": "Suivi",
    "opportunities.filters.type": "Catégorie",
    "opportunities.filters.source": "Origine",
    "opportunities.tabs.hackathon": "Marathons de code",
    "opportunities.types.hackathon": "Marathon de code",
    "opportunities.counts.hackathons":
      "{count, plural, one {# marathon de code} other {# marathons de code}}",
  },
  "pt-BR": {
    "nav.groups.pipeline": "Funil",
    "dashboard.stats.pipeline": "Funil",
    "dashboard.pipeline.title": "Funil",
    "opportunities.filters.status": "Situação",
    "opportunities.filters.tags": "Etiquetas",
    "opportunities.filters.activeStatus": "Situação: {value}",
    "opportunities.filters.activeTag": "Etiqueta: {value}",
    "opportunities.filters.activeTech": "Tecnologia: {value}",
    "opportunities.tabs.hackathon": "Maratonas de programação",
    "opportunities.types.hackathon": "Maratona de programação",
    "opportunities.sources.manual": "Inserção manual",
    "opportunities.counts.hackathons":
      "{count, plural, one {# maratona de programação} other {# maratonas de programação}}",
  },
};

const passthroughPaths = new Set([
  "nav.brand",
  "settings.language.options.en",
  "settings.language.options.es",
  "settings.language.options.zh-CN",
  "settings.language.options.pt-BR",
  "settings.language.options.hi",
  "settings.language.options.fr",
  "settings.language.options.ja",
  "settings.language.options.ko",
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
  "Kanban",
  "LLM",
];

function parseArgs(argv: string[]) {
  const localesArg = argv.find((arg) => arg.startsWith("--locales="));
  const dryRun = argv.includes("--dry-run");
  const locales = localesArg
    ? localesArg
        .slice("--locales=".length)
        .split(",")
        .map((locale) => locale.trim())
        .filter(Boolean)
    : [...targetLocales];

  for (const locale of locales) {
    if (!targetLocales.includes(locale as TargetLocale)) {
      throw new Error(
        `Unsupported locale "${locale}". Expected one of: ${targetLocales.join(", ")}`,
      );
    }
  }

  return { dryRun, locales: locales as TargetLocale[] };
}

function flattenMessages(record: JsonRecord, prefix = ""): FlatMessages {
  const entries: FlatMessages = {};

  for (const [key, value] of Object.entries(record)) {
    if (key === "_meta") continue;

    const messageKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      entries[messageKey] = value;
    } else {
      Object.assign(entries, flattenMessages(value, messageKey));
    }
  }

  return entries;
}

function unflattenMessages(messages: FlatMessages): JsonRecord {
  const root: JsonRecord = {};

  for (const [messageKey, value] of Object.entries(messages)) {
    const parts = messageKey.split(".");
    let cursor = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value;
        return;
      }

      const next = cursor[part];
      if (!next || typeof next === "string") {
        cursor[part] = {};
      }
      cursor = cursor[part] as JsonRecord;
    });
  }

  return root;
}

function buildPrompt(locale: TargetLocale, entries: FlatMessages) {
  const protectedEntries = Object.fromEntries(
    Object.entries(entries).filter(([key]) => passthroughPaths.has(key)),
  );

  return [
    `Translate this product UI message catalog from English into ${localeNames[locale]}.`,
    "Return one valid JSON object only. Do not include markdown fences or prose.",
    "The returned JSON object must have exactly the same keys as the input object.",
    "Preserve ICU MessageFormat argument names and syntax. You may translate human text inside plural/select branches, but keep placeholders like {name}, {count}, {percentage}, {provider}, {date}, {min}-{max}, {label}, {value}, {lane}, {title}, {shown}, and {total} usable.",
    `Leave these brand and product terms untranslated: ${brandTerms.join(", ")}.`,
    `Leave these exact key/value pairs unchanged: ${JSON.stringify(protectedEntries)}.`,
    "Translate every value. If an English term is commonly used in the target language as a loanword, still provide the localized equivalent; never return the English source verbatim except for brand terms, product terms, and the exact key/value pairs listed above.",
    "Use concise, natural in-product UI language, not literal word-for-word phrasing.",
    "Input JSON:",
    JSON.stringify(entries, null, 2),
  ].join("\n\n");
}

async function translateWithAnthropic(
  locale: TargetLocale,
  entries: FlatMessages,
  retryPrompt?: string,
): Promise<ProviderResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 8192,
      temperature: 0.2,
      system:
        "You are a professional software localization translator. Return strict JSON only.",
      messages: [
        {
          role: "user",
          content: retryPrompt ?? buildPrompt(locale, entries),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Anthropic translation failed (${response.status}): ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const content = payload.content
    ?.filter((block) => block.type === "text" && block.text)
    .map((block) => block.text)
    .join("\n");

  if (!content) throw new Error("Anthropic returned no text content");
  return { provider: "anthropic", model: ANTHROPIC_MODEL, content };
}

async function translateWithOpenAI(
  locale: TargetLocale,
  entries: FlatMessages,
  retryPrompt?: string,
): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a professional software localization translator. Return strict JSON only.",
        },
        { role: "user", content: retryPrompt ?? buildPrompt(locale, entries) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI translation failed (${response.status}): ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) throw new Error("OpenAI returned no message content");
  return { provider: "openai", model: OPENAI_MODEL, content };
}

async function translateBatch(locale: TargetLocale, entries: FlatMessages) {
  const errors: string[] = [];
  const runProvider = process.env.ANTHROPIC_API_KEY
    ? translateWithAnthropic
    : translateWithOpenAI;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const retryPrompt =
      attempt === 0
        ? undefined
        : `${buildPrompt(locale, entries)}\n\nYour previous response was invalid. Return JSON only, with no surrounding prose, and preserve exactly the same key set.`;

    try {
      const result = await runProvider(locale, entries, retryPrompt);
      return {
        provider: result.provider,
        model: result.model,
        messages: parseTranslatedJson(result.content),
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(`Could not translate ${locale}: ${errors.join(" | ")}`);
}

function parseTranslatedJson(content: string): FlatMessages {
  const trimmed = content
    .trim()
    .replace(/^```json\s*/u, "")
    .replace(/```$/u, "");
  const parsed = JSON.parse(trimmed) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Translated payload is not a JSON object");
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (typeof key !== "string" || typeof value !== "string") {
      throw new Error(
        `Translated payload contains a non-string value at ${key}`,
      );
    }
  }

  return parsed as FlatMessages;
}

function extractArgumentNames(message: string) {
  return Array.from(message.matchAll(/\{\s*([\w-]+)(?=[,}\s])/gu)).map(
    (match) => match[1],
  );
}

function validateTranslated(source: FlatMessages, translated: FlatMessages) {
  const sourceKeys = Object.keys(source).sort();
  const translatedKeys = Object.keys(translated).sort();

  if (sourceKeys.join("\0") !== translatedKeys.join("\0")) {
    const sourceSet = new Set(sourceKeys);
    const translatedSet = new Set(translatedKeys);
    const missing = sourceKeys.filter((key) => !translatedSet.has(key));
    const extra = translatedKeys.filter((key) => !sourceSet.has(key));
    throw new Error(
      `Translated key set mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`,
    );
  }

  for (const [key, sourceValue] of Object.entries(source)) {
    const translatedValue = translated[key];

    for (const argumentName of extractArgumentNames(sourceValue)) {
      if (!translatedValue.includes(`{${argumentName}`)) {
        throw new Error(`Missing ICU argument {${argumentName}} in ${key}`);
      }
    }

    for (const brand of brandTerms) {
      if (sourceValue.includes(brand) && !translatedValue.includes(brand)) {
        throw new Error(`Brand term ${brand} was not preserved in ${key}`);
      }
    }

    if (passthroughPaths.has(key) && translatedValue !== sourceValue) {
      throw new Error(`Passthrough key ${key} changed during translation`);
    }
  }
}

function applyFinalOverrides(
  locale: TargetLocale,
  source: FlatMessages,
  translated: FlatMessages,
) {
  const withPassthroughs = { ...translated };

  for (const key of passthroughPaths) {
    withPassthroughs[key] = source[key];
  }

  return { ...withPassthroughs, ...(localeOverrides[locale] ?? {}) };
}

function countChanged(source: FlatMessages, translated: FlatMessages) {
  return Object.entries(source).filter(
    ([key, value]) => translated[key] !== value,
  ).length;
}

async function main() {
  const { dryRun, locales } = parseArgs(process.argv.slice(2));
  const messagesDir = path.join(process.cwd(), "src/messages");
  const en = JSON.parse(
    await readFile(path.join(messagesDir, "en.json"), "utf8"),
  ) as JsonRecord;
  const source = flattenMessages(en);

  if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error(
      "Set ANTHROPIC_API_KEY or OPENAI_API_KEY before running translate:messages. Refusing to write English fallback copies.",
    );
  }

  await mkdir(messagesDir, { recursive: true });

  for (const locale of locales) {
    console.log(`Translating ${locale}...`);
    const result = await translateBatch(locale, source);
    const translated = applyFinalOverrides(locale, source, result.messages);
    validateTranslated(source, translated);

    const payload = {
      _meta: {
        note: "Auto-translated, needs human review.",
        source: `llm-${result.provider}`,
        model: result.model,
        generatedAt: new Date().toISOString(),
      },
      ...unflattenMessages(translated),
    };

    const nextContent = `${JSON.stringify(payload, null, 2)}\n`;
    const localePath = path.join(messagesDir, `${locale}.json`);

    if (dryRun) {
      console.log(
        `${locale}: ${countChanged(source, translated)} of ${Object.keys(source).length} leaf strings differ from English.`,
      );
      continue;
    }

    await writeFile(localePath, nextContent);
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
