import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_TEMPLATES } from "@slothing/shared/resume-template";
import { reusableIrToResumeTemplate } from "@/lib/resume/template-collapse";

// Back the collapsed store with an in-memory libsql DB (no touching the dev .local.db).
vi.mock("@/lib/db/legacy", async () => {
  const { default: Database } = await import("libsql");
  return { default: new Database(":memory:") };
});

import legacyDb from "@/lib/db/legacy";
const mem = legacyDb as unknown as {
  prepare(sql: string): {
    run(...a: unknown[]): unknown;
    get(...a: unknown[]): unknown;
    all(...a: unknown[]): unknown[];
  };
};

import {
  ensureResumeTemplatesTable,
  saveResumeTemplate,
  getResumeTemplate,
  listResumeTemplates,
  deleteResumeTemplate,
  migrateV4ToCollapsed,
} from "./resume-templates";

function resetDb() {
  mem.prepare("DROP TABLE IF EXISTS document_templates").run();
  mem.prepare("DROP TABLE IF EXISTS document_templates_v4").run();
}

describe("V4 IR → collapsed model mapping", () => {
  it("maps style tokens + layout onto the closed grammar", () => {
    const ir = {
      id: "v4-1",
      name: "Imported Modern",
      source: { filename: "resume.pdf", type: "pdf" },
      tokens: {
        typography: { body: { fontFamily: "Georgia", sizePt: 11 } },
        color: { accent: { value: "#0d7377" } },
        spacing: { sectionGapPt: { value: 22 }, lineHeight: { value: "1.4" } },
        rules: { sectionDivider: { style: "solid" } },
        layout: { headerMode: { value: "split" }, columns: { value: 1 } },
      },
    };
    const tpl = reusableIrToResumeTemplate(ir, "fallback");
    expect(tpl.id).toBe("v4-1");
    expect(tpl.tokens.accent).toBe("#0d7377");
    expect(tpl.tokens.fontClass).toBe("serif");
    expect(tpl.grammar.header).toBe("split");
    expect(tpl.grammar.sectionTitle).toBe("full-rule");
    expect(tpl.tokens.lineHeight).toBeCloseTo(1.4);
  });

  it("falls back to curated defaults for unreadable axes (still a valid composition)", () => {
    const tpl = reusableIrToResumeTemplate({}, "fb");
    expect(tpl.id).toBe("fb");
    expect(["single", "left-sidebar", "right-sidebar"]).toContain(
      tpl.grammar.columns,
    );
    expect(tpl.tokens.accent).toMatch(/^#[0-9a-f]{3,6}$/i);
  });
});

describe("collapsed store — CRUD round-trip", () => {
  beforeEach(resetDb);

  it("saves, reads, lists, and deletes a template + RDM", () => {
    ensureResumeTemplatesTable();
    const tpl = DEFAULT_TEMPLATES[0];
    const rdm = {
      basics: { name: "Sam" },
      work: [],
      education: [],
      skills: [],
    };
    const saved = saveResumeTemplate("u1", {
      template: tpl,
      rdm,
      sourceFilename: "x.pdf",
      sourceType: "pdf",
    });
    expect(saved.id).toBeTruthy();

    const got = getResumeTemplate(saved.id, "u1");
    expect(got?.template.grammar.columns).toBe(tpl.grammar.columns);
    expect(got?.rdm?.basics.name).toBe("Sam");
    expect(got?.sourceFilename).toBe("x.pdf");

    // user scoping
    expect(getResumeTemplate(saved.id, "other")).toBeNull();
    expect(listResumeTemplates("u1")).toHaveLength(1);

    expect(deleteResumeTemplate(saved.id, "u1")).toBe(true);
    expect(listResumeTemplates("u1")).toHaveLength(0);
  });

  it("persists the preferred export engine, defaulting to null", () => {
    ensureResumeTemplatesTable();
    const plain = saveResumeTemplate("u1", { template: DEFAULT_TEMPLATES[0] });
    expect(plain.exportEngine).toBeNull();
    expect(getResumeTemplate(plain.id, "u1")?.exportEngine).toBeNull();

    const typst = saveResumeTemplate("u1", {
      template: { ...DEFAULT_TEMPLATES[1], id: "with-engine" },
      exportEngine: "typst",
    });
    expect(typst.exportEngine).toBe("typst");
    expect(getResumeTemplate("with-engine", "u1")?.exportEngine).toBe("typst");
  });
});

describe("migrateV4ToCollapsed — one-time V4 migration", () => {
  beforeEach(resetDb);

  function seedV4() {
    mem
      .prepare(
        `CREATE TABLE document_templates_v4 (id text PRIMARY KEY, user_id text NOT NULL, name text NOT NULL,
          description text, source_filename text, source_type text, template_json text NOT NULL,
          created_at text NOT NULL, updated_at text NOT NULL)`,
      )
      .run();
    const ir = {
      id: "legacy-1",
      name: "Legacy Sidebar",
      tokens: {
        typography: { body: { fontFamily: "Arial", sizePt: 10 } },
        color: { accent: { value: "#1f4e79" } },
        layout: { headerMode: { value: "sidebar" }, columns: { value: 2 } },
      },
    };
    mem
      .prepare(
        `INSERT INTO document_templates_v4 (id, user_id, name, description, source_filename, source_type, template_json, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?)`,
      )
      .run(
        "legacy-1",
        "u1",
        "Legacy Sidebar",
        null,
        "old.pdf",
        "pdf",
        JSON.stringify(ir),
        "t0",
        "t0",
      );
  }

  it("migrates legacy V4 rows into the collapsed model and is idempotent", () => {
    ensureResumeTemplatesTable();
    seedV4();

    const first = migrateV4ToCollapsed();
    expect(first.migrated).toBe(1);

    const migrated = getResumeTemplate("legacy-1", "u1");
    expect(migrated?.name).toBe("Legacy Sidebar");
    expect(migrated?.template.grammar.columns).toBe("left-sidebar");
    expect(migrated?.template.tokens.accent).toBe("#1f4e79");
    expect(migrated?.template.tokens.fontClass).toBe("sans");

    // Idempotent: a second run skips the already-migrated row.
    const second = migrateV4ToCollapsed();
    expect(second.migrated).toBe(0);
    expect(second.skipped).toBe(1);
  });

  it("tolerates a missing legacy table (fresh install)", () => {
    expect(migrateV4ToCollapsed()).toEqual({ migrated: 0, skipped: 0 });
  });
});
