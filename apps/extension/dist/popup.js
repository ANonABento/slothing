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

var __webpack_unused_export__;
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
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}__webpack_unused_export__=l;exports.jsx=q;exports.jsxs=q;


/***/ },

/***/ 723
(module, __unused_webpack_exports, __webpack_require__) {



if (true) {
  module.exports = __webpack_require__(921);
} else // removed by dead control flow
{}


/***/ },

/***/ 779
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kF: () => (/* binding */ nowIso),
/* harmony export */   om: () => (/* binding */ formatRelative)
/* harmony export */ });
/* unused harmony exports DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALE_CHANGE_EVENT, SUPPORTED_LOCALES, normalizeLocale, nowDate, nowEpoch, parseToDate, toIso, toNullableIso, toEpoch, toNullableEpoch, getUserTimezone, formatAbsolute, formatDateOnly, formatTimeOnly, formatIsoDateOnly, formatMonthYear, isPast, isFuture, diffSeconds, diffDays, addDays, addMinutes, startOfDay, endOfDay, toUserTz, formatDateAbsolute, formatDateRelative, getBrowserDefaultLocale */
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


/***/ },

/***/ 922
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  K3: () => (/* binding */ scoreResume)
});

// UNUSED EXPORTS: scoreActionVerbs, scoreAtsFriendliness, scoreKeywordMatch, scoreLength, scoreQuantifiedAchievements, scoreSectionCompleteness, scoreSpellingGrammar

// EXTERNAL MODULE: ../../packages/shared/src/formatters/index.ts
var formatters = __webpack_require__(779);
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
        generatedAt: (0,formatters/* nowIso */.kF)(),
    };
}









/***/ },

/***/ 120
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(723);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var react = __webpack_require__(155);
// EXTERNAL MODULE: ../../node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js
var client = __webpack_require__(997);
// EXTERNAL MODULE: ../../packages/shared/src/formatters/index.ts
var formatters = __webpack_require__(779);
// EXTERNAL MODULE: ../../packages/shared/src/scoring/index.ts + 11 modules
var scoring = __webpack_require__(922);
// EXTERNAL MODULE: ./src/shared/types.ts
var types = __webpack_require__(353);
// EXTERNAL MODULE: ./src/shared/messages.ts
var messages = __webpack_require__(154);
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
const CONTENT_SCRIPT_URL_PATTERNS = [
    /linkedin\.com\//,
    /indeed\.com\//,
    /greenhouse\.io\//,
    /boards\.greenhouse\.io\//,
    /lever\.co\//,
    /jobs\.lever\.co\//,
    /waterlooworks\.uwaterloo\.ca\//,
    /workdayjobs\.com\//,
    /myworkdayjobs\.com\//,
];
function matchBulkSource(url) {
    if (!url)
        return null;
    for (const key of Object.keys(BULK_SOURCE_URL_PATTERNS)) {
        if (BULK_SOURCE_URL_PATTERNS[key].some((p) => p.test(url)))
            return key;
    }
    return null;
}
function hasContentScriptHost(url) {
    return (!!url && CONTENT_SCRIPT_URL_PATTERNS.some((pattern) => pattern.test(url)));
}
function App() {
    const [viewState, setViewState] = (0,react.useState)("loading");
    const [profile, setProfile] = (0,react.useState)(null);
    const [pageStatus, setPageStatus] = (0,react.useState)(null);
    const [surfaceContext, setSurfaceContext] = (0,react.useState)(null);
    const [activeTabId, setActiveTabId] = (0,react.useState)(null);
    const [activeTabUrl, setActiveTabUrl] = (0,react.useState)(null);
    const [pageProbeState, setPageProbeState] = (0,react.useState)("unknown");
    const [error, setError] = (0,react.useState)(null);
    // Cached so dashboard/review links can render without querying
    // GET_AUTH_STATUS again. Populated from the auth-status response on first
    // load and kept stable for the lifetime of the popup.
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
    const profileScore = profile ? (0,scoring/* scoreResume */.K3)({ profile }).overall : null;
    (0,react.useEffect)(() => {
        checkAuthStatus();
        checkPageStatus();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    (0,react.useEffect)(() => {
        const listener = (message) => {
            if (message.type === "AUTH_STATUS_CHANGED") {
                void checkAuthStatus();
            }
        };
        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    (0,react.useEffect)(() => {
        if (viewState !== "session-lost")
            return;
        const intervalId = window.setInterval(() => {
            void checkAuthStatus();
        }, 1000);
        return () => window.clearInterval(intervalId);
    }, [viewState]); // eslint-disable-line react-hooks/exhaustive-deps
    async function checkAuthStatus() {
        try {
            const response = await (0,messages/* sendMessage */._z)(messages/* Messages */.B2.getAuthStatus());
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
        const response = await (0,messages/* sendMessage */._z)(messages/* Messages */.B2.getProfile());
        if (response.success && response.data) {
            setProfile(response.data);
        }
    }
    async function checkPageStatus() {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        if (tab?.id) {
            setActiveTabId(tab.id);
            setActiveTabUrl(tab.url || null);
            try {
                const response = await chrome.tabs.sendMessage(tab.id, messages/* Messages */.B2.getSurfaceContext());
                if (response) {
                    const context = response;
                    setSurfaceContext(context);
                    setPageStatus({
                        hasForm: context.page.hasApplicationForm,
                        hasJobListing: context.page.job !== null,
                        detectedFields: context.page.detectedFieldCount,
                        scrapedJob: context.page.job,
                    });
                    setPageProbeState("ready");
                }
            }
            catch {
                setPageProbeState(!tab.url || hasContentScriptHost(tab.url)
                    ? "needs-refresh"
                    : "unknown");
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
                ? messages/* Messages */.B2.wwScrapeAllVisible()
                : messages/* Messages */.B2.wwScrapeAllPaginated();
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
        setError(null);
        try {
            const response = await (0,messages/* sendMessage */._z)(messages/* Messages */.B2.openAuth());
            if (response.success) {
                window.close();
                return;
            }
            setError((0,error_messages/* messageForError */.p)(new Error(response.error || "Failed to open")));
            setViewState("error");
        }
        catch (err) {
            setError((0,error_messages/* messageForError */.p)(err));
            setViewState("error");
        }
    }
    async function handleLogout() {
        if (!confirmingLogout) {
            setConfirmingLogout(true);
            setTimeout(() => setConfirmingLogout(false), 4000);
            return;
        }
        await (0,messages/* sendMessage */._z)(messages/* Messages */.B2.logout());
        setViewState("unauthenticated");
        setProfile(null);
        setConfirmingLogout(false);
    }
    async function handleOpenDashboard() {
        const baseUrl = await resolveApiBaseUrl();
        chrome.tabs.create({ url: `${baseUrl}/dashboard` });
        window.close();
    }
    async function handleShowPanel() {
        if (!activeTabId)
            return;
        try {
            const response = await chrome.tabs.sendMessage(activeTabId, {
                type: "SHOW_SLOTHING_PANEL",
            });
            if (!response?.success) {
                await checkPageStatus();
                return;
            }
            window.close();
        }
        catch {
            await chrome.tabs.reload(activeTabId);
            window.close();
        }
    }
    async function handleRefreshTab() {
        if (!activeTabId)
            return;
        await chrome.tabs.reload(activeTabId);
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
        const response = await (0,messages/* sendMessage */._z)(messages/* Messages */.B2.getAuthStatus());
        const data = response.data;
        return data?.apiBaseUrl || types/* DEFAULT_API_BASE_URL */.Ri;
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
    function supportedTabLabel() {
        const url = surfaceContext?.tab.url || activeTabUrl || undefined;
        if (!url || !hasContentScriptHost(url))
            return null;
        if (/waterlooworks\.uwaterloo\.ca/.test(url))
            return "WaterlooWorks";
        if (/linkedin\.com/.test(url))
            return "LinkedIn";
        if (/indeed\.com/.test(url))
            return "Indeed";
        if (/greenhouse\.io/.test(url))
            return "Greenhouse";
        if (/lever\.co/.test(url))
            return "Lever";
        if (/workdayjobs\.com/.test(url))
            return "Workday";
        return "this job site";
    }
    function signedOutContextCopy() {
        const site = supportedTabLabel();
        if (wwState?.kind === "list") {
            return {
                title: "WaterlooWorks jobs found",
                body: `Connect Slothing to import and track these ${wwState.rowCount} postings.`,
                site: "WaterlooWorks",
            };
        }
        if (pageStatus?.scrapedJob) {
            return {
                title: "Job detected",
                body: "Connect Slothing to tailor, save, and autofill from this posting.",
                site,
            };
        }
        if (pageStatus?.hasForm) {
            return {
                title: "Application page detected",
                body: "Connect Slothing to autofill this application from your profile.",
                site,
            };
        }
        if (site) {
            return {
                title: `${site} is supported`,
                body: "Connect Slothing to scan jobs, import postings, and open job tools here.",
                site,
            };
        }
        return null;
    }
    if (viewState === "loading") {
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: "state-center", children: [(0,jsx_runtime.jsx)("div", { className: "spinner" }), (0,jsx_runtime.jsx)("p", { className: "state-text", children: "Connecting\u2026" })] }) }));
    }
    if (viewState === "error") {
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: "state-center", children: [(0,jsx_runtime.jsx)("div", { className: "state-icon error", "aria-hidden": true, children: "!" }), (0,jsx_runtime.jsx)("h2", { className: "state-title", children: "Something went wrong" }), (0,jsx_runtime.jsx)("p", { className: "state-text", children: error }), (0,jsx_runtime.jsx)("button", { className: "btn primary", onClick: () => checkAuthStatus(), children: "Try again" })] }) }));
    }
    if (viewState === "unauthenticated") {
        const contextCopy = signedOutContextCopy();
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: `hero ${contextCopy ? "contextual" : ""}`, children: [(0,jsx_runtime.jsx)("img", { className: "hero-mark", src: chrome.runtime.getURL("brand/slothing-mark.png"), alt: "" }), contextCopy?.site && ((0,jsx_runtime.jsx)("span", { className: "hero-kicker", children: contextCopy.site })), (0,jsx_runtime.jsx)("h1", { className: "hero-title", children: contextCopy?.title || "Slothing" }), (0,jsx_runtime.jsx)("p", { className: "hero-sub", children: contextCopy?.body ||
                            "Auto-fill applications. Import jobs. Track everything." }), (0,jsx_runtime.jsx)("button", { className: "btn primary block", onClick: handleConnect, children: contextCopy ? "Connect to use job tools" : "Connect account" }), (0,jsx_runtime.jsx)("p", { className: "hero-foot", children: "You'll sign in once \u2014 Slothing remembers." })] }) }));
    }
    if (viewState === "session-lost") {
        const contextCopy = signedOutContextCopy();
        return ((0,jsx_runtime.jsx)("div", { className: "popup", children: (0,jsx_runtime.jsxs)("div", { className: `hero session-lost ${contextCopy ? "contextual" : ""}`, children: [(0,jsx_runtime.jsx)("div", { className: "hero-mark warn", "aria-hidden": true, children: "!" }), contextCopy?.site && ((0,jsx_runtime.jsx)("span", { className: "hero-kicker", children: contextCopy.site })), (0,jsx_runtime.jsx)("h1", { className: "hero-title", children: "Session lost" }), (0,jsx_runtime.jsx)("p", { className: "hero-sub", children: contextCopy
                            ? "Reconnect to use Slothing job tools on this page."
                            : "Slothing got reset by your browser. Reconnect to pick up where you left off — your profile and data are safe." }), (0,jsx_runtime.jsx)("button", { className: "btn primary block", onClick: handleConnect, children: "Reconnect" }), (0,jsx_runtime.jsx)("p", { className: "hero-foot", children: "Takes about five seconds." })] }) }));
    }
    const detectedJob = pageStatus?.scrapedJob;
    const workspaceVisible = !!surfaceContext?.workspace.visible;
    const showWwBulk = wwState && wwState.kind === "list";
    const detectedBulkSources = Object.keys(BULK_SOURCE_LABELS).filter((key) => bulkStates[key]?.detected);
    const nothingDetected = !pageStatus?.hasForm &&
        !detectedJob &&
        !showWwBulk &&
        detectedBulkSources.length === 0 &&
        pageProbeState !== "needs-refresh";
    const hasPageStatus = !!detectedJob || !!pageStatus?.hasForm || pageProbeState === "ready";
    const currentTabTitle = workspaceVisible
        ? "Job workspace active"
        : detectedJob
            ? "Job detected"
            : pageStatus?.hasForm
                ? "Application detected"
                : pageProbeState === "ready"
                    ? "No job detected"
                    : "Unsupported page";
    return ((0,jsx_runtime.jsxs)("div", { className: "popup", children: [(0,jsx_runtime.jsxs)("header", { className: "topbar", children: [(0,jsx_runtime.jsxs)("div", { className: "brand", children: [(0,jsx_runtime.jsx)("img", { className: "brand-mark", src: chrome.runtime.getURL("brand/slothing-mark.png"), alt: "" }), (0,jsx_runtime.jsx)("span", { className: "brand-name", children: "Slothing" })] }), (0,jsx_runtime.jsxs)("span", { className: "pill ok", title: "Extension connected", children: [(0,jsx_runtime.jsx)("span", { className: "pill-dot" }), "Connected"] })] }), (0,jsx_runtime.jsxs)("section", { className: "profile-card", children: [(0,jsx_runtime.jsx)("div", { className: "avatar", children: profileInitial() }), (0,jsx_runtime.jsxs)("div", { className: "profile-meta", children: [(0,jsx_runtime.jsx)("div", { className: "profile-name", children: profile?.contact?.name ||
                                    profile?.contact?.email ||
                                    "Set up your profile" }), (0,jsx_runtime.jsx)("div", { className: "profile-sub", children: profile?.computed?.currentTitle &&
                                    profile?.computed?.currentCompany
                                    ? `${profile.computed.currentTitle} · ${profile.computed.currentCompany}`
                                    : profile?.contact?.email ||
                                        "Add your work history so Slothing can tailor" })] }), profileScore !== null ? ((0,jsx_runtime.jsxs)("div", { className: `score ${profileScore >= 80 ? "high" : profileScore >= 50 ? "mid" : "low"}`, title: "Profile completeness", children: [(0,jsx_runtime.jsx)("span", { className: "score-num", children: profileScore }), (0,jsx_runtime.jsx)("span", { className: "score-unit", children: "/100" })] })) : ((0,jsx_runtime.jsx)("button", { className: "btn ghost tight", onClick: handleOpenDashboard, children: "Open" }))] }), (0,jsx_runtime.jsxs)("main", { className: "content", children: [pageProbeState === "needs-refresh" && ((0,jsx_runtime.jsxs)("article", { className: "status-card", children: [(0,jsx_runtime.jsxs)("div", { className: "status-copy", children: [(0,jsx_runtime.jsx)("span", { className: "status-eyebrow", children: "Current tab" }), (0,jsx_runtime.jsx)("span", { className: "status-title", children: "Page needs refresh" })] }), (0,jsx_runtime.jsx)("button", { className: "btn block", onClick: handleRefreshTab, children: "Refresh tab" })] })), hasPageStatus && ((0,jsx_runtime.jsxs)("article", { className: "status-card active", children: [(0,jsx_runtime.jsxs)("header", { className: "status-head", children: [(0,jsx_runtime.jsxs)("div", { className: "status-copy", children: [(0,jsx_runtime.jsx)("span", { className: "status-eyebrow", children: "Current tab" }), (0,jsx_runtime.jsx)("span", { className: "status-title", children: currentTabTitle })] }), pageStatus?.hasForm && ((0,jsx_runtime.jsxs)("span", { className: "badge", children: [pageStatus.detectedFields, " fields"] }))] }), detectedJob ? ((0,jsx_runtime.jsxs)("div", { className: "page-summary", children: [(0,jsx_runtime.jsx)("span", { className: "clip", title: detectedJob.title, children: detectedJob.title }), (0,jsx_runtime.jsx)("span", { className: "card-sub clip", children: detectedJob.company })] })) : ((0,jsx_runtime.jsx)("p", { className: "inline-note", children: pageStatus?.hasForm
                                    ? "Ready on this application page."
                                    : "Open a job posting, then scan again." })), detectedJob && ((0,jsx_runtime.jsx)("button", { className: "btn primary block", onClick: handleShowPanel, children: "Open job tools" })), !detectedJob && pageProbeState === "ready" && ((0,jsx_runtime.jsx)("button", { className: "btn block", onClick: checkPageStatus, children: "Scan again" }))] })), showWwBulk && wwState && ((0,jsx_runtime.jsx)(BulkSourceCard, { sourceLabel: "WaterlooWorks", detectedCount: wwState.rowCount, busy: wwBulkInFlight, lastResult: wwBulkResult, lastError: wwBulkError, onScrapeVisible: () => handleWwBulkScrape("visible"), onScrapePaginated: () => handleWwBulkScrape("paginated"), onViewTracker: handleViewReviewQueue })), detectedBulkSources.map((key) => {
                        const state = bulkStates[key];
                        if (!state)
                            return null;
                        return ((0,jsx_runtime.jsx)(BulkSourceCard, { sourceLabel: BULK_SOURCE_LABELS[key], detectedCount: state.rowCount, busy: bulkInFlight[key] ?? null, lastResult: bulkResults[key] ?? null, lastError: bulkErrors[key] ?? null, onScrapeVisible: () => handleBulkSourceScrape(key, "visible"), onScrapePaginated: () => handleBulkSourceScrape(key, "paginated"), onViewTracker: handleViewReviewQueue }, key));
                    }), nothingDetected && !hasPageStatus && ((0,jsx_runtime.jsxs)("div", { className: "idle", children: [(0,jsx_runtime.jsx)("p", { className: "idle-title", children: "Unsupported page" }), (0,jsx_runtime.jsx)("p", { className: "idle-sub", children: "Open a supported job posting or application page." })] })), (0,jsx_runtime.jsxs)("div", { className: "quick-row", children: [(0,jsx_runtime.jsxs)("button", { className: "quick", onClick: handleOpenDashboard, children: [(0,jsx_runtime.jsx)("span", { className: "quick-icon", "aria-hidden": true, children: "\u2197" }), (0,jsx_runtime.jsx)("span", { children: "Dashboard" })] }), (0,jsx_runtime.jsxs)("button", { className: "quick", onClick: () => chrome.runtime.openOptionsPage(), children: [(0,jsx_runtime.jsx)("span", { className: "quick-icon", "aria-hidden": true, children: "\u2699" }), (0,jsx_runtime.jsx)("span", { children: "Settings" })] })] })] }), (0,jsx_runtime.jsxs)("footer", { className: "footbar", children: [(0,jsx_runtime.jsx)("button", { className: `link ${confirmingLogout ? "warn" : ""}`, onClick: handleLogout, children: confirmingLogout ? "Click again to disconnect" : "Disconnect" }), profile?.updatedAt && ((0,jsx_runtime.jsxs)("span", { className: "updated", children: ["Synced ", (0,formatters/* formatRelative */.om)(profile.updatedAt)] }))] })] }));
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
 * User-facing error string mapping for the Slothing extension.
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
    // Auth-shaped messages from SlothingAPIClient.
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


/***/ },

/***/ 154
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B2: () => (/* binding */ Messages),
/* harmony export */   _z: () => (/* binding */ sendMessage)
/* harmony export */ });
/* unused harmony exports sendToTab, broadcastMessage */
// Message passing utilities for extension communication
// Type-safe message creators
const Messages = {
    // Auth messages
    getAuthStatus: () => ({ type: "GET_AUTH_STATUS" }),
    getSurfaceContext: () => ({ type: "GET_SURFACE_CONTEXT" }),
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


/***/ },

/***/ 353
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ri: () => (/* binding */ DEFAULT_API_BASE_URL),
/* harmony export */   Xf: () => (/* binding */ LEGACY_LOCAL_API_BASE_URL),
/* harmony export */   a$: () => (/* binding */ DEFAULT_SETTINGS),
/* harmony export */   eA: () => (/* binding */ SHOULD_PROMOTE_LEGACY_LOCAL_API_BASE_URL),
/* harmony export */   fc: () => (/* binding */ CHAT_PORT_NAME)
/* harmony export */ });
/**
 * P4/#40 — Long-lived port name used by the inline AI assistant. The content
 * script calls `chrome.runtime.connect({ name: CHAT_PORT_NAME })` and the
 * background's `chrome.runtime.onConnect` listener filters by this name.
 */
const CHAT_PORT_NAME = "slothing-chat-stream";
const DEFAULT_SETTINGS = {
    autoFillEnabled: true,
    showConfidenceIndicators: true,
    minimumConfidence: 0.5,
    learnFromAnswers: true,
    notifyOnJobDetected: true,
    autoTrackApplicationsEnabled: true,
    captureScreenshotEnabled: false,
};
const LEGACY_LOCAL_API_BASE_URL = "http://localhost:3000";
const DEFAULT_API_BASE_URL = "http://localhost:3000" || 0;
const SHOULD_PROMOTE_LEGACY_LOCAL_API_BASE_URL = DEFAULT_API_BASE_URL !== LEGACY_LOCAL_API_BASE_URL;


