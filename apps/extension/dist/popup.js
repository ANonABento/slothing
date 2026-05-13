"use strict";
(self["webpackChunk_slothing_extension"] = self["webpackChunk_slothing_extension"] || []).push([[887],{

/***/ 997
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;


var m = __webpack_require__(316);
if (true) {
  exports.H = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else // removed by dead control flow
{ var i; }


/***/ },

/***/ 921
(__unused_webpack_module, exports, __webpack_require__) {

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=__webpack_require__(155),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l;exports.jsx=q;exports.jsxs=q;


/***/ },

/***/ 723
(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(921);
} else // removed by dead control flow
{}


/***/ },

/***/ 990
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(723);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var react = __webpack_require__(155);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js
var client = __webpack_require__(997);
;// ../../packages/shared/src/formatters/index.ts
const DEFAULT_LOCALE = "en-US";
const NUMERIC_PARTS_LOCALE = (/* unused pure expression or super */ null && (`${DEFAULT_LOCALE}-u-nu-latn`));
const LOCALE_COOKIE_NAME = "taida_locale";
const LOCALE_CHANGE_EVENT = "taida:locale-change";
const SUPPORTED_LOCALES = [
    { value: "en-US", label: "English (US)" },
    { value: "en-CA", label: "English (CA)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "zh-CN", label: "Chinese (Simplified)" },
    { value: "pt", label: "Portuguese" },
    { value: "pt-BR", label: "Portuguese (Brazil)" },
    { value: "hi", label: "Hindi" },
    { value: "ko", label: "Korean" },
];
function normalizeLocale(locale) {
    if (!locale)
        return DEFAULT_LOCALE;
    const supported = SUPPORTED_LOCALES.find((candidate) => candidate.value.toLowerCase() === locale.toLowerCase() ||
        candidate.value.split("-")[0].toLowerCase() === locale.toLowerCase());
    return supported?.value ?? DEFAULT_LOCALE;
}
function nowIso() {
    return new Date().toISOString();
}
function nowDate() {
    return new Date();
}
function nowEpoch() {
    return Date.now();
}
function parseToDate(value) {
    if (value === null || value === undefined || value === "")
        return null;
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}
function toIso(value) {
    const date = parseToDate(value);
    if (!date) {
        throw new TypeError("Expected a valid date value");
    }
    return date.toISOString();
}
function toNullableIso(value) {
    return parseToDate(value)?.toISOString() ?? null;
}
function toEpoch(value) {
    const date = parseToDate(value);
    if (!date) {
        throw new TypeError("Expected a valid date value");
    }
    return date.getTime();
}
function toNullableEpoch(value) {
    return parseToDate(value)?.getTime() ?? null;
}
function getUserTimezone() {
    if (typeof Intl === "undefined")
        return "UTC";
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
    catch {
        return "UTC";
    }
}
function getDisplayTimezone(timeZone) {
    if (timeZone)
        return timeZone;
    return typeof window === "undefined" ? "UTC" : getUserTimezone();
}
function formatAbsolute(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "Unknown date";
    const includeTime = opts.includeTime ?? true;
    const formatter = new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
        timeZone: getDisplayTimezone(opts.timeZone),
    });
    const formatted = formatter.format(date);
    if (!includeTime)
        return formatted;
    const lastComma = formatted.lastIndexOf(",");
    if (lastComma === -1)
        return formatted;
    return `${formatted.slice(0, lastComma)} · ${formatted
        .slice(lastComma + 1)
        .trim()}`;
}
function formatRelative(value, opts = {}) {
    const date = parseToDate(value);
    const current = parseToDate(opts.now ?? nowIso());
    if (!date || !current) {
        return "Unknown date";
    }
    const diffMs = current.getTime() - date.getTime();
    const absMs = Math.abs(diffMs);
    const isFuture = diffMs < 0;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    if (absMs < minute)
        return "Just now";
    if (absMs < hour)
        return formatRelativeBucket(Math.floor(absMs / minute), "m", isFuture);
    if (absMs < day)
        return formatRelativeBucket(Math.floor(absMs / hour), "h", isFuture);
    if (absMs < 2 * day)
        return isFuture ? "Tomorrow" : "Yesterday";
    if (absMs < week)
        return formatRelativeBucket(Math.floor(absMs / day), "d", isFuture);
    if (absMs < month)
        return formatRelativeBucket(Math.floor(absMs / week), "w", isFuture);
    if (absMs < year)
        return formatRelativeBucket(Math.floor(absMs / month), "mo", isFuture);
    return formatRelativeBucket(Math.floor(absMs / year), "y", isFuture);
}
function formatDateOnly(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "Unknown date";
    return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: getDisplayTimezone(opts.timeZone),
    }).format(date);
}
function formatTimeOnly(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "Unknown time";
    return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        hour: "numeric",
        minute: "2-digit",
        timeZone: getDisplayTimezone(opts.timeZone),
    }).format(date);
}
function formatIsoDateOnly(value = nowIso()) {
    return toIso(parseToDate(value) ?? nowIso()).slice(0, 10);
}
function formatMonthYear(value, opts = {}) {
    const date = parseToDate(value);
    if (!date)
        return "";
    return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
        month: "short",
        year: "numeric",
        timeZone: getDisplayTimezone(opts.timeZone),
    }).format(date);
}
function isPast(value, now = nowIso()) {
    const date = parseToDate(value);
    const current = parseToDate(now);
    return Boolean(date && current && date.getTime() < current.getTime());
}
function isFuture(value, now = nowIso()) {
    const date = parseToDate(value);
    const current = parseToDate(now);
    return Boolean(date && current && date.getTime() > current.getTime());
}
function diffSeconds(a, b) {
    const first = parseToDate(a);
    const second = parseToDate(b);
    if (!first || !second)
        return Number.NaN;
    return Math.trunc((first.getTime() - second.getTime()) / 1000);
}
function diffDays(a, b) {
    const seconds = diffSeconds(a, b);
    return Number.isNaN(seconds) ? Number.NaN : seconds / 86400;
}
function addDays(value, days) {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    return new Date(date.getTime() + days * 86400000);
}
function addMinutes(value, minutes) {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    return new Date(date.getTime() + minutes * 60000);
}
function startOfDay(value, timeZone = "UTC") {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    if (timeZone === "UTC") {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    const parts = getZonedParts(date, timeZone);
    return zonedTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0, timeZone);
}
function endOfDay(value, timeZone = "UTC") {
    return addMinutes(addDays(startOfDay(value, timeZone), 1), -1 / 60000);
}
function toUserTz(value, timeZone = getUserTimezone()) {
    const date = parseToDate(value);
    if (!date)
        throw new TypeError("Expected a valid date value");
    const parts = getZonedParts(date, timeZone);
    return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}
function formatDateAbsolute(date, locale = DEFAULT_LOCALE) {
    return formatAbsolute(date, { locale });
}
function formatDateRelative(date, now = nowIso()) {
    return formatRelative(date, { now });
}
function getBrowserDefaultLocale() {
    if (typeof navigator === "undefined")
        return DEFAULT_LOCALE;
    return normalizeLocale(navigator.language);
}
function formatRelativeBucket(value, unit, isFuture) {
    return isFuture ? `in ${value}${unit}` : `${value}${unit} ago`;
}
function getZonedParts(date, timeZone) {
    const parts = new Intl.DateTimeFormat(NUMERIC_PARTS_LOCALE, {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);
    const get = (type) => Number(parts.find((part) => part.type === type)?.value);
    return {
        year: get("year"),
        month: get("month"),
        day: get("day"),
        hour: get("hour"),
        minute: get("minute"),
        second: get("second"),
    };
}
function zonedTimeToUtc(year, month, day, hour, minute, second, timeZone) {
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const parts = getZonedParts(utcGuess, timeZone);
    const offsetMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - utcGuess.getTime();
    return new Date(utcGuess.getTime() - offsetMs);
}

;// ../../packages/shared/src/scoring/constants.ts
const SUB_SCORE_MAX_POINTS = {
    sectionCompleteness: 10,
    actionVerbs: 15,
    quantifiedAchievements: 20,
    keywordMatch: 25,
    length: 10,
    spellingGrammar: 10,
    atsFriendliness: 10,
};
const ACTION_VERBS = [
    "achieved",
    "analyzed",
    "architected",
    "built",
    "collaborated",
    "created",
    "delivered",
    "designed",
    "developed",
    "drove",
    "improved",
    "increased",
    "launched",
    "led",
    "managed",
    "mentored",
    "optimized",
    "reduced",
    "resolved",
    "shipped",
    "streamlined",
    "supported",
    "transformed",
];
const QUANTIFIED_REGEX = /\d+%|\$[\d,]+(?:\.\d+)?[kKmMbB]?|\b\d+x\b|\bteam of \d+\b|\b\d+\s+(users|customers|clients|projects|people|engineers|reports|hours|members|countries|languages|states|cities|stores|partners|deals|leads)\b/gi;

;// ../../packages/shared/src/scoring/text.ts
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s/-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function wordBoundaryRegex(term, flags = "") {
    return new RegExp(`\\b${escapeRegExp(term)}\\b`, flags);
}
function containsWord(text, term) {
    return wordBoundaryRegex(term).test(text);
}
function countWordOccurrences(text, term) {
    return (text.match(wordBoundaryRegex(term, "g")) || []).length;
}
function getHighlights(profile) {
    return [
        ...profile.experiences.flatMap((experience) => experience.highlights),
        ...profile.projects.flatMap((project) => project.highlights),
    ].filter(Boolean);
}
function extractProfileText(profile) {
    const parts = [
        profile.contact?.name,
        profile.contact?.email,
        profile.contact?.phone,
        profile.contact?.location,
        profile.contact?.linkedin,
        profile.contact?.github,
        profile.contact?.website,
        profile.contact?.headline,
        profile.summary,
        ...profile.experiences.flatMap((experience) => [
            experience.title,
            experience.company,
            experience.location,
            experience.description,
            ...experience.highlights,
            ...experience.skills,
            experience.startDate,
            experience.endDate,
        ]),
        ...profile.education.flatMap((education) => [
            education.institution,
            education.degree,
            education.field,
            ...education.highlights,
            education.startDate,
            education.endDate,
        ]),
        ...profile.skills.map((skill) => skill.name),
        ...profile.projects.flatMap((project) => [
            project.name,
            project.description,
            project.url,
            ...project.highlights,
            ...project.technologies,
        ]),
        ...profile.certifications.flatMap((certification) => [
            certification.name,
            certification.issuer,
            certification.date,
            certification.url,
        ]),
    ];
    return parts.filter(Boolean).join("\n");
}
function getResumeText(profile, rawText) {
    return (rawText?.trim() || profile.rawText?.trim() || extractProfileText(profile));
}
function wordCount(text) {
    const normalized = normalizeText(text);
    if (!normalized)
        return 0;
    return normalized.split(/\s+/).filter(Boolean).length;
}

;// ../../packages/shared/src/scoring/action-verbs.ts


function pointsForDistinctVerbs(count) {
    if (count === 0)
        return 0;
    if (count <= 2)
        return 5;
    if (count <= 4)
        return 9;
    if (count <= 7)
        return 12;
    return 15;
}
function scoreActionVerbs(input) {
    const distinctVerbs = new Set();
    for (const highlight of getHighlights(input.profile)) {
        const firstWord = normalizeText(highlight).split(/\s+/)[0] ?? "";
        for (const verb of ACTION_VERBS) {
            if (wordBoundaryRegex(verb).test(firstWord)) {
                distinctVerbs.add(verb);
            }
        }
    }
    const verbs = Array.from(distinctVerbs).sort();
    const notes = verbs.length === 0
        ? ["Start achievement bullets with strong action verbs."]
        : [];
    const preview = verbs.slice(0, 5).join(", ");
    return {
        key: "actionVerbs",
        label: "Action verbs",
        earned: pointsForDistinctVerbs(verbs.length),
        maxPoints: SUB_SCORE_MAX_POINTS.actionVerbs,
        notes,
        evidence: [
            preview
                ? `${verbs.length} distinct action verbs (${preview})`
                : "0 distinct action verbs",
        ],
    };
}

;// ../../packages/shared/src/scoring/ats-characters.ts
const PROBLEMATIC_CHARACTERS = [
    { char: "\u2022", name: "bullet point", replacement: "-" },
    { char: "\u2013", name: "en dash", replacement: "-" },
    { char: "\u2014", name: "em dash", replacement: "-" },
    { char: "\u201c", name: "curly quote left", replacement: '"' },
    { char: "\u201d", name: "curly quote right", replacement: '"' },
    { char: "\u2018", name: "curly apostrophe left", replacement: "'" },
    { char: "\u2019", name: "curly apostrophe right", replacement: "'" },
    { char: "\u2026", name: "ellipsis", replacement: "..." },
    { char: "\u00a9", name: "copyright", replacement: "(c)" },
    { char: "\u00ae", name: "registered", replacement: "(R)" },
    { char: "\u2122", name: "trademark", replacement: "(TM)" },
];

;// ../../packages/shared/src/scoring/ats-friendliness.ts



function scoreAtsFriendliness(input) {
    const text = getResumeText(input.profile, input.rawText);
    const rawText = input.rawText ?? input.profile.rawText ?? "";
    const notes = [];
    const evidence = [];
    let deductions = 0;
    const foundProblematic = PROBLEMATIC_CHARACTERS.filter(({ char }) => text.includes(char));
    if (foundProblematic.length > 0) {
        const penalty = Math.min(3, foundProblematic.length);
        deductions += penalty;
        notes.push("Special formatting characters can reduce ATS parse quality.");
        evidence.push(`${foundProblematic.length} special characters`);
    }
    const badChars = (text.match(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
    if (badChars > 0) {
        deductions += 2;
        notes.push("Control or replacement characters detected.");
        evidence.push(`${badChars} control or replacement character(s)`);
    }
    if (rawText.includes("\t")) {
        deductions += 2;
        notes.push("Tab characters may indicate table-style formatting.");
        evidence.push("Tab characters found");
    }
    const longLines = rawText.split(/\r?\n/).filter((line) => line.length > 200);
    if (longLines.length >= 4) {
        deductions += 2;
        notes.push("Very long lines may indicate multi-column or table formatting.");
        evidence.push(`${longLines.length} over-long lines`);
    }
    if (/<[a-zA-Z/][^>]*>/.test(rawText)) {
        deductions += 2;
        notes.push("HTML tags detected in resume text.");
        evidence.push("HTML tags found");
    }
    if (!/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(text)) {
        deductions += 2;
        notes.push("No email pattern detected in parseable resume text.");
        evidence.push("No email detected");
    }
    if (input.rawText !== undefined &&
        input.rawText.trim().length < 200 &&
        input.profile.experiences.length > 0) {
        deductions += 3;
        notes.push("Extracted text is very short for a resume with experience.");
        evidence.push("Possible image-only PDF");
    }
    return {
        key: "atsFriendliness",
        label: "ATS friendliness",
        earned: Math.max(0, SUB_SCORE_MAX_POINTS.atsFriendliness - deductions),
        maxPoints: SUB_SCORE_MAX_POINTS.atsFriendliness,
        notes,
        evidence: evidence.length > 0 ? evidence : ["No ATS formatting issues detected."],
    };
}

;// ../../packages/shared/src/scoring/synonyms.ts
/**
 * Synonym groups for semantic keyword matching in ATS scoring.
 * Each group maps a canonical term to its synonyms/variations.
 * All terms should be lowercase.
 */
const SYNONYM_GROUPS = [
    // Programming Languages
    { canonical: "javascript", synonyms: ["js", "ecmascript", "es6", "es2015"] },
    { canonical: "typescript", synonyms: ["ts"] },
    { canonical: "python", synonyms: ["py", "python3"] },
    { canonical: "golang", synonyms: ["go"] },
    { canonical: "c#", synonyms: ["csharp", "c sharp", "dotnet", ".net"] },
    { canonical: "c++", synonyms: ["cpp", "cplusplus"] },
    { canonical: "ruby", synonyms: ["rb"] },
    { canonical: "kotlin", synonyms: ["kt"] },
    { canonical: "objective-c", synonyms: ["objc", "obj-c"] },
    // Frontend Frameworks
    { canonical: "react", synonyms: ["reactjs", "react.js", "react js"] },
    { canonical: "angular", synonyms: ["angularjs", "angular.js", "angular js"] },
    { canonical: "vue", synonyms: ["vuejs", "vue.js", "vue js"] },
    { canonical: "next.js", synonyms: ["nextjs", "next js", "next"] },
    { canonical: "nuxt", synonyms: ["nuxtjs", "nuxt.js"] },
    { canonical: "svelte", synonyms: ["sveltejs", "sveltekit"] },
    // Backend Frameworks
    { canonical: "node.js", synonyms: ["nodejs", "node js", "node"] },
    { canonical: "express", synonyms: ["expressjs", "express.js"] },
    { canonical: "django", synonyms: ["django rest framework", "drf"] },
    { canonical: "flask", synonyms: ["flask python"] },
    { canonical: "spring", synonyms: ["spring boot", "springboot"] },
    { canonical: "ruby on rails", synonyms: ["rails", "ror"] },
    { canonical: "fastapi", synonyms: ["fast api"] },
    // Databases
    { canonical: "postgresql", synonyms: ["postgres", "psql", "pg"] },
    { canonical: "mongodb", synonyms: ["mongo"] },
    { canonical: "mysql", synonyms: ["mariadb"] },
    { canonical: "dynamodb", synonyms: ["dynamo db", "dynamo"] },
    { canonical: "elasticsearch", synonyms: ["elastic search", "elastic", "es"] },
    { canonical: "redis", synonyms: ["redis cache"] },
    { canonical: "sql", synonyms: ["structured query language"] },
    { canonical: "nosql", synonyms: ["no sql", "non-relational"] },
    // Cloud & Infrastructure
    { canonical: "aws", synonyms: ["amazon web services", "amazon cloud"] },
    { canonical: "gcp", synonyms: ["google cloud", "google cloud platform"] },
    { canonical: "azure", synonyms: ["microsoft azure", "ms azure"] },
    { canonical: "docker", synonyms: ["containerization", "containers"] },
    { canonical: "kubernetes", synonyms: ["k8s", "kube"] },
    { canonical: "terraform", synonyms: ["infrastructure as code", "iac"] },
    {
        canonical: "ci/cd",
        synonyms: [
            "cicd",
            "ci cd",
            "continuous integration",
            "continuous deployment",
            "continuous delivery",
        ],
    },
    { canonical: "devops", synonyms: ["dev ops", "site reliability", "sre"] },
    // Tools & Platforms
    {
        canonical: "git",
        synonyms: ["github", "gitlab", "bitbucket", "version control"],
    },
    { canonical: "jira", synonyms: ["atlassian jira"] },
    { canonical: "figma", synonyms: ["figma design"] },
    { canonical: "webpack", synonyms: ["module bundler"] },
    { canonical: "graphql", synonyms: ["graph ql", "gql"] },
    {
        canonical: "rest api",
        synonyms: ["restful", "restful api", "rest", "api"],
    },
    // Role Terms
    {
        canonical: "frontend",
        synonyms: [
            "front-end",
            "front end",
            "client-side",
            "client side",
            "ui development",
        ],
    },
    {
        canonical: "backend",
        synonyms: ["back-end", "back end", "server-side", "server side"],
    },
    { canonical: "fullstack", synonyms: ["full-stack", "full stack"] },
    {
        canonical: "software engineer",
        synonyms: ["software developer", "swe", "developer", "programmer", "coder"],
    },
    {
        canonical: "data scientist",
        synonyms: ["data science", "ml engineer", "machine learning engineer"],
    },
    {
        canonical: "data engineer",
        synonyms: ["data engineering", "etl developer"],
    },
    { canonical: "product manager", synonyms: ["pm", "product owner", "po"] },
    {
        canonical: "qa engineer",
        synonyms: ["quality assurance", "qa", "test engineer", "sdet"],
    },
    {
        canonical: "ux designer",
        synonyms: ["ux", "user experience", "ui/ux", "ui ux"],
    },
    // Methodologies
    { canonical: "agile", synonyms: ["scrum", "kanban", "sprint", "sprints"] },
    {
        canonical: "tdd",
        synonyms: ["test driven development", "test-driven development"],
    },
    {
        canonical: "bdd",
        synonyms: ["behavior driven development", "behavior-driven development"],
    },
    {
        canonical: "microservices",
        synonyms: ["micro services", "micro-services", "service-oriented"],
    },
    // Soft Skills
    {
        canonical: "leadership",
        synonyms: [
            "led",
            "managed",
            "directed",
            "supervised",
            "mentored",
            "team lead",
        ],
    },
    {
        canonical: "communication",
        synonyms: ["communicated", "presented", "public speaking", "interpersonal"],
    },
    {
        canonical: "collaboration",
        synonyms: [
            "collaborated",
            "teamwork",
            "cross-functional",
            "cross functional",
        ],
    },
    {
        canonical: "problem solving",
        synonyms: ["problem-solving", "troubleshooting", "debugging", "analytical"],
    },
    {
        canonical: "project management",
        synonyms: [
            "project-management",
            "program management",
            "stakeholder management",
        ],
    },
    {
        canonical: "time management",
        synonyms: ["time-management", "prioritization", "organization"],
    },
    { canonical: "mentoring", synonyms: ["coaching", "training", "onboarding"] },
    // Data & ML
    {
        canonical: "machine learning",
        synonyms: ["ml", "deep learning", "dl", "ai", "artificial intelligence"],
    },
    {
        canonical: "nlp",
        synonyms: ["natural language processing", "text processing"],
    },
    {
        canonical: "computer vision",
        synonyms: ["cv", "image recognition", "image processing"],
    },
    { canonical: "tensorflow", synonyms: ["keras"] },
    { canonical: "pytorch", synonyms: ["torch"] },
    // Testing
    {
        canonical: "unit testing",
        synonyms: ["unit tests", "jest", "mocha", "vitest", "pytest"],
    },
    {
        canonical: "integration testing",
        synonyms: [
            "integration tests",
            "e2e testing",
            "end-to-end testing",
            "end to end",
        ],
    },
    {
        canonical: "automation testing",
        synonyms: [
            "test automation",
            "automated testing",
            "selenium",
            "cypress",
            "playwright",
        ],
    },
    // Security
    {
        canonical: "cybersecurity",
        synonyms: ["cyber security", "information security", "infosec"],
    },
    {
        canonical: "authentication",
        synonyms: ["auth", "oauth", "sso", "single sign-on"],
    },
    // Mobile
    { canonical: "ios", synonyms: ["swift", "apple development"] },
    { canonical: "android", synonyms: ["android development", "kotlin android"] },
    { canonical: "react native", synonyms: ["react-native", "rn"] },
    { canonical: "flutter", synonyms: ["dart"] },
    // Business & Analytics
    {
        canonical: "business intelligence",
        synonyms: ["bi", "tableau", "power bi", "looker"],
    },
    {
        canonical: "data analysis",
        synonyms: ["data analytics", "data analyst", "analytics"],
    },
    {
        canonical: "etl",
        synonyms: ["extract transform load", "data pipeline", "data pipelines"],
    },
];
/**
 * Builds a lookup map from any term (canonical or synonym) to
 * the set of all terms in the same group (including the canonical form).
 * All keys and values are lowercase.
 */
function buildSynonymLookup() {
    const lookup = new Map();
    for (const group of SYNONYM_GROUPS) {
        const allTerms = [group.canonical, ...group.synonyms];
        const termSet = new Set(allTerms);
        for (const term of allTerms) {
            const existing = lookup.get(term);
            if (existing) {
                // Merge sets if term appears in multiple groups
                termSet.forEach((t) => existing.add(t));
            }
            else {
                lookup.set(term, new Set(termSet));
            }
        }
    }
    return lookup;
}
const synonymLookup = buildSynonymLookup();
/**
 * Returns all synonyms for a given term (including the term itself).
 * Returns an empty array if no synonyms are found.
 */
function getSynonyms(term) {
    const normalized = term.toLowerCase().trim();
    const group = synonymLookup.get(normalized);
    if (!group)
        return [];
    return Array.from(group);
}
/**
 * Checks if two terms are synonyms of each other.
 */
function areSynonyms(termA, termB) {
    const normalizedA = termA.toLowerCase().trim();
    const normalizedB = termB.toLowerCase().trim();
    if (normalizedA === normalizedB)
        return true;
    const group = synonymLookup.get(normalizedA);
    return group ? group.has(normalizedB) : false;
}
/** Weight applied to synonym matches (vs 1.0 for exact matches) */
const SYNONYM_MATCH_WEIGHT = 0.8;

;// ../../packages/shared/src/scoring/keyword-match.ts



const STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "in",
    "of",
    "on",
    "or",
    "our",
    "the",
    "to",
    "we",
    "with",
    "you",
    "your",
]);
function tokenizeKeywords(text) {
    return normalizeText(text)
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}
function topTokens(text, limit) {
    const counts = new Map();
    for (const token of tokenizeKeywords(text)) {
        counts.set(token, (counts.get(token) ?? 0) + 1);
    }
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([token]) => token);
}
function buildKeywordSet(job) {
    const keywords = [
        ...job.keywords,
        ...job.requirements.flatMap(tokenizeKeywords),
        ...topTokens(job.description, 10),
    ];
    const normalized = keywords
        .map((keyword) => normalizeText(keyword))
        .filter((keyword) => keyword.length >= 2 && !STOP_WORDS.has(keyword));
    return Array.from(new Set(normalized)).slice(0, 24);
}
function scoreKeywordMatch(input) {
    if (!input.job) {
        return {
            key: "keywordMatch",
            label: "Keyword match",
            earned: 18,
            maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
            notes: ["No job description supplied; neutral baseline."],
            evidence: ["No job description supplied."],
        };
    }
    const keywords = buildKeywordSet(input.job);
    if (keywords.length === 0) {
        return {
            key: "keywordMatch",
            label: "Keyword match",
            earned: 18,
            maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
            notes: ["Job description has no usable keywords; neutral baseline."],
            evidence: ["0 keywords available."],
        };
    }
    const resumeText = normalizeText(getResumeText(input.profile, input.rawText));
    let weightedHits = 0;
    let exactHits = 0;
    let stuffing = false;
    for (const keyword of keywords) {
        const frequency = countWordOccurrences(resumeText, keyword);
        if (frequency > 10)
            stuffing = true;
        if (frequency > 0) {
            weightedHits += 1;
            exactHits += 1;
            continue;
        }
        const synonymHit = getSynonyms(keyword).some((synonym) => synonym !== keyword && containsWord(resumeText, synonym));
        if (synonymHit)
            weightedHits += SYNONYM_MATCH_WEIGHT;
    }
    const rawEarned = Math.round((weightedHits / keywords.length) * SUB_SCORE_MAX_POINTS.keywordMatch);
    const earned = Math.max(0, rawEarned - (stuffing ? 2 : 0));
    const notes = exactHits === keywords.length
        ? []
        : ["Add natural mentions of missing target job keywords."];
    if (stuffing)
        notes.push("Keyword stuffing detected; repeated terms too often.");
    return {
        key: "keywordMatch",
        label: "Keyword match",
        earned,
        maxPoints: SUB_SCORE_MAX_POINTS.keywordMatch,
        notes,
        evidence: [
            `${exactHits}/${keywords.length} keywords matched`,
            `${weightedHits.toFixed(1)}/${keywords.length} weighted keyword hits`,
        ],
    };
}

;// ../../packages/shared/src/scoring/length.ts


function pointsForWordCount(count) {
    if (count >= 400 && count <= 700)
        return 10;
    if ((count >= 300 && count <= 399) || (count >= 701 && count <= 900))
        return 7;
    if ((count >= 200 && count <= 299) || (count >= 901 && count <= 1100))
        return 4;
    if ((count >= 150 && count <= 199) || (count >= 1101 && count <= 1400)) {
        return 2;
    }
    return 0;
}
function scoreLength(input) {
    const count = wordCount(getResumeText(input.profile, input.rawText));
    const earned = pointsForWordCount(count);
    const notes = earned === SUB_SCORE_MAX_POINTS.length
        ? []
        : ["Resume length is outside the 400-700 word target band."];
    return {
        key: "length",
        label: "Length",
        earned,
        maxPoints: SUB_SCORE_MAX_POINTS.length,
        notes,
        evidence: [`${count} words`],
    };
}

;// ../../packages/shared/src/scoring/quantified-achievements.ts


function pointsForQuantifiedResults(count) {
    if (count === 0)
        return 0;
    if (count === 1)
        return 6;
    if (count === 2)
        return 12;
    if (count <= 4)
        return 16;
    return 20;
}
function scoreQuantifiedAchievements(input) {
    const text = getHighlights(input.profile).join("\n");
    const matches = Array.from(text.matchAll(QUANTIFIED_REGEX), (match) => match[0]);
    const notes = matches.length === 0
        ? ["Add metrics such as percentages, volume, team size, or revenue."]
        : [];
    return {
        key: "quantifiedAchievements",
        label: "Quantified achievements",
        earned: pointsForQuantifiedResults(matches.length),
        maxPoints: SUB_SCORE_MAX_POINTS.quantifiedAchievements,
        notes,
        evidence: [
            `${matches.length} quantified result(s)`,
            ...matches.slice(0, 3),
        ],
    };
}

;// ../../packages/shared/src/scoring/section-completeness.ts

function scoreSectionCompleteness(input) {
    const { profile } = input;
    const notes = [];
    const evidence = [];
    let earned = 0;
    let completeSections = 0;
    if (profile.contact.name?.trim()) {
        earned += 1;
    }
    else {
        notes.push("Missing contact name.");
    }
    if (profile.contact.email?.trim()) {
        earned += 1;
    }
    else {
        notes.push("Missing contact email.");
    }
    const summaryLength = profile.summary?.trim().length ?? 0;
    if (summaryLength >= 50 && summaryLength <= 500) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Summary should be between 50 and 500 characters.");
    }
    const hasExperience = profile.experiences.some((experience) => experience.title.trim() &&
        experience.company.trim() &&
        experience.startDate.trim());
    if (hasExperience) {
        earned += 2;
        completeSections += 1;
    }
    else {
        notes.push("Add at least one role with title, company, and start date.");
    }
    if (profile.education.length > 0) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Add at least one education entry.");
    }
    if (profile.skills.length >= 3) {
        earned += 2;
        completeSections += 1;
    }
    else if (profile.skills.length > 0) {
        earned += 1;
        notes.push("Add at least three skills.");
    }
    else {
        notes.push("Add a skills section.");
    }
    const hasHighlight = profile.experiences.some((experience) => experience.highlights.length > 0);
    if (hasHighlight) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Add achievement highlights to experience.");
    }
    const hasSecondaryContact = Boolean(profile.contact.phone?.trim() ||
        profile.contact.linkedin?.trim() ||
        profile.contact.location?.trim());
    if (hasSecondaryContact) {
        earned += 1;
        completeSections += 1;
    }
    else {
        notes.push("Add phone, LinkedIn, or location.");
    }
    if (profile.contact.name?.trim() && profile.contact.email?.trim()) {
        completeSections += 1;
    }
    evidence.push(`${completeSections}/7 sections complete`);
    return {
        key: "sectionCompleteness",
        label: "Section completeness",
        earned: Math.min(earned, SUB_SCORE_MAX_POINTS.sectionCompleteness),
        maxPoints: SUB_SCORE_MAX_POINTS.sectionCompleteness,
        notes,
        evidence,
    };
}

