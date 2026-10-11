import { z } from "zod";

export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 200;

export class InvalidCursorError extends Error {
  constructor(message = "Invalid cursor") {
    super(message);
    this.name = "InvalidCursorError";
  }
}

export const PaginationParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

export interface PaginationResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function encodeCursor<T>(value: T): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function decodeCursor<T>(
  value: string | undefined | null,
  schema?: z.ZodType<T>,
): T | null {
  if (!value) return null;

  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    const decoded = JSON.parse(json) as unknown;
    if (!decoded || typeof decoded !== "object") {
      throw new InvalidCursorError();
    }
    return schema ? schema.parse(decoded) : (decoded as T);
  } catch (error) {
    if (error instanceof InvalidCursorError) throw error;
    throw new InvalidCursorError();
  }
}

export function buildPaginationResult<T>(
  rows: T[],
  limit: number,
  makeCursor: (last: T) => unknown,
): PaginationResult<T> {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const boundary = items.at(-1);

  return {
    items,
    hasMore,
    nextCursor: hasMore && boundary ? encodeCursor(makeCursor(boundary)) : null,
  };
}
