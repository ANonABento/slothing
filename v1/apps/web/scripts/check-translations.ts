import { readFile, writeFile } from "node:fs/promises";
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

const forbiddenLocaleFragments: Partial<Record<TargetLocale, string[]>> = {
  es: [
    "aberto a",
    "compartilhar",
    "padrão",
    "dados de contato",
    "recrutadores",
  ],
  "pt-BR": [
    "abierto a",
    "compartir",
    "por defecto",
    "información de contacto",
    "reclutadores",
  ],
};

function parseArgs(argv: string[]) {
  const markdownReportArg = argv.find((arg) =>
    arg.startsWith("--markdown-report="),
  );
  const verifyMarkdownReportArg = argv.find((arg) =>
    arg.startsWith("--verify-markdown-report="),
  );
  const messagesDirArg = argv.find((arg) => arg.startsWith("--messages-dir="));

  return {
    strictIdentical: argv.includes("--strict-identical"),
    strictPlaceholders: argv.includes("--strict-placeholders"),
    messagesDir: messagesDirArg?.slice("--messages-dir=".length),
    markdownReport: markdownReportArg?.slice("--markdown-report=".length),
    verifyMarkdownReport: verifyMarkdownReportArg?.slice(
      "--verify-markdown-report=".length,
    ),
  };
}

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
  return (
    passthroughPaths.has(key) ||
    brandTerms.has(value) ||
    !hasLiteralLetters(value)
  );
}

function renderKeyList(keys: string[]) {
  if (keys.length === 0) return "none";
  return keys.map((key) => `\`${key}\``).join(", ");
}

function hasLiteralLetters(message: string) {
  return message.replace(/\{[^{}]*\}/gu, "").match(/\p{L}/u) !== null;
}

