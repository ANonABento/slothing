/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
var _a;
/** A special constant with type `never` */
const NEVER = /*@__PURE__*/ Object.freeze({
    status: "aborted",
});
function $constructor(name, initializer, params) {
    function init(inst, def) {
        if (!inst._zod) {
            Object.defineProperty(inst, "_zod", {
                value: {
                    def,
                    constr: _,
                    traits: new Set(),
                },
                enumerable: false,
            });
        }
        if (inst._zod.traits.has(name)) {
            return;
        }
        inst._zod.traits.add(name);
        initializer(inst, def);
        // support prototype modifications
        const proto = _.prototype;
        const keys = Object.keys(proto);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (!(k in inst)) {
                inst[k] = proto[k].bind(inst);
            }
        }
    }
    // doesn't work if Parent has a constructor with arguments
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
        var _a;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        for (const fn of inst._zod.deferred) {
            fn();
        }
        return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst) => {
            if (params?.Parent && inst instanceof params.Parent)
                return true;
            return inst?._zod?.traits?.has(name);
        },
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
}
//////////////////////////////   UTILITIES   ///////////////////////////////////////
const $brand = Symbol("zod_brand");
class $ZodAsyncError extends Error {
    constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
}
class $ZodEncodeError extends Error {
    constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`);
        this.name = "ZodEncodeError";
    }
}
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
    if (newConfig)
        Object.assign(globalConfig, newConfig);
    return globalConfig;
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
/* unused harmony import specifier */ var util;

/**
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link cuid2} instead.
 * See https://github.com/paralleldrive/cuid.
 */
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** Implements ISO 8601-2 extensions like explicit +- prefixes, mixing weeks with other units, and fractional/negative components. */
const extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
 *
 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
    if (!version)
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const uuid4 = /*@__PURE__*/ (/* unused pure expression or super */ null && (uuid(4)));
const uuid6 = /*@__PURE__*/ (/* unused pure expression or super */ null && (uuid(6)));
const uuid7 = /*@__PURE__*/ (/* unused pure expression or super */ null && (uuid(7)));
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
/** Equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email */
const html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/** The classic emailregex.com regex for RFC 5322-compliant emails */
const rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
const idnEmail = (/* unused pure expression or super */ null && (unicodeEmail));
const browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
    return new RegExp(_emoji, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const mac = (delimiter) => {
    const escapedDelim = util.escapeRegex(delimiter ?? ":");
    return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
};
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
// export const hostname: RegExp = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
const hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
const domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
const httpProtocol = /^https?$/;
// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
// E.164: leading digit must be 1-9; total digits (excluding '+') between 7-15
const e164 = /^\+[1-9]\d{6,14}$/;
// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
function timeSource(args) {
    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
    const regex = typeof args.precision === "number"
        ? args.precision === -1
            ? `${hhmm}`
            : args.precision === 0
                ? `${hhmm}:[0-5]\\d`
                : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
        : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    return regex;
}
function time(args) {
    return new RegExp(`^${timeSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetime(args) {
    const time = timeSource({ precision: args.precision });
    const opts = ["Z"];
    if (args.local)
        opts.push("");
    // if (args.offset) opts.push(`([+-]\\d{2}:\\d{2})`);
    if (args.offset)
        opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
    const timeRegex = `${time}(?:${opts.join("|")})`;
    return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
};
const bigint = /^-?\d+n?$/;
const integer = /^-?\d+$/;
const number = /^-?\d+(?:\.\d+)?$/;
const regexes_boolean = /^(?:true|false)$/i;
const _null = /^null$/i;

const _undefined = /^undefined$/i;

// regex for string with no uppercase letters
const lowercase = /^[^A-Z]*$/;
// regex for string with no lowercase letters
const uppercase = /^[^a-z]*$/;
// regex for hexadecimal strings (any length)
const hex = /^[0-9a-fA-F]*$/;
// Hash regexes for different algorithms and encodings
// Helper function to create base64 regex with exact length and padding
function fixedBase64(bodyLength, padding) {
    return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
// Helper function to create base64url regex with exact length (no padding)
function fixedBase64url(length) {
    return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
// MD5 (16 bytes): base64 = 24 chars total (22 + "==")
const md5_hex = /^[0-9a-fA-F]{32}$/;
const md5_base64 = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64(22, "==")));
const md5_base64url = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64url(22)));
// SHA1 (20 bytes): base64 = 28 chars total (27 + "=")
const sha1_hex = /^[0-9a-fA-F]{40}$/;
const sha1_base64 = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64(27, "=")));
const sha1_base64url = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64url(27)));
// SHA256 (32 bytes): base64 = 44 chars total (43 + "=")
const sha256_hex = /^[0-9a-fA-F]{64}$/;
const sha256_base64 = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64(43, "=")));
const sha256_base64url = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64url(43)));
// SHA384 (48 bytes): base64 = 64 chars total (no padding)
const sha384_hex = /^[0-9a-fA-F]{96}$/;
const sha384_base64 = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64(64, "")));
const sha384_base64url = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64url(64)));
// SHA512 (64 bytes): base64 = 88 chars total (86 + "==")
const sha512_hex = /^[0-9a-fA-F]{128}$/;
const sha512_base64 = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64(86, "==")));
const sha512_base64url = /*@__PURE__*/ (/* unused pure expression or super */ null && (fixedBase64url(86)));

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js

// functions
function assertEqual(val) {
    return val;
}
function assertNotEqual(val) {
    return val;
}
function assertIs(_arg) { }
function assertNever(_x) {
    throw new Error("Unexpected value in exhaustive check");
}
function assert(_) { }
function getEnumValues(entries) {
    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
    const values = Object.entries(entries)
        .filter(([k, _]) => numericValues.indexOf(+k) === -1)
        .map(([_, v]) => v);
    return values;
}
function joinValues(array, separator = "|") {
    return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint")
        return value.toString();
    return value;
}
function cached(getter) {
    const set = false;
    return {
        get value() {
            if (!set) {
                const value = getter();
                Object.defineProperty(this, "value", { value });
                return value;
            }
            throw new Error("cached value already set");
        },
    };
}
function nullish(input) {
    return input === null || input === undefined;
}
function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
    const ratio = val / step;
    const roundedRatio = Math.round(ratio);
    // Use a relative epsilon scaled to the magnitude of the result
    const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
    if (Math.abs(ratio - roundedRatio) < tolerance)
        return 0;
    return ratio - roundedRatio;
}
const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
function defineLazy(object, key, getter) {
    let value = undefined;
    Object.defineProperty(object, key, {
        get() {
            if (value === EVALUATING) {
                // Circular reference detected, return undefined to break the cycle
                return undefined;
            }
            if (value === undefined) {
                value = EVALUATING;
                value = getter();
            }
            return value;
        },
        set(v) {
            Object.defineProperty(object, key, {
                value: v,
                // configurable: true,
            });
            // object[key] = v;
        },
        configurable: true,
    });
}
function objectClone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
    Object.defineProperty(target, prop, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}
function mergeDefs(...defs) {
    const mergedDescriptors = {};
    for (const def of defs) {
        const descriptors = Object.getOwnPropertyDescriptors(def);
        Object.assign(mergedDescriptors, descriptors);
    }
    return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
    return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
    if (!path)
        return obj;
    return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key) => promisesObj[key]);
    return Promise.all(promises).then((results) => {
        const resolvedObj = {};
        for (let i = 0; i < keys.length; i++) {
            resolvedObj[keys[i]] = results[i];
        }
        return resolvedObj;
    });
}
function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
function esc(str) {
    return JSON.stringify(str);
}
function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
const captureStackTrace = ("captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => { });
function util_isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}
const util_allowsEval = /* @__PURE__*/ cached(() => {
    // Skip the probe under `jitless`: strict CSPs report the caught `new Function`
    // as a `securitypolicyviolation` even though the throw is swallowed.
    if (globalConfig.jitless) {
        return false;
    }
    // @ts-ignore
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
        return false;
    }
    try {
        const F = Function;
        new F("");
        return true;
    }
    catch (_) {
        return false;
    }
});
function isPlainObject(o) {
    if (util_isObject(o) === false)
        return false;
    // modified constructor
    const ctor = o.constructor;
    if (ctor === undefined)
        return true;
    if (typeof ctor !== "function")
        return true;
    // modified prototype
    const prot = ctor.prototype;
    if (util_isObject(prot) === false)
        return false;
    // ctor doesn't have static `isPrototypeOf`
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
        return false;
    }
    return true;
}
function shallowClone(o) {
    if (isPlainObject(o))
        return { ...o };
    if (Array.isArray(o))
        return [...o];
    if (o instanceof Map)
        return new Map(o);
    if (o instanceof Set)
        return new Set(o);
    return o;
}
function numKeys(data) {
    let keyCount = 0;
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            keyCount++;
        }
    }
    return keyCount;
}
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return "undefined";
        case "string":
            return "string";
        case "number":
            return Number.isNaN(data) ? "nan" : "number";
        case "boolean":
            return "boolean";
        case "function":
            return "function";
        case "bigint":
            return "bigint";
        case "symbol":
            return "symbol";
        case "object":
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return "promise";
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return "map";
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return "set";
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return "date";
            }
            // @ts-ignore
            if (typeof File !== "undefined" && data instanceof File) {
                return "file";
            }
            return "object";
        default:
            throw new Error(`Unknown data type: ${t}`);
    }
};
const propertyKeyTypes = /* @__PURE__*/ new Set(["string", "number", "symbol"]);
const primitiveTypes = /* @__PURE__*/ new Set([
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol",
    "undefined",
]);
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// zod-specific utils
function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
        cl._zod.parent = inst;
    return cl;
}
function normalizeParams(_params) {
    const params = _params;
    if (!params)
        return {};
    if (typeof params === "string")
        return { error: () => params };
    if (params?.message !== undefined) {
        if (params?.error !== undefined)
            throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
        return { ...params, error: () => params.error };
    return params;
}
function createTransparentProxy(getter) {
    let target;
    return new Proxy({}, {
        get(_, prop, receiver) {
            target ?? (target = getter());
            return Reflect.get(target, prop, receiver);
        },
        set(_, prop, value, receiver) {
            target ?? (target = getter());
            return Reflect.set(target, prop, value, receiver);
        },
        has(_, prop) {
            target ?? (target = getter());
            return Reflect.has(target, prop);
        },
        deleteProperty(_, prop) {
            target ?? (target = getter());
            return Reflect.deleteProperty(target, prop);
        },
        ownKeys(_) {
            target ?? (target = getter());
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(_, prop) {
            target ?? (target = getter());
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        defineProperty(_, prop, descriptor) {
            target ?? (target = getter());
            return Reflect.defineProperty(target, prop, descriptor);
        },
    });
}
function stringifyPrimitive(value) {
    if (typeof value === "bigint")
        return value.toString() + "n";
    if (typeof value === "string")
        return `"${value}"`;
    return `${value}`;
}
function optionalKeys(shape) {
    return Object.keys(shape).filter((k) => {
        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
}
const NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-3.4028234663852886e38, 3.4028234663852886e38],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};
const BIGINT_FORMAT_RANGES = {
    int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")],
};
function pick(schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
        throw new Error(".pick() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const newShape = {};
            for (const key in mask) {
                if (!(key in currDef.shape)) {
                    throw new Error(`Unrecognized key: "${key}"`);
                }
                if (!mask[key])
                    continue;
                newShape[key] = currDef.shape[key];
            }
            assignProp(this, "shape", newShape); // self-caching
            return newShape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function omit(schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
        throw new Error(".omit() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const newShape = { ...schema._zod.def.shape };
            for (const key in mask) {
                if (!(key in currDef.shape)) {
                    throw new Error(`Unrecognized key: "${key}"`);
                }
                if (!mask[key])
                    continue;
                delete newShape[key];
            }
            assignProp(this, "shape", newShape); // self-caching
            return newShape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function extend(schema, shape) {
    if (!isPlainObject(shape)) {
        throw new Error("Invalid input to extend: expected a plain object");
    }
    const checks = schema._zod.def.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
        // Only throw if new shape overlaps with existing shape
        // Use getOwnPropertyDescriptor to check key existence without accessing values
        const existingShape = schema._zod.def.shape;
        for (const key in shape) {
            if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
                throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
            }
        }
    }
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const _shape = { ...schema._zod.def.shape, ...shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
    });
    return clone(schema, def);
}
function safeExtend(schema, shape) {
    if (!isPlainObject(shape)) {
        throw new Error("Invalid input to safeExtend: expected a plain object");
    }
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const _shape = { ...schema._zod.def.shape, ...shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
    });
    return clone(schema, def);
}
function merge(a, b) {
    if (a._zod.def.checks?.length) {
        throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
    }
    const def = mergeDefs(a._zod.def, {
        get shape() {
            const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        get catchall() {
            return b._zod.def.catchall;
        },
        checks: b._zod.def.checks ?? [],
    });
    return clone(a, def);
}
function partial(Class, schema, mask) {
    const currDef = schema._zod.def;
    const checks = currDef.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
        throw new Error(".partial() cannot be used on object schemas containing refinements");
    }
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const oldShape = schema._zod.def.shape;
            const shape = { ...oldShape };
            if (mask) {
                for (const key in mask) {
                    if (!(key in oldShape)) {
                        throw new Error(`Unrecognized key: "${key}"`);
                    }
                    if (!mask[key])
                        continue;
                    // if (oldShape[key]!._zod.optin === "optional") continue;
                    shape[key] = Class
                        ? new Class({
                            type: "optional",
                            innerType: oldShape[key],
                        })
                        : oldShape[key];
                }
            }
            else {
                for (const key in oldShape) {
                    // if (oldShape[key]!._zod.optin === "optional") continue;
                    shape[key] = Class
                        ? new Class({
                            type: "optional",
                            innerType: oldShape[key],
                        })
                        : oldShape[key];
                }
            }
            assignProp(this, "shape", shape); // self-caching
            return shape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function required(Class, schema, mask) {
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const oldShape = schema._zod.def.shape;
            const shape = { ...oldShape };
            if (mask) {
                for (const key in mask) {
                    if (!(key in shape)) {
                        throw new Error(`Unrecognized key: "${key}"`);
                    }
                    if (!mask[key])
                        continue;
                    // overwrite with non-optional
                    shape[key] = new Class({
                        type: "nonoptional",
                        innerType: oldShape[key],
                    });
                }
            }
            else {
                for (const key in oldShape) {
                    // overwrite with non-optional
                    shape[key] = new Class({
                        type: "nonoptional",
                        innerType: oldShape[key],
                    });
                }
            }
            assignProp(this, "shape", shape); // self-caching
            return shape;
        },
    });
    return clone(schema, def);
}
// invalid_type | too_big | too_small | invalid_format | not_multiple_of | unrecognized_keys | invalid_union | invalid_key | invalid_element | invalid_value | custom
function aborted(x, startIndex = 0) {
    if (x.aborted === true)
        return true;
    for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue !== true) {
            return true;
        }
    }
    return false;
}
// Checks for explicit abort (continue === false), as opposed to implicit abort (continue === undefined).
// Used to respect `abort: true` in .refine() even for checks that have a `when` function.
function explicitlyAborted(x, startIndex = 0) {
    if (x.aborted === true)
        return true;
    for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue === false) {
            return true;
        }
    }
    return false;
}
function prefixIssues(path, issues) {
    return issues.map((iss) => {
        var _a;
        (_a = iss).path ?? (_a.path = []);
        iss.path.unshift(path);
        return iss;
    });
}
function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
    const message = iss.message
        ? iss.message
        : (unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
            unwrapMessage(ctx?.error?.(iss)) ??
            unwrapMessage(config.customError?.(iss)) ??
            unwrapMessage(config.localeError?.(iss)) ??
            "Invalid input");
    const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
    rest.path ?? (rest.path = []);
    rest.message = message;
    if (ctx?.reportInput) {
        rest.input = _input;
    }
    return rest;
}
function getSizableOrigin(input) {
    if (input instanceof Set)
        return "set";
    if (input instanceof Map)
        return "map";
    // @ts-ignore
    if (input instanceof File)
        return "file";
    return "unknown";
}
function getLengthableOrigin(input) {
    if (Array.isArray(input))
        return "array";
    if (typeof input === "string")
        return "string";
    return "unknown";
}
function parsedType(data) {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "nan" : "number";
        }
        case "object": {
            if (data === null) {
                return "null";
            }
            if (Array.isArray(data)) {
                return "array";
            }
            const obj = data;
            if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
                return obj.constructor.name;
            }
        }
    }
    return t;
}
function util_issue(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
        return {
            message: iss,
            code: "custom",
            input,
            inst,
        };
    }
    return { ...iss };
}
function cleanEnum(obj) {
    return Object.entries(obj)
        .filter(([k, _]) => {
        // return true if NaN, meaning it's not a number, thus a string key
        return Number.isNaN(Number.parseInt(k, 10));
    })
        .map((el) => el[1]);
}
// Codec utility functions
function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
function uint8ArrayToBase64(bytes) {
    let binaryString = "";
    for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
}
function base64urlToUint8Array(base64url) {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    return base64ToUint8Array(base64 + padding);
}
function uint8ArrayToBase64url(bytes) {
    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
    const cleanHex = hex.replace(/^0x/, "");
    if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid hex string length");
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
}
function uint8ArrayToHex(bytes) {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
// instanceof
class Class {
    constructor(..._args) { }
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
/* unused harmony import specifier */ var core;
/* unused harmony import specifier */ var checks_util;
// import { $ZodType } from "./schemas.js";



const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date",
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
            if (def.inclusive)
                bag.maximum = def.value;
            else
                bag.exclusiveMaximum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
            if (def.inclusive)
                bag.minimum = def.value;
            else
                bag.exclusiveMinimum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMultipleOf = 
/*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst) => {
        var _a;
        (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
        if (typeof payload.value !== typeof def.value)
            throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint"
            ? payload.value % def.value === BigInt(0)
            : floatSafeRemainder(payload.value, def.value) === 0;
        if (isMultiple)
            return;
        payload.issues.push({
            origin: typeof payload.value,
            code: "not_multiple_of",
            divisor: def.value,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def); // no format checks
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt)
            bag.pattern = integer;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (isInt) {
            if (!Number.isInteger(input)) {
                // invalid_format issue
                // payload.issues.push({
                //   expected: def.format,
                //   format: def.format,
                //   code: "invalid_format",
                //   input,
                //   inst,
                // });
                // invalid_type issue
                payload.issues.push({
                    expected: origin,
                    format: def.format,
                    code: "invalid_type",
                    continue: false,
                    input,
                    inst,
                });
                return;
                // not_multiple_of issue
                // payload.issues.push({
                //   code: "not_multiple_of",
                //   origin: "number",
                //   input,
                //   inst,
                //   divisor: 1,
                // });
            }
            if (!Number.isSafeInteger(input)) {
                if (input > 0) {
                    // too_big
                    payload.issues.push({
                        input,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        inclusive: true,
                        continue: !def.abort,
                    });
                }
                else {
                    // too_small
                    payload.issues.push({
                        input,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        inclusive: true,
                        continue: !def.abort,
                    });
                }
                return;
            }
        }
        if (input < minimum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_small",
                minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_big",
                maximum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodCheckBigIntFormat = /*@__PURE__*/ (/* unused pure expression or super */ null && (core.$constructor("$ZodCheckBigIntFormat", (inst, def) => {
    $ZodCheck.init(inst, def); // no format checks
    const [minimum, maximum] = checks_util.BIGINT_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (input < minimum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_small",
                minimum: minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_big",
                maximum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
    };
})));
const $ZodCheckMaxSize = /*@__PURE__*/ (/* unused pure expression or super */ null && (core.$constructor("$ZodCheckMaxSize", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !checks_util.nullish(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size <= def.maximum)
            return;
        payload.issues.push({
            origin: checks_util.getSizableOrigin(input),
            code: "too_big",
            maximum: def.maximum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
})));
const $ZodCheckMinSize = /*@__PURE__*/ (/* unused pure expression or super */ null && (core.$constructor("$ZodCheckMinSize", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !checks_util.nullish(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size >= def.minimum)
            return;
        payload.issues.push({
            origin: checks_util.getSizableOrigin(input),
            code: "too_small",
            minimum: def.minimum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
})));
const $ZodCheckSizeEquals = /*@__PURE__*/ (/* unused pure expression or super */ null && (core.$constructor("$ZodCheckSizeEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !checks_util.nullish(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.size;
        bag.maximum = def.size;
        bag.size = def.size;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size === def.size)
            return;
        const tooBig = size > def.size;
        payload.issues.push({
            origin: checks_util.getSizableOrigin(input),
            ...(tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
})));
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
            return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.maximum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
            return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.minimum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
            return;
        const origin = getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
            origin,
            ...(tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a, _b;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
            bag.patterns ?? (bag.patterns = new Set());
            bag.patterns.add(def.pattern);
        }
    });
    if (def.pattern)
        (_a = inst._zod).check ?? (_a.check = (payload) => {
            def.pattern.lastIndex = 0;
            if (def.pattern.test(payload.value))
                return;
            payload.issues.push({
                origin: "string",
                code: "invalid_format",
                format: def.format,
                input: payload.value,
                ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
                inst,
                continue: !def.abort,
            });
        });
    else
        (_b = inst._zod).check ?? (_b.check = () => { });
});
const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "regex",
            input: payload.value,
            pattern: def.pattern.toString(),
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    const escapedRegex = escapeRegex(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: def.includes,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: def.prefix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: def.suffix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
///////////////////////////////////
/////    $ZodCheckProperty    /////
///////////////////////////////////
function handleCheckPropertyResult(result, payload, property) {
    if (result.issues.length) {
        payload.issues.push(...checks_util.prefixIssues(property, result.issues));
    }
}
const $ZodCheckProperty = /*@__PURE__*/ (/* unused pure expression or super */ null && (core.$constructor("$ZodCheckProperty", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
        const result = def.schema._zod.run({
            value: payload.value[def.property],
            issues: [],
        }, {});
        if (result instanceof Promise) {
            return result.then((result) => handleCheckPropertyResult(result, payload, def.property));
        }
        handleCheckPropertyResult(result, payload, def.property);
        return;
    };
})));
const $ZodCheckMimeType = /*@__PURE__*/ (/* unused pure expression or super */ null && (core.$constructor("$ZodCheckMimeType", (inst, def) => {
    $ZodCheck.init(inst, def);
    const mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.mime = def.mime;
    });
    inst._zod.check = (payload) => {
        if (mimeSet.has(payload.value.type))
            return;
        payload.issues.push({
            code: "invalid_value",
            values: def.mime,
            input: payload.value.type,
            inst,
            continue: !def.abort,
        });
    };
})));
const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
    };
});

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
class Doc {
    constructor(args = []) {
        this.content = [];
        this.indent = 0;
        if (this)
            this.args = args;
    }
    indented(fn) {
        this.indent += 1;
        fn(this);
        this.indent -= 1;
    }
    write(arg) {
        if (typeof arg === "function") {
            arg(this, { execution: "sync" });
            arg(this, { execution: "async" });
            return;
        }
        const content = arg;
        const lines = content.split("\n").filter((x) => x);
        const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
        const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
        for (const line of dedented) {
            this.content.push(line);
        }
    }
    compile() {
        const F = Function;
        const args = this?.args;
        const content = this?.content ?? [``];
        const lines = [...content.map((x) => `  ${x}`)];
        // console.log(lines.join("\n"));
        return new F(...args, lines.join("\n"));
    }
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js


const initializer = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false,
    });
    Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false,
    });
    inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
    Object.defineProperty(inst, "toString", {
        value: () => inst.message,
        enumerable: false,
    });
};
const $ZodError = $constructor("$ZodError", initializer);
const $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues) {
        if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
        }
        else {
            formErrors.push(mapper(sub));
        }
    }
    return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
    const fieldErrors = { _errors: [] };
    const processError = (error, path = []) => {
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues }, [...path, ...issue.path]);
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues }, [...path, ...issue.path]);
            }
            else {
                const fullpath = [...path, ...issue.path];
                if (fullpath.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < fullpath.length) {
                        const el = fullpath[i];
                        const terminal = i === fullpath.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        }
    };
    processError(error);
    return fieldErrors;
}
function treeifyError(error, mapper = (issue) => issue.message) {
    const result = { errors: [] };
    const processError = (error, path = []) => {
        var _a, _b;
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                // regular union error
                issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues }, [...path, ...issue.path]);
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues }, [...path, ...issue.path]);
            }
            else {
                const fullpath = [...path, ...issue.path];
                if (fullpath.length === 0) {
                    result.errors.push(mapper(issue));
                    continue;
                }
                let curr = result;
                let i = 0;
                while (i < fullpath.length) {
                    const el = fullpath[i];
                    const terminal = i === fullpath.length - 1;
                    if (typeof el === "string") {
                        curr.properties ?? (curr.properties = {});
                        (_a = curr.properties)[el] ?? (_a[el] = { errors: [] });
                        curr = curr.properties[el];
                    }
                    else {
                        curr.items ?? (curr.items = []);
                        (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
                        curr = curr.items[el];
                    }
                    if (terminal) {
                        curr.errors.push(mapper(issue));
                    }
                    i++;
                }
            }
        }
    };
    processError(error);
    return result;
}
/** Format a ZodError as a human-readable string in the following form.
 *
 * From
 *
 * ```ts
 * ZodError {
 *   issues: [
 *     {
 *       expected: 'string',
 *       code: 'invalid_type',
 *       path: [ 'username' ],
 *       message: 'Invalid input: expected string'
 *     },
 *     {
 *       expected: 'number',
 *       code: 'invalid_type',
 *       path: [ 'favoriteNumbers', 1 ],
 *       message: 'Invalid input: expected number'
 *     }
 *   ];
 * }
 * ```
 *
 * to
 *
 * ```
 * username
 *   ✖ Expected number, received string at "username
 * favoriteNumbers[0]
 *   ✖ Invalid input: expected number
 * ```
 */
function toDotPath(_path) {
    const segs = [];
    const path = _path.map((seg) => (typeof seg === "object" ? seg.key : seg));
    for (const seg of path) {
        if (typeof seg === "number")
            segs.push(`[${seg}]`);
        else if (typeof seg === "symbol")
            segs.push(`[${JSON.stringify(String(seg))}]`);
        else if (/[^\w$]/.test(seg))
            segs.push(`[${JSON.stringify(seg)}]`);
        else {
            if (segs.length)
                segs.push(".");
            segs.push(seg);
        }
    }
    return segs.join("");
}
function prettifyError(error) {
    const lines = [];
    // sort by path length
    const issues = [...error.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
    // Process each issue
    for (const issue of issues) {
        lines.push(`✖ ${issue.message}`);
        if (issue.path?.length)
            lines.push(`  → at ${toDotPath(issue.path)}`);
    }
    // Convert Map to formatted string
    return lines.join("\n");
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js



const _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError();
    }
    if (result.issues.length) {
        const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e, _params?.callee);
        throw e;
    }
    return result.value;
};
const parse = /* @__PURE__*/ _parse($ZodRealError);
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    if (result.issues.length) {
        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e, params?.callee);
        throw e;
    }
    return result.value;
};
const parseAsync = /* @__PURE__*/ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError();
    }
    return result.issues.length
        ? {
            success: false,
            error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
        : { success: true, data: result.value };
};
const safeParse = /* @__PURE__*/ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    return result.issues.length
        ? {
            success: false,
            error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
        : { success: true, data: result.value };
};
const safeParseAsync = /* @__PURE__*/ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _parse(_Err)(schema, value, ctx);
};
const encode = /* @__PURE__*/ _encode($ZodRealError);
const _decode = (_Err) => (schema, value, _ctx) => {
    return _parse(_Err)(schema, value, _ctx);
};
const decode = /* @__PURE__*/ _decode($ZodRealError);
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _parseAsync(_Err)(schema, value, ctx);
};
const encodeAsync = /* @__PURE__*/ _encodeAsync($ZodRealError);
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _parseAsync(_Err)(schema, value, _ctx);
};
const decodeAsync = /* @__PURE__*/ _decodeAsync($ZodRealError);
const _safeEncode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _safeParse(_Err)(schema, value, ctx);
};
const safeEncode = /* @__PURE__*/ _safeEncode($ZodRealError);
const _safeDecode = (_Err) => (schema, value, _ctx) => {
    return _safeParse(_Err)(schema, value, _ctx);
};
const safeDecode = /* @__PURE__*/ _safeDecode($ZodRealError);
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return _safeParseAsync(_Err)(schema, value, ctx);
};
const safeEncodeAsync = /* @__PURE__*/ _safeEncodeAsync($ZodRealError);
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _safeParseAsync(_Err)(schema, value, _ctx);
};
const safeDecodeAsync = /* @__PURE__*/ _safeDecodeAsync($ZodRealError);

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
const version = {
    major: 4,
    minor: 4,
    patch: 3,
};

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
/* unused harmony import specifier */ var checks;
/* unused harmony import specifier */ var schemas_core;
/* unused harmony import specifier */ var schemas_parse;
/* unused harmony import specifier */ var schemas_parseAsync;
/* unused harmony import specifier */ var regexes;
/* unused harmony import specifier */ var schemas_util;







const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    inst._zod.def = def; // set _def property
    inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
    inst._zod.version = version;
    const checks = [...(inst._zod.def.checks ?? [])];
    // if inst is itself a checks.$ZodCheck, run it as a check
    if (inst._zod.traits.has("$ZodCheck")) {
        checks.unshift(inst);
    }
    for (const ch of checks) {
        for (const fn of ch._zod.onattach) {
            fn(inst);
        }
    }
    if (checks.length === 0) {
        // deferred initializer
        // inst._zod.parse is not yet defined
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        inst._zod.deferred?.push(() => {
            inst._zod.run = inst._zod.parse;
        });
    }
    else {
        const runChecks = (payload, checks, ctx) => {
            let isAborted = aborted(payload);
            let asyncResult;
            for (const ch of checks) {
                if (ch._zod.def.when) {
                    if (explicitlyAborted(payload))
                        continue;
                    const shouldRun = ch._zod.def.when(payload);
                    if (!shouldRun)
                        continue;
                }
                else if (isAborted) {
                    continue;
                }
                const currLen = payload.issues.length;
                const _ = ch._zod.check(payload);
                if (_ instanceof Promise && ctx?.async === false) {
                    throw new $ZodAsyncError();
                }
                if (asyncResult || _ instanceof Promise) {
                    asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                        await _;
                        const nextLen = payload.issues.length;
                        if (nextLen === currLen)
                            return;
                        if (!isAborted)
                            isAborted = aborted(payload, currLen);
                    });
                }
                else {
                    const nextLen = payload.issues.length;
                    if (nextLen === currLen)
                        continue;
                    if (!isAborted)
                        isAborted = aborted(payload, currLen);
                }
            }
            if (asyncResult) {
                return asyncResult.then(() => {
                    return payload;
                });
            }
            return payload;
        };
        const handleCanaryResult = (canary, payload, ctx) => {
            // abort if the canary is aborted
            if (aborted(canary)) {
                canary.aborted = true;
                return canary;
            }
            // run checks first, then
            const checkResult = runChecks(payload, checks, ctx);
            if (checkResult instanceof Promise) {
                if (ctx.async === false)
                    throw new $ZodAsyncError();
                return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
            }
            return inst._zod.parse(checkResult, ctx);
        };
        inst._zod.run = (payload, ctx) => {
            if (ctx.skipChecks) {
                return inst._zod.parse(payload, ctx);
            }
            if (ctx.direction === "backward") {
                // run canary
                // initial pass (no checks)
                const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
                if (canary instanceof Promise) {
                    return canary.then((canary) => {
                        return handleCanaryResult(canary, payload, ctx);
                    });
                }
                return handleCanaryResult(canary, payload, ctx);
            }
            // forward
            const result = inst._zod.parse(payload, ctx);
            if (result instanceof Promise) {
                if (ctx.async === false)
                    throw new $ZodAsyncError();
                return result.then((result) => runChecks(result, checks, ctx));
            }
            return runChecks(result, checks, ctx);
        };
    }
    // Lazy initialize ~standard to avoid creating objects for every schema
    defineLazy(inst, "~standard", () => ({
        validate: (value) => {
            try {
                const r = safeParse(inst, value);
                return r.success ? { value: r.data } : { issues: r.error?.issues };
            }
            catch (_) {
                return safeParseAsync(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
            }
        },
        vendor: "zod",
        version: 1,
    }));
});

const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
        if (def.coerce)
            try {
                payload.value = String(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "string")
            return payload;
        payload.issues.push({
            expected: "string",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
    // check initialization must come first
    $ZodCheckStringFormat.init(inst, def);
    $ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid);
    $ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
        const versionMap = {
            v1: 1,
            v2: 2,
            v3: 3,
            v4: 4,
            v5: 5,
            v6: 6,
            v7: 7,
            v8: 8,
        };
        const v = versionMap[def.version];
        if (v === undefined)
            throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = uuid(v));
    }
    else
        def.pattern ?? (def.pattern = uuid());
    $ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email);
    $ZodStringFormat.init(inst, def);
});
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        try {
            // Trim whitespace from input
            const trimmed = payload.value.trim();
            // When normalize is off, require :// for http/https URLs
            // This prevents strings like "http:example.com" or "https:/path" from being silently accepted
            if (!def.normalize && def.protocol?.source === httpProtocol.source) {
                if (!/^https?:\/\//i.test(trimmed)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid URL format",
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                    return;
                }
            }
            // @ts-ignore
            const url = new URL(trimmed);
            if (def.hostname) {
                def.hostname.lastIndex = 0;
                if (!def.hostname.test(url.hostname)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: def.hostname.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            if (def.protocol) {
                def.protocol.lastIndex = 0;
                if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: def.protocol.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            // Set the output value based on normalize flag
            if (def.normalize) {
                // Use normalized URL
                payload.value = url.href;
            }
            else {
                // Preserve the original input (trimmed)
                payload.value = trimmed;
            }
            return;
        }
        catch (_) {
            payload.issues.push({
                code: "invalid_format",
                format: "url",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji());
    $ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid);
    $ZodStringFormat.init(inst, def);
});
/**
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
 * See https://github.com/paralleldrive/cuid.
 */
const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2);
    $ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid);
    $ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid);
    $ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid);
    $ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date);
    $ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration);
    $ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `ipv6`;
    inst._zod.check = (payload) => {
        try {
            // @ts-ignore
            new URL(`http://[${payload.value}]`);
            // return;
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "ipv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodMAC = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodMAC", (inst, def) => {
    def.pattern ?? (def.pattern = regexes.mac(def.delimiter));
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.format = `mac`;
})));
const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4);
    $ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6); // not used for validation
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        const parts = payload.value.split("/");
        try {
            if (parts.length !== 2)
                throw new Error();
            const [address, prefix] = parts;
            if (!prefix)
                throw new Error();
            const prefixNum = Number(prefix);
            if (`${prefixNum}` !== prefix)
                throw new Error();
            if (prefixNum < 0 || prefixNum > 128)
                throw new Error();
            // @ts-ignore
            new URL(`http://[${address}]`);
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "cidrv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64(data) {
    if (data === "")
        return true;
    // atob ignores whitespace, so reject it up front.
    if (/\s/.test(data))
        return false;
    if (data.length % 4 !== 0)
        return false;
    try {
        // @ts-ignore
        atob(data);
        return true;
    }
    catch {
        return false;
    }
}
const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64";
    inst._zod.check = (payload) => {
        if (isValidBase64(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64URL(data) {
    if (!base64url.test(data))
        return false;
    const base64 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return isValidBase64(padded);
}
const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url);
    $ZodStringFormat.init(inst, def);
    inst._zod.bag.contentEncoding = "base64url";
    inst._zod.check = (payload) => {
        if (isValidBase64URL(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164);
    $ZodStringFormat.init(inst, def);
});
//////////////////////////////   ZodJWT   //////////////////////////////
function isValidJWT(token, algorithm = null) {
    try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3)
            return false;
        const [header] = tokensParts;
        if (!header)
            return false;
        // @ts-ignore
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
            return false;
        if (!parsedHeader.alg)
            return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
            return false;
        return true;
    }
    catch {
        return false;
    }
}
const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        if (isValidJWT(payload.value, def.alg))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCustomStringFormat = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodCustomStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        if (def.fn(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
})));
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Number(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
            return payload;
        }
        const received = typeof input === "number"
            ? Number.isNaN(input)
                ? "NaN"
                : !Number.isFinite(input)
                    ? "Infinity"
                    : undefined
            : undefined;
        payload.issues.push({
            expected: "number",
            code: "invalid_type",
            input,
            inst,
            ...(received ? { received } : {}),
        });
        return payload;
    };
});
const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def);
    $ZodNumber.init(inst, def); // no format checks
});
const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = regexes_boolean;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Boolean(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "boolean")
            return payload;
        payload.issues.push({
            expected: "boolean",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodBigInt = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodBigInt", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = regexes.bigint;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = BigInt(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "bigint")
            return payload;
        payload.issues.push({
            expected: "bigint",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
})));
const $ZodBigIntFormat = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodBigIntFormat", (inst, def) => {
    checks.$ZodCheckBigIntFormat.init(inst, def);
    $ZodBigInt.init(inst, def); // no format checks
})));
const $ZodSymbol = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodSymbol", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "symbol")
            return payload;
        payload.issues.push({
            expected: "symbol",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
})));
const $ZodUndefined = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodUndefined", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = regexes.undefined;
    inst._zod.values = new Set([undefined]);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
            return payload;
        payload.issues.push({
            expected: "undefined",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
})));
const $ZodNull = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = regexes.null;
    inst._zod.values = new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input === null)
            return payload;
        payload.issues.push({
            expected: "null",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
})));
const $ZodAny = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodAny", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
})));
const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
});
const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
            expected: "never",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodVoid = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodVoid", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
            return payload;
        payload.issues.push({
            expected: "void",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
})));
const $ZodDate = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodDate", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) {
            try {
                payload.value = new Date(payload.value);
            }
            catch (_err) { }
        }
        const input = payload.value;
        const isDate = input instanceof Date;
        const isValidDate = isDate && !Number.isNaN(input.getTime());
        if (isValidDate)
            return payload;
        payload.issues.push({
            expected: "date",
            code: "invalid_type",
            input,
            ...(isDate ? { received: "Invalid Date" } : {}),
            inst,
        });
        return payload;
    };
})));
function handleArrayResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                expected: "array",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            const result = def.element._zod.run({
                value: item,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleArrayResult(result, payload, i)));
            }
            else {
                handleArrayResult(result, payload, i);
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload; //handleArrayResultsAsync(parseResults, final);
    };
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
    const isPresent = key in input;
    if (result.issues.length) {
        // For optional-in/out schemas, ignore errors on absent keys.
        if (isOptionalIn && isOptionalOut && !isPresent) {
            return;
        }
        final.issues.push(...prefixIssues(key, result.issues));
    }
    if (!isPresent && !isOptionalIn) {
        if (!result.issues.length) {
            final.issues.push({
                code: "invalid_type",
                expected: "nonoptional",
                input: undefined,
                path: [key],
            });
        }
        return;
    }
    if (result.value === undefined) {
        if (isPresent) {
            final.value[key] = undefined;
        }
    }
    else {
        final.value[key] = result.value;
    }
}
function normalizeDef(def) {
    const keys = Object.keys(def.shape);
    for (const k of keys) {
        if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
            throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
        }
    }
    const okeys = optionalKeys(def.shape);
    return {
        ...def,
        keys,
        keySet: new Set(keys),
        numKeys: keys.length,
        optionalKeys: new Set(okeys),
    };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
    const unrecognized = [];
    const keySet = def.keySet;
    const _catchall = def.catchall._zod;
    const t = _catchall.def.type;
    const isOptionalIn = _catchall.optin === "optional";
    const isOptionalOut = _catchall.optout === "optional";
    for (const key in input) {
        // skip __proto__ so it can't replace the result prototype via the
        // assignment setter on the plain {} we build into
        if (key === "__proto__")
            continue;
        if (keySet.has(key))
            continue;
        if (t === "never") {
            unrecognized.push(key);
            continue;
        }
        const r = _catchall.run({ value: input[key], issues: [] }, ctx);
        if (r instanceof Promise) {
            proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
        }
        else {
            handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
        }
    }
    if (unrecognized.length) {
        payload.issues.push({
            code: "unrecognized_keys",
            keys: unrecognized,
            input,
            inst,
        });
    }
    if (!proms.length)
        return payload;
    return Promise.all(proms).then(() => {
        return payload;
    });
}
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
    // requires cast because technically $ZodObject doesn't extend
    $ZodType.init(inst, def);
    // const sh = def.shape;
    const desc = Object.getOwnPropertyDescriptor(def, "shape");
    if (!desc?.get) {
        const sh = def.shape;
        Object.defineProperty(def, "shape", {
            get: () => {
                const newSh = { ...sh };
                Object.defineProperty(def, "shape", {
                    value: newSh,
                });
                return newSh;
            },
        });
    }
    const _normalized = cached(() => normalizeDef(def));
    defineLazy(inst._zod, "propValues", () => {
        const shape = def.shape;
        const propValues = {};
        for (const key in shape) {
            const field = shape[key]._zod;
            if (field.values) {
                propValues[key] ?? (propValues[key] = new Set());
                for (const v of field.values)
                    propValues[key].add(v);
            }
        }
        return propValues;
    });
    const isObject = util_isObject;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        payload.value = {};
        const proms = [];
        const shape = value.shape;
        for (const key of value.keys) {
            const el = shape[key];
            const isOptionalIn = el._zod.optin === "optional";
            const isOptionalOut = el._zod.optout === "optional";
            const r = el._zod.run({ value: input[key], issues: [] }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
            }
            else {
                handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
            }
        }
        if (!catchall) {
            return proms.length ? Promise.all(proms).then(() => payload) : payload;
        }
        return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
    };
});
const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
    // requires cast because technically $ZodObject doesn't extend
    $ZodObject.init(inst, def);
    const superParse = inst._zod.parse;
    const _normalized = cached(() => normalizeDef(def));
    const generateFastpass = (shape) => {
        const doc = new Doc(["shape", "payload", "ctx"]);
        const normalized = _normalized.value;
        const parseStr = (key) => {
            const k = esc(key);
            return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc.write(`const input = payload.value;`);
        const ids = Object.create(null);
        let counter = 0;
        for (const key of normalized.keys) {
            ids[key] = `key_${counter++}`;
        }
        // A: preserve key order {
        doc.write(`const newResult = {};`);
        for (const key of normalized.keys) {
            const id = ids[key];
            const k = esc(key);
            const schema = shape[key];
            const isOptionalIn = schema?._zod?.optin === "optional";
            const isOptionalOut = schema?._zod?.optout === "optional";
            doc.write(`const ${id} = ${parseStr(key)};`);
            if (isOptionalIn && isOptionalOut) {
                // For optional-in/out schemas, ignore errors on absent keys
                doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
            }
            else if (!isOptionalIn) {
                doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
            }
            else {
                doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
            }
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        const fn = doc.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject = util_isObject;
    const jit = !globalConfig.jitless;
    const allowsEval = util_allowsEval;
    const fastEnabled = jit && allowsEval.value; // && !def.catchall;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
            // always synchronous
            if (!fastpass)
                fastpass = generateFastpass(def.shape);
            payload = fastpass(payload, ctx);
            if (!catchall)
                return payload;
            return handleCatchall([], input, payload, ctx, value, inst);
        }
        return superParse(payload, ctx);
    };
});
function handleUnionResults(results, final, inst, ctx) {
    for (const result of results) {
        if (result.issues.length === 0) {
            final.value = result.value;
            return final;
        }
    }
    const nonaborted = results.filter((r) => !aborted(r));
    if (nonaborted.length === 1) {
        final.value = nonaborted[0].value;
        return nonaborted[0];
    }
    final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
    });
    return final;
}
const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) {
            return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
            const patterns = def.options.map((o) => o._zod.pattern);
            return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
        }
        return undefined;
    });
    const first = def.options.length === 1 ? def.options[0]._zod.run : null;
    inst._zod.parse = (payload, ctx) => {
        if (first) {
            return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
            const result = option._zod.run({
                value: payload.value,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                results.push(result);
                async = true;
            }
            else {
                if (result.issues.length === 0)
                    return result;
                results.push(result);
            }
        }
        if (!async)
            return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results) => {
            return handleUnionResults(results, payload, inst, ctx);
        });
    };
});
function handleExclusiveUnionResults(results, final, inst, ctx) {
    const successes = results.filter((r) => r.issues.length === 0);
    if (successes.length === 1) {
        final.value = successes[0].value;
        return final;
    }
    if (successes.length === 0) {
        // No matches - same as regular union
        final.issues.push({
            code: "invalid_union",
            input: final.value,
            inst,
            errors: results.map((result) => result.issues.map((iss) => schemas_util.finalizeIssue(iss, ctx, schemas_core.config()))),
        });
    }
    else {
        // Multiple matches - exclusive union failure
        final.issues.push({
            code: "invalid_union",
            input: final.value,
            inst,
            errors: [],
            inclusive: false,
        });
    }
    return final;
}
const $ZodXor = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodXor", (inst, def) => {
    $ZodUnion.init(inst, def);
    def.inclusive = false;
    const first = def.options.length === 1 ? def.options[0]._zod.run : null;
    inst._zod.parse = (payload, ctx) => {
        if (first) {
            return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
            const result = option._zod.run({
                value: payload.value,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                results.push(result);
                async = true;
            }
            else {
                results.push(result);
            }
        }
        if (!async)
            return handleExclusiveUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results) => {
            return handleExclusiveUnionResults(results, payload, inst, ctx);
        });
    };
})));
const $ZodDiscriminatedUnion = 
/*@__PURE__*/
(/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodDiscriminatedUnion", (inst, def) => {
    def.inclusive = false;
    $ZodUnion.init(inst, def);
    const _super = inst._zod.parse;
    schemas_util.defineLazy(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
            const pv = option._zod.propValues;
            if (!pv || Object.keys(pv).length === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
            for (const [k, v] of Object.entries(pv)) {
                if (!propValues[k])
                    propValues[k] = new Set();
                for (const val of v) {
                    propValues[k].add(val);
                }
            }
        }
        return propValues;
    });
    const disc = schemas_util.cached(() => {
        const opts = def.options;
        const map = new Map();
        for (const o of opts) {
            const values = o._zod.propValues?.[def.discriminator];
            if (!values || values.size === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
            for (const v of values) {
                if (map.has(v)) {
                    throw new Error(`Duplicate discriminator value "${String(v)}"`);
                }
                map.set(v, o);
            }
        }
        return map;
    });
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!schemas_util.isObject(input)) {
            payload.issues.push({
                code: "invalid_type",
                expected: "object",
                input,
                inst,
            });
            return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
            return opt._zod.run(payload, ctx);
        }
        // Fall back to union matching when the fast discriminator path fails:
        // - explicitly enabled via unionFallback, or
        // - during backward direction (encode), since codec-based discriminators
        //   have different values in forward vs backward directions
        if (def.unionFallback || ctx.direction === "backward") {
            return _super(payload, ctx);
        }
        // no matching discriminator
        payload.issues.push({
            code: "invalid_union",
            errors: [],
            note: "No matching discriminator",
            discriminator: def.discriminator,
            options: Array.from(disc.value.keys()),
            input,
            path: [def.discriminator],
            inst,
        });
        return payload;
    };
})));
const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
            return Promise.all([left, right]).then(([left, right]) => {
                return handleIntersectionResults(payload, left, right);
            });
        }
        return handleIntersectionResults(payload, left, right);
    };
});
function mergeValues(a, b) {
    // const aType = parse.t(a);
    // const bType = parse.t(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    if (a instanceof Date && b instanceof Date && +a === +b) {
        return { valid: true, data: a };
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
                };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return { valid: false, mergeErrorPath: [] };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
                };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
    // Track which side(s) report each key as unrecognized
    const unrecKeys = new Map();
    let unrecIssue;
    for (const iss of left.issues) {
        if (iss.code === "unrecognized_keys") {
            unrecIssue ?? (unrecIssue = iss);
            for (const k of iss.keys) {
                if (!unrecKeys.has(k))
                    unrecKeys.set(k, {});
                unrecKeys.get(k).l = true;
            }
        }
        else {
            result.issues.push(iss);
        }
    }
    for (const iss of right.issues) {
        if (iss.code === "unrecognized_keys") {
            for (const k of iss.keys) {
                if (!unrecKeys.has(k))
                    unrecKeys.set(k, {});
                unrecKeys.get(k).r = true;
            }
        }
        else {
            result.issues.push(iss);
        }
    }
    // Report only keys unrecognized by BOTH sides
    const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
    if (bothKeys.length && unrecIssue) {
        result.issues.push({ ...unrecIssue, keys: bothKeys });
    }
    if (aborted(result))
        return result;
    const merged = mergeValues(left.value, right.value);
    if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
    }
    result.value = merged.data;
    return result;
}
const $ZodTuple = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodTuple", (inst, def) => {
    $ZodType.init(inst, def);
    const items = def.items;
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                input,
                inst,
                expected: "tuple",
                code: "invalid_type",
            });
            return payload;
        }
        payload.value = [];
        const proms = [];
        const optinStart = getTupleOptStart(items, "optin");
        const optoutStart = getTupleOptStart(items, "optout");
        if (!def.rest) {
            if (input.length < optinStart) {
                payload.issues.push({
                    code: "too_small",
                    minimum: optinStart,
                    inclusive: true,
                    input,
                    inst,
                    origin: "array",
                });
                return payload;
            }
            if (input.length > items.length) {
                payload.issues.push({
                    code: "too_big",
                    maximum: items.length,
                    inclusive: true,
                    input,
                    inst,
                    origin: "array",
                });
            }
        }
        // Run every item in parallel, collecting results into an indexed
        // array. The post-processing in `handleTupleResults` walks them in
        // order so it can decide whether an absent optional-output error can
        // truncate the tail or must be reported to preserve required output.
        const itemResults = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
            const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((rr) => {
                    itemResults[i] = rr;
                }));
            }
            else {
                itemResults[i] = r;
            }
        }
        if (def.rest) {
            let i = items.length - 1;
            const rest = input.slice(items.length);
            for (const el of rest) {
                i++;
                const result = def.rest._zod.run({ value: el, issues: [] }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((r) => handleTupleResult(r, payload, i)));
                }
                else {
                    handleTupleResult(result, payload, i);
                }
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
        }
        return handleTupleResults(itemResults, payload, items, input, optoutStart);
    };
})));
function getTupleOptStart(items, key) {
    for (let i = items.length - 1; i >= 0; i--) {
        if (items[i]._zod[key] !== "optional")
            return i + 1;
    }
    return 0;
}
function handleTupleResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...schemas_util.prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
}
function handleTupleResults(itemResults, final, items, input, optoutStart) {
    // Walk results in order. Mirror $ZodObject's swallow-on-absent-optional
    // rule, but only after `optoutStart`: the first index where the output
    // tuple tail can be absent.
    for (let i = 0; i < items.length; i++) {
        const r = itemResults[i];
        const isPresent = i < input.length;
        if (r.issues.length) {
            if (!isPresent && i >= optoutStart) {
                final.value.length = i;
                break;
            }
            final.issues.push(...schemas_util.prefixIssues(i, r.issues));
        }
        final.value[i] = r.value;
    }
    // Drop trailing slots that produced `undefined` for absent input
    // (the array analog of an absent optional key on an object). The
    // `i >= input.length` floor is critical: an explicit `undefined`
    // *inside* the input must be preserved even when the schema is
    // optional-out (e.g. `z.string().or(z.undefined())` accepting an
    // explicit undefined value).
    for (let i = final.value.length - 1; i >= input.length; i--) {
        if (items[i]._zod.optout === "optional" && final.value[i] === undefined) {
            final.value.length = i;
        }
        else {
            break;
        }
    }
    return final;
}
const $ZodRecord = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!schemas_util.isPlainObject(input)) {
            payload.issues.push({
                expected: "record",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        const values = def.keyType._zod.values;
        if (values) {
            payload.value = {};
            const recordKeys = new Set();
            for (const key of values) {
                if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
                    recordKeys.add(typeof key === "number" ? key.toString() : key);
                    const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
                    if (keyResult instanceof Promise) {
                        throw new Error("Async schemas not supported in object keys currently");
                    }
                    if (keyResult.issues.length) {
                        payload.issues.push({
                            code: "invalid_key",
                            origin: "record",
                            issues: keyResult.issues.map((iss) => schemas_util.finalizeIssue(iss, ctx, schemas_core.config())),
                            input: key,
                            path: [key],
                            inst,
                        });
                        continue;
                    }
                    const outKey = keyResult.value;
                    const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                    if (result instanceof Promise) {
                        proms.push(result.then((result) => {
                            if (result.issues.length) {
                                payload.issues.push(...schemas_util.prefixIssues(key, result.issues));
                            }
                            payload.value[outKey] = result.value;
                        }));
                    }
                    else {
                        if (result.issues.length) {
                            payload.issues.push(...schemas_util.prefixIssues(key, result.issues));
                        }
                        payload.value[outKey] = result.value;
                    }
                }
            }
            let unrecognized;
            for (const key in input) {
                if (!recordKeys.has(key)) {
                    unrecognized = unrecognized ?? [];
                    unrecognized.push(key);
                }
            }
            if (unrecognized && unrecognized.length > 0) {
                payload.issues.push({
                    code: "unrecognized_keys",
                    input,
                    inst,
                    keys: unrecognized,
                });
            }
        }
        else {
            payload.value = {};
            // Reflect.ownKeys for Symbol-key support; filter non-enumerable to match z.object()
            for (const key of Reflect.ownKeys(input)) {
                if (key === "__proto__")
                    continue;
                if (!Object.prototype.propertyIsEnumerable.call(input, key))
                    continue;
                let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
                if (keyResult instanceof Promise) {
                    throw new Error("Async schemas not supported in object keys currently");
                }
                // Numeric string fallback: if key is a numeric string and failed, retry with Number(key)
                // This handles z.number(), z.literal([1, 2, 3]), and unions containing numeric literals
                const checkNumericKey = typeof key === "string" && regexes.number.test(key) && keyResult.issues.length;
                if (checkNumericKey) {
                    const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
                    if (retryResult instanceof Promise) {
                        throw new Error("Async schemas not supported in object keys currently");
                    }
                    if (retryResult.issues.length === 0) {
                        keyResult = retryResult;
                    }
                }
                if (keyResult.issues.length) {
                    if (def.mode === "loose") {
                        // Pass through unchanged
                        payload.value[key] = input[key];
                    }
                    else {
                        // Default "strict" behavior: error on invalid key
                        payload.issues.push({
                            code: "invalid_key",
                            origin: "record",
                            issues: keyResult.issues.map((iss) => schemas_util.finalizeIssue(iss, ctx, schemas_core.config())),
                            input: key,
                            path: [key],
                            inst,
                        });
                    }
                    continue;
                }
                const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => {
                        if (result.issues.length) {
                            payload.issues.push(...schemas_util.prefixIssues(key, result.issues));
                        }
                        payload.value[keyResult.value] = result.value;
                    }));
                }
                else {
                    if (result.issues.length) {
                        payload.issues.push(...schemas_util.prefixIssues(key, result.issues));
                    }
                    payload.value[keyResult.value] = result.value;
                }
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload;
    };
})));
const $ZodMap = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodMap", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Map)) {
            payload.issues.push({
                expected: "map",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        payload.value = new Map();
        for (const [key, value] of input) {
            const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
            const valueResult = def.valueType._zod.run({ value: value, issues: [] }, ctx);
            if (keyResult instanceof Promise || valueResult instanceof Promise) {
                proms.push(Promise.all([keyResult, valueResult]).then(([keyResult, valueResult]) => {
                    handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
                }));
            }
            else {
                handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
            }
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
})));
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
    if (keyResult.issues.length) {
        if (schemas_util.propertyKeyTypes.has(typeof key)) {
            final.issues.push(...schemas_util.prefixIssues(key, keyResult.issues));
        }
        else {
            final.issues.push({
                code: "invalid_key",
                origin: "map",
                input,
                inst,
                issues: keyResult.issues.map((iss) => schemas_util.finalizeIssue(iss, ctx, schemas_core.config())),
            });
        }
    }
    if (valueResult.issues.length) {
        if (schemas_util.propertyKeyTypes.has(typeof key)) {
            final.issues.push(...schemas_util.prefixIssues(key, valueResult.issues));
        }
        else {
            final.issues.push({
                origin: "map",
                code: "invalid_element",
                input,
                inst,
                key: key,
                issues: valueResult.issues.map((iss) => schemas_util.finalizeIssue(iss, ctx, schemas_core.config())),
            });
        }
    }
    final.value.set(keyResult.value, valueResult.value);
}
const $ZodSet = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodSet", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Set)) {
            payload.issues.push({
                input,
                inst,
                expected: "set",
                code: "invalid_type",
            });
            return payload;
        }
        const proms = [];
        payload.value = new Set();
        for (const item of input) {
            const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleSetResult(result, payload)));
            }
            else
                handleSetResult(result, payload);
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
})));
function handleSetResult(result, final) {
    if (result.issues.length) {
        final.issues.push(...result.issues);
    }
    final.value.add(result.value);
}
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    const values = getEnumValues(def.entries);
    const valuesSet = new Set(values);
    inst._zod.values = valuesSet;
    inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (valuesSet.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    if (def.values.length === 0) {
        throw new Error("Cannot create literal schema with no valid values");
    }
    const values = new Set(def.values);
    inst._zod.values = values;
    inst._zod.pattern = new RegExp(`^(${def.values
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values: def.values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodFile = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodFile", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        // @ts-ignore
        if (input instanceof File)
            return payload;
        payload.issues.push({
            expected: "file",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
})));
const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            throw new $ZodEncodeError(inst.constructor.name);
        }
        const _out = def.transform(payload.value, payload);
        if (ctx.async) {
            const output = _out instanceof Promise ? _out : Promise.resolve(_out);
            return output.then((output) => {
                payload.value = output;
                payload.fallback = true;
                return payload;
            });
        }
        if (_out instanceof Promise) {
            throw new $ZodAsyncError();
        }
        payload.value = _out;
        payload.fallback = true;
        return payload;
    };
});
function handleOptionalResult(result, input) {
    if (input === undefined && (result.issues.length || result.fallback)) {
        return { issues: [], value: undefined };
    }
    return result;
}
const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
            const input = payload.value;
            const result = def.innerType._zod.run(payload, ctx);
            if (result instanceof Promise)
                return result.then((r) => handleOptionalResult(r, input));
            return handleOptionalResult(result, input);
        }
        if (payload.value === undefined) {
            return payload;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
    // Call parent init - inherits optin/optout = "optional"
    $ZodOptional.init(inst, def);
    // Override values/pattern to NOT add undefined
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
    // Override parse to just delegate (no undefined handling)
    inst._zod.parse = (payload, ctx) => {
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
    });
    defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        // Forward direction (decode): allow null to pass through
        if (payload.value === null)
            return payload;
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def);
    // inst._zod.qin = "true";
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        // Forward direction (decode): apply defaults for undefined input
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
            /**
             * $ZodDefault returns the default value immediately in forward direction.
             * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
            return payload;
        }
        // Forward direction: continue with default handling
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleDefaultResult(result, def));
        }
        return handleDefaultResult(result, def);
    };
});
function handleDefaultResult(payload, def) {
    if (payload.value === undefined) {
        payload.value = def.defaultValue;
    }
    return payload;
}
const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        // Forward direction (decode): apply prefault for undefined input
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => {
        const v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleNonOptionalResult(result, inst));
        }
        return handleNonOptionalResult(result, inst);
    };
});
function handleNonOptionalResult(payload, inst) {
    if (!payload.issues.length && payload.value === undefined) {
        payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: payload.value,
            inst,
        });
    }
    return payload;
}
const $ZodSuccess = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodSuccess", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            throw new schemas_core.$ZodEncodeError("ZodSuccess");
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.issues.length === 0;
                return payload;
            });
        }
        payload.value = result.issues.length === 0;
        return payload;
    };
})));
const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        // Forward direction (decode): apply catch logic
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.value;
                if (result.issues.length) {
                    payload.value = def.catchValue({
                        ...payload,
                        error: {
                            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                        },
                        input: payload.value,
                    });
                    payload.issues = [];
                    payload.fallback = true;
                }
                return payload;
            });
        }
        payload.value = result.value;
        if (result.issues.length) {
            payload.value = def.catchValue({
                ...payload,
                error: {
                    issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                },
                input: payload.value,
            });
            payload.issues = [];
            payload.fallback = true;
        }
        return payload;
    };
});
const $ZodNaN = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodNaN", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "nan",
                code: "invalid_type",
            });
            return payload;
        }
        return payload;
    };
})));
const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            const right = def.out._zod.run(payload, ctx);
            if (right instanceof Promise) {
                return right.then((right) => handlePipeResult(right, def.in, ctx));
            }
            return handlePipeResult(right, def.in, ctx);
        }
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
            return left.then((left) => handlePipeResult(left, def.out, ctx));
        }
        return handlePipeResult(left, def.out, ctx);
    };
});
function handlePipeResult(left, next, ctx) {
    if (left.issues.length) {
        // prevent further checks
        left.aborted = true;
        return left;
    }
    return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
const $ZodCodec = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodCodec", (inst, def) => {
    $ZodType.init(inst, def);
    schemas_util.defineLazy(inst._zod, "values", () => def.in._zod.values);
    schemas_util.defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    schemas_util.defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    schemas_util.defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
        const direction = ctx.direction || "forward";
        if (direction === "forward") {
            const left = def.in._zod.run(payload, ctx);
            if (left instanceof Promise) {
                return left.then((left) => handleCodecAResult(left, def, ctx));
            }
            return handleCodecAResult(left, def, ctx);
        }
        else {
            const right = def.out._zod.run(payload, ctx);
            if (right instanceof Promise) {
                return right.then((right) => handleCodecAResult(right, def, ctx));
            }
            return handleCodecAResult(right, def, ctx);
        }
    };
})));
function handleCodecAResult(result, def, ctx) {
    if (result.issues.length) {
        // prevent further checks
        result.aborted = true;
        return result;
    }
    const direction = ctx.direction || "forward";
    if (direction === "forward") {
        const transformed = def.transform(result.value, result);
        if (transformed instanceof Promise) {
            return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
        }
        return handleCodecTxResult(result, transformed, def.out, ctx);
    }
    else {
        const transformed = def.reverseTransform(result.value, result);
        if (transformed instanceof Promise) {
            return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
        }
        return handleCodecTxResult(result, transformed, def.in, ctx);
    }
}
function handleCodecTxResult(left, value, nextSchema, ctx) {
    // Check if transform added any issues
    if (left.issues.length) {
        left.aborted = true;
        return left;
    }
    return nextSchema._zod.run({ value, issues: left.issues }, ctx);
}
const $ZodPreprocess = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodPreprocess", (inst, def) => {
    $ZodPipe.init(inst, def);
})));
const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
    defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then(handleReadonlyResult);
        }
        return handleReadonlyResult(result);
    };
});
function handleReadonlyResult(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
}
const $ZodTemplateLiteral = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodTemplateLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    const regexParts = [];
    for (const part of def.parts) {
        if (typeof part === "object" && part !== null) {
            // is Zod schema
            if (!part._zod.pattern) {
                // if (!source)
                throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
            }
            const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
            if (!source)
                throw new Error(`Invalid template literal part: ${part._zod.traits}`);
            const start = source.startsWith("^") ? 1 : 0;
            const end = source.endsWith("$") ? source.length - 1 : source.length;
            regexParts.push(source.slice(start, end));
        }
        else if (part === null || schemas_util.primitiveTypes.has(typeof part)) {
            regexParts.push(schemas_util.escapeRegex(`${part}`));
        }
        else {
            throw new Error(`Invalid template literal part: ${part}`);
        }
    }
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "string") {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "string",
                code: "invalid_type",
            });
            return payload;
        }
        inst._zod.pattern.lastIndex = 0;
        if (!inst._zod.pattern.test(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                code: "invalid_format",
                format: def.format ?? "template_literal",
                pattern: inst._zod.pattern.source,
            });
            return payload;
        }
        return payload;
    };
})));
const $ZodFunction = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodFunction", (inst, def) => {
    $ZodType.init(inst, def);
    inst._def = def;
    inst._zod.def = def;
    inst.implement = (func) => {
        if (typeof func !== "function") {
            throw new Error("implement() must be called with a function");
        }
        return function (...args) {
            const parsedArgs = inst._def.input ? schemas_parse(inst._def.input, args) : args;
            const result = Reflect.apply(func, this, parsedArgs);
            if (inst._def.output) {
                return schemas_parse(inst._def.output, result);
            }
            return result;
        };
    };
    inst.implementAsync = (func) => {
        if (typeof func !== "function") {
            throw new Error("implementAsync() must be called with a function");
        }
        return async function (...args) {
            const parsedArgs = inst._def.input ? await schemas_parseAsync(inst._def.input, args) : args;
            const result = await Reflect.apply(func, this, parsedArgs);
            if (inst._def.output) {
                return await schemas_parseAsync(inst._def.output, result);
            }
            return result;
        };
    };
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "function") {
            payload.issues.push({
                code: "invalid_type",
                expected: "function",
                input: payload.value,
                inst,
            });
            return payload;
        }
        // Check if output is a promise type to determine if we should use async implementation
        const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
        if (hasPromiseOutput) {
            payload.value = inst.implementAsync(payload.value);
        }
        else {
            payload.value = inst.implement(payload.value);
        }
        return payload;
    };
    inst.input = (...args) => {
        const F = inst.constructor;
        if (Array.isArray(args[0])) {
            return new F({
                type: "function",
                input: new $ZodTuple({
                    type: "tuple",
                    items: args[0],
                    rest: args[1],
                }),
                output: inst._def.output,
            });
        }
        return new F({
            type: "function",
            input: args[0],
            output: inst._def.output,
        });
    };
    inst.output = (output) => {
        const F = inst.constructor;
        return new F({
            type: "function",
            input: inst._def.input,
            output,
        });
    };
    return inst;
})));
const $ZodPromise = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodPromise", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
    };
})));
const $ZodLazy = /*@__PURE__*/ (/* unused pure expression or super */ null && (schemas_core.$constructor("$ZodLazy", (inst, def) => {
    $ZodType.init(inst, def);
    // Cache the resolved inner type on the shared `def` so all clones of this
    // lazy (e.g. via `.describe()`/`.meta()`) share the same inner instance,
    // preserving identity for cycle detection on recursive schemas.
    schemas_util.defineLazy(inst._zod, "innerType", () => {
        const d = def;
        if (!d._cachedInner)
            d._cachedInner = def.getter();
        return d._cachedInner;
    });
    schemas_util.defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
    schemas_util.defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
    schemas_util.defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? undefined);
    schemas_util.defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? undefined);
    inst._zod.parse = (payload, ctx) => {
        const inner = inst._zod.innerType;
        return inner._zod.run(payload, ctx);
    };
})));
const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _) => {
        return payload;
    };
    inst._zod.check = (payload) => {
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
            return r.then((r) => handleRefineResult(r, payload, input, inst));
        }
        handleRefineResult(r, payload, input, inst);
        return;
    };
});
function handleRefineResult(result, payload, input, inst) {
    if (!result) {
        const _iss = {
            code: "custom",
            input,
            inst, // incorporates params.error into issue reporting
            path: [...(inst._zod.def.path ?? [])], // incorporates params.error into issue reporting
            continue: !inst._zod.def.abort,
            // params: inst._zod.def.params,
        };
        if (inst._zod.def.params)
            _iss.params = inst._zod.def.params;
        payload.issues.push(util_issue(_iss));
    }
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
var registries_a;
const $output = Symbol("ZodOutput");
const $input = Symbol("ZodInput");
class $ZodRegistry {
    constructor() {
        this._map = new WeakMap();
        this._idmap = new Map();
    }
    add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
            this._idmap.set(meta.id, schema);
        }
        return this;
    }
    clear() {
        this._map = new WeakMap();
        this._idmap = new Map();
        return this;
    }
    remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) {
            this._idmap.delete(meta.id);
        }
        this._map.delete(schema);
        return this;
    }
    get(schema) {
        // return this._map.get(schema) as any;
        // inherit metadata
        const p = schema._zod.parent;
        if (p) {
            const pm = { ...(this.get(p) ?? {}) };
            delete pm.id; // do not inherit id
            const f = { ...pm, ...this._map.get(schema) };
            return Object.keys(f).length ? f : undefined;
        }
        return this._map.get(schema);
    }
    has(schema) {
        return this._map.has(schema);
    }
}
// registries
function registry() {
    return new $ZodRegistry();
}
(registries_a = globalThis).__zod_globalRegistry ?? (registries_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
/* unused harmony import specifier */ var api_checks;
/* unused harmony import specifier */ var schemas;
/* unused harmony import specifier */ var api_util;




// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
    return new Class({
        type: "string",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _coercedString(Class, params) {
    return new Class({
        type: "string",
        coerce: true,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
    return new Class({
        type: "string",
        format: "email",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
    return new Class({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v4",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v6",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v7",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
    return new Class({
        type: "string",
        format: "url",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function api_emoji(Class, params) {
    return new Class({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
    return new Class({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
/**
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link _cuid2} instead.
 * See https://github.com/paralleldrive/cuid.
 */
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
    return new Class({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
    return new Class({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
    return new Class({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
    return new Class({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
    return new Class({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
    return new Class({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
    return new Class({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _mac(Class, params) {
    return new Class({
        type: "string",
        format: "mac",
        check: "string_format",
        abort: false,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
    return new Class({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
    return new Class({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
    return new Class({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
    return new Class({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
const TimePrecision = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6,
};
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
    return new Class({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: false,
        local: false,
        precision: null,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
    return new Class({
        type: "string",
        format: "date",
        check: "string_format",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
    return new Class({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
    return new Class({
        type: "string",
        format: "duration",
        check: "string_format",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
    return new Class({
        type: "number",
        checks: [],
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _coercedNumber(Class, params) {
    return new Class({
        type: "number",
        coerce: true,
        checks: [],
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "safeint",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _float32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float32",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _float64(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float64",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _int32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "int32",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uint32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "uint32",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
    return new Class({
        type: "boolean",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _coercedBoolean(Class, params) {
    return new Class({
        type: "boolean",
        coerce: true,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _bigint(Class, params) {
    return new Class({
        type: "bigint",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _coercedBigint(Class, params) {
    return new Class({
        type: "bigint",
        coerce: true,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _int64(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "int64",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uint64(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "uint64",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _symbol(Class, params) {
    return new Class({
        type: "symbol",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function api_undefined(Class, params) {
    return new Class({
        type: "undefined",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function api_null(Class, params) {
    return new Class({
        type: "null",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _any(Class) {
    return new Class({
        type: "any",
    });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
    return new Class({
        type: "unknown",
    });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
    return new Class({
        type: "never",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _void(Class, params) {
    return new Class({
        type: "void",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _date(Class, params) {
    return new Class({
        type: "date",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _coercedDate(Class, params) {
    return new Class({
        type: "date",
        coerce: true,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _nan(Class, params) {
    return new Class({
        type: "nan",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
    return new $ZodCheckLessThan({
        check: "less_than",
        ...normalizeParams(params),
        value,
        inclusive: false,
    });
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
    return new $ZodCheckLessThan({
        check: "less_than",
        ...normalizeParams(params),
        value,
        inclusive: true,
    });
}

// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
    return new $ZodCheckGreaterThan({
        check: "greater_than",
        ...normalizeParams(params),
        value,
        inclusive: false,
    });
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
    return new $ZodCheckGreaterThan({
        check: "greater_than",
        ...normalizeParams(params),
        value,
        inclusive: true,
    });
}

// @__NO_SIDE_EFFECTS__
function _positive(params) {
    return _gt(0, params);
}
// negative
// @__NO_SIDE_EFFECTS__
function _negative(params) {
    return _lt(0, params);
}
// nonpositive
// @__NO_SIDE_EFFECTS__
function _nonpositive(params) {
    return _lte(0, params);
}
// nonnegative
// @__NO_SIDE_EFFECTS__
function _nonnegative(params) {
    return _gte(0, params);
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
    return new $ZodCheckMultipleOf({
        check: "multiple_of",
        ...normalizeParams(params),
        value,
    });
}
// @__NO_SIDE_EFFECTS__
function _maxSize(maximum, params) {
    return new api_checks.$ZodCheckMaxSize({
        check: "max_size",
        ...api_util.normalizeParams(params),
        maximum,
    });
}
// @__NO_SIDE_EFFECTS__
function _minSize(minimum, params) {
    return new api_checks.$ZodCheckMinSize({
        check: "min_size",
        ...api_util.normalizeParams(params),
        minimum,
    });
}
// @__NO_SIDE_EFFECTS__
function _size(size, params) {
    return new api_checks.$ZodCheckSizeEquals({
        check: "size_equals",
        ...api_util.normalizeParams(params),
        size,
    });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
    const ch = new $ZodCheckMaxLength({
        check: "max_length",
        ...normalizeParams(params),
        maximum,
    });
    return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
    return new $ZodCheckMinLength({
        check: "min_length",
        ...normalizeParams(params),
        minimum,
    });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
    return new $ZodCheckLengthEquals({
        check: "length_equals",
        ...normalizeParams(params),
        length,
    });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
    return new $ZodCheckRegex({
        check: "string_format",
        format: "regex",
        ...normalizeParams(params),
        pattern,
    });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
    return new $ZodCheckLowerCase({
        check: "string_format",
        format: "lowercase",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
    return new $ZodCheckUpperCase({
        check: "string_format",
        format: "uppercase",
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
    return new $ZodCheckIncludes({
        check: "string_format",
        format: "includes",
        ...normalizeParams(params),
        includes,
    });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
    return new $ZodCheckStartsWith({
        check: "string_format",
        format: "starts_with",
        ...normalizeParams(params),
        prefix,
    });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
    return new $ZodCheckEndsWith({
        check: "string_format",
        format: "ends_with",
        ...normalizeParams(params),
        suffix,
    });
}
// @__NO_SIDE_EFFECTS__
function _property(property, schema, params) {
    return new api_checks.$ZodCheckProperty({
        check: "property",
        property,
        schema,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _mime(types, params) {
    return new api_checks.$ZodCheckMimeType({
        check: "mime_type",
        mime: types,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
    return new $ZodCheckOverwrite({
        check: "overwrite",
        tx,
    });
}
// normalize
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
    return _overwrite((input) => input.normalize(form));
}
// trim
// @__NO_SIDE_EFFECTS__
function _trim() {
    return _overwrite((input) => input.trim());
}
// toLowerCase
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
    return _overwrite((input) => input.toLowerCase());
}
// toUpperCase
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
    return _overwrite((input) => input.toUpperCase());
}
// slugify
// @__NO_SIDE_EFFECTS__
function _slugify() {
    return _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
    return new Class({
        type: "array",
        element,
        // get element() {
        //   return element;
        // },
        ...normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _union(Class, options, params) {
    return new Class({
        type: "union",
        options,
        ...api_util.normalizeParams(params),
    });
}
function _xor(Class, options, params) {
    return new Class({
        type: "union",
        options,
        inclusive: false,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _discriminatedUnion(Class, discriminator, options, params) {
    return new Class({
        type: "union",
        options,
        discriminator,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _intersection(Class, left, right) {
    return new Class({
        type: "intersection",
        left,
        right,
    });
}
// export function _tuple(
//   Class: util.SchemaClass<schemas.$ZodTuple>,
//   items: [],
//   params?: string | $ZodTupleParams
// ): schemas.$ZodTuple<[], null>;
// @__NO_SIDE_EFFECTS__
function _tuple(Class, items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof schemas.$ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new Class({
        type: "tuple",
        items,
        rest,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _record(Class, keyType, valueType, params) {
    return new Class({
        type: "record",
        keyType,
        valueType,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _map(Class, keyType, valueType, params) {
    return new Class({
        type: "map",
        keyType,
        valueType,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _set(Class, valueType, params) {
    return new Class({
        type: "set",
        valueType,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _enum(Class, values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    // if (Array.isArray(values)) {
    //   for (const value of values) {
    //     entries[value] = value;
    //   }
    // } else {
    //   Object.assign(entries, values);
    // }
    // const entries: util.EnumLike = {};
    // for (const val of values) {
    //   entries[val] = val;
    // }
    return new Class({
        type: "enum",
        entries,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
 *
 * ```ts
 * enum Colors { red, green, blue }
 * z.enum(Colors);
 * ```
 */
function _nativeEnum(Class, entries, params) {
    return new Class({
        type: "enum",
        entries,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _literal(Class, value, params) {
    return new Class({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _file(Class, params) {
    return new Class({
        type: "file",
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _transform(Class, fn) {
    return new Class({
        type: "transform",
        transform: fn,
    });
}
// @__NO_SIDE_EFFECTS__
function _optional(Class, innerType) {
    return new Class({
        type: "optional",
        innerType,
    });
}
// @__NO_SIDE_EFFECTS__
function _nullable(Class, innerType) {
    return new Class({
        type: "nullable",
        innerType,
    });
}
// @__NO_SIDE_EFFECTS__
function _default(Class, innerType, defaultValue) {
    return new Class({
        type: "default",
        innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : api_util.shallowClone(defaultValue);
        },
    });
}
// @__NO_SIDE_EFFECTS__
function _nonoptional(Class, innerType, params) {
    return new Class({
        type: "nonoptional",
        innerType,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _success(Class, innerType) {
    return new Class({
        type: "success",
        innerType,
    });
}
// @__NO_SIDE_EFFECTS__
function _catch(Class, innerType, catchValue) {
    return new Class({
        type: "catch",
        innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}
// @__NO_SIDE_EFFECTS__
function _pipe(Class, in_, out) {
    return new Class({
        type: "pipe",
        in: in_,
        out,
    });
}
// @__NO_SIDE_EFFECTS__
function _readonly(Class, innerType) {
    return new Class({
        type: "readonly",
        innerType,
    });
}
// @__NO_SIDE_EFFECTS__
function _templateLiteral(Class, parts, params) {
    return new Class({
        type: "template_literal",
        parts,
        ...api_util.normalizeParams(params),
    });
}
// @__NO_SIDE_EFFECTS__
function _lazy(Class, getter) {
    return new Class({
        type: "lazy",
        getter,
    });
}
// @__NO_SIDE_EFFECTS__
function _promise(Class, innerType) {
    return new Class({
        type: "promise",
        innerType,
    });
}
// @__NO_SIDE_EFFECTS__
function _custom(Class, fn, _params) {
    const norm = api_util.normalizeParams(_params);
    norm.abort ?? (norm.abort = true); // default to abort:false
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...norm,
    });
    return schema;
}
// same as _custom but defaults to abort:false
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...normalizeParams(_params),
    });
    return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
    const ch = _check((payload) => {
        payload.addIssue = (issue) => {
            if (typeof issue === "string") {
                payload.issues.push(util_issue(issue, payload.value, ch._zod.def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = ch);
                _issue.continue ?? (_issue.continue = !ch._zod.def.abort); // abort is always undefined, so this is always true...
                payload.issues.push(util_issue(_issue));
            }
        };
        return fn(payload.value, payload);
    }, params);
    return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
    const ch = new $ZodCheck({
        check: "custom",
        ...normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
// @__NO_SIDE_EFFECTS__
function describe(description) {
    const ch = new $ZodCheck({ check: "describe" });
    ch._zod.onattach = [
        (inst) => {
            const existing = globalRegistry.get(inst) ?? {};
            globalRegistry.add(inst, { ...existing, description });
        },
    ];
    ch._zod.check = () => { }; // no-op check
    return ch;
}
// @__NO_SIDE_EFFECTS__
function meta(metadata) {
    const ch = new $ZodCheck({ check: "meta" });
    ch._zod.onattach = [
        (inst) => {
            const existing = globalRegistry.get(inst) ?? {};
            globalRegistry.add(inst, { ...existing, ...metadata });
        },
    ];
    ch._zod.check = () => { }; // no-op check
    return ch;
}
// @__NO_SIDE_EFFECTS__
function _stringbool(Classes, _params) {
    const params = api_util.normalizeParams(_params);
    let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
    let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (params.case !== "sensitive") {
        truthyArray = truthyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
        falsyArray = falsyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
    }
    const truthySet = new Set(truthyArray);
    const falsySet = new Set(falsyArray);
    const _Codec = Classes.Codec ?? schemas.$ZodCodec;
    const _Boolean = Classes.Boolean ?? schemas.$ZodBoolean;
    const _String = Classes.String ?? schemas.$ZodString;
    const stringSchema = new _String({ type: "string", error: params.error });
    const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
    const codec = new _Codec({
        type: "pipe",
        in: stringSchema,
        out: booleanSchema,
        transform: ((input, payload) => {
            let data = input;
            if (params.case !== "sensitive")
                data = data.toLowerCase();
            if (truthySet.has(data)) {
                return true;
            }
            else if (falsySet.has(data)) {
                return false;
            }
            else {
                payload.issues.push({
                    code: "invalid_value",
                    expected: "stringbool",
                    values: [...truthySet, ...falsySet],
                    input: payload.value,
                    inst: codec,
                    continue: false,
                });
                return {};
            }
        }),
        reverseTransform: ((input, _payload) => {
            if (input === true) {
                return truthyArray[0] || "true";
            }
            else {
                return falsyArray[0] || "false";
            }
        }),
        error: params.error,
    });
    return codec;
}
// @__NO_SIDE_EFFECTS__
function _stringFormat(Class, format, fnOrRegex, _params = {}) {
    const params = api_util.normalizeParams(_params);
    const def = {
        ...api_util.normalizeParams(_params),
        check: "string_format",
        type: "string",
        format,
        fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
        ...params,
    };
    if (fnOrRegex instanceof RegExp) {
        def.pattern = fnOrRegex;
    }
    const inst = new Class(def);
    return inst;
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js

// function initializeContext<T extends schemas.$ZodType>(inputs: JSONSchemaGeneratorParams<T>): ToJSONSchemaContext<T> {
//   return {
//     processor: inputs.processor,
//     metadataRegistry: inputs.metadata ?? globalRegistry,
//     target: inputs.target ?? "draft-2020-12",
//     unrepresentable: inputs.unrepresentable ?? "throw",
//   };
// }
function initializeContext(params) {
    // Normalize target: convert old non-hyphenated versions to hyphenated versions
    let target = params?.target ?? "draft-2020-12";
    if (target === "draft-4")
        target = "draft-04";
    if (target === "draft-7")
        target = "draft-07";
    return {
        processors: params.processors ?? {},
        metadataRegistry: params?.metadata ?? globalRegistry,
        target,
        unrepresentable: params?.unrepresentable ?? "throw",
        override: params?.override ?? (() => { }),
        io: params?.io ?? "output",
        counter: 0,
        seen: new Map(),
        cycles: params?.cycles ?? "ref",
        reused: params?.reused ?? "inline",
        external: params?.external ?? undefined,
    };
}
function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
    var _a;
    const def = schema._zod.def;
    // check for schema in seens
    const seen = ctx.seen.get(schema);
    if (seen) {
        seen.count++;
        // check if cycle
        const isCycle = _params.schemaPath.includes(schema);
        if (isCycle) {
            seen.cycle = _params.path;
        }
        return seen.schema;
    }
    // initialize
    const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
    ctx.seen.set(schema, result);
    // custom method overrides default behavior
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
        result.schema = overrideSchema;
    }
    else {
        const params = {
            ..._params,
            schemaPath: [..._params.schemaPath, schema],
            path: _params.path,
        };
        if (schema._zod.processJSONSchema) {
            schema._zod.processJSONSchema(ctx, result.schema, params);
        }
        else {
            const _json = result.schema;
            const processor = ctx.processors[def.type];
            if (!processor) {
                throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
            }
            processor(schema, ctx, _json, params);
        }
        const parent = schema._zod.parent;
        if (parent) {
            // Also set ref if processor didn't (for inheritance)
            if (!result.ref)
                result.ref = parent;
            process(parent, ctx, params);
            ctx.seen.get(parent).isParent = true;
        }
    }
    // metadata
    const meta = ctx.metadataRegistry.get(schema);
    if (meta)
        Object.assign(result.schema, meta);
    if (ctx.io === "input" && isTransforming(schema)) {
        // examples/defaults only apply to output type of pipe
        delete result.schema.examples;
        delete result.schema.default;
    }
    // set prefault as default
    if (ctx.io === "input" && "_prefault" in result.schema)
        (_a = result.schema).default ?? (_a.default = result.schema._prefault);
    delete result.schema._prefault;
    // pulling fresh from ctx.seen in case it was overwritten
    const _result = ctx.seen.get(schema);
    return _result.schema;
}
function extractDefs(ctx, schema
// params: EmitParams
) {
    // iterate over seen map;
    const root = ctx.seen.get(schema);
    if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
    // Track ids to detect duplicates across different schemas
    const idToSchema = new Map();
    for (const entry of ctx.seen.entries()) {
        const id = ctx.metadataRegistry.get(entry[0])?.id;
        if (id) {
            const existing = idToSchema.get(id);
            if (existing && existing !== entry[0]) {
                throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
            }
            idToSchema.set(id, entry[0]);
        }
    }
    // returns a ref to the schema
    // defId will be empty if the ref points to an external schema (or #)
    const makeURI = (entry) => {
        // comparing the seen objects because sometimes
        // multiple schemas map to the same seen object.
        // e.g. lazy
        // external is configured
        const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
        if (ctx.external) {
            const externalId = ctx.external.registry.get(entry[0])?.id; // ?? "__shared";// `__schema${ctx.counter++}`;
            // check if schema is in the external registry
            const uriGenerator = ctx.external.uri ?? ((id) => id);
            if (externalId) {
                return { ref: uriGenerator(externalId) };
            }
            // otherwise, add to __shared
            const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
            entry[1].defId = id; // set defId so it will be reused if needed
            return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
        }
        if (entry[1] === root) {
            return { ref: "#" };
        }
        // self-contained schema
        const uriPrefix = `#`;
        const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
        const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
        return { defId, ref: defUriPrefix + defId };
    };
    // stored cached version in `def` property
    // remove all properties, set $ref
    const extractToDef = (entry) => {
        // if the schema is already a reference, do not extract it
        if (entry[1].schema.$ref) {
            return;
        }
        const seen = entry[1];
        const { ref, defId } = makeURI(entry);
        seen.def = { ...seen.schema };
        // defId won't be set if the schema is a reference to an external schema
        // or if the schema is the root schema
        if (defId)
            seen.defId = defId;
        // wipe away all properties except $ref
        const schema = seen.schema;
        for (const key in schema) {
            delete schema[key];
        }
        schema.$ref = ref;
    };
    // throw on cycles
    // break cycles
    if (ctx.cycles === "throw") {
        for (const entry of ctx.seen.entries()) {
            const seen = entry[1];
            if (seen.cycle) {
                throw new Error("Cycle detected: " +
                    `#/${seen.cycle?.join("/")}/<root>` +
                    '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
            }
        }
    }
    // extract schemas into $defs
    for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        // convert root schema to # $ref
        if (schema === entry[0]) {
            extractToDef(entry); // this has special handling for the root schema
            continue;
        }
        // extract schemas that are in the external registry
        if (ctx.external) {
            const ext = ctx.external.registry.get(entry[0])?.id;
            if (schema !== entry[0] && ext) {
                extractToDef(entry);
                continue;
            }
        }
        // extract schemas with `id` meta
        const id = ctx.metadataRegistry.get(entry[0])?.id;
        if (id) {
            extractToDef(entry);
            continue;
        }
        // break cycles
        if (seen.cycle) {
            // any
            extractToDef(entry);
            continue;
        }
        // extract reused schemas
        if (seen.count > 1) {
            if (ctx.reused === "ref") {
                extractToDef(entry);
                // biome-ignore lint:
                continue;
            }
        }
    }
}
function finalize(ctx, schema) {
    const root = ctx.seen.get(schema);
    if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
    // flatten refs - inherit properties from parent schemas
    const flattenRef = (zodSchema) => {
        const seen = ctx.seen.get(zodSchema);
        // already processed
        if (seen.ref === null)
            return;
        const schema = seen.def ?? seen.schema;
        const _cached = { ...schema };
        const ref = seen.ref;
        seen.ref = null; // prevent infinite recursion
        if (ref) {
            flattenRef(ref);
            const refSeen = ctx.seen.get(ref);
            const refSchema = refSeen.schema;
            // merge referenced schema into current
            if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
                // older drafts can't combine $ref with other properties
                schema.allOf = schema.allOf ?? [];
                schema.allOf.push(refSchema);
            }
            else {
                Object.assign(schema, refSchema);
            }
            // restore child's own properties (child wins)
            Object.assign(schema, _cached);
            const isParentRef = zodSchema._zod.parent === ref;
            // For parent chain, child is a refinement - remove parent-only properties
            if (isParentRef) {
                for (const key in schema) {
                    if (key === "$ref" || key === "allOf")
                        continue;
                    if (!(key in _cached)) {
                        delete schema[key];
                    }
                }
            }
            // When ref was extracted to $defs, remove properties that match the definition
            if (refSchema.$ref && refSeen.def) {
                for (const key in schema) {
                    if (key === "$ref" || key === "allOf")
                        continue;
                    if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
                        delete schema[key];
                    }
                }
            }
        }
        // If parent was extracted (has $ref), propagate $ref to this schema
        // This handles cases like: readonly().meta({id}).describe()
        // where processor sets ref to innerType but parent should be referenced
        const parent = zodSchema._zod.parent;
        if (parent && parent !== ref) {
            // Ensure parent is processed first so its def has inherited properties
            flattenRef(parent);
            const parentSeen = ctx.seen.get(parent);
            if (parentSeen?.schema.$ref) {
                schema.$ref = parentSeen.schema.$ref;
                // De-duplicate with parent's definition
                if (parentSeen.def) {
                    for (const key in schema) {
                        if (key === "$ref" || key === "allOf")
                            continue;
                        if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
                            delete schema[key];
                        }
                    }
                }
            }
        }
        // execute overrides
        ctx.override({
            zodSchema: zodSchema,
            jsonSchema: schema,
            path: seen.path ?? [],
        });
    };
    for (const entry of [...ctx.seen.entries()].reverse()) {
        flattenRef(entry[0]);
    }
    const result = {};
    if (ctx.target === "draft-2020-12") {
        result.$schema = "https://json-schema.org/draft/2020-12/schema";
    }
    else if (ctx.target === "draft-07") {
        result.$schema = "http://json-schema.org/draft-07/schema#";
    }
    else if (ctx.target === "draft-04") {
        result.$schema = "http://json-schema.org/draft-04/schema#";
    }
    else if (ctx.target === "openapi-3.0") {
        // OpenAPI 3.0 schema objects should not include a $schema property
    }
    else {
        // Arbitrary string values are allowed but won't have a $schema property set
    }
    if (ctx.external?.uri) {
        const id = ctx.external.registry.get(schema)?.id;
        if (!id)
            throw new Error("Schema is missing an `id` property");
        result.$id = ctx.external.uri(id);
    }
    Object.assign(result, root.def ?? root.schema);
    // The `id` in `.meta()` is a Zod-specific registration tag used to extract
    // schemas into $defs — it is not user-facing JSON Schema metadata. Strip it
    // from the output body where it would otherwise leak. The id is preserved
    // implicitly via the $defs key (and via $ref paths).
    const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
    if (rootMetaId !== undefined && result.id === rootMetaId)
        delete result.id;
    // build defs object
    const defs = ctx.external?.defs ?? {};
    for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        if (seen.def && seen.defId) {
            if (seen.def.id === seen.defId)
                delete seen.def.id;
            defs[seen.defId] = seen.def;
        }
    }
    // set definitions in result
    if (ctx.external) {
    }
    else {
        if (Object.keys(defs).length > 0) {
            if (ctx.target === "draft-2020-12") {
                result.$defs = defs;
            }
            else {
                result.definitions = defs;
            }
        }
    }
    try {
        // this "finalizes" this schema and ensures all cycles are removed
        // each call to finalize() is functionally independent
        // though the seen map is shared
        const finalized = JSON.parse(JSON.stringify(result));
        Object.defineProperty(finalized, "~standard", {
            value: {
                ...schema["~standard"],
                jsonSchema: {
                    input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
                    output: createStandardJSONSchemaMethod(schema, "output", ctx.processors),
                },
            },
            enumerable: false,
            writable: false,
        });
        return finalized;
    }
    catch (_err) {
        throw new Error("Error converting schema to JSON.");
    }
}
function isTransforming(_schema, _ctx) {
    const ctx = _ctx ?? { seen: new Set() };
    if (ctx.seen.has(_schema))
        return false;
    ctx.seen.add(_schema);
    const def = _schema._zod.def;
    if (def.type === "transform")
        return true;
    if (def.type === "array")
        return isTransforming(def.element, ctx);
    if (def.type === "set")
        return isTransforming(def.valueType, ctx);
    if (def.type === "lazy")
        return isTransforming(def.getter(), ctx);
    if (def.type === "promise" ||
        def.type === "optional" ||
        def.type === "nonoptional" ||
        def.type === "nullable" ||
        def.type === "readonly" ||
        def.type === "default" ||
        def.type === "prefault") {
        return isTransforming(def.innerType, ctx);
    }
    if (def.type === "intersection") {
        return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    if (def.type === "record" || def.type === "map") {
        return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    if (def.type === "pipe") {
        if (_schema._zod.traits.has("$ZodCodec"))
            return true;
        return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    if (def.type === "object") {
        for (const key in def.shape) {
            if (isTransforming(def.shape[key], ctx))
                return true;
        }
        return false;
    }
    if (def.type === "union") {
        for (const option of def.options) {
            if (isTransforming(option, ctx))
                return true;
        }
        return false;
    }
    if (def.type === "tuple") {
        for (const item of def.items) {
            if (isTransforming(item, ctx))
                return true;
        }
        if (def.rest && isTransforming(def.rest, ctx))
            return true;
        return false;
    }
    return false;
}
/**
 * Creates a toJSONSchema method for a schema instance.
 * This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
 */
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
    const ctx = initializeContext({ ...params, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
    const { libraryOptions, target } = params ?? {};
    const ctx = initializeContext({ ...(libraryOptions ?? {}), target, io, processors });
    process(schema, ctx);
    extractDefs(ctx, schema);
    return finalize(ctx, schema);
};

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
/* unused harmony import specifier */ var json_schema_processors_initializeContext;
/* unused harmony import specifier */ var json_schema_processors_process;
/* unused harmony import specifier */ var json_schema_processors_extractDefs;
/* unused harmony import specifier */ var json_schema_processors_finalize;


const formatMap = {
    guid: "uuid",
    url: "uri",
    datetime: "date-time",
    json_string: "json-string",
    regex: "", // do not set
};
// ==================== SIMPLE TYPE PROCESSORS ====================
const stringProcessor = (schema, ctx, _json, _params) => {
    const json = _json;
    json.type = "string";
    const { minimum, maximum, format, patterns, contentEncoding } = schema._zod
        .bag;
    if (typeof minimum === "number")
        json.minLength = minimum;
    if (typeof maximum === "number")
        json.maxLength = maximum;
    // custom pattern overrides format
    if (format) {
        json.format = formatMap[format] ?? format;
        if (json.format === "")
            delete json.format; // empty format is not valid
        // JSON Schema format: "time" requires a full time with offset or Z
        // z.iso.time() does not include timezone information, so format: "time" should never be used
        if (format === "time") {
            delete json.format;
        }
    }
    if (contentEncoding)
        json.contentEncoding = contentEncoding;
    if (patterns && patterns.size > 0) {
        const regexes = [...patterns];
        if (regexes.length === 1)
            json.pattern = regexes[0].source;
        else if (regexes.length > 1) {
            json.allOf = [
                ...regexes.map((regex) => ({
                    ...(ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0"
                        ? { type: "string" }
                        : {}),
                    pattern: regex.source,
                })),
            ];
        }
    }
};
const numberProcessor = (schema, ctx, _json, _params) => {
    const json = _json;
    const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
    if (typeof format === "string" && format.includes("int"))
        json.type = "integer";
    else
        json.type = "number";
    // when both minimum and exclusiveMinimum exist, pick the more restrictive one
    const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
    const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
    const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
    if (exMin) {
        if (legacy) {
            json.minimum = exclusiveMinimum;
            json.exclusiveMinimum = true;
        }
        else {
            json.exclusiveMinimum = exclusiveMinimum;
        }
    }
    else if (typeof minimum === "number") {
        json.minimum = minimum;
    }
    if (exMax) {
        if (legacy) {
            json.maximum = exclusiveMaximum;
            json.exclusiveMaximum = true;
        }
        else {
            json.exclusiveMaximum = exclusiveMaximum;
        }
    }
    else if (typeof maximum === "number") {
        json.maximum = maximum;
    }
    if (typeof multipleOf === "number")
        json.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
    json.type = "boolean";
};
const bigintProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt cannot be represented in JSON Schema");
    }
};
const symbolProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Symbols cannot be represented in JSON Schema");
    }
};
const nullProcessor = (_schema, ctx, json, _params) => {
    if (ctx.target === "openapi-3.0") {
        json.type = "string";
        json.nullable = true;
        json.enum = [null];
    }
    else {
        json.type = "null";
    }
};
const undefinedProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Undefined cannot be represented in JSON Schema");
    }
};
const voidProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Void cannot be represented in JSON Schema");
    }
};
const neverProcessor = (_schema, _ctx, json, _params) => {
    json.not = {};
};
const anyProcessor = (_schema, _ctx, _json, _params) => {
    // empty schema accepts anything
};
const unknownProcessor = (_schema, _ctx, _json, _params) => {
    // empty schema accepts anything
};
const dateProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Date cannot be represented in JSON Schema");
    }
};
const enumProcessor = (schema, _ctx, json, _params) => {
    const def = schema._zod.def;
    const values = getEnumValues(def.entries);
    // Number enums can have both string and number values
    if (values.every((v) => typeof v === "number"))
        json.type = "number";
    if (values.every((v) => typeof v === "string"))
        json.type = "string";
    json.enum = values;
};
const literalProcessor = (schema, ctx, json, _params) => {
    const def = schema._zod.def;
    const vals = [];
    for (const val of def.values) {
        if (val === undefined) {
            if (ctx.unrepresentable === "throw") {
                throw new Error("Literal `undefined` cannot be represented in JSON Schema");
            }
            else {
                // do not add to vals
            }
        }
        else if (typeof val === "bigint") {
            if (ctx.unrepresentable === "throw") {
                throw new Error("BigInt literals cannot be represented in JSON Schema");
            }
            else {
                vals.push(Number(val));
            }
        }
        else {
            vals.push(val);
        }
    }
    if (vals.length === 0) {
        // do nothing (an undefined literal was stripped)
    }
    else if (vals.length === 1) {
        const val = vals[0];
        json.type = val === null ? "null" : typeof val;
        if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
            json.enum = [val];
        }
        else {
            json.const = val;
        }
    }
    else {
        if (vals.every((v) => typeof v === "number"))
            json.type = "number";
        if (vals.every((v) => typeof v === "string"))
            json.type = "string";
        if (vals.every((v) => typeof v === "boolean"))
            json.type = "boolean";
        if (vals.every((v) => v === null))
            json.type = "null";
        json.enum = vals;
    }
};
const nanProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("NaN cannot be represented in JSON Schema");
    }
};
const templateLiteralProcessor = (schema, _ctx, json, _params) => {
    const _json = json;
    const pattern = schema._zod.pattern;
    if (!pattern)
        throw new Error("Pattern not found in template literal");
    _json.type = "string";
    _json.pattern = pattern.source;
};
const fileProcessor = (schema, _ctx, json, _params) => {
    const _json = json;
    const file = {
        type: "string",
        format: "binary",
        contentEncoding: "binary",
    };
    const { minimum, maximum, mime } = schema._zod.bag;
    if (minimum !== undefined)
        file.minLength = minimum;
    if (maximum !== undefined)
        file.maxLength = maximum;
    if (mime) {
        if (mime.length === 1) {
            file.contentMediaType = mime[0];
            Object.assign(_json, file);
        }
        else {
            Object.assign(_json, file); // shared props at root
            _json.anyOf = mime.map((m) => ({ contentMediaType: m })); // only contentMediaType differs
        }
    }
    else {
        Object.assign(_json, file);
    }
};
const successProcessor = (_schema, _ctx, json, _params) => {
    json.type = "boolean";
};
const customProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Custom types cannot be represented in JSON Schema");
    }
};
const functionProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Function types cannot be represented in JSON Schema");
    }
};
const transformProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Transforms cannot be represented in JSON Schema");
    }
};
const mapProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Map cannot be represented in JSON Schema");
    }
};
const setProcessor = (_schema, ctx, _json, _params) => {
    if (ctx.unrepresentable === "throw") {
        throw new Error("Set cannot be represented in JSON Schema");
    }
};
// ==================== COMPOSITE TYPE PROCESSORS ====================
const arrayProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number")
        json.minItems = minimum;
    if (typeof maximum === "number")
        json.maxItems = maximum;
    json.type = "array";
    json.items = process(def.element, ctx, {
        ...params,
        path: [...params.path, "items"],
    });
};
const objectProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "object";
    json.properties = {};
    const shape = def.shape;
    for (const key in shape) {
        json.properties[key] = process(shape[key], ctx, {
            ...params,
            path: [...params.path, "properties", key],
        });
    }
    // required keys
    const allKeys = new Set(Object.keys(shape));
    const requiredKeys = new Set([...allKeys].filter((key) => {
        const v = def.shape[key]._zod;
        if (ctx.io === "input") {
            return v.optin === undefined;
        }
        else {
            return v.optout === undefined;
        }
    }));
    if (requiredKeys.size > 0) {
        json.required = Array.from(requiredKeys);
    }
    // catchall
    if (def.catchall?._zod.def.type === "never") {
        // strict
        json.additionalProperties = false;
    }
    else if (!def.catchall) {
        // regular
        if (ctx.io === "output")
            json.additionalProperties = false;
    }
    else if (def.catchall) {
        json.additionalProperties = process(def.catchall, ctx, {
            ...params,
            path: [...params.path, "additionalProperties"],
        });
    }
};
const unionProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    // Exclusive unions (inclusive === false) use oneOf (exactly one match) instead of anyOf (one or more matches)
    // This includes both z.xor() and discriminated unions
    const isExclusive = def.inclusive === false;
    const options = def.options.map((x, i) => process(x, ctx, {
        ...params,
        path: [...params.path, isExclusive ? "oneOf" : "anyOf", i],
    }));
    if (isExclusive) {
        json.oneOf = options;
    }
    else {
        json.anyOf = options;
    }
};
const intersectionProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const a = process(def.left, ctx, {
        ...params,
        path: [...params.path, "allOf", 0],
    });
    const b = process(def.right, ctx, {
        ...params,
        path: [...params.path, "allOf", 1],
    });
    const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
    const allOf = [
        ...(isSimpleIntersection(a) ? a.allOf : [a]),
        ...(isSimpleIntersection(b) ? b.allOf : [b]),
    ];
    json.allOf = allOf;
};
const tupleProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "array";
    const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
    const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
    const prefixItems = def.items.map((x, i) => process(x, ctx, {
        ...params,
        path: [...params.path, prefixPath, i],
    }));
    const rest = def.rest
        ? process(def.rest, ctx, {
            ...params,
            path: [...params.path, restPath, ...(ctx.target === "openapi-3.0" ? [def.items.length] : [])],
        })
        : null;
    if (ctx.target === "draft-2020-12") {
        json.prefixItems = prefixItems;
        if (rest) {
            json.items = rest;
        }
    }
    else if (ctx.target === "openapi-3.0") {
        json.items = {
            anyOf: prefixItems,
        };
        if (rest) {
            json.items.anyOf.push(rest);
        }
        json.minItems = prefixItems.length;
        if (!rest) {
            json.maxItems = prefixItems.length;
        }
    }
    else {
        json.items = prefixItems;
        if (rest) {
            json.additionalItems = rest;
        }
    }
    // length
    const { minimum, maximum } = schema._zod.bag;
    if (typeof minimum === "number")
        json.minItems = minimum;
    if (typeof maximum === "number")
        json.maxItems = maximum;
};
const recordProcessor = (schema, ctx, _json, params) => {
    const json = _json;
    const def = schema._zod.def;
    json.type = "object";
    // For looseRecord with regex patterns, use patternProperties
    // This correctly represents "only validate keys matching the pattern" semantics
    // and composes well with allOf (intersections)
    const keyType = def.keyType;
    const keyBag = keyType._zod.bag;
    const patterns = keyBag?.patterns;
    if (def.mode === "loose" && patterns && patterns.size > 0) {
        // Use patternProperties for looseRecord with regex patterns
        const valueSchema = process(def.valueType, ctx, {
            ...params,
            path: [...params.path, "patternProperties", "*"],
        });
        json.patternProperties = {};
        for (const pattern of patterns) {
            json.patternProperties[pattern.source] = valueSchema;
        }
    }
    else {
        // Default behavior: use propertyNames + additionalProperties
        if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
            json.propertyNames = process(def.keyType, ctx, {
                ...params,
                path: [...params.path, "propertyNames"],
            });
        }
        json.additionalProperties = process(def.valueType, ctx, {
            ...params,
            path: [...params.path, "additionalProperties"],
        });
    }
    // Add required for keys with discrete values (enum, literal, etc.)
    const keyValues = keyType._zod.values;
    if (keyValues) {
        const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
        if (validKeyValues.length > 0) {
            json.required = validKeyValues;
        }
    }
};
const nullableProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    const inner = process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    if (ctx.target === "openapi-3.0") {
        seen.ref = def.innerType;
        json.nullable = true;
    }
    else {
        json.anyOf = [inner, { type: "null" }];
    }
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    if (ctx.io === "input")
        json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    let catchValue;
    try {
        catchValue = def.catchValue(undefined);
    }
    catch {
        throw new Error("Dynamic catch values are not supported in JSON Schema");
    }
    json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    const inIsTransform = def.in._zod.traits.has("$ZodTransform");
    const innerType = ctx.io === "input" ? (inIsTransform ? def.out : def.in) : def.out;
    process(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
    json.readOnly = true;
};
const promiseProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
};
const optionalProcessor = (schema, ctx, _json, params) => {
    const def = schema._zod.def;
    process(def.innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = def.innerType;
};
const lazyProcessor = (schema, ctx, _json, params) => {
    const innerType = schema._zod.innerType;
    process(innerType, ctx, params);
    const seen = ctx.seen.get(schema);
    seen.ref = innerType;
};
// ==================== ALL PROCESSORS ====================
const allProcessors = {
    string: stringProcessor,
    number: numberProcessor,
    boolean: booleanProcessor,
    bigint: bigintProcessor,
    symbol: symbolProcessor,
    null: nullProcessor,
    undefined: undefinedProcessor,
    void: voidProcessor,
    never: neverProcessor,
    any: anyProcessor,
    unknown: unknownProcessor,
    date: dateProcessor,
    enum: enumProcessor,
    literal: literalProcessor,
    nan: nanProcessor,
    template_literal: templateLiteralProcessor,
    file: fileProcessor,
    success: successProcessor,
    custom: customProcessor,
    function: functionProcessor,
    transform: transformProcessor,
    map: mapProcessor,
    set: setProcessor,
    array: arrayProcessor,
    object: objectProcessor,
    union: unionProcessor,
    intersection: intersectionProcessor,
    tuple: tupleProcessor,
    record: recordProcessor,
    nullable: nullableProcessor,
    nonoptional: nonoptionalProcessor,
    default: defaultProcessor,
    prefault: prefaultProcessor,
    catch: catchProcessor,
    pipe: pipeProcessor,
    readonly: readonlyProcessor,
    promise: promiseProcessor,
    optional: optionalProcessor,
    lazy: lazyProcessor,
};
function toJSONSchema(input, params) {
    if ("_idmap" in input) {
        // Registry case
        const registry = input;
        const ctx = json_schema_processors_initializeContext({ ...params, processors: allProcessors });
        const defs = {};
        // First pass: process all schemas to build the seen map
        for (const entry of registry._idmap.entries()) {
            const [_, schema] = entry;
            json_schema_processors_process(schema, ctx);
        }
        const schemas = {};
        const external = {
            registry,
            uri: params?.uri,
            defs,
        };
        // Update the context with external configuration
        ctx.external = external;
        // Second pass: emit each schema
        for (const entry of registry._idmap.entries()) {
            const [key, schema] = entry;
            json_schema_processors_extractDefs(ctx, schema);
            schemas[key] = json_schema_processors_finalize(ctx, schema);
        }
        if (Object.keys(defs).length > 0) {
            const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
            schemas.__shared = {
                [defsSegment]: defs,
            };
        }
        return { schemas };
    }
    // Single schema case
    const ctx = json_schema_processors_initializeContext({ ...params, processors: allProcessors });
    json_schema_processors_process(input, ctx);
    json_schema_processors_extractDefs(ctx, input);
    return json_schema_processors_finalize(ctx, input);
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js


const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
    $ZodISODateTime.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function iso_datetime(params) {
    return _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
    $ZodISODate.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function iso_date(params) {
    return _isoDate(ZodISODate, params);
}
const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
    $ZodISOTime.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function iso_time(params) {
    return _isoTime(ZodISOTime, params);
}
const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
    $ZodISODuration.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function iso_duration(params) {
    return _isoDuration(ZodISODuration, params);
}

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
/* unused harmony import specifier */ var errors_core;



const errors_initializer = (inst, issues) => {
    $ZodError.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
        format: {
            value: (mapper) => formatError(inst, mapper),
            // enumerable: false,
        },
        flatten: {
            value: (mapper) => flattenError(inst, mapper),
            // enumerable: false,
        },
        addIssue: {
            value: (issue) => {
                inst.issues.push(issue);
                inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
            },
            // enumerable: false,
        },
        addIssues: {
            value: (issues) => {
                inst.issues.push(...issues);
                inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
            },
            // enumerable: false,
        },
        isEmpty: {
            get() {
                return inst.issues.length === 0;
            },
            // enumerable: false,
        },
    });
    // Object.defineProperty(inst, "isEmpty", {
    //   get() {
    //     return inst.issues.length === 0;
    //   },
    // });
};
const ZodError = /*@__PURE__*/ (/* unused pure expression or super */ null && (errors_core.$constructor("ZodError", errors_initializer)));
const ZodRealError = /*@__PURE__*/ $constructor("ZodError", errors_initializer, {
    Parent: Error,
});
// /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
// export type ErrorMapCtx = core.$ZodErrorMapCtx;

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js


const parse_parse = /* @__PURE__ */ _parse(ZodRealError);
const parse_parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const parse_safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const parse_safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
// Codec functions
const parse_encode = /* @__PURE__ */ _encode(ZodRealError);
const parse_decode = /* @__PURE__ */ _decode(ZodRealError);
const parse_encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const parse_decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const parse_safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const parse_safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const parse_safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const parse_safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

;// ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
/* unused harmony import specifier */ var classic_schemas_core;
/* unused harmony import specifier */ var classic_schemas_util;
/* unused harmony import specifier */ var processors;
/* unused harmony import specifier */ var schemas_checks;







// Lazy-bind builder methods.
//
// Builder methods (`.optional`, `.array`, `.refine`, ...) live as
// non-enumerable getters on each concrete schema constructor's
// prototype. On first access from an instance the getter allocates
// `fn.bind(this)` and caches it as an own property on that instance,
// so detached usage (`const m = schema.optional; m()`) still works
// and the per-instance allocation only happens for methods actually
// touched.
//
// One install per (prototype, group), memoized by `_installedGroups`.
const _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
    const proto = Object.getPrototypeOf(inst);
    let installed = _installedGroups.get(proto);
    if (!installed) {
        installed = new Set();
        _installedGroups.set(proto, installed);
    }
    if (installed.has(group))
        return;
    installed.add(group);
    for (const key in methods) {
        const fn = methods[key];
        Object.defineProperty(proto, key, {
            configurable: true,
            enumerable: false,
            get() {
                const bound = fn.bind(this);
                Object.defineProperty(this, key, {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                    value: bound,
                });
                return bound;
            },
            set(v) {
                Object.defineProperty(this, key, {
                    configurable: true,
                    writable: true,
                    enumerable: true,
                    value: v,
                });
            },
        });
    }
}
const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
    $ZodType.init(inst, def);
    Object.assign(inst["~standard"], {
        jsonSchema: {
            input: createStandardJSONSchemaMethod(inst, "input"),
            output: createStandardJSONSchemaMethod(inst, "output"),
        },
    });
    inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
    inst.def = def;
    inst.type = def.type;
    Object.defineProperty(inst, "_def", { value: def });
    // Parse-family is intentionally kept as per-instance closures: these are
    // the hot path AND the most-detached methods (`arr.map(schema.parse)`,
    // `const { parse } = schema`, etc.). Eager closures here mean callers pay
    // ~12 closure allocations per schema but get monomorphic call sites and
    // detached usage that "just works".
    inst.parse = (data, params) => parse_parse(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => parse_safeParse(inst, data, params);
    inst.parseAsync = async (data, params) => parse_parseAsync(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => parse_safeParseAsync(inst, data, params);
    inst.spa = inst.safeParseAsync;
    inst.encode = (data, params) => parse_encode(inst, data, params);
    inst.decode = (data, params) => parse_decode(inst, data, params);
    inst.encodeAsync = async (data, params) => parse_encodeAsync(inst, data, params);
    inst.decodeAsync = async (data, params) => parse_decodeAsync(inst, data, params);
    inst.safeEncode = (data, params) => parse_safeEncode(inst, data, params);
    inst.safeDecode = (data, params) => parse_safeDecode(inst, data, params);
    inst.safeEncodeAsync = async (data, params) => parse_safeEncodeAsync(inst, data, params);
    inst.safeDecodeAsync = async (data, params) => parse_safeDecodeAsync(inst, data, params);
    // All builder methods are placed on the internal prototype as lazy-bind
    // getters. On first access per-instance, a bound thunk is allocated and
    // cached as an own property; subsequent accesses skip the getter. This
    // means: no per-instance allocation for unused methods, full
    // detachability preserved (`const m = schema.optional; m()` works), and
    // shared underlying function references across all instances.
    _installLazyMethods(inst, "ZodType", {
        check(...chks) {
            const def = this.def;
            return this.clone(mergeDefs(def, {
                checks: [
                    ...(def.checks ?? []),
                    ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
                ],
            }), { parent: true });
        },
        with(...chks) {
            return this.check(...chks);
        },
        clone(def, params) {
            return clone(this, def, params);
        },
        brand() {
            return this;
        },
        register(reg, meta) {
            reg.add(this, meta);
            return this;
        },
        refine(check, params) {
            return this.check(refine(check, params));
        },
        superRefine(refinement, params) {
            return this.check(superRefine(refinement, params));
        },
        overwrite(fn) {
            return this.check(_overwrite(fn));
        },
        optional() {
            return optional(this);
        },
        exactOptional() {
            return exactOptional(this);
        },
        nullable() {
            return nullable(this);
        },
        nullish() {
            return optional(nullable(this));
        },
        nonoptional(params) {
            return nonoptional(this, params);
        },
        array() {
            return array(this);
        },
        or(arg) {
            return union([this, arg]);
        },
        and(arg) {
            return intersection(this, arg);
        },
        transform(tx) {
            return pipe(this, transform(tx));
        },
        default(d) {
            return schemas_default(this, d);
        },
        prefault(d) {
            return prefault(this, d);
        },
        catch(params) {
            return schemas_catch(this, params);
        },
        pipe(target) {
            return pipe(this, target);
        },
        readonly() {
            return readonly(this);
        },
        describe(description) {
            const cl = this.clone();
            globalRegistry.add(cl, { description });
            return cl;
        },
        meta(...args) {
            // overloaded: meta() returns the registered metadata, meta(data)
            // returns a clone with `data` registered. The mapped type picks
            // up the second overload, so we accept variadic any-args and
            // return `any` to satisfy both at runtime.
            if (args.length === 0)
                return globalRegistry.get(this);
            const cl = this.clone();
            globalRegistry.add(cl, args[0]);
            return cl;
        },
        isOptional() {
            return this.safeParse(undefined).success;
        },
        isNullable() {
            return this.safeParse(null).success;
        },
        apply(fn) {
            return fn(this);
        },
    });
    Object.defineProperty(inst, "description", {
        get() {
            return globalRegistry.get(inst)?.description;
        },
        configurable: true,
    });
    return inst;
});
/** @internal */
const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    _installLazyMethods(inst, "_ZodString", {
        regex(...args) {
            return this.check(_regex(...args));
        },
        includes(...args) {
            return this.check(_includes(...args));
        },
        startsWith(...args) {
            return this.check(_startsWith(...args));
        },
        endsWith(...args) {
            return this.check(_endsWith(...args));
        },
        min(...args) {
            return this.check(_minLength(...args));
        },
        max(...args) {
            return this.check(_maxLength(...args));
        },
        length(...args) {
            return this.check(_length(...args));
        },
        nonempty(...args) {
            return this.check(_minLength(1, ...args));
        },
        lowercase(params) {
            return this.check(_lowercase(params));
        },
        uppercase(params) {
            return this.check(_uppercase(params));
        },
        trim() {
            return this.check(_trim());
        },
        normalize(...args) {
            return this.check(_normalize(...args));
        },
        toLowerCase() {
            return this.check(_toLowerCase());
        },
        toUpperCase() {
            return this.check(_toUpperCase());
        },
        slugify() {
            return this.check(_slugify());
        },
    });
});
const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_email(ZodEmail, params));
    inst.url = (params) => inst.check(_url(ZodURL, params));
    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
    inst.emoji = (params) => inst.check(api_emoji(ZodEmoji, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_xid(ZodXID, params));
    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
    // iso
    inst.datetime = (params) => inst.check(iso_datetime(params));
    inst.date = (params) => inst.check(iso_date(params));
    inst.time = (params) => inst.check(iso_time(params));
    inst.duration = (params) => inst.check(iso_duration(params));
});
function schemas_string(params) {
    return _string(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    _ZodString.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodEmail.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_email(params) {
    return classic_schemas_core._email(ZodEmail, params);
}
const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodGUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_guid(params) {
    return classic_schemas_core._guid(ZodGUID, params);
}
const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodUUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_uuid(params) {
    return classic_schemas_core._uuid(ZodUUID, params);
}
function uuidv4(params) {
    return classic_schemas_core._uuidv4(ZodUUID, params);
}
// ZodUUIDv6
function uuidv6(params) {
    return classic_schemas_core._uuidv6(ZodUUID, params);
}
// ZodUUIDv7
function uuidv7(params) {
    return classic_schemas_core._uuidv7(ZodUUID, params);
}
const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodURL.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function url(params) {
    return classic_schemas_core._url(ZodURL, params);
}
function httpUrl(params) {
    return classic_schemas_core._url(ZodURL, {
        protocol: classic_schemas_core.regexes.httpProtocol,
        hostname: classic_schemas_core.regexes.domain,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodEmoji.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_emoji(params) {
    return classic_schemas_core._emoji(ZodEmoji, params);
}
const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodNanoID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_nanoid(params) {
    return classic_schemas_core._nanoid(ZodNanoID, params);
}
/**
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link ZodCUID2} instead.
 * See https://github.com/paralleldrive/cuid.
 */
const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
/**
 * Validates a CUID v1 string.
 *
 * @deprecated CUID v1 is deprecated by its authors due to information leakage
 * (timestamps embedded in the id). Use {@link cuid2 | `z.cuid2()`} instead.
 * See https://github.com/paralleldrive/cuid.
 */
function schemas_cuid(params) {
    return classic_schemas_core._cuid(ZodCUID, params);
}
const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCUID2.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_cuid2(params) {
    return classic_schemas_core._cuid2(ZodCUID2, params);
}
const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodULID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_ulid(params) {
    return classic_schemas_core._ulid(ZodULID, params);
}
const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodXID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_xid(params) {
    return classic_schemas_core._xid(ZodXID, params);
}
const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodKSUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_ksuid(params) {
    return classic_schemas_core._ksuid(ZodKSUID, params);
}
const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodIPv4.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_ipv4(params) {
    return classic_schemas_core._ipv4(ZodIPv4, params);
}
const ZodMAC = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodMAC", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    classic_schemas_core.$ZodMAC.init(inst, def);
    ZodStringFormat.init(inst, def);
})));
function schemas_mac(params) {
    return classic_schemas_core._mac(ZodMAC, params);
}
const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodIPv6.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_ipv6(params) {
    return classic_schemas_core._ipv6(ZodIPv6, params);
}
const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
    $ZodCIDRv4.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_cidrv4(params) {
    return classic_schemas_core._cidrv4(ZodCIDRv4, params);
}
const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
    $ZodCIDRv6.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_cidrv6(params) {
    return classic_schemas_core._cidrv6(ZodCIDRv6, params);
}
const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodBase64.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_base64(params) {
    return classic_schemas_core._base64(ZodBase64, params);
}
const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodBase64URL.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_base64url(params) {
    return classic_schemas_core._base64url(ZodBase64URL, params);
}
const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodE164.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function schemas_e164(params) {
    return classic_schemas_core._e164(ZodE164, params);
}
const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodJWT.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function jwt(params) {
    return classic_schemas_core._jwt(ZodJWT, params);
}
const ZodCustomStringFormat = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodCustomStringFormat", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    classic_schemas_core.$ZodCustomStringFormat.init(inst, def);
    ZodStringFormat.init(inst, def);
})));
function stringFormat(format, fnOrRegex, _params = {}) {
    return classic_schemas_core._stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function schemas_hostname(_params) {
    return classic_schemas_core._stringFormat(ZodCustomStringFormat, "hostname", classic_schemas_core.regexes.hostname, _params);
}
function schemas_hex(_params) {
    return classic_schemas_core._stringFormat(ZodCustomStringFormat, "hex", classic_schemas_core.regexes.hex, _params);
}
function hash(alg, params) {
    const enc = params?.enc ?? "hex";
    const format = `${alg}_${enc}`;
    const regex = classic_schemas_core.regexes[format];
    if (!regex)
        throw new Error(`Unrecognized hash format: ${format}`);
    return classic_schemas_core._stringFormat(ZodCustomStringFormat, format, regex, params);
}
const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
    _installLazyMethods(inst, "ZodNumber", {
        gt(value, params) {
            return this.check(_gt(value, params));
        },
        gte(value, params) {
            return this.check(_gte(value, params));
        },
        min(value, params) {
            return this.check(_gte(value, params));
        },
        lt(value, params) {
            return this.check(_lt(value, params));
        },
        lte(value, params) {
            return this.check(_lte(value, params));
        },
        max(value, params) {
            return this.check(_lte(value, params));
        },
        int(params) {
            return this.check(schemas_int(params));
        },
        safe(params) {
            return this.check(schemas_int(params));
        },
        positive(params) {
            return this.check(_gt(0, params));
        },
        nonnegative(params) {
            return this.check(_gte(0, params));
        },
        negative(params) {
            return this.check(_lt(0, params));
        },
        nonpositive(params) {
            return this.check(_lte(0, params));
        },
        multipleOf(value, params) {
            return this.check(_multipleOf(value, params));
        },
        step(value, params) {
            return this.check(_multipleOf(value, params));
        },
        finite() {
            return this;
        },
    });
    const bag = inst._zod.bag;
    inst.minValue =
        Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    inst.maxValue =
        Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
});
function schemas_number(params) {
    return _number(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
    $ZodNumberFormat.init(inst, def);
    ZodNumber.init(inst, def);
});
function schemas_int(params) {
    return _int(ZodNumberFormat, params);
}
function float32(params) {
    return classic_schemas_core._float32(ZodNumberFormat, params);
}
function float64(params) {
    return classic_schemas_core._float64(ZodNumberFormat, params);
}
function int32(params) {
    return classic_schemas_core._int32(ZodNumberFormat, params);
}
function uint32(params) {
    return classic_schemas_core._uint32(ZodNumberFormat, params);
}
const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
    $ZodBoolean.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function schemas_boolean(params) {
    return _boolean(ZodBoolean, params);
}
const ZodBigInt = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodBigInt", (inst, def) => {
    classic_schemas_core.$ZodBigInt.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.bigintProcessor(inst, ctx, json, params);
    inst.gte = (value, params) => inst.check(schemas_checks.gte(value, params));
    inst.min = (value, params) => inst.check(schemas_checks.gte(value, params));
    inst.gt = (value, params) => inst.check(schemas_checks.gt(value, params));
    inst.gte = (value, params) => inst.check(schemas_checks.gte(value, params));
    inst.min = (value, params) => inst.check(schemas_checks.gte(value, params));
    inst.lt = (value, params) => inst.check(schemas_checks.lt(value, params));
    inst.lte = (value, params) => inst.check(schemas_checks.lte(value, params));
    inst.max = (value, params) => inst.check(schemas_checks.lte(value, params));
    inst.positive = (params) => inst.check(schemas_checks.gt(BigInt(0), params));
    inst.negative = (params) => inst.check(schemas_checks.lt(BigInt(0), params));
    inst.nonpositive = (params) => inst.check(schemas_checks.lte(BigInt(0), params));
    inst.nonnegative = (params) => inst.check(schemas_checks.gte(BigInt(0), params));
    inst.multipleOf = (value, params) => inst.check(schemas_checks.multipleOf(value, params));
    const bag = inst._zod.bag;
    inst.minValue = bag.minimum ?? null;
    inst.maxValue = bag.maximum ?? null;
    inst.format = bag.format ?? null;
})));
function schemas_bigint(params) {
    return classic_schemas_core._bigint(ZodBigInt, params);
}
const ZodBigIntFormat = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodBigIntFormat", (inst, def) => {
    classic_schemas_core.$ZodBigIntFormat.init(inst, def);
    ZodBigInt.init(inst, def);
})));
// int64
function int64(params) {
    return classic_schemas_core._int64(ZodBigIntFormat, params);
}
// uint64
function uint64(params) {
    return classic_schemas_core._uint64(ZodBigIntFormat, params);
}
const ZodSymbol = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodSymbol", (inst, def) => {
    classic_schemas_core.$ZodSymbol.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.symbolProcessor(inst, ctx, json, params);
})));
function symbol(params) {
    return classic_schemas_core._symbol(ZodSymbol, params);
}
const ZodUndefined = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodUndefined", (inst, def) => {
    classic_schemas_core.$ZodUndefined.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.undefinedProcessor(inst, ctx, json, params);
})));
function schemas_undefined(params) {
    return classic_schemas_core._undefined(ZodUndefined, params);
}

const ZodNull = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodNull", (inst, def) => {
    classic_schemas_core.$ZodNull.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.nullProcessor(inst, ctx, json, params);
})));
function schemas_null(params) {
    return classic_schemas_core._null(ZodNull, params);
}

const ZodAny = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodAny", (inst, def) => {
    classic_schemas_core.$ZodAny.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.anyProcessor(inst, ctx, json, params);
})));
function any() {
    return classic_schemas_core._any(ZodAny);
}
const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
    return _unknown(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
    $ZodNever.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
    return _never(ZodNever, params);
}
const ZodVoid = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodVoid", (inst, def) => {
    classic_schemas_core.$ZodVoid.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.voidProcessor(inst, ctx, json, params);
})));
function schemas_void(params) {
    return classic_schemas_core._void(ZodVoid, params);
}

const ZodDate = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodDate", (inst, def) => {
    classic_schemas_core.$ZodDate.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.dateProcessor(inst, ctx, json, params);
    inst.min = (value, params) => inst.check(schemas_checks.gte(value, params));
    inst.max = (value, params) => inst.check(schemas_checks.lte(value, params));
    const c = inst._zod.bag;
    inst.minDate = c.minimum ? new Date(c.minimum) : null;
    inst.maxDate = c.maximum ? new Date(c.maximum) : null;
})));
function schemas_date(params) {
    return classic_schemas_core._date(ZodDate, params);
}
const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
    inst.element = def.element;
    _installLazyMethods(inst, "ZodArray", {
        min(n, params) {
            return this.check(_minLength(n, params));
        },
        nonempty(params) {
            return this.check(_minLength(1, params));
        },
        max(n, params) {
            return this.check(_maxLength(n, params));
        },
        length(n, params) {
            return this.check(_length(n, params));
        },
        unwrap() {
            return this.element;
        },
    });
});
function array(element, params) {
    return _array(ZodArray, element, params);
}
// .keyof
function keyof(schema) {
    const shape = schema._zod.def.shape;
    return schemas_enum(Object.keys(shape));
}
const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
    $ZodObjectJIT.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
    defineLazy(inst, "shape", () => {
        return def.shape;
    });
    _installLazyMethods(inst, "ZodObject", {
        keyof() {
            return schemas_enum(Object.keys(this._zod.def.shape));
        },
        catchall(catchall) {
            return this.clone({ ...this._zod.def, catchall: catchall });
        },
        passthrough() {
            return this.clone({ ...this._zod.def, catchall: unknown() });
        },
        loose() {
            return this.clone({ ...this._zod.def, catchall: unknown() });
        },
        strict() {
            return this.clone({ ...this._zod.def, catchall: never() });
        },
        strip() {
            return this.clone({ ...this._zod.def, catchall: undefined });
        },
        extend(incoming) {
            return extend(this, incoming);
        },
        safeExtend(incoming) {
            return safeExtend(this, incoming);
        },
        merge(other) {
            return merge(this, other);
        },
        pick(mask) {
            return pick(this, mask);
        },
        omit(mask) {
            return omit(this, mask);
        },
        partial(...args) {
            return partial(ZodOptional, this, args[0]);
        },
        required(...args) {
            return required(ZodNonOptional, this, args[0]);
        },
    });
});
function object(shape, params) {
    const def = {
        type: "object",
        shape: shape ?? {},
        ...normalizeParams(params),
    };
    return new ZodObject(def);
}
// strictObject
function strictObject(shape, params) {
    return new ZodObject({
        type: "object",
        shape,
        catchall: never(),
        ...classic_schemas_util.normalizeParams(params),
    });
}
// looseObject
function looseObject(shape, params) {
    return new ZodObject({
        type: "object",
        shape,
        catchall: unknown(),
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
    inst.options = def.options;
});
function union(options, params) {
    return new ZodUnion({
        type: "union",
        options: options,
        ...normalizeParams(params),
    });
}
const ZodXor = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodXor", (inst, def) => {
    ZodUnion.init(inst, def);
    classic_schemas_core.$ZodXor.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.unionProcessor(inst, ctx, json, params);
    inst.options = def.options;
})));
/** Creates an exclusive union (XOR) where exactly one option must match.
 * Unlike regular unions that succeed when any option matches, xor fails if
 * zero or more than one option matches the input. */
function xor(options, params) {
    return new ZodXor({
        type: "union",
        options: options,
        inclusive: false,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodDiscriminatedUnion = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodDiscriminatedUnion", (inst, def) => {
    ZodUnion.init(inst, def);
    classic_schemas_core.$ZodDiscriminatedUnion.init(inst, def);
})));
function discriminatedUnion(discriminator, options, params) {
    // const [options, params] = args;
    return new ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
    $ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
    return new ZodIntersection({
        type: "intersection",
        left: left,
        right: right,
    });
}
const ZodTuple = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodTuple", (inst, def) => {
    classic_schemas_core.$ZodTuple.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.tupleProcessor(inst, ctx, json, params);
    inst.rest = (rest) => inst.clone({
        ...inst._zod.def,
        rest: rest,
    });
})));
function tuple(items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof classic_schemas_core.$ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new ZodTuple({
        type: "tuple",
        items: items,
        rest,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodRecord = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodRecord", (inst, def) => {
    classic_schemas_core.$ZodRecord.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.recordProcessor(inst, ctx, json, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
})));
function record(keyType, valueType, params) {
    // v3-compat: z.record(valueType, params?) — defaults keyType to z.string()
    if (!valueType || !valueType._zod) {
        return new ZodRecord({
            type: "record",
            keyType: schemas_string(),
            valueType: keyType,
            ...classic_schemas_util.normalizeParams(valueType),
        });
    }
    return new ZodRecord({
        type: "record",
        keyType,
        valueType: valueType,
        ...classic_schemas_util.normalizeParams(params),
    });
}
// type alksjf = core.output<core.$ZodRecordKey>;
function partialRecord(keyType, valueType, params) {
    const k = classic_schemas_core.clone(keyType);
    k._zod.values = undefined;
    return new ZodRecord({
        type: "record",
        keyType: k,
        valueType: valueType,
        ...classic_schemas_util.normalizeParams(params),
    });
}
function looseRecord(keyType, valueType, params) {
    return new ZodRecord({
        type: "record",
        keyType,
        valueType: valueType,
        mode: "loose",
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodMap = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodMap", (inst, def) => {
    classic_schemas_core.$ZodMap.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.mapProcessor(inst, ctx, json, params);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
    inst.min = (...args) => inst.check(classic_schemas_core._minSize(...args));
    inst.nonempty = (params) => inst.check(classic_schemas_core._minSize(1, params));
    inst.max = (...args) => inst.check(classic_schemas_core._maxSize(...args));
    inst.size = (...args) => inst.check(classic_schemas_core._size(...args));
})));
function map(keyType, valueType, params) {
    return new ZodMap({
        type: "map",
        keyType: keyType,
        valueType: valueType,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodSet = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodSet", (inst, def) => {
    classic_schemas_core.$ZodSet.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.setProcessor(inst, ctx, json, params);
    inst.min = (...args) => inst.check(classic_schemas_core._minSize(...args));
    inst.nonempty = (params) => inst.check(classic_schemas_core._minSize(1, params));
    inst.max = (...args) => inst.check(classic_schemas_core._maxSize(...args));
    inst.size = (...args) => inst.check(classic_schemas_core._size(...args));
})));
function set(valueType, params) {
    return new ZodSet({
        type: "set",
        valueType: valueType,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
    $ZodEnum.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
            if (keys.has(value)) {
                newEntries[value] = def.entries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ...normalizeParams(params),
            entries: newEntries,
        });
    };
    inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
            if (keys.has(value)) {
                delete newEntries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ...normalizeParams(params),
            entries: newEntries,
        });
    };
});
function schemas_enum(values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new ZodEnum({
        type: "enum",
        entries,
        ...normalizeParams(params),
    });
}

/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
 *
 * ```ts
 * enum Colors { red, green, blue }
 * z.enum(Colors);
 * ```
 */
function nativeEnum(entries, params) {
    return new ZodEnum({
        type: "enum",
        entries,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
    $ZodLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
        get() {
            if (def.values.length > 1) {
                throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
            }
            return def.values[0];
        },
    });
});
function literal(value, params) {
    return new ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...normalizeParams(params),
    });
}
const ZodFile = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodFile", (inst, def) => {
    classic_schemas_core.$ZodFile.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.fileProcessor(inst, ctx, json, params);
    inst.min = (size, params) => inst.check(classic_schemas_core._minSize(size, params));
    inst.max = (size, params) => inst.check(classic_schemas_core._maxSize(size, params));
    inst.mime = (types, params) => inst.check(classic_schemas_core._mime(Array.isArray(types) ? types : [types], params));
})));
function file(params) {
    return classic_schemas_core._file(ZodFile, params);
}
const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
    $ZodTransform.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
    inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") {
            throw new $ZodEncodeError(inst.constructor.name);
        }
        payload.addIssue = (issue) => {
            if (typeof issue === "string") {
                payload.issues.push(util_issue(issue, payload.value, def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = inst);
                // _issue.continue ??= true;
                payload.issues.push(util_issue(_issue));
            }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
            return output.then((output) => {
                payload.value = output;
                payload.fallback = true;
                return payload;
            });
        }
        payload.value = output;
        payload.fallback = true;
        return payload;
    };
});
function transform(fn) {
    return new ZodTransform({
        type: "transform",
        transform: fn,
    });
}
const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
    return new ZodOptional({
        type: "optional",
        innerType: innerType,
    });
}
const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
    $ZodExactOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
    return new ZodExactOptional({
        type: "optional",
        innerType: innerType,
    });
}
const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
    return new ZodNullable({
        type: "nullable",
        innerType: innerType,
    });
}
// nullish
function schemas_nullish(innerType) {
    return optional(nullable(innerType));
}
const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
    $ZodDefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
});
function schemas_default(innerType, defaultValue) {
    return new ZodDefault({
        type: "default",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
        },
    });
}
const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
    $ZodPrefault.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
    return new ZodPrefault({
        type: "prefault",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
        },
    });
}
const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
    $ZodNonOptional.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
    return new ZodNonOptional({
        type: "nonoptional",
        innerType: innerType,
        ...normalizeParams(params),
    });
}
const ZodSuccess = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodSuccess", (inst, def) => {
    classic_schemas_core.$ZodSuccess.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.successProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
})));
function success(innerType) {
    return new ZodSuccess({
        type: "success",
        innerType: innerType,
    });
}
const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
    $ZodCatch.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
});
function schemas_catch(innerType, catchValue) {
    return new ZodCatch({
        type: "catch",
        innerType: innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}

const ZodNaN = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodNaN", (inst, def) => {
    classic_schemas_core.$ZodNaN.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.nanProcessor(inst, ctx, json, params);
})));
function nan(params) {
    return classic_schemas_core._nan(ZodNaN, params);
}
const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
    $ZodPipe.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
    inst.in = def.in;
    inst.out = def.out;
});
function pipe(in_, out) {
    return new ZodPipe({
        type: "pipe",
        in: in_,
        out: out,
        // ...util.normalizeParams(params),
    });
}
const ZodCodec = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodCodec", (inst, def) => {
    ZodPipe.init(inst, def);
    classic_schemas_core.$ZodCodec.init(inst, def);
})));
function codec(in_, out, params) {
    return new ZodCodec({
        type: "pipe",
        in: in_,
        out: out,
        transform: params.decode,
        reverseTransform: params.encode,
    });
}
function invertCodec(codec) {
    const def = codec._zod.def;
    return new ZodCodec({
        type: "pipe",
        in: def.out,
        out: def.in,
        transform: def.reverseTransform,
        reverseTransform: def.transform,
    });
}
const ZodPreprocess = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodPreprocess", (inst, def) => {
    ZodPipe.init(inst, def);
    classic_schemas_core.$ZodPreprocess.init(inst, def);
})));
const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
    $ZodReadonly.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
    return new ZodReadonly({
        type: "readonly",
        innerType: innerType,
    });
}
const ZodTemplateLiteral = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodTemplateLiteral", (inst, def) => {
    classic_schemas_core.$ZodTemplateLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.templateLiteralProcessor(inst, ctx, json, params);
})));
function templateLiteral(parts, params) {
    return new ZodTemplateLiteral({
        type: "template_literal",
        parts,
        ...classic_schemas_util.normalizeParams(params),
    });
}
const ZodLazy = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodLazy", (inst, def) => {
    classic_schemas_core.$ZodLazy.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.lazyProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.getter();
})));
function lazy(getter) {
    return new ZodLazy({
        type: "lazy",
        getter: getter,
    });
}
const ZodPromise = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodPromise", (inst, def) => {
    classic_schemas_core.$ZodPromise.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.promiseProcessor(inst, ctx, json, params);
    inst.unwrap = () => inst._zod.def.innerType;
})));
function promise(innerType) {
    return new ZodPromise({
        type: "promise",
        innerType: innerType,
    });
}
const ZodFunction = /*@__PURE__*/ (/* unused pure expression or super */ null && (classic_schemas_core.$constructor("ZodFunction", (inst, def) => {
    classic_schemas_core.$ZodFunction.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => processors.functionProcessor(inst, ctx, json, params);
})));
function _function(params) {
    return new ZodFunction({
        type: "function",
        input: Array.isArray(params?.input) ? tuple(params?.input) : (params?.input ?? array(unknown())),
        output: params?.output ?? unknown(),
    });
}

const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
    $ZodCustom.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
// custom checks
function check(fn) {
    const ch = new classic_schemas_core.$ZodCheck({
        check: "custom",
        // ...util.normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
function custom(fn, _params) {
    return classic_schemas_core._custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
    return _refine(ZodCustom, fn, _params);
}
// superRefine
function superRefine(fn, params) {
    return _superRefine(fn, params);
}
// Re-export describe and meta from core
const schemas_describe = describe;
const schemas_meta = meta;
function _instanceof(cls, params = {}) {
    const inst = new ZodCustom({
        type: "custom",
        check: "custom",
        fn: (data) => data instanceof cls,
        abort: true,
        ...classic_schemas_util.normalizeParams(params),
    });
    inst._zod.bag.Class = cls;
    // Override check to emit invalid_type instead of custom
    inst._zod.check = (payload) => {
        if (!(payload.value instanceof cls)) {
            payload.issues.push({
                code: "invalid_type",
                expected: cls.name,
                input: payload.value,
                inst,
                path: [...(inst._zod.def.path ?? [])],
            });
        }
    };
    return inst;
}

// stringbool
const stringbool = (...args) => classic_schemas_core._stringbool({
    Codec: ZodCodec,
    Boolean: ZodBoolean,
    String: ZodString,
}, ...args);
function json(params) {
    const jsonSchema = lazy(() => {
        return union([schemas_string(params), schemas_number(), schemas_boolean(), schemas_null(), array(jsonSchema), record(schemas_string(), jsonSchema)]);
    });
    return jsonSchema;
}
// preprocess
function preprocess(fn, schema) {
    return new ZodPreprocess({
        type: "pipe",
        in: transform(fn),
        out: schema,
    });
}

;// ../../packages/shared/src/schemas.ts

const jobStatusSchema = schemas_enum([
    "pending",
    "saved",
    "applied",
    "interviewing",
    "offered",
    "rejected",
]);
const jobTypeSchema = schemas_enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
]);
const createJobSchema = object({
    title: schemas_string()
        .min(1, "Job title is required")
        .max(200, "Title is too long"),
    company: schemas_string()
        .min(1, "Company name is required")
        .max(200, "Company name is too long"),
    location: schemas_string()
        .max(200, "Location is too long")
        .optional()
        .or(literal("")),
    type: jobTypeSchema.optional(),
    remote: schemas_boolean().default(false),
    salary: schemas_string()
        .max(100, "Salary is too long")
        .optional()
        .or(literal("")),
    description: schemas_string().min(1, "Job description is required"),
    requirements: array(schemas_string()).default([]),
    responsibilities: array(schemas_string()).default([]),
    keywords: array(schemas_string()).default([]),
    url: schemas_string().url("Invalid job URL").optional().or(literal("")),
    status: jobStatusSchema.default("saved"),
    appliedAt: schemas_string().optional(),
    deadline: schemas_string().optional(),
    notes: schemas_string().max(5000, "Notes are too long").optional(),
});
const updateJobSchema = createJobSchema.partial();
const jobStatusUpdateSchema = object({
    status: jobStatusSchema,
    appliedAt: schemas_string().optional(),
});
function validateCreateJob(data) {
    const result = createJobSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
function validateUpdateJob(data) {
    const result = updateJobSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
function validateJobStatusUpdate(data) {
    const result = jobStatusUpdateSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
const OPPORTUNITY_TYPES = ["job", "hackathon"];
const OPPORTUNITY_SOURCES = [
    "waterlooworks",
    "linkedin",
    "indeed",
    "greenhouse",
    "lever",
    "devpost",
    "manual",
    "url",
];
const OPPORTUNITY_REMOTE_TYPES = ["remote", "hybrid", "onsite"];
const OPPORTUNITY_JOB_TYPES = [
    "co-op",
    "full-time",
    "part-time",
    "contract",
    "internship",
];
const OPPORTUNITY_LEVELS = [
    "junior",
    "intermediate",
    "senior",
    "lead",
    "principal",
    "other",
    "staff",
];
const OPPORTUNITY_STATUSES = [
    "pending",
    "saved",
    "applied",
    "interviewing",
    "offer",
    "rejected",
    "expired",
    "dismissed",
];
const KANBAN_LANE_IDS = [
    "pending",
    "saved",
    "applied",
    "interviewing",
    "offer",
    "closed",
];
const CLOSED_SUB_STATUSES = [
    "rejected",
    "expired",
    "dismissed",
];
const KANBAN_LANE_GROUPS = {
    pending: ["pending"],
    saved: ["saved"],
    applied: ["applied"],
    interviewing: ["interviewing"],
    offer: ["offer"],
    closed: CLOSED_SUB_STATUSES,
};
const DEFAULT_KANBAN_VISIBLE_LANES = (/* unused pure expression or super */ null && (KANBAN_LANE_IDS));
const STATUS_TO_KANBAN_LANE = Object.fromEntries(KANBAN_LANE_IDS.flatMap((lane) => KANBAN_LANE_GROUPS[lane].map((status) => [status, lane])));
function inferLaneFromStatus(status) {
    return STATUS_TO_KANBAN_LANE[status];
}
function isClosedSubStatus(status) {
    return CLOSED_SUB_STATUSES.includes(status);
}
function normalizeKanbanVisibleLanes(input) {
    const parsedInput = typeof input === "string" ? parseJsonSafely(input) : input;
    if (!Array.isArray(parsedInput)) {
        return [...DEFAULT_KANBAN_VISIBLE_LANES];
    }
    const selected = KANBAN_LANE_IDS.filter((lane) => parsedInput.includes(lane));
    return selected.length > 0 ? selected : [...DEFAULT_KANBAN_VISIBLE_LANES];
}
function parseJsonSafely(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
const requiredText = (max, field) => schemas_string().trim().min(1, `${field} is required`).max(max);
const optionalText = (max) => schemas_string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value === "" ? undefined : value));
const optionalStringList = array(schemas_string().trim().min(1).max(200))
    .optional();
const optionalUrl = union([schemas_string().trim().url(), literal("")])
    .optional()
    .transform((value) => (value === "" ? undefined : value));
const opportunityTypeSchema = schemas_enum(OPPORTUNITY_TYPES);
const opportunitySourceSchema = schemas_enum(OPPORTUNITY_SOURCES);
const opportunityRemoteTypeSchema = schemas_enum(OPPORTUNITY_REMOTE_TYPES);
const opportunityJobTypeSchema = schemas_enum(OPPORTUNITY_JOB_TYPES);
const opportunityLevelSchema = schemas_enum(OPPORTUNITY_LEVELS);
const opportunityStatusSchema = schemas_enum(OPPORTUNITY_STATUSES);
const kanbanLaneIdSchema = schemas_enum(KANBAN_LANE_IDS);
const kanbanVisibleLanesSchema = array(kanbanLaneIdSchema)
    .min(1, "At least one kanban lane must remain visible");
const opportunityTeamSizeSchema = object({
    min: schemas_number().int().positive(),
    max: schemas_number().int().positive(),
})
    .refine((value) => value.min <= value.max, {
    message: "Minimum team size must be less than or equal to maximum team size",
    path: ["min"],
});
const salaryRangeRefinement = {
    message: "Minimum salary must be less than or equal to maximum salary",
    path: ["salaryMin"],
};
const hasValidSalaryRange = (value) => value.salaryMin === undefined ||
    value.salaryMax === undefined ||
    value.salaryMin <= value.salaryMax;
const opportunityInputFields = {
    type: opportunityTypeSchema,
    title: requiredText(200, "Title"),
    company: requiredText(200, "Company"),
    division: optionalText(200),
    source: opportunitySourceSchema,
    sourceUrl: optionalUrl,
    sourceId: optionalText(200),
    city: optionalText(120),
    province: optionalText(120),
    country: optionalText(120),
    postalCode: optionalText(40),
    region: optionalText(120),
    remoteType: opportunityRemoteTypeSchema.optional(),
    additionalLocationInfo: optionalText(500),
    jobType: opportunityJobTypeSchema.optional(),
    level: opportunityLevelSchema.optional(),
    openings: schemas_number().int().positive().optional(),
    workTerm: optionalText(120),
    applicationMethod: optionalText(120),
    requiredDocuments: optionalStringList,
    targetedDegrees: optionalStringList,
    targetedClusters: optionalStringList,
    prizes: optionalStringList,
    teamSize: opportunityTeamSizeSchema.optional(),
    tracks: optionalStringList,
    submissionUrl: optionalUrl,
    summary: requiredText(50000, "Summary"),
    responsibilities: optionalStringList,
    requiredSkills: optionalStringList,
    preferredSkills: optionalStringList,
    techStack: optionalStringList,
    salaryMin: schemas_number().nonnegative().optional(),
    salaryMax: schemas_number().nonnegative().optional(),
    salaryCurrency: optionalText(12),
    benefits: optionalStringList,
    deadline: optionalText(80),
    additionalInfo: optionalText(5000),
    scrapedAt: optionalText(80),
    savedAt: optionalText(80),
    appliedAt: optionalText(80),
    notes: optionalText(5000),
    linkedResumeId: optionalText(200),
    linkedCoverLetterId: optionalText(200),
};
const updateOpportunityInputFields = Object.fromEntries(Object.entries(opportunityInputFields).map(([key, schema]) => [
    key,
    schema.optional(),
]));
const createOpportunitySchema = object({
    ...opportunityInputFields,
    status: opportunityStatusSchema.default("pending"),
    tags: array(schemas_string().trim().min(1).max(80)).default([]),
})
    .refine(hasValidSalaryRange, salaryRangeRefinement);
const updateOpportunitySchema = object({
    ...updateOpportunityInputFields,
    status: opportunityStatusSchema.optional(),
    tags: array(schemas_string().trim().min(1).max(80)).optional(),
})
    .refine(hasValidSalaryRange, salaryRangeRefinement);
const opportunitySchema = object({
    ...opportunityInputFields,
    id: requiredText(200, "ID"),
    status: opportunityStatusSchema,
    tags: array(schemas_string().trim().min(1).max(80)),
    createdAt: requiredText(80, "Created at"),
    updatedAt: requiredText(80, "Updated at"),
})
    .refine(hasValidSalaryRange, salaryRangeRefinement);
const opportunityStatusChangeSchema = object({
    status: opportunityStatusSchema,
});
const opportunityFiltersSchema = object({
    type: opportunityTypeSchema.optional(),
    status: opportunityStatusSchema.optional(),
    source: opportunitySourceSchema.optional(),
    tags: array(schemas_string().trim().min(1)).optional(),
    search: schemas_string().trim().optional(),
});

;// ./src/shared/types.ts
const DEFAULT_SETTINGS = {
    autoFillEnabled: true,
    showConfidenceIndicators: true,
    minimumConfidence: 0.5,
    learnFromAnswers: true,
    notifyOnJobDetected: true,
    autoTrackApplicationsEnabled: true,
    captureScreenshotEnabled: false,
};
const DEFAULT_API_BASE_URL = "http://localhost:3000";

;// ./src/background/storage.ts
// Extension storage utilities

const STORAGE_KEY = "columbus_extension";
async function getStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
            const stored = result[STORAGE_KEY];
            resolve({
                apiBaseUrl: DEFAULT_API_BASE_URL,
                ...stored,
                settings: { ...DEFAULT_SETTINGS, ...stored?.settings },
            });
        });
    });
}
async function setStorage(updates) {
    const current = await getStorage();
    const updated = { ...current, ...updates };
    return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: updated }, resolve);
    });
}
async function clearStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.remove(STORAGE_KEY, resolve);
    });
}
// Auth token helpers
async function setAuthToken(token, expiresAt) {
    await setStorage({
        authToken: token,
        tokenExpiry: expiresAt,
        lastSeenAuthAt: new Date().toISOString(),
    });
}
/**
 * Records that we just observed a working authenticated state. Called by the
 * API client after a successful `isAuthenticated()` check so the popup can
 * distinguish a real logout from a service-worker state-loss event.
 *
 * Distinct from `setAuthToken` because we don't always have a fresh token to
 * write — sometimes we just verified the existing one.
 */
async function markAuthSeen() {
    await setStorage({ lastSeenAuthAt: new Date().toISOString() });
}
/**
 * "Session lost" view (popup, #27) shows when we have no `authToken` but
 * `lastSeenAuthAt` is within this window. Beyond the window we treat the
 * extension as a fresh install / true logout and show the normal hero.
 */
const SESSION_LOST_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
/**
 * Returns true when the popup should render the "Session lost — reconnect"
 * branch instead of the unauthenticated hero. See #27.
 */
function isSessionLost(storage, now = Date.now()) {
    if (storage.authToken)
        return false;
    if (!storage.lastSeenAuthAt)
        return false;
    const lastSeen = new Date(storage.lastSeenAuthAt).getTime();
    if (!Number.isFinite(lastSeen))
        return false;
    return now - lastSeen <= SESSION_LOST_WINDOW_MS;
}
async function clearAuthToken() {
    // NOTE: we intentionally do NOT clear `lastSeenAuthAt` here. A true logout
    // path (handleLogout) calls `forgetAuthHistory` afterwards; this helper is
    // also used when a token quietly expires or a 401 trips the api-client,
    // and in those cases the session-lost UI is exactly what we want to show.
    await setStorage({
        authToken: undefined,
        tokenExpiry: undefined,
        cachedProfile: undefined,
        profileCachedAt: undefined,
    });
}
/**
 * Wipes the "we've seen you before" breadcrumb so the popup shows the
 * unauthenticated hero on next open. Call this from explicit-logout flows.
 */
async function forgetAuthHistory() {
    await setStorage({ lastSeenAuthAt: undefined });
}
async function getAuthToken() {
    const storage = await getStorage();
    if (!storage.authToken)
        return null;
    // Check expiry
    if (storage.tokenExpiry) {
        const expiry = new Date(storage.tokenExpiry);
        if (expiry < new Date()) {
            await clearAuthToken();
            return null;
        }
    }
    return storage.authToken;
}
// Profile cache helpers
const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
async function getCachedProfile() {
    const storage = await getStorage();
    if (!storage.cachedProfile || !storage.profileCachedAt) {
        return null;
    }
    const cachedAt = new Date(storage.profileCachedAt);
    if (Date.now() - cachedAt.getTime() > PROFILE_CACHE_TTL) {
        return null; // Cache expired
    }
    return storage.cachedProfile;
}
async function setCachedProfile(profile) {
    await setStorage({
        cachedProfile: profile,
        profileCachedAt: new Date().toISOString(),
    });
}
async function clearCachedProfile() {
    await setStorage({
        cachedProfile: undefined,
        profileCachedAt: undefined,
    });
}
// Settings helpers
async function getSettings() {
    const storage = await getStorage();
    return storage.settings;
}
async function updateSettings(updates) {
    const storage = await getStorage();
    const updated = { ...storage.settings, ...updates };
    await setStorage({ settings: updated });
    return updated;
}
// API URL helper
async function setApiBaseUrl(url) {
    await setStorage({ apiBaseUrl: url });
}
async function getApiBaseUrl() {
    const storage = await getStorage();
    return storage.apiBaseUrl;
}
// ---- Session-scoped auth cache (#30) ------------------------------------
//
// `chrome.storage.session` is in-memory only — it survives suspending the
// service worker but is wiped on browser restart, which is exactly what we
// want for a short-lived auth verdict cache. Using session (not local)
// also means we never persist the verdict to disk.
//
// The cache stores `{ authenticated: boolean, at: ISO string }` so the
// popup can return a result in <50ms on the second open within a minute,
// while the background script revalidates in the background.
const AUTH_CACHE_TTL_MS = 60 * 1000;
const AUTH_CACHE_KEY = "columbus_auth_cache";
/**
 * Reads the session-scoped auth verdict cache. Returns null when:
 * - the entry has never been written,
 * - the entry is older than AUTH_CACHE_TTL_MS,
 * - the entry's timestamp is unparseable, or
 * - chrome.storage.session is unavailable (e.g. older browsers).
 *
 * Optional `now` parameter exists for tests.
 */
async function getSessionAuthCache(now = Date.now()) {
    const sessionStore = chrome.storage?.session;
    if (!sessionStore)
        return null;
    return new Promise((resolve) => {
        sessionStore.get(AUTH_CACHE_KEY, (result) => {
            const entry = result?.[AUTH_CACHE_KEY];
            if (!entry || typeof entry.at !== "string") {
                resolve(null);
                return;
            }
            const at = new Date(entry.at).getTime();
            if (!Number.isFinite(at)) {
                resolve(null);
                return;
            }
            if (now - at > AUTH_CACHE_TTL_MS) {
                resolve(null);
                return;
            }
            resolve({ authenticated: !!entry.authenticated, at: entry.at });
        });
    });
}
/**
 * Writes a fresh verdict to the session-scoped cache. No-ops when
 * chrome.storage.session is unavailable so callers don't need to guard.
 */
async function setSessionAuthCache(authenticated) {
    const sessionStore = chrome.storage?.session;
    if (!sessionStore)
        return;
    const entry = {
        authenticated,
        at: new Date().toISOString(),
    };
    return new Promise((resolve) => {
        sessionStore.set({ [AUTH_CACHE_KEY]: entry }, () => resolve());
    });
}
/**
 * Drops the cached verdict. Call this on any 401 so the next popup open
 * doesn't trust a stale "authenticated" answer.
 */
async function clearSessionAuthCache() {
    const sessionStore = chrome.storage?.session;
    if (!sessionStore)
        return;
    return new Promise((resolve) => {
        sessionStore.remove(AUTH_CACHE_KEY, () => resolve());
    });
}

;// ./src/background/api-client.ts
// Columbus API client for extension


class ColumbusAPIClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
    }
    async getAuthToken() {
        const storage = await getStorage();
        if (!storage.authToken)
            return null;
        // Check expiry
        if (storage.tokenExpiry) {
            const expiry = new Date(storage.tokenExpiry);
            if (expiry < new Date()) {
                // Token expired, clear it
                await setStorage({ authToken: undefined, tokenExpiry: undefined });
                return null;
            }
        }
        return storage.authToken;
    }
    async authenticatedFetch(path, options = {}) {
        const token = await this.getAuthToken();
        if (!token) {
            throw new Error("Not authenticated");
        }
        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "X-Extension-Token": token,
                ...options.headers,
            },
        });
        if (!response.ok) {
            if (response.status === 401) {
                // Clear invalid token AND the fast-path session cache (#30) so the
                // next popup open re-verifies instead of trusting a stale verdict.
                await setStorage({ authToken: undefined, tokenExpiry: undefined });
                await clearSessionAuthCache();
                throw new Error("Authentication expired");
            }
            const error = await response
                .json()
                .catch(() => ({ error: "Request failed" }));
            throw new Error(error.error || `Request failed: ${response.status}`);
        }
        return response.json();
    }
    async isAuthenticated() {
        const token = await this.getAuthToken();
        if (!token)
            return false;
        try {
            await this.authenticatedFetch("/api/extension/auth/verify");
            // Record the working-auth breadcrumb so the popup can distinguish a
            // true logout from a service-worker state-loss after this point.
            // See #27.
            await markAuthSeen();
            return true;
        }
        catch {
            return false;
        }
    }
    async getProfile() {
        return this.authenticatedFetch("/api/extension/profile");
    }
    async importJob(job) {
        const opportunity = {
            type: "job",
            title: job.title,
            company: job.company,
            source: normalizeOpportunitySource(job.source),
            sourceUrl: job.url,
            sourceId: job.sourceJobId,
            summary: job.description,
            responsibilities: job.responsibilities || [],
            requiredSkills: job.requirements || [],
            techStack: job.keywords || [],
            jobType: job.type,
            remoteType: job.remote ? "remote" : undefined,
            deadline: job.deadline,
        };
        createOpportunitySchema.parse(opportunity);
        return this.authenticatedFetch("/api/opportunities/from-extension", {
            method: "POST",
            body: JSON.stringify({
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                requirements: job.requirements,
                responsibilities: job.responsibilities || [],
                keywords: job.keywords || [],
                type: job.type,
                remote: job.remote,
                salary: job.salary,
                url: job.url,
                source: job.source,
                sourceJobId: job.sourceJobId,
                postedAt: job.postedAt,
                deadline: job.deadline,
            }),
        });
    }
    async importJobsBatch(jobs) {
        return this.authenticatedFetch("/api/opportunities/from-extension", {
            method: "POST",
            body: JSON.stringify({ jobs }),
        });
    }
    async trackApplied(payload) {
        const scrapedJob = payload.scrapedJob || undefined;
        const title = scrapedJob?.title || payload.headline || payload.title;
        const company = scrapedJob?.company || payload.host.replace(/^www\./, "");
        const notes = [
            payload.headline ? `Headline: ${payload.headline}` : undefined,
            payload.thumbnailDataUrl
                ? "Screenshot captured by extension."
                : undefined,
        ]
            .filter(Boolean)
            .join("\n");
        const response = await this.authenticatedFetch("/api/opportunities/from-extension", {
            method: "POST",
            body: JSON.stringify({
                title,
                company,
                location: scrapedJob?.location,
                description: scrapedJob?.description ||
                    payload.headline ||
                    "Application submitted via extension.",
                requirements: scrapedJob?.requirements || [],
                responsibilities: scrapedJob?.responsibilities || [],
                keywords: scrapedJob?.keywords || [],
                type: scrapedJob?.type,
                remote: scrapedJob?.remote,
                salary: scrapedJob?.salary,
                url: scrapedJob?.url || payload.url,
                source: scrapedJob?.source || payload.host,
                sourceJobId: scrapedJob?.sourceJobId,
                postedAt: scrapedJob?.postedAt,
                deadline: scrapedJob?.deadline,
                status: "applied",
                appliedAt: payload.submittedAt,
                notes,
            }),
        });
        const opportunityId = response.opportunityIds[0];
        if (!opportunityId) {
            throw new Error("Application was not tracked");
        }
        return {
            opportunityId,
            deduped: Boolean(response.dedupedIds?.includes(opportunityId)),
        };
    }
    async tailorFromJob(job, baseResumeId) {
        const jobDescription = getReadableJobDescription(job);
        const imported = await this.importJob(job);
        const opportunityId = getImportedOpportunityId(imported.opportunityIds);
        const requestBody = {
            action: "generate",
            jobDescription,
            jobTitle: job.title,
            company: job.company,
            opportunityId,
        };
        // Only thread the id through when the popup picked a non-default resume —
        // omitting the field keeps the request body byte-identical to the legacy
        // shape, so existing tests + telemetry don't churn for the master case.
        if (baseResumeId) {
            requestBody.baseResumeId = baseResumeId;
        }
        const response = await this.authenticatedFetch("/api/tailor", {
            method: "POST",
            body: JSON.stringify(requestBody),
        });
        if (!response.savedResume?.id || !response.jobId) {
            throw new Error("Tailored resume was generated without a saved resume.");
        }
        return {
            opportunityId,
            savedResume: { id: response.savedResume.id },
            jobId: response.jobId,
        };
    }
    async listResumes() {
        const response = await this.authenticatedFetch("/api/extension/resumes");
        return response.resumes ?? [];
    }
    async generateCoverLetterFromJob(job) {
        const jobDescription = getReadableJobDescription(job);
        const imported = await this.importJob(job);
        const opportunityId = getImportedOpportunityId(imported.opportunityIds);
        const response = await this.authenticatedFetch("/api/cover-letter/generate", {
            method: "POST",
            body: JSON.stringify({
                action: "generate",
                jobDescription,
                jobTitle: job.title,
                company: job.company,
                opportunityId,
            }),
        });
        if (!response.savedCoverLetter?.id) {
            throw new Error("Cover letter was generated without a saved document.");
        }
        return {
            opportunityId,
            savedCoverLetter: { id: response.savedCoverLetter.id },
        };
    }
    async saveLearnedAnswer(data) {
        return this.authenticatedFetch("/api/extension/learned-answers", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async searchSimilarAnswers(question) {
        const response = await this.authenticatedFetch("/api/extension/learned-answers/search", {
            method: "POST",
            body: JSON.stringify({ question }),
        });
        return response.results;
    }
    async getLearnedAnswers() {
        const response = await this.authenticatedFetch("/api/extension/learned-answers");
        return response.answers;
    }
    async deleteLearnedAnswer(id) {
        await this.authenticatedFetch(`/api/extension/learned-answers/${id}`, {
            method: "DELETE",
        });
    }
    async updateLearnedAnswer(id, answer) {
        return this.authenticatedFetch(`/api/extension/learned-answers/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ answer }),
        });
    }
    /**
     * Persist a user correction so the per-domain field mapping grows stronger
     * over time. See task #33 in docs/extension-roadmap-2026-05.md. The server
     * upserts into `field_mappings`, bumping `hit_count` on existing rows and
     * inserting fresh rows otherwise.
     */
    async saveCorrection(payload) {
        return this.authenticatedFetch("/api/extension/field-mappings/correct", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }
}
function getReadableJobDescription(job) {
    const description = job.description?.trim() ?? "";
    if (description.length < 20) {
        throw new Error("Couldn't read the full job description from this page.");
    }
    return description;
}
function getImportedOpportunityId(opportunityIds) {
    const opportunityId = opportunityIds[0];
    if (!opportunityId) {
        throw new Error("Job import did not return an opportunity id.");
    }
    return opportunityId;
}
function normalizeOpportunitySource(source) {
    const normalized = source.toLowerCase();
    if (normalized.includes("linkedin"))
        return "linkedin";
    if (normalized.includes("indeed"))
        return "indeed";
    if (normalized.includes("greenhouse"))
        return "greenhouse";
    if (normalized.includes("lever"))
        return "lever";
    if (normalized.includes("waterloo"))
        return "waterlooworks";
    if (normalized.includes("devpost"))
        return "devpost";
    return "url";
}
// Singleton instance
let client = null;
async function getAPIClient() {
    if (!client) {
        const storage = await getStorage();
        client = new ColumbusAPIClient(storage.apiBaseUrl);
    }
    return client;
}
function resetAPIClient() {
    client = null;
}

;// ./src/background/badge.ts

const BADGE_TEXT = "!";
const BADGE_COLOR = "#3b82f6";
const BADGE_TITLE = "Job detected — press Cmd+Shift+I to import";
async function setBadgeForTab(tabId) {
    const settings = await getSettings();
    if (!settings.notifyOnJobDetected)
        return;
    await Promise.all([
        chrome.action.setBadgeText({ text: BADGE_TEXT, tabId }),
        chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR, tabId }),
        chrome.action.setTitle({ title: BADGE_TITLE, tabId }),
    ]);
}
async function clearBadgeForTab(tabId) {
    await Promise.all([
        chrome.action.setBadgeText({ text: "", tabId }),
        chrome.action.setTitle({ title: "", tabId }),
    ]);
}

;// ./src/background/index.ts
// Background service worker for Columbus extension



// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender)
        .then(sendResponse)
        .catch((error) => {
        console.error("[Columbus] Message handler error:", error);
        sendResponse({ success: false, error: error.message });
    });
    // Return true to indicate async response
    return true;
});
async function handleMessage(message, sender) {
    switch (message.type) {
        case "GET_AUTH_STATUS":
            return handleGetAuthStatus();
        case "OPEN_AUTH":
            return handleOpenAuth();
        case "LOGOUT":
            return handleLogout();
        case "GET_PROFILE":
            return handleGetProfile();
        case "GET_SETTINGS":
            return handleGetSettings();
        case "IMPORT_JOB":
            return handleImportJob(message.payload);
        case "IMPORT_JOBS_BATCH":
            return handleImportJobsBatch(message.payload);
        case "TRACK_APPLIED":
            return handleTrackApplied(message.payload);
        case "OPEN_DASHBOARD":
            return handleOpenDashboard();
        case "CAPTURE_VISIBLE_TAB":
            return handleCaptureVisibleTab();
        case "TAILOR_FROM_PAGE":
            return handleTailorFromPage(message.payload);
        case "GENERATE_COVER_LETTER_FROM_PAGE":
            return handleGenerateCoverLetterFromPage(message.payload);
        case "LIST_RESUMES":
            return handleListResumes();
        case "SAVE_ANSWER":
            return handleSaveAnswer(message.payload);
        case "SEARCH_ANSWERS":
            return handleSearchAnswers(message.payload);
        case "GET_LEARNED_ANSWERS":
            return handleGetLearnedAnswers();
        case "DELETE_ANSWER":
            return handleDeleteAnswer(message.payload);
        case "SAVE_CORRECTION":
            return handleSaveCorrection(message.payload);
        case "JOB_DETECTED": {
            const tabId = sender.tab?.id;
            if (!tabId)
                return { success: false, error: "No tab ID in sender" };
            await setBadgeForTab(tabId);
            return { success: true };
        }
        case "AUTH_CALLBACK": {
            // Sent by the content script when it picks up a localStorage-transported
            // token from the Slothing connect page (the localStorage path is used on
            // browsers without externally_connectable — Firefox in particular).
            const payload = message;
            if (!payload.token || !payload.expiresAt) {
                return { success: false, error: "Missing token or expiresAt" };
            }
            try {
                await setAuthToken(payload.token, payload.expiresAt);
                resetAPIClient();
                return { success: true };
            }
            catch (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }
        }
        default:
            return { success: false, error: `Unknown message type: ${message.type}` };
    }
}
async function handleTailorFromPage(payload) {
    // Support both the new wrapped payload ({job, baseResumeId}) used by the
    // popup picker (#34) and the legacy bare ScrapedJob still sent by the
    // content-script Tailor action. The "url" presence on the inner object is
    // the cheapest discriminator (ScrapedJob has it, TailorFromPagePayload
    // doesn't).
    const isLegacy = "url" in payload && !("job" in payload);
    const job = isLegacy
        ? payload
        : payload.job;
    const baseResumeId = isLegacy
        ? undefined
        : payload.baseResumeId;
    try {
        const client = await getAPIClient();
        const result = await client.tailorFromJob(job, baseResumeId);
        const apiBaseUrl = await getApiBaseUrl();
        const resumeId = result.savedResume.id;
        const studioParams = new URLSearchParams({
            from: "extension",
            tailorId: resumeId,
        });
        if (baseResumeId) {
            studioParams.set("baseResumeId", baseResumeId);
        }
        return {
            success: true,
            data: {
                url: `${apiBaseUrl}/studio?${studioParams.toString()}`,
                opportunityId: result.opportunityId,
                resumeId,
            },
        };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleListResumes() {
    try {
        const client = await getAPIClient();
        const resumes = await client.listResumes();
        return { success: true, data: { resumes } };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGenerateCoverLetterFromPage(job) {
    try {
        const client = await getAPIClient();
        const result = await client.generateCoverLetterFromJob(job);
        const apiBaseUrl = await getApiBaseUrl();
        const coverLetterId = result.savedCoverLetter.id;
        return {
            success: true,
            data: {
                url: `${apiBaseUrl}/cover-letter?from=extension&id=${encodeURIComponent(coverLetterId)}`,
                opportunityId: result.opportunityId,
                coverLetterId,
            },
        };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGetAuthStatus() {
    // Fast-path (#30): return a cached verdict if it's <60s old, then
    // revalidate in the background so a flipped server state still
    // self-corrects on the *next* popup open.
    try {
        const cached = await getSessionAuthCache();
        if (cached) {
            const apiBaseUrl = await getApiBaseUrl();
            const storage = await getStorage();
            const sessionLost = !cached.authenticated && isSessionLost(storage);
            // Fire-and-forget revalidation. We deliberately don't await it so
            // the popup gets its response immediately.
            void revalidateAuthInBackground();
            return {
                success: true,
                data: {
                    isAuthenticated: cached.authenticated,
                    apiBaseUrl,
                    sessionLost,
                },
            };
        }
    }
    catch {
        // Cache lookup failure is non-fatal; fall through to the verify path.
    }
    try {
        const client = await getAPIClient();
        const isAuthenticated = await client.isAuthenticated();
        const apiBaseUrl = await getApiBaseUrl();
        const storage = await getStorage();
        const sessionLost = !isAuthenticated && isSessionLost(storage);
        await setSessionAuthCache(isAuthenticated);
        return {
            success: true,
            data: { isAuthenticated, apiBaseUrl, sessionLost },
        };
    }
    catch (error) {
        const apiBaseUrl = await getApiBaseUrl();
        const storage = await getStorage().catch(() => null);
        const sessionLost = storage ? isSessionLost(storage) : false;
        return {
            success: true,
            data: { isAuthenticated: false, apiBaseUrl, sessionLost },
        };
    }
}
/**
 * Background revalidation that runs after we return a cached verdict.
 * Refreshes the session cache so subsequent reads stay fresh; on a 401
 * the api-client's authenticatedFetch clears `authToken` + the cache
 * already.
 */
async function revalidateAuthInBackground() {
    try {
        const client = await getAPIClient();
        const verdict = await client.isAuthenticated();
        await setSessionAuthCache(verdict);
    }
    catch {
        // Network blip — leave the cache alone; next miss will revalidate.
    }
}
async function handleOpenAuth() {
    try {
        const apiBaseUrl = await getApiBaseUrl();
        // Pass extension ID so the connect page can deliver the token back via
        // chrome.runtime.sendMessage(extensionId, ...). The page is a regular web
        // page and cannot resolve the calling extension by passing undefined.
        const authUrl = `${apiBaseUrl}/extension/connect?extensionId=${chrome.runtime.id}`;
        await chrome.tabs.create({ url: authUrl });
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleLogout() {
    try {
        await clearAuthToken();
        // Explicit logout — also drop the "we've seen you before" breadcrumb so
        // the popup doesn't fall into the #27 "session lost" branch.
        await forgetAuthHistory();
        // And the fast-path cache (#30) so the next popup open re-verifies.
        await clearSessionAuthCache();
        resetAPIClient();
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGetProfile() {
    try {
        // Check cache first
        const cached = await getCachedProfile();
        if (cached) {
            return { success: true, data: cached };
        }
        // Fetch from API
        const client = await getAPIClient();
        const profile = await client.getProfile();
        // Cache the profile
        await setCachedProfile(profile);
        return { success: true, data: profile };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGetSettings() {
    try {
        return { success: true, data: await getSettings() };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleImportJob(job) {
    try {
        const client = await getAPIClient();
        const result = await client.importJob(job);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleImportJobsBatch(jobs) {
    try {
        const client = await getAPIClient();
        const result = await client.importJobsBatch(jobs);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleTrackApplied(payload) {
    try {
        const client = await getAPIClient();
        const result = await client.trackApplied(payload);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleOpenDashboard() {
    try {
        const apiBaseUrl = await getApiBaseUrl();
        await chrome.tabs.create({ url: `${apiBaseUrl}/dashboard` });
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleCaptureVisibleTab() {
    try {
        const dataUrl = await chrome.tabs.captureVisibleTab(undefined, {
            format: "jpeg",
            quality: 35,
        });
        return { success: true, data: { dataUrl } };
    }
    catch {
        return { success: false };
    }
}
async function handleSaveAnswer(data) {
    try {
        const client = await getAPIClient();
        const result = await client.saveLearnedAnswer({
            question: data.question,
            answer: data.answer,
            sourceUrl: data.url,
            sourceCompany: data.company,
        });
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleSearchAnswers(question) {
    try {
        const client = await getAPIClient();
        const results = await client.searchSimilarAnswers(question);
        return { success: true, data: results };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleGetLearnedAnswers() {
    try {
        const client = await getAPIClient();
        const answers = await client.getLearnedAnswers();
        return { success: true, data: answers };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleDeleteAnswer(id) {
    try {
        const client = await getAPIClient();
        await client.deleteLearnedAnswer(id);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
async function handleSaveCorrection(payload) {
    try {
        const client = await getAPIClient();
        const result = await client.saveCorrection(payload);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
}
// Handle auth callback from Columbus web app
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.type === "AUTH_CALLBACK" &&
        message.token &&
        message.expiresAt) {
        setAuthToken(message.token, message.expiresAt)
            .then(() => {
            resetAPIClient();
            sendResponse({ success: true });
        })
            .catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});
// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id)
        return;
    switch (command) {
        case "fill-form":
            chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_FILL" });
            break;
        case "import-job":
            chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_IMPORT" });
            break;
    }
});
// Clear badge when a tab navigates to a new URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading" && changeInfo.url) {
        clearBadgeForTab(tabId).catch(() => { });
    }
});
// Handle extension install/update
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("[Columbus] Extension installed");
        // Could open onboarding page here
    }
    else if (details.reason === "update") {
        console.log("[Columbus] Extension updated to", chrome.runtime.getManifest().version);
    }
});
console.log("[Columbus] Background service worker started");

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1Qiw0QkFBNEI7QUFDNUI7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsWUFBWSwyRUFBMkU7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsbUJBQW1CLGFBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHlCQUF5QjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4Qyw2Q0FBNkMscUJBQXFCLElBQUk7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLFlBQVksbUJBQW1CO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsT0FBTztBQUN0QztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMsT0FBTztBQUNyRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLGNBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0EsS0FBSztBQUNMLGNBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELE9BQU87QUFDdkQ7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLFVBQVUsT0FBTztBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1CQUFtQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLE9BQU87QUFDbkM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLE9BQU87QUFDeEM7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0Esa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGNBQWM7QUFDN0M7QUFDQTtBQUNPO0FBQ1A7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsSUFBSSxPQUFPO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsSUFBSSxPQUFPO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsSUFBSSxPQUFPO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0EsSUFBSSxPQUFPO0FBQ1g7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLElBQUksT0FBTztBQUNYO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix3Q0FBaUIsR0FBRyxzQ0FBc0M7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLDhCQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksa0NBQVc7QUFDdkIsMkJBQTJCLCtCQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxnQkFBZ0Isd0NBQWlCLEdBQUcsc0NBQXNDO0FBQzFFLElBQUksOEJBQU87QUFDWCxJQUFJLGtDQUFXO0FBQ2YsV0FBVywrQkFBUTtBQUNuQjs7O0FDeGxCeUM7QUFDRDtBQUNqQyxxQ0FBcUMsWUFBaUI7QUFDN0QsSUFBSSxlQUFvQjtBQUN4QixJQUFJLGVBQXVCO0FBQzNCLENBQUM7QUFDTSxTQUFTLFlBQVE7QUFDeEIsV0FBVyxZQUFpQjtBQUM1QjtBQUNPLGlDQUFpQyxZQUFpQjtBQUN6RCxJQUFJLFdBQWdCO0FBQ3BCLElBQUksZUFBdUI7QUFDM0IsQ0FBQztBQUNNLFNBQVMsUUFBSTtBQUNwQixXQUFXLFFBQWE7QUFDeEI7QUFDTyxpQ0FBaUMsWUFBaUI7QUFDekQsSUFBSSxXQUFnQjtBQUNwQixJQUFJLGVBQXVCO0FBQzNCLENBQUM7QUFDTSxTQUFTLFFBQUk7QUFDcEIsV0FBVyxRQUFhO0FBQ3hCO0FBQ08scUNBQXFDLFlBQWlCO0FBQzdELElBQUksZUFBb0I7QUFDeEIsSUFBSSxlQUF1QjtBQUMzQixDQUFDO0FBQ00sU0FBUyxZQUFRO0FBQ3hCLFdBQVcsWUFBaUI7QUFDNUI7Ozs7QUM3QnlDO0FBQ0k7QUFDTDtBQUN4QyxNQUFNLGtCQUFXO0FBQ2pCLElBQUksU0FBUztBQUNiO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixXQUFnQjtBQUMvQztBQUNBLFNBQVM7QUFDVDtBQUNBLCtCQUErQixZQUFpQjtBQUNoRDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSwyREFBMkQscUJBQTBCO0FBQ3JGLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSwyREFBMkQscUJBQTBCO0FBQ3JGLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixRQUFRO0FBQ1I7QUFDTywrQkFBK0IsMkRBQUksMEJBQTBCLGtCQUFXLENBQUM7QUFDekUsbUNBQW1DLFlBQWlCLGFBQWEsa0JBQVc7QUFDbkY7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7O0FDL0N5QztBQUNFO0FBQ3BDLE1BQU0sV0FBSyxtQkFBbUIsTUFBVyxDQUFDLFlBQVk7QUFDdEQsTUFBTSxnQkFBVSxtQkFBbUIsV0FBZ0IsQ0FBQyxZQUFZO0FBQ2hFLE1BQU0sZUFBUyxtQkFBbUIsVUFBZSxDQUFDLFlBQVk7QUFDOUQsTUFBTSxvQkFBYyxtQkFBbUIsZUFBb0IsQ0FBQyxZQUFZO0FBQy9FO0FBQ08sTUFBTSxZQUFNLG1CQUFtQixPQUFZLENBQUMsWUFBWTtBQUN4RCxNQUFNLFlBQU0sbUJBQW1CLE9BQVksQ0FBQyxZQUFZO0FBQ3hELE1BQU0saUJBQVcsbUJBQW1CLFlBQWlCLENBQUMsWUFBWTtBQUNsRSxNQUFNLGlCQUFXLG1CQUFtQixZQUFpQixDQUFDLFlBQVk7QUFDbEUsTUFBTSxnQkFBVSxtQkFBbUIsV0FBZ0IsQ0FBQyxZQUFZO0FBQ2hFLE1BQU0sZ0JBQVUsbUJBQW1CLFdBQWdCLENBQUMsWUFBWTtBQUNoRSxNQUFNLHFCQUFlLG1CQUFtQixnQkFBcUIsQ0FBQyxZQUFZO0FBQzFFLE1BQU0scUJBQWUsbUJBQW1CLGdCQUFxQixDQUFDLFlBQVk7Ozs7Ozs7QUNkeEM7QUFDRDtBQUN3QjtBQUNxQztBQUMvRDtBQUNOO0FBQ0k7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ08sOEJBQThCLFlBQWlCO0FBQ3RELElBQUksUUFBYTtBQUNqQjtBQUNBO0FBQ0EsbUJBQW1CLDhCQUE4QjtBQUNqRCxvQkFBb0IsOEJBQThCO0FBQ2xELFNBQVM7QUFDVCxLQUFLO0FBQ0wsd0JBQXdCLHdCQUF3QixTQUFTO0FBQ3pEO0FBQ0E7QUFDQSwwQ0FBMEMsWUFBWTtBQUN0RDtBQUNBO0FBQ0EsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBLG1DQUFtQyxXQUFXLHVCQUF1QixvQkFBb0I7QUFDekYsdUNBQXVDLGVBQWU7QUFDdEQsOENBQThDLGdCQUFnQix1QkFBdUIseUJBQXlCO0FBQzlHLGtEQUFrRCxvQkFBb0I7QUFDdEU7QUFDQSxvQ0FBb0MsWUFBWTtBQUNoRCxvQ0FBb0MsWUFBWTtBQUNoRCwrQ0FBK0MsaUJBQWlCO0FBQ2hFLCtDQUErQyxpQkFBaUI7QUFDaEUsd0NBQXdDLGdCQUFnQjtBQUN4RCx3Q0FBd0MsZ0JBQWdCO0FBQ3hELG1EQUFtRCxxQkFBcUI7QUFDeEUsbURBQW1ELHFCQUFxQjtBQUN4RTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFNBQWM7QUFDNUM7QUFDQTtBQUNBLHFFQUFxRSxRQUFRLGtCQUFrQixpQkFBaUIsbUJBQW1CO0FBQ25JO0FBQ0EsYUFBYSxLQUFLLGNBQWM7QUFDaEMsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsS0FBVTtBQUM3QixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFVBQWdCO0FBQzlDLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLG1CQUFtQixlQUFRO0FBQzNCLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsbUJBQW1CLGFBQU07QUFDekIsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsWUFBWSxjQUFtQixXQUFXLGFBQWE7QUFDdkQ7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGNBQW1CO0FBQzFDO0FBQ0EsWUFBWSxjQUFtQjtBQUMvQjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBLG1CQUFtQixjQUFtQjtBQUN0QyxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDO0FBQ0Q7QUFDTyxpQ0FBaUMsWUFBaUI7QUFDekQsSUFBSSxVQUFlO0FBQ25CO0FBQ0EseURBQXlELGVBQTBCO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixNQUFZO0FBQzFDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixTQUFlO0FBQzdDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixXQUFpQjtBQUMvQyxTQUFTO0FBQ1Q7QUFDQSw4QkFBOEIsU0FBZTtBQUM3QyxTQUFTO0FBQ1Q7QUFDQSw4QkFBOEIsVUFBZ0I7QUFDOUMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFVBQWdCO0FBQzlDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixPQUFhO0FBQzNDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixVQUFnQjtBQUM5QyxTQUFTO0FBQ1Q7QUFDQSw4QkFBOEIsVUFBZ0I7QUFDOUMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFVBQWdCO0FBQzlDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixLQUFXO0FBQ3pDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixVQUFnQjtBQUM5QyxTQUFTO0FBQ1Q7QUFDQSw4QkFBOEIsWUFBa0I7QUFDaEQsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFlBQWtCO0FBQ2hELFNBQVM7QUFDVDtBQUNBLDhCQUE4QixRQUFjO0FBQzVDLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQztBQUNNLGdDQUFnQyxZQUFpQjtBQUN4RCxJQUFJLFVBQWU7QUFDbkI7QUFDQSx3Q0FBd0MsTUFBVztBQUNuRCxzQ0FBc0MsSUFBUztBQUMvQyxzQ0FBc0MsSUFBUztBQUMvQyx3Q0FBd0MsU0FBVztBQUNuRCx1Q0FBdUMsS0FBVTtBQUNqRCx1Q0FBdUMsS0FBVTtBQUNqRCx5Q0FBeUMsT0FBWTtBQUNyRCx5Q0FBeUMsT0FBWTtBQUNyRCx5Q0FBeUMsT0FBWTtBQUNyRCx5Q0FBeUMsT0FBWTtBQUNyRCx1Q0FBdUMsS0FBVTtBQUNqRCx1Q0FBdUMsS0FBVTtBQUNqRCx3Q0FBd0MsTUFBVztBQUNuRCx1Q0FBdUMsS0FBVTtBQUNqRCx5Q0FBeUMsT0FBWTtBQUNyRCw0Q0FBNEMsVUFBZTtBQUMzRCxzQ0FBc0MsSUFBUztBQUMvQyx3Q0FBd0MsTUFBVztBQUNuRCx1Q0FBdUMsS0FBVTtBQUNqRCx1Q0FBdUMsS0FBVTtBQUNqRCx5Q0FBeUMsT0FBWTtBQUNyRCx5Q0FBeUMsT0FBWTtBQUNyRCx1Q0FBdUMsS0FBVTtBQUNqRDtBQUNBLDJDQUEyQyxZQUFZO0FBQ3ZELHVDQUF1QyxRQUFRO0FBQy9DLHVDQUF1QyxRQUFRO0FBQy9DLDJDQUEyQyxZQUFZO0FBQ3ZELENBQUM7QUFDTSxTQUFTLGNBQU07QUFDdEIsV0FBVyxPQUFZO0FBQ3ZCO0FBQ08sc0NBQXNDLFlBQWlCO0FBQzlELElBQUksZ0JBQXFCO0FBQ3pCO0FBQ0EsQ0FBQztBQUNNLCtCQUErQixZQUFpQjtBQUN2RDtBQUNBLElBQUksU0FBYztBQUNsQjtBQUNBLENBQUM7QUFDTSxTQUFTLGFBQUs7QUFDckIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sOEJBQThCLFlBQWlCO0FBQ3REO0FBQ0EsSUFBSSxRQUFhO0FBQ2pCO0FBQ0EsQ0FBQztBQUNNLFNBQVMsWUFBSTtBQUNwQixXQUFXLG9CQUFJO0FBQ2Y7QUFDTyw4QkFBOEIsWUFBaUI7QUFDdEQ7QUFDQSxJQUFJLFFBQWE7QUFDakI7QUFDQSxDQUFDO0FBQ00sU0FBUyxZQUFJO0FBQ3BCLFdBQVcsb0JBQUk7QUFDZjtBQUNPO0FBQ1AsV0FBVyxvQkFBSTtBQUNmO0FBQ0E7QUFDTztBQUNQLFdBQVcsb0JBQUk7QUFDZjtBQUNBO0FBQ087QUFDUCxXQUFXLG9CQUFJO0FBQ2Y7QUFDTyw2QkFBNkIsWUFBaUI7QUFDckQ7QUFDQSxJQUFJLE9BQVk7QUFDaEI7QUFDQSxDQUFDO0FBQ007QUFDUCxXQUFXLG9CQUFJO0FBQ2Y7QUFDTztBQUNQLFdBQVcsb0JBQUk7QUFDZixrQkFBa0Isb0JBQUk7QUFDdEIsa0JBQWtCLG9CQUFJO0FBQ3RCLFdBQVcsb0JBQUk7QUFDZixLQUFLO0FBQ0w7QUFDTywrQkFBK0IsWUFBaUI7QUFDdkQ7QUFDQSxJQUFJLFNBQWM7QUFDbEI7QUFDQSxDQUFDO0FBQ00sU0FBUyxhQUFLO0FBQ3JCLFdBQVcsb0JBQUk7QUFDZjtBQUNPLGdDQUFnQyxZQUFpQjtBQUN4RDtBQUNBLElBQUksVUFBZTtBQUNuQjtBQUNBLENBQUM7QUFDTSxTQUFTLGNBQU07QUFDdEIsV0FBVyxvQkFBSTtBQUNmO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxnQkFBZ0I7QUFDekQ7QUFDQTtBQUNPLDhCQUE4QixZQUFpQjtBQUN0RDtBQUNBLElBQUksUUFBYTtBQUNqQjtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QywyQkFBMkI7QUFDcEU7QUFDQTtBQUNPLFNBQVMsWUFBSTtBQUNwQixXQUFXLG9CQUFJO0FBQ2Y7QUFDTywrQkFBK0IsWUFBaUI7QUFDdkQ7QUFDQSxJQUFJLFNBQWM7QUFDbEI7QUFDQSxDQUFDO0FBQ00sU0FBUyxhQUFLO0FBQ3JCLFdBQVcsb0JBQUk7QUFDZjtBQUNPLDhCQUE4QixZQUFpQjtBQUN0RDtBQUNBLElBQUksUUFBYTtBQUNqQjtBQUNBLENBQUM7QUFDTSxTQUFTLFlBQUk7QUFDcEIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sNkJBQTZCLFlBQWlCO0FBQ3JEO0FBQ0EsSUFBSSxPQUFZO0FBQ2hCO0FBQ0EsQ0FBQztBQUNNLFNBQVMsV0FBRztBQUNuQixXQUFXLG9CQUFJO0FBQ2Y7QUFDTywrQkFBK0IsWUFBaUI7QUFDdkQ7QUFDQSxJQUFJLFNBQWM7QUFDbEI7QUFDQSxDQUFDO0FBQ00sU0FBUyxhQUFLO0FBQ3JCLFdBQVcsb0JBQUk7QUFDZjtBQUNPLDhCQUE4QixZQUFpQjtBQUN0RDtBQUNBLElBQUksUUFBYTtBQUNqQjtBQUNBLENBQUM7QUFDTSxTQUFTLFlBQUk7QUFDcEIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sNkJBQTZCLG9FQUFJO0FBQ3hDO0FBQ0EsSUFBSSxvQkFBSTtBQUNSO0FBQ0EsQ0FBQyxDQUFDO0FBQ0ssU0FBUyxXQUFHO0FBQ25CLFdBQVcsb0JBQUk7QUFDZjtBQUNPLDhCQUE4QixZQUFpQjtBQUN0RDtBQUNBLElBQUksUUFBYTtBQUNqQjtBQUNBLENBQUM7QUFDTSxTQUFTLFlBQUk7QUFDcEIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sZ0NBQWdDLFlBQWlCO0FBQ3hELElBQUksVUFBZTtBQUNuQjtBQUNBLENBQUM7QUFDTSxTQUFTLGNBQU07QUFDdEIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sZ0NBQWdDLFlBQWlCO0FBQ3hELElBQUksVUFBZTtBQUNuQjtBQUNBLENBQUM7QUFDTSxTQUFTLGNBQU07QUFDdEIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sZ0NBQWdDLFlBQWlCO0FBQ3hEO0FBQ0EsSUFBSSxVQUFlO0FBQ25CO0FBQ0EsQ0FBQztBQUNNLFNBQVMsY0FBTTtBQUN0QixXQUFXLG9CQUFJO0FBQ2Y7QUFDTyxtQ0FBbUMsWUFBaUI7QUFDM0Q7QUFDQSxJQUFJLGFBQWtCO0FBQ3RCO0FBQ0EsQ0FBQztBQUNNLFNBQVMsaUJBQVM7QUFDekIsV0FBVyxvQkFBSTtBQUNmO0FBQ08sOEJBQThCLFlBQWlCO0FBQ3REO0FBQ0EsSUFBSSxRQUFhO0FBQ2pCO0FBQ0EsQ0FBQztBQUNNLFNBQVMsWUFBSTtBQUNwQixXQUFXLG9CQUFJO0FBQ2Y7QUFDTyw2QkFBNkIsWUFBaUI7QUFDckQ7QUFDQSxJQUFJLE9BQVk7QUFDaEI7QUFDQSxDQUFDO0FBQ007QUFDUCxXQUFXLG9CQUFJO0FBQ2Y7QUFDTyw0Q0FBNEMsb0VBQUk7QUFDdkQ7QUFDQSxJQUFJLG9CQUFJO0FBQ1I7QUFDQSxDQUFDLENBQUM7QUFDSyxxREFBcUQ7QUFDNUQsV0FBVyxvQkFBSTtBQUNmO0FBQ08sU0FBUyxnQkFBUTtBQUN4QixXQUFXLG9CQUFJLGtEQUFrRCxvQkFBSTtBQUNyRTtBQUNPLFNBQVMsV0FBRztBQUNuQixXQUFXLG9CQUFJLDZDQUE2QyxvQkFBSTtBQUNoRTtBQUNPO0FBQ1A7QUFDQSxzQkFBc0IsSUFBSSxHQUFHLElBQUk7QUFDakMsa0JBQWtCLG9CQUFJO0FBQ3RCO0FBQ0EscURBQXFELE9BQU87QUFDNUQsV0FBVyxvQkFBSTtBQUNmO0FBQ08sZ0NBQWdDLFlBQWlCO0FBQ3hELElBQUksVUFBZTtBQUNuQjtBQUNBLHlEQUF5RCxlQUEwQjtBQUNuRjtBQUNBO0FBQ0EsOEJBQThCLEdBQVM7QUFDdkMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLElBQVU7QUFDeEMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLElBQVU7QUFDeEMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLEdBQVM7QUFDdkMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLElBQVU7QUFDeEMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLElBQVU7QUFDeEMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFdBQUc7QUFDakMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFdBQUc7QUFDakMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLEdBQVM7QUFDdkMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLElBQVU7QUFDeEMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLEdBQVM7QUFDdkMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLElBQVU7QUFDeEMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFdBQWlCO0FBQy9DLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixXQUFpQjtBQUMvQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDTSxTQUFTLGNBQU07QUFDdEIsV0FBVyxPQUFZO0FBQ3ZCO0FBQ08sc0NBQXNDLFlBQWlCO0FBQzlELElBQUksZ0JBQXFCO0FBQ3pCO0FBQ0EsQ0FBQztBQUNNLFNBQVMsV0FBRztBQUNuQixXQUFXLElBQVM7QUFDcEI7QUFDTztBQUNQLFdBQVcsb0JBQUk7QUFDZjtBQUNPO0FBQ1AsV0FBVyxvQkFBSTtBQUNmO0FBQ087QUFDUCxXQUFXLG9CQUFJO0FBQ2Y7QUFDTztBQUNQLFdBQVcsb0JBQUk7QUFDZjtBQUNPLGlDQUFpQyxZQUFpQjtBQUN6RCxJQUFJLFdBQWdCO0FBQ3BCO0FBQ0EseURBQXlELGdCQUEyQjtBQUNwRixDQUFDO0FBQ00sU0FBUyxlQUFPO0FBQ3ZCLFdBQVcsUUFBYTtBQUN4QjtBQUNPLGdDQUFnQyxvRUFBSTtBQUMzQyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBLDZDQUE2QyxjQUFNO0FBQ25ELDZDQUE2QyxjQUFNO0FBQ25ELDRDQUE0QyxjQUFNO0FBQ2xELDZDQUE2QyxjQUFNO0FBQ25ELDZDQUE2QyxjQUFNO0FBQ25ELDRDQUE0QyxjQUFNO0FBQ2xELDZDQUE2QyxjQUFNO0FBQ25ELDZDQUE2QyxjQUFNO0FBQ25ELDJDQUEyQyxjQUFNO0FBQ2pELDJDQUEyQyxjQUFNO0FBQ2pELDhDQUE4QyxjQUFNO0FBQ3BELDhDQUE4QyxjQUFNO0FBQ3BELG9EQUFvRCxjQUFNO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0ssU0FBUyxjQUFNO0FBQ3RCLFdBQVcsb0JBQUk7QUFDZjtBQUNPLHNDQUFzQyxvRUFBSTtBQUNqRCxJQUFJLG9CQUFJO0FBQ1I7QUFDQSxDQUFDLENBQUM7QUFDRjtBQUNPO0FBQ1AsV0FBVyxvQkFBSTtBQUNmO0FBQ0E7QUFDTztBQUNQLFdBQVcsb0JBQUk7QUFDZjtBQUNPLGdDQUFnQyxvRUFBSTtBQUMzQyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBLENBQUMsQ0FBQztBQUNLO0FBQ1AsV0FBVyxvQkFBSTtBQUNmO0FBQ08sbUNBQW1DLG9FQUFJO0FBQzlDLElBQUksb0JBQUk7QUFDUjtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0YsU0FBUyxpQkFBVTtBQUNuQixXQUFXLG9CQUFJO0FBQ2Y7QUFDbUM7QUFDNUIsOEJBQThCLG9FQUFJO0FBQ3pDLElBQUksb0JBQUk7QUFDUjtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0YsU0FBUyxZQUFLO0FBQ2QsV0FBVyxvQkFBSTtBQUNmO0FBQ3lCO0FBQ2xCLDZCQUE2QixvRUFBSTtBQUN4QyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBLENBQUMsQ0FBQztBQUNLO0FBQ1AsV0FBVyxvQkFBSTtBQUNmO0FBQ08saUNBQWlDLFlBQWlCO0FBQ3pELElBQUksV0FBZ0I7QUFDcEI7QUFDQSx5REFBeUQsZ0JBQTJCO0FBQ3BGLENBQUM7QUFDTTtBQUNQLFdBQVcsUUFBYTtBQUN4QjtBQUNPLCtCQUErQixZQUFpQjtBQUN2RCxJQUFJLFNBQWM7QUFDbEI7QUFDQSx5REFBeUQsY0FBeUI7QUFDbEYsQ0FBQztBQUNNO0FBQ1AsV0FBVyxNQUFXO0FBQ3RCO0FBQ08sOEJBQThCLG9FQUFJO0FBQ3pDLElBQUksb0JBQUk7QUFDUjtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0YsU0FBUyxZQUFLO0FBQ2QsV0FBVyxvQkFBSTtBQUNmO0FBQ3lCO0FBQ2xCLDhCQUE4QixvRUFBSTtBQUN6QyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBLDZDQUE2QyxjQUFNO0FBQ25ELDZDQUE2QyxjQUFNO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQztBQUNLLFNBQVMsWUFBSTtBQUNwQixXQUFXLG9CQUFJO0FBQ2Y7QUFDTywrQkFBK0IsWUFBaUI7QUFDdkQsSUFBSSxTQUFjO0FBQ2xCO0FBQ0EseURBQXlELGNBQXlCO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixVQUFnQjtBQUM5QyxTQUFTO0FBQ1Q7QUFDQSw4QkFBOEIsVUFBZ0I7QUFDOUMsU0FBUztBQUNUO0FBQ0EsOEJBQThCLFVBQWdCO0FBQzlDLFNBQVM7QUFDVDtBQUNBLDhCQUE4QixPQUFhO0FBQzNDLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ007QUFDUCxXQUFXLE1BQVc7QUFDdEI7QUFDQTtBQUNPO0FBQ1A7QUFDQSxXQUFXLFlBQUs7QUFDaEI7QUFDTyxnQ0FBZ0MsWUFBaUI7QUFDeEQsSUFBSSxhQUFrQjtBQUN0QjtBQUNBLHlEQUF5RCxlQUEwQjtBQUNuRixJQUFJLFVBQWU7QUFDbkI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLG1CQUFtQixZQUFLO0FBQ3hCLFNBQVM7QUFDVDtBQUNBLGdDQUFnQyxzQ0FBc0M7QUFDdEUsU0FBUztBQUNUO0FBQ0EsZ0NBQWdDLHVDQUF1QztBQUN2RSxTQUFTO0FBQ1Q7QUFDQSxnQ0FBZ0MsdUNBQXVDO0FBQ3ZFLFNBQVM7QUFDVDtBQUNBLGdDQUFnQyxxQ0FBcUM7QUFDckUsU0FBUztBQUNUO0FBQ0EsZ0NBQWdDLHVDQUF1QztBQUN2RSxTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsTUFBVztBQUM5QixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsVUFBZTtBQUNsQyxTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsS0FBVTtBQUM3QixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsSUFBUztBQUM1QixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsSUFBUztBQUM1QixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsT0FBWTtBQUMvQixTQUFTO0FBQ1Q7QUFDQSxtQkFBbUIsUUFBYTtBQUNoQyxTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUM7QUFDTTtBQUNQO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsV0FBVyxlQUFvQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLG9CQUFJO0FBQ2YsS0FBSztBQUNMO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxvQkFBSTtBQUNmLEtBQUs7QUFDTDtBQUNPLCtCQUErQixZQUFpQjtBQUN2RCxJQUFJLFNBQWM7QUFDbEI7QUFDQSx5REFBeUQsY0FBeUI7QUFDbEY7QUFDQSxDQUFDO0FBQ007QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQW9CO0FBQy9CLEtBQUs7QUFDTDtBQUNPLDZCQUE2QixvRUFBSTtBQUN4QztBQUNBLElBQUksb0JBQUk7QUFDUjtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsb0JBQUk7QUFDZixLQUFLO0FBQ0w7QUFDTyw0Q0FBNEMsb0VBQUk7QUFDdkQ7QUFDQSxJQUFJLG9CQUFJO0FBQ1IsQ0FBQyxDQUFDO0FBQ0s7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxvQkFBSTtBQUNmLEtBQUs7QUFDTDtBQUNPLHNDQUFzQyxZQUFpQjtBQUM5RCxJQUFJLGdCQUFxQjtBQUN6QjtBQUNBLHlEQUF5RCxxQkFBZ0M7QUFDekYsQ0FBQztBQUNNO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTywrQkFBK0Isb0VBQUk7QUFDMUMsSUFBSSxvQkFBSTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxDQUFDO0FBQ0s7QUFDUCw2Q0FBNkMsb0JBQUk7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxvQkFBSTtBQUNmLEtBQUs7QUFDTDtBQUNPLGdDQUFnQyxvRUFBSTtBQUMzQyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUM7QUFDSztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGNBQU07QUFDM0I7QUFDQSxlQUFlLG9CQUFJO0FBQ25CLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxvQkFBSTtBQUNmLEtBQUs7QUFDTDtBQUNBO0FBQ087QUFDUCxjQUFjLG9CQUFJO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLG9CQUFJO0FBQ2YsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxvQkFBSTtBQUNmLEtBQUs7QUFDTDtBQUNPLDZCQUE2QixvRUFBSTtBQUN4QyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsb0JBQUk7QUFDM0MsMkNBQTJDLG9CQUFJO0FBQy9DLHVDQUF1QyxvQkFBSTtBQUMzQyx3Q0FBd0Msb0JBQUk7QUFDNUMsQ0FBQyxDQUFDO0FBQ0s7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsb0JBQUk7QUFDZixLQUFLO0FBQ0w7QUFDTyw2QkFBNkIsb0VBQUk7QUFDeEMsSUFBSSxvQkFBSTtBQUNSO0FBQ0E7QUFDQSx1Q0FBdUMsb0JBQUk7QUFDM0MsMkNBQTJDLG9CQUFJO0FBQy9DLHVDQUF1QyxvQkFBSTtBQUMzQyx3Q0FBd0Msb0JBQUk7QUFDNUMsQ0FBQyxDQUFDO0FBQ0s7QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXLG9CQUFJO0FBQ2YsS0FBSztBQUNMO0FBQ08sOEJBQThCLFlBQWlCO0FBQ3RELElBQUksUUFBYTtBQUNqQjtBQUNBLHlEQUF5RCxhQUF3QjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxPQUFPO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxlQUFvQjtBQUNuQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsT0FBTztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZUFBb0I7QUFDbkM7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDO0FBQ0QsU0FBUyxZQUFLO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQW9CO0FBQy9CLEtBQUs7QUFDTDtBQUN5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXLG9CQUFJO0FBQ2YsS0FBSztBQUNMO0FBQ08saUNBQWlDLFlBQWlCO0FBQ3pELElBQUksV0FBZ0I7QUFDcEI7QUFDQSx5REFBeUQsZ0JBQTJCO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ007QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXLGVBQW9CO0FBQy9CLEtBQUs7QUFDTDtBQUNPLDhCQUE4QixvRUFBSTtBQUN6QyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBLDRDQUE0QyxvQkFBSTtBQUNoRCw0Q0FBNEMsb0JBQUk7QUFDaEQsOENBQThDLG9CQUFJO0FBQ2xELENBQUMsQ0FBQztBQUNLO0FBQ1AsV0FBVyxvQkFBSTtBQUNmO0FBQ08sbUNBQW1DLFlBQWlCO0FBQzNELElBQUksYUFBa0I7QUFDdEI7QUFDQSx5REFBeUQsa0JBQTZCO0FBQ3RGO0FBQ0E7QUFDQSxzQkFBc0IsZUFBb0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFVBQVU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsVUFBVTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ007QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTyxrQ0FBa0MsWUFBaUI7QUFDMUQsSUFBSSxZQUFpQjtBQUNyQjtBQUNBLHlEQUF5RCxpQkFBNEI7QUFDckY7QUFDQSxDQUFDO0FBQ007QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTyx1Q0FBdUMsWUFBaUI7QUFDL0QsSUFBSSxpQkFBc0I7QUFDMUI7QUFDQSx5REFBeUQsaUJBQTRCO0FBQ3JGO0FBQ0EsQ0FBQztBQUNNO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ08sa0NBQWtDLFlBQWlCO0FBQzFELElBQUksWUFBaUI7QUFDckI7QUFDQSx5REFBeUQsaUJBQTRCO0FBQ3JGO0FBQ0EsQ0FBQztBQUNNO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDTyxTQUFTLGVBQU87QUFDdkI7QUFDQTtBQUNPLGlDQUFpQyxZQUFpQjtBQUN6RCxJQUFJLFdBQWdCO0FBQ3BCO0FBQ0EseURBQXlELGdCQUEyQjtBQUNwRjtBQUNBO0FBQ0EsQ0FBQztBQUNNLFNBQVMsZUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxZQUFpQjtBQUMxRixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ08sa0NBQWtDLFlBQWlCO0FBQzFELElBQUksWUFBaUI7QUFDckI7QUFDQSx5REFBeUQsaUJBQTRCO0FBQ3JGO0FBQ0EsQ0FBQztBQUNNO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsWUFBaUI7QUFDMUYsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNPLHFDQUFxQyxZQUFpQjtBQUM3RCxJQUFJLGVBQW9CO0FBQ3hCO0FBQ0EseURBQXlELG9CQUErQjtBQUN4RjtBQUNBLENBQUM7QUFDTTtBQUNQO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZUFBb0I7QUFDL0IsS0FBSztBQUNMO0FBQ08saUNBQWlDLG9FQUFJO0FBQzVDLElBQUksb0JBQUk7QUFDUjtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUM7QUFDSztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPLCtCQUErQixZQUFpQjtBQUN2RCxJQUFJLFNBQWM7QUFDbEI7QUFDQSx5REFBeUQsY0FBeUI7QUFDbEY7QUFDQTtBQUNBLENBQUM7QUFDRCxTQUFTLGFBQU07QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMyQjtBQUNwQiw2QkFBNkIsb0VBQUk7QUFDeEMsSUFBSSxvQkFBSTtBQUNSO0FBQ0E7QUFDQSxDQUFDLENBQUM7QUFDSztBQUNQLFdBQVcsb0JBQUk7QUFDZjtBQUNPLDhCQUE4QixZQUFpQjtBQUN0RCxJQUFJLFFBQWE7QUFDakI7QUFDQSx5REFBeUQsYUFBd0I7QUFDakY7QUFDQTtBQUNBLENBQUM7QUFDTTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTywrQkFBK0Isb0VBQUk7QUFDMUM7QUFDQSxJQUFJLG9CQUFJO0FBQ1IsQ0FBQyxDQUFDO0FBQ0s7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ08sb0NBQW9DLG9FQUFJO0FBQy9DO0FBQ0EsSUFBSSxvQkFBSTtBQUNSLENBQUMsQ0FBQztBQUNLLGtDQUFrQyxZQUFpQjtBQUMxRCxJQUFJLFlBQWlCO0FBQ3JCO0FBQ0EseURBQXlELGlCQUE0QjtBQUNyRjtBQUNBLENBQUM7QUFDTTtBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPLHlDQUF5QyxvRUFBSTtBQUNwRCxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBLENBQUMsQ0FBQztBQUNLO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsV0FBVyxvQkFBSTtBQUNmLEtBQUs7QUFDTDtBQUNPLDhCQUE4QixvRUFBSTtBQUN6QyxJQUFJLG9CQUFJO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0s7QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDTyxpQ0FBaUMsb0VBQUk7QUFDNUMsSUFBSSxvQkFBSTtBQUNSO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQztBQUNLO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ08sa0NBQWtDLG9FQUFJO0FBQzdDLElBQUksb0JBQUk7QUFDUjtBQUNBO0FBQ0EsQ0FBQyxDQUFDO0FBQ0s7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNpQztBQUMxQixnQ0FBZ0MsWUFBaUI7QUFDeEQsSUFBSSxVQUFlO0FBQ25CO0FBQ0EseURBQXlELGVBQTBCO0FBQ25GLENBQUM7QUFDRDtBQUNPO0FBQ1AsbUJBQW1CLG9CQUFJO0FBQ3ZCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ087QUFDUCxXQUFXLG9CQUFJO0FBQ2Y7QUFDTyxnQ0FBZ0M7QUFDdkMsV0FBVyxPQUFZO0FBQ3ZCO0FBQ0E7QUFDTztBQUNQLFdBQVcsWUFBaUI7QUFDNUI7QUFDQTtBQUNPLE1BQU0sZ0JBQVEsR0FBRyxRQUFhO0FBQzlCLE1BQU0sWUFBSSxHQUFHLElBQVM7QUFDN0IscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLG9CQUFJO0FBQ2YsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ3FDO0FBQ3JDO0FBQ08sZ0NBQWdDLG9CQUFJO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDTTtBQUNQO0FBQ0Esc0JBQXNCLGNBQU0sVUFBVSxjQUFNLElBQUksZUFBTyxJQUFJLFlBQUssOEJBQThCLGNBQU07QUFDcEcsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQ2wzQ3dCO0FBQ2pCLHdCQUF3QixZQUFNO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sc0JBQXNCLFlBQU07QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sd0JBQXdCLE1BQVE7QUFDdkMsV0FBVyxjQUNJO0FBQ2Y7QUFDQTtBQUNBLGFBQWEsY0FDRTtBQUNmO0FBQ0E7QUFDQSxjQUFjLGNBQ0M7QUFDZjtBQUNBO0FBQ0EsWUFBWSxPQUFTO0FBQ3JCO0FBQ0EsWUFBWSxlQUFTO0FBQ3JCLFlBQVksY0FDRztBQUNmO0FBQ0E7QUFDQSxZQUFZLE9BQVM7QUFDckIsaUJBQWlCLGNBQVE7QUFDekIsa0JBQWtCLEtBQU8sQ0FBQyxjQUFRO0FBQ2xDLHNCQUFzQixLQUFPLENBQUMsY0FBUTtBQUN0QyxjQUFjLEtBQU8sQ0FBQyxjQUFRO0FBQzlCLFNBQVMsY0FBUSx3Q0FBd0MsT0FBUztBQUNsRTtBQUNBLGVBQWUsY0FBUTtBQUN2QixjQUFjLGNBQVE7QUFDdEIsV0FBVyxjQUFRO0FBQ25CLENBQUM7QUFDTTtBQUNBLDhCQUE4QixNQUFRO0FBQzdDO0FBQ0EsZUFBZSxjQUFRO0FBQ3ZCLENBQUM7QUFDTTtBQUNQO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDTztBQUNQO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDTztBQUNQO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDTztBQUNBO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08scUNBQXFDLCtEQUFlO0FBQzNEO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsY0FBUSxvQkFBb0IsT0FBTztBQUN4RSw4QkFBOEIsY0FDbkI7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixLQUNqQixDQUFDLGNBQVE7QUFDbkI7QUFDQSxvQkFBb0IsS0FDVixFQUFFLGNBQVEsaUJBQWlCLE9BQVM7QUFDOUM7QUFDQTtBQUNPLDhCQUE4QixZQUFNO0FBQ3BDLGdDQUFnQyxZQUFNO0FBQ3RDLG9DQUFvQyxZQUFNO0FBQzFDLGlDQUFpQyxZQUFNO0FBQ3ZDLCtCQUErQixZQUFNO0FBQ3JDLGdDQUFnQyxZQUFNO0FBQ3RDLDJCQUEyQixZQUFNO0FBQ2pDLGlDQUFpQyxLQUM5QjtBQUNWO0FBQ0Esa0NBQWtDLE1BQ3ZCO0FBQ1gsU0FBUyxjQUFRO0FBQ2pCLFNBQVMsY0FBUTtBQUNqQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsY0FBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFRO0FBQ3ZCLGVBQWUsY0FBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxnQ0FBZ0MsTUFDNUI7QUFDWDtBQUNBO0FBQ0EsVUFBVSxLQUFPLENBQUMsY0FBUTtBQUMxQixDQUFDO0FBQ0Q7QUFDTyxnQ0FBZ0MsTUFDNUI7QUFDWDtBQUNBO0FBQ0EsVUFBVSxLQUFPLENBQUMsY0FBUTtBQUMxQixDQUFDO0FBQ0Q7QUFDTywwQkFBMEIsTUFDdEI7QUFDWDtBQUNBO0FBQ0E7QUFDQSxVQUFVLEtBQU8sQ0FBQyxjQUFRO0FBQzFCO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDTyxzQ0FBc0MsTUFBUTtBQUNyRDtBQUNBLENBQUM7QUFDTSxpQ0FBaUMsTUFBUTtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxVQUFVLEtBQU8sQ0FBQyxjQUFRO0FBQzFCLFlBQVksY0FBUTtBQUNwQixDQUFDOzs7QUN0Uk07QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087OztBQ1RQO0FBQ3dFO0FBQ3hFO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixvQkFBb0I7QUFDaEQ7QUFDQSw0QkFBNEIsR0FBRyxnQkFBZ0IsdUJBQXVCO0FBQ3RFLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLG1DQUFtQyx3QkFBd0I7QUFDM0QsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsdUJBQXVCLDBDQUEwQztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxvREFBb0Q7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxpRUFBaUU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsdUJBQXVCLDJCQUEyQjtBQUNsRDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUNsQztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxzQkFBc0I7QUFDdEIsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDTztBQUNQLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHdDQUF3QztBQUMvRDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isb0RBQW9EO0FBQzFFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix5QkFBeUI7QUFDcEQsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQ3ZOQTtBQUNtRTtBQUNzQjtBQUNsRjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFVBQVU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsVUFBVSxHQUFHLDhDQUE4QztBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGFBQWEsRUFBRSxLQUFLO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFVBQVUsR0FBRyw4Q0FBOEM7QUFDakYsc0JBQXNCLHFCQUFxQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyx5QkFBeUI7QUFDekQsOERBQThELGdCQUFnQjtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUJBQXVCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTTtBQUN6QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLGlCQUFpQjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsNkJBQTZCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGtDQUFrQztBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsVUFBVTtBQUM3QyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0UsR0FBRztBQUMzRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EseUVBQXlFLEdBQUc7QUFDNUU7QUFDQSxtQ0FBbUMsUUFBUTtBQUMzQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSw4QkFBOEIsVUFBVTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7O0FDelN3QztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNQLDJCQUEyQixXQUFXO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx5QkFBeUI7QUFDOUQsZ0RBQWdELDJCQUEyQjtBQUMzRSxpQ0FBaUMsMkJBQTJCO0FBQzVEO0FBQ0E7QUFDTztBQUNQO0FBQ0EscUNBQXFDLGlCQUFpQjtBQUN0RCxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7OztBQ25CQTtBQUM0RDtBQUM2SztBQUM5SztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0NBQXNDO0FBQzdELEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsa0JBQWtCLGNBQWM7QUFDaEMscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxzQkFBc0IsWUFBWTtBQUNsQyxnQkFBZ0IsY0FBYztBQUM5Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGdEQUFnRCxhQUFhO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxrQkFBa0I7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQSxpQ0FBaUMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsV0FBVyxVQUFVLHdCQUF3QjtBQUNyRTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0EsaUJBQWlCLHVCQUF1QjtBQUN4QztBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQSxpQ0FBaUMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixXQUFXLGtDQUFrQyxrQ0FBa0M7QUFDdkc7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsbUJBQW1CO0FBQ2hEO0FBQ0EscUNBQXFDLGFBQWE7QUFDbEQsa0NBQWtDLFVBQVU7QUFDNUMseURBQXlELGFBQWE7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBLGlDQUFpQyxhQUFhO0FBQzlDLDhCQUE4QixVQUFVO0FBQ3hDLGdEQUFnRCxhQUFhO0FBQzdELGNBQWMsbUJBQW1CO0FBQ2pDO0FBQ0E7QUFDQSxvQkFBb0IsMENBQTBDO0FBQzlEO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxhQUFhO0FBQzlDLDhCQUE4QixVQUFVO0FBQ3hDLHNDQUFzQyxhQUFhO0FBQ25EO0FBQ0E7QUFDQSxvQkFBb0IsaURBQWlEO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0EsY0FBYyxtQkFBbUI7QUFDakM7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxhQUFhO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixXQUFXLGlDQUFpQyxrQkFBa0I7QUFDekYsbUNBQW1DLGNBQWM7QUFDakQsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGNBQWM7QUFDNUI7QUFDQTtBQUNBLGNBQWMsaUJBQWlCO0FBQy9CO0FBQ0EsY0FBYyxxQkFBcUI7QUFDbkMsUUFBUSxjQUFjO0FBQ3RCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsZ0JBQWdCO0FBQzdDO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBO0FBQ0EsY0FBYyxnQkFBZ0I7QUFDOUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsMkJBQTJCLFdBQVc7QUFDdkQ7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxhQUFhO0FBQzlDLG1DQUFtQyxRQUFRLFdBQVcsYUFBYTtBQUNuRSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsWUFBWTtBQUNwQjtBQUNBLFlBQVksY0FBYztBQUMxQiwyQkFBMkIsZUFBZTtBQUMxQyxTQUFTO0FBQ1Q7QUFDQSwyQkFBMkIsc0NBQXNDO0FBQ2pFLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSw0Q0FBNEMsbUNBQW1DO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLHNCQUFzQjtBQUNwRTtBQUNBO0FBQ0EsOENBQThDLHdCQUF3QjtBQUN0RTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsZ0JBQWdCLHVCQUF1QjtBQUMvQztBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL2NvcmUuanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4zL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9yZWdleGVzLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMy9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvdXRpbC5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL2NoZWNrcy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL2RvYy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL3BhcnNlLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMy9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvdmVyc2lvbnMuanMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4zL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9zY2hlbWFzLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMy9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvcmVnaXN0cmllcy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL2FwaS5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL3RvLWpzb24tc2NoZW1hLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMy9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvanNvbi1zY2hlbWEtcHJvY2Vzc29ycy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jbGFzc2ljL2lzby5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jbGFzc2ljL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjMvbm9kZV9tb2R1bGVzL3pvZC92NC9jbGFzc2ljL3BhcnNlLmpzIiwid2VicGFjazovL0BzbG90aGluZy9leHRlbnNpb24vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMy9ub2RlX21vZHVsZXMvem9kL3Y0L2NsYXNzaWMvc2NoZW1hcy5qcyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvc2NoZW1hcy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL3NoYXJlZC90eXBlcy50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvc3RvcmFnZS50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvYXBpLWNsaWVudC50cyIsIndlYnBhY2s6Ly9Ac2xvdGhpbmcvZXh0ZW5zaW9uLy4vc3JjL2JhY2tncm91bmQvYmFkZ2UudHMiLCJ3ZWJwYWNrOi8vQHNsb3RoaW5nL2V4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfYTtcbi8qKiBBIHNwZWNpYWwgY29uc3RhbnQgd2l0aCB0eXBlIGBuZXZlcmAgKi9cbmV4cG9ydCBjb25zdCBORVZFUiA9IC8qQF9fUFVSRV9fKi8gT2JqZWN0LmZyZWV6ZSh7XG4gICAgc3RhdHVzOiBcImFib3J0ZWRcIixcbn0pO1xuZXhwb3J0IC8qQF9fTk9fU0lERV9FRkZFQ1RTX18qLyBmdW5jdGlvbiAkY29uc3RydWN0b3IobmFtZSwgaW5pdGlhbGl6ZXIsIHBhcmFtcykge1xuICAgIGZ1bmN0aW9uIGluaXQoaW5zdCwgZGVmKSB7XG4gICAgICAgIGlmICghaW5zdC5fem9kKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdCwgXCJfem9kXCIsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICBkZWYsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cjogXyxcbiAgICAgICAgICAgICAgICAgICAgdHJhaXRzOiBuZXcgU2V0KCksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnN0Ll96b2QudHJhaXRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGluc3QuX3pvZC50cmFpdHMuYWRkKG5hbWUpO1xuICAgICAgICBpbml0aWFsaXplcihpbnN0LCBkZWYpO1xuICAgICAgICAvLyBzdXBwb3J0IHByb3RvdHlwZSBtb2RpZmljYXRpb25zXG4gICAgICAgIGNvbnN0IHByb3RvID0gXy5wcm90b3R5cGU7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm90byk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgayA9IGtleXNbaV07XG4gICAgICAgICAgICBpZiAoIShrIGluIGluc3QpKSB7XG4gICAgICAgICAgICAgICAgaW5zdFtrXSA9IHByb3RvW2tdLmJpbmQoaW5zdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZG9lc24ndCB3b3JrIGlmIFBhcmVudCBoYXMgYSBjb25zdHJ1Y3RvciB3aXRoIGFyZ3VtZW50c1xuICAgIGNvbnN0IFBhcmVudCA9IHBhcmFtcz8uUGFyZW50ID8/IE9iamVjdDtcbiAgICBjbGFzcyBEZWZpbml0aW9uIGV4dGVuZHMgUGFyZW50IHtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KERlZmluaXRpb24sIFwibmFtZVwiLCB7IHZhbHVlOiBuYW1lIH0pO1xuICAgIGZ1bmN0aW9uIF8oZGVmKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgaW5zdCA9IHBhcmFtcz8uUGFyZW50ID8gbmV3IERlZmluaXRpb24oKSA6IHRoaXM7XG4gICAgICAgIGluaXQoaW5zdCwgZGVmKTtcbiAgICAgICAgKF9hID0gaW5zdC5fem9kKS5kZWZlcnJlZCA/PyAoX2EuZGVmZXJyZWQgPSBbXSk7XG4gICAgICAgIGZvciAoY29uc3QgZm4gb2YgaW5zdC5fem9kLmRlZmVycmVkKSB7XG4gICAgICAgICAgICBmbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXywgXCJpbml0XCIsIHsgdmFsdWU6IGluaXQgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF8sIFN5bWJvbC5oYXNJbnN0YW5jZSwge1xuICAgICAgICB2YWx1ZTogKGluc3QpID0+IHtcbiAgICAgICAgICAgIGlmIChwYXJhbXM/LlBhcmVudCAmJiBpbnN0IGluc3RhbmNlb2YgcGFyYW1zLlBhcmVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0Py5fem9kPy50cmFpdHM/LmhhcyhuYW1lKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXywgXCJuYW1lXCIsIHsgdmFsdWU6IG5hbWUgfSk7XG4gICAgcmV0dXJuIF87XG59XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gICBVVElMSVRJRVMgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydCBjb25zdCAkYnJhbmQgPSBTeW1ib2woXCJ6b2RfYnJhbmRcIik7XG5leHBvcnQgY2xhc3MgJFpvZEFzeW5jRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKGBFbmNvdW50ZXJlZCBQcm9taXNlIGR1cmluZyBzeW5jaHJvbm91cyBwYXJzZS4gVXNlIC5wYXJzZUFzeW5jKCkgaW5zdGVhZC5gKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgJFpvZEVuY29kZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgc3VwZXIoYEVuY291bnRlcmVkIHVuaWRpcmVjdGlvbmFsIHRyYW5zZm9ybSBkdXJpbmcgZW5jb2RlOiAke25hbWV9YCk7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiWm9kRW5jb2RlRXJyb3JcIjtcbiAgICB9XG59XG4oX2EgPSBnbG9iYWxUaGlzKS5fX3pvZF9nbG9iYWxDb25maWcgPz8gKF9hLl9fem9kX2dsb2JhbENvbmZpZyA9IHt9KTtcbmV4cG9ydCBjb25zdCBnbG9iYWxDb25maWcgPSBnbG9iYWxUaGlzLl9fem9kX2dsb2JhbENvbmZpZztcbmV4cG9ydCBmdW5jdGlvbiBjb25maWcobmV3Q29uZmlnKSB7XG4gICAgaWYgKG5ld0NvbmZpZylcbiAgICAgICAgT2JqZWN0LmFzc2lnbihnbG9iYWxDb25maWcsIG5ld0NvbmZpZyk7XG4gICAgcmV0dXJuIGdsb2JhbENvbmZpZztcbn1cbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSBcIi4vdXRpbC5qc1wiO1xuLyoqXG4gKiBAZGVwcmVjYXRlZCBDVUlEIHYxIGlzIGRlcHJlY2F0ZWQgYnkgaXRzIGF1dGhvcnMgZHVlIHRvIGluZm9ybWF0aW9uIGxlYWthZ2VcbiAqICh0aW1lc3RhbXBzIGVtYmVkZGVkIGluIHRoZSBpZCkuIFVzZSB7QGxpbmsgY3VpZDJ9IGluc3RlYWQuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhcmFsbGVsZHJpdmUvY3VpZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGN1aWQgPSAvXltjQ11bMC05YS16XXs2LH0kLztcbmV4cG9ydCBjb25zdCBjdWlkMiA9IC9eWzAtOWEtel0rJC87XG5leHBvcnQgY29uc3QgdWxpZCA9IC9eWzAtOUEtSEpLTU5QLVRWLVphLWhqa21ucC10di16XXsyNn0kLztcbmV4cG9ydCBjb25zdCB4aWQgPSAvXlswLTlhLXZBLVZdezIwfSQvO1xuZXhwb3J0IGNvbnN0IGtzdWlkID0gL15bQS1aYS16MC05XXsyN30kLztcbmV4cG9ydCBjb25zdCBuYW5vaWQgPSAvXlthLXpBLVowLTlfLV17MjF9JC87XG4vKiogSVNPIDg2MDEtMSBkdXJhdGlvbiByZWdleC4gRG9lcyBub3Qgc3VwcG9ydCB0aGUgODYwMS0yIGV4dGVuc2lvbnMgbGlrZSBuZWdhdGl2ZSBkdXJhdGlvbnMgb3IgZnJhY3Rpb25hbC9uZWdhdGl2ZSBjb21wb25lbnRzLiAqL1xuZXhwb3J0IGNvbnN0IGR1cmF0aW9uID0gL15QKD86KFxcZCtXKXwoPyEuKlcpKD89XFxkfFRcXGQpKFxcZCtZKT8oXFxkK00pPyhcXGQrRCk/KFQoPz1cXGQpKFxcZCtIKT8oXFxkK00pPyhcXGQrKFsuLF1cXGQrKT9TKT8pPykkLztcbi8qKiBJbXBsZW1lbnRzIElTTyA4NjAxLTIgZXh0ZW5zaW9ucyBsaWtlIGV4cGxpY2l0ICstIHByZWZpeGVzLCBtaXhpbmcgd2Vla3Mgd2l0aCBvdGhlciB1bml0cywgYW5kIGZyYWN0aW9uYWwvbmVnYXRpdmUgY29tcG9uZW50cy4gKi9cbmV4cG9ydCBjb25zdCBleHRlbmRlZER1cmF0aW9uID0gL15bLStdP1AoPyEkKSg/Oig/OlstK10/XFxkK1kpfCg/OlstK10/XFxkK1suLF1cXGQrWSQpKT8oPzooPzpbLStdP1xcZCtNKXwoPzpbLStdP1xcZCtbLixdXFxkK00kKSk/KD86KD86Wy0rXT9cXGQrVyl8KD86Wy0rXT9cXGQrWy4sXVxcZCtXJCkpPyg/Oig/OlstK10/XFxkK0QpfCg/OlstK10/XFxkK1suLF1cXGQrRCQpKT8oPzpUKD89W1xcZCstXSkoPzooPzpbLStdP1xcZCtIKXwoPzpbLStdP1xcZCtbLixdXFxkK0gkKSk/KD86KD86Wy0rXT9cXGQrTSl8KD86Wy0rXT9cXGQrWy4sXVxcZCtNJCkpPyg/OlstK10/XFxkKyg/OlsuLF1cXGQrKT9TKT8pPz8kLztcbi8qKiBBIHJlZ2V4IGZvciBhbnkgVVVJRC1saWtlIGlkZW50aWZpZXI6IDgtNC00LTQtMTIgaGV4IHBhdHRlcm4gKi9cbmV4cG9ydCBjb25zdCBndWlkID0gL14oWzAtOWEtZkEtRl17OH0tWzAtOWEtZkEtRl17NH0tWzAtOWEtZkEtRl17NH0tWzAtOWEtZkEtRl17NH0tWzAtOWEtZkEtRl17MTJ9KSQvO1xuLyoqIFJldHVybnMgYSByZWdleCBmb3IgdmFsaWRhdGluZyBhbiBSRkMgOTU2Mi80MTIyIFVVSUQuXG4gKlxuICogQHBhcmFtIHZlcnNpb24gT3B0aW9uYWxseSBzcGVjaWZ5IGEgdmVyc2lvbiAxLTguIElmIG5vIHZlcnNpb24gaXMgc3BlY2lmaWVkLCBhbGwgdmVyc2lvbnMgYXJlIHN1cHBvcnRlZC4gKi9cbmV4cG9ydCBjb25zdCB1dWlkID0gKHZlcnNpb24pID0+IHtcbiAgICBpZiAoIXZlcnNpb24pXG4gICAgICAgIHJldHVybiAvXihbMC05YS1mQS1GXXs4fS1bMC05YS1mQS1GXXs0fS1bMS04XVswLTlhLWZBLUZdezN9LVs4OWFiQUJdWzAtOWEtZkEtRl17M30tWzAtOWEtZkEtRl17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMHxmZmZmZmZmZi1mZmZmLWZmZmYtZmZmZi1mZmZmZmZmZmZmZmYpJC87XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4oWzAtOWEtZkEtRl17OH0tWzAtOWEtZkEtRl17NH0tJHt2ZXJzaW9ufVswLTlhLWZBLUZdezN9LVs4OWFiQUJdWzAtOWEtZkEtRl17M30tWzAtOWEtZkEtRl17MTJ9KSRgKTtcbn07XG5leHBvcnQgY29uc3QgdXVpZDQgPSAvKkBfX1BVUkVfXyovIHV1aWQoNCk7XG5leHBvcnQgY29uc3QgdXVpZDYgPSAvKkBfX1BVUkVfXyovIHV1aWQoNik7XG5leHBvcnQgY29uc3QgdXVpZDcgPSAvKkBfX1BVUkVfXyovIHV1aWQoNyk7XG4vKiogUHJhY3RpY2FsIGVtYWlsIHZhbGlkYXRpb24gKi9cbmV4cG9ydCBjb25zdCBlbWFpbCA9IC9eKD8hXFwuKSg/IS4qXFwuXFwuKShbQS1aYS16MC05XycrXFwtXFwuXSopW0EtWmEtejAtOV8rLV1AKFtBLVphLXowLTldW0EtWmEtejAtOVxcLV0qXFwuKStbQS1aYS16XXsyLH0kLztcbi8qKiBFcXVpdmFsZW50IHRvIHRoZSBIVE1MNSBpbnB1dFt0eXBlPWVtYWlsXSB2YWxpZGF0aW9uIGltcGxlbWVudGVkIGJ5IGJyb3dzZXJzLiBTb3VyY2U6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudC9pbnB1dC9lbWFpbCAqL1xuZXhwb3J0IGNvbnN0IGh0bWw1RW1haWwgPSAvXlthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG4vKiogVGhlIGNsYXNzaWMgZW1haWxyZWdleC5jb20gcmVnZXggZm9yIFJGQyA1MzIyLWNvbXBsaWFudCBlbWFpbHMgKi9cbmV4cG9ydCBjb25zdCByZmM1MzIyRW1haWwgPSAvXigoW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClcXFtcXF1cXFxcLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31dKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkLztcbi8qKiBBIGxvb3NlIHJlZ2V4IHRoYXQgYWxsb3dzIFVuaWNvZGUgY2hhcmFjdGVycywgZW5mb3JjZXMgbGVuZ3RoIGxpbWl0cywgYW5kIHRoYXQncyBhYm91dCBpdC4gKi9cbmV4cG9ydCBjb25zdCB1bmljb2RlRW1haWwgPSAvXlteXFxzQFwiXXsxLDY0fUBbXlxcc0BdezEsMjU1fSQvdTtcbmV4cG9ydCBjb25zdCBpZG5FbWFpbCA9IHVuaWNvZGVFbWFpbDtcbmV4cG9ydCBjb25zdCBicm93c2VyRW1haWwgPSAvXlthLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG4vLyBmcm9tIGh0dHBzOi8vdGhla2V2aW5zY290dC5jb20vZW1vamlzLWluLWphdmFzY3JpcHQvI3dyaXRpbmctYS1yZWd1bGFyLWV4cHJlc3Npb25cbmNvbnN0IF9lbW9qaSA9IGBeKFxcXFxwe0V4dGVuZGVkX1BpY3RvZ3JhcGhpY318XFxcXHB7RW1vamlfQ29tcG9uZW50fSkrJGA7XG5leHBvcnQgZnVuY3Rpb24gZW1vamkoKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoX2Vtb2ppLCBcInVcIik7XG59XG5leHBvcnQgY29uc3QgaXB2NCA9IC9eKD86KD86MjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKVxcLil7M30oPzoyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pJC87XG5leHBvcnQgY29uc3QgaXB2NiA9IC9eKChbMC05YS1mQS1GXXsxLDR9Oil7N31bMC05YS1mQS1GXXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw3fTp8KFswLTlhLWZBLUZdezEsNH06KXsxLDZ9OlswLTlhLWZBLUZdezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDV9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDJ9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw0fSg6WzAtOWEtZkEtRl17MSw0fSl7MSwzfXwoWzAtOWEtZkEtRl17MSw0fTopezEsM30oOlswLTlhLWZBLUZdezEsNH0pezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDJ9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDV9fFswLTlhLWZBLUZdezEsNH06KCg6WzAtOWEtZkEtRl17MSw0fSl7MSw2fSl8OigoOlswLTlhLWZBLUZdezEsNH0pezEsN318OikpJC87XG5leHBvcnQgY29uc3QgbWFjID0gKGRlbGltaXRlcikgPT4ge1xuICAgIGNvbnN0IGVzY2FwZWREZWxpbSA9IHV0aWwuZXNjYXBlUmVnZXgoZGVsaW1pdGVyID8/IFwiOlwiKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXig/OlswLTlBLUZdezJ9JHtlc2NhcGVkRGVsaW19KXs1fVswLTlBLUZdezJ9JHxeKD86WzAtOWEtZl17Mn0ke2VzY2FwZWREZWxpbX0pezV9WzAtOWEtZl17Mn0kYCk7XG59O1xuZXhwb3J0IGNvbnN0IGNpZHJ2NCA9IC9eKCgyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pXFwuKXszfSgyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pXFwvKFswLTldfFsxLTJdWzAtOV18M1swLTJdKSQvO1xuZXhwb3J0IGNvbnN0IGNpZHJ2NiA9IC9eKChbMC05YS1mQS1GXXsxLDR9Oil7N31bMC05YS1mQS1GXXsxLDR9fDo6fChbMC05YS1mQS1GXXsxLDR9KT86OihbMC05YS1mQS1GXXsxLDR9Oj8pezAsNn0pXFwvKDEyWzAtOF18MVswMV1bMC05XXxbMS05XT9bMC05XSkkLztcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc4NjAzOTIvZGV0ZXJtaW5lLWlmLXN0cmluZy1pcy1pbi1iYXNlNjQtdXNpbmctamF2YXNjcmlwdFxuZXhwb3J0IGNvbnN0IGJhc2U2NCA9IC9eJHxeKD86WzAtOWEtekEtWisvXXs0fSkqKD86KD86WzAtOWEtekEtWisvXXsyfT09KXwoPzpbMC05YS16QS1aKy9dezN9PSkpPyQvO1xuZXhwb3J0IGNvbnN0IGJhc2U2NHVybCA9IC9eW0EtWmEtejAtOV8tXSokLztcbi8vIGJhc2VkIG9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNjE3OS9yZWd1bGFyLWV4cHJlc3Npb24tdG8tbWF0Y2gtZG5zLWhvc3RuYW1lLW9yLWlwLWFkZHJlc3Ncbi8vIGV4cG9ydCBjb25zdCBob3N0bmFtZTogUmVnRXhwID0gL14oW2EtekEtWjAtOS1dK1xcLikqW2EtekEtWjAtOS1dKyQvO1xuZXhwb3J0IGNvbnN0IGhvc3RuYW1lID0gL14oPz0uezEsMjUzfVxcLj8kKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86Wy0wLTlhLXpBLVpdezAsNjF9WzAtOWEtekEtWl0pPykqXFwuPyQvO1xuZXhwb3J0IGNvbnN0IGRvbWFpbiA9IC9eKFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pP1xcLikrW2EtekEtWl17Mix9JC87XG5leHBvcnQgY29uc3QgaHR0cFByb3RvY29sID0gL15odHRwcz8kLztcbi8vIGh0dHBzOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvdmFsaWRhdGUtcGhvbmUtbnVtYmVyI3I0LTMgKHJlZ2V4IHNhbnMgc3BhY2VzKVxuLy8gRS4xNjQ6IGxlYWRpbmcgZGlnaXQgbXVzdCBiZSAxLTk7IHRvdGFsIGRpZ2l0cyAoZXhjbHVkaW5nICcrJykgYmV0d2VlbiA3LTE1XG5leHBvcnQgY29uc3QgZTE2NCA9IC9eXFwrWzEtOV1cXGR7NiwxNH0kLztcbi8vIGNvbnN0IGRhdGVTb3VyY2UgPSBgKChcXFxcZFxcXFxkWzI0NjhdWzA0OF18XFxcXGRcXFxcZFsxMzU3OV1bMjZdfFxcXFxkXFxcXGQwWzQ4XXxbMDI0NjhdWzA0OF0wMHxbMTM1NzldWzI2XTAwKS0wMi0yOXxcXFxcZHs0fS0oKDBbMTM1NzhdfDFbMDJdKS0oMFsxLTldfFsxMl1cXFxcZHwzWzAxXSl8KDBbNDY5XXwxMSktKDBbMS05XXxbMTJdXFxcXGR8MzApfCgwMiktKDBbMS05XXwxXFxcXGR8MlswLThdKSkpYDtcbmNvbnN0IGRhdGVTb3VyY2UgPSBgKD86KD86XFxcXGRcXFxcZFsyNDY4XVswNDhdfFxcXFxkXFxcXGRbMTM1NzldWzI2XXxcXFxcZFxcXFxkMFs0OF18WzAyNDY4XVswNDhdMDB8WzEzNTc5XVsyNl0wMCktMDItMjl8XFxcXGR7NH0tKD86KD86MFsxMzU3OF18MVswMl0pLSg/OjBbMS05XXxbMTJdXFxcXGR8M1swMV0pfCg/OjBbNDY5XXwxMSktKD86MFsxLTldfFsxMl1cXFxcZHwzMCl8KD86MDIpLSg/OjBbMS05XXwxXFxcXGR8MlswLThdKSkpYDtcbmV4cG9ydCBjb25zdCBkYXRlID0gLypAX19QVVJFX18qLyBuZXcgUmVnRXhwKGBeJHtkYXRlU291cmNlfSRgKTtcbmZ1bmN0aW9uIHRpbWVTb3VyY2UoYXJncykge1xuICAgIGNvbnN0IGhobW0gPSBgKD86WzAxXVxcXFxkfDJbMC0zXSk6WzAtNV1cXFxcZGA7XG4gICAgY29uc3QgcmVnZXggPSB0eXBlb2YgYXJncy5wcmVjaXNpb24gPT09IFwibnVtYmVyXCJcbiAgICAgICAgPyBhcmdzLnByZWNpc2lvbiA9PT0gLTFcbiAgICAgICAgICAgID8gYCR7aGhtbX1gXG4gICAgICAgICAgICA6IGFyZ3MucHJlY2lzaW9uID09PSAwXG4gICAgICAgICAgICAgICAgPyBgJHtoaG1tfTpbMC01XVxcXFxkYFxuICAgICAgICAgICAgICAgIDogYCR7aGhtbX06WzAtNV1cXFxcZFxcXFwuXFxcXGR7JHthcmdzLnByZWNpc2lvbn19YFxuICAgICAgICA6IGAke2hobW19KD86OlswLTVdXFxcXGQoPzpcXFxcLlxcXFxkKyk/KT9gO1xuICAgIHJldHVybiByZWdleDtcbn1cbmV4cG9ydCBmdW5jdGlvbiB0aW1lKGFyZ3MpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXiR7dGltZVNvdXJjZShhcmdzKX0kYCk7XG59XG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxNDMyMzFcbmV4cG9ydCBmdW5jdGlvbiBkYXRldGltZShhcmdzKSB7XG4gICAgY29uc3QgdGltZSA9IHRpbWVTb3VyY2UoeyBwcmVjaXNpb246IGFyZ3MucHJlY2lzaW9uIH0pO1xuICAgIGNvbnN0IG9wdHMgPSBbXCJaXCJdO1xuICAgIGlmIChhcmdzLmxvY2FsKVxuICAgICAgICBvcHRzLnB1c2goXCJcIik7XG4gICAgLy8gaWYgKGFyZ3Mub2Zmc2V0KSBvcHRzLnB1c2goYChbKy1dXFxcXGR7Mn06XFxcXGR7Mn0pYCk7XG4gICAgaWYgKGFyZ3Mub2Zmc2V0KVxuICAgICAgICBvcHRzLnB1c2goYChbKy1dKD86WzAxXVxcXFxkfDJbMC0zXSk6WzAtNV1cXFxcZClgKTtcbiAgICBjb25zdCB0aW1lUmVnZXggPSBgJHt0aW1lfSg/OiR7b3B0cy5qb2luKFwifFwiKX0pYDtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXiR7ZGF0ZVNvdXJjZX1UKD86JHt0aW1lUmVnZXh9KSRgKTtcbn1cbmV4cG9ydCBjb25zdCBzdHJpbmcgPSAocGFyYW1zKSA9PiB7XG4gICAgY29uc3QgcmVnZXggPSBwYXJhbXMgPyBgW1xcXFxzXFxcXFNdeyR7cGFyYW1zPy5taW5pbXVtID8/IDB9LCR7cGFyYW1zPy5tYXhpbXVtID8/IFwiXCJ9fWAgOiBgW1xcXFxzXFxcXFNdKmA7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4ke3JlZ2V4fSRgKTtcbn07XG5leHBvcnQgY29uc3QgYmlnaW50ID0gL14tP1xcZCtuPyQvO1xuZXhwb3J0IGNvbnN0IGludGVnZXIgPSAvXi0/XFxkKyQvO1xuZXhwb3J0IGNvbnN0IG51bWJlciA9IC9eLT9cXGQrKD86XFwuXFxkKyk/JC87XG5leHBvcnQgY29uc3QgYm9vbGVhbiA9IC9eKD86dHJ1ZXxmYWxzZSkkL2k7XG5jb25zdCBfbnVsbCA9IC9ebnVsbCQvaTtcbmV4cG9ydCB7IF9udWxsIGFzIG51bGwgfTtcbmNvbnN0IF91bmRlZmluZWQgPSAvXnVuZGVmaW5lZCQvaTtcbmV4cG9ydCB7IF91bmRlZmluZWQgYXMgdW5kZWZpbmVkIH07XG4vLyByZWdleCBmb3Igc3RyaW5nIHdpdGggbm8gdXBwZXJjYXNlIGxldHRlcnNcbmV4cG9ydCBjb25zdCBsb3dlcmNhc2UgPSAvXlteQS1aXSokLztcbi8vIHJlZ2V4IGZvciBzdHJpbmcgd2l0aCBubyBsb3dlcmNhc2UgbGV0dGVyc1xuZXhwb3J0IGNvbnN0IHVwcGVyY2FzZSA9IC9eW15hLXpdKiQvO1xuLy8gcmVnZXggZm9yIGhleGFkZWNpbWFsIHN0cmluZ3MgKGFueSBsZW5ndGgpXG5leHBvcnQgY29uc3QgaGV4ID0gL15bMC05YS1mQS1GXSokLztcbi8vIEhhc2ggcmVnZXhlcyBmb3IgZGlmZmVyZW50IGFsZ29yaXRobXMgYW5kIGVuY29kaW5nc1xuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBiYXNlNjQgcmVnZXggd2l0aCBleGFjdCBsZW5ndGggYW5kIHBhZGRpbmdcbmZ1bmN0aW9uIGZpeGVkQmFzZTY0KGJvZHlMZW5ndGgsIHBhZGRpbmcpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXltBLVphLXowLTkrL117JHtib2R5TGVuZ3RofX0ke3BhZGRpbmd9JGApO1xufVxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNyZWF0ZSBiYXNlNjR1cmwgcmVnZXggd2l0aCBleGFjdCBsZW5ndGggKG5vIHBhZGRpbmcpXG5mdW5jdGlvbiBmaXhlZEJhc2U2NHVybChsZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXltBLVphLXowLTlfLV17JHtsZW5ndGh9fSRgKTtcbn1cbi8vIE1ENSAoMTYgYnl0ZXMpOiBiYXNlNjQgPSAyNCBjaGFycyB0b3RhbCAoMjIgKyBcIj09XCIpXG5leHBvcnQgY29uc3QgbWQ1X2hleCA9IC9eWzAtOWEtZkEtRl17MzJ9JC87XG5leHBvcnQgY29uc3QgbWQ1X2Jhc2U2NCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjQoMjIsIFwiPT1cIik7XG5leHBvcnQgY29uc3QgbWQ1X2Jhc2U2NHVybCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjR1cmwoMjIpO1xuLy8gU0hBMSAoMjAgYnl0ZXMpOiBiYXNlNjQgPSAyOCBjaGFycyB0b3RhbCAoMjcgKyBcIj1cIilcbmV4cG9ydCBjb25zdCBzaGExX2hleCA9IC9eWzAtOWEtZkEtRl17NDB9JC87XG5leHBvcnQgY29uc3Qgc2hhMV9iYXNlNjQgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0KDI3LCBcIj1cIik7XG5leHBvcnQgY29uc3Qgc2hhMV9iYXNlNjR1cmwgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0dXJsKDI3KTtcbi8vIFNIQTI1NiAoMzIgYnl0ZXMpOiBiYXNlNjQgPSA0NCBjaGFycyB0b3RhbCAoNDMgKyBcIj1cIilcbmV4cG9ydCBjb25zdCBzaGEyNTZfaGV4ID0gL15bMC05YS1mQS1GXXs2NH0kLztcbmV4cG9ydCBjb25zdCBzaGEyNTZfYmFzZTY0ID0gLypAX19QVVJFX18qLyBmaXhlZEJhc2U2NCg0MywgXCI9XCIpO1xuZXhwb3J0IGNvbnN0IHNoYTI1Nl9iYXNlNjR1cmwgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0dXJsKDQzKTtcbi8vIFNIQTM4NCAoNDggYnl0ZXMpOiBiYXNlNjQgPSA2NCBjaGFycyB0b3RhbCAobm8gcGFkZGluZylcbmV4cG9ydCBjb25zdCBzaGEzODRfaGV4ID0gL15bMC05YS1mQS1GXXs5Nn0kLztcbmV4cG9ydCBjb25zdCBzaGEzODRfYmFzZTY0ID0gLypAX19QVVJFX18qLyBmaXhlZEJhc2U2NCg2NCwgXCJcIik7XG5leHBvcnQgY29uc3Qgc2hhMzg0X2Jhc2U2NHVybCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjR1cmwoNjQpO1xuLy8gU0hBNTEyICg2NCBieXRlcyk6IGJhc2U2NCA9IDg4IGNoYXJzIHRvdGFsICg4NiArIFwiPT1cIilcbmV4cG9ydCBjb25zdCBzaGE1MTJfaGV4ID0gL15bMC05YS1mQS1GXXsxMjh9JC87XG5leHBvcnQgY29uc3Qgc2hhNTEyX2Jhc2U2NCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjQoODYsIFwiPT1cIik7XG5leHBvcnQgY29uc3Qgc2hhNTEyX2Jhc2U2NHVybCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjR1cmwoODYpO1xuIiwiaW1wb3J0IHsgZ2xvYmFsQ29uZmlnIH0gZnJvbSBcIi4vY29yZS5qc1wiO1xuLy8gZnVuY3Rpb25zXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0RXF1YWwodmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3RFcXVhbCh2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydElzKF9hcmcpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5ldmVyKF94KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCB2YWx1ZSBpbiBleGhhdXN0aXZlIGNoZWNrXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChfKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnVtVmFsdWVzKGVudHJpZXMpIHtcbiAgICBjb25zdCBudW1lcmljVmFsdWVzID0gT2JqZWN0LnZhbHVlcyhlbnRyaWVzKS5maWx0ZXIoKHYpID0+IHR5cGVvZiB2ID09PSBcIm51bWJlclwiKTtcbiAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QuZW50cmllcyhlbnRyaWVzKVxuICAgICAgICAuZmlsdGVyKChbaywgX10pID0+IG51bWVyaWNWYWx1ZXMuaW5kZXhPZigraykgPT09IC0xKVxuICAgICAgICAubWFwKChbXywgdl0pID0+IHYpO1xuICAgIHJldHVybiB2YWx1ZXM7XG59XG5leHBvcnQgZnVuY3Rpb24gam9pblZhbHVlcyhhcnJheSwgc2VwYXJhdG9yID0gXCJ8XCIpIHtcbiAgICByZXR1cm4gYXJyYXkubWFwKCh2YWwpID0+IHN0cmluZ2lmeVByaW1pdGl2ZSh2YWwpKS5qb2luKHNlcGFyYXRvcik7XG59XG5leHBvcnQgZnVuY3Rpb24ganNvblN0cmluZ2lmeVJlcGxhY2VyKF8sIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJiaWdpbnRcIilcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhY2hlZChnZXR0ZXIpIHtcbiAgICBjb25zdCBzZXQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0dGVyKCk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwidmFsdWVcIiwgeyB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYWNoZWQgdmFsdWUgYWxyZWFkeSBzZXRcIik7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBudWxsaXNoKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0ID09PSBudWxsIHx8IGlucHV0ID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY2xlYW5SZWdleChzb3VyY2UpIHtcbiAgICBjb25zdCBzdGFydCA9IHNvdXJjZS5zdGFydHNXaXRoKFwiXlwiKSA/IDEgOiAwO1xuICAgIGNvbnN0IGVuZCA9IHNvdXJjZS5lbmRzV2l0aChcIiRcIikgPyBzb3VyY2UubGVuZ3RoIC0gMSA6IHNvdXJjZS5sZW5ndGg7XG4gICAgcmV0dXJuIHNvdXJjZS5zbGljZShzdGFydCwgZW5kKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmbG9hdFNhZmVSZW1haW5kZXIodmFsLCBzdGVwKSB7XG4gICAgY29uc3QgcmF0aW8gPSB2YWwgLyBzdGVwO1xuICAgIGNvbnN0IHJvdW5kZWRSYXRpbyA9IE1hdGgucm91bmQocmF0aW8pO1xuICAgIC8vIFVzZSBhIHJlbGF0aXZlIGVwc2lsb24gc2NhbGVkIHRvIHRoZSBtYWduaXR1ZGUgb2YgdGhlIHJlc3VsdFxuICAgIGNvbnN0IHRvbGVyYW5jZSA9IE51bWJlci5FUFNJTE9OICogTWF0aC5tYXgoTWF0aC5hYnMocmF0aW8pLCAxKTtcbiAgICBpZiAoTWF0aC5hYnMocmF0aW8gLSByb3VuZGVkUmF0aW8pIDwgdG9sZXJhbmNlKVxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gcmF0aW8gLSByb3VuZGVkUmF0aW87XG59XG5jb25zdCBFVkFMVUFUSU5HID0gLyogQF9fUFVSRV9fKi8gU3ltYm9sKFwiZXZhbHVhdGluZ1wiKTtcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVMYXp5KG9iamVjdCwga2V5LCBnZXR0ZXIpIHtcbiAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gRVZBTFVBVElORykge1xuICAgICAgICAgICAgICAgIC8vIENpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCwgcmV0dXJuIHVuZGVmaW5lZCB0byBicmVhayB0aGUgY3ljbGVcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEVWQUxVQVRJTkc7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXR0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHYpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gb2JqZWN0W2tleV0gPSB2O1xuICAgICAgICB9LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0Q2xvbmUob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaikpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnblByb3AodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZWZzKC4uLmRlZnMpIHtcbiAgICBjb25zdCBtZXJnZWREZXNjcmlwdG9ycyA9IHt9O1xuICAgIGZvciAoY29uc3QgZGVmIG9mIGRlZnMpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhkZWYpO1xuICAgICAgICBPYmplY3QuYXNzaWduKG1lcmdlZERlc2NyaXB0b3JzLCBkZXNjcmlwdG9ycyk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh7fSwgbWVyZ2VkRGVzY3JpcHRvcnMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lRGVmKHNjaGVtYSkge1xuICAgIHJldHVybiBtZXJnZURlZnMoc2NoZW1hLl96b2QuZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QXRQYXRoKG9iaiwgcGF0aCkge1xuICAgIGlmICghcGF0aClcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gcGF0aC5yZWR1Y2UoKGFjYywga2V5KSA9PiBhY2M/LltrZXldLCBvYmopO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VBbGxPYmplY3QocHJvbWlzZXNPYmopIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvbWlzZXNPYmopO1xuICAgIGNvbnN0IHByb21pc2VzID0ga2V5cy5tYXAoKGtleSkgPT4gcHJvbWlzZXNPYmpba2V5XSk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkT2JqID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzb2x2ZWRPYmpba2V5c1tpXV0gPSByZXN1bHRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlZE9iajtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21TdHJpbmcobGVuZ3RoID0gMTApIHtcbiAgICBjb25zdCBjaGFycyA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbiAgICBsZXQgc3RyID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0ciArPSBjaGFyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFycy5sZW5ndGgpXTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlc2Moc3RyKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0cik7XG59XG5leHBvcnQgZnVuY3Rpb24gc2x1Z2lmeShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5yZXBsYWNlKC9bXlxcd1xccy1dL2csIFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKC9bXFxzXy1dKy9nLCBcIi1cIilcbiAgICAgICAgLnJlcGxhY2UoL14tK3wtKyQvZywgXCJcIik7XG59XG5leHBvcnQgY29uc3QgY2FwdHVyZVN0YWNrVHJhY2UgPSAoXCJjYXB0dXJlU3RhY2tUcmFjZVwiIGluIEVycm9yID8gRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgOiAoLi4uX2FyZ3MpID0+IHsgfSk7XG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBkYXRhICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KGRhdGEpO1xufVxuZXhwb3J0IGNvbnN0IGFsbG93c0V2YWwgPSAvKiBAX19QVVJFX18qLyBjYWNoZWQoKCkgPT4ge1xuICAgIC8vIFNraXAgdGhlIHByb2JlIHVuZGVyIGBqaXRsZXNzYDogc3RyaWN0IENTUHMgcmVwb3J0IHRoZSBjYXVnaHQgYG5ldyBGdW5jdGlvbmBcbiAgICAvLyBhcyBhIGBzZWN1cml0eXBvbGljeXZpb2xhdGlvbmAgZXZlbiB0aG91Z2ggdGhlIHRocm93IGlzIHN3YWxsb3dlZC5cbiAgICBpZiAoZ2xvYmFsQ29uZmlnLmppdGxlc3MpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgbmF2aWdhdG9yPy51c2VyQWdlbnQ/LmluY2x1ZGVzKFwiQ2xvdWRmbGFyZVwiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IEYgPSBGdW5jdGlvbjtcbiAgICAgICAgbmV3IEYoXCJcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSk7XG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvKSB7XG4gICAgaWYgKGlzT2JqZWN0KG8pID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIG1vZGlmaWVkIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY3RvciA9IG8uY29uc3RydWN0b3I7XG4gICAgaWYgKGN0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYgKHR5cGVvZiBjdG9yICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vIG1vZGlmaWVkIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3QgPSBjdG9yLnByb3RvdHlwZTtcbiAgICBpZiAoaXNPYmplY3QocHJvdCkgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gY3RvciBkb2Vzbid0IGhhdmUgc3RhdGljIGBpc1Byb3RvdHlwZU9mYFxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJvdCwgXCJpc1Byb3RvdHlwZU9mXCIpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3dDbG9uZShvKSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QobykpXG4gICAgICAgIHJldHVybiB7IC4uLm8gfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvKSlcbiAgICAgICAgcmV0dXJuIFsuLi5vXTtcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcClcbiAgICAgICAgcmV0dXJuIG5ldyBNYXAobyk7XG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpXG4gICAgICAgIHJldHVybiBuZXcgU2V0KG8pO1xuICAgIHJldHVybiBvO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG51bUtleXMoZGF0YSkge1xuICAgIGxldCBrZXlDb3VudCA9IDA7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkpIHtcbiAgICAgICAgICAgIGtleUNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleUNvdW50O1xufVxuZXhwb3J0IGNvbnN0IGdldFBhcnNlZFR5cGUgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IHQgPSB0eXBlb2YgZGF0YTtcbiAgICBzd2l0Y2ggKHQpIHtcbiAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgIHJldHVybiBcInN0cmluZ1wiO1xuICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKGRhdGEpID8gXCJuYW5cIiA6IFwibnVtYmVyXCI7XG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJib29sZWFuXCI7XG4gICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZnVuY3Rpb25cIjtcbiAgICAgICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiYmlnaW50XCI7XG4gICAgICAgIGNhc2UgXCJzeW1ib2xcIjpcbiAgICAgICAgICAgIHJldHVybiBcInN5bWJvbFwiO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImFycmF5XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLnRoZW4gJiYgdHlwZW9mIGRhdGEudGhlbiA9PT0gXCJmdW5jdGlvblwiICYmIGRhdGEuY2F0Y2ggJiYgdHlwZW9mIGRhdGEuY2F0Y2ggPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInByb21pc2VcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgTWFwICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJtYXBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgU2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJzZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImRhdGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRmlsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImZpbGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBcIm9iamVjdFwiO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRhdGEgdHlwZTogJHt0fWApO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgcHJvcGVydHlLZXlUeXBlcyA9IC8qIEBfX1BVUkVfXyovIG5ldyBTZXQoW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwic3ltYm9sXCJdKTtcbmV4cG9ydCBjb25zdCBwcmltaXRpdmVUeXBlcyA9IC8qIEBfX1BVUkVfXyovIG5ldyBTZXQoW1xuICAgIFwic3RyaW5nXCIsXG4gICAgXCJudW1iZXJcIixcbiAgICBcImJpZ2ludFwiLFxuICAgIFwiYm9vbGVhblwiLFxuICAgIFwic3ltYm9sXCIsXG4gICAgXCJ1bmRlZmluZWRcIixcbl0pO1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuLy8gem9kLXNwZWNpZmljIHV0aWxzXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUoaW5zdCwgZGVmLCBwYXJhbXMpIHtcbiAgICBjb25zdCBjbCA9IG5ldyBpbnN0Ll96b2QuY29uc3RyKGRlZiA/PyBpbnN0Ll96b2QuZGVmKTtcbiAgICBpZiAoIWRlZiB8fCBwYXJhbXM/LnBhcmVudClcbiAgICAgICAgY2wuX3pvZC5wYXJlbnQgPSBpbnN0O1xuICAgIHJldHVybiBjbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVQYXJhbXMoX3BhcmFtcykge1xuICAgIGNvbnN0IHBhcmFtcyA9IF9wYXJhbXM7XG4gICAgaWYgKCFwYXJhbXMpXG4gICAgICAgIHJldHVybiB7fTtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6ICgpID0+IHBhcmFtcyB9O1xuICAgIGlmIChwYXJhbXM/Lm1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zPy5lcnJvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHNwZWNpZnkgYm90aCBgbWVzc2FnZWAgYW5kIGBlcnJvcmAgcGFyYW1zXCIpO1xuICAgICAgICBwYXJhbXMuZXJyb3IgPSBwYXJhbXMubWVzc2FnZTtcbiAgICB9XG4gICAgZGVsZXRlIHBhcmFtcy5tZXNzYWdlO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLmVycm9yID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4geyAuLi5wYXJhbXMsIGVycm9yOiAoKSA9PiBwYXJhbXMuZXJyb3IgfTtcbiAgICByZXR1cm4gcGFyYW1zO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zcGFyZW50UHJveHkoZ2V0dGVyKSB7XG4gICAgbGV0IHRhcmdldDtcbiAgICByZXR1cm4gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgIGdldChfLCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgdGFyZ2V0ID8/ICh0YXJnZXQgPSBnZXR0ZXIoKSk7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldChfLCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFzKF8sIHByb3ApIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5KF8sIHByb3ApIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3duS2V5cyhfKSB7XG4gICAgICAgICAgICB0YXJnZXQgPz8gKHRhcmdldCA9IGdldHRlcigpKTtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKF8sIHByb3ApIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmluZVByb3BlcnR5KF8sIHByb3AsIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlQcmltaXRpdmUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImJpZ2ludFwiKVxuICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKSArIFwiblwiO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBgXCIke3ZhbHVlfVwiYDtcbiAgICByZXR1cm4gYCR7dmFsdWV9YDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvcHRpb25hbEtleXMoc2hhcGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc2hhcGUpLmZpbHRlcigoaykgPT4ge1xuICAgICAgICByZXR1cm4gc2hhcGVba10uX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiICYmIHNoYXBlW2tdLl96b2Qub3B0b3V0ID09PSBcIm9wdGlvbmFsXCI7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgTlVNQkVSX0ZPUk1BVF9SQU5HRVMgPSB7XG4gICAgc2FmZWludDogW051bWJlci5NSU5fU0FGRV9JTlRFR0VSLCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUl0sXG4gICAgaW50MzI6IFstMjE0NzQ4MzY0OCwgMjE0NzQ4MzY0N10sXG4gICAgdWludDMyOiBbMCwgNDI5NDk2NzI5NV0sXG4gICAgZmxvYXQzMjogWy0zLjQwMjgyMzQ2NjM4NTI4ODZlMzgsIDMuNDAyODIzNDY2Mzg1Mjg4NmUzOF0sXG4gICAgZmxvYXQ2NDogWy1OdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFXSxcbn07XG5leHBvcnQgY29uc3QgQklHSU5UX0ZPUk1BVF9SQU5HRVMgPSB7XG4gICAgaW50NjQ6IFsvKiBAX19QVVJFX18qLyBCaWdJbnQoXCItOTIyMzM3MjAzNjg1NDc3NTgwOFwiKSwgLyogQF9fUFVSRV9fKi8gQmlnSW50KFwiOTIyMzM3MjAzNjg1NDc3NTgwN1wiKV0sXG4gICAgdWludDY0OiBbLyogQF9fUFVSRV9fKi8gQmlnSW50KDApLCAvKiBAX19QVVJFX18qLyBCaWdJbnQoXCIxODQ0Njc0NDA3MzcwOTU1MTYxNVwiKV0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2soc2NoZW1hLCBtYXNrKSB7XG4gICAgY29uc3QgY3VyckRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBjb25zdCBjaGVja3MgPSBjdXJyRGVmLmNoZWNrcztcbiAgICBjb25zdCBoYXNDaGVja3MgPSBjaGVja3MgJiYgY2hlY2tzLmxlbmd0aCA+IDA7XG4gICAgaWYgKGhhc0NoZWNrcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCIucGljaygpIGNhbm5vdCBiZSB1c2VkIG9uIG9iamVjdCBzY2hlbWFzIGNvbnRhaW5pbmcgcmVmaW5lbWVudHNcIik7XG4gICAgfVxuICAgIGNvbnN0IGRlZiA9IG1lcmdlRGVmcyhzY2hlbWEuX3pvZC5kZWYsIHtcbiAgICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgbmV3U2hhcGUgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG1hc2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gY3VyckRlZi5zaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQga2V5OiBcIiR7a2V5fVwiYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gY3VyckRlZi5zaGFwZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXNzaWduUHJvcCh0aGlzLCBcInNoYXBlXCIsIG5ld1NoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gbmV3U2hhcGU7XG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrczogW10sXG4gICAgfSk7XG4gICAgcmV0dXJuIGNsb25lKHNjaGVtYSwgZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbWl0KHNjaGVtYSwgbWFzaykge1xuICAgIGNvbnN0IGN1cnJEZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgY2hlY2tzID0gY3VyckRlZi5jaGVja3M7XG4gICAgY29uc3QgaGFzQ2hlY2tzID0gY2hlY2tzICYmIGNoZWNrcy5sZW5ndGggPiAwO1xuICAgIGlmIChoYXNDaGVja3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiLm9taXQoKSBjYW5ub3QgYmUgdXNlZCBvbiBvYmplY3Qgc2NoZW1hcyBjb250YWluaW5nIHJlZmluZW1lbnRzXCIpO1xuICAgIH1cbiAgICBjb25zdCBkZWYgPSBtZXJnZURlZnMoc2NoZW1hLl96b2QuZGVmLCB7XG4gICAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NoYXBlID0geyAuLi5zY2hlbWEuX3pvZC5kZWYuc2hhcGUgfTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG1hc2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gY3VyckRlZi5zaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQga2V5OiBcIiR7a2V5fVwiYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV3U2hhcGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc2lnblByb3AodGhpcywgXCJzaGFwZVwiLCBuZXdTaGFwZSk7IC8vIHNlbGYtY2FjaGluZ1xuICAgICAgICAgICAgcmV0dXJuIG5ld1NoYXBlO1xuICAgICAgICB9LFxuICAgICAgICBjaGVja3M6IFtdLFxuICAgIH0pO1xuICAgIHJldHVybiBjbG9uZShzY2hlbWEsIGRlZik7XG59XG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHNjaGVtYSwgc2hhcGUpIHtcbiAgICBpZiAoIWlzUGxhaW5PYmplY3Qoc2hhcGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5wdXQgdG8gZXh0ZW5kOiBleHBlY3RlZCBhIHBsYWluIG9iamVjdFwiKTtcbiAgICB9XG4gICAgY29uc3QgY2hlY2tzID0gc2NoZW1hLl96b2QuZGVmLmNoZWNrcztcbiAgICBjb25zdCBoYXNDaGVja3MgPSBjaGVja3MgJiYgY2hlY2tzLmxlbmd0aCA+IDA7XG4gICAgaWYgKGhhc0NoZWNrcykge1xuICAgICAgICAvLyBPbmx5IHRocm93IGlmIG5ldyBzaGFwZSBvdmVybGFwcyB3aXRoIGV4aXN0aW5nIHNoYXBlXG4gICAgICAgIC8vIFVzZSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgdG8gY2hlY2sga2V5IGV4aXN0ZW5jZSB3aXRob3V0IGFjY2Vzc2luZyB2YWx1ZXNcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2hhcGUpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGV4aXN0aW5nU2hhcGUsIGtleSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBvdmVyd3JpdGUga2V5cyBvbiBvYmplY3Qgc2NoZW1hcyBjb250YWluaW5nIHJlZmluZW1lbnRzLiBVc2UgYC5zYWZlRXh0ZW5kKClgIGluc3RlYWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRlZiA9IG1lcmdlRGVmcyhzY2hlbWEuX3pvZC5kZWYsIHtcbiAgICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgX3NoYXBlID0geyAuLi5zY2hlbWEuX3pvZC5kZWYuc2hhcGUsIC4uLnNoYXBlIH07XG4gICAgICAgICAgICBhc3NpZ25Qcm9wKHRoaXMsIFwic2hhcGVcIiwgX3NoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gX3NoYXBlO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBjbG9uZShzY2hlbWEsIGRlZik7XG59XG5leHBvcnQgZnVuY3Rpb24gc2FmZUV4dGVuZChzY2hlbWEsIHNoYXBlKSB7XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KHNoYXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGlucHV0IHRvIHNhZmVFeHRlbmQ6IGV4cGVjdGVkIGEgcGxhaW4gb2JqZWN0XCIpO1xuICAgIH1cbiAgICBjb25zdCBkZWYgPSBtZXJnZURlZnMoc2NoZW1hLl96b2QuZGVmLCB7XG4gICAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IF9zaGFwZSA9IHsgLi4uc2NoZW1hLl96b2QuZGVmLnNoYXBlLCAuLi5zaGFwZSB9O1xuICAgICAgICAgICAgYXNzaWduUHJvcCh0aGlzLCBcInNoYXBlXCIsIF9zaGFwZSk7IC8vIHNlbGYtY2FjaGluZ1xuICAgICAgICAgICAgcmV0dXJuIF9zaGFwZTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmUoc2NoZW1hLCBkZWYpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgICBpZiAoYS5fem9kLmRlZi5jaGVja3M/Lmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCIubWVyZ2UoKSBjYW5ub3QgYmUgdXNlZCBvbiBvYmplY3Qgc2NoZW1hcyBjb250YWluaW5nIHJlZmluZW1lbnRzLiBVc2UgLnNhZmVFeHRlbmQoKSBpbnN0ZWFkLlwiKTtcbiAgICB9XG4gICAgY29uc3QgZGVmID0gbWVyZ2VEZWZzKGEuX3pvZC5kZWYsIHtcbiAgICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgX3NoYXBlID0geyAuLi5hLl96b2QuZGVmLnNoYXBlLCAuLi5iLl96b2QuZGVmLnNoYXBlIH07XG4gICAgICAgICAgICBhc3NpZ25Qcm9wKHRoaXMsIFwic2hhcGVcIiwgX3NoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gX3NoYXBlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY2F0Y2hhbGwoKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5fem9kLmRlZi5jYXRjaGFsbDtcbiAgICAgICAgfSxcbiAgICAgICAgY2hlY2tzOiBiLl96b2QuZGVmLmNoZWNrcyA/PyBbXSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmUoYSwgZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aWFsKENsYXNzLCBzY2hlbWEsIG1hc2spIHtcbiAgICBjb25zdCBjdXJyRGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IGNoZWNrcyA9IGN1cnJEZWYuY2hlY2tzO1xuICAgIGNvbnN0IGhhc0NoZWNrcyA9IGNoZWNrcyAmJiBjaGVja3MubGVuZ3RoID4gMDtcbiAgICBpZiAoaGFzQ2hlY2tzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIi5wYXJ0aWFsKCkgY2Fubm90IGJlIHVzZWQgb24gb2JqZWN0IHNjaGVtYXMgY29udGFpbmluZyByZWZpbmVtZW50c1wiKTtcbiAgICB9XG4gICAgY29uc3QgZGVmID0gbWVyZ2VEZWZzKHNjaGVtYS5fem9kLmRlZiwge1xuICAgICAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRTaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0geyAuLi5vbGRTaGFwZSB9O1xuICAgICAgICAgICAgaWYgKG1hc2spIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBtYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBvbGRTaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIGtleTogXCIke2tleX1cImApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChvbGRTaGFwZVtrZXldIS5fem9kLm9wdGluID09PSBcIm9wdGlvbmFsXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZVtrZXldID0gQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IENsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9wdGlvbmFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUeXBlOiBvbGRTaGFwZVtrZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogb2xkU2hhcGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvbGRTaGFwZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAob2xkU2hhcGVba2V5XSEuX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVba2V5XSA9IENsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG5ldyBDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvcHRpb25hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVHlwZTogb2xkU2hhcGVba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG9sZFNoYXBlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXNzaWduUHJvcCh0aGlzLCBcInNoYXBlXCIsIHNoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gc2hhcGU7XG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrczogW10sXG4gICAgfSk7XG4gICAgcmV0dXJuIGNsb25lKHNjaGVtYSwgZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZChDbGFzcywgc2NoZW1hLCBtYXNrKSB7XG4gICAgY29uc3QgZGVmID0gbWVyZ2VEZWZzKHNjaGVtYS5fem9kLmRlZiwge1xuICAgICAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRTaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0geyAuLi5vbGRTaGFwZSB9O1xuICAgICAgICAgICAgaWYgKG1hc2spIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBtYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBzaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIGtleTogXCIke2tleX1cImApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB3aXRoIG5vbi1vcHRpb25hbFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVtrZXldID0gbmV3IENsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibm9ub3B0aW9uYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVHlwZTogb2xkU2hhcGVba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gb2xkU2hhcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb3ZlcndyaXRlIHdpdGggbm9uLW9wdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlW2tleV0gPSBuZXcgQ2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJub25vcHRpb25hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUeXBlOiBvbGRTaGFwZVtrZXldLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3NpZ25Qcm9wKHRoaXMsIFwic2hhcGVcIiwgc2hhcGUpOyAvLyBzZWxmLWNhY2hpbmdcbiAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmUoc2NoZW1hLCBkZWYpO1xufVxuLy8gaW52YWxpZF90eXBlIHwgdG9vX2JpZyB8IHRvb19zbWFsbCB8IGludmFsaWRfZm9ybWF0IHwgbm90X211bHRpcGxlX29mIHwgdW5yZWNvZ25pemVkX2tleXMgfCBpbnZhbGlkX3VuaW9uIHwgaW52YWxpZF9rZXkgfCBpbnZhbGlkX2VsZW1lbnQgfCBpbnZhbGlkX3ZhbHVlIHwgY3VzdG9tXG5leHBvcnQgZnVuY3Rpb24gYWJvcnRlZCh4LCBzdGFydEluZGV4ID0gMCkge1xuICAgIGlmICh4LmFib3J0ZWQgPT09IHRydWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgeC5pc3N1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHguaXNzdWVzW2ldPy5jb250aW51ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8gQ2hlY2tzIGZvciBleHBsaWNpdCBhYm9ydCAoY29udGludWUgPT09IGZhbHNlKSwgYXMgb3Bwb3NlZCB0byBpbXBsaWNpdCBhYm9ydCAoY29udGludWUgPT09IHVuZGVmaW5lZCkuXG4vLyBVc2VkIHRvIHJlc3BlY3QgYGFib3J0OiB0cnVlYCBpbiAucmVmaW5lKCkgZXZlbiBmb3IgY2hlY2tzIHRoYXQgaGF2ZSBhIGB3aGVuYCBmdW5jdGlvbi5cbmV4cG9ydCBmdW5jdGlvbiBleHBsaWNpdGx5QWJvcnRlZCh4LCBzdGFydEluZGV4ID0gMCkge1xuICAgIGlmICh4LmFib3J0ZWQgPT09IHRydWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgeC5pc3N1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHguaXNzdWVzW2ldPy5jb250aW51ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmVmaXhJc3N1ZXMocGF0aCwgaXNzdWVzKSB7XG4gICAgcmV0dXJuIGlzc3Vlcy5tYXAoKGlzcykgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IGlzcykucGF0aCA/PyAoX2EucGF0aCA9IFtdKTtcbiAgICAgICAgaXNzLnBhdGgudW5zaGlmdChwYXRoKTtcbiAgICAgICAgcmV0dXJuIGlzcztcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyBtZXNzYWdlIDogbWVzc2FnZT8ubWVzc2FnZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb25maWcpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gaXNzLm1lc3NhZ2VcbiAgICAgICAgPyBpc3MubWVzc2FnZVxuICAgICAgICA6ICh1bndyYXBNZXNzYWdlKGlzcy5pbnN0Py5fem9kLmRlZj8uZXJyb3I/Lihpc3MpKSA/P1xuICAgICAgICAgICAgdW53cmFwTWVzc2FnZShjdHg/LmVycm9yPy4oaXNzKSkgPz9cbiAgICAgICAgICAgIHVud3JhcE1lc3NhZ2UoY29uZmlnLmN1c3RvbUVycm9yPy4oaXNzKSkgPz9cbiAgICAgICAgICAgIHVud3JhcE1lc3NhZ2UoY29uZmlnLmxvY2FsZUVycm9yPy4oaXNzKSkgPz9cbiAgICAgICAgICAgIFwiSW52YWxpZCBpbnB1dFwiKTtcbiAgICBjb25zdCB7IGluc3Q6IF9pbnN0LCBjb250aW51ZTogX2NvbnRpbnVlLCBpbnB1dDogX2lucHV0LCAuLi5yZXN0IH0gPSBpc3M7XG4gICAgcmVzdC5wYXRoID8/IChyZXN0LnBhdGggPSBbXSk7XG4gICAgcmVzdC5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICBpZiAoY3R4Py5yZXBvcnRJbnB1dCkge1xuICAgICAgICByZXN0LmlucHV0ID0gX2lucHV0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaXphYmxlT3JpZ2luKGlucHV0KSB7XG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgU2V0KVxuICAgICAgICByZXR1cm4gXCJzZXRcIjtcbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBNYXApXG4gICAgICAgIHJldHVybiBcIm1hcFwiO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBGaWxlKVxuICAgICAgICByZXR1cm4gXCJmaWxlXCI7XG4gICAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExlbmd0aGFibGVPcmlnaW4oaW5wdXQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpXG4gICAgICAgIHJldHVybiBcImFycmF5XCI7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIFwic3RyaW5nXCI7XG4gICAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlZFR5cGUoZGF0YSkge1xuICAgIGNvbnN0IHQgPSB0eXBlb2YgZGF0YTtcbiAgICBzd2l0Y2ggKHQpIHtcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOiB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKGRhdGEpID8gXCJuYW5cIiA6IFwibnVtYmVyXCI7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIm9iamVjdFwiOiB7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiYXJyYXlcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGRhdGE7XG4gICAgICAgICAgICBpZiAob2JqICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopICE9PSBPYmplY3QucHJvdG90eXBlICYmIFwiY29uc3RydWN0b3JcIiBpbiBvYmogJiYgb2JqLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzc3VlKC4uLmFyZ3MpIHtcbiAgICBjb25zdCBbaXNzLCBpbnB1dCwgaW5zdF0gPSBhcmdzO1xuICAgIGlmICh0eXBlb2YgaXNzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBpc3MsXG4gICAgICAgICAgICBjb2RlOiBcImN1c3RvbVwiLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyAuLi5pc3MgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkVudW0ob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG9iailcbiAgICAgICAgLmZpbHRlcigoW2ssIF9dKSA9PiB7XG4gICAgICAgIC8vIHJldHVybiB0cnVlIGlmIE5hTiwgbWVhbmluZyBpdCdzIG5vdCBhIG51bWJlciwgdGh1cyBhIHN0cmluZyBrZXlcbiAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihOdW1iZXIucGFyc2VJbnQoaywgMTApKTtcbiAgICB9KVxuICAgICAgICAubWFwKChlbCkgPT4gZWxbMV0pO1xufVxuLy8gQ29kZWMgdXRpbGl0eSBmdW5jdGlvbnNcbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRUb1VpbnQ4QXJyYXkoYmFzZTY0KSB7XG4gICAgY29uc3QgYmluYXJ5U3RyaW5nID0gYXRvYihiYXNlNjQpO1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5U3RyaW5nLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnlTdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ4QXJyYXlUb0Jhc2U2NChieXRlcykge1xuICAgIGxldCBiaW5hcnlTdHJpbmcgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYmluYXJ5U3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYnRvYShiaW5hcnlTdHJpbmcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NHVybFRvVWludDhBcnJheShiYXNlNjR1cmwpIHtcbiAgICBjb25zdCBiYXNlNjQgPSBiYXNlNjR1cmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gICAgY29uc3QgcGFkZGluZyA9IFwiPVwiLnJlcGVhdCgoNCAtIChiYXNlNjQubGVuZ3RoICUgNCkpICUgNCk7XG4gICAgcmV0dXJuIGJhc2U2NFRvVWludDhBcnJheShiYXNlNjQgKyBwYWRkaW5nKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1aW50OEFycmF5VG9CYXNlNjR1cmwoYnl0ZXMpIHtcbiAgICByZXR1cm4gdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzKS5yZXBsYWNlKC9cXCsvZywgXCItXCIpLnJlcGxhY2UoL1xcLy9nLCBcIl9cIikucmVwbGFjZSgvPS9nLCBcIlwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1VpbnQ4QXJyYXkoaGV4KSB7XG4gICAgY29uc3QgY2xlYW5IZXggPSBoZXgucmVwbGFjZSgvXjB4LywgXCJcIik7XG4gICAgaWYgKGNsZWFuSGV4Lmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBoZXggc3RyaW5nIGxlbmd0aFwiKTtcbiAgICB9XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShjbGVhbkhleC5sZW5ndGggLyAyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsZWFuSGV4Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGJ5dGVzW2kgLyAyXSA9IE51bWJlci5wYXJzZUludChjbGVhbkhleC5zbGljZShpLCBpICsgMiksIDE2KTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ4QXJyYXlUb0hleChieXRlcykge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGJ5dGVzKVxuICAgICAgICAubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpXG4gICAgICAgIC5qb2luKFwiXCIpO1xufVxuLy8gaW5zdGFuY2VvZlxuZXhwb3J0IGNsYXNzIENsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciguLi5fYXJncykgeyB9XG59XG4iLCIvLyBpbXBvcnQgeyAkWm9kVHlwZSB9IGZyb20gXCIuL3NjaGVtYXMuanNcIjtcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIi4vY29yZS5qc1wiO1xuaW1wb3J0ICogYXMgcmVnZXhlcyBmcm9tIFwiLi9yZWdleGVzLmpzXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2sgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgaW5zdC5fem9kID8/IChpbnN0Ll96b2QgPSB7fSk7XG4gICAgaW5zdC5fem9kLmRlZiA9IGRlZjtcbiAgICAoX2EgPSBpbnN0Ll96b2QpLm9uYXR0YWNoID8/IChfYS5vbmF0dGFjaCA9IFtdKTtcbn0pO1xuY29uc3QgbnVtZXJpY09yaWdpbk1hcCA9IHtcbiAgICBudW1iZXI6IFwibnVtYmVyXCIsXG4gICAgYmlnaW50OiBcImJpZ2ludFwiLFxuICAgIG9iamVjdDogXCJkYXRlXCIsXG59O1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja0xlc3NUaGFuID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja0xlc3NUaGFuXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvbnN0IG9yaWdpbiA9IG51bWVyaWNPcmlnaW5NYXBbdHlwZW9mIGRlZi52YWx1ZV07XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgYmFnID0gaW5zdC5fem9kLmJhZztcbiAgICAgICAgY29uc3QgY3VyciA9IChkZWYuaW5jbHVzaXZlID8gYmFnLm1heGltdW0gOiBiYWcuZXhjbHVzaXZlTWF4aW11bSkgPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgICAgICBpZiAoZGVmLnZhbHVlIDwgY3Vycikge1xuICAgICAgICAgICAgaWYgKGRlZi5pbmNsdXNpdmUpXG4gICAgICAgICAgICAgICAgYmFnLm1heGltdW0gPSBkZWYudmFsdWU7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYmFnLmV4Y2x1c2l2ZU1heGltdW0gPSBkZWYudmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAoZGVmLmluY2x1c2l2ZSA/IHBheWxvYWQudmFsdWUgPD0gZGVmLnZhbHVlIDogcGF5bG9hZC52YWx1ZSA8IGRlZi52YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgY29kZTogXCJ0b29fYmlnXCIsXG4gICAgICAgICAgICBtYXhpbXVtOiB0eXBlb2YgZGVmLnZhbHVlID09PSBcIm9iamVjdFwiID8gZGVmLnZhbHVlLmdldFRpbWUoKSA6IGRlZi52YWx1ZSxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBkZWYuaW5jbHVzaXZlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrR3JlYXRlclRoYW4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrR3JlYXRlclRoYW5cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3Qgb3JpZ2luID0gbnVtZXJpY09yaWdpbk1hcFt0eXBlb2YgZGVmLnZhbHVlXTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBjb25zdCBjdXJyID0gKGRlZi5pbmNsdXNpdmUgPyBiYWcubWluaW11bSA6IGJhZy5leGNsdXNpdmVNaW5pbXVtKSA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgICAgIGlmIChkZWYudmFsdWUgPiBjdXJyKSB7XG4gICAgICAgICAgICBpZiAoZGVmLmluY2x1c2l2ZSlcbiAgICAgICAgICAgICAgICBiYWcubWluaW11bSA9IGRlZi52YWx1ZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiYWcuZXhjbHVzaXZlTWluaW11bSA9IGRlZi52YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGlmIChkZWYuaW5jbHVzaXZlID8gcGF5bG9hZC52YWx1ZSA+PSBkZWYudmFsdWUgOiBwYXlsb2FkLnZhbHVlID4gZGVmLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICBjb2RlOiBcInRvb19zbWFsbFwiLFxuICAgICAgICAgICAgbWluaW11bTogdHlwZW9mIGRlZi52YWx1ZSA9PT0gXCJvYmplY3RcIiA/IGRlZi52YWx1ZS5nZXRUaW1lKCkgOiBkZWYudmFsdWUsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogZGVmLmluY2x1c2l2ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja011bHRpcGxlT2YgPSBcbi8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tNdWx0aXBsZU9mXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgKF9hID0gaW5zdC5fem9kLmJhZykubXVsdGlwbGVPZiA/PyAoX2EubXVsdGlwbGVPZiA9IGRlZi52YWx1ZSk7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLnZhbHVlICE9PSB0eXBlb2YgZGVmLnZhbHVlKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG1peCBudW1iZXIgYW5kIGJpZ2ludCBpbiBtdWx0aXBsZV9vZiBjaGVjay5cIik7XG4gICAgICAgIGNvbnN0IGlzTXVsdGlwbGUgPSB0eXBlb2YgcGF5bG9hZC52YWx1ZSA9PT0gXCJiaWdpbnRcIlxuICAgICAgICAgICAgPyBwYXlsb2FkLnZhbHVlICUgZGVmLnZhbHVlID09PSBCaWdJbnQoMClcbiAgICAgICAgICAgIDogdXRpbC5mbG9hdFNhZmVSZW1haW5kZXIocGF5bG9hZC52YWx1ZSwgZGVmLnZhbHVlKSA9PT0gMDtcbiAgICAgICAgaWYgKGlzTXVsdGlwbGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luOiB0eXBlb2YgcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGNvZGU6IFwibm90X211bHRpcGxlX29mXCIsXG4gICAgICAgICAgICBkaXZpc29yOiBkZWYudmFsdWUsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja051bWJlckZvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tOdW1iZXJGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7IC8vIG5vIGZvcm1hdCBjaGVja3NcbiAgICBkZWYuZm9ybWF0ID0gZGVmLmZvcm1hdCB8fCBcImZsb2F0NjRcIjtcbiAgICBjb25zdCBpc0ludCA9IGRlZi5mb3JtYXQ/LmluY2x1ZGVzKFwiaW50XCIpO1xuICAgIGNvbnN0IG9yaWdpbiA9IGlzSW50ID8gXCJpbnRcIiA6IFwibnVtYmVyXCI7XG4gICAgY29uc3QgW21pbmltdW0sIG1heGltdW1dID0gdXRpbC5OVU1CRVJfRk9STUFUX1JBTkdFU1tkZWYuZm9ybWF0XTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBiYWcuZm9ybWF0ID0gZGVmLmZvcm1hdDtcbiAgICAgICAgYmFnLm1pbmltdW0gPSBtaW5pbXVtO1xuICAgICAgICBiYWcubWF4aW11bSA9IG1heGltdW07XG4gICAgICAgIGlmIChpc0ludClcbiAgICAgICAgICAgIGJhZy5wYXR0ZXJuID0gcmVnZXhlcy5pbnRlZ2VyO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKGlzSW50KSB7XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgLy8gaW52YWxpZF9mb3JtYXQgaXNzdWVcbiAgICAgICAgICAgICAgICAvLyBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAvLyAgIGV4cGVjdGVkOiBkZWYuZm9ybWF0LFxuICAgICAgICAgICAgICAgIC8vICAgZm9ybWF0OiBkZWYuZm9ybWF0LFxuICAgICAgICAgICAgICAgIC8vICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgIC8vICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgLy8gICBpbnN0LFxuICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgIC8vIGludmFsaWRfdHlwZSBpc3N1ZVxuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogb3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGRlZi5mb3JtYXQsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIG5vdF9tdWx0aXBsZV9vZiBpc3N1ZVxuICAgICAgICAgICAgICAgIC8vIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIC8vICAgY29kZTogXCJub3RfbXVsdGlwbGVfb2ZcIixcbiAgICAgICAgICAgICAgICAvLyAgIG9yaWdpbjogXCJudW1iZXJcIixcbiAgICAgICAgICAgICAgICAvLyAgIGlucHV0LFxuICAgICAgICAgICAgICAgIC8vICAgaW5zdCxcbiAgICAgICAgICAgICAgICAvLyAgIGRpdmlzb3I6IDEsXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc1NhZmVJbnRlZ2VyKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9vX2JpZ1xuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogXCJ0b29fYmlnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IFwiSW50ZWdlcnMgbXVzdCBiZSB3aXRoaW4gdGhlIHNhZmUgaW50ZWdlciByYW5nZS5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyB0b29fc21hbGxcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFwidG9vX3NtYWxsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUixcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IFwiSW50ZWdlcnMgbXVzdCBiZSB3aXRoaW4gdGhlIHNhZmUgaW50ZWdlciByYW5nZS5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgPCBtaW5pbXVtKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgY29kZTogXCJ0b29fc21hbGxcIixcbiAgICAgICAgICAgICAgICBtaW5pbXVtLFxuICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0ID4gbWF4aW11bSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGNvZGU6IFwidG9vX2JpZ1wiLFxuICAgICAgICAgICAgICAgIG1heGltdW0sXG4gICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tCaWdJbnRGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrQmlnSW50Rm9ybWF0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpOyAvLyBubyBmb3JtYXQgY2hlY2tzXG4gICAgY29uc3QgW21pbmltdW0sIG1heGltdW1dID0gdXRpbC5CSUdJTlRfRk9STUFUX1JBTkdFU1tkZWYuZm9ybWF0XTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBiYWcuZm9ybWF0ID0gZGVmLmZvcm1hdDtcbiAgICAgICAgYmFnLm1pbmltdW0gPSBtaW5pbXVtO1xuICAgICAgICBiYWcubWF4aW11bSA9IG1heGltdW07XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAoaW5wdXQgPCBtaW5pbXVtKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwiYmlnaW50XCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgY29kZTogXCJ0b29fc21hbGxcIixcbiAgICAgICAgICAgICAgICBtaW5pbXVtOiBtaW5pbXVtLFxuICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0ID4gbWF4aW11bSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiBcImJpZ2ludFwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGNvZGU6IFwidG9vX2JpZ1wiLFxuICAgICAgICAgICAgICAgIG1heGltdW0sXG4gICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tNYXhTaXplID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja01heFNpemVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIHZhciBfYTtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIChfYSA9IGluc3QuX3pvZC5kZWYpLndoZW4gPz8gKF9hLndoZW4gPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICByZXR1cm4gIXV0aWwubnVsbGlzaCh2YWwpICYmIHZhbC5zaXplICE9PSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgY3VyciA9IChpbnN0Ll96b2QuYmFnLm1heGltdW0gPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTtcbiAgICAgICAgaWYgKGRlZi5tYXhpbXVtIDwgY3VycilcbiAgICAgICAgICAgIGluc3QuX3pvZC5iYWcubWF4aW11bSA9IGRlZi5tYXhpbXVtO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGlucHV0LnNpemU7XG4gICAgICAgIGlmIChzaXplIDw9IGRlZi5tYXhpbXVtKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbjogdXRpbC5nZXRTaXphYmxlT3JpZ2luKGlucHV0KSxcbiAgICAgICAgICAgIGNvZGU6IFwidG9vX2JpZ1wiLFxuICAgICAgICAgICAgbWF4aW11bTogZGVmLm1heGltdW0sXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja01pblNpemUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTWluU2l6ZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgKF9hID0gaW5zdC5fem9kLmRlZikud2hlbiA/PyAoX2Eud2hlbiA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIHJldHVybiAhdXRpbC5udWxsaXNoKHZhbCkgJiYgdmFsLnNpemUgIT09IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyID0gKGluc3QuX3pvZC5iYWcubWluaW11bSA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkpO1xuICAgICAgICBpZiAoZGVmLm1pbmltdW0gPiBjdXJyKVxuICAgICAgICAgICAgaW5zdC5fem9kLmJhZy5taW5pbXVtID0gZGVmLm1pbmltdW07XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBjb25zdCBzaXplID0gaW5wdXQuc2l6ZTtcbiAgICAgICAgaWYgKHNpemUgPj0gZGVmLm1pbmltdW0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luOiB1dGlsLmdldFNpemFibGVPcmlnaW4oaW5wdXQpLFxuICAgICAgICAgICAgY29kZTogXCJ0b29fc21hbGxcIixcbiAgICAgICAgICAgIG1pbmltdW06IGRlZi5taW5pbXVtLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tTaXplRXF1YWxzID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja1NpemVFcXVhbHNcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIHZhciBfYTtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIChfYSA9IGluc3QuX3pvZC5kZWYpLndoZW4gPz8gKF9hLndoZW4gPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICByZXR1cm4gIXV0aWwubnVsbGlzaCh2YWwpICYmIHZhbC5zaXplICE9PSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgYmFnID0gaW5zdC5fem9kLmJhZztcbiAgICAgICAgYmFnLm1pbmltdW0gPSBkZWYuc2l6ZTtcbiAgICAgICAgYmFnLm1heGltdW0gPSBkZWYuc2l6ZTtcbiAgICAgICAgYmFnLnNpemUgPSBkZWYuc2l6ZTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGNvbnN0IHNpemUgPSBpbnB1dC5zaXplO1xuICAgICAgICBpZiAoc2l6ZSA9PT0gZGVmLnNpemUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHRvb0JpZyA9IHNpemUgPiBkZWYuc2l6ZTtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IHV0aWwuZ2V0U2l6YWJsZU9yaWdpbihpbnB1dCksXG4gICAgICAgICAgICAuLi4odG9vQmlnID8geyBjb2RlOiBcInRvb19iaWdcIiwgbWF4aW11bTogZGVmLnNpemUgfSA6IHsgY29kZTogXCJ0b29fc21hbGxcIiwgbWluaW11bTogZGVmLnNpemUgfSksXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBleGFjdDogdHJ1ZSxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTWF4TGVuZ3RoID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja01heExlbmd0aFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgKF9hID0gaW5zdC5fem9kLmRlZikud2hlbiA/PyAoX2Eud2hlbiA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIHJldHVybiAhdXRpbC5udWxsaXNoKHZhbCkgJiYgdmFsLmxlbmd0aCAhPT0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnIgPSAoaW5zdC5fem9kLmJhZy5tYXhpbXVtID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk7XG4gICAgICAgIGlmIChkZWYubWF4aW11bSA8IGN1cnIpXG4gICAgICAgICAgICBpbnN0Ll96b2QuYmFnLm1heGltdW0gPSBkZWYubWF4aW11bTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCA8PSBkZWYubWF4aW11bSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gdXRpbC5nZXRMZW5ndGhhYmxlT3JpZ2luKGlucHV0KTtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICBjb2RlOiBcInRvb19iaWdcIixcbiAgICAgICAgICAgIG1heGltdW06IGRlZi5tYXhpbXVtLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tNaW5MZW5ndGggPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTWluTGVuZ3RoXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICAoX2EgPSBpbnN0Ll96b2QuZGVmKS53aGVuID8/IChfYS53aGVuID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuICF1dGlsLm51bGxpc2godmFsKSAmJiB2YWwubGVuZ3RoICE9PSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgY3VyciA9IChpbnN0Ll96b2QuYmFnLm1pbmltdW0gPz8gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZKTtcbiAgICAgICAgaWYgKGRlZi5taW5pbXVtID4gY3VycilcbiAgICAgICAgICAgIGluc3QuX3pvZC5iYWcubWluaW11bSA9IGRlZi5taW5pbXVtO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoID49IGRlZi5taW5pbXVtKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBvcmlnaW4gPSB1dGlsLmdldExlbmd0aGFibGVPcmlnaW4oaW5wdXQpO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgIGNvZGU6IFwidG9vX3NtYWxsXCIsXG4gICAgICAgICAgICBtaW5pbXVtOiBkZWYubWluaW11bSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTGVuZ3RoRXF1YWxzID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja0xlbmd0aEVxdWFsc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgKF9hID0gaW5zdC5fem9kLmRlZikud2hlbiA/PyAoX2Eud2hlbiA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIHJldHVybiAhdXRpbC5udWxsaXNoKHZhbCkgJiYgdmFsLmxlbmd0aCAhPT0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5taW5pbXVtID0gZGVmLmxlbmd0aDtcbiAgICAgICAgYmFnLm1heGltdW0gPSBkZWYubGVuZ3RoO1xuICAgICAgICBiYWcubGVuZ3RoID0gZGVmLmxlbmd0aDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gZGVmLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gdXRpbC5nZXRMZW5ndGhhYmxlT3JpZ2luKGlucHV0KTtcbiAgICAgICAgY29uc3QgdG9vQmlnID0gbGVuZ3RoID4gZGVmLmxlbmd0aDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICAuLi4odG9vQmlnID8geyBjb2RlOiBcInRvb19iaWdcIiwgbWF4aW11bTogZGVmLmxlbmd0aCB9IDogeyBjb2RlOiBcInRvb19zbWFsbFwiLCBtaW5pbXVtOiBkZWYubGVuZ3RoIH0pLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja1N0cmluZ0Zvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tTdHJpbmdGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIHZhciBfYSwgX2I7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBiYWcuZm9ybWF0ID0gZGVmLmZvcm1hdDtcbiAgICAgICAgaWYgKGRlZi5wYXR0ZXJuKSB7XG4gICAgICAgICAgICBiYWcucGF0dGVybnMgPz8gKGJhZy5wYXR0ZXJucyA9IG5ldyBTZXQoKSk7XG4gICAgICAgICAgICBiYWcucGF0dGVybnMuYWRkKGRlZi5wYXR0ZXJuKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChkZWYucGF0dGVybilcbiAgICAgICAgKF9hID0gaW5zdC5fem9kKS5jaGVjayA/PyAoX2EuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICAgICAgZGVmLnBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGlmIChkZWYucGF0dGVybi50ZXN0KHBheWxvYWQudmFsdWUpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG9yaWdpbjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBkZWYuZm9ybWF0LFxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIC4uLihkZWYucGF0dGVybiA/IHsgcGF0dGVybjogZGVmLnBhdHRlcm4udG9TdHJpbmcoKSB9IDoge30pLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgZWxzZVxuICAgICAgICAoX2IgPSBpbnN0Ll96b2QpLmNoZWNrID8/IChfYi5jaGVjayA9ICgpID0+IHsgfSk7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tSZWdleCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tSZWdleFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBkZWYucGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICBpZiAoZGVmLnBhdHRlcm4udGVzdChwYXlsb2FkLnZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwicmVnZXhcIixcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgcGF0dGVybjogZGVmLnBhdHRlcm4udG9TdHJpbmcoKSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja0xvd2VyQ2FzZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tMb3dlckNhc2VcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMubG93ZXJjYXNlKTtcbiAgICAkWm9kQ2hlY2tTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrVXBwZXJDYXNlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja1VwcGVyQ2FzZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy51cHBlcmNhc2UpO1xuICAgICRab2RDaGVja1N0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tJbmNsdWRlcyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tJbmNsdWRlc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCBlc2NhcGVkUmVnZXggPSB1dGlsLmVzY2FwZVJlZ2V4KGRlZi5pbmNsdWRlcyk7XG4gICAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAodHlwZW9mIGRlZi5wb3NpdGlvbiA9PT0gXCJudW1iZXJcIiA/IGBeLnske2RlZi5wb3NpdGlvbn19JHtlc2NhcGVkUmVnZXh9YCA6IGVzY2FwZWRSZWdleCk7XG4gICAgZGVmLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5wYXR0ZXJucyA/PyAoYmFnLnBhdHRlcm5zID0gbmV3IFNldCgpKTtcbiAgICAgICAgYmFnLnBhdHRlcm5zLmFkZChwYXR0ZXJuKTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAocGF5bG9hZC52YWx1ZS5pbmNsdWRlcyhkZWYuaW5jbHVkZXMsIGRlZi5wb3NpdGlvbikpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImluY2x1ZGVzXCIsXG4gICAgICAgICAgICBpbmNsdWRlczogZGVmLmluY2x1ZGVzLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tTdGFydHNXaXRoID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja1N0YXJ0c1dpdGhcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYF4ke3V0aWwuZXNjYXBlUmVnZXgoZGVmLnByZWZpeCl9LipgKTtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSBwYXR0ZXJuKTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBiYWcucGF0dGVybnMgPz8gKGJhZy5wYXR0ZXJucyA9IG5ldyBTZXQoKSk7XG4gICAgICAgIGJhZy5wYXR0ZXJucy5hZGQocGF0dGVybik7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKHBheWxvYWQudmFsdWUuc3RhcnRzV2l0aChkZWYucHJlZml4KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwic3RhcnRzX3dpdGhcIixcbiAgICAgICAgICAgIHByZWZpeDogZGVmLnByZWZpeCxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrRW5kc1dpdGggPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrRW5kc1dpdGhcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoYC4qJHt1dGlsLmVzY2FwZVJlZ2V4KGRlZi5zdWZmaXgpfSRgKTtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSBwYXR0ZXJuKTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBiYWcucGF0dGVybnMgPz8gKGJhZy5wYXR0ZXJucyA9IG5ldyBTZXQoKSk7XG4gICAgICAgIGJhZy5wYXR0ZXJucy5hZGQocGF0dGVybik7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKHBheWxvYWQudmFsdWUuZW5kc1dpdGgoZGVmLnN1ZmZpeCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImVuZHNfd2l0aFwiLFxuICAgICAgICAgICAgc3VmZml4OiBkZWYuc3VmZml4LFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLyAgICAkWm9kQ2hlY2tQcm9wZXJ0eSAgICAvLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmZ1bmN0aW9uIGhhbmRsZUNoZWNrUHJvcGVydHlSZXN1bHQocmVzdWx0LCBwYXlsb2FkLCBwcm9wZXJ0eSkge1xuICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKC4uLnV0aWwucHJlZml4SXNzdWVzKHByb3BlcnR5LCByZXN1bHQuaXNzdWVzKSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0ICRab2RDaGVja1Byb3BlcnR5ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja1Byb3BlcnR5XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5zY2hlbWEuX3pvZC5ydW4oe1xuICAgICAgICAgICAgdmFsdWU6IHBheWxvYWQudmFsdWVbZGVmLnByb3BlcnR5XSxcbiAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiBoYW5kbGVDaGVja1Byb3BlcnR5UmVzdWx0KHJlc3VsdCwgcGF5bG9hZCwgZGVmLnByb3BlcnR5KSk7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlQ2hlY2tQcm9wZXJ0eVJlc3VsdChyZXN1bHQsIHBheWxvYWQsIGRlZi5wcm9wZXJ0eSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTWltZVR5cGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTWltZVR5cGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgbWltZVNldCA9IG5ldyBTZXQoZGVmLm1pbWUpO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGluc3QuX3pvZC5iYWcubWltZSA9IGRlZi5taW1lO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGlmIChtaW1lU2V0LmhhcyhwYXlsb2FkLnZhbHVlLnR5cGUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF92YWx1ZVwiLFxuICAgICAgICAgICAgdmFsdWVzOiBkZWYubWltZSxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLnR5cGUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tPdmVyd3JpdGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrT3ZlcndyaXRlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBkZWYudHgocGF5bG9hZC52YWx1ZSk7XG4gICAgfTtcbn0pO1xuIiwiZXhwb3J0IGNsYXNzIERvYyB7XG4gICAgY29uc3RydWN0b3IoYXJncyA9IFtdKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IFtdO1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIGlmICh0aGlzKVxuICAgICAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG4gICAgaW5kZW50ZWQoZm4pIHtcbiAgICAgICAgdGhpcy5pbmRlbnQgKz0gMTtcbiAgICAgICAgZm4odGhpcyk7XG4gICAgICAgIHRoaXMuaW5kZW50IC09IDE7XG4gICAgfVxuICAgIHdyaXRlKGFyZykge1xuICAgICAgICBpZiAodHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBhcmcodGhpcywgeyBleGVjdXRpb246IFwic3luY1wiIH0pO1xuICAgICAgICAgICAgYXJnKHRoaXMsIHsgZXhlY3V0aW9uOiBcImFzeW5jXCIgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGVudCA9IGFyZztcbiAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KFwiXFxuXCIpLmZpbHRlcigoeCkgPT4geCk7XG4gICAgICAgIGNvbnN0IG1pbkluZGVudCA9IE1hdGgubWluKC4uLmxpbmVzLm1hcCgoeCkgPT4geC5sZW5ndGggLSB4LnRyaW1TdGFydCgpLmxlbmd0aCkpO1xuICAgICAgICBjb25zdCBkZWRlbnRlZCA9IGxpbmVzLm1hcCgoeCkgPT4geC5zbGljZShtaW5JbmRlbnQpKS5tYXAoKHgpID0+IFwiIFwiLnJlcGVhdCh0aGlzLmluZGVudCAqIDIpICsgeCk7XG4gICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBkZWRlbnRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZW50LnB1c2gobGluZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGlsZSgpIHtcbiAgICAgICAgY29uc3QgRiA9IEZ1bmN0aW9uO1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcz8uYXJncztcbiAgICAgICAgY29uc3QgY29udGVudCA9IHRoaXM/LmNvbnRlbnQgPz8gW2BgXTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBbLi4uY29udGVudC5tYXAoKHgpID0+IGAgICR7eH1gKV07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGxpbmVzLmpvaW4oXCJcXG5cIikpO1xuICAgICAgICByZXR1cm4gbmV3IEYoLi4uYXJncywgbGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgJGNvbnN0cnVjdG9yIH0gZnJvbSBcIi4vY29yZS5qc1wiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XG5jb25zdCBpbml0aWFsaXplciA9IChpbnN0LCBkZWYpID0+IHtcbiAgICBpbnN0Lm5hbWUgPSBcIiRab2RFcnJvclwiO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcIl96b2RcIiwge1xuICAgICAgICB2YWx1ZTogaW5zdC5fem9kLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdCwgXCJpc3N1ZXNcIiwge1xuICAgICAgICB2YWx1ZTogZGVmLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB9KTtcbiAgICBpbnN0Lm1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShkZWYsIHV0aWwuanNvblN0cmluZ2lmeVJlcGxhY2VyLCAyKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdCwgXCJ0b1N0cmluZ1wiLCB7XG4gICAgICAgIHZhbHVlOiAoKSA9PiBpbnN0Lm1lc3NhZ2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjb25zdCAkWm9kRXJyb3IgPSAkY29uc3RydWN0b3IoXCIkWm9kRXJyb3JcIiwgaW5pdGlhbGl6ZXIpO1xuZXhwb3J0IGNvbnN0ICRab2RSZWFsRXJyb3IgPSAkY29uc3RydWN0b3IoXCIkWm9kRXJyb3JcIiwgaW5pdGlhbGl6ZXIsIHsgUGFyZW50OiBFcnJvciB9KTtcbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuRXJyb3IoZXJyb3IsIG1hcHBlciA9IChpc3N1ZSkgPT4gaXNzdWUubWVzc2FnZSkge1xuICAgIGNvbnN0IGZpZWxkRXJyb3JzID0ge307XG4gICAgY29uc3QgZm9ybUVycm9ycyA9IFtdO1xuICAgIGZvciAoY29uc3Qgc3ViIG9mIGVycm9yLmlzc3Vlcykge1xuICAgICAgICBpZiAoc3ViLnBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZmllbGRFcnJvcnNbc3ViLnBhdGhbMF1dID0gZmllbGRFcnJvcnNbc3ViLnBhdGhbMF1dIHx8IFtdO1xuICAgICAgICAgICAgZmllbGRFcnJvcnNbc3ViLnBhdGhbMF1dLnB1c2gobWFwcGVyKHN1YikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9ybUVycm9ycy5wdXNoKG1hcHBlcihzdWIpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBmb3JtRXJyb3JzLCBmaWVsZEVycm9ycyB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEVycm9yKGVycm9yLCBtYXBwZXIgPSAoaXNzdWUpID0+IGlzc3VlLm1lc3NhZ2UpIHtcbiAgICBjb25zdCBmaWVsZEVycm9ycyA9IHsgX2Vycm9yczogW10gfTtcbiAgICBjb25zdCBwcm9jZXNzRXJyb3IgPSAoZXJyb3IsIHBhdGggPSBbXSkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGlzc3VlIG9mIGVycm9yLmlzc3Vlcykge1xuICAgICAgICAgICAgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF91bmlvblwiICYmIGlzc3VlLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpc3N1ZS5lcnJvcnMubWFwKChpc3N1ZXMpID0+IHByb2Nlc3NFcnJvcih7IGlzc3VlcyB9LCBbLi4ucGF0aCwgLi4uaXNzdWUucGF0aF0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF9rZXlcIikge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NFcnJvcih7IGlzc3VlczogaXNzdWUuaXNzdWVzIH0sIFsuLi5wYXRoLCAuLi5pc3N1ZS5wYXRoXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS5jb2RlID09PSBcImludmFsaWRfZWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc0Vycm9yKHsgaXNzdWVzOiBpc3N1ZS5pc3N1ZXMgfSwgWy4uLnBhdGgsIC4uLmlzc3VlLnBhdGhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxwYXRoID0gWy4uLnBhdGgsIC4uLmlzc3VlLnBhdGhdO1xuICAgICAgICAgICAgICAgIGlmIChmdWxscGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRFcnJvcnMuX2Vycm9ycy5wdXNoKG1hcHBlcihpc3N1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnIgPSBmaWVsZEVycm9ycztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IGZ1bGxwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWwgPSBmdWxscGF0aFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1pbmFsID0gaSA9PT0gZnVsbHBhdGgubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGVybWluYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyW2VsXSA9IGN1cnJbZWxdIHx8IHsgX2Vycm9yczogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJbZWxdID0gY3VycltlbF0gfHwgeyBfZXJyb3JzOiBbXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJbZWxdLl9lcnJvcnMucHVzaChtYXBwZXIoaXNzdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnIgPSBjdXJyW2VsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcHJvY2Vzc0Vycm9yKGVycm9yKTtcbiAgICByZXR1cm4gZmllbGRFcnJvcnM7XG59XG5leHBvcnQgZnVuY3Rpb24gdHJlZWlmeUVycm9yKGVycm9yLCBtYXBwZXIgPSAoaXNzdWUpID0+IGlzc3VlLm1lc3NhZ2UpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVycm9yczogW10gfTtcbiAgICBjb25zdCBwcm9jZXNzRXJyb3IgPSAoZXJyb3IsIHBhdGggPSBbXSkgPT4ge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBmb3IgKGNvbnN0IGlzc3VlIG9mIGVycm9yLmlzc3Vlcykge1xuICAgICAgICAgICAgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF91bmlvblwiICYmIGlzc3VlLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyByZWd1bGFyIHVuaW9uIGVycm9yXG4gICAgICAgICAgICAgICAgaXNzdWUuZXJyb3JzLm1hcCgoaXNzdWVzKSA9PiBwcm9jZXNzRXJyb3IoeyBpc3N1ZXMgfSwgWy4uLnBhdGgsIC4uLmlzc3VlLnBhdGhdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS5jb2RlID09PSBcImludmFsaWRfa2V5XCIpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzRXJyb3IoeyBpc3N1ZXM6IGlzc3VlLmlzc3VlcyB9LCBbLi4ucGF0aCwgLi4uaXNzdWUucGF0aF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX2VsZW1lbnRcIikge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NFcnJvcih7IGlzc3VlczogaXNzdWUuaXNzdWVzIH0sIFsuLi5wYXRoLCAuLi5pc3N1ZS5wYXRoXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdWxscGF0aCA9IFsuLi5wYXRoLCAuLi5pc3N1ZS5wYXRoXTtcbiAgICAgICAgICAgICAgICBpZiAoZnVsbHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvcnMucHVzaChtYXBwZXIoaXNzdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBjdXJyID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IGZ1bGxwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGZ1bGxwYXRoW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXJtaW5hbCA9IGkgPT09IGZ1bGxwYXRoLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWwgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnIucHJvcGVydGllcyA/PyAoY3Vyci5wcm9wZXJ0aWVzID0ge30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgKF9hID0gY3Vyci5wcm9wZXJ0aWVzKVtlbF0gPz8gKF9hW2VsXSA9IHsgZXJyb3JzOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnIgPSBjdXJyLnByb3BlcnRpZXNbZWxdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyci5pdGVtcyA/PyAoY3Vyci5pdGVtcyA9IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIChfYiA9IGN1cnIuaXRlbXMpW2VsXSA/PyAoX2JbZWxdID0geyBlcnJvcnM6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyciA9IGN1cnIuaXRlbXNbZWxdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXJtaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyci5lcnJvcnMucHVzaChtYXBwZXIoaXNzdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBwcm9jZXNzRXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogRm9ybWF0IGEgWm9kRXJyb3IgYXMgYSBodW1hbi1yZWFkYWJsZSBzdHJpbmcgaW4gdGhlIGZvbGxvd2luZyBmb3JtLlxuICpcbiAqIEZyb21cbiAqXG4gKiBgYGB0c1xuICogWm9kRXJyb3Ige1xuICogICBpc3N1ZXM6IFtcbiAqICAgICB7XG4gKiAgICAgICBleHBlY3RlZDogJ3N0cmluZycsXG4gKiAgICAgICBjb2RlOiAnaW52YWxpZF90eXBlJyxcbiAqICAgICAgIHBhdGg6IFsgJ3VzZXJuYW1lJyBdLFxuICogICAgICAgbWVzc2FnZTogJ0ludmFsaWQgaW5wdXQ6IGV4cGVjdGVkIHN0cmluZydcbiAqICAgICB9LFxuICogICAgIHtcbiAqICAgICAgIGV4cGVjdGVkOiAnbnVtYmVyJyxcbiAqICAgICAgIGNvZGU6ICdpbnZhbGlkX3R5cGUnLFxuICogICAgICAgcGF0aDogWyAnZmF2b3JpdGVOdW1iZXJzJywgMSBdLFxuICogICAgICAgbWVzc2FnZTogJ0ludmFsaWQgaW5wdXQ6IGV4cGVjdGVkIG51bWJlcidcbiAqICAgICB9XG4gKiAgIF07XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiB0b1xuICpcbiAqIGBgYFxuICogdXNlcm5hbWVcbiAqICAg4pyWIEV4cGVjdGVkIG51bWJlciwgcmVjZWl2ZWQgc3RyaW5nIGF0IFwidXNlcm5hbWVcbiAqIGZhdm9yaXRlTnVtYmVyc1swXVxuICogICDinJYgSW52YWxpZCBpbnB1dDogZXhwZWN0ZWQgbnVtYmVyXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvRG90UGF0aChfcGF0aCkge1xuICAgIGNvbnN0IHNlZ3MgPSBbXTtcbiAgICBjb25zdCBwYXRoID0gX3BhdGgubWFwKChzZWcpID0+ICh0eXBlb2Ygc2VnID09PSBcIm9iamVjdFwiID8gc2VnLmtleSA6IHNlZykpO1xuICAgIGZvciAoY29uc3Qgc2VnIG9mIHBhdGgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWcgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICBzZWdzLnB1c2goYFske3NlZ31dYCk7XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzZWcgPT09IFwic3ltYm9sXCIpXG4gICAgICAgICAgICBzZWdzLnB1c2goYFske0pTT04uc3RyaW5naWZ5KFN0cmluZyhzZWcpKX1dYCk7XG4gICAgICAgIGVsc2UgaWYgKC9bXlxcdyRdLy50ZXN0KHNlZykpXG4gICAgICAgICAgICBzZWdzLnB1c2goYFske0pTT04uc3RyaW5naWZ5KHNlZyl9XWApO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWdzLmxlbmd0aClcbiAgICAgICAgICAgICAgICBzZWdzLnB1c2goXCIuXCIpO1xuICAgICAgICAgICAgc2Vncy5wdXNoKHNlZyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlZ3Muam9pbihcIlwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmV0dGlmeUVycm9yKGVycm9yKSB7XG4gICAgY29uc3QgbGluZXMgPSBbXTtcbiAgICAvLyBzb3J0IGJ5IHBhdGggbGVuZ3RoXG4gICAgY29uc3QgaXNzdWVzID0gWy4uLmVycm9yLmlzc3Vlc10uc29ydCgoYSwgYikgPT4gKGEucGF0aCA/PyBbXSkubGVuZ3RoIC0gKGIucGF0aCA/PyBbXSkubGVuZ3RoKTtcbiAgICAvLyBQcm9jZXNzIGVhY2ggaXNzdWVcbiAgICBmb3IgKGNvbnN0IGlzc3VlIG9mIGlzc3Vlcykge1xuICAgICAgICBsaW5lcy5wdXNoKGDinJYgJHtpc3N1ZS5tZXNzYWdlfWApO1xuICAgICAgICBpZiAoaXNzdWUucGF0aD8ubGVuZ3RoKVxuICAgICAgICAgICAgbGluZXMucHVzaChgICDihpIgYXQgJHt0b0RvdFBhdGgoaXNzdWUucGF0aCl9YCk7XG4gICAgfVxuICAgIC8vIENvbnZlcnQgTWFwIHRvIGZvcm1hdHRlZCBzdHJpbmdcbiAgICByZXR1cm4gbGluZXMuam9pbihcIlxcblwiKTtcbn1cbiIsImltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIi4vY29yZS5qc1wiO1xuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gXCIuL2Vycm9ycy5qc1wiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XG5leHBvcnQgY29uc3QgX3BhcnNlID0gKF9FcnIpID0+IChzY2hlbWEsIHZhbHVlLCBfY3R4LCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY3R4ID0gX2N0eCA/IHsgLi4uX2N0eCwgYXN5bmM6IGZhbHNlIH0gOiB7IGFzeW5jOiBmYWxzZSB9O1xuICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5fem9kLnJ1bih7IHZhbHVlLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IGNvcmUuJFpvZEFzeW5jRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGUgPSBuZXcgKF9wYXJhbXM/LkVyciA/PyBfRXJyKShyZXN1bHQuaXNzdWVzLm1hcCgoaXNzKSA9PiB1dGlsLmZpbmFsaXplSXNzdWUoaXNzLCBjdHgsIGNvcmUuY29uZmlnKCkpKSk7XG4gICAgICAgIHV0aWwuY2FwdHVyZVN0YWNrVHJhY2UoZSwgX3BhcmFtcz8uY2FsbGVlKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbn07XG5leHBvcnQgY29uc3QgcGFyc2UgPSAvKiBAX19QVVJFX18qLyBfcGFyc2UoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9wYXJzZUFzeW5jID0gKF9FcnIpID0+IGFzeW5jIChzY2hlbWEsIHZhbHVlLCBfY3R4LCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjdHggPSBfY3R4ID8geyAuLi5fY3R4LCBhc3luYzogdHJ1ZSB9IDogeyBhc3luYzogdHJ1ZSB9O1xuICAgIGxldCByZXN1bHQgPSBzY2hlbWEuX3pvZC5ydW4oeyB2YWx1ZSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgICByZXN1bHQgPSBhd2FpdCByZXN1bHQ7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGUgPSBuZXcgKHBhcmFtcz8uRXJyID8/IF9FcnIpKHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpKTtcbiAgICAgICAgdXRpbC5jYXB0dXJlU3RhY2tUcmFjZShlLCBwYXJhbXM/LmNhbGxlZSk7XG4gICAgICAgIHRocm93IGU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG59O1xuZXhwb3J0IGNvbnN0IHBhcnNlQXN5bmMgPSAvKiBAX19QVVJFX18qLyBfcGFyc2VBc3luYyhlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX3NhZmVQYXJzZSA9IChfRXJyKSA9PiAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGFzeW5jOiBmYWxzZSB9IDogeyBhc3luYzogZmFsc2UgfTtcbiAgICBjb25zdCByZXN1bHQgPSBzY2hlbWEuX3pvZC5ydW4oeyB2YWx1ZSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIHRocm93IG5ldyBjb3JlLiRab2RBc3luY0Vycm9yKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQuaXNzdWVzLmxlbmd0aFxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IG5ldyAoX0VyciA/PyBlcnJvcnMuJFpvZEVycm9yKShyZXN1bHQuaXNzdWVzLm1hcCgoaXNzKSA9PiB1dGlsLmZpbmFsaXplSXNzdWUoaXNzLCBjdHgsIGNvcmUuY29uZmlnKCkpKSksXG4gICAgICAgIH1cbiAgICAgICAgOiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdC52YWx1ZSB9O1xufTtcbmV4cG9ydCBjb25zdCBzYWZlUGFyc2UgPSAvKiBAX19QVVJFX18qLyBfc2FmZVBhcnNlKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfc2FmZVBhcnNlQXN5bmMgPSAoX0VycikgPT4gYXN5bmMgKHNjaGVtYSwgdmFsdWUsIF9jdHgpID0+IHtcbiAgICBjb25zdCBjdHggPSBfY3R4ID8geyAuLi5fY3R4LCBhc3luYzogdHJ1ZSB9IDogeyBhc3luYzogdHJ1ZSB9O1xuICAgIGxldCByZXN1bHQgPSBzY2hlbWEuX3pvZC5ydW4oeyB2YWx1ZSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKVxuICAgICAgICByZXN1bHQgPSBhd2FpdCByZXN1bHQ7XG4gICAgcmV0dXJuIHJlc3VsdC5pc3N1ZXMubGVuZ3RoXG4gICAgICAgID8ge1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogbmV3IF9FcnIocmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSkpLFxuICAgICAgICB9XG4gICAgICAgIDogeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQudmFsdWUgfTtcbn07XG5leHBvcnQgY29uc3Qgc2FmZVBhcnNlQXN5bmMgPSAvKiBAX19QVVJFX18qLyBfc2FmZVBhcnNlQXN5bmMoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9lbmNvZGUgPSAoX0VycikgPT4gKHNjaGVtYSwgdmFsdWUsIF9jdHgpID0+IHtcbiAgICBjb25zdCBjdHggPSBfY3R4ID8geyAuLi5fY3R4LCBkaXJlY3Rpb246IFwiYmFja3dhcmRcIiB9IDogeyBkaXJlY3Rpb246IFwiYmFja3dhcmRcIiB9O1xuICAgIHJldHVybiBfcGFyc2UoX0Vycikoc2NoZW1hLCB2YWx1ZSwgY3R4KTtcbn07XG5leHBvcnQgY29uc3QgZW5jb2RlID0gLyogQF9fUFVSRV9fKi8gX2VuY29kZShlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX2RlY29kZSA9IChfRXJyKSA9PiAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIHJldHVybiBfcGFyc2UoX0Vycikoc2NoZW1hLCB2YWx1ZSwgX2N0eCk7XG59O1xuZXhwb3J0IGNvbnN0IGRlY29kZSA9IC8qIEBfX1BVUkVfXyovIF9kZWNvZGUoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9lbmNvZGVBc3luYyA9IChfRXJyKSA9PiBhc3luYyAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH0gOiB7IGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH07XG4gICAgcmV0dXJuIF9wYXJzZUFzeW5jKF9FcnIpKHNjaGVtYSwgdmFsdWUsIGN0eCk7XG59O1xuZXhwb3J0IGNvbnN0IGVuY29kZUFzeW5jID0gLyogQF9fUFVSRV9fKi8gX2VuY29kZUFzeW5jKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfZGVjb2RlQXN5bmMgPSAoX0VycikgPT4gYXN5bmMgKHNjaGVtYSwgdmFsdWUsIF9jdHgpID0+IHtcbiAgICByZXR1cm4gX3BhcnNlQXN5bmMoX0Vycikoc2NoZW1hLCB2YWx1ZSwgX2N0eCk7XG59O1xuZXhwb3J0IGNvbnN0IGRlY29kZUFzeW5jID0gLyogQF9fUFVSRV9fKi8gX2RlY29kZUFzeW5jKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfc2FmZUVuY29kZSA9IChfRXJyKSA9PiAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH0gOiB7IGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH07XG4gICAgcmV0dXJuIF9zYWZlUGFyc2UoX0Vycikoc2NoZW1hLCB2YWx1ZSwgY3R4KTtcbn07XG5leHBvcnQgY29uc3Qgc2FmZUVuY29kZSA9IC8qIEBfX1BVUkVfXyovIF9zYWZlRW5jb2RlKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfc2FmZURlY29kZSA9IChfRXJyKSA9PiAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIHJldHVybiBfc2FmZVBhcnNlKF9FcnIpKHNjaGVtYSwgdmFsdWUsIF9jdHgpO1xufTtcbmV4cG9ydCBjb25zdCBzYWZlRGVjb2RlID0gLyogQF9fUFVSRV9fKi8gX3NhZmVEZWNvZGUoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9zYWZlRW5jb2RlQXN5bmMgPSAoX0VycikgPT4gYXN5bmMgKHNjaGVtYSwgdmFsdWUsIF9jdHgpID0+IHtcbiAgICBjb25zdCBjdHggPSBfY3R4ID8geyAuLi5fY3R4LCBkaXJlY3Rpb246IFwiYmFja3dhcmRcIiB9IDogeyBkaXJlY3Rpb246IFwiYmFja3dhcmRcIiB9O1xuICAgIHJldHVybiBfc2FmZVBhcnNlQXN5bmMoX0Vycikoc2NoZW1hLCB2YWx1ZSwgY3R4KTtcbn07XG5leHBvcnQgY29uc3Qgc2FmZUVuY29kZUFzeW5jID0gLyogQF9fUFVSRV9fKi8gX3NhZmVFbmNvZGVBc3luYyhlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX3NhZmVEZWNvZGVBc3luYyA9IChfRXJyKSA9PiBhc3luYyAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIHJldHVybiBfc2FmZVBhcnNlQXN5bmMoX0Vycikoc2NoZW1hLCB2YWx1ZSwgX2N0eCk7XG59O1xuZXhwb3J0IGNvbnN0IHNhZmVEZWNvZGVBc3luYyA9IC8qIEBfX1BVUkVfXyovIF9zYWZlRGVjb2RlQXN5bmMoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuIiwiZXhwb3J0IGNvbnN0IHZlcnNpb24gPSB7XG4gICAgbWFqb3I6IDQsXG4gICAgbWlub3I6IDQsXG4gICAgcGF0Y2g6IDMsXG59O1xuIiwiaW1wb3J0ICogYXMgY2hlY2tzIGZyb20gXCIuL2NoZWNrcy5qc1wiO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi9jb3JlLmpzXCI7XG5pbXBvcnQgeyBEb2MgfSBmcm9tIFwiLi9kb2MuanNcIjtcbmltcG9ydCB7IHBhcnNlLCBwYXJzZUFzeW5jLCBzYWZlUGFyc2UsIHNhZmVQYXJzZUFzeW5jIH0gZnJvbSBcIi4vcGFyc2UuanNcIjtcbmltcG9ydCAqIGFzIHJlZ2V4ZXMgZnJvbSBcIi4vcmVnZXhlcy5qc1wiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSBcIi4vdmVyc2lvbnMuanNcIjtcbmV4cG9ydCBjb25zdCAkWm9kVHlwZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVHlwZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgIGluc3QgPz8gKGluc3QgPSB7fSk7XG4gICAgaW5zdC5fem9kLmRlZiA9IGRlZjsgLy8gc2V0IF9kZWYgcHJvcGVydHlcbiAgICBpbnN0Ll96b2QuYmFnID0gaW5zdC5fem9kLmJhZyB8fCB7fTsgLy8gaW5pdGlhbGl6ZSBfYmFnIG9iamVjdFxuICAgIGluc3QuX3pvZC52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICBjb25zdCBjaGVja3MgPSBbLi4uKGluc3QuX3pvZC5kZWYuY2hlY2tzID8/IFtdKV07XG4gICAgLy8gaWYgaW5zdCBpcyBpdHNlbGYgYSBjaGVja3MuJFpvZENoZWNrLCBydW4gaXQgYXMgYSBjaGVja1xuICAgIGlmIChpbnN0Ll96b2QudHJhaXRzLmhhcyhcIiRab2RDaGVja1wiKSkge1xuICAgICAgICBjaGVja3MudW5zaGlmdChpbnN0KTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBjaCBvZiBjaGVja3MpIHtcbiAgICAgICAgZm9yIChjb25zdCBmbiBvZiBjaC5fem9kLm9uYXR0YWNoKSB7XG4gICAgICAgICAgICBmbihpbnN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hlY2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBkZWZlcnJlZCBpbml0aWFsaXplclxuICAgICAgICAvLyBpbnN0Ll96b2QucGFyc2UgaXMgbm90IHlldCBkZWZpbmVkXG4gICAgICAgIChfYSA9IGluc3QuX3pvZCkuZGVmZXJyZWQgPz8gKF9hLmRlZmVycmVkID0gW10pO1xuICAgICAgICBpbnN0Ll96b2QuZGVmZXJyZWQ/LnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgaW5zdC5fem9kLnJ1biA9IGluc3QuX3pvZC5wYXJzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBydW5DaGVja3MgPSAocGF5bG9hZCwgY2hlY2tzLCBjdHgpID0+IHtcbiAgICAgICAgICAgIGxldCBpc0Fib3J0ZWQgPSB1dGlsLmFib3J0ZWQocGF5bG9hZCk7XG4gICAgICAgICAgICBsZXQgYXN5bmNSZXN1bHQ7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIGNoZWNrcykge1xuICAgICAgICAgICAgICAgIGlmIChjaC5fem9kLmRlZi53aGVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1dGlsLmV4cGxpY2l0bHlBYm9ydGVkKHBheWxvYWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNob3VsZFJ1biA9IGNoLl96b2QuZGVmLndoZW4ocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2hvdWxkUnVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgY3VyckxlbiA9IHBheWxvYWQuaXNzdWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBfID0gY2guX3pvZC5jaGVjayhwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICBpZiAoXyBpbnN0YW5jZW9mIFByb21pc2UgJiYgY3R4Py5hc3luYyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IGNvcmUuJFpvZEFzeW5jRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFzeW5jUmVzdWx0IHx8IF8gaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jUmVzdWx0ID0gKGFzeW5jUmVzdWx0ID8/IFByb21pc2UucmVzb2x2ZSgpKS50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IF87XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0TGVuID0gcGF5bG9hZC5pc3N1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRMZW4gPT09IGN1cnJMZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Fib3J0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBYm9ydGVkID0gdXRpbC5hYm9ydGVkKHBheWxvYWQsIGN1cnJMZW4pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRMZW4gPSBwYXlsb2FkLmlzc3Vlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0TGVuID09PSBjdXJyTGVuKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBYm9ydGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBYm9ydGVkID0gdXRpbC5hYm9ydGVkKHBheWxvYWQsIGN1cnJMZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhc3luY1Jlc3VsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3luY1Jlc3VsdC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGFuZGxlQ2FuYXJ5UmVzdWx0ID0gKGNhbmFyeSwgcGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgICAgICAvLyBhYm9ydCBpZiB0aGUgY2FuYXJ5IGlzIGFib3J0ZWRcbiAgICAgICAgICAgIGlmICh1dGlsLmFib3J0ZWQoY2FuYXJ5KSkge1xuICAgICAgICAgICAgICAgIGNhbmFyeS5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FuYXJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcnVuIGNoZWNrcyBmaXJzdCwgdGhlblxuICAgICAgICAgICAgY29uc3QgY2hlY2tSZXN1bHQgPSBydW5DaGVja3MocGF5bG9hZCwgY2hlY2tzLCBjdHgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrUmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHguYXN5bmMgPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kQXN5bmNFcnJvcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGVja1Jlc3VsdC50aGVuKChjaGVja1Jlc3VsdCkgPT4gaW5zdC5fem9kLnBhcnNlKGNoZWNrUmVzdWx0LCBjdHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0Ll96b2QucGFyc2UoY2hlY2tSZXN1bHQsIGN0eCk7XG4gICAgICAgIH07XG4gICAgICAgIGluc3QuX3pvZC5ydW4gPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgICAgICBpZiAoY3R4LnNraXBDaGVja3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdC5fem9kLnBhcnNlKHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICAgICAgLy8gcnVuIGNhbmFyeVxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWwgcGFzcyAobm8gY2hlY2tzKVxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbmFyeSA9IGluc3QuX3pvZC5wYXJzZSh7IHZhbHVlOiBwYXlsb2FkLnZhbHVlLCBpc3N1ZXM6IFtdIH0sIHsgLi4uY3R4LCBza2lwQ2hlY2tzOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIGlmIChjYW5hcnkgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYW5hcnkudGhlbigoY2FuYXJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQ2FuYXJ5UmVzdWx0KGNhbmFyeSwgcGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVDYW5hcnlSZXN1bHQoY2FuYXJ5LCBwYXlsb2FkLCBjdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZm9yd2FyZFxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdC5fem9kLnBhcnNlKHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdHguYXN5bmMgPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kQXN5bmNFcnJvcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiBydW5DaGVja3MocmVzdWx0LCBjaGVja3MsIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bkNoZWNrcyhyZXN1bHQsIGNoZWNrcywgY3R4KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gTGF6eSBpbml0aWFsaXplIH5zdGFuZGFyZCB0byBhdm9pZCBjcmVhdGluZyBvYmplY3RzIGZvciBldmVyeSBzY2hlbWFcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdCwgXCJ+c3RhbmRhcmRcIiwgKCkgPT4gKHtcbiAgICAgICAgdmFsaWRhdGU6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByID0gc2FmZVBhcnNlKGluc3QsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5zdWNjZXNzID8geyB2YWx1ZTogci5kYXRhIH0gOiB7IGlzc3Vlczogci5lcnJvcj8uaXNzdWVzIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoXykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzYWZlUGFyc2VBc3luYyhpbnN0LCB2YWx1ZSkudGhlbigocikgPT4gKHIuc3VjY2VzcyA/IHsgdmFsdWU6IHIuZGF0YSB9IDogeyBpc3N1ZXM6IHIuZXJyb3I/Lmlzc3VlcyB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHZlbmRvcjogXCJ6b2RcIixcbiAgICAgICAgdmVyc2lvbjogMSxcbiAgICB9KSk7XG59KTtcbmV4cG9ydCB7IGNsb25lIH0gZnJvbSBcIi4vdXRpbC5qc1wiO1xuZXhwb3J0IGNvbnN0ICRab2RTdHJpbmcgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFN0cmluZ1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXR0ZXJuID0gWy4uLihpbnN0Py5fem9kLmJhZz8ucGF0dGVybnMgPz8gW10pXS5wb3AoKSA/PyByZWdleGVzLnN0cmluZyhpbnN0Ll96b2QuYmFnKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgXykgPT4ge1xuICAgICAgICBpZiAoZGVmLmNvZXJjZSlcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IFN0cmluZyhwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfKSB7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLnZhbHVlID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RTdHJpbmdGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFN0cmluZ0Zvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gY2hlY2sgaW5pdGlhbGl6YXRpb24gbXVzdCBjb21lIGZpcnN0XG4gICAgY2hlY2tzLiRab2RDaGVja1N0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgJFpvZFN0cmluZy5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kR1VJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kR1VJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5ndWlkKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RVVUlEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RVVUlEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBpZiAoZGVmLnZlcnNpb24pIHtcbiAgICAgICAgY29uc3QgdmVyc2lvbk1hcCA9IHtcbiAgICAgICAgICAgIHYxOiAxLFxuICAgICAgICAgICAgdjI6IDIsXG4gICAgICAgICAgICB2MzogMyxcbiAgICAgICAgICAgIHY0OiA0LFxuICAgICAgICAgICAgdjU6IDUsXG4gICAgICAgICAgICB2NjogNixcbiAgICAgICAgICAgIHY3OiA3LFxuICAgICAgICAgICAgdjg6IDgsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHYgPSB2ZXJzaW9uTWFwW2RlZi52ZXJzaW9uXTtcbiAgICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBVVUlEIHZlcnNpb246IFwiJHtkZWYudmVyc2lvbn1cImApO1xuICAgICAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLnV1aWQodikpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMudXVpZCgpKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RFbWFpbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kRW1haWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuZW1haWwpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFVSTCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVVJMXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gVHJpbSB3aGl0ZXNwYWNlIGZyb20gaW5wdXRcbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWQgPSBwYXlsb2FkLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgIC8vIFdoZW4gbm9ybWFsaXplIGlzIG9mZiwgcmVxdWlyZSA6Ly8gZm9yIGh0dHAvaHR0cHMgVVJMc1xuICAgICAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBzdHJpbmdzIGxpa2UgXCJodHRwOmV4YW1wbGUuY29tXCIgb3IgXCJodHRwczovcGF0aFwiIGZyb20gYmVpbmcgc2lsZW50bHkgYWNjZXB0ZWRcbiAgICAgICAgICAgIGlmICghZGVmLm5vcm1hbGl6ZSAmJiBkZWYucHJvdG9jb2w/LnNvdXJjZSA9PT0gcmVnZXhlcy5odHRwUHJvdG9jb2wuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHRyaW1tZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcInVybFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogXCJJbnZhbGlkIFVSTCBmb3JtYXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwodHJpbW1lZCk7XG4gICAgICAgICAgICBpZiAoZGVmLmhvc3RuYW1lKSB7XG4gICAgICAgICAgICAgICAgZGVmLmhvc3RuYW1lLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKCFkZWYuaG9zdG5hbWUudGVzdCh1cmwuaG9zdG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcInVybFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogXCJJbnZhbGlkIGhvc3RuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBkZWYuaG9zdG5hbWUuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWYucHJvdG9jb2wpIHtcbiAgICAgICAgICAgICAgICBkZWYucHJvdG9jb2wubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoIWRlZi5wcm90b2NvbC50ZXN0KHVybC5wcm90b2NvbC5lbmRzV2l0aChcIjpcIikgPyB1cmwucHJvdG9jb2wuc2xpY2UoMCwgLTEpIDogdXJsLnByb3RvY29sKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCJ1cmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdGU6IFwiSW52YWxpZCBwcm90b2NvbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogZGVmLnByb3RvY29sLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZXQgdGhlIG91dHB1dCB2YWx1ZSBiYXNlZCBvbiBub3JtYWxpemUgZmxhZ1xuICAgICAgICAgICAgaWYgKGRlZi5ub3JtYWxpemUpIHtcbiAgICAgICAgICAgICAgICAvLyBVc2Ugbm9ybWFsaXplZCBVUkxcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gdXJsLmhyZWY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBQcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgaW5wdXQgKHRyaW1tZWQpXG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHRyaW1tZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IFwidXJsXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RFbW9qaSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kRW1vamlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuZW1vamkoKSk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTmFub0lEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROYW5vSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMubmFub2lkKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuLyoqXG4gKiBAZGVwcmVjYXRlZCBDVUlEIHYxIGlzIGRlcHJlY2F0ZWQgYnkgaXRzIGF1dGhvcnMgZHVlIHRvIGluZm9ybWF0aW9uIGxlYWthZ2VcbiAqICh0aW1lc3RhbXBzIGVtYmVkZGVkIGluIHRoZSBpZCkuIFVzZSB7QGxpbmsgJFpvZENVSUQyfSBpbnN0ZWFkLlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXJhbGxlbGRyaXZlL2N1aWQuXG4gKi9cbmV4cG9ydCBjb25zdCAkWm9kQ1VJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ1VJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5jdWlkKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDVUlEMiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ1VJRDJcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuY3VpZDIpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFVMSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFVMSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMudWxpZCk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kWElEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RYSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMueGlkKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RLU1VJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kS1NVSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMua3N1aWQpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZElTT0RhdGVUaW1lID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RJU09EYXRlVGltZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5kYXRldGltZShkZWYpKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RJU09EYXRlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RJU09EYXRlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmRhdGUpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZElTT1RpbWUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZElTT1RpbWVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMudGltZShkZWYpKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RJU09EdXJhdGlvbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kSVNPRHVyYXRpb25cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuZHVyYXRpb24pO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZElQdjQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZElQdjRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuaXB2NCk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLmJhZy5mb3JtYXQgPSBgaXB2NGA7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kSVB2NiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kSVB2NlwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5pcHY2KTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuYmFnLmZvcm1hdCA9IGBpcHY2YDtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgbmV3IFVSTChgaHR0cDovL1ske3BheWxvYWQudmFsdWV9XWApO1xuICAgICAgICAgICAgLy8gcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiaXB2NlwiLFxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTUFDID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RNQUNcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMubWFjKGRlZi5kZWxpbWl0ZXIpKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuYmFnLmZvcm1hdCA9IGBtYWNgO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENJRFJ2NCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ0lEUnY0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmNpZHJ2NCk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ0lEUnY2ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDSURSdjZcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuY2lkcnY2KTsgLy8gbm90IHVzZWQgZm9yIHZhbGlkYXRpb25cbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHBheWxvYWQudmFsdWUuc3BsaXQoXCIvXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMilcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIGNvbnN0IFthZGRyZXNzLCBwcmVmaXhdID0gcGFydHM7XG4gICAgICAgICAgICBpZiAoIXByZWZpeClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeE51bSA9IE51bWJlcihwcmVmaXgpO1xuICAgICAgICAgICAgaWYgKGAke3ByZWZpeE51bX1gICE9PSBwcmVmaXgpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICBpZiAocHJlZml4TnVtIDwgMCB8fCBwcmVmaXhOdW0gPiAxMjgpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBuZXcgVVJMKGBodHRwOi8vWyR7YWRkcmVzc31dYCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJjaWRydjZcIixcbiAgICAgICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gICBab2RCYXNlNjQgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkQmFzZTY0KGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gXCJcIilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgLy8gYXRvYiBpZ25vcmVzIHdoaXRlc3BhY2UsIHNvIHJlamVjdCBpdCB1cCBmcm9udC5cbiAgICBpZiAoL1xccy8udGVzdChkYXRhKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChkYXRhLmxlbmd0aCAlIDQgIT09IDApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGF0b2IoZGF0YSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgJFpvZEJhc2U2NCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQmFzZTY0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmJhc2U2NCk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLmJhZy5jb250ZW50RW5jb2RpbmcgPSBcImJhc2U2NFwiO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGlmIChpc1ZhbGlkQmFzZTY0KHBheWxvYWQudmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgIGZvcm1hdDogXCJiYXNlNjRcIixcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gICBab2RCYXNlNjQgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkQmFzZTY0VVJMKGRhdGEpIHtcbiAgICBpZiAoIXJlZ2V4ZXMuYmFzZTY0dXJsLnRlc3QoZGF0YSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBiYXNlNjQgPSBkYXRhLnJlcGxhY2UoL1stX10vZywgKGMpID0+IChjID09PSBcIi1cIiA/IFwiK1wiIDogXCIvXCIpKTtcbiAgICBjb25zdCBwYWRkZWQgPSBiYXNlNjQucGFkRW5kKE1hdGguY2VpbChiYXNlNjQubGVuZ3RoIC8gNCkgKiA0LCBcIj1cIik7XG4gICAgcmV0dXJuIGlzVmFsaWRCYXNlNjQocGFkZGVkKTtcbn1cbmV4cG9ydCBjb25zdCAkWm9kQmFzZTY0VVJMID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RCYXNlNjRVUkxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuYmFzZTY0dXJsKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuYmFnLmNvbnRlbnRFbmNvZGluZyA9IFwiYmFzZTY0dXJsXCI7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKGlzVmFsaWRCYXNlNjRVUkwocGF5bG9hZC52YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImJhc2U2NHVybFwiLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kRTE2NCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kRTE2NFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5lMTY0KTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vICAgWm9kSldUICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEpXVCh0b2tlbiwgYWxnb3JpdGhtID0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRva2Vuc1BhcnRzID0gdG9rZW4uc3BsaXQoXCIuXCIpO1xuICAgICAgICBpZiAodG9rZW5zUGFydHMubGVuZ3RoICE9PSAzKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBbaGVhZGVyXSA9IHRva2Vuc1BhcnRzO1xuICAgICAgICBpZiAoIWhlYWRlcilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBwYXJzZWRIZWFkZXIgPSBKU09OLnBhcnNlKGF0b2IoaGVhZGVyKSk7XG4gICAgICAgIGlmIChcInR5cFwiIGluIHBhcnNlZEhlYWRlciAmJiBwYXJzZWRIZWFkZXI/LnR5cCAhPT0gXCJKV1RcIilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKCFwYXJzZWRIZWFkZXIuYWxnKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoYWxnb3JpdGhtICYmICghKFwiYWxnXCIgaW4gcGFyc2VkSGVhZGVyKSB8fCBwYXJzZWRIZWFkZXIuYWxnICE9PSBhbGdvcml0aG0pKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0ICRab2RKV1QgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEpXVFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKGlzVmFsaWRKV1QocGF5bG9hZC52YWx1ZSwgZGVmLmFsZykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImp3dFwiLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ3VzdG9tU3RyaW5nRm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDdXN0b21TdHJpbmdGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGlmIChkZWYuZm4ocGF5bG9hZC52YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgZm9ybWF0OiBkZWYuZm9ybWF0LFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTnVtYmVyID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROdW1iZXJcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGF0dGVybiA9IGluc3QuX3pvZC5iYWcucGF0dGVybiA/PyByZWdleGVzLm51bWJlcjtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAoZGVmLmNvZXJjZSlcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IE51bWJlcihwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfKSB7IH1cbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSBcIm51bWJlclwiICYmICFOdW1iZXIuaXNOYU4oaW5wdXQpICYmIE51bWJlci5pc0Zpbml0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlY2VpdmVkID0gdHlwZW9mIGlucHV0ID09PSBcIm51bWJlclwiXG4gICAgICAgICAgICA/IE51bWJlci5pc05hTihpbnB1dClcbiAgICAgICAgICAgICAgICA/IFwiTmFOXCJcbiAgICAgICAgICAgICAgICA6ICFOdW1iZXIuaXNGaW5pdGUoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgID8gXCJJbmZpbml0eVwiXG4gICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJudW1iZXJcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAuLi4ocmVjZWl2ZWQgPyB7IHJlY2VpdmVkIH0gOiB7fSksXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE51bWJlckZvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kTnVtYmVyRm9ybWF0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjaGVja3MuJFpvZENoZWNrTnVtYmVyRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICAkWm9kTnVtYmVyLmluaXQoaW5zdCwgZGVmKTsgLy8gbm8gZm9ybWF0IGNoZWNrc1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEJvb2xlYW4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEJvb2xlYW5cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGF0dGVybiA9IHJlZ2V4ZXMuYm9vbGVhbjtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAoZGVmLmNvZXJjZSlcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IEJvb2xlYW4ocGF5bG9hZC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoXykgeyB9XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJib29sZWFuXCIpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJib29sZWFuXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RCaWdJbnQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEJpZ0ludFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXR0ZXJuID0gcmVnZXhlcy5iaWdpbnQ7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgaWYgKGRlZi5jb2VyY2UpXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBCaWdJbnQocGF5bG9hZC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoXykgeyB9XG4gICAgICAgIGlmICh0eXBlb2YgcGF5bG9hZC52YWx1ZSA9PT0gXCJiaWdpbnRcIilcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcImJpZ2ludFwiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQmlnSW50Rm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RCaWdJbnRGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNoZWNrcy4kWm9kQ2hlY2tCaWdJbnRGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgICRab2RCaWdJbnQuaW5pdChpbnN0LCBkZWYpOyAvLyBubyBmb3JtYXQgY2hlY2tzXG59KTtcbmV4cG9ydCBjb25zdCAkWm9kU3ltYm9sID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RTeW1ib2xcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09IFwic3ltYm9sXCIpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJzeW1ib2xcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFVuZGVmaW5lZCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVW5kZWZpbmVkXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhdHRlcm4gPSByZWdleGVzLnVuZGVmaW5lZDtcbiAgICBpbnN0Ll96b2QudmFsdWVzID0gbmV3IFNldChbdW5kZWZpbmVkXSk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwidW5kZWZpbmVkXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2ROdWxsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROdWxsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhdHRlcm4gPSByZWdleGVzLm51bGw7XG4gICAgaW5zdC5fem9kLnZhbHVlcyA9IG5ldyBTZXQoW251bGxdKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcIm51bGxcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEFueSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQW55XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQpID0+IHBheWxvYWQ7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kVW5rbm93biA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVW5rbm93blwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkKSA9PiBwYXlsb2FkO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE5ldmVyID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROZXZlclwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibmV2ZXJcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFZvaWQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFZvaWRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJ2b2lkXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2REYXRlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2REYXRlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgaWYgKGRlZi5jb2VyY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IG5ldyBEYXRlKHBheWxvYWQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF9lcnIpIHsgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3QgaXNEYXRlID0gaW5wdXQgaW5zdGFuY2VvZiBEYXRlO1xuICAgICAgICBjb25zdCBpc1ZhbGlkRGF0ZSA9IGlzRGF0ZSAmJiAhTnVtYmVyLmlzTmFOKGlucHV0LmdldFRpbWUoKSk7XG4gICAgICAgIGlmIChpc1ZhbGlkRGF0ZSlcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcImRhdGVcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIC4uLihpc0RhdGUgPyB7IHJlY2VpdmVkOiBcIkludmFsaWQgRGF0ZVwiIH0gOiB7fSksXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlQXJyYXlSZXN1bHQocmVzdWx0LCBmaW5hbCwgaW5kZXgpIHtcbiAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoaW5kZXgsIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICB9XG4gICAgZmluYWwudmFsdWVbaW5kZXhdID0gcmVzdWx0LnZhbHVlO1xufVxuZXhwb3J0IGNvbnN0ICRab2RBcnJheSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQXJyYXlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwiYXJyYXlcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBBcnJheShpbnB1dC5sZW5ndGgpO1xuICAgICAgICBjb25zdCBwcm9tcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gaW5wdXRbaV07XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYuZWxlbWVudC5fem9kLnJ1bih7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0sXG4gICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgIH0sIGN0eCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHByb21zLnB1c2gocmVzdWx0LnRoZW4oKHJlc3VsdCkgPT4gaGFuZGxlQXJyYXlSZXN1bHQocmVzdWx0LCBwYXlsb2FkLCBpKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlQXJyYXlSZXN1bHQocmVzdWx0LCBwYXlsb2FkLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbXMpLnRoZW4oKCkgPT4gcGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7IC8vaGFuZGxlQXJyYXlSZXN1bHRzQXN5bmMocGFyc2VSZXN1bHRzLCBmaW5hbCk7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlUHJvcGVydHlSZXN1bHQocmVzdWx0LCBmaW5hbCwga2V5LCBpbnB1dCwgaXNPcHRpb25hbEluLCBpc09wdGlvbmFsT3V0KSB7XG4gICAgY29uc3QgaXNQcmVzZW50ID0ga2V5IGluIGlucHV0O1xuICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAvLyBGb3Igb3B0aW9uYWwtaW4vb3V0IHNjaGVtYXMsIGlnbm9yZSBlcnJvcnMgb24gYWJzZW50IGtleXMuXG4gICAgICAgIGlmIChpc09wdGlvbmFsSW4gJiYgaXNPcHRpb25hbE91dCAmJiAhaXNQcmVzZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoa2V5LCByZXN1bHQuaXNzdWVzKSk7XG4gICAgfVxuICAgIGlmICghaXNQcmVzZW50ICYmICFpc09wdGlvbmFsSW4pIHtcbiAgICAgICAgaWYgKCFyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibm9ub3B0aW9uYWxcIixcbiAgICAgICAgICAgICAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBhdGg6IFtrZXldLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocmVzdWx0LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGlzUHJlc2VudCkge1xuICAgICAgICAgICAgZmluYWwudmFsdWVba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmluYWwudmFsdWVba2V5XSA9IHJlc3VsdC52YWx1ZTtcbiAgICB9XG59XG5mdW5jdGlvbiBub3JtYWxpemVEZWYoZGVmKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRlZi5zaGFwZSk7XG4gICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcbiAgICAgICAgaWYgKCFkZWYuc2hhcGU/LltrXT8uX3pvZD8udHJhaXRzPy5oYXMoXCIkWm9kVHlwZVwiKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGVsZW1lbnQgYXQga2V5IFwiJHtrfVwiOiBleHBlY3RlZCBhIFpvZCBzY2hlbWFgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBva2V5cyA9IHV0aWwub3B0aW9uYWxLZXlzKGRlZi5zaGFwZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVmLFxuICAgICAgICBrZXlzLFxuICAgICAgICBrZXlTZXQ6IG5ldyBTZXQoa2V5cyksXG4gICAgICAgIG51bUtleXM6IGtleXMubGVuZ3RoLFxuICAgICAgICBvcHRpb25hbEtleXM6IG5ldyBTZXQob2tleXMpLFxuICAgIH07XG59XG5mdW5jdGlvbiBoYW5kbGVDYXRjaGFsbChwcm9tcywgaW5wdXQsIHBheWxvYWQsIGN0eCwgZGVmLCBpbnN0KSB7XG4gICAgY29uc3QgdW5yZWNvZ25pemVkID0gW107XG4gICAgY29uc3Qga2V5U2V0ID0gZGVmLmtleVNldDtcbiAgICBjb25zdCBfY2F0Y2hhbGwgPSBkZWYuY2F0Y2hhbGwuX3pvZDtcbiAgICBjb25zdCB0ID0gX2NhdGNoYWxsLmRlZi50eXBlO1xuICAgIGNvbnN0IGlzT3B0aW9uYWxJbiA9IF9jYXRjaGFsbC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiO1xuICAgIGNvbnN0IGlzT3B0aW9uYWxPdXQgPSBfY2F0Y2hhbGwub3B0b3V0ID09PSBcIm9wdGlvbmFsXCI7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgLy8gc2tpcCBfX3Byb3RvX18gc28gaXQgY2FuJ3QgcmVwbGFjZSB0aGUgcmVzdWx0IHByb3RvdHlwZSB2aWEgdGhlXG4gICAgICAgIC8vIGFzc2lnbm1lbnQgc2V0dGVyIG9uIHRoZSBwbGFpbiB7fSB3ZSBidWlsZCBpbnRvXG4gICAgICAgIGlmIChrZXkgPT09IFwiX19wcm90b19fXCIpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKGtleVNldC5oYXMoa2V5KSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAodCA9PT0gXCJuZXZlclwiKSB7XG4gICAgICAgICAgICB1bnJlY29nbml6ZWQucHVzaChrZXkpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgciA9IF9jYXRjaGFsbC5ydW4oeyB2YWx1ZTogaW5wdXRba2V5XSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICBpZiAociBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHByb21zLnB1c2goci50aGVuKChyKSA9PiBoYW5kbGVQcm9wZXJ0eVJlc3VsdChyLCBwYXlsb2FkLCBrZXksIGlucHV0LCBpc09wdGlvbmFsSW4sIGlzT3B0aW9uYWxPdXQpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoYW5kbGVQcm9wZXJ0eVJlc3VsdChyLCBwYXlsb2FkLCBrZXksIGlucHV0LCBpc09wdGlvbmFsSW4sIGlzT3B0aW9uYWxPdXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh1bnJlY29nbml6ZWQubGVuZ3RoKSB7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJ1bnJlY29nbml6ZWRfa2V5c1wiLFxuICAgICAgICAgICAga2V5czogdW5yZWNvZ25pemVkLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFwcm9tcy5sZW5ndGgpXG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tcykudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0ICRab2RPYmplY3QgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE9iamVjdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gcmVxdWlyZXMgY2FzdCBiZWNhdXNlIHRlY2huaWNhbGx5ICRab2RPYmplY3QgZG9lc24ndCBleHRlbmRcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgLy8gY29uc3Qgc2ggPSBkZWYuc2hhcGU7XG4gICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZGVmLCBcInNoYXBlXCIpO1xuICAgIGlmICghZGVzYz8uZ2V0KSB7XG4gICAgICAgIGNvbnN0IHNoID0gZGVmLnNoYXBlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVmLCBcInNoYXBlXCIsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1NoID0geyAuLi5zaCB9O1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZWYsIFwic2hhcGVcIiwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbmV3U2gsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld1NoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IF9ub3JtYWxpemVkID0gdXRpbC5jYWNoZWQoKCkgPT4gbm9ybWFsaXplRGVmKGRlZikpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicHJvcFZhbHVlc1wiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gZGVmLnNoYXBlO1xuICAgICAgICBjb25zdCBwcm9wVmFsdWVzID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNoYXBlKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IHNoYXBlW2tleV0uX3pvZDtcbiAgICAgICAgICAgIGlmIChmaWVsZC52YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBwcm9wVmFsdWVzW2tleV0gPz8gKHByb3BWYWx1ZXNba2V5XSA9IG5ldyBTZXQoKSk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2IG9mIGZpZWxkLnZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHVlc1trZXldLmFkZCh2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcFZhbHVlcztcbiAgICB9KTtcbiAgICBjb25zdCBpc09iamVjdCA9IHV0aWwuaXNPYmplY3Q7XG4gICAgY29uc3QgY2F0Y2hhbGwgPSBkZWYuY2F0Y2hhbGw7XG4gICAgbGV0IHZhbHVlO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgdmFsdWUgPz8gKHZhbHVlID0gX25vcm1hbGl6ZWQudmFsdWUpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghaXNPYmplY3QoaW5wdXQpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSB7fTtcbiAgICAgICAgY29uc3QgcHJvbXMgPSBbXTtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB2YWx1ZS5zaGFwZTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdmFsdWUua2V5cykge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBzaGFwZVtrZXldO1xuICAgICAgICAgICAgY29uc3QgaXNPcHRpb25hbEluID0gZWwuX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiO1xuICAgICAgICAgICAgY29uc3QgaXNPcHRpb25hbE91dCA9IGVsLl96b2Qub3B0b3V0ID09PSBcIm9wdGlvbmFsXCI7XG4gICAgICAgICAgICBjb25zdCByID0gZWwuX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXRba2V5XSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgaWYgKHIgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcHJvbXMucHVzaChyLnRoZW4oKHIpID0+IGhhbmRsZVByb3BlcnR5UmVzdWx0KHIsIHBheWxvYWQsIGtleSwgaW5wdXQsIGlzT3B0aW9uYWxJbiwgaXNPcHRpb25hbE91dCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhbmRsZVByb3BlcnR5UmVzdWx0KHIsIHBheWxvYWQsIGtleSwgaW5wdXQsIGlzT3B0aW9uYWxJbiwgaXNPcHRpb25hbE91dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjYXRjaGFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21zLmxlbmd0aCA/IFByb21pc2UuYWxsKHByb21zKS50aGVuKCgpID0+IHBheWxvYWQpIDogcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlQ2F0Y2hhbGwocHJvbXMsIGlucHV0LCBwYXlsb2FkLCBjdHgsIF9ub3JtYWxpemVkLnZhbHVlLCBpbnN0KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE9iamVjdEpJVCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kT2JqZWN0SklUXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyByZXF1aXJlcyBjYXN0IGJlY2F1c2UgdGVjaG5pY2FsbHkgJFpvZE9iamVjdCBkb2Vzbid0IGV4dGVuZFxuICAgICRab2RPYmplY3QuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvbnN0IHN1cGVyUGFyc2UgPSBpbnN0Ll96b2QucGFyc2U7XG4gICAgY29uc3QgX25vcm1hbGl6ZWQgPSB1dGlsLmNhY2hlZCgoKSA9PiBub3JtYWxpemVEZWYoZGVmKSk7XG4gICAgY29uc3QgZ2VuZXJhdGVGYXN0cGFzcyA9IChzaGFwZSkgPT4ge1xuICAgICAgICBjb25zdCBkb2MgPSBuZXcgRG9jKFtcInNoYXBlXCIsIFwicGF5bG9hZFwiLCBcImN0eFwiXSk7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBfbm9ybWFsaXplZC52YWx1ZTtcbiAgICAgICAgY29uc3QgcGFyc2VTdHIgPSAoa2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrID0gdXRpbC5lc2Moa2V5KTtcbiAgICAgICAgICAgIHJldHVybiBgc2hhcGVbJHtrfV0uX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXRbJHtrfV0sIGlzc3VlczogW10gfSwgY3R4KWA7XG4gICAgICAgIH07XG4gICAgICAgIGRvYy53cml0ZShgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO2ApO1xuICAgICAgICBjb25zdCBpZHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIG5vcm1hbGl6ZWQua2V5cykge1xuICAgICAgICAgICAgaWRzW2tleV0gPSBga2V5XyR7Y291bnRlcisrfWA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQTogcHJlc2VydmUga2V5IG9yZGVyIHtcbiAgICAgICAgZG9jLndyaXRlKGBjb25zdCBuZXdSZXN1bHQgPSB7fTtgKTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygbm9ybWFsaXplZC5rZXlzKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGlkc1trZXldO1xuICAgICAgICAgICAgY29uc3QgayA9IHV0aWwuZXNjKGtleSk7XG4gICAgICAgICAgICBjb25zdCBzY2hlbWEgPSBzaGFwZVtrZXldO1xuICAgICAgICAgICAgY29uc3QgaXNPcHRpb25hbEluID0gc2NoZW1hPy5fem9kPy5vcHRpbiA9PT0gXCJvcHRpb25hbFwiO1xuICAgICAgICAgICAgY29uc3QgaXNPcHRpb25hbE91dCA9IHNjaGVtYT8uX3pvZD8ub3B0b3V0ID09PSBcIm9wdGlvbmFsXCI7XG4gICAgICAgICAgICBkb2Mud3JpdGUoYGNvbnN0ICR7aWR9ID0gJHtwYXJzZVN0cihrZXkpfTtgKTtcbiAgICAgICAgICAgIGlmIChpc09wdGlvbmFsSW4gJiYgaXNPcHRpb25hbE91dCkge1xuICAgICAgICAgICAgICAgIC8vIEZvciBvcHRpb25hbC1pbi9vdXQgc2NoZW1hcywgaWdub3JlIGVycm9ycyBvbiBhYnNlbnQga2V5c1xuICAgICAgICAgICAgICAgIGRvYy53cml0ZShgXG4gICAgICAgIGlmICgke2lkfS5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCR7a30gaW4gaW5wdXQpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzID0gcGF5bG9hZC5pc3N1ZXMuY29uY2F0KCR7aWR9Lmlzc3Vlcy5tYXAoaXNzID0+ICh7XG4gICAgICAgICAgICAgIC4uLmlzcyxcbiAgICAgICAgICAgICAgcGF0aDogaXNzLnBhdGggPyBbJHtrfSwgLi4uaXNzLnBhdGhdIDogWyR7a31dXG4gICAgICAgICAgICB9KSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCR7aWR9LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoJHtrfSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgbmV3UmVzdWx0WyR7a31dID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXN1bHRbJHtrfV0gPSAke2lkfS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIGApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWlzT3B0aW9uYWxJbikge1xuICAgICAgICAgICAgICAgIGRvYy53cml0ZShgXG4gICAgICAgIGNvbnN0ICR7aWR9X3ByZXNlbnQgPSAke2t9IGluIGlucHV0O1xuICAgICAgICBpZiAoJHtpZH0uaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgIHBheWxvYWQuaXNzdWVzID0gcGF5bG9hZC5pc3N1ZXMuY29uY2F0KCR7aWR9Lmlzc3Vlcy5tYXAoaXNzID0+ICh7XG4gICAgICAgICAgICAuLi5pc3MsXG4gICAgICAgICAgICBwYXRoOiBpc3MucGF0aCA/IFske2t9LCAuLi5pc3MucGF0aF0gOiBbJHtrfV1cbiAgICAgICAgICB9KSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghJHtpZH1fcHJlc2VudCAmJiAhJHtpZH0uaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcIm5vbm9wdGlvbmFsXCIsXG4gICAgICAgICAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcGF0aDogWyR7a31dXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJHtpZH1fcHJlc2VudCkge1xuICAgICAgICAgIGlmICgke2lkfS52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXdSZXN1bHRbJHtrfV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld1Jlc3VsdFske2t9XSA9ICR7aWR9LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICBgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvYy53cml0ZShgXG4gICAgICAgIGlmICgke2lkfS5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcGF5bG9hZC5pc3N1ZXMgPSBwYXlsb2FkLmlzc3Vlcy5jb25jYXQoJHtpZH0uaXNzdWVzLm1hcChpc3MgPT4gKHtcbiAgICAgICAgICAgIC4uLmlzcyxcbiAgICAgICAgICAgIHBhdGg6IGlzcy5wYXRoID8gWyR7a30sIC4uLmlzcy5wYXRoXSA6IFske2t9XVxuICAgICAgICAgIH0pKSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICgke2lkfS52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKCR7a30gaW4gaW5wdXQpIHtcbiAgICAgICAgICAgIG5ld1Jlc3VsdFske2t9XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3UmVzdWx0WyR7a31dID0gJHtpZH0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICBgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkb2Mud3JpdGUoYHBheWxvYWQudmFsdWUgPSBuZXdSZXN1bHQ7YCk7XG4gICAgICAgIGRvYy53cml0ZShgcmV0dXJuIHBheWxvYWQ7YCk7XG4gICAgICAgIGNvbnN0IGZuID0gZG9jLmNvbXBpbGUoKTtcbiAgICAgICAgcmV0dXJuIChwYXlsb2FkLCBjdHgpID0+IGZuKHNoYXBlLCBwYXlsb2FkLCBjdHgpO1xuICAgIH07XG4gICAgbGV0IGZhc3RwYXNzO1xuICAgIGNvbnN0IGlzT2JqZWN0ID0gdXRpbC5pc09iamVjdDtcbiAgICBjb25zdCBqaXQgPSAhY29yZS5nbG9iYWxDb25maWcuaml0bGVzcztcbiAgICBjb25zdCBhbGxvd3NFdmFsID0gdXRpbC5hbGxvd3NFdmFsO1xuICAgIGNvbnN0IGZhc3RFbmFibGVkID0gaml0ICYmIGFsbG93c0V2YWwudmFsdWU7IC8vICYmICFkZWYuY2F0Y2hhbGw7XG4gICAgY29uc3QgY2F0Y2hhbGwgPSBkZWYuY2F0Y2hhbGw7XG4gICAgbGV0IHZhbHVlO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgdmFsdWUgPz8gKHZhbHVlID0gX25vcm1hbGl6ZWQudmFsdWUpO1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghaXNPYmplY3QoaW5wdXQpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChqaXQgJiYgZmFzdEVuYWJsZWQgJiYgY3R4Py5hc3luYyA9PT0gZmFsc2UgJiYgY3R4LmppdGxlc3MgIT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIGFsd2F5cyBzeW5jaHJvbm91c1xuICAgICAgICAgICAgaWYgKCFmYXN0cGFzcylcbiAgICAgICAgICAgICAgICBmYXN0cGFzcyA9IGdlbmVyYXRlRmFzdHBhc3MoZGVmLnNoYXBlKTtcbiAgICAgICAgICAgIHBheWxvYWQgPSBmYXN0cGFzcyhwYXlsb2FkLCBjdHgpO1xuICAgICAgICAgICAgaWYgKCFjYXRjaGFsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVDYXRjaGFsbChbXSwgaW5wdXQsIHBheWxvYWQsIGN0eCwgdmFsdWUsIGluc3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlclBhcnNlKHBheWxvYWQsIGN0eCk7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlVW5pb25SZXN1bHRzKHJlc3VsdHMsIGZpbmFsLCBpbnN0LCBjdHgpIHtcbiAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XG4gICAgICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZmluYWwudmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gZmluYWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgbm9uYWJvcnRlZCA9IHJlc3VsdHMuZmlsdGVyKChyKSA9PiAhdXRpbC5hYm9ydGVkKHIpKTtcbiAgICBpZiAobm9uYWJvcnRlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZmluYWwudmFsdWUgPSBub25hYm9ydGVkWzBdLnZhbHVlO1xuICAgICAgICByZXR1cm4gbm9uYWJvcnRlZFswXTtcbiAgICB9XG4gICAgZmluYWwuaXNzdWVzLnB1c2goe1xuICAgICAgICBjb2RlOiBcImludmFsaWRfdW5pb25cIixcbiAgICAgICAgaW5wdXQ6IGZpbmFsLnZhbHVlLFxuICAgICAgICBpbnN0LFxuICAgICAgICBlcnJvcnM6IHJlc3VsdHMubWFwKChyZXN1bHQpID0+IHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpKSxcbiAgICB9KTtcbiAgICByZXR1cm4gZmluYWw7XG59XG5leHBvcnQgY29uc3QgJFpvZFVuaW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RVbmlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwib3B0aW5cIiwgKCkgPT4gZGVmLm9wdGlvbnMuc29tZSgobykgPT4gby5fem9kLm9wdGluID09PSBcIm9wdGlvbmFsXCIpID8gXCJvcHRpb25hbFwiIDogdW5kZWZpbmVkKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdG91dFwiLCAoKSA9PiBkZWYub3B0aW9ucy5zb21lKChvKSA9PiBvLl96b2Qub3B0b3V0ID09PSBcIm9wdGlvbmFsXCIpID8gXCJvcHRpb25hbFwiIDogdW5kZWZpbmVkKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInZhbHVlc1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChkZWYub3B0aW9ucy5ldmVyeSgobykgPT4gby5fem9kLnZhbHVlcykpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2V0KGRlZi5vcHRpb25zLmZsYXRNYXAoKG9wdGlvbikgPT4gQXJyYXkuZnJvbShvcHRpb24uX3pvZC52YWx1ZXMpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInBhdHRlcm5cIiwgKCkgPT4ge1xuICAgICAgICBpZiAoZGVmLm9wdGlvbnMuZXZlcnkoKG8pID0+IG8uX3pvZC5wYXR0ZXJuKSkge1xuICAgICAgICAgICAgY29uc3QgcGF0dGVybnMgPSBkZWYub3B0aW9ucy5tYXAoKG8pID0+IG8uX3pvZC5wYXR0ZXJuKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGBeKCR7cGF0dGVybnMubWFwKChwKSA9PiB1dGlsLmNsZWFuUmVnZXgocC5zb3VyY2UpKS5qb2luKFwifFwiKX0pJGApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgY29uc3QgZmlyc3QgPSBkZWYub3B0aW9ucy5sZW5ndGggPT09IDEgPyBkZWYub3B0aW9uc1swXS5fem9kLnJ1biA6IG51bGw7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBmaXJzdChwYXlsb2FkLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhc3luYyA9IGZhbHNlO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGRlZi5vcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBvcHRpb24uX3pvZC5ydW4oe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICB9LCBjdHgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBhc3luYyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhc3luYylcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVVbmlvblJlc3VsdHMocmVzdWx0cywgcGF5bG9hZCwgaW5zdCwgY3R4KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVVbmlvblJlc3VsdHMocmVzdWx0cywgcGF5bG9hZCwgaW5zdCwgY3R4KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlRXhjbHVzaXZlVW5pb25SZXN1bHRzKHJlc3VsdHMsIGZpbmFsLCBpbnN0LCBjdHgpIHtcbiAgICBjb25zdCBzdWNjZXNzZXMgPSByZXN1bHRzLmZpbHRlcigocikgPT4gci5pc3N1ZXMubGVuZ3RoID09PSAwKTtcbiAgICBpZiAoc3VjY2Vzc2VzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBmaW5hbC52YWx1ZSA9IHN1Y2Nlc3Nlc1swXS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGZpbmFsO1xuICAgIH1cbiAgICBpZiAoc3VjY2Vzc2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBObyBtYXRjaGVzIC0gc2FtZSBhcyByZWd1bGFyIHVuaW9uXG4gICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF91bmlvblwiLFxuICAgICAgICAgICAgaW5wdXQ6IGZpbmFsLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGVycm9yczogcmVzdWx0cy5tYXAoKHJlc3VsdCkgPT4gcmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSkpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIE11bHRpcGxlIG1hdGNoZXMgLSBleGNsdXNpdmUgdW5pb24gZmFpbHVyZVxuICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdW5pb25cIixcbiAgICAgICAgICAgIGlucHV0OiBmaW5hbC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmaW5hbDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kWG9yID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RYb3JcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RVbmlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgZGVmLmluY2x1c2l2ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZpcnN0ID0gZGVmLm9wdGlvbnMubGVuZ3RoID09PSAxID8gZGVmLm9wdGlvbnNbMF0uX3pvZC5ydW4gOiBudWxsO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmlyc3QocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXN5bmMgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBkZWYub3B0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gb3B0aW9uLl96b2QucnVuKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgfSwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgYXN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhc3luYylcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVFeGNsdXNpdmVVbmlvblJlc3VsdHMocmVzdWx0cywgcGF5bG9hZCwgaW5zdCwgY3R4KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdHMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVFeGNsdXNpdmVVbmlvblJlc3VsdHMocmVzdWx0cywgcGF5bG9hZCwgaW5zdCwgY3R4KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2REaXNjcmltaW5hdGVkVW5pb24gPSBcbi8qQF9fUFVSRV9fKi9cbmNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZERpc2NyaW1pbmF0ZWRVbmlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLmluY2x1c2l2ZSA9IGZhbHNlO1xuICAgICRab2RVbmlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgX3N1cGVyID0gaW5zdC5fem9kLnBhcnNlO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicHJvcFZhbHVlc1wiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BWYWx1ZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgZGVmLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHB2ID0gb3B0aW9uLl96b2QucHJvcFZhbHVlcztcbiAgICAgICAgICAgIGlmICghcHYgfHwgT2JqZWN0LmtleXMocHYpLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZGlzY3JpbWluYXRlZCB1bmlvbiBvcHRpb24gYXQgaW5kZXggXCIke2RlZi5vcHRpb25zLmluZGV4T2Yob3B0aW9uKX1cImApO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMocHYpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWVzW2tdKVxuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsdWVzW2tdID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHVlc1trXS5hZGQodmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3BWYWx1ZXM7XG4gICAgfSk7XG4gICAgY29uc3QgZGlzYyA9IHV0aWwuY2FjaGVkKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IGRlZi5vcHRpb25zO1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgbyBvZiBvcHRzKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBvLl96b2QucHJvcFZhbHVlcz8uW2RlZi5kaXNjcmltaW5hdG9yXTtcbiAgICAgICAgICAgIGlmICghdmFsdWVzIHx8IHZhbHVlcy5zaXplID09PSAwKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkaXNjcmltaW5hdGVkIHVuaW9uIG9wdGlvbiBhdCBpbmRleCBcIiR7ZGVmLm9wdGlvbnMuaW5kZXhPZihvKX1cImApO1xuICAgICAgICAgICAgZm9yIChjb25zdCB2IG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmIChtYXAuaGFzKHYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIGRpc2NyaW1pbmF0b3IgdmFsdWUgXCIke1N0cmluZyh2KX1cImApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtYXAuc2V0KHYsIG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghdXRpbC5pc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3B0ID0gZGlzYy52YWx1ZS5nZXQoaW5wdXQ/LltkZWYuZGlzY3JpbWluYXRvcl0pO1xuICAgICAgICBpZiAob3B0KSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0Ll96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIHVuaW9uIG1hdGNoaW5nIHdoZW4gdGhlIGZhc3QgZGlzY3JpbWluYXRvciBwYXRoIGZhaWxzOlxuICAgICAgICAvLyAtIGV4cGxpY2l0bHkgZW5hYmxlZCB2aWEgdW5pb25GYWxsYmFjaywgb3JcbiAgICAgICAgLy8gLSBkdXJpbmcgYmFja3dhcmQgZGlyZWN0aW9uIChlbmNvZGUpLCBzaW5jZSBjb2RlYy1iYXNlZCBkaXNjcmltaW5hdG9yc1xuICAgICAgICAvLyAgIGhhdmUgZGlmZmVyZW50IHZhbHVlcyBpbiBmb3J3YXJkIHZzIGJhY2t3YXJkIGRpcmVjdGlvbnNcbiAgICAgICAgaWYgKGRlZi51bmlvbkZhbGxiYWNrIHx8IGN0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgcmV0dXJuIF9zdXBlcihwYXlsb2FkLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vIG1hdGNoaW5nIGRpc2NyaW1pbmF0b3JcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdW5pb25cIixcbiAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICBub3RlOiBcIk5vIG1hdGNoaW5nIGRpc2NyaW1pbmF0b3JcIixcbiAgICAgICAgICAgIGRpc2NyaW1pbmF0b3I6IGRlZi5kaXNjcmltaW5hdG9yLFxuICAgICAgICAgICAgb3B0aW9uczogQXJyYXkuZnJvbShkaXNjLnZhbHVlLmtleXMoKSksXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIHBhdGg6IFtkZWYuZGlzY3JpbWluYXRvcl0sXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RJbnRlcnNlY3Rpb24gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEludGVyc2VjdGlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBjb25zdCBsZWZ0ID0gZGVmLmxlZnQuX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXQsIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgY29uc3QgcmlnaHQgPSBkZWYucmlnaHQuX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXQsIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgY29uc3QgYXN5bmMgPSBsZWZ0IGluc3RhbmNlb2YgUHJvbWlzZSB8fCByaWdodCBpbnN0YW5jZW9mIFByb21pc2U7XG4gICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtsZWZ0LCByaWdodF0pLnRoZW4oKFtsZWZ0LCByaWdodF0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlSW50ZXJzZWN0aW9uUmVzdWx0cyhwYXlsb2FkLCBsZWZ0LCByaWdodCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlSW50ZXJzZWN0aW9uUmVzdWx0cyhwYXlsb2FkLCBsZWZ0LCByaWdodCk7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gbWVyZ2VWYWx1ZXMoYSwgYikge1xuICAgIC8vIGNvbnN0IGFUeXBlID0gcGFyc2UudChhKTtcbiAgICAvLyBjb25zdCBiVHlwZSA9IHBhcnNlLnQoYik7XG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGRhdGE6IGEgfTtcbiAgICB9XG4gICAgaWYgKGEgaW5zdGFuY2VvZiBEYXRlICYmIGIgaW5zdGFuY2VvZiBEYXRlICYmICthID09PSArYikge1xuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogYSB9O1xuICAgIH1cbiAgICBpZiAodXRpbC5pc1BsYWluT2JqZWN0KGEpICYmIHV0aWwuaXNQbGFpbk9iamVjdChiKSkge1xuICAgICAgICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xuICAgICAgICBjb25zdCBzaGFyZWRLZXlzID0gT2JqZWN0LmtleXMoYSkuZmlsdGVyKChrZXkpID0+IGJLZXlzLmluZGV4T2Yoa2V5KSAhPT0gLTEpO1xuICAgICAgICBjb25zdCBuZXdPYmogPSB7IC4uLmEsIC4uLmIgfTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygc2hhcmVkS2V5cykge1xuICAgICAgICAgICAgY29uc3Qgc2hhcmVkVmFsdWUgPSBtZXJnZVZhbHVlcyhhW2tleV0sIGJba2V5XSk7XG4gICAgICAgICAgICBpZiAoIXNoYXJlZFZhbHVlLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtZXJnZUVycm9yUGF0aDogW2tleSwgLi4uc2hhcmVkVmFsdWUubWVyZ2VFcnJvclBhdGhdLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IHNoYXJlZFZhbHVlLmRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGRhdGE6IG5ld09iaiB9O1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShhKSAmJiBBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgbWVyZ2VFcnJvclBhdGg6IFtdIH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtQSA9IGFbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgaXRlbUIgPSBiW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXJlZFZhbHVlID0gbWVyZ2VWYWx1ZXMoaXRlbUEsIGl0ZW1CKTtcbiAgICAgICAgICAgIGlmICghc2hhcmVkVmFsdWUudmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1lcmdlRXJyb3JQYXRoOiBbaW5kZXgsIC4uLnNoYXJlZFZhbHVlLm1lcmdlRXJyb3JQYXRoXSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3QXJyYXkucHVzaChzaGFyZWRWYWx1ZS5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogbmV3QXJyYXkgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBtZXJnZUVycm9yUGF0aDogW10gfTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUludGVyc2VjdGlvblJlc3VsdHMocmVzdWx0LCBsZWZ0LCByaWdodCkge1xuICAgIC8vIFRyYWNrIHdoaWNoIHNpZGUocykgcmVwb3J0IGVhY2gga2V5IGFzIHVucmVjb2duaXplZFxuICAgIGNvbnN0IHVucmVjS2V5cyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgdW5yZWNJc3N1ZTtcbiAgICBmb3IgKGNvbnN0IGlzcyBvZiBsZWZ0Lmlzc3Vlcykge1xuICAgICAgICBpZiAoaXNzLmNvZGUgPT09IFwidW5yZWNvZ25pemVkX2tleXNcIikge1xuICAgICAgICAgICAgdW5yZWNJc3N1ZSA/PyAodW5yZWNJc3N1ZSA9IGlzcyk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgaXNzLmtleXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXVucmVjS2V5cy5oYXMoaykpXG4gICAgICAgICAgICAgICAgICAgIHVucmVjS2V5cy5zZXQoaywge30pO1xuICAgICAgICAgICAgICAgIHVucmVjS2V5cy5nZXQoaykubCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuaXNzdWVzLnB1c2goaXNzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGlzcyBvZiByaWdodC5pc3N1ZXMpIHtcbiAgICAgICAgaWYgKGlzcy5jb2RlID09PSBcInVucmVjb2duaXplZF9rZXlzXCIpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBpc3Mua2V5cykge1xuICAgICAgICAgICAgICAgIGlmICghdW5yZWNLZXlzLmhhcyhrKSlcbiAgICAgICAgICAgICAgICAgICAgdW5yZWNLZXlzLnNldChrLCB7fSk7XG4gICAgICAgICAgICAgICAgdW5yZWNLZXlzLmdldChrKS5yID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5pc3N1ZXMucHVzaChpc3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFJlcG9ydCBvbmx5IGtleXMgdW5yZWNvZ25pemVkIGJ5IEJPVEggc2lkZXNcbiAgICBjb25zdCBib3RoS2V5cyA9IFsuLi51bnJlY0tleXNdLmZpbHRlcigoWywgZl0pID0+IGYubCAmJiBmLnIpLm1hcCgoW2tdKSA9PiBrKTtcbiAgICBpZiAoYm90aEtleXMubGVuZ3RoICYmIHVucmVjSXNzdWUpIHtcbiAgICAgICAgcmVzdWx0Lmlzc3Vlcy5wdXNoKHsgLi4udW5yZWNJc3N1ZSwga2V5czogYm90aEtleXMgfSk7XG4gICAgfVxuICAgIGlmICh1dGlsLmFib3J0ZWQocmVzdWx0KSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICBjb25zdCBtZXJnZWQgPSBtZXJnZVZhbHVlcyhsZWZ0LnZhbHVlLCByaWdodC52YWx1ZSk7XG4gICAgaWYgKCFtZXJnZWQudmFsaWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbm1lcmdhYmxlIGludGVyc2VjdGlvbi4gRXJyb3IgcGF0aDogYCArIGAke0pTT04uc3RyaW5naWZ5KG1lcmdlZC5tZXJnZUVycm9yUGF0aCl9YCk7XG4gICAgfVxuICAgIHJlc3VsdC52YWx1ZSA9IG1lcmdlZC5kYXRhO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgY29uc3QgJFpvZFR1cGxlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RUdXBsZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvbnN0IGl0ZW1zID0gZGVmLml0ZW1zO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcInR1cGxlXCIsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC52YWx1ZSA9IFtdO1xuICAgICAgICBjb25zdCBwcm9tcyA9IFtdO1xuICAgICAgICBjb25zdCBvcHRpblN0YXJ0ID0gZ2V0VHVwbGVPcHRTdGFydChpdGVtcywgXCJvcHRpblwiKTtcbiAgICAgICAgY29uc3Qgb3B0b3V0U3RhcnQgPSBnZXRUdXBsZU9wdFN0YXJ0KGl0ZW1zLCBcIm9wdG91dFwiKTtcbiAgICAgICAgaWYgKCFkZWYucmVzdCkge1xuICAgICAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCA8IG9wdGluU3RhcnQpIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogXCJ0b29fc21hbGxcIixcbiAgICAgICAgICAgICAgICAgICAgbWluaW11bTogb3B0aW5TdGFydCxcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5wdXQubGVuZ3RoID4gaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFwidG9vX2JpZ1wiLFxuICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBpdGVtcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogXCJhcnJheVwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJ1biBldmVyeSBpdGVtIGluIHBhcmFsbGVsLCBjb2xsZWN0aW5nIHJlc3VsdHMgaW50byBhbiBpbmRleGVkXG4gICAgICAgIC8vIGFycmF5LiBUaGUgcG9zdC1wcm9jZXNzaW5nIGluIGBoYW5kbGVUdXBsZVJlc3VsdHNgIHdhbGtzIHRoZW0gaW5cbiAgICAgICAgLy8gb3JkZXIgc28gaXQgY2FuIGRlY2lkZSB3aGV0aGVyIGFuIGFic2VudCBvcHRpb25hbC1vdXRwdXQgZXJyb3IgY2FuXG4gICAgICAgIC8vIHRydW5jYXRlIHRoZSB0YWlsIG9yIG11c3QgYmUgcmVwb3J0ZWQgdG8gcHJlc2VydmUgcmVxdWlyZWQgb3V0cHV0LlxuICAgICAgICBjb25zdCBpdGVtUmVzdWx0cyA9IG5ldyBBcnJheShpdGVtcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByID0gaXRlbXNbaV0uX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXRbaV0sIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHByb21zLnB1c2goci50aGVuKChycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpdGVtUmVzdWx0c1tpXSA9IHJyO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW1SZXN1bHRzW2ldID0gcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmLnJlc3QpIHtcbiAgICAgICAgICAgIGxldCBpID0gaXRlbXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3QgPSBpbnB1dC5zbGljZShpdGVtcy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbCBvZiByZXN0KSB7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5yZXN0Ll96b2QucnVuKHsgdmFsdWU6IGVsLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvbXMucHVzaChyZXN1bHQudGhlbigocikgPT4gaGFuZGxlVHVwbGVSZXN1bHQociwgcGF5bG9hZCwgaSkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZVR1cGxlUmVzdWx0KHJlc3VsdCwgcGF5bG9hZCwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9tcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tcykudGhlbigoKSA9PiBoYW5kbGVUdXBsZVJlc3VsdHMoaXRlbVJlc3VsdHMsIHBheWxvYWQsIGl0ZW1zLCBpbnB1dCwgb3B0b3V0U3RhcnQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlVHVwbGVSZXN1bHRzKGl0ZW1SZXN1bHRzLCBwYXlsb2FkLCBpdGVtcywgaW5wdXQsIG9wdG91dFN0YXJ0KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBnZXRUdXBsZU9wdFN0YXJ0KGl0ZW1zLCBrZXkpIHtcbiAgICBmb3IgKGxldCBpID0gaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKGl0ZW1zW2ldLl96b2Rba2V5XSAhPT0gXCJvcHRpb25hbFwiKVxuICAgICAgICAgICAgcmV0dXJuIGkgKyAxO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGhhbmRsZVR1cGxlUmVzdWx0KHJlc3VsdCwgZmluYWwsIGluZGV4KSB7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKC4uLnV0aWwucHJlZml4SXNzdWVzKGluZGV4LCByZXN1bHQuaXNzdWVzKSk7XG4gICAgfVxuICAgIGZpbmFsLnZhbHVlW2luZGV4XSA9IHJlc3VsdC52YWx1ZTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVR1cGxlUmVzdWx0cyhpdGVtUmVzdWx0cywgZmluYWwsIGl0ZW1zLCBpbnB1dCwgb3B0b3V0U3RhcnQpIHtcbiAgICAvLyBXYWxrIHJlc3VsdHMgaW4gb3JkZXIuIE1pcnJvciAkWm9kT2JqZWN0J3Mgc3dhbGxvdy1vbi1hYnNlbnQtb3B0aW9uYWxcbiAgICAvLyBydWxlLCBidXQgb25seSBhZnRlciBgb3B0b3V0U3RhcnRgOiB0aGUgZmlyc3QgaW5kZXggd2hlcmUgdGhlIG91dHB1dFxuICAgIC8vIHR1cGxlIHRhaWwgY2FuIGJlIGFic2VudC5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHIgPSBpdGVtUmVzdWx0c1tpXTtcbiAgICAgICAgY29uc3QgaXNQcmVzZW50ID0gaSA8IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgaWYgKHIuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFpc1ByZXNlbnQgJiYgaSA+PSBvcHRvdXRTdGFydCkge1xuICAgICAgICAgICAgICAgIGZpbmFsLnZhbHVlLmxlbmd0aCA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhpLCByLmlzc3VlcykpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsLnZhbHVlW2ldID0gci52YWx1ZTtcbiAgICB9XG4gICAgLy8gRHJvcCB0cmFpbGluZyBzbG90cyB0aGF0IHByb2R1Y2VkIGB1bmRlZmluZWRgIGZvciBhYnNlbnQgaW5wdXRcbiAgICAvLyAodGhlIGFycmF5IGFuYWxvZyBvZiBhbiBhYnNlbnQgb3B0aW9uYWwga2V5IG9uIGFuIG9iamVjdCkuIFRoZVxuICAgIC8vIGBpID49IGlucHV0Lmxlbmd0aGAgZmxvb3IgaXMgY3JpdGljYWw6IGFuIGV4cGxpY2l0IGB1bmRlZmluZWRgXG4gICAgLy8gKmluc2lkZSogdGhlIGlucHV0IG11c3QgYmUgcHJlc2VydmVkIGV2ZW4gd2hlbiB0aGUgc2NoZW1hIGlzXG4gICAgLy8gb3B0aW9uYWwtb3V0IChlLmcuIGB6LnN0cmluZygpLm9yKHoudW5kZWZpbmVkKCkpYCBhY2NlcHRpbmcgYW5cbiAgICAvLyBleHBsaWNpdCB1bmRlZmluZWQgdmFsdWUpLlxuICAgIGZvciAobGV0IGkgPSBmaW5hbC52YWx1ZS5sZW5ndGggLSAxOyBpID49IGlucHV0Lmxlbmd0aDsgaS0tKSB7XG4gICAgICAgIGlmIChpdGVtc1tpXS5fem9kLm9wdG91dCA9PT0gXCJvcHRpb25hbFwiICYmIGZpbmFsLnZhbHVlW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmFsLnZhbHVlLmxlbmd0aCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmluYWw7XG59XG5leHBvcnQgY29uc3QgJFpvZFJlY29yZCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kUmVjb3JkXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghdXRpbC5pc1BsYWluT2JqZWN0KGlucHV0KSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwicmVjb3JkXCIsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9tcyA9IFtdO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBkZWYua2V5VHlwZS5fem9kLnZhbHVlcztcbiAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkS2V5cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGtleSA9PT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmRLZXlzLmFkZCh0eXBlb2Yga2V5ID09PSBcIm51bWJlclwiID8ga2V5LnRvU3RyaW5nKCkgOiBrZXkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlSZXN1bHQgPSBkZWYua2V5VHlwZS5fem9kLnJ1bih7IHZhbHVlOiBrZXksIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleVJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFzeW5jIHNjaGVtYXMgbm90IHN1cHBvcnRlZCBpbiBvYmplY3Qga2V5cyBjdXJyZW50bHlcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleVJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfa2V5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBcInJlY29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3Vlczoga2V5UmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRLZXkgPSBrZXlSZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi52YWx1ZVR5cGUuX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXRba2V5XSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbXMucHVzaChyZXN1bHQudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoa2V5LCByZXN1bHQuaXNzdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWVbb3V0S2V5XSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoa2V5LCByZXN1bHQuaXNzdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlW291dEtleV0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdW5yZWNvZ25pemVkO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlY29yZEtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5yZWNvZ25pemVkID0gdW5yZWNvZ25pemVkID8/IFtdO1xuICAgICAgICAgICAgICAgICAgICB1bnJlY29nbml6ZWQucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1bnJlY29nbml6ZWQgJiYgdW5yZWNvZ25pemVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogXCJ1bnJlY29nbml6ZWRfa2V5c1wiLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAga2V5czogdW5yZWNvZ25pemVkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHt9O1xuICAgICAgICAgICAgLy8gUmVmbGVjdC5vd25LZXlzIGZvciBTeW1ib2wta2V5IHN1cHBvcnQ7IGZpbHRlciBub24tZW51bWVyYWJsZSB0byBtYXRjaCB6Lm9iamVjdCgpXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBSZWZsZWN0Lm93bktleXMoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJfX3Byb3RvX19cIilcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoaW5wdXQsIGtleSkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGxldCBrZXlSZXN1bHQgPSBkZWYua2V5VHlwZS5fem9kLnJ1bih7IHZhbHVlOiBrZXksIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3luYyBzY2hlbWFzIG5vdCBzdXBwb3J0ZWQgaW4gb2JqZWN0IGtleXMgY3VycmVudGx5XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBOdW1lcmljIHN0cmluZyBmYWxsYmFjazogaWYga2V5IGlzIGEgbnVtZXJpYyBzdHJpbmcgYW5kIGZhaWxlZCwgcmV0cnkgd2l0aCBOdW1iZXIoa2V5KVxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaGFuZGxlcyB6Lm51bWJlcigpLCB6LmxpdGVyYWwoWzEsIDIsIDNdKSwgYW5kIHVuaW9ucyBjb250YWluaW5nIG51bWVyaWMgbGl0ZXJhbHNcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja051bWVyaWNLZXkgPSB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHJlZ2V4ZXMubnVtYmVyLnRlc3Qoa2V5KSAmJiBrZXlSZXN1bHQuaXNzdWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tOdW1lcmljS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldHJ5UmVzdWx0ID0gZGVmLmtleVR5cGUuX3pvZC5ydW4oeyB2YWx1ZTogTnVtYmVyKGtleSksIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldHJ5UmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXN5bmMgc2NoZW1hcyBub3Qgc3VwcG9ydGVkIGluIG9iamVjdCBrZXlzIGN1cnJlbnRseVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocmV0cnlSZXN1bHQuaXNzdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5UmVzdWx0ID0gcmV0cnlSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGtleVJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWYubW9kZSA9PT0gXCJsb29zZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRocm91Z2ggdW5jaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlW2tleV0gPSBpbnB1dFtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBcInN0cmljdFwiIGJlaGF2aW9yOiBlcnJvciBvbiBpbnZhbGlkIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2tleVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogXCJyZWNvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IGtleVJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogW2tleV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYudmFsdWVUeXBlLl96b2QucnVuKHsgdmFsdWU6IGlucHV0W2tleV0sIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcy5wdXNoKHJlc3VsdC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoa2V5LCByZXN1bHQuaXNzdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlW2tleVJlc3VsdC52YWx1ZV0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhrZXksIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlW2tleVJlc3VsdC52YWx1ZV0gPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9tcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tcykudGhlbigoKSA9PiBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE1hcCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kTWFwXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghKGlucHV0IGluc3RhbmNlb2YgTWFwKSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibWFwXCIsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9tcyA9IFtdO1xuICAgICAgICBwYXlsb2FkLnZhbHVlID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBpbnB1dCkge1xuICAgICAgICAgICAgY29uc3Qga2V5UmVzdWx0ID0gZGVmLmtleVR5cGUuX3pvZC5ydW4oeyB2YWx1ZToga2V5LCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZVJlc3VsdCA9IGRlZi52YWx1ZVR5cGUuX3pvZC5ydW4oeyB2YWx1ZTogdmFsdWUsIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgIGlmIChrZXlSZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHZhbHVlUmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHByb21zLnB1c2goUHJvbWlzZS5hbGwoW2tleVJlc3VsdCwgdmFsdWVSZXN1bHRdKS50aGVuKChba2V5UmVzdWx0LCB2YWx1ZVJlc3VsdF0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTWFwUmVzdWx0KGtleVJlc3VsdCwgdmFsdWVSZXN1bHQsIHBheWxvYWQsIGtleSwgaW5wdXQsIGluc3QsIGN0eCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlTWFwUmVzdWx0KGtleVJlc3VsdCwgdmFsdWVSZXN1bHQsIHBheWxvYWQsIGtleSwgaW5wdXQsIGluc3QsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb21zLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tcykudGhlbigoKSA9PiBwYXlsb2FkKTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlTWFwUmVzdWx0KGtleVJlc3VsdCwgdmFsdWVSZXN1bHQsIGZpbmFsLCBrZXksIGlucHV0LCBpbnN0LCBjdHgpIHtcbiAgICBpZiAoa2V5UmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHV0aWwucHJvcGVydHlLZXlUeXBlcy5oYXModHlwZW9mIGtleSkpIHtcbiAgICAgICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKC4uLnV0aWwucHJlZml4SXNzdWVzKGtleSwga2V5UmVzdWx0Lmlzc3VlcykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9rZXlcIixcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwibWFwXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IGtleVJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhbHVlUmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHV0aWwucHJvcGVydHlLZXlUeXBlcy5oYXModHlwZW9mIGtleSkpIHtcbiAgICAgICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKC4uLnV0aWwucHJlZml4SXNzdWVzKGtleSwgdmFsdWVSZXN1bHQuaXNzdWVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiBcIm1hcFwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9lbGVtZW50XCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IHZhbHVlUmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaW5hbC52YWx1ZS5zZXQoa2V5UmVzdWx0LnZhbHVlLCB2YWx1ZVJlc3VsdC52YWx1ZSk7XG59XG5leHBvcnQgY29uc3QgJFpvZFNldCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kU2V0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghKGlucHV0IGluc3RhbmNlb2YgU2V0KSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJzZXRcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9tcyA9IFtdO1xuICAgICAgICBwYXlsb2FkLnZhbHVlID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi52YWx1ZVR5cGUuX3pvZC5ydW4oeyB2YWx1ZTogaXRlbSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBwcm9tcy5wdXNoKHJlc3VsdC50aGVuKChyZXN1bHQpID0+IGhhbmRsZVNldFJlc3VsdChyZXN1bHQsIHBheWxvYWQpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaGFuZGxlU2V0UmVzdWx0KHJlc3VsdCwgcGF5bG9hZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb21zLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tcykudGhlbigoKSA9PiBwYXlsb2FkKTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlU2V0UmVzdWx0KHJlc3VsdCwgZmluYWwpIHtcbiAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goLi4ucmVzdWx0Lmlzc3Vlcyk7XG4gICAgfVxuICAgIGZpbmFsLnZhbHVlLmFkZChyZXN1bHQudmFsdWUpO1xufVxuZXhwb3J0IGNvbnN0ICRab2RFbnVtID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RFbnVtXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgdmFsdWVzID0gdXRpbC5nZXRFbnVtVmFsdWVzKGRlZi5lbnRyaWVzKTtcbiAgICBjb25zdCB2YWx1ZXNTZXQgPSBuZXcgU2V0KHZhbHVlcyk7XG4gICAgaW5zdC5fem9kLnZhbHVlcyA9IHZhbHVlc1NldDtcbiAgICBpbnN0Ll96b2QucGF0dGVybiA9IG5ldyBSZWdFeHAoYF4oJHt2YWx1ZXNcbiAgICAgICAgLmZpbHRlcigoaykgPT4gdXRpbC5wcm9wZXJ0eUtleVR5cGVzLmhhcyh0eXBlb2YgaykpXG4gICAgICAgIC5tYXAoKG8pID0+ICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIiA/IHV0aWwuZXNjYXBlUmVnZXgobykgOiBvLnRvU3RyaW5nKCkpKVxuICAgICAgICAuam9pbihcInxcIil9KSRgKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZXNTZXQuaGFzKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdmFsdWVcIixcbiAgICAgICAgICAgIHZhbHVlcyxcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTGl0ZXJhbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kTGl0ZXJhbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGlmIChkZWYudmFsdWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgY3JlYXRlIGxpdGVyYWwgc2NoZW1hIHdpdGggbm8gdmFsaWQgdmFsdWVzXCIpO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZXMgPSBuZXcgU2V0KGRlZi52YWx1ZXMpO1xuICAgIGluc3QuX3pvZC52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgaW5zdC5fem9kLnBhdHRlcm4gPSBuZXcgUmVnRXhwKGBeKCR7ZGVmLnZhbHVlc1xuICAgICAgICAubWFwKChvKSA9PiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIgPyB1dGlsLmVzY2FwZVJlZ2V4KG8pIDogbyA/IHV0aWwuZXNjYXBlUmVnZXgoby50b1N0cmluZygpKSA6IFN0cmluZyhvKSkpXG4gICAgICAgIC5qb2luKFwifFwiKX0pJGApO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlcy5oYXMoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF92YWx1ZVwiLFxuICAgICAgICAgICAgdmFsdWVzOiBkZWYudmFsdWVzLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RGaWxlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RGaWxlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEZpbGUpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJmaWxlXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RUcmFuc2Zvcm0gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFRyYW5zZm9ybVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5vcHRpbiA9IFwib3B0aW9uYWxcIjtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGlmIChjdHguZGlyZWN0aW9uID09PSBcImJhY2t3YXJkXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBjb3JlLiRab2RFbmNvZGVFcnJvcihpbnN0LmNvbnN0cnVjdG9yLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IF9vdXQgPSBkZWYudHJhbnNmb3JtKHBheWxvYWQudmFsdWUsIHBheWxvYWQpO1xuICAgICAgICBpZiAoY3R4LmFzeW5jKSB7XG4gICAgICAgICAgICBjb25zdCBvdXRwdXQgPSBfb3V0IGluc3RhbmNlb2YgUHJvbWlzZSA/IF9vdXQgOiBQcm9taXNlLnJlc29sdmUoX291dCk7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0LnRoZW4oKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBvdXRwdXQ7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC5mYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX291dCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBjb3JlLiRab2RBc3luY0Vycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC52YWx1ZSA9IF9vdXQ7XG4gICAgICAgIHBheWxvYWQuZmFsbGJhY2sgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVPcHRpb25hbFJlc3VsdChyZXN1bHQsIGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQgJiYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoIHx8IHJlc3VsdC5mYWxsYmFjaykpIHtcbiAgICAgICAgcmV0dXJuIHsgaXNzdWVzOiBbXSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0IGNvbnN0ICRab2RPcHRpb25hbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kT3B0aW9uYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2Qub3B0aW4gPSBcIm9wdGlvbmFsXCI7XG4gICAgaW5zdC5fem9kLm9wdG91dCA9IFwib3B0aW9uYWxcIjtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInZhbHVlc1wiLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBkZWYuaW5uZXJUeXBlLl96b2QudmFsdWVzID8gbmV3IFNldChbLi4uZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcywgdW5kZWZpbmVkXSkgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwYXR0ZXJuXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgcGF0dGVybiA9IGRlZi5pbm5lclR5cGUuX3pvZC5wYXR0ZXJuO1xuICAgICAgICByZXR1cm4gcGF0dGVybiA/IG5ldyBSZWdFeHAoYF4oJHt1dGlsLmNsZWFuUmVnZXgocGF0dGVybi5zb3VyY2UpfSk/JGApIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGRlZi5pbm5lclR5cGUuX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oKHIpID0+IGhhbmRsZU9wdGlvbmFsUmVzdWx0KHIsIGlucHV0KSk7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlT3B0aW9uYWxSZXN1bHQocmVzdWx0LCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBheWxvYWQudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEV4YWN0T3B0aW9uYWwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEV4YWN0T3B0aW9uYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIENhbGwgcGFyZW50IGluaXQgLSBpbmhlcml0cyBvcHRpbi9vcHRvdXQgPSBcIm9wdGlvbmFsXCJcbiAgICAkWm9kT3B0aW9uYWwuaW5pdChpbnN0LCBkZWYpO1xuICAgIC8vIE92ZXJyaWRlIHZhbHVlcy9wYXR0ZXJuIHRvIE5PVCBhZGQgdW5kZWZpbmVkXG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4gZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcyk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwYXR0ZXJuXCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC5wYXR0ZXJuKTtcbiAgICAvLyBPdmVycmlkZSBwYXJzZSB0byBqdXN0IGRlbGVnYXRlIChubyB1bmRlZmluZWQgaGFuZGxpbmcpXG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICByZXR1cm4gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTnVsbGFibGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE51bGxhYmxlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRpblwiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2Qub3B0aW4pO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwib3B0b3V0XCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC5vcHRvdXQpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicGF0dGVyblwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm4gPSBkZWYuaW5uZXJUeXBlLl96b2QucGF0dGVybjtcbiAgICAgICAgcmV0dXJuIHBhdHRlcm4gPyBuZXcgUmVnRXhwKGBeKCR7dXRpbC5jbGVhblJlZ2V4KHBhdHRlcm4uc291cmNlKX18bnVsbCkkYCkgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4ge1xuICAgICAgICByZXR1cm4gZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcyA/IG5ldyBTZXQoWy4uLmRlZi5pbm5lclR5cGUuX3pvZC52YWx1ZXMsIG51bGxdKSA6IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIC8vIEZvcndhcmQgZGlyZWN0aW9uIChkZWNvZGUpOiBhbGxvdyBudWxsIHRvIHBhc3MgdGhyb3VnaFxuICAgICAgICBpZiAocGF5bG9hZC52YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICByZXR1cm4gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kRGVmYXVsdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kRGVmYXVsdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIC8vIGluc3QuX3pvZC5xaW4gPSBcInRydWVcIjtcbiAgICBpbnN0Ll96b2Qub3B0aW4gPSBcIm9wdGlvbmFsXCI7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4gZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcyk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcndhcmQgZGlyZWN0aW9uIChkZWNvZGUpOiBhcHBseSBkZWZhdWx0cyBmb3IgdW5kZWZpbmVkIGlucHV0XG4gICAgICAgIGlmIChwYXlsb2FkLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBkZWYuZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAkWm9kRGVmYXVsdCByZXR1cm5zIHRoZSBkZWZhdWx0IHZhbHVlIGltbWVkaWF0ZWx5IGluIGZvcndhcmQgZGlyZWN0aW9uLlxuICAgICAgICAgICAgICogSXQgZG9lc24ndCBwYXNzIHRoZSBkZWZhdWx0IHZhbHVlIGludG8gdGhlIHZhbGlkYXRvciAoXCJwcmVmYXVsdFwiKS4gVGhlcmUncyBubyByZWFzb24gdG8gcGFzcyB0aGUgZGVmYXVsdCB2YWx1ZSB0aHJvdWdoIHZhbGlkYXRpb24uIFRoZSB2YWxpZGl0eSBvZiB0aGUgZGVmYXVsdCBpcyBlbmZvcmNlZCBieSBUeXBlU2NyaXB0IHN0YXRpY2FsbHkuIE90aGVyd2lzZSwgaXQncyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIHVzZXIgdG8gZW5zdXJlIHRoZSBkZWZhdWx0IGlzIHZhbGlkLiBJbiB0aGUgY2FzZSBvZiBwaXBlcyB3aXRoIGRpdmVyZ2VudCBpbi9vdXQgdHlwZXMsIHlvdSBjYW4gc3BlY2lmeSB0aGUgZGVmYXVsdCBvbiB0aGUgYGluYCBzY2hlbWEgb2YgeW91ciBab2RQaXBlIHRvIHNldCBhIFwicHJlZmF1bHRcIiBmb3IgdGhlIHBpcGUuICAgKi9cbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcndhcmQgZGlyZWN0aW9uOiBjb250aW51ZSB3aXRoIGRlZmF1bHQgaGFuZGxpbmdcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChyZXN1bHQpID0+IGhhbmRsZURlZmF1bHRSZXN1bHQocmVzdWx0LCBkZWYpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlRGVmYXVsdFJlc3VsdChyZXN1bHQsIGRlZik7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlRGVmYXVsdFJlc3VsdChwYXlsb2FkLCBkZWYpIHtcbiAgICBpZiAocGF5bG9hZC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBkZWYuZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcGF5bG9hZDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kUHJlZmF1bHQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFByZWZhdWx0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLm9wdGluID0gXCJvcHRpb25hbFwiO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC52YWx1ZXMpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3J3YXJkIGRpcmVjdGlvbiAoZGVjb2RlKTogYXBwbHkgcHJlZmF1bHQgZm9yIHVuZGVmaW5lZCBpbnB1dFxuICAgICAgICBpZiAocGF5bG9hZC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gZGVmLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTm9uT3B0aW9uYWwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE5vbk9wdGlvbmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCB2ID0gZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcztcbiAgICAgICAgcmV0dXJuIHYgPyBuZXcgU2V0KFsuLi52XS5maWx0ZXIoKHgpID0+IHggIT09IHVuZGVmaW5lZCkpIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChyZXN1bHQpID0+IGhhbmRsZU5vbk9wdGlvbmFsUmVzdWx0KHJlc3VsdCwgaW5zdCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVOb25PcHRpb25hbFJlc3VsdChyZXN1bHQsIGluc3QpO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZU5vbk9wdGlvbmFsUmVzdWx0KHBheWxvYWQsIGluc3QpIHtcbiAgICBpZiAoIXBheWxvYWQuaXNzdWVzLmxlbmd0aCAmJiBwYXlsb2FkLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibm9ub3B0aW9uYWxcIixcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwYXlsb2FkO1xufVxuZXhwb3J0IGNvbnN0ICRab2RTdWNjZXNzID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RTdWNjZXNzXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kRW5jb2RlRXJyb3IoXCJab2RTdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHJlc3VsdC5pc3N1ZXMubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHJlc3VsdC5pc3N1ZXMubGVuZ3RoID09PSAwO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENhdGNoID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDYXRjaFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5vcHRpbiA9IFwib3B0aW9uYWxcIjtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdG91dFwiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2Qub3B0b3V0KTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInZhbHVlc1wiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2QudmFsdWVzKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGlmIChjdHguZGlyZWN0aW9uID09PSBcImJhY2t3YXJkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yd2FyZCBkaXJlY3Rpb24gKGRlY29kZSk6IGFwcGx5IGNhdGNoIGxvZ2ljXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IGRlZi5jYXRjaFZhbHVlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlczogcmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3VlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmZhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLnZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBkZWYuY2F0Y2hWYWx1ZSh7XG4gICAgICAgICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzID0gW107XG4gICAgICAgICAgICBwYXlsb2FkLmZhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE5hTiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kTmFOXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLnZhbHVlICE9PSBcIm51bWJlclwiIHx8ICFOdW1iZXIuaXNOYU4ocGF5bG9hZC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibmFuXCIsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RQaXBlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RQaXBlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4gZGVmLmluLl96b2QudmFsdWVzKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdGluXCIsICgpID0+IGRlZi5pbi5fem9kLm9wdGluKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdG91dFwiLCAoKSA9PiBkZWYub3V0Ll96b2Qub3B0b3V0KTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInByb3BWYWx1ZXNcIiwgKCkgPT4gZGVmLmluLl96b2QucHJvcFZhbHVlcyk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IGRlZi5vdXQuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmlnaHQudGhlbigocmlnaHQpID0+IGhhbmRsZVBpcGVSZXN1bHQocmlnaHQsIGRlZi5pbiwgY3R4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlUGlwZVJlc3VsdChyaWdodCwgZGVmLmluLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlZnQgPSBkZWYuaW4uX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgaWYgKGxlZnQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbGVmdC50aGVuKChsZWZ0KSA9PiBoYW5kbGVQaXBlUmVzdWx0KGxlZnQsIGRlZi5vdXQsIGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVQaXBlUmVzdWx0KGxlZnQsIGRlZi5vdXQsIGN0eCk7XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlUGlwZVJlc3VsdChsZWZ0LCBuZXh0LCBjdHgpIHtcbiAgICBpZiAobGVmdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIHByZXZlbnQgZnVydGhlciBjaGVja3NcbiAgICAgICAgbGVmdC5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgfVxuICAgIHJldHVybiBuZXh0Ll96b2QucnVuKHsgdmFsdWU6IGxlZnQudmFsdWUsIGlzc3VlczogbGVmdC5pc3N1ZXMsIGZhbGxiYWNrOiBsZWZ0LmZhbGxiYWNrIH0sIGN0eCk7XG59XG5leHBvcnQgY29uc3QgJFpvZENvZGVjID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDb2RlY1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IGRlZi5pbi5fem9kLnZhbHVlcyk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRpblwiLCAoKSA9PiBkZWYuaW4uX3pvZC5vcHRpbik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRvdXRcIiwgKCkgPT4gZGVmLm91dC5fem9kLm9wdG91dCk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IGRlZi5pbi5fem9kLnByb3BWYWx1ZXMpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gY3R4LmRpcmVjdGlvbiB8fCBcImZvcndhcmRcIjtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJmb3J3YXJkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBkZWYuaW4uX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0LnRoZW4oKGxlZnQpID0+IGhhbmRsZUNvZGVjQVJlc3VsdChsZWZ0LCBkZWYsIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUNvZGVjQVJlc3VsdChsZWZ0LCBkZWYsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IGRlZi5vdXQuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmlnaHQudGhlbigocmlnaHQpID0+IGhhbmRsZUNvZGVjQVJlc3VsdChyaWdodCwgZGVmLCBjdHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVDb2RlY0FSZXN1bHQocmlnaHQsIGRlZiwgY3R4KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZUNvZGVjQVJlc3VsdChyZXN1bHQsIGRlZiwgY3R4KSB7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIHByZXZlbnQgZnVydGhlciBjaGVja3NcbiAgICAgICAgcmVzdWx0LmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBjdHguZGlyZWN0aW9uIHx8IFwiZm9yd2FyZFwiO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiZm9yd2FyZFwiKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gZGVmLnRyYW5zZm9ybShyZXN1bHQudmFsdWUsIHJlc3VsdCk7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1lZCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZC50aGVuKCh2YWx1ZSkgPT4gaGFuZGxlQ29kZWNUeFJlc3VsdChyZXN1bHQsIHZhbHVlLCBkZWYub3V0LCBjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlQ29kZWNUeFJlc3VsdChyZXN1bHQsIHRyYW5zZm9ybWVkLCBkZWYub3V0LCBjdHgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWQgPSBkZWYucmV2ZXJzZVRyYW5zZm9ybShyZXN1bHQudmFsdWUsIHJlc3VsdCk7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1lZCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZC50aGVuKCh2YWx1ZSkgPT4gaGFuZGxlQ29kZWNUeFJlc3VsdChyZXN1bHQsIHZhbHVlLCBkZWYuaW4sIGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVDb2RlY1R4UmVzdWx0KHJlc3VsdCwgdHJhbnNmb3JtZWQsIGRlZi5pbiwgY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBoYW5kbGVDb2RlY1R4UmVzdWx0KGxlZnQsIHZhbHVlLCBuZXh0U2NoZW1hLCBjdHgpIHtcbiAgICAvLyBDaGVjayBpZiB0cmFuc2Zvcm0gYWRkZWQgYW55IGlzc3Vlc1xuICAgIGlmIChsZWZ0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgbGVmdC5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgfVxuICAgIHJldHVybiBuZXh0U2NoZW1hLl96b2QucnVuKHsgdmFsdWUsIGlzc3VlczogbGVmdC5pc3N1ZXMgfSwgY3R4KTtcbn1cbmV4cG9ydCBjb25zdCAkWm9kUHJlcHJvY2VzcyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kUHJlcHJvY2Vzc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFBpcGUuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFJlYWRvbmx5ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RSZWFkb25seVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicHJvcFZhbHVlc1wiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2QucHJvcFZhbHVlcyk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4gZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcyk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRpblwiLCAoKSA9PiBkZWYuaW5uZXJUeXBlPy5fem9kPy5vcHRpbik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRvdXRcIiwgKCkgPT4gZGVmLmlubmVyVHlwZT8uX3pvZD8ub3B0b3V0KTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGlmIChjdHguZGlyZWN0aW9uID09PSBcImJhY2t3YXJkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKGhhbmRsZVJlYWRvbmx5UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlUmVhZG9ubHlSZXN1bHQocmVzdWx0KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVSZWFkb25seVJlc3VsdChwYXlsb2FkKSB7XG4gICAgcGF5bG9hZC52YWx1ZSA9IE9iamVjdC5mcmVlemUocGF5bG9hZC52YWx1ZSk7XG4gICAgcmV0dXJuIHBheWxvYWQ7XG59XG5leHBvcnQgY29uc3QgJFpvZFRlbXBsYXRlTGl0ZXJhbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVGVtcGxhdGVMaXRlcmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgcmVnZXhQYXJ0cyA9IFtdO1xuICAgIGZvciAoY29uc3QgcGFydCBvZiBkZWYucGFydHMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJ0ID09PSBcIm9iamVjdFwiICYmIHBhcnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGlzIFpvZCBzY2hlbWFcbiAgICAgICAgICAgIGlmICghcGFydC5fem9kLnBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIXNvdXJjZSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGVtcGxhdGUgbGl0ZXJhbCBwYXJ0LCBubyBwYXR0ZXJuIGZvdW5kOiAke1suLi5wYXJ0Ll96b2QudHJhaXRzXS5zaGlmdCgpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc291cmNlID0gcGFydC5fem9kLnBhdHRlcm4gaW5zdGFuY2VvZiBSZWdFeHAgPyBwYXJ0Ll96b2QucGF0dGVybi5zb3VyY2UgOiBwYXJ0Ll96b2QucGF0dGVybjtcbiAgICAgICAgICAgIGlmICghc291cmNlKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0ZW1wbGF0ZSBsaXRlcmFsIHBhcnQ6ICR7cGFydC5fem9kLnRyYWl0c31gKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gc291cmNlLnN0YXJ0c1dpdGgoXCJeXCIpID8gMSA6IDA7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSBzb3VyY2UuZW5kc1dpdGgoXCIkXCIpID8gc291cmNlLmxlbmd0aCAtIDEgOiBzb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgcmVnZXhQYXJ0cy5wdXNoKHNvdXJjZS5zbGljZShzdGFydCwgZW5kKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGFydCA9PT0gbnVsbCB8fCB1dGlsLnByaW1pdGl2ZVR5cGVzLmhhcyh0eXBlb2YgcGFydCkpIHtcbiAgICAgICAgICAgIHJlZ2V4UGFydHMucHVzaCh1dGlsLmVzY2FwZVJlZ2V4KGAke3BhcnR9YCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRlbXBsYXRlIGxpdGVyYWwgcGFydDogJHtwYXJ0fWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGluc3QuX3pvZC5wYXR0ZXJuID0gbmV3IFJlZ0V4cChgXiR7cmVnZXhQYXJ0cy5qb2luKFwiXCIpfSRgKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQudmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgaW5zdC5fem9kLnBhdHRlcm4ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgaWYgKCFpbnN0Ll96b2QucGF0dGVybi50ZXN0KHBheWxvYWQudmFsdWUpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IGRlZi5mb3JtYXQgPz8gXCJ0ZW1wbGF0ZV9saXRlcmFsXCIsXG4gICAgICAgICAgICAgICAgcGF0dGVybjogaW5zdC5fem9kLnBhdHRlcm4uc291cmNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEZ1bmN0aW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RGdW5jdGlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX2RlZiA9IGRlZjtcbiAgICBpbnN0Ll96b2QuZGVmID0gZGVmO1xuICAgIGluc3QuaW1wbGVtZW50ID0gKGZ1bmMpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImltcGxlbWVudCgpIG11c3QgYmUgY2FsbGVkIHdpdGggYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZEFyZ3MgPSBpbnN0Ll9kZWYuaW5wdXQgPyBwYXJzZShpbnN0Ll9kZWYuaW5wdXQsIGFyZ3MpIDogYXJncztcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkoZnVuYywgdGhpcywgcGFyc2VkQXJncyk7XG4gICAgICAgICAgICBpZiAoaW5zdC5fZGVmLm91dHB1dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZShpbnN0Ll9kZWYub3V0cHV0LCByZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGluc3QuaW1wbGVtZW50QXN5bmMgPSAoZnVuYykgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW1wbGVtZW50QXN5bmMoKSBtdXN0IGJlIGNhbGxlZCB3aXRoIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzeW5jIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRBcmdzID0gaW5zdC5fZGVmLmlucHV0ID8gYXdhaXQgcGFyc2VBc3luYyhpbnN0Ll9kZWYuaW5wdXQsIGFyZ3MpIDogYXJncztcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFJlZmxlY3QuYXBwbHkoZnVuYywgdGhpcywgcGFyc2VkQXJncyk7XG4gICAgICAgICAgICBpZiAoaW5zdC5fZGVmLm91dHB1dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBwYXJzZUFzeW5jKGluc3QuX2RlZi5vdXRwdXQsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgIH07XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLnZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiBvdXRwdXQgaXMgYSBwcm9taXNlIHR5cGUgdG8gZGV0ZXJtaW5lIGlmIHdlIHNob3VsZCB1c2UgYXN5bmMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgY29uc3QgaGFzUHJvbWlzZU91dHB1dCA9IGluc3QuX2RlZi5vdXRwdXQgJiYgaW5zdC5fZGVmLm91dHB1dC5fem9kLmRlZi50eXBlID09PSBcInByb21pc2VcIjtcbiAgICAgICAgaWYgKGhhc1Byb21pc2VPdXRwdXQpIHtcbiAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBpbnN0LmltcGxlbWVudEFzeW5jKHBheWxvYWQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IGluc3QuaW1wbGVtZW50KHBheWxvYWQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG4gICAgaW5zdC5pbnB1dCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IEYgPSBpbnN0LmNvbnN0cnVjdG9yO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzWzBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IG5ldyAkWm9kVHVwbGUoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInR1cGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBhcmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICByZXN0OiBhcmdzWzFdLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG91dHB1dDogaW5zdC5fZGVmLm91dHB1dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRih7XG4gICAgICAgICAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgICBpbnB1dDogYXJnc1swXSxcbiAgICAgICAgICAgIG91dHB1dDogaW5zdC5fZGVmLm91dHB1dCxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBpbnN0Lm91dHB1dCA9IChvdXRwdXQpID0+IHtcbiAgICAgICAgY29uc3QgRiA9IGluc3QuY29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiBuZXcgRih7XG4gICAgICAgICAgICB0eXBlOiBcImZ1bmN0aW9uXCIsXG4gICAgICAgICAgICBpbnB1dDogaW5zdC5fZGVmLmlucHV0LFxuICAgICAgICAgICAgb3V0cHV0LFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBpbnN0O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFByb21pc2UgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFByb21pc2VcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocGF5bG9hZC52YWx1ZSkudGhlbigoaW5uZXIpID0+IGRlZi5pbm5lclR5cGUuX3pvZC5ydW4oeyB2YWx1ZTogaW5uZXIsIGlzc3VlczogW10gfSwgY3R4KSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RMYXp5ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RMYXp5XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgLy8gQ2FjaGUgdGhlIHJlc29sdmVkIGlubmVyIHR5cGUgb24gdGhlIHNoYXJlZCBgZGVmYCBzbyBhbGwgY2xvbmVzIG9mIHRoaXNcbiAgICAvLyBsYXp5IChlLmcuIHZpYSBgLmRlc2NyaWJlKClgL2AubWV0YSgpYCkgc2hhcmUgdGhlIHNhbWUgaW5uZXIgaW5zdGFuY2UsXG4gICAgLy8gcHJlc2VydmluZyBpZGVudGl0eSBmb3IgY3ljbGUgZGV0ZWN0aW9uIG9uIHJlY3Vyc2l2ZSBzY2hlbWFzLlxuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwiaW5uZXJUeXBlXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgZCA9IGRlZjtcbiAgICAgICAgaWYgKCFkLl9jYWNoZWRJbm5lcilcbiAgICAgICAgICAgIGQuX2NhY2hlZElubmVyID0gZGVmLmdldHRlcigpO1xuICAgICAgICByZXR1cm4gZC5fY2FjaGVkSW5uZXI7XG4gICAgfSk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwYXR0ZXJuXCIsICgpID0+IGluc3QuX3pvZC5pbm5lclR5cGU/Ll96b2Q/LnBhdHRlcm4pO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicHJvcFZhbHVlc1wiLCAoKSA9PiBpbnN0Ll96b2QuaW5uZXJUeXBlPy5fem9kPy5wcm9wVmFsdWVzKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdGluXCIsICgpID0+IGluc3QuX3pvZC5pbm5lclR5cGU/Ll96b2Q/Lm9wdGluID8/IHVuZGVmaW5lZCk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRvdXRcIiwgKCkgPT4gaW5zdC5fem9kLmlubmVyVHlwZT8uX3pvZD8ub3B0b3V0ID8/IHVuZGVmaW5lZCk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbm5lciA9IGluc3QuX3pvZC5pbm5lclR5cGU7XG4gICAgICAgIHJldHVybiBpbm5lci5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ3VzdG9tID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDdXN0b21cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNoZWNrcy4kWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgXykgPT4ge1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3QgciA9IGRlZi5mbihpbnB1dCk7XG4gICAgICAgIGlmIChyIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHIudGhlbigocikgPT4gaGFuZGxlUmVmaW5lUmVzdWx0KHIsIHBheWxvYWQsIGlucHV0LCBpbnN0KSk7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlUmVmaW5lUmVzdWx0KHIsIHBheWxvYWQsIGlucHV0LCBpbnN0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZVJlZmluZVJlc3VsdChyZXN1bHQsIHBheWxvYWQsIGlucHV0LCBpbnN0KSB7XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgX2lzcyA9IHtcbiAgICAgICAgICAgIGNvZGU6IFwiY3VzdG9tXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsIC8vIGluY29ycG9yYXRlcyBwYXJhbXMuZXJyb3IgaW50byBpc3N1ZSByZXBvcnRpbmdcbiAgICAgICAgICAgIHBhdGg6IFsuLi4oaW5zdC5fem9kLmRlZi5wYXRoID8/IFtdKV0sIC8vIGluY29ycG9yYXRlcyBwYXJhbXMuZXJyb3IgaW50byBpc3N1ZSByZXBvcnRpbmdcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhaW5zdC5fem9kLmRlZi5hYm9ydCxcbiAgICAgICAgICAgIC8vIHBhcmFtczogaW5zdC5fem9kLmRlZi5wYXJhbXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChpbnN0Ll96b2QuZGVmLnBhcmFtcylcbiAgICAgICAgICAgIF9pc3MucGFyYW1zID0gaW5zdC5fem9kLmRlZi5wYXJhbXM7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2godXRpbC5pc3N1ZShfaXNzKSk7XG4gICAgfVxufVxuIiwidmFyIF9hO1xuZXhwb3J0IGNvbnN0ICRvdXRwdXQgPSBTeW1ib2woXCJab2RPdXRwdXRcIik7XG5leHBvcnQgY29uc3QgJGlucHV0ID0gU3ltYm9sKFwiWm9kSW5wdXRcIik7XG5leHBvcnQgY2xhc3MgJFpvZFJlZ2lzdHJ5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3IFdlYWtNYXAoKTtcbiAgICAgICAgdGhpcy5faWRtYXAgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGFkZChzY2hlbWEsIC4uLl9tZXRhKSB7XG4gICAgICAgIGNvbnN0IG1ldGEgPSBfbWV0YVswXTtcbiAgICAgICAgdGhpcy5fbWFwLnNldChzY2hlbWEsIG1ldGEpO1xuICAgICAgICBpZiAobWV0YSAmJiB0eXBlb2YgbWV0YSA9PT0gXCJvYmplY3RcIiAmJiBcImlkXCIgaW4gbWV0YSkge1xuICAgICAgICAgICAgdGhpcy5faWRtYXAuc2V0KG1ldGEuaWQsIHNjaGVtYSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgICB0aGlzLl9pZG1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlbW92ZShzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IHRoaXMuX21hcC5nZXQoc2NoZW1hKTtcbiAgICAgICAgaWYgKG1ldGEgJiYgdHlwZW9mIG1ldGEgPT09IFwib2JqZWN0XCIgJiYgXCJpZFwiIGluIG1ldGEpIHtcbiAgICAgICAgICAgIHRoaXMuX2lkbWFwLmRlbGV0ZShtZXRhLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAuZGVsZXRlKHNjaGVtYSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBnZXQoc2NoZW1hKSB7XG4gICAgICAgIC8vIHJldHVybiB0aGlzLl9tYXAuZ2V0KHNjaGVtYSkgYXMgYW55O1xuICAgICAgICAvLyBpbmhlcml0IG1ldGFkYXRhXG4gICAgICAgIGNvbnN0IHAgPSBzY2hlbWEuX3pvZC5wYXJlbnQ7XG4gICAgICAgIGlmIChwKSB7XG4gICAgICAgICAgICBjb25zdCBwbSA9IHsgLi4uKHRoaXMuZ2V0KHApID8/IHt9KSB9O1xuICAgICAgICAgICAgZGVsZXRlIHBtLmlkOyAvLyBkbyBub3QgaW5oZXJpdCBpZFxuICAgICAgICAgICAgY29uc3QgZiA9IHsgLi4ucG0sIC4uLnRoaXMuX21hcC5nZXQoc2NoZW1hKSB9O1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGYpLmxlbmd0aCA/IGYgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcC5nZXQoc2NoZW1hKTtcbiAgICB9XG4gICAgaGFzKHNjaGVtYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwLmhhcyhzY2hlbWEpO1xuICAgIH1cbn1cbi8vIHJlZ2lzdHJpZXNcbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RyeSgpIHtcbiAgICByZXR1cm4gbmV3ICRab2RSZWdpc3RyeSgpO1xufVxuKF9hID0gZ2xvYmFsVGhpcykuX196b2RfZ2xvYmFsUmVnaXN0cnkgPz8gKF9hLl9fem9kX2dsb2JhbFJlZ2lzdHJ5ID0gcmVnaXN0cnkoKSk7XG5leHBvcnQgY29uc3QgZ2xvYmFsUmVnaXN0cnkgPSBnbG9iYWxUaGlzLl9fem9kX2dsb2JhbFJlZ2lzdHJ5O1xuIiwiaW1wb3J0ICogYXMgY2hlY2tzIGZyb20gXCIuL2NoZWNrcy5qc1wiO1xuaW1wb3J0ICogYXMgcmVnaXN0cmllcyBmcm9tIFwiLi9yZWdpc3RyaWVzLmpzXCI7XG5pbXBvcnQgKiBhcyBzY2hlbWFzIGZyb20gXCIuL3NjaGVtYXMuanNcIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcIi4vdXRpbC5qc1wiO1xuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfc3RyaW5nKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2NvZXJjZWRTdHJpbmcoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBjb2VyY2U6IHRydWUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9lbWFpbChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJlbWFpbFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2d1aWQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiZ3VpZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3V1aWQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwidXVpZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3V1aWR2NChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJ1dWlkXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICB2ZXJzaW9uOiBcInY0XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91dWlkdjYoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwidXVpZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgdmVyc2lvbjogXCJ2NlwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdXVpZHY3KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcInV1aWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIHZlcnNpb246IFwidjdcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3VybChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJ1cmxcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9lbW9qaShDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJlbW9qaVwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX25hbm9pZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJuYW5vaWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vKipcbiAqIEBkZXByZWNhdGVkIENVSUQgdjEgaXMgZGVwcmVjYXRlZCBieSBpdHMgYXV0aG9ycyBkdWUgdG8gaW5mb3JtYXRpb24gbGVha2FnZVxuICogKHRpbWVzdGFtcHMgZW1iZWRkZWQgaW4gdGhlIGlkKS4gVXNlIHtAbGluayBfY3VpZDJ9IGluc3RlYWQuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhcmFsbGVsZHJpdmUvY3VpZC5cbiAqL1xuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY3VpZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJjdWlkXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY3VpZDIoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiY3VpZDJcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91bGlkKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcInVsaWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF94aWQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwieGlkXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfa3N1aWQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwia3N1aWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pcHY0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImlwdjRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pcHY2KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImlwdjZcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9tYWMoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwibWFjXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY2lkcnY0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImNpZHJ2NFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2NpZHJ2NihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJjaWRydjZcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9iYXNlNjQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiYmFzZTY0XCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfYmFzZTY0dXJsKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImJhc2U2NHVybFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2UxNjQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiZTE2NFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2p3dChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJqd3RcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgVGltZVByZWNpc2lvbiA9IHtcbiAgICBBbnk6IG51bGwsXG4gICAgTWludXRlOiAtMSxcbiAgICBTZWNvbmQ6IDAsXG4gICAgTWlsbGlzZWNvbmQ6IDMsXG4gICAgTWljcm9zZWNvbmQ6IDYsXG59O1xuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfaXNvRGF0ZVRpbWUoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBvZmZzZXQ6IGZhbHNlLFxuICAgICAgICBsb2NhbDogZmFsc2UsXG4gICAgICAgIHByZWNpc2lvbjogbnVsbCxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2lzb0RhdGUoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiZGF0ZVwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pc29UaW1lKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcInRpbWVcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBwcmVjaXNpb246IG51bGwsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pc29EdXJhdGlvbihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJkdXJhdGlvblwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9udW1iZXIoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY29lcmNlZE51bWJlcihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNvZXJjZTogdHJ1ZSxcbiAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2ludChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNoZWNrOiBcIm51bWJlcl9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwic2FmZWludFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZmxvYXQzMihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNoZWNrOiBcIm51bWJlcl9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwiZmxvYXQzMlwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZmxvYXQ2NChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNoZWNrOiBcIm51bWJlcl9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwiZmxvYXQ2NFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfaW50MzIoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICBjaGVjazogXCJudW1iZXJfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgZm9ybWF0OiBcImludDMyXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91aW50MzIoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICBjaGVjazogXCJudW1iZXJfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgZm9ybWF0OiBcInVpbnQzMlwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfYm9vbGVhbihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY29lcmNlZEJvb2xlYW4oQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgICAgY29lcmNlOiB0cnVlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfYmlnaW50KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJiaWdpbnRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2NvZXJjZWRCaWdpbnQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImJpZ2ludFwiLFxuICAgICAgICBjb2VyY2U6IHRydWUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pbnQ2NChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYmlnaW50XCIsXG4gICAgICAgIGNoZWNrOiBcImJpZ2ludF9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwiaW50NjRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3VpbnQ2NChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYmlnaW50XCIsXG4gICAgICAgIGNoZWNrOiBcImJpZ2ludF9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwidWludDY0XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zeW1ib2woQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN5bWJvbFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdW5kZWZpbmVkKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ1bmRlZmluZWRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX251bGwoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm51bGxcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2FueShDbGFzcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImFueVwiLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdW5rbm93bihDbGFzcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInVua25vd25cIixcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX25ldmVyKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJuZXZlclwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdm9pZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwidm9pZFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZGF0ZShDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY29lcmNlZERhdGUoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgY29lcmNlOiB0cnVlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbmFuKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJuYW5cIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2x0KHZhbHVlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tMZXNzVGhhbih7XG4gICAgICAgIGNoZWNrOiBcImxlc3NfdGhhblwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2x0ZSh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTGVzc1RoYW4oe1xuICAgICAgICBjaGVjazogXCJsZXNzX3RoYW5cIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICB9KTtcbn1cbmV4cG9ydCB7IFxuLyoqIEBkZXByZWNhdGVkIFVzZSBgei5sdGUoKWAgaW5zdGVhZC4gKi9cbl9sdGUgYXMgX21heCwgfTtcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2d0KHZhbHVlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tHcmVhdGVyVGhhbih7XG4gICAgICAgIGNoZWNrOiBcImdyZWF0ZXJfdGhhblwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2d0ZSh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrR3JlYXRlclRoYW4oe1xuICAgICAgICBjaGVjazogXCJncmVhdGVyX3RoYW5cIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICB9KTtcbn1cbmV4cG9ydCB7IFxuLyoqIEBkZXByZWNhdGVkIFVzZSBgei5ndGUoKWAgaW5zdGVhZC4gKi9cbl9ndGUgYXMgX21pbiwgfTtcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3Bvc2l0aXZlKHBhcmFtcykge1xuICAgIHJldHVybiBfZ3QoMCwgcGFyYW1zKTtcbn1cbi8vIG5lZ2F0aXZlXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9uZWdhdGl2ZShwYXJhbXMpIHtcbiAgICByZXR1cm4gX2x0KDAsIHBhcmFtcyk7XG59XG4vLyBub25wb3NpdGl2ZVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbm9ucG9zaXRpdmUocGFyYW1zKSB7XG4gICAgcmV0dXJuIF9sdGUoMCwgcGFyYW1zKTtcbn1cbi8vIG5vbm5lZ2F0aXZlXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9ub25uZWdhdGl2ZShwYXJhbXMpIHtcbiAgICByZXR1cm4gX2d0ZSgwLCBwYXJhbXMpO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbXVsdGlwbGVPZih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTXVsdGlwbGVPZih7XG4gICAgICAgIGNoZWNrOiBcIm11bHRpcGxlX29mXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIHZhbHVlLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbWF4U2l6ZShtYXhpbXVtLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tNYXhTaXplKHtcbiAgICAgICAgY2hlY2s6IFwibWF4X3NpemVcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgbWF4aW11bSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX21pblNpemUobWluaW11bSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTWluU2l6ZSh7XG4gICAgICAgIGNoZWNrOiBcIm1pbl9zaXplXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIG1pbmltdW0sXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zaXplKHNpemUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja1NpemVFcXVhbHMoe1xuICAgICAgICBjaGVjazogXCJzaXplX2VxdWFsc1wiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBzaXplLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbWF4TGVuZ3RoKG1heGltdW0sIHBhcmFtcykge1xuICAgIGNvbnN0IGNoID0gbmV3IGNoZWNrcy4kWm9kQ2hlY2tNYXhMZW5ndGgoe1xuICAgICAgICBjaGVjazogXCJtYXhfbGVuZ3RoXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIG1heGltdW0sXG4gICAgfSk7XG4gICAgcmV0dXJuIGNoO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbWluTGVuZ3RoKG1pbmltdW0sIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja01pbkxlbmd0aCh7XG4gICAgICAgIGNoZWNrOiBcIm1pbl9sZW5ndGhcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgbWluaW11bSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2xlbmd0aChsZW5ndGgsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja0xlbmd0aEVxdWFscyh7XG4gICAgICAgIGNoZWNrOiBcImxlbmd0aF9lcXVhbHNcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgbGVuZ3RoLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfcmVnZXgocGF0dGVybiwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrUmVnZXgoe1xuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGZvcm1hdDogXCJyZWdleFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBwYXR0ZXJuLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbG93ZXJjYXNlKHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja0xvd2VyQ2FzZSh7XG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgZm9ybWF0OiBcImxvd2VyY2FzZVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdXBwZXJjYXNlKHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja1VwcGVyQ2FzZSh7XG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgZm9ybWF0OiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfaW5jbHVkZXMoaW5jbHVkZXMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja0luY2x1ZGVzKHtcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBmb3JtYXQ6IFwiaW5jbHVkZXNcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgaW5jbHVkZXMsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zdGFydHNXaXRoKHByZWZpeCwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrU3RhcnRzV2l0aCh7XG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgZm9ybWF0OiBcInN0YXJ0c193aXRoXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIHByZWZpeCxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2VuZHNXaXRoKHN1ZmZpeCwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrRW5kc1dpdGgoe1xuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGZvcm1hdDogXCJlbmRzX3dpdGhcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgc3VmZml4LFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfcHJvcGVydHkocHJvcGVydHksIHNjaGVtYSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrUHJvcGVydHkoe1xuICAgICAgICBjaGVjazogXCJwcm9wZXJ0eVwiLFxuICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbWltZSh0eXBlcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTWltZVR5cGUoe1xuICAgICAgICBjaGVjazogXCJtaW1lX3R5cGVcIixcbiAgICAgICAgbWltZTogdHlwZXMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9vdmVyd3JpdGUodHgpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tPdmVyd3JpdGUoe1xuICAgICAgICBjaGVjazogXCJvdmVyd3JpdGVcIixcbiAgICAgICAgdHgsXG4gICAgfSk7XG59XG4vLyBub3JtYWxpemVcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX25vcm1hbGl6ZShmb3JtKSB7XG4gICAgcmV0dXJuIF9vdmVyd3JpdGUoKGlucHV0KSA9PiBpbnB1dC5ub3JtYWxpemUoZm9ybSkpO1xufVxuLy8gdHJpbVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdHJpbSgpIHtcbiAgICByZXR1cm4gX292ZXJ3cml0ZSgoaW5wdXQpID0+IGlucHV0LnRyaW0oKSk7XG59XG4vLyB0b0xvd2VyQ2FzZVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdG9Mb3dlckNhc2UoKSB7XG4gICAgcmV0dXJuIF9vdmVyd3JpdGUoKGlucHV0KSA9PiBpbnB1dC50b0xvd2VyQ2FzZSgpKTtcbn1cbi8vIHRvVXBwZXJDYXNlXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF90b1VwcGVyQ2FzZSgpIHtcbiAgICByZXR1cm4gX292ZXJ3cml0ZSgoaW5wdXQpID0+IGlucHV0LnRvVXBwZXJDYXNlKCkpO1xufVxuLy8gc2x1Z2lmeVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfc2x1Z2lmeSgpIHtcbiAgICByZXR1cm4gX292ZXJ3cml0ZSgoaW5wdXQpID0+IHV0aWwuc2x1Z2lmeShpbnB1dCkpO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfYXJyYXkoQ2xhc3MsIGVsZW1lbnQsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIC8vIGdldCBlbGVtZW50KCkge1xuICAgICAgICAvLyAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAvLyB9LFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdW5pb24oQ2xhc3MsIG9wdGlvbnMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInVuaW9uXCIsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gX3hvcihDbGFzcywgb3B0aW9ucywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwidW5pb25cIixcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2Rpc2NyaW1pbmF0ZWRVbmlvbihDbGFzcywgZGlzY3JpbWluYXRvciwgb3B0aW9ucywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwidW5pb25cIixcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgZGlzY3JpbWluYXRvcixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2ludGVyc2VjdGlvbihDbGFzcywgbGVmdCwgcmlnaHQpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJpbnRlcnNlY3Rpb25cIixcbiAgICAgICAgbGVmdCxcbiAgICAgICAgcmlnaHQsXG4gICAgfSk7XG59XG4vLyBleHBvcnQgZnVuY3Rpb24gX3R1cGxlKFxuLy8gICBDbGFzczogdXRpbC5TY2hlbWFDbGFzczxzY2hlbWFzLiRab2RUdXBsZT4sXG4vLyAgIGl0ZW1zOiBbXSxcbi8vICAgcGFyYW1zPzogc3RyaW5nIHwgJFpvZFR1cGxlUGFyYW1zXG4vLyApOiBzY2hlbWFzLiRab2RUdXBsZTxbXSwgbnVsbD47XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF90dXBsZShDbGFzcywgaXRlbXMsIF9wYXJhbXNPclJlc3QsIF9wYXJhbXMpIHtcbiAgICBjb25zdCBoYXNSZXN0ID0gX3BhcmFtc09yUmVzdCBpbnN0YW5jZW9mIHNjaGVtYXMuJFpvZFR5cGU7XG4gICAgY29uc3QgcGFyYW1zID0gaGFzUmVzdCA/IF9wYXJhbXMgOiBfcGFyYW1zT3JSZXN0O1xuICAgIGNvbnN0IHJlc3QgPSBoYXNSZXN0ID8gX3BhcmFtc09yUmVzdCA6IG51bGw7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwidHVwbGVcIixcbiAgICAgICAgaXRlbXMsXG4gICAgICAgIHJlc3QsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9yZWNvcmQoQ2xhc3MsIGtleVR5cGUsIHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwicmVjb3JkXCIsXG4gICAgICAgIGtleVR5cGUsXG4gICAgICAgIHZhbHVlVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX21hcChDbGFzcywga2V5VHlwZSwgdmFsdWVUeXBlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJtYXBcIixcbiAgICAgICAga2V5VHlwZSxcbiAgICAgICAgdmFsdWVUeXBlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfc2V0KENsYXNzLCB2YWx1ZVR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInNldFwiLFxuICAgICAgICB2YWx1ZVR5cGUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9lbnVtKENsYXNzLCB2YWx1ZXMsIHBhcmFtcykge1xuICAgIGNvbnN0IGVudHJpZXMgPSBBcnJheS5pc0FycmF5KHZhbHVlcykgPyBPYmplY3QuZnJvbUVudHJpZXModmFsdWVzLm1hcCgodikgPT4gW3YsIHZdKSkgOiB2YWx1ZXM7XG4gICAgLy8gaWYgKEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgIC8vICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAvLyAgICAgZW50cmllc1t2YWx1ZV0gPSB2YWx1ZTtcbiAgICAvLyAgIH1cbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgT2JqZWN0LmFzc2lnbihlbnRyaWVzLCB2YWx1ZXMpO1xuICAgIC8vIH1cbiAgICAvLyBjb25zdCBlbnRyaWVzOiB1dGlsLkVudW1MaWtlID0ge307XG4gICAgLy8gZm9yIChjb25zdCB2YWwgb2YgdmFsdWVzKSB7XG4gICAgLy8gICBlbnRyaWVzW3ZhbF0gPSB2YWw7XG4gICAgLy8gfVxuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImVudW1cIixcbiAgICAgICAgZW50cmllcyxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG4vKiogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaGFzIGJlZW4gbWVyZ2VkIGludG8gYHouZW51bSgpYC4gVXNlIGB6LmVudW0oKWAgaW5zdGVhZC5cbiAqXG4gKiBgYGB0c1xuICogZW51bSBDb2xvcnMgeyByZWQsIGdyZWVuLCBibHVlIH1cbiAqIHouZW51bShDb2xvcnMpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfbmF0aXZlRW51bShDbGFzcywgZW50cmllcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiZW51bVwiLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbGl0ZXJhbChDbGFzcywgdmFsdWUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImxpdGVyYWxcIixcbiAgICAgICAgdmFsdWVzOiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2ZpbGUoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImZpbGVcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3RyYW5zZm9ybShDbGFzcywgZm4pIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ0cmFuc2Zvcm1cIixcbiAgICAgICAgdHJhbnNmb3JtOiBmbixcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX29wdGlvbmFsKENsYXNzLCBpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJvcHRpb25hbFwiLFxuICAgICAgICBpbm5lclR5cGUsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9udWxsYWJsZShDbGFzcywgaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVsbGFibGVcIixcbiAgICAgICAgaW5uZXJUeXBlLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZGVmYXVsdChDbGFzcywgaW5uZXJUeXBlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJkZWZhdWx0XCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICAgICAgZ2V0IGRlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZGVmYXVsdFZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0VmFsdWUoKSA6IHV0aWwuc2hhbGxvd0Nsb25lKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9ub25vcHRpb25hbChDbGFzcywgaW5uZXJUeXBlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJub25vcHRpb25hbFwiLFxuICAgICAgICBpbm5lclR5cGUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zdWNjZXNzKENsYXNzLCBpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2NhdGNoKENsYXNzLCBpbm5lclR5cGUsIGNhdGNoVmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJjYXRjaFwiLFxuICAgICAgICBpbm5lclR5cGUsXG4gICAgICAgIGNhdGNoVmFsdWU6ICh0eXBlb2YgY2F0Y2hWYWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gY2F0Y2hWYWx1ZSA6ICgpID0+IGNhdGNoVmFsdWUpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfcGlwZShDbGFzcywgaW5fLCBvdXQpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJwaXBlXCIsXG4gICAgICAgIGluOiBpbl8sXG4gICAgICAgIG91dCxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3JlYWRvbmx5KENsYXNzLCBpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJyZWFkb25seVwiLFxuICAgICAgICBpbm5lclR5cGUsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF90ZW1wbGF0ZUxpdGVyYWwoQ2xhc3MsIHBhcnRzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ0ZW1wbGF0ZV9saXRlcmFsXCIsXG4gICAgICAgIHBhcnRzLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbGF6eShDbGFzcywgZ2V0dGVyKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibGF6eVwiLFxuICAgICAgICBnZXR0ZXIsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9wcm9taXNlKENsYXNzLCBpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJwcm9taXNlXCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2N1c3RvbShDbGFzcywgZm4sIF9wYXJhbXMpIHtcbiAgICBjb25zdCBub3JtID0gdXRpbC5ub3JtYWxpemVQYXJhbXMoX3BhcmFtcyk7XG4gICAgbm9ybS5hYm9ydCA/PyAobm9ybS5hYm9ydCA9IHRydWUpOyAvLyBkZWZhdWx0IHRvIGFib3J0OmZhbHNlXG4gICAgY29uc3Qgc2NoZW1hID0gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJjdXN0b21cIixcbiAgICAgICAgY2hlY2s6IFwiY3VzdG9tXCIsXG4gICAgICAgIGZuOiBmbixcbiAgICAgICAgLi4ubm9ybSxcbiAgICB9KTtcbiAgICByZXR1cm4gc2NoZW1hO1xufVxuLy8gc2FtZSBhcyBfY3VzdG9tIGJ1dCBkZWZhdWx0cyB0byBhYm9ydDpmYWxzZVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfcmVmaW5lKENsYXNzLCBmbiwgX3BhcmFtcykge1xuICAgIGNvbnN0IHNjaGVtYSA9IG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiY3VzdG9tXCIsXG4gICAgICAgIGNoZWNrOiBcImN1c3RvbVwiLFxuICAgICAgICBmbjogZm4sXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKF9wYXJhbXMpLFxuICAgIH0pO1xuICAgIHJldHVybiBzY2hlbWE7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zdXBlclJlZmluZShmbiwgcGFyYW1zKSB7XG4gICAgY29uc3QgY2ggPSBfY2hlY2soKHBheWxvYWQpID0+IHtcbiAgICAgICAgcGF5bG9hZC5hZGRJc3N1ZSA9IChpc3N1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpc3N1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2godXRpbC5pc3N1ZShpc3N1ZSwgcGF5bG9hZC52YWx1ZSwgY2guX3pvZC5kZWYpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGZvciBab2QgMyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgIGNvbnN0IF9pc3N1ZSA9IGlzc3VlO1xuICAgICAgICAgICAgICAgIGlmIChfaXNzdWUuZmF0YWwpXG4gICAgICAgICAgICAgICAgICAgIF9pc3N1ZS5jb250aW51ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF9pc3N1ZS5jb2RlID8/IChfaXNzdWUuY29kZSA9IFwiY3VzdG9tXCIpO1xuICAgICAgICAgICAgICAgIF9pc3N1ZS5pbnB1dCA/PyAoX2lzc3VlLmlucHV0ID0gcGF5bG9hZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgX2lzc3VlLmluc3QgPz8gKF9pc3N1ZS5pbnN0ID0gY2gpO1xuICAgICAgICAgICAgICAgIF9pc3N1ZS5jb250aW51ZSA/PyAoX2lzc3VlLmNvbnRpbnVlID0gIWNoLl96b2QuZGVmLmFib3J0KTsgLy8gYWJvcnQgaXMgYWx3YXlzIHVuZGVmaW5lZCwgc28gdGhpcyBpcyBhbHdheXMgdHJ1ZS4uLlxuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2godXRpbC5pc3N1ZShfaXNzdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZuKHBheWxvYWQudmFsdWUsIHBheWxvYWQpO1xuICAgIH0sIHBhcmFtcyk7XG4gICAgcmV0dXJuIGNoO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY2hlY2soZm4sIHBhcmFtcykge1xuICAgIGNvbnN0IGNoID0gbmV3IGNoZWNrcy4kWm9kQ2hlY2soe1xuICAgICAgICBjaGVjazogXCJjdXN0b21cIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbiAgICBjaC5fem9kLmNoZWNrID0gZm47XG4gICAgcmV0dXJuIGNoO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmliZShkZXNjcmlwdGlvbikge1xuICAgIGNvbnN0IGNoID0gbmV3IGNoZWNrcy4kWm9kQ2hlY2soeyBjaGVjazogXCJkZXNjcmliZVwiIH0pO1xuICAgIGNoLl96b2Qub25hdHRhY2ggPSBbXG4gICAgICAgIChpbnN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZyA9IHJlZ2lzdHJpZXMuZ2xvYmFsUmVnaXN0cnkuZ2V0KGluc3QpID8/IHt9O1xuICAgICAgICAgICAgcmVnaXN0cmllcy5nbG9iYWxSZWdpc3RyeS5hZGQoaW5zdCwgeyAuLi5leGlzdGluZywgZGVzY3JpcHRpb24gfSk7XG4gICAgICAgIH0sXG4gICAgXTtcbiAgICBjaC5fem9kLmNoZWNrID0gKCkgPT4geyB9OyAvLyBuby1vcCBjaGVja1xuICAgIHJldHVybiBjaDtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gbWV0YShtZXRhZGF0YSkge1xuICAgIGNvbnN0IGNoID0gbmV3IGNoZWNrcy4kWm9kQ2hlY2soeyBjaGVjazogXCJtZXRhXCIgfSk7XG4gICAgY2guX3pvZC5vbmF0dGFjaCA9IFtcbiAgICAgICAgKGluc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gcmVnaXN0cmllcy5nbG9iYWxSZWdpc3RyeS5nZXQoaW5zdCkgPz8ge307XG4gICAgICAgICAgICByZWdpc3RyaWVzLmdsb2JhbFJlZ2lzdHJ5LmFkZChpbnN0LCB7IC4uLmV4aXN0aW5nLCAuLi5tZXRhZGF0YSB9KTtcbiAgICAgICAgfSxcbiAgICBdO1xuICAgIGNoLl96b2QuY2hlY2sgPSAoKSA9PiB7IH07IC8vIG5vLW9wIGNoZWNrXG4gICAgcmV0dXJuIGNoO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfc3RyaW5nYm9vbChDbGFzc2VzLCBfcGFyYW1zKSB7XG4gICAgY29uc3QgcGFyYW1zID0gdXRpbC5ub3JtYWxpemVQYXJhbXMoX3BhcmFtcyk7XG4gICAgbGV0IHRydXRoeUFycmF5ID0gcGFyYW1zLnRydXRoeSA/PyBbXCJ0cnVlXCIsIFwiMVwiLCBcInllc1wiLCBcIm9uXCIsIFwieVwiLCBcImVuYWJsZWRcIl07XG4gICAgbGV0IGZhbHN5QXJyYXkgPSBwYXJhbXMuZmFsc3kgPz8gW1wiZmFsc2VcIiwgXCIwXCIsIFwibm9cIiwgXCJvZmZcIiwgXCJuXCIsIFwiZGlzYWJsZWRcIl07XG4gICAgaWYgKHBhcmFtcy5jYXNlICE9PSBcInNlbnNpdGl2ZVwiKSB7XG4gICAgICAgIHRydXRoeUFycmF5ID0gdHJ1dGh5QXJyYXkubWFwKCh2KSA9PiAodHlwZW9mIHYgPT09IFwic3RyaW5nXCIgPyB2LnRvTG93ZXJDYXNlKCkgOiB2KSk7XG4gICAgICAgIGZhbHN5QXJyYXkgPSBmYWxzeUFycmF5Lm1hcCgodikgPT4gKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiID8gdi50b0xvd2VyQ2FzZSgpIDogdikpO1xuICAgIH1cbiAgICBjb25zdCB0cnV0aHlTZXQgPSBuZXcgU2V0KHRydXRoeUFycmF5KTtcbiAgICBjb25zdCBmYWxzeVNldCA9IG5ldyBTZXQoZmFsc3lBcnJheSk7XG4gICAgY29uc3QgX0NvZGVjID0gQ2xhc3Nlcy5Db2RlYyA/PyBzY2hlbWFzLiRab2RDb2RlYztcbiAgICBjb25zdCBfQm9vbGVhbiA9IENsYXNzZXMuQm9vbGVhbiA/PyBzY2hlbWFzLiRab2RCb29sZWFuO1xuICAgIGNvbnN0IF9TdHJpbmcgPSBDbGFzc2VzLlN0cmluZyA/PyBzY2hlbWFzLiRab2RTdHJpbmc7XG4gICAgY29uc3Qgc3RyaW5nU2NoZW1hID0gbmV3IF9TdHJpbmcoeyB0eXBlOiBcInN0cmluZ1wiLCBlcnJvcjogcGFyYW1zLmVycm9yIH0pO1xuICAgIGNvbnN0IGJvb2xlYW5TY2hlbWEgPSBuZXcgX0Jvb2xlYW4oeyB0eXBlOiBcImJvb2xlYW5cIiwgZXJyb3I6IHBhcmFtcy5lcnJvciB9KTtcbiAgICBjb25zdCBjb2RlYyA9IG5ldyBfQ29kZWMoe1xuICAgICAgICB0eXBlOiBcInBpcGVcIixcbiAgICAgICAgaW46IHN0cmluZ1NjaGVtYSxcbiAgICAgICAgb3V0OiBib29sZWFuU2NoZW1hLFxuICAgICAgICB0cmFuc2Zvcm06ICgoaW5wdXQsIHBheWxvYWQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gaW5wdXQ7XG4gICAgICAgICAgICBpZiAocGFyYW1zLmNhc2UgIT09IFwic2Vuc2l0aXZlXCIpXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmICh0cnV0aHlTZXQuaGFzKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChmYWxzeVNldC5oYXMoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3ZhbHVlXCIsXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcInN0cmluZ2Jvb2xcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzOiBbLi4udHJ1dGh5U2V0LCAuLi5mYWxzeVNldF0sXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpbnN0OiBjb2RlYyxcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm06ICgoaW5wdXQsIF9wYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5wdXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1dGh5QXJyYXlbMF0gfHwgXCJ0cnVlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc3lBcnJheVswXSB8fCBcImZhbHNlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgICBlcnJvcjogcGFyYW1zLmVycm9yLFxuICAgIH0pO1xuICAgIHJldHVybiBjb2RlYztcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3N0cmluZ0Zvcm1hdChDbGFzcywgZm9ybWF0LCBmbk9yUmVnZXgsIF9wYXJhbXMgPSB7fSkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHV0aWwubm9ybWFsaXplUGFyYW1zKF9wYXJhbXMpO1xuICAgIGNvbnN0IGRlZiA9IHtcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMoX3BhcmFtcyksXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0LFxuICAgICAgICBmbjogdHlwZW9mIGZuT3JSZWdleCA9PT0gXCJmdW5jdGlvblwiID8gZm5PclJlZ2V4IDogKHZhbCkgPT4gZm5PclJlZ2V4LnRlc3QodmFsKSxcbiAgICAgICAgLi4ucGFyYW1zLFxuICAgIH07XG4gICAgaWYgKGZuT3JSZWdleCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBkZWYucGF0dGVybiA9IGZuT3JSZWdleDtcbiAgICB9XG4gICAgY29uc3QgaW5zdCA9IG5ldyBDbGFzcyhkZWYpO1xuICAgIHJldHVybiBpbnN0O1xufVxuIiwiaW1wb3J0IHsgZ2xvYmFsUmVnaXN0cnkgfSBmcm9tIFwiLi9yZWdpc3RyaWVzLmpzXCI7XG4vLyBmdW5jdGlvbiBpbml0aWFsaXplQ29udGV4dDxUIGV4dGVuZHMgc2NoZW1hcy4kWm9kVHlwZT4oaW5wdXRzOiBKU09OU2NoZW1hR2VuZXJhdG9yUGFyYW1zPFQ+KTogVG9KU09OU2NoZW1hQ29udGV4dDxUPiB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgcHJvY2Vzc29yOiBpbnB1dHMucHJvY2Vzc29yLFxuLy8gICAgIG1ldGFkYXRhUmVnaXN0cnk6IGlucHV0cy5tZXRhZGF0YSA/PyBnbG9iYWxSZWdpc3RyeSxcbi8vICAgICB0YXJnZXQ6IGlucHV0cy50YXJnZXQgPz8gXCJkcmFmdC0yMDIwLTEyXCIsXG4vLyAgICAgdW5yZXByZXNlbnRhYmxlOiBpbnB1dHMudW5yZXByZXNlbnRhYmxlID8/IFwidGhyb3dcIixcbi8vICAgfTtcbi8vIH1cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplQ29udGV4dChwYXJhbXMpIHtcbiAgICAvLyBOb3JtYWxpemUgdGFyZ2V0OiBjb252ZXJ0IG9sZCBub24taHlwaGVuYXRlZCB2ZXJzaW9ucyB0byBoeXBoZW5hdGVkIHZlcnNpb25zXG4gICAgbGV0IHRhcmdldCA9IHBhcmFtcz8udGFyZ2V0ID8/IFwiZHJhZnQtMjAyMC0xMlwiO1xuICAgIGlmICh0YXJnZXQgPT09IFwiZHJhZnQtNFwiKVxuICAgICAgICB0YXJnZXQgPSBcImRyYWZ0LTA0XCI7XG4gICAgaWYgKHRhcmdldCA9PT0gXCJkcmFmdC03XCIpXG4gICAgICAgIHRhcmdldCA9IFwiZHJhZnQtMDdcIjtcbiAgICByZXR1cm4ge1xuICAgICAgICBwcm9jZXNzb3JzOiBwYXJhbXMucHJvY2Vzc29ycyA/PyB7fSxcbiAgICAgICAgbWV0YWRhdGFSZWdpc3RyeTogcGFyYW1zPy5tZXRhZGF0YSA/PyBnbG9iYWxSZWdpc3RyeSxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICB1bnJlcHJlc2VudGFibGU6IHBhcmFtcz8udW5yZXByZXNlbnRhYmxlID8/IFwidGhyb3dcIixcbiAgICAgICAgb3ZlcnJpZGU6IHBhcmFtcz8ub3ZlcnJpZGUgPz8gKCgpID0+IHsgfSksXG4gICAgICAgIGlvOiBwYXJhbXM/LmlvID8/IFwib3V0cHV0XCIsXG4gICAgICAgIGNvdW50ZXI6IDAsXG4gICAgICAgIHNlZW46IG5ldyBNYXAoKSxcbiAgICAgICAgY3ljbGVzOiBwYXJhbXM/LmN5Y2xlcyA/PyBcInJlZlwiLFxuICAgICAgICByZXVzZWQ6IHBhcmFtcz8ucmV1c2VkID8/IFwiaW5saW5lXCIsXG4gICAgICAgIGV4dGVybmFsOiBwYXJhbXM/LmV4dGVybmFsID8/IHVuZGVmaW5lZCxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3Moc2NoZW1hLCBjdHgsIF9wYXJhbXMgPSB7IHBhdGg6IFtdLCBzY2hlbWFQYXRoOiBbXSB9KSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICAvLyBjaGVjayBmb3Igc2NoZW1hIGluIHNlZW5zXG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIGlmIChzZWVuKSB7XG4gICAgICAgIHNlZW4uY291bnQrKztcbiAgICAgICAgLy8gY2hlY2sgaWYgY3ljbGVcbiAgICAgICAgY29uc3QgaXNDeWNsZSA9IF9wYXJhbXMuc2NoZW1hUGF0aC5pbmNsdWRlcyhzY2hlbWEpO1xuICAgICAgICBpZiAoaXNDeWNsZSkge1xuICAgICAgICAgICAgc2Vlbi5jeWNsZSA9IF9wYXJhbXMucGF0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2Vlbi5zY2hlbWE7XG4gICAgfVxuICAgIC8vIGluaXRpYWxpemVcbiAgICBjb25zdCByZXN1bHQgPSB7IHNjaGVtYToge30sIGNvdW50OiAxLCBjeWNsZTogdW5kZWZpbmVkLCBwYXRoOiBfcGFyYW1zLnBhdGggfTtcbiAgICBjdHguc2Vlbi5zZXQoc2NoZW1hLCByZXN1bHQpO1xuICAgIC8vIGN1c3RvbSBtZXRob2Qgb3ZlcnJpZGVzIGRlZmF1bHQgYmVoYXZpb3JcbiAgICBjb25zdCBvdmVycmlkZVNjaGVtYSA9IHNjaGVtYS5fem9kLnRvSlNPTlNjaGVtYT8uKCk7XG4gICAgaWYgKG92ZXJyaWRlU2NoZW1hKSB7XG4gICAgICAgIHJlc3VsdC5zY2hlbWEgPSBvdmVycmlkZVNjaGVtYTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIC4uLl9wYXJhbXMsXG4gICAgICAgICAgICBzY2hlbWFQYXRoOiBbLi4uX3BhcmFtcy5zY2hlbWFQYXRoLCBzY2hlbWFdLFxuICAgICAgICAgICAgcGF0aDogX3BhcmFtcy5wYXRoLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoc2NoZW1hLl96b2QucHJvY2Vzc0pTT05TY2hlbWEpIHtcbiAgICAgICAgICAgIHNjaGVtYS5fem9kLnByb2Nlc3NKU09OU2NoZW1hKGN0eCwgcmVzdWx0LnNjaGVtYSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IF9qc29uID0gcmVzdWx0LnNjaGVtYTtcbiAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NvciA9IGN0eC5wcm9jZXNzb3JzW2RlZi50eXBlXTtcbiAgICAgICAgICAgIGlmICghcHJvY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBbdG9KU09OU2NoZW1hXTogTm9uLXJlcHJlc2VudGFibGUgdHlwZSBlbmNvdW50ZXJlZDogJHtkZWYudHlwZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb2Nlc3NvcihzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyZW50ID0gc2NoZW1hLl96b2QucGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICAvLyBBbHNvIHNldCByZWYgaWYgcHJvY2Vzc29yIGRpZG4ndCAoZm9yIGluaGVyaXRhbmNlKVxuICAgICAgICAgICAgaWYgKCFyZXN1bHQucmVmKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5yZWYgPSBwYXJlbnQ7XG4gICAgICAgICAgICBwcm9jZXNzKHBhcmVudCwgY3R4LCBwYXJhbXMpO1xuICAgICAgICAgICAgY3R4LnNlZW4uZ2V0KHBhcmVudCkuaXNQYXJlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIG1ldGFkYXRhXG4gICAgY29uc3QgbWV0YSA9IGN0eC5tZXRhZGF0YVJlZ2lzdHJ5LmdldChzY2hlbWEpO1xuICAgIGlmIChtZXRhKVxuICAgICAgICBPYmplY3QuYXNzaWduKHJlc3VsdC5zY2hlbWEsIG1ldGEpO1xuICAgIGlmIChjdHguaW8gPT09IFwiaW5wdXRcIiAmJiBpc1RyYW5zZm9ybWluZyhzY2hlbWEpKSB7XG4gICAgICAgIC8vIGV4YW1wbGVzL2RlZmF1bHRzIG9ubHkgYXBwbHkgdG8gb3V0cHV0IHR5cGUgb2YgcGlwZVxuICAgICAgICBkZWxldGUgcmVzdWx0LnNjaGVtYS5leGFtcGxlcztcbiAgICAgICAgZGVsZXRlIHJlc3VsdC5zY2hlbWEuZGVmYXVsdDtcbiAgICB9XG4gICAgLy8gc2V0IHByZWZhdWx0IGFzIGRlZmF1bHRcbiAgICBpZiAoY3R4LmlvID09PSBcImlucHV0XCIgJiYgXCJfcHJlZmF1bHRcIiBpbiByZXN1bHQuc2NoZW1hKVxuICAgICAgICAoX2EgPSByZXN1bHQuc2NoZW1hKS5kZWZhdWx0ID8/IChfYS5kZWZhdWx0ID0gcmVzdWx0LnNjaGVtYS5fcHJlZmF1bHQpO1xuICAgIGRlbGV0ZSByZXN1bHQuc2NoZW1hLl9wcmVmYXVsdDtcbiAgICAvLyBwdWxsaW5nIGZyZXNoIGZyb20gY3R4LnNlZW4gaW4gY2FzZSBpdCB3YXMgb3ZlcndyaXR0ZW5cbiAgICBjb25zdCBfcmVzdWx0ID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgcmV0dXJuIF9yZXN1bHQuc2NoZW1hO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3REZWZzKGN0eCwgc2NoZW1hXG4vLyBwYXJhbXM6IEVtaXRQYXJhbXNcbikge1xuICAgIC8vIGl0ZXJhdGUgb3ZlciBzZWVuIG1hcDtcbiAgICBjb25zdCByb290ID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgaWYgKCFyb290KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnByb2Nlc3NlZCBzY2hlbWEuIFRoaXMgaXMgYSBidWcgaW4gWm9kLlwiKTtcbiAgICAvLyBUcmFjayBpZHMgdG8gZGV0ZWN0IGR1cGxpY2F0ZXMgYWNyb3NzIGRpZmZlcmVudCBzY2hlbWFzXG4gICAgY29uc3QgaWRUb1NjaGVtYSA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGN0eC5zZWVuLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCBpZCA9IGN0eC5tZXRhZGF0YVJlZ2lzdHJ5LmdldChlbnRyeVswXSk/LmlkO1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gaWRUb1NjaGVtYS5nZXQoaWQpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nICE9PSBlbnRyeVswXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIHNjaGVtYSBpZCBcIiR7aWR9XCIgZGV0ZWN0ZWQgZHVyaW5nIEpTT04gU2NoZW1hIGNvbnZlcnNpb24uIFR3byBkaWZmZXJlbnQgc2NoZW1hcyBjYW5ub3Qgc2hhcmUgdGhlIHNhbWUgaWQgd2hlbiBjb252ZXJ0ZWQgdG9nZXRoZXIuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZFRvU2NoZW1hLnNldChpZCwgZW50cnlbMF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHJldHVybnMgYSByZWYgdG8gdGhlIHNjaGVtYVxuICAgIC8vIGRlZklkIHdpbGwgYmUgZW1wdHkgaWYgdGhlIHJlZiBwb2ludHMgdG8gYW4gZXh0ZXJuYWwgc2NoZW1hIChvciAjKVxuICAgIGNvbnN0IG1ha2VVUkkgPSAoZW50cnkpID0+IHtcbiAgICAgICAgLy8gY29tcGFyaW5nIHRoZSBzZWVuIG9iamVjdHMgYmVjYXVzZSBzb21ldGltZXNcbiAgICAgICAgLy8gbXVsdGlwbGUgc2NoZW1hcyBtYXAgdG8gdGhlIHNhbWUgc2VlbiBvYmplY3QuXG4gICAgICAgIC8vIGUuZy4gbGF6eVxuICAgICAgICAvLyBleHRlcm5hbCBpcyBjb25maWd1cmVkXG4gICAgICAgIGNvbnN0IGRlZnNTZWdtZW50ID0gY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0yMDIwLTEyXCIgPyBcIiRkZWZzXCIgOiBcImRlZmluaXRpb25zXCI7XG4gICAgICAgIGlmIChjdHguZXh0ZXJuYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dGVybmFsSWQgPSBjdHguZXh0ZXJuYWwucmVnaXN0cnkuZ2V0KGVudHJ5WzBdKT8uaWQ7IC8vID8/IFwiX19zaGFyZWRcIjsvLyBgX19zY2hlbWEke2N0eC5jb3VudGVyKyt9YDtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHNjaGVtYSBpcyBpbiB0aGUgZXh0ZXJuYWwgcmVnaXN0cnlcbiAgICAgICAgICAgIGNvbnN0IHVyaUdlbmVyYXRvciA9IGN0eC5leHRlcm5hbC51cmkgPz8gKChpZCkgPT4gaWQpO1xuICAgICAgICAgICAgaWYgKGV4dGVybmFsSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyByZWY6IHVyaUdlbmVyYXRvcihleHRlcm5hbElkKSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBhZGQgdG8gX19zaGFyZWRcbiAgICAgICAgICAgIGNvbnN0IGlkID0gZW50cnlbMV0uZGVmSWQgPz8gZW50cnlbMV0uc2NoZW1hLmlkID8/IGBzY2hlbWEke2N0eC5jb3VudGVyKyt9YDtcbiAgICAgICAgICAgIGVudHJ5WzFdLmRlZklkID0gaWQ7IC8vIHNldCBkZWZJZCBzbyBpdCB3aWxsIGJlIHJldXNlZCBpZiBuZWVkZWRcbiAgICAgICAgICAgIHJldHVybiB7IGRlZklkOiBpZCwgcmVmOiBgJHt1cmlHZW5lcmF0b3IoXCJfX3NoYXJlZFwiKX0jLyR7ZGVmc1NlZ21lbnR9LyR7aWR9YCB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeVsxXSA9PT0gcm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgcmVmOiBcIiNcIiB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIHNlbGYtY29udGFpbmVkIHNjaGVtYVxuICAgICAgICBjb25zdCB1cmlQcmVmaXggPSBgI2A7XG4gICAgICAgIGNvbnN0IGRlZlVyaVByZWZpeCA9IGAke3VyaVByZWZpeH0vJHtkZWZzU2VnbWVudH0vYDtcbiAgICAgICAgY29uc3QgZGVmSWQgPSBlbnRyeVsxXS5zY2hlbWEuaWQgPz8gYF9fc2NoZW1hJHtjdHguY291bnRlcisrfWA7XG4gICAgICAgIHJldHVybiB7IGRlZklkLCByZWY6IGRlZlVyaVByZWZpeCArIGRlZklkIH07XG4gICAgfTtcbiAgICAvLyBzdG9yZWQgY2FjaGVkIHZlcnNpb24gaW4gYGRlZmAgcHJvcGVydHlcbiAgICAvLyByZW1vdmUgYWxsIHByb3BlcnRpZXMsIHNldCAkcmVmXG4gICAgY29uc3QgZXh0cmFjdFRvRGVmID0gKGVudHJ5KSA9PiB7XG4gICAgICAgIC8vIGlmIHRoZSBzY2hlbWEgaXMgYWxyZWFkeSBhIHJlZmVyZW5jZSwgZG8gbm90IGV4dHJhY3QgaXRcbiAgICAgICAgaWYgKGVudHJ5WzFdLnNjaGVtYS4kcmVmKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VlbiA9IGVudHJ5WzFdO1xuICAgICAgICBjb25zdCB7IHJlZiwgZGVmSWQgfSA9IG1ha2VVUkkoZW50cnkpO1xuICAgICAgICBzZWVuLmRlZiA9IHsgLi4uc2Vlbi5zY2hlbWEgfTtcbiAgICAgICAgLy8gZGVmSWQgd29uJ3QgYmUgc2V0IGlmIHRoZSBzY2hlbWEgaXMgYSByZWZlcmVuY2UgdG8gYW4gZXh0ZXJuYWwgc2NoZW1hXG4gICAgICAgIC8vIG9yIGlmIHRoZSBzY2hlbWEgaXMgdGhlIHJvb3Qgc2NoZW1hXG4gICAgICAgIGlmIChkZWZJZClcbiAgICAgICAgICAgIHNlZW4uZGVmSWQgPSBkZWZJZDtcbiAgICAgICAgLy8gd2lwZSBhd2F5IGFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCAkcmVmXG4gICAgICAgIGNvbnN0IHNjaGVtYSA9IHNlZW4uc2NoZW1hO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBzY2hlbWFba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBzY2hlbWEuJHJlZiA9IHJlZjtcbiAgICB9O1xuICAgIC8vIHRocm93IG9uIGN5Y2xlc1xuICAgIC8vIGJyZWFrIGN5Y2xlc1xuICAgIGlmIChjdHguY3ljbGVzID09PSBcInRocm93XCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBjdHguc2Vlbi5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlZW4gPSBlbnRyeVsxXTtcbiAgICAgICAgICAgIGlmIChzZWVuLmN5Y2xlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ3ljbGUgZGV0ZWN0ZWQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgYCMvJHtzZWVuLmN5Y2xlPy5qb2luKFwiL1wiKX0vPHJvb3Q+YCArXG4gICAgICAgICAgICAgICAgICAgICdcXG5cXG5TZXQgdGhlIGBjeWNsZXNgIHBhcmFtZXRlciB0byBgXCJyZWZcImAgdG8gcmVzb2x2ZSBjeWNsaWNhbCBzY2hlbWFzIHdpdGggZGVmcy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBleHRyYWN0IHNjaGVtYXMgaW50byAkZGVmc1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgY3R4LnNlZW4uZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IHNlZW4gPSBlbnRyeVsxXTtcbiAgICAgICAgLy8gY29udmVydCByb290IHNjaGVtYSB0byAjICRyZWZcbiAgICAgICAgaWYgKHNjaGVtYSA9PT0gZW50cnlbMF0pIHtcbiAgICAgICAgICAgIGV4dHJhY3RUb0RlZihlbnRyeSk7IC8vIHRoaXMgaGFzIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZSByb290IHNjaGVtYVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXh0cmFjdCBzY2hlbWFzIHRoYXQgYXJlIGluIHRoZSBleHRlcm5hbCByZWdpc3RyeVxuICAgICAgICBpZiAoY3R4LmV4dGVybmFsKSB7XG4gICAgICAgICAgICBjb25zdCBleHQgPSBjdHguZXh0ZXJuYWwucmVnaXN0cnkuZ2V0KGVudHJ5WzBdKT8uaWQ7XG4gICAgICAgICAgICBpZiAoc2NoZW1hICE9PSBlbnRyeVswXSAmJiBleHQpIHtcbiAgICAgICAgICAgICAgICBleHRyYWN0VG9EZWYoZW50cnkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGV4dHJhY3Qgc2NoZW1hcyB3aXRoIGBpZGAgbWV0YVxuICAgICAgICBjb25zdCBpZCA9IGN0eC5tZXRhZGF0YVJlZ2lzdHJ5LmdldChlbnRyeVswXSk/LmlkO1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIGV4dHJhY3RUb0RlZihlbnRyeSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBicmVhayBjeWNsZXNcbiAgICAgICAgaWYgKHNlZW4uY3ljbGUpIHtcbiAgICAgICAgICAgIC8vIGFueVxuICAgICAgICAgICAgZXh0cmFjdFRvRGVmKGVudHJ5KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGV4dHJhY3QgcmV1c2VkIHNjaGVtYXNcbiAgICAgICAgaWYgKHNlZW4uY291bnQgPiAxKSB7XG4gICAgICAgICAgICBpZiAoY3R4LnJldXNlZCA9PT0gXCJyZWZcIikge1xuICAgICAgICAgICAgICAgIGV4dHJhY3RUb0RlZihlbnRyeSk7XG4gICAgICAgICAgICAgICAgLy8gYmlvbWUtaWdub3JlIGxpbnQ6XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZmluYWxpemUoY3R4LCBzY2hlbWEpIHtcbiAgICBjb25zdCByb290ID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgaWYgKCFyb290KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnByb2Nlc3NlZCBzY2hlbWEuIFRoaXMgaXMgYSBidWcgaW4gWm9kLlwiKTtcbiAgICAvLyBmbGF0dGVuIHJlZnMgLSBpbmhlcml0IHByb3BlcnRpZXMgZnJvbSBwYXJlbnQgc2NoZW1hc1xuICAgIGNvbnN0IGZsYXR0ZW5SZWYgPSAoem9kU2NoZW1hKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlZW4gPSBjdHguc2Vlbi5nZXQoem9kU2NoZW1hKTtcbiAgICAgICAgLy8gYWxyZWFkeSBwcm9jZXNzZWRcbiAgICAgICAgaWYgKHNlZW4ucmVmID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBzY2hlbWEgPSBzZWVuLmRlZiA/PyBzZWVuLnNjaGVtYTtcbiAgICAgICAgY29uc3QgX2NhY2hlZCA9IHsgLi4uc2NoZW1hIH07XG4gICAgICAgIGNvbnN0IHJlZiA9IHNlZW4ucmVmO1xuICAgICAgICBzZWVuLnJlZiA9IG51bGw7IC8vIHByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uXG4gICAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgICAgIGZsYXR0ZW5SZWYocmVmKTtcbiAgICAgICAgICAgIGNvbnN0IHJlZlNlZW4gPSBjdHguc2Vlbi5nZXQocmVmKTtcbiAgICAgICAgICAgIGNvbnN0IHJlZlNjaGVtYSA9IHJlZlNlZW4uc2NoZW1hO1xuICAgICAgICAgICAgLy8gbWVyZ2UgcmVmZXJlbmNlZCBzY2hlbWEgaW50byBjdXJyZW50XG4gICAgICAgICAgICBpZiAocmVmU2NoZW1hLiRyZWYgJiYgKGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMDdcIiB8fCBjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTA0XCIgfHwgY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiKSkge1xuICAgICAgICAgICAgICAgIC8vIG9sZGVyIGRyYWZ0cyBjYW4ndCBjb21iaW5lICRyZWYgd2l0aCBvdGhlciBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgc2NoZW1hLmFsbE9mID0gc2NoZW1hLmFsbE9mID8/IFtdO1xuICAgICAgICAgICAgICAgIHNjaGVtYS5hbGxPZi5wdXNoKHJlZlNjaGVtYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHNjaGVtYSwgcmVmU2NoZW1hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlc3RvcmUgY2hpbGQncyBvd24gcHJvcGVydGllcyAoY2hpbGQgd2lucylcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oc2NoZW1hLCBfY2FjaGVkKTtcbiAgICAgICAgICAgIGNvbnN0IGlzUGFyZW50UmVmID0gem9kU2NoZW1hLl96b2QucGFyZW50ID09PSByZWY7XG4gICAgICAgICAgICAvLyBGb3IgcGFyZW50IGNoYWluLCBjaGlsZCBpcyBhIHJlZmluZW1lbnQgLSByZW1vdmUgcGFyZW50LW9ubHkgcHJvcGVydGllc1xuICAgICAgICAgICAgaWYgKGlzUGFyZW50UmVmKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiJHJlZlwiIHx8IGtleSA9PT0gXCJhbGxPZlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBfY2FjaGVkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNjaGVtYVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gV2hlbiByZWYgd2FzIGV4dHJhY3RlZCB0byAkZGVmcywgcmVtb3ZlIHByb3BlcnRpZXMgdGhhdCBtYXRjaCB0aGUgZGVmaW5pdGlvblxuICAgICAgICAgICAgaWYgKHJlZlNjaGVtYS4kcmVmICYmIHJlZlNlZW4uZGVmKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiJHJlZlwiIHx8IGtleSA9PT0gXCJhbGxPZlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gcmVmU2Vlbi5kZWYgJiYgSlNPTi5zdHJpbmdpZnkoc2NoZW1hW2tleV0pID09PSBKU09OLnN0cmluZ2lmeShyZWZTZWVuLmRlZltrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNjaGVtYVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHBhcmVudCB3YXMgZXh0cmFjdGVkIChoYXMgJHJlZiksIHByb3BhZ2F0ZSAkcmVmIHRvIHRoaXMgc2NoZW1hXG4gICAgICAgIC8vIFRoaXMgaGFuZGxlcyBjYXNlcyBsaWtlOiByZWFkb25seSgpLm1ldGEoe2lkfSkuZGVzY3JpYmUoKVxuICAgICAgICAvLyB3aGVyZSBwcm9jZXNzb3Igc2V0cyByZWYgdG8gaW5uZXJUeXBlIGJ1dCBwYXJlbnQgc2hvdWxkIGJlIHJlZmVyZW5jZWRcbiAgICAgICAgY29uc3QgcGFyZW50ID0gem9kU2NoZW1hLl96b2QucGFyZW50O1xuICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudCAhPT0gcmVmKSB7XG4gICAgICAgICAgICAvLyBFbnN1cmUgcGFyZW50IGlzIHByb2Nlc3NlZCBmaXJzdCBzbyBpdHMgZGVmIGhhcyBpbmhlcml0ZWQgcHJvcGVydGllc1xuICAgICAgICAgICAgZmxhdHRlblJlZihwYXJlbnQpO1xuICAgICAgICAgICAgY29uc3QgcGFyZW50U2VlbiA9IGN0eC5zZWVuLmdldChwYXJlbnQpO1xuICAgICAgICAgICAgaWYgKHBhcmVudFNlZW4/LnNjaGVtYS4kcmVmKSB7XG4gICAgICAgICAgICAgICAgc2NoZW1hLiRyZWYgPSBwYXJlbnRTZWVuLnNjaGVtYS4kcmVmO1xuICAgICAgICAgICAgICAgIC8vIERlLWR1cGxpY2F0ZSB3aXRoIHBhcmVudCdzIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBpZiAocGFyZW50U2Vlbi5kZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIiRyZWZcIiB8fCBrZXkgPT09IFwiYWxsT2ZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gcGFyZW50U2Vlbi5kZWYgJiYgSlNPTi5zdHJpbmdpZnkoc2NoZW1hW2tleV0pID09PSBKU09OLnN0cmluZ2lmeShwYXJlbnRTZWVuLmRlZltrZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzY2hlbWFba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBleGVjdXRlIG92ZXJyaWRlc1xuICAgICAgICBjdHgub3ZlcnJpZGUoe1xuICAgICAgICAgICAgem9kU2NoZW1hOiB6b2RTY2hlbWEsXG4gICAgICAgICAgICBqc29uU2NoZW1hOiBzY2hlbWEsXG4gICAgICAgICAgICBwYXRoOiBzZWVuLnBhdGggPz8gW10sXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBbLi4uY3R4LnNlZW4uZW50cmllcygpXS5yZXZlcnNlKCkpIHtcbiAgICAgICAgZmxhdHRlblJlZihlbnRyeVswXSk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIikge1xuICAgICAgICByZXN1bHQuJHNjaGVtYSA9IFwiaHR0cHM6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQvMjAyMC0xMi9zY2hlbWFcIjtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wN1wiKSB7XG4gICAgICAgIHJlc3VsdC4kc2NoZW1hID0gXCJodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA3L3NjaGVtYSNcIjtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wNFwiKSB7XG4gICAgICAgIHJlc3VsdC4kc2NoZW1hID0gXCJodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSNcIjtcbiAgICB9XG4gICAgZWxzZSBpZiAoY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiKSB7XG4gICAgICAgIC8vIE9wZW5BUEkgMy4wIHNjaGVtYSBvYmplY3RzIHNob3VsZCBub3QgaW5jbHVkZSBhICRzY2hlbWEgcHJvcGVydHlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIEFyYml0cmFyeSBzdHJpbmcgdmFsdWVzIGFyZSBhbGxvd2VkIGJ1dCB3b24ndCBoYXZlIGEgJHNjaGVtYSBwcm9wZXJ0eSBzZXRcbiAgICB9XG4gICAgaWYgKGN0eC5leHRlcm5hbD8udXJpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gY3R4LmV4dGVybmFsLnJlZ2lzdHJ5LmdldChzY2hlbWEpPy5pZDtcbiAgICAgICAgaWYgKCFpZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNjaGVtYSBpcyBtaXNzaW5nIGFuIGBpZGAgcHJvcGVydHlcIik7XG4gICAgICAgIHJlc3VsdC4kaWQgPSBjdHguZXh0ZXJuYWwudXJpKGlkKTtcbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihyZXN1bHQsIHJvb3QuZGVmID8/IHJvb3Quc2NoZW1hKTtcbiAgICAvLyBUaGUgYGlkYCBpbiBgLm1ldGEoKWAgaXMgYSBab2Qtc3BlY2lmaWMgcmVnaXN0cmF0aW9uIHRhZyB1c2VkIHRvIGV4dHJhY3RcbiAgICAvLyBzY2hlbWFzIGludG8gJGRlZnMg4oCUIGl0IGlzIG5vdCB1c2VyLWZhY2luZyBKU09OIFNjaGVtYSBtZXRhZGF0YS4gU3RyaXAgaXRcbiAgICAvLyBmcm9tIHRoZSBvdXRwdXQgYm9keSB3aGVyZSBpdCB3b3VsZCBvdGhlcndpc2UgbGVhay4gVGhlIGlkIGlzIHByZXNlcnZlZFxuICAgIC8vIGltcGxpY2l0bHkgdmlhIHRoZSAkZGVmcyBrZXkgKGFuZCB2aWEgJHJlZiBwYXRocykuXG4gICAgY29uc3Qgcm9vdE1ldGFJZCA9IGN0eC5tZXRhZGF0YVJlZ2lzdHJ5LmdldChzY2hlbWEpPy5pZDtcbiAgICBpZiAocm9vdE1ldGFJZCAhPT0gdW5kZWZpbmVkICYmIHJlc3VsdC5pZCA9PT0gcm9vdE1ldGFJZClcbiAgICAgICAgZGVsZXRlIHJlc3VsdC5pZDtcbiAgICAvLyBidWlsZCBkZWZzIG9iamVjdFxuICAgIGNvbnN0IGRlZnMgPSBjdHguZXh0ZXJuYWw/LmRlZnMgPz8ge307XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBjdHguc2Vlbi5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3Qgc2VlbiA9IGVudHJ5WzFdO1xuICAgICAgICBpZiAoc2Vlbi5kZWYgJiYgc2Vlbi5kZWZJZCkge1xuICAgICAgICAgICAgaWYgKHNlZW4uZGVmLmlkID09PSBzZWVuLmRlZklkKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWVuLmRlZi5pZDtcbiAgICAgICAgICAgIGRlZnNbc2Vlbi5kZWZJZF0gPSBzZWVuLmRlZjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBzZXQgZGVmaW5pdGlvbnMgaW4gcmVzdWx0XG4gICAgaWYgKGN0eC5leHRlcm5hbCkge1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRlZnMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC4kZGVmcyA9IGRlZnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGVmaW5pdGlvbnMgPSBkZWZzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHRoaXMgXCJmaW5hbGl6ZXNcIiB0aGlzIHNjaGVtYSBhbmQgZW5zdXJlcyBhbGwgY3ljbGVzIGFyZSByZW1vdmVkXG4gICAgICAgIC8vIGVhY2ggY2FsbCB0byBmaW5hbGl6ZSgpIGlzIGZ1bmN0aW9uYWxseSBpbmRlcGVuZGVudFxuICAgICAgICAvLyB0aG91Z2ggdGhlIHNlZW4gbWFwIGlzIHNoYXJlZFxuICAgICAgICBjb25zdCBmaW5hbGl6ZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZmluYWxpemVkLCBcIn5zdGFuZGFyZFwiLCB7XG4gICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIC4uLnNjaGVtYVtcIn5zdGFuZGFyZFwiXSxcbiAgICAgICAgICAgICAgICBqc29uU2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBjcmVhdGVTdGFuZGFyZEpTT05TY2hlbWFNZXRob2Qoc2NoZW1hLCBcImlucHV0XCIsIGN0eC5wcm9jZXNzb3JzKSxcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBjcmVhdGVTdGFuZGFyZEpTT05TY2hlbWFNZXRob2Qoc2NoZW1hLCBcIm91dHB1dFwiLCBjdHgucHJvY2Vzc29ycyksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmaW5hbGl6ZWQ7XG4gICAgfVxuICAgIGNhdGNoIChfZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVycm9yIGNvbnZlcnRpbmcgc2NoZW1hIHRvIEpTT04uXCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzVHJhbnNmb3JtaW5nKF9zY2hlbWEsIF9jdHgpIHtcbiAgICBjb25zdCBjdHggPSBfY3R4ID8/IHsgc2VlbjogbmV3IFNldCgpIH07XG4gICAgaWYgKGN0eC5zZWVuLmhhcyhfc2NoZW1hKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGN0eC5zZWVuLmFkZChfc2NoZW1hKTtcbiAgICBjb25zdCBkZWYgPSBfc2NoZW1hLl96b2QuZGVmO1xuICAgIGlmIChkZWYudHlwZSA9PT0gXCJ0cmFuc2Zvcm1cIilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYgKGRlZi50eXBlID09PSBcImFycmF5XCIpXG4gICAgICAgIHJldHVybiBpc1RyYW5zZm9ybWluZyhkZWYuZWxlbWVudCwgY3R4KTtcbiAgICBpZiAoZGVmLnR5cGUgPT09IFwic2V0XCIpXG4gICAgICAgIHJldHVybiBpc1RyYW5zZm9ybWluZyhkZWYudmFsdWVUeXBlLCBjdHgpO1xuICAgIGlmIChkZWYudHlwZSA9PT0gXCJsYXp5XCIpXG4gICAgICAgIHJldHVybiBpc1RyYW5zZm9ybWluZyhkZWYuZ2V0dGVyKCksIGN0eCk7XG4gICAgaWYgKGRlZi50eXBlID09PSBcInByb21pc2VcIiB8fFxuICAgICAgICBkZWYudHlwZSA9PT0gXCJvcHRpb25hbFwiIHx8XG4gICAgICAgIGRlZi50eXBlID09PSBcIm5vbm9wdGlvbmFsXCIgfHxcbiAgICAgICAgZGVmLnR5cGUgPT09IFwibnVsbGFibGVcIiB8fFxuICAgICAgICBkZWYudHlwZSA9PT0gXCJyZWFkb25seVwiIHx8XG4gICAgICAgIGRlZi50eXBlID09PSBcImRlZmF1bHRcIiB8fFxuICAgICAgICBkZWYudHlwZSA9PT0gXCJwcmVmYXVsdFwiKSB7XG4gICAgICAgIHJldHVybiBpc1RyYW5zZm9ybWluZyhkZWYuaW5uZXJUeXBlLCBjdHgpO1xuICAgIH1cbiAgICBpZiAoZGVmLnR5cGUgPT09IFwiaW50ZXJzZWN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi5sZWZ0LCBjdHgpIHx8IGlzVHJhbnNmb3JtaW5nKGRlZi5yaWdodCwgY3R4KTtcbiAgICB9XG4gICAgaWYgKGRlZi50eXBlID09PSBcInJlY29yZFwiIHx8IGRlZi50eXBlID09PSBcIm1hcFwiKSB7XG4gICAgICAgIHJldHVybiBpc1RyYW5zZm9ybWluZyhkZWYua2V5VHlwZSwgY3R4KSB8fCBpc1RyYW5zZm9ybWluZyhkZWYudmFsdWVUeXBlLCBjdHgpO1xuICAgIH1cbiAgICBpZiAoZGVmLnR5cGUgPT09IFwicGlwZVwiKSB7XG4gICAgICAgIGlmIChfc2NoZW1hLl96b2QudHJhaXRzLmhhcyhcIiRab2RDb2RlY1wiKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gaXNUcmFuc2Zvcm1pbmcoZGVmLmluLCBjdHgpIHx8IGlzVHJhbnNmb3JtaW5nKGRlZi5vdXQsIGN0eCk7XG4gICAgfVxuICAgIGlmIChkZWYudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBkZWYuc2hhcGUpIHtcbiAgICAgICAgICAgIGlmIChpc1RyYW5zZm9ybWluZyhkZWYuc2hhcGVba2V5XSwgY3R4KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChkZWYudHlwZSA9PT0gXCJ1bmlvblwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGRlZi5vcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoaXNUcmFuc2Zvcm1pbmcob3B0aW9uLCBjdHgpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGRlZi50eXBlID09PSBcInR1cGxlXCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGRlZi5pdGVtcykge1xuICAgICAgICAgICAgaWYgKGlzVHJhbnNmb3JtaW5nKGl0ZW0sIGN0eCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZi5yZXN0ICYmIGlzVHJhbnNmb3JtaW5nKGRlZi5yZXN0LCBjdHgpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgdG9KU09OU2NoZW1hIG1ldGhvZCBmb3IgYSBzY2hlbWEgaW5zdGFuY2UuXG4gKiBUaGlzIGVuY2Fwc3VsYXRlcyB0aGUgbG9naWMgb2YgaW5pdGlhbGl6aW5nIGNvbnRleHQsIHByb2Nlc3NpbmcsIGV4dHJhY3RpbmcgZGVmcywgYW5kIGZpbmFsaXppbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVUb0pTT05TY2hlbWFNZXRob2QgPSAoc2NoZW1hLCBwcm9jZXNzb3JzID0ge30pID0+IChwYXJhbXMpID0+IHtcbiAgICBjb25zdCBjdHggPSBpbml0aWFsaXplQ29udGV4dCh7IC4uLnBhcmFtcywgcHJvY2Vzc29ycyB9KTtcbiAgICBwcm9jZXNzKHNjaGVtYSwgY3R4KTtcbiAgICBleHRyYWN0RGVmcyhjdHgsIHNjaGVtYSk7XG4gICAgcmV0dXJuIGZpbmFsaXplKGN0eCwgc2NoZW1hKTtcbn07XG5leHBvcnQgY29uc3QgY3JlYXRlU3RhbmRhcmRKU09OU2NoZW1hTWV0aG9kID0gKHNjaGVtYSwgaW8sIHByb2Nlc3NvcnMgPSB7fSkgPT4gKHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHsgbGlicmFyeU9wdGlvbnMsIHRhcmdldCB9ID0gcGFyYW1zID8/IHt9O1xuICAgIGNvbnN0IGN0eCA9IGluaXRpYWxpemVDb250ZXh0KHsgLi4uKGxpYnJhcnlPcHRpb25zID8/IHt9KSwgdGFyZ2V0LCBpbywgcHJvY2Vzc29ycyB9KTtcbiAgICBwcm9jZXNzKHNjaGVtYSwgY3R4KTtcbiAgICBleHRyYWN0RGVmcyhjdHgsIHNjaGVtYSk7XG4gICAgcmV0dXJuIGZpbmFsaXplKGN0eCwgc2NoZW1hKTtcbn07XG4iLCJpbXBvcnQgeyBleHRyYWN0RGVmcywgZmluYWxpemUsIGluaXRpYWxpemVDb250ZXh0LCBwcm9jZXNzLCB9IGZyb20gXCIuL3RvLWpzb24tc2NoZW1hLmpzXCI7XG5pbXBvcnQgeyBnZXRFbnVtVmFsdWVzIH0gZnJvbSBcIi4vdXRpbC5qc1wiO1xuY29uc3QgZm9ybWF0TWFwID0ge1xuICAgIGd1aWQ6IFwidXVpZFwiLFxuICAgIHVybDogXCJ1cmlcIixcbiAgICBkYXRldGltZTogXCJkYXRlLXRpbWVcIixcbiAgICBqc29uX3N0cmluZzogXCJqc29uLXN0cmluZ1wiLFxuICAgIHJlZ2V4OiBcIlwiLCAvLyBkbyBub3Qgc2V0XG59O1xuLy8gPT09PT09PT09PT09PT09PT09PT0gU0lNUExFIFRZUEUgUFJPQ0VTU09SUyA9PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IHN0cmluZ1Byb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBjb25zdCBqc29uID0gX2pzb247XG4gICAganNvbi50eXBlID0gXCJzdHJpbmdcIjtcbiAgICBjb25zdCB7IG1pbmltdW0sIG1heGltdW0sIGZvcm1hdCwgcGF0dGVybnMsIGNvbnRlbnRFbmNvZGluZyB9ID0gc2NoZW1hLl96b2RcbiAgICAgICAgLmJhZztcbiAgICBpZiAodHlwZW9mIG1pbmltdW0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgIGpzb24ubWluTGVuZ3RoID0gbWluaW11bTtcbiAgICBpZiAodHlwZW9mIG1heGltdW0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgIGpzb24ubWF4TGVuZ3RoID0gbWF4aW11bTtcbiAgICAvLyBjdXN0b20gcGF0dGVybiBvdmVycmlkZXMgZm9ybWF0XG4gICAgaWYgKGZvcm1hdCkge1xuICAgICAgICBqc29uLmZvcm1hdCA9IGZvcm1hdE1hcFtmb3JtYXRdID8/IGZvcm1hdDtcbiAgICAgICAgaWYgKGpzb24uZm9ybWF0ID09PSBcIlwiKVxuICAgICAgICAgICAgZGVsZXRlIGpzb24uZm9ybWF0OyAvLyBlbXB0eSBmb3JtYXQgaXMgbm90IHZhbGlkXG4gICAgICAgIC8vIEpTT04gU2NoZW1hIGZvcm1hdDogXCJ0aW1lXCIgcmVxdWlyZXMgYSBmdWxsIHRpbWUgd2l0aCBvZmZzZXQgb3IgWlxuICAgICAgICAvLyB6Lmlzby50aW1lKCkgZG9lcyBub3QgaW5jbHVkZSB0aW1lem9uZSBpbmZvcm1hdGlvbiwgc28gZm9ybWF0OiBcInRpbWVcIiBzaG91bGQgbmV2ZXIgYmUgdXNlZFxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcInRpbWVcIikge1xuICAgICAgICAgICAgZGVsZXRlIGpzb24uZm9ybWF0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjb250ZW50RW5jb2RpbmcpXG4gICAgICAgIGpzb24uY29udGVudEVuY29kaW5nID0gY29udGVudEVuY29kaW5nO1xuICAgIGlmIChwYXR0ZXJucyAmJiBwYXR0ZXJucy5zaXplID4gMCkge1xuICAgICAgICBjb25zdCByZWdleGVzID0gWy4uLnBhdHRlcm5zXTtcbiAgICAgICAgaWYgKHJlZ2V4ZXMubGVuZ3RoID09PSAxKVxuICAgICAgICAgICAganNvbi5wYXR0ZXJuID0gcmVnZXhlc1swXS5zb3VyY2U7XG4gICAgICAgIGVsc2UgaWYgKHJlZ2V4ZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAganNvbi5hbGxPZiA9IFtcbiAgICAgICAgICAgICAgICAuLi5yZWdleGVzLm1hcCgocmVnZXgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIC4uLihjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTA3XCIgfHwgY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wNFwiIHx8IGN0eC50YXJnZXQgPT09IFwib3BlbmFwaS0zLjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyB7IHR5cGU6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB7fSksXG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IHJlZ2V4LnNvdXJjZSxcbiAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBudW1iZXJQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QganNvbiA9IF9qc29uO1xuICAgIGNvbnN0IHsgbWluaW11bSwgbWF4aW11bSwgZm9ybWF0LCBtdWx0aXBsZU9mLCBleGNsdXNpdmVNYXhpbXVtLCBleGNsdXNpdmVNaW5pbXVtIH0gPSBzY2hlbWEuX3pvZC5iYWc7XG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09IFwic3RyaW5nXCIgJiYgZm9ybWF0LmluY2x1ZGVzKFwiaW50XCIpKVxuICAgICAgICBqc29uLnR5cGUgPSBcImludGVnZXJcIjtcbiAgICBlbHNlXG4gICAgICAgIGpzb24udHlwZSA9IFwibnVtYmVyXCI7XG4gICAgLy8gd2hlbiBib3RoIG1pbmltdW0gYW5kIGV4Y2x1c2l2ZU1pbmltdW0gZXhpc3QsIHBpY2sgdGhlIG1vcmUgcmVzdHJpY3RpdmUgb25lXG4gICAgY29uc3QgZXhNaW4gPSB0eXBlb2YgZXhjbHVzaXZlTWluaW11bSA9PT0gXCJudW1iZXJcIiAmJiBleGNsdXNpdmVNaW5pbXVtID49IChtaW5pbXVtID8/IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSk7XG4gICAgY29uc3QgZXhNYXggPSB0eXBlb2YgZXhjbHVzaXZlTWF4aW11bSA9PT0gXCJudW1iZXJcIiAmJiBleGNsdXNpdmVNYXhpbXVtIDw9IChtYXhpbXVtID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk7XG4gICAgY29uc3QgbGVnYWN5ID0gY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wNFwiIHx8IGN0eC50YXJnZXQgPT09IFwib3BlbmFwaS0zLjBcIjtcbiAgICBpZiAoZXhNaW4pIHtcbiAgICAgICAgaWYgKGxlZ2FjeSkge1xuICAgICAgICAgICAganNvbi5taW5pbXVtID0gZXhjbHVzaXZlTWluaW11bTtcbiAgICAgICAgICAgIGpzb24uZXhjbHVzaXZlTWluaW11bSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBqc29uLmV4Y2x1c2l2ZU1pbmltdW0gPSBleGNsdXNpdmVNaW5pbXVtO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtaW5pbXVtID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGpzb24ubWluaW11bSA9IG1pbmltdW07XG4gICAgfVxuICAgIGlmIChleE1heCkge1xuICAgICAgICBpZiAobGVnYWN5KSB7XG4gICAgICAgICAgICBqc29uLm1heGltdW0gPSBleGNsdXNpdmVNYXhpbXVtO1xuICAgICAgICAgICAganNvbi5leGNsdXNpdmVNYXhpbXVtID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGpzb24uZXhjbHVzaXZlTWF4aW11bSA9IGV4Y2x1c2l2ZU1heGltdW07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1heGltdW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAganNvbi5tYXhpbXVtID0gbWF4aW11bTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBtdWx0aXBsZU9mID09PSBcIm51bWJlclwiKVxuICAgICAgICBqc29uLm11bHRpcGxlT2YgPSBtdWx0aXBsZU9mO1xufTtcbmV4cG9ydCBjb25zdCBib29sZWFuUHJvY2Vzc29yID0gKF9zY2hlbWEsIF9jdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBqc29uLnR5cGUgPSBcImJvb2xlYW5cIjtcbn07XG5leHBvcnQgY29uc3QgYmlnaW50UHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJpZ0ludCBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzeW1ib2xQcm9jZXNzb3IgPSAoX3NjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudW5yZXByZXNlbnRhYmxlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3ltYm9scyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBudWxsUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwganNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCIpIHtcbiAgICAgICAganNvbi50eXBlID0gXCJzdHJpbmdcIjtcbiAgICAgICAganNvbi5udWxsYWJsZSA9IHRydWU7XG4gICAgICAgIGpzb24uZW51bSA9IFtudWxsXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGpzb24udHlwZSA9IFwibnVsbFwiO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgdW5kZWZpbmVkUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuZGVmaW5lZCBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCB2b2lkUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZvaWQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgbmV2ZXJQcm9jZXNzb3IgPSAoX3NjaGVtYSwgX2N0eCwganNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGpzb24ubm90ID0ge307XG59O1xuZXhwb3J0IGNvbnN0IGFueVByb2Nlc3NvciA9IChfc2NoZW1hLCBfY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIC8vIGVtcHR5IHNjaGVtYSBhY2NlcHRzIGFueXRoaW5nXG59O1xuZXhwb3J0IGNvbnN0IHVua25vd25Qcm9jZXNzb3IgPSAoX3NjaGVtYSwgX2N0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICAvLyBlbXB0eSBzY2hlbWEgYWNjZXB0cyBhbnl0aGluZ1xufTtcbmV4cG9ydCBjb25zdCBkYXRlUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGUgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgZW51bVByb2Nlc3NvciA9IChzY2hlbWEsIF9jdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgdmFsdWVzID0gZ2V0RW51bVZhbHVlcyhkZWYuZW50cmllcyk7XG4gICAgLy8gTnVtYmVyIGVudW1zIGNhbiBoYXZlIGJvdGggc3RyaW5nIGFuZCBudW1iZXIgdmFsdWVzXG4gICAgaWYgKHZhbHVlcy5ldmVyeSgodikgPT4gdHlwZW9mIHYgPT09IFwibnVtYmVyXCIpKVxuICAgICAgICBqc29uLnR5cGUgPSBcIm51bWJlclwiO1xuICAgIGlmICh2YWx1ZXMuZXZlcnkoKHYpID0+IHR5cGVvZiB2ID09PSBcInN0cmluZ1wiKSlcbiAgICAgICAganNvbi50eXBlID0gXCJzdHJpbmdcIjtcbiAgICBqc29uLmVudW0gPSB2YWx1ZXM7XG59O1xuZXhwb3J0IGNvbnN0IGxpdGVyYWxQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgdmFscyA9IFtdO1xuICAgIGZvciAoY29uc3QgdmFsIG9mIGRlZi52YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTGl0ZXJhbCBgdW5kZWZpbmVkYCBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgYWRkIHRvIHZhbHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsID09PSBcImJpZ2ludFwiKSB7XG4gICAgICAgICAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmlnSW50IGxpdGVyYWxzIGNhbm5vdCBiZSByZXByZXNlbnRlZCBpbiBKU09OIFNjaGVtYVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHMucHVzaChOdW1iZXIodmFsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWxzLnB1c2godmFsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgLy8gZG8gbm90aGluZyAoYW4gdW5kZWZpbmVkIGxpdGVyYWwgd2FzIHN0cmlwcGVkKVxuICAgIH1cbiAgICBlbHNlIGlmICh2YWxzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCB2YWwgPSB2YWxzWzBdO1xuICAgICAgICBqc29uLnR5cGUgPSB2YWwgPT09IG51bGwgPyBcIm51bGxcIiA6IHR5cGVvZiB2YWw7XG4gICAgICAgIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTA0XCIgfHwgY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiKSB7XG4gICAgICAgICAgICBqc29uLmVudW0gPSBbdmFsXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGpzb24uY29uc3QgPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh2YWxzLmV2ZXJ5KCh2KSA9PiB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikpXG4gICAgICAgICAgICBqc29uLnR5cGUgPSBcIm51bWJlclwiO1xuICAgICAgICBpZiAodmFscy5ldmVyeSgodikgPT4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIpKVxuICAgICAgICAgICAganNvbi50eXBlID0gXCJzdHJpbmdcIjtcbiAgICAgICAgaWYgKHZhbHMuZXZlcnkoKHYpID0+IHR5cGVvZiB2ID09PSBcImJvb2xlYW5cIikpXG4gICAgICAgICAgICBqc29uLnR5cGUgPSBcImJvb2xlYW5cIjtcbiAgICAgICAgaWYgKHZhbHMuZXZlcnkoKHYpID0+IHYgPT09IG51bGwpKVxuICAgICAgICAgICAganNvbi50eXBlID0gXCJudWxsXCI7XG4gICAgICAgIGpzb24uZW51bSA9IHZhbHM7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBuYW5Qcm9jZXNzb3IgPSAoX3NjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudW5yZXByZXNlbnRhYmxlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTmFOIGNhbm5vdCBiZSByZXByZXNlbnRlZCBpbiBKU09OIFNjaGVtYVwiKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHRlbXBsYXRlTGl0ZXJhbFByb2Nlc3NvciA9IChzY2hlbWEsIF9jdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBjb25zdCBfanNvbiA9IGpzb247XG4gICAgY29uc3QgcGF0dGVybiA9IHNjaGVtYS5fem9kLnBhdHRlcm47XG4gICAgaWYgKCFwYXR0ZXJuKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXR0ZXJuIG5vdCBmb3VuZCBpbiB0ZW1wbGF0ZSBsaXRlcmFsXCIpO1xuICAgIF9qc29uLnR5cGUgPSBcInN0cmluZ1wiO1xuICAgIF9qc29uLnBhdHRlcm4gPSBwYXR0ZXJuLnNvdXJjZTtcbn07XG5leHBvcnQgY29uc3QgZmlsZVByb2Nlc3NvciA9IChzY2hlbWEsIF9jdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBjb25zdCBfanNvbiA9IGpzb247XG4gICAgY29uc3QgZmlsZSA9IHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImJpbmFyeVwiLFxuICAgICAgICBjb250ZW50RW5jb2Rpbmc6IFwiYmluYXJ5XCIsXG4gICAgfTtcbiAgICBjb25zdCB7IG1pbmltdW0sIG1heGltdW0sIG1pbWUgfSA9IHNjaGVtYS5fem9kLmJhZztcbiAgICBpZiAobWluaW11bSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBmaWxlLm1pbkxlbmd0aCA9IG1pbmltdW07XG4gICAgaWYgKG1heGltdW0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgZmlsZS5tYXhMZW5ndGggPSBtYXhpbXVtO1xuICAgIGlmIChtaW1lKSB7XG4gICAgICAgIGlmIChtaW1lLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgZmlsZS5jb250ZW50TWVkaWFUeXBlID0gbWltZVswXTtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oX2pzb24sIGZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihfanNvbiwgZmlsZSk7IC8vIHNoYXJlZCBwcm9wcyBhdCByb290XG4gICAgICAgICAgICBfanNvbi5hbnlPZiA9IG1pbWUubWFwKChtKSA9PiAoeyBjb250ZW50TWVkaWFUeXBlOiBtIH0pKTsgLy8gb25seSBjb250ZW50TWVkaWFUeXBlIGRpZmZlcnNcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihfanNvbiwgZmlsZSk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzdWNjZXNzUHJvY2Vzc29yID0gKF9zY2hlbWEsIF9jdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBqc29uLnR5cGUgPSBcImJvb2xlYW5cIjtcbn07XG5leHBvcnQgY29uc3QgY3VzdG9tUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkN1c3RvbSB0eXBlcyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBmdW5jdGlvblByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGdW5jdGlvbiB0eXBlcyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1Qcm9jZXNzb3IgPSAoX3NjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudW5yZXByZXNlbnRhYmxlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHJhbnNmb3JtcyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBtYXBQcm9jZXNzb3IgPSAoX3NjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudW5yZXByZXNlbnRhYmxlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWFwIGNhbm5vdCBiZSByZXByZXNlbnRlZCBpbiBKU09OIFNjaGVtYVwiKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHNldFByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG4vLyA9PT09PT09PT09PT09PT09PT09PSBDT01QT1NJVEUgVFlQRSBQUk9DRVNTT1JTID09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgY29uc3QgYXJyYXlQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBqc29uID0gX2pzb247XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IHsgbWluaW11bSwgbWF4aW11bSB9ID0gc2NoZW1hLl96b2QuYmFnO1xuICAgIGlmICh0eXBlb2YgbWluaW11bSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAganNvbi5taW5JdGVtcyA9IG1pbmltdW07XG4gICAgaWYgKHR5cGVvZiBtYXhpbXVtID09PSBcIm51bWJlclwiKVxuICAgICAgICBqc29uLm1heEl0ZW1zID0gbWF4aW11bTtcbiAgICBqc29uLnR5cGUgPSBcImFycmF5XCI7XG4gICAganNvbi5pdGVtcyA9IHByb2Nlc3MoZGVmLmVsZW1lbnQsIGN0eCwge1xuICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgIHBhdGg6IFsuLi5wYXJhbXMucGF0aCwgXCJpdGVtc1wiXSxcbiAgICB9KTtcbn07XG5leHBvcnQgY29uc3Qgb2JqZWN0UHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBfanNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QganNvbiA9IF9qc29uO1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBqc29uLnR5cGUgPSBcIm9iamVjdFwiO1xuICAgIGpzb24ucHJvcGVydGllcyA9IHt9O1xuICAgIGNvbnN0IHNoYXBlID0gZGVmLnNoYXBlO1xuICAgIGZvciAoY29uc3Qga2V5IGluIHNoYXBlKSB7XG4gICAgICAgIGpzb24ucHJvcGVydGllc1trZXldID0gcHJvY2VzcyhzaGFwZVtrZXldLCBjdHgsIHtcbiAgICAgICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgICAgIHBhdGg6IFsuLi5wYXJhbXMucGF0aCwgXCJwcm9wZXJ0aWVzXCIsIGtleV0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyByZXF1aXJlZCBrZXlzXG4gICAgY29uc3QgYWxsS2V5cyA9IG5ldyBTZXQoT2JqZWN0LmtleXMoc2hhcGUpKTtcbiAgICBjb25zdCByZXF1aXJlZEtleXMgPSBuZXcgU2V0KFsuLi5hbGxLZXlzXS5maWx0ZXIoKGtleSkgPT4ge1xuICAgICAgICBjb25zdCB2ID0gZGVmLnNoYXBlW2tleV0uX3pvZDtcbiAgICAgICAgaWYgKGN0eC5pbyA9PT0gXCJpbnB1dFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdi5vcHRpbiA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHYub3B0b3V0ID09PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9KSk7XG4gICAgaWYgKHJlcXVpcmVkS2V5cy5zaXplID4gMCkge1xuICAgICAgICBqc29uLnJlcXVpcmVkID0gQXJyYXkuZnJvbShyZXF1aXJlZEtleXMpO1xuICAgIH1cbiAgICAvLyBjYXRjaGFsbFxuICAgIGlmIChkZWYuY2F0Y2hhbGw/Ll96b2QuZGVmLnR5cGUgPT09IFwibmV2ZXJcIikge1xuICAgICAgICAvLyBzdHJpY3RcbiAgICAgICAganNvbi5hZGRpdGlvbmFsUHJvcGVydGllcyA9IGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIGlmICghZGVmLmNhdGNoYWxsKSB7XG4gICAgICAgIC8vIHJlZ3VsYXJcbiAgICAgICAgaWYgKGN0eC5pbyA9PT0gXCJvdXRwdXRcIilcbiAgICAgICAgICAgIGpzb24uYWRkaXRpb25hbFByb3BlcnRpZXMgPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZGVmLmNhdGNoYWxsKSB7XG4gICAgICAgIGpzb24uYWRkaXRpb25hbFByb3BlcnRpZXMgPSBwcm9jZXNzKGRlZi5jYXRjaGFsbCwgY3R4LCB7XG4gICAgICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIl0sXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgdW5pb25Qcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIGpzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICAvLyBFeGNsdXNpdmUgdW5pb25zIChpbmNsdXNpdmUgPT09IGZhbHNlKSB1c2Ugb25lT2YgKGV4YWN0bHkgb25lIG1hdGNoKSBpbnN0ZWFkIG9mIGFueU9mIChvbmUgb3IgbW9yZSBtYXRjaGVzKVxuICAgIC8vIFRoaXMgaW5jbHVkZXMgYm90aCB6LnhvcigpIGFuZCBkaXNjcmltaW5hdGVkIHVuaW9uc1xuICAgIGNvbnN0IGlzRXhjbHVzaXZlID0gZGVmLmluY2x1c2l2ZSA9PT0gZmFsc2U7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGRlZi5vcHRpb25zLm1hcCgoeCwgaSkgPT4gcHJvY2Vzcyh4LCBjdHgsIHtcbiAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIGlzRXhjbHVzaXZlID8gXCJvbmVPZlwiIDogXCJhbnlPZlwiLCBpXSxcbiAgICB9KSk7XG4gICAgaWYgKGlzRXhjbHVzaXZlKSB7XG4gICAgICAgIGpzb24ub25lT2YgPSBvcHRpb25zO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAganNvbi5hbnlPZiA9IG9wdGlvbnM7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb25Qcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIGpzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBjb25zdCBhID0gcHJvY2VzcyhkZWYubGVmdCwgY3R4LCB7XG4gICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBcImFsbE9mXCIsIDBdLFxuICAgIH0pO1xuICAgIGNvbnN0IGIgPSBwcm9jZXNzKGRlZi5yaWdodCwgY3R4LCB7XG4gICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBcImFsbE9mXCIsIDFdLFxuICAgIH0pO1xuICAgIGNvbnN0IGlzU2ltcGxlSW50ZXJzZWN0aW9uID0gKHZhbCkgPT4gXCJhbGxPZlwiIGluIHZhbCAmJiBPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PT0gMTtcbiAgICBjb25zdCBhbGxPZiA9IFtcbiAgICAgICAgLi4uKGlzU2ltcGxlSW50ZXJzZWN0aW9uKGEpID8gYS5hbGxPZiA6IFthXSksXG4gICAgICAgIC4uLihpc1NpbXBsZUludGVyc2VjdGlvbihiKSA/IGIuYWxsT2YgOiBbYl0pLFxuICAgIF07XG4gICAganNvbi5hbGxPZiA9IGFsbE9mO1xufTtcbmV4cG9ydCBjb25zdCB0dXBsZVByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGpzb24gPSBfanNvbjtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAganNvbi50eXBlID0gXCJhcnJheVwiO1xuICAgIGNvbnN0IHByZWZpeFBhdGggPSBjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIiA/IFwicHJlZml4SXRlbXNcIiA6IFwiaXRlbXNcIjtcbiAgICBjb25zdCByZXN0UGF0aCA9IGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMjAyMC0xMlwiID8gXCJpdGVtc1wiIDogY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiID8gXCJpdGVtc1wiIDogXCJhZGRpdGlvbmFsSXRlbXNcIjtcbiAgICBjb25zdCBwcmVmaXhJdGVtcyA9IGRlZi5pdGVtcy5tYXAoKHgsIGkpID0+IHByb2Nlc3MoeCwgY3R4LCB7XG4gICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBwcmVmaXhQYXRoLCBpXSxcbiAgICB9KSk7XG4gICAgY29uc3QgcmVzdCA9IGRlZi5yZXN0XG4gICAgICAgID8gcHJvY2VzcyhkZWYucmVzdCwgY3R4LCB7XG4gICAgICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIHJlc3RQYXRoLCAuLi4oY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiID8gW2RlZi5pdGVtcy5sZW5ndGhdIDogW10pXSxcbiAgICAgICAgfSlcbiAgICAgICAgOiBudWxsO1xuICAgIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIikge1xuICAgICAgICBqc29uLnByZWZpeEl0ZW1zID0gcHJlZml4SXRlbXM7XG4gICAgICAgIGlmIChyZXN0KSB7XG4gICAgICAgICAgICBqc29uLml0ZW1zID0gcmVzdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCIpIHtcbiAgICAgICAganNvbi5pdGVtcyA9IHtcbiAgICAgICAgICAgIGFueU9mOiBwcmVmaXhJdGVtcyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc3QpIHtcbiAgICAgICAgICAgIGpzb24uaXRlbXMuYW55T2YucHVzaChyZXN0KTtcbiAgICAgICAgfVxuICAgICAgICBqc29uLm1pbkl0ZW1zID0gcHJlZml4SXRlbXMubGVuZ3RoO1xuICAgICAgICBpZiAoIXJlc3QpIHtcbiAgICAgICAgICAgIGpzb24ubWF4SXRlbXMgPSBwcmVmaXhJdGVtcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGpzb24uaXRlbXMgPSBwcmVmaXhJdGVtcztcbiAgICAgICAgaWYgKHJlc3QpIHtcbiAgICAgICAgICAgIGpzb24uYWRkaXRpb25hbEl0ZW1zID0gcmVzdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBsZW5ndGhcbiAgICBjb25zdCB7IG1pbmltdW0sIG1heGltdW0gfSA9IHNjaGVtYS5fem9kLmJhZztcbiAgICBpZiAodHlwZW9mIG1pbmltdW0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgIGpzb24ubWluSXRlbXMgPSBtaW5pbXVtO1xuICAgIGlmICh0eXBlb2YgbWF4aW11bSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAganNvbi5tYXhJdGVtcyA9IG1heGltdW07XG59O1xuZXhwb3J0IGNvbnN0IHJlY29yZFByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGpzb24gPSBfanNvbjtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAganNvbi50eXBlID0gXCJvYmplY3RcIjtcbiAgICAvLyBGb3IgbG9vc2VSZWNvcmQgd2l0aCByZWdleCBwYXR0ZXJucywgdXNlIHBhdHRlcm5Qcm9wZXJ0aWVzXG4gICAgLy8gVGhpcyBjb3JyZWN0bHkgcmVwcmVzZW50cyBcIm9ubHkgdmFsaWRhdGUga2V5cyBtYXRjaGluZyB0aGUgcGF0dGVyblwiIHNlbWFudGljc1xuICAgIC8vIGFuZCBjb21wb3NlcyB3ZWxsIHdpdGggYWxsT2YgKGludGVyc2VjdGlvbnMpXG4gICAgY29uc3Qga2V5VHlwZSA9IGRlZi5rZXlUeXBlO1xuICAgIGNvbnN0IGtleUJhZyA9IGtleVR5cGUuX3pvZC5iYWc7XG4gICAgY29uc3QgcGF0dGVybnMgPSBrZXlCYWc/LnBhdHRlcm5zO1xuICAgIGlmIChkZWYubW9kZSA9PT0gXCJsb29zZVwiICYmIHBhdHRlcm5zICYmIHBhdHRlcm5zLnNpemUgPiAwKSB7XG4gICAgICAgIC8vIFVzZSBwYXR0ZXJuUHJvcGVydGllcyBmb3IgbG9vc2VSZWNvcmQgd2l0aCByZWdleCBwYXR0ZXJuc1xuICAgICAgICBjb25zdCB2YWx1ZVNjaGVtYSA9IHByb2Nlc3MoZGVmLnZhbHVlVHlwZSwgY3R4LCB7XG4gICAgICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIFwicGF0dGVyblByb3BlcnRpZXNcIiwgXCIqXCJdLFxuICAgICAgICB9KTtcbiAgICAgICAganNvbi5wYXR0ZXJuUHJvcGVydGllcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHBhdHRlcm4gb2YgcGF0dGVybnMpIHtcbiAgICAgICAgICAgIGpzb24ucGF0dGVyblByb3BlcnRpZXNbcGF0dGVybi5zb3VyY2VdID0gdmFsdWVTY2hlbWE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQgYmVoYXZpb3I6IHVzZSBwcm9wZXJ0eU5hbWVzICsgYWRkaXRpb25hbFByb3BlcnRpZXNcbiAgICAgICAgaWYgKGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMDdcIiB8fCBjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIikge1xuICAgICAgICAgICAganNvbi5wcm9wZXJ0eU5hbWVzID0gcHJvY2VzcyhkZWYua2V5VHlwZSwgY3R4LCB7XG4gICAgICAgICAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICAgICAgICAgIHBhdGg6IFsuLi5wYXJhbXMucGF0aCwgXCJwcm9wZXJ0eU5hbWVzXCJdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAganNvbi5hZGRpdGlvbmFsUHJvcGVydGllcyA9IHByb2Nlc3MoZGVmLnZhbHVlVHlwZSwgY3R4LCB7XG4gICAgICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIl0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBBZGQgcmVxdWlyZWQgZm9yIGtleXMgd2l0aCBkaXNjcmV0ZSB2YWx1ZXMgKGVudW0sIGxpdGVyYWwsIGV0Yy4pXG4gICAgY29uc3Qga2V5VmFsdWVzID0ga2V5VHlwZS5fem9kLnZhbHVlcztcbiAgICBpZiAoa2V5VmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHZhbGlkS2V5VmFsdWVzID0gWy4uLmtleVZhbHVlc10uZmlsdGVyKCh2KSA9PiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIik7XG4gICAgICAgIGlmICh2YWxpZEtleVZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBqc29uLnJlcXVpcmVkID0gdmFsaWRLZXlWYWx1ZXM7XG4gICAgICAgIH1cbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IG51bGxhYmxlUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBqc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgaW5uZXIgPSBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgaWYgKGN0eC50YXJnZXQgPT09IFwib3BlbmFwaS0zLjBcIikge1xuICAgICAgICBzZWVuLnJlZiA9IGRlZi5pbm5lclR5cGU7XG4gICAgICAgIGpzb24ubnVsbGFibGUgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAganNvbi5hbnlPZiA9IFtpbm5lciwgeyB0eXBlOiBcIm51bGxcIiB9XTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IG5vbm9wdGlvbmFsUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBfanNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIHByb2Nlc3MoZGVmLmlubmVyVHlwZSwgY3R4LCBwYXJhbXMpO1xuICAgIGNvbnN0IHNlZW4gPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBzZWVuLnJlZiA9IGRlZi5pbm5lclR5cGU7XG59O1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIGpzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xuICAgIGpzb24uZGVmYXVsdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGVmLmRlZmF1bHRWYWx1ZSkpO1xufTtcbmV4cG9ydCBjb25zdCBwcmVmYXVsdFByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwganNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIHByb2Nlc3MoZGVmLmlubmVyVHlwZSwgY3R4LCBwYXJhbXMpO1xuICAgIGNvbnN0IHNlZW4gPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBzZWVuLnJlZiA9IGRlZi5pbm5lclR5cGU7XG4gICAgaWYgKGN0eC5pbyA9PT0gXCJpbnB1dFwiKVxuICAgICAgICBqc29uLl9wcmVmYXVsdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGVmLmRlZmF1bHRWYWx1ZSkpO1xufTtcbmV4cG9ydCBjb25zdCBjYXRjaFByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwganNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIHByb2Nlc3MoZGVmLmlubmVyVHlwZSwgY3R4LCBwYXJhbXMpO1xuICAgIGNvbnN0IHNlZW4gPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBzZWVuLnJlZiA9IGRlZi5pbm5lclR5cGU7XG4gICAgbGV0IGNhdGNoVmFsdWU7XG4gICAgdHJ5IHtcbiAgICAgICAgY2F0Y2hWYWx1ZSA9IGRlZi5jYXRjaFZhbHVlKHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRHluYW1pYyBjYXRjaCB2YWx1ZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxuICAgIGpzb24uZGVmYXVsdCA9IGNhdGNoVmFsdWU7XG59O1xuZXhwb3J0IGNvbnN0IHBpcGVQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgaW5Jc1RyYW5zZm9ybSA9IGRlZi5pbi5fem9kLnRyYWl0cy5oYXMoXCIkWm9kVHJhbnNmb3JtXCIpO1xuICAgIGNvbnN0IGlubmVyVHlwZSA9IGN0eC5pbyA9PT0gXCJpbnB1dFwiID8gKGluSXNUcmFuc2Zvcm0gPyBkZWYub3V0IDogZGVmLmluKSA6IGRlZi5vdXQ7XG4gICAgcHJvY2Vzcyhpbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBpbm5lclR5cGU7XG59O1xuZXhwb3J0IGNvbnN0IHJlYWRvbmx5UHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBqc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgcHJvY2VzcyhkZWYuaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIHNlZW4ucmVmID0gZGVmLmlubmVyVHlwZTtcbiAgICBqc29uLnJlYWRPbmx5ID0gdHJ1ZTtcbn07XG5leHBvcnQgY29uc3QgcHJvbWlzZVByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xufTtcbmV4cG9ydCBjb25zdCBvcHRpb25hbFByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xufTtcbmV4cG9ydCBjb25zdCBsYXp5UHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBfanNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaW5uZXJUeXBlID0gc2NoZW1hLl96b2QuaW5uZXJUeXBlO1xuICAgIHByb2Nlc3MoaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIHNlZW4ucmVmID0gaW5uZXJUeXBlO1xufTtcbi8vID09PT09PT09PT09PT09PT09PT09IEFMTCBQUk9DRVNTT1JTID09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgY29uc3QgYWxsUHJvY2Vzc29ycyA9IHtcbiAgICBzdHJpbmc6IHN0cmluZ1Byb2Nlc3NvcixcbiAgICBudW1iZXI6IG51bWJlclByb2Nlc3NvcixcbiAgICBib29sZWFuOiBib29sZWFuUHJvY2Vzc29yLFxuICAgIGJpZ2ludDogYmlnaW50UHJvY2Vzc29yLFxuICAgIHN5bWJvbDogc3ltYm9sUHJvY2Vzc29yLFxuICAgIG51bGw6IG51bGxQcm9jZXNzb3IsXG4gICAgdW5kZWZpbmVkOiB1bmRlZmluZWRQcm9jZXNzb3IsXG4gICAgdm9pZDogdm9pZFByb2Nlc3NvcixcbiAgICBuZXZlcjogbmV2ZXJQcm9jZXNzb3IsXG4gICAgYW55OiBhbnlQcm9jZXNzb3IsXG4gICAgdW5rbm93bjogdW5rbm93blByb2Nlc3NvcixcbiAgICBkYXRlOiBkYXRlUHJvY2Vzc29yLFxuICAgIGVudW06IGVudW1Qcm9jZXNzb3IsXG4gICAgbGl0ZXJhbDogbGl0ZXJhbFByb2Nlc3NvcixcbiAgICBuYW46IG5hblByb2Nlc3NvcixcbiAgICB0ZW1wbGF0ZV9saXRlcmFsOiB0ZW1wbGF0ZUxpdGVyYWxQcm9jZXNzb3IsXG4gICAgZmlsZTogZmlsZVByb2Nlc3NvcixcbiAgICBzdWNjZXNzOiBzdWNjZXNzUHJvY2Vzc29yLFxuICAgIGN1c3RvbTogY3VzdG9tUHJvY2Vzc29yLFxuICAgIGZ1bmN0aW9uOiBmdW5jdGlvblByb2Nlc3NvcixcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybVByb2Nlc3NvcixcbiAgICBtYXA6IG1hcFByb2Nlc3NvcixcbiAgICBzZXQ6IHNldFByb2Nlc3NvcixcbiAgICBhcnJheTogYXJyYXlQcm9jZXNzb3IsXG4gICAgb2JqZWN0OiBvYmplY3RQcm9jZXNzb3IsXG4gICAgdW5pb246IHVuaW9uUHJvY2Vzc29yLFxuICAgIGludGVyc2VjdGlvbjogaW50ZXJzZWN0aW9uUHJvY2Vzc29yLFxuICAgIHR1cGxlOiB0dXBsZVByb2Nlc3NvcixcbiAgICByZWNvcmQ6IHJlY29yZFByb2Nlc3NvcixcbiAgICBudWxsYWJsZTogbnVsbGFibGVQcm9jZXNzb3IsXG4gICAgbm9ub3B0aW9uYWw6IG5vbm9wdGlvbmFsUHJvY2Vzc29yLFxuICAgIGRlZmF1bHQ6IGRlZmF1bHRQcm9jZXNzb3IsXG4gICAgcHJlZmF1bHQ6IHByZWZhdWx0UHJvY2Vzc29yLFxuICAgIGNhdGNoOiBjYXRjaFByb2Nlc3NvcixcbiAgICBwaXBlOiBwaXBlUHJvY2Vzc29yLFxuICAgIHJlYWRvbmx5OiByZWFkb25seVByb2Nlc3NvcixcbiAgICBwcm9taXNlOiBwcm9taXNlUHJvY2Vzc29yLFxuICAgIG9wdGlvbmFsOiBvcHRpb25hbFByb2Nlc3NvcixcbiAgICBsYXp5OiBsYXp5UHJvY2Vzc29yLFxufTtcbmV4cG9ydCBmdW5jdGlvbiB0b0pTT05TY2hlbWEoaW5wdXQsIHBhcmFtcykge1xuICAgIGlmIChcIl9pZG1hcFwiIGluIGlucHV0KSB7XG4gICAgICAgIC8vIFJlZ2lzdHJ5IGNhc2VcbiAgICAgICAgY29uc3QgcmVnaXN0cnkgPSBpbnB1dDtcbiAgICAgICAgY29uc3QgY3R4ID0gaW5pdGlhbGl6ZUNvbnRleHQoeyAuLi5wYXJhbXMsIHByb2Nlc3NvcnM6IGFsbFByb2Nlc3NvcnMgfSk7XG4gICAgICAgIGNvbnN0IGRlZnMgPSB7fTtcbiAgICAgICAgLy8gRmlyc3QgcGFzczogcHJvY2VzcyBhbGwgc2NoZW1hcyB0byBidWlsZCB0aGUgc2VlbiBtYXBcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiByZWdpc3RyeS5faWRtYXAuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCBbXywgc2NoZW1hXSA9IGVudHJ5O1xuICAgICAgICAgICAgcHJvY2VzcyhzY2hlbWEsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2NoZW1hcyA9IHt9O1xuICAgICAgICBjb25zdCBleHRlcm5hbCA9IHtcbiAgICAgICAgICAgIHJlZ2lzdHJ5LFxuICAgICAgICAgICAgdXJpOiBwYXJhbXM/LnVyaSxcbiAgICAgICAgICAgIGRlZnMsXG4gICAgICAgIH07XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgY29udGV4dCB3aXRoIGV4dGVybmFsIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY3R4LmV4dGVybmFsID0gZXh0ZXJuYWw7XG4gICAgICAgIC8vIFNlY29uZCBwYXNzOiBlbWl0IGVhY2ggc2NoZW1hXG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgcmVnaXN0cnkuX2lkbWFwLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgW2tleSwgc2NoZW1hXSA9IGVudHJ5O1xuICAgICAgICAgICAgZXh0cmFjdERlZnMoY3R4LCBzY2hlbWEpO1xuICAgICAgICAgICAgc2NoZW1hc1trZXldID0gZmluYWxpemUoY3R4LCBzY2hlbWEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkZWZzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBkZWZzU2VnbWVudCA9IGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMjAyMC0xMlwiID8gXCIkZGVmc1wiIDogXCJkZWZpbml0aW9uc1wiO1xuICAgICAgICAgICAgc2NoZW1hcy5fX3NoYXJlZCA9IHtcbiAgICAgICAgICAgICAgICBbZGVmc1NlZ21lbnRdOiBkZWZzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzY2hlbWFzIH07XG4gICAgfVxuICAgIC8vIFNpbmdsZSBzY2hlbWEgY2FzZVxuICAgIGNvbnN0IGN0eCA9IGluaXRpYWxpemVDb250ZXh0KHsgLi4ucGFyYW1zLCBwcm9jZXNzb3JzOiBhbGxQcm9jZXNzb3JzIH0pO1xuICAgIHByb2Nlc3MoaW5wdXQsIGN0eCk7XG4gICAgZXh0cmFjdERlZnMoY3R4LCBpbnB1dCk7XG4gICAgcmV0dXJuIGZpbmFsaXplKGN0eCwgaW5wdXQpO1xufVxuIiwiaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi4vY29yZS9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgc2NoZW1hcyBmcm9tIFwiLi9zY2hlbWFzLmpzXCI7XG5leHBvcnQgY29uc3QgWm9kSVNPRGF0ZVRpbWUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kSVNPRGF0ZVRpbWVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZElTT0RhdGVUaW1lLmluaXQoaW5zdCwgZGVmKTtcbiAgICBzY2hlbWFzLlpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBkYXRldGltZShwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5faXNvRGF0ZVRpbWUoWm9kSVNPRGF0ZVRpbWUsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kSVNPRGF0ZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RJU09EYXRlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RJU09EYXRlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBzY2hlbWFzLlpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBkYXRlKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pc29EYXRlKFpvZElTT0RhdGUsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kSVNPVGltZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RJU09UaW1lXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RJU09UaW1lLmluaXQoaW5zdCwgZGVmKTtcbiAgICBzY2hlbWFzLlpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB0aW1lKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pc29UaW1lKFpvZElTT1RpbWUsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kSVNPRHVyYXRpb24gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kSVNPRHVyYXRpb25cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZElTT0R1cmF0aW9uLmluaXQoaW5zdCwgZGVmKTtcbiAgICBzY2hlbWFzLlpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBkdXJhdGlvbihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5faXNvRHVyYXRpb24oWm9kSVNPRHVyYXRpb24sIHBhcmFtcyk7XG59XG4iLCJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuLi9jb3JlL2luZGV4LmpzXCI7XG5pbXBvcnQgeyAkWm9kRXJyb3IgfSBmcm9tIFwiLi4vY29yZS9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwiLi4vY29yZS91dGlsLmpzXCI7XG5jb25zdCBpbml0aWFsaXplciA9IChpbnN0LCBpc3N1ZXMpID0+IHtcbiAgICAkWm9kRXJyb3IuaW5pdChpbnN0LCBpc3N1ZXMpO1xuICAgIGluc3QubmFtZSA9IFwiWm9kRXJyb3JcIjtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpbnN0LCB7XG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgdmFsdWU6IChtYXBwZXIpID0+IGNvcmUuZm9ybWF0RXJyb3IoaW5zdCwgbWFwcGVyKSxcbiAgICAgICAgICAgIC8vIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBmbGF0dGVuOiB7XG4gICAgICAgICAgICB2YWx1ZTogKG1hcHBlcikgPT4gY29yZS5mbGF0dGVuRXJyb3IoaW5zdCwgbWFwcGVyKSxcbiAgICAgICAgICAgIC8vIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBhZGRJc3N1ZToge1xuICAgICAgICAgICAgdmFsdWU6IChpc3N1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGluc3QuaXNzdWVzLnB1c2goaXNzdWUpO1xuICAgICAgICAgICAgICAgIGluc3QubWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGluc3QuaXNzdWVzLCB1dGlsLmpzb25TdHJpbmdpZnlSZXBsYWNlciwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGFkZElzc3Vlczoge1xuICAgICAgICAgICAgdmFsdWU6IChpc3N1ZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpbnN0Lmlzc3Vlcy5wdXNoKC4uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgaW5zdC5tZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoaW5zdC5pc3N1ZXMsIHV0aWwuanNvblN0cmluZ2lmeVJlcGxhY2VyLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgaXNFbXB0eToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0Lmlzc3Vlcy5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KGluc3QsIFwiaXNFbXB0eVwiLCB7XG4gICAgLy8gICBnZXQoKSB7XG4gICAgLy8gICAgIHJldHVybiBpbnN0Lmlzc3Vlcy5sZW5ndGggPT09IDA7XG4gICAgLy8gICB9LFxuICAgIC8vIH0pO1xufTtcbmV4cG9ydCBjb25zdCBab2RFcnJvciA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RFcnJvclwiLCBpbml0aWFsaXplcik7XG5leHBvcnQgY29uc3QgWm9kUmVhbEVycm9yID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEVycm9yXCIsIGluaXRpYWxpemVyLCB7XG4gICAgUGFyZW50OiBFcnJvcixcbn0pO1xuLy8gLyoqIEBkZXByZWNhdGVkIFVzZSBgei5jb3JlLiRab2RFcnJvck1hcEN0eGAgaW5zdGVhZC4gKi9cbi8vIGV4cG9ydCB0eXBlIEVycm9yTWFwQ3R4ID0gY29yZS4kWm9kRXJyb3JNYXBDdHg7XG4iLCJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuLi9jb3JlL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBab2RSZWFsRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnMuanNcIjtcbmV4cG9ydCBjb25zdCBwYXJzZSA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9wYXJzZShab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IHBhcnNlQXN5bmMgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fcGFyc2VBc3luYyhab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IHNhZmVQYXJzZSA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9zYWZlUGFyc2UoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VBc3luYyA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9zYWZlUGFyc2VBc3luYyhab2RSZWFsRXJyb3IpO1xuLy8gQ29kZWMgZnVuY3Rpb25zXG5leHBvcnQgY29uc3QgZW5jb2RlID0gLyogQF9fUFVSRV9fICovIGNvcmUuX2VuY29kZShab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IGRlY29kZSA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9kZWNvZGUoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBlbmNvZGVBc3luYyA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9lbmNvZGVBc3luYyhab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IGRlY29kZUFzeW5jID0gLyogQF9fUFVSRV9fICovIGNvcmUuX2RlY29kZUFzeW5jKFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3Qgc2FmZUVuY29kZSA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9zYWZlRW5jb2RlKFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3Qgc2FmZURlY29kZSA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9zYWZlRGVjb2RlKFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3Qgc2FmZUVuY29kZUFzeW5jID0gLyogQF9fUFVSRV9fICovIGNvcmUuX3NhZmVFbmNvZGVBc3luYyhab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IHNhZmVEZWNvZGVBc3luYyA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9zYWZlRGVjb2RlQXN5bmMoWm9kUmVhbEVycm9yKTtcbiIsImltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIi4uL2NvcmUvaW5kZXguanNcIjtcbmltcG9ydCB7IHV0aWwgfSBmcm9tIFwiLi4vY29yZS9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgcHJvY2Vzc29ycyBmcm9tIFwiLi4vY29yZS9qc29uLXNjaGVtYS1wcm9jZXNzb3JzLmpzXCI7XG5pbXBvcnQgeyBjcmVhdGVTdGFuZGFyZEpTT05TY2hlbWFNZXRob2QsIGNyZWF0ZVRvSlNPTlNjaGVtYU1ldGhvZCB9IGZyb20gXCIuLi9jb3JlL3RvLWpzb24tc2NoZW1hLmpzXCI7XG5pbXBvcnQgKiBhcyBjaGVja3MgZnJvbSBcIi4vY2hlY2tzLmpzXCI7XG5pbXBvcnQgKiBhcyBpc28gZnJvbSBcIi4vaXNvLmpzXCI7XG5pbXBvcnQgKiBhcyBwYXJzZSBmcm9tIFwiLi9wYXJzZS5qc1wiO1xuLy8gTGF6eS1iaW5kIGJ1aWxkZXIgbWV0aG9kcy5cbi8vXG4vLyBCdWlsZGVyIG1ldGhvZHMgKGAub3B0aW9uYWxgLCBgLmFycmF5YCwgYC5yZWZpbmVgLCAuLi4pIGxpdmUgYXNcbi8vIG5vbi1lbnVtZXJhYmxlIGdldHRlcnMgb24gZWFjaCBjb25jcmV0ZSBzY2hlbWEgY29uc3RydWN0b3Inc1xuLy8gcHJvdG90eXBlLiBPbiBmaXJzdCBhY2Nlc3MgZnJvbSBhbiBpbnN0YW5jZSB0aGUgZ2V0dGVyIGFsbG9jYXRlc1xuLy8gYGZuLmJpbmQodGhpcylgIGFuZCBjYWNoZXMgaXQgYXMgYW4gb3duIHByb3BlcnR5IG9uIHRoYXQgaW5zdGFuY2UsXG4vLyBzbyBkZXRhY2hlZCB1c2FnZSAoYGNvbnN0IG0gPSBzY2hlbWEub3B0aW9uYWw7IG0oKWApIHN0aWxsIHdvcmtzXG4vLyBhbmQgdGhlIHBlci1pbnN0YW5jZSBhbGxvY2F0aW9uIG9ubHkgaGFwcGVucyBmb3IgbWV0aG9kcyBhY3R1YWxseVxuLy8gdG91Y2hlZC5cbi8vXG4vLyBPbmUgaW5zdGFsbCBwZXIgKHByb3RvdHlwZSwgZ3JvdXApLCBtZW1vaXplZCBieSBgX2luc3RhbGxlZEdyb3Vwc2AuXG5jb25zdCBfaW5zdGFsbGVkR3JvdXBzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBfaW5zdGFsbExhenlNZXRob2RzKGluc3QsIGdyb3VwLCBtZXRob2RzKSB7XG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5zdCk7XG4gICAgbGV0IGluc3RhbGxlZCA9IF9pbnN0YWxsZWRHcm91cHMuZ2V0KHByb3RvKTtcbiAgICBpZiAoIWluc3RhbGxlZCkge1xuICAgICAgICBpbnN0YWxsZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgIF9pbnN0YWxsZWRHcm91cHMuc2V0KHByb3RvLCBpbnN0YWxsZWQpO1xuICAgIH1cbiAgICBpZiAoaW5zdGFsbGVkLmhhcyhncm91cCkpXG4gICAgICAgIHJldHVybjtcbiAgICBpbnN0YWxsZWQuYWRkKGdyb3VwKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBtZXRob2RzKSB7XG4gICAgICAgIGNvbnN0IGZuID0gbWV0aG9kc1trZXldO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIGtleSwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYm91bmQgPSBmbi5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGJvdW5kLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBib3VuZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHYsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgWm9kVHlwZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RUeXBlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBPYmplY3QuYXNzaWduKGluc3RbXCJ+c3RhbmRhcmRcIl0sIHtcbiAgICAgICAganNvblNjaGVtYToge1xuICAgICAgICAgICAgaW5wdXQ6IGNyZWF0ZVN0YW5kYXJkSlNPTlNjaGVtYU1ldGhvZChpbnN0LCBcImlucHV0XCIpLFxuICAgICAgICAgICAgb3V0cHV0OiBjcmVhdGVTdGFuZGFyZEpTT05TY2hlbWFNZXRob2QoaW5zdCwgXCJvdXRwdXRcIiksXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgaW5zdC50b0pTT05TY2hlbWEgPSBjcmVhdGVUb0pTT05TY2hlbWFNZXRob2QoaW5zdCwge30pO1xuICAgIGluc3QuZGVmID0gZGVmO1xuICAgIGluc3QudHlwZSA9IGRlZi50eXBlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcIl9kZWZcIiwgeyB2YWx1ZTogZGVmIH0pO1xuICAgIC8vIFBhcnNlLWZhbWlseSBpcyBpbnRlbnRpb25hbGx5IGtlcHQgYXMgcGVyLWluc3RhbmNlIGNsb3N1cmVzOiB0aGVzZSBhcmVcbiAgICAvLyB0aGUgaG90IHBhdGggQU5EIHRoZSBtb3N0LWRldGFjaGVkIG1ldGhvZHMgKGBhcnIubWFwKHNjaGVtYS5wYXJzZSlgLFxuICAgIC8vIGBjb25zdCB7IHBhcnNlIH0gPSBzY2hlbWFgLCBldGMuKS4gRWFnZXIgY2xvc3VyZXMgaGVyZSBtZWFuIGNhbGxlcnMgcGF5XG4gICAgLy8gfjEyIGNsb3N1cmUgYWxsb2NhdGlvbnMgcGVyIHNjaGVtYSBidXQgZ2V0IG1vbm9tb3JwaGljIGNhbGwgc2l0ZXMgYW5kXG4gICAgLy8gZGV0YWNoZWQgdXNhZ2UgdGhhdCBcImp1c3Qgd29ya3NcIi5cbiAgICBpbnN0LnBhcnNlID0gKGRhdGEsIHBhcmFtcykgPT4gcGFyc2UucGFyc2UoaW5zdCwgZGF0YSwgcGFyYW1zLCB7IGNhbGxlZTogaW5zdC5wYXJzZSB9KTtcbiAgICBpbnN0LnNhZmVQYXJzZSA9IChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnNhZmVQYXJzZShpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3QucGFyc2VBc3luYyA9IGFzeW5jIChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnBhcnNlQXN5bmMoaW5zdCwgZGF0YSwgcGFyYW1zLCB7IGNhbGxlZTogaW5zdC5wYXJzZUFzeW5jIH0pO1xuICAgIGluc3Quc2FmZVBhcnNlQXN5bmMgPSBhc3luYyAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5zYWZlUGFyc2VBc3luYyhpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3Quc3BhID0gaW5zdC5zYWZlUGFyc2VBc3luYztcbiAgICBpbnN0LmVuY29kZSA9IChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLmVuY29kZShpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3QuZGVjb2RlID0gKGRhdGEsIHBhcmFtcykgPT4gcGFyc2UuZGVjb2RlKGluc3QsIGRhdGEsIHBhcmFtcyk7XG4gICAgaW5zdC5lbmNvZGVBc3luYyA9IGFzeW5jIChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLmVuY29kZUFzeW5jKGluc3QsIGRhdGEsIHBhcmFtcyk7XG4gICAgaW5zdC5kZWNvZGVBc3luYyA9IGFzeW5jIChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLmRlY29kZUFzeW5jKGluc3QsIGRhdGEsIHBhcmFtcyk7XG4gICAgaW5zdC5zYWZlRW5jb2RlID0gKGRhdGEsIHBhcmFtcykgPT4gcGFyc2Uuc2FmZUVuY29kZShpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3Quc2FmZURlY29kZSA9IChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnNhZmVEZWNvZGUoaW5zdCwgZGF0YSwgcGFyYW1zKTtcbiAgICBpbnN0LnNhZmVFbmNvZGVBc3luYyA9IGFzeW5jIChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnNhZmVFbmNvZGVBc3luYyhpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3Quc2FmZURlY29kZUFzeW5jID0gYXN5bmMgKGRhdGEsIHBhcmFtcykgPT4gcGFyc2Uuc2FmZURlY29kZUFzeW5jKGluc3QsIGRhdGEsIHBhcmFtcyk7XG4gICAgLy8gQWxsIGJ1aWxkZXIgbWV0aG9kcyBhcmUgcGxhY2VkIG9uIHRoZSBpbnRlcm5hbCBwcm90b3R5cGUgYXMgbGF6eS1iaW5kXG4gICAgLy8gZ2V0dGVycy4gT24gZmlyc3QgYWNjZXNzIHBlci1pbnN0YW5jZSwgYSBib3VuZCB0aHVuayBpcyBhbGxvY2F0ZWQgYW5kXG4gICAgLy8gY2FjaGVkIGFzIGFuIG93biBwcm9wZXJ0eTsgc3Vic2VxdWVudCBhY2Nlc3NlcyBza2lwIHRoZSBnZXR0ZXIuIFRoaXNcbiAgICAvLyBtZWFuczogbm8gcGVyLWluc3RhbmNlIGFsbG9jYXRpb24gZm9yIHVudXNlZCBtZXRob2RzLCBmdWxsXG4gICAgLy8gZGV0YWNoYWJpbGl0eSBwcmVzZXJ2ZWQgKGBjb25zdCBtID0gc2NoZW1hLm9wdGlvbmFsOyBtKClgIHdvcmtzKSwgYW5kXG4gICAgLy8gc2hhcmVkIHVuZGVybHlpbmcgZnVuY3Rpb24gcmVmZXJlbmNlcyBhY3Jvc3MgYWxsIGluc3RhbmNlcy5cbiAgICBfaW5zdGFsbExhenlNZXRob2RzKGluc3QsIFwiWm9kVHlwZVwiLCB7XG4gICAgICAgIGNoZWNrKC4uLmNoa3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZiA9IHRoaXMuZGVmO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUodXRpbC5tZXJnZURlZnMoZGVmLCB7XG4gICAgICAgICAgICAgICAgY2hlY2tzOiBbXG4gICAgICAgICAgICAgICAgICAgIC4uLihkZWYuY2hlY2tzID8/IFtdKSxcbiAgICAgICAgICAgICAgICAgICAgLi4uY2hrcy5tYXAoKGNoKSA9PiB0eXBlb2YgY2ggPT09IFwiZnVuY3Rpb25cIiA/IHsgX3pvZDogeyBjaGVjazogY2gsIGRlZjogeyBjaGVjazogXCJjdXN0b21cIiB9LCBvbmF0dGFjaDogW10gfSB9IDogY2gpLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSwgeyBwYXJlbnQ6IHRydWUgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdpdGgoLi4uY2hrcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soLi4uY2hrcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGNsb25lKGRlZiwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gY29yZS5jbG9uZSh0aGlzLCBkZWYsIHBhcmFtcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGJyYW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2lzdGVyKHJlZywgbWV0YSkge1xuICAgICAgICAgICAgcmVnLmFkZCh0aGlzLCBtZXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICByZWZpbmUoY2hlY2ssIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2socmVmaW5lKGNoZWNrLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgc3VwZXJSZWZpbmUocmVmaW5lbWVudCwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhzdXBlclJlZmluZShyZWZpbmVtZW50LCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3ZlcndyaXRlKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3Mub3ZlcndyaXRlKGZuKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbmFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbmFsKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBleGFjdE9wdGlvbmFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4YWN0T3B0aW9uYWwodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIG51bGxhYmxlKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxhYmxlKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBudWxsaXNoKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbmFsKG51bGxhYmxlKHRoaXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm9ub3B0aW9uYWwocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9ub3B0aW9uYWwodGhpcywgcGFyYW1zKTtcbiAgICAgICAgfSxcbiAgICAgICAgYXJyYXkoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9yKGFyZykge1xuICAgICAgICAgICAgcmV0dXJuIHVuaW9uKFt0aGlzLCBhcmddKTtcbiAgICAgICAgfSxcbiAgICAgICAgYW5kKGFyZykge1xuICAgICAgICAgICAgcmV0dXJuIGludGVyc2VjdGlvbih0aGlzLCBhcmcpO1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2Zvcm0odHgpIHtcbiAgICAgICAgICAgIHJldHVybiBwaXBlKHRoaXMsIHRyYW5zZm9ybSh0eCkpO1xuICAgICAgICB9LFxuICAgICAgICBkZWZhdWx0KGQpIHtcbiAgICAgICAgICAgIHJldHVybiBfZGVmYXVsdCh0aGlzLCBkKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJlZmF1bHQoZCkge1xuICAgICAgICAgICAgcmV0dXJuIHByZWZhdWx0KHRoaXMsIGQpO1xuICAgICAgICB9LFxuICAgICAgICBjYXRjaChwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiBfY2F0Y2godGhpcywgcGFyYW1zKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGlwZSh0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBwaXBlKHRoaXMsIHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlYWRvbmx5KCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlYWRvbmx5KHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBkZXNjcmliZShkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgY29uc3QgY2wgPSB0aGlzLmNsb25lKCk7XG4gICAgICAgICAgICBjb3JlLmdsb2JhbFJlZ2lzdHJ5LmFkZChjbCwgeyBkZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgICAgIHJldHVybiBjbDtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0YSguLi5hcmdzKSB7XG4gICAgICAgICAgICAvLyBvdmVybG9hZGVkOiBtZXRhKCkgcmV0dXJucyB0aGUgcmVnaXN0ZXJlZCBtZXRhZGF0YSwgbWV0YShkYXRhKVxuICAgICAgICAgICAgLy8gcmV0dXJucyBhIGNsb25lIHdpdGggYGRhdGFgIHJlZ2lzdGVyZWQuIFRoZSBtYXBwZWQgdHlwZSBwaWNrc1xuICAgICAgICAgICAgLy8gdXAgdGhlIHNlY29uZCBvdmVybG9hZCwgc28gd2UgYWNjZXB0IHZhcmlhZGljIGFueS1hcmdzIGFuZFxuICAgICAgICAgICAgLy8gcmV0dXJuIGBhbnlgIHRvIHNhdGlzZnkgYm90aCBhdCBydW50aW1lLlxuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb3JlLmdsb2JhbFJlZ2lzdHJ5LmdldCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IGNsID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICAgICAgY29yZS5nbG9iYWxSZWdpc3RyeS5hZGQoY2wsIGFyZ3NbMF0pO1xuICAgICAgICAgICAgcmV0dXJuIGNsO1xuICAgICAgICB9LFxuICAgICAgICBpc09wdGlvbmFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2FmZVBhcnNlKHVuZGVmaW5lZCkuc3VjY2VzcztcbiAgICAgICAgfSxcbiAgICAgICAgaXNOdWxsYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhZmVQYXJzZShudWxsKS5zdWNjZXNzO1xuICAgICAgICB9LFxuICAgICAgICBhcHBseShmbikge1xuICAgICAgICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcImRlc2NyaXB0aW9uXCIsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvcmUuZ2xvYmFsUmVnaXN0cnkuZ2V0KGluc3QpPy5kZXNjcmlwdGlvbjtcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIH0pO1xuICAgIHJldHVybiBpbnN0O1xufSk7XG4vKiogQGludGVybmFsICovXG5leHBvcnQgY29uc3QgX1pvZFN0cmluZyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJfWm9kU3RyaW5nXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RTdHJpbmcuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5zdHJpbmdQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgaW5zdC5mb3JtYXQgPSBiYWcuZm9ybWF0ID8/IG51bGw7XG4gICAgaW5zdC5taW5MZW5ndGggPSBiYWcubWluaW11bSA/PyBudWxsO1xuICAgIGluc3QubWF4TGVuZ3RoID0gYmFnLm1heGltdW0gPz8gbnVsbDtcbiAgICBfaW5zdGFsbExhenlNZXRob2RzKGluc3QsIFwiX1pvZFN0cmluZ1wiLCB7XG4gICAgICAgIHJlZ2V4KC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5yZWdleCguLi5hcmdzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGluY2x1ZGVzKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5pbmNsdWRlcyguLi5hcmdzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXJ0c1dpdGgoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLnN0YXJ0c1dpdGgoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICBlbmRzV2l0aCguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MuZW5kc1dpdGgoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICBtaW4oLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm1pbkxlbmd0aCguLi5hcmdzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1heCguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubWF4TGVuZ3RoKC4uLmFyZ3MpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbGVuZ3RoKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sZW5ndGgoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICBub25lbXB0eSguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubWluTGVuZ3RoKDEsIC4uLmFyZ3MpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbG93ZXJjYXNlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmxvd2VyY2FzZShwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBwZXJjYXNlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLnVwcGVyY2FzZShwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgdHJpbSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy50cmltKCkpO1xuICAgICAgICB9LFxuICAgICAgICBub3JtYWxpemUoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm5vcm1hbGl6ZSguLi5hcmdzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9LFxuICAgICAgICB0b1VwcGVyQ2FzZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2x1Z2lmeSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5zbHVnaWZ5KCkpO1xuICAgICAgICB9LFxuICAgIH0pO1xufSk7XG5leHBvcnQgY29uc3QgWm9kU3RyaW5nID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFN0cmluZ1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kU3RyaW5nLmluaXQoaW5zdCwgZGVmKTtcbiAgICBfWm9kU3RyaW5nLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0LmVtYWlsID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9lbWFpbChab2RFbWFpbCwgcGFyYW1zKSk7XG4gICAgaW5zdC51cmwgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3VybChab2RVUkwsIHBhcmFtcykpO1xuICAgIGluc3Quand0ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9qd3QoWm9kSldULCBwYXJhbXMpKTtcbiAgICBpbnN0LmVtb2ppID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9lbW9qaShab2RFbW9qaSwgcGFyYW1zKSk7XG4gICAgaW5zdC5ndWlkID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9ndWlkKFpvZEdVSUQsIHBhcmFtcykpO1xuICAgIGluc3QudXVpZCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fdXVpZChab2RVVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0LnV1aWR2NCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fdXVpZHY0KFpvZFVVSUQsIHBhcmFtcykpO1xuICAgIGluc3QudXVpZHY2ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl91dWlkdjYoWm9kVVVJRCwgcGFyYW1zKSk7XG4gICAgaW5zdC51dWlkdjcgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3V1aWR2Nyhab2RVVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0Lm5hbm9pZCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fbmFub2lkKFpvZE5hbm9JRCwgcGFyYW1zKSk7XG4gICAgaW5zdC5ndWlkID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9ndWlkKFpvZEdVSUQsIHBhcmFtcykpO1xuICAgIGluc3QuY3VpZCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fY3VpZChab2RDVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0LmN1aWQyID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9jdWlkMihab2RDVUlEMiwgcGFyYW1zKSk7XG4gICAgaW5zdC51bGlkID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl91bGlkKFpvZFVMSUQsIHBhcmFtcykpO1xuICAgIGluc3QuYmFzZTY0ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9iYXNlNjQoWm9kQmFzZTY0LCBwYXJhbXMpKTtcbiAgICBpbnN0LmJhc2U2NHVybCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fYmFzZTY0dXJsKFpvZEJhc2U2NFVSTCwgcGFyYW1zKSk7XG4gICAgaW5zdC54aWQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3hpZChab2RYSUQsIHBhcmFtcykpO1xuICAgIGluc3Qua3N1aWQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX2tzdWlkKFpvZEtTVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0LmlwdjQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX2lwdjQoWm9kSVB2NCwgcGFyYW1zKSk7XG4gICAgaW5zdC5pcHY2ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9pcHY2KFpvZElQdjYsIHBhcmFtcykpO1xuICAgIGluc3QuY2lkcnY0ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9jaWRydjQoWm9kQ0lEUnY0LCBwYXJhbXMpKTtcbiAgICBpbnN0LmNpZHJ2NiA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fY2lkcnY2KFpvZENJRFJ2NiwgcGFyYW1zKSk7XG4gICAgaW5zdC5lMTY0ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9lMTY0KFpvZEUxNjQsIHBhcmFtcykpO1xuICAgIC8vIGlzb1xuICAgIGluc3QuZGF0ZXRpbWUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGlzby5kYXRldGltZShwYXJhbXMpKTtcbiAgICBpbnN0LmRhdGUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGlzby5kYXRlKHBhcmFtcykpO1xuICAgIGluc3QudGltZSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soaXNvLnRpbWUocGFyYW1zKSk7XG4gICAgaW5zdC5kdXJhdGlvbiA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soaXNvLmR1cmF0aW9uKHBhcmFtcykpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9zdHJpbmcoWm9kU3RyaW5nLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFN0cmluZ0Zvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RTdHJpbmdGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgX1pvZFN0cmluZy5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCBab2RFbWFpbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RFbWFpbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RFbWFpbC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGVtYWlsKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9lbWFpbChab2RFbWFpbCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RHVUlEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEdVSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kR1VJRC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGd1aWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2d1aWQoWm9kR1VJRCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RVVUlEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFVVSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kVVVJRC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHV1aWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3V1aWQoWm9kVVVJRCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1dWlkdjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3V1aWR2NChab2RVVUlELCBwYXJhbXMpO1xufVxuLy8gWm9kVVVJRHY2XG5leHBvcnQgZnVuY3Rpb24gdXVpZHY2KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91dWlkdjYoWm9kVVVJRCwgcGFyYW1zKTtcbn1cbi8vIFpvZFVVSUR2N1xuZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NyhwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fdXVpZHY3KFpvZFVVSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kVVJMID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFVSTFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RVUkwuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB1cmwocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3VybChab2RVUkwsIHBhcmFtcyk7XG59XG5leHBvcnQgZnVuY3Rpb24gaHR0cFVybChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fdXJsKFpvZFVSTCwge1xuICAgICAgICBwcm90b2NvbDogY29yZS5yZWdleGVzLmh0dHBQcm90b2NvbCxcbiAgICAgICAgaG9zdG5hbWU6IGNvcmUucmVnZXhlcy5kb21haW4sXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kRW1vamkgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kRW1vamlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kRW1vamkuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBlbW9qaShwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fZW1vamkoWm9kRW1vamksIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kTmFub0lEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE5hbm9JRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2ROYW5vSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBuYW5vaWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX25hbm9pZChab2ROYW5vSUQsIHBhcmFtcyk7XG59XG4vKipcbiAqIEBkZXByZWNhdGVkIENVSUQgdjEgaXMgZGVwcmVjYXRlZCBieSBpdHMgYXV0aG9ycyBkdWUgdG8gaW5mb3JtYXRpb24gbGVha2FnZVxuICogKHRpbWVzdGFtcHMgZW1iZWRkZWQgaW4gdGhlIGlkKS4gVXNlIHtAbGluayBab2RDVUlEMn0gaW5zdGVhZC5cbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcGFyYWxsZWxkcml2ZS9jdWlkLlxuICovXG5leHBvcnQgY29uc3QgWm9kQ1VJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDVUlEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZENVSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbi8qKlxuICogVmFsaWRhdGVzIGEgQ1VJRCB2MSBzdHJpbmcuXG4gKlxuICogQGRlcHJlY2F0ZWQgQ1VJRCB2MSBpcyBkZXByZWNhdGVkIGJ5IGl0cyBhdXRob3JzIGR1ZSB0byBpbmZvcm1hdGlvbiBsZWFrYWdlXG4gKiAodGltZXN0YW1wcyBlbWJlZGRlZCBpbiB0aGUgaWQpLiBVc2Uge0BsaW5rIGN1aWQyIHwgYHouY3VpZDIoKWB9IGluc3RlYWQuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhcmFsbGVsZHJpdmUvY3VpZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1aWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2N1aWQoWm9kQ1VJRCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RDVUlEMiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDVUlEMlwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RDVUlEMi5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGN1aWQyKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jdWlkMihab2RDVUlEMiwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RVTElEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFVMSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kVUxJRC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHVsaWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3VsaWQoWm9kVUxJRCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RYSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kWElEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZFhJRC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHhpZChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5feGlkKFpvZFhJRCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RLU1VJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RLU1VJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RLU1VJRC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGtzdWlkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9rc3VpZChab2RLU1VJRCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RJUHY0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZElQdjRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kSVB2NC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGlwdjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2lwdjQoWm9kSVB2NCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RNQUMgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTUFDXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZE1BQy5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1hYyhwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fbWFjKFpvZE1BQywgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RJUHY2ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZElQdjZcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kSVB2Ni5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGlwdjYocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2lwdjYoWm9kSVB2NiwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RDSURSdjQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQ0lEUnY0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RDSURSdjQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBjaWRydjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2NpZHJ2NChab2RDSURSdjQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kQ0lEUnY2ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZENJRFJ2NlwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQ0lEUnY2LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gY2lkcnY2KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jaWRydjYoWm9kQ0lEUnY2LCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEJhc2U2NCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RCYXNlNjRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kQmFzZTY0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9iYXNlNjQoWm9kQmFzZTY0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEJhc2U2NFVSTCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RCYXNlNjRVUkxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kQmFzZTY0VVJMLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gYmFzZTY0dXJsKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9iYXNlNjR1cmwoWm9kQmFzZTY0VVJMLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEUxNjQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kRTE2NFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RFMTY0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gZTE2NChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fZTE2NChab2RFMTY0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEpXVCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RKV1RcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kSldULmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gand0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9qd3QoWm9kSldULCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEN1c3RvbVN0cmluZ0Zvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDdXN0b21TdHJpbmdGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kQ3VzdG9tU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nRm9ybWF0KGZvcm1hdCwgZm5PclJlZ2V4LCBfcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gY29yZS5fc3RyaW5nRm9ybWF0KFpvZEN1c3RvbVN0cmluZ0Zvcm1hdCwgZm9ybWF0LCBmbk9yUmVnZXgsIF9wYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGhvc3RuYW1lKF9wYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fc3RyaW5nRm9ybWF0KFpvZEN1c3RvbVN0cmluZ0Zvcm1hdCwgXCJob3N0bmFtZVwiLCBjb3JlLnJlZ2V4ZXMuaG9zdG5hbWUsIF9wYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGhleChfcGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3N0cmluZ0Zvcm1hdChab2RDdXN0b21TdHJpbmdGb3JtYXQsIFwiaGV4XCIsIGNvcmUucmVnZXhlcy5oZXgsIF9wYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGhhc2goYWxnLCBwYXJhbXMpIHtcbiAgICBjb25zdCBlbmMgPSBwYXJhbXM/LmVuYyA/PyBcImhleFwiO1xuICAgIGNvbnN0IGZvcm1hdCA9IGAke2FsZ31fJHtlbmN9YDtcbiAgICBjb25zdCByZWdleCA9IGNvcmUucmVnZXhlc1tmb3JtYXRdO1xuICAgIGlmICghcmVnZXgpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIGhhc2ggZm9ybWF0OiAke2Zvcm1hdH1gKTtcbiAgICByZXR1cm4gY29yZS5fc3RyaW5nRm9ybWF0KFpvZEN1c3RvbVN0cmluZ0Zvcm1hdCwgZm9ybWF0LCByZWdleCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2ROdW1iZXIgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTnVtYmVyXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2ROdW1iZXIuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5udW1iZXJQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIF9pbnN0YWxsTGF6eU1ldGhvZHMoaW5zdCwgXCJab2ROdW1iZXJcIiwge1xuICAgICAgICBndCh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MuZ3QodmFsdWUsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBndGUodmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmd0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1pbih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MuZ3RlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbHQodmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmx0KHZhbHVlLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbHRlKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sdGUodmFsdWUsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBtYXgodmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmx0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGludChwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGludChwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2FmZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGludChwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcG9zaXRpdmUocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MuZ3QoMCwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5vbm5lZ2F0aXZlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmd0ZSgwLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbmVnYXRpdmUocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubHQoMCwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5vbnBvc2l0aXZlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmx0ZSgwLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbXVsdGlwbGVPZih2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubXVsdGlwbGVPZih2YWx1ZSwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0ZXAodmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm11bHRpcGxlT2YodmFsdWUsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBmaW5pdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgIGluc3QubWluVmFsdWUgPVxuICAgICAgICBNYXRoLm1heChiYWcubWluaW11bSA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksIGJhZy5leGNsdXNpdmVNaW5pbXVtID8/IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSkgPz8gbnVsbDtcbiAgICBpbnN0Lm1heFZhbHVlID1cbiAgICAgICAgTWF0aC5taW4oYmFnLm1heGltdW0gPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCBiYWcuZXhjbHVzaXZlTWF4aW11bSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpID8/IG51bGw7XG4gICAgaW5zdC5pc0ludCA9IChiYWcuZm9ybWF0ID8/IFwiXCIpLmluY2x1ZGVzKFwiaW50XCIpIHx8IE51bWJlci5pc1NhZmVJbnRlZ2VyKGJhZy5tdWx0aXBsZU9mID8/IDAuNSk7XG4gICAgaW5zdC5pc0Zpbml0ZSA9IHRydWU7XG4gICAgaW5zdC5mb3JtYXQgPSBiYWcuZm9ybWF0ID8/IG51bGw7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBudW1iZXIocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX251bWJlcihab2ROdW1iZXIsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kTnVtYmVyRm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE51bWJlckZvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kTnVtYmVyRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2ROdW1iZXIuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gaW50KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pbnQoWm9kTnVtYmVyRm9ybWF0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0MzIocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2Zsb2F0MzIoWm9kTnVtYmVyRm9ybWF0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0NjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2Zsb2F0NjQoWm9kTnVtYmVyRm9ybWF0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGludDMyKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pbnQzMihab2ROdW1iZXJGb3JtYXQsIHBhcmFtcyk7XG59XG5leHBvcnQgZnVuY3Rpb24gdWludDMyKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91aW50MzIoWm9kTnVtYmVyRm9ybWF0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEJvb2xlYW4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQm9vbGVhblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQm9vbGVhbi5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmJvb2xlYW5Qcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gYm9vbGVhbihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fYm9vbGVhbihab2RCb29sZWFuLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEJpZ0ludCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RCaWdJbnRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEJpZ0ludC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmJpZ2ludFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5ndGUgPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MuZ3RlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1pbiA9ICh2YWx1ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5ndGUodmFsdWUsIHBhcmFtcykpO1xuICAgIGluc3QuZ3QgPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MuZ3QodmFsdWUsIHBhcmFtcykpO1xuICAgIGluc3QuZ3RlID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmd0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5taW4gPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MuZ3RlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lmx0ID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmx0KHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lmx0ZSA9ICh2YWx1ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5sdGUodmFsdWUsIHBhcmFtcykpO1xuICAgIGluc3QubWF4ID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmx0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5wb3NpdGl2ZSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmd0KEJpZ0ludCgwKSwgcGFyYW1zKSk7XG4gICAgaW5zdC5uZWdhdGl2ZSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmx0KEJpZ0ludCgwKSwgcGFyYW1zKSk7XG4gICAgaW5zdC5ub25wb3NpdGl2ZSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmx0ZShCaWdJbnQoMCksIHBhcmFtcykpO1xuICAgIGluc3Qubm9ubmVnYXRpdmUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5ndGUoQmlnSW50KDApLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm11bHRpcGxlT2YgPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MubXVsdGlwbGVPZih2YWx1ZSwgcGFyYW1zKSk7XG4gICAgY29uc3QgYmFnID0gaW5zdC5fem9kLmJhZztcbiAgICBpbnN0Lm1pblZhbHVlID0gYmFnLm1pbmltdW0gPz8gbnVsbDtcbiAgICBpbnN0Lm1heFZhbHVlID0gYmFnLm1heGltdW0gPz8gbnVsbDtcbiAgICBpbnN0LmZvcm1hdCA9IGJhZy5mb3JtYXQgPz8gbnVsbDtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGJpZ2ludChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fYmlnaW50KFpvZEJpZ0ludCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RCaWdJbnRGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQmlnSW50Rm9ybWF0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RCaWdJbnRGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZEJpZ0ludC5pbml0KGluc3QsIGRlZik7XG59KTtcbi8vIGludDY0XG5leHBvcnQgZnVuY3Rpb24gaW50NjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2ludDY0KFpvZEJpZ0ludEZvcm1hdCwgcGFyYW1zKTtcbn1cbi8vIHVpbnQ2NFxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ2NChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fdWludDY0KFpvZEJpZ0ludEZvcm1hdCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RTeW1ib2wgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kU3ltYm9sXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RTeW1ib2wuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5zeW1ib2xQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gc3ltYm9sKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9zeW1ib2woWm9kU3ltYm9sLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFVuZGVmaW5lZCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RVbmRlZmluZWRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZFVuZGVmaW5lZC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnVuZGVmaW5lZFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmZ1bmN0aW9uIF91bmRlZmluZWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3VuZGVmaW5lZChab2RVbmRlZmluZWQsIHBhcmFtcyk7XG59XG5leHBvcnQgeyBfdW5kZWZpbmVkIGFzIHVuZGVmaW5lZCB9O1xuZXhwb3J0IGNvbnN0IFpvZE51bGwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTnVsbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kTnVsbC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLm51bGxQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5mdW5jdGlvbiBfbnVsbChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fbnVsbChab2ROdWxsLCBwYXJhbXMpO1xufVxuZXhwb3J0IHsgX251bGwgYXMgbnVsbCB9O1xuZXhwb3J0IGNvbnN0IFpvZEFueSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RBbnlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEFueS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmFueVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBhbnkoKSB7XG4gICAgcmV0dXJuIGNvcmUuX2FueShab2RBbnkpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFVua25vd24gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kVW5rbm93blwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVW5rbm93bi5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnVua25vd25Qcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdW5rbm93bigpIHtcbiAgICByZXR1cm4gY29yZS5fdW5rbm93bihab2RVbmtub3duKTtcbn1cbmV4cG9ydCBjb25zdCBab2ROZXZlciA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2ROZXZlclwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kTmV2ZXIuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5uZXZlclByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBuZXZlcihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fbmV2ZXIoWm9kTmV2ZXIsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kVm9pZCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RWb2lkXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RWb2lkLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMudm9pZFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmZ1bmN0aW9uIF92b2lkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl92b2lkKFpvZFZvaWQsIHBhcmFtcyk7XG59XG5leHBvcnQgeyBfdm9pZCBhcyB2b2lkIH07XG5leHBvcnQgY29uc3QgWm9kRGF0ZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2REYXRlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2REYXRlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuZGF0ZVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5taW4gPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MuZ3RlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1heCA9ICh2YWx1ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5sdGUodmFsdWUsIHBhcmFtcykpO1xuICAgIGNvbnN0IGMgPSBpbnN0Ll96b2QuYmFnO1xuICAgIGluc3QubWluRGF0ZSA9IGMubWluaW11bSA/IG5ldyBEYXRlKGMubWluaW11bSkgOiBudWxsO1xuICAgIGluc3QubWF4RGF0ZSA9IGMubWF4aW11bSA/IG5ldyBEYXRlKGMubWF4aW11bSkgOiBudWxsO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gZGF0ZShwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fZGF0ZShab2REYXRlLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZEFycmF5ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEFycmF5XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RBcnJheS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmFycmF5UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LmVsZW1lbnQgPSBkZWYuZWxlbWVudDtcbiAgICBfaW5zdGFsbExhenlNZXRob2RzKGluc3QsIFwiWm9kQXJyYXlcIiwge1xuICAgICAgICBtaW4obiwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubWluTGVuZ3RoKG4sIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBub25lbXB0eShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5taW5MZW5ndGgoMSwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1heChuLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5tYXhMZW5ndGgobiwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxlbmd0aChuLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sZW5ndGgobiwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHVud3JhcCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIH0sXG4gICAgfSk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBhcnJheShlbGVtZW50LCBwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fYXJyYXkoWm9kQXJyYXksIGVsZW1lbnQsIHBhcmFtcyk7XG59XG4vLyAua2V5b2ZcbmV4cG9ydCBmdW5jdGlvbiBrZXlvZihzY2hlbWEpIHtcbiAgICBjb25zdCBzaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICByZXR1cm4gX2VudW0oT2JqZWN0LmtleXMoc2hhcGUpKTtcbn1cbmV4cG9ydCBjb25zdCBab2RPYmplY3QgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kT2JqZWN0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RPYmplY3RKSVQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5vYmplY3RQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0LCBcInNoYXBlXCIsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRlZi5zaGFwZTtcbiAgICB9KTtcbiAgICBfaW5zdGFsbExhenlNZXRob2RzKGluc3QsIFwiWm9kT2JqZWN0XCIsIHtcbiAgICAgICAga2V5b2YoKSB7XG4gICAgICAgICAgICByZXR1cm4gX2VudW0oT2JqZWN0LmtleXModGhpcy5fem9kLmRlZi5zaGFwZSkpO1xuICAgICAgICB9LFxuICAgICAgICBjYXRjaGFsbChjYXRjaGFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoeyAuLi50aGlzLl96b2QuZGVmLCBjYXRjaGFsbDogY2F0Y2hhbGwgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhc3N0aHJvdWdoKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoeyAuLi50aGlzLl96b2QuZGVmLCBjYXRjaGFsbDogdW5rbm93bigpIH0pO1xuICAgICAgICB9LFxuICAgICAgICBsb29zZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKHsgLi4udGhpcy5fem9kLmRlZiwgY2F0Y2hhbGw6IHVua25vd24oKSB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RyaWN0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoeyAuLi50aGlzLl96b2QuZGVmLCBjYXRjaGFsbDogbmV2ZXIoKSB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc3RyaXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSh7IC4uLnRoaXMuX3pvZC5kZWYsIGNhdGNoYWxsOiB1bmRlZmluZWQgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVuZChpbmNvbWluZykge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwuZXh0ZW5kKHRoaXMsIGluY29taW5nKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2FmZUV4dGVuZChpbmNvbWluZykge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwuc2FmZUV4dGVuZCh0aGlzLCBpbmNvbWluZyk7XG4gICAgICAgIH0sXG4gICAgICAgIG1lcmdlKG90aGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5tZXJnZSh0aGlzLCBvdGhlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHBpY2sobWFzaykge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucGljayh0aGlzLCBtYXNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgb21pdChtYXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5vbWl0KHRoaXMsIG1hc2spO1xuICAgICAgICB9LFxuICAgICAgICBwYXJ0aWFsKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnBhcnRpYWwoWm9kT3B0aW9uYWwsIHRoaXMsIGFyZ3NbMF0pO1xuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZCguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5yZXF1aXJlZChab2ROb25PcHRpb25hbCwgdGhpcywgYXJnc1swXSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBvYmplY3Qoc2hhcGUsIHBhcmFtcykge1xuICAgIGNvbnN0IGRlZiA9IHtcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgc2hhcGU6IHNoYXBlID8/IHt9LFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBab2RPYmplY3QoZGVmKTtcbn1cbi8vIHN0cmljdE9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIHN0cmljdE9iamVjdChzaGFwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICBzaGFwZSxcbiAgICAgICAgY2F0Y2hhbGw6IG5ldmVyKCksXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBsb29zZU9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGxvb3NlT2JqZWN0KHNoYXBlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgIHNoYXBlLFxuICAgICAgICBjYXRjaGFsbDogdW5rbm93bigpLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFVuaW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFVuaW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RVbmlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnVuaW9uUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0Lm9wdGlvbnMgPSBkZWYub3B0aW9ucztcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uKG9wdGlvbnMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kVW5pb24oe1xuICAgICAgICB0eXBlOiBcInVuaW9uXCIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kWG9yID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFhvclwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgWm9kVW5pb24uaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZFhvci5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnVuaW9uUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0Lm9wdGlvbnMgPSBkZWYub3B0aW9ucztcbn0pO1xuLyoqIENyZWF0ZXMgYW4gZXhjbHVzaXZlIHVuaW9uIChYT1IpIHdoZXJlIGV4YWN0bHkgb25lIG9wdGlvbiBtdXN0IG1hdGNoLlxuICogVW5saWtlIHJlZ3VsYXIgdW5pb25zIHRoYXQgc3VjY2VlZCB3aGVuIGFueSBvcHRpb24gbWF0Y2hlcywgeG9yIGZhaWxzIGlmXG4gKiB6ZXJvIG9yIG1vcmUgdGhhbiBvbmUgb3B0aW9uIG1hdGNoZXMgdGhlIGlucHV0LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHhvcihvcHRpb25zLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFpvZFhvcih7XG4gICAgICAgIHR5cGU6IFwidW5pb25cIixcbiAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2REaXNjcmltaW5hdGVkVW5pb24gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kRGlzY3JpbWluYXRlZFVuaW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBab2RVbmlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kRGlzY3JpbWluYXRlZFVuaW9uLmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGRpc2NyaW1pbmF0ZWRVbmlvbihkaXNjcmltaW5hdG9yLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgICAvLyBjb25zdCBbb3B0aW9ucywgcGFyYW1zXSA9IGFyZ3M7XG4gICAgcmV0dXJuIG5ldyBab2REaXNjcmltaW5hdGVkVW5pb24oe1xuICAgICAgICB0eXBlOiBcInVuaW9uXCIsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIGRpc2NyaW1pbmF0b3IsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kSW50ZXJzZWN0aW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEludGVyc2VjdGlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kSW50ZXJzZWN0aW9uLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuaW50ZXJzZWN0aW9uUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbihsZWZ0LCByaWdodCkge1xuICAgIHJldHVybiBuZXcgWm9kSW50ZXJzZWN0aW9uKHtcbiAgICAgICAgdHlwZTogXCJpbnRlcnNlY3Rpb25cIixcbiAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgcmlnaHQ6IHJpZ2h0LFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFR1cGxlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFR1cGxlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RUdXBsZS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnR1cGxlUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnJlc3QgPSAocmVzdCkgPT4gaW5zdC5jbG9uZSh7XG4gICAgICAgIC4uLmluc3QuX3pvZC5kZWYsXG4gICAgICAgIHJlc3Q6IHJlc3QsXG4gICAgfSk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB0dXBsZShpdGVtcywgX3BhcmFtc09yUmVzdCwgX3BhcmFtcykge1xuICAgIGNvbnN0IGhhc1Jlc3QgPSBfcGFyYW1zT3JSZXN0IGluc3RhbmNlb2YgY29yZS4kWm9kVHlwZTtcbiAgICBjb25zdCBwYXJhbXMgPSBoYXNSZXN0ID8gX3BhcmFtcyA6IF9wYXJhbXNPclJlc3Q7XG4gICAgY29uc3QgcmVzdCA9IGhhc1Jlc3QgPyBfcGFyYW1zT3JSZXN0IDogbnVsbDtcbiAgICByZXR1cm4gbmV3IFpvZFR1cGxlKHtcbiAgICAgICAgdHlwZTogXCJ0dXBsZVwiLFxuICAgICAgICBpdGVtczogaXRlbXMsXG4gICAgICAgIHJlc3QsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kUmVjb3JkID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFJlY29yZFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kUmVjb3JkLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMucmVjb3JkUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LmtleVR5cGUgPSBkZWYua2V5VHlwZTtcbiAgICBpbnN0LnZhbHVlVHlwZSA9IGRlZi52YWx1ZVR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiByZWNvcmQoa2V5VHlwZSwgdmFsdWVUeXBlLCBwYXJhbXMpIHtcbiAgICAvLyB2My1jb21wYXQ6IHoucmVjb3JkKHZhbHVlVHlwZSwgcGFyYW1zPykg4oCUIGRlZmF1bHRzIGtleVR5cGUgdG8gei5zdHJpbmcoKVxuICAgIGlmICghdmFsdWVUeXBlIHx8ICF2YWx1ZVR5cGUuX3pvZCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFJlY29yZCh7XG4gICAgICAgICAgICB0eXBlOiBcInJlY29yZFwiLFxuICAgICAgICAgICAga2V5VHlwZTogc3RyaW5nKCksXG4gICAgICAgICAgICB2YWx1ZVR5cGU6IGtleVR5cGUsXG4gICAgICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyh2YWx1ZVR5cGUpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBab2RSZWNvcmQoe1xuICAgICAgICB0eXBlOiBcInJlY29yZFwiLFxuICAgICAgICBrZXlUeXBlLFxuICAgICAgICB2YWx1ZVR5cGU6IHZhbHVlVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIHR5cGUgYWxrc2pmID0gY29yZS5vdXRwdXQ8Y29yZS4kWm9kUmVjb3JkS2V5PjtcbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aWFsUmVjb3JkKGtleVR5cGUsIHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgY29uc3QgayA9IGNvcmUuY2xvbmUoa2V5VHlwZSk7XG4gICAgay5fem9kLnZhbHVlcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gbmV3IFpvZFJlY29yZCh7XG4gICAgICAgIHR5cGU6IFwicmVjb3JkXCIsXG4gICAgICAgIGtleVR5cGU6IGssXG4gICAgICAgIHZhbHVlVHlwZTogdmFsdWVUeXBlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxvb3NlUmVjb3JkKGtleVR5cGUsIHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RSZWNvcmQoe1xuICAgICAgICB0eXBlOiBcInJlY29yZFwiLFxuICAgICAgICBrZXlUeXBlLFxuICAgICAgICB2YWx1ZVR5cGU6IHZhbHVlVHlwZSxcbiAgICAgICAgbW9kZTogXCJsb29zZVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZE1hcCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RNYXBcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE1hcC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLm1hcFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5rZXlUeXBlID0gZGVmLmtleVR5cGU7XG4gICAgaW5zdC52YWx1ZVR5cGUgPSBkZWYudmFsdWVUeXBlO1xuICAgIGluc3QubWluID0gKC4uLmFyZ3MpID0+IGluc3QuY2hlY2soY29yZS5fbWluU2l6ZSguLi5hcmdzKSk7XG4gICAgaW5zdC5ub25lbXB0eSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fbWluU2l6ZSgxLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1heCA9ICguLi5hcmdzKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21heFNpemUoLi4uYXJncykpO1xuICAgIGluc3Quc2l6ZSA9ICguLi5hcmdzKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3NpemUoLi4uYXJncykpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbWFwKGtleVR5cGUsIHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RNYXAoe1xuICAgICAgICB0eXBlOiBcIm1hcFwiLFxuICAgICAgICBrZXlUeXBlOiBrZXlUeXBlLFxuICAgICAgICB2YWx1ZVR5cGU6IHZhbHVlVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RTZXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kU2V0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RTZXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5zZXRQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QubWluID0gKC4uLmFyZ3MpID0+IGluc3QuY2hlY2soY29yZS5fbWluU2l6ZSguLi5hcmdzKSk7XG4gICAgaW5zdC5ub25lbXB0eSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fbWluU2l6ZSgxLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1heCA9ICguLi5hcmdzKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21heFNpemUoLi4uYXJncykpO1xuICAgIGluc3Quc2l6ZSA9ICguLi5hcmdzKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3NpemUoLi4uYXJncykpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gc2V0KHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RTZXQoe1xuICAgICAgICB0eXBlOiBcInNldFwiLFxuICAgICAgICB2YWx1ZVR5cGU6IHZhbHVlVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RFbnVtID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEVudW1cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEVudW0uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5lbnVtUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LmVudW0gPSBkZWYuZW50cmllcztcbiAgICBpbnN0Lm9wdGlvbnMgPSBPYmplY3QudmFsdWVzKGRlZi5lbnRyaWVzKTtcbiAgICBjb25zdCBrZXlzID0gbmV3IFNldChPYmplY3Qua2V5cyhkZWYuZW50cmllcykpO1xuICAgIGluc3QuZXh0cmFjdCA9ICh2YWx1ZXMsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zdCBuZXdFbnRyaWVzID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICBpZiAoa2V5cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgbmV3RW50cmllc1t2YWx1ZV0gPSBkZWYuZW50cmllc1t2YWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBLZXkgJHt2YWx1ZX0gbm90IGZvdW5kIGluIGVudW1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZEVudW0oe1xuICAgICAgICAgICAgLi4uZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgICAgICBlbnRyaWVzOiBuZXdFbnRyaWVzLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGluc3QuZXhjbHVkZSA9ICh2YWx1ZXMsIHBhcmFtcykgPT4ge1xuICAgICAgICBjb25zdCBuZXdFbnRyaWVzID0geyAuLi5kZWYuZW50cmllcyB9O1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGtleXMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdFbnRyaWVzW3ZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEtleSAke3ZhbHVlfSBub3QgZm91bmQgaW4gZW51bWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kRW51bSh7XG4gICAgICAgICAgICAuLi5kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgICAgIGVudHJpZXM6IG5ld0VudHJpZXMsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIF9lbnVtKHZhbHVlcywgcGFyYW1zKSB7XG4gICAgY29uc3QgZW50cmllcyA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IE9iamVjdC5mcm9tRW50cmllcyh2YWx1ZXMubWFwKCh2KSA9PiBbdiwgdl0pKSA6IHZhbHVlcztcbiAgICByZXR1cm4gbmV3IFpvZEVudW0oe1xuICAgICAgICB0eXBlOiBcImVudW1cIixcbiAgICAgICAgZW50cmllcyxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCB7IF9lbnVtIGFzIGVudW0gfTtcbi8qKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBoYXMgYmVlbiBtZXJnZWQgaW50byBgei5lbnVtKClgLiBVc2UgYHouZW51bSgpYCBpbnN0ZWFkLlxuICpcbiAqIGBgYHRzXG4gKiBlbnVtIENvbG9ycyB7IHJlZCwgZ3JlZW4sIGJsdWUgfVxuICogei5lbnVtKENvbG9ycyk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hdGl2ZUVudW0oZW50cmllcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RFbnVtKHtcbiAgICAgICAgdHlwZTogXCJlbnVtXCIsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kTGl0ZXJhbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RMaXRlcmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RMaXRlcmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubGl0ZXJhbFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC52YWx1ZXMgPSBuZXcgU2V0KGRlZi52YWx1ZXMpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcInZhbHVlXCIsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgaWYgKGRlZi52YWx1ZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2NoZW1hIGNvbnRhaW5zIG11bHRpcGxlIHZhbGlkIGxpdGVyYWwgdmFsdWVzLiBVc2UgYC52YWx1ZXNgIGluc3RlYWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlZi52YWx1ZXNbMF07XG4gICAgICAgIH0sXG4gICAgfSk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBsaXRlcmFsKHZhbHVlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFpvZExpdGVyYWwoe1xuICAgICAgICB0eXBlOiBcImxpdGVyYWxcIixcbiAgICAgICAgdmFsdWVzOiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RGaWxlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEZpbGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEZpbGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5maWxlUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0Lm1pbiA9IChzaXplLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fbWluU2l6ZShzaXplLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1heCA9IChzaXplLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fbWF4U2l6ZShzaXplLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1pbWUgPSAodHlwZXMsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9taW1lKEFycmF5LmlzQXJyYXkodHlwZXMpID8gdHlwZXMgOiBbdHlwZXNdLCBwYXJhbXMpKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbGUocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2ZpbGUoWm9kRmlsZSwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RUcmFuc2Zvcm0gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kVHJhbnNmb3JtXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RUcmFuc2Zvcm0uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy50cmFuc2Zvcm1Qcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGlmIChfY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kRW5jb2RlRXJyb3IoaW5zdC5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLmFkZElzc3VlID0gKGlzc3VlKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlzc3VlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh1dGlsLmlzc3VlKGlzc3VlLCBwYXlsb2FkLnZhbHVlLCBkZWYpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGZvciBab2QgMyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgIGNvbnN0IF9pc3N1ZSA9IGlzc3VlO1xuICAgICAgICAgICAgICAgIGlmIChfaXNzdWUuZmF0YWwpXG4gICAgICAgICAgICAgICAgICAgIF9pc3N1ZS5jb250aW51ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF9pc3N1ZS5jb2RlID8/IChfaXNzdWUuY29kZSA9IFwiY3VzdG9tXCIpO1xuICAgICAgICAgICAgICAgIF9pc3N1ZS5pbnB1dCA/PyAoX2lzc3VlLmlucHV0ID0gcGF5bG9hZC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgX2lzc3VlLmluc3QgPz8gKF9pc3N1ZS5pbnN0ID0gaW5zdCk7XG4gICAgICAgICAgICAgICAgLy8gX2lzc3VlLmNvbnRpbnVlID8/PSB0cnVlO1xuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2godXRpbC5pc3N1ZShfaXNzdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gZGVmLnRyYW5zZm9ybShwYXlsb2FkLnZhbHVlLCBwYXlsb2FkKTtcbiAgICAgICAgaWYgKG91dHB1dCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQudGhlbigob3V0cHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IG91dHB1dDtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmZhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBvdXRwdXQ7XG4gICAgICAgIHBheWxvYWQuZmFsbGJhY2sgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgcmV0dXJuIG5ldyBab2RUcmFuc2Zvcm0oe1xuICAgICAgICB0eXBlOiBcInRyYW5zZm9ybVwiLFxuICAgICAgICB0cmFuc2Zvcm06IGZuLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZE9wdGlvbmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE9wdGlvbmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RPcHRpb25hbC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLm9wdGlvbmFsUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gb3B0aW9uYWwoaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIG5ldyBab2RPcHRpb25hbCh7XG4gICAgICAgIHR5cGU6IFwib3B0aW9uYWxcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kRXhhY3RPcHRpb25hbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RFeGFjdE9wdGlvbmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RFeGFjdE9wdGlvbmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMub3B0aW9uYWxQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBleGFjdE9wdGlvbmFsKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgWm9kRXhhY3RPcHRpb25hbCh7XG4gICAgICAgIHR5cGU6IFwib3B0aW9uYWxcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kTnVsbGFibGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTnVsbGFibGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE51bGxhYmxlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubnVsbGFibGVQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBudWxsYWJsZShpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IFpvZE51bGxhYmxlKHtcbiAgICAgICAgdHlwZTogXCJudWxsYWJsZVwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbi8vIG51bGxpc2hcbmV4cG9ydCBmdW5jdGlvbiBudWxsaXNoKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBvcHRpb25hbChudWxsYWJsZShpbm5lclR5cGUpKTtcbn1cbmV4cG9ydCBjb25zdCBab2REZWZhdWx0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZERlZmF1bHRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZERlZmF1bHQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5kZWZhdWx0UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xuICAgIGluc3QucmVtb3ZlRGVmYXVsdCA9IGluc3QudW53cmFwO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gX2RlZmF1bHQoaW5uZXJUeXBlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFpvZERlZmF1bHQoe1xuICAgICAgICB0eXBlOiBcImRlZmF1bHRcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgICAgIGdldCBkZWZhdWx0VmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdFZhbHVlKCkgOiB1dGlsLnNoYWxsb3dDbG9uZShkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFByZWZhdWx0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFByZWZhdWx0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RQcmVmYXVsdC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnByZWZhdWx0UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gcHJlZmF1bHQoaW5uZXJUeXBlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFpvZFByZWZhdWx0KHtcbiAgICAgICAgdHlwZTogXCJwcmVmYXVsdFwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICAgICAgZ2V0IGRlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZGVmYXVsdFZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0VmFsdWUoKSA6IHV0aWwuc2hhbGxvd0Nsb25lKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kTm9uT3B0aW9uYWwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTm9uT3B0aW9uYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE5vbk9wdGlvbmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubm9ub3B0aW9uYWxQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBub25vcHRpb25hbChpbm5lclR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kTm9uT3B0aW9uYWwoe1xuICAgICAgICB0eXBlOiBcIm5vbm9wdGlvbmFsXCIsXG4gICAgICAgIGlubmVyVHlwZTogaW5uZXJUeXBlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFN1Y2Nlc3MgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kU3VjY2Vzc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kU3VjY2Vzcy5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnN1Y2Nlc3NQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBzdWNjZXNzKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgWm9kU3VjY2Vzcyh7XG4gICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RDYXRjaCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDYXRjaFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQ2F0Y2guaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5jYXRjaFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC51bndyYXAgPSAoKSA9PiBpbnN0Ll96b2QuZGVmLmlubmVyVHlwZTtcbiAgICBpbnN0LnJlbW92ZUNhdGNoID0gaW5zdC51bndyYXA7XG59KTtcbmZ1bmN0aW9uIF9jYXRjaChpbm5lclR5cGUsIGNhdGNoVmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFpvZENhdGNoKHtcbiAgICAgICAgdHlwZTogXCJjYXRjaFwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICAgICAgY2F0Y2hWYWx1ZTogKHR5cGVvZiBjYXRjaFZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjYXRjaFZhbHVlIDogKCkgPT4gY2F0Y2hWYWx1ZSksXG4gICAgfSk7XG59XG5leHBvcnQgeyBfY2F0Y2ggYXMgY2F0Y2ggfTtcbmV4cG9ydCBjb25zdCBab2ROYU4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTmFOXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2ROYU4uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5uYW5Qcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbmFuKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9uYW4oWm9kTmFOLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFBpcGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kUGlwZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kUGlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnBpcGVQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QuaW4gPSBkZWYuaW47XG4gICAgaW5zdC5vdXQgPSBkZWYub3V0O1xufSk7XG5leHBvcnQgZnVuY3Rpb24gcGlwZShpbl8sIG91dCkge1xuICAgIHJldHVybiBuZXcgWm9kUGlwZSh7XG4gICAgICAgIHR5cGU6IFwicGlwZVwiLFxuICAgICAgICBpbjogaW5fLFxuICAgICAgICBvdXQ6IG91dCxcbiAgICAgICAgLy8gLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RDb2RlYyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDb2RlY1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgWm9kUGlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kQ29kZWMuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gY29kZWMoaW5fLCBvdXQsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kQ29kZWMoe1xuICAgICAgICB0eXBlOiBcInBpcGVcIixcbiAgICAgICAgaW46IGluXyxcbiAgICAgICAgb3V0OiBvdXQsXG4gICAgICAgIHRyYW5zZm9ybTogcGFyYW1zLmRlY29kZSxcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybTogcGFyYW1zLmVuY29kZSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnRDb2RlYyhjb2RlYykge1xuICAgIGNvbnN0IGRlZiA9IGNvZGVjLl96b2QuZGVmO1xuICAgIHJldHVybiBuZXcgWm9kQ29kZWMoe1xuICAgICAgICB0eXBlOiBcInBpcGVcIixcbiAgICAgICAgaW46IGRlZi5vdXQsXG4gICAgICAgIG91dDogZGVmLmluLFxuICAgICAgICB0cmFuc2Zvcm06IGRlZi5yZXZlcnNlVHJhbnNmb3JtLFxuICAgICAgICByZXZlcnNlVHJhbnNmb3JtOiBkZWYudHJhbnNmb3JtLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFByZXByb2Nlc3MgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kUHJlcHJvY2Vzc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgWm9kUGlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kUHJlcHJvY2Vzcy5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCBab2RSZWFkb25seSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RSZWFkb25seVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kUmVhZG9ubHkuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5yZWFkb25seVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC51bndyYXAgPSAoKSA9PiBpbnN0Ll96b2QuZGVmLmlubmVyVHlwZTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWRvbmx5KGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgWm9kUmVhZG9ubHkoe1xuICAgICAgICB0eXBlOiBcInJlYWRvbmx5XCIsXG4gICAgICAgIGlubmVyVHlwZTogaW5uZXJUeXBlLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFRlbXBsYXRlTGl0ZXJhbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RUZW1wbGF0ZUxpdGVyYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZFRlbXBsYXRlTGl0ZXJhbC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnRlbXBsYXRlTGl0ZXJhbFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUxpdGVyYWwocGFydHMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kVGVtcGxhdGVMaXRlcmFsKHtcbiAgICAgICAgdHlwZTogXCJ0ZW1wbGF0ZV9saXRlcmFsXCIsXG4gICAgICAgIHBhcnRzLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZExhenkgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTGF6eVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kTGF6eS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmxhenlQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5nZXR0ZXIoKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGxhenkoZ2V0dGVyKSB7XG4gICAgcmV0dXJuIG5ldyBab2RMYXp5KHtcbiAgICAgICAgdHlwZTogXCJsYXp5XCIsXG4gICAgICAgIGdldHRlcjogZ2V0dGVyLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFByb21pc2UgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kUHJvbWlzZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kUHJvbWlzZS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnByb21pc2VQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgWm9kUHJvbWlzZSh7XG4gICAgICAgIHR5cGU6IFwicHJvbWlzZVwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RGdW5jdGlvbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RGdW5jdGlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kRnVuY3Rpb24uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5mdW5jdGlvblByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBfZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RGdW5jdGlvbih7XG4gICAgICAgIHR5cGU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgaW5wdXQ6IEFycmF5LmlzQXJyYXkocGFyYW1zPy5pbnB1dCkgPyB0dXBsZShwYXJhbXM/LmlucHV0KSA6IChwYXJhbXM/LmlucHV0ID8/IGFycmF5KHVua25vd24oKSkpLFxuICAgICAgICBvdXRwdXQ6IHBhcmFtcz8ub3V0cHV0ID8/IHVua25vd24oKSxcbiAgICB9KTtcbn1cbmV4cG9ydCB7IF9mdW5jdGlvbiBhcyBmdW5jdGlvbiB9O1xuZXhwb3J0IGNvbnN0IFpvZEN1c3RvbSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDdXN0b21cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEN1c3RvbS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmN1c3RvbVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbi8vIGN1c3RvbSBjaGVja3NcbmV4cG9ydCBmdW5jdGlvbiBjaGVjayhmbikge1xuICAgIGNvbnN0IGNoID0gbmV3IGNvcmUuJFpvZENoZWNrKHtcbiAgICAgICAgY2hlY2s6IFwiY3VzdG9tXCIsXG4gICAgICAgIC8vIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG4gICAgY2guX3pvZC5jaGVjayA9IGZuO1xuICAgIHJldHVybiBjaDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b20oZm4sIF9wYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fY3VzdG9tKFpvZEN1c3RvbSwgZm4gPz8gKCgpID0+IHRydWUpLCBfcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWZpbmUoZm4sIF9wYXJhbXMgPSB7fSkge1xuICAgIHJldHVybiBjb3JlLl9yZWZpbmUoWm9kQ3VzdG9tLCBmbiwgX3BhcmFtcyk7XG59XG4vLyBzdXBlclJlZmluZVxuZXhwb3J0IGZ1bmN0aW9uIHN1cGVyUmVmaW5lKGZuLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fc3VwZXJSZWZpbmUoZm4sIHBhcmFtcyk7XG59XG4vLyBSZS1leHBvcnQgZGVzY3JpYmUgYW5kIG1ldGEgZnJvbSBjb3JlXG5leHBvcnQgY29uc3QgZGVzY3JpYmUgPSBjb3JlLmRlc2NyaWJlO1xuZXhwb3J0IGNvbnN0IG1ldGEgPSBjb3JlLm1ldGE7XG5mdW5jdGlvbiBfaW5zdGFuY2VvZihjbHMsIHBhcmFtcyA9IHt9KSB7XG4gICAgY29uc3QgaW5zdCA9IG5ldyBab2RDdXN0b20oe1xuICAgICAgICB0eXBlOiBcImN1c3RvbVwiLFxuICAgICAgICBjaGVjazogXCJjdXN0b21cIixcbiAgICAgICAgZm46IChkYXRhKSA9PiBkYXRhIGluc3RhbmNlb2YgY2xzLFxuICAgICAgICBhYm9ydDogdHJ1ZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuYmFnLkNsYXNzID0gY2xzO1xuICAgIC8vIE92ZXJyaWRlIGNoZWNrIHRvIGVtaXQgaW52YWxpZF90eXBlIGluc3RlYWQgb2YgY3VzdG9tXG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKCEocGF5bG9hZC52YWx1ZSBpbnN0YW5jZW9mIGNscykpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGNscy5uYW1lLFxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgcGF0aDogWy4uLihpbnN0Ll96b2QuZGVmLnBhdGggPz8gW10pXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gaW5zdDtcbn1cbmV4cG9ydCB7IF9pbnN0YW5jZW9mIGFzIGluc3RhbmNlb2YgfTtcbi8vIHN0cmluZ2Jvb2xcbmV4cG9ydCBjb25zdCBzdHJpbmdib29sID0gKC4uLmFyZ3MpID0+IGNvcmUuX3N0cmluZ2Jvb2woe1xuICAgIENvZGVjOiBab2RDb2RlYyxcbiAgICBCb29sZWFuOiBab2RCb29sZWFuLFxuICAgIFN0cmluZzogWm9kU3RyaW5nLFxufSwgLi4uYXJncyk7XG5leHBvcnQgZnVuY3Rpb24ganNvbihwYXJhbXMpIHtcbiAgICBjb25zdCBqc29uU2NoZW1hID0gbGF6eSgoKSA9PiB7XG4gICAgICAgIHJldHVybiB1bmlvbihbc3RyaW5nKHBhcmFtcyksIG51bWJlcigpLCBib29sZWFuKCksIF9udWxsKCksIGFycmF5KGpzb25TY2hlbWEpLCByZWNvcmQoc3RyaW5nKCksIGpzb25TY2hlbWEpXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGpzb25TY2hlbWE7XG59XG4vLyBwcmVwcm9jZXNzXG5leHBvcnQgZnVuY3Rpb24gcHJlcHJvY2Vzcyhmbiwgc2NoZW1hKSB7XG4gICAgcmV0dXJuIG5ldyBab2RQcmVwcm9jZXNzKHtcbiAgICAgICAgdHlwZTogXCJwaXBlXCIsXG4gICAgICAgIGluOiB0cmFuc2Zvcm0oZm4pLFxuICAgICAgICBvdXQ6IHNjaGVtYSxcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5leHBvcnQgY29uc3Qgam9iU3RhdHVzU2NoZW1hID0gei5lbnVtKFtcbiAgICBcInBlbmRpbmdcIixcbiAgICBcInNhdmVkXCIsXG4gICAgXCJhcHBsaWVkXCIsXG4gICAgXCJpbnRlcnZpZXdpbmdcIixcbiAgICBcIm9mZmVyZWRcIixcbiAgICBcInJlamVjdGVkXCIsXG5dKTtcbmV4cG9ydCBjb25zdCBqb2JUeXBlU2NoZW1hID0gei5lbnVtKFtcbiAgICBcImZ1bGwtdGltZVwiLFxuICAgIFwicGFydC10aW1lXCIsXG4gICAgXCJjb250cmFjdFwiLFxuICAgIFwiaW50ZXJuc2hpcFwiLFxuICAgIFwiZnJlZWxhbmNlXCIsXG5dKTtcbmV4cG9ydCBjb25zdCBjcmVhdGVKb2JTY2hlbWEgPSB6Lm9iamVjdCh7XG4gICAgdGl0bGU6IHpcbiAgICAgICAgLnN0cmluZygpXG4gICAgICAgIC5taW4oMSwgXCJKb2IgdGl0bGUgaXMgcmVxdWlyZWRcIilcbiAgICAgICAgLm1heCgyMDAsIFwiVGl0bGUgaXMgdG9vIGxvbmdcIiksXG4gICAgY29tcGFueTogelxuICAgICAgICAuc3RyaW5nKClcbiAgICAgICAgLm1pbigxLCBcIkNvbXBhbnkgbmFtZSBpcyByZXF1aXJlZFwiKVxuICAgICAgICAubWF4KDIwMCwgXCJDb21wYW55IG5hbWUgaXMgdG9vIGxvbmdcIiksXG4gICAgbG9jYXRpb246IHpcbiAgICAgICAgLnN0cmluZygpXG4gICAgICAgIC5tYXgoMjAwLCBcIkxvY2F0aW9uIGlzIHRvbyBsb25nXCIpXG4gICAgICAgIC5vcHRpb25hbCgpXG4gICAgICAgIC5vcih6LmxpdGVyYWwoXCJcIikpLFxuICAgIHR5cGU6IGpvYlR5cGVTY2hlbWEub3B0aW9uYWwoKSxcbiAgICByZW1vdGU6IHouYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLFxuICAgIHNhbGFyeTogelxuICAgICAgICAuc3RyaW5nKClcbiAgICAgICAgLm1heCgxMDAsIFwiU2FsYXJ5IGlzIHRvbyBsb25nXCIpXG4gICAgICAgIC5vcHRpb25hbCgpXG4gICAgICAgIC5vcih6LmxpdGVyYWwoXCJcIikpLFxuICAgIGRlc2NyaXB0aW9uOiB6LnN0cmluZygpLm1pbigxLCBcIkpvYiBkZXNjcmlwdGlvbiBpcyByZXF1aXJlZFwiKSxcbiAgICByZXF1aXJlbWVudHM6IHouYXJyYXkoei5zdHJpbmcoKSkuZGVmYXVsdChbXSksXG4gICAgcmVzcG9uc2liaWxpdGllczogei5hcnJheSh6LnN0cmluZygpKS5kZWZhdWx0KFtdKSxcbiAgICBrZXl3b3Jkczogei5hcnJheSh6LnN0cmluZygpKS5kZWZhdWx0KFtdKSxcbiAgICB1cmw6IHouc3RyaW5nKCkudXJsKFwiSW52YWxpZCBqb2IgVVJMXCIpLm9wdGlvbmFsKCkub3Ioei5saXRlcmFsKFwiXCIpKSxcbiAgICBzdGF0dXM6IGpvYlN0YXR1c1NjaGVtYS5kZWZhdWx0KFwic2F2ZWRcIiksXG4gICAgYXBwbGllZEF0OiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgZGVhZGxpbmU6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBub3Rlczogei5zdHJpbmcoKS5tYXgoNTAwMCwgXCJOb3RlcyBhcmUgdG9vIGxvbmdcIikub3B0aW9uYWwoKSxcbn0pO1xuZXhwb3J0IGNvbnN0IHVwZGF0ZUpvYlNjaGVtYSA9IGNyZWF0ZUpvYlNjaGVtYS5wYXJ0aWFsKCk7XG5leHBvcnQgY29uc3Qgam9iU3RhdHVzVXBkYXRlU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIHN0YXR1czogam9iU3RhdHVzU2NoZW1hLFxuICAgIGFwcGxpZWRBdDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDcmVhdGVKb2IoZGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNyZWF0ZUpvYlNjaGVtYS5zYWZlUGFyc2UoZGF0YSk7XG4gICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdC5kYXRhIH07XG4gICAgfVxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcnM6IHJlc3VsdC5lcnJvciB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXBkYXRlSm9iKGRhdGEpIHtcbiAgICBjb25zdCByZXN1bHQgPSB1cGRhdGVKb2JTY2hlbWEuc2FmZVBhcnNlKGRhdGEpO1xuICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQuZGF0YSB9O1xuICAgIH1cbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3JzOiByZXN1bHQuZXJyb3IgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUpvYlN0YXR1c1VwZGF0ZShkYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gam9iU3RhdHVzVXBkYXRlU2NoZW1hLnNhZmVQYXJzZShkYXRhKTtcbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0LmRhdGEgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yczogcmVzdWx0LmVycm9yIH07XG59XG5leHBvcnQgY29uc3QgT1BQT1JUVU5JVFlfVFlQRVMgPSBbXCJqb2JcIiwgXCJoYWNrYXRob25cIl07XG5leHBvcnQgY29uc3QgT1BQT1JUVU5JVFlfU09VUkNFUyA9IFtcbiAgICBcIndhdGVybG9vd29ya3NcIixcbiAgICBcImxpbmtlZGluXCIsXG4gICAgXCJpbmRlZWRcIixcbiAgICBcImdyZWVuaG91c2VcIixcbiAgICBcImxldmVyXCIsXG4gICAgXCJkZXZwb3N0XCIsXG4gICAgXCJtYW51YWxcIixcbiAgICBcInVybFwiLFxuXTtcbmV4cG9ydCBjb25zdCBPUFBPUlRVTklUWV9SRU1PVEVfVFlQRVMgPSBbXCJyZW1vdGVcIiwgXCJoeWJyaWRcIiwgXCJvbnNpdGVcIl07XG5leHBvcnQgY29uc3QgT1BQT1JUVU5JVFlfSk9CX1RZUEVTID0gW1xuICAgIFwiY28tb3BcIixcbiAgICBcImZ1bGwtdGltZVwiLFxuICAgIFwicGFydC10aW1lXCIsXG4gICAgXCJjb250cmFjdFwiLFxuICAgIFwiaW50ZXJuc2hpcFwiLFxuXTtcbmV4cG9ydCBjb25zdCBPUFBPUlRVTklUWV9MRVZFTFMgPSBbXG4gICAgXCJqdW5pb3JcIixcbiAgICBcImludGVybWVkaWF0ZVwiLFxuICAgIFwic2VuaW9yXCIsXG4gICAgXCJsZWFkXCIsXG4gICAgXCJwcmluY2lwYWxcIixcbiAgICBcIm90aGVyXCIsXG4gICAgXCJzdGFmZlwiLFxuXTtcbmV4cG9ydCBjb25zdCBPUFBPUlRVTklUWV9TVEFUVVNFUyA9IFtcbiAgICBcInBlbmRpbmdcIixcbiAgICBcInNhdmVkXCIsXG4gICAgXCJhcHBsaWVkXCIsXG4gICAgXCJpbnRlcnZpZXdpbmdcIixcbiAgICBcIm9mZmVyXCIsXG4gICAgXCJyZWplY3RlZFwiLFxuICAgIFwiZXhwaXJlZFwiLFxuICAgIFwiZGlzbWlzc2VkXCIsXG5dO1xuZXhwb3J0IGNvbnN0IEtBTkJBTl9MQU5FX0lEUyA9IFtcbiAgICBcInBlbmRpbmdcIixcbiAgICBcInNhdmVkXCIsXG4gICAgXCJhcHBsaWVkXCIsXG4gICAgXCJpbnRlcnZpZXdpbmdcIixcbiAgICBcIm9mZmVyXCIsXG4gICAgXCJjbG9zZWRcIixcbl07XG5leHBvcnQgY29uc3QgQ0xPU0VEX1NVQl9TVEFUVVNFUyA9IFtcbiAgICBcInJlamVjdGVkXCIsXG4gICAgXCJleHBpcmVkXCIsXG4gICAgXCJkaXNtaXNzZWRcIixcbl07XG5leHBvcnQgY29uc3QgS0FOQkFOX0xBTkVfR1JPVVBTID0ge1xuICAgIHBlbmRpbmc6IFtcInBlbmRpbmdcIl0sXG4gICAgc2F2ZWQ6IFtcInNhdmVkXCJdLFxuICAgIGFwcGxpZWQ6IFtcImFwcGxpZWRcIl0sXG4gICAgaW50ZXJ2aWV3aW5nOiBbXCJpbnRlcnZpZXdpbmdcIl0sXG4gICAgb2ZmZXI6IFtcIm9mZmVyXCJdLFxuICAgIGNsb3NlZDogQ0xPU0VEX1NVQl9TVEFUVVNFUyxcbn07XG5leHBvcnQgY29uc3QgREVGQVVMVF9LQU5CQU5fVklTSUJMRV9MQU5FUyA9IEtBTkJBTl9MQU5FX0lEUztcbmNvbnN0IFNUQVRVU19UT19LQU5CQU5fTEFORSA9IE9iamVjdC5mcm9tRW50cmllcyhLQU5CQU5fTEFORV9JRFMuZmxhdE1hcCgobGFuZSkgPT4gS0FOQkFOX0xBTkVfR1JPVVBTW2xhbmVdLm1hcCgoc3RhdHVzKSA9PiBbc3RhdHVzLCBsYW5lXSkpKTtcbmV4cG9ydCBmdW5jdGlvbiBpbmZlckxhbmVGcm9tU3RhdHVzKHN0YXR1cykge1xuICAgIHJldHVybiBTVEFUVVNfVE9fS0FOQkFOX0xBTkVbc3RhdHVzXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0Nsb3NlZFN1YlN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gQ0xPU0VEX1NVQl9TVEFUVVNFUy5pbmNsdWRlcyhzdGF0dXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUthbmJhblZpc2libGVMYW5lcyhpbnB1dCkge1xuICAgIGNvbnN0IHBhcnNlZElucHV0ID0gdHlwZW9mIGlucHV0ID09PSBcInN0cmluZ1wiID8gcGFyc2VKc29uU2FmZWx5KGlucHV0KSA6IGlucHV0O1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwYXJzZWRJbnB1dCkpIHtcbiAgICAgICAgcmV0dXJuIFsuLi5ERUZBVUxUX0tBTkJBTl9WSVNJQkxFX0xBTkVTXTtcbiAgICB9XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBLQU5CQU5fTEFORV9JRFMuZmlsdGVyKChsYW5lKSA9PiBwYXJzZWRJbnB1dC5pbmNsdWRlcyhsYW5lKSk7XG4gICAgcmV0dXJuIHNlbGVjdGVkLmxlbmd0aCA+IDAgPyBzZWxlY3RlZCA6IFsuLi5ERUZBVUxUX0tBTkJBTl9WSVNJQkxFX0xBTkVTXTtcbn1cbmZ1bmN0aW9uIHBhcnNlSnNvblNhZmVseSh2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5jb25zdCByZXF1aXJlZFRleHQgPSAobWF4LCBmaWVsZCkgPT4gei5zdHJpbmcoKS50cmltKCkubWluKDEsIGAke2ZpZWxkfSBpcyByZXF1aXJlZGApLm1heChtYXgpO1xuY29uc3Qgb3B0aW9uYWxUZXh0ID0gKG1heCkgPT4gelxuICAgIC5zdHJpbmcoKVxuICAgIC50cmltKClcbiAgICAubWF4KG1heClcbiAgICAub3B0aW9uYWwoKVxuICAgIC50cmFuc2Zvcm0oKHZhbHVlKSA9PiAodmFsdWUgPT09IFwiXCIgPyB1bmRlZmluZWQgOiB2YWx1ZSkpO1xuY29uc3Qgb3B0aW9uYWxTdHJpbmdMaXN0ID0gelxuICAgIC5hcnJheSh6LnN0cmluZygpLnRyaW0oKS5taW4oMSkubWF4KDIwMCkpXG4gICAgLm9wdGlvbmFsKCk7XG5jb25zdCBvcHRpb25hbFVybCA9IHpcbiAgICAudW5pb24oW3ouc3RyaW5nKCkudHJpbSgpLnVybCgpLCB6LmxpdGVyYWwoXCJcIildKVxuICAgIC5vcHRpb25hbCgpXG4gICAgLnRyYW5zZm9ybSgodmFsdWUpID0+ICh2YWx1ZSA9PT0gXCJcIiA/IHVuZGVmaW5lZCA6IHZhbHVlKSk7XG5leHBvcnQgY29uc3Qgb3Bwb3J0dW5pdHlUeXBlU2NoZW1hID0gei5lbnVtKE9QUE9SVFVOSVRZX1RZUEVTKTtcbmV4cG9ydCBjb25zdCBvcHBvcnR1bml0eVNvdXJjZVNjaGVtYSA9IHouZW51bShPUFBPUlRVTklUWV9TT1VSQ0VTKTtcbmV4cG9ydCBjb25zdCBvcHBvcnR1bml0eVJlbW90ZVR5cGVTY2hlbWEgPSB6LmVudW0oT1BQT1JUVU5JVFlfUkVNT1RFX1RZUEVTKTtcbmV4cG9ydCBjb25zdCBvcHBvcnR1bml0eUpvYlR5cGVTY2hlbWEgPSB6LmVudW0oT1BQT1JUVU5JVFlfSk9CX1RZUEVTKTtcbmV4cG9ydCBjb25zdCBvcHBvcnR1bml0eUxldmVsU2NoZW1hID0gei5lbnVtKE9QUE9SVFVOSVRZX0xFVkVMUyk7XG5leHBvcnQgY29uc3Qgb3Bwb3J0dW5pdHlTdGF0dXNTY2hlbWEgPSB6LmVudW0oT1BQT1JUVU5JVFlfU1RBVFVTRVMpO1xuZXhwb3J0IGNvbnN0IGthbmJhbkxhbmVJZFNjaGVtYSA9IHouZW51bShLQU5CQU5fTEFORV9JRFMpO1xuZXhwb3J0IGNvbnN0IGthbmJhblZpc2libGVMYW5lc1NjaGVtYSA9IHpcbiAgICAuYXJyYXkoa2FuYmFuTGFuZUlkU2NoZW1hKVxuICAgIC5taW4oMSwgXCJBdCBsZWFzdCBvbmUga2FuYmFuIGxhbmUgbXVzdCByZW1haW4gdmlzaWJsZVwiKTtcbmNvbnN0IG9wcG9ydHVuaXR5VGVhbVNpemVTY2hlbWEgPSB6XG4gICAgLm9iamVjdCh7XG4gICAgbWluOiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCksXG4gICAgbWF4OiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCksXG59KVxuICAgIC5yZWZpbmUoKHZhbHVlKSA9PiB2YWx1ZS5taW4gPD0gdmFsdWUubWF4LCB7XG4gICAgbWVzc2FnZTogXCJNaW5pbXVtIHRlYW0gc2l6ZSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byBtYXhpbXVtIHRlYW0gc2l6ZVwiLFxuICAgIHBhdGg6IFtcIm1pblwiXSxcbn0pO1xuY29uc3Qgc2FsYXJ5UmFuZ2VSZWZpbmVtZW50ID0ge1xuICAgIG1lc3NhZ2U6IFwiTWluaW11bSBzYWxhcnkgbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gbWF4aW11bSBzYWxhcnlcIixcbiAgICBwYXRoOiBbXCJzYWxhcnlNaW5cIl0sXG59O1xuY29uc3QgaGFzVmFsaWRTYWxhcnlSYW5nZSA9ICh2YWx1ZSkgPT4gdmFsdWUuc2FsYXJ5TWluID09PSB1bmRlZmluZWQgfHxcbiAgICB2YWx1ZS5zYWxhcnlNYXggPT09IHVuZGVmaW5lZCB8fFxuICAgIHZhbHVlLnNhbGFyeU1pbiA8PSB2YWx1ZS5zYWxhcnlNYXg7XG5jb25zdCBvcHBvcnR1bml0eUlucHV0RmllbGRzID0ge1xuICAgIHR5cGU6IG9wcG9ydHVuaXR5VHlwZVNjaGVtYSxcbiAgICB0aXRsZTogcmVxdWlyZWRUZXh0KDIwMCwgXCJUaXRsZVwiKSxcbiAgICBjb21wYW55OiByZXF1aXJlZFRleHQoMjAwLCBcIkNvbXBhbnlcIiksXG4gICAgZGl2aXNpb246IG9wdGlvbmFsVGV4dCgyMDApLFxuICAgIHNvdXJjZTogb3Bwb3J0dW5pdHlTb3VyY2VTY2hlbWEsXG4gICAgc291cmNlVXJsOiBvcHRpb25hbFVybCxcbiAgICBzb3VyY2VJZDogb3B0aW9uYWxUZXh0KDIwMCksXG4gICAgY2l0eTogb3B0aW9uYWxUZXh0KDEyMCksXG4gICAgcHJvdmluY2U6IG9wdGlvbmFsVGV4dCgxMjApLFxuICAgIGNvdW50cnk6IG9wdGlvbmFsVGV4dCgxMjApLFxuICAgIHBvc3RhbENvZGU6IG9wdGlvbmFsVGV4dCg0MCksXG4gICAgcmVnaW9uOiBvcHRpb25hbFRleHQoMTIwKSxcbiAgICByZW1vdGVUeXBlOiBvcHBvcnR1bml0eVJlbW90ZVR5cGVTY2hlbWEub3B0aW9uYWwoKSxcbiAgICBhZGRpdGlvbmFsTG9jYXRpb25JbmZvOiBvcHRpb25hbFRleHQoNTAwKSxcbiAgICBqb2JUeXBlOiBvcHBvcnR1bml0eUpvYlR5cGVTY2hlbWEub3B0aW9uYWwoKSxcbiAgICBsZXZlbDogb3Bwb3J0dW5pdHlMZXZlbFNjaGVtYS5vcHRpb25hbCgpLFxuICAgIG9wZW5pbmdzOiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCkub3B0aW9uYWwoKSxcbiAgICB3b3JrVGVybTogb3B0aW9uYWxUZXh0KDEyMCksXG4gICAgYXBwbGljYXRpb25NZXRob2Q6IG9wdGlvbmFsVGV4dCgxMjApLFxuICAgIHJlcXVpcmVkRG9jdW1lbnRzOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgdGFyZ2V0ZWREZWdyZWVzOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgdGFyZ2V0ZWRDbHVzdGVyczogb3B0aW9uYWxTdHJpbmdMaXN0LFxuICAgIHByaXplczogb3B0aW9uYWxTdHJpbmdMaXN0LFxuICAgIHRlYW1TaXplOiBvcHBvcnR1bml0eVRlYW1TaXplU2NoZW1hLm9wdGlvbmFsKCksXG4gICAgdHJhY2tzOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgc3VibWlzc2lvblVybDogb3B0aW9uYWxVcmwsXG4gICAgc3VtbWFyeTogcmVxdWlyZWRUZXh0KDUwMDAwLCBcIlN1bW1hcnlcIiksXG4gICAgcmVzcG9uc2liaWxpdGllczogb3B0aW9uYWxTdHJpbmdMaXN0LFxuICAgIHJlcXVpcmVkU2tpbGxzOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgcHJlZmVycmVkU2tpbGxzOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgdGVjaFN0YWNrOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgc2FsYXJ5TWluOiB6Lm51bWJlcigpLm5vbm5lZ2F0aXZlKCkub3B0aW9uYWwoKSxcbiAgICBzYWxhcnlNYXg6IHoubnVtYmVyKCkubm9ubmVnYXRpdmUoKS5vcHRpb25hbCgpLFxuICAgIHNhbGFyeUN1cnJlbmN5OiBvcHRpb25hbFRleHQoMTIpLFxuICAgIGJlbmVmaXRzOiBvcHRpb25hbFN0cmluZ0xpc3QsXG4gICAgZGVhZGxpbmU6IG9wdGlvbmFsVGV4dCg4MCksXG4gICAgYWRkaXRpb25hbEluZm86IG9wdGlvbmFsVGV4dCg1MDAwKSxcbiAgICBzY3JhcGVkQXQ6IG9wdGlvbmFsVGV4dCg4MCksXG4gICAgc2F2ZWRBdDogb3B0aW9uYWxUZXh0KDgwKSxcbiAgICBhcHBsaWVkQXQ6IG9wdGlvbmFsVGV4dCg4MCksXG4gICAgbm90ZXM6IG9wdGlvbmFsVGV4dCg1MDAwKSxcbiAgICBsaW5rZWRSZXN1bWVJZDogb3B0aW9uYWxUZXh0KDIwMCksXG4gICAgbGlua2VkQ292ZXJMZXR0ZXJJZDogb3B0aW9uYWxUZXh0KDIwMCksXG59O1xuY29uc3QgdXBkYXRlT3Bwb3J0dW5pdHlJbnB1dEZpZWxkcyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhvcHBvcnR1bml0eUlucHV0RmllbGRzKS5tYXAoKFtrZXksIHNjaGVtYV0pID0+IFtcbiAgICBrZXksXG4gICAgc2NoZW1hLm9wdGlvbmFsKCksXG5dKSk7XG5leHBvcnQgY29uc3QgY3JlYXRlT3Bwb3J0dW5pdHlTY2hlbWEgPSB6XG4gICAgLm9iamVjdCh7XG4gICAgLi4ub3Bwb3J0dW5pdHlJbnB1dEZpZWxkcyxcbiAgICBzdGF0dXM6IG9wcG9ydHVuaXR5U3RhdHVzU2NoZW1hLmRlZmF1bHQoXCJwZW5kaW5nXCIpLFxuICAgIHRhZ3M6IHouYXJyYXkoei5zdHJpbmcoKS50cmltKCkubWluKDEpLm1heCg4MCkpLmRlZmF1bHQoW10pLFxufSlcbiAgICAucmVmaW5lKGhhc1ZhbGlkU2FsYXJ5UmFuZ2UsIHNhbGFyeVJhbmdlUmVmaW5lbWVudCk7XG5leHBvcnQgY29uc3QgdXBkYXRlT3Bwb3J0dW5pdHlTY2hlbWEgPSB6XG4gICAgLm9iamVjdCh7XG4gICAgLi4udXBkYXRlT3Bwb3J0dW5pdHlJbnB1dEZpZWxkcyxcbiAgICBzdGF0dXM6IG9wcG9ydHVuaXR5U3RhdHVzU2NoZW1hLm9wdGlvbmFsKCksXG4gICAgdGFnczogei5hcnJheSh6LnN0cmluZygpLnRyaW0oKS5taW4oMSkubWF4KDgwKSkub3B0aW9uYWwoKSxcbn0pXG4gICAgLnJlZmluZShoYXNWYWxpZFNhbGFyeVJhbmdlLCBzYWxhcnlSYW5nZVJlZmluZW1lbnQpO1xuZXhwb3J0IGNvbnN0IG9wcG9ydHVuaXR5U2NoZW1hID0gelxuICAgIC5vYmplY3Qoe1xuICAgIC4uLm9wcG9ydHVuaXR5SW5wdXRGaWVsZHMsXG4gICAgaWQ6IHJlcXVpcmVkVGV4dCgyMDAsIFwiSURcIiksXG4gICAgc3RhdHVzOiBvcHBvcnR1bml0eVN0YXR1c1NjaGVtYSxcbiAgICB0YWdzOiB6LmFycmF5KHouc3RyaW5nKCkudHJpbSgpLm1pbigxKS5tYXgoODApKSxcbiAgICBjcmVhdGVkQXQ6IHJlcXVpcmVkVGV4dCg4MCwgXCJDcmVhdGVkIGF0XCIpLFxuICAgIHVwZGF0ZWRBdDogcmVxdWlyZWRUZXh0KDgwLCBcIlVwZGF0ZWQgYXRcIiksXG59KVxuICAgIC5yZWZpbmUoaGFzVmFsaWRTYWxhcnlSYW5nZSwgc2FsYXJ5UmFuZ2VSZWZpbmVtZW50KTtcbmV4cG9ydCBjb25zdCBvcHBvcnR1bml0eVN0YXR1c0NoYW5nZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgICBzdGF0dXM6IG9wcG9ydHVuaXR5U3RhdHVzU2NoZW1hLFxufSk7XG5leHBvcnQgY29uc3Qgb3Bwb3J0dW5pdHlGaWx0ZXJzU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIHR5cGU6IG9wcG9ydHVuaXR5VHlwZVNjaGVtYS5vcHRpb25hbCgpLFxuICAgIHN0YXR1czogb3Bwb3J0dW5pdHlTdGF0dXNTY2hlbWEub3B0aW9uYWwoKSxcbiAgICBzb3VyY2U6IG9wcG9ydHVuaXR5U291cmNlU2NoZW1hLm9wdGlvbmFsKCksXG4gICAgdGFnczogei5hcnJheSh6LnN0cmluZygpLnRyaW0oKS5taW4oMSkpLm9wdGlvbmFsKCksXG4gICAgc2VhcmNoOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLFxufSk7XG4iLCJleHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUyA9IHtcbiAgICBhdXRvRmlsbEVuYWJsZWQ6IHRydWUsXG4gICAgc2hvd0NvbmZpZGVuY2VJbmRpY2F0b3JzOiB0cnVlLFxuICAgIG1pbmltdW1Db25maWRlbmNlOiAwLjUsXG4gICAgbGVhcm5Gcm9tQW5zd2VyczogdHJ1ZSxcbiAgICBub3RpZnlPbkpvYkRldGVjdGVkOiB0cnVlLFxuICAgIGF1dG9UcmFja0FwcGxpY2F0aW9uc0VuYWJsZWQ6IHRydWUsXG4gICAgY2FwdHVyZVNjcmVlbnNob3RFbmFibGVkOiBmYWxzZSxcbn07XG5leHBvcnQgY29uc3QgREVGQVVMVF9BUElfQkFTRV9VUkwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiO1xuIiwiLy8gRXh0ZW5zaW9uIHN0b3JhZ2UgdXRpbGl0aWVzXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBERUZBVUxUX0FQSV9CQVNFX1VSTCB9IGZyb20gXCJAL3NoYXJlZC90eXBlc1wiO1xuY29uc3QgU1RPUkFHRV9LRVkgPSBcImNvbHVtYnVzX2V4dGVuc2lvblwiO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFN0b3JhZ2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChTVE9SQUdFX0tFWSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmVkID0gcmVzdWx0W1NUT1JBR0VfS0VZXTtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGFwaUJhc2VVcmw6IERFRkFVTFRfQVBJX0JBU0VfVVJMLFxuICAgICAgICAgICAgICAgIC4uLnN0b3JlZCxcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogeyAuLi5ERUZBVUxUX1NFVFRJTkdTLCAuLi5zdG9yZWQ/LnNldHRpbmdzIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0U3RvcmFnZSh1cGRhdGVzKSB7XG4gICAgY29uc3QgY3VycmVudCA9IGF3YWl0IGdldFN0b3JhZ2UoKTtcbiAgICBjb25zdCB1cGRhdGVkID0geyAuLi5jdXJyZW50LCAuLi51cGRhdGVzIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IFtTVE9SQUdFX0tFWV06IHVwZGF0ZWQgfSwgcmVzb2x2ZSk7XG4gICAgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJTdG9yYWdlKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoU1RPUkFHRV9LRVksIHJlc29sdmUpO1xuICAgIH0pO1xufVxuLy8gQXV0aCB0b2tlbiBoZWxwZXJzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0QXV0aFRva2VuKHRva2VuLCBleHBpcmVzQXQpIHtcbiAgICBhd2FpdCBzZXRTdG9yYWdlKHtcbiAgICAgICAgYXV0aFRva2VuOiB0b2tlbixcbiAgICAgICAgdG9rZW5FeHBpcnk6IGV4cGlyZXNBdCxcbiAgICAgICAgbGFzdFNlZW5BdXRoQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9KTtcbn1cbi8qKlxuICogUmVjb3JkcyB0aGF0IHdlIGp1c3Qgb2JzZXJ2ZWQgYSB3b3JraW5nIGF1dGhlbnRpY2F0ZWQgc3RhdGUuIENhbGxlZCBieSB0aGVcbiAqIEFQSSBjbGllbnQgYWZ0ZXIgYSBzdWNjZXNzZnVsIGBpc0F1dGhlbnRpY2F0ZWQoKWAgY2hlY2sgc28gdGhlIHBvcHVwIGNhblxuICogZGlzdGluZ3Vpc2ggYSByZWFsIGxvZ291dCBmcm9tIGEgc2VydmljZS13b3JrZXIgc3RhdGUtbG9zcyBldmVudC5cbiAqXG4gKiBEaXN0aW5jdCBmcm9tIGBzZXRBdXRoVG9rZW5gIGJlY2F1c2Ugd2UgZG9uJ3QgYWx3YXlzIGhhdmUgYSBmcmVzaCB0b2tlbiB0b1xuICogd3JpdGUg4oCUIHNvbWV0aW1lcyB3ZSBqdXN0IHZlcmlmaWVkIHRoZSBleGlzdGluZyBvbmUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXJrQXV0aFNlZW4oKSB7XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7IGxhc3RTZWVuQXV0aEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfSk7XG59XG4vKipcbiAqIFwiU2Vzc2lvbiBsb3N0XCIgdmlldyAocG9wdXAsICMyNykgc2hvd3Mgd2hlbiB3ZSBoYXZlIG5vIGBhdXRoVG9rZW5gIGJ1dFxuICogYGxhc3RTZWVuQXV0aEF0YCBpcyB3aXRoaW4gdGhpcyB3aW5kb3cuIEJleW9uZCB0aGUgd2luZG93IHdlIHRyZWF0IHRoZVxuICogZXh0ZW5zaW9uIGFzIGEgZnJlc2ggaW5zdGFsbCAvIHRydWUgbG9nb3V0IGFuZCBzaG93IHRoZSBub3JtYWwgaGVyby5cbiAqL1xuZXhwb3J0IGNvbnN0IFNFU1NJT05fTE9TVF9XSU5ET1dfTVMgPSAyNCAqIDYwICogNjAgKiAxMDAwOyAvLyAyNGhcbi8qKlxuICogUmV0dXJucyB0cnVlIHdoZW4gdGhlIHBvcHVwIHNob3VsZCByZW5kZXIgdGhlIFwiU2Vzc2lvbiBsb3N0IOKAlCByZWNvbm5lY3RcIlxuICogYnJhbmNoIGluc3RlYWQgb2YgdGhlIHVuYXV0aGVudGljYXRlZCBoZXJvLiBTZWUgIzI3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTZXNzaW9uTG9zdChzdG9yYWdlLCBub3cgPSBEYXRlLm5vdygpKSB7XG4gICAgaWYgKHN0b3JhZ2UuYXV0aFRva2VuKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFzdG9yYWdlLmxhc3RTZWVuQXV0aEF0KVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgbGFzdFNlZW4gPSBuZXcgRGF0ZShzdG9yYWdlLmxhc3RTZWVuQXV0aEF0KS5nZXRUaW1lKCk7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobGFzdFNlZW4pKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIG5vdyAtIGxhc3RTZWVuIDw9IFNFU1NJT05fTE9TVF9XSU5ET1dfTVM7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xlYXJBdXRoVG9rZW4oKSB7XG4gICAgLy8gTk9URTogd2UgaW50ZW50aW9uYWxseSBkbyBOT1QgY2xlYXIgYGxhc3RTZWVuQXV0aEF0YCBoZXJlLiBBIHRydWUgbG9nb3V0XG4gICAgLy8gcGF0aCAoaGFuZGxlTG9nb3V0KSBjYWxscyBgZm9yZ2V0QXV0aEhpc3RvcnlgIGFmdGVyd2FyZHM7IHRoaXMgaGVscGVyIGlzXG4gICAgLy8gYWxzbyB1c2VkIHdoZW4gYSB0b2tlbiBxdWlldGx5IGV4cGlyZXMgb3IgYSA0MDEgdHJpcHMgdGhlIGFwaS1jbGllbnQsXG4gICAgLy8gYW5kIGluIHRob3NlIGNhc2VzIHRoZSBzZXNzaW9uLWxvc3QgVUkgaXMgZXhhY3RseSB3aGF0IHdlIHdhbnQgdG8gc2hvdy5cbiAgICBhd2FpdCBzZXRTdG9yYWdlKHtcbiAgICAgICAgYXV0aFRva2VuOiB1bmRlZmluZWQsXG4gICAgICAgIHRva2VuRXhwaXJ5OiB1bmRlZmluZWQsXG4gICAgICAgIGNhY2hlZFByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJvZmlsZUNhY2hlZEF0OiB1bmRlZmluZWQsXG4gICAgfSk7XG59XG4vKipcbiAqIFdpcGVzIHRoZSBcIndlJ3ZlIHNlZW4geW91IGJlZm9yZVwiIGJyZWFkY3J1bWIgc28gdGhlIHBvcHVwIHNob3dzIHRoZVxuICogdW5hdXRoZW50aWNhdGVkIGhlcm8gb24gbmV4dCBvcGVuLiBDYWxsIHRoaXMgZnJvbSBleHBsaWNpdC1sb2dvdXQgZmxvd3MuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmb3JnZXRBdXRoSGlzdG9yeSgpIHtcbiAgICBhd2FpdCBzZXRTdG9yYWdlKHsgbGFzdFNlZW5BdXRoQXQ6IHVuZGVmaW5lZCB9KTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBdXRoVG9rZW4oKSB7XG4gICAgY29uc3Qgc3RvcmFnZSA9IGF3YWl0IGdldFN0b3JhZ2UoKTtcbiAgICBpZiAoIXN0b3JhZ2UuYXV0aFRva2VuKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAvLyBDaGVjayBleHBpcnlcbiAgICBpZiAoc3RvcmFnZS50b2tlbkV4cGlyeSkge1xuICAgICAgICBjb25zdCBleHBpcnkgPSBuZXcgRGF0ZShzdG9yYWdlLnRva2VuRXhwaXJ5KTtcbiAgICAgICAgaWYgKGV4cGlyeSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICAgIGF3YWl0IGNsZWFyQXV0aFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RvcmFnZS5hdXRoVG9rZW47XG59XG4vLyBQcm9maWxlIGNhY2hlIGhlbHBlcnNcbmNvbnN0IFBST0ZJTEVfQ0FDSEVfVFRMID0gNSAqIDYwICogMTAwMDsgLy8gNSBtaW51dGVzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q2FjaGVkUHJvZmlsZSgpIHtcbiAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpO1xuICAgIGlmICghc3RvcmFnZS5jYWNoZWRQcm9maWxlIHx8ICFzdG9yYWdlLnByb2ZpbGVDYWNoZWRBdCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgY2FjaGVkQXQgPSBuZXcgRGF0ZShzdG9yYWdlLnByb2ZpbGVDYWNoZWRBdCk7XG4gICAgaWYgKERhdGUubm93KCkgLSBjYWNoZWRBdC5nZXRUaW1lKCkgPiBQUk9GSUxFX0NBQ0hFX1RUTCkge1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gQ2FjaGUgZXhwaXJlZFxuICAgIH1cbiAgICByZXR1cm4gc3RvcmFnZS5jYWNoZWRQcm9maWxlO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldENhY2hlZFByb2ZpbGUocHJvZmlsZSkge1xuICAgIGF3YWl0IHNldFN0b3JhZ2Uoe1xuICAgICAgICBjYWNoZWRQcm9maWxlOiBwcm9maWxlLFxuICAgICAgICBwcm9maWxlQ2FjaGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckNhY2hlZFByb2ZpbGUoKSB7XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7XG4gICAgICAgIGNhY2hlZFByb2ZpbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgcHJvZmlsZUNhY2hlZEF0OiB1bmRlZmluZWQsXG4gICAgfSk7XG59XG4vLyBTZXR0aW5ncyBoZWxwZXJzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2V0dGluZ3MoKSB7XG4gICAgY29uc3Qgc3RvcmFnZSA9IGF3YWl0IGdldFN0b3JhZ2UoKTtcbiAgICByZXR1cm4gc3RvcmFnZS5zZXR0aW5ncztcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVTZXR0aW5ncyh1cGRhdGVzKSB7XG4gICAgY29uc3Qgc3RvcmFnZSA9IGF3YWl0IGdldFN0b3JhZ2UoKTtcbiAgICBjb25zdCB1cGRhdGVkID0geyAuLi5zdG9yYWdlLnNldHRpbmdzLCAuLi51cGRhdGVzIH07XG4gICAgYXdhaXQgc2V0U3RvcmFnZSh7IHNldHRpbmdzOiB1cGRhdGVkIH0pO1xuICAgIHJldHVybiB1cGRhdGVkO1xufVxuLy8gQVBJIFVSTCBoZWxwZXJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRBcGlCYXNlVXJsKHVybCkge1xuICAgIGF3YWl0IHNldFN0b3JhZ2UoeyBhcGlCYXNlVXJsOiB1cmwgfSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXBpQmFzZVVybCgpIHtcbiAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpO1xuICAgIHJldHVybiBzdG9yYWdlLmFwaUJhc2VVcmw7XG59XG4vLyAtLS0tIFNlc3Npb24tc2NvcGVkIGF1dGggY2FjaGUgKCMzMCkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vL1xuLy8gYGNocm9tZS5zdG9yYWdlLnNlc3Npb25gIGlzIGluLW1lbW9yeSBvbmx5IOKAlCBpdCBzdXJ2aXZlcyBzdXNwZW5kaW5nIHRoZVxuLy8gc2VydmljZSB3b3JrZXIgYnV0IGlzIHdpcGVkIG9uIGJyb3dzZXIgcmVzdGFydCwgd2hpY2ggaXMgZXhhY3RseSB3aGF0IHdlXG4vLyB3YW50IGZvciBhIHNob3J0LWxpdmVkIGF1dGggdmVyZGljdCBjYWNoZS4gVXNpbmcgc2Vzc2lvbiAobm90IGxvY2FsKVxuLy8gYWxzbyBtZWFucyB3ZSBuZXZlciBwZXJzaXN0IHRoZSB2ZXJkaWN0IHRvIGRpc2suXG4vL1xuLy8gVGhlIGNhY2hlIHN0b3JlcyBgeyBhdXRoZW50aWNhdGVkOiBib29sZWFuLCBhdDogSVNPIHN0cmluZyB9YCBzbyB0aGVcbi8vIHBvcHVwIGNhbiByZXR1cm4gYSByZXN1bHQgaW4gPDUwbXMgb24gdGhlIHNlY29uZCBvcGVuIHdpdGhpbiBhIG1pbnV0ZSxcbi8vIHdoaWxlIHRoZSBiYWNrZ3JvdW5kIHNjcmlwdCByZXZhbGlkYXRlcyBpbiB0aGUgYmFja2dyb3VuZC5cbmV4cG9ydCBjb25zdCBBVVRIX0NBQ0hFX1RUTF9NUyA9IDYwICogMTAwMDtcbmNvbnN0IEFVVEhfQ0FDSEVfS0VZID0gXCJjb2x1bWJ1c19hdXRoX2NhY2hlXCI7XG4vKipcbiAqIFJlYWRzIHRoZSBzZXNzaW9uLXNjb3BlZCBhdXRoIHZlcmRpY3QgY2FjaGUuIFJldHVybnMgbnVsbCB3aGVuOlxuICogLSB0aGUgZW50cnkgaGFzIG5ldmVyIGJlZW4gd3JpdHRlbixcbiAqIC0gdGhlIGVudHJ5IGlzIG9sZGVyIHRoYW4gQVVUSF9DQUNIRV9UVExfTVMsXG4gKiAtIHRoZSBlbnRyeSdzIHRpbWVzdGFtcCBpcyB1bnBhcnNlYWJsZSwgb3JcbiAqIC0gY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBpcyB1bmF2YWlsYWJsZSAoZS5nLiBvbGRlciBicm93c2VycykuXG4gKlxuICogT3B0aW9uYWwgYG5vd2AgcGFyYW1ldGVyIGV4aXN0cyBmb3IgdGVzdHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZXNzaW9uQXV0aENhY2hlKG5vdyA9IERhdGUubm93KCkpIHtcbiAgICBjb25zdCBzZXNzaW9uU3RvcmUgPSBjaHJvbWUuc3RvcmFnZT8uc2Vzc2lvbjtcbiAgICBpZiAoIXNlc3Npb25TdG9yZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHNlc3Npb25TdG9yZS5nZXQoQVVUSF9DQUNIRV9LRVksIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gcmVzdWx0Py5bQVVUSF9DQUNIRV9LRVldO1xuICAgICAgICAgICAgaWYgKCFlbnRyeSB8fCB0eXBlb2YgZW50cnkuYXQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGF0ID0gbmV3IERhdGUoZW50cnkuYXQpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGF0KSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vdyAtIGF0ID4gQVVUSF9DQUNIRV9UVExfTVMpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUoeyBhdXRoZW50aWNhdGVkOiAhIWVudHJ5LmF1dGhlbnRpY2F0ZWQsIGF0OiBlbnRyeS5hdCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vKipcbiAqIFdyaXRlcyBhIGZyZXNoIHZlcmRpY3QgdG8gdGhlIHNlc3Npb24tc2NvcGVkIGNhY2hlLiBOby1vcHMgd2hlblxuICogY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbiBpcyB1bmF2YWlsYWJsZSBzbyBjYWxsZXJzIGRvbid0IG5lZWQgdG8gZ3VhcmQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRTZXNzaW9uQXV0aENhY2hlKGF1dGhlbnRpY2F0ZWQpIHtcbiAgICBjb25zdCBzZXNzaW9uU3RvcmUgPSBjaHJvbWUuc3RvcmFnZT8uc2Vzc2lvbjtcbiAgICBpZiAoIXNlc3Npb25TdG9yZSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGVudHJ5ID0ge1xuICAgICAgICBhdXRoZW50aWNhdGVkLFxuICAgICAgICBhdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHNlc3Npb25TdG9yZS5zZXQoeyBbQVVUSF9DQUNIRV9LRVldOiBlbnRyeSB9LCAoKSA9PiByZXNvbHZlKCkpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBEcm9wcyB0aGUgY2FjaGVkIHZlcmRpY3QuIENhbGwgdGhpcyBvbiBhbnkgNDAxIHNvIHRoZSBuZXh0IHBvcHVwIG9wZW5cbiAqIGRvZXNuJ3QgdHJ1c3QgYSBzdGFsZSBcImF1dGhlbnRpY2F0ZWRcIiBhbnN3ZXIuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhclNlc3Npb25BdXRoQ2FjaGUoKSB7XG4gICAgY29uc3Qgc2Vzc2lvblN0b3JlID0gY2hyb21lLnN0b3JhZ2U/LnNlc3Npb247XG4gICAgaWYgKCFzZXNzaW9uU3RvcmUpXG4gICAgICAgIHJldHVybjtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgc2Vzc2lvblN0b3JlLnJlbW92ZShBVVRIX0NBQ0hFX0tFWSwgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICB9KTtcbn1cbiIsIi8vIENvbHVtYnVzIEFQSSBjbGllbnQgZm9yIGV4dGVuc2lvblxuaW1wb3J0IHsgY3JlYXRlT3Bwb3J0dW5pdHlTY2hlbWEgfSBmcm9tIFwiQHNsb3RoaW5nL3NoYXJlZC9zY2hlbWFzXCI7XG5pbXBvcnQgeyBjbGVhclNlc3Npb25BdXRoQ2FjaGUsIGdldFN0b3JhZ2UsIG1hcmtBdXRoU2Vlbiwgc2V0U3RvcmFnZSwgfSBmcm9tIFwiLi9zdG9yYWdlXCI7XG5leHBvcnQgY2xhc3MgQ29sdW1idXNBUElDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmwpIHtcbiAgICAgICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgfVxuICAgIGFzeW5jIGdldEF1dGhUb2tlbigpIHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IGF3YWl0IGdldFN0b3JhZ2UoKTtcbiAgICAgICAgaWYgKCFzdG9yYWdlLmF1dGhUb2tlbilcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAvLyBDaGVjayBleHBpcnlcbiAgICAgICAgaWYgKHN0b3JhZ2UudG9rZW5FeHBpcnkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cGlyeSA9IG5ldyBEYXRlKHN0b3JhZ2UudG9rZW5FeHBpcnkpO1xuICAgICAgICAgICAgaWYgKGV4cGlyeSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBUb2tlbiBleHBpcmVkLCBjbGVhciBpdFxuICAgICAgICAgICAgICAgIGF3YWl0IHNldFN0b3JhZ2UoeyBhdXRoVG9rZW46IHVuZGVmaW5lZCwgdG9rZW5FeHBpcnk6IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RvcmFnZS5hdXRoVG9rZW47XG4gICAgfVxuICAgIGFzeW5jIGF1dGhlbnRpY2F0ZWRGZXRjaChwYXRoLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCB0aGlzLmdldEF1dGhUb2tlbigpO1xuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgYXV0aGVudGljYXRlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke3RoaXMuYmFzZVVybH0ke3BhdGh9YCwge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICBcIlgtRXh0ZW5zaW9uLVRva2VuXCI6IHRva2VuLFxuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBpbnZhbGlkIHRva2VuIEFORCB0aGUgZmFzdC1wYXRoIHNlc3Npb24gY2FjaGUgKCMzMCkgc28gdGhlXG4gICAgICAgICAgICAgICAgLy8gbmV4dCBwb3B1cCBvcGVuIHJlLXZlcmlmaWVzIGluc3RlYWQgb2YgdHJ1c3RpbmcgYSBzdGFsZSB2ZXJkaWN0LlxuICAgICAgICAgICAgICAgIGF3YWl0IHNldFN0b3JhZ2UoeyBhdXRoVG9rZW46IHVuZGVmaW5lZCwgdG9rZW5FeHBpcnk6IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICAgICAgICBhd2FpdCBjbGVhclNlc3Npb25BdXRoQ2FjaGUoKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdXRoZW50aWNhdGlvbiBleHBpcmVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBhd2FpdCByZXNwb25zZVxuICAgICAgICAgICAgICAgIC5qc29uKClcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4gKHsgZXJyb3I6IFwiUmVxdWVzdCBmYWlsZWRcIiB9KSk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IuZXJyb3IgfHwgYFJlcXVlc3QgZmFpbGVkOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH1cbiAgICBhc3luYyBpc0F1dGhlbnRpY2F0ZWQoKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgdGhpcy5nZXRBdXRoVG9rZW4oKTtcbiAgICAgICAgaWYgKCF0b2tlbilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXV0aGVudGljYXRlZEZldGNoKFwiL2FwaS9leHRlbnNpb24vYXV0aC92ZXJpZnlcIik7XG4gICAgICAgICAgICAvLyBSZWNvcmQgdGhlIHdvcmtpbmctYXV0aCBicmVhZGNydW1iIHNvIHRoZSBwb3B1cCBjYW4gZGlzdGluZ3Vpc2ggYVxuICAgICAgICAgICAgLy8gdHJ1ZSBsb2dvdXQgZnJvbSBhIHNlcnZpY2Utd29ya2VyIHN0YXRlLWxvc3MgYWZ0ZXIgdGhpcyBwb2ludC5cbiAgICAgICAgICAgIC8vIFNlZSAjMjcuXG4gICAgICAgICAgICBhd2FpdCBtYXJrQXV0aFNlZW4oKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBnZXRQcm9maWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goXCIvYXBpL2V4dGVuc2lvbi9wcm9maWxlXCIpO1xuICAgIH1cbiAgICBhc3luYyBpbXBvcnRKb2Ioam9iKSB7XG4gICAgICAgIGNvbnN0IG9wcG9ydHVuaXR5ID0ge1xuICAgICAgICAgICAgdHlwZTogXCJqb2JcIixcbiAgICAgICAgICAgIHRpdGxlOiBqb2IudGl0bGUsXG4gICAgICAgICAgICBjb21wYW55OiBqb2IuY29tcGFueSxcbiAgICAgICAgICAgIHNvdXJjZTogbm9ybWFsaXplT3Bwb3J0dW5pdHlTb3VyY2Uoam9iLnNvdXJjZSksXG4gICAgICAgICAgICBzb3VyY2VVcmw6IGpvYi51cmwsXG4gICAgICAgICAgICBzb3VyY2VJZDogam9iLnNvdXJjZUpvYklkLFxuICAgICAgICAgICAgc3VtbWFyeTogam9iLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgcmVzcG9uc2liaWxpdGllczogam9iLnJlc3BvbnNpYmlsaXRpZXMgfHwgW10sXG4gICAgICAgICAgICByZXF1aXJlZFNraWxsczogam9iLnJlcXVpcmVtZW50cyB8fCBbXSxcbiAgICAgICAgICAgIHRlY2hTdGFjazogam9iLmtleXdvcmRzIHx8IFtdLFxuICAgICAgICAgICAgam9iVHlwZTogam9iLnR5cGUsXG4gICAgICAgICAgICByZW1vdGVUeXBlOiBqb2IucmVtb3RlID8gXCJyZW1vdGVcIiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRlYWRsaW5lOiBqb2IuZGVhZGxpbmUsXG4gICAgICAgIH07XG4gICAgICAgIGNyZWF0ZU9wcG9ydHVuaXR5U2NoZW1hLnBhcnNlKG9wcG9ydHVuaXR5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlZEZldGNoKFwiL2FwaS9vcHBvcnR1bml0aWVzL2Zyb20tZXh0ZW5zaW9uXCIsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpvYi50aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55OiBqb2IuY29tcGFueSxcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogam9iLmxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBqb2IuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBqb2IucmVxdWlyZW1lbnRzLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpYmlsaXRpZXM6IGpvYi5yZXNwb25zaWJpbGl0aWVzIHx8IFtdLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiBqb2Iua2V5d29yZHMgfHwgW10sXG4gICAgICAgICAgICAgICAgdHlwZTogam9iLnR5cGUsXG4gICAgICAgICAgICAgICAgcmVtb3RlOiBqb2IucmVtb3RlLFxuICAgICAgICAgICAgICAgIHNhbGFyeTogam9iLnNhbGFyeSxcbiAgICAgICAgICAgICAgICB1cmw6IGpvYi51cmwsXG4gICAgICAgICAgICAgICAgc291cmNlOiBqb2Iuc291cmNlLFxuICAgICAgICAgICAgICAgIHNvdXJjZUpvYklkOiBqb2Iuc291cmNlSm9iSWQsXG4gICAgICAgICAgICAgICAgcG9zdGVkQXQ6IGpvYi5wb3N0ZWRBdCxcbiAgICAgICAgICAgICAgICBkZWFkbGluZTogam9iLmRlYWRsaW5lLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBpbXBvcnRKb2JzQmF0Y2goam9icykge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goXCIvYXBpL29wcG9ydHVuaXRpZXMvZnJvbS1leHRlbnNpb25cIiwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgam9icyB9KSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIHRyYWNrQXBwbGllZChwYXlsb2FkKSB7XG4gICAgICAgIGNvbnN0IHNjcmFwZWRKb2IgPSBwYXlsb2FkLnNjcmFwZWRKb2IgfHwgdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCB0aXRsZSA9IHNjcmFwZWRKb2I/LnRpdGxlIHx8IHBheWxvYWQuaGVhZGxpbmUgfHwgcGF5bG9hZC50aXRsZTtcbiAgICAgICAgY29uc3QgY29tcGFueSA9IHNjcmFwZWRKb2I/LmNvbXBhbnkgfHwgcGF5bG9hZC5ob3N0LnJlcGxhY2UoL153d3dcXC4vLCBcIlwiKTtcbiAgICAgICAgY29uc3Qgbm90ZXMgPSBbXG4gICAgICAgICAgICBwYXlsb2FkLmhlYWRsaW5lID8gYEhlYWRsaW5lOiAke3BheWxvYWQuaGVhZGxpbmV9YCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBheWxvYWQudGh1bWJuYWlsRGF0YVVybFxuICAgICAgICAgICAgICAgID8gXCJTY3JlZW5zaG90IGNhcHR1cmVkIGJ5IGV4dGVuc2lvbi5cIlxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICBdXG4gICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaChcIi9hcGkvb3Bwb3J0dW5pdGllcy9mcm9tLWV4dGVuc2lvblwiLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgICAgIGNvbXBhbnksXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IHNjcmFwZWRKb2I/LmxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBzY3JhcGVkSm9iPy5kZXNjcmlwdGlvbiB8fFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmhlYWRsaW5lIHx8XG4gICAgICAgICAgICAgICAgICAgIFwiQXBwbGljYXRpb24gc3VibWl0dGVkIHZpYSBleHRlbnNpb24uXCIsXG4gICAgICAgICAgICAgICAgcmVxdWlyZW1lbnRzOiBzY3JhcGVkSm9iPy5yZXF1aXJlbWVudHMgfHwgW10sXG4gICAgICAgICAgICAgICAgcmVzcG9uc2liaWxpdGllczogc2NyYXBlZEpvYj8ucmVzcG9uc2liaWxpdGllcyB8fCBbXSxcbiAgICAgICAgICAgICAgICBrZXl3b3Jkczogc2NyYXBlZEpvYj8ua2V5d29yZHMgfHwgW10sXG4gICAgICAgICAgICAgICAgdHlwZTogc2NyYXBlZEpvYj8udHlwZSxcbiAgICAgICAgICAgICAgICByZW1vdGU6IHNjcmFwZWRKb2I/LnJlbW90ZSxcbiAgICAgICAgICAgICAgICBzYWxhcnk6IHNjcmFwZWRKb2I/LnNhbGFyeSxcbiAgICAgICAgICAgICAgICB1cmw6IHNjcmFwZWRKb2I/LnVybCB8fCBwYXlsb2FkLnVybCxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHNjcmFwZWRKb2I/LnNvdXJjZSB8fCBwYXlsb2FkLmhvc3QsXG4gICAgICAgICAgICAgICAgc291cmNlSm9iSWQ6IHNjcmFwZWRKb2I/LnNvdXJjZUpvYklkLFxuICAgICAgICAgICAgICAgIHBvc3RlZEF0OiBzY3JhcGVkSm9iPy5wb3N0ZWRBdCxcbiAgICAgICAgICAgICAgICBkZWFkbGluZTogc2NyYXBlZEpvYj8uZGVhZGxpbmUsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcImFwcGxpZWRcIixcbiAgICAgICAgICAgICAgICBhcHBsaWVkQXQ6IHBheWxvYWQuc3VibWl0dGVkQXQsXG4gICAgICAgICAgICAgICAgbm90ZXMsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG9wcG9ydHVuaXR5SWQgPSByZXNwb25zZS5vcHBvcnR1bml0eUlkc1swXTtcbiAgICAgICAgaWYgKCFvcHBvcnR1bml0eUlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBcHBsaWNhdGlvbiB3YXMgbm90IHRyYWNrZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9wcG9ydHVuaXR5SWQsXG4gICAgICAgICAgICBkZWR1cGVkOiBCb29sZWFuKHJlc3BvbnNlLmRlZHVwZWRJZHM/LmluY2x1ZGVzKG9wcG9ydHVuaXR5SWQpKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgdGFpbG9yRnJvbUpvYihqb2IsIGJhc2VSZXN1bWVJZCkge1xuICAgICAgICBjb25zdCBqb2JEZXNjcmlwdGlvbiA9IGdldFJlYWRhYmxlSm9iRGVzY3JpcHRpb24oam9iKTtcbiAgICAgICAgY29uc3QgaW1wb3J0ZWQgPSBhd2FpdCB0aGlzLmltcG9ydEpvYihqb2IpO1xuICAgICAgICBjb25zdCBvcHBvcnR1bml0eUlkID0gZ2V0SW1wb3J0ZWRPcHBvcnR1bml0eUlkKGltcG9ydGVkLm9wcG9ydHVuaXR5SWRzKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdEJvZHkgPSB7XG4gICAgICAgICAgICBhY3Rpb246IFwiZ2VuZXJhdGVcIixcbiAgICAgICAgICAgIGpvYkRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgam9iVGl0bGU6IGpvYi50aXRsZSxcbiAgICAgICAgICAgIGNvbXBhbnk6IGpvYi5jb21wYW55LFxuICAgICAgICAgICAgb3Bwb3J0dW5pdHlJZCxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gT25seSB0aHJlYWQgdGhlIGlkIHRocm91Z2ggd2hlbiB0aGUgcG9wdXAgcGlja2VkIGEgbm9uLWRlZmF1bHQgcmVzdW1lIOKAlFxuICAgICAgICAvLyBvbWl0dGluZyB0aGUgZmllbGQga2VlcHMgdGhlIHJlcXVlc3QgYm9keSBieXRlLWlkZW50aWNhbCB0byB0aGUgbGVnYWN5XG4gICAgICAgIC8vIHNoYXBlLCBzbyBleGlzdGluZyB0ZXN0cyArIHRlbGVtZXRyeSBkb24ndCBjaHVybiBmb3IgdGhlIG1hc3RlciBjYXNlLlxuICAgICAgICBpZiAoYmFzZVJlc3VtZUlkKSB7XG4gICAgICAgICAgICByZXF1ZXN0Qm9keS5iYXNlUmVzdW1lSWQgPSBiYXNlUmVzdW1lSWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaChcIi9hcGkvdGFpbG9yXCIsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLnNhdmVkUmVzdW1lPy5pZCB8fCAhcmVzcG9uc2Uuam9iSWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRhaWxvcmVkIHJlc3VtZSB3YXMgZ2VuZXJhdGVkIHdpdGhvdXQgYSBzYXZlZCByZXN1bWUuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcHBvcnR1bml0eUlkLFxuICAgICAgICAgICAgc2F2ZWRSZXN1bWU6IHsgaWQ6IHJlc3BvbnNlLnNhdmVkUmVzdW1lLmlkIH0sXG4gICAgICAgICAgICBqb2JJZDogcmVzcG9uc2Uuam9iSWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFzeW5jIGxpc3RSZXN1bWVzKCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXV0aGVudGljYXRlZEZldGNoKFwiL2FwaS9leHRlbnNpb24vcmVzdW1lc1wiKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlc3VtZXMgPz8gW107XG4gICAgfVxuICAgIGFzeW5jIGdlbmVyYXRlQ292ZXJMZXR0ZXJGcm9tSm9iKGpvYikge1xuICAgICAgICBjb25zdCBqb2JEZXNjcmlwdGlvbiA9IGdldFJlYWRhYmxlSm9iRGVzY3JpcHRpb24oam9iKTtcbiAgICAgICAgY29uc3QgaW1wb3J0ZWQgPSBhd2FpdCB0aGlzLmltcG9ydEpvYihqb2IpO1xuICAgICAgICBjb25zdCBvcHBvcnR1bml0eUlkID0gZ2V0SW1wb3J0ZWRPcHBvcnR1bml0eUlkKGltcG9ydGVkLm9wcG9ydHVuaXR5SWRzKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaChcIi9hcGkvY292ZXItbGV0dGVyL2dlbmVyYXRlXCIsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiBcImdlbmVyYXRlXCIsXG4gICAgICAgICAgICAgICAgam9iRGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgam9iVGl0bGU6IGpvYi50aXRsZSxcbiAgICAgICAgICAgICAgICBjb21wYW55OiBqb2IuY29tcGFueSxcbiAgICAgICAgICAgICAgICBvcHBvcnR1bml0eUlkLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJlc3BvbnNlLnNhdmVkQ292ZXJMZXR0ZXI/LmlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3ZlciBsZXR0ZXIgd2FzIGdlbmVyYXRlZCB3aXRob3V0IGEgc2F2ZWQgZG9jdW1lbnQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvcHBvcnR1bml0eUlkLFxuICAgICAgICAgICAgc2F2ZWRDb3ZlckxldHRlcjogeyBpZDogcmVzcG9uc2Uuc2F2ZWRDb3ZlckxldHRlci5pZCB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzYXZlTGVhcm5lZEFuc3dlcihkYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaChcIi9hcGkvZXh0ZW5zaW9uL2xlYXJuZWQtYW5zd2Vyc1wiLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBzZWFyY2hTaW1pbGFyQW5zd2VycyhxdWVzdGlvbikge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXV0aGVudGljYXRlZEZldGNoKFwiL2FwaS9leHRlbnNpb24vbGVhcm5lZC1hbnN3ZXJzL3NlYXJjaFwiLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBxdWVzdGlvbiB9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5yZXN1bHRzO1xuICAgIH1cbiAgICBhc3luYyBnZXRMZWFybmVkQW5zd2VycygpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaChcIi9hcGkvZXh0ZW5zaW9uL2xlYXJuZWQtYW5zd2Vyc1wiKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmFuc3dlcnM7XG4gICAgfVxuICAgIGFzeW5jIGRlbGV0ZUxlYXJuZWRBbnN3ZXIoaWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goYC9hcGkvZXh0ZW5zaW9uL2xlYXJuZWQtYW5zd2Vycy8ke2lkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIHVwZGF0ZUxlYXJuZWRBbnN3ZXIoaWQsIGFuc3dlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGVkRmV0Y2goYC9hcGkvZXh0ZW5zaW9uL2xlYXJuZWQtYW5zd2Vycy8ke2lkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBhbnN3ZXIgfSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQZXJzaXN0IGEgdXNlciBjb3JyZWN0aW9uIHNvIHRoZSBwZXItZG9tYWluIGZpZWxkIG1hcHBpbmcgZ3Jvd3Mgc3Ryb25nZXJcbiAgICAgKiBvdmVyIHRpbWUuIFNlZSB0YXNrICMzMyBpbiBkb2NzL2V4dGVuc2lvbi1yb2FkbWFwLTIwMjYtMDUubWQuIFRoZSBzZXJ2ZXJcbiAgICAgKiB1cHNlcnRzIGludG8gYGZpZWxkX21hcHBpbmdzYCwgYnVtcGluZyBgaGl0X2NvdW50YCBvbiBleGlzdGluZyByb3dzIGFuZFxuICAgICAqIGluc2VydGluZyBmcmVzaCByb3dzIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBhc3luYyBzYXZlQ29ycmVjdGlvbihwYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZWRGZXRjaChcIi9hcGkvZXh0ZW5zaW9uL2ZpZWxkLW1hcHBpbmdzL2NvcnJlY3RcIiwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRSZWFkYWJsZUpvYkRlc2NyaXB0aW9uKGpvYikge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gam9iLmRlc2NyaXB0aW9uPy50cmltKCkgPz8gXCJcIjtcbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoIDwgMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgcmVhZCB0aGUgZnVsbCBqb2IgZGVzY3JpcHRpb24gZnJvbSB0aGlzIHBhZ2UuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRpb247XG59XG5mdW5jdGlvbiBnZXRJbXBvcnRlZE9wcG9ydHVuaXR5SWQob3Bwb3J0dW5pdHlJZHMpIHtcbiAgICBjb25zdCBvcHBvcnR1bml0eUlkID0gb3Bwb3J0dW5pdHlJZHNbMF07XG4gICAgaWYgKCFvcHBvcnR1bml0eUlkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkpvYiBpbXBvcnQgZGlkIG5vdCByZXR1cm4gYW4gb3Bwb3J0dW5pdHkgaWQuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gb3Bwb3J0dW5pdHlJZDtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZU9wcG9ydHVuaXR5U291cmNlKHNvdXJjZSkge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBzb3VyY2UudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobm9ybWFsaXplZC5pbmNsdWRlcyhcImxpbmtlZGluXCIpKVxuICAgICAgICByZXR1cm4gXCJsaW5rZWRpblwiO1xuICAgIGlmIChub3JtYWxpemVkLmluY2x1ZGVzKFwiaW5kZWVkXCIpKVxuICAgICAgICByZXR1cm4gXCJpbmRlZWRcIjtcbiAgICBpZiAobm9ybWFsaXplZC5pbmNsdWRlcyhcImdyZWVuaG91c2VcIikpXG4gICAgICAgIHJldHVybiBcImdyZWVuaG91c2VcIjtcbiAgICBpZiAobm9ybWFsaXplZC5pbmNsdWRlcyhcImxldmVyXCIpKVxuICAgICAgICByZXR1cm4gXCJsZXZlclwiO1xuICAgIGlmIChub3JtYWxpemVkLmluY2x1ZGVzKFwid2F0ZXJsb29cIikpXG4gICAgICAgIHJldHVybiBcIndhdGVybG9vd29ya3NcIjtcbiAgICBpZiAobm9ybWFsaXplZC5pbmNsdWRlcyhcImRldnBvc3RcIikpXG4gICAgICAgIHJldHVybiBcImRldnBvc3RcIjtcbiAgICByZXR1cm4gXCJ1cmxcIjtcbn1cbi8vIFNpbmdsZXRvbiBpbnN0YW5jZVxubGV0IGNsaWVudCA9IG51bGw7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QVBJQ2xpZW50KCkge1xuICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBhd2FpdCBnZXRTdG9yYWdlKCk7XG4gICAgICAgIGNsaWVudCA9IG5ldyBDb2x1bWJ1c0FQSUNsaWVudChzdG9yYWdlLmFwaUJhc2VVcmwpO1xuICAgIH1cbiAgICByZXR1cm4gY2xpZW50O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0QVBJQ2xpZW50KCkge1xuICAgIGNsaWVudCA9IG51bGw7XG59XG4iLCJpbXBvcnQgeyBnZXRTZXR0aW5ncyB9IGZyb20gXCIuL3N0b3JhZ2VcIjtcbmV4cG9ydCBjb25zdCBCQURHRV9URVhUID0gXCIhXCI7XG5leHBvcnQgY29uc3QgQkFER0VfQ09MT1IgPSBcIiMzYjgyZjZcIjtcbmV4cG9ydCBjb25zdCBCQURHRV9USVRMRSA9IFwiSm9iIGRldGVjdGVkIOKAlCBwcmVzcyBDbWQrU2hpZnQrSSB0byBpbXBvcnRcIjtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRCYWRnZUZvclRhYih0YWJJZCkge1xuICAgIGNvbnN0IHNldHRpbmdzID0gYXdhaXQgZ2V0U2V0dGluZ3MoKTtcbiAgICBpZiAoIXNldHRpbmdzLm5vdGlmeU9uSm9iRGV0ZWN0ZWQpXG4gICAgICAgIHJldHVybjtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIGNocm9tZS5hY3Rpb24uc2V0QmFkZ2VUZXh0KHsgdGV4dDogQkFER0VfVEVYVCwgdGFiSWQgfSksXG4gICAgICAgIGNocm9tZS5hY3Rpb24uc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IoeyBjb2xvcjogQkFER0VfQ09MT1IsIHRhYklkIH0pLFxuICAgICAgICBjaHJvbWUuYWN0aW9uLnNldFRpdGxlKHsgdGl0bGU6IEJBREdFX1RJVExFLCB0YWJJZCB9KSxcbiAgICBdKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbGVhckJhZGdlRm9yVGFiKHRhYklkKSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBjaHJvbWUuYWN0aW9uLnNldEJhZGdlVGV4dCh7IHRleHQ6IFwiXCIsIHRhYklkIH0pLFxuICAgICAgICBjaHJvbWUuYWN0aW9uLnNldFRpdGxlKHsgdGl0bGU6IFwiXCIsIHRhYklkIH0pLFxuICAgIF0pO1xufVxuIiwiLy8gQmFja2dyb3VuZCBzZXJ2aWNlIHdvcmtlciBmb3IgQ29sdW1idXMgZXh0ZW5zaW9uXG5pbXBvcnQgeyBnZXRBUElDbGllbnQsIHJlc2V0QVBJQ2xpZW50IH0gZnJvbSBcIi4vYXBpLWNsaWVudFwiO1xuaW1wb3J0IHsgZ2V0U3RvcmFnZSwgc2V0QXV0aFRva2VuLCBjbGVhckF1dGhUb2tlbiwgZm9yZ2V0QXV0aEhpc3RvcnksIGdldENhY2hlZFByb2ZpbGUsIHNldENhY2hlZFByb2ZpbGUsIGdldEFwaUJhc2VVcmwsIGdldFNldHRpbmdzLCBpc1Nlc3Npb25Mb3N0LCBnZXRTZXNzaW9uQXV0aENhY2hlLCBzZXRTZXNzaW9uQXV0aENhY2hlLCBjbGVhclNlc3Npb25BdXRoQ2FjaGUsIH0gZnJvbSBcIi4vc3RvcmFnZVwiO1xuaW1wb3J0IHsgc2V0QmFkZ2VGb3JUYWIsIGNsZWFyQmFkZ2VGb3JUYWIgfSBmcm9tIFwiLi9iYWRnZVwiO1xuLy8gSGFuZGxlIG1lc3NhZ2VzIGZyb20gY29udGVudCBzY3JpcHRzIGFuZCBwb3B1cFxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGhhbmRsZU1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyKVxuICAgICAgICAudGhlbihzZW5kUmVzcG9uc2UpXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIltDb2x1bWJ1c10gTWVzc2FnZSBoYW5kbGVyIGVycm9yOlwiLCBlcnJvcik7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9KTtcbiAgICB9KTtcbiAgICAvLyBSZXR1cm4gdHJ1ZSB0byBpbmRpY2F0ZSBhc3luYyByZXNwb25zZVxuICAgIHJldHVybiB0cnVlO1xufSk7XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKG1lc3NhZ2UsIHNlbmRlcikge1xuICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJHRVRfQVVUSF9TVEFUVVNcIjpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVHZXRBdXRoU3RhdHVzKCk7XG4gICAgICAgIGNhc2UgXCJPUEVOX0FVVEhcIjpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVPcGVuQXV0aCgpO1xuICAgICAgICBjYXNlIFwiTE9HT1VUXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlTG9nb3V0KCk7XG4gICAgICAgIGNhc2UgXCJHRVRfUFJPRklMRVwiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUdldFByb2ZpbGUoKTtcbiAgICAgICAgY2FzZSBcIkdFVF9TRVRUSU5HU1wiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUdldFNldHRpbmdzKCk7XG4gICAgICAgIGNhc2UgXCJJTVBPUlRfSk9CXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlSW1wb3J0Sm9iKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgIGNhc2UgXCJJTVBPUlRfSk9CU19CQVRDSFwiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUltcG9ydEpvYnNCYXRjaChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBjYXNlIFwiVFJBQ0tfQVBQTElFRFwiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVRyYWNrQXBwbGllZChtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBjYXNlIFwiT1BFTl9EQVNIQk9BUkRcIjpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVPcGVuRGFzaGJvYXJkKCk7XG4gICAgICAgIGNhc2UgXCJDQVBUVVJFX1ZJU0lCTEVfVEFCXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlQ2FwdHVyZVZpc2libGVUYWIoKTtcbiAgICAgICAgY2FzZSBcIlRBSUxPUl9GUk9NX1BBR0VcIjpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVUYWlsb3JGcm9tUGFnZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBjYXNlIFwiR0VORVJBVEVfQ09WRVJfTEVUVEVSX0ZST01fUEFHRVwiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUdlbmVyYXRlQ292ZXJMZXR0ZXJGcm9tUGFnZShtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBjYXNlIFwiTElTVF9SRVNVTUVTXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlTGlzdFJlc3VtZXMoKTtcbiAgICAgICAgY2FzZSBcIlNBVkVfQU5TV0VSXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU2F2ZUFuc3dlcihtZXNzYWdlLnBheWxvYWQpO1xuICAgICAgICBjYXNlIFwiU0VBUkNIX0FOU1dFUlNcIjpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVTZWFyY2hBbnN3ZXJzKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgIGNhc2UgXCJHRVRfTEVBUk5FRF9BTlNXRVJTXCI6XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlR2V0TGVhcm5lZEFuc3dlcnMoKTtcbiAgICAgICAgY2FzZSBcIkRFTEVURV9BTlNXRVJcIjpcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVEZWxldGVBbnN3ZXIobWVzc2FnZS5wYXlsb2FkKTtcbiAgICAgICAgY2FzZSBcIlNBVkVfQ09SUkVDVElPTlwiOlxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVNhdmVDb3JyZWN0aW9uKG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgIGNhc2UgXCJKT0JfREVURUNURURcIjoge1xuICAgICAgICAgICAgY29uc3QgdGFiSWQgPSBzZW5kZXIudGFiPy5pZDtcbiAgICAgICAgICAgIGlmICghdGFiSWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vIHRhYiBJRCBpbiBzZW5kZXJcIiB9O1xuICAgICAgICAgICAgYXdhaXQgc2V0QmFkZ2VGb3JUYWIodGFiSWQpO1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJBVVRIX0NBTExCQUNLXCI6IHtcbiAgICAgICAgICAgIC8vIFNlbnQgYnkgdGhlIGNvbnRlbnQgc2NyaXB0IHdoZW4gaXQgcGlja3MgdXAgYSBsb2NhbFN0b3JhZ2UtdHJhbnNwb3J0ZWRcbiAgICAgICAgICAgIC8vIHRva2VuIGZyb20gdGhlIFNsb3RoaW5nIGNvbm5lY3QgcGFnZSAodGhlIGxvY2FsU3RvcmFnZSBwYXRoIGlzIHVzZWQgb25cbiAgICAgICAgICAgIC8vIGJyb3dzZXJzIHdpdGhvdXQgZXh0ZXJuYWxseV9jb25uZWN0YWJsZSDigJQgRmlyZWZveCBpbiBwYXJ0aWN1bGFyKS5cbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBtZXNzYWdlO1xuICAgICAgICAgICAgaWYgKCFwYXlsb2FkLnRva2VuIHx8ICFwYXlsb2FkLmV4cGlyZXNBdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJNaXNzaW5nIHRva2VuIG9yIGV4cGlyZXNBdFwiIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHNldEF1dGhUb2tlbihwYXlsb2FkLnRva2VuLCBwYXlsb2FkLmV4cGlyZXNBdCk7XG4gICAgICAgICAgICAgICAgcmVzZXRBUElDbGllbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBgVW5rbm93biBtZXNzYWdlIHR5cGU6ICR7bWVzc2FnZS50eXBlfWAgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUYWlsb3JGcm9tUGFnZShwYXlsb2FkKSB7XG4gICAgLy8gU3VwcG9ydCBib3RoIHRoZSBuZXcgd3JhcHBlZCBwYXlsb2FkICh7am9iLCBiYXNlUmVzdW1lSWR9KSB1c2VkIGJ5IHRoZVxuICAgIC8vIHBvcHVwIHBpY2tlciAoIzM0KSBhbmQgdGhlIGxlZ2FjeSBiYXJlIFNjcmFwZWRKb2Igc3RpbGwgc2VudCBieSB0aGVcbiAgICAvLyBjb250ZW50LXNjcmlwdCBUYWlsb3IgYWN0aW9uLiBUaGUgXCJ1cmxcIiBwcmVzZW5jZSBvbiB0aGUgaW5uZXIgb2JqZWN0IGlzXG4gICAgLy8gdGhlIGNoZWFwZXN0IGRpc2NyaW1pbmF0b3IgKFNjcmFwZWRKb2IgaGFzIGl0LCBUYWlsb3JGcm9tUGFnZVBheWxvYWRcbiAgICAvLyBkb2Vzbid0KS5cbiAgICBjb25zdCBpc0xlZ2FjeSA9IFwidXJsXCIgaW4gcGF5bG9hZCAmJiAhKFwiam9iXCIgaW4gcGF5bG9hZCk7XG4gICAgY29uc3Qgam9iID0gaXNMZWdhY3lcbiAgICAgICAgPyBwYXlsb2FkXG4gICAgICAgIDogcGF5bG9hZC5qb2I7XG4gICAgY29uc3QgYmFzZVJlc3VtZUlkID0gaXNMZWdhY3lcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBwYXlsb2FkLmJhc2VSZXN1bWVJZDtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2xpZW50LnRhaWxvckZyb21Kb2Ioam9iLCBiYXNlUmVzdW1lSWQpO1xuICAgICAgICBjb25zdCBhcGlCYXNlVXJsID0gYXdhaXQgZ2V0QXBpQmFzZVVybCgpO1xuICAgICAgICBjb25zdCByZXN1bWVJZCA9IHJlc3VsdC5zYXZlZFJlc3VtZS5pZDtcbiAgICAgICAgY29uc3Qgc3R1ZGlvUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XG4gICAgICAgICAgICBmcm9tOiBcImV4dGVuc2lvblwiLFxuICAgICAgICAgICAgdGFpbG9ySWQ6IHJlc3VtZUlkLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGJhc2VSZXN1bWVJZCkge1xuICAgICAgICAgICAgc3R1ZGlvUGFyYW1zLnNldChcImJhc2VSZXN1bWVJZFwiLCBiYXNlUmVzdW1lSWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHVybDogYCR7YXBpQmFzZVVybH0vc3R1ZGlvPyR7c3R1ZGlvUGFyYW1zLnRvU3RyaW5nKCl9YCxcbiAgICAgICAgICAgICAgICBvcHBvcnR1bml0eUlkOiByZXN1bHQub3Bwb3J0dW5pdHlJZCxcbiAgICAgICAgICAgICAgICByZXN1bWVJZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVMaXN0UmVzdW1lcygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgcmVzdW1lcyA9IGF3YWl0IGNsaWVudC5saXN0UmVzdW1lcygpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IHJlc3VtZXMgfSB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2VuZXJhdGVDb3ZlckxldHRlckZyb21QYWdlKGpvYikge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldEFQSUNsaWVudCgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQuZ2VuZXJhdGVDb3ZlckxldHRlckZyb21Kb2Ioam9iKTtcbiAgICAgICAgY29uc3QgYXBpQmFzZVVybCA9IGF3YWl0IGdldEFwaUJhc2VVcmwoKTtcbiAgICAgICAgY29uc3QgY292ZXJMZXR0ZXJJZCA9IHJlc3VsdC5zYXZlZENvdmVyTGV0dGVyLmlkO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICB1cmw6IGAke2FwaUJhc2VVcmx9L2NvdmVyLWxldHRlcj9mcm9tPWV4dGVuc2lvbiZpZD0ke2VuY29kZVVSSUNvbXBvbmVudChjb3ZlckxldHRlcklkKX1gLFxuICAgICAgICAgICAgICAgIG9wcG9ydHVuaXR5SWQ6IHJlc3VsdC5vcHBvcnR1bml0eUlkLFxuICAgICAgICAgICAgICAgIGNvdmVyTGV0dGVySWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0QXV0aFN0YXR1cygpIHtcbiAgICAvLyBGYXN0LXBhdGggKCMzMCk6IHJldHVybiBhIGNhY2hlZCB2ZXJkaWN0IGlmIGl0J3MgPDYwcyBvbGQsIHRoZW5cbiAgICAvLyByZXZhbGlkYXRlIGluIHRoZSBiYWNrZ3JvdW5kIHNvIGEgZmxpcHBlZCBzZXJ2ZXIgc3RhdGUgc3RpbGxcbiAgICAvLyBzZWxmLWNvcnJlY3RzIG9uIHRoZSAqbmV4dCogcG9wdXAgb3Blbi5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBnZXRTZXNzaW9uQXV0aENhY2hlKCk7XG4gICAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFwaUJhc2VVcmwgPSBhd2FpdCBnZXRBcGlCYXNlVXJsKCk7XG4gICAgICAgICAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpO1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbkxvc3QgPSAhY2FjaGVkLmF1dGhlbnRpY2F0ZWQgJiYgaXNTZXNzaW9uTG9zdChzdG9yYWdlKTtcbiAgICAgICAgICAgIC8vIEZpcmUtYW5kLWZvcmdldCByZXZhbGlkYXRpb24uIFdlIGRlbGliZXJhdGVseSBkb24ndCBhd2FpdCBpdCBzb1xuICAgICAgICAgICAgLy8gdGhlIHBvcHVwIGdldHMgaXRzIHJlc3BvbnNlIGltbWVkaWF0ZWx5LlxuICAgICAgICAgICAgdm9pZCByZXZhbGlkYXRlQXV0aEluQmFja2dyb3VuZCgpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBjYWNoZWQuYXV0aGVudGljYXRlZCxcbiAgICAgICAgICAgICAgICAgICAgYXBpQmFzZVVybCxcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbkxvc3QsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICAvLyBDYWNoZSBsb29rdXAgZmFpbHVyZSBpcyBub24tZmF0YWw7IGZhbGwgdGhyb3VnaCB0byB0aGUgdmVyaWZ5IHBhdGguXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldEFQSUNsaWVudCgpO1xuICAgICAgICBjb25zdCBpc0F1dGhlbnRpY2F0ZWQgPSBhd2FpdCBjbGllbnQuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgIGNvbnN0IGFwaUJhc2VVcmwgPSBhd2FpdCBnZXRBcGlCYXNlVXJsKCk7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBhd2FpdCBnZXRTdG9yYWdlKCk7XG4gICAgICAgIGNvbnN0IHNlc3Npb25Mb3N0ID0gIWlzQXV0aGVudGljYXRlZCAmJiBpc1Nlc3Npb25Mb3N0KHN0b3JhZ2UpO1xuICAgICAgICBhd2FpdCBzZXRTZXNzaW9uQXV0aENhY2hlKGlzQXV0aGVudGljYXRlZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogeyBpc0F1dGhlbnRpY2F0ZWQsIGFwaUJhc2VVcmwsIHNlc3Npb25Mb3N0IH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBhcGlCYXNlVXJsID0gYXdhaXQgZ2V0QXBpQmFzZVVybCgpO1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gYXdhaXQgZ2V0U3RvcmFnZSgpLmNhdGNoKCgpID0+IG51bGwpO1xuICAgICAgICBjb25zdCBzZXNzaW9uTG9zdCA9IHN0b3JhZ2UgPyBpc1Nlc3Npb25Mb3N0KHN0b3JhZ2UpIDogZmFsc2U7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogeyBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLCBhcGlCYXNlVXJsLCBzZXNzaW9uTG9zdCB9LFxuICAgICAgICB9O1xuICAgIH1cbn1cbi8qKlxuICogQmFja2dyb3VuZCByZXZhbGlkYXRpb24gdGhhdCBydW5zIGFmdGVyIHdlIHJldHVybiBhIGNhY2hlZCB2ZXJkaWN0LlxuICogUmVmcmVzaGVzIHRoZSBzZXNzaW9uIGNhY2hlIHNvIHN1YnNlcXVlbnQgcmVhZHMgc3RheSBmcmVzaDsgb24gYSA0MDFcbiAqIHRoZSBhcGktY2xpZW50J3MgYXV0aGVudGljYXRlZEZldGNoIGNsZWFycyBgYXV0aFRva2VuYCArIHRoZSBjYWNoZVxuICogYWxyZWFkeS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmV2YWxpZGF0ZUF1dGhJbkJhY2tncm91bmQoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHZlcmRpY3QgPSBhd2FpdCBjbGllbnQuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgIGF3YWl0IHNldFNlc3Npb25BdXRoQ2FjaGUodmVyZGljdCk7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgLy8gTmV0d29yayBibGlwIOKAlCBsZWF2ZSB0aGUgY2FjaGUgYWxvbmU7IG5leHQgbWlzcyB3aWxsIHJldmFsaWRhdGUuXG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlT3BlbkF1dGgoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYXBpQmFzZVVybCA9IGF3YWl0IGdldEFwaUJhc2VVcmwoKTtcbiAgICAgICAgLy8gUGFzcyBleHRlbnNpb24gSUQgc28gdGhlIGNvbm5lY3QgcGFnZSBjYW4gZGVsaXZlciB0aGUgdG9rZW4gYmFjayB2aWFcbiAgICAgICAgLy8gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoZXh0ZW5zaW9uSWQsIC4uLikuIFRoZSBwYWdlIGlzIGEgcmVndWxhciB3ZWJcbiAgICAgICAgLy8gcGFnZSBhbmQgY2Fubm90IHJlc29sdmUgdGhlIGNhbGxpbmcgZXh0ZW5zaW9uIGJ5IHBhc3NpbmcgdW5kZWZpbmVkLlxuICAgICAgICBjb25zdCBhdXRoVXJsID0gYCR7YXBpQmFzZVVybH0vZXh0ZW5zaW9uL2Nvbm5lY3Q/ZXh0ZW5zaW9uSWQ9JHtjaHJvbWUucnVudGltZS5pZH1gO1xuICAgICAgICBhd2FpdCBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGF1dGhVcmwgfSk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ291dCgpIHtcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBjbGVhckF1dGhUb2tlbigpO1xuICAgICAgICAvLyBFeHBsaWNpdCBsb2dvdXQg4oCUIGFsc28gZHJvcCB0aGUgXCJ3ZSd2ZSBzZWVuIHlvdSBiZWZvcmVcIiBicmVhZGNydW1iIHNvXG4gICAgICAgIC8vIHRoZSBwb3B1cCBkb2Vzbid0IGZhbGwgaW50byB0aGUgIzI3IFwic2Vzc2lvbiBsb3N0XCIgYnJhbmNoLlxuICAgICAgICBhd2FpdCBmb3JnZXRBdXRoSGlzdG9yeSgpO1xuICAgICAgICAvLyBBbmQgdGhlIGZhc3QtcGF0aCBjYWNoZSAoIzMwKSBzbyB0aGUgbmV4dCBwb3B1cCBvcGVuIHJlLXZlcmlmaWVzLlxuICAgICAgICBhd2FpdCBjbGVhclNlc3Npb25BdXRoQ2FjaGUoKTtcbiAgICAgICAgcmVzZXRBUElDbGllbnQoKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0UHJvZmlsZSgpIHtcbiAgICB0cnkge1xuICAgICAgICAvLyBDaGVjayBjYWNoZSBmaXJzdFxuICAgICAgICBjb25zdCBjYWNoZWQgPSBhd2FpdCBnZXRDYWNoZWRQcm9maWxlKCk7XG4gICAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGNhY2hlZCB9O1xuICAgICAgICB9XG4gICAgICAgIC8vIEZldGNoIGZyb20gQVBJXG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldEFQSUNsaWVudCgpO1xuICAgICAgICBjb25zdCBwcm9maWxlID0gYXdhaXQgY2xpZW50LmdldFByb2ZpbGUoKTtcbiAgICAgICAgLy8gQ2FjaGUgdGhlIHByb2ZpbGVcbiAgICAgICAgYXdhaXQgc2V0Q2FjaGVkUHJvZmlsZShwcm9maWxlKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcHJvZmlsZSB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0U2V0dGluZ3MoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogYXdhaXQgZ2V0U2V0dGluZ3MoKSB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSW1wb3J0Sm9iKGpvYikge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldEFQSUNsaWVudCgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQuaW1wb3J0Sm9iKGpvYik7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdCB9O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlSW1wb3J0Sm9ic0JhdGNoKGpvYnMpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY2xpZW50LmltcG9ydEpvYnNCYXRjaChqb2JzKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0IH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVUcmFja0FwcGxpZWQocGF5bG9hZCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IGdldEFQSUNsaWVudCgpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQudHJhY2tBcHBsaWVkKHBheWxvYWQpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQgfTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9O1xuICAgIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZU9wZW5EYXNoYm9hcmQoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYXBpQmFzZVVybCA9IGF3YWl0IGdldEFwaUJhc2VVcmwoKTtcbiAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiBgJHthcGlCYXNlVXJsfS9kYXNoYm9hcmRgIH0pO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVDYXB0dXJlVmlzaWJsZVRhYigpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhVXJsID0gYXdhaXQgY2hyb21lLnRhYnMuY2FwdHVyZVZpc2libGVUYWIodW5kZWZpbmVkLCB7XG4gICAgICAgICAgICBmb3JtYXQ6IFwianBlZ1wiLFxuICAgICAgICAgICAgcXVhbGl0eTogMzUsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiB7IGRhdGFVcmwgfSB9O1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlIH07XG4gICAgfVxufVxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlU2F2ZUFuc3dlcihkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5zYXZlTGVhcm5lZEFuc3dlcih7XG4gICAgICAgICAgICBxdWVzdGlvbjogZGF0YS5xdWVzdGlvbixcbiAgICAgICAgICAgIGFuc3dlcjogZGF0YS5hbnN3ZXIsXG4gICAgICAgICAgICBzb3VyY2VVcmw6IGRhdGEudXJsLFxuICAgICAgICAgICAgc291cmNlQ29tcGFueTogZGF0YS5jb21wYW55LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0IH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTZWFyY2hBbnN3ZXJzKHF1ZXN0aW9uKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjbGllbnQuc2VhcmNoU2ltaWxhckFuc3dlcnMocXVlc3Rpb24pO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHRzIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRMZWFybmVkQW5zd2VycygpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IGNsaWVudC5nZXRMZWFybmVkQW5zd2VycygpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhbnN3ZXJzIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVEZWxldGVBbnN3ZXIoaWQpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRBUElDbGllbnQoKTtcbiAgICAgICAgYXdhaXQgY2xpZW50LmRlbGV0ZUxlYXJuZWRBbnN3ZXIoaWQpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTYXZlQ29ycmVjdGlvbihwYXlsb2FkKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0QVBJQ2xpZW50KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNsaWVudC5zYXZlQ29ycmVjdGlvbihwYXlsb2FkKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0IH07XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICB9XG59XG4vLyBIYW5kbGUgYXV0aCBjYWxsYmFjayBmcm9tIENvbHVtYnVzIHdlYiBhcHBcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZUV4dGVybmFsLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiQVVUSF9DQUxMQkFDS1wiICYmXG4gICAgICAgIG1lc3NhZ2UudG9rZW4gJiZcbiAgICAgICAgbWVzc2FnZS5leHBpcmVzQXQpIHtcbiAgICAgICAgc2V0QXV0aFRva2VuKG1lc3NhZ2UudG9rZW4sIG1lc3NhZ2UuZXhwaXJlc0F0KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmVzZXRBUElDbGllbnQoKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KTtcbi8vIEhhbmRsZSBrZXlib2FyZCBzaG9ydGN1dHNcbmNocm9tZS5jb21tYW5kcy5vbkNvbW1hbmQuYWRkTGlzdGVuZXIoYXN5bmMgKGNvbW1hbmQpID0+IHtcbiAgICBjb25zdCBbdGFiXSA9IGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICAgIGlmICghdGFiPy5pZClcbiAgICAgICAgcmV0dXJuO1xuICAgIHN3aXRjaCAoY29tbWFuZCkge1xuICAgICAgICBjYXNlIFwiZmlsbC1mb3JtXCI6XG4gICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWIuaWQsIHsgdHlwZTogXCJUUklHR0VSX0ZJTExcIiB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaW1wb3J0LWpvYlwiOlxuICAgICAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7IHR5cGU6IFwiVFJJR0dFUl9JTVBPUlRcIiB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuLy8gQ2xlYXIgYmFkZ2Ugd2hlbiBhIHRhYiBuYXZpZ2F0ZXMgdG8gYSBuZXcgVVJMXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCBjaGFuZ2VJbmZvKSA9PiB7XG4gICAgaWYgKGNoYW5nZUluZm8uc3RhdHVzID09PSBcImxvYWRpbmdcIiAmJiBjaGFuZ2VJbmZvLnVybCkge1xuICAgICAgICBjbGVhckJhZGdlRm9yVGFiKHRhYklkKS5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIH1cbn0pO1xuLy8gSGFuZGxlIGV4dGVuc2lvbiBpbnN0YWxsL3VwZGF0ZVxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKGRldGFpbHMpID0+IHtcbiAgICBpZiAoZGV0YWlscy5yZWFzb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBFeHRlbnNpb24gaW5zdGFsbGVkXCIpO1xuICAgICAgICAvLyBDb3VsZCBvcGVuIG9uYm9hcmRpbmcgcGFnZSBoZXJlXG4gICAgfVxuICAgIGVsc2UgaWYgKGRldGFpbHMucmVhc29uID09PSBcInVwZGF0ZVwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiW0NvbHVtYnVzXSBFeHRlbnNpb24gdXBkYXRlZCB0b1wiLCBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb24pO1xuICAgIH1cbn0pO1xuY29uc29sZS5sb2coXCJbQ29sdW1idXNdIEJhY2tncm91bmQgc2VydmljZSB3b3JrZXIgc3RhcnRlZFwiKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==