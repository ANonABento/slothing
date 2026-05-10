import { describe, it, expect, beforeEach } from "vitest";
import {
  ENV_EXAMPLE_FILE,
  FEATURE_CHECKS,
  checkFeature,
  getFeatureStatuses,
  validateEnv,
  logEnvValidation,
  ensureEnvValidated,
  __resetEnvValidationForTests,
} from "./env";

function createLogger() {
  const warnings: string[] = [];
  const infos: string[] = [];
  return {
    warn: (msg: string) => warnings.push(msg),
    info: (msg: string) => infos.push(msg),
    warnings,
    infos,
  };
}

const FULL_ENV = {
  GOOGLE_CLIENT_ID: "google-client-id",
  GOOGLE_CLIENT_SECRET: "google-client-secret",
  NEXTAUTH_SECRET: "nextauth-secret",
  TURSO_DATABASE_URL: "file:./.local.db",
  OPENAI_API_KEY: "sk-openai",
};

describe("checkFeature", () => {
  it("reports enabled when all requireAll keys are set", () => {
    const result = checkFeature(
      {
        name: "NextAuth",
        requireAll: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      },
      { GOOGLE_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "secret" }
    );
    expect(result.enabled).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("reports disabled with missing keys when requireAll keys are absent", () => {
    const result = checkFeature(
      {
        name: "NextAuth",
        requireAll: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      },
      { GOOGLE_CLIENT_ID: "id" }
    );
    expect(result.enabled).toBe(false);
    expect(result.missing).toEqual(["GOOGLE_CLIENT_SECRET"]);
  });

  it("treats empty strings as missing", () => {
    const result = checkFeature(
      {
        name: "NextAuth",
        requireAll: ["GOOGLE_CLIENT_ID"],
      },
      { GOOGLE_CLIENT_ID: "   " }
    );
    expect(result.enabled).toBe(false);
    expect(result.missing).toEqual(["GOOGLE_CLIENT_ID"]);
  });

  it("reports enabled when any requireAny key is set", () => {
    const result = checkFeature(
      {
        name: "LLM",
        requireAny: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"],
      },
      { ANTHROPIC_API_KEY: "sk-ant" }
    );
    expect(result.enabled).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("reports disabled when no requireAny key is set", () => {
    const result = checkFeature(
      {
        name: "LLM",
        requireAny: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"],
      },
      {}
    );
    expect(result.enabled).toBe(false);
    expect(result.missing).toEqual(["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]);
  });
});

describe("getFeatureStatuses", () => {
  it("returns a status for every feature check by default", () => {
    const statuses = getFeatureStatuses({});
    expect(statuses).toHaveLength(FEATURE_CHECKS.length);
    expect(statuses.find((status) => status.name === "libSQL Database")?.enabled).toBe(true);
    expect(statuses.filter((status) => !status.enabled)).toHaveLength(2);
  });

  it("returns all enabled when full env is provided", () => {
    const statuses = getFeatureStatuses(FULL_ENV);
    for (const status of statuses) {
      expect(status.enabled).toBe(true);
    }
  });
});

describe("validateEnv", () => {
  it("returns ok=true with no warnings when all features enabled", () => {
    const result = validateEnv({
      ...FULL_ENV,
      OLLAMA_BASE_URL: "http://localhost:11434",
    });
    expect(result.ok).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it("returns ok=false with warnings listing missing keys and referencing .env.example", () => {
    const result = validateEnv({});
    expect(result.ok).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
    for (const warning of result.warnings) {
      expect(warning).toContain(ENV_EXAMPLE_FILE);
    }
  });

  it("produces a NextAuth warning that names every required key", () => {
    const result = validateEnv({
      TURSO_DATABASE_URL: "file:./.local.db",
      OPENAI_API_KEY: "sk-openai",
    });
    const warning = result.warnings.find((w) => w.includes("NextAuth"));
    expect(warning).toBeDefined();
    expect(warning).toContain("GOOGLE_CLIENT_ID");
    expect(warning).toContain("GOOGLE_CLIENT_SECRET");
    expect(warning).toContain("NEXTAUTH_SECRET");
    // requireAll: all keys are needed, so wording must NOT say "one of"
    expect(warning).not.toContain("one of");
  });

  it("uses 'missing one of' wording only for requireAny features", () => {
    const result = validateEnv({});
    const llmWarning = result.warnings.find((w) => w.includes("LLM Providers"));
    const nextAuthWarning = result.warnings.find((w) =>
      w.includes("NextAuth")
    );
    expect(llmWarning).toContain("missing one of:");
    expect(nextAuthWarning).not.toContain("one of");
  });

  it("produces an LLM warning listing all provider options", () => {
    const result = validateEnv({
      ...FULL_ENV,
      OPENAI_API_KEY: undefined,
    });
    const llmWarning = result.warnings.find((w) => w.includes("LLM Providers"));
    expect(llmWarning).toBeDefined();
    expect(llmWarning).toContain("OPENAI_API_KEY");
    expect(llmWarning).toContain("ANTHROPIC_API_KEY");
    expect(llmWarning).toContain("OPENROUTER_API_KEY");
    expect(llmWarning).toContain("OLLAMA_BASE_URL");
  });
});

describe("logEnvValidation", () => {
  it("logs a single info when all features enabled and no warnings", () => {
    const logger = createLogger();
    logEnvValidation(logger, FULL_ENV);
    expect(logger.warnings).toEqual([]);
    expect(logger.infos).toHaveLength(1);
    expect(logger.infos[0]).toContain("All feature env vars configured");
  });

  it("logs a warning per disabled feature and no info", () => {
    const logger = createLogger();
    logEnvValidation(logger, {});
    expect(logger.infos).toEqual([]);
    expect(logger.warnings.length).toBe(2);
  });
});

describe("ensureEnvValidated", () => {
  beforeEach(() => {
    __resetEnvValidationForTests();
  });

  it("runs validation on first call", () => {
    const logger = createLogger();
    const result = ensureEnvValidated(logger, {});
    expect(result).toBeDefined();
    expect(logger.warnings.length).toBeGreaterThan(0);
  });

  it("is idempotent — subsequent calls are no-ops", () => {
    const logger1 = createLogger();
    ensureEnvValidated(logger1, {});
    const logger2 = createLogger();
    const result = ensureEnvValidated(logger2, {});
    expect(result).toBeUndefined();
    expect(logger2.warnings).toEqual([]);
    expect(logger2.infos).toEqual([]);
  });
});
