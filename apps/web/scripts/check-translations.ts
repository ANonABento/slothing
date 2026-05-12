import { readFile } from "node:fs/promises";
import path from "node:path";

const targetLocales = ["es", "zh-CN", "pt-BR", "hi", "fr", "ja", "ko"] as const;

type TargetLocale = (typeof targetLocales)[number];
type JsonValue = string | JsonRecord;
type JsonRecord = { [key: string]: JsonValue };
type FlatMessages = Record<string, string>;

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

const brandTerms = new Set([
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
]);

function flattenMessages(record: JsonRecord, prefix = ""): FlatMessages {
  const entries: FlatMessages = {};

  for (const [key, value] of Object.entries(record)) {
    const messageKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      entries[messageKey] = value;
      continue;
    }

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Expected string or object at ${messageKey}`);
    }

    Object.assign(entries, flattenMessages(value, messageKey));
  }

  return entries;
}

async function loadMessages(messagesDir: string, locale: string) {
  const file = await readFile(path.join(messagesDir, `${locale}.json`), "utf8");
  return JSON.parse(file) as JsonRecord;
}

function withoutMeta(messages: FlatMessages) {
  return Object.fromEntries(
    Object.entries(messages).filter(([key]) => !key.startsWith("_meta.")),
  );
}

function isExpectedIdentical(key: string, value: string) {
  return passthroughPaths.has(key) || brandTerms.has(value);
}

function renderKeyList(keys: string[]) {
  if (keys.length === 0) return "none";
  return keys.map((key) => `\`${key}\``).join(", ");
}

async function main() {
  const messagesDir = path.join(process.cwd(), "src/messages");
  const source = withoutMeta(flattenMessages(await loadMessages(messagesDir, "en")));
  const sourceKeys = Object.keys(source).sort();
  const sourceKeySet = new Set(sourceKeys);

  const rows: Array<{
    locale: TargetLocale;
    missing: string[];
    extra: string[];
    identical: string[];
  }> = [];

  for (const locale of targetLocales) {
    const target = withoutMeta(flattenMessages(await loadMessages(messagesDir, locale)));
    const targetKeys = Object.keys(target).sort();
    const targetKeySet = new Set(targetKeys);

    const missing = sourceKeys.filter((key) => !targetKeySet.has(key));
    const extra = targetKeys.filter((key) => !sourceKeySet.has(key));
    const identical = sourceKeys.filter(
      (key) =>
        target[key] === source[key] && !isExpectedIdentical(key, source[key]),
    );

    rows.push({ locale, missing, extra, identical });
  }

  console.error("## Translation Drift Check");
  console.error("");
  console.error("| Locale | Missing | Extra | Identical-to-en warnings |");
  console.error("| --- | ---: | ---: | ---: |");
  for (const row of rows) {
    console.error(
      `| ${row.locale} | ${row.missing.length} | ${row.extra.length} | ${row.identical.length} |`,
    );
  }
  console.error("");

  for (const row of rows) {
    if (
      row.missing.length === 0 &&
      row.extra.length === 0 &&
      row.identical.length === 0
    ) {
      continue;
    }

    console.error(`### ${row.locale}`);
    console.error(`- Missing: ${renderKeyList(row.missing)}`);
    console.error(`- Extra: ${renderKeyList(row.extra)}`);
    console.error(
      `- Identical-to-en warnings: ${renderKeyList(row.identical)}`,
    );
    console.error("");
  }

  const hasDrift = rows.some(
    (row) => row.missing.length > 0 || row.extra.length > 0,
  );

  if (hasDrift) {
    console.error(
      "Run `pnpm translate:messages` from apps/web, commit the updated locale JSON files, and re-run `pnpm check:translations`.",
    );
    process.exitCode = 1;
    return;
  }

  const warningCount = rows.reduce(
    (total, row) => total + row.identical.length,
    0,
  );
  if (warningCount > 0) {
    console.error(
      `${warningCount} identical-to-English string(s) were found. These are warnings only; review them when refreshing translations.`,
    );
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
