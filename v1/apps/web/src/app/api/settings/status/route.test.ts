import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isLLMConfigured } from "@/lib/llm/is-configured";

describe("isLLMConfigured", () => {
  // Snapshot + clear the env vars that the env-fallback path inspects so the
  // pure-DB cases below behave the same in CI (no keys) and in dev (where
  // .env.local often has at least one key set). Restored in afterEach.
  const ENV_KEYS = [
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "OPENROUTER_API_KEY",
  ] as const;
  const originalEnv: Partial<
    Record<(typeof ENV_KEYS)[number], string | undefined>
  > = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it("returns false for null config", () => {
    expect(isLLMConfigured(null)).toBe(false);
  });

  it("returns false when model is empty", () => {
    expect(
      isLLMConfigured({ provider: "openai", apiKey: "sk-test", model: "" }),
    ).toBe(false);
  });

  it("returns true for ollama without API key", () => {
    expect(isLLMConfigured({ provider: "ollama", model: "llama3.2" })).toBe(
      true,
    );
  });

  it("returns true for ollama with empty API key", () => {
    expect(
      isLLMConfigured({ provider: "ollama", apiKey: "", model: "llama3.2" }),
    ).toBe(true);
  });

  it("returns false for openai without API key and no env fallback", () => {
    expect(isLLMConfigured({ provider: "openai", model: "gpt-4o-mini" })).toBe(
      false,
    );
  });

  it("returns false for openai with empty API key and no env fallback", () => {
    expect(
      isLLMConfigured({ provider: "openai", apiKey: "", model: "gpt-4o-mini" }),
    ).toBe(false);
  });

  it("returns true for openai with API key", () => {
    expect(
      isLLMConfigured({
        provider: "openai",
        apiKey: "sk-test123",
        model: "gpt-4o-mini",
      }),
    ).toBe(true);
  });

  it("returns true for anthropic with API key", () => {
    expect(
      isLLMConfigured({
        provider: "anthropic",
        apiKey: "sk-ant-test",
        model: "claude-haiku-4-5-20251001",
      }),
    ).toBe(true);
  });

  it("returns false for anthropic without API key and no env fallback", () => {
    expect(
      isLLMConfigured({
        provider: "anthropic",
        model: "claude-haiku-4-5-20251001",
      }),
    ).toBe(false);
  });

  it("returns true for openrouter with API key", () => {
    expect(
      isLLMConfigured({
        provider: "openrouter",
        apiKey: "sk-or-test",
        model: "meta-llama/llama-3.2-3b-instruct:free",
      }),
    ).toBe(true);
  });

  it("returns false for openrouter without API key and no env fallback", () => {
    expect(
      isLLMConfigured({
        provider: "openrouter",
        model: "meta-llama/llama-3.2-3b-instruct:free",
      }),
    ).toBe(false);
  });

  // Env-fallback parity with LLMClient (audit finding F1.1):
  // a key in .env.local must count as configured even when /settings is empty.

  it("returns true for openai when OPENAI_API_KEY env is set", () => {
    process.env.OPENAI_API_KEY = "sk-env-test";
    expect(isLLMConfigured({ provider: "openai", model: "gpt-4o-mini" })).toBe(
      true,
    );
  });

  it("returns true for openai with empty DB key but env fallback present", () => {
    process.env.OPENAI_API_KEY = "sk-env-test";
    expect(
      isLLMConfigured({ provider: "openai", apiKey: "", model: "gpt-4o-mini" }),
    ).toBe(true);
  });

  it("returns true for anthropic when ANTHROPIC_API_KEY env is set", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-env";
    expect(
      isLLMConfigured({
        provider: "anthropic",
        model: "claude-haiku-4-5-20251001",
      }),
    ).toBe(true);
  });

  it("returns true for openrouter when OPENROUTER_API_KEY env is set", () => {
    process.env.OPENROUTER_API_KEY = "sk-or-env";
    expect(
      isLLMConfigured({
        provider: "openrouter",
        model: "meta-llama/llama-3.2-3b-instruct:free",
      }),
    ).toBe(true);
  });

  it("ignores an unrelated provider's env key", () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-env";
    expect(isLLMConfigured({ provider: "openai", model: "gpt-4o-mini" })).toBe(
      false,
    );
  });

  it("treats empty-string env key as not configured", () => {
    process.env.OPENAI_API_KEY = "";
    expect(isLLMConfigured({ provider: "openai", model: "gpt-4o-mini" })).toBe(
      false,
    );
  });
});