function namespaceSummary(keys: string[]) {
  const counts = new Map<string, number>();
  for (const key of keys) {
    const namespace = key.split(".")[0] || key;
    counts.set(namespace, (counts.get(namespace) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([leftName, leftCount], [rightName, rightCount]) => {
      if (leftCount !== rightCount) return rightCount - leftCount;
      return leftName.localeCompare(rightName);
    })
    .slice(0, 8)
    .map(([namespace, count]) => `\`${namespace}\` ${count}`)
    .join(", ");
}

function hasBalancedIcuBraces(message: string) {
  let depth = 0;

  for (let index = 0; index < message.length; index += 1) {
    const char = message[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth < 0) return false;
  }

  return depth === 0;
}

function skipWhitespace(message: string, index: number, end = message.length) {
  while (index < end && /\s/u.test(message[index])) index += 1;
  return index;
}

function readIdentifier(message: string, index: number) {
  const start = index;
  while (index < message.length && /[\w-]/u.test(message[index])) {
    index += 1;
  }
  return {
    value: message.slice(start, index),
    nextIndex: index,
  };
}

function findClosingBrace(message: string, openIndex: number) {
  let depth = 0;

  for (let index = openIndex; index < message.length; index += 1) {
    const char = message[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return index;
  }

  return -1;
}

function collectArgumentsInMessage(
  message: string,
  args: Set<string>,
  start = 0,
  end = message.length,
) {
  for (let index = start; index < end; index += 1) {
    const char = message[index];
    if (char !== "{") continue;

    const closeIndex = findClosingBrace(message, index);
    if (closeIndex < 0 || closeIndex > end) return;
    let cursor = skipWhitespace(message, index + 1, closeIndex);
    const argument = readIdentifier(message, cursor);
    if (!argument.value) {
      index = closeIndex;
      continue;
    }

    cursor = skipWhitespace(message, argument.nextIndex, closeIndex);
    if (message[cursor] === "}") {
      args.add(argument.value);
      index = closeIndex;
      continue;
    }

    if (message[cursor] !== ",") {
      index = closeIndex;
      continue;
    }

    args.add(argument.value);
    cursor = skipWhitespace(message, cursor + 1, closeIndex);
    const formatType = readIdentifier(message, cursor);

    if (["plural", "select", "selectordinal"].includes(formatType.value)) {
      cursor = formatType.nextIndex;
      while (cursor < closeIndex) {
        cursor = skipWhitespace(message, cursor, closeIndex);
        if (message.startsWith("offset:", cursor)) {
          cursor += "offset:".length;
          while (cursor < closeIndex && /[0-9]/u.test(message[cursor])) {
            cursor += 1;
          }
          continue;
        }

        while (
          cursor < closeIndex &&
          !/\s/u.test(message[cursor]) &&
          message[cursor] !== "{"
        ) {
          cursor += 1;
        }
        cursor = skipWhitespace(message, cursor, closeIndex);
        if (message[cursor] !== "{") {
          cursor += 1;
          continue;
        }

        const branchClose = findClosingBrace(message, cursor);
        if (branchClose < 0 || branchClose > closeIndex) break;
        collectArgumentsInMessage(message, args, cursor + 1, branchClose);
        cursor = branchClose + 1;
      }
    }

    index = closeIndex;
  }
}

function extractArgumentNames(message: string) {
  const args = new Set<string>();
  collectArgumentsInMessage(message, args);
  return Array.from(args).sort();
}

function findIcuErrors(source: FlatMessages, target: FlatMessages) {
  const errors: string[] = [];

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];
    if (targetValue === undefined) continue;

    if (!hasBalancedIcuBraces(targetValue)) {
      errors.push(`${key}: unbalanced ICU braces`);
      continue;
    }

    const sourceArgumentNames = extractArgumentNames(sourceValue);
    const targetArgumentNames = extractArgumentNames(targetValue);
    const sourceArgumentSet = new Set(sourceArgumentNames);
    const targetArgumentSet = new Set(targetArgumentNames);
    const missingArguments = sourceArgumentNames.filter(
      (argumentName) => !targetArgumentSet.has(argumentName),
    );
    const extraArguments = targetArgumentNames.filter(
      (argumentName) => !sourceArgumentSet.has(argumentName),
    );

    if (missingArguments.length > 0) {
      errors.push(
        `${key}: missing ${missingArguments
          .map((argumentName) => `{${argumentName}}`)
          .join(", ")}`,
      );
    }

    if (extraArguments.length > 0) {
      errors.push(
        `${key}: unexpected ${extraArguments
          .map((argumentName) => `{${argumentName}}`)
          .join(", ")}`,
      );
    }
  }

  return errors;
}

function findLocaleQualityIssues(locale: TargetLocale, target: FlatMessages) {
  const fragments = forbiddenLocaleFragments[locale] ?? [];
  if (fragments.length === 0) return [];

  const issues: string[] = [];
  for (const [key, value] of Object.entries(target)) {
    const normalizedValue = value.toLocaleLowerCase();
    const matchedFragment = fragments.find((fragment) =>
      normalizedValue.includes(fragment),
    );
    if (matchedFragment) {
      issues.push(`${key}: contains "${matchedFragment}"`);
    }
  }

  return issues;
}

function buildMarkdownReport(
  rows: Array<{
    locale: TargetLocale;
    placeholders: string[];
    identical: string[];
    localeQualityIssues: string[];
  }>,
) {
  const total = rows.reduce((sum, row) => sum + row.placeholders.length, 0);
  const identicalTotal = rows.reduce(
    (sum, row) => sum + row.identical.length,
    0,
  );
  const localeQualityTotal = rows.reduce(
    (sum, row) => sum + row.localeQualityIssues.length,
    0,
  );
  const nextAction =
    total === 0 && identicalTotal === 0 && localeQualityTotal === 0
      ? "No current blocker. Re-run `pnpm --filter @slothing/web check:translations:update-report` after future source-copy or locale-catalog changes, then verify with `pnpm --filter @slothing/web check:translations:release`."
      : "Run `pnpm --filter @slothing/web translate:messages` with `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, review the locale JSON diffs, then run `pnpm --filter @slothing/web check:translations:release`.";
  const lines = [
    "# Translation Placeholder Audit",
    "",
    "Generated from `apps/web/src/messages/*.json` by `pnpm --filter @slothing/web check:translations --markdown-report=<path>`.",
    "",
    "| Locale | Placeholder strings | Largest namespaces |",
    "| --- | ---: | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| \`${row.locale}\` | ${row.placeholders.length} | ${namespaceSummary(row.placeholders)} |`,
    );
  }

  lines.push(
    `| **Total** | **${total}** | |`,
    "",
    "## Identical-to-English Review",
    "",
    "These strings are not allowlisted brand terms or passthrough keys. They should be reviewed after provider refresh and must be cleared before `check:translations:release` passes.",
    "",
    "| Locale | Identical strings | Keys |",
    "| --- | ---: | --- |",
  );

  for (const row of rows) {
    lines.push(
      `| \`${row.locale}\` | ${row.identical.length} | ${renderKeyList(row.identical)} |`,
    );
  }

  lines.push(
    `| **Total** | **${identicalTotal}** | |`,
    "",
    "## Locale Quality Review",
    "",
    "These checks catch known wrong-language fragments that exact-English drift cannot detect.",
    "",
    "| Locale | Quality issues | Keys |",
    "| --- | ---: | --- |",
  );

  for (const row of rows) {
    lines.push(
      `| \`${row.locale}\` | ${row.localeQualityIssues.length} | ${renderKeyList(row.localeQualityIssues)} |`,
    );
  }

  lines.push(
    `| **Total** | **${localeQualityTotal}** | |`,
    "",
    "## Next Action",
    "",
    nextAction,
  );
  return `${lines.join("\n")}\n`;
}

