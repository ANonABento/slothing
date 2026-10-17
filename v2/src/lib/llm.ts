import { z } from "zod";

import { getKv, getSettings, setKv } from "./db";
import { isLocalEndpoint } from "./format";
import { PROVIDERS, type AiSettings, type Provider } from "./types";

/**
 * Minimal provider-agnostic LLM client. Settings choose the provider and model.
 * API keys come from the environment (v2/.env.local) or Settings (stored in the database, never sent
 * to the browser); an environment variable wins when both are set.
 */

const PROVIDER_INFO: Record<Provider, { label: string; keyEnv: string; modelEnv: string; defaultModel: string; baseEnv?: string; defaultBase: string }> = {
  anthropic: { label: "Anthropic", keyEnv: "ANTHROPIC_API_KEY", modelEnv: "ANTHROPIC_MODEL", defaultModel: "claude-sonnet-5-5", defaultBase: "https://api.anthropic.com/v1" },
  nebius: { label: "Nebius", keyEnv: "NEBIUS_API_KEY", modelEnv: "NEBIUS_MODEL", defaultModel: "moonshotai/Kimi-K3", baseEnv: "NEBIUS_BASE_URL", defaultBase: "https://api.studio.nebius.com/v1" },
  openai: { label: "OpenAI", keyEnv: "OPENAI_API_KEY", modelEnv: "OPENAI_MODEL", defaultModel: "gpt-5", baseEnv: "OPENAI_BASE_URL", defaultBase: "https://api.openai.com/v1" },
};

type Env = Record<string, string | undefined>;

const KEY_KV = (p: Provider) => `apiKey:${p}`;

/** Keys entered in Settings. */
export function storedKeys(): Partial<Record<Provider, string>> {
  return Object.fromEntries(PROVIDERS.map((p) => [p, getKv(KEY_KV(p)) ?? ""]).filter(([, k]) => k));
}

/** "" removes the key. */
export function saveKey(provider: Provider, key: string) {
  setKv(KEY_KV(provider), key.trim());
}

/** The environment with keys from Settings filled in where it has none. */
export function withStoredKeys(env: Env, stored: Partial<Record<Provider, string>>): Env {
  const out = { ...env };
  for (const p of PROVIDERS) if (!out[PROVIDER_INFO[p].keyEnv]?.trim() && stored[p]?.trim()) out[PROVIDER_INFO[p].keyEnv] = stored[p];
  return out;
}

const keyEnv = () => withStoredKeys(process.env, storedKeys());

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
  /** Where the key comes from: the environment wins over Settings. */
  keySource: "env" | "settings" | null;
  /** The key's last 4 characters, so you can tell which one it is. */
  keyHint: string;
  /** What "" in settings falls back to. */
  defaultModel: string;
  defaultBase: string;
}

/** Every provider, whether it has a key, and what its blank settings fall back to. */
export function providerStatus(env: Env = keyEnv(), raw: Env = process.env): ProviderStatus[] {
  return PROVIDERS.map((p) => {
    const i = PROVIDER_INFO[p];
    const key = env[i.keyEnv]?.trim() ?? "";
    return {
      provider: p,
      label: i.label,
      hasKey: !!key,
      keyEnv: i.keyEnv,
      keySource: !key ? null : raw[i.keyEnv]?.trim() ? "env" : "settings",
      keyHint: key.length > 8 ? key.slice(-4) : "",
      defaultModel: env[i.modelEnv]?.trim() || i.defaultModel,
      defaultBase: (i.baseEnv && env[i.baseEnv]?.trim()) || i.defaultBase,
    };
  });
}

/** The OpenAI-compatible endpoint these settings call. */
export const openaiBase = (ai: AiSettings, status: ProviderStatus[]) => ai.openaiBaseUrl.trim() || status.find((s) => s.provider === "openai")!.defaultBase;

/** A provider can be called with a key, or without one when it's a model on this machine. */
export const usable = (s: ProviderStatus, base: string) => s.hasKey || (s.provider === "openai" && isLocalEndpoint(base));

/**
 * The provider to call: the chosen one if it's usable, else the first that is
 * (Anthropic → Nebius → OpenAI), with a warning saying why the choice was skipped.
 */
