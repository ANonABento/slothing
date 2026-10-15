import { describe, expect, it } from "vitest";

import { createJob, editedMeta, getDoc, getSettings, migrate, saveDoc, saveSettings } from "../db";
import { resolveLlm } from "../llm";
import { profileAsTailored, resolveResume } from "../resolve";
import { letterSystem, letterWarnings } from "../tailor";
import { Settings } from "../types";
import { profile } from "./fixture";

const ai = (patch: Partial<Settings["ai"]> = {}) => ({ ...Settings.parse({}).ai, ...patch });

describe("resolveLlm", () => {
  it("is null when no key is set", () => {
    expect(resolveLlm(ai(), {})).toEqual({ config: null, warning: null });
  });

  it("automatic picks the first provider with a key, in Anthropic → Nebius → OpenAI order", () => {
    expect(resolveLlm(ai(), { OPENAI_API_KEY: "o", NEBIUS_API_KEY: "n" }).config).toMatchObject({ provider: "nebius", key: "n", model: "moonshotai/Kimi-K3" });
    expect(resolveLlm(ai(), { OPENAI_API_KEY: "o", ANTHROPIC_API_KEY: "a" }).config?.provider).toBe("anthropic");
  });

  it("honors the chosen provider over the automatic order", () => {
    const r = resolveLlm(ai({ provider: "openai" }), { ANTHROPIC_API_KEY: "a", OPENAI_API_KEY: "o" });
    expect(r.config).toMatchObject({ provider: "openai", label: "OpenAI", base: "https://api.openai.com/v1", model: "gpt-5" });
    expect(r.warning).toBeNull();
  });

  it("falls back with a warning when the chosen provider has no key", () => {
    const r = resolveLlm(ai({ provider: "anthropic" }), { NEBIUS_API_KEY: "n" });
    expect(r.config?.provider).toBe("nebius");
    expect(r.warning).toMatch(/ANTHROPIC_API_KEY.*Nebius is used instead/);
  });

  it("model: settings, then env, then the built-in default", () => {
    const env = { NEBIUS_API_KEY: "n", NEBIUS_MODEL: "env-model" };
    expect(resolveLlm(ai(), env).config?.model).toBe("env-model");
    expect(resolveLlm(ai({ models: { anthropic: "", nebius: " picked ", openai: "" } }), env).config?.model).toBe("picked");
  });

  it("endpoint: a custom OpenAI base URL is labelled OpenAI-compatible and loses its trailing slash", () => {
    const r = resolveLlm(ai({ openaiBaseUrl: "http://localhost:11434/v1/" }), { OPENAI_API_KEY: "o" });
    expect(r.config).toMatchObject({ label: "OpenAI-compatible", base: "http://localhost:11434/v1" });
  });

  it("ignores a blank key", () => {
    expect(resolveLlm(ai(), { ANTHROPIC_API_KEY: "  " }).config).toBeNull();
  });
});

describe("settings storage", () => {
  it("defaults when nothing is saved, and round-trips", () => {
    expect(getSettings().ai.provider).toBeNull();
    const s = Settings.parse({ ai: { provider: "openai", openaiBaseUrl: "http://x/v1" } });
    saveSettings(s);
    expect(getSettings()).toEqual(s);
    expect(getSettings().ai.models).toEqual({ anthropic: "", nebius: "", openai: "" });
  });
});

describe("resume layout", () => {
  it("normalizes section order: drops repeats, appends missing sections in default order", () => {
    const s = Settings.parse({ resume: { order: ["education", "education", "skills"] } });
    expect(s.resume.order).toEqual(["education", "skills", "summary", "experience", "projects"]);
  });

  it("rejects hiding a required section", () => {
    expect(() => Settings.parse({ resume: { hide: ["experience"] } })).toThrow();
  });

  it("resolveResume applies order and hidden sections; content stays in the doc", () => {
    const layout = Settings.parse({ resume: { order: ["education", "experience"], hide: ["summary"], paper: "a4" } }).resume;
    const r = resolveResume(profile, profileAsTailored(profile), layout);
    expect(r.sections).toEqual(["education", "experience", "projects", "skills"]);
    expect(r.paper).toBe("a4");
    expect(r.summary).toBe(profile.summary);
  });
});

describe("cover letter length", () => {
  const letter = (words: number) => ({ greeting: "", closing: "", paragraphs: [Array.from({ length: words }, () => "word").join(" ")] });

  it("warns only past the target plus 10% slack", () => {
    expect(letterWarnings(profile, letter(215), undefined, "short")).toEqual([]);
    expect(letterWarnings(profile, letter(230), undefined, "short")).toEqual([{ where: "Length", message: "230 words, over the 200-word target in Settings." }]);
    expect(letterWarnings(profile, letter(230), undefined, "standard")).toEqual([]);
  });

  it("the prompt states the target", () => {
    expect(letterSystem("short")).toMatch(/under 200 words/);
    expect(letterSystem("standard")).toMatch(/under 350 words/);
  });
});

describe("document meta", () => {
  it("migrate adds the meta column to an old documents table, keeping rows, and is idempotent", async () => {
    const { default: Database } = await import("better-sqlite3");
    const old = new Database(":memory:");
    old.exec(`CREATE TABLE documents (id TEXT PRIMARY KEY, job_id TEXT NOT NULL, kind TEXT NOT NULL, data TEXT NOT NULL,
      warnings TEXT NOT NULL DEFAULT '[]', updated_at TEXT NOT NULL, UNIQUE (job_id, kind));
      INSERT INTO documents VALUES ('d1', 'j1', 'resume', '{}', '[]', 'now');`);
    migrate(old);
    migrate(old);
    expect(old.prepare("SELECT meta FROM documents WHERE id = 'd1'").get()).toEqual({ meta: "{}" });
  });

  it("saveDoc stores meta, keeps it when omitted, and editedMeta marks hand edits", () => {
    const jobId = createJob({ company: "Initech", title: "Eng", url: "", location: "", description: "" });
    const doc = profileAsTailored(profile);
    saveDoc(jobId, "resume", doc, [], { source: "ai", provider: "Nebius", model: "m", latitude: "select" });
    saveDoc(jobId, "resume", doc);
    expect(getDoc(jobId, "resume")?.meta).toEqual({ source: "ai", provider: "Nebius", model: "m", latitude: "select" });
    saveDoc(jobId, "resume", doc, [], editedMeta(jobId, "resume"));
    expect(getDoc(jobId, "resume")?.meta).toMatchObject({ source: "ai", edited: true });
  });
});
