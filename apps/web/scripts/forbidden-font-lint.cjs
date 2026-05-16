#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const CSS_EXTENSIONS = new Set([".css"]);
const SCAN_ROOTS = ["src"];

// CSS files allowed to declare raw font-family — these are the source-of-truth
// stylesheets that define the token-backed font stack. Paths use forward
// slashes and are matched as case-sensitive substrings against the relative
// (workspace-rooted) file path.
const CSS_ALLOWLIST_PATTERNS = [
  /^src\/app\/globals\.css$/,
  /^src\/lib\/theme\//,
  /^src\/styles\//,
];

// next/og (Satori) renders from inline JSX styles and cannot read CSS
// variables, Tailwind classes, or app stylesheets, so OG image route files
// and the shared OG template helpers are exempt from the font-family checks.
// Mirrors the EXEMPT_PATH_PATTERNS list in forbidden-color-lint.cjs.
const EXEMPT_PATH_PATTERNS = [
  /^src\/app\/(?:.*\/)?opengraph-image\.tsx$/,
  /^src\/app\/(?:.*\/)?twitter-image\.tsx$/,
  /^src\/lib\/og\//,
];

// Forbidden Tailwind font-family utilities. Only `font-sans` and `font-serif`
// bypass the token stack — `font-display`, `font-body`, and `font-mono` are
// allowed because they map onto editorial tokens.
const FORBIDDEN_FAMILY_CLASSES = new Set(["font-sans", "font-serif"]);

// Strict pattern: `font-sans` or `font-serif` as a whole token (no trailing
// hyphenated weight names). `(?![-\w])` rejects `font-sansation` and similar
// while leaving `font-medium`, `font-semibold`, `font-bold`, `font-mono`,
// `font-display`, `font-body` untouched.
const FORBIDDEN_FAMILY_CLASS_PATTERN = /(?<![-\w])font-(?:sans|serif)(?![-\w])/g;

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

function isForbiddenFontClass(className) {
  const baseClassName = getBaseTailwindClass(className);
  return FORBIDDEN_FAMILY_CLASSES.has(baseClassName);
}

function isAllowedFontFamilyValue(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "inherit" || normalized === "initial" || normalized === "unset") {
    return true;
  }
  if (normalized === "") {
    return true;
  }
  return normalized.includes("var(--");
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
    if (!isForbiddenFontClass(className)) {
      continue;
    }

    const classIndex = source.indexOf(className, index);
    violations.push({
      filePath,
      ...lineAndColumnForIndex(source, classIndex >= 0 ? classIndex : index),
      value: className,
      kind: "className",
      message: `Forbidden font-family utility "${className}". Use font-display, font-body, or font-mono.`,
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

function findInlineFontFamilyViolations(source, filePath) {
  const violations = [];
  const stylePattern = /\bstyle\s*=\s*\{\s*\{([\s\S]*?)\}\s*\}/gms;

  for (const match of source.matchAll(stylePattern)) {
    const styleBody = match[1] ?? "";
    const propPattern = /\bfontFamily\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/gms;

    for (const propMatch of styleBody.matchAll(propPattern)) {
      const value = propMatch[2] ?? "";

      if (isAllowedFontFamilyValue(value)) {
        continue;
      }

      const valueIndex = match.index + propMatch.index;
      violations.push({
        filePath,
        ...lineAndColumnForIndex(source, valueIndex),
        value: `fontFamily: "${value}"`,
        kind: "inline",
        message: `Forbidden inline fontFamily literal "${value}". Use var(--font-display|--font-body|--font-mono) or inherit.`,
      });
    }
  }

  return violations;
}

function findCssFontFamilyViolations(source, filePath) {
  if (isCssAllowed(filePath)) {
    return [];
  }

  const violations = [];
  const pattern = /font-family\s*:\s*([^;}\n]+)/gi;

  for (const match of source.matchAll(pattern)) {
    const rawValue = (match[1] ?? "").trim();
    if (isAllowedFontFamilyValue(rawValue)) {
      continue;
    }

    violations.push({
      filePath,
      ...lineAndColumnForIndex(source, match.index),
      value: `font-family: ${rawValue}`,
      kind: "css",
      message: `Forbidden raw font-family declaration "${rawValue}". Declare font stacks in src/app/globals.css or src/lib/theme/.`,
    });
  }

  return violations;
}

function isCssAllowed(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  return CSS_ALLOWLIST_PATTERNS.some((pattern) => pattern.test(normalized));
}

function isScriptsPath(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  return /(?:^|\/)scripts\//.test(normalized);
}

function isExemptPath(filePath) {
  const normalized = filePath.split(path.sep).join("/");
  return EXEMPT_PATH_PATTERNS.some((pattern) => pattern.test(normalized));
}

function findForbiddenFontViolations(source, filePath) {
  const ext = path.extname(filePath);

  if (CSS_EXTENSIONS.has(ext)) {
    return findCssFontFamilyViolations(source, filePath).sort(
      (a, b) => a.line - b.line || a.column - b.column,
    );
  }

  if (!SOURCE_EXTENSIONS.has(ext)) {
    return [];
  }

  if (isExemptPath(filePath)) {
    return [];
  }

  return [
    ...findClassNameViolations(source, filePath),
    ...findInlineFontFamilyViolations(source, filePath),
  ].sort((a, b) => a.line - b.line || a.column - b.column);
}

function listScanFiles(rootDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "scripts") {
          continue;
        }
        walk(entryPath);
        continue;
      }

      const ext = path.extname(entry.name);
      if (SOURCE_EXTENSIONS.has(ext) || CSS_EXTENSIONS.has(ext)) {
        files.push(entryPath);
      }
    }
  }

  walk(rootDir);
  return files;
}

function runForbiddenFontLint({
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
      const relativePath = path.relative(cwd, filePath);

      if (isScriptsPath(relativePath)) {
        continue;
      }

      const source = fs.readFileSync(filePath, "utf8");
      violations.push(...findForbiddenFontViolations(source, relativePath));
    }
  }

  return violations;
}

function formatViolation(violation) {
  return `${violation.filePath}:${violation.line}:${violation.column} ${violation.message}`;
}

if (require.main === module) {
  const violations = runForbiddenFontLint();

  if (violations.length > 0) {
    console.error(
      `Forbidden font lint failed with ${violations.length} violation(s):`,
    );
    for (const violation of violations) {
      console.error(formatViolation(violation));
    }
    process.exit(1);
  }
}

module.exports = {
  findForbiddenFontViolations,
  isCssAllowed,
  isExemptPath,
  isForbiddenFontClass,
  isAllowedFontFamilyValue,
  runForbiddenFontLint,
};