function normalizeMarkdownReport(content: string): string {
  return content
    .trim()
    .split("\n")
    .map((line) => {
      const trimmed = line.trimEnd();
      if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
        return trimmed;
      }

      const cells = trimmed
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell, index, array) => index > 0 && index < array.length - 1);

      if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) {
        return `|${cells.map(() => "---").join("|")}|`;
      }

      return `|${cells.join("|")}|`;
    })
    .join("\n");
}

async function main() {
  const {
    strictIdentical,
    strictPlaceholders,
    messagesDir: messagesDirArg,
    markdownReport,
    verifyMarkdownReport,
  } = parseArgs(process.argv.slice(2));
  const messagesDir = messagesDirArg
    ? path.resolve(process.cwd(), messagesDirArg)
    : path.join(process.cwd(), "src/messages");
  const source = withoutMeta(
    flattenMessages(await loadMessages(messagesDir, "en")),
  );
  const sourceKeys = Object.keys(source).sort();
  const sourceKeySet = new Set(sourceKeys);

  const rows: Array<{
    locale: TargetLocale;
    missing: string[];
    extra: string[];
    icuErrors: string[];
    localeQualityIssues: string[];
    identical: string[];
    placeholders: string[];
  }> = [];

  for (const locale of targetLocales) {
    const target = withoutMeta(
      flattenMessages(await loadMessages(messagesDir, locale)),
    );
    const targetKeys = Object.keys(target).sort();
    const targetKeySet = new Set(targetKeys);
    const placeholderPrefix = `[${locale}] `;

    const missing = sourceKeys.filter((key) => !targetKeySet.has(key));
    const extra = targetKeys.filter((key) => !sourceKeySet.has(key));
    const icuErrors = findIcuErrors(source, target);
    const localeQualityIssues = findLocaleQualityIssues(locale, target);
    const identical = sourceKeys.filter(
      (key) =>
        target[key] === source[key] && !isExpectedIdentical(key, source[key]),
    );
    const placeholders = sourceKeys.filter((key) =>
      target[key]?.startsWith(placeholderPrefix),
    );

    rows.push({
      locale,
      missing,
      extra,
      icuErrors,
      localeQualityIssues,
      identical,
      placeholders,
    });
  }

  if (markdownReport) {
    await writeFile(markdownReport, buildMarkdownReport(rows));
  }

  if (verifyMarkdownReport) {
    const expectedReport = buildMarkdownReport(rows);
    const actualReport = await readFile(verifyMarkdownReport, "utf8").catch(
      () => "",
    );

    if (
      normalizeMarkdownReport(actualReport) !==
      normalizeMarkdownReport(expectedReport)
    ) {
      console.error(
        `Markdown placeholder report is stale: ${verifyMarkdownReport}`,
      );
      console.error(
        `Run \`pnpm --filter @slothing/web check:translations --markdown-report=${verifyMarkdownReport}\` and review the diff.`,
      );
      process.exitCode = 1;
      return;
    }
  }

  console.error("## Translation Drift Check");
  console.error("");
  console.error(
    "| Locale | Missing | Extra | ICU errors | Locale quality issues | Identical-to-en warnings | Placeholders |",
  );
  console.error("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const row of rows) {
    console.error(
      `| ${row.locale} | ${row.missing.length} | ${row.extra.length} | ${row.icuErrors.length} | ${row.localeQualityIssues.length} | ${row.identical.length} | ${row.placeholders.length} |`,
    );
  }
  console.error("");

  for (const row of rows) {
    if (
      row.missing.length === 0 &&
      row.extra.length === 0 &&
      row.icuErrors.length === 0 &&
      row.localeQualityIssues.length === 0 &&
      row.identical.length === 0 &&
      row.placeholders.length === 0
    ) {
      continue;
    }

    console.error(`### ${row.locale}`);
    console.error(`- Missing: ${renderKeyList(row.missing)}`);
    console.error(`- Extra: ${renderKeyList(row.extra)}`);
    console.error(`- ICU errors: ${renderKeyList(row.icuErrors)}`);
    console.error(
      `- Locale quality issues: ${renderKeyList(row.localeQualityIssues)}`,
    );
    console.error(
      `- Identical-to-en warnings: ${renderKeyList(row.identical)}`,
    );
    console.error(
      `- Placeholders (\`[${row.locale}] …\`): ${row.placeholders.length} (warn-only outside release mode)`,
    );
    console.error("");
  }

  const hasDrift = rows.some(
    (row) =>
      row.missing.length > 0 ||
      row.extra.length > 0 ||
      row.icuErrors.length > 0 ||
      row.localeQualityIssues.length > 0,
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
    if (strictIdentical) {
      process.exitCode = 1;
    }
  }

  const placeholderCount = rows.reduce(
    (total, row) => total + row.placeholders.length,
    0,
  );
  if (placeholderCount > 0) {
    console.error(
      `${placeholderCount} placeholder string(s) (\`[locale] …\`) remain across locales. Run \`pnpm translate:messages\` and review the output to clear these.`,
    );
    if (strictPlaceholders) {
      process.exitCode = 1;
    }
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