/***/ }

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(120));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TSxxREFBcUQ7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxNQUFNLGdFQUFnRTtBQUN0RTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxNQUFNLHVFQUF1RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsTUFBTSx3RUFBd0U7QUFDOUU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLE1BQU0sMEVBQTBFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsTUFBTSw4Q0FBOEM7QUFDcEQsTUFBTSwyQ0FBMkM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZUFBZTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHlEQUF5RDtBQUNuRjtBQUNBO0FBQ0Esc0NBQXNDLCtDQUErQztBQUNyRjtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHlEQUF5RDtBQUNuRjtBQUNBO0FBQ0Esc0NBQXNDLCtDQUErQztBQUNyRjtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1AsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3JMQTtBQUNBO0FBQ0EsMENBQTBDLHNCQUFzQjtBQUNoRTtBQUNBO0FBQ087QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNBLDZCQUE2Qix1QkFBMkMsSUFBSSxDQUF1QjtBQUNuRyIsInNvdXJjZXMiOlsid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0LWRvbUAxOC4zLjFfcmVhY3RAMTguMy4xL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vY2xpZW50LmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlYWN0QDE4LjMuMS9ub2RlX21vZHVsZXMvcmVhY3QvanN4LXJ1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL2Zvcm1hdHRlcnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvY29uc3RhbnRzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL3RleHQudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvYWN0aW9uLXZlcmJzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2F0cy1jaGFyYWN0ZXJzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9zY29yaW5nL2F0cy1mcmllbmRsaW5lc3MudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3Jpbmcvc3lub255bXMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3Jpbmcva2V5d29yZC1tYXRjaC50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9sZW5ndGgudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3JpbmcvcXVhbnRpZmllZC1hY2hpZXZlbWVudHMudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3Jpbmcvc2VjdGlvbi1jb21wbGV0ZW5lc3MudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL3Njb3Jpbmcvc3BlbGxpbmctZ3JhbW1hci50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NvcmluZy9pbmRleC50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL3BvcHVwL2RlZXAtbGlua3MudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9wb3B1cC9CdWxrU291cmNlQ2FyZC50c3giLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9wb3B1cC9BcHAudHN4Iiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvcG9wdXAvaW5kZXgudHN4Iiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvc2hhcmVkL2Vycm9yLW1lc3NhZ2VzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvc2hhcmVkL21lc3NhZ2VzLnRzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi9zcmMvc2hhcmVkL3R5cGVzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIG0gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIGV4cG9ydHMuY3JlYXRlUm9vdCA9IG0uY3JlYXRlUm9vdDtcbiAgZXhwb3J0cy5oeWRyYXRlUm9vdCA9IG0uaHlkcmF0ZVJvb3Q7XG59IGVsc2Uge1xuICB2YXIgaSA9IG0uX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQ7XG4gIGV4cG9ydHMuY3JlYXRlUm9vdCA9IGZ1bmN0aW9uKGMsIG8pIHtcbiAgICBpLnVzaW5nQ2xpZW50RW50cnlQb2ludCA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBtLmNyZWF0ZVJvb3QoYywgbyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGkudXNpbmdDbGllbnRFbnRyeVBvaW50ID0gZmFsc2U7XG4gICAgfVxuICB9O1xuICBleHBvcnRzLmh5ZHJhdGVSb290ID0gZnVuY3Rpb24oYywgaCwgbykge1xuICAgIGkudXNpbmdDbGllbnRFbnRyeVBvaW50ID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG0uaHlkcmF0ZVJvb3QoYywgaCwgbyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGkudXNpbmdDbGllbnRFbnRyeVBvaW50ID0gZmFsc2U7XG4gICAgfVxuICB9O1xufVxuIiwiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QtanN4LXJ1bnRpbWUucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuJ3VzZSBzdHJpY3QnO3ZhciBmPXJlcXVpcmUoXCJyZWFjdFwiKSxrPVN5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpLGw9U3ltYm9sLmZvcihcInJlYWN0LmZyYWdtZW50XCIpLG09T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxuPWYuX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQuUmVhY3RDdXJyZW50T3duZXIscD17a2V5OiEwLHJlZjohMCxfX3NlbGY6ITAsX19zb3VyY2U6ITB9O1xuZnVuY3Rpb24gcShjLGEsZyl7dmFyIGIsZD17fSxlPW51bGwsaD1udWxsO3ZvaWQgMCE9PWcmJihlPVwiXCIrZyk7dm9pZCAwIT09YS5rZXkmJihlPVwiXCIrYS5rZXkpO3ZvaWQgMCE9PWEucmVmJiYoaD1hLnJlZik7Zm9yKGIgaW4gYSltLmNhbGwoYSxiKSYmIXAuaGFzT3duUHJvcGVydHkoYikmJihkW2JdPWFbYl0pO2lmKGMmJmMuZGVmYXVsdFByb3BzKWZvcihiIGluIGE9Yy5kZWZhdWx0UHJvcHMsYSl2b2lkIDA9PT1kW2JdJiYoZFtiXT1hW2JdKTtyZXR1cm57JCR0eXBlb2Y6ayx0eXBlOmMsa2V5OmUscmVmOmgscHJvcHM6ZCxfb3duZXI6bi5jdXJyZW50fX1leHBvcnRzLkZyYWdtZW50PWw7ZXhwb3J0cy5qc3g9cTtleHBvcnRzLmpzeHM9cTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1qc3gtcnVudGltZS5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1qc3gtcnVudGltZS5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiZXhwb3J0IGNvbnN0IERFRkFVTFRfTE9DQUxFID0gXCJlbi1VU1wiO1xuY29uc3QgTlVNRVJJQ19QQVJUU19MT0NBTEUgPSBgJHtERUZBVUxUX0xPQ0FMRX0tdS1udS1sYXRuYDtcbmV4cG9ydCBjb25zdCBMT0NBTEVfQ09PS0lFX05BTUUgPSBcInRhaWRhX2xvY2FsZVwiO1xuZXhwb3J0IGNvbnN0IExPQ0FMRV9DSEFOR0VfRVZFTlQgPSBcInRhaWRhOmxvY2FsZS1jaGFuZ2VcIjtcbmV4cG9ydCBjb25zdCBTVVBQT1JURURfTE9DQUxFUyA9IFtcbiAgICB7IHZhbHVlOiBcImVuLVVTXCIsIGxhYmVsOiBcIkVuZ2xpc2ggKFVTKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJlbi1DQVwiLCBsYWJlbDogXCJFbmdsaXNoIChDQSlcIiB9LFxuICAgIHsgdmFsdWU6IFwiZW4tR0JcIiwgbGFiZWw6IFwiRW5nbGlzaCAoVUspXCIgfSxcbiAgICB7IHZhbHVlOiBcImZyXCIsIGxhYmVsOiBcIkZyZW5jaFwiIH0sXG4gICAgeyB2YWx1ZTogXCJlc1wiLCBsYWJlbDogXCJTcGFuaXNoXCIgfSxcbiAgICB7IHZhbHVlOiBcImRlXCIsIGxhYmVsOiBcIkdlcm1hblwiIH0sXG4gICAgeyB2YWx1ZTogXCJqYVwiLCBsYWJlbDogXCJKYXBhbmVzZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJ6aC1DTlwiLCBsYWJlbDogXCJDaGluZXNlIChTaW1wbGlmaWVkKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJwdFwiLCBsYWJlbDogXCJQb3J0dWd1ZXNlXCIgfSxcbiAgICB7IHZhbHVlOiBcInB0LUJSXCIsIGxhYmVsOiBcIlBvcnR1Z3Vlc2UgKEJyYXppbClcIiB9LFxuICAgIHsgdmFsdWU6IFwiaGlcIiwgbGFiZWw6IFwiSGluZGlcIiB9LFxuICAgIHsgdmFsdWU6IFwia29cIiwgbGFiZWw6IFwiS29yZWFuXCIgfSxcbl07XG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGxvY2FsZSkge1xuICAgIGlmICghbG9jYWxlKVxuICAgICAgICByZXR1cm4gREVGQVVMVF9MT0NBTEU7XG4gICAgY29uc3Qgc3VwcG9ydGVkID0gU1VQUE9SVEVEX0xPQ0FMRVMuZmluZCgoY2FuZGlkYXRlKSA9PiBjYW5kaWRhdGUudmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gbG9jYWxlLnRvTG93ZXJDYXNlKCkgfHxcbiAgICAgICAgY2FuZGlkYXRlLnZhbHVlLnNwbGl0KFwiLVwiKVswXS50b0xvd2VyQ2FzZSgpID09PSBsb2NhbGUudG9Mb3dlckNhc2UoKSk7XG4gICAgcmV0dXJuIHN1cHBvcnRlZD8udmFsdWUgPz8gREVGQVVMVF9MT0NBTEU7XG59XG5leHBvcnQgZnVuY3Rpb24gbm93SXNvKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gbm93RGF0ZSgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3dFcG9jaCgpIHtcbiAgICByZXR1cm4gRGF0ZS5ub3coKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRvRGF0ZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBcIlwiKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBkYXRlID0gdmFsdWUgaW5zdGFuY2VvZiBEYXRlID8gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpKSA6IG5ldyBEYXRlKHZhbHVlKTtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKGRhdGUuZ2V0VGltZSgpKSA/IG51bGwgOiBkYXRlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvSXNvKHZhbHVlKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b051bGxhYmxlSXNvKHZhbHVlKSB7XG4gICAgcmV0dXJuIHBhcnNlVG9EYXRlKHZhbHVlKT8udG9JU09TdHJpbmcoKSA/PyBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvRXBvY2godmFsdWUpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBkYXRlIHZhbHVlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZS5nZXRUaW1lKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9OdWxsYWJsZUVwb2NoKHZhbHVlKSB7XG4gICAgcmV0dXJuIHBhcnNlVG9EYXRlKHZhbHVlKT8uZ2V0VGltZSgpID8/IG51bGw7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlclRpbWV6b25lKCkge1xuICAgIGlmICh0eXBlb2YgSW50bCA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIFwiVVRDXCI7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS50aW1lWm9uZSB8fCBcIlVUQ1wiO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBcIlVUQ1wiO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldERpc3BsYXlUaW1lem9uZSh0aW1lWm9uZSkge1xuICAgIGlmICh0aW1lWm9uZSlcbiAgICAgICAgcmV0dXJuIHRpbWVab25lO1xuICAgIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiID8gXCJVVENcIiA6IGdldFVzZXJUaW1lem9uZSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEFic29sdXRlKHZhbHVlLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgcmV0dXJuIFwiVW5rbm93biBkYXRlXCI7XG4gICAgY29uc3QgaW5jbHVkZVRpbWUgPSBvcHRzLmluY2x1ZGVUaW1lID8/IHRydWU7XG4gICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQobm9ybWFsaXplTG9jYWxlKG9wdHMubG9jYWxlKSwge1xuICAgICAgICBtb250aDogXCJzaG9ydFwiLFxuICAgICAgICBkYXk6IFwibnVtZXJpY1wiLFxuICAgICAgICB5ZWFyOiBcIm51bWVyaWNcIixcbiAgICAgICAgLi4uKGluY2x1ZGVUaW1lID8geyBob3VyOiBcIm51bWVyaWNcIiwgbWludXRlOiBcIjItZGlnaXRcIiB9IDoge30pLFxuICAgICAgICB0aW1lWm9uZTogZ2V0RGlzcGxheVRpbWV6b25lKG9wdHMudGltZVpvbmUpLFxuICAgIH0pO1xuICAgIGNvbnN0IGZvcm1hdHRlZCA9IGZvcm1hdHRlci5mb3JtYXQoZGF0ZSk7XG4gICAgaWYgKCFpbmNsdWRlVGltZSlcbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZDtcbiAgICBjb25zdCBsYXN0Q29tbWEgPSBmb3JtYXR0ZWQubGFzdEluZGV4T2YoXCIsXCIpO1xuICAgIGlmIChsYXN0Q29tbWEgPT09IC0xKVxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkO1xuICAgIHJldHVybiBgJHtmb3JtYXR0ZWQuc2xpY2UoMCwgbGFzdENvbW1hKX0gwrcgJHtmb3JtYXR0ZWRcbiAgICAgICAgLnNsaWNlKGxhc3RDb21tYSArIDEpXG4gICAgICAgIC50cmltKCl9YDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRSZWxhdGl2ZSh2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBjb25zdCBjdXJyZW50ID0gcGFyc2VUb0RhdGUob3B0cy5ub3cgPz8gbm93SXNvKCkpO1xuICAgIGlmICghZGF0ZSB8fCAhY3VycmVudCkge1xuICAgICAgICByZXR1cm4gXCJVbmtub3duIGRhdGVcIjtcbiAgICB9XG4gICAgY29uc3QgZGlmZk1zID0gY3VycmVudC5nZXRUaW1lKCkgLSBkYXRlLmdldFRpbWUoKTtcbiAgICBjb25zdCBhYnNNcyA9IE1hdGguYWJzKGRpZmZNcyk7XG4gICAgY29uc3QgaXNGdXR1cmUgPSBkaWZmTXMgPCAwO1xuICAgIGNvbnN0IG1pbnV0ZSA9IDYwICogMTAwMDtcbiAgICBjb25zdCBob3VyID0gNjAgKiBtaW51dGU7XG4gICAgY29uc3QgZGF5ID0gMjQgKiBob3VyO1xuICAgIGNvbnN0IHdlZWsgPSA3ICogZGF5O1xuICAgIGNvbnN0IG1vbnRoID0gMzAgKiBkYXk7XG4gICAgY29uc3QgeWVhciA9IDM2NSAqIGRheTtcbiAgICBpZiAoYWJzTXMgPCBtaW51dGUpXG4gICAgICAgIHJldHVybiBcIkp1c3Qgbm93XCI7XG4gICAgaWYgKGFic01zIDwgaG91cilcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyBtaW51dGUpLCBcIm1cIiwgaXNGdXR1cmUpO1xuICAgIGlmIChhYnNNcyA8IGRheSlcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyBob3VyKSwgXCJoXCIsIGlzRnV0dXJlKTtcbiAgICBpZiAoYWJzTXMgPCAyICogZGF5KVxuICAgICAgICByZXR1cm4gaXNGdXR1cmUgPyBcIlRvbW9ycm93XCIgOiBcIlllc3RlcmRheVwiO1xuICAgIGlmIChhYnNNcyA8IHdlZWspXG4gICAgICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZUJ1Y2tldChNYXRoLmZsb29yKGFic01zIC8gZGF5KSwgXCJkXCIsIGlzRnV0dXJlKTtcbiAgICBpZiAoYWJzTXMgPCBtb250aClcbiAgICAgICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyB3ZWVrKSwgXCJ3XCIsIGlzRnV0dXJlKTtcbiAgICBpZiAoYWJzTXMgPCB5ZWFyKVxuICAgICAgICByZXR1cm4gZm9ybWF0UmVsYXRpdmVCdWNrZXQoTWF0aC5mbG9vcihhYnNNcyAvIG1vbnRoKSwgXCJtb1wiLCBpc0Z1dHVyZSk7XG4gICAgcmV0dXJuIGZvcm1hdFJlbGF0aXZlQnVja2V0KE1hdGguZmxvb3IoYWJzTXMgLyB5ZWFyKSwgXCJ5XCIsIGlzRnV0dXJlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXREYXRlT25seSh2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHJldHVybiBcIlVua25vd24gZGF0ZVwiO1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChub3JtYWxpemVMb2NhbGUob3B0cy5sb2NhbGUpLCB7XG4gICAgICAgIG1vbnRoOiBcInNob3J0XCIsXG4gICAgICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICB0aW1lWm9uZTogZ2V0RGlzcGxheVRpbWV6b25lKG9wdHMudGltZVpvbmUpLFxuICAgIH0pLmZvcm1hdChkYXRlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lT25seSh2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHJldHVybiBcIlVua25vd24gdGltZVwiO1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChub3JtYWxpemVMb2NhbGUob3B0cy5sb2NhbGUpLCB7XG4gICAgICAgIGhvdXI6IFwibnVtZXJpY1wiLFxuICAgICAgICBtaW51dGU6IFwiMi1kaWdpdFwiLFxuICAgICAgICB0aW1lWm9uZTogZ2V0RGlzcGxheVRpbWV6b25lKG9wdHMudGltZVpvbmUpLFxuICAgIH0pLmZvcm1hdChkYXRlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRJc29EYXRlT25seSh2YWx1ZSA9IG5vd0lzbygpKSB7XG4gICAgcmV0dXJuIHRvSXNvKHBhcnNlVG9EYXRlKHZhbHVlKSA/PyBub3dJc28oKSkuc2xpY2UoMCwgMTApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1vbnRoWWVhcih2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChub3JtYWxpemVMb2NhbGUob3B0cy5sb2NhbGUpLCB7XG4gICAgICAgIG1vbnRoOiBcInNob3J0XCIsXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICB0aW1lWm9uZTogZ2V0RGlzcGxheVRpbWV6b25lKG9wdHMudGltZVpvbmUpLFxuICAgIH0pLmZvcm1hdChkYXRlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1Bhc3QodmFsdWUsIG5vdyA9IG5vd0lzbygpKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBjb25zdCBjdXJyZW50ID0gcGFyc2VUb0RhdGUobm93KTtcbiAgICByZXR1cm4gQm9vbGVhbihkYXRlICYmIGN1cnJlbnQgJiYgZGF0ZS5nZXRUaW1lKCkgPCBjdXJyZW50LmdldFRpbWUoKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNGdXR1cmUodmFsdWUsIG5vdyA9IG5vd0lzbygpKSB7XG4gICAgY29uc3QgZGF0ZSA9IHBhcnNlVG9EYXRlKHZhbHVlKTtcbiAgICBjb25zdCBjdXJyZW50ID0gcGFyc2VUb0RhdGUobm93KTtcbiAgICByZXR1cm4gQm9vbGVhbihkYXRlICYmIGN1cnJlbnQgJiYgZGF0ZS5nZXRUaW1lKCkgPiBjdXJyZW50LmdldFRpbWUoKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZGlmZlNlY29uZHMoYSwgYikge1xuICAgIGNvbnN0IGZpcnN0ID0gcGFyc2VUb0RhdGUoYSk7XG4gICAgY29uc3Qgc2Vjb25kID0gcGFyc2VUb0RhdGUoYik7XG4gICAgaWYgKCFmaXJzdCB8fCAhc2Vjb25kKVxuICAgICAgICByZXR1cm4gTnVtYmVyLk5hTjtcbiAgICByZXR1cm4gTWF0aC50cnVuYygoZmlyc3QuZ2V0VGltZSgpIC0gc2Vjb25kLmdldFRpbWUoKSkgLyAxMDAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkaWZmRGF5cyhhLCBiKSB7XG4gICAgY29uc3Qgc2Vjb25kcyA9IGRpZmZTZWNvbmRzKGEsIGIpO1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oc2Vjb25kcykgPyBOdW1iZXIuTmFOIDogc2Vjb25kcyAvIDg2NDAwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZERheXModmFsdWUsIGRheXMpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICByZXR1cm4gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyBkYXlzICogODY0MDAwMDApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZE1pbnV0ZXModmFsdWUsIG1pbnV0ZXMpIHtcbiAgICBjb25zdCBkYXRlID0gcGFyc2VUb0RhdGUodmFsdWUpO1xuICAgIGlmICghZGF0ZSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgZGF0ZSB2YWx1ZVwiKTtcbiAgICByZXR1cm4gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyBtaW51dGVzICogNjAwMDApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0T2ZEYXkodmFsdWUsIHRpbWVab25lID0gXCJVVENcIikge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBkYXRlIHZhbHVlXCIpO1xuICAgIGlmICh0aW1lWm9uZSA9PT0gXCJVVENcIikge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZS5nZXRVVENGdWxsWWVhcigpLCBkYXRlLmdldFVUQ01vbnRoKCksIGRhdGUuZ2V0VVRDRGF0ZSgpKSk7XG4gICAgfVxuICAgIGNvbnN0IHBhcnRzID0gZ2V0Wm9uZWRQYXJ0cyhkYXRlLCB0aW1lWm9uZSk7XG4gICAgcmV0dXJuIHpvbmVkVGltZVRvVXRjKHBhcnRzLnllYXIsIHBhcnRzLm1vbnRoLCBwYXJ0cy5kYXksIDAsIDAsIDAsIHRpbWVab25lKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlbmRPZkRheSh2YWx1ZSwgdGltZVpvbmUgPSBcIlVUQ1wiKSB7XG4gICAgcmV0dXJuIGFkZE1pbnV0ZXMoYWRkRGF5cyhzdGFydE9mRGF5KHZhbHVlLCB0aW1lWm9uZSksIDEpLCAtMSAvIDYwMDAwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b1VzZXJUeih2YWx1ZSwgdGltZVpvbmUgPSBnZXRVc2VyVGltZXpvbmUoKSkge1xuICAgIGNvbnN0IGRhdGUgPSBwYXJzZVRvRGF0ZSh2YWx1ZSk7XG4gICAgaWYgKCFkYXRlKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBkYXRlIHZhbHVlXCIpO1xuICAgIGNvbnN0IHBhcnRzID0gZ2V0Wm9uZWRQYXJ0cyhkYXRlLCB0aW1lWm9uZSk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHBhcnRzLnllYXIsIHBhcnRzLm1vbnRoIC0gMSwgcGFydHMuZGF5LCBwYXJ0cy5ob3VyLCBwYXJ0cy5taW51dGUsIHBhcnRzLnNlY29uZCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RGF0ZUFic29sdXRlKGRhdGUsIGxvY2FsZSA9IERFRkFVTFRfTE9DQUxFKSB7XG4gICAgcmV0dXJuIGZvcm1hdEFic29sdXRlKGRhdGUsIHsgbG9jYWxlIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERhdGVSZWxhdGl2ZShkYXRlLCBub3cgPSBub3dJc28oKSkge1xuICAgIHJldHVybiBmb3JtYXRSZWxhdGl2ZShkYXRlLCB7IG5vdyB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcm93c2VyRGVmYXVsdExvY2FsZSgpIHtcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIERFRkFVTFRfTE9DQUxFO1xuICAgIHJldHVybiBub3JtYWxpemVMb2NhbGUobmF2aWdhdG9yLmxhbmd1YWdlKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFJlbGF0aXZlQnVja2V0KHZhbHVlLCB1bml0LCBpc0Z1dHVyZSkge1xuICAgIHJldHVybiBpc0Z1dHVyZSA/IGBpbiAke3ZhbHVlfSR7dW5pdH1gIDogYCR7dmFsdWV9JHt1bml0fSBhZ29gO1xufVxuZnVuY3Rpb24gZ2V0Wm9uZWRQYXJ0cyhkYXRlLCB0aW1lWm9uZSkge1xuICAgIGNvbnN0IHBhcnRzID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoTlVNRVJJQ19QQVJUU19MT0NBTEUsIHtcbiAgICAgICAgdGltZVpvbmUsXG4gICAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgICBtb250aDogXCIyLWRpZ2l0XCIsXG4gICAgICAgIGRheTogXCIyLWRpZ2l0XCIsXG4gICAgICAgIGhvdXI6IFwiMi1kaWdpdFwiLFxuICAgICAgICBtaW51dGU6IFwiMi1kaWdpdFwiLFxuICAgICAgICBzZWNvbmQ6IFwiMi1kaWdpdFwiLFxuICAgICAgICBob3VyQ3ljbGU6IFwiaDIzXCIsXG4gICAgfSkuZm9ybWF0VG9QYXJ0cyhkYXRlKTtcbiAgICBjb25zdCBnZXQgPSAodHlwZSkgPT4gTnVtYmVyKHBhcnRzLmZpbmQoKHBhcnQpID0+IHBhcnQudHlwZSA9PT0gdHlwZSk/LnZhbHVlKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB5ZWFyOiBnZXQoXCJ5ZWFyXCIpLFxuICAgICAgICBtb250aDogZ2V0KFwibW9udGhcIiksXG4gICAgICAgIGRheTogZ2V0KFwiZGF5XCIpLFxuICAgICAgICBob3VyOiBnZXQoXCJob3VyXCIpLFxuICAgICAgICBtaW51dGU6IGdldChcIm1pbnV0ZVwiKSxcbiAgICAgICAgc2Vjb25kOiBnZXQoXCJzZWNvbmRcIiksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHpvbmVkVGltZVRvVXRjKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCB0aW1lWm9uZSkge1xuICAgIGNvbnN0IHV0Y0d1ZXNzID0gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggLSAxLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kKSk7XG4gICAgY29uc3QgcGFydHMgPSBnZXRab25lZFBhcnRzKHV0Y0d1ZXNzLCB0aW1lWm9uZSk7XG4gICAgY29uc3Qgb2Zmc2V0TXMgPSBEYXRlLlVUQyhwYXJ0cy55ZWFyLCBwYXJ0cy5tb250aCAtIDEsIHBhcnRzLmRheSwgcGFydHMuaG91ciwgcGFydHMubWludXRlLCBwYXJ0cy5zZWNvbmQpIC0gdXRjR3Vlc3MuZ2V0VGltZSgpO1xuICAgIHJldHVybiBuZXcgRGF0ZSh1dGNHdWVzcy5nZXRUaW1lKCkgLSBvZmZzZXRNcyk7XG59XG4iLCJleHBvcnQgY29uc3QgU1VCX1NDT1JFX01BWF9QT0lOVFMgPSB7XG4gICAgc2VjdGlvbkNvbXBsZXRlbmVzczogMTAsXG4gICAgYWN0aW9uVmVyYnM6IDE1LFxuICAgIHF1YW50aWZpZWRBY2hpZXZlbWVudHM6IDIwLFxuICAgIGtleXdvcmRNYXRjaDogMjUsXG4gICAgbGVuZ3RoOiAxMCxcbiAgICBzcGVsbGluZ0dyYW1tYXI6IDEwLFxuICAgIGF0c0ZyaWVuZGxpbmVzczogMTAsXG59O1xuZXhwb3J0IGNvbnN0IEFDVElPTl9WRVJCUyA9IFtcbiAgICBcImFjaGlldmVkXCIsXG4gICAgXCJhbmFseXplZFwiLFxuICAgIFwiYXJjaGl0ZWN0ZWRcIixcbiAgICBcImJ1aWx0XCIsXG4gICAgXCJjb2xsYWJvcmF0ZWRcIixcbiAgICBcImNyZWF0ZWRcIixcbiAgICBcImRlbGl2ZXJlZFwiLFxuICAgIFwiZGVzaWduZWRcIixcbiAgICBcImRldmVsb3BlZFwiLFxuICAgIFwiZHJvdmVcIixcbiAgICBcImltcHJvdmVkXCIsXG4gICAgXCJpbmNyZWFzZWRcIixcbiAgICBcImxhdW5jaGVkXCIsXG4gICAgXCJsZWRcIixcbiAgICBcIm1hbmFnZWRcIixcbiAgICBcIm1lbnRvcmVkXCIsXG4gICAgXCJvcHRpbWl6ZWRcIixcbiAgICBcInJlZHVjZWRcIixcbiAgICBcInJlc29sdmVkXCIsXG4gICAgXCJzaGlwcGVkXCIsXG4gICAgXCJzdHJlYW1saW5lZFwiLFxuICAgIFwic3VwcG9ydGVkXCIsXG4gICAgXCJ0cmFuc2Zvcm1lZFwiLFxuXTtcbmV4cG9ydCBjb25zdCBRVUFOVElGSUVEX1JFR0VYID0gL1xcZCslfFxcJFtcXGQsXSsoPzpcXC5cXGQrKT9ba0ttTWJCXT98XFxiXFxkK3hcXGJ8XFxidGVhbSBvZiBcXGQrXFxifFxcYlxcZCtcXHMrKHVzZXJzfGN1c3RvbWVyc3xjbGllbnRzfHByb2plY3RzfHBlb3BsZXxlbmdpbmVlcnN8cmVwb3J0c3xob3Vyc3xtZW1iZXJzfGNvdW50cmllc3xsYW5ndWFnZXN8c3RhdGVzfGNpdGllc3xzdG9yZXN8cGFydG5lcnN8ZGVhbHN8bGVhZHMpXFxiL2dpO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVRleHQodGV4dCkge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgIC5yZXBsYWNlKC9bXmEtejAtOSsjLlxccy8tXS9nLCBcIiBcIilcbiAgICAgICAgLnJlcGxhY2UoL1xccysvZywgXCIgXCIpXG4gICAgICAgIC50cmltKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdvcmRCb3VuZGFyeVJlZ2V4KHRlcm0sIGZsYWdzID0gXCJcIikge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBcXFxcYiR7ZXNjYXBlUmVnRXhwKHRlcm0pfVxcXFxiYCwgZmxhZ3MpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zV29yZCh0ZXh0LCB0ZXJtKSB7XG4gICAgcmV0dXJuIHdvcmRCb3VuZGFyeVJlZ2V4KHRlcm0pLnRlc3QodGV4dCk7XG59XG5leHBvcnQgZnVuY3Rpb24gY291bnRXb3JkT2NjdXJyZW5jZXModGV4dCwgdGVybSkge1xuICAgIHJldHVybiAodGV4dC5tYXRjaCh3b3JkQm91bmRhcnlSZWdleCh0ZXJtLCBcImdcIikpIHx8IFtdKS5sZW5ndGg7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlnaGxpZ2h0cyhwcm9maWxlKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgLi4ucHJvZmlsZS5leHBlcmllbmNlcy5mbGF0TWFwKChleHBlcmllbmNlKSA9PiBleHBlcmllbmNlLmhpZ2hsaWdodHMpLFxuICAgICAgICAuLi5wcm9maWxlLnByb2plY3RzLmZsYXRNYXAoKHByb2plY3QpID0+IHByb2plY3QuaGlnaGxpZ2h0cyksXG4gICAgXS5maWx0ZXIoQm9vbGVhbik7XG59XG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFByb2ZpbGVUZXh0KHByb2ZpbGUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IFtcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py5uYW1lLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LmVtYWlsLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LnBob25lLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LmxvY2F0aW9uLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LmxpbmtlZGluLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LmdpdGh1YixcbiAgICAgICAgcHJvZmlsZS5jb250YWN0Py53ZWJzaXRlLFxuICAgICAgICBwcm9maWxlLmNvbnRhY3Q/LmhlYWRsaW5lLFxuICAgICAgICBwcm9maWxlLnN1bW1hcnksXG4gICAgICAgIC4uLnByb2ZpbGUuZXhwZXJpZW5jZXMuZmxhdE1hcCgoZXhwZXJpZW5jZSkgPT4gW1xuICAgICAgICAgICAgZXhwZXJpZW5jZS50aXRsZSxcbiAgICAgICAgICAgIGV4cGVyaWVuY2UuY29tcGFueSxcbiAgICAgICAgICAgIGV4cGVyaWVuY2UubG9jYXRpb24sXG4gICAgICAgICAgICBleHBlcmllbmNlLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgLi4uZXhwZXJpZW5jZS5oaWdobGlnaHRzLFxuICAgICAgICAgICAgLi4uZXhwZXJpZW5jZS5za2lsbHMsXG4gICAgICAgICAgICBleHBlcmllbmNlLnN0YXJ0RGF0ZSxcbiAgICAgICAgICAgIGV4cGVyaWVuY2UuZW5kRGF0ZSxcbiAgICAgICAgXSksXG4gICAgICAgIC4uLnByb2ZpbGUuZWR1Y2F0aW9uLmZsYXRNYXAoKGVkdWNhdGlvbikgPT4gW1xuICAgICAgICAgICAgZWR1Y2F0aW9uLmluc3RpdHV0aW9uLFxuICAgICAgICAgICAgZWR1Y2F0aW9uLmRlZ3JlZSxcbiAgICAgICAgICAgIGVkdWNhdGlvbi5maWVsZCxcbiAgICAgICAgICAgIC4uLmVkdWNhdGlvbi5oaWdobGlnaHRzLFxuICAgICAgICAgICAgZWR1Y2F0aW9uLnN0YXJ0RGF0ZSxcbiAgICAgICAgICAgIGVkdWNhdGlvbi5lbmREYXRlLFxuICAgICAgICBdKSxcbiAgICAgICAgLi4ucHJvZmlsZS5za2lsbHMubWFwKChza2lsbCkgPT4gc2tpbGwubmFtZSksXG4gICAgICAgIC4uLnByb2ZpbGUucHJvamVjdHMuZmxhdE1hcCgocHJvamVjdCkgPT4gW1xuICAgICAgICAgICAgcHJvamVjdC5uYW1lLFxuICAgICAgICAgICAgcHJvamVjdC5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIHByb2plY3QudXJsLFxuICAgICAgICAgICAgLi4ucHJvamVjdC5oaWdobGlnaHRzLFxuICAgICAgICAgICAgLi4ucHJvamVjdC50ZWNobm9sb2dpZXMsXG4gICAgICAgIF0pLFxuICAgICAgICAuLi5wcm9maWxlLmNlcnRpZmljYXRpb25zLmZsYXRNYXAoKGNlcnRpZmljYXRpb24pID0+IFtcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb24ubmFtZSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRpb24uaXNzdWVyLFxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbi5kYXRlLFxuICAgICAgICAgICAgY2VydGlmaWNhdGlvbi51cmwsXG4gICAgICAgIF0pLFxuICAgIF07XG4gICAgcmV0dXJuIHBhcnRzLmZpbHRlcihCb29sZWFuKS5qb2luKFwiXFxuXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc3VtZVRleHQocHJvZmlsZSwgcmF3VGV4dCkge1xuICAgIHJldHVybiAocmF3VGV4dD8udHJpbSgpIHx8IHByb2ZpbGUucmF3VGV4dD8udHJpbSgpIHx8IGV4dHJhY3RQcm9maWxlVGV4dChwcm9maWxlKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gd29yZENvdW50KHRleHQpIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplVGV4dCh0ZXh0KTtcbiAgICBpZiAoIW5vcm1hbGl6ZWQpXG4gICAgICAgIHJldHVybiAwO1xuICAgIHJldHVybiBub3JtYWxpemVkLnNwbGl0KC9cXHMrLykuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aDtcbn1cbiIsImltcG9ydCB7IEFDVElPTl9WRVJCUywgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldEhpZ2hsaWdodHMsIG5vcm1hbGl6ZVRleHQsIHdvcmRCb3VuZGFyeVJlZ2V4IH0gZnJvbSBcIi4vdGV4dFwiO1xuZnVuY3Rpb24gcG9pbnRzRm9yRGlzdGluY3RWZXJicyhjb3VudCkge1xuICAgIGlmIChjb3VudCA9PT0gMClcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgaWYgKGNvdW50IDw9IDIpXG4gICAgICAgIHJldHVybiA1O1xuICAgIGlmIChjb3VudCA8PSA0KVxuICAgICAgICByZXR1cm4gOTtcbiAgICBpZiAoY291bnQgPD0gNylcbiAgICAgICAgcmV0dXJuIDEyO1xuICAgIHJldHVybiAxNTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzY29yZUFjdGlvblZlcmJzKGlucHV0KSB7XG4gICAgY29uc3QgZGlzdGluY3RWZXJicyA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGNvbnN0IGhpZ2hsaWdodCBvZiBnZXRIaWdobGlnaHRzKGlucHV0LnByb2ZpbGUpKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0V29yZCA9IG5vcm1hbGl6ZVRleHQoaGlnaGxpZ2h0KS5zcGxpdCgvXFxzKy8pWzBdID8/IFwiXCI7XG4gICAgICAgIGZvciAoY29uc3QgdmVyYiBvZiBBQ1RJT05fVkVSQlMpIHtcbiAgICAgICAgICAgIGlmICh3b3JkQm91bmRhcnlSZWdleCh2ZXJiKS50ZXN0KGZpcnN0V29yZCkpIHtcbiAgICAgICAgICAgICAgICBkaXN0aW5jdFZlcmJzLmFkZCh2ZXJiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB2ZXJicyA9IEFycmF5LmZyb20oZGlzdGluY3RWZXJicykuc29ydCgpO1xuICAgIGNvbnN0IG5vdGVzID0gdmVyYnMubGVuZ3RoID09PSAwXG4gICAgICAgID8gW1wiU3RhcnQgYWNoaWV2ZW1lbnQgYnVsbGV0cyB3aXRoIHN0cm9uZyBhY3Rpb24gdmVyYnMuXCJdXG4gICAgICAgIDogW107XG4gICAgY29uc3QgcHJldmlldyA9IHZlcmJzLnNsaWNlKDAsIDUpLmpvaW4oXCIsIFwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwiYWN0aW9uVmVyYnNcIixcbiAgICAgICAgbGFiZWw6IFwiQWN0aW9uIHZlcmJzXCIsXG4gICAgICAgIGVhcm5lZDogcG9pbnRzRm9yRGlzdGluY3RWZXJicyh2ZXJicy5sZW5ndGgpLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmFjdGlvblZlcmJzLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IFtcbiAgICAgICAgICAgIHByZXZpZXdcbiAgICAgICAgICAgICAgICA/IGAke3ZlcmJzLmxlbmd0aH0gZGlzdGluY3QgYWN0aW9uIHZlcmJzICgke3ByZXZpZXd9KWBcbiAgICAgICAgICAgICAgICA6IFwiMCBkaXN0aW5jdCBhY3Rpb24gdmVyYnNcIixcbiAgICAgICAgXSxcbiAgICB9O1xufVxuIiwiZXhwb3J0IGNvbnN0IFBST0JMRU1BVElDX0NIQVJBQ1RFUlMgPSBbXG4gICAgeyBjaGFyOiBcIlxcdTIwMjJcIiwgbmFtZTogXCJidWxsZXQgcG9pbnRcIiwgcmVwbGFjZW1lbnQ6IFwiLVwiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMTNcIiwgbmFtZTogXCJlbiBkYXNoXCIsIHJlcGxhY2VtZW50OiBcIi1cIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDE0XCIsIG5hbWU6IFwiZW0gZGFzaFwiLCByZXBsYWNlbWVudDogXCItXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxY1wiLCBuYW1lOiBcImN1cmx5IHF1b3RlIGxlZnRcIiwgcmVwbGFjZW1lbnQ6ICdcIicgfSxcbiAgICB7IGNoYXI6IFwiXFx1MjAxZFwiLCBuYW1lOiBcImN1cmx5IHF1b3RlIHJpZ2h0XCIsIHJlcGxhY2VtZW50OiAnXCInIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMThcIiwgbmFtZTogXCJjdXJseSBhcG9zdHJvcGhlIGxlZnRcIiwgcmVwbGFjZW1lbnQ6IFwiJ1wiIH0sXG4gICAgeyBjaGFyOiBcIlxcdTIwMTlcIiwgbmFtZTogXCJjdXJseSBhcG9zdHJvcGhlIHJpZ2h0XCIsIHJlcGxhY2VtZW50OiBcIidcIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMDI2XCIsIG5hbWU6IFwiZWxsaXBzaXNcIiwgcmVwbGFjZW1lbnQ6IFwiLi4uXCIgfSxcbiAgICB7IGNoYXI6IFwiXFx1MDBhOVwiLCBuYW1lOiBcImNvcHlyaWdodFwiLCByZXBsYWNlbWVudDogXCIoYylcIiB9LFxuICAgIHsgY2hhcjogXCJcXHUwMGFlXCIsIG5hbWU6IFwicmVnaXN0ZXJlZFwiLCByZXBsYWNlbWVudDogXCIoUilcIiB9LFxuICAgIHsgY2hhcjogXCJcXHUyMTIyXCIsIG5hbWU6IFwidHJhZGVtYXJrXCIsIHJlcGxhY2VtZW50OiBcIihUTSlcIiB9LFxuXTtcbiIsImltcG9ydCB7IFBST0JMRU1BVElDX0NIQVJBQ1RFUlMgfSBmcm9tIFwiLi9hdHMtY2hhcmFjdGVyc1wiO1xuaW1wb3J0IHsgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldFJlc3VtZVRleHQgfSBmcm9tIFwiLi90ZXh0XCI7XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVBdHNGcmllbmRsaW5lc3MoaW5wdXQpIHtcbiAgICBjb25zdCB0ZXh0ID0gZ2V0UmVzdW1lVGV4dChpbnB1dC5wcm9maWxlLCBpbnB1dC5yYXdUZXh0KTtcbiAgICBjb25zdCByYXdUZXh0ID0gaW5wdXQucmF3VGV4dCA/PyBpbnB1dC5wcm9maWxlLnJhd1RleHQgPz8gXCJcIjtcbiAgICBjb25zdCBub3RlcyA9IFtdO1xuICAgIGNvbnN0IGV2aWRlbmNlID0gW107XG4gICAgbGV0IGRlZHVjdGlvbnMgPSAwO1xuICAgIGNvbnN0IGZvdW5kUHJvYmxlbWF0aWMgPSBQUk9CTEVNQVRJQ19DSEFSQUNURVJTLmZpbHRlcigoeyBjaGFyIH0pID0+IHRleHQuaW5jbHVkZXMoY2hhcikpO1xuICAgIGlmIChmb3VuZFByb2JsZW1hdGljLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGVuYWx0eSA9IE1hdGgubWluKDMsIGZvdW5kUHJvYmxlbWF0aWMubGVuZ3RoKTtcbiAgICAgICAgZGVkdWN0aW9ucyArPSBwZW5hbHR5O1xuICAgICAgICBub3Rlcy5wdXNoKFwiU3BlY2lhbCBmb3JtYXR0aW5nIGNoYXJhY3RlcnMgY2FuIHJlZHVjZSBBVFMgcGFyc2UgcXVhbGl0eS5cIik7XG4gICAgICAgIGV2aWRlbmNlLnB1c2goYCR7Zm91bmRQcm9ibGVtYXRpYy5sZW5ndGh9IHNwZWNpYWwgY2hhcmFjdGVyc2ApO1xuICAgIH1cbiAgICBjb25zdCBiYWRDaGFycyA9ICh0ZXh0Lm1hdGNoKC9bXFx1RkZGRFxcdTAwMDAtXFx1MDAwOFxcdTAwMEJcXHUwMDBDXFx1MDAwRS1cXHUwMDFGXS9nKSB8fCBbXSkubGVuZ3RoO1xuICAgIGlmIChiYWRDaGFycyA+IDApIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAyO1xuICAgICAgICBub3Rlcy5wdXNoKFwiQ29udHJvbCBvciByZXBsYWNlbWVudCBjaGFyYWN0ZXJzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgJHtiYWRDaGFyc30gY29udHJvbCBvciByZXBsYWNlbWVudCBjaGFyYWN0ZXIocylgKTtcbiAgICB9XG4gICAgaWYgKHJhd1RleHQuaW5jbHVkZXMoXCJcXHRcIikpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAyO1xuICAgICAgICBub3Rlcy5wdXNoKFwiVGFiIGNoYXJhY3RlcnMgbWF5IGluZGljYXRlIHRhYmxlLXN0eWxlIGZvcm1hdHRpbmcuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKFwiVGFiIGNoYXJhY3RlcnMgZm91bmRcIik7XG4gICAgfVxuICAgIGNvbnN0IGxvbmdMaW5lcyA9IHJhd1RleHQuc3BsaXQoL1xccj9cXG4vKS5maWx0ZXIoKGxpbmUpID0+IGxpbmUubGVuZ3RoID4gMjAwKTtcbiAgICBpZiAobG9uZ0xpbmVzLmxlbmd0aCA+PSA0KSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIlZlcnkgbG9uZyBsaW5lcyBtYXkgaW5kaWNhdGUgbXVsdGktY29sdW1uIG9yIHRhYmxlIGZvcm1hdHRpbmcuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGAke2xvbmdMaW5lcy5sZW5ndGh9IG92ZXItbG9uZyBsaW5lc2ApO1xuICAgIH1cbiAgICBpZiAoLzxbYS16QS1aL11bXj5dKj4vLnRlc3QocmF3VGV4dCkpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAyO1xuICAgICAgICBub3Rlcy5wdXNoKFwiSFRNTCB0YWdzIGRldGVjdGVkIGluIHJlc3VtZSB0ZXh0LlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIkhUTUwgdGFncyBmb3VuZFwiKTtcbiAgICB9XG4gICAgaWYgKCEvW1xcdy4rLV0rQFtcXHcuLV0rXFwuW2EtekEtWl17Mix9Ly50ZXN0KHRleHQpKSB7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gMjtcbiAgICAgICAgbm90ZXMucHVzaChcIk5vIGVtYWlsIHBhdHRlcm4gZGV0ZWN0ZWQgaW4gcGFyc2VhYmxlIHJlc3VtZSB0ZXh0LlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIk5vIGVtYWlsIGRldGVjdGVkXCIpO1xuICAgIH1cbiAgICBpZiAoaW5wdXQucmF3VGV4dCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGlucHV0LnJhd1RleHQudHJpbSgpLmxlbmd0aCA8IDIwMCAmJlxuICAgICAgICBpbnB1dC5wcm9maWxlLmV4cGVyaWVuY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAzO1xuICAgICAgICBub3Rlcy5wdXNoKFwiRXh0cmFjdGVkIHRleHQgaXMgdmVyeSBzaG9ydCBmb3IgYSByZXN1bWUgd2l0aCBleHBlcmllbmNlLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChcIlBvc3NpYmxlIGltYWdlLW9ubHkgUERGXCIpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwiYXRzRnJpZW5kbGluZXNzXCIsXG4gICAgICAgIGxhYmVsOiBcIkFUUyBmcmllbmRsaW5lc3NcIixcbiAgICAgICAgZWFybmVkOiBNYXRoLm1heCgwLCBTVUJfU0NPUkVfTUFYX1BPSU5UUy5hdHNGcmllbmRsaW5lc3MgLSBkZWR1Y3Rpb25zKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5hdHNGcmllbmRsaW5lc3MsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZTogZXZpZGVuY2UubGVuZ3RoID4gMCA/IGV2aWRlbmNlIDogW1wiTm8gQVRTIGZvcm1hdHRpbmcgaXNzdWVzIGRldGVjdGVkLlwiXSxcbiAgICB9O1xufVxuIiwiLyoqXG4gKiBTeW5vbnltIGdyb3VwcyBmb3Igc2VtYW50aWMga2V5d29yZCBtYXRjaGluZyBpbiBBVFMgc2NvcmluZy5cbiAqIEVhY2ggZ3JvdXAgbWFwcyBhIGNhbm9uaWNhbCB0ZXJtIHRvIGl0cyBzeW5vbnltcy92YXJpYXRpb25zLlxuICogQWxsIHRlcm1zIHNob3VsZCBiZSBsb3dlcmNhc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBTWU5PTllNX0dST1VQUyA9IFtcbiAgICAvLyBQcm9ncmFtbWluZyBMYW5ndWFnZXNcbiAgICB7IGNhbm9uaWNhbDogXCJqYXZhc2NyaXB0XCIsIHN5bm9ueW1zOiBbXCJqc1wiLCBcImVjbWFzY3JpcHRcIiwgXCJlczZcIiwgXCJlczIwMTVcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJ0eXBlc2NyaXB0XCIsIHN5bm9ueW1zOiBbXCJ0c1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInB5dGhvblwiLCBzeW5vbnltczogW1wicHlcIiwgXCJweXRob24zXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZ29sYW5nXCIsIHN5bm9ueW1zOiBbXCJnb1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImMjXCIsIHN5bm9ueW1zOiBbXCJjc2hhcnBcIiwgXCJjIHNoYXJwXCIsIFwiZG90bmV0XCIsIFwiLm5ldFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImMrK1wiLCBzeW5vbnltczogW1wiY3BwXCIsIFwiY3BsdXNwbHVzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicnVieVwiLCBzeW5vbnltczogW1wicmJcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJrb3RsaW5cIiwgc3lub255bXM6IFtcImt0XCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwib2JqZWN0aXZlLWNcIiwgc3lub255bXM6IFtcIm9iamNcIiwgXCJvYmotY1wiXSB9LFxuICAgIC8vIEZyb250ZW5kIEZyYW1ld29ya3NcbiAgICB7IGNhbm9uaWNhbDogXCJyZWFjdFwiLCBzeW5vbnltczogW1wicmVhY3Rqc1wiLCBcInJlYWN0LmpzXCIsIFwicmVhY3QganNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJhbmd1bGFyXCIsIHN5bm9ueW1zOiBbXCJhbmd1bGFyanNcIiwgXCJhbmd1bGFyLmpzXCIsIFwiYW5ndWxhciBqc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInZ1ZVwiLCBzeW5vbnltczogW1widnVlanNcIiwgXCJ2dWUuanNcIiwgXCJ2dWUganNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJuZXh0LmpzXCIsIHN5bm9ueW1zOiBbXCJuZXh0anNcIiwgXCJuZXh0IGpzXCIsIFwibmV4dFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm51eHRcIiwgc3lub255bXM6IFtcIm51eHRqc1wiLCBcIm51eHQuanNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJzdmVsdGVcIiwgc3lub255bXM6IFtcInN2ZWx0ZWpzXCIsIFwic3ZlbHRla2l0XCJdIH0sXG4gICAgLy8gQmFja2VuZCBGcmFtZXdvcmtzXG4gICAgeyBjYW5vbmljYWw6IFwibm9kZS5qc1wiLCBzeW5vbnltczogW1wibm9kZWpzXCIsIFwibm9kZSBqc1wiLCBcIm5vZGVcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJleHByZXNzXCIsIHN5bm9ueW1zOiBbXCJleHByZXNzanNcIiwgXCJleHByZXNzLmpzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZGphbmdvXCIsIHN5bm9ueW1zOiBbXCJkamFuZ28gcmVzdCBmcmFtZXdvcmtcIiwgXCJkcmZcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJmbGFza1wiLCBzeW5vbnltczogW1wiZmxhc2sgcHl0aG9uXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwic3ByaW5nXCIsIHN5bm9ueW1zOiBbXCJzcHJpbmcgYm9vdFwiLCBcInNwcmluZ2Jvb3RcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJydWJ5IG9uIHJhaWxzXCIsIHN5bm9ueW1zOiBbXCJyYWlsc1wiLCBcInJvclwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImZhc3RhcGlcIiwgc3lub255bXM6IFtcImZhc3QgYXBpXCJdIH0sXG4gICAgLy8gRGF0YWJhc2VzXG4gICAgeyBjYW5vbmljYWw6IFwicG9zdGdyZXNxbFwiLCBzeW5vbnltczogW1wicG9zdGdyZXNcIiwgXCJwc3FsXCIsIFwicGdcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJtb25nb2RiXCIsIHN5bm9ueW1zOiBbXCJtb25nb1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcIm15c3FsXCIsIHN5bm9ueW1zOiBbXCJtYXJpYWRiXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZHluYW1vZGJcIiwgc3lub255bXM6IFtcImR5bmFtbyBkYlwiLCBcImR5bmFtb1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImVsYXN0aWNzZWFyY2hcIiwgc3lub255bXM6IFtcImVsYXN0aWMgc2VhcmNoXCIsIFwiZWxhc3RpY1wiLCBcImVzXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwicmVkaXNcIiwgc3lub255bXM6IFtcInJlZGlzIGNhY2hlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwic3FsXCIsIHN5bm9ueW1zOiBbXCJzdHJ1Y3R1cmVkIHF1ZXJ5IGxhbmd1YWdlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwibm9zcWxcIiwgc3lub255bXM6IFtcIm5vIHNxbFwiLCBcIm5vbi1yZWxhdGlvbmFsXCJdIH0sXG4gICAgLy8gQ2xvdWQgJiBJbmZyYXN0cnVjdHVyZVxuICAgIHsgY2Fub25pY2FsOiBcImF3c1wiLCBzeW5vbnltczogW1wiYW1hem9uIHdlYiBzZXJ2aWNlc1wiLCBcImFtYXpvbiBjbG91ZFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImdjcFwiLCBzeW5vbnltczogW1wiZ29vZ2xlIGNsb3VkXCIsIFwiZ29vZ2xlIGNsb3VkIHBsYXRmb3JtXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiYXp1cmVcIiwgc3lub255bXM6IFtcIm1pY3Jvc29mdCBhenVyZVwiLCBcIm1zIGF6dXJlXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZG9ja2VyXCIsIHN5bm9ueW1zOiBbXCJjb250YWluZXJpemF0aW9uXCIsIFwiY29udGFpbmVyc1wiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImt1YmVybmV0ZXNcIiwgc3lub255bXM6IFtcIms4c1wiLCBcImt1YmVcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJ0ZXJyYWZvcm1cIiwgc3lub255bXM6IFtcImluZnJhc3RydWN0dXJlIGFzIGNvZGVcIiwgXCJpYWNcIl0gfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJjaS9jZFwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJjaWNkXCIsXG4gICAgICAgICAgICBcImNpIGNkXCIsXG4gICAgICAgICAgICBcImNvbnRpbnVvdXMgaW50ZWdyYXRpb25cIixcbiAgICAgICAgICAgIFwiY29udGludW91cyBkZXBsb3ltZW50XCIsXG4gICAgICAgICAgICBcImNvbnRpbnVvdXMgZGVsaXZlcnlcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHsgY2Fub25pY2FsOiBcImRldm9wc1wiLCBzeW5vbnltczogW1wiZGV2IG9wc1wiLCBcInNpdGUgcmVsaWFiaWxpdHlcIiwgXCJzcmVcIl0gfSxcbiAgICAvLyBUb29scyAmIFBsYXRmb3Jtc1xuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImdpdFwiLFxuICAgICAgICBzeW5vbnltczogW1wiZ2l0aHViXCIsIFwiZ2l0bGFiXCIsIFwiYml0YnVja2V0XCIsIFwidmVyc2lvbiBjb250cm9sXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiamlyYVwiLCBzeW5vbnltczogW1wiYXRsYXNzaWFuIGppcmFcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJmaWdtYVwiLCBzeW5vbnltczogW1wiZmlnbWEgZGVzaWduXCJdIH0sXG4gICAgeyBjYW5vbmljYWw6IFwid2VicGFja1wiLCBzeW5vbnltczogW1wibW9kdWxlIGJ1bmRsZXJcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJncmFwaHFsXCIsIHN5bm9ueW1zOiBbXCJncmFwaCBxbFwiLCBcImdxbFwiXSB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInJlc3QgYXBpXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJyZXN0ZnVsXCIsIFwicmVzdGZ1bCBhcGlcIiwgXCJyZXN0XCIsIFwiYXBpXCJdLFxuICAgIH0sXG4gICAgLy8gUm9sZSBUZXJtc1xuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImZyb250ZW5kXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcImZyb250LWVuZFwiLFxuICAgICAgICAgICAgXCJmcm9udCBlbmRcIixcbiAgICAgICAgICAgIFwiY2xpZW50LXNpZGVcIixcbiAgICAgICAgICAgIFwiY2xpZW50IHNpZGVcIixcbiAgICAgICAgICAgIFwidWkgZGV2ZWxvcG1lbnRcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImJhY2tlbmRcIixcbiAgICAgICAgc3lub255bXM6IFtcImJhY2stZW5kXCIsIFwiYmFjayBlbmRcIiwgXCJzZXJ2ZXItc2lkZVwiLCBcInNlcnZlciBzaWRlXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwiZnVsbHN0YWNrXCIsIHN5bm9ueW1zOiBbXCJmdWxsLXN0YWNrXCIsIFwiZnVsbCBzdGFja1wiXSB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInNvZnR3YXJlIGVuZ2luZWVyXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJzb2Z0d2FyZSBkZXZlbG9wZXJcIiwgXCJzd2VcIiwgXCJkZXZlbG9wZXJcIiwgXCJwcm9ncmFtbWVyXCIsIFwiY29kZXJcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJkYXRhIHNjaWVudGlzdFwiLFxuICAgICAgICBzeW5vbnltczogW1wiZGF0YSBzY2llbmNlXCIsIFwibWwgZW5naW5lZXJcIiwgXCJtYWNoaW5lIGxlYXJuaW5nIGVuZ2luZWVyXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZGF0YSBlbmdpbmVlclwiLFxuICAgICAgICBzeW5vbnltczogW1wiZGF0YSBlbmdpbmVlcmluZ1wiLCBcImV0bCBkZXZlbG9wZXJcIl0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJwcm9kdWN0IG1hbmFnZXJcIiwgc3lub255bXM6IFtcInBtXCIsIFwicHJvZHVjdCBvd25lclwiLCBcInBvXCJdIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwicWEgZW5naW5lZXJcIixcbiAgICAgICAgc3lub255bXM6IFtcInF1YWxpdHkgYXNzdXJhbmNlXCIsIFwicWFcIiwgXCJ0ZXN0IGVuZ2luZWVyXCIsIFwic2RldFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInV4IGRlc2lnbmVyXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJ1eFwiLCBcInVzZXIgZXhwZXJpZW5jZVwiLCBcInVpL3V4XCIsIFwidWkgdXhcIl0sXG4gICAgfSxcbiAgICAvLyBNZXRob2RvbG9naWVzXG4gICAgeyBjYW5vbmljYWw6IFwiYWdpbGVcIiwgc3lub255bXM6IFtcInNjcnVtXCIsIFwia2FuYmFuXCIsIFwic3ByaW50XCIsIFwic3ByaW50c1wiXSB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInRkZFwiLFxuICAgICAgICBzeW5vbnltczogW1widGVzdCBkcml2ZW4gZGV2ZWxvcG1lbnRcIiwgXCJ0ZXN0LWRyaXZlbiBkZXZlbG9wbWVudFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImJkZFwiLFxuICAgICAgICBzeW5vbnltczogW1wiYmVoYXZpb3IgZHJpdmVuIGRldmVsb3BtZW50XCIsIFwiYmVoYXZpb3ItZHJpdmVuIGRldmVsb3BtZW50XCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwibWljcm9zZXJ2aWNlc1wiLFxuICAgICAgICBzeW5vbnltczogW1wibWljcm8gc2VydmljZXNcIiwgXCJtaWNyby1zZXJ2aWNlc1wiLCBcInNlcnZpY2Utb3JpZW50ZWRcIl0sXG4gICAgfSxcbiAgICAvLyBTb2Z0IFNraWxsc1xuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImxlYWRlcnNoaXBcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwibGVkXCIsXG4gICAgICAgICAgICBcIm1hbmFnZWRcIixcbiAgICAgICAgICAgIFwiZGlyZWN0ZWRcIixcbiAgICAgICAgICAgIFwic3VwZXJ2aXNlZFwiLFxuICAgICAgICAgICAgXCJtZW50b3JlZFwiLFxuICAgICAgICAgICAgXCJ0ZWFtIGxlYWRcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImNvbW11bmljYXRpb25cIixcbiAgICAgICAgc3lub255bXM6IFtcImNvbW11bmljYXRlZFwiLCBcInByZXNlbnRlZFwiLCBcInB1YmxpYyBzcGVha2luZ1wiLCBcImludGVycGVyc29uYWxcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJjb2xsYWJvcmF0aW9uXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcImNvbGxhYm9yYXRlZFwiLFxuICAgICAgICAgICAgXCJ0ZWFtd29ya1wiLFxuICAgICAgICAgICAgXCJjcm9zcy1mdW5jdGlvbmFsXCIsXG4gICAgICAgICAgICBcImNyb3NzIGZ1bmN0aW9uYWxcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInByb2JsZW0gc29sdmluZ1wiLFxuICAgICAgICBzeW5vbnltczogW1wicHJvYmxlbS1zb2x2aW5nXCIsIFwidHJvdWJsZXNob290aW5nXCIsIFwiZGVidWdnaW5nXCIsIFwiYW5hbHl0aWNhbFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInByb2plY3QgbWFuYWdlbWVudFwiLFxuICAgICAgICBzeW5vbnltczogW1xuICAgICAgICAgICAgXCJwcm9qZWN0LW1hbmFnZW1lbnRcIixcbiAgICAgICAgICAgIFwicHJvZ3JhbSBtYW5hZ2VtZW50XCIsXG4gICAgICAgICAgICBcInN0YWtlaG9sZGVyIG1hbmFnZW1lbnRcIixcbiAgICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcInRpbWUgbWFuYWdlbWVudFwiLFxuICAgICAgICBzeW5vbnltczogW1widGltZS1tYW5hZ2VtZW50XCIsIFwicHJpb3JpdGl6YXRpb25cIiwgXCJvcmdhbml6YXRpb25cIl0sXG4gICAgfSxcbiAgICB7IGNhbm9uaWNhbDogXCJtZW50b3JpbmdcIiwgc3lub255bXM6IFtcImNvYWNoaW5nXCIsIFwidHJhaW5pbmdcIiwgXCJvbmJvYXJkaW5nXCJdIH0sXG4gICAgLy8gRGF0YSAmIE1MXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwibWFjaGluZSBsZWFybmluZ1wiLFxuICAgICAgICBzeW5vbnltczogW1wibWxcIiwgXCJkZWVwIGxlYXJuaW5nXCIsIFwiZGxcIiwgXCJhaVwiLCBcImFydGlmaWNpYWwgaW50ZWxsaWdlbmNlXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwibmxwXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJuYXR1cmFsIGxhbmd1YWdlIHByb2Nlc3NpbmdcIiwgXCJ0ZXh0IHByb2Nlc3NpbmdcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJjb21wdXRlciB2aXNpb25cIixcbiAgICAgICAgc3lub255bXM6IFtcImN2XCIsIFwiaW1hZ2UgcmVjb2duaXRpb25cIiwgXCJpbWFnZSBwcm9jZXNzaW5nXCJdLFxuICAgIH0sXG4gICAgeyBjYW5vbmljYWw6IFwidGVuc29yZmxvd1wiLCBzeW5vbnltczogW1wia2VyYXNcIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJweXRvcmNoXCIsIHN5bm9ueW1zOiBbXCJ0b3JjaFwiXSB9LFxuICAgIC8vIFRlc3RpbmdcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJ1bml0IHRlc3RpbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcInVuaXQgdGVzdHNcIiwgXCJqZXN0XCIsIFwibW9jaGFcIiwgXCJ2aXRlc3RcIiwgXCJweXRlc3RcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJpbnRlZ3JhdGlvbiB0ZXN0aW5nXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXG4gICAgICAgICAgICBcImludGVncmF0aW9uIHRlc3RzXCIsXG4gICAgICAgICAgICBcImUyZSB0ZXN0aW5nXCIsXG4gICAgICAgICAgICBcImVuZC10by1lbmQgdGVzdGluZ1wiLFxuICAgICAgICAgICAgXCJlbmQgdG8gZW5kXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJhdXRvbWF0aW9uIHRlc3RpbmdcIixcbiAgICAgICAgc3lub255bXM6IFtcbiAgICAgICAgICAgIFwidGVzdCBhdXRvbWF0aW9uXCIsXG4gICAgICAgICAgICBcImF1dG9tYXRlZCB0ZXN0aW5nXCIsXG4gICAgICAgICAgICBcInNlbGVuaXVtXCIsXG4gICAgICAgICAgICBcImN5cHJlc3NcIixcbiAgICAgICAgICAgIFwicGxheXdyaWdodFwiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgLy8gU2VjdXJpdHlcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJjeWJlcnNlY3VyaXR5XCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJjeWJlciBzZWN1cml0eVwiLCBcImluZm9ybWF0aW9uIHNlY3VyaXR5XCIsIFwiaW5mb3NlY1wiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgY2Fub25pY2FsOiBcImF1dGhlbnRpY2F0aW9uXCIsXG4gICAgICAgIHN5bm9ueW1zOiBbXCJhdXRoXCIsIFwib2F1dGhcIiwgXCJzc29cIiwgXCJzaW5nbGUgc2lnbi1vblwiXSxcbiAgICB9LFxuICAgIC8vIE1vYmlsZVxuICAgIHsgY2Fub25pY2FsOiBcImlvc1wiLCBzeW5vbnltczogW1wic3dpZnRcIiwgXCJhcHBsZSBkZXZlbG9wbWVudFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcImFuZHJvaWRcIiwgc3lub255bXM6IFtcImFuZHJvaWQgZGV2ZWxvcG1lbnRcIiwgXCJrb3RsaW4gYW5kcm9pZFwiXSB9LFxuICAgIHsgY2Fub25pY2FsOiBcInJlYWN0IG5hdGl2ZVwiLCBzeW5vbnltczogW1wicmVhY3QtbmF0aXZlXCIsIFwicm5cIl0gfSxcbiAgICB7IGNhbm9uaWNhbDogXCJmbHV0dGVyXCIsIHN5bm9ueW1zOiBbXCJkYXJ0XCJdIH0sXG4gICAgLy8gQnVzaW5lc3MgJiBBbmFseXRpY3NcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJidXNpbmVzcyBpbnRlbGxpZ2VuY2VcIixcbiAgICAgICAgc3lub255bXM6IFtcImJpXCIsIFwidGFibGVhdVwiLCBcInBvd2VyIGJpXCIsIFwibG9va2VyXCJdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBjYW5vbmljYWw6IFwiZGF0YSBhbmFseXNpc1wiLFxuICAgICAgICBzeW5vbnltczogW1wiZGF0YSBhbmFseXRpY3NcIiwgXCJkYXRhIGFuYWx5c3RcIiwgXCJhbmFseXRpY3NcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGNhbm9uaWNhbDogXCJldGxcIixcbiAgICAgICAgc3lub255bXM6IFtcImV4dHJhY3QgdHJhbnNmb3JtIGxvYWRcIiwgXCJkYXRhIHBpcGVsaW5lXCIsIFwiZGF0YSBwaXBlbGluZXNcIl0sXG4gICAgfSxcbl07XG4vKipcbiAqIEJ1aWxkcyBhIGxvb2t1cCBtYXAgZnJvbSBhbnkgdGVybSAoY2Fub25pY2FsIG9yIHN5bm9ueW0pIHRvXG4gKiB0aGUgc2V0IG9mIGFsbCB0ZXJtcyBpbiB0aGUgc2FtZSBncm91cCAoaW5jbHVkaW5nIHRoZSBjYW5vbmljYWwgZm9ybSkuXG4gKiBBbGwga2V5cyBhbmQgdmFsdWVzIGFyZSBsb3dlcmNhc2UuXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkU3lub255bUxvb2t1cCgpIHtcbiAgICBjb25zdCBsb29rdXAgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBTWU5PTllNX0dST1VQUykge1xuICAgICAgICBjb25zdCBhbGxUZXJtcyA9IFtncm91cC5jYW5vbmljYWwsIC4uLmdyb3VwLnN5bm9ueW1zXTtcbiAgICAgICAgY29uc3QgdGVybVNldCA9IG5ldyBTZXQoYWxsVGVybXMpO1xuICAgICAgICBmb3IgKGNvbnN0IHRlcm0gb2YgYWxsVGVybXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbG9va3VwLmdldCh0ZXJtKTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgICAgIC8vIE1lcmdlIHNldHMgaWYgdGVybSBhcHBlYXJzIGluIG11bHRpcGxlIGdyb3Vwc1xuICAgICAgICAgICAgICAgIHRlcm1TZXQuZm9yRWFjaCgodCkgPT4gZXhpc3RpbmcuYWRkKHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvb2t1cC5zZXQodGVybSwgbmV3IFNldCh0ZXJtU2V0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxvb2t1cDtcbn1cbmNvbnN0IHN5bm9ueW1Mb29rdXAgPSBidWlsZFN5bm9ueW1Mb29rdXAoKTtcbi8qKlxuICogUmV0dXJucyBhbGwgc3lub255bXMgZm9yIGEgZ2l2ZW4gdGVybSAoaW5jbHVkaW5nIHRoZSB0ZXJtIGl0c2VsZikuXG4gKiBSZXR1cm5zIGFuIGVtcHR5IGFycmF5IGlmIG5vIHN5bm9ueW1zIGFyZSBmb3VuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN5bm9ueW1zKHRlcm0pIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gdGVybS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICBjb25zdCBncm91cCA9IHN5bm9ueW1Mb29rdXAuZ2V0KG5vcm1hbGl6ZWQpO1xuICAgIGlmICghZ3JvdXApXG4gICAgICAgIHJldHVybiBbXTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShncm91cCk7XG59XG4vKipcbiAqIENoZWNrcyBpZiB0d28gdGVybXMgYXJlIHN5bm9ueW1zIG9mIGVhY2ggb3RoZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcmVTeW5vbnltcyh0ZXJtQSwgdGVybUIpIHtcbiAgICBjb25zdCBub3JtYWxpemVkQSA9IHRlcm1BLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRCID0gdGVybUIudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgaWYgKG5vcm1hbGl6ZWRBID09PSBub3JtYWxpemVkQilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgZ3JvdXAgPSBzeW5vbnltTG9va3VwLmdldChub3JtYWxpemVkQSk7XG4gICAgcmV0dXJuIGdyb3VwID8gZ3JvdXAuaGFzKG5vcm1hbGl6ZWRCKSA6IGZhbHNlO1xufVxuLyoqIFdlaWdodCBhcHBsaWVkIHRvIHN5bm9ueW0gbWF0Y2hlcyAodnMgMS4wIGZvciBleGFjdCBtYXRjaGVzKSAqL1xuZXhwb3J0IGNvbnN0IFNZTk9OWU1fTUFUQ0hfV0VJR0hUID0gMC44O1xuIiwiaW1wb3J0IHsgZ2V0U3lub255bXMsIFNZTk9OWU1fTUFUQ0hfV0VJR0hUIH0gZnJvbSBcIi4vc3lub255bXNcIjtcbmltcG9ydCB7IFNVQl9TQ09SRV9NQVhfUE9JTlRTIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBjb250YWluc1dvcmQsIGNvdW50V29yZE9jY3VycmVuY2VzLCBnZXRSZXN1bWVUZXh0LCBub3JtYWxpemVUZXh0LCB9IGZyb20gXCIuL3RleHRcIjtcbmNvbnN0IFNUT1BfV09SRFMgPSBuZXcgU2V0KFtcbiAgICBcImFcIixcbiAgICBcImFuXCIsXG4gICAgXCJhbmRcIixcbiAgICBcImFyZVwiLFxuICAgIFwiYXNcIixcbiAgICBcImF0XCIsXG4gICAgXCJiZVwiLFxuICAgIFwiYnlcIixcbiAgICBcImZvclwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwiaW5cIixcbiAgICBcIm9mXCIsXG4gICAgXCJvblwiLFxuICAgIFwib3JcIixcbiAgICBcIm91clwiLFxuICAgIFwidGhlXCIsXG4gICAgXCJ0b1wiLFxuICAgIFwid2VcIixcbiAgICBcIndpdGhcIixcbiAgICBcInlvdVwiLFxuICAgIFwieW91clwiLFxuXSk7XG5mdW5jdGlvbiB0b2tlbml6ZUtleXdvcmRzKHRleHQpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplVGV4dCh0ZXh0KVxuICAgICAgICAuc3BsaXQoL1xccysvKVxuICAgICAgICAubWFwKCh0b2tlbikgPT4gdG9rZW4udHJpbSgpKVxuICAgICAgICAuZmlsdGVyKCh0b2tlbikgPT4gdG9rZW4ubGVuZ3RoID49IDMgJiYgIVNUT1BfV09SRFMuaGFzKHRva2VuKSk7XG59XG5mdW5jdGlvbiB0b3BUb2tlbnModGV4dCwgbGltaXQpIHtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbml6ZUtleXdvcmRzKHRleHQpKSB7XG4gICAgICAgIGNvdW50cy5zZXQodG9rZW4sIChjb3VudHMuZ2V0KHRva2VuKSA/PyAwKSArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbShjb3VudHMuZW50cmllcygpKVxuICAgICAgICAuc29ydCgoYSwgYikgPT4gYlsxXSAtIGFbMV0gfHwgYVswXS5sb2NhbGVDb21wYXJlKGJbMF0pKVxuICAgICAgICAuc2xpY2UoMCwgbGltaXQpXG4gICAgICAgIC5tYXAoKFt0b2tlbl0pID0+IHRva2VuKTtcbn1cbmZ1bmN0aW9uIGJ1aWxkS2V5d29yZFNldChqb2IpIHtcbiAgICBjb25zdCBrZXl3b3JkcyA9IFtcbiAgICAgICAgLi4uam9iLmtleXdvcmRzLFxuICAgICAgICAuLi5qb2IucmVxdWlyZW1lbnRzLmZsYXRNYXAodG9rZW5pemVLZXl3b3JkcyksXG4gICAgICAgIC4uLnRvcFRva2Vucyhqb2IuZGVzY3JpcHRpb24sIDEwKSxcbiAgICBdO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBrZXl3b3Jkc1xuICAgICAgICAubWFwKChrZXl3b3JkKSA9PiBub3JtYWxpemVUZXh0KGtleXdvcmQpKVxuICAgICAgICAuZmlsdGVyKChrZXl3b3JkKSA9PiBrZXl3b3JkLmxlbmd0aCA+PSAyICYmICFTVE9QX1dPUkRTLmhhcyhrZXl3b3JkKSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChub3JtYWxpemVkKSkuc2xpY2UoMCwgMjQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlS2V5d29yZE1hdGNoKGlucHV0KSB7XG4gICAgaWYgKCFpbnB1dC5qb2IpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogXCJrZXl3b3JkTWF0Y2hcIixcbiAgICAgICAgICAgIGxhYmVsOiBcIktleXdvcmQgbWF0Y2hcIixcbiAgICAgICAgICAgIGVhcm5lZDogMTgsXG4gICAgICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmtleXdvcmRNYXRjaCxcbiAgICAgICAgICAgIG5vdGVzOiBbXCJObyBqb2IgZGVzY3JpcHRpb24gc3VwcGxpZWQ7IG5ldXRyYWwgYmFzZWxpbmUuXCJdLFxuICAgICAgICAgICAgZXZpZGVuY2U6IFtcIk5vIGpvYiBkZXNjcmlwdGlvbiBzdXBwbGllZC5cIl0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGtleXdvcmRzID0gYnVpbGRLZXl3b3JkU2V0KGlucHV0LmpvYik7XG4gICAgaWYgKGtleXdvcmRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBcImtleXdvcmRNYXRjaFwiLFxuICAgICAgICAgICAgbGFiZWw6IFwiS2V5d29yZCBtYXRjaFwiLFxuICAgICAgICAgICAgZWFybmVkOiAxOCxcbiAgICAgICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMua2V5d29yZE1hdGNoLFxuICAgICAgICAgICAgbm90ZXM6IFtcIkpvYiBkZXNjcmlwdGlvbiBoYXMgbm8gdXNhYmxlIGtleXdvcmRzOyBuZXV0cmFsIGJhc2VsaW5lLlwiXSxcbiAgICAgICAgICAgIGV2aWRlbmNlOiBbXCIwIGtleXdvcmRzIGF2YWlsYWJsZS5cIl0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IHJlc3VtZVRleHQgPSBub3JtYWxpemVUZXh0KGdldFJlc3VtZVRleHQoaW5wdXQucHJvZmlsZSwgaW5wdXQucmF3VGV4dCkpO1xuICAgIGxldCB3ZWlnaHRlZEhpdHMgPSAwO1xuICAgIGxldCBleGFjdEhpdHMgPSAwO1xuICAgIGxldCBzdHVmZmluZyA9IGZhbHNlO1xuICAgIGZvciAoY29uc3Qga2V5d29yZCBvZiBrZXl3b3Jkcykge1xuICAgICAgICBjb25zdCBmcmVxdWVuY3kgPSBjb3VudFdvcmRPY2N1cnJlbmNlcyhyZXN1bWVUZXh0LCBrZXl3b3JkKTtcbiAgICAgICAgaWYgKGZyZXF1ZW5jeSA+IDEwKVxuICAgICAgICAgICAgc3R1ZmZpbmcgPSB0cnVlO1xuICAgICAgICBpZiAoZnJlcXVlbmN5ID4gMCkge1xuICAgICAgICAgICAgd2VpZ2h0ZWRIaXRzICs9IDE7XG4gICAgICAgICAgICBleGFjdEhpdHMgKz0gMTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN5bm9ueW1IaXQgPSBnZXRTeW5vbnltcyhrZXl3b3JkKS5zb21lKChzeW5vbnltKSA9PiBzeW5vbnltICE9PSBrZXl3b3JkICYmIGNvbnRhaW5zV29yZChyZXN1bWVUZXh0LCBzeW5vbnltKSk7XG4gICAgICAgIGlmIChzeW5vbnltSGl0KVxuICAgICAgICAgICAgd2VpZ2h0ZWRIaXRzICs9IFNZTk9OWU1fTUFUQ0hfV0VJR0hUO1xuICAgIH1cbiAgICBjb25zdCByYXdFYXJuZWQgPSBNYXRoLnJvdW5kKCh3ZWlnaHRlZEhpdHMgLyBrZXl3b3Jkcy5sZW5ndGgpICogU1VCX1NDT1JFX01BWF9QT0lOVFMua2V5d29yZE1hdGNoKTtcbiAgICBjb25zdCBlYXJuZWQgPSBNYXRoLm1heCgwLCByYXdFYXJuZWQgLSAoc3R1ZmZpbmcgPyAyIDogMCkpO1xuICAgIGNvbnN0IG5vdGVzID0gZXhhY3RIaXRzID09PSBrZXl3b3Jkcy5sZW5ndGhcbiAgICAgICAgPyBbXVxuICAgICAgICA6IFtcIkFkZCBuYXR1cmFsIG1lbnRpb25zIG9mIG1pc3NpbmcgdGFyZ2V0IGpvYiBrZXl3b3Jkcy5cIl07XG4gICAgaWYgKHN0dWZmaW5nKVxuICAgICAgICBub3Rlcy5wdXNoKFwiS2V5d29yZCBzdHVmZmluZyBkZXRlY3RlZDsgcmVwZWF0ZWQgdGVybXMgdG9vIG9mdGVuLlwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwia2V5d29yZE1hdGNoXCIsXG4gICAgICAgIGxhYmVsOiBcIktleXdvcmQgbWF0Y2hcIixcbiAgICAgICAgZWFybmVkLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLmtleXdvcmRNYXRjaCxcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBbXG4gICAgICAgICAgICBgJHtleGFjdEhpdHN9LyR7a2V5d29yZHMubGVuZ3RofSBrZXl3b3JkcyBtYXRjaGVkYCxcbiAgICAgICAgICAgIGAke3dlaWdodGVkSGl0cy50b0ZpeGVkKDEpfS8ke2tleXdvcmRzLmxlbmd0aH0gd2VpZ2h0ZWQga2V5d29yZCBoaXRzYCxcbiAgICAgICAgXSxcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldFJlc3VtZVRleHQsIHdvcmRDb3VudCB9IGZyb20gXCIuL3RleHRcIjtcbmZ1bmN0aW9uIHBvaW50c0ZvcldvcmRDb3VudChjb3VudCkge1xuICAgIGlmIChjb3VudCA+PSA0MDAgJiYgY291bnQgPD0gNzAwKVxuICAgICAgICByZXR1cm4gMTA7XG4gICAgaWYgKChjb3VudCA+PSAzMDAgJiYgY291bnQgPD0gMzk5KSB8fCAoY291bnQgPj0gNzAxICYmIGNvdW50IDw9IDkwMCkpXG4gICAgICAgIHJldHVybiA3O1xuICAgIGlmICgoY291bnQgPj0gMjAwICYmIGNvdW50IDw9IDI5OSkgfHwgKGNvdW50ID49IDkwMSAmJiBjb3VudCA8PSAxMTAwKSlcbiAgICAgICAgcmV0dXJuIDQ7XG4gICAgaWYgKChjb3VudCA+PSAxNTAgJiYgY291bnQgPD0gMTk5KSB8fCAoY291bnQgPj0gMTEwMSAmJiBjb3VudCA8PSAxNDAwKSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVMZW5ndGgoaW5wdXQpIHtcbiAgICBjb25zdCBjb3VudCA9IHdvcmRDb3VudChnZXRSZXN1bWVUZXh0KGlucHV0LnByb2ZpbGUsIGlucHV0LnJhd1RleHQpKTtcbiAgICBjb25zdCBlYXJuZWQgPSBwb2ludHNGb3JXb3JkQ291bnQoY291bnQpO1xuICAgIGNvbnN0IG5vdGVzID0gZWFybmVkID09PSBTVUJfU0NPUkVfTUFYX1BPSU5UUy5sZW5ndGhcbiAgICAgICAgPyBbXVxuICAgICAgICA6IFtcIlJlc3VtZSBsZW5ndGggaXMgb3V0c2lkZSB0aGUgNDAwLTcwMCB3b3JkIHRhcmdldCBiYW5kLlwiXTtcbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwibGVuZ3RoXCIsXG4gICAgICAgIGxhYmVsOiBcIkxlbmd0aFwiLFxuICAgICAgICBlYXJuZWQsXG4gICAgICAgIG1heFBvaW50czogU1VCX1NDT1JFX01BWF9QT0lOVFMubGVuZ3RoLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IFtgJHtjb3VudH0gd29yZHNgXSxcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUVVBTlRJRklFRF9SRUdFWCwgU1VCX1NDT1JFX01BWF9QT0lOVFMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbmltcG9ydCB7IGdldEhpZ2hsaWdodHMgfSBmcm9tIFwiLi90ZXh0XCI7XG5mdW5jdGlvbiBwb2ludHNGb3JRdWFudGlmaWVkUmVzdWx0cyhjb3VudCkge1xuICAgIGlmIChjb3VudCA9PT0gMClcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgaWYgKGNvdW50ID09PSAxKVxuICAgICAgICByZXR1cm4gNjtcbiAgICBpZiAoY291bnQgPT09IDIpXG4gICAgICAgIHJldHVybiAxMjtcbiAgICBpZiAoY291bnQgPD0gNClcbiAgICAgICAgcmV0dXJuIDE2O1xuICAgIHJldHVybiAyMDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzY29yZVF1YW50aWZpZWRBY2hpZXZlbWVudHMoaW5wdXQpIHtcbiAgICBjb25zdCB0ZXh0ID0gZ2V0SGlnaGxpZ2h0cyhpbnB1dC5wcm9maWxlKS5qb2luKFwiXFxuXCIpO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBBcnJheS5mcm9tKHRleHQubWF0Y2hBbGwoUVVBTlRJRklFRF9SRUdFWCksIChtYXRjaCkgPT4gbWF0Y2hbMF0pO1xuICAgIGNvbnN0IG5vdGVzID0gbWF0Y2hlcy5sZW5ndGggPT09IDBcbiAgICAgICAgPyBbXCJBZGQgbWV0cmljcyBzdWNoIGFzIHBlcmNlbnRhZ2VzLCB2b2x1bWUsIHRlYW0gc2l6ZSwgb3IgcmV2ZW51ZS5cIl1cbiAgICAgICAgOiBbXTtcbiAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IFwicXVhbnRpZmllZEFjaGlldmVtZW50c1wiLFxuICAgICAgICBsYWJlbDogXCJRdWFudGlmaWVkIGFjaGlldmVtZW50c1wiLFxuICAgICAgICBlYXJuZWQ6IHBvaW50c0ZvclF1YW50aWZpZWRSZXN1bHRzKG1hdGNoZXMubGVuZ3RoKSxcbiAgICAgICAgbWF4UG9pbnRzOiBTVUJfU0NPUkVfTUFYX1BPSU5UUy5xdWFudGlmaWVkQWNoaWV2ZW1lbnRzLFxuICAgICAgICBub3RlcyxcbiAgICAgICAgZXZpZGVuY2U6IFtcbiAgICAgICAgICAgIGAke21hdGNoZXMubGVuZ3RofSBxdWFudGlmaWVkIHJlc3VsdChzKWAsXG4gICAgICAgICAgICAuLi5tYXRjaGVzLnNsaWNlKDAsIDMpLFxuICAgICAgICBdLFxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHNjb3JlU2VjdGlvbkNvbXBsZXRlbmVzcyhpbnB1dCkge1xuICAgIGNvbnN0IHsgcHJvZmlsZSB9ID0gaW5wdXQ7XG4gICAgY29uc3Qgbm90ZXMgPSBbXTtcbiAgICBjb25zdCBldmlkZW5jZSA9IFtdO1xuICAgIGxldCBlYXJuZWQgPSAwO1xuICAgIGxldCBjb21wbGV0ZVNlY3Rpb25zID0gMDtcbiAgICBpZiAocHJvZmlsZS5jb250YWN0Lm5hbWU/LnRyaW0oKSkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJNaXNzaW5nIGNvbnRhY3QgbmFtZS5cIik7XG4gICAgfVxuICAgIGlmIChwcm9maWxlLmNvbnRhY3QuZW1haWw/LnRyaW0oKSkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJNaXNzaW5nIGNvbnRhY3QgZW1haWwuXCIpO1xuICAgIH1cbiAgICBjb25zdCBzdW1tYXJ5TGVuZ3RoID0gcHJvZmlsZS5zdW1tYXJ5Py50cmltKCkubGVuZ3RoID8/IDA7XG4gICAgaWYgKHN1bW1hcnlMZW5ndGggPj0gNTAgJiYgc3VtbWFyeUxlbmd0aCA8PSA1MDApIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJTdW1tYXJ5IHNob3VsZCBiZSBiZXR3ZWVuIDUwIGFuZCA1MDAgY2hhcmFjdGVycy5cIik7XG4gICAgfVxuICAgIGNvbnN0IGhhc0V4cGVyaWVuY2UgPSBwcm9maWxlLmV4cGVyaWVuY2VzLnNvbWUoKGV4cGVyaWVuY2UpID0+IGV4cGVyaWVuY2UudGl0bGUudHJpbSgpICYmXG4gICAgICAgIGV4cGVyaWVuY2UuY29tcGFueS50cmltKCkgJiZcbiAgICAgICAgZXhwZXJpZW5jZS5zdGFydERhdGUudHJpbSgpKTtcbiAgICBpZiAoaGFzRXhwZXJpZW5jZSkge1xuICAgICAgICBlYXJuZWQgKz0gMjtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBhdCBsZWFzdCBvbmUgcm9sZSB3aXRoIHRpdGxlLCBjb21wYW55LCBhbmQgc3RhcnQgZGF0ZS5cIik7XG4gICAgfVxuICAgIGlmIChwcm9maWxlLmVkdWNhdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVhcm5lZCArPSAxO1xuICAgICAgICBjb21wbGV0ZVNlY3Rpb25zICs9IDE7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3Rlcy5wdXNoKFwiQWRkIGF0IGxlYXN0IG9uZSBlZHVjYXRpb24gZW50cnkuXCIpO1xuICAgIH1cbiAgICBpZiAocHJvZmlsZS5za2lsbHMubGVuZ3RoID49IDMpIHtcbiAgICAgICAgZWFybmVkICs9IDI7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSBpZiAocHJvZmlsZS5za2lsbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBhdCBsZWFzdCB0aHJlZSBza2lsbHMuXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBhIHNraWxscyBzZWN0aW9uLlwiKTtcbiAgICB9XG4gICAgY29uc3QgaGFzSGlnaGxpZ2h0ID0gcHJvZmlsZS5leHBlcmllbmNlcy5zb21lKChleHBlcmllbmNlKSA9PiBleHBlcmllbmNlLmhpZ2hsaWdodHMubGVuZ3RoID4gMCk7XG4gICAgaWYgKGhhc0hpZ2hsaWdodCkge1xuICAgICAgICBlYXJuZWQgKz0gMTtcbiAgICAgICAgY29tcGxldGVTZWN0aW9ucyArPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm90ZXMucHVzaChcIkFkZCBhY2hpZXZlbWVudCBoaWdobGlnaHRzIHRvIGV4cGVyaWVuY2UuXCIpO1xuICAgIH1cbiAgICBjb25zdCBoYXNTZWNvbmRhcnlDb250YWN0ID0gQm9vbGVhbihwcm9maWxlLmNvbnRhY3QucGhvbmU/LnRyaW0oKSB8fFxuICAgICAgICBwcm9maWxlLmNvbnRhY3QubGlua2VkaW4/LnRyaW0oKSB8fFxuICAgICAgICBwcm9maWxlLmNvbnRhY3QubG9jYXRpb24/LnRyaW0oKSk7XG4gICAgaWYgKGhhc1NlY29uZGFyeUNvbnRhY3QpIHtcbiAgICAgICAgZWFybmVkICs9IDE7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vdGVzLnB1c2goXCJBZGQgcGhvbmUsIExpbmtlZEluLCBvciBsb2NhdGlvbi5cIik7XG4gICAgfVxuICAgIGlmIChwcm9maWxlLmNvbnRhY3QubmFtZT8udHJpbSgpICYmIHByb2ZpbGUuY29udGFjdC5lbWFpbD8udHJpbSgpKSB7XG4gICAgICAgIGNvbXBsZXRlU2VjdGlvbnMgKz0gMTtcbiAgICB9XG4gICAgZXZpZGVuY2UucHVzaChgJHtjb21wbGV0ZVNlY3Rpb25zfS83IHNlY3Rpb25zIGNvbXBsZXRlYCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcInNlY3Rpb25Db21wbGV0ZW5lc3NcIixcbiAgICAgICAgbGFiZWw6IFwiU2VjdGlvbiBjb21wbGV0ZW5lc3NcIixcbiAgICAgICAgZWFybmVkOiBNYXRoLm1pbihlYXJuZWQsIFNVQl9TQ09SRV9NQVhfUE9JTlRTLnNlY3Rpb25Db21wbGV0ZW5lc3MpLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLnNlY3Rpb25Db21wbGV0ZW5lc3MsXG4gICAgICAgIG5vdGVzLFxuICAgICAgICBldmlkZW5jZSxcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgQUNUSU9OX1ZFUkJTLCBTVUJfU0NPUkVfTUFYX1BPSU5UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZ2V0SGlnaGxpZ2h0cywgbm9ybWFsaXplVGV4dCB9IGZyb20gXCIuL3RleHRcIjtcbmNvbnN0IFJFUEVBVEVEX1dPUkRfRVhDRVBUSU9OUyA9IG5ldyBTZXQoW1wiaGFkIGhhZFwiLCBcInRoYXQgdGhhdFwiXSk7XG5jb25zdCBBQ1JPTllNUyA9IG5ldyBTZXQoW1wiQVBJXCIsIFwiQVdTXCIsIFwiQ1NTXCIsIFwiR0NQXCIsIFwiSFRNTFwiLCBcIlNRTFwiXSk7XG5mdW5jdGlvbiBoYXNWZXJiTGlrZVRva2VuKHRleHQpIHtcbiAgICBjb25zdCB3b3JkcyA9IG5vcm1hbGl6ZVRleHQodGV4dCkuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgcmV0dXJuIHdvcmRzLnNvbWUoKHdvcmQpID0+IEFDVElPTl9WRVJCUy5pbmNsdWRlcyh3b3JkKSB8fFxuICAgICAgICAvKD86ZWR8aW5nfHMpJC8udGVzdCh3b3JkKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gc2NvcmVTcGVsbGluZ0dyYW1tYXIoaW5wdXQpIHtcbiAgICBjb25zdCBoaWdobGlnaHRzID0gZ2V0SGlnaGxpZ2h0cyhpbnB1dC5wcm9maWxlKTtcbiAgICBjb25zdCB0ZXh0ID0gaGlnaGxpZ2h0cy5qb2luKFwiXFxuXCIpO1xuICAgIGNvbnN0IG5vdGVzID0gW107XG4gICAgY29uc3QgZXZpZGVuY2UgPSBbXTtcbiAgICBsZXQgZGVkdWN0aW9ucyA9IDA7XG4gICAgY29uc3QgcmVwZWF0ZWQgPSBBcnJheS5mcm9tKHRleHQubWF0Y2hBbGwoL1xcYihcXHcrKVxccytcXDFcXGIvZ2kpLCAobWF0Y2gpID0+IG1hdGNoWzBdKS5maWx0ZXIoKG1hdGNoKSA9PiAhUkVQRUFURURfV09SRF9FWENFUFRJT05TLmhhcyhtYXRjaC50b0xvd2VyQ2FzZSgpKSk7XG4gICAgaWYgKHJlcGVhdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGVuYWx0eSA9IE1hdGgubWluKDIsIHJlcGVhdGVkLmxlbmd0aCk7XG4gICAgICAgIGRlZHVjdGlvbnMgKz0gcGVuYWx0eTtcbiAgICAgICAgbm90ZXMucHVzaChcIlJlcGVhdGVkIGFkamFjZW50IHdvcmRzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgZXZpZGVuY2UucHVzaChgUmVwZWF0ZWQgd29yZDogJHtyZXBlYXRlZFswXX1gKTtcbiAgICB9XG4gICAgaWYgKC8gICsvLnRlc3QodGV4dCkpIHtcbiAgICAgICAgZGVkdWN0aW9ucyArPSAxO1xuICAgICAgICBub3Rlcy5wdXNoKFwiTXVsdGlwbGUgc3BhY2VzIGJldHdlZW4gd29yZHMgZGV0ZWN0ZWQuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKFwiTXVsdGlwbGUgc3BhY2VzIGZvdW5kLlwiKTtcbiAgICB9XG4gICAgY29uc3QgbG93ZXJjYXNlU3RhcnRzID0gaGlnaGxpZ2h0cy5maWx0ZXIoKGhpZ2hsaWdodCkgPT4gL15bYS16XS8udGVzdChoaWdobGlnaHQudHJpbSgpKSk7XG4gICAgaWYgKGxvd2VyY2FzZVN0YXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1pbigzLCBsb3dlcmNhc2VTdGFydHMubGVuZ3RoKTtcbiAgICAgICAgZGVkdWN0aW9ucyArPSBwZW5hbHR5O1xuICAgICAgICBub3Rlcy5wdXNoKFwiU29tZSBoaWdobGlnaHRzIHN0YXJ0IHdpdGggbG93ZXJjYXNlIGxldHRlcnMuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGBMb3dlcmNhc2Ugc3RhcnQ6ICR7bG93ZXJjYXNlU3RhcnRzWzBdfWApO1xuICAgIH1cbiAgICBjb25zdCBmcmFnbWVudHMgPSBoaWdobGlnaHRzLmZpbHRlcigoaGlnaGxpZ2h0KSA9PiBoaWdobGlnaHQubGVuZ3RoID4gNDAgJiYgIWhhc1ZlcmJMaWtlVG9rZW4oaGlnaGxpZ2h0KSk7XG4gICAgaWYgKGZyYWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBlbmFsdHkgPSBNYXRoLm1pbigyLCBmcmFnbWVudHMubGVuZ3RoKTtcbiAgICAgICAgZGVkdWN0aW9ucyArPSBwZW5hbHR5O1xuICAgICAgICBub3Rlcy5wdXNoKFwiU29tZSBsb25nIGhpZ2hsaWdodHMgbWF5IHJlYWQgbGlrZSBzZW50ZW5jZSBmcmFnbWVudHMuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGBQb3NzaWJsZSBmcmFnbWVudDogJHtmcmFnbWVudHNbMF19YCk7XG4gICAgfVxuICAgIGNvbnN0IHB1bmN0dWF0aW9uRW5kaW5ncyA9IGhpZ2hsaWdodHMuZmlsdGVyKChoaWdobGlnaHQpID0+IC9cXC4kLy50ZXN0KGhpZ2hsaWdodC50cmltKCkpKS5sZW5ndGg7XG4gICAgaWYgKGhpZ2hsaWdodHMubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCByYXRlID0gcHVuY3R1YXRpb25FbmRpbmdzIC8gaGlnaGxpZ2h0cy5sZW5ndGg7XG4gICAgICAgIGlmIChyYXRlID4gMC4zICYmIHJhdGUgPCAwLjcpIHtcbiAgICAgICAgICAgIGRlZHVjdGlvbnMgKz0gMTtcbiAgICAgICAgICAgIG5vdGVzLnB1c2goXCJUcmFpbGluZyBwdW5jdHVhdGlvbiBpcyBpbmNvbnNpc3RlbnQgYWNyb3NzIGhpZ2hsaWdodHMuXCIpO1xuICAgICAgICAgICAgZXZpZGVuY2UucHVzaChgJHtwdW5jdHVhdGlvbkVuZGluZ3N9LyR7aGlnaGxpZ2h0cy5sZW5ndGh9IGhpZ2hsaWdodHMgZW5kIHdpdGggcGVyaW9kcy5gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhbGxDYXBzID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKC9cXGJbQS1aXXs0LH1cXGIvZyksIChtYXRjaCkgPT4gbWF0Y2hbMF0pLmZpbHRlcigod29yZCkgPT4gIUFDUk9OWU1TLmhhcyh3b3JkKSk7XG4gICAgaWYgKGFsbENhcHMubGVuZ3RoID4gNSkge1xuICAgICAgICBkZWR1Y3Rpb25zICs9IDE7XG4gICAgICAgIG5vdGVzLnB1c2goXCJFeGNlc3NpdmUgYWxsLWNhcHMgd29yZHMgZGV0ZWN0ZWQuXCIpO1xuICAgICAgICBldmlkZW5jZS5wdXNoKGBBbGwtY2FwcyB3b3JkczogJHthbGxDYXBzLnNsaWNlKDAsIDMpLmpvaW4oXCIsIFwiKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBcInNwZWxsaW5nR3JhbW1hclwiLFxuICAgICAgICBsYWJlbDogXCJTcGVsbGluZyBhbmQgZ3JhbW1hclwiLFxuICAgICAgICBlYXJuZWQ6IE1hdGgubWF4KDAsIFNVQl9TQ09SRV9NQVhfUE9JTlRTLnNwZWxsaW5nR3JhbW1hciAtIGRlZHVjdGlvbnMpLFxuICAgICAgICBtYXhQb2ludHM6IFNVQl9TQ09SRV9NQVhfUE9JTlRTLnNwZWxsaW5nR3JhbW1hcixcbiAgICAgICAgbm90ZXMsXG4gICAgICAgIGV2aWRlbmNlOiBldmlkZW5jZS5sZW5ndGggPiAwID8gZXZpZGVuY2UgOiBbXCJObyBoZXVyaXN0aWMgaXNzdWVzIGRldGVjdGVkLlwiXSxcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgbm93SXNvIH0gZnJvbSBcIi4uL2Zvcm1hdHRlcnNcIjtcbmltcG9ydCB7IHNjb3JlQWN0aW9uVmVyYnMgfSBmcm9tIFwiLi9hY3Rpb24tdmVyYnNcIjtcbmltcG9ydCB7IHNjb3JlQXRzRnJpZW5kbGluZXNzIH0gZnJvbSBcIi4vYXRzLWZyaWVuZGxpbmVzc1wiO1xuaW1wb3J0IHsgc2NvcmVLZXl3b3JkTWF0Y2ggfSBmcm9tIFwiLi9rZXl3b3JkLW1hdGNoXCI7XG5pbXBvcnQgeyBzY29yZUxlbmd0aCB9IGZyb20gXCIuL2xlbmd0aFwiO1xuaW1wb3J0IHsgc2NvcmVRdWFudGlmaWVkQWNoaWV2ZW1lbnRzIH0gZnJvbSBcIi4vcXVhbnRpZmllZC1hY2hpZXZlbWVudHNcIjtcbmltcG9ydCB7IHNjb3JlU2VjdGlvbkNvbXBsZXRlbmVzcyB9IGZyb20gXCIuL3NlY3Rpb24tY29tcGxldGVuZXNzXCI7XG5pbXBvcnQgeyBzY29yZVNwZWxsaW5nR3JhbW1hciB9IGZyb20gXCIuL3NwZWxsaW5nLWdyYW1tYXJcIjtcbmV4cG9ydCBmdW5jdGlvbiBzY29yZVJlc3VtZShpbnB1dCkge1xuICAgIGNvbnN0IHN1YlNjb3JlcyA9IHtcbiAgICAgICAgc2VjdGlvbkNvbXBsZXRlbmVzczogc2NvcmVTZWN0aW9uQ29tcGxldGVuZXNzKGlucHV0KSxcbiAgICAgICAgYWN0aW9uVmVyYnM6IHNjb3JlQWN0aW9uVmVyYnMoaW5wdXQpLFxuICAgICAgICBxdWFudGlmaWVkQWNoaWV2ZW1lbnRzOiBzY29yZVF1YW50aWZpZWRBY2hpZXZlbWVudHMoaW5wdXQpLFxuICAgICAgICBrZXl3b3JkTWF0Y2g6IHNjb3JlS2V5d29yZE1hdGNoKGlucHV0KSxcbiAgICAgICAgbGVuZ3RoOiBzY29yZUxlbmd0aChpbnB1dCksXG4gICAgICAgIHNwZWxsaW5nR3JhbW1hcjogc2NvcmVTcGVsbGluZ0dyYW1tYXIoaW5wdXQpLFxuICAgICAgICBhdHNGcmllbmRsaW5lc3M6IHNjb3JlQXRzRnJpZW5kbGluZXNzKGlucHV0KSxcbiAgICB9O1xuICAgIGNvbnN0IG92ZXJhbGwgPSBPYmplY3QudmFsdWVzKHN1YlNjb3JlcykucmVkdWNlKChzdW0sIHN1YlNjb3JlKSA9PiBzdW0gKyBzdWJTY29yZS5lYXJuZWQsIDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIG92ZXJhbGw6IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgTWF0aC5yb3VuZChvdmVyYWxsKSkpLFxuICAgICAgICBzdWJTY29yZXMsXG4gICAgICAgIGdlbmVyYXRlZEF0OiBub3dJc28oKSxcbiAgICB9O1xufVxuZXhwb3J0IHsgc2NvcmVBY3Rpb25WZXJicyB9IGZyb20gXCIuL2FjdGlvbi12ZXJic1wiO1xuZXhwb3J0IHsgc2NvcmVBdHNGcmllbmRsaW5lc3MgfSBmcm9tIFwiLi9hdHMtZnJpZW5kbGluZXNzXCI7XG5leHBvcnQgeyBzY29yZUtleXdvcmRNYXRjaCB9IGZyb20gXCIuL2tleXdvcmQtbWF0Y2hcIjtcbmV4cG9ydCB7IHNjb3JlTGVuZ3RoIH0gZnJvbSBcIi4vbGVuZ3RoXCI7XG5leHBvcnQgeyBzY29yZVF1YW50aWZpZWRBY2hpZXZlbWVudHMgfSBmcm9tIFwiLi9xdWFudGlmaWVkLWFjaGlldmVtZW50c1wiO1xuZXhwb3J0IHsgc2NvcmVTZWN0aW9uQ29tcGxldGVuZXNzIH0gZnJvbSBcIi4vc2VjdGlvbi1jb21wbGV0ZW5lc3NcIjtcbmV4cG9ydCB7IHNjb3JlU3BlbGxpbmdHcmFtbWFyIH0gZnJvbSBcIi4vc3BlbGxpbmctZ3JhbW1hclwiO1xuIiwiLyoqXG4gKiBEZWVwLWxpbmsgVVJMIGJ1aWxkZXJzIGZvciB0aGUgcG9wdXAncyBwb3N0LWltcG9ydCBzdWNjZXNzIGJ1dHRvbnMgKCMzMSkuXG4gKlxuICogS2VwdCBpbiBpdHMgb3duIG1vZHVsZSBzbyB0aGUgVVJMIHNoYXBlIGlzIHVuaXQtdGVzdGFibGUgd2l0aG91dCBib290aW5nXG4gKiBSZWFjdC9qc2RvbS4gVGhlIHBvcHVwIGNvbXBvbmVudCBpbXBvcnRzIGJvdGggaGVscGVycyBhbmQgdGhyZWFkcyB0aGVcbiAqIGNvbmZpZ3VyZWQgYGFwaUJhc2VVcmxgIChmcm9tIEdFVF9BVVRIX1NUQVRVUykgdGhyb3VnaC5cbiAqL1xuLyoqXG4gKiBCdWlsZHMgdGhlIGRlZXAtbGluayB0byBhIHNpbmdsZSBvcHBvcnR1bml0eSdzIGRldGFpbCBwYWdlLlxuICpcbiAqIFRyYWlsaW5nIHNsYXNoZXMgb24gdGhlIGJhc2UgVVJMIGFyZSBzdHJpcHBlZCBzbyB3ZSBkb24ndCBwcm9kdWNlXG4gKiBgaHR0cDovL2xvY2FsaG9zdDozMDAwLy9vcHBvcnR1bml0aWVzLy4uLmAuIFRoZSBvcHBvcnR1bml0eSBpZCBpc1xuICogVVJJLWVuY29kZWQgZGVmZW5zaXZlbHkgZXZlbiB0aG91Z2ggc2VydmVyLXNpZGUgaWRzIGFyZSBzYWZlIHRvZGF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gb3Bwb3J0dW5pdHlEZXRhaWxVcmwoYXBpQmFzZVVybCwgb3Bwb3J0dW5pdHlJZCkge1xuICAgIGNvbnN0IGJhc2UgPSBhcGlCYXNlVXJsLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gICAgcmV0dXJuIGAke2Jhc2V9L29wcG9ydHVuaXRpZXMvJHtlbmNvZGVVUklDb21wb25lbnQob3Bwb3J0dW5pdHlJZCl9YDtcbn1cbi8qKlxuICogQnVpbGRzIHRoZSBkZWVwLWxpbmsgdG8gdGhlIHJldmlldyBxdWV1ZSB1c2VkIGFmdGVyIGEgYnVsayBzY3JhcGUgaW1wb3J0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gb3Bwb3J0dW5pdHlSZXZpZXdVcmwoYXBpQmFzZVVybCkge1xuICAgIGNvbnN0IGJhc2UgPSBhcGlCYXNlVXJsLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG4gICAgcmV0dXJuIGAke2Jhc2V9L29wcG9ydHVuaXRpZXMvcmV2aWV3YDtcbn1cbiIsImltcG9ydCB7IGpzeHMgYXMgX2pzeHMsIGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5leHBvcnQgZnVuY3Rpb24gQnVsa1NvdXJjZUNhcmQocHJvcHMpIHtcbiAgICBjb25zdCB7IHNvdXJjZUxhYmVsLCBkZXRlY3RlZENvdW50LCBidXN5LCBsYXN0UmVzdWx0LCBsYXN0RXJyb3IsIG9uU2NyYXBlVmlzaWJsZSwgb25TY3JhcGVQYWdpbmF0ZWQsIG9uVmlld1RyYWNrZXIsIH0gPSBwcm9wcztcbiAgICBjb25zdCBkaXNhYmxlZCA9IGJ1c3kgIT09IG51bGwgfHwgZGV0ZWN0ZWRDb3VudCA9PT0gMDtcbiAgICByZXR1cm4gKF9qc3hzKFwiYXJ0aWNsZVwiLCB7IGNsYXNzTmFtZTogXCJjYXJkXCIsIFwiZGF0YS1idWxrLXNvdXJjZVwiOiBzb3VyY2VMYWJlbC50b0xvd2VyQ2FzZSgpLCBjaGlsZHJlbjogW19qc3hzKFwiaGVhZGVyXCIsIHsgY2xhc3NOYW1lOiBcImNhcmQtaGVhZFwiLCBjaGlsZHJlbjogW19qc3hzKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJjYXJkLXRpdGxlXCIsIGNoaWxkcmVuOiBbc291cmNlTGFiZWwsIFwiIGxpc3RcIl0gfSksIF9qc3hzKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJiYWRnZVwiLCBjaGlsZHJlbjogW2RldGVjdGVkQ291bnQsIFwiIHJvd1wiLCBkZXRlY3RlZENvdW50ID09PSAxID8gXCJcIiA6IFwic1wiXSB9KV0gfSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImFjdGlvbi1ncmlkXCIsIGNoaWxkcmVuOiBbX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBmdWxsXCIsIG9uQ2xpY2s6IG9uU2NyYXBlVmlzaWJsZSwgZGlzYWJsZWQ6IGRpc2FibGVkLCBjaGlsZHJlbjogYnVzeSA9PT0gXCJ2aXNpYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiU2NyYXBpbmcgdmlzaWJsZeKAplwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBgU2NyYXBlICR7ZGV0ZWN0ZWRDb3VudH0gdmlzaWJsZWAgfSksIF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGZ1bGxcIiwgb25DbGljazogb25TY3JhcGVQYWdpbmF0ZWQsIGRpc2FibGVkOiBkaXNhYmxlZCwgdGl0bGU6IGBXYWxrcyBldmVyeSBwYWdlIGluIHlvdXIgY3VycmVudCBmaWx0ZXIgc2V0OyBjYXBwZWQgYXQgMjAwIGpvYnMuYCwgY2hpbGRyZW46IGJ1c3kgPT09IFwicGFnaW5hdGVkXCIgPyBcIldhbGtpbmcgcGFnZXPigKZcIiA6IFwiU2NyYXBlIGZpbHRlcmVkIHNldFwiIH0pXSB9KSwgbGFzdFJlc3VsdCAmJiAoX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYnVsay1yZXN1bHRcIiwgY2hpbGRyZW46IFtfanN4cyhcInBcIiwgeyBjbGFzc05hbWU6IFwiaW5saW5lLW5vdGVcIiwgY2hpbGRyZW46IFtcIkltcG9ydGVkIFwiLCBsYXN0UmVzdWx0LmltcG9ydGVkLCBcIi9cIiwgbGFzdFJlc3VsdC5hdHRlbXB0ZWQsIGxhc3RSZXN1bHQucGFnZXMgPiAxICYmIGAgwrcgJHtsYXN0UmVzdWx0LnBhZ2VzfSBwYWdlc2AsIGxhc3RSZXN1bHQuZHVwbGljYXRlQ291bnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBgIMK3ICR7bGFzdFJlc3VsdC5kdXBsaWNhdGVDb3VudH0gZHVwbGljYXRlc2BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiLCBsYXN0UmVzdWx0LmVycm9ycy5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAgwrcgJHtsYXN0UmVzdWx0LmVycm9ycy5sZW5ndGh9IGVycm9yc2BdIH0pLCBsYXN0UmVzdWx0LmRlZHVwZWRJZHM/Lmxlbmd0aCA/IChfanN4cyhcInBcIiwgeyBjbGFzc05hbWU6IFwiaW5saW5lLW5vdGUgYnVsay1kdXBsaWNhdGVzXCIsIGNoaWxkcmVuOiBbXCJEdXBsaWNhdGVzOiBcIiwgbGFzdFJlc3VsdC5kZWR1cGVkSWRzLmpvaW4oXCIsIFwiKV0gfSkpIDogbnVsbCwgbGFzdFJlc3VsdC5pbXBvcnRlZCA+IDAgJiYgb25WaWV3VHJhY2tlciAmJiAoX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJzdWNjZXNzLWxpbmtcIiwgb25DbGljazogb25WaWV3VHJhY2tlciwgY2hpbGRyZW46IFwiVmlldyB0cmFja2VyIFxcdTIxOTJcIiB9KSldIH0pKSwgbGFzdEVycm9yICYmIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlubGluZS1lcnJvclwiLCBjaGlsZHJlbjogbGFzdEVycm9yIH0pXSB9KSk7XG59XG4iLCJpbXBvcnQgeyBqc3ggYXMgX2pzeCwganN4cyBhcyBfanN4cyB9IGZyb20gXCJyZWFjdC9qc3gtcnVudGltZVwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgZm9ybWF0UmVsYXRpdmUgfSBmcm9tIFwiQHNsb3RoaW5nL3NoYXJlZC9mb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBzY29yZVJlc3VtZSB9IGZyb20gXCJAc2xvdGhpbmcvc2hhcmVkL3Njb3JpbmdcIjtcbmltcG9ydCB7IERFRkFVTFRfQVBJX0JBU0VfVVJMIH0gZnJvbSBcIkAvc2hhcmVkL3R5cGVzXCI7XG5pbXBvcnQgeyBzZW5kTWVzc2FnZSwgTWVzc2FnZXMgfSBmcm9tIFwiQC9zaGFyZWQvbWVzc2FnZXNcIjtcbmltcG9ydCB7IG1lc3NhZ2VGb3JFcnJvciB9IGZyb20gXCJAL3NoYXJlZC9lcnJvci1tZXNzYWdlc1wiO1xuaW1wb3J0IHsgb3Bwb3J0dW5pdHlSZXZpZXdVcmwgfSBmcm9tIFwiLi9kZWVwLWxpbmtzXCI7XG5pbXBvcnQgeyBCdWxrU291cmNlQ2FyZCwgfSBmcm9tIFwiLi9CdWxrU291cmNlQ2FyZFwiO1xuY29uc3QgQlVMS19TT1VSQ0VfTEFCRUxTID0ge1xuICAgIGdyZWVuaG91c2U6IFwiR3JlZW5ob3VzZVwiLFxuICAgIGxldmVyOiBcIkxldmVyXCIsXG4gICAgd29ya2RheTogXCJXb3JrZGF5XCIsXG59O1xuY29uc3QgQlVMS19TT1VSQ0VfVVJMX1BBVFRFUk5TID0ge1xuICAgIGdyZWVuaG91c2U6IFsvYm9hcmRzXFwuZ3JlZW5ob3VzZVxcLmlvXFwvLywgL1tcXHctXStcXC5ncmVlbmhvdXNlXFwuaW9cXC8vXSxcbiAgICBsZXZlcjogWy9qb2JzXFwubGV2ZXJcXC5jb1xcLy8sIC9bXFx3LV0rXFwubGV2ZXJcXC5jb1xcLy9dLFxuICAgIHdvcmtkYXk6IFsvXFwubXl3b3JrZGF5am9ic1xcLmNvbVxcLy8sIC9cXC53b3JrZGF5am9ic1xcLmNvbVxcLy9dLFxufTtcbmNvbnN0IENPTlRFTlRfU0NSSVBUX1VSTF9QQVRURVJOUyA9IFtcbiAgICAvbGlua2VkaW5cXC5jb21cXC8vLFxuICAgIC9pbmRlZWRcXC5jb21cXC8vLFxuICAgIC9ncmVlbmhvdXNlXFwuaW9cXC8vLFxuICAgIC9ib2FyZHNcXC5ncmVlbmhvdXNlXFwuaW9cXC8vLFxuICAgIC9sZXZlclxcLmNvXFwvLyxcbiAgICAvam9ic1xcLmxldmVyXFwuY29cXC8vLFxuICAgIC93YXRlcmxvb3dvcmtzXFwudXdhdGVybG9vXFwuY2FcXC8vLFxuICAgIC93b3JrZGF5am9ic1xcLmNvbVxcLy8sXG4gICAgL215d29ya2RheWpvYnNcXC5jb21cXC8vLFxuXTtcbmZ1bmN0aW9uIG1hdGNoQnVsa1NvdXJjZSh1cmwpIHtcbiAgICBpZiAoIXVybClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoQlVMS19TT1VSQ0VfVVJMX1BBVFRFUk5TKSkge1xuICAgICAgICBpZiAoQlVMS19TT1VSQ0VfVVJMX1BBVFRFUk5TW2tleV0uc29tZSgocCkgPT4gcC50ZXN0KHVybCkpKVxuICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBoYXNDb250ZW50U2NyaXB0SG9zdCh1cmwpIHtcbiAgICByZXR1cm4gKCEhdXJsICYmIENPTlRFTlRfU0NSSVBUX1VSTF9QQVRURVJOUy5zb21lKChwYXR0ZXJuKSA9PiBwYXR0ZXJuLnRlc3QodXJsKSkpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKCkge1xuICAgIGNvbnN0IFt2aWV3U3RhdGUsIHNldFZpZXdTdGF0ZV0gPSB1c2VTdGF0ZShcImxvYWRpbmdcIik7XG4gICAgY29uc3QgW3Byb2ZpbGUsIHNldFByb2ZpbGVdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3BhZ2VTdGF0dXMsIHNldFBhZ2VTdGF0dXNdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3N1cmZhY2VDb250ZXh0LCBzZXRTdXJmYWNlQ29udGV4dF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbYWN0aXZlVGFiSWQsIHNldEFjdGl2ZVRhYklkXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IFthY3RpdmVUYWJVcmwsIHNldEFjdGl2ZVRhYlVybF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbcGFnZVByb2JlU3RhdGUsIHNldFBhZ2VQcm9iZVN0YXRlXSA9IHVzZVN0YXRlKFwidW5rbm93blwiKTtcbiAgICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIC8vIENhY2hlZCBzbyBkYXNoYm9hcmQvcmV2aWV3IGxpbmtzIGNhbiByZW5kZXIgd2l0aG91dCBxdWVyeWluZ1xuICAgIC8vIEdFVF9BVVRIX1NUQVRVUyBhZ2Fpbi4gUG9wdWxhdGVkIGZyb20gdGhlIGF1dGgtc3RhdHVzIHJlc3BvbnNlIG9uIGZpcnN0XG4gICAgLy8gbG9hZCBhbmQga2VwdCBzdGFibGUgZm9yIHRoZSBsaWZldGltZSBvZiB0aGUgcG9wdXAuXG4gICAgY29uc3QgW2FwaUJhc2VVcmwsIHNldEFwaUJhc2VVcmxdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3d3U3RhdGUsIHNldFd3U3RhdGVdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3d3QnVsa0luRmxpZ2h0LCBzZXRXd0J1bGtJbkZsaWdodF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBbd3dCdWxrUmVzdWx0LCBzZXRXd0J1bGtSZXN1bHRdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3QgW3d3QnVsa0Vycm9yLCBzZXRXd0J1bGtFcnJvcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICAvLyBQMy8jMzkg4oCUIFBlci1zb3VyY2Ugc3RhdGUgZm9yIEdyZWVuaG91c2UgLyBMZXZlciAvIFdvcmtkYXkuIEtleWVkIGJ5XG4gICAgLy8gQnVsa1NvdXJjZUtleSBzbyBhIGZ1dHVyZSBzb3VyY2UgaXMgYSBvbmUtbGluZSBhZGRpdGlvbi5cbiAgICBjb25zdCBbYnVsa1N0YXRlcywgc2V0QnVsa1N0YXRlc10gPSB1c2VTdGF0ZSh7fSk7XG4gICAgY29uc3QgW2J1bGtJbkZsaWdodCwgc2V0QnVsa0luRmxpZ2h0XSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbYnVsa1Jlc3VsdHMsIHNldEJ1bGtSZXN1bHRzXSA9IHVzZVN0YXRlKHt9KTtcbiAgICBjb25zdCBbYnVsa0Vycm9ycywgc2V0QnVsa0Vycm9yc10gPSB1c2VTdGF0ZSh7fSk7XG4gICAgY29uc3QgW2NvbmZpcm1pbmdMb2dvdXQsIHNldENvbmZpcm1pbmdMb2dvdXRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IHByb2ZpbGVTY29yZSA9IHByb2ZpbGUgPyBzY29yZVJlc3VtZSh7IHByb2ZpbGUgfSkub3ZlcmFsbCA6IG51bGw7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgY2hlY2tBdXRoU3RhdHVzKCk7XG4gICAgICAgIGNoZWNrUGFnZVN0YXR1cygpO1xuICAgIH0sIFtdKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBcIkFVVEhfU1RBVFVTX0NIQU5HRURcIikge1xuICAgICAgICAgICAgICAgIHZvaWQgY2hlY2tBdXRoU3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgIHJldHVybiAoKSA9PiBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgIH0sIFtdKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAodmlld1N0YXRlICE9PSBcInNlc3Npb24tbG9zdFwiKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBpbnRlcnZhbElkID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHZvaWQgY2hlY2tBdXRoU3RhdHVzKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICByZXR1cm4gKCkgPT4gd2luZG93LmNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJZCk7XG4gICAgfSwgW3ZpZXdTdGF0ZV0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICAgIGFzeW5jIGZ1bmN0aW9uIGNoZWNrQXV0aFN0YXR1cygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0QXV0aFN0YXR1cygpKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlzQXV0aGVudGljYXRlZCwgc2Vzc2lvbkxvc3QsIGFwaUJhc2VVcmw6IHVybCwgfSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHVybClcbiAgICAgICAgICAgICAgICAgICAgc2V0QXBpQmFzZVVybCh1cmwpO1xuICAgICAgICAgICAgICAgIGlmIChpc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld1N0YXRlKFwiYXV0aGVudGljYXRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFByb2ZpbGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2Vzc2lvbkxvc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld1N0YXRlKFwic2Vzc2lvbi1sb3N0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld1N0YXRlKFwidW5hdXRoZW50aWNhdGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFZpZXdTdGF0ZShcInVuYXV0aGVudGljYXRlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBzZXRWaWV3U3RhdGUoXCJlcnJvclwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBsb2FkUHJvZmlsZSgpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5nZXRQcm9maWxlKCkpO1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcyAmJiByZXNwb25zZS5kYXRhKSB7XG4gICAgICAgICAgICBzZXRQcm9maWxlKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGNoZWNrUGFnZVN0YXR1cygpIHtcbiAgICAgICAgY29uc3QgW3RhYl0gPSBhd2FpdCBjaHJvbWUudGFicy5xdWVyeSh7XG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICBjdXJyZW50V2luZG93OiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRhYj8uaWQpIHtcbiAgICAgICAgICAgIHNldEFjdGl2ZVRhYklkKHRhYi5pZCk7XG4gICAgICAgICAgICBzZXRBY3RpdmVUYWJVcmwodGFiLnVybCB8fCBudWxsKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIE1lc3NhZ2VzLmdldFN1cmZhY2VDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIHNldFN1cmZhY2VDb250ZXh0KGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBzZXRQYWdlU3RhdHVzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0Zvcm06IGNvbnRleHQucGFnZS5oYXNBcHBsaWNhdGlvbkZvcm0sXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNKb2JMaXN0aW5nOiBjb250ZXh0LnBhZ2Uuam9iICE9PSBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZWN0ZWRGaWVsZHM6IGNvbnRleHQucGFnZS5kZXRlY3RlZEZpZWxkQ291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JhcGVkSm9iOiBjb250ZXh0LnBhZ2Uuam9iLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2V0UGFnZVByb2JlU3RhdGUoXCJyZWFkeVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgc2V0UGFnZVByb2JlU3RhdGUoIXRhYi51cmwgfHwgaGFzQ29udGVudFNjcmlwdEhvc3QodGFiLnVybClcbiAgICAgICAgICAgICAgICAgICAgPyBcIm5lZWRzLXJlZnJlc2hcIlxuICAgICAgICAgICAgICAgICAgICA6IFwidW5rbm93blwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YWIudXJsICYmIC93YXRlcmxvb3dvcmtzXFwudXdhdGVybG9vXFwuY2EvLnRlc3QodGFiLnVybCkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIldXX0dFVF9QQUdFX1NUQVRFXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocj8uc3VjY2VzcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFd3U3RhdGUoci5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICAvLyBDb250ZW50IHNjcmlwdCBub3QgeWV0IGxvYWRlZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFAzLyMzOSDigJQgcHJvYmUgR3JlZW5ob3VzZS9MZXZlci9Xb3JrZGF5IGxpc3RpbmcgcGFnZXMuIE9ubHkgb25lXG4gICAgICAgICAgICAvLyBtYXRjaGVyIGZpcmVzIHBlciB2aXNpdCAodGhlIHVzZXIgaXMgb24gYSBzaW5nbGUgaG9zdCkuXG4gICAgICAgICAgICBjb25zdCBidWxrS2V5ID0gbWF0Y2hCdWxrU291cmNlKHRhYi51cmwpO1xuICAgICAgICAgICAgaWYgKGJ1bGtLZXkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlVHlwZSA9IGJ1bGtQYWdlU3RhdGVNZXNzYWdlKGJ1bGtLZXkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXNzYWdlVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyPy5zdWNjZXNzICYmIHIuZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QnVsa1N0YXRlcygocHJldikgPT4gKHsgLi4ucHJldiwgW2J1bGtLZXldOiByLmRhdGEgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udGVudCBzY3JpcHQgbm90IHlldCBsb2FkZWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVsa1BhZ2VTdGF0ZU1lc3NhZ2Uoa2V5KSB7XG4gICAgICAgIHJldHVybiBgQlVMS18ke2tleS50b1VwcGVyQ2FzZSgpfV9HRVRfUEFHRV9TVEFURWA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1bGtTY3JhcGVNZXNzYWdlKGtleSwgbW9kZSkge1xuICAgICAgICBjb25zdCBzdWZmaXggPSBtb2RlID09PSBcInZpc2libGVcIiA/IFwiU0NSQVBFX1ZJU0lCTEVcIiA6IFwiU0NSQVBFX1BBR0lOQVRFRFwiO1xuICAgICAgICByZXR1cm4gYEJVTEtfJHtrZXkudG9VcHBlckNhc2UoKX1fJHtzdWZmaXh9YDtcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlQnVsa1NvdXJjZVNjcmFwZShrZXksIG1vZGUpIHtcbiAgICAgICAgc2V0QnVsa0luRmxpZ2h0KChwcmV2KSA9PiAoeyAuLi5wcmV2LCBba2V5XTogbW9kZSB9KSk7XG4gICAgICAgIHNldEJ1bGtFcnJvcnMoKHByZXYpID0+ICh7IC4uLnByZXYsIFtrZXldOiB1bmRlZmluZWQgfSkpO1xuICAgICAgICBzZXRCdWxrUmVzdWx0cygocHJldikgPT4gKHsgLi4ucHJldiwgW2tleV06IHVuZGVmaW5lZCB9KSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgY3VycmVudFdpbmRvdzogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCF0YWI/LmlkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFjdGl2ZSB0YWJcIik7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0geyB0eXBlOiBidWxrU2NyYXBlTWVzc2FnZShrZXksIG1vZGUpLCBwYXlsb2FkOiB7fSB9O1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlPy5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBzZXRCdWxrUmVzdWx0cygocHJldikgPT4gKHsgLi4ucHJldiwgW2tleV06IHJlc3BvbnNlLmRhdGEgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0QnVsa0Vycm9ycygocHJldikgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgICAgICAgICAgW2tleV06IG1lc3NhZ2VGb3JFcnJvcihuZXcgRXJyb3IocmVzcG9uc2U/LmVycm9yIHx8IFwiQnVsayBzY3JhcGUgZmFpbGVkXCIpKSxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgc2V0QnVsa0Vycm9ycygocHJldikgPT4gKHsgLi4ucHJldiwgW2tleV06IG1lc3NhZ2VGb3JFcnJvcihlcnIpIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldEJ1bGtJbkZsaWdodCgocHJldikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB7IC4uLnByZXYgfTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV4dFtrZXldO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlV3dCdWxrU2NyYXBlKG1vZGUpIHtcbiAgICAgICAgc2V0V3dCdWxrSW5GbGlnaHQobW9kZSk7XG4gICAgICAgIHNldFd3QnVsa0Vycm9yKG51bGwpO1xuICAgICAgICBzZXRXd0J1bGtSZXN1bHQobnVsbCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHtcbiAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgY3VycmVudFdpbmRvdzogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCF0YWI/LmlkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFjdGl2ZSB0YWJcIik7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gbW9kZSA9PT0gXCJ2aXNpYmxlXCJcbiAgICAgICAgICAgICAgICA/IE1lc3NhZ2VzLnd3U2NyYXBlQWxsVmlzaWJsZSgpXG4gICAgICAgICAgICAgICAgOiBNZXNzYWdlcy53d1NjcmFwZUFsbFBhZ2luYXRlZCgpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlPy5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICBzZXRXd0J1bGtSZXN1bHQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRXd0J1bGtFcnJvcihtZXNzYWdlRm9yRXJyb3IobmV3IEVycm9yKHJlc3BvbnNlPy5lcnJvciB8fCBcIkJ1bGsgc2NyYXBlIGZhaWxlZFwiKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNldFd3QnVsa0Vycm9yKG1lc3NhZ2VGb3JFcnJvcihlcnIpKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHNldFd3QnVsa0luRmxpZ2h0KG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUNvbm5lY3QoKSB7XG4gICAgICAgIHNldEVycm9yKG51bGwpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShNZXNzYWdlcy5vcGVuQXV0aCgpKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0RXJyb3IobWVzc2FnZUZvckVycm9yKG5ldyBFcnJvcihyZXNwb25zZS5lcnJvciB8fCBcIkZhaWxlZCB0byBvcGVuXCIpKSk7XG4gICAgICAgICAgICBzZXRWaWV3U3RhdGUoXCJlcnJvclwiKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzZXRFcnJvcihtZXNzYWdlRm9yRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICBzZXRWaWV3U3RhdGUoXCJlcnJvclwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVMb2dvdXQoKSB7XG4gICAgICAgIGlmICghY29uZmlybWluZ0xvZ291dCkge1xuICAgICAgICAgICAgc2V0Q29uZmlybWluZ0xvZ291dCh0cnVlKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0Q29uZmlybWluZ0xvZ291dChmYWxzZSksIDQwMDApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHNlbmRNZXNzYWdlKE1lc3NhZ2VzLmxvZ291dCgpKTtcbiAgICAgICAgc2V0Vmlld1N0YXRlKFwidW5hdXRoZW50aWNhdGVkXCIpO1xuICAgICAgICBzZXRQcm9maWxlKG51bGwpO1xuICAgICAgICBzZXRDb25maXJtaW5nTG9nb3V0KGZhbHNlKTtcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlT3BlbkRhc2hib2FyZCgpIHtcbiAgICAgICAgY29uc3QgYmFzZVVybCA9IGF3YWl0IHJlc29sdmVBcGlCYXNlVXJsKCk7XG4gICAgICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogYCR7YmFzZVVybH0vZGFzaGJvYXJkYCB9KTtcbiAgICAgICAgd2luZG93LmNsb3NlKCk7XG4gICAgfVxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVNob3dQYW5lbCgpIHtcbiAgICAgICAgaWYgKCFhY3RpdmVUYWJJZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UoYWN0aXZlVGFiSWQsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlNIT1dfU0xPVEhJTkdfUEFORUxcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZT8uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGF3YWl0IGNoZWNrUGFnZVN0YXR1cygpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIGF3YWl0IGNocm9tZS50YWJzLnJlbG9hZChhY3RpdmVUYWJJZCk7XG4gICAgICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVSZWZyZXNoVGFiKCkge1xuICAgICAgICBpZiAoIWFjdGl2ZVRhYklkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBhd2FpdCBjaHJvbWUudGFicy5yZWxvYWQoYWN0aXZlVGFiSWQpO1xuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIGNvbmZpZ3VyZWQgU2xvdGhpbmcgQVBJIGJhc2UgVVJMLCBwcmVmZXJyaW5nIHRoZSB2YWx1ZSB3ZVxuICAgICAqIGNhY2hlZCBhdCBmaXJzdCBwYWludCAoYGFwaUJhc2VVcmxgKSBhbmQgZmFsbGluZyBiYWNrIHRvIGEgZnJlc2hcbiAgICAgKiBHRVRfQVVUSF9TVEFUVVMgcm91bmR0cmlwIGlmIHdlIGhhdmVuJ3Qgc2VlbiBvbmUgeWV0LiBVc2VkIGJ5IGFsbCB0aGVcbiAgICAgKiBkZWVwLWxpbmsgaGFuZGxlcnMgKCMzMSkuXG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gcmVzb2x2ZUFwaUJhc2VVcmwoKSB7XG4gICAgICAgIGlmIChhcGlCYXNlVXJsKVxuICAgICAgICAgICAgcmV0dXJuIGFwaUJhc2VVcmw7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZE1lc3NhZ2UoTWVzc2FnZXMuZ2V0QXV0aFN0YXR1cygpKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIHJldHVybiBkYXRhPy5hcGlCYXNlVXJsIHx8IERFRkFVTFRfQVBJX0JBU0VfVVJMO1xuICAgIH1cbiAgICAvKiogT3BlbnMgdGhlIHJldmlldyBxdWV1ZSBmb3IgdGhlIHVzZXIgdG8gdHJpYWdlIHRoZWlyIGJ1bGsgaW1wb3J0cy4gKCMzMSkgKi9cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVWaWV3UmV2aWV3UXVldWUoKSB7XG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBhd2FpdCByZXNvbHZlQXBpQmFzZVVybCgpO1xuICAgICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IG9wcG9ydHVuaXR5UmV2aWV3VXJsKGJhc2VVcmwpIH0pO1xuICAgICAgICB3aW5kb3cuY2xvc2UoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJvZmlsZUluaXRpYWwoKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBwcm9maWxlPy5jb250YWN0Py5uYW1lPy50cmltKCk7XG4gICAgICAgIGlmIChuYW1lKVxuICAgICAgICAgICAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGVtYWlsID0gcHJvZmlsZT8uY29udGFjdD8uZW1haWw7XG4gICAgICAgIHJldHVybiBlbWFpbCA/IGVtYWlsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpIDogXCJTXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN1cHBvcnRlZFRhYkxhYmVsKCkge1xuICAgICAgICBjb25zdCB1cmwgPSBzdXJmYWNlQ29udGV4dD8udGFiLnVybCB8fCBhY3RpdmVUYWJVcmwgfHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoIXVybCB8fCAhaGFzQ29udGVudFNjcmlwdEhvc3QodXJsKSlcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBpZiAoL3dhdGVybG9vd29ya3NcXC51d2F0ZXJsb29cXC5jYS8udGVzdCh1cmwpKVxuICAgICAgICAgICAgcmV0dXJuIFwiV2F0ZXJsb29Xb3Jrc1wiO1xuICAgICAgICBpZiAoL2xpbmtlZGluXFwuY29tLy50ZXN0KHVybCkpXG4gICAgICAgICAgICByZXR1cm4gXCJMaW5rZWRJblwiO1xuICAgICAgICBpZiAoL2luZGVlZFxcLmNvbS8udGVzdCh1cmwpKVxuICAgICAgICAgICAgcmV0dXJuIFwiSW5kZWVkXCI7XG4gICAgICAgIGlmICgvZ3JlZW5ob3VzZVxcLmlvLy50ZXN0KHVybCkpXG4gICAgICAgICAgICByZXR1cm4gXCJHcmVlbmhvdXNlXCI7XG4gICAgICAgIGlmICgvbGV2ZXJcXC5jby8udGVzdCh1cmwpKVxuICAgICAgICAgICAgcmV0dXJuIFwiTGV2ZXJcIjtcbiAgICAgICAgaWYgKC93b3JrZGF5am9ic1xcLmNvbS8udGVzdCh1cmwpKVxuICAgICAgICAgICAgcmV0dXJuIFwiV29ya2RheVwiO1xuICAgICAgICByZXR1cm4gXCJ0aGlzIGpvYiBzaXRlXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNpZ25lZE91dENvbnRleHRDb3B5KCkge1xuICAgICAgICBjb25zdCBzaXRlID0gc3VwcG9ydGVkVGFiTGFiZWwoKTtcbiAgICAgICAgaWYgKHd3U3RhdGU/LmtpbmQgPT09IFwibGlzdFwiKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIldhdGVybG9vV29ya3Mgam9icyBmb3VuZFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IGBDb25uZWN0IFNsb3RoaW5nIHRvIGltcG9ydCBhbmQgdHJhY2sgdGhlc2UgJHt3d1N0YXRlLnJvd0NvdW50fSBwb3N0aW5ncy5gLFxuICAgICAgICAgICAgICAgIHNpdGU6IFwiV2F0ZXJsb29Xb3Jrc1wiLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFnZVN0YXR1cz8uc2NyYXBlZEpvYikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJKb2IgZGV0ZWN0ZWRcIixcbiAgICAgICAgICAgICAgICBib2R5OiBcIkNvbm5lY3QgU2xvdGhpbmcgdG8gdGFpbG9yLCBzYXZlLCBhbmQgYXV0b2ZpbGwgZnJvbSB0aGlzIHBvc3RpbmcuXCIsXG4gICAgICAgICAgICAgICAgc2l0ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhZ2VTdGF0dXM/Lmhhc0Zvcm0pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiQXBwbGljYXRpb24gcGFnZSBkZXRlY3RlZFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IFwiQ29ubmVjdCBTbG90aGluZyB0byBhdXRvZmlsbCB0aGlzIGFwcGxpY2F0aW9uIGZyb20geW91ciBwcm9maWxlLlwiLFxuICAgICAgICAgICAgICAgIHNpdGUsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBgJHtzaXRlfSBpcyBzdXBwb3J0ZWRgLFxuICAgICAgICAgICAgICAgIGJvZHk6IFwiQ29ubmVjdCBTbG90aGluZyB0byBzY2FuIGpvYnMsIGltcG9ydCBwb3N0aW5ncywgYW5kIG9wZW4gam9iIHRvb2xzIGhlcmUuXCIsXG4gICAgICAgICAgICAgICAgc2l0ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmICh2aWV3U3RhdGUgPT09IFwibG9hZGluZ1wiKSB7XG4gICAgICAgIHJldHVybiAoX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwb3B1cFwiLCBjaGlsZHJlbjogX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic3RhdGUtY2VudGVyXCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJzcGlubmVyXCIgfSksIF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcInN0YXRlLXRleHRcIiwgY2hpbGRyZW46IFwiQ29ubmVjdGluZ1xcdTIwMjZcIiB9KV0gfSkgfSkpO1xuICAgIH1cbiAgICBpZiAodmlld1N0YXRlID09PSBcImVycm9yXCIpIHtcbiAgICAgICAgcmV0dXJuIChfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInBvcHVwXCIsIGNoaWxkcmVuOiBfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJzdGF0ZS1jZW50ZXJcIiwgY2hpbGRyZW46IFtfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInN0YXRlLWljb24gZXJyb3JcIiwgXCJhcmlhLWhpZGRlblwiOiB0cnVlLCBjaGlsZHJlbjogXCIhXCIgfSksIF9qc3goXCJoMlwiLCB7IGNsYXNzTmFtZTogXCJzdGF0ZS10aXRsZVwiLCBjaGlsZHJlbjogXCJTb21ldGhpbmcgd2VudCB3cm9uZ1wiIH0pLCBfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJzdGF0ZS10ZXh0XCIsIGNoaWxkcmVuOiBlcnJvciB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeVwiLCBvbkNsaWNrOiAoKSA9PiBjaGVja0F1dGhTdGF0dXMoKSwgY2hpbGRyZW46IFwiVHJ5IGFnYWluXCIgfSldIH0pIH0pKTtcbiAgICB9XG4gICAgaWYgKHZpZXdTdGF0ZSA9PT0gXCJ1bmF1dGhlbnRpY2F0ZWRcIikge1xuICAgICAgICBjb25zdCBjb250ZXh0Q29weSA9IHNpZ25lZE91dENvbnRleHRDb3B5KCk7XG4gICAgICAgIHJldHVybiAoX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwb3B1cFwiLCBjaGlsZHJlbjogX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IGBoZXJvICR7Y29udGV4dENvcHkgPyBcImNvbnRleHR1YWxcIiA6IFwiXCJ9YCwgY2hpbGRyZW46IFtfanN4KFwiaW1nXCIsIHsgY2xhc3NOYW1lOiBcImhlcm8tbWFya1wiLCBzcmM6IGNocm9tZS5ydW50aW1lLmdldFVSTChcImJyYW5kL3Nsb3RoaW5nLW1hcmsucG5nXCIpLCBhbHQ6IFwiXCIgfSksIGNvbnRleHRDb3B5Py5zaXRlICYmIChfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLWtpY2tlclwiLCBjaGlsZHJlbjogY29udGV4dENvcHkuc2l0ZSB9KSksIF9qc3goXCJoMVwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLXRpdGxlXCIsIGNoaWxkcmVuOiBjb250ZXh0Q29weT8udGl0bGUgfHwgXCJTbG90aGluZ1wiIH0pLCBfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLXN1YlwiLCBjaGlsZHJlbjogY29udGV4dENvcHk/LmJvZHkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkF1dG8tZmlsbCBhcHBsaWNhdGlvbnMuIEltcG9ydCBqb2JzLiBUcmFjayBldmVyeXRoaW5nLlwiIH0pLCBfanN4KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBwcmltYXJ5IGJsb2NrXCIsIG9uQ2xpY2s6IGhhbmRsZUNvbm5lY3QsIGNoaWxkcmVuOiBjb250ZXh0Q29weSA/IFwiQ29ubmVjdCB0byB1c2Ugam9iIHRvb2xzXCIgOiBcIkNvbm5lY3QgYWNjb3VudFwiIH0pLCBfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJoZXJvLWZvb3RcIiwgY2hpbGRyZW46IFwiWW91J2xsIHNpZ24gaW4gb25jZSBcXHUyMDE0IFNsb3RoaW5nIHJlbWVtYmVycy5cIiB9KV0gfSkgfSkpO1xuICAgIH1cbiAgICBpZiAodmlld1N0YXRlID09PSBcInNlc3Npb24tbG9zdFwiKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHRDb3B5ID0gc2lnbmVkT3V0Q29udGV4dENvcHkoKTtcbiAgICAgICAgcmV0dXJuIChfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInBvcHVwXCIsIGNoaWxkcmVuOiBfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogYGhlcm8gc2Vzc2lvbi1sb3N0ICR7Y29udGV4dENvcHkgPyBcImNvbnRleHR1YWxcIiA6IFwiXCJ9YCwgY2hpbGRyZW46IFtfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImhlcm8tbWFyayB3YXJuXCIsIFwiYXJpYS1oaWRkZW5cIjogdHJ1ZSwgY2hpbGRyZW46IFwiIVwiIH0pLCBjb250ZXh0Q29weT8uc2l0ZSAmJiAoX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiaGVyby1raWNrZXJcIiwgY2hpbGRyZW46IGNvbnRleHRDb3B5LnNpdGUgfSkpLCBfanN4KFwiaDFcIiwgeyBjbGFzc05hbWU6IFwiaGVyby10aXRsZVwiLCBjaGlsZHJlbjogXCJTZXNzaW9uIGxvc3RcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaGVyby1zdWJcIiwgY2hpbGRyZW46IGNvbnRleHRDb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIlJlY29ubmVjdCB0byB1c2UgU2xvdGhpbmcgam9iIHRvb2xzIG9uIHRoaXMgcGFnZS5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJTbG90aGluZyBnb3QgcmVzZXQgYnkgeW91ciBicm93c2VyLiBSZWNvbm5lY3QgdG8gcGljayB1cCB3aGVyZSB5b3UgbGVmdCBvZmYg4oCUIHlvdXIgcHJvZmlsZSBhbmQgZGF0YSBhcmUgc2FmZS5cIiB9KSwgX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBibG9ja1wiLCBvbkNsaWNrOiBoYW5kbGVDb25uZWN0LCBjaGlsZHJlbjogXCJSZWNvbm5lY3RcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaGVyby1mb290XCIsIGNoaWxkcmVuOiBcIlRha2VzIGFib3V0IGZpdmUgc2Vjb25kcy5cIiB9KV0gfSkgfSkpO1xuICAgIH1cbiAgICBjb25zdCBkZXRlY3RlZEpvYiA9IHBhZ2VTdGF0dXM/LnNjcmFwZWRKb2I7XG4gICAgY29uc3Qgd29ya3NwYWNlVmlzaWJsZSA9ICEhc3VyZmFjZUNvbnRleHQ/LndvcmtzcGFjZS52aXNpYmxlO1xuICAgIGNvbnN0IHNob3dXd0J1bGsgPSB3d1N0YXRlICYmIHd3U3RhdGUua2luZCA9PT0gXCJsaXN0XCI7XG4gICAgY29uc3QgZGV0ZWN0ZWRCdWxrU291cmNlcyA9IE9iamVjdC5rZXlzKEJVTEtfU09VUkNFX0xBQkVMUykuZmlsdGVyKChrZXkpID0+IGJ1bGtTdGF0ZXNba2V5XT8uZGV0ZWN0ZWQpO1xuICAgIGNvbnN0IG5vdGhpbmdEZXRlY3RlZCA9ICFwYWdlU3RhdHVzPy5oYXNGb3JtICYmXG4gICAgICAgICFkZXRlY3RlZEpvYiAmJlxuICAgICAgICAhc2hvd1d3QnVsayAmJlxuICAgICAgICBkZXRlY3RlZEJ1bGtTb3VyY2VzLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICBwYWdlUHJvYmVTdGF0ZSAhPT0gXCJuZWVkcy1yZWZyZXNoXCI7XG4gICAgY29uc3QgaGFzUGFnZVN0YXR1cyA9ICEhZGV0ZWN0ZWRKb2IgfHwgISFwYWdlU3RhdHVzPy5oYXNGb3JtIHx8IHBhZ2VQcm9iZVN0YXRlID09PSBcInJlYWR5XCI7XG4gICAgY29uc3QgY3VycmVudFRhYlRpdGxlID0gd29ya3NwYWNlVmlzaWJsZVxuICAgICAgICA/IFwiSm9iIHdvcmtzcGFjZSBhY3RpdmVcIlxuICAgICAgICA6IGRldGVjdGVkSm9iXG4gICAgICAgICAgICA/IFwiSm9iIGRldGVjdGVkXCJcbiAgICAgICAgICAgIDogcGFnZVN0YXR1cz8uaGFzRm9ybVxuICAgICAgICAgICAgICAgID8gXCJBcHBsaWNhdGlvbiBkZXRlY3RlZFwiXG4gICAgICAgICAgICAgICAgOiBwYWdlUHJvYmVTdGF0ZSA9PT0gXCJyZWFkeVwiXG4gICAgICAgICAgICAgICAgICAgID8gXCJObyBqb2IgZGV0ZWN0ZWRcIlxuICAgICAgICAgICAgICAgICAgICA6IFwiVW5zdXBwb3J0ZWQgcGFnZVwiO1xuICAgIHJldHVybiAoX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicG9wdXBcIiwgY2hpbGRyZW46IFtfanN4cyhcImhlYWRlclwiLCB7IGNsYXNzTmFtZTogXCJ0b3BiYXJcIiwgY2hpbGRyZW46IFtfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJicmFuZFwiLCBjaGlsZHJlbjogW19qc3goXCJpbWdcIiwgeyBjbGFzc05hbWU6IFwiYnJhbmQtbWFya1wiLCBzcmM6IGNocm9tZS5ydW50aW1lLmdldFVSTChcImJyYW5kL3Nsb3RoaW5nLW1hcmsucG5nXCIpLCBhbHQ6IFwiXCIgfSksIF9qc3goXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcImJyYW5kLW5hbWVcIiwgY2hpbGRyZW46IFwiU2xvdGhpbmdcIiB9KV0gfSksIF9qc3hzKFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJwaWxsIG9rXCIsIHRpdGxlOiBcIkV4dGVuc2lvbiBjb25uZWN0ZWRcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJwaWxsLWRvdFwiIH0pLCBcIkNvbm5lY3RlZFwiXSB9KV0gfSksIF9qc3hzKFwic2VjdGlvblwiLCB7IGNsYXNzTmFtZTogXCJwcm9maWxlLWNhcmRcIiwgY2hpbGRyZW46IFtfanN4KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImF2YXRhclwiLCBjaGlsZHJlbjogcHJvZmlsZUluaXRpYWwoKSB9KSwgX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvZmlsZS1tZXRhXCIsIGNoaWxkcmVuOiBbX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9maWxlLW5hbWVcIiwgY2hpbGRyZW46IHByb2ZpbGU/LmNvbnRhY3Q/Lm5hbWUgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGU/LmNvbnRhY3Q/LmVtYWlsIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlNldCB1cCB5b3VyIHByb2ZpbGVcIiB9KSwgX2pzeChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9maWxlLXN1YlwiLCBjaGlsZHJlbjogcHJvZmlsZT8uY29tcHV0ZWQ/LmN1cnJlbnRUaXRsZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZT8uY29tcHV0ZWQ/LmN1cnJlbnRDb21wYW55XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGAke3Byb2ZpbGUuY29tcHV0ZWQuY3VycmVudFRpdGxlfSDCtyAke3Byb2ZpbGUuY29tcHV0ZWQuY3VycmVudENvbXBhbnl9YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBwcm9maWxlPy5jb250YWN0Py5lbWFpbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQWRkIHlvdXIgd29yayBoaXN0b3J5IHNvIFNsb3RoaW5nIGNhbiB0YWlsb3JcIiB9KV0gfSksIHByb2ZpbGVTY29yZSAhPT0gbnVsbCA/IChfanN4cyhcImRpdlwiLCB7IGNsYXNzTmFtZTogYHNjb3JlICR7cHJvZmlsZVNjb3JlID49IDgwID8gXCJoaWdoXCIgOiBwcm9maWxlU2NvcmUgPj0gNTAgPyBcIm1pZFwiIDogXCJsb3dcIn1gLCB0aXRsZTogXCJQcm9maWxlIGNvbXBsZXRlbmVzc1wiLCBjaGlsZHJlbjogW19qc3goXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInNjb3JlLW51bVwiLCBjaGlsZHJlbjogcHJvZmlsZVNjb3JlIH0pLCBfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzY29yZS11bml0XCIsIGNoaWxkcmVuOiBcIi8xMDBcIiB9KV0gfSkpIDogKF9qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGdob3N0IHRpZ2h0XCIsIG9uQ2xpY2s6IGhhbmRsZU9wZW5EYXNoYm9hcmQsIGNoaWxkcmVuOiBcIk9wZW5cIiB9KSldIH0pLCBfanN4cyhcIm1haW5cIiwgeyBjbGFzc05hbWU6IFwiY29udGVudFwiLCBjaGlsZHJlbjogW3BhZ2VQcm9iZVN0YXRlID09PSBcIm5lZWRzLXJlZnJlc2hcIiAmJiAoX2pzeHMoXCJhcnRpY2xlXCIsIHsgY2xhc3NOYW1lOiBcInN0YXR1cy1jYXJkXCIsIGNoaWxkcmVuOiBbX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic3RhdHVzLWNvcHlcIiwgY2hpbGRyZW46IFtfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzdGF0dXMtZXllYnJvd1wiLCBjaGlsZHJlbjogXCJDdXJyZW50IHRhYlwiIH0pLCBfanN4KFwic3BhblwiLCB7IGNsYXNzTmFtZTogXCJzdGF0dXMtdGl0bGVcIiwgY2hpbGRyZW46IFwiUGFnZSBuZWVkcyByZWZyZXNoXCIgfSldIH0pLCBfanN4KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBibG9ja1wiLCBvbkNsaWNrOiBoYW5kbGVSZWZyZXNoVGFiLCBjaGlsZHJlbjogXCJSZWZyZXNoIHRhYlwiIH0pXSB9KSksIGhhc1BhZ2VTdGF0dXMgJiYgKF9qc3hzKFwiYXJ0aWNsZVwiLCB7IGNsYXNzTmFtZTogXCJzdGF0dXMtY2FyZCBhY3RpdmVcIiwgY2hpbGRyZW46IFtfanN4cyhcImhlYWRlclwiLCB7IGNsYXNzTmFtZTogXCJzdGF0dXMtaGVhZFwiLCBjaGlsZHJlbjogW19qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInN0YXR1cy1jb3B5XCIsIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwic3RhdHVzLWV5ZWJyb3dcIiwgY2hpbGRyZW46IFwiQ3VycmVudCB0YWJcIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwic3RhdHVzLXRpdGxlXCIsIGNoaWxkcmVuOiBjdXJyZW50VGFiVGl0bGUgfSldIH0pLCBwYWdlU3RhdHVzPy5oYXNGb3JtICYmIChfanN4cyhcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiYmFkZ2VcIiwgY2hpbGRyZW46IFtwYWdlU3RhdHVzLmRldGVjdGVkRmllbGRzLCBcIiBmaWVsZHNcIl0gfSkpXSB9KSwgZGV0ZWN0ZWRKb2IgPyAoX2pzeHMoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicGFnZS1zdW1tYXJ5XCIsIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiY2xpcFwiLCB0aXRsZTogZGV0ZWN0ZWRKb2IudGl0bGUsIGNoaWxkcmVuOiBkZXRlY3RlZEpvYi50aXRsZSB9KSwgX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwiY2FyZC1zdWIgY2xpcFwiLCBjaGlsZHJlbjogZGV0ZWN0ZWRKb2IuY29tcGFueSB9KV0gfSkpIDogKF9qc3goXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlubGluZS1ub3RlXCIsIGNoaWxkcmVuOiBwYWdlU3RhdHVzPy5oYXNGb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiUmVhZHkgb24gdGhpcyBhcHBsaWNhdGlvbiBwYWdlLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiT3BlbiBhIGpvYiBwb3N0aW5nLCB0aGVuIHNjYW4gYWdhaW4uXCIgfSkpLCBkZXRlY3RlZEpvYiAmJiAoX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gcHJpbWFyeSBibG9ja1wiLCBvbkNsaWNrOiBoYW5kbGVTaG93UGFuZWwsIGNoaWxkcmVuOiBcIk9wZW4gam9iIHRvb2xzXCIgfSkpLCAhZGV0ZWN0ZWRKb2IgJiYgcGFnZVByb2JlU3RhdGUgPT09IFwicmVhZHlcIiAmJiAoX2pzeChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJidG4gYmxvY2tcIiwgb25DbGljazogY2hlY2tQYWdlU3RhdHVzLCBjaGlsZHJlbjogXCJTY2FuIGFnYWluXCIgfSkpXSB9KSksIHNob3dXd0J1bGsgJiYgd3dTdGF0ZSAmJiAoX2pzeChCdWxrU291cmNlQ2FyZCwgeyBzb3VyY2VMYWJlbDogXCJXYXRlcmxvb1dvcmtzXCIsIGRldGVjdGVkQ291bnQ6IHd3U3RhdGUucm93Q291bnQsIGJ1c3k6IHd3QnVsa0luRmxpZ2h0LCBsYXN0UmVzdWx0OiB3d0J1bGtSZXN1bHQsIGxhc3RFcnJvcjogd3dCdWxrRXJyb3IsIG9uU2NyYXBlVmlzaWJsZTogKCkgPT4gaGFuZGxlV3dCdWxrU2NyYXBlKFwidmlzaWJsZVwiKSwgb25TY3JhcGVQYWdpbmF0ZWQ6ICgpID0+IGhhbmRsZVd3QnVsa1NjcmFwZShcInBhZ2luYXRlZFwiKSwgb25WaWV3VHJhY2tlcjogaGFuZGxlVmlld1Jldmlld1F1ZXVlIH0pKSwgZGV0ZWN0ZWRCdWxrU291cmNlcy5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBidWxrU3RhdGVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChfanN4KEJ1bGtTb3VyY2VDYXJkLCB7IHNvdXJjZUxhYmVsOiBCVUxLX1NPVVJDRV9MQUJFTFNba2V5XSwgZGV0ZWN0ZWRDb3VudDogc3RhdGUucm93Q291bnQsIGJ1c3k6IGJ1bGtJbkZsaWdodFtrZXldID8/IG51bGwsIGxhc3RSZXN1bHQ6IGJ1bGtSZXN1bHRzW2tleV0gPz8gbnVsbCwgbGFzdEVycm9yOiBidWxrRXJyb3JzW2tleV0gPz8gbnVsbCwgb25TY3JhcGVWaXNpYmxlOiAoKSA9PiBoYW5kbGVCdWxrU291cmNlU2NyYXBlKGtleSwgXCJ2aXNpYmxlXCIpLCBvblNjcmFwZVBhZ2luYXRlZDogKCkgPT4gaGFuZGxlQnVsa1NvdXJjZVNjcmFwZShrZXksIFwicGFnaW5hdGVkXCIpLCBvblZpZXdUcmFja2VyOiBoYW5kbGVWaWV3UmV2aWV3UXVldWUgfSwga2V5KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pLCBub3RoaW5nRGV0ZWN0ZWQgJiYgIWhhc1BhZ2VTdGF0dXMgJiYgKF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImlkbGVcIiwgY2hpbGRyZW46IFtfanN4KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpZGxlLXRpdGxlXCIsIGNoaWxkcmVuOiBcIlVuc3VwcG9ydGVkIHBhZ2VcIiB9KSwgX2pzeChcInBcIiwgeyBjbGFzc05hbWU6IFwiaWRsZS1zdWJcIiwgY2hpbGRyZW46IFwiT3BlbiBhIHN1cHBvcnRlZCBqb2IgcG9zdGluZyBvciBhcHBsaWNhdGlvbiBwYWdlLlwiIH0pXSB9KSksIF9qc3hzKFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInF1aWNrLXJvd1wiLCBjaGlsZHJlbjogW19qc3hzKFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcInF1aWNrXCIsIG9uQ2xpY2s6IGhhbmRsZU9wZW5EYXNoYm9hcmQsIGNoaWxkcmVuOiBbX2pzeChcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwicXVpY2staWNvblwiLCBcImFyaWEtaGlkZGVuXCI6IHRydWUsIGNoaWxkcmVuOiBcIlxcdTIxOTdcIiB9KSwgX2pzeChcInNwYW5cIiwgeyBjaGlsZHJlbjogXCJEYXNoYm9hcmRcIiB9KV0gfSksIF9qc3hzKFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcInF1aWNrXCIsIG9uQ2xpY2s6ICgpID0+IGNocm9tZS5ydW50aW1lLm9wZW5PcHRpb25zUGFnZSgpLCBjaGlsZHJlbjogW19qc3goXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiBcInF1aWNrLWljb25cIiwgXCJhcmlhLWhpZGRlblwiOiB0cnVlLCBjaGlsZHJlbjogXCJcXHUyNjk5XCIgfSksIF9qc3goXCJzcGFuXCIsIHsgY2hpbGRyZW46IFwiU2V0dGluZ3NcIiB9KV0gfSldIH0pXSB9KSwgX2pzeHMoXCJmb290ZXJcIiwgeyBjbGFzc05hbWU6IFwiZm9vdGJhclwiLCBjaGlsZHJlbjogW19qc3goXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IGBsaW5rICR7Y29uZmlybWluZ0xvZ291dCA/IFwid2FyblwiIDogXCJcIn1gLCBvbkNsaWNrOiBoYW5kbGVMb2dvdXQsIGNoaWxkcmVuOiBjb25maXJtaW5nTG9nb3V0ID8gXCJDbGljayBhZ2FpbiB0byBkaXNjb25uZWN0XCIgOiBcIkRpc2Nvbm5lY3RcIiB9KSwgcHJvZmlsZT8udXBkYXRlZEF0ICYmIChfanN4cyhcInNwYW5cIiwgeyBjbGFzc05hbWU6IFwidXBkYXRlZFwiLCBjaGlsZHJlbjogW1wiU3luY2VkIFwiLCBmb3JtYXRSZWxhdGl2ZShwcm9maWxlLnVwZGF0ZWRBdCldIH0pKV0gfSldIH0pKTtcbn1cbiIsImltcG9ydCB7IGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBjcmVhdGVSb290IH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcbmltcG9ydCBBcHAgZnJvbSBcIi4vQXBwXCI7XG5pbXBvcnQgXCIuL3N0eWxlcy5jc3NcIjtcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKTtcbmlmIChjb250YWluZXIpIHtcbiAgICBjb25zdCByb290ID0gY3JlYXRlUm9vdChjb250YWluZXIpO1xuICAgIHJvb3QucmVuZGVyKF9qc3goUmVhY3QuU3RyaWN0TW9kZSwgeyBjaGlsZHJlbjogX2pzeChBcHAsIHt9KSB9KSk7XG59XG4iLCIvKipcbiAqIFVzZXItZmFjaW5nIGVycm9yIHN0cmluZyBtYXBwaW5nIGZvciB0aGUgU2xvdGhpbmcgZXh0ZW5zaW9uLlxuICpcbiAqIFRoZSBwb3B1cCAoYW5kIGFueSBvdGhlciBleHRlbnNpb24gc3VyZmFjZSkgc2hvdWxkIG5ldmVyIHNob3cgcmF3XG4gKiBgXCJSZXF1ZXN0IGZhaWxlZDogNTAzXCJgIC8gYFwiQXV0aGVudGljYXRpb24gZXhwaXJlZFwiYCBzdHJpbmdzLiBXcmFwIGFueVxuICogZXJyb3IgcGF0aCBpbiBgbWVzc2FnZUZvckVycm9yKGVycilgIHRvIGdldCBhbiBFbmdsaXNoIHNlbnRlbmNlIHNhZmVcbiAqIGZvciBlbmQtdXNlcnMuXG4gKlxuICogTWlycm9yIG9mIHRoZSBtZXNzYWdlIHRvbmUgdXNlZCBieSBgYXBwcy93ZWIvLi4uL2V4dGVuc2lvbi9jb25uZWN0L3BhZ2UudHN4YFxuICogYG1lc3NhZ2VGb3JTdGF0dXNgIOKAlCB0aGUgY29ubmVjdCBwYWdlIGtlZXBzIGl0cyBvd24gY29weSBiZWNhdXNlIGl0IHNpdHNcbiAqIGluc2lkZSB0aGUgbmV4dC1pbnRsIHRyZWUgKGRpZmZlcmVudCBwYWNrYWdlIGJvdW5kYXJ5KSwgYnV0IHRoZVxuICogdXNlci12aXNpYmxlIHN0cmluZ3Mgc2hvdWxkIHN0YXkgYWxpZ25lZC4gSWYgeW91IGNoYW5nZSBvbmUsIGNoYW5nZSBib3RoLlxuICpcbiAqIEVuZ2xpc2gtb25seSBieSBkZXNpZ246IHRoZSBleHRlbnNpb24gaXRzZWxmIGRvZXMgbm90IHVzZSBuZXh0LWludGwuXG4gKi9cbi8qKlxuICogTWFwcyBhbiBIVFRQIHN0YXR1cyBjb2RlIHRvIGEgaHVtYW4tZnJpZW5kbHkgbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2VGb3JTdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKHN0YXR1cyA9PT0gNDAxIHx8IHN0YXR1cyA9PT0gNDAzKSB7XG4gICAgICAgIHJldHVybiBcIlNpZ24gaW4gZXhwaXJlZC4gUmVjb25uZWN0IHRoZSBleHRlbnNpb24uXCI7XG4gICAgfVxuICAgIGlmIChzdGF0dXMgPT09IDQyOSkge1xuICAgICAgICByZXR1cm4gXCJXZSdyZSByYXRlLWxpbWl0ZWQuIFRyeSBhZ2FpbiBpbiBhIG1pbnV0ZS5cIjtcbiAgICB9XG4gICAgaWYgKHN0YXR1cyA+PSA1MDApIHtcbiAgICAgICAgcmV0dXJuIFwiU2xvdGhpbmcgc2VydmVycyBhcmUgaGF2aW5nIGEgcHJvYmxlbS5cIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuIFBsZWFzZSB0cnkgYWdhaW4uXCI7XG59XG4vKipcbiAqIEJlc3QtZWZmb3J0IG1hcHBpbmcgb2YgYW4gdW5rbm93biB0aHJvd24gdmFsdWUgdG8gYSBodW1hbi1mcmllbmRseVxuICogbWVzc2FnZS4gUmVjb2duaXNlcyB0aGUgc3BlY2lmaWMgcGhyYXNlcyB0aGUgYXBpLWNsaWVudCB0aHJvd3MgdG9kYXlcbiAqIChgXCJBdXRoZW50aWNhdGlvbiBleHBpcmVkXCJgLCBgXCJOb3QgYXV0aGVudGljYXRlZFwiYCwgYFwiUmVxdWVzdCBmYWlsZWQ6IDxjb2RlPlwiYCxcbiAqIGBcIkZhaWxlZCB0byBmZXRjaFwiYCkgYW5kIGZhbGxzIGJhY2sgdG8gdGhlIG9yaWdpbmFsIG1lc3NhZ2UgZm9yIGFueXRoaW5nXG4gKiBlbHNlIOKAlCB0aGF0J3MgYWxtb3N0IGFsd2F5cyBtb3JlIHVzZWZ1bCB0aGFuIGEgZ2VuZXJpYyBjYXRjaC1hbGwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlRm9yRXJyb3IoZXJyKSB7XG4gICAgLy8gR2VuZXJpYyBuZXR3b3JrIGZhaWx1cmUgKGZldGNoIGluIHNlcnZpY2Ugd29ya2VycyB0aHJvd3MgVHlwZUVycm9yIGhlcmUpXG4gICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICByZXR1cm4gXCJOZXR3b3JrIGVycm9yLiBDaGVjayB5b3VyIGNvbm5lY3Rpb24gYW5kIHRyeSBhZ2Fpbi5cIjtcbiAgICB9XG4gICAgY29uc3QgcmF3ID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IFwiXCI7XG4gICAgaWYgKCFyYXcpXG4gICAgICAgIHJldHVybiBcIlNvbWV0aGluZyB3ZW50IHdyb25nLiBQbGVhc2UgdHJ5IGFnYWluLlwiO1xuICAgIC8vIEF1dGgtc2hhcGVkIG1lc3NhZ2VzIGZyb20gU2xvdGhpbmdBUElDbGllbnQuXG4gICAgaWYgKHJhdyA9PT0gXCJBdXRoZW50aWNhdGlvbiBleHBpcmVkXCIgfHxcbiAgICAgICAgcmF3ID09PSBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfHxcbiAgICAgICAgL3VuYXV0aG9yL2kudGVzdChyYXcpKSB7XG4gICAgICAgIHJldHVybiBtZXNzYWdlRm9yU3RhdHVzKDQwMSk7XG4gICAgfVxuICAgIC8vIGBSZXF1ZXN0IGZhaWxlZDogNTAzYCDigJQgcmVjb3ZlciB0aGUgc3RhdHVzIGNvZGUuXG4gICAgY29uc3QgbWF0Y2ggPSByYXcubWF0Y2goL1JlcXVlc3QgZmFpbGVkOlxccyooXFxkezN9KS8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICBjb25zdCBjb2RlID0gTnVtYmVyKG1hdGNoWzFdKTtcbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShjb2RlKSlcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlRm9yU3RhdHVzKGNvZGUpO1xuICAgIH1cbiAgICAvLyBCcm93c2VyIGZldGNoIGZhaWx1cmVzIGJ1YmJsZSB1cCBhcyBcIkZhaWxlZCB0byBmZXRjaFwiLlxuICAgIGlmICgvZmFpbGVkIHRvIGZldGNoL2kudGVzdChyYXcpIHx8IC9uZXR3b3JrL2kudGVzdChyYXcpKSB7XG4gICAgICAgIHJldHVybiBcIk5ldHdvcmsgZXJyb3IuIENoZWNrIHlvdXIgY29ubmVjdGlvbiBhbmQgdHJ5IGFnYWluLlwiO1xuICAgIH1cbiAgICAvLyBGb3IgYW55dGhpbmcgZWxzZSwgdGhlIHVuZGVybHlpbmcgbWVzc2FnZSBpcyB1c3VhbGx5IGEgc2VudGVuY2UgYWxyZWFkeVxuICAgIC8vIChlLmcuIFwiQ291bGRuJ3QgcmVhZCB0aGUgZnVsbCBqb2IgZGVzY3JpcHRpb24gZnJvbSB0aGlzIHBhZ2UuXCIpLlxuICAgIHJldHVybiByYXc7XG59XG4iLCIvLyBNZXNzYWdlIHBhc3NpbmcgdXRpbGl0aWVzIGZvciBleHRlbnNpb24gY29tbXVuaWNhdGlvblxuLy8gVHlwZS1zYWZlIG1lc3NhZ2UgY3JlYXRvcnNcbmV4cG9ydCBjb25zdCBNZXNzYWdlcyA9IHtcbiAgICAvLyBBdXRoIG1lc3NhZ2VzXG4gICAgZ2V0QXV0aFN0YXR1czogKCkgPT4gKHsgdHlwZTogXCJHRVRfQVVUSF9TVEFUVVNcIiB9KSxcbiAgICBnZXRTdXJmYWNlQ29udGV4dDogKCkgPT4gKHsgdHlwZTogXCJHRVRfU1VSRkFDRV9DT05URVhUXCIgfSksXG4gICAgb3BlbkF1dGg6ICgpID0+ICh7IHR5cGU6IFwiT1BFTl9BVVRIXCIgfSksXG4gICAgbG9nb3V0OiAoKSA9PiAoeyB0eXBlOiBcIkxPR09VVFwiIH0pLFxuICAgIC8vIFByb2ZpbGUgbWVzc2FnZXNcbiAgICBnZXRQcm9maWxlOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9QUk9GSUxFXCIgfSksXG4gICAgZ2V0U2V0dGluZ3M6ICgpID0+ICh7IHR5cGU6IFwiR0VUX1NFVFRJTkdTXCIgfSksXG4gICAgLy8gRm9ybSBmaWxsaW5nIG1lc3NhZ2VzXG4gICAgZmlsbEZvcm06IChmaWVsZHMpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiRklMTF9GT1JNXCIsXG4gICAgICAgIHBheWxvYWQ6IGZpZWxkcyxcbiAgICB9KSxcbiAgICAvLyBTY3JhcGluZyBtZXNzYWdlc1xuICAgIHNjcmFwZUpvYjogKCkgPT4gKHsgdHlwZTogXCJTQ1JBUEVfSk9CXCIgfSksXG4gICAgc2NyYXBlSm9iTGlzdDogKCkgPT4gKHsgdHlwZTogXCJTQ1JBUEVfSk9CX0xJU1RcIiB9KSxcbiAgICBpbXBvcnRKb2I6IChqb2IpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiSU1QT1JUX0pPQlwiLFxuICAgICAgICBwYXlsb2FkOiBqb2IsXG4gICAgfSksXG4gICAgaW1wb3J0Sm9ic0JhdGNoOiAoam9icykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJJTVBPUlRfSk9CU19CQVRDSFwiLFxuICAgICAgICBwYXlsb2FkOiBqb2JzLFxuICAgIH0pLFxuICAgIHRyYWNrQXBwbGllZDogKHBheWxvYWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiVFJBQ0tfQVBQTElFRFwiLFxuICAgICAgICBwYXlsb2FkLFxuICAgIH0pLFxuICAgIG9wZW5EYXNoYm9hcmQ6ICgpID0+ICh7IHR5cGU6IFwiT1BFTl9EQVNIQk9BUkRcIiB9KSxcbiAgICBjYXB0dXJlVmlzaWJsZVRhYjogKCkgPT4gKHsgdHlwZTogXCJDQVBUVVJFX1ZJU0lCTEVfVEFCXCIgfSksXG4gICAgdGFpbG9yRnJvbVBhZ2U6IChqb2IsIGJhc2VSZXN1bWVJZCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJUQUlMT1JfRlJPTV9QQUdFXCIsXG4gICAgICAgIHBheWxvYWQ6IHsgam9iLCBiYXNlUmVzdW1lSWQgfSxcbiAgICB9KSxcbiAgICBnZW5lcmF0ZUNvdmVyTGV0dGVyRnJvbVBhZ2U6IChqb2IpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiR0VORVJBVEVfQ09WRVJfTEVUVEVSX0ZST01fUEFHRVwiLFxuICAgICAgICBwYXlsb2FkOiBqb2IsXG4gICAgfSksXG4gICAgLyoqICMzNCDigJQgZmV0Y2ggdGhlIHVzZXIncyByZWNlbnRseS1zYXZlZCB0YWlsb3JlZCByZXN1bWVzIGZvciB0aGUgcGlja2VyLiAqL1xuICAgIGxpc3RSZXN1bWVzOiAoKSA9PiAoeyB0eXBlOiBcIkxJU1RfUkVTVU1FU1wiIH0pLFxuICAgIC8vIExlYXJuaW5nIG1lc3NhZ2VzXG4gICAgc2F2ZUFuc3dlcjogKGRhdGEpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiU0FWRV9BTlNXRVJcIixcbiAgICAgICAgcGF5bG9hZDogZGF0YSxcbiAgICB9KSxcbiAgICBzZWFyY2hBbnN3ZXJzOiAocXVlc3Rpb24pID0+ICh7XG4gICAgICAgIHR5cGU6IFwiU0VBUkNIX0FOU1dFUlNcIixcbiAgICAgICAgcGF5bG9hZDogcXVlc3Rpb24sXG4gICAgfSksXG4gICAgbWF0Y2hBbnN3ZXJCYW5rOiAocGF5bG9hZCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJNQVRDSF9BTlNXRVJfQkFOS1wiLFxuICAgICAgICBwYXlsb2FkLFxuICAgIH0pLFxuICAgIGpvYkRldGVjdGVkOiAobWV0YSkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJKT0JfREVURUNURURcIixcbiAgICAgICAgcGF5bG9hZDogbWV0YSxcbiAgICB9KSxcbiAgICAvLyBXYXRlcmxvb1dvcmtzLXNwZWNpZmljIGJ1bGsgc2NyYXBpbmcgKGRyaXZlbiBmcm9tIHBvcHVwLCBleGVjdXRlZCBpbiBjb250ZW50XG4gICAgLy8gc2NyaXB0IGJ5IHdhdGVybG9vLXdvcmtzLW9yY2hlc3RyYXRvci50cykuXG4gICAgd3dTY3JhcGVBbGxWaXNpYmxlOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIldXX1NDUkFQRV9BTExfVklTSUJMRVwiLFxuICAgIH0pLFxuICAgIHd3U2NyYXBlQWxsUGFnaW5hdGVkOiAob3B0cykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJXV19TQ1JBUEVfQUxMX1BBR0lOQVRFRFwiLFxuICAgICAgICBwYXlsb2FkOiBvcHRzID8/IHt9LFxuICAgIH0pLFxuICAgIHd3R2V0UGFnZVN0YXRlOiAoKSA9PiAoeyB0eXBlOiBcIldXX0dFVF9QQUdFX1NUQVRFXCIgfSksXG4gICAgLy8gUDMvIzM5IOKAlCBCdWxrIHNjcmFwaW5nIGZvciBwdWJsaWMgQVRTIGJvYXJkIGhvc3RzLiBQb3B1cCDihpIgY29udGVudC1zY3JpcHQuXG4gICAgLy8gRWFjaCBwYWlyIG1pcnJvcnMgdGhlIFdXIHNoYXBlIHNvIHRoZSBzYW1lIGBCdWxrU291cmNlQ2FyZGAgVVggY2FuIGRyaXZlXG4gICAgLy8gZXZlcnkgc291cmNlLiBFYWNoIG9yY2hlc3RyYXRvciBjYXBzIGF0IDIwMC9zZXNzaW9uIChvdmVycmlkYWJsZSBiZWxvdykuXG4gICAgYnVsa0dyZWVuaG91c2VHZXRQYWdlU3RhdGU6ICgpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19HUkVFTkhPVVNFX0dFVF9QQUdFX1NUQVRFXCIsXG4gICAgfSksXG4gICAgYnVsa0dyZWVuaG91c2VTY3JhcGVWaXNpYmxlOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkJVTEtfR1JFRU5IT1VTRV9TQ1JBUEVfVklTSUJMRVwiLFxuICAgIH0pLFxuICAgIGJ1bGtHcmVlbmhvdXNlU2NyYXBlUGFnaW5hdGVkOiAob3B0cykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX0dSRUVOSE9VU0VfU0NSQVBFX1BBR0lOQVRFRFwiLFxuICAgICAgICBwYXlsb2FkOiBvcHRzID8/IHt9LFxuICAgIH0pLFxuICAgIGJ1bGtMZXZlckdldFBhZ2VTdGF0ZTogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX0xFVkVSX0dFVF9QQUdFX1NUQVRFXCIsXG4gICAgfSksXG4gICAgYnVsa0xldmVyU2NyYXBlVmlzaWJsZTogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX0xFVkVSX1NDUkFQRV9WSVNJQkxFXCIsXG4gICAgfSksXG4gICAgYnVsa0xldmVyU2NyYXBlUGFnaW5hdGVkOiAob3B0cykgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX0xFVkVSX1NDUkFQRV9QQUdJTkFURURcIixcbiAgICAgICAgcGF5bG9hZDogb3B0cyA/PyB7fSxcbiAgICB9KSxcbiAgICBidWxrV29ya2RheUdldFBhZ2VTdGF0ZTogKCkgPT4gKHtcbiAgICAgICAgdHlwZTogXCJCVUxLX1dPUktEQVlfR0VUX1BBR0VfU1RBVEVcIixcbiAgICB9KSxcbiAgICBidWxrV29ya2RheVNjcmFwZVZpc2libGU6ICgpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQlVMS19XT1JLREFZX1NDUkFQRV9WSVNJQkxFXCIsXG4gICAgfSksXG4gICAgYnVsa1dvcmtkYXlTY3JhcGVQYWdpbmF0ZWQ6IChvcHRzKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkJVTEtfV09SS0RBWV9TQ1JBUEVfUEFHSU5BVEVEXCIsXG4gICAgICAgIHBheWxvYWQ6IG9wdHMgPz8ge30sXG4gICAgfSksXG4gICAgLy8gUDQvIzQwIOKAlCBIZWxwZXIgZm9yIHRoZSBjaGF0LXBvcnQgc3RhcnQgZnJhbWUuIFRoZSBhY3R1YWwgc3RyZWFtIHVzZXMgYVxuICAgIC8vIGxvbmctbGl2ZWQgY2hyb21lLnJ1bnRpbWUuY29ubmVjdCBwb3J0IChDSEFUX1BPUlRfTkFNRSkgcmF0aGVyIHRoYW5cbiAgICAvLyBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSwgYnV0IGV4cG9zaW5nIGEgdHlwZWQgYnVpbGRlciBrZWVwcyBjYWxsc2l0ZXNcbiAgICAvLyBzZWxmLWRvY3VtZW50aW5nLlxuICAgIGNoYXRTdHJlYW1TdGFydDogKHBheWxvYWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiQ0hBVF9TVFJFQU1fU1RBUlRcIixcbiAgICAgICAgcHJvbXB0OiBwYXlsb2FkLnByb21wdCxcbiAgICAgICAgam9iQ29udGV4dDogcGF5bG9hZC5qb2JDb250ZXh0LFxuICAgIH0pLFxuICAgIC8vIENvcnJlY3Rpb25zIGZlZWRiYWNrIGxvb3AgKCMzMykuIEZpcmVkIHdoZW4gYSB1c2VyIGVkaXRzIGFuIGF1dG9maWxsZWRcbiAgICAvLyBmaWVsZCBhbmQgdGhlIGZpbmFsIHZhbHVlIGRpZmZlcnMgZnJvbSB0aGUgb3JpZ2luYWwgc3VnZ2VzdGlvbiDigJQgdGhlXG4gICAgLy8gYmFja2dyb3VuZCBmb3J3YXJkcyBpdCB0byAvYXBpL2V4dGVuc2lvbi9maWVsZC1tYXBwaW5ncy9jb3JyZWN0IHNvXG4gICAgLy8gZnV0dXJlIGF1dG9maWxscyBvbiB0aGUgc2FtZSBkb21haW4gcHJlZmVyIHRoZSBjb3JyZWN0ZWQgdmFsdWUuXG4gICAgc2F2ZUNvcnJlY3Rpb246IChwYXlsb2FkKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlNBVkVfQ09SUkVDVElPTlwiLFxuICAgICAgICBwYXlsb2FkLFxuICAgIH0pLFxuICAgIC8vIFAzIC8gIzM2ICMzNyDigJQgbXVsdGktc3RlcCBmb3JtIHN1cHBvcnQgKFdvcmtkYXksIEdyZWVuaG91c2UpLlxuICAgIC8qKiBCYWNrZ3JvdW5kIOKGkiBjb250ZW50OiBhIHN0ZXAgdHJhbnNpdGlvbiBqdXN0IGZpcmVkIGZvciB0aGlzIHRhYi4gKi9cbiAgICBtdWx0aXN0ZXBTdGVwVHJhbnNpdGlvbjogKHBheWxvYWQpID0+ICh7XG4gICAgICAgIHR5cGU6IFwiTVVMVElTVEVQX1NURVBfVFJBTlNJVElPTlwiLFxuICAgICAgICBwYXlsb2FkLFxuICAgIH0pLFxuICAgIC8qKiBDb250ZW50IOKGkiBiYWNrZ3JvdW5kOiByZXR1cm4gdGhlIGN1cnJlbnQgdGFiIGlkLiAqL1xuICAgIGdldFRhYklkOiAoKSA9PiAoeyB0eXBlOiBcIkdFVF9UQUJfSURcIiB9KSxcbiAgICAvKipcbiAgICAgKiBDb250ZW50IOKGkiBiYWNrZ3JvdW5kOiBlbnN1cmUgdGhlIGB3ZWJOYXZpZ2F0aW9uYCBwZXJtaXNzaW9uIGlzIGdyYW50ZWQuXG4gICAgICogSW4gQ2hyb21lIE1WMyBpdCdzIGRlY2xhcmVkIGF0IGluc3RhbGwgdGltZSBhbmQgdGhlIHJlc3BvbnNlIGlzIGFsd2F5c1xuICAgICAqIGB7IGdyYW50ZWQ6IHRydWUgfWAuIEluIEZpcmVmb3ggTVYyIHRoZSBiYWNrZ3JvdW5kIGNhbGxzXG4gICAgICogYGJyb3dzZXIucGVybWlzc2lvbnMucmVxdWVzdCguLi4pYCBhbmQgcmV0dXJucyB0aGUgdXNlcidzIHZlcmRpY3QuXG4gICAgICovXG4gICAgcmVxdWVzdFdlYk5hdmlnYXRpb25QZXJtaXNzaW9uOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIlJFUVVFU1RfV0VCTkFWSUdBVElPTl9QRVJNSVNTSU9OXCIsXG4gICAgfSksXG4gICAgLyoqIENvbnRlbnQg4oaSIGJhY2tncm91bmQ6IGlzIGB3ZWJOYXZpZ2F0aW9uYCBjdXJyZW50bHkgdXNhYmxlPyAqL1xuICAgIGhhc1dlYk5hdmlnYXRpb25QZXJtaXNzaW9uOiAoKSA9PiAoe1xuICAgICAgICB0eXBlOiBcIkhBU19XRUJOQVZJR0FUSU9OX1BFUk1JU1NJT05cIixcbiAgICB9KSxcbn07XG4vLyBTZW5kIG1lc3NhZ2UgdG8gYmFja2dyb3VuZCBzY3JpcHRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSB8fCB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyByZXNwb25zZSByZWNlaXZlZFwiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIFNlbmQgbWVzc2FnZSB0byBjb250ZW50IHNjcmlwdCBpbiBzcGVjaWZpYyB0YWJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kVG9UYWIodGFiSWQsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UsIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSB8fCB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyByZXNwb25zZSByZWNlaXZlZFwiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIFNlbmQgbWVzc2FnZSB0byBhbGwgY29udGVudCBzY3JpcHRzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnJvYWRjYXN0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgY29uc3QgdGFicyA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KTtcbiAgICBmb3IgKGNvbnN0IHRhYiBvZiB0YWJzKSB7XG4gICAgICAgIGlmICh0YWIuaWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAvLyBUYWIgbWlnaHQgbm90IGhhdmUgY29udGVudCBzY3JpcHQgbG9hZGVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKipcbiAqIFA0LyM0MCDigJQgTG9uZy1saXZlZCBwb3J0IG5hbWUgdXNlZCBieSB0aGUgaW5saW5lIEFJIGFzc2lzdGFudC4gVGhlIGNvbnRlbnRcbiAqIHNjcmlwdCBjYWxscyBgY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7IG5hbWU6IENIQVRfUE9SVF9OQU1FIH0pYCBhbmQgdGhlXG4gKiBiYWNrZ3JvdW5kJ3MgYGNocm9tZS5ydW50aW1lLm9uQ29ubmVjdGAgbGlzdGVuZXIgZmlsdGVycyBieSB0aGlzIG5hbWUuXG4gKi9cbmV4cG9ydCBjb25zdCBDSEFUX1BPUlRfTkFNRSA9IFwic2xvdGhpbmctY2hhdC1zdHJlYW1cIjtcbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTID0ge1xuICAgIGF1dG9GaWxsRW5hYmxlZDogdHJ1ZSxcbiAgICBzaG93Q29uZmlkZW5jZUluZGljYXRvcnM6IHRydWUsXG4gICAgbWluaW11bUNvbmZpZGVuY2U6IDAuNSxcbiAgICBsZWFybkZyb21BbnN3ZXJzOiB0cnVlLFxuICAgIG5vdGlmeU9uSm9iRGV0ZWN0ZWQ6IHRydWUsXG4gICAgYXV0b1RyYWNrQXBwbGljYXRpb25zRW5hYmxlZDogdHJ1ZSxcbiAgICBjYXB0dXJlU2NyZWVuc2hvdEVuYWJsZWQ6IGZhbHNlLFxufTtcbmV4cG9ydCBjb25zdCBMRUdBQ1lfTE9DQUxfQVBJX0JBU0VfVVJMID0gXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIjtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0FQSV9CQVNFX1VSTCA9IHByb2Nlc3MuZW52LlNMT1RISU5HX0VYVEVOU0lPTl9BUElfQkFTRV9VUkwgfHwgXCJodHRwczovL3Nsb3RoaW5nLndvcmtcIjtcbmV4cG9ydCBjb25zdCBTSE9VTERfUFJPTU9URV9MRUdBQ1lfTE9DQUxfQVBJX0JBU0VfVVJMID0gREVGQVVMVF9BUElfQkFTRV9VUkwgIT09IExFR0FDWV9MT0NBTF9BUElfQkFTRV9VUkw7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=