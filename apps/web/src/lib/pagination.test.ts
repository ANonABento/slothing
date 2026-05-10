import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  buildPaginationResult,
  decodeCursor,
  encodeCursor,
  InvalidCursorError,
  PaginationParamsSchema,
} from "./pagination";

describe("pagination", () => {
  const cursorSchema = z.object({
    lastId: z.string(),
    lastCreatedAt: z.string(),
  });

  it("round trips opaque cursors", () => {
    const cursor = {
      lastId: "item-1",
      lastCreatedAt: "2026-05-10T12:00:00.000Z",
    };

    expect(decodeCursor(encodeCursor(cursor), cursorSchema)).toEqual(cursor);
  });

  it("treats empty cursors as absent", () => {
    expect(decodeCursor("", cursorSchema)).toBeNull();
    expect(decodeCursor(undefined, cursorSchema)).toBeNull();
  });

  it("rejects malformed cursors", () => {
    expect(() => decodeCursor("not-base64-!!!", cursorSchema)).toThrow(
      InvalidCursorError,
    );
    expect(() => decodeCursor(encodeCursor({}), cursorSchema)).toThrow(
      InvalidCursorError,
    );
  });

  it("returns a terminal page when rows do not exceed the limit", () => {
    const page = buildPaginationResult([{ id: "a" }], 2, (row) => row);

    expect(page).toEqual({
      items: [{ id: "a" }],
      hasMore: false,
      nextCursor: null,
    });
  });

  it("uses the page boundary row for the next cursor", () => {
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const page = buildPaginationResult(rows, 2, (row) => ({
      lastId: row.id,
    }));

    expect(page.items).toEqual([{ id: "a" }, { id: "b" }]);
    expect(page.hasMore).toBe(true);
    expect(decodeCursor(page.nextCursor)).toEqual({ lastId: "b" });
  });

  it("validates page limits", () => {
    expect(PaginationParamsSchema.parse({})).toEqual({ limit: 50 });
    expect(PaginationParamsSchema.parse({ limit: "100" })).toEqual({
      limit: 100,
    });
    expect(() => PaginationParamsSchema.parse({ limit: "0" })).toThrow();
    expect(() => PaginationParamsSchema.parse({ limit: "201" })).toThrow();
  });
});
