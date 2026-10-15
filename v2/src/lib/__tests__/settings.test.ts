import { describe, expect, it } from "vitest";

import { getSettings, saveSettings } from "../db";
import { resolveLlm } from "../llm";
import { Settings } from "../types";

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
