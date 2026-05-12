import crypto from "crypto";

type LogFieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly string[]
  | readonly number[];

type LogFields = Record<string, LogFieldValue>;

export function safeBasenameHash(filename: string): string {
  const basename = filename.split(/[\\/]/).pop() ?? filename;
  return crypto.createHash("sha256").update(basename).digest("hex").slice(0, 16);
}

function isFilenameField(key: string): boolean {
  const normalized = key.replace(/[^a-z]/gi, "").toLowerCase();
  return normalized === "filename" || normalized.endsWith("filename");
}

function sanitizeFields(fields?: LogFields): LogFields | undefined {
  if (!fields) return undefined;

  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => {
      if (typeof value === "string" && isFilenameField(key)) {
        return [`${key}Hash`, safeBasenameHash(value)];
      }
      return [key, value];
    }),
  );
}

function debug(scope: string, message: string, fields?: LogFields) {
  if (process.env.NODE_ENV === "production") return;

  const sanitizedFields = sanitizeFields(fields);
  if (sanitizedFields && Object.keys(sanitizedFields).length > 0) {
    console.debug(`[${scope}] ${message}`, sanitizedFields);
    return;
  }

  console.debug(`[${scope}] ${message}`);
}

function error(scope: string, error: unknown, fields?: LogFields) {
  const sanitizedFields = sanitizeFields(fields);
  console.error(
    `[${scope}] error`,
    error instanceof Error ? error.stack : error,
    sanitizedFields,
  );
}

export const log = {
  debug,
  error,
};
