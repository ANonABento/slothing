#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
const SCAN_ROOTS = ["src"];

const ALLOWED_FILES = new Set([
  "src/app/(app)/calendar/page.tsx",
  "src/app/(app)/opportunities/utils.ts",
  "src/app/api/analytics/export/route.ts",
  "src/app/api/extension/auth/route.ts",
  "src/app/api/google/calendar/events/route.ts",
  "src/components/jobs/job-kanban-utils.ts",
  "src/lib/analytics/time-series.ts",
  "src/lib/format/time.ts",
  "src/lib/google/calendar.ts",
  "src/lib/google/gmail.ts",
]);

const FORBIDDEN_PATTERNS = [
  {
    pattern: /\bnew Date\(/g,
    hint: "Use parseToDate(), nowDate(), addDays(), or addMinutes() from @/lib/format/time.",
  },
  {
    pattern: /\bDate\.now\(\)/g,
    hint: "Use nowEpoch() from @/lib/format/time.",
  },
  {
    pattern: /\.toISOString\(\)/g,
    hint: "Use toIso(), toNullableIso(), nowIso(), or formatIsoDateOnly() from @/lib/format/time.",
  },
  {
    pattern: /\.toLocale(?:Date|Time)?String\(/g,
    hint: "Use formatAbsolute(), formatDateOnly(), or formatTimeOnly() from @/lib/format/time.",
  },
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(filePath, files);
      continue;
    }
    if (SOURCE_EXTENSIONS.has(path.extname(filePath))) {
      files.push(filePath);
    }
  }
  return files;
}

function lineAndColumnForIndex(source, index) {
  const before = source.slice(0, index);
  const lines = before.split(/\r?\n/);
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

const violations = [];

for (const root of SCAN_ROOTS) {
  for (const filePath of walk(root)) {
    const relativePath = filePath.split(path.sep).join("/");
    if (
      ALLOWED_FILES.has(relativePath) ||
      /\.test\.tsx?$/.test(relativePath)
    ) {
      continue;
    }

    const source = fs.readFileSync(filePath, "utf8");
    for (const { pattern, hint } of FORBIDDEN_PATTERNS) {
      for (const match of source.matchAll(pattern)) {
        violations.push({
          filePath: relativePath,
          ...lineAndColumnForIndex(source, match.index),
          value: match[0],
          hint,
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Forbidden ad-hoc time/date usage found:");
  for (const violation of violations) {
    console.error(
      `${violation.filePath}:${violation.line}:${violation.column} ${violation.value} - ${violation.hint}`,
    );
  }
  process.exit(1);
}
