import type { z } from "zod";

/**
 * Minimal provider-agnostic LLM client. Anthropic if ANTHROPIC_API_KEY is set,
 * otherwise any OpenAI-compatible endpoint.
 */

export function llmConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
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
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { content: { type: string; text?: string }[] };
    return json.content.map((c) => c.text ?? "").join("");
  }

  if (process.env.OPENAI_API_KEY) {
    const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return json.choices[0]?.message.content ?? "";
  }

  throw new Error("No LLM configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in v2/.env.local.");
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
    const raw = await complete(sys, prompt);
    try {
      return schema.parse(extractJSON(raw));
    } catch (err) {
      if (attempt === 1) throw err;
      prompt = `${user}\n\nYour previous reply was invalid (${(err as Error).message.slice(0, 500)}). Return corrected JSON only.`;
    }
  }
  throw new Error("unreachable");
}
