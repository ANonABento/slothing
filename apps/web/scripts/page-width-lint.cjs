#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const SCAN_ROOTS = ["src/app/[locale]/(app)", "src/app/(app)"].filter(
  (scanRoot) => fs.existsSync(scanRoot),
);
const PAGE_FILE = "page.tsx";
const ALLOW_DIRECTIVE = "page-width-lint-allow";
const FORBIDDEN_WIDTH_PATTERN = /width\s*=\s*["']narrow["']/g;
const HINT =
  'Use the default wide page width, or apply max-w-prose locally to text sections. See docs/page-width.md.';

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(filePath, files);
      continue;
    }
    if (entry.name === PAGE_FILE) {
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

function lineForIndex(source, index) {
  const lineStart = source.lastIndexOf("\n", index) + 1;
  const lineEnd = source.indexOf("\n", index);
  return source.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
}

const violations = [];

for (const filePath of SCAN_ROOTS.flatMap((scanRoot) => walk(scanRoot))) {
  const relativePath = filePath.split(path.sep).join("/");
  const source = fs.readFileSync(filePath, "utf8");

  for (const match of source.matchAll(FORBIDDEN_WIDTH_PATTERN)) {
    if (lineForIndex(source, match.index).includes(ALLOW_DIRECTIVE)) {
      continue;
    }

    violations.push({
      filePath: relativePath,
      ...lineAndColumnForIndex(source, match.index),
      value: match[0],
    });
  }
}

if (violations.length > 0) {
  console.error("Unexpected narrow app page widths found:");
  for (const violation of violations) {
    console.error(
      `${violation.filePath}:${violation.line}:${violation.column} ${violation.value} - ${HINT}`,
    );
  }
  process.exit(1);
}