;// ../../packages/shared/src/scoring/spelling-grammar.ts


const REPEATED_WORD_EXCEPTIONS = new Set(["had had", "that that"]);
const ACRONYMS = new Set(["API", "AWS", "CSS", "GCP", "HTML", "SQL"]);
function hasVerbLikeToken(text) {
    const words = normalizeText(text).split(/\s+/).filter(Boolean);
    return words.some((word) => ACTION_VERBS.includes(word) ||
        /(?:ed|ing|s)$/.test(word));
}
function scoreSpellingGrammar(input) {
    const highlights = getHighlights(input.profile);
    const text = highlights.join("\n");
    const notes = [];
    const evidence = [];
    let deductions = 0;
    const repeated = Array.from(text.matchAll(/\b(\w+)\s+\1\b/gi), (match) => match[0]).filter((match) => !REPEATED_WORD_EXCEPTIONS.has(match.toLowerCase()));
    if (repeated.length > 0) {
        const penalty = Math.min(2, repeated.length);
        deductions += penalty;
        notes.push("Repeated adjacent words detected.");
        evidence.push(`Repeated word: ${repeated[0]}`);
    }
    if (/  +/.test(text)) {
        deductions += 1;
        notes.push("Multiple spaces between words detected.");
        evidence.push("Multiple spaces found.");
    }
    const lowercaseStarts = highlights.filter((highlight) => /^[a-z]/.test(highlight.trim()));
    if (lowercaseStarts.length > 0) {
        const penalty = Math.min(3, lowercaseStarts.length);
        deductions += penalty;
        notes.push("Some highlights start with lowercase letters.");
        evidence.push(`Lowercase start: ${lowercaseStarts[0]}`);
    }
    const fragments = highlights.filter((highlight) => highlight.length > 40 && !hasVerbLikeToken(highlight));
    if (fragments.length > 0) {
        const penalty = Math.min(2, fragments.length);
        deductions += penalty;
        notes.push("Some long highlights may read like sentence fragments.");
        evidence.push(`Possible fragment: ${fragments[0]}`);
    }
    const punctuationEndings = highlights.filter((highlight) => /\.$/.test(highlight.trim())).length;
    if (highlights.length > 1) {
        const rate = punctuationEndings / highlights.length;
        if (rate > 0.3 && rate < 0.7) {
            deductions += 1;
            notes.push("Trailing punctuation is inconsistent across highlights.");
            evidence.push(`${punctuationEndings}/${highlights.length} highlights end with periods.`);
        }
    }
    const allCaps = Array.from(text.matchAll(/\b[A-Z]{4,}\b/g), (match) => match[0]).filter((word) => !ACRONYMS.has(word));
    if (allCaps.length > 5) {
        deductions += 1;
        notes.push("Excessive all-caps words detected.");
        evidence.push(`All-caps words: ${allCaps.slice(0, 3).join(", ")}`);
    }
    return {
        key: "spellingGrammar",
        label: "Spelling and grammar",
        earned: Math.max(0, SUB_SCORE_MAX_POINTS.spellingGrammar - deductions),
        maxPoints: SUB_SCORE_MAX_POINTS.spellingGrammar,
        notes,
        evidence: evidence.length > 0 ? evidence : ["No heuristic issues detected."],
    };
}

;// ../../packages/shared/src/scoring/index.ts








function scoreResume(input) {
    const subScores = {
        sectionCompleteness: scoreSectionCompleteness(input),
        actionVerbs: scoreActionVerbs(input),
        quantifiedAchievements: scoreQuantifiedAchievements(input),
        keywordMatch: scoreKeywordMatch(input),
        length: scoreLength(input),
        spellingGrammar: scoreSpellingGrammar(input),
        atsFriendliness: scoreAtsFriendliness(input),
    };
    const overall = Object.values(subScores).reduce((sum, subScore) => sum + subScore.earned, 0);
    return {
        overall: Math.max(0, Math.min(100, Math.round(overall))),
        subScores,
        generatedAt: nowIso(),
    };
}








;// ./src/shared/messages.ts
// Message passing utilities for extension communication
// Type-safe message creators
const Messages = {
    // Auth messages
    getAuthStatus: () => ({ type: "GET_AUTH_STATUS" }),
    openAuth: () => ({ type: "OPEN_AUTH" }),
    logout: () => ({ type: "LOGOUT" }),
    // Profile messages
    getProfile: () => ({ type: "GET_PROFILE" }),
    getSettings: () => ({ type: "GET_SETTINGS" }),
    // Form filling messages
    fillForm: (fields) => ({
        type: "FILL_FORM",
        payload: fields,
    }),
    // Scraping messages
    scrapeJob: () => ({ type: "SCRAPE_JOB" }),
    scrapeJobList: () => ({ type: "SCRAPE_JOB_LIST" }),
    importJob: (job) => ({
        type: "IMPORT_JOB",
        payload: job,
    }),
    importJobsBatch: (jobs) => ({
        type: "IMPORT_JOBS_BATCH",
        payload: jobs,
    }),
    trackApplied: (payload) => ({
        type: "TRACK_APPLIED",
        payload,
    }),
    openDashboard: () => ({ type: "OPEN_DASHBOARD" }),
    captureVisibleTab: () => ({ type: "CAPTURE_VISIBLE_TAB" }),
    tailorFromPage: (job, baseResumeId) => ({
        type: "TAILOR_FROM_PAGE",
        payload: { job, baseResumeId },
    }),
    generateCoverLetterFromPage: (job) => ({
        type: "GENERATE_COVER_LETTER_FROM_PAGE",
        payload: job,
    }),
    /** #34 — fetch the user's recently-saved tailored resumes for the picker. */
    listResumes: () => ({ type: "LIST_RESUMES" }),
    // Learning messages
    saveAnswer: (data) => ({
        type: "SAVE_ANSWER",
        payload: data,
    }),
    searchAnswers: (question) => ({
        type: "SEARCH_ANSWERS",
        payload: question,
    }),
    matchAnswerBank: (payload) => ({
        type: "MATCH_ANSWER_BANK",
        payload,
    }),
    jobDetected: (meta) => ({
        type: "JOB_DETECTED",
        payload: meta,
    }),
    // WaterlooWorks-specific bulk scraping (driven from popup, executed in content
    // script by waterloo-works-orchestrator.ts).
    wwScrapeAllVisible: () => ({
        type: "WW_SCRAPE_ALL_VISIBLE",
    }),
    wwScrapeAllPaginated: (opts) => ({
        type: "WW_SCRAPE_ALL_PAGINATED",
        payload: opts ?? {},
    }),
    wwGetPageState: () => ({ type: "WW_GET_PAGE_STATE" }),
    // P3/#39 — Bulk scraping for public ATS board hosts. Popup → content-script.
    // Each pair mirrors the WW shape so the same `BulkSourceCard` UX can drive
    // every source. Each orchestrator caps at 200/session (overridable below).
    bulkGreenhouseGetPageState: () => ({
        type: "BULK_GREENHOUSE_GET_PAGE_STATE",
    }),
    bulkGreenhouseScrapeVisible: () => ({
        type: "BULK_GREENHOUSE_SCRAPE_VISIBLE",
    }),
    bulkGreenhouseScrapePaginated: (opts) => ({
        type: "BULK_GREENHOUSE_SCRAPE_PAGINATED",
        payload: opts ?? {},
    }),
    bulkLeverGetPageState: () => ({
        type: "BULK_LEVER_GET_PAGE_STATE",
    }),
    bulkLeverScrapeVisible: () => ({
        type: "BULK_LEVER_SCRAPE_VISIBLE",
    }),
    bulkLeverScrapePaginated: (opts) => ({
        type: "BULK_LEVER_SCRAPE_PAGINATED",
        payload: opts ?? {},
    }),
    bulkWorkdayGetPageState: () => ({
        type: "BULK_WORKDAY_GET_PAGE_STATE",
    }),
    bulkWorkdayScrapeVisible: () => ({
        type: "BULK_WORKDAY_SCRAPE_VISIBLE",
    }),
    bulkWorkdayScrapePaginated: (opts) => ({
        type: "BULK_WORKDAY_SCRAPE_PAGINATED",
        payload: opts ?? {},
    }),
    // P4/#40 — Helper for the chat-port start frame. The actual stream uses a
    // long-lived chrome.runtime.connect port (CHAT_PORT_NAME) rather than
    // chrome.runtime.sendMessage, but exposing a typed builder keeps callsites
    // self-documenting.
    chatStreamStart: (payload) => ({
        type: "CHAT_STREAM_START",
        prompt: payload.prompt,
        jobContext: payload.jobContext,
    }),
    // Corrections feedback loop (#33). Fired when a user edits an autofilled
    // field and the final value differs from the original suggestion — the
    // background forwards it to /api/extension/field-mappings/correct so
    // future autofills on the same domain prefer the corrected value.
    saveCorrection: (payload) => ({
        type: "SAVE_CORRECTION",
        payload,
    }),
    // P3 / #36 #37 — multi-step form support (Workday, Greenhouse).
    /** Background → content: a step transition just fired for this tab. */
    multistepStepTransition: (payload) => ({
        type: "MULTISTEP_STEP_TRANSITION",
        payload,
    }),
    /** Content → background: return the current tab id. */
    getTabId: () => ({ type: "GET_TAB_ID" }),
    /**
     * Content → background: ensure the `webNavigation` permission is granted.
     * In Chrome MV3 it's declared at install time and the response is always
     * `{ granted: true }`. In Firefox MV2 the background calls
     * `browser.permissions.request(...)` and returns the user's verdict.
     */
    requestWebNavigationPermission: () => ({
        type: "REQUEST_WEBNAVIGATION_PERMISSION",
    }),
    /** Content → background: is `webNavigation` currently usable? */
    hasWebNavigationPermission: () => ({
        type: "HAS_WEBNAVIGATION_PERMISSION",
    }),
};
// Send message to background script
async function sendMessage(message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                resolve(response || { success: false, error: "No response received" });
            }
        });
    });
}
// Send message to content script in specific tab
async function sendToTab(tabId, message) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
            }
            else {
                resolve(response || { success: false, error: "No response received" });
            }
        });
    });
}
// Send message to all content scripts
async function broadcastMessage(message) {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        if (tab.id) {
            try {
                await chrome.tabs.sendMessage(tab.id, message);
            }
            catch {
                // Tab might not have content script loaded
            }
        }
    }
}

// EXTERNAL MODULE: ./src/shared/error-messages.ts
var error_messages = __webpack_require__(543);
;// ./src/popup/deep-links.ts
/**
 * Deep-link URL builders for the popup's post-import success buttons (#31).
 *
 * Kept in its own module so the URL shape is unit-testable without booting
 * React/jsdom. The popup component imports both helpers and threads the
 * configured `apiBaseUrl` (from GET_AUTH_STATUS) through.
 */
/**
 * Builds the deep-link to a single opportunity's detail page.
 *
 * Trailing slashes on the base URL are stripped so we don't produce
 * `http://localhost:3000//opportunities/...`. The opportunity id is
 * URI-encoded defensively even though server-side ids are safe today.
 */
