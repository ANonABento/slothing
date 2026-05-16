#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const CSS_EXTENSIONS = new Set([".css", ".scss", ".sass"]);
const SCAN_ROOTS = ["src"];

// Skip the script directory itself — otherwise this script's own regex
// strings (e.g. `rounded-[8px]` in error messages) would be flagged.
// next/og (Satori) renders from inline JSX styles and cannot read CSS
// variables, Tailwind classes, or app stylesheets, so OG image route files
// and the shared OG template helpers are exempt from the radius checks.
const EXEMPT_PATH_PATTERNS = [
  /(^|\/)scripts\//,
  /\.test\.(?:js|jsx|ts|tsx)$/,
  /^src\/app\/(?:.*\/)?opengraph-image\.tsx$/,
  /^src\/app\/(?:.*\/)?twitter-image\.tsx$/,
  /^src\/lib\/og\//,
];

// CSS files where raw `border-radius:` declarations are allowed —
// these are the canonical token definitions and theme presets.
const CSS_ALLOWLIST_PATTERNS = [
  /^src\/app\/globals\.css$/,
  /^src\/lib\/theme\//,
  /^src\/styles\//,
];

// Canonical Tailwind radius utilities mapped to `--r-*` tokens via
// tailwind.config.ts. These are the allowed surface and must not be
// flagged by the bracket-arbitrary scanner below.
const ALLOWED_TAILWIND_RADIUS_BASES = new Set([
  "rounded",
  "rounded-none",
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-3xl",
  "rounded-full",
]);

// Matches `rounded` and any of its side/corner variants followed by an
// arbitrary `[…]` value. The optional corner group covers the full set:
// t, r, b, l, tl, tr, bl, br, x, y, s, e, ss, se, es, ee.
const ARBITRARY_RADIUS_PATTERN =
  /rounded(?:-(?:tl|tr|bl|br|ss|se|es|ee|t|r|b|l|x|y|s|e))?-\[[^\]]+\]/;

const CLASS_HELPER_CALL_PATTERN = /\b(?:cn|clsx|cva)\s*\(/g;
const STRING_LITERAL_PATTERN =
  /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/gms;

function getBaseTailwindClass(className) {
  let bracketDepth = 0;
  let baseStart = 0;

  for (let index = 0; index < className.length; index += 1) {
    const char = className[index];

    if (char === "[") {
      bracketDepth += 1;
      continue;
    }

    if (char === "]") {
      bracketDepth = Math.max(bracketDepth - 1, 0);
      continue;
    }

    if (char === ":" && bracketDepth === 0) {
      baseStart = index + 1;
    }
  }

  return className.slice(baseStart).replace(/^!/, "");
}

function isForbiddenRadiusClass(className) {
  const baseClassName = getBaseTailwindClass(className);

  if (ALLOWED_TAILWIND_RADIUS_BASES.has(baseClassName)) {
    return false;
  }

  return ARBITRARY_RADIUS_PATTERN.test(baseClassName);
}

function isAllowedInlineRadiusValue(value) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "" || normalized === "inherit" || normalized === "unset") {
    return true;
  }

  if (normalized.includes("var(--")) {
    return true;
  }

  // Bare-zero numerics: `0`, `0px`, `0rem`, `0%`, `0 0 0 0`, etc. Anything
  // composed only of zeros, whitespace, and CSS units counts.
  if (/^(?:0(?:px|rem|em|%)?\s*)+$/.test(normalized)) {
    return true;
  }

  return false;
}

function lineAndColumnForIndex(source, index) {
  const before = source.slice(0, index);
  const lines = before.split(/\r?\n/);

  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function addClassViolations(violations, source, filePath, classValue, index) {
  for (const className of classValue.split(/\s+/).filter(Boolean)) {
    if (!isForbiddenRadiusClass(className)) {
      continue;
    }

    const classIndex = source.indexOf(className, index);
    violations.push({
      filePath,
      ...lineAndColumnForIndex(source, classIndex >= 0 ? classIndex : index),
      value: className,
      kind: "className",
      message: `Forbidden arbitrary radius utility "${className}". Use a token-backed class (rounded-sm/md/lg/xl/2xl/3xl/full) or a CSS variable.`,
    });
  }
}

function findClosingParenIndex(source, openParenIndex) {
  let depth = 1;
  let quote = null;
  let escaped = false;

  for (let index = openParenIndex + 1; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "(") {
      depth += 1;
      continue;
    }

    if (char !== ")") {
      continue;
    }

    depth -= 1;

    if (depth === 0) {
      return index;
    }
  }

  return -1;
}

