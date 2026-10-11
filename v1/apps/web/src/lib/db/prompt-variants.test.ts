import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Database from "libsql";

// Use a real in-memory libSQL DB to verify cross-user isolation. Mocking
// db.prepare would let an IDOR regression slip through if the WHERE clause
// were dropped — only a real DB faithfully proves the user_id filter holds.
//
// vi.hoisted runs before module imports so the proxy is wired into the mock
// before prompt-variants.ts is loaded.
const { clientProxy, idCounter } = vi.hoisted(() => {
  const state: { db: unknown } = { db: null };
  const proxy = {
    setDb(db: unknown) {
      state.db = db;
    },
    execute(input: string | { sql: string; args?: unknown[] }) {
      const sql = typeof input === "string" ? input : input.sql;
      const args = typeof input === "string" ? [] : (input.args ?? []);
      const db = state.db as {
        prepare: (s: string) => {
          all: (...args: unknown[]) => unknown[];
          run: (...args: unknown[]) => { changes: number };
        };
      };
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith("SELECT") || trimmed.startsWith("PRAGMA")) {
        return Promise.resolve({ rows: db.prepare(sql).all(...args) });
      }
      const result = db.prepare(sql).run(...args);
      return Promise.resolve({ rows: [], rowsAffected: result.changes });
    },
    batch(statements: Array<{ sql: string; args?: unknown[] }>) {
      const db = state.db as {
        transaction: <T>(f: () => T) => () => T;
        prepare: (s: string) => {
          run: (...args: unknown[]) => { changes: number };
        };
      };
      const runAll = db.transaction(() =>
        statements.map((statement) => {
          const result = db
            .prepare(statement.sql)
            .run(...(statement.args ?? []));
          return { rows: [], rowsAffected: result.changes };
        }),
      );
      return Promise.resolve(runAll());
    },
  };
  return { clientProxy: proxy, idCounter: { value: 0 } };
});

vi.mock("./client", () => ({
  getClient: () => clientProxy,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => `id-${++idCounter.value}`,
}));

let memDb: Database.Database;

import {
  DEFAULT_PROMPT_CONTENT,
  seedDefaultPromptVariant,
  getAllPromptVariants,
  getActivePromptVariant,
  getPromptVariantById,
  createPromptVariant,
  setActivePromptVariant,
  updatePromptVariant,
  deletePromptVariant,
  logPromptVariantResult,
  getPromptVariantResults,
  getPromptVariantStats,
} from "./prompt-variants";

