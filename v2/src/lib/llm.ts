import type { z } from "zod";

/**
 * Minimal provider-agnostic LLM client. First configured wins:
 * Anthropic → Nebius (OpenAI-compatible) → any OpenAI-compatible endpoint.
 */

type OpenAICompat = { provider: string; key: string; base: string; model: string };

function openAICompat(): OpenAICompat | null {
  if (process.env.NEBIUS_API_KEY) {
    return {
      provider: "Nebius",
      key: process.env.NEBIUS_API_KEY,
      base: process.env.NEBIUS_BASE_URL || "https://api.studio.nebius.com/v1",
      model: process.env.NEBIUS_MODEL || "moonshotai/Kimi-K3",
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: process.env.OPENAI_BASE_URL ? "OpenAI-compatible" : "OpenAI",
      key: process.env.OPENAI_API_KEY,
      base: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL || "gpt-5",
    };
  }
  return null;
}

export function llmInfo(): { provider: string; model: string } | null {
  if (process.env.ANTHROPIC_API_KEY) return { provider: "Anthropic", model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5" };
  const c = openAICompat();
  return c ? { provider: c.provider, model: c.model } : null;
}

export function llmConfigured() {
  return llmInfo() !== null;
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
  const hint = res.status === 401 || res.status === 403 ? " Check the API key in v2/.env.local." : res.status === 429 ? " Rate limited or out of credits." : "";
  return new Error(`${provider} error ${res.status}: ${String(msg).slice(0, 200)}${hint}`);
}

async function complete(system: string, user: string): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 8000,
        system,
        messages: [{ role: "user", content: user }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw await providerError("Anthropic", res);
    const json = (await res.json()) as { content: { type: string; text?: string }[] };
    return json.content.map((c) => c.text ?? "").join("");
  }

  const c = openAICompat();
  if (c) {
    const res = await fetch(`${c.base.replace(/\/+$/, "")}/chat/completions`, {
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
    if (!res.ok) throw await providerError(c.provider, res);
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return json.choices[0]?.message.content ?? "";
  }

  throw new Error("No LLM configured. Set ANTHROPIC_API_KEY, NEBIUS_API_KEY or OPENAI_API_KEY in v2/.env.local.");
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
export async function generateJSON<T extends z.ZodTypeAny>(schema: T, system: string, user: string): Promise<z.infer<T>> {
  const sys = `${system}\n\nRespond with a single JSON object and nothing else.`;
  let prompt = user;
  for (let attempt = 0; attempt < 2; attempt++) {
    let raw: string;
    try {
      raw = await complete(sys, prompt);
    } catch (err) {
      if ((err as Error).name === "TimeoutError") throw new Error(`The model didn't answer within ${TIMEOUT_MS / 1000}s. Try again.`);
      throw err;
    }
    try {
      return schema.parse(extractJSON(raw));
    } catch (err) {
      if (attempt === 1) throw new Error("The model returned an unexpected format twice. Try again, or switch models.");
      prompt = `${user}\n\nYour previous reply was invalid (${(err as Error).message.slice(0, 500)}). Return corrected JSON only.`;
    }
  }
  throw new Error("unreachable");
}
