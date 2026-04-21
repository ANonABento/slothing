export const ENV_EXAMPLE_FILE = ".env.example";

export interface FeatureCheck {
  name: string;
  description: string;
  requireAll?: string[];
  requireAny?: string[];
}

export const FEATURE_CHECKS: FeatureCheck[] = [
  {
    name: "Clerk Authentication",
    description:
      "User auth and multi-user support. When disabled, the app falls back to a shared local dev user and skips route protection.",
    requireAll: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
  },
  {
    name: "Neon PostgreSQL Database",
    description:
      "Hosted Postgres for production. When disabled, the app falls back to the local SQLite file.",
    requireAll: ["DATABASE_URL"],
  },
  {
    name: "LLM Providers",
    description:
      "AI features (resume tailoring, interview prep, cover letters). At least one provider must be configured.",
    requireAny: [
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "OPENROUTER_API_KEY",
      "OLLAMA_BASE_URL",
    ],
  },
];

export interface FeatureStatus {
  name: string;
  description: string;
  enabled: boolean;
  missing: string[];
}

export interface ValidationResult {
  ok: boolean;
  statuses: FeatureStatus[];
  warnings: string[];
}

type EnvSource = Record<string, string | undefined>;

function isSet(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function checkFeature(check: FeatureCheck, env: EnvSource): FeatureStatus {
  if (check.requireAll && check.requireAll.length > 0) {
    const missing = check.requireAll.filter((key) => !isSet(env[key]));
    return {
      name: check.name,
      description: check.description,
      enabled: missing.length === 0,
      missing,
    };
  }

  if (check.requireAny && check.requireAny.length > 0) {
    const anySet = check.requireAny.some((key) => isSet(env[key]));
    return {
      name: check.name,
      description: check.description,
      enabled: anySet,
      missing: anySet ? [] : [...check.requireAny],
    };
  }

  return {
    name: check.name,
    description: check.description,
    enabled: true,
    missing: [],
  };
}

export function getFeatureStatuses(
  env: EnvSource = process.env,
  checks: FeatureCheck[] = FEATURE_CHECKS
): FeatureStatus[] {
  return checks.map((check) => checkFeature(check, env));
}

function formatWarning(status: FeatureStatus): string {
  const missingText =
    status.missing.length === 1
      ? `missing ${status.missing[0]}`
      : `missing one of: ${status.missing.join(", ")}`;
  return `[env] ${status.name} disabled — ${missingText}. See ${ENV_EXAMPLE_FILE} for the correct variable names.`;
}

export function validateEnv(
  env: EnvSource = process.env,
  checks: FeatureCheck[] = FEATURE_CHECKS
): ValidationResult {
  const statuses = getFeatureStatuses(env, checks);
  const disabled = statuses.filter((s) => !s.enabled);
  return {
    ok: disabled.length === 0,
    statuses,
    warnings: disabled.map(formatWarning),
  };
}

type Logger = Pick<Console, "warn" | "info">;

export function logEnvValidation(
  logger: Logger = console,
  env: EnvSource = process.env,
  checks: FeatureCheck[] = FEATURE_CHECKS
): ValidationResult {
  const result = validateEnv(env, checks);

  if (result.warnings.length === 0) {
    logger.info("[env] All feature env vars configured");
    return result;
  }

  for (const warning of result.warnings) {
    logger.warn(warning);
  }
  return result;
}

let hasLogged = false;

export function ensureEnvValidated(
  logger: Logger = console,
  env: EnvSource = process.env
): ValidationResult | undefined {
  if (hasLogged) return undefined;
  hasLogged = true;
  return logEnvValidation(logger, env);
}

export function __resetEnvValidationForTests(): void {
  hasLogged = false;
}