function createSchema(db: Database.Database) {
  // Intentionally start without user_id columns so we exercise the runtime
  // schema migration in `ensurePromptVariantsUserSchema`.
  db.exec(`
    CREATE TABLE prompt_variants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      content TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE prompt_variant_results (
      id TEXT PRIMARY KEY,
      prompt_variant_id TEXT NOT NULL,
      job_id TEXT,
      resume_id TEXT,
      match_score REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

describe("prompt-variants DB module", () => {
  beforeEach(() => {
    idCounter.value = 0;
    memDb = new Database(":memory:");
    createSchema(memDb);
    clientProxy.setDb(memDb);
  });

  afterEach(() => {
    memDb.close();
  });

  describe("DEFAULT_PROMPT_CONTENT", () => {
    it("is a non-empty string", async () => {
      expect(typeof DEFAULT_PROMPT_CONTENT).toBe("string");
      expect(DEFAULT_PROMPT_CONTENT.length).toBeGreaterThan(0);
    });
  });

  describe("schema migration", () => {
    it("backfills user_id columns when calling any function", async () => {
      await seedDefaultPromptVariant("user-A");

      const variantCols = (
        memDb.prepare("PRAGMA table_info(prompt_variants)").all() as Array<{
          name: string;
        }>
      ).map((c) => c.name);
      const resultCols = (
        memDb
          .prepare("PRAGMA table_info(prompt_variant_results)")
          .all() as Array<{ name: string }>
      ).map((c) => c.name);

      expect(variantCols).toContain("user_id");
      expect(resultCols).toContain("user_id");
    });
  });

  describe("seedDefaultPromptVariant", () => {
    it("inserts default variant for user when none exists", async () => {
      const id = await seedDefaultPromptVariant("user-A");
      expect(id).toBeTruthy();

      const variants = await getAllPromptVariants("user-A");
      expect(variants).toHaveLength(1);
      expect(variants[0].name).toBe("Default");
      expect(variants[0].active).toBe(true);
    });

    it("returns null when the user already has a variant", async () => {
      await seedDefaultPromptVariant("user-A");
      expect(await seedDefaultPromptVariant("user-A")).toBeNull();
    });

    it("seeds independently per user", async () => {
      await seedDefaultPromptVariant("user-A");
      await seedDefaultPromptVariant("user-B");

      expect(await getAllPromptVariants("user-A")).toHaveLength(1);
      expect(await getAllPromptVariants("user-B")).toHaveLength(1);
      const aVariants = await getAllPromptVariants("user-A");
      const bVariants = await getAllPromptVariants("user-B");
      expect(aVariants[0].id).not.toBe(bVariants[0].id);
    });
  });

  describe("multi-user isolation (IDOR regression test)", () => {
    it("getPromptVariantById refuses to return another user's variant", async () => {
      await seedDefaultPromptVariant("user-A");
      await seedDefaultPromptVariant("user-B");
      const aVariant = (await getAllPromptVariants("user-A"))[0];

      // user-B trying to read user-A's variant by guessing id
      expect(await getPromptVariantById(aVariant.id, "user-B")).toBeNull();
      // and user-A can still read their own
      expect(await getPromptVariantById(aVariant.id, "user-A")).not.toBeNull();
    });

    it("updatePromptVariant cannot rewrite another user's variant", async () => {
      await seedDefaultPromptVariant("user-A");
      await seedDefaultPromptVariant("user-B");
      const aVariant = (await getAllPromptVariants("user-A"))[0];

      const result = await updatePromptVariant(aVariant.id, "user-B", {
        name: "Hacked",
      });
      expect(result).toBeNull();

      // verify user-A's variant unchanged
      const after = await getPromptVariantById(aVariant.id, "user-A");
      expect(after?.name).toBe("Default");
    });

    it("deletePromptVariant cannot remove another user's variant", async () => {
      await seedDefaultPromptVariant("user-A");
      // create an inactive variant for A so deletion is allowed
      const created = await createPromptVariant("user-A", "v2", "content");
      await seedDefaultPromptVariant("user-B");

      expect(await deletePromptVariant(created.id, "user-B")).toBe(false);
      expect(await getPromptVariantById(created.id, "user-A")).not.toBeNull();
    });

    it("setActivePromptVariant cannot toggle another user's variant", async () => {
      await seedDefaultPromptVariant("user-A");
      const aSecond = await createPromptVariant("user-A", "second", "content");
      await seedDefaultPromptVariant("user-B");

      expect(await setActivePromptVariant(aSecond.id, "user-B")).toBe(false);

      // A's variants: original Default still active, second still inactive
      const aVariants = await getAllPromptVariants("user-A");
      const stillActive = aVariants.find((v) => v.active);
      expect(stillActive?.name).toBe("Default");
    });

    it("getAllPromptVariants only returns the calling user's variants", async () => {
      await seedDefaultPromptVariant("user-A");
      await createPromptVariant("user-A", "a-v2", "content");
      await seedDefaultPromptVariant("user-B");

      expect(await getAllPromptVariants("user-A")).toHaveLength(2);
      expect(await getAllPromptVariants("user-B")).toHaveLength(1);
    });

    it("getPromptVariantResults filters by user_id", async () => {
      await seedDefaultPromptVariant("user-A");
      const aVariant = (await getAllPromptVariants("user-A"))[0];
      await logPromptVariantResult(
        "user-A",
        aVariant.id,
        "job-A",
        "resume-A",
        90,
      );
      await seedDefaultPromptVariant("user-B");

      // user-B passing user-A's variant id sees nothing
      expect(await getPromptVariantResults(aVariant.id, "user-B")).toEqual([]);
      expect(await getPromptVariantResults(aVariant.id, "user-A")).toHaveLength(
        1,
      );
    });

    it("getPromptVariantStats only includes the calling user's variants", async () => {
      await seedDefaultPromptVariant("user-A");
      await seedDefaultPromptVariant("user-B");

      const aStats = await getPromptVariantStats("user-A");
      const bStats = await getPromptVariantStats("user-B");
      expect(aStats).toHaveLength(1);
      expect(bStats).toHaveLength(1);
      expect(aStats[0].variantId).not.toBe(bStats[0].variantId);
    });
  });

  describe("getActivePromptVariant", () => {
    it("returns the active variant scoped to user", async () => {
      await seedDefaultPromptVariant("user-A");
      const result = await getActivePromptVariant("user-A");
      expect(result?.name).toBe("Default");
      expect(result?.active).toBe(true);
    });

    it("seeds default for first-time user", async () => {
      const result = await getActivePromptVariant("brand-new-user");
      expect(result?.name).toBe("Default");
    });
  });

  describe("createPromptVariant", () => {
    it("auto-increments version per user", async () => {
      await seedDefaultPromptVariant("user-A");
      const created = await createPromptVariant("user-A", "v2", "instructions");
      expect(created.version).toBe(2);
      expect(created.active).toBe(false);
    });

    it("accepts explicit version", async () => {
      const created = await createPromptVariant("user-A", "v5", "content", 5);
      expect(created.version).toBe(5);
    });
  });

  describe("setActivePromptVariant", () => {
    it("deactivates the previous active variant for the same user", async () => {
      await seedDefaultPromptVariant("user-A");
      const second = await createPromptVariant("user-A", "second", "content");

      expect(await setActivePromptVariant(second.id, "user-A")).toBe(true);

      const variants = await getAllPromptVariants("user-A");
      const active = variants.filter((v) => v.active);
      expect(active).toHaveLength(1);
      expect(active[0].id).toBe(second.id);
    });

    it("returns false when variant not found", async () => {
      expect(await setActivePromptVariant("missing", "user-A")).toBe(false);
    });
  });

  describe("updatePromptVariant", () => {
    it("updates name and content", async () => {
      await seedDefaultPromptVariant("user-A");
      const variants = await getAllPromptVariants("user-A");
      const result = await updatePromptVariant(variants[0].id, "user-A", {
        name: "Updated",
      });
      expect(result?.name).toBe("Updated");
    });

    it("returns null when variant not found", async () => {
      expect(
        await updatePromptVariant("missing", "user-A", { name: "x" }),
      ).toBeNull();
    });
  });

  describe("deletePromptVariant", () => {
    it("deletes inactive variant", async () => {
      await seedDefaultPromptVariant("user-A");
      const inactive = await createPromptVariant("user-A", "v2", "content");

      expect(await deletePromptVariant(inactive.id, "user-A")).toBe(true);
      expect(await getPromptVariantById(inactive.id, "user-A")).toBeNull();
    });

    it("refuses to delete the active variant", async () => {
      await seedDefaultPromptVariant("user-A");
      const active = (await getAllPromptVariants("user-A"))[0];
      expect(await deletePromptVariant(active.id, "user-A")).toBe(false);
    });

    it("returns false when variant not found", async () => {
      expect(await deletePromptVariant("missing", "user-A")).toBe(false);
    });
  });

  describe("logPromptVariantResult", () => {
    it("inserts a result record and returns it", async () => {
      await seedDefaultPromptVariant("user-A");
      const variant = (await getAllPromptVariants("user-A"))[0];

      const result = await logPromptVariantResult(
        "user-A",
        variant.id,
        "job-1",
        "resume-1",
        85.5,
      );
      expect(result.promptVariantId).toBe(variant.id);
      expect(result.matchScore).toBe(85.5);
      expect(result.jobId).toBe("job-1");
    });

    it("allows optional fields to be omitted", async () => {
      await seedDefaultPromptVariant("user-A");
      const variant = (await getAllPromptVariants("user-A"))[0];

      const result = await logPromptVariantResult("user-A", variant.id);
      expect(result.jobId).toBeNull();
      expect(result.resumeId).toBeNull();
      expect(result.matchScore).toBeNull();
    });
  });

  describe("getPromptVariantStats", () => {
    it("returns stats with boolean active field and result counts", async () => {
      await seedDefaultPromptVariant("user-A");
      const variant = (await getAllPromptVariants("user-A"))[0];
      await logPromptVariantResult(
        "user-A",
        variant.id,
        "job-1",
        "resume-1",
        70,
      );
      await logPromptVariantResult(
        "user-A",
        variant.id,
        "job-2",
        "resume-2",
        80,
      );

      const stats = await getPromptVariantStats("user-A");
      expect(stats).toHaveLength(1);
      expect(stats[0].active).toBe(true);
      expect(stats[0].resultCount).toBe(2);
      expect(stats[0].avgMatchScore).toBe(75);
    });
  });
});