export function resolveLlm(ai: AiSettings, env: Env = keyEnv()): { config: LlmConfig | null; warning: string | null } {
  const status = providerStatus(env);
  const local = openaiBase(ai, status);
  const ok = (s: ProviderStatus) => usable(s, local);
  const chosen = ai.provider ? status.find((s) => s.provider === ai.provider)! : null;
  const pick = chosen && ok(chosen) ? chosen : status.find(ok);
  const warning = chosen && !ok(chosen) ? `${chosen.label} is selected but has no API key${pick ? `, so ${pick.label} is used instead` : ""}.` : null;
  if (!pick) return { config: null, warning };
  const p = pick.provider;
  const base = p === "openai" ? local : pick.defaultBase;
  const onMachine = p === "openai" && isLocalEndpoint(base);
  const label = p !== "openai" || base === PROVIDER_INFO.openai.defaultBase ? pick.label : onMachine ? "Local" : "OpenAI-compatible";
  return {
    // A local server with no model chosen uses the first one it serves (see complete()).
    config: { provider: p, label, key: env[PROVIDER_INFO[p].keyEnv]?.trim() ?? "", base: base.replace(/\/+$/, ""), model: ai.models[p].trim() || (onMachine ? "" : pick.defaultModel) },
    warning,
  };
}

async function modelsAt(c: LlmConfig): Promise<string[]> {
  const res = await fetch(`${c.base}/models`, { headers: c.key ? { authorization: `Bearer ${c.key}` } : {}, signal: AbortSignal.timeout(5000) }).catch(() => null);
  if (!res?.ok) return [];
  const json = (await res.json().catch(() => null)) as { data?: { id?: string }[] } | null;
  return (json?.data ?? []).map((m) => m.id ?? "").filter(Boolean).slice(0, 200);
}

/** The models an OpenAI-compatible endpoint serves (Ollama, LM Studio and OpenRouter list theirs), for the model field's suggestions. */
export async function listModels(ai: AiSettings): Promise<string[]> {
  const { config } = resolveLlm({ ...ai, provider: "openai" });
  return config?.provider === "openai" ? modelsAt(config) : [];
}

// The model a local server picked when none was chosen, so documents record what wrote them.
let served = "";

const current = () => resolveLlm(getSettings().ai).config;

export function llmInfo(): { provider: string; model: string } | null {
  const c = current();
  return c ? { provider: c.label, model: c.model || served || "first model served" } : null;
}

export function llmConfigured() {
  return current() !== null;
}

const TIMEOUT_MS = 120_000;
// A model on a laptop is slow: give it longer.
const LOCAL_TIMEOUT_MS = 300_000;
const timeoutOf = (c: LlmConfig) => (isLocalEndpoint(c.base) ? LOCAL_TIMEOUT_MS : TIMEOUT_MS);

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
      ? " Check the API key in Settings → AI model."
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

  const model = c.model || (served = (await modelsAt(c))[0] ?? "");
  if (!model) throw new Error(`${c.base} serves no models. Pull one first (ollama pull qwen3.5:4b), or set the model in Settings.`);
  const call = (jsonMode: boolean) =>
    fetch(`${c.base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", ...(c.key ? { authorization: `Bearer ${c.key}` } : {}) },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: AbortSignal.timeout(timeoutOf(c)),
    }).catch((e: Error) => {
      if (e.name === "TimeoutError") throw e;
      throw new Error(`Can't reach ${c.base}.${isLocalEndpoint(c.base) ? " Is the model server (Ollama, LM Studio) running?" : ""}`);
    });
  let res = await call(true);
  // Some servers reject JSON mode (LM Studio wants a schema); the prompt already asks for JSON, so ask again without it.
  if (res.status === 400 && /response_format/i.test(await res.clone().text())) res = await call(false);
  if (!res.ok) throw await providerError(c.label, res);
  const json = (await res.json()) as { choices: { message: { content: string } }[] };
  return json.choices[0]?.message.content ?? "";
}

function extractJSON(text: string): unknown {
  // Reasoning models (Qwen, DeepSeek) served locally can put their thinking, braces and all, before the answer.
  text = text.replace(/<think>[\s\S]*?<\/think>/g, "");
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(body.slice(start, end + 1));
}

/** Ask for JSON matching `schema`; retries once, feeding the validation error back. */
export async function generateJSON<T extends z.ZodTypeAny>(schema: T, system: string, user: string, config: LlmConfig | null = current()): Promise<z.infer<T>> {
  if (!config) throw new Error("No AI provider configured. Add an API key in Settings → AI model.");
  const sys = `${system}\n\nRespond with a single JSON object and nothing else.`;
  let prompt = user;
  for (let attempt = 0; attempt < 2; attempt++) {
    let raw: string;
    try {
      raw = await complete(config, sys, prompt);
    } catch (err) {
      if ((err as Error).name === "TimeoutError") throw new Error(`The model didn't answer within ${timeoutOf(config) / 1000}s. Try again.`);
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
  if (!config) throw new Error(warning ?? "No AI provider has a key. Add one in Settings → AI model.");
  const t = Date.now();
  await generateJSON(z.object({ ok: z.literal(true) }), 'Connection check. Reply with exactly {"ok": true}.', "ping", config);
  return { provider: config.label, model: config.model, ms: Date.now() - t };
}