function findClassNameViolations(source, filePath) {
  const violations = [];
  const staticClassPattern =
    /\bclassName\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\})/gms;

  for (const match of source.matchAll(staticClassPattern)) {
    const classValue =
      match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5] ?? match[6] ?? "";

    addClassViolations(violations, source, filePath, classValue, match.index);
  }

  for (const match of source.matchAll(CLASS_HELPER_CALL_PATTERN)) {
    const openParenIndex = source.indexOf("(", match.index);
    const closeParenIndex = findClosingParenIndex(source, openParenIndex);

    if (closeParenIndex === -1) {
      continue;
    }

    const callBody = source.slice(openParenIndex + 1, closeParenIndex);

    for (const stringMatch of callBody.matchAll(STRING_LITERAL_PATTERN)) {
      const classValue =
        stringMatch[1] ?? stringMatch[2] ?? stringMatch[3] ?? "";
      addClassViolations(
        violations,
        source,
        filePath,
        classValue,
        openParenIndex + 1 + stringMatch.index,
      );
    }
  }

  return violations;
}

function findInlineStyleViolations(source, filePath) {
  const violations = [];
  const stylePattern = /\bstyle\s*=\s*\{\s*\{([\s\S]*?)\}\s*\}/gms;

  for (const match of source.matchAll(stylePattern)) {
    const styleBody = match[1] ?? "";

    // Match `borderRadius: '…'` / `borderRadius: "…"` / `borderRadius: 0`
    // The two capturing branches cover string literals and bare numerics.
    const propPattern =
      /\bborderRadius\s*:\s*(?:(['"])([^'"]*)\1|([+-]?\d+(?:\.\d+)?))/gms;

    for (const propMatch of styleBody.matchAll(propPattern)) {
      const rawValue = propMatch[2] ?? propMatch[3] ?? "";

      if (isAllowedInlineRadiusValue(rawValue)) {
        continue;
      }

      const valueIndex = match.index + propMatch.index;
      violations.push({
        filePath,
        ...lineAndColumnForIndex(source, valueIndex),
        value: `borderRadius: ${propMatch[1] ? `"${rawValue}"` : rawValue}`,
        kind: "inline",
        message: `Forbidden inline borderRadius literal "${rawValue}". Use var(--r-*) or a Tailwind radius utility.`,
      });
    }
  }

  return violations;
}

function findCssViolations(source, filePath) {
  if (CSS_ALLOWLIST_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return [];
  }

  const violations = [];
  // Strip /* … */ comments to avoid flagging commented-out rules.
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, (block) =>
    block.replace(/[^\n]/g, " "),
  );

  const propPattern = /(^|[^\w-])border-radius\s*:\s*([^;{}]+)/gms;

  for (const match of stripped.matchAll(propPattern)) {
    const rawValue = (match[2] ?? "").trim();

    if (isAllowedInlineRadiusValue(rawValue)) {
      continue;
    }

    const valueIndex = match.index + (match[1]?.length ?? 0);
    violations.push({
      filePath,
      ...lineAndColumnForIndex(source, valueIndex),
      value: `border-radius: ${rawValue}`,
      kind: "css",
      message: `Forbidden raw border-radius "${rawValue}" in CSS. Define a token in globals.css or use var(--r-*).`,
    });
  }

  return violations;
}

function isExemptPath(filePath) {
  return EXEMPT_PATH_PATTERNS.some((pattern) => pattern.test(filePath));
}

function findForbiddenRadiusViolations(source, filePath) {
  if (isExemptPath(filePath)) {
    return [];
  }

  const ext = path.extname(filePath).toLowerCase();

  if (CSS_EXTENSIONS.has(ext)) {
    return findCssViolations(source, filePath).sort(
      (a, b) => a.line - b.line || a.column - b.column,
    );
  }

  if (SOURCE_EXTENSIONS.has(ext)) {
    return [
      ...findClassNameViolations(source, filePath),
      ...findInlineStyleViolations(source, filePath),
    ].sort((a, b) => a.line - b.line || a.column - b.column);
  }

  return [];
}

function listScanFiles(rootDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();

      if (SOURCE_EXTENSIONS.has(ext) || CSS_EXTENSIONS.has(ext)) {
        files.push(entryPath);
      }
    }
  }

  walk(rootDir);
  return files;
}

function runForbiddenRadiusLint({
  cwd = process.cwd(),
  roots = SCAN_ROOTS,
} = {}) {
  const violations = [];

  for (const root of roots) {
    const absoluteRoot = path.resolve(cwd, root);

    if (!fs.existsSync(absoluteRoot)) {
      continue;
    }

    for (const filePath of listScanFiles(absoluteRoot)) {
      const source = fs.readFileSync(filePath, "utf8");
      const relativePath = path
        .relative(cwd, filePath)
        .split(path.sep)
        .join("/");

      violations.push(...findForbiddenRadiusViolations(source, relativePath));
    }
  }

  return violations;
}

function formatViolation(violation) {
  return `${violation.filePath}:${violation.line}:${violation.column} ${violation.message}`;
}

if (require.main === module) {
  const violations = runForbiddenRadiusLint();

  if (violations.length > 0) {
    console.error(
      `Forbidden radius lint failed with ${violations.length} violation(s):`,
    );
    for (const violation of violations) {
      console.error(formatViolation(violation));
    }
    process.exit(1);
  }
}

module.exports = {
  findForbiddenRadiusViolations,
  isExemptPath,
  isForbiddenRadiusClass,
  isAllowedInlineRadiusValue,
  runForbiddenRadiusLint,
};
