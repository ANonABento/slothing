import { z } from "zod";

import { getSettings } from "./db";
import { PROVIDERS, type AiSettings, type Provider } from "./types";

/**
 * Minimal provider-agnostic LLM client. Settings choose the provider and model;
 * API keys only ever come from the environment (v2/.env.local).
 */

const PROVIDER_INFO: Record<Provider, { label: string; keyEnv: string; modelEnv: string; defaultModel: string; baseEnv?: string; defaultBase: string }> = {
  anthropic: { label: "Anthropic", keyEnv: "ANTHROPIC_API_KEY", modelEnv: "ANTHROPIC_MODEL", defaultModel: "claude-sonnet-5-5", defaultBase: "https://api.anthropic.com/v1" },
  nebius: { label: "Nebius", keyEnv: "NEBIUS_API_KEY", modelEnv: "NEBIUS_MODEL", defaultModel: "moonshotai/Kimi-K3", baseEnv: "NEBIUS_BASE_URL", defaultBase: "https://api.studio.nebius.com/v1" },
  openai: { label: "OpenAI", keyEnv: "OPENAI_API_KEY", modelEnv: "OPENAI_MODEL", defaultModel: "gpt-5", baseEnv: "OPENAI_BASE_URL", defaultBase: "https://api.openai.com/v1" },
};

type Env = Record<string, string | undefined>;

export interface LlmConfig {
  provider: Provider;
  label: string;
  key: string;
  base: string;
  model: string;
}

export interface ProviderStatus {
  provider: Provider;
  label: string;
  hasKey: boolean;
  keyEnv: string;
  /** What "" in settings falls back to. */
  defaultModel: string;
  defaultBase: string;
}

/** Every provider, whether it has a key, and what its blank settings fall back to. */
export function providerStatus(env: Env = process.env): ProviderStatus[] {
  return PROVIDERS.map((p) => {
    const i = PROVIDER_INFO[p];
    return {
      provider: p,
      label: i.label,
      hasKey: !!env[i.keyEnv]?.trim(),
      keyEnv: i.keyEnv,
      defaultModel: env[i.modelEnv]?.trim() || i.defaultModel,
      defaultBase: (i.baseEnv && env[i.baseEnv]?.trim()) || i.defaultBase,
    };
  });
}

/**
 * The provider to call: the chosen one if it has a key, else the first with a key
 * (Anthropic → Nebius → OpenAI), with a warning saying why the choice was skipped.
 */
export function resolveLlm(ai: AiSettings, env: Env = process.env): { config: LlmConfig | null; warning: string | null } {
  const status = providerStatus(env);
  const chosen = ai.provider ? status.find((s) => s.provider === ai.provider)! : null;
  const pick = chosen?.hasKey ? chosen : status.find((s) => s.hasKey);
  const warning = chosen && !chosen.hasKey ? `${chosen.label} is selected but ${chosen.keyEnv} isn't set${pick ? `, so ${pick.label} is used instead` : ""}.` : null;
  if (!pick) return { config: null, warning };
  const p = pick.provider;
  const base = p === "openai" && ai.openaiBaseUrl.trim() ? ai.openaiBaseUrl.trim() : pick.defaultBase;
  const label = p === "openai" && base !== PROVIDER_INFO.openai.defaultBase ? "OpenAI-compatible" : pick.label;
  return {
    config: { provider: p, label, key: env[PROVIDER_INFO[p].keyEnv]!.trim(), base: base.replace(/\/+$/, ""), model: ai.models[p].trim() || pick.defaultModel },
    warning,
  };
}

const current = () => resolveLlm(getSettings().ai).config;

export function llmInfo(): { provider: string; model: string } | null {
  const c = current();
  return c ? { provider: c.label, model: c.model } : null;
}

export function llmConfigured() {
  return current() !== null;
}

const TIMEOUT_MS = 120_000;

/** Pull a short human-readable message out of a provider error body instead of dumping it raw. */
async function providerError(provider: string, res: Response): Promise<Error> {
  const body = await res.text();
  let msg = body;
  try {
    const j = JSON.parse(body);
    msg = j?.error?.message ?? j?.message ?? j?.detail ?? body;
  } catch {}
  const hint =
    res.status === 401 || res.status === 403
      ? " Check the API key in v2/.env.local."
      : res.status === 429
        ? " Rate limited or out of credits."
        : res.status === 404 || /model/i.test(String(msg))
          ? " Check the model id in Settings."
          : "";
  return new Error(`${provider} error ${res.status}: ${String(msg).slice(0, 200)}${hint}`);
}

async function complete(c: LlmConfig, system: string, user: string): Promise<string> {
  if (c.provider === "anthropic") {
    const res = await fetch(`${c.base}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": c.key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: c.model, max_tokens: 8000, system, messages: [{ role: "user", content: user }] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw await providerError(c.label, res);
    const json = (await res.json()) as { content: { type: string; text?: string }[] };
    return json.content.map((x) => x.text ?? "").join("");
  }

  const res = await fetch(`${c.base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${c.key}` },
    body: JSON.stringify({
      model: c.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw await providerError(c.label, res);
  const json = (await res.json()) as { choices: { message: { content: string } }[] };
  return json.choices[0]?.message.content ?? "";
}

function extractJSON(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(body.slice(start, end + 1));
}

/** Ask for JSON matching `schema`; retries once, feeding the validation error back. */
export async function generateJSON<T extends z.ZodTypeAny>(schema: T, system: string, user: string, config: LlmConfig | null = current()): Promise<z.infer<T>> {
  if (!config) throw new Error("No AI provider configured. Set ANTHROPIC_API_KEY, NEBIUS_API_KEY or OPENAI_API_KEY in v2/.env.local.");
  const sys = `${system}\n\nRespond with a single JSON object and nothing else.`;
  let prompt = user;
  for (let attempt = 0; attempt < 2; attempt++) {
    let raw: string;
    try {
      raw = await complete(config, sys, prompt);
    } catch (err) {
      if ((err as Error).name === "TimeoutError") throw new Error(`The model didn't answer within ${TIMEOUT_MS / 1000}s. Try again.`);
      throw err;
    }
    try {
      return schema.parse(extractJSON(raw));
    } catch (err) {
      if (attempt === 1) throw new Error("The model returned an unexpected format twice. Try again, or switch models in Settings.");
      prompt = `${user}\n\nYour previous reply was invalid (${(err as Error).message.slice(0, 500)}). Return corrected JSON only.`;
    }
  }
  throw new Error("unreachable");
}

/** Send a tiny request with these (possibly unsaved) settings. */
export async function testLlm(ai: AiSettings): Promise<{ provider: string; model: string; ms: number }> {
  const { config, warning } = resolveLlm(ai);
  if (!config) throw new Error(warning ?? "No AI provider has a key. Add one to v2/.env.local.");
  const t = Date.now();
  await generateJSON(z.object({ ok: z.literal(true) }), 'Connection check. Reply with exactly {"ok": true}.', "ping", config);
  return { provider: config.label, model: config.model, ms: Date.now() - t };
}