function opportunityDetailUrl(apiBaseUrl, opportunityId) {
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}/opportunities/${encodeURIComponent(opportunityId)}`;
}
/**
 * Builds the deep-link to the review queue used after a bulk scrape import.
 */
function opportunityReviewUrl(apiBaseUrl) {
    const base = apiBaseUrl.replace(/\/+$/, "");
    return `${base}/opportunities/review`;
}

;// ./src/popup/BulkSourceCard.tsx

function BulkSourceCard(props) {
    const { sourceLabel, detectedCount, busy, lastResult, lastError, onScrapeVisible, onScrapePaginated, onViewTracker, } = props;
    const disabled = busy !== null || detectedCount === 0;
    return ((0,jsx_runtime.jsxs)("article", { className: "card", "data-bulk-source": sourceLabel.toLowerCase(), children: [(0,jsx_runtime.jsxs)("header", { className: "card-head", children: [(0,jsx_runtime.jsxs)("span", { className: "card-title", children: [sourceLabel, " list"] }), (0,jsx_runtime.jsxs)("span", { className: "badge", children: [detectedCount, " row", detectedCount === 1 ? "" : "s"] })] }), (0,jsx_runtime.jsxs)("div", { className: "action-grid", children: [(0,jsx_runtime.jsx)("button", { className: "btn primary full", onClick: onScrapeVisible, disabled: disabled, children: busy === "visible"
                            ? "Scraping visible…"
                            : `Scrape ${detectedCount} visible` }), (0,jsx_runtime.jsx)("button", { className: "btn full", onClick: onScrapePaginated, disabled: disabled, title: `Walks every page in your current filter set; capped at 200 jobs.`, children: busy === "paginated" ? "Walking pages…" : "Scrape filtered set" })] }), lastResult && ((0,jsx_runtime.jsxs)("div", { className: "bulk-result", children: [(0,jsx_runtime.jsxs)("p", { className: "inline-note", children: ["Imported ", lastResult.imported, "/", lastResult.attempted, lastResult.pages > 1 && ` · ${lastResult.pages} pages`, lastResult.duplicateCount
                                ? ` · ${lastResult.duplicateCount} duplicates`
                                : "", lastResult.errors.length > 0 &&
                                ` · ${lastResult.errors.length} errors`] }), lastResult.dedupedIds?.length ? ((0,jsx_runtime.jsxs)("p", { className: "inline-note bulk-duplicates", children: ["Duplicates: ", lastResult.dedupedIds.join(", ")] })) : null, lastResult.imported > 0 && onViewTracker && ((0,jsx_runtime.jsx)("button", { className: "success-link", onClick: onViewTracker, children: "View tracker \u2192" }))] })), lastError && (0,jsx_runtime.jsx)("p", { className: "inline-error", children: lastError })] }));
}

;// ./src/popup/App.tsx








/** Sentinel value used for the picker's "Master profile" option (#34). */
const MASTER_RESUME_OPTION = "__master__";
const BULK_SOURCE_LABELS = {
    greenhouse: "Greenhouse",
    lever: "Lever",
    workday: "Workday",
};
const BULK_SOURCE_URL_PATTERNS = {
    greenhouse: [/boards\.greenhouse\.io\//, /[\w-]+\.greenhouse\.io\//],
    lever: [/jobs\.lever\.co\//, /[\w-]+\.lever\.co\//],
    workday: [/\.myworkdayjobs\.com\//, /\.workdayjobs\.com\//],
};
function matchBulkSource(url) {
    if (!url)
        return null;
    for (const key of Object.keys(BULK_SOURCE_URL_PATTERNS)) {
        if (BULK_SOURCE_URL_PATTERNS[key].some((p) => p.test(url)))
            return key;
    }
    return null;
}
function App() {
    const [viewState, setViewState] = (0,react.useState)("loading");
    const [profile, setProfile] = (0,react.useState)(null);
    const [pageStatus, setPageStatus] = (0,react.useState)(null);
    const [error, setError] = (0,react.useState)(null);
    const [actionInFlight, setActionInFlight] = (0,react.useState)(null);
    const [actionError, setActionError] = (0,react.useState)(null);
    const [actionSuccess, setActionSuccess] = (0,react.useState)(null);
    // Cached so the success row can render "View in tracker" links without
    // querying GET_AUTH_STATUS again. Populated from the auth-status response
    // on first load and kept stable for the lifetime of the popup.
    const [apiBaseUrl, setApiBaseUrl] = (0,react.useState)(null);
    const [wwState, setWwState] = (0,react.useState)(null);
    const [wwBulkInFlight, setWwBulkInFlight] = (0,react.useState)(null);
    const [wwBulkResult, setWwBulkResult] = (0,react.useState)(null);
    const [wwBulkError, setWwBulkError] = (0,react.useState)(null);
    // P3/#39 — Per-source state for Greenhouse / Lever / Workday. Keyed by
    // BulkSourceKey so a future source is a one-line addition.
    const [bulkStates, setBulkStates] = (0,react.useState)({});
    const [bulkInFlight, setBulkInFlight] = (0,react.useState)({});
    const [bulkResults, setBulkResults] = (0,react.useState)({});
    const [bulkErrors, setBulkErrors] = (0,react.useState)({});
    const [confirmingLogout, setConfirmingLogout] = (0,react.useState)(false);
    // #34 — multi-resume picker. Loaded lazily once we know we're authenticated;
    // selection defaults to the master profile and is reset whenever a new
    // success/error finishes so a follow-up tailor starts from a clean slate.
    const [resumeOptions, setResumeOptions] = (0,react.useState)([]);
    const [selectedResumeId, setSelectedResumeId] = (0,react.useState)(MASTER_RESUME_OPTION);
    const profileScore = profile ? scoreResume({ profile }).overall : null;
    (0,react.useEffect)(() => {
        checkAuthStatus();
        checkPageStatus();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    async function checkAuthStatus() {
        try {
            const response = await sendMessage(Messages.getAuthStatus());
            if (response.success && response.data) {
                const { isAuthenticated, sessionLost, apiBaseUrl: url, } = response.data;
                if (url)
                    setApiBaseUrl(url);
                if (isAuthenticated) {
                    setViewState("authenticated");
                    loadProfile();
                }
                else if (sessionLost) {
                    setViewState("session-lost");
                }
                else {
                    setViewState("unauthenticated");
                }
            }
            else {
                setViewState("unauthenticated");
            }
        }
        catch (err) {
            setError(err.message);
            setViewState("error");
        }
    }
    async function loadProfile() {
        const response = await sendMessage(Messages.getProfile());
        if (response.success && response.data) {
            setProfile(response.data);
        }
        // Fire-and-forget the resume list (#34). Failure is non-fatal — the picker
        // just doesn't render, falling back to the previous master-only flow.
        loadResumes();
    }
    async function loadResumes() {
        try {
            const response = await sendMessage(Messages.listResumes());
            if (response.success && response.data?.resumes) {
                setResumeOptions(response.data.resumes);
            }
        }
        catch {
            // Non-fatal: leave the picker hidden.
        }
    }
    async function checkPageStatus() {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (tab?.id) {
            try {
                const response = await chrome.tabs.sendMessage(tab.id, {
                    type: "GET_PAGE_STATUS",
                });
                if (response) {
                    setPageStatus(response);
                }
            }
            catch {
                // Content script not loaded
            }
            if (tab.url && /waterlooworks\.uwaterloo\.ca/.test(tab.url)) {
                try {
                    const r = await chrome.tabs.sendMessage(tab.id, {
                        type: "WW_GET_PAGE_STATE",
                    });
                    if (r?.success)
                        setWwState(r.data);
                }
                catch {
                    // Content script not yet loaded
                }
            }
            // P3/#39 — probe Greenhouse/Lever/Workday listing pages. Only one
            // matcher fires per visit (the user is on a single host).
            const bulkKey = matchBulkSource(tab.url);
            if (bulkKey) {
                try {
                    const messageType = bulkPageStateMessage(bulkKey);
                    const r = await chrome.tabs.sendMessage(tab.id, {
                        type: messageType,
                    });
                    if (r?.success && r.data) {
                        setBulkStates((prev) => ({ ...prev, [bulkKey]: r.data }));
                    }
                }
                catch {
                    // Content script not yet loaded
                }
            }
        }
    }
    function bulkPageStateMessage(key) {
        return `BULK_${key.toUpperCase()}_GET_PAGE_STATE`;
    }
    function bulkScrapeMessage(key, mode) {
        const suffix = mode === "visible" ? "SCRAPE_VISIBLE" : "SCRAPE_PAGINATED";
        return `BULK_${key.toUpperCase()}_${suffix}`;
    }
    async function handleBulkSourceScrape(key, mode) {
        setBulkInFlight((prev) => ({ ...prev, [key]: mode }));
        setBulkErrors((prev) => ({ ...prev, [key]: undefined }));
        setBulkResults((prev) => ({ ...prev, [key]: undefined }));
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (!tab?.id)
                throw new Error("No active tab");
            const message = { type: bulkScrapeMessage(key, mode), payload: {} };
            const response = await chrome.tabs.sendMessage(tab.id, message);
            if (response?.success && response.data) {
                setBulkResults((prev) => ({ ...prev, [key]: response.data }));
            }
            else {
                setBulkErrors((prev) => ({
                    ...prev,
                    [key]: (0,error_messages/* messageForError */.p)(new Error(response?.error || "Bulk scrape failed")),
                }));
            }
        }
        catch (err) {
            setBulkErrors((prev) => ({ ...prev, [key]: (0,error_messages/* messageForError */.p)(err) }));
        }
        finally {
            setBulkInFlight((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    }
    async function handleWwBulkScrape(mode) {
        setWwBulkInFlight(mode);
        setWwBulkError(null);
        setWwBulkResult(null);
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (!tab?.id)
                throw new Error("No active tab");
            const message = mode === "visible"
                ? Messages.wwScrapeAllVisible()
                : Messages.wwScrapeAllPaginated();
            const response = await chrome.tabs.sendMessage(tab.id, message);
            if (response?.success && response.data) {
                setWwBulkResult(response.data);
            }
            else {
                setWwBulkError((0,error_messages/* messageForError */.p)(new Error(response?.error || "Bulk scrape failed")));
            }
        }
        catch (err) {
            setWwBulkError((0,error_messages/* messageForError */.p)(err));
        }
        finally {
            setWwBulkInFlight(null);
        }
    }
    async function handleConnect() {
        await sendMessage(Messages.openAuth());
        window.close();
    }
    async function handleLogout() {
        if (!confirmingLogout) {
            setConfirmingLogout(true);
            setTimeout(() => setConfirmingLogout(false), 4000);
            return;
        }
        await sendMessage(Messages.logout());
        setViewState("unauthenticated");
        setProfile(null);
        setConfirmingLogout(false);
    }
    async function handleFillForm() {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_FILL" });
            window.close();
        }
    }
    async function handleImportJob() {
        if (!pageStatus?.scrapedJob)
            return;
        setActionInFlight("import");
        setActionError(null);
        try {
            const response = await sendMessage(Messages.importJob(pageStatus.scrapedJob));
            if (response.success) {
                // Capture the opportunity id so the success row can deep-link into
                // /opportunities/[id] (#31). The import endpoint guarantees at least
                // one id on success, but be defensive about the array shape.
                const opportunityId = response.data?.opportunityIds?.[0];
                setActionSuccess({ action: "import", opportunityId });
                // Don't auto-close anymore — the success row now offers a follow-up
                // action ("View in tracker →"), so leave the popup open until the
                // user dismisses or clicks through.
            }
            else {
                setActionError((0,error_messages/* messageForError */.p)(new Error(response.error || "Failed to import job")));
            }
        }
        catch (err) {
            setActionError((0,error_messages/* messageForError */.p)(err));
        }
        finally {
            setActionInFlight(null);
        }
    }
    async function handleGenerateFromPage(action) {
        if (!pageStatus?.scrapedJob)
            return;
        setActionInFlight(action);
        setActionError(null);
        try {
            // #34 — only thread `baseResumeId` through when the user actually picked
            // a non-master resume. Cover-letter generation doesn't take a base today,
            // so we only honor the selection for the tailor action.
            const baseResumeId = action === "tailor" && selectedResumeId !== MASTER_RESUME_OPTION
                ? selectedResumeId
                : undefined;
            const message = action === "tailor"
                ? Messages.tailorFromPage(pageStatus.scrapedJob, baseResumeId)
                : Messages.generateCoverLetterFromPage(pageStatus.scrapedJob);
            const response = await sendMessage(message);
            if (response.success && response.data?.url) {
                chrome.tabs.create({ url: response.data.url });
                setActionSuccess({ action });
                setTimeout(() => window.close(), 1500);
            }
            else {
                setActionError((0,error_messages/* messageForError */.p)(new Error(response.error || "Failed to generate document")));
            }
        }
        catch (err) {
            setActionError((0,error_messages/* messageForError */.p)(err));
        }
        finally {
            setActionInFlight(null);
        }
    }
    async function handleOpenDashboard() {
        const baseUrl = await resolveApiBaseUrl();
        chrome.tabs.create({ url: `${baseUrl}/dashboard` });
        window.close();
    }
    /**
     * Resolves the configured Slothing API base URL, preferring the value we
     * cached at first paint (`apiBaseUrl`) and falling back to a fresh
     * GET_AUTH_STATUS roundtrip if we haven't seen one yet. Used by all the
     * deep-link handlers (#31).
     */
    async function resolveApiBaseUrl() {
        if (apiBaseUrl)
            return apiBaseUrl;
        const response = await sendMessage(Messages.getAuthStatus());
        const data = response.data;
        return data?.apiBaseUrl || "http://localhost:3000";
    }
    /** Opens the imported opportunity in a new tab and closes the popup. (#31) */
    async function handleViewOpportunity(opportunityId) {
        const baseUrl = await resolveApiBaseUrl();
        chrome.tabs.create({ url: opportunityDetailUrl(baseUrl, opportunityId) });
        window.close();
    }
    /** Opens the review queue for the user to triage their bulk imports. (#31) */
    async function handleViewReviewQueue() {
        const baseUrl = await resolveApiBaseUrl();
        chrome.tabs.create({ url: opportunityReviewUrl(baseUrl) });
        window.close();
    }
    function profileInitial() {
        const name = profile?.contact?.name?.trim();
        if (name)
            return name.charAt(0).toUpperCase();
        const email = profile?.contact?.email;
        return email ? email.charAt(0).toUpperCase() : "S";
    }
    if (viewState === "loading") {
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: "state-center", children: [(0,jsx_runtime.jsx)("div", { className: "spinner" }), (0,jsx_runtime.jsx)("p", { className: "state-text", children: "Connecting\u2026" })] }) }));
    }
    if (viewState === "error") {
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: "state-center", children: [(0,jsx_runtime.jsx)("div", { className: "state-icon error", "aria-hidden": true, children: "!" }), (0,jsx_runtime.jsx)("h2", { className: "state-title", children: "Something went wrong" }), (0,jsx_runtime.jsx)("p", { className: "state-text", children: error }), (0,jsx_runtime.jsx)("button", { className: "btn primary", onClick: () => checkAuthStatus(), children: "Try again" })] }) }));
    }
    if (viewState === "unauthenticated") {
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: "hero", children: [(0,jsx_runtime.jsx)("div", { className: "hero-mark", children: "S" }), (0,jsx_runtime.jsx)("h1", { className: "hero-title", children: "Slothing" }), (0,jsx_runtime.jsx)("p", { className: "hero-sub", children: "Auto-fill applications. Import jobs. Track everything." }), (0,jsx_runtime.jsx)("button", { className: "btn primary block", onClick: handleConnect, children: "Connect account" }), (0,jsx_runtime.jsx)("p", { className: "hero-foot", children: "You'll sign in once \u2014 Slothing remembers." })] }) }));
    }
    if (viewState === "session-lost") {
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: "hero session-lost", children: [(0,jsx_runtime.jsx)("div", { className: "hero-mark warn", "aria-hidden": true, children: "!" }), (0,jsx_runtime.jsx)("h1", { className: "hero-title", children: "Session lost" }), (0,jsx_runtime.jsx)("p", { className: "hero-sub", children: "Slothing got reset by your browser. Reconnect to pick up where you left off \u2014 your profile and data are safe." }), (0,jsx_runtime.jsx)("button", { className: "btn primary block", onClick: handleConnect, children: "Reconnect" }), (0,jsx_runtime.jsx)("p", { className: "hero-foot", children: "Takes about five seconds." })] }) }));
    }
    const detectedJob = pageStatus?.scrapedJob;
    const showWwBulk = wwState && wwState.kind === "list";
    const detectedBulkSources = Object.keys(BULK_SOURCE_LABELS).filter((key) => bulkStates[key]?.detected);
    const showImportJobCard = detectedJob ||
        (wwState && wwState.kind === "detail" && pageStatus?.scrapedJob);
    const nothingDetected = !pageStatus?.hasForm &&
        !showImportJobCard &&
        !showWwBulk &&
        detectedBulkSources.length === 0;
    return ((0,jsx_runtime.jsxs)("div", { className: "popup", children: [(0,jsx_runtime.jsxs)("header", { className: "topbar", children: [(0,jsx_runtime.jsxs)("div", { className: "brand", children: [(0,jsx_runtime.jsx)("span", { className: "brand-mark", children: "S" }), (0,jsx_runtime.jsx)("span", { className: "brand-name", children: "Slothing" })] }), (0,jsx_runtime.jsxs)("span", { className: "pill ok", title: "Extension connected", children: [(0,jsx_runtime.jsx)("span", { className: "pill-dot" }), "Connected"] })] }), (0,jsx_runtime.jsxs)("section", { className: "profile-card", children: [(0,jsx_runtime.jsx)("div", { className: "avatar", children: profileInitial() }), (0,jsx_runtime.jsxs)("div", { className: "profile-meta", children: [(0,jsx_runtime.jsx)("div", { className: "profile-name", children: profile?.contact?.name ||
                                    profile?.contact?.email ||
                                    "Set up your profile" }), (0,jsx_runtime.jsx)("div", { className: "profile-sub", children: profile?.computed?.currentTitle &&
                                    profile?.computed?.currentCompany
                                    ? `${profile.computed.currentTitle} · ${profile.computed.currentCompany}`
                                    : profile?.contact?.email ||
                                        "Add your work history so Slothing can tailor" })] }), profileScore !== null ? ((0,jsx_runtime.jsxs)("div", { className: `score ${profileScore >= 80 ? "high" : profileScore >= 50 ? "mid" : "low"}`, title: "Profile completeness", children: [(0,jsx_runtime.jsx)("span", { className: "score-num", children: profileScore }), (0,jsx_runtime.jsx)("span", { className: "score-unit", children: "/100" })] })) : ((0,jsx_runtime.jsx)("button", { className: "btn ghost tight", onClick: handleOpenDashboard, children: "Open" }))] }), (0,jsx_runtime.jsxs)("main", { className: "content", children: [pageStatus?.hasForm && ((0,jsx_runtime.jsxs)("article", { className: "card accent", children: [(0,jsx_runtime.jsxs)("header", { className: "card-head", children: [(0,jsx_runtime.jsx)("span", { className: "card-title", children: "Application form detected" }), (0,jsx_runtime.jsxs)("span", { className: "badge", children: [pageStatus.detectedFields, " fields"] })] }), (0,jsx_runtime.jsx)("button", { className: "btn primary block", onClick: handleFillForm, children: "Auto-fill form" })] })), showImportJobCard && detectedJob && ((0,jsx_runtime.jsxs)("article", { className: "card", children: [(0,jsx_runtime.jsxs)("header", { className: "card-head", children: [(0,jsx_runtime.jsx)("span", { className: "card-title clip", title: detectedJob.title, children: detectedJob.title }), (0,jsx_runtime.jsx)("span", { className: "card-sub clip", children: detectedJob.company })] }), actionSuccess ? ((0,jsx_runtime.jsxs)("div", { className: "success-row", children: [(0,jsx_runtime.jsx)("span", { className: "check", children: "\u2713" }), (0,jsx_runtime.jsx)("span", { className: "success-label", children: actionSuccess.action === "import"
                                            ? "Imported to opportunities"
                                            : "Opening tab…" }), actionSuccess.action === "import" &&
                                        actionSuccess.opportunityId && ((0,jsx_runtime.jsx)("button", { className: "success-link", onClick: () => handleViewOpportunity(actionSuccess.opportunityId), children: "View in tracker \u2192" }))] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [resumeOptions.length > 0 && ((0,jsx_runtime.jsxs)("label", { className: "resume-picker", children: [(0,jsx_runtime.jsx)("span", { className: "resume-picker-label", children: "Base on" }), (0,jsx_runtime.jsxs)("select", { className: "resume-picker-select", value: selectedResumeId, onChange: (e) => setSelectedResumeId(e.target.value), disabled: actionInFlight !== null, "aria-label": "Choose the resume to tailor from", children: [(0,jsx_runtime.jsx)("option", { value: MASTER_RESUME_OPTION, children: "Master profile" }), resumeOptions.map((resume) => ((0,jsx_runtime.jsx)("option", { value: resume.id, children: resume.name }, resume.id)))] })] })), (0,jsx_runtime.jsxs)("div", { className: "action-grid", children: [(0,jsx_runtime.jsx)("button", { className: "btn primary", onClick: () => handleGenerateFromPage("tailor"), disabled: actionInFlight !== null, children: actionInFlight === "tailor"
                                                    ? "Tailoring…"
                                                    : "Tailor resume" }), (0,jsx_runtime.jsx)("button", { className: "btn", onClick: () => handleGenerateFromPage("cover-letter"), disabled: actionInFlight !== null, children: actionInFlight === "cover-letter"
                                                    ? "Writing…"
                                                    : "Cover letter" }), (0,jsx_runtime.jsx)("button", { className: "btn ghost full", onClick: handleImportJob, disabled: actionInFlight !== null, children: actionInFlight === "import"
                                                    ? "Importing…"
                                                    : "Just import to tracker" })] })] })), actionError && (0,jsx_runtime.jsx)("p", { className: "inline-error", children: actionError })] })), showWwBulk && wwState && ((0,jsx_runtime.jsx)(BulkSourceCard, { sourceLabel: "WaterlooWorks", detectedCount: wwState.rowCount, busy: wwBulkInFlight, lastResult: wwBulkResult, lastError: wwBulkError, onScrapeVisible: () => handleWwBulkScrape("visible"), onScrapePaginated: () => handleWwBulkScrape("paginated"), onViewTracker: handleViewReviewQueue })), detectedBulkSources.map((key) => {
                        const state = bulkStates[key];
                        if (!state)
                            return null;
                        return ((0,jsx_runtime.jsx)(BulkSourceCard, { sourceLabel: BULK_SOURCE_LABELS[key], detectedCount: state.rowCount, busy: bulkInFlight[key] ?? null, lastResult: bulkResults[key] ?? null, lastError: bulkErrors[key] ?? null, onScrapeVisible: () => handleBulkSourceScrape(key, "visible"), onScrapePaginated: () => handleBulkSourceScrape(key, "paginated"), onViewTracker: handleViewReviewQueue }, key));
                    }), nothingDetected && ((0,jsx_runtime.jsxs)("div", { className: "idle", children: [(0,jsx_runtime.jsx)("p", { className: "idle-title", children: "No job detected on this page" }), (0,jsx_runtime.jsx)("p", { className: "idle-sub", children: "Open a posting on any of these and Slothing wakes up:" }), (0,jsx_runtime.jsxs)("div", { className: "site-chips", children: [(0,jsx_runtime.jsx)("span", { className: "site-chip", children: "LinkedIn" }), (0,jsx_runtime.jsx)("span", { className: "site-chip", children: "Indeed" }), (0,jsx_runtime.jsx)("span", { className: "site-chip", children: "Greenhouse" }), (0,jsx_runtime.jsx)("span", { className: "site-chip", children: "Lever" }), (0,jsx_runtime.jsx)("span", { className: "site-chip", children: "WaterlooWorks" }), (0,jsx_runtime.jsx)("span", { className: "site-chip", children: "Workday" })] })] })), (0,jsx_runtime.jsxs)("div", { className: "quick-row", children: [(0,jsx_runtime.jsxs)("button", { className: "quick", onClick: handleOpenDashboard, children: [(0,jsx_runtime.jsx)("span", { className: "quick-icon", "aria-hidden": true, children: "\u2197" }), (0,jsx_runtime.jsx)("span", { children: "Dashboard" })] }), (0,jsx_runtime.jsxs)("button", { className: "quick", onClick: () => chrome.runtime.openOptionsPage(), children: [(0,jsx_runtime.jsx)("span", { className: "quick-icon", "aria-hidden": true, children: "\u2699" }), (0,jsx_runtime.jsx)("span", { children: "Settings" })] })] })] }), (0,jsx_runtime.jsxs)("footer", { className: "footbar", children: [(0,jsx_runtime.jsx)("button", { className: `link ${confirmingLogout ? "warn" : ""}`, onClick: handleLogout, children: confirmingLogout ? "Click again to disconnect" : "Disconnect" }), profile?.updatedAt && ((0,jsx_runtime.jsxs)("span", { className: "updated", children: ["Synced ", formatRelative(profile.updatedAt)] }))] })] }));
}

;// ./src/popup/index.tsx





const container = document.getElementById("root");
if (container) {
    const root = (0,client/* createRoot */.H)(container);
    root.render((0,jsx_runtime.jsx)(react.StrictMode, { children: (0,jsx_runtime.jsx)(App, {}) }));
}


/***/ },

/***/ 543
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ messageForError)
/* harmony export */ });
/* unused harmony export messageForStatus */
/**
 * User-facing error string mapping for the Columbus extension.
 *
 * The popup (and any other extension surface) should never show raw
 * `"Request failed: 503"` / `"Authentication expired"` strings. Wrap any
 * error path in `messageForError(err)` to get an English sentence safe
 * for end-users.
 *
 * Mirror of the message tone used by `apps/web/.../extension/connect/page.tsx`
 * `messageForStatus` — the connect page keeps its own copy because it sits
 * inside the next-intl tree (different package boundary), but the
 * user-visible strings should stay aligned. If you change one, change both.
 *
 * English-only by design: the extension itself does not use next-intl.
 */
/**
 * Maps an HTTP status code to a human-friendly message.
 */
function messageForStatus(status) {
    if (status === 401 || status === 403) {
        return "Sign in expired. Reconnect the extension.";
    }
    if (status === 429) {
        return "We're rate-limited. Try again in a minute.";
    }
    if (status >= 500) {
        return "Slothing servers are having a problem.";
    }
    return "Something went wrong. Please try again.";
}
/**
 * Best-effort mapping of an unknown thrown value to a human-friendly
 * message. Recognises the specific phrases the api-client throws today
 * (`"Authentication expired"`, `"Not authenticated"`, `"Request failed: <code>"`,
 * `"Failed to fetch"`) and falls back to the original message for anything
 * else — that's almost always more useful than a generic catch-all.
 */
function messageForError(err) {
    // Generic network failure (fetch in service workers throws TypeError here)
    if (err instanceof TypeError) {
        return "Network error. Check your connection and try again.";
    }
    const raw = err instanceof Error ? err.message : "";
    if (!raw)
        return "Something went wrong. Please try again.";
    // Auth-shaped messages from ColumbusAPIClient.
    if (raw === "Authentication expired" ||
        raw === "Not authenticated" ||
        /unauthor/i.test(raw)) {
        return messageForStatus(401);
    }
    // `Request failed: 503` — recover the status code.
    const match = raw.match(/Request failed:\s*(\d{3})/);
    if (match) {
        const code = Number(match[1]);
        if (Number.isFinite(code))
            return messageForStatus(code);
    }
    // Browser fetch failures bubble up as "Failed to fetch".
    if (/failed to fetch/i.test(raw) || /network/i.test(raw)) {
        return "Network error. Check your connection and try again.";
    }
    // For anything else, the underlying message is usually a sentence already
    // (e.g. "Couldn't read the full job description from this page.").
    return raw;
}


/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(990));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFhOztBQUViLFFBQVEsbUJBQU8sQ0FBQyxHQUFXO0FBQzNCLElBQUksSUFBcUM7QUFDekMsRUFBRSxTQUFrQjtBQUNwQixFQUFFLHlCQUFtQjtBQUNyQixFQUFFLEtBQUs7QUFBQSxVQWtCTjs7Ozs7Ozs7QUN4QkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2EsTUFBTSxtQkFBTyxDQUFDLEdBQU8sNktBQTZLO0FBQy9NLGtCQUFrQixVQUFVLGVBQWUscUJBQXFCLDZCQUE2QiwwQkFBMEIsMERBQTBELDRFQUE0RSxPQUFPLHdEQUF3RCxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsWUFBWTs7Ozs7Ozs7QUNWNVY7O0FBRWIsSUFBSSxJQUFxQztBQUN6QyxFQUFFLHlDQUFxRTtBQUN2RSxFQUFFLEtBQUs7QUFBQSxFQUVOOzs7Ozs7Ozs7Ozs7Ozs7O0FDTk07QUFDUCw2QkFBNkIsbURBQUcsZUFBZSxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNQLE1BQU0sdUNBQXVDO0FBQzdDLE1BQU0sdUNBQXVDO0FBQzdDLE1BQU0sdUNBQXVDO0FBQzdDLE1BQU0sOEJBQThCO0FBQ3BDLE1BQU0sK0JBQStCO0FBQ3JDLE1BQU0sOEJBQThCO0FBQ3BDLE1BQU0sZ0NBQWdDO0FBQ3RDLE1BQU0sK0NBQStDO0FBQ3JELE1BQU0sa0NBQWtDO0FBQ3hDLE1BQU0sOENBQThDO0FBQ3BELE1BQU0sNkJBQTZCO0FBQ25DLE1BQU0sOEJBQThCO0FBQ3BDO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sd0NBQXdDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIscUNBQXFDLElBQUk7QUFDckU7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYywrQkFBK0IsSUFBSTtBQUNqRDtBQUNBLGdCQUFnQjtBQUNoQjtBQUNPLHdDQUF3QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyx3Q0FBd0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPLHdDQUF3QztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPO0FBQ1A7QUFDQTtBQUNPLHlDQUF5QztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLGtDQUFrQyxRQUFRO0FBQzFDO0FBQ087QUFDUCxrQ0FBa0MsS0FBSztBQUN2QztBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixNQUFNLEVBQUUsS0FBSyxPQUFPLE1BQU0sRUFBRSxNQUFNO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9QTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPOzs7QUNsQ0E7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLGlDQUFpQztBQUNqQztBQUNPO0FBQ1AsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvRWlFO0FBQ1E7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSw0QkFBNEIsYUFBYTtBQUN6QywwQkFBMEIsYUFBYTtBQUN2QywyQkFBMkIsWUFBWTtBQUN2QyxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsY0FBYyx5QkFBeUIsUUFBUTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTs7O0FDeENPO0FBQ1AsTUFBTSx3REFBd0Q7QUFDOUQsTUFBTSxtREFBbUQ7QUFDekQsTUFBTSxtREFBbUQ7QUFDekQsTUFBTSw0REFBNEQ7QUFDbEUsTUFBTSw2REFBNkQ7QUFDbkUsTUFBTSxpRUFBaUU7QUFDdkUsTUFBTSxrRUFBa0U7QUFDeEUsTUFBTSxzREFBc0Q7QUFDNUQsTUFBTSx1REFBdUQ7QUFDN0QsTUFBTSx3REFBd0Q7QUFDOUQsTUFBTSx3REFBd0Q7QUFDOUQ7OztBQ1owRDtBQUNQO0FBQ1o7QUFDaEM7QUFDUCxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixzQkFBc0IsV0FBVyxNQUFNO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLFVBQVU7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsa0JBQWtCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxHQUFHO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsb0JBQW9CO0FBQ2hELG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLE1BQU0sMEVBQTBFO0FBQ2hGLE1BQU0sMkNBQTJDO0FBQ2pELE1BQU0sa0RBQWtEO0FBQ3hELE1BQU0sdUNBQXVDO0FBQzdDLE1BQU0sb0VBQW9FO0FBQzFFLE1BQU0sa0RBQWtEO0FBQ3hELE1BQU0scUNBQXFDO0FBQzNDLE1BQU0sdUNBQXVDO0FBQzdDLE1BQU0sdURBQXVEO0FBQzdEO0FBQ0EsTUFBTSxtRUFBbUU7QUFDekUsTUFBTSwyRUFBMkU7QUFDakYsTUFBTSwyREFBMkQ7QUFDakUsTUFBTSwrREFBK0Q7QUFDckUsTUFBTSxvREFBb0Q7QUFDMUQsTUFBTSwwREFBMEQ7QUFDaEU7QUFDQSxNQUFNLCtEQUErRDtBQUNyRSxNQUFNLDZEQUE2RDtBQUNuRSxNQUFNLGlFQUFpRTtBQUN2RSxNQUFNLGdEQUFnRDtBQUN0RCxNQUFNLDhEQUE4RDtBQUNwRSxNQUFNLHdEQUF3RDtBQUM5RCxNQUFNLDhDQUE4QztBQUNwRDtBQUNBLE1BQU0sK0RBQStEO0FBQ3JFLE1BQU0sMkNBQTJDO0FBQ2pELE1BQU0sMkNBQTJDO0FBQ2pELE1BQU0sMERBQTBEO0FBQ2hFLE1BQU0sMkVBQTJFO0FBQ2pGLE1BQU0sK0NBQStDO0FBQ3JELE1BQU0sMkRBQTJEO0FBQ2pFLE1BQU0sNERBQTREO0FBQ2xFO0FBQ0EsTUFBTSxxRUFBcUU7QUFDM0UsTUFBTSx1RUFBdUU7QUFDN0UsTUFBTSwrREFBK0Q7QUFDckUsTUFBTSxtRUFBbUU7QUFDekUsTUFBTSxvREFBb0Q7QUFDMUQsTUFBTSxxRUFBcUU7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLE1BQU0sdUVBQXVFO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLE1BQU0saURBQWlEO0FBQ3ZELE1BQU0sZ0RBQWdEO0FBQ3RELE1BQU0sb0RBQW9EO0FBQzFELE1BQU0scURBQXFEO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsTUFBTSxnRUFBZ0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsTUFBTSx1RUFBdUU7QUFDN0U7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLE1BQU0sd0VBQXdFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxNQUFNLDBFQUEwRTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLE1BQU0sOENBQThDO0FBQ3BELE1BQU0sMkNBQTJDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztB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QUksR0FBRyxvQkFBSyxhQUFhLGlDQUFpQyxtQkFBSSxhQUFhLG1CQUFtQiwrQkFBK0IsbUdBQW1HLDBCQUEwQixvQkFBSyxXQUFXLDRDQUE0QyxjQUFjLHNCQUFzQixLQUFLLElBQUk7QUFDemhEOzs7QUN2WWdEO0FBQ3RCO0FBQ29CO0FBQ3RCO0FBQ0Y7QUFDdEI7QUFDQTtBQUNBLGlCQUFpQiw0QkFBVTtBQUMzQixnQkFBZ0IsbUJBQUksQ0FBQyxnQkFBZ0IsSUFBSSxVQUFVLG1CQUFJLENBQUMsR0FBRyxJQUFJLEdBQUc7QUFDbEU7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELEVBQUU7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdC1kb21AMTguMy4xX3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QtZG9tL2NsaWVudC5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdEAxOC4zLjEvbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC1qc3gtcnVudGltZS5wcm9kdWN0aW9uLm1pbi5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9yZWFjdEAxOC4zLjEvbm9kZV9tb2R1bGVzL3JlYWN0L2pzeC1ydW50aW1lLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9mb3JtYXR0ZXJzL2luZGV4LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy90ZXh0LnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2FjdGlvbi12ZXJicy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9hdHMtY2hhcmFjdGVycy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9hdHMtZnJpZW5kbGluZXNzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3N5bm9ueW1zLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2tleXdvcmQtbWF0Y2gudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvbGVuZ3RoLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3F1YW50aWZpZWQtYWNoaWV2ZW1lbnRzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3NlY3Rpb24tY29tcGxldGVuZXNzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3NwZWxsaW5nLWdyYW1tYXIudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9zaGFyZWQvbWVzc2FnZXMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9wb3B1cC9kZWVwLWxpbmtzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvcG9wdXAvQnVsa1NvdXJjZUNhcmQudHN4Iiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvcG9wdXAvQXBwLnRzeCIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL3BvcHVwL2luZGV4LnRzeCIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL3NoYXJlZC9lcnJvci1tZXNzYWdlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBtID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBleHBvcnRzLmNyZWF0ZVJvb3QgPSBtLmNyZWF0ZVJvb3Q7XG4gIGV4cG9ydHMuaHlkcmF0ZVJvb3QgPSBtLmh5ZHJhdGVSb290O1xufSBlbHNlIHtcbiAgdmFyIGkgPSBtLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVEO1xuICBleHBvcnRzLmNyZWF0ZVJvb3QgPSBmdW5jdGlvbihjLCBvKSB7XG4gICAgaS51c2luZ0NsaWVudEVudHJ5UG9pbnQgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gbS5jcmVhdGVSb290KGMsIG8pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgZXhwb3J0cy5oeWRyYXRlUm9vdCA9IGZ1bmN0aW9uKGMsIGgsIG8pIHtcbiAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBtLmh5ZHJhdGVSb290KGMsIGgsIG8pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcbn1cbiIsIi8qKlxuICogQGxpY2Vuc2UgUmVhY3RcbiAqIHJlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbid1c2Ugc3RyaWN0Jzt2YXIgZj1yZXF1aXJlKFwicmVhY3RcIiksaz1TeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKSxsPVN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSxtPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksbj1mLl9fU0VDUkVUX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0ZJUkVELlJlYWN0Q3VycmVudE93bmVyLHA9e2tleTohMCxyZWY6ITAsX19zZWxmOiEwLF9fc291cmNlOiEwfTtcbmZ1bmN0aW9uIHEoYyxhLGcpe3ZhciBiLGQ9e30sZT1udWxsLGg9bnVsbDt2b2lkIDAhPT1nJiYoZT1cIlwiK2cpO3ZvaWQgMCE9PWEua2V5JiYoZT1cIlwiK2Eua2V5KTt2b2lkIDAhPT1hLnJlZiYmKGg9YS5yZWYpO2ZvcihiIGluIGEpbS5jYWxsKGEsYikmJiFwLmhhc093blByb3BlcnR5KGIpJiYoZFtiXT1hW2JdKTtpZihjJiZjLmRlZmF1bHRQcm9wcylmb3IoYiBpbiBhPWMuZGVmYXVsdFByb3BzLGEpdm9pZCAwPT09ZFtiXSYmKGRbYl09YVtiXSk7cmV0dXJueyQkdHlwZW9mOmssdHlwZTpjLGtleTplLHJlZjpoLHByb3BzOmQsX293bmVyOm4uY3VycmVudH19ZXhwb3J0cy5GcmFnbWVudD1sO2V4cG9ydHMuanN4PXE7ZXhwb3J0cy5qc3hzPXE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtanN4LXJ1bnRpbWUucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QtanN4LXJ1bnRpbWUuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsImV4cG9ydCBjb25zdCBERUZBVUxUX0xPQ0FMRSA9IFwiZW4tVVNcIjtcbmNvbnN0IE5VTUVSSUNfUEFSVFNfTE9DQUxFID0gYCR7REVGQVVMVF9MT0NBTEV9LXUtbnUtbGF0bmA7XG5leHBvcnQgY29uc3QgTE9DQUxFX0NPT0tJRV9OQU1FID0gXCJ0YWlkYV9sb2NhbGVcIjtcbmV4cG9ydCBjb25zdCBMT0NBTEVfQ0hBTkdFX0VWRU5UID0gXCJ0YWlkYTpsb2NhbGUtY2hhbmdlXCI7XG5leHBvcnQgY29uc3QgU1VQUE9SVEVEX0xPQ0FMRVMgPSBbXG4gICAgeyB2YWx1ZTogXCJlbi1VU1wiLCBsYWJlbDogXCJFbmdsaXNoIChVUylcIiB9LFxuICAgIHsgdmFsdWU6IFwiZW4tQ0FcIiwgbGFiZWw6IFwiRW5nbGlzaCAoQ0EpXCIgfSxcbiAgICB7IHZhbHVlOiBcImVuLUdCXCIsIGxhYmVsOiBcIkVuZ2xpc2ggKFVLKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJmclwiLCBsYWJlbDogXCJGcmVuY2hcIiB9LFxuICAgIHsgdmFsdWU6IFwiZXNcIiwgbGFiZWw6IFwiU3BhbmlzaFwiIH0sXG4gICAgeyB2YWx1ZTogXCJkZVwiLCBsYWJlbDogXCJHZXJtYW5cIiB9LFxuICAgIHsgdmFsdWU6IFwiamFcIiwgbGFiZWw6IFwiSmFwYW5lc2VcIiB9LFxuICAgIHsgdmFsdWU6IFwiemgtQ05cIiwgbGFiZWw6IFwiQ2hpbmVzZSAoU2ltcGxpZmllZClcIiB9LFxuICAgIHsgdmFsdWU6IFwicHRcIiwgbGFiZWw6IFwiUG9ydHVndWVzZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJwdC1CUlwiLCBsYWJlbDogXCJQb3J0dWd1ZXNlIChCcmF6aWwpXCIgfSxcbiAgICB7IHZhbHVlOiBcImhpXCIsIGxhYmVsOiBcIkhpbmRpXCIgfSxcbiAgICB7IHZhbHVlOiBcImtvXCIsIGxhYmVsOiBcIktvcmVhblwiIH0sXG5dO1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShsb2NhbGUpIHtcbiAgICBpZiAoIWxvY2FsZSlcbiAgICAgICAgcmV0dXJuIERFRkFVTFRfTE9DQUxFO1xuICAgIGNvbnN0IHN1cHBvcnRlZCA9IFNVUFBPUlRFRF9MT0NBTEVTLmZpbmQoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IGxvY2FsZS50b0xvd2VyQ2FzZSgpIHx8XG4gICAgICAgIGNhbmRpZGF0ZS52YWx1ZS5zcGxpdChcIi1cIilbMF0udG9Mb3dlckNhc2UoKSA9PT0gbG9jYWxlLnRvTG93ZXJDYXNlKCkpO1xuICAgIHJldHVybiBzdXBwb3J0ZWQ/LnZhbHVlID8/IERFRkFVTFRfTE9DQUxFO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vd0lzbygpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vd0RhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gbm93RXBvY2goKSB7XG4gICAgcmV0dXJuIERhdGUubm93KCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUb0RhdGUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gXCJcIilcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZGF0ZSA9IHZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSkgOiBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgcmV0dXJuIE51bWJlci5pc05hTihkYXRlLmdldFRpbWUoKSkgPyBudWxsIDogZGF0ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b0lzbyh2YWx1ZSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgfVxuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9OdWxsYWJsZUlzbyh2YWx1ZSkge1xuICAgIHJldHVybiBwYXJzZVRvRGF0ZSh2YWx1ZSk/LnRvSVNPU3RyaW5nKCkgPz8gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b0Vwb2NoKHZhbHVlKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUuZ2V0VGltZSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvTnVsbGFibGVFcG9jaCh2YWx1ZSkge1xuICAgIHJldHVybiBwYXJzZVRvRGF0ZSh2YWx1ZSk/LmdldFRpbWUoKSA/PyBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzZXJUaW1lem9uZSgpIHtcbiAgICBpZiAodHlwZW9mIEludGwgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBcIlVUQ1wiO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmUgfHwgXCJVVENcIjtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gXCJVVENcIjtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXREaXNwbGF5VGltZXpvbmUodGltZVpvbmUpIHtcbiAgICBpZiAodGltZVpvbmUpXG4gICAgICAgIHJldHVybiB0aW1lWm9uZTtcbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwiVVRDXCIgOiBnZXRVc2VyVGltZXpvbmUoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRBYnNvbHV0ZSh2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xuICAgIGNvbnN0IGluY2x1ZGVUaW1lID0gb3B0cy5pbmNsdWRlVGltZSA/PyB0cnVlO1xuICAgIGNvbnN0IGZvcm1hdHRlciA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KG5vcm1hbGl6ZUxvY2FsZShvcHRzLmxvY2FsZSksIHtcbiAgICAgICAgbW9udGg6IFwic2hvcnRcIixcbiAgICAgICAgZGF5OiBcIm51bWVyaWNcIixcbiAgICAgICAgeWVhcjogXCJudW1lcmljXCIsXG4gICAgICAgIC4uLihpbmNsdWRlVGltZSA/IHsgaG91cjogXCJudW1lcmljXCIsIG1pbnV0ZTogXCIyLWRpZ2l0XCIgfSA6IHt9KSxcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KTtcbiAgICBjb25zdCBmb3JtYXR0ZWQgPSBmb3JtYXR0ZXIuZm9ybWF0KGRhdGUpO1xuICAgIGlmICghaW5jbHVkZVRpbWUpXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWQ7XG4gICAgY29uc3QgbGFzdENvbW1hID0gZm9ybWF0dGVkLmxhc3RJbmRleE9mKFwiLFwiKTtcbiAgICBpZiAobGFzdENvbW1hID09PSAtMSlcbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgICByZXR1cm4gYCR7Zm9ybWF0dGVkLnNsaWNlKDAsIGxhc3RDb21tYSl9IMK3ICR7Zm9ybWF0dGVkXG4gICAgICAgIC5zbGljZShsYXN0Q29tbWEgKyAxKVxuICAgICAgICAudHJpbSgpfWA7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UmVsYXRpdmUodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudCA9IHBhcnNlVG9EYXRlKG9wdHMubm93ID8/IG5vd0lzbygpKTtcbiAgICBpZiAoIWRhdGUgfHwgIWN1cnJlbnQpIHtcbiAgICAgICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG4gICAgfVxuICAgIGNvbnN0IGRpZmZNcyA9IGN1cnJlbnQuZ2V0VGltZSgpIC0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc3QgYWJzTXMgPSBNYXRoLmFicyhkaWZmTXMpO1xuICAgIGNvbnN0IGlzRnV0dXJlID0gZGlmZk1zIDwgMDtcbiAgICBjb25zdCBtaW51dGUgPSA2MCAqIDEwMDA7XG4gICAgY29uc3QgaG91ciA9IDYwICogbWludXRlO1xuICAgIGNvbnN0IGRheSA9IDI0ICogaG91cjtcbiAgICBjb25zdCB3ZWVrID0gNyAqIGRheTtcbiAgICBjb25zdCBtb250aCA9IDMwICogZGF5O1xuICAgIGNvbnN0IHllYXIgPSAzNjUgKiBkYXk7XG4gICAgaWYgKGFic01zIDwgbWludXRlKVxuICAgICAgICByZXR1cm4gXCJKdXN0IG5vd1wiO1xuICAgIGlmIChhYnNNcyA8IGhvdXIpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gbWludXRlKSwgXCJtXCIsIGlzRnV0dXJlKTtcbiAgICBpZiAoYWJzTXMgPCBkYXkpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gaG91ciksIFwiaFwiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgMiAqIGRheSlcbiAgICAgICAgcmV0dXJuIGlzRnV0dXJlID8gXCJUb21vcnJvd1wiIDogXCJZZXN0ZXJkYXlcIjtcbiAgICBpZiAoYWJzTXMgPCB3ZWVrKVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIGRheSksIFwiZFwiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgbW9udGgpXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gd2VlayksIFwid1wiLCBpc0Z1dHVyZSk7XG4gICAgaWYgKGFic01zIDwgeWVhcilcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyBtb250aCksIFwibW9cIiwgaXNGdXR1cmUpO1xuICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8geWVhciksIFwieVwiLCBpc0Z1dHVyZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGF0ZU9ubHkodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJVbmtub3duIGRhdGVcIjtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBtb250aDogXCJzaG9ydFwiLFxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZU9ubHkodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJVbmtub3duIHRpbWVcIjtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBob3VyOiBcIm51bWVyaWNcIixcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0SXNvRGF0ZU9ubHkodmFsdWUgPSBub3dJc28oKSkge1xuICAgIHJldHVybiB0b0lzbyhwYXJzZVRvRGF0ZSh2YWx1ZSkgPz8gbm93SXNvKCkpLnNsaWNlKDAsIDEwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRNb250aFllYXIodmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBtb250aDogXCJzaG9ydFwiLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgdGltZVpvbmU6IGdldERpc3BsYXlUaW1lem9uZShvcHRzLnRpbWVab25lKSxcbiAgICB9KS5mb3JtYXQoZGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNQYXN0KHZhbHVlLCBub3cgPSBub3dJc28oKSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudCA9IHBhcnNlVG9EYXRlKG5vdyk7XG4gICAgcmV0dXJuIEJvb2xlYW4oZGF0ZSAmJiBjdXJyZW50ICYmIGRhdGUuZ2V0VGltZSgpIDwgY3VycmVudC5nZXRUaW1lKCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRnV0dXJlKHZhbHVlLCBub3cgPSBub3dJc28oKSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgY29uc3QgY3VycmVudCA9IHBhcnNlVG9EYXRlKG5vdyk7XG4gICAgcmV0dXJuIEJvb2xlYW4oZGF0ZSAmJiBjdXJyZW50ICYmIGRhdGUuZ2V0VGltZSgpID4gY3VycmVudC5nZXRUaW1lKCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZTZWNvbmRzKGEsIGIpIHtcbiAgICBjb25zdCBmaXJzdCA9IHBhcnNlVG9EYXRlKGEpO1xuICAgIGNvbnN0IHNlY29uZCA9IHBhcnNlVG9EYXRlKGIpO1xuICAgIGlmICghZmlyc3QgfHwgIXNlY29uZClcbiAgICAgICAgcmV0dXJuIE51bWJlci5OYU47XG4gICAgcmV0dXJuIE1hdGgudHJ1bmMoKGZpcnN0LmdldFRpbWUoKSAtIHNlY29uZC5nZXRUaW1lKCkpIC8gMTAwMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGlmZkRheXMoYSwgYikge1xuICAgIGNvbnN0IHNlY29uZHMgPSBkaWZmU2Vjb25kcyhhLCBiKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKHNlY29uZHMpID8gTnVtYmVyLk5hTiA6IHNlY29uZHMgLyA4NjQwMDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGREYXlzKHZhbHVlLCBkYXlzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgZGF5cyAqIDg2NDAwMDAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRNaW51dGVzKHZhbHVlLCBtaW51dGVzKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIGRhdGUgdmFsdWVcIik7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgbWludXRlcyAqIDYwMDAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdGFydE9mRGF5KHZhbHVlLCB0aW1lWm9uZSA9IFwiVVRDXCIpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICBpZiAodGltZVpvbmUgPT09IFwiVVRDXCIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSwgZGF0ZS5nZXRVVENNb250aCgpLCBkYXRlLmdldFVUQ0RhdGUoKSkpO1xuICAgIH1cbiAgICBjb25zdCBwYXJ0cyA9IGdldFpvbmVkUGFydHMoZGF0ZSwgdGltZVpvbmUpO1xuICAgIHJldHVybiB6b25lZFRpbWVUb1V0YyhwYXJ0cy55ZWFyLCBwYXJ0cy5tb250aCwgcGFydHMuZGF5LCAwLCAwLCAwLCB0aW1lWm9uZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZW5kT2ZEYXkodmFsdWUsIHRpbWVab25lID0gXCJVVENcIikge1xuICAgIHJldHVybiBhZGRNaW51dGVzKGFkZERheXMoc3RhcnRPZkRheSh2YWx1ZSwgdGltZVpvbmUpLCAxKSwgLTEgLyA2MDAwMCk7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9Vc2VyVHoodmFsdWUsIHRpbWVab25lID0gZ2V0VXNlclRpbWV6b25lKCkpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICBjb25zdCBwYXJ0cyA9IGdldFpvbmVkUGFydHMoZGF0ZSwgdGltZVpvbmUpO1xuICAgIHJldHVybiBuZXcgRGF0ZShwYXJ0cy55ZWFyLCBwYXJ0cy5tb250aCAtIDEsIHBhcnRzLmRheSwgcGFydHMuaG91ciwgcGFydHMubWludXRlLCBwYXJ0cy5zZWNvbmQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERhdGVBYnNvbHV0ZShkYXRlLCBsb2NhbGUgPSBERUZBVUxUX0xPQ0FMRSkge1xuICAgIHJldHVybiBmb3JtYXRBYnNvbHV0ZShkYXRlLCB7IGxvY2FsZSB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREYXRlUmVsYXRpdmUoZGF0ZSwgbm93ID0gbm93SXNvKCkpIHtcbiAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmUoZGF0ZSwgeyBub3cgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJvd3NlckRlZmF1bHRMb2NhbGUoKSB7XG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBERUZBVUxUX0xPQ0FMRTtcbiAgICByZXR1cm4gbm9ybWFsaXplTG9jYWxlKG5hdmlnYXRvci5sYW5ndWFnZSk7XG59XG5mdW5jdGlvbiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldCh2YWx1ZSwgdW5pdCwgaXNGdXR1cmUpIHtcbiAgICByZXR1cm4gaXNGdXR1cmUgPyBgaW4gJHt2YWx1ZX0ke3VuaXR9YCA6IGAke3ZhbHVlfSR7dW5pdH0gYWdvYDtcbn1cbmZ1bmN0aW9uIGdldFpvbmVkUGFydHMoZGF0ZSwgdGltZVpvbmUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KE5VTUVSSUNfUEFSVFNfTE9DQUxFLCB7XG4gICAgICAgIHRpbWVab25lLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgbW9udGg6IFwiMi1kaWdpdFwiLFxuICAgICAgICBkYXk6IFwiMi1kaWdpdFwiLFxuICAgICAgICBob3VyOiBcIjItZGlnaXRcIixcbiAgICAgICAgbWludXRlOiBcIjItZGlnaXRcIixcbiAgICAgICAgc2Vjb25kOiBcIjItZGlnaXRcIixcbiAgICAgICAgaG91ckN5Y2xlOiBcImgyM1wiLFxuICAgIH0pLmZvcm1hdFRvUGFydHMoZGF0ZSk7XG4gICAgY29uc3QgZ2V0ID0gKHR5cGUpID0+IE51bWJlcihwYXJ0cy5maW5kKChwYXJ0KSA9PiBwYXJ0LnR5cGUgPT09IHR5cGUpPy52YWx1ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeWVhcjogZ2V0KFwieWVhclwiKSxcbiAgICAgICAgbW9udGg6IGdldChcIm1vbnRoXCIpLFxuICAgICAgICBkYXk6IGdldChcImRheVwiKSxcbiAgICAgICAgaG91cjogZ2V0KFwiaG91clwiKSxcbiAgICAgICAgbWludXRlOiBnZXQoXCJtaW51dGVcIiksXG4gICAgICAgIHNlY29uZDogZ2V0KFwic2Vjb25kXCIpLFxuICAgIH07XG59XG5mdW5jdGlvbiB6b25lZFRpbWVUb1V0Yyh5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCwgdGltZVpvbmUpIHtcbiAgICBjb25zdCB1dGNHdWVzcyA9IG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoIC0gMSwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZCkpO1xuICAgIGNvbnN0IHBhcnRzID0gZ2V0Wm9uZWRQYXJ0cyh1dGNHdWVzcywgdGltZVpvbmUpO1xuICAgIGNvbnN0IG9mZnNldE1zID0gRGF0ZS5VVEMocGFydHMueWVhciwgcGFydHMubW9udGggLSAxLCBwYXJ0cy5kYXksIHBhcnRzLmhvdXIsIHBhcnRzLm1pbnV0ZSwgcGFydHMuc2Vjb25kKSAtIHV0Y0d1ZXNzLmdldFRpbWUoKTtcbiAgICByZXR1cm4gbmV3IERhdGUodXRjR3Vlc3MuZ2V0VGltZSgpIC0gb2Zmc2V0TXMpO1xufVxuIiwiZXhwb3J0IGNvbnN0IFNVQl9TQ09SRV9NQVhfUE9JTlRTID0ge1xuICAgIHNlY3Rpb25Db21wbGV0ZW5lc3M6IDEwLFxuICAgIGFjdGlvblZlcmJzOiAxNSxcbiAgICBxdWFudGlmaWVkQWNoaWV2ZW1lbnRzOiAyMCxcbiAgICBrZXl3b3JkTWF0Y2g6IDI1LFxuICAgIGxlbmd0aDogMTAsXG4gICAgc3BlbGxpbmdHcmFtbWFyOiAxMCxcbiAgICBhdHNGcmllbmRsaW5lc3M6IDEwLFxufTtcbmV4cG9ydCBjb25zdCBBQ1RJT05fVkVSQlMgPSBbXG4gICAgXCJhY2hpZXZlZFwiLFxuICAgIFwiYW5hbHl6ZWRcIixcbiAgICBcImFyY2hpdGVjdGVkXCIsXG4gICAgXCJidWlsdFwiLFxuICAgIFwiY29sbGFib3JhdGVkXCIsXG4gICAgXCJjcmVhdGVkXCIsXG4gICAgXCJkZWxpdmVyZWRcIixcbiAgICBcImRlc2lnbmVkXCIsXG4gICAgXCJkZXZlbG9wZWRcIixcbiAgICBcImRyb3ZlXCIsXG4gICAgXCJpbXByb3ZlZFwiLFxuICAgIFwiaW5jcmVhc2VkXCIsXG4gICAgXCJsYXVuY2hlZFwiLFxuICAgIFwibGVkXCIsXG4gICAgXCJtYW5hZ2VkXCIsXG4gICAgXCJtZW50b3JlZFwiLFxuICAgIFwib3B0aW1pemVkXCIsXG4gICAgXCJyZWR1Y2VkXCIsXG4gICAgXCJyZXNvbHZlZFwiLFxuICAgIFwic2hpcHBlZFwiLFxuICAgIFwic3RyZWFtbGluZWRcIixcbiAgICBcInN1cHBvcnRlZFwiLFxuICAgIFwidHJhbnNmb3JtZWRcIixcbl07XG5leHBvcnQgY29uc3QgUVVBTlRJRklFRF9SRUdFWCA9IC9cXGQrJXxcXCRbXFxkLF0rKD86XFwuXFxkKyk/W2tLbU1iQl0/fFxcYlxcZCt4XFxifFxcYnRlYW0gb2YgXFxkK1xcYnxcXGJcXGQrXFxzKyh1c2Vyc3xjdXN0b21lcnN8Y2xpZW50c3xwcm9qZWN0c3xwZW9wbGV8ZW5naW5lZXJzfHJlcG9ydHN8aG91cnN8bWVtYmVyc3xjb3VudHJpZXN8bGFuZ3VhZ2VzfHN0YXRlc3xjaXRpZXN8c3RvcmVzfHBhcnRuZXJzfGRlYWxzfGxlYWRzKVxcYi9naTtcbiIsImV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVUZXh0KHRleHQpIHtcbiAgICByZXR1cm4gdGV4dFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAucmVwbGFjZSgvW15hLXowLTkrIy5cXHMvLV0vZywgXCIgXCIpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiIFwiKVxuICAgICAgICAudHJpbSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB3b3JkQm91bmRhcnlSZWdleCh0ZXJtLCBmbGFncyA9IFwiXCIpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXFxcXGIke2VzY2FwZVJlZ0V4cCh0ZXJtKX1cXFxcYmAsIGZsYWdzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb250YWluc1dvcmQodGV4dCwgdGVybSkge1xuICAgIHJldHVybiB3b3JkQm91bmRhcnlSZWdleCh0ZXJtKS50ZXN0KHRleHQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50V29yZE9jY3VycmVuY2VzKHRleHQsIHRlcm0pIHtcbiAgICByZXR1cm4gKHRleHQubWF0Y2god29yZEJvdW5kYXJ5UmVnZXgodGVybSwgXCJnXCIpKSB8fCBbXSkubGVuZ3RoO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEhpZ2hsaWdodHMocHJvZmlsZSkge1xuICAgIHJldHVybiBbXG4gICAgICAgIC4uLnByb2ZpbGUuZXhwZXJpZW5jZXMuZmxhdE1hcCgoZXhwZXJpZW5jZSkgPT4gZXhwZXJpZW5jZS5oaWdobGlnaHRzKSxcbiAgICAgICAgLi4ucHJvZmlsZS5wcm9qZWN0cy5mbGF0TWFwKChwcm9qZWN0KSA9PiBwcm9qZWN0LmhpZ2hsaWdodHMpLFxuICAgIF0uZmlsdGVyKEJvb2xlYW4pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RQcm9maWxlVGV4dChwcm9maWxlKSB7XG4gICAgY29uc3QgcGFydHMgPSBbXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ubmFtZSxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5lbWFpbCxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5waG9uZSxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5sb2NhdGlvbixcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5saW5rZWRpbixcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5naXRodWIsXG4gICAgICAgIHByb2ZpbGUuY29udGFjdD8ud2Vic2l0ZSxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5oZWFkbGluZSxcbiAgICAgICAgcHJvZmlsZS5zdW1tYXJ5LFxuICAgICAgICAuLi5wcm9maWxlLmV4cGVyaWVuY2VzLmZsYXRNYXAoKGV4cGVyaWVuY2UpID0+IFtcbiAgICAgICAgICAgIGV4cGVyaWVuY2UudGl0bGUsXG4gICAgICAgICAgICBleHBlcmllbmNlLmNvbXBhbnksXG4gICAgICAgICAgICBleHBlcmllbmNlLmxvY2F0aW9uLFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIC4uLmV4cGVyaWVuY2UuaGlnaGxpZ2h0cyxcbiAgICAgICAgICAgIC4uLmV4cGVyaWVuY2Uuc2tpbGxzLFxuICAgICAgICAgICAgZXhwZXJpZW5jZS5zdGFydERhdGUsXG4gICAgICAgICAgICBleHBlcmllbmNlLmVuZERhdGUsXG4gICAgICAgIF0pLFxuICAgICAgICAuLi5wcm9maWxlLmVkdWNhdGlvbi5mbGF0TWFwKChlZHVjYXRpb24pID0+IFtcbiAgICAgICAgICAgIGVkdWNhdGlvbi5pbnN0aXR1dGlvbixcbiAgICAgICAgICAgIGVkdWNhdGlvbi5kZWdyZWUsXG4gICAgICAgICAgICBlZHVjYXRpb24uZmllbGQsXG4gICAgICAgICAgICAuLi5lZHVjYXRpb24uaGlnaGxpZ2h0cyxcbiAgICAgICAgICAgIGVkdWNhdGlvbi5zdGFydERhdGUsXG4gICAgICAgICAgICBlZHVjYXRpb24uZW5kRGF0ZSxcbiAgICAgICAgXSksXG4gICAgICAgIC4uLnByb2ZpbGUuc2tpbGxzLm1hcCgoc2tpbGwpID0+IHNraWxsLm5hbWUpLFxuICAgICAgICAuLi5wcm9maWxlLnByb2plY3RzLmZsYXRNYXAoKHByb2plY3QpID0+IFtcbiAgICAgICAgICAgIHByb2plY3QubmFtZSxcbiAgICAgICAgICAgIHByb2plY3QuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBwcm9qZWN0LnVybCxcbiAgICAgICAgICAgIC4uLnByb2plY3QuaGlnaGxpZ2h0cyxcbiAgICAgICAgICAgIC4uLnByb2plY3QudGVjaG5vbG9naWVzLFxuICAgICAgICBdKSxcbiAgICAgICAgLi4ucHJvZmlsZS5jZXJ0aWZpY2F0aW9ucy5mbGF0TWFwKChjZXJ0aWZpY2F0aW9uKSA9PiBbXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uLm5hbWUsXG4gICAgICAgICAgICBjZXJ0aWZpY2F0aW9uLmlzc3VlcixcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb24uZGF0ZSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb24udXJsLFxuICAgICAgICBdKSxcbiAgICBdO1xuICAgIHJldHVybiBwYXJ0cy5maWx0ZXIoQm9vbGVhbikuam9pbihcIlxcblwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXN1bWVUZXh0KHByb2ZpbGUsIHJhd1RleHQpIHtcbiAgICByZXR1cm4gKHJhd1RleHQ/LnRyaW0oKSB8fCBwcm9maWxlLnJhd1RleHQ/LnRyaW0oKSB8fCBleHRyYWN0UHJvZmlsZVRleHQocHJvZmlsZSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdvcmRDb3VudCh0ZXh0KSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVRleHQodGV4dCk7XG4gICAgaWYgKCFub3JtYWxpemVkKVxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gbm9ybWFsaXplZC5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG59XG4iLCJpbXBvcnQgeyBBQ1RJT05fVkVSQlMsIFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRIaWdobGlnaHRzLCBub3JtYWxpemVUZXh0LCB3b3JkQm91bmRhcnlSZWdleCB9IGZyb20gXCIuL3RleHRcIjtcbmZ1bmN0aW9uIHBvaW50c0ZvckRpc3RpbmN0VmVyYnMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgIHJldHVybiAwO1xuICAgIGlmIChjb3VudCA8PSAyKVxuICAgICAgICByZXR1cm4gNTtcbiAgICBpZiAoY291bnQgPD0gNClcbiAgICAgICAgcmV0dXJuIDk7XG4gICAgaWYgKGNvdW50IDw9IDcpXG4gICAgICAgIHJldHVybiAxMjtcbiAgICByZXR1cm4gMTU7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVBY3Rpb25WZXJicyhpbnB1dCkge1xuICAgIGNvbnN0IGRpc3RpbmN0VmVyYnMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChjb25zdCBoaWdobGlnaHQgb2YgZ2V0SGlnaGxpZ2h0cyhpbnB1dC5wcm9maWxlKSkge1xuICAgICAgICBjb25zdCBmaXJzdFdvcmQgPSBub3JtYWxpemVUZXh0KGhpZ2hsaWdodCkuc3BsaXQoL1xccysvKVswXSA/PyBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHZlcmIgb2YgQUNUSU9OX1ZFUkJTKSB7XG4gICAgICAgICAgICBpZiAod29yZEJvdW5kYXJ5UmVnZXgodmVyYikudGVzdChmaXJzdFdvcmQpKSB7XG4gICAgICAgICAgICAgICAgZGlzdGluY3RWZXJicy5hZGQodmVyYik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdmVyYnMgPSBBcnJheS5mcm9tKGRpc3RpbmN0VmVyYnMpLnNvcnQoKTtcbiAgICBjb25zdCBub3RlcyA9IHZlcmJzLmxlbmd0aCA9PT0gMFxuICAgICAgICA/IFtcIlN0YXJ0IGFjaGlldmVtZW50IGJ1bGxldHMgd2l0aCBzdHJvbmcgYWN0aW9uIHZlcmJzLlwiXVxuICAgICAgICA6IFtdO1xuICAgIGNvbnN0IHByZXZpZXcgPSB2ZXJicy5zbGljZSgwLCA1KS5qb2luKFwiLCBcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImFjdGlvblZlcmJzXCIsXG4gICAgICAgIGxhYmVsOiBcIkFjdGlvbiB2ZXJic1wiLFxuICAgICAgICBlYXJuZWQ6IHBvaW50c0ZvckRpc3RpbmN0VmVyYnModmVyYnMubGVuZ3RoKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5hY3Rpb25WZXJicyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbXG4gICAgICAgICAgICBwcmV2aWV3XG4gICAgICAgICAgICAgICAgPyBgJHt2ZXJicy5sZW5ndGh9IGRpc3RpbmN0IGFjdGlvbiB2ZXJicyAoJHtwcmV2aWV3fSlgXG4gICAgICAgICAgICAgICAgOiBcIjAgZGlzdGluY3QgYWN0aW9uIHZlcmJzXCIsXG4gICAgICAgIF0sXG4gICAgfTtcbn1cbiIsImV4cG9ydCBjb25zdCBQUk9CTEVNQVRJQ19DSEFSQUNURVJTID0gW1xuICAgIHsgY2hhcjogXCJcXHUyMDIyXCIsIG5hbWU6IFwiYnVsbGV0IHBvaW50XCIsIHJlcGxhY2VtZW50OiBcIi1cIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDEzXCIsIG5hbWU6IFwiZW4gZGFzaFwiLCByZXBsYWNlbWVudDogXCItXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxNFwiLCBuYW1lOiBcImVtIGRhc2hcIiwgcmVwbGFjZW1lbnQ6IFwiLVwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMWNcIiwgbmFtZTogXCJjdXJseSBxdW90ZSBsZWZ0XCIsIHJlcGxhY2VtZW50OiAnXCInIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMWRcIiwgbmFtZTogXCJjdXJseSBxdW90ZSByaWdodFwiLCByZXBsYWNlbWVudDogJ1wiJyB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDE4XCIsIG5hbWU6IFwiY3VybHkgYXBvc3Ryb3BoZSBsZWZ0XCIsIHJlcGxhY2VtZW50OiBcIidcIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDE5XCIsIG5hbWU6IFwiY3VybHkgYXBvc3Ryb3BoZSByaWdodFwiLCByZXBsYWNlbWVudDogXCInXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAyNlwiLCBuYW1lOiBcImVsbGlwc2lzXCIsIHJlcGxhY2VtZW50OiBcIi4uLlwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTAwYTlcIiwgbmFtZTogXCJjb3B5cmlnaHRcIiwgcmVwbGFjZW1lbnQ6IFwiKGMpXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MDBhZVwiLCBuYW1lOiBcInJlZ2lzdGVyZWRcIiwgcmVwbGFjZW1lbnQ6IFwiKFIpXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjEyMlwiLCBuYW1lOiBcInRyYWRlbWFya1wiLCByZXBsYWNlbWVudDogXCIoVE0pXCIgfSxcbl07XG4iLCJpbXBvcnQgeyBQUk9CTEVNQVRJQ19DSEFSQUNURVJTIH0gZnJvbSBcIi4vYXRzLWNoYXJhY3RlcnNcIjtcbmltcG9ydCB7IFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXN1bWVUZXh0IH0gZnJvbSBcIi4vdGV4dFwiO1xuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlQXRzRnJpZW5kbGluZXNzKGlucHV0KSB7XG4gICAgY29uc3QgdGV4dCA9IGdldFJlc3VtZVRleHQoaW5wdXQucHJvZmlsZSwgaW5wdXQucmF3VGV4dCk7XG4gICAgY29uc3QgcmF3VGV4dCA9IGlucHV0LnJhd1RleHQgPz8gaW5wdXQucHJvZmlsZS5yYXdUZXh0ID8/IFwiXCI7XG4gICAgY29uc3Qgbm90ZXMgPSBbXTtcbiAgICBjb25zdCBldmlkZW5jZSA9IFtdO1xuICAgIGxldCBkZWR1Y3Rpb25zID0gMDtcbiAgICBjb25zdCBmb3VuZFByb2JsZW1hdGljID0gUFJPQkxFTUFUSUNfQ0hBUkFDVEVSUy5maWx0ZXIoKHsgY2hhciB9KSA9PiB0ZXh0LmluY2x1ZGVzKGNoYXIpKTtcbiAgICBpZiAoZm91bmRQcm9ibGVtYXRpYy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1pbigzLCBmb3VuZFByb2JsZW1hdGljLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlNwZWNpYWwgZm9ybWF0dGluZyBjaGFyYWN0ZXJzIGNhbiByZWR1Y2UgQVRTIHBhcnNlIHF1YWxpdHkuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGAke2ZvdW5kUHJvYmxlbWF0aWMubGVuZ3RofSBzcGVjaWFsIGNoYXJhY3RlcnNgKTtcbiAgICB9XG4gICAgY29uc3QgYmFkQ2hhcnMgPSAodGV4dC5tYXRjaCgvW1xcdUZGRkRcXHUwMDAwLVxcdTAwMDhcXHUwMDBCXFx1MDAwQ1xcdTAwMEUtXFx1MDAxRl0vZykgfHwgW10pLmxlbmd0aDtcbiAgICBpZiAoYmFkQ2hhcnMgPiAwKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIkNvbnRyb2wgb3IgcmVwbGFjZW1lbnQgY2hhcmFjdGVycyBkZXRlY3RlZC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYCR7YmFkQ2hhcnN9IGNvbnRyb2wgb3IgcmVwbGFjZW1lbnQgY2hhcmFjdGVyKHMpYCk7XG4gICAgfVxuICAgIGlmIChyYXdUZXh0LmluY2x1ZGVzKFwiXFx0XCIpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIlRhYiBjaGFyYWN0ZXJzIG1heSBpbmRpY2F0ZSB0YWJsZS1zdHlsZSBmb3JtYXR0aW5nLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIlRhYiBjaGFyYWN0ZXJzIGZvdW5kXCIpO1xuICAgIH1cbiAgICBjb25zdCBsb25nTGluZXMgPSByYXdUZXh0LnNwbGl0KC9cXHI/XFxuLykuZmlsdGVyKChsaW5lKSA9PiBsaW5lLmxlbmd0aCA+IDIwMCk7XG4gICAgaWYgKGxvbmdMaW5lcy5sZW5ndGggPj0gNCkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJWZXJ5IGxvbmcgbGluZXMgbWF5IGluZGljYXRlIG11bHRpLWNvbHVtbiBvciB0YWJsZSBmb3JtYXR0aW5nLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgJHtsb25nTGluZXMubGVuZ3RofSBvdmVyLWxvbmcgbGluZXNgKTtcbiAgICB9XG4gICAgaWYgKC88W2EtekEtWi9dW14+XSo+Ly50ZXN0KHJhd1RleHQpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIkhUTUwgdGFncyBkZXRlY3RlZCBpbiByZXN1bWUgdGV4dC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJIVE1MIHRhZ3MgZm91bmRcIik7XG4gICAgfVxuICAgIGlmICghL1tcXHcuKy1dK0BbXFx3Li1dK1xcLlthLXpBLVpdezIsfS8udGVzdCh0ZXh0KSkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDI7XG4gICAgICAgIG5vdGVzLnB1c2goXCJObyBlbWFpbCBwYXR0ZXJuIGRldGVjdGVkIGluIHBhcnNlYWJsZSByZXN1bWUgdGV4dC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJObyBlbWFpbCBkZXRlY3RlZFwiKTtcbiAgICB9XG4gICAgaWYgKGlucHV0LnJhd1RleHQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBpbnB1dC5yYXdUZXh0LnRyaW0oKS5sZW5ndGggPCAyMDAgJiZcbiAgICAgICAgaW5wdXQucHJvZmlsZS5leHBlcmllbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMztcbiAgICAgICAgbm90ZXMucHVzaChcIkV4dHJhY3RlZCB0ZXh0IGlzIHZlcnkgc2hvcnQgZm9yIGEgcmVzdW1lIHdpdGggZXhwZXJpZW5jZS5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goXCJQb3NzaWJsZSBpbWFnZS1vbmx5IFBERlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImF0c0ZyaWVuZGxpbmVzc1wiLFxuICAgICAgICBsYWJlbDogXCJBVFMgZnJpZW5kbGluZXNzXCIsXG4gICAgICAgIGVhcm5lZDogTWF0aC5tYXgoMCwgU1VCX1NDT1JFX01BWF9QT0lOVFMuYXRzRnJpZW5kbGluZXNzIC0gZGVkdWN0aW9ucyksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMuYXRzRnJpZW5kbGluZXNzLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IGV2aWRlbmNlLmxlbmd0aCA+IDAgPyBldmlkZW5jZSA6IFtcIk5vIEFUUyBmb3JtYXR0aW5nIGlzc3VlcyBkZXRlY3RlZC5cIl0sXG4gICAgfTtcbn1cbiIsIi8qKlxuICogU3lub255bSBncm91cHMgZm9yIHNlbWFudGljIGtleXdvcmQgbWF0Y2hpbmcgaW4gQVRTIHNjb3JpbmcuXG4gKiBFYWNoIGdyb3VwIG1hcHMgYSBjYW5vbmljYWwgdGVybSB0byBpdHMgc3lub255bXMvdmFyaWF0aW9ucy5cbiAqIEFsbCB0ZXJtcyBzaG91bGQgYmUgbG93ZXJjYXNlLlxuICovXG5leHBvcnQgY29uc3QgU1lOT05ZTV9HUk9VUFMgPSBbXG4gICAgLy8gUHJvZ3JhbW1pbmcgTGFuZ3VhZ2VzXG4gICAgeyBjYW5vbmljYWw6IFwiamF2YXNjcmlwdFwiLCBzeW5vbnltczogW1wianNcIiwgXCJlY21hc2NyaXB0XCIsIFwiZXM2XCIsIFwiZXMyMDE1XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwidHlwZXNjcmlwdFwiLCBzeW5vbnltczogW1widHNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJweXRob25cIiwgc3lub255bXM6IFtcInB5XCIsIFwicHl0aG9uM1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImdvbGFuZ1wiLCBzeW5vbnltczogW1wiZ29cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJjI1wiLCBzeW5vbnltczogW1wiY3NoYXJwXCIsIFwiYyBzaGFycFwiLCBcImRvdG5ldFwiLCBcIi5uZXRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJjKytcIiwgc3lub255bXM6IFtcImNwcFwiLCBcImNwbHVzcGx1c1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInJ1YnlcIiwgc3lub255bXM6IFtcInJiXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwia290bGluXCIsIHN5bm9ueW1zOiBbXCJrdFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm9iamVjdGl2ZS1jXCIsIHN5bm9ueW1zOiBbXCJvYmpjXCIsIFwib2JqLWNcIl0gfSxcbiAgICAvLyBGcm9udGVuZCBGcmFtZXdvcmtzXG4gICAgeyBjYW5vbmljYWw6IFwicmVhY3RcIiwgc3lub255bXM6IFtcInJlYWN0anNcIiwgXCJyZWFjdC5qc1wiLCBcInJlYWN0IGpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiYW5ndWxhclwiLCBzeW5vbnltczogW1wiYW5ndWxhcmpzXCIsIFwiYW5ndWxhci5qc1wiLCBcImFuZ3VsYXIganNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJ2dWVcIiwgc3lub255bXM6IFtcInZ1ZWpzXCIsIFwidnVlLmpzXCIsIFwidnVlIGpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibmV4dC5qc1wiLCBzeW5vbnltczogW1wibmV4dGpzXCIsIFwibmV4dCBqc1wiLCBcIm5leHRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJudXh0XCIsIHN5bm9ueW1zOiBbXCJudXh0anNcIiwgXCJudXh0LmpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwic3ZlbHRlXCIsIHN5bm9ueW1zOiBbXCJzdmVsdGVqc1wiLCBcInN2ZWx0ZWtpdFwiXSB9LFxuICAgIC8vIEJhY2tlbmQgRnJhbWV3b3Jrc1xuICAgIHsgY2Fub25pY2FsOiBcIm5vZGUuanNcIiwgc3lub255bXM6IFtcIm5vZGVqc1wiLCBcIm5vZGUganNcIiwgXCJub2RlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZXhwcmVzc1wiLCBzeW5vbnltczogW1wiZXhwcmVzc2pzXCIsIFwiZXhwcmVzcy5qc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImRqYW5nb1wiLCBzeW5vbnltczogW1wiZGphbmdvIHJlc3QgZnJhbWV3b3JrXCIsIFwiZHJmXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmxhc2tcIiwgc3lub255bXM6IFtcImZsYXNrIHB5dGhvblwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInNwcmluZ1wiLCBzeW5vbnltczogW1wic3ByaW5nIGJvb3RcIiwgXCJzcHJpbmdib290XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicnVieSBvbiByYWlsc1wiLCBzeW5vbnltczogW1wicmFpbHNcIiwgXCJyb3JcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJmYXN0YXBpXCIsIHN5bm9ueW1zOiBbXCJmYXN0IGFwaVwiXSB9LFxuICAgIC8vIERhdGFiYXNlc1xuICAgIHsgY2Fub25pY2FsOiBcInBvc3RncmVzcWxcIiwgc3lub255bXM6IFtcInBvc3RncmVzXCIsIFwicHNxbFwiLCBcInBnXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibW9uZ29kYlwiLCBzeW5vbnltczogW1wibW9uZ29cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJteXNxbFwiLCBzeW5vbnltczogW1wibWFyaWFkYlwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImR5bmFtb2RiXCIsIHN5bm9ueW1zOiBbXCJkeW5hbW8gZGJcIiwgXCJkeW5hbW9cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJlbGFzdGljc2VhcmNoXCIsIHN5bm9ueW1zOiBbXCJlbGFzdGljIHNlYXJjaFwiLCBcImVsYXN0aWNcIiwgXCJlc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInJlZGlzXCIsIHN5bm9ueW1zOiBbXCJyZWRpcyBjYWNoZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInNxbFwiLCBzeW5vbnltczogW1wic3RydWN0dXJlZCBxdWVyeSBsYW5ndWFnZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm5vc3FsXCIsIHN5bm9ueW1zOiBbXCJubyBzcWxcIiwgXCJub24tcmVsYXRpb25hbFwiXSB9LFxuICAgIC8vIENsb3VkICYgSW5mcmFzdHJ1Y3R1cmVcbiAgICB7IGNhbm9uaWNhbDogXCJhd3NcIiwgc3lub255bXM6IFtcImFtYXpvbiB3ZWIgc2VydmljZXNcIiwgXCJhbWF6b24gY2xvdWRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJnY3BcIiwgc3lub255bXM6IFtcImdvb2dsZSBjbG91ZFwiLCBcImdvb2dsZSBjbG91ZCBwbGF0Zm9ybVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImF6dXJlXCIsIHN5bm9ueW1zOiBbXCJtaWNyb3NvZnQgYXp1cmVcIiwgXCJtcyBhenVyZVwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImRvY2tlclwiLCBzeW5vbnltczogW1wiY29udGFpbmVyaXphdGlvblwiLCBcImNvbnRhaW5lcnNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJrdWJlcm5ldGVzXCIsIHN5bm9ueW1zOiBbXCJrOHNcIiwgXCJrdWJlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwidGVycmFmb3JtXCIsIHN5bm9ueW1zOiBbXCJpbmZyYXN0cnVjdHVyZSBhcyBjb2RlXCIsIFwiaWFjXCJdIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY2kvY2RcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwiY2ljZFwiLFxuICAgICAgICAgICAgXCJjaSBjZFwiLFxuICAgICAgICAgICAgXCJjb250aW51b3VzIGludGVncmF0aW9uXCIsXG4gICAgICAgICAgICBcImNvbnRpbnVvdXMgZGVwbG95bWVudFwiLFxuICAgICAgICAgICAgXCJjb250aW51b3VzIGRlbGl2ZXJ5XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJkZXZvcHNcIiwgc3lub255bXM6IFtcImRldiBvcHNcIiwgXCJzaXRlIHJlbGlhYmlsaXR5XCIsIFwic3JlXCJdIH0sXG4gICAgLy8gVG9vbHMgJiBQbGF0Zm9ybXNcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJnaXRcIixcbiAgICAgICAgc3lub255bXM6IFtcImdpdGh1YlwiLCBcImdpdGxhYlwiLCBcImJpdGJ1Y2tldFwiLCBcInZlcnNpb24gY29udHJvbFwiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcImppcmFcIiwgc3lub255bXM6IFtcImF0bGFzc2lhbiBqaXJhXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmlnbWFcIiwgc3lub255bXM6IFtcImZpZ21hIGRlc2lnblwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIndlYnBhY2tcIiwgc3lub255bXM6IFtcIm1vZHVsZSBidW5kbGVyXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZ3JhcGhxbFwiLCBzeW5vbnltczogW1wiZ3JhcGggcWxcIiwgXCJncWxcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJyZXN0IGFwaVwiLFxuICAgICAgICBzeW5vbnltczogW1wicmVzdGZ1bFwiLCBcInJlc3RmdWwgYXBpXCIsIFwicmVzdFwiLCBcImFwaVwiXSxcbiAgICB9LFxuICAgIC8vIFJvbGUgVGVybXNcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJmcm9udGVuZFwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJmcm9udC1lbmRcIixcbiAgICAgICAgICAgIFwiZnJvbnQgZW5kXCIsXG4gICAgICAgICAgICBcImNsaWVudC1zaWRlXCIsXG4gICAgICAgICAgICBcImNsaWVudCBzaWRlXCIsXG4gICAgICAgICAgICBcInVpIGRldmVsb3BtZW50XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJiYWNrZW5kXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJiYWNrLWVuZFwiLCBcImJhY2sgZW5kXCIsIFwic2VydmVyLXNpZGVcIiwgXCJzZXJ2ZXIgc2lkZVwiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcImZ1bGxzdGFja1wiLCBzeW5vbnltczogW1wiZnVsbC1zdGFja1wiLCBcImZ1bGwgc3RhY2tcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJzb2Z0d2FyZSBlbmdpbmVlclwiLFxuICAgICAgICBzeW5vbnltczogW1wic29mdHdhcmUgZGV2ZWxvcGVyXCIsIFwic3dlXCIsIFwiZGV2ZWxvcGVyXCIsIFwicHJvZ3JhbW1lclwiLCBcImNvZGVyXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZGF0YSBzY2llbnRpc3RcIixcbiAgICAgICAgc3lub255bXM6IFtcImRhdGEgc2NpZW5jZVwiLCBcIm1sIGVuZ2luZWVyXCIsIFwibWFjaGluZSBsZWFybmluZyBlbmdpbmVlclwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImRhdGEgZW5naW5lZXJcIixcbiAgICAgICAgc3lub255bXM6IFtcImRhdGEgZW5naW5lZXJpbmdcIiwgXCJldGwgZGV2ZWxvcGVyXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicHJvZHVjdCBtYW5hZ2VyXCIsIHN5bm9ueW1zOiBbXCJwbVwiLCBcInByb2R1Y3Qgb3duZXJcIiwgXCJwb1wiXSB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInFhIGVuZ2luZWVyXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJxdWFsaXR5IGFzc3VyYW5jZVwiLCBcInFhXCIsIFwidGVzdCBlbmdpbmVlclwiLCBcInNkZXRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ1eCBkZXNpZ25lclwiLFxuICAgICAgICBzeW5vbnltczogW1widXhcIiwgXCJ1c2VyIGV4cGVyaWVuY2VcIiwgXCJ1aS91eFwiLCBcInVpIHV4XCJdLFxuICAgIH0sXG4gICAgLy8gTWV0aG9kb2xvZ2llc1xuICAgIHsgY2Fub25pY2FsOiBcImFnaWxlXCIsIHN5bm9ueW1zOiBbXCJzY3J1bVwiLCBcImthbmJhblwiLCBcInNwcmludFwiLCBcInNwcmludHNcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ0ZGRcIixcbiAgICAgICAgc3lub255bXM6IFtcInRlc3QgZHJpdmVuIGRldmVsb3BtZW50XCIsIFwidGVzdC1kcml2ZW4gZGV2ZWxvcG1lbnRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJiZGRcIixcbiAgICAgICAgc3lub255bXM6IFtcImJlaGF2aW9yIGRyaXZlbiBkZXZlbG9wbWVudFwiLCBcImJlaGF2aW9yLWRyaXZlbiBkZXZlbG9wbWVudFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcIm1pY3Jvc2VydmljZXNcIixcbiAgICAgICAgc3lub255bXM6IFtcIm1pY3JvIHNlcnZpY2VzXCIsIFwibWljcm8tc2VydmljZXNcIiwgXCJzZXJ2aWNlLW9yaWVudGVkXCJdLFxuICAgIH0sXG4gICAgLy8gU29mdCBTa2lsbHNcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJsZWFkZXJzaGlwXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcImxlZFwiLFxuICAgICAgICAgICAgXCJtYW5hZ2VkXCIsXG4gICAgICAgICAgICBcImRpcmVjdGVkXCIsXG4gICAgICAgICAgICBcInN1cGVydmlzZWRcIixcbiAgICAgICAgICAgIFwibWVudG9yZWRcIixcbiAgICAgICAgICAgIFwidGVhbSBsZWFkXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJjb21tdW5pY2F0aW9uXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJjb21tdW5pY2F0ZWRcIiwgXCJwcmVzZW50ZWRcIiwgXCJwdWJsaWMgc3BlYWtpbmdcIiwgXCJpbnRlcnBlcnNvbmFsXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY29sbGFib3JhdGlvblwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJjb2xsYWJvcmF0ZWRcIixcbiAgICAgICAgICAgIFwidGVhbXdvcmtcIixcbiAgICAgICAgICAgIFwiY3Jvc3MtZnVuY3Rpb25hbFwiLFxuICAgICAgICAgICAgXCJjcm9zcyBmdW5jdGlvbmFsXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJwcm9ibGVtIHNvbHZpbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcInByb2JsZW0tc29sdmluZ1wiLCBcInRyb3VibGVzaG9vdGluZ1wiLCBcImRlYnVnZ2luZ1wiLCBcImFuYWx5dGljYWxcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJwcm9qZWN0IG1hbmFnZW1lbnRcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwicHJvamVjdC1tYW5hZ2VtZW50XCIsXG4gICAgICAgICAgICBcInByb2dyYW0gbWFuYWdlbWVudFwiLFxuICAgICAgICAgICAgXCJzdGFrZWhvbGRlciBtYW5hZ2VtZW50XCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ0aW1lIG1hbmFnZW1lbnRcIixcbiAgICAgICAgc3lub255bXM6IFtcInRpbWUtbWFuYWdlbWVudFwiLCBcInByaW9yaXRpemF0aW9uXCIsIFwib3JnYW5pemF0aW9uXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibWVudG9yaW5nXCIsIHN5bm9ueW1zOiBbXCJjb2FjaGluZ1wiLCBcInRyYWluaW5nXCIsIFwib25ib2FyZGluZ1wiXSB9LFxuICAgIC8vIERhdGEgJiBNTFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcIm1hY2hpbmUgbGVhcm5pbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcIm1sXCIsIFwiZGVlcCBsZWFybmluZ1wiLCBcImRsXCIsIFwiYWlcIiwgXCJhcnRpZmljaWFsIGludGVsbGlnZW5jZVwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcIm5scFwiLFxuICAgICAgICBzeW5vbnltczogW1wibmF0dXJhbCBsYW5ndWFnZSBwcm9jZXNzaW5nXCIsIFwidGV4dCBwcm9jZXNzaW5nXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY29tcHV0ZXIgdmlzaW9uXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJjdlwiLCBcImltYWdlIHJlY29nbml0aW9uXCIsIFwiaW1hZ2UgcHJvY2Vzc2luZ1wiXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcInRlbnNvcmZsb3dcIiwgc3lub255bXM6IFtcImtlcmFzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicHl0b3JjaFwiLCBzeW5vbnltczogW1widG9yY2hcIl0gfSxcbiAgICAvLyBUZXN0aW5nXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwidW5pdCB0ZXN0aW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJ1bml0IHRlc3RzXCIsIFwiamVzdFwiLCBcIm1vY2hhXCIsIFwidml0ZXN0XCIsIFwicHl0ZXN0XCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiaW50ZWdyYXRpb24gdGVzdGluZ1wiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJpbnRlZ3JhdGlvbiB0ZXN0c1wiLFxuICAgICAgICAgICAgXCJlMmUgdGVzdGluZ1wiLFxuICAgICAgICAgICAgXCJlbmQtdG8tZW5kIHRlc3RpbmdcIixcbiAgICAgICAgICAgIFwiZW5kIHRvIGVuZFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYXV0b21hdGlvbiB0ZXN0aW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcInRlc3QgYXV0b21hdGlvblwiLFxuICAgICAgICAgICAgXCJhdXRvbWF0ZWQgdGVzdGluZ1wiLFxuICAgICAgICAgICAgXCJzZWxlbml1bVwiLFxuICAgICAgICAgICAgXCJjeXByZXNzXCIsXG4gICAgICAgICAgICBcInBsYXl3cmlnaHRcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIC8vIFNlY3VyaXR5XG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiY3liZXJzZWN1cml0eVwiLFxuICAgICAgICBzeW5vbnltczogW1wiY3liZXIgc2VjdXJpdHlcIiwgXCJpbmZvcm1hdGlvbiBzZWN1cml0eVwiLCBcImluZm9zZWNcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJhdXRoZW50aWNhdGlvblwiLFxuICAgICAgICBzeW5vbnltczogW1wiYXV0aFwiLCBcIm9hdXRoXCIsIFwic3NvXCIsIFwic2luZ2xlIHNpZ24tb25cIl0sXG4gICAgfSxcbiAgICAvLyBNb2JpbGVcbiAgICB7IGNhbm9uaWNhbDogXCJpb3NcIiwgc3lub255bXM6IFtcInN3aWZ0XCIsIFwiYXBwbGUgZGV2ZWxvcG1lbnRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJhbmRyb2lkXCIsIHN5bm9ueW1zOiBbXCJhbmRyb2lkIGRldmVsb3BtZW50XCIsIFwia290bGluIGFuZHJvaWRcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJyZWFjdCBuYXRpdmVcIiwgc3lub255bXM6IFtcInJlYWN0LW5hdGl2ZVwiLCBcInJuXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZmx1dHRlclwiLCBzeW5vbnltczogW1wiZGFydFwiXSB9LFxuICAgIC8vIEJ1c2luZXNzICYgQW5hbHl0aWNzXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiYnVzaW5lc3MgaW50ZWxsaWdlbmNlXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJiaVwiLCBcInRhYmxlYXVcIiwgXCJwb3dlciBiaVwiLCBcImxvb2tlclwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImRhdGEgYW5hbHlzaXNcIixcbiAgICAgICAgc3lub255bXM6IFtcImRhdGEgYW5hbHl0aWNzXCIsIFwiZGF0YSBhbmFseXN0XCIsIFwiYW5hbHl0aWNzXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZXRsXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJleHRyYWN0IHRyYW5zZm9ybSBsb2FkXCIsIFwiZGF0YSBwaXBlbGluZVwiLCBcImRhdGEgcGlwZWxpbmVzXCJdLFxuICAgIH0sXG5dO1xuLyoqXG4gKiBCdWlsZHMgYSBsb29rdXAgbWFwIGZyb20gYW55IHRlcm0gKGNhbm9uaWNhbCBvciBzeW5vbnltKSB0b1xuICogdGhlIHNldCBvZiBhbGwgdGVybXMgaW4gdGhlIHNhbWUgZ3JvdXAgKGluY2x1ZGluZyB0aGUgY2Fub25pY2FsIGZvcm0pLlxuICogQWxsIGtleXMgYW5kIHZhbHVlcyBhcmUgbG93ZXJjYXNlLlxuICovXG5mdW5jdGlvbiBidWlsZFN5bm9ueW1Mb29rdXAoKSB7XG4gICAgY29uc3QgbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgU1lOT05ZTV9HUk9VUFMpIHtcbiAgICAgICAgY29uc3QgYWxsVGVybXMgPSBbZ3JvdXAuY2Fub25pY2FsLCAuLi5ncm91cC5zeW5vbnltc107XG4gICAgICAgIGNvbnN0IHRlcm1TZXQgPSBuZXcgU2V0KGFsbFRlcm1zKTtcbiAgICAgICAgZm9yIChjb25zdCB0ZXJtIG9mIGFsbFRlcm1zKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IGxvb2t1cC5nZXQodGVybSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBNZXJnZSBzZXRzIGlmIHRlcm0gYXBwZWFycyBpbiBtdWx0aXBsZSBncm91cHNcbiAgICAgICAgICAgICAgICB0ZXJtU2V0LmZvckVhY2goKHQpID0+IGV4aXN0aW5nLmFkZCh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb29rdXAuc2V0KHRlcm0sIG5ldyBTZXQodGVybVNldCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsb29rdXA7XG59XG5jb25zdCBzeW5vbnltTG9va3VwID0gYnVpbGRTeW5vbnltTG9va3VwKCk7XG4vKipcbiAqIFJldHVybnMgYWxsIHN5bm9ueW1zIGZvciBhIGdpdmVuIHRlcm0gKGluY2x1ZGluZyB0aGUgdGVybSBpdHNlbGYpLlxuICogUmV0dXJucyBhbiBlbXB0eSBhcnJheSBpZiBubyBzeW5vbnltcyBhcmUgZm91bmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTeW5vbnltcyh0ZXJtKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZCA9IHRlcm0udG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgY29uc3QgZ3JvdXAgPSBzeW5vbnltTG9va3VwLmdldChub3JtYWxpemVkKTtcbiAgICBpZiAoIWdyb3VwKVxuICAgICAgICByZXR1cm4gW107XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZ3JvdXApO1xufVxuLyoqXG4gKiBDaGVja3MgaWYgdHdvIHRlcm1zIGFyZSBzeW5vbnltcyBvZiBlYWNoIG90aGVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJlU3lub255bXModGVybUEsIHRlcm1CKSB7XG4gICAgY29uc3Qgbm9ybWFsaXplZEEgPSB0ZXJtQS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICBjb25zdCBub3JtYWxpemVkQiA9IHRlcm1CLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGlmIChub3JtYWxpemVkQSA9PT0gbm9ybWFsaXplZEIpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IGdyb3VwID0gc3lub255bUxvb2t1cC5nZXQobm9ybWFsaXplZEEpO1xuICAgIHJldHVybiBncm91cCA/IGdyb3VwLmhhcyhub3JtYWxpemVkQikgOiBmYWxzZTtcbn1cbi8qKiBXZWlnaHQgYXBwbGllZCB0byBzeW5vbnltIG1hdGNoZXMgKHZzIDEuMCBmb3IgZXhhY3QgbWF0Y2hlcykgKi9cbmV4cG9ydCBjb25zdCBTWU5PTllNX01BVENIX1dFSUdIVCA9IDAuODtcbiIsImltcG9ydCB7IGdldFN5bm9ueW1zLCBTWU5PTllNX01BVENIX1dFSUdIVCB9IGZyb20gXCIuL3N5bm9ueW1zXCI7XG5pbXBvcnQgeyBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY29udGFpbnNXb3JkLCBjb3VudFdvcmRPY2N1cnJlbmNlcywgZ2V0UmVzdW1lVGV4dCwgbm9ybWFsaXplVGV4dCwgfSBmcm9tIFwiLi90ZXh0XCI7XG5jb25zdCBTVE9QX1dPUkRTID0gbmV3IFNldChbXG4gICAgXCJhXCIsXG4gICAgXCJhblwiLFxuICAgIFwiYW5kXCIsXG4gICAgXCJhcmVcIixcbiAgICBcImFzXCIsXG4gICAgXCJhdFwiLFxuICAgIFwiYmVcIixcbiAgICBcImJ5XCIsXG4gICAgXCJmb3JcIixcbiAgICBcImZyb21cIixcbiAgICBcImluXCIsXG4gICAgXCJvZlwiLFxuICAgIFwib25cIixcbiAgICBcIm9yXCIsXG4gICAgXCJvdXJcIixcbiAgICBcInRoZVwiLFxuICAgIFwidG9cIixcbiAgICBcIndlXCIsXG4gICAgXCJ3aXRoXCIsXG4gICAgXCJ5b3VcIixcbiAgICBcInlvdXJcIixcbl0pO1xuZnVuY3Rpb24gdG9rZW5pemVLZXl3b3Jkcyh0ZXh0KSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZVRleHQodGV4dClcbiAgICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgICAgLm1hcCgodG9rZW4pID0+IHRva2VuLnRyaW0oKSlcbiAgICAgICAgLmZpbHRlcigodG9rZW4pID0+IHRva2VuLmxlbmd0aCA+PSAzICYmICFTVE9QX1dPUkRTLmhhcyh0b2tlbikpO1xufVxuZnVuY3Rpb24gdG9wVG9rZW5zKHRleHQsIGxpbWl0KSB7XG4gICAgY29uc3QgY291bnRzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5pemVLZXl3b3Jkcyh0ZXh0KSkge1xuICAgICAgICBjb3VudHMuc2V0KHRva2VuLCAoY291bnRzLmdldCh0b2tlbikgPz8gMCkgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oY291bnRzLmVudHJpZXMoKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdIHx8IGFbMF0ubG9jYWxlQ29tcGFyZShiWzBdKSlcbiAgICAgICAgLnNsaWNlKDAsIGxpbWl0KVxuICAgICAgICAubWFwKChbdG9rZW5dKSA9PiB0b2tlbik7XG59XG5mdW5jdGlvbiBidWlsZEtleXdvcmRTZXQoam9iKSB7XG4gICAgY29uc3Qga2V5d29yZHMgPSBbXG4gICAgICAgIC4uLmpvYi5rZXl3b3JkcyxcbiAgICAgICAgLi4uam9iLnJlcXVpcmVtZW50cy5mbGF0TWFwKHRva2VuaXplS2V5d29yZHMpLFxuICAgICAgICAuLi50b3BUb2tlbnMoam9iLmRlc2NyaXB0aW9uLCAxMCksXG4gICAgXTtcbiAgICBjb25zdCBub3JtYWxpemVkID0ga2V5d29yZHNcbiAgICAgICAgLm1hcCgoa2V5d29yZCkgPT4gbm9ybWFsaXplVGV4dChrZXl3b3JkKSlcbiAgICAgICAgLmZpbHRlcigoa2V5d29yZCkgPT4ga2V5d29yZC5sZW5ndGggPj0gMiAmJiAhU1RPUF9XT1JEUy5oYXMoa2V5d29yZCkpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQobm9ybWFsaXplZCkpLnNsaWNlKDAsIDI0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzY29yZUtleXdvcmRNYXRjaChpbnB1dCkge1xuICAgIGlmICghaW5wdXQuam9iKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXk6IFwia2V5d29yZE1hdGNoXCIsXG4gICAgICAgICAgICBsYWJlbDogXCJLZXl3b3JkIG1hdGNoXCIsXG4gICAgICAgICAgICBlYXJuZWQ6IDE4LFxuICAgICAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5rZXl3b3JkTWF0Y2gsXG4gICAgICAgICAgICBub3RlczogW1wiTm8gam9iIGRlc2NyaXB0aW9uIHN1cHBsaWVkOyBuZXV0cmFsIGJhc2VsaW5lLlwiXSxcbiAgICAgICAgICAgIGV2aWRlbmNlOiBbXCJObyBqb2IgZGVzY3JpcHRpb24gc3VwcGxpZWQuXCJdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBrZXl3b3JkcyA9IGJ1aWxkS2V5d29yZFNldChpbnB1dC5qb2IpO1xuICAgIGlmIChrZXl3b3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogXCJrZXl3b3JkTWF0Y2hcIixcbiAgICAgICAgICAgIGxhYmVsOiBcIktleXdvcmQgbWF0Y2hcIixcbiAgICAgICAgICAgIGVhcm5lZDogMTgsXG4gICAgICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmtleXdvcmRNYXRjaCxcbiAgICAgICAgICAgIG5vdGVzOiBbXCJKb2IgZGVzY3JpcHRpb24gaGFzIG5vIHVzYWJsZSBrZXl3b3JkczsgbmV1dHJhbCBiYXNlbGluZS5cIl0sXG4gICAgICAgICAgICBldmlkZW5jZTogW1wiMCBrZXl3b3JkcyBhdmFpbGFibGUuXCJdLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCByZXN1bWVUZXh0ID0gbm9ybWFsaXplVGV4dChnZXRSZXN1bWVUZXh0KGlucHV0LnByb2ZpbGUsIGlucHV0LnJhd1RleHQpKTtcbiAgICBsZXQgd2VpZ2h0ZWRIaXRzID0gMDtcbiAgICBsZXQgZXhhY3RIaXRzID0gMDtcbiAgICBsZXQgc3R1ZmZpbmcgPSBmYWxzZTtcbiAgICBmb3IgKGNvbnN0IGtleXdvcmQgb2Yga2V5d29yZHMpIHtcbiAgICAgICAgY29uc3QgZnJlcXVlbmN5ID0gY291bnRXb3JkT2NjdXJyZW5jZXMocmVzdW1lVGV4dCwga2V5d29yZCk7XG4gICAgICAgIGlmIChmcmVxdWVuY3kgPiAxMClcbiAgICAgICAgICAgIHN0dWZmaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKGZyZXF1ZW5jeSA+IDApIHtcbiAgICAgICAgICAgIHdlaWdodGVkSGl0cyArPSAxO1xuICAgICAgICAgICAgZXhhY3RIaXRzICs9IDE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzeW5vbnltSGl0ID0gZ2V0U3lub255bXMoa2V5d29yZCkuc29tZSgoc3lub255bSkgPT4gc3lub255bSAhPT0ga2V5d29yZCAmJiBjb250YWluc1dvcmQocmVzdW1lVGV4dCwgc3lub255bSkpO1xuICAgICAgICBpZiAoc3lub255bUhpdClcbiAgICAgICAgICAgIHdlaWdodGVkSGl0cyArPSBTWU5PTllNX01BVENIX1dFSUdIVDtcbiAgICB9XG4gICAgY29uc3QgcmF3RWFybmVkID0gTWF0aC5yb3VuZCgod2VpZ2h0ZWRIaXRzIC8ga2V5d29yZHMubGVuZ3RoKSAqIFNVQl9TQ09SRV9NQVhfUE9JTlRTLmtleXdvcmRNYXRjaCk7XG4gICAgY29uc3QgZWFybmVkID0gTWF0aC5tYXgoMCwgcmF3RWFybmVkIC0gKHN0dWZmaW5nID8gMiA6IDApKTtcbiAgICBjb25zdCBub3RlcyA9IGV4YWN0SGl0cyA9PT0ga2V5d29yZHMubGVuZ3RoXG4gICAgICAgID8gW11cbiAgICAgICAgOiBbXCJBZGQgbmF0dXJhbCBtZW50aW9ucyBvZiBtaXNzaW5nIHRhcmdldCBqb2Iga2V5d29yZHMuXCJdO1xuICAgIGlmIChzdHVmZmluZylcbiAgICAgICAgbm90ZXMucHVzaChcIktleXdvcmQgc3R1ZmZpbmcgZGV0ZWN0ZWQ7IHJlcGVhdGVkIHRlcm1zIHRvbyBvZnRlbi5cIik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImtleXdvcmRNYXRjaFwiLFxuICAgICAgICBsYWJlbDogXCJLZXl3b3JkIG1hdGNoXCIsXG4gICAgICAgIGVhcm5lZCxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5rZXl3b3JkTWF0Y2gsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogW1xuICAgICAgICAgICAgYCR7ZXhhY3RIaXRzfS8ke2tleXdvcmRzLmxlbmd0aH0ga2V5d29yZHMgbWF0Y2hlZGAsXG4gICAgICAgICAgICBgJHt3ZWlnaHRlZEhpdHMudG9GaXhlZCgxKX0vJHtrZXl3b3Jkcy5sZW5ndGh9IHdlaWdodGVkIGtleXdvcmQgaGl0c2AsXG4gICAgICAgIF0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXN1bWVUZXh0LCB3b3JkQ291bnQgfSBmcm9tIFwiLi90ZXh0XCI7XG5mdW5jdGlvbiBwb2ludHNGb3JXb3JkQ291bnQoY291bnQpIHtcbiAgICBpZiAoY291bnQgPj0gNDAwICYmIGNvdW50IDw9IDcwMClcbiAgICAgICAgcmV0dXJuIDEwO1xuICAgIGlmICgoY291bnQgPj0gMzAwICYmIGNvdW50IDw9IDM5OSkgfHwgKGNvdW50ID49IDcwMSAmJiBjb3VudCA8PSA5MDApKVxuICAgICAgICByZXR1cm4gNztcbiAgICBpZiAoKGNvdW50ID49IDIwMCAmJiBjb3VudCA8PSAyOTkpIHx8IChjb3VudCA+PSA5MDEgJiYgY291bnQgPD0gMTEwMCkpXG4gICAgICAgIHJldHVybiA0O1xuICAgIGlmICgoY291bnQgPj0gMTUwICYmIGNvdW50IDw9IDE5OSkgfHwgKGNvdW50ID49IDExMDEgJiYgY291bnQgPD0gMTQwMCkpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlTGVuZ3RoKGlucHV0KSB7XG4gICAgY29uc3QgY291bnQgPSB3b3JkQ291bnQoZ2V0UmVzdW1lVGV4dChpbnB1dC5wcm9maWxlLCBpbnB1dC5yYXdUZXh0KSk7XG4gICAgY29uc3QgZWFybmVkID0gcG9pbnRzRm9yV29yZENvdW50KGNvdW50KTtcbiAgICBjb25zdCBub3RlcyA9IGVhcm5lZCA9PT0gU1VCX1NDT1JFX01BWF9QT0lOVFMubGVuZ3RoXG4gICAgICAgID8gW11cbiAgICAgICAgOiBbXCJSZXN1bWUgbGVuZ3RoIGlzIG91dHNpZGUgdGhlIDQwMC03MDAgd29yZCB0YXJnZXQgYmFuZC5cIl07XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcImxlbmd0aFwiLFxuICAgICAgICBsYWJlbDogXCJMZW5ndGhcIixcbiAgICAgICAgZWFybmVkLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmxlbmd0aCxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbYCR7Y291bnR9IHdvcmRzYF0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFFVQU5USUZJRURfUkVHRVgsIFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRIaWdobGlnaHRzIH0gZnJvbSBcIi4vdGV4dFwiO1xuZnVuY3Rpb24gcG9pbnRzRm9yUXVhbnRpZmllZFJlc3VsdHMoY291bnQpIHtcbiAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgIHJldHVybiAwO1xuICAgIGlmIChjb3VudCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIDY7XG4gICAgaWYgKGNvdW50ID09PSAyKVxuICAgICAgICByZXR1cm4gMTI7XG4gICAgaWYgKGNvdW50IDw9IDQpXG4gICAgICAgIHJldHVybiAxNjtcbiAgICByZXR1cm4gMjA7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzKGlucHV0KSB7XG4gICAgY29uc3QgdGV4dCA9IGdldEhpZ2hsaWdodHMoaW5wdXQucHJvZmlsZSkuam9pbihcIlxcblwiKTtcbiAgICBjb25zdCBtYXRjaGVzID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKFFVQU5USUZJRURfUkVHRVgpLCAobWF0Y2gpID0+IG1hdGNoWzBdKTtcbiAgICBjb25zdCBub3RlcyA9IG1hdGNoZXMubGVuZ3RoID09PSAwXG4gICAgICAgID8gW1wiQWRkIG1ldHJpY3Mgc3VjaCBhcyBwZXJjZW50YWdlcywgdm9sdW1lLCB0ZWFtIHNpemUsIG9yIHJldmVudWUuXCJdXG4gICAgICAgIDogW107XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcInF1YW50aWZpZWRBY2hpZXZlbWVudHNcIixcbiAgICAgICAgbGFiZWw6IFwiUXVhbnRpZmllZCBhY2hpZXZlbWVudHNcIixcbiAgICAgICAgZWFybmVkOiBwb2ludHNGb3JRdWFudGlmaWVkUmVzdWx0cyhtYXRjaGVzLmxlbmd0aCksXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMucXVhbnRpZmllZEFjaGlldmVtZW50cyxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbXG4gICAgICAgICAgICBgJHttYXRjaGVzLmxlbmd0aH0gcXVhbnRpZmllZCByZXN1bHQocylgLFxuICAgICAgICAgICAgLi4ubWF0Y2hlcy5zbGljZSgwLCAzKSxcbiAgICAgICAgXSxcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmV4cG9ydCBmdW5jdGlvbiBzY29yZVNlY3Rpb25Db21wbGV0ZW5lc3MoaW5wdXQpIHtcbiAgICBjb25zdCB7IHByb2ZpbGUgfSA9IGlucHV0O1xuICAgIGNvbnN0IG5vdGVzID0gW107XG4gICAgY29uc3QgZXZpZGVuY2UgPSBbXTtcbiAgICBsZXQgZWFybmVkID0gMDtcbiAgICBsZXQgY29tcGxldGVTZWN0aW9ucyA9IDA7XG4gICAgaWYgKHByb2ZpbGUuY29udGFjdC5uYW1lPy50cmltKCkpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiTWlzc2luZyBjb250YWN0IG5hbWUuXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5jb250YWN0LmVtYWlsPy50cmltKCkpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiTWlzc2luZyBjb250YWN0IGVtYWlsLlwiKTtcbiAgICB9XG4gICAgY29uc3Qgc3VtbWFyeUxlbmd0aCA9IHByb2ZpbGUuc3VtbWFyeT8udHJpbSgpLmxlbmd0aCA/PyAwO1xuICAgIGlmIChzdW1tYXJ5TGVuZ3RoID49IDUwICYmIHN1bW1hcnlMZW5ndGggPD0gNTAwKSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiU3VtbWFyeSBzaG91bGQgYmUgYmV0d2VlbiA1MCBhbmQgNTAwIGNoYXJhY3RlcnMuXCIpO1xuICAgIH1cbiAgICBjb25zdCBoYXNFeHBlcmllbmNlID0gcHJvZmlsZS5leHBlcmllbmNlcy5zb21lKChleHBlcmllbmNlKSA9PiBleHBlcmllbmNlLnRpdGxlLnRyaW0oKSAmJlxuICAgICAgICBleHBlcmllbmNlLmNvbXBhbnkudHJpbSgpICYmXG4gICAgICAgIGV4cGVyaWVuY2Uuc3RhcnREYXRlLnRyaW0oKSk7XG4gICAgaWYgKGhhc0V4cGVyaWVuY2UpIHtcbiAgICAgICAgZWFybmVkICs9IDI7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYXQgbGVhc3Qgb25lIHJvbGUgd2l0aCB0aXRsZSwgY29tcGFueSwgYW5kIHN0YXJ0IGRhdGUuXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5lZHVjYXRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBhdCBsZWFzdCBvbmUgZWR1Y2F0aW9uIGVudHJ5LlwiKTtcbiAgICB9XG4gICAgaWYgKHByb2ZpbGUuc2tpbGxzLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgIGVhcm5lZCArPSAyO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2UgaWYgKHByb2ZpbGUuc2tpbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYXQgbGVhc3QgdGhyZWUgc2tpbGxzLlwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYSBza2lsbHMgc2VjdGlvbi5cIik7XG4gICAgfVxuICAgIGNvbnN0IGhhc0hpZ2hsaWdodCA9IHByb2ZpbGUuZXhwZXJpZW5jZXMuc29tZSgoZXhwZXJpZW5jZSkgPT4gZXhwZXJpZW5jZS5oaWdobGlnaHRzLmxlbmd0aCA+IDApO1xuICAgIGlmIChoYXNIaWdobGlnaHQpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgYWNoaWV2ZW1lbnQgaGlnaGxpZ2h0cyB0byBleHBlcmllbmNlLlwiKTtcbiAgICB9XG4gICAgY29uc3QgaGFzU2Vjb25kYXJ5Q29udGFjdCA9IEJvb2xlYW4ocHJvZmlsZS5jb250YWN0LnBob25lPy50cmltKCkgfHxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0LmxpbmtlZGluPy50cmltKCkgfHxcbiAgICAgICAgcHJvZmlsZS5jb250YWN0LmxvY2F0aW9uPy50cmltKCkpO1xuICAgIGlmIChoYXNTZWNvbmRhcnlDb250YWN0KSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIHBob25lLCBMaW5rZWRJbiwgb3IgbG9jYXRpb24uXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5jb250YWN0Lm5hbWU/LnRyaW0oKSAmJiBwcm9maWxlLmNvbnRhY3QuZW1haWw/LnRyaW0oKSkge1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGV2aWRlbmNlLnB1c2goYCR7Y29tcGxldGVTZWN0aW9uc30vNyBzZWN0aW9ucyBjb21wbGV0ZWApO1xuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJzZWN0aW9uQ29tcGxldGVuZXNzXCIsXG4gICAgICAgIGxhYmVsOiBcIlNlY3Rpb24gY29tcGxldGVuZXNzXCIsXG4gICAgICAgIGVhcm5lZDogTWF0aC5taW4oZWFybmVkLCBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zZWN0aW9uQ29tcGxldGVuZXNzKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zZWN0aW9uQ29tcGxldGVuZXNzLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2UsXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFDVElPTl9WRVJCUywgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldEhpZ2hsaWdodHMsIG5vcm1hbGl6ZVRleHQgfSBmcm9tIFwiLi90ZXh0XCI7XG5jb25zdCBSRVBFQVRFRF9XT1JEX0VYQ0VQVElPTlMgPSBuZXcgU2V0KFtcImhhZCBoYWRcIiwgXCJ0aGF0IHRoYXRcIl0pO1xuY29uc3QgQUNST05ZTVMgPSBuZXcgU2V0KFtcIkFQSVwiLCBcIkFXU1wiLCBcIkNTU1wiLCBcIkdDUFwiLCBcIkhUTUxcIiwgXCJTUUxcIl0pO1xuZnVuY3Rpb24gaGFzVmVyYkxpa2VUb2tlbih0ZXh0KSB7XG4gICAgY29uc3Qgd29yZHMgPSBub3JtYWxpemVUZXh0KHRleHQpLnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pO1xuICAgIHJldHVybiB3b3Jkcy5zb21lKCh3b3JkKSA9PiBBQ1RJT05fVkVSQlMuaW5jbHVkZXMod29yZCkgfHxcbiAgICAgICAgLyg/OmVkfGluZ3xzKSQvLnRlc3Qod29yZCkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlU3BlbGxpbmdHcmFtbWFyKGlucHV0KSB7XG4gICAgY29uc3QgaGlnaGxpZ2h0cyA9IGdldEhpZ2hsaWdodHMoaW5wdXQucHJvZmlsZSk7XG4gICAgY29uc3QgdGV4dCA9IGhpZ2hsaWdodHMuam9pbihcIlxcblwiKTtcbiAgICBjb25zdCBub3RlcyA9IFtdO1xuICAgIGNvbnN0IGV2aWRlbmNlID0gW107XG4gICAgbGV0IGRlZHVjdGlvbnMgPSAwO1xuICAgIGNvbnN0IHJlcGVhdGVkID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKC9cXGIoXFx3KylcXHMrXFwxXFxiL2dpKSwgKG1hdGNoKSA9PiBtYXRjaFswXSkuZmlsdGVyKChtYXRjaCkgPT4gIVJFUEVBVEVEX1dPUkRfRVhDRVBUSU9OUy5oYXMobWF0Y2gudG9Mb3dlckNhc2UoKSkpO1xuICAgIGlmIChyZXBlYXRlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1pbigyLCByZXBlYXRlZC5sZW5ndGgpO1xuICAgICAgICBkZWR1Y3Rpb25zICs9IHBlbmFsdHk7XG4gICAgICAgIG5vdGVzLnB1c2goXCJSZXBlYXRlZCBhZGphY2VudCB3b3JkcyBkZXRlY3RlZC5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYFJlcGVhdGVkIHdvcmQ6ICR7cmVwZWF0ZWRbMF19YCk7XG4gICAgfVxuICAgIGlmICgvICArLy50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMTtcbiAgICAgICAgbm90ZXMucHVzaChcIk11bHRpcGxlIHNwYWNlcyBiZXR3ZWVuIHdvcmRzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIk11bHRpcGxlIHNwYWNlcyBmb3VuZC5cIik7XG4gICAgfVxuICAgIGNvbnN0IGxvd2VyY2FzZVN0YXJ0cyA9IGhpZ2hsaWdodHMuZmlsdGVyKChoaWdobGlnaHQpID0+IC9eW2Etel0vLnRlc3QoaGlnaGxpZ2h0LnRyaW0oKSkpO1xuICAgIGlmIChsb3dlcmNhc2VTdGFydHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5taW4oMywgbG93ZXJjYXNlU3RhcnRzLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlNvbWUgaGlnaGxpZ2h0cyBzdGFydCB3aXRoIGxvd2VyY2FzZSBsZXR0ZXJzLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgTG93ZXJjYXNlIHN0YXJ0OiAke2xvd2VyY2FzZVN0YXJ0c1swXX1gKTtcbiAgICB9XG4gICAgY29uc3QgZnJhZ21lbnRzID0gaGlnaGxpZ2h0cy5maWx0ZXIoKGhpZ2hsaWdodCkgPT4gaGlnaGxpZ2h0Lmxlbmd0aCA+IDQwICYmICFoYXNWZXJiTGlrZVRva2VuKGhpZ2hsaWdodCkpO1xuICAgIGlmIChmcmFnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwZW5hbHR5ID0gTWF0aC5taW4oMiwgZnJhZ21lbnRzLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlNvbWUgbG9uZyBoaWdobGlnaHRzIG1heSByZWFkIGxpa2Ugc2VudGVuY2UgZnJhZ21lbnRzLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgUG9zc2libGUgZnJhZ21lbnQ6ICR7ZnJhZ21lbnRzWzBdfWApO1xuICAgIH1cbiAgICBjb25zdCBwdW5jdHVhdGlvbkVuZGluZ3MgPSBoaWdobGlnaHRzLmZpbHRlcigoaGlnaGxpZ2h0KSA9PiAvXFwuJC8udGVzdChoaWdobGlnaHQudHJpbSgpKSkubGVuZ3RoO1xuICAgIGlmIChoaWdobGlnaHRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc3QgcmF0ZSA9IHB1bmN0dWF0aW9uRW5kaW5ncyAvIGhpZ2hsaWdodHMubGVuZ3RoO1xuICAgICAgICBpZiAocmF0ZSA+IDAuMyAmJiByYXRlIDwgMC43KSB7XG4gICAgICAgICAgICBkZWR1Y3Rpb25zICs9IDE7XG4gICAgICAgICAgICBub3Rlcy5wdXNoKFwiVHJhaWxpbmcgcHVuY3R1YXRpb24gaXMgaW5jb25zaXN0ZW50IGFjcm9zcyBoaWdobGlnaHRzLlwiKTtcbiAgICAgICAgICAgIGV2aWRlbmNlLnB1c2goYCR7cHVuY3R1YXRpb25FbmRpbmdzfS8ke2hpZ2hsaWdodHMubGVuZ3RofSBoaWdobGlnaHRzIGVuZCB3aXRoIHBlcmlvZHMuYCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYWxsQ2FwcyA9IEFycmF5LmZyb20odGV4dC5tYXRjaEFsbCgvXFxiW0EtWl17NCx9XFxiL2cpLCAobWF0Y2gpID0+IG1hdGNoWzBdKS5maWx0ZXIoKHdvcmQpID0+ICFBQ1JPTllNUy5oYXMod29yZCkpO1xuICAgIGlmIChhbGxDYXBzLmxlbmd0aCA+IDUpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAxO1xuICAgICAgICBub3Rlcy5wdXNoKFwiRXhjZXNzaXZlIGFsbC1jYXBzIHdvcmRzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgQWxsLWNhcHMgd29yZHM6ICR7YWxsQ2Fwcy5zbGljZSgwLCAzKS5qb2luKFwiLCBcIil9YCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGtleTogXCJzcGVsbGluZ0dyYW1tYXJcIixcbiAgICAgICAgbGFiZWw6IFwiU3BlbGxpbmcgYW5kIGdyYW1tYXJcIixcbiAgICAgICAgZWFybmVkOiBNYXRoLm1heCgwLCBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zcGVsbGluZ0dyYW1tYXIgLSBkZWR1Y3Rpb25zKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5zcGVsbGluZ0dyYW1tYXIsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogZXZpZGVuY2UubGVuZ3RoID4gMCA/IGV2aWRlbmNlIDogW1wiTm8gaGV1cmlzdGljIGlzc3VlcyBkZXRlY3RlZC5cIl0sXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IG5vd0lzbyB9IGZyb20gXCIuLi9mb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBzY29yZUFjdGlvblZlcmJzIH0gZnJvbSBcIi4vYWN0aW9uLXZlcmJzXCI7XG5pbXBvcnQgeyBzY29yZUF0c0ZyaWVuZGxpbmVzcyB9IGZyb20gXCIuL2F0cy1mcmllbmRsaW5lc3NcIjtcbmltcG9ydCB7IHNjb3JlS2V5d29yZE1hdGNoIH0gZnJvbSBcIi4va2V5d29yZC1tYXRjaFwiO1xuaW1wb3J0IHsgc2NvcmVMZW5ndGggfSBmcm9tIFwiLi9sZW5ndGhcIjtcbmltcG9ydCB7IHNjb3JlUXVhbnRpZmllZEFjaGlldmVtZW50cyB9IGZyb20gXCIuL3F1YW50aWZpZWQtYWNoaWV2ZW1lbnRzXCI7XG5pbXBvcnQgeyBzY29yZVNlY3Rpb25Db21wbGV0ZW5lc3MgfSBmcm9tIFwiLi9zZWN0aW9uLWNvbXBsZXRlbmVzc1wiO1xuaW1wb3J0IHsgc2NvcmVTcGVsbGluZ0dyYW1tYXIgfSBmcm9tIFwiLi9zcGVsbGluZy1ncmFtbWFyXCI7XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVSZXN1bWUoaW5wdXQpIHtcbiAgICBjb25zdCBzdWJTY29yZXMgPSB7XG4gICAgICAgIHNlY3Rpb25Db21wbGV0ZW5lc3M6IHNjb3JlU2VjdGlvbkNvbXBsZXRlbmVzcyhpbnB1dCksXG4gICAgICAgIGFjdGlvblZlcmJzOiBzY29yZUFjdGlvblZlcmJzKGlucHV0KSxcbiAgICAgICAgcXVhbnRpZmllZEFjaGlldmVtZW50czogc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzKGlucHV0KSxcbiAgICAgICAga2V5d29yZE1hdGNoOiBzY29yZUtleXdvcmRNYXRjaChpbnB1dCksXG4gICAgICAgIGxlbmd0aDogc2NvcmVMZW5ndGgoaW5wdXQpLFxuICAgICAgICBzcGVsbGluZ0dyYW1tYXI6IHNjb3JlU3BlbGxpbmdHcmFtbWFyKGlucHV0KSxcbiAgICAgICAgYXRzRnJpZW5kbGluZXNzOiBzY29yZUF0c0ZyaWVuZGxpbmVzcyhpbnB1dCksXG4gICAgfTtcbiAgICBjb25zdCBvdmVyYWxsID0gT2JqZWN0LnZhbHVlcyhzdWJTY29yZXMpLnJlZHVjZSgoc3VtLCBzdWJTY29yZSkgPT4gc3VtICsgc3ViU2NvcmUuZWFybmVkLCAwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBvdmVyYWxsOiBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIE1hdGgucm91bmQob3ZlcmFsbCkpKSxcbiAgICAgICAgc3ViU2NvcmVzLFxuICAgICAgICBnZW5lcmF0ZWRBdDogbm93SXNvKCksXG4gICAgfTtcbn1cbmV4cG9ydCB7IHNjb3JlQWN0aW9uVmVyYnMgfSBmcm9tIFwiLi9hY3Rpb24tdmVyYnNcIjtcbmV4cG9ydCB7IHNjb3JlQXRzRnJpZW5kbGluZXNzIH0gZnJvbSBcIi4vYXRzLWZyaWVuZGxpbmVzc1wiO1xuZXhwb3J0IHsgc2NvcmVLZXl3b3JkTWF0Y2ggfSBmcm9tIFwiLi9rZXl3b3JkLW1hdGNoXCI7XG5leHBvcnQgeyBzY29yZUxlbmd0aCB9IGZyb20gXCIuL2xlbmd0aFwiO1xuZXhwb3J0IHsgc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzIH0gZnJvbSBcIi4vcXVhbnRpZmllZC1hY2hpZXZlbWVudHNcIjtcbmV4cG9ydCB7IHNjb3JlU2VjdGlvbkNvbXBsZXRlbmVzcyB9IGZyb20gXCIuL3NlY3Rpb24tY29tcGxldGVuZXNzXCI7XG5leHBvcnQgeyBzY29yZVNwZWxsaW5nR3JhbW1hciB9IGZyb20gXCIuL3NwZWxsaW5nLWdyYW1tYXJcIjtcbiIsIi8vIE1lc3NhZ2UgcGFzc2luZyB1dGlsaXRpZXMgZm9yIGV4dGVuc2lvbiBjb21tdW5pY2F0aW9uXG4vLyBUeXBlLXNhZmUgbWVzc2FnZSBjcmVhdG9yc1xuZXhwb3J0IGNvbnN0IE1lc3NhZ2VzID0ge1xuICAgIC8vIEF1dGggbWVzc2FnZXNcbiAgICBnZXRBdXRoU3RhdHVzOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9BVVRIX1NUQVRVU1wiIH0pLFxuICAgIG9wZW5BdXRoOiAoKSA9PiAoeyB0eXBlOiBcIk9QRU5fQVVUSFwiIH0pLFxuICAgIGxvZ291dDogKCkgPT4gKHsgdHlwZTogXCJMT0dPVVRcIiB9KSxcbiAgICAvLyBQcm9maWxlIG1lc3NhZ2VzXG4gICAgZ2V0UHJvZmlsZTogKCkgPT4gKHsgdHlwZTogXCJHRVRfUFJPRklMRVwiIH0pLFxuICAgIGdldFNldHRpbmdzOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9TRVRUSU5HU1wiIH0pLFxuICAgIC8vIEZvcm0gZmlsbGluZyBtZXNzYWdlc1xuICAgIGZpbGxGb3JtOiAoZmllbGRzKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkZJTExfRk9STVwiLFxuICAgICAgICBwYXlsb2FkOiBmaWVsZHMsXG4gICAgfSksXG4gICAgLy8gU2NyYXBpbmcgbWVzc2FnZXNcbiAgICBzY3JhcGVKb2I6ICgpID0+ICh7IHR5cGU6IFwiU0NSQVBFX0pPQlwiIH0pLFxuICAgIHNjcmFwZUpvYkxpc3Q6ICgpID0+ICh7IHR5cGU6IFwiU0NSQVBFX0pPQl9MSVNUXCIgfSksXG4gICAgaW1wb3J0Sm9iOiAoam9iKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIklNUE9SVF9KT0JcIixcbiAgICAgICAgcGF5bG9hZDogam9iLFxuICAgIH0pLFxuICAgIGltcG9ydEpvYnNCYXRjaDogKGpvYnMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiSU1QT1JUX0pPQlNfQkFUQ0hcIixcbiAgICAgICAgcGF5bG9hZDogam9icyxcbiAgICB9KSxcbiAgICB0cmFja0FwcGxpZWQ6IChwYXlsb2FkKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlRSQUNLX0FQUExJRURcIixcbiAgICAgICAgcGF5bG9hZCxcbiAgICB9KSxcbiAgICBvcGVuRGFzaGJvYXJkOiAoKSA9PiAoeyB0eXBlOiBcIk9QRU5fREFTSEJPQVJEXCIgfSksXG4gICAgY2FwdHVyZVZpc2libGVUYWI6ICgpID0+ICh7IHR5cGU6IFwiQ0FQVFVSRV9WSVNJQkxFX1RBQlwiIH0pLFxuICAgIHRhaWxvckZyb21QYWdlOiAoam9iLCBiYXNlUmVzdW1lSWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiVEFJTE9SX0ZST01fUEFHRVwiLFxuICAgICAgICBwYXlsb2FkOiB7IGpvYiwgYmFzZVJlc3VtZUlkIH0sXG4gICAgfSksXG4gICAgZ2VuZXJhdGVDb3ZlckxldHRlckZyb21QYWdlOiAoam9iKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkdFTkVSQVRFX0NPVkVSX0xFVFRFUl9GUk9NX1BBR0VcIixcbiAgICAgICAgcGF5bG9hZDogam9iLFxuICAgIH0pLFxuICAgIC8qKiAjMzQg4oCUIGZldGNoIHRoZSB1c2VyJ3MgcmVjZW50bHktc2F2ZWQgdGFpbG9yZWQgcmVzdW1lcyBmb3IgdGhlIHBpY2tlci4gKi9cbiAgICBsaXN0UmVzdW1lczogKCkgPT4gKHsgdHlwZTogXCJMSVNUX1JFU1VNRVNcIiB9KSxcbiAgICAvLyBMZWFybmluZyBtZXNzYWdlc1xuICAgIHNhdmVBbnN3ZXI6IChkYXRhKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlNBVkVfQU5TV0VSXCIsXG4gICAgICAgIHBheWxvYWQ6IGRhdGEsXG4gICAgfSksXG4gICAgc2VhcmNoQW5zd2VyczogKHF1ZXN0aW9uKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlNFQVJDSF9BTlNXRVJTXCIsXG4gICAgICAgIHBheWxvYWQ6IHF1ZXN0aW9uLFxuICAgIH0pLFxuICAgIG1hdGNoQW5zd2VyQmFuazogKHBheWxvYWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiTUFUQ0hfQU5TV0VSX0JBTktcIixcbiAgICAgICAgcGF5bG9hZCxcbiAgICB9KSxcbiAgICBqb2JEZXRlY3RlZDogKG1ldGEpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiSk9CX0RFVEVDVEVEXCIsXG4gICAgICAgIHBheWxvYWQ6IG1ldGEsXG4gICAgfSksXG4gICAgLy8gV2F0ZXJsb29Xb3Jrcy1zcGVjaWZpYyBidWxrIHNjcmFwaW5nIChkcml2ZW4gZnJvbSBwb3B1cCwgZXhlY3V0ZWQgaW4gY29udGVudFxuICAgIC8vIHNjcmlwdCBieSB3YXRlcmxvby13b3Jrcy1vcmNoZXN0cmF0b3IudHMpLlxuICAgIHd3U2NyYXBlQWxsVmlzaWJsZTogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJXV19TQ1JBUEVfQUxMX1ZJU0lCTEVcIixcbiAgICB9KSxcbiAgICB3d1NjcmFwZUFsbFBhZ2luYXRlZDogKG9wdHMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiV1dfU0NSQVBFX0FMTF9QQUdJTkFURURcIixcbiAgICAgICAgcGF5bG9hZDogb3B0cyA/PyB7fSxcbiAgICB9KSxcbiAgICB3d0dldFBhZ2VTdGF0ZTogKCkgPT4gKHsgdHlwZTogXCJXV19HRVRfUEFHRV9TVEFURVwiIH0pLFxuICAgIC8vIFAzLyMzOSDigJQgQnVsayBzY3JhcGluZyBmb3IgcHVibGljIEFUUyBib2FyZCBob3N0cy4gUG9wdXAg4oaSIGNvbnRlbnQtc2NyaXB0LlxuICAgIC8vIEVhY2ggcGFpciBtaXJyb3JzIHRoZSBXVyBzaGFwZSBzbyB0aGUgc2FtZSBgQnVsa1NvdXJjZUNhcmRgIFVYIGNhbiBkcml2ZVxuICAgIC8vIGV2ZXJ5IHNvdXJjZS4gRWFjaCBvcmNoZXN0cmF0b3IgY2FwcyBhdCAyMDAvc2Vzc2lvbiAob3ZlcnJpZGFibGUgYmVsb3cpLlxuICAgIGJ1bGtHcmVlbmhvdXNlR2V0UGFnZVN0YXRlOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkJVTEtfR1JFRU5IT1VTRV9HRVRfUEFHRV9TVEFURVwiLFxuICAgIH0pLFxuICAgIGJ1bGtHcmVlbmhvdXNlU2NyYXBlVmlzaWJsZTogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX0dSRUVOSE9VU0VfU0NSQVBFX1ZJU0lCTEVcIixcbiAgICB9KSxcbiAgICBidWxrR3JlZW5ob3VzZVNjcmFwZVBhZ2luYXRlZDogKG9wdHMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19HUkVFTkhPVVNFX1NDUkFQRV9QQUdJTkFURURcIixcbiAgICAgICAgcGF5bG9hZDogb3B0cyA/PyB7fSxcbiAgICB9KSxcbiAgICBidWxrTGV2ZXJHZXRQYWdlU3RhdGU6ICgpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19MRVZFUl9HRVRfUEFHRV9TVEFURVwiLFxuICAgIH0pLFxuICAgIGJ1bGtMZXZlclNjcmFwZVZpc2libGU6ICgpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19MRVZFUl9TQ1JBUEVfVklTSUJMRVwiLFxuICAgIH0pLFxuICAgIGJ1bGtMZXZlclNjcmFwZVBhZ2luYXRlZDogKG9wdHMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19MRVZFUl9TQ1JBUEVfUEFHSU5BVEVEXCIsXG4gICAgICAgIHBheWxvYWQ6IG9wdHMgPz8ge30sXG4gICAgfSksXG4gICAgYnVsa1dvcmtkYXlHZXRQYWdlU3RhdGU6ICgpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19XT1JLREFZX0dFVF9QQUdFX1NUQVRFXCIsXG4gICAgfSksXG4gICAgYnVsa1dvcmtkYXlTY3JhcGVWaXNpYmxlOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkJVTEtfV09SS0RBWV9TQ1JBUEVfVklTSUJMRVwiLFxuICAgIH0pLFxuICAgIGJ1bGtXb3JrZGF5U2NyYXBlUGFnaW5hdGVkOiAob3B0cykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX1dPUktEQVlfU0NSQVBFX1BBR0lOQVRFRFwiLFxuICAgICAgICBwYXlsb2FkOiBvcHRzID8/IHt9LFxuICAgIH0pLFxuICAgIC8vIFA0LyM0MCDigJQgSGVscGVyIGZvciB0aGUgY2hhdC1wb3J0IHN0YXJ0IGZyYW1lLiBUaGUgYWN0dWFsIHN0cmVhbSB1c2VzIGFcbiAgICAvLyBsb25nLWxpdmVkIGNocm9tZS5ydW50aW1lLmNvbm5lY3QgcG9ydCAoQ0hBVF9QT1JUX05BTUUpIHJhdGhlciB0aGFuXG4gICAgLy8gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UsIGJ1dCBleHBvc2luZyBhIHR5cGVkIGJ1aWxkZXIga2VlcHMgY2FsbHNpdGVzXG4gICAgLy8gc2VsZi1kb2N1bWVudGluZy5cbiAgICBjaGF0U3RyZWFtU3RhcnQ6IChwYXlsb2FkKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkNIQVRfU1RSRUFNX1NUQVJUXCIsXG4gICAgICAgIHByb21wdDogcGF5bG9hZC5wcm9tcHQsXG4gICAgICAgIGpvYkNvbnRleHQ6IHBheWxvYWQuam9iQ29udGV4dCxcbiAgICB9KSxcbiAgICAvLyBDb3JyZWN0aW9ucyBmZWVkYmFjayBsb29wICgjMzMpLiBGaXJlZCB3aGVuIGEgdXNlciBlZGl0cyBhbiBhdXRvZmlsbGVkXG4gICAgLy8gZmllbGQgYW5kIHRoZSBmaW5hbCB2YWx1ZSBkaWZmZXJzIGZyb20gdGhlIG9yaWdpbmFsIHN1Z2dlc3Rpb24g4oCUIHRoZVxuICAgIC8vIGJhY2tncm91bmQgZm9yd2FyZHMgaXQgdG8gL2FwaS9leHRlbnNpb24vZmllbGQtbWFwcGluZ3MvY29ycmVjdCBzb1xuICAgIC8vIGZ1dHVyZSBhdXRvZmlsbHMgb24gdGhlIHNhbWUgZG9tYWluIHByZWZlciB0aGUgY29ycmVjdGVkIHZhbHVlLlxuICAgIHNhdmVDb3JyZWN0aW9uOiAocGF5bG9hZCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJTQVZFX0NPUlJFQ1RJT05cIixcbiAgICAgICAgcGF5bG9hZCxcbiAgICB9KSxcbiAgICAvLyBQMyAvICMzNiAjMzcg4oCUIG11bHRpLXN0ZXAgZm9ybSBzdXBwb3J0IChXb3JrZGF5LCBHcmVlbmhvdXNlKS5cbiAgICAvKiogQmFja2dyb3VuZCDihpIgY29udGVudDogYSBzdGVwIHRyYW5zaXRpb24ganVzdCBmaXJlZCBmb3IgdGhpcyB0YWIuICovXG4gICAgbXVsdGlzdGVwU3RlcFRyYW5zaXRpb246IChwYXlsb2FkKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIk1VTFRJU1RFUF9TVEVQX1RSQU5TSVRJT05cIixcbiAgICAgICAgcGF5bG9hZCxcbiAgICB9KSxcbiAgICAvKiogQ29udGVudCDihpIgYmFja2dyb3VuZDogcmV0dXJuIHRoZSBjdXJyZW50IHRhYiBpZC4gKi9cbiAgICBnZXRUYWJJZDogKCkgPT4gKHsgdHlwZTogXCJHRVRfVEFCX0lEXCIgfSksXG4gICAgLyoqXG4gICAgICogQ29udGVudCDihpIgYmFja2dyb3VuZDogZW5zdXJlIHRoZSBgd2ViTmF2aWdhdGlvbmAgcGVybWlzc2lvbiBpcyBncmFudGVkLlxuICAgICAqIEluIENocm9tZSBNVjMgaXQncyBkZWNsYXJlZCBhdCBpbnN0YWxsIHRpbWUgYW5kIHRoZSByZXNwb25zZSBpcyBhbHdheXNcbiAgICAgKiBgeyBncmFudGVkOiB0cnVlIH1gLiBJbiBGaXJlZm94IE1WMiB0aGUgYmFja2dyb3VuZCBjYWxsc1xuICAgICAqIGBicm93c2VyLnBlcm1pc3Npb25zLnJlcXVlc3QoLi4uKWAgYW5kIHJldHVybnMgdGhlIHVzZXIncyB2ZXJkaWN0LlxuICAgICAqL1xuICAgIHJlcXVlc3RXZWJOYXZpZ2F0aW9uUGVybWlzc2lvbjogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJSRVFVRVNUX1dFQk5BVklHQVRJT05fUEVSTUlTU0lPTlwiLFxuICAgIH0pLFxuICAgIC8qKiBDb250ZW50IOKGkiBiYWNrZ3JvdW5kOiBpcyBgd2ViTmF2aWdhdGlvbmAgY3VycmVudGx5IHVzYWJsZT8gKi9cbiAgICBoYXNXZWJOYXZpZ2F0aW9uUGVybWlzc2lvbjogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJIQVNfV0VCTkFWSUdBVElPTl9QRVJNSVNTSU9OXCIsXG4gICAgfSksXG59O1xuLy8gU2VuZCBtZXNzYWdlIHRvIGJhY2tncm91bmQgc2NyaXB0XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UgfHwgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gcmVzcG9uc2UgcmVjZWl2ZWRcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBTZW5kIG1lc3NhZ2UgdG8gY29udGVudCBzY3JpcHQgaW4gc3BlY2lmaWMgdGFiXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFRvVGFiKHRhYklkLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBtZXNzYWdlLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBjaHJvbWUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UgfHwgeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gcmVzcG9uc2UgcmVjZWl2ZWRcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyBTZW5kIG1lc3NhZ2UgdG8gYWxsIGNvbnRlbnQgc2NyaXB0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJyb2FkY2FzdE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7fSk7XG4gICAgZm9yIChjb25zdCB0YWIgb2YgdGFicykge1xuICAgICAgICBpZiAodGFiLmlkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgLy8gVGFiIG1pZ2h0IG5vdCBoYXZlIGNvbnRlbnQgc2NyaXB0IGxvYWRlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoqXG4gKiBEZWVwLWxpbmsgVVJMIGJ1aWxkZXJzIGZvciB0aGUgcG9wdXAncyBwb3N0LWltcG9ydCBzdWNjZXNzIGJ1dHRvbnMgKCMzMSkuXG4gKlxuICogS2VwdCBpbiBpdHMgb3duIG1vZHVsZSBzbyB0aGUgVVJMIHNoYXBlIGlzIHVuaXQtdGVzdGFibGUgd2l0aG91dCBib290aW5nXG4gKiBSZWFjdC9qc2RvbS4gVGhlIHBvcHVwIGNvbXBvbmVudCBpbXBvcnRzIGJvdGggaGVscGVycyBhbmQgdGhyZWFkcyB0aGVcbiAqIGNvbmZpZ3VyZWQgYGFwaUJhc2VVcmxgIChmcm9tIEdFVF9BVVRIX1NUQVRVUykgdGhyb3VnaC5cbiAqL1xuLyoqXG4gKiBCdWlsZHMgdGhlIGRlZXAtbGluayB0byBhIHNpbmdsZSBvcHBvcnR1bml0eSdzIGRldGFpbCBwYWdlLlxuICpcbiAqIFRyYWlsaW5nIHNsYXNoZXMgb24gdGhlIGJhc2UgVVJMIGFyZSBzdHJpcHBlZCBzbyB3ZSBkb24ndCBwcm9kdWNlXG4gKiBgaHR0cDovL2xvY2FsaG9zdDozMDAwLy9vcHBvcnR1bml0aWVzLy4uLmAuIFRoZSBvcHBvcnR1bml0eSBpZCBpc1xuICogVVJJLWVuY29kZWQgZGVmZW5zaXZlbHkgZXZlbiB0aG91Z2ggc2VydmVyLXNpZGUgaWRzIGFyZSBzYWZlIHRvZGF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gb3Bwb3J0dW5pdHlEZXRhaWxVcmwoYXBpQmFzZVVybCwgb3Bwb3J0dW5pdHlJZCkge1xuICAgIGNvbnN0IGJhc2UgPSBhcGlCYXNlVXJsLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gICAgcmV0dXJuIGAke2Jhc2V9L29wcG9ydHVuaXRpZXMvJHtlbmNvZGVVUklDb21wb25lbnQob3Bwb3J0dW5pdHlJZCl9YDtcbn1cbi8qKlxuICogQnVpbGRzIHRoZSBkZWVwLWxpbmsgdG8gdGhlIHJldmlldyBxdWV1ZSB1c2VkIGFmdGVyIGEgYnVsayBzY3JhcGUgaW1wb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gb3Bwb3J0dW5pdHlSZXZpZXdVcmwoYXBpQmFzZVVybCkge1xuICAgIGNvbnN0IGJhc2UgPSBhcGlCYXNlVXJsLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gICAgcmV0dXJuIGAke2Jhc2V9L29wcG9ydHVuaXRpZXMvcmV2aWV3YDtcbn1cbiIsImltcG9ydCB7IGpzeHMgYXMgX2pzeHMsIGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5leHBvcnQgZnVuY3Rpb24gQnVsa1NvdXJjZUNhcmQocHJvcHMpIHtcbiAgICBjb25zdCB7IHNvdXJjZUxhYmVsLCBkZXRlY3RlZENvdW50LCBidXN5LCBsYXN0UmVzdWx0LCBsYXN0RXJyb3IsIG9uU2NyYXBlVmlzaWJsZSwgb25TY3JhcGVQYWdpbmF0ZWQsIG9uVmlld1RyYWNrZXIsIH0gPSBwcm9wcztcbiAgICBjb25zdCBkaXNhYmxlZCA9IGJ1c3kgIT09IG51bGwgfHwgZGV0ZWN0ZWRDb3VudCA9PT0gMDtcbiAgICByZXR1cm4gKF9qc3hzKFwiYXJ0aWNsZVwiLCB7IGNsYXNzTmFtZTogXCJjYXJkXCIsIFwiZGF0YS1idWxrLXNvdXJjZVwiOiBzb3VyY2VMYWJlbC50b0xvd2VyQ2FzZSgpLCBjaGlsZHJlbjogW19qc3hzKFwiaGVhZGVyXCIsIHsgY2xhc3NOYW1lOiBcImNhcmQtaGVhZFwiLCBjaGlsZHJlbjogW19qc3hzKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJjYXJkLXRpdGxlXCIsIGNoaWxkcmVuOiBbc291cmNlTGFiZWwsIFwiIGxpc3RcIl0gfSksIF9qc3hzKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJiYWRnZVwiLCBjaGlsZHJlbjogW2RldGVjdGVkQ291bnQsIFwiIHJvd1wiLCBkZXRlY3RlZENvdW50ID09PSAxID8gXCJcIiA6IFwic1wiXSB9KV0gfSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImFjdGlvbi1ncmlkXCIsIGNoaWxkcmVuOiBbX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBmdWxsXCIsIG9uQ2xpY2s6IG9uU2NyYXBlVmlzaWJsZSwgZGlzYWJsZWQ6IGRpc2FibGVkLCBjaGlsZHJlbjogYnVzeSA9PT0gXCJ2aXNpYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiU2NyYXBpbmcgdmlzaWJsZeKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgU2NyYXBlICR7ZGV0ZWN0ZWRDb3VudH0gdmlzaWJsZWAgfSksIF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGZ1bGxcIiwgb25DbGljazogb25TY3JhcGVQYWdpbmF0ZWQsIGRpc2FibGVkOiBkaXNhYmxlZCwgdGl0bGU6IGBXYWxrcyBldmVyeSBwYWdlIGluIHlvdXIgY3VycmVudCBmaWx0ZXIgc2V0OyBjYXBwZWQgYXQgMjAwIGpvYnMuYCwgY2hpbGRyZW46IGJ1c3kgPT09IFwicGFnaW5hdGVkXCIgPyBcIldhbGtpbmcgcGFnZXPigKZcIiA6IFwiU2NyYXBlIGZpbHRlcmVkIHNldFwiIH0pXSB9KSwgbGFzdFJlc3VsdCAmJiAoX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYnVsay1yZXN1bHRcIiwgY2hpbGRyZW46IFtfanN4cyhcInBcIiwgeyBjbGFzc05hbWU6IFwiaW5saW5lLW5vdGVcIiwgY2hpbGRyZW46IFtcIkltcG9ydGVkIFwiLCBsYXN0UmVzdWx0LmltcG9ydGVkLCBcIi9cIiwgbGFzdFJlc3VsdC5hdHRlbXB0ZWQsIGxhc3RSZXN1bHQucGFnZXMgPiAxICYmIGAgwrcgJHtsYXN0UmVzdWx0LnBhZ2VzfSBwYWdlc2AsIGxhc3RSZXN1bHQuZHVwbGljYXRlQ291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgIMK3ICR7bGFzdFJlc3VsdC5kdXBsaWNhdGVDb3VudH0gZHVwbGljYXRlc2BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiLCBsYXN0UmVzdWx0LmVycm9ycy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAgwrcgJHtsYXN0UmVzdWx0LmVycm9ycy5sZW5ndGh9IGVycm9yc2BdIH0pLCBsYXN0UmVzdWx0LmRlZHVwZWRJZHM/Lmxlbmd0aCA/IChfanN4cyhcInBcIiwgeyBjbGFzc05hbWU6IFwiaW5saW5lLW5vdGUgYnVsay1kdXBsaWNhdGVzXCIsIGNoaWxkcmVuOiBbXCJEdXBsaWNhdGVzOiBcIiwgbGFzdFJlc3VsdC5kZWR1cGVkSWRzLmpvaW4oXCIsIFwiKV0gfSkpIDogbnVsbCwgbGFzdFJlc3VsdC5pbXBvcnRlZCA+IDAgJiYgb25WaWV3VHJhY2tlciAmJiAoX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJzdWNjZXNzLWxpbmtcIiwgb25DbGljazogb25WaWV3VHJhY2tlciwgY2hpbGRyZW46IFwiVmlldyB0cmFja2VyIFxcdTIxOTJcIiB9KSldIH0pKSwgbGFzdEVycm9yICYmIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlubGluZS1lcnJvclwiLCBjaGlsZHJlbjogbGFzdEVycm9yIH0pXSB9KSk7XG59XG4iLCJpbXBvcnQgeyBqc3ggYXMgX2pzeCwganN4cyBhcyBfanN4cywgRnJhZ21lbnQgYXMgX0ZyYWdtZW50IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBmb3JtYXRSZWxhdGl2ZSB9IGZyb20gXCJAc2xvdGhpbmcvc2hhcmVkL2Zvcm1hdHRlcnNcIjtcbmltcG9ydCB7IHNjb3JlUmVzdW1lIH0gZnJvbSBcIkBzbG90aGluZy9zaGFyZWQvc2NvcmluZ1wiO1xuaW1wb3J0IHsgc2VuZE1lc3NhZ2UsIE1lc3NhZ2VzIH0gZnJvbSBcIkAvc2hhcmVkL21lc3NhZ2VzXCI7XG5pbXBvcnQgeyBtZXNzYWdlRm9yRXJyb3IgfSBmcm9tIFwiQC9zaGFyZWQvZXJyb3ItbWVzc2FnZXNcIjtcbmltcG9ydCB7IG9wcG9ydHVuaXR5RGV0YWlsVXJsLCBvcHBvcnR1bml0eVJldmlld1VybCB9IGZyb20gXCIuL2RlZXAtbGlua3NcIjtcbmltcG9ydCB7IEJ1bGtTb3VyY2VDYXJkLCB9IGZyb20gXCIuL0J1bGtTb3VyY2VDYXJkXCI7XG4vKiogU2VudGluZWwgdmFsdWUgdXNlZCBmb3IgdGhlIHBpY2tlcidzIFwiTWFzdGVyIHByb2ZpbGVcIiBvcHRpb24gKCMzNCkuICovXG5jb25zdCBNQVNURVJfUkVTVU1FX09QVElPTiA9IFwiX19tYXN0ZXJfX1wiO1xuY29uc3QgQlVMS19TT1VSQ0VfTEFCRUxTID0ge1xuICAgIGdyZWVuaG91c2U6IFwiR3JlZW5ob3VzZVwiLFxuICAgIGxldmVyOiBcIkxldmVyXCIsXG4gICAgd29ya2RheTogXCJXb3JrZGF5XCIsXG59O1xuY29uc3QgQlVMS19TT1VSQ0VfVVJMX1BBVFRFUk5TID0ge1xuICAgIGdyZWVuaG91c2U6IFsvYm9hcmRzXFwuZ3JlZW5ob3VzZVxcLmlvXFwvLywgL1tcXHctXStcXC5ncmVlbmhvdXNlXFwuaW9cXC8vXSxcbiAgICBsZXZlcjogWy9qb2JzXFwubGV2ZXJcXC5jb1xcLy8sIC9bXFx3LV0rXFwubGV2ZXJcXC5jb1xcLy9dLFxuICAgIHdvcmtkYXk6IFsvXFwubXl3b3JrZGF5am9ic1xcLmNvbVxcLy8sIC9cXC53b3JrZGF5am9ic1xcLmNvbVxcLy9dLFxufTtcbmZ1bmN0aW9uIG1hdGNoQnVsa1NvdXJjZSh1cmwpIHtcbiAgICBpZiAoIXVybClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoQlVMS19TT1VSQ0VfVVJMX1BBVFRFUk5TKSkge1xuICAgICAgICBpZiAoQlVMS19TT1VSQ0VfVVJMX1BBVFRFUk5TW2tleV0uc29tZSgocCkgPT4gcC50ZXN0KHVybCkpKVxuICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoKSB7XG4gICAgY29uc3QgW3ZpZXdTdGF0ZSwgc2V0Vmlld1N0YXRlXSA9IHVzZVN0YXRlKFwibG9hZGluZ1wiKTtcbiAgICBjb25zdCBbcHJvZmlsZSwgc2V0UHJvZmlsZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbcGFnZVN0YXR1cywgc2V0UGFnZVN0YXR1c10gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFthY3Rpb25JbkZsaWdodCwgc2V0QWN0aW9uSW5GbGlnaHRdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW2FjdGlvbkVycm9yLCBzZXRBY3Rpb25FcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbYWN0aW9uU3VjY2Vzcywgc2V0QWN0aW9uU3VjY2Vzc10gPSB1c2VTdGF0ZShudWxsKTtcbiAgICAvLyBDYWNoZWQgc28gdGhlIHN1Y2Nlc3Mgcm93IGNhbiByZW5kZXIgXCJWaWV3IGluIHRyYWNrZXJcIiBsaW5rcyB3aXRob3V0XG4gICAgLy8gcXVlcnlpbmcgR0VUX0FVVEhfU1RBVFVTIGFnYWluLiBQb3B1bGF0ZWQgZnJvbSB0aGUgYXV0aC1zdGF0dXMgcmVzcG9uc2VcbiAgICAvLyBvbiBmaXJzdCBsb2FkIGFuZCBrZXB0IHN0YWJsZSBmb3IgdGhlIGxpZmV0aW1lIG9mIHRoZSBwb3B1cC5cbiAgICBjb25zdCBbYXBpQmFzZVVybCwgc2V0QXBpQmFzZVVybF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbd3dTdGF0ZSwgc2V0V3dTdGF0ZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbd3dCdWxrSW5GbGlnaHQsIHNldFd3QnVsa0luRmxpZ2h0XSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFt3d0J1bGtSZXN1bHQsIHNldFd3QnVsa1Jlc3VsdF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbd3dCdWxrRXJyb3IsIHNldFd3QnVsa0Vycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIC8vIFAzLyMzOSDigJQgUGVyLXNvdXJjZSBzdGF0ZSBmb3IgR3JlZW5ob3VzZSAvIExldmVyIC8gV29ya2RheS4gS2V5ZWQgYnlcbiAgICAvLyBCdWxrU291cmNlS2V5IHNvIGEgZnV0dXJlIHNvdXJjZSBpcyBhIG9uZS1saW5lIGFkZGl0aW9uLlxuICAgIGNvbnN0IFtidWxrU3RhdGVzLCBzZXRCdWxrU3RhdGVzXSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbYnVsa0luRmxpZ2h0LCBzZXRCdWxrSW5GbGlnaHRdID0gdXNlU3RhdGUoe30pO1xuICAgIGNvbnN0IFtidWxrUmVzdWx0cywgc2V0QnVsa1Jlc3VsdHNdID0gdXNlU3RhdGUoe30pO1xuICAgIGNvbnN0IFtidWxrRXJyb3JzLCBzZXRCdWxrRXJyb3JzXSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbY29uZmlybWluZ0xvZ291dCwgc2V0Q29uZmlybWluZ0xvZ291dF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgLy8gIzM0IOKAlCBtdWx0aS1yZXN1bWUgcGlja2VyLiBMb2FkZWQgbGF6aWx5IG9uY2Ugd2Uga25vdyB3ZSdyZSBhdXRoZW50aWNhdGVkO1xuICAgIC8vIHNlbGVjdGlvbiBkZWZhdWx0cyB0byB0aGUgbWFzdGVyIHByb2ZpbGUgYW5kIGlzIHJlc2V0IHdoZW5ldmVyIGEgbmV3XG4gICAgLy8gc3VjY2Vzcy9lcnJvciBmaW5pc2hlcyBzbyBhIGZvbGxvdy11cCB0YWlsb3Igc3RhcnRzIGZyb20gYSBjbGVhbiBzbGF0ZS5cbiAgICBjb25zdCBbcmVzdW1lT3B0aW9ucywgc2V0UmVzdW1lT3B0aW9uc10gPSB1c2VTdGF0ZShbXSk7XG4gICAgY29uc3QgW3NlbGVjdGVkUmVzdW1lSWQsIHNldFNlbGVjdGVkUmVzdW1lSWRdID0gdXNlU3RhdGUoTUFTVEVSX1JFU1VNRV9PUFRJT04pO1xuICAgIGNvbnN0IHByb2ZpbGVTY29yZSA9IHByb2ZpbGUgPyBzY29yZVJlc3VtZSh7IHByb2ZpbGUgfSkub3ZlcmFsbCA6IG51bGw7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY2hlY2tBdXRoU3RhdHVzKCk7XG4gICAgICAgIGNoZWNrUGFnZVN0YXR1cygpO1xuICAgIH0sIFtdKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICBhc3luYyBmdW5jdGlvbiBjaGVja0F1dGhTdGF0dXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLmdldEF1dGhTdGF0dXMoKSk7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcyAmJiByZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpc0F1dGhlbnRpY2F0ZWQsIHNlc3Npb25Mb3N0LCBhcGlCYXNlVXJsOiB1cmwsIH0gPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh1cmwpXG4gICAgICAgICAgICAgICAgICAgIHNldEFwaUJhc2VVcmwodXJsKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFZpZXdTdGF0ZShcImF1dGhlbnRpY2F0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRQcm9maWxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNlc3Npb25Mb3N0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFZpZXdTdGF0ZShcInNlc3Npb24tbG9zdFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFZpZXdTdGF0ZShcInVuYXV0aGVudGljYXRlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRWaWV3U3RhdGUoXCJ1bmF1dGhlbnRpY2F0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgc2V0Vmlld1N0YXRlKFwiZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gbG9hZFByb2ZpbGUoKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0UHJvZmlsZSgpKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgJiYgcmVzcG9uc2UuZGF0YSkge1xuICAgICAgICAgICAgc2V0UHJvZmlsZShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQgdGhlIHJlc3VtZSBsaXN0ICgjMzQpLiBGYWlsdXJlIGlzIG5vbi1mYXRhbCDigJQgdGhlIHBpY2tlclxuICAgICAgICAvLyBqdXN0IGRvZXNuJ3QgcmVuZGVyLCBmYWxsaW5nIGJhY2sgdG8gdGhlIHByZXZpb3VzIG1hc3Rlci1vbmx5IGZsb3cuXG4gICAgICAgIGxvYWRSZXN1bWVzKCk7XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGxvYWRSZXN1bWVzKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5saXN0UmVzdW1lcygpKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGE/LnJlc3VtZXMpIHtcbiAgICAgICAgICAgICAgICBzZXRSZXN1bWVPcHRpb25zKHJlc3BvbnNlLmRhdGEucmVzdW1lcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgLy8gTm9uLWZhdGFsOiBsZWF2ZSB0aGUgcGlja2VyIGhpZGRlbi5cbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBjaGVja1BhZ2VTdGF0dXMoKSB7XG4gICAgICAgIGNvbnN0IFt0YWJdID0gYXdhaXQgY2hyb21lLnRhYnMucXVlcnkoe1xuICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgY3VycmVudFdpbmRvdzogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0YWI/LmlkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUX1BBR0VfU1RBVFVTXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFBhZ2VTdGF0dXMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAvLyBDb250ZW50IHNjcmlwdCBub3QgbG9hZGVkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFiLnVybCAmJiAvd2F0ZXJsb293b3Jrc1xcLnV3YXRlcmxvb1xcLmNhLy50ZXN0KHRhYi51cmwpKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJXV19HRVRfUEFHRV9TVEFURVwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHI/LnN1Y2Nlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRXd1N0YXRlKHIuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udGVudCBzY3JpcHQgbm90IHlldCBsb2FkZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQMy8jMzkg4oCUIHByb2JlIEdyZWVuaG91c2UvTGV2ZXIvV29ya2RheSBsaXN0aW5nIHBhZ2VzLiBPbmx5IG9uZVxuICAgICAgICAgICAgLy8gbWF0Y2hlciBmaXJlcyBwZXIgdmlzaXQgKHRoZSB1c2VyIGlzIG9uIGEgc2luZ2xlIGhvc3QpLlxuICAgICAgICAgICAgY29uc3QgYnVsa0tleSA9IG1hdGNoQnVsa1NvdXJjZSh0YWIudXJsKTtcbiAgICAgICAgICAgIGlmIChidWxrS2V5KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZVR5cGUgPSBidWxrUGFnZVN0YXRlTWVzc2FnZShidWxrS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgciA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbWVzc2FnZVR5cGUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocj8uc3VjY2VzcyAmJiByLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEJ1bGtTdGF0ZXMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtidWxrS2V5XTogci5kYXRhIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnRlbnQgc2NyaXB0IG5vdCB5ZXQgbG9hZGVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1bGtQYWdlU3RhdGVNZXNzYWdlKGtleSkge1xuICAgICAgICByZXR1cm4gYEJVTEtfJHtrZXkudG9VcHBlckNhc2UoKX1fR0VUX1BBR0VfU1RBVEVgO1xuICAgIH1cbiAgICBmdW5jdGlvbiBidWxrU2NyYXBlTWVzc2FnZShrZXksIG1vZGUpIHtcbiAgICAgICAgY29uc3Qgc3VmZml4ID0gbW9kZSA9PT0gXCJ2aXNpYmxlXCIgPyBcIlNDUkFQRV9WSVNJQkxFXCIgOiBcIlNDUkFQRV9QQUdJTkFURURcIjtcbiAgICAgICAgcmV0dXJuIGBCVUxLXyR7a2V5LnRvVXBwZXJDYXNlKCl9XyR7c3VmZml4fWA7XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUJ1bGtTb3VyY2VTY3JhcGUoa2V5LCBtb2RlKSB7XG4gICAgICAgIHNldEJ1bGtJbkZsaWdodCgocHJldikgPT4gKHsgLi4ucHJldiwgW2tleV06IG1vZGUgfSkpO1xuICAgICAgICBzZXRCdWxrRXJyb3JzKChwcmV2KSA9PiAoeyAuLi5wcmV2LCBba2V5XTogdW5kZWZpbmVkIH0pKTtcbiAgICAgICAgc2V0QnVsa1Jlc3VsdHMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiB1bmRlZmluZWQgfSkpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghdGFiPy5pZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgdGFiXCIpO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHsgdHlwZTogYnVsa1NjcmFwZU1lc3NhZ2Uoa2V5LCBtb2RlKSwgcGF5bG9hZDoge30gfTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZT8uc3VjY2VzcyAmJiByZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgc2V0QnVsa1Jlc3VsdHMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiByZXNwb25zZS5kYXRhIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldEJ1bGtFcnJvcnMoKHByZXYpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgICAgICAgICAgIFtrZXldOiBtZXNzYWdlRm9yRXJyb3IobmV3IEVycm9yKHJlc3BvbnNlPy5lcnJvciB8fCBcIkJ1bGsgc2NyYXBlIGZhaWxlZFwiKSksXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNldEJ1bGtFcnJvcnMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiBtZXNzYWdlRm9yRXJyb3IoZXJyKSB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBzZXRCdWxrSW5GbGlnaHQoKHByZXYpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0geyAuLi5wcmV2IH07XG4gICAgICAgICAgICAgICAgZGVsZXRlIG5leHRba2V5XTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVd3QnVsa1NjcmFwZShtb2RlKSB7XG4gICAgICAgIHNldFd3QnVsa0luRmxpZ2h0KG1vZGUpO1xuICAgICAgICBzZXRXd0J1bGtFcnJvcihudWxsKTtcbiAgICAgICAgc2V0V3dCdWxrUmVzdWx0KG51bGwpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRXaW5kb3c6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghdGFiPy5pZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhY3RpdmUgdGFiXCIpO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IG1vZGUgPT09IFwidmlzaWJsZVwiXG4gICAgICAgICAgICAgICAgPyBNZXNzYWdlcy53d1NjcmFwZUFsbFZpc2libGUoKVxuICAgICAgICAgICAgICAgIDogTWVzc2FnZXMud3dTY3JhcGVBbGxQYWdpbmF0ZWQoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZT8uc3VjY2VzcyAmJiByZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgc2V0V3dCdWxrUmVzdWx0KHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0V3dCdWxrRXJyb3IobWVzc2FnZUZvckVycm9yKG5ldyBFcnJvcihyZXNwb25zZT8uZXJyb3IgfHwgXCJCdWxrIHNjcmFwZSBmYWlsZWRcIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzZXRXd0J1bGtFcnJvcihtZXNzYWdlRm9yRXJyb3IoZXJyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBzZXRXd0J1bGtJbkZsaWdodChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVDb25uZWN0KCkge1xuICAgICAgICBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5vcGVuQXV0aCgpKTtcbiAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ291dCgpIHtcbiAgICAgICAgaWYgKCFjb25maXJtaW5nTG9nb3V0KSB7XG4gICAgICAgICAgICBzZXRDb25maXJtaW5nTG9nb3V0KHRydWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRDb25maXJtaW5nTG9nb3V0KGZhbHNlKSwgNDAwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMubG9nb3V0KCkpO1xuICAgICAgICBzZXRWaWV3U3RhdGUoXCJ1bmF1dGhlbnRpY2F0ZWRcIik7XG4gICAgICAgIHNldFByb2ZpbGUobnVsbCk7XG4gICAgICAgIHNldENvbmZpcm1pbmdMb2dvdXQoZmFsc2UpO1xuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVGaWxsRm9ybSgpIHtcbiAgICAgICAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRhYj8uaWQpIHtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiBcIlRSSUdHRVJfRklMTFwiIH0pO1xuICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlSW1wb3J0Sm9iKCkge1xuICAgICAgICBpZiAoIXBhZ2VTdGF0dXM/LnNjcmFwZWRKb2IpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHNldEFjdGlvbkluRmxpZ2h0KFwiaW1wb3J0XCIpO1xuICAgICAgICBzZXRBY3Rpb25FcnJvcihudWxsKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuaW1wb3J0Sm9iKHBhZ2VTdGF0dXMuc2NyYXBlZEpvYikpO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAvLyBDYXB0dXJlIHRoZSBvcHBvcnR1bml0eSBpZCBzbyB0aGUgc3VjY2VzcyByb3cgY2FuIGRlZXAtbGluayBpbnRvXG4gICAgICAgICAgICAgICAgLy8gL29wcG9ydHVuaXRpZXMvW2lkXSAoIzMxKS4gVGhlIGltcG9ydCBlbmRwb2ludCBndWFyYW50ZWVzIGF0IGxlYXN0XG4gICAgICAgICAgICAgICAgLy8gb25lIGlkIG9uIHN1Y2Nlc3MsIGJ1dCBiZSBkZWZlbnNpdmUgYWJvdXQgdGhlIGFycmF5IHNoYXBlLlxuICAgICAgICAgICAgICAgIGNvbnN0IG9wcG9ydHVuaXR5SWQgPSByZXNwb25zZS5kYXRhPy5vcHBvcnR1bml0eUlkcz8uWzBdO1xuICAgICAgICAgICAgICAgIHNldEFjdGlvblN1Y2Nlc3MoeyBhY3Rpb246IFwiaW1wb3J0XCIsIG9wcG9ydHVuaXR5SWQgfSk7XG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgYXV0by1jbG9zZSBhbnltb3JlIOKAlCB0aGUgc3VjY2VzcyByb3cgbm93IG9mZmVycyBhIGZvbGxvdy11cFxuICAgICAgICAgICAgICAgIC8vIGFjdGlvbiAoXCJWaWV3IGluIHRyYWNrZXIg4oaSXCIpLCBzbyBsZWF2ZSB0aGUgcG9wdXAgb3BlbiB1bnRpbCB0aGVcbiAgICAgICAgICAgICAgICAvLyB1c2VyIGRpc21pc3NlcyBvciBjbGlja3MgdGhyb3VnaC5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldEFjdGlvbkVycm9yKG1lc3NhZ2VGb3JFcnJvcihuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IgfHwgXCJGYWlsZWQgdG8gaW1wb3J0IGpvYlwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNldEFjdGlvbkVycm9yKG1lc3NhZ2VGb3JFcnJvcihlcnIpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldEFjdGlvbkluRmxpZ2h0KG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdlbmVyYXRlRnJvbVBhZ2UoYWN0aW9uKSB7XG4gICAgICAgIGlmICghcGFnZVN0YXR1cz8uc2NyYXBlZEpvYilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgc2V0QWN0aW9uSW5GbGlnaHQoYWN0aW9uKTtcbiAgICAgICAgc2V0QWN0aW9uRXJyb3IobnVsbCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyAjMzQg4oCUIG9ubHkgdGhyZWFkIGBiYXNlUmVzdW1lSWRgIHRocm91Z2ggd2hlbiB0aGUgdXNlciBhY3R1YWxseSBwaWNrZWRcbiAgICAgICAgICAgIC8vIGEgbm9uLW1hc3RlciByZXN1bWUuIENvdmVyLWxldHRlciBnZW5lcmF0aW9uIGRvZXNuJ3QgdGFrZSBhIGJhc2UgdG9kYXksXG4gICAgICAgICAgICAvLyBzbyB3ZSBvbmx5IGhvbm9yIHRoZSBzZWxlY3Rpb24gZm9yIHRoZSB0YWlsb3IgYWN0aW9uLlxuICAgICAgICAgICAgY29uc3QgYmFzZVJlc3VtZUlkID0gYWN0aW9uID09PSBcInRhaWxvclwiICYmIHNlbGVjdGVkUmVzdW1lSWQgIT09IE1BU1RFUl9SRVNVTUVfT1BUSU9OXG4gICAgICAgICAgICAgICAgPyBzZWxlY3RlZFJlc3VtZUlkXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYWN0aW9uID09PSBcInRhaWxvclwiXG4gICAgICAgICAgICAgICAgPyBNZXNzYWdlcy50YWlsb3JGcm9tUGFnZShwYWdlU3RhdHVzLnNjcmFwZWRKb2IsIGJhc2VSZXN1bWVJZClcbiAgICAgICAgICAgICAgICA6IE1lc3NhZ2VzLmdlbmVyYXRlQ292ZXJMZXR0ZXJGcm9tUGFnZShwYWdlU3RhdHVzLnNjcmFwZWRKb2IpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGE/LnVybCkge1xuICAgICAgICAgICAgICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogcmVzcG9uc2UuZGF0YS51cmwgfSk7XG4gICAgICAgICAgICAgICAgc2V0QWN0aW9uU3VjY2Vzcyh7IGFjdGlvbiB9KTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5jbG9zZSgpLCAxNTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldEFjdGlvbkVycm9yKG1lc3NhZ2VGb3JFcnJvcihuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IgfHwgXCJGYWlsZWQgdG8gZ2VuZXJhdGUgZG9jdW1lbnRcIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzZXRBY3Rpb25FcnJvcihtZXNzYWdlRm9yRXJyb3IoZXJyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBzZXRBY3Rpb25JbkZsaWdodChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVPcGVuRGFzaGJvYXJkKCkge1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gYXdhaXQgcmVzb2x2ZUFwaUJhc2VVcmwoKTtcbiAgICAgICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBgJHtiYXNlVXJsfS9kYXNoYm9hcmRgIH0pO1xuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIGNvbmZpZ3VyZWQgU2xvdGhpbmcgQVBJIGJhc2UgVVJMLCBwcmVmZXJyaW5nIHRoZSB2YWx1ZSB3ZVxuICAgICAqIGNhY2hlZCBhdCBmaXJzdCBwYWludCAoYGFwaUJhc2VVcmxgKSBhbmQgZmFsbGluZyBiYWNrIHRvIGEgZnJlc2hcbiAgICAgKiBHRVRfQVVUSF9TVEFUVVMgcm91bmR0cmlwIGlmIHdlIGhhdmVuJ3Qgc2VlbiBvbmUgeWV0LiBVc2VkIGJ5IGFsbCB0aGVcbiAgICAgKiBkZWVwLWxpbmsgaGFuZGxlcnMgKCMzMSkuXG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gcmVzb2x2ZUFwaUJhc2VVcmwoKSB7XG4gICAgICAgIGlmIChhcGlCYXNlVXJsKVxuICAgICAgICAgICAgcmV0dXJuIGFwaUJhc2VVcmw7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0QXV0aFN0YXR1cygpKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIHJldHVybiBkYXRhPy5hcGlCYXNlVXJsIHx8IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG4gICAgfVxuICAgIC8qKiBPcGVucyB0aGUgaW1wb3J0ZWQgb3Bwb3J0dW5pdHkgaW4gYSBuZXcgdGFiIGFuZCBjbG9zZXMgdGhlIHBvcHVwLiAoIzMxKSAqL1xuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVZpZXdPcHBvcnR1bml0eShvcHBvcnR1bml0eUlkKSB7XG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBhd2FpdCByZXNvbHZlQXBpQmFzZVVybCgpO1xuICAgICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IG9wcG9ydHVuaXR5RGV0YWlsVXJsKGJhc2VVcmwsIG9wcG9ydHVuaXR5SWQpIH0pO1xuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gICAgLyoqIE9wZW5zIHRoZSByZXZpZXcgcXVldWUgZm9yIHRoZSB1c2VyIHRvIHRyaWFnZSB0aGVpciBidWxrIGltcG9ydHMuICgjMzEpICovXG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlVmlld1Jldmlld1F1ZXVlKCkge1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gYXdhaXQgcmVzb2x2ZUFwaUJhc2VVcmwoKTtcbiAgICAgICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBvcHBvcnR1bml0eVJldmlld1VybChiYXNlVXJsKSB9KTtcbiAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHByb2ZpbGVJbml0aWFsKCkge1xuICAgICAgICBjb25zdCBuYW1lID0gcHJvZmlsZT8uY29udGFjdD8ubmFtZT8udHJpbSgpO1xuICAgICAgICBpZiAobmFtZSlcbiAgICAgICAgICAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBjb25zdCBlbWFpbCA9IHByb2ZpbGU/LmNvbnRhY3Q/LmVtYWlsO1xuICAgICAgICByZXR1cm4gZW1haWwgPyBlbWFpbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSA6IFwiU1wiO1xuICAgIH1cbiAgICBpZiAodmlld1N0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgICAgICByZXR1cm4gKF9qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicG9wdXBcIiwgY2hpbGRyZW46IF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInN0YXRlLWNlbnRlclwiLCBjaGlsZHJlbjogW19qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic3Bpbm5lclwiIH0pLCBfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzdGF0ZS10ZXh0XCIsIGNoaWxkcmVuOiBcIkNvbm5lY3RpbmdcXHUyMDI2XCIgfSldIH0pIH0pKTtcbiAgICB9XG4gICAgaWYgKHZpZXdTdGF0ZSA9PT0gXCJlcnJvclwiKSB7XG4gICAgICAgIHJldHVybiAoX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwb3B1cFwiLCBjaGlsZHJlbjogX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic3RhdGUtY2VudGVyXCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJzdGF0ZS1pY29uIGVycm9yXCIsIFwiYXJpYS1oaWRkZW5cIjogdHJ1ZSwgY2hpbGRyZW46IFwiIVwiIH0pLCBfanN4KFwiaDJcIiwgeyBjbGFzc05hbWU6IFwic3RhdGUtdGl0bGVcIiwgY2hpbGRyZW46IFwiU29tZXRoaW5nIHdlbnQgd3JvbmdcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwic3RhdGUtdGV4dFwiLCBjaGlsZHJlbjogZXJyb3IgfSksIF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIHByaW1hcnlcIiwgb25DbGljazogKCkgPT4gY2hlY2tBdXRoU3RhdHVzKCksIGNoaWxkcmVuOiBcIlRyeSBhZ2FpblwiIH0pXSB9KSB9KSk7XG4gICAgfVxuICAgIGlmICh2aWV3U3RhdGUgPT09IFwidW5hdXRoZW50aWNhdGVkXCIpIHtcbiAgICAgICAgcmV0dXJuIChfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInBvcHVwXCIsIGNoaWxkcmVuOiBfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJoZXJvXCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLW1hcmtcIiwgY2hpbGRyZW46IFwiU1wiIH0pLCBfanN4KFwiaDFcIiwgeyBjbGFzc05hbWU6IFwiaGVyby10aXRsZVwiLCBjaGlsZHJlbjogXCJTbG90aGluZ1wiIH0pLCBfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLXN1YlwiLCBjaGlsZHJlbjogXCJBdXRvLWZpbGwgYXBwbGljYXRpb25zLiBJbXBvcnQgam9icy4gVHJhY2sgZXZlcnl0aGluZy5cIiB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBibG9ja1wiLCBvbkNsaWNrOiBoYW5kbGVDb25uZWN0LCBjaGlsZHJlbjogXCJDb25uZWN0IGFjY291bnRcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaGVyby1mb290XCIsIGNoaWxkcmVuOiBcIllvdSdsbCBzaWduIGluIG9uY2UgXFx1MjAxNCBTbG90aGluZyByZW1lbWJlcnMuXCIgfSldIH0pIH0pKTtcbiAgICB9XG4gICAgaWYgKHZpZXdTdGF0ZSA9PT0gXCJzZXNzaW9uLWxvc3RcIikge1xuICAgICAgICByZXR1cm4gKF9qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicG9wdXBcIiwgY2hpbGRyZW46IF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImhlcm8gc2Vzc2lvbi1sb3N0XCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLW1hcmsgd2FyblwiLCBcImFyaWEtaGlkZGVuXCI6IHRydWUsIGNoaWxkcmVuOiBcIiFcIiB9KSwgX2pzeChcImgxXCIsIHsgY2xhc3NOYW1lOiBcImhlcm8tdGl0bGVcIiwgY2hpbGRyZW46IFwiU2Vzc2lvbiBsb3N0XCIgfSksIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImhlcm8tc3ViXCIsIGNoaWxkcmVuOiBcIlNsb3RoaW5nIGdvdCByZXNldCBieSB5b3VyIGJyb3dzZXIuIFJlY29ubmVjdCB0byBwaWNrIHVwIHdoZXJlIHlvdSBsZWZ0IG9mZiBcXHUyMDE0IHlvdXIgcHJvZmlsZSBhbmQgZGF0YSBhcmUgc2FmZS5cIiB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBibG9ja1wiLCBvbkNsaWNrOiBoYW5kbGVDb25uZWN0LCBjaGlsZHJlbjogXCJSZWNvbm5lY3RcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaGVyby1mb290XCIsIGNoaWxkcmVuOiBcIlRha2VzIGFib3V0IGZpdmUgc2Vjb25kcy5cIiB9KV0gfSkgfSkpO1xuICAgIH1cbiAgICBjb25zdCBkZXRlY3RlZEpvYiA9IHBhZ2VTdGF0dXM/LnNjcmFwZWRKb2I7XG4gICAgY29uc3Qgc2hvd1d3QnVsayA9IHd3U3RhdGUgJiYgd3dTdGF0ZS5raW5kID09PSBcImxpc3RcIjtcbiAgICBjb25zdCBkZXRlY3RlZEJ1bGtTb3VyY2VzID0gT2JqZWN0LmtleXMoQlVMS19TT1VSQ0VfTEFCRUxTKS5maWx0ZXIoKGtleSkgPT4gYnVsa1N0YXRlc1trZXldPy5kZXRlY3RlZCk7XG4gICAgY29uc3Qgc2hvd0ltcG9ydEpvYkNhcmQgPSBkZXRlY3RlZEpvYiB8fFxuICAgICAgICAod3dTdGF0ZSAmJiB3d1N0YXRlLmtpbmQgPT09IFwiZGV0YWlsXCIgJiYgcGFnZVN0YXR1cz8uc2NyYXBlZEpvYik7XG4gICAgY29uc3Qgbm90aGluZ0RldGVjdGVkID0gIXBhZ2VTdGF0dXM/Lmhhc0Zvcm0gJiZcbiAgICAgICAgIXNob3dJbXBvcnRKb2JDYXJkICYmXG4gICAgICAgICFzaG93V3dCdWxrICYmXG4gICAgICAgIGRldGVjdGVkQnVsa1NvdXJjZXMubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiAoX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicG9wdXBcIiwgY2hpbGRyZW46IFtfanN4cyhcImhlYWRlclwiLCB7IGNsYXNzTmFtZTogXCJ0b3BiYXJcIiwgY2hpbGRyZW46IFtfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJicmFuZFwiLCBjaGlsZHJlbjogW19qc3goXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImJyYW5kLW1hcmtcIiwgY2hpbGRyZW46IFwiU1wiIH0pLCBfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJicmFuZC1uYW1lXCIsIGNoaWxkcmVuOiBcIlNsb3RoaW5nXCIgfSldIH0pLCBfanN4cyhcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicGlsbCBva1wiLCB0aXRsZTogXCJFeHRlbnNpb24gY29ubmVjdGVkXCIsIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicGlsbC1kb3RcIiB9KSwgXCJDb25uZWN0ZWRcIl0gfSldIH0pLCBfanN4cyhcInNlY3Rpb25cIiwgeyBjbGFzc05hbWU6IFwicHJvZmlsZS1jYXJkXCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJhdmF0YXJcIiwgY2hpbGRyZW46IHByb2ZpbGVJbml0aWFsKCkgfSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInByb2ZpbGUtbWV0YVwiLCBjaGlsZHJlbjogW19qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvZmlsZS1uYW1lXCIsIGNoaWxkcmVuOiBwcm9maWxlPy5jb250YWN0Py5uYW1lIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlPy5jb250YWN0Py5lbWFpbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJTZXQgdXAgeW91ciBwcm9maWxlXCIgfSksIF9qc3goXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvZmlsZS1zdWJcIiwgY2hpbGRyZW46IHByb2ZpbGU/LmNvbXB1dGVkPy5jdXJyZW50VGl0bGUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGU/LmNvbXB1dGVkPy5jdXJyZW50Q29tcGFueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgJHtwcm9maWxlLmNvbXB1dGVkLmN1cnJlbnRUaXRsZX0gwrcgJHtwcm9maWxlLmNvbXB1dGVkLmN1cnJlbnRDb21wYW55fWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcHJvZmlsZT8uY29udGFjdD8uZW1haWwgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkFkZCB5b3VyIHdvcmsgaGlzdG9yeSBzbyBTbG90aGluZyBjYW4gdGFpbG9yXCIgfSldIH0pLCBwcm9maWxlU2NvcmUgIT09IG51bGwgPyAoX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IGBzY29yZSAke3Byb2ZpbGVTY29yZSA+PSA4MCA/IFwiaGlnaFwiIDogcHJvZmlsZVNjb3JlID49IDUwID8gXCJtaWRcIiA6IFwibG93XCJ9YCwgdGl0bGU6IFwiUHJvZmlsZSBjb21wbGV0ZW5lc3NcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzY29yZS1udW1cIiwgY2hpbGRyZW46IHByb2ZpbGVTY29yZSB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwic2NvcmUtdW5pdFwiLCBjaGlsZHJlbjogXCIvMTAwXCIgfSldIH0pKSA6IChfanN4KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBnaG9zdCB0aWdodFwiLCBvbkNsaWNrOiBoYW5kbGVPcGVuRGFzaGJvYXJkLCBjaGlsZHJlbjogXCJPcGVuXCIgfSkpXSB9KSwgX2pzeHMoXCJtYWluXCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnRcIiwgY2hpbGRyZW46IFtwYWdlU3RhdHVzPy5oYXNGb3JtICYmIChfanN4cyhcImFydGljbGVcIiwgeyBjbGFzc05hbWU6IFwiY2FyZCBhY2NlbnRcIiwgY2hpbGRyZW46IFtfanN4cyhcImhlYWRlclwiLCB7IGNsYXNzTmFtZTogXCJjYXJkLWhlYWRcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJjYXJkLXRpdGxlXCIsIGNoaWxkcmVuOiBcIkFwcGxpY2F0aW9uIGZvcm0gZGV0ZWN0ZWRcIiB9KSwgX2pzeHMoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImJhZGdlXCIsIGNoaWxkcmVuOiBbcGFnZVN0YXR1cy5kZXRlY3RlZEZpZWxkcywgXCIgZmllbGRzXCJdIH0pXSB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBibG9ja1wiLCBvbkNsaWNrOiBoYW5kbGVGaWxsRm9ybSwgY2hpbGRyZW46IFwiQXV0by1maWxsIGZvcm1cIiB9KV0gfSkpLCBzaG93SW1wb3J0Sm9iQ2FyZCAmJiBkZXRlY3RlZEpvYiAmJiAoX2pzeHMoXCJhcnRpY2xlXCIsIHsgY2xhc3NOYW1lOiBcImNhcmRcIiwgY2hpbGRyZW46IFtfanN4cyhcImhlYWRlclwiLCB7IGNsYXNzTmFtZTogXCJjYXJkLWhlYWRcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJjYXJkLXRpdGxlIGNsaXBcIiwgdGl0bGU6IGRldGVjdGVkSm9iLnRpdGxlLCBjaGlsZHJlbjogZGV0ZWN0ZWRKb2IudGl0bGUgfSksIF9qc3goXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImNhcmQtc3ViIGNsaXBcIiwgY2hpbGRyZW46IGRldGVjdGVkSm9iLmNvbXBhbnkgfSldIH0pLCBhY3Rpb25TdWNjZXNzID8gKF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInN1Y2Nlc3Mtcm93XCIsIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiY2hlY2tcIiwgY2hpbGRyZW46IFwiXFx1MjcxM1wiIH0pLCBfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzdWNjZXNzLWxhYmVsXCIsIGNoaWxkcmVuOiBhY3Rpb25TdWNjZXNzLmFjdGlvbiA9PT0gXCJpbXBvcnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiSW1wb3J0ZWQgdG8gb3Bwb3J0dW5pdGllc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJPcGVuaW5nIHRhYuKAplwiIH0pLCBhY3Rpb25TdWNjZXNzLmFjdGlvbiA9PT0gXCJpbXBvcnRcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvblN1Y2Nlc3Mub3Bwb3J0dW5pdHlJZCAmJiAoX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJzdWNjZXNzLWxpbmtcIiwgb25DbGljazogKCkgPT4gaGFuZGxlVmlld09wcG9ydHVuaXR5KGFjdGlvblN1Y2Nlc3Mub3Bwb3J0dW5pdHlJZCksIGNoaWxkcmVuOiBcIlZpZXcgaW4gdHJhY2tlciBcXHUyMTkyXCIgfSkpXSB9KSkgOiAoX2pzeHMoX0ZyYWdtZW50LCB7IGNoaWxkcmVuOiBbcmVzdW1lT3B0aW9ucy5sZW5ndGggPiAwICYmIChfanN4cyhcImxhYmVsXCIsIHsgY2xhc3NOYW1lOiBcInJlc3VtZS1waWNrZXJcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJyZXN1bWUtcGlja2VyLWxhYmVsXCIsIGNoaWxkcmVuOiBcIkJhc2Ugb25cIiB9KSwgX2pzeHMoXCJzZWxlY3RcIiwgeyBjbGFzc05hbWU6IFwicmVzdW1lLXBpY2tlci1zZWxlY3RcIiwgdmFsdWU6IHNlbGVjdGVkUmVzdW1lSWQsIG9uQ2hhbmdlOiAoZSkgPT4gc2V0U2VsZWN0ZWRSZXN1bWVJZChlLnRhcmdldC52YWx1ZSksIGRpc2FibGVkOiBhY3Rpb25JbkZsaWdodCAhPT0gbnVsbCwgXCJhcmlhLWxhYmVsXCI6IFwiQ2hvb3NlIHRoZSByZXN1bWUgdG8gdGFpbG9yIGZyb21cIiwgY2hpbGRyZW46IFtfanN4KFwib3B0aW9uXCIsIHsgdmFsdWU6IE1BU1RFUl9SRVNVTUVfT1BUSU9OLCBjaGlsZHJlbjogXCJNYXN0ZXIgcHJvZmlsZVwiIH0pLCByZXN1bWVPcHRpb25zLm1hcCgocmVzdW1lKSA9PiAoX2pzeChcIm9wdGlvblwiLCB7IHZhbHVlOiByZXN1bWUuaWQsIGNoaWxkcmVuOiByZXN1bWUubmFtZSB9LCByZXN1bWUuaWQpKSldIH0pXSB9KSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImFjdGlvbi1ncmlkXCIsIGNoaWxkcmVuOiBbX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeVwiLCBvbkNsaWNrOiAoKSA9PiBoYW5kbGVHZW5lcmF0ZUZyb21QYWdlKFwidGFpbG9yXCIpLCBkaXNhYmxlZDogYWN0aW9uSW5GbGlnaHQgIT09IG51bGwsIGNoaWxkcmVuOiBhY3Rpb25JbkZsaWdodCA9PT0gXCJ0YWlsb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJUYWlsb3JpbmfigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJUYWlsb3IgcmVzdW1lXCIgfSksIF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuXCIsIG9uQ2xpY2s6ICgpID0+IGhhbmRsZUdlbmVyYXRlRnJvbVBhZ2UoXCJjb3Zlci1sZXR0ZXJcIiksIGRpc2FibGVkOiBhY3Rpb25JbkZsaWdodCAhPT0gbnVsbCwgY2hpbGRyZW46IGFjdGlvbkluRmxpZ2h0ID09PSBcImNvdmVyLWxldHRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIldyaXRpbmfigKZcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJDb3ZlciBsZXR0ZXJcIiB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gZ2hvc3QgZnVsbFwiLCBvbkNsaWNrOiBoYW5kbGVJbXBvcnRKb2IsIGRpc2FibGVkOiBhY3Rpb25JbkZsaWdodCAhPT0gbnVsbCwgY2hpbGRyZW46IGFjdGlvbkluRmxpZ2h0ID09PSBcImltcG9ydFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIkltcG9ydGluZ+KAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIkp1c3QgaW1wb3J0IHRvIHRyYWNrZXJcIiB9KV0gfSldIH0pKSwgYWN0aW9uRXJyb3IgJiYgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaW5saW5lLWVycm9yXCIsIGNoaWxkcmVuOiBhY3Rpb25FcnJvciB9KV0gfSkpLCBzaG93V3dCdWxrICYmIHd3U3RhdGUgJiYgKF9qc3goQnVsa1NvdXJjZUNhcmQsIHsgc291cmNlTGFiZWw6IFwiV2F0ZXJsb29Xb3Jrc1wiLCBkZXRlY3RlZENvdW50OiB3d1N0YXRlLnJvd0NvdW50LCBidXN5OiB3d0J1bGtJbkZsaWdodCwgbGFzdFJlc3VsdDogd3dCdWxrUmVzdWx0LCBsYXN0RXJyb3I6IHd3QnVsa0Vycm9yLCBvblNjcmFwZVZpc2libGU6ICgpID0+IGhhbmRsZVd3QnVsa1NjcmFwZShcInZpc2libGVcIiksIG9uU2NyYXBlUGFnaW5hdGVkOiAoKSA9PiBoYW5kbGVXd0J1bGtTY3JhcGUoXCJwYWdpbmF0ZWRcIiksIG9uVmlld1RyYWNrZXI6IGhhbmRsZVZpZXdSZXZpZXdRdWV1ZSB9KSksIGRldGVjdGVkQnVsa1NvdXJjZXMubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gYnVsa1N0YXRlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoX2pzeChCdWxrU291cmNlQ2FyZCwgeyBzb3VyY2VMYWJlbDogQlVMS19TT1VSQ0VfTEFCRUxTW2tleV0sIGRldGVjdGVkQ291bnQ6IHN0YXRlLnJvd0NvdW50LCBidXN5OiBidWxrSW5GbGlnaHRba2V5XSA/PyBudWxsLCBsYXN0UmVzdWx0OiBidWxrUmVzdWx0c1trZXldID8/IG51bGwsIGxhc3RFcnJvcjogYnVsa0Vycm9yc1trZXldID8/IG51bGwsIG9uU2NyYXBlVmlzaWJsZTogKCkgPT4gaGFuZGxlQnVsa1NvdXJjZVNjcmFwZShrZXksIFwidmlzaWJsZVwiKSwgb25TY3JhcGVQYWdpbmF0ZWQ6ICgpID0+IGhhbmRsZUJ1bGtTb3VyY2VTY3JhcGUoa2V5LCBcInBhZ2luYXRlZFwiKSwgb25WaWV3VHJhY2tlcjogaGFuZGxlVmlld1Jldmlld1F1ZXVlIH0sIGtleSkpO1xuICAgICAgICAgICAgICAgICAgICB9KSwgbm90aGluZ0RldGVjdGVkICYmIChfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpZGxlXCIsIGNoaWxkcmVuOiBbX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaWRsZS10aXRsZVwiLCBjaGlsZHJlbjogXCJObyBqb2IgZGV0ZWN0ZWQgb24gdGhpcyBwYWdlXCIgfSksIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlkbGUtc3ViXCIsIGNoaWxkcmVuOiBcIk9wZW4gYSBwb3N0aW5nIG9uIGFueSBvZiB0aGVzZSBhbmQgU2xvdGhpbmcgd2FrZXMgdXA6XCIgfSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNpdGUtY2hpcHNcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzaXRlLWNoaXBcIiwgY2hpbGRyZW46IFwiTGlua2VkSW5cIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwic2l0ZS1jaGlwXCIsIGNoaWxkcmVuOiBcIkluZGVlZFwiIH0pLCBfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzaXRlLWNoaXBcIiwgY2hpbGRyZW46IFwiR3JlZW5ob3VzZVwiIH0pLCBfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzaXRlLWNoaXBcIiwgY2hpbGRyZW46IFwiTGV2ZXJcIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwic2l0ZS1jaGlwXCIsIGNoaWxkcmVuOiBcIldhdGVybG9vV29ya3NcIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwic2l0ZS1jaGlwXCIsIGNoaWxkcmVuOiBcIldvcmtkYXlcIiB9KV0gfSldIH0pKSwgX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicXVpY2stcm93XCIsIGNoaWxkcmVuOiBbX2pzeHMoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwicXVpY2tcIiwgb25DbGljazogaGFuZGxlT3BlbkRhc2hib2FyZCwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJxdWljay1pY29uXCIsIFwiYXJpYS1oaWRkZW5cIjogdHJ1ZSwgY2hpbGRyZW46IFwiXFx1MjE5N1wiIH0pLCBfanN4KFwic3BhblwiLCB7IGNoaWxkcmVuOiBcIkRhc2hib2FyZFwiIH0pXSB9KSwgX2pzeHMoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwicXVpY2tcIiwgb25DbGljazogKCkgPT4gY2hyb21lLnJ1bnRpbWUub3Blbk9wdGlvbnNQYWdlKCksIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicXVpY2staWNvblwiLCBcImFyaWEtaGlkZGVuXCI6IHRydWUsIGNoaWxkcmVuOiBcIlxcdTI2OTlcIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjaGlsZHJlbjogXCJTZXR0aW5nc1wiIH0pXSB9KV0gfSldIH0pLCBfanN4cyhcImZvb3RlclwiLCB7IGNsYXNzTmFtZTogXCJmb290YmFyXCIsIGNoaWxkcmVuOiBbX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogYGxpbmsgJHtjb25maXJtaW5nTG9nb3V0ID8gXCJ3YXJuXCIgOiBcIlwifWAsIG9uQ2xpY2s6IGhhbmRsZUxvZ291dCwgY2hpbGRyZW46IGNvbmZpcm1pbmdMb2dvdXQgPyBcIkNsaWNrIGFnYWluIHRvIGRpc2Nvbm5lY3RcIiA6IFwiRGlzY29ubmVjdFwiIH0pLCBwcm9maWxlPy51cGRhdGVkQXQgJiYgKF9qc3hzKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJ1cGRhdGVkXCIsIGNoaWxkcmVuOiBbXCJTeW5jZWQgXCIsIGZvcm1hdFJlbGF0aXZlKHByb2ZpbGUudXBkYXRlZEF0KV0gfSkpXSB9KV0gfSkpO1xufVxuIiwiaW1wb3J0IHsganN4IGFzIF9qc3ggfSBmcm9tIFwicmVhY3QvanN4LXJ1bnRpbWVcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tIFwicmVhY3QtZG9tL2NsaWVudFwiO1xuaW1wb3J0IEFwcCBmcm9tIFwiLi9BcHBcIjtcbmltcG9ydCBcIi4vc3R5bGVzLmNzc1wiO1xuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpO1xuaWYgKGNvbnRhaW5lcikge1xuICAgIGNvbnN0IHJvb3QgPSBjcmVhdGVSb290KGNvbnRhaW5lcik7XG4gICAgcm9vdC5yZW5kZXIoX2pzeChSZWFjdC5TdHJpY3RNb2RlLCB7IGNoaWxkcmVuOiBfanN4KEFwcCwge30pIH0pKTtcbn1cbiIsIi8qKlxuICogVXNlci1mYWNpbmcgZXJyb3Igc3RyaW5nIG1hcHBpbmcgZm9yIHRoZSBDb2x1bWJ1cyBleHRlbnNpb24uXG4gKlxuICogVGhlIHBvcHVwIChhbmQgYW55IG90aGVyIGV4dGVuc2lvbiBzdXJmYWNlKSBzaG91bGQgbmV2ZXIgc2hvdyByYXdcbiAqIGBcIlJlcXVlc3QgZmFpbGVkOiA1MDNcImAgLyBgXCJBdXRoZW50aWNhdGlvbiBleHBpcmVkXCJgIHN0cmluZ3MuIFdyYXAgYW55XG4gKiBlcnJvciBwYXRoIGluIGBtZXNzYWdlRm9yRXJyb3IoZXJyKWAgdG8gZ2V0IGFuIEVuZ2xpc2ggc2VudGVuY2Ugc2FmZVxuICogZm9yIGVuZC11c2Vycy5cbiAqXG4gKiBNaXJyb3Igb2YgdGhlIG1lc3NhZ2UgdG9uZSB1c2VkIGJ5IGBhcHBzL3dlYi8uLi4vZXh0ZW5zaW9uL2Nvbm5lY3QvcGFnZS50c3hgXG4gKiBgbWVzc2FnZUZvclN0YXR1c2Ag4oCUIHRoZSBjb25uZWN0IHBhZ2Uga2VlcHMgaXRzIG93biBjb3B5IGJlY2F1c2UgaXQgc2l0c1xuICogaW5zaWRlIHRoZSBuZXh0LWludGwgdHJlZSAoZGlmZmVyZW50IHBhY2thZ2UgYm91bmRhcnkpLCBidXQgdGhlXG4gKiB1c2VyLXZpc2libGUgc3RyaW5ncyBzaG91bGQgc3RheSBhbGlnbmVkLiBJZiB5b3UgY2hhbmdlIG9uZSwgY2hhbmdlIGJvdGguXG4gKlxuICogRW5nbGlzaC1vbmx5IGJ5IGRlc2lnbjogdGhlIGV4dGVuc2lvbiBpdHNlbGYgZG9lcyBub3QgdXNlIG5leHQtaW50bC5cbiAqL1xuLyoqXG4gKiBNYXBzIGFuIEhUVFAgc3RhdHVzIGNvZGUgdG8gYSBodW1hbi1mcmllbmRseSBtZXNzYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZUZvclN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzID09PSA0MDEgfHwgc3RhdHVzID09PSA0MDMpIHtcbiAgICAgICAgcmV0dXJuIFwiU2lnbiBpbiBleHBpcmVkLiBSZWNvbm5lY3QgdGhlIGV4dGVuc2lvbi5cIjtcbiAgICB9XG4gICAgaWYgKHN0YXR1cyA9PT0gNDI5KSB7XG4gICAgICAgIHJldHVybiBcIldlJ3JlIHJhdGUtbGltaXRlZC4gVHJ5IGFnYWluIGluIGEgbWludXRlLlwiO1xuICAgIH1cbiAgICBpZiAoc3RhdHVzID49IDUwMCkge1xuICAgICAgICByZXR1cm4gXCJTbG90aGluZyBzZXJ2ZXJzIGFyZSBoYXZpbmcgYSBwcm9ibGVtLlwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIjtcbn1cbi8qKlxuICogQmVzdC1lZmZvcnQgbWFwcGluZyBvZiBhbiB1bmtub3duIHRocm93biB2YWx1ZSB0byBhIGh1bWFuLWZyaWVuZGx5XG4gKiBtZXNzYWdlLiBSZWNvZ25pc2VzIHRoZSBzcGVjaWZpYyBwaHJhc2VzIHRoZSBhcGktY2xpZW50IHRocm93cyB0b2RheVxuICogKGBcIkF1dGhlbnRpY2F0aW9uIGV4cGlyZWRcImAsIGBcIk5vdCBhdXRoZW50aWNhdGVkXCJgLCBgXCJSZXF1ZXN0IGZhaWxlZDogPGNvZGU+XCJgLFxuICogYFwiRmFpbGVkIHRvIGZldGNoXCJgKSBhbmQgZmFsbHMgYmFjayB0byB0aGUgb3JpZ2luYWwgbWVzc2FnZSBmb3IgYW55dGhpbmdcbiAqIGVsc2Ug4oCUIHRoYXQncyBhbG1vc3QgYWx3YXlzIG1vcmUgdXNlZnVsIHRoYW4gYSBnZW5lcmljIGNhdGNoLWFsbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VGb3JFcnJvcihlcnIpIHtcbiAgICAvLyBHZW5lcmljIG5ldHdvcmsgZmFpbHVyZSAoZmV0Y2ggaW4gc2VydmljZSB3b3JrZXJzIHRocm93cyBUeXBlRXJyb3IgaGVyZSlcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgIHJldHVybiBcIk5ldHdvcmsgZXJyb3IuIENoZWNrIHlvdXIgY29ubmVjdGlvbiBhbmQgdHJ5IGFnYWluLlwiO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogXCJcIjtcbiAgICBpZiAoIXJhdylcbiAgICAgICAgcmV0dXJuIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuIFBsZWFzZSB0cnkgYWdhaW4uXCI7XG4gICAgLy8gQXV0aC1zaGFwZWQgbWVzc2FnZXMgZnJvbSBDb2x1bWJ1c0FQSUNsaWVudC5cbiAgICBpZiAocmF3ID09PSBcIkF1dGhlbnRpY2F0aW9uIGV4cGlyZWRcIiB8fFxuICAgICAgICByYXcgPT09IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB8fFxuICAgICAgICAvdW5hdXRob3IvaS50ZXN0KHJhdykpIHtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VGb3JTdGF0dXMoNDAxKTtcbiAgICB9XG4gICAgLy8gYFJlcXVlc3QgZmFpbGVkOiA1MDNgIOKAlCByZWNvdmVyIHRoZSBzdGF0dXMgY29kZS5cbiAgICBjb25zdCBtYXRjaCA9IHJhdy5tYXRjaCgvUmVxdWVzdCBmYWlsZWQ6XFxzKihcXGR7M30pLyk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIGNvbnN0IGNvZGUgPSBOdW1iZXIobWF0Y2hbMV0pO1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGNvZGUpKVxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VGb3JTdGF0dXMoY29kZSk7XG4gICAgfVxuICAgIC8vIEJyb3dzZXIgZmV0Y2ggZmFpbHVyZXMgYnViYmxlIHVwIGFzIFwiRmFpbGVkIHRvIGZldGNoXCIuXG4gICAgaWYgKC9mYWlsZWQgdG8gZmV0Y2gvaS50ZXN0KHJhdykgfHwgL25ldHdvcmsvaS50ZXN0KHJhdykpIHtcbiAgICAgICAgcmV0dXJuIFwiTmV0d29yayBlcnJvci4gQ2hlY2sgeW91ciBjb25uZWN0aW9uIGFuZCB0cnkgYWdhaW4uXCI7XG4gICAgfVxuICAgIC8vIEZvciBhbnl0aGluZyBlbHNlLCB0aGUgdW5kZXJseWluZyBtZXNzYWdlIGlzIHVzdWFsbHkgYSBzZW50ZW5jZSBhbHJlYWR5XG4gICAgLy8gKGUuZy4gXCJDb3VsZG4ndCByZWFkIHRoZSBmdWxsIGpvYiBkZXNjcmlwdGlvbiBmcm9tIHRoaXMgcGFnZS5cIikuXG4gICAgcmV0dXJuIHJhdztcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==