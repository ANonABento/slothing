import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LLMClient, parseJSONFromLLM } from "./client";

describe("parseJSONFromLLM", () => {
  it("should parse plain JSON object", () => {
    const input = '{"name": "John", "age": 30}';
    const result = parseJSONFromLLM<{ name: string; age: number }>(input);
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should parse plain JSON array", () => {
    const input = "[1, 2, 3]";
    const result = parseJSONFromLLM<number[]>(input);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle ```json code blocks", () => {
    const input = '```json\n{"name": "John"}\n```';
    const result = parseJSONFromLLM<{ name: string }>(input);
    expect(result).toEqual({ name: "John" });
  });

  it("should handle ``` code blocks without json specifier", () => {
    const input = '```\n{"name": "John"}\n```';
    const result = parseJSONFromLLM<{ name: string }>(input);
    expect(result).toEqual({ name: "John" });
  });

  it("should handle text before JSON", () => {
    const input = 'Here is the JSON: {"name": "John"}';
    const result = parseJSONFromLLM<{ name: string }>(input);
    expect(result).toEqual({ name: "John" });
  });

  it("should handle text after JSON", () => {
    const input = '{"name": "John"} That is the result.';
    const result = parseJSONFromLLM<{ name: string }>(input);
    expect(result).toEqual({ name: "John" });
  });

  it("should handle nested objects", () => {
    const input = '{"user": {"name": "John", "address": {"city": "NYC"}}}';
    const result = parseJSONFromLLM<{
      user: { name: string; address: { city: string } };
    }>(input);
    expect(result).toEqual({
      user: { name: "John", address: { city: "NYC" } },
    });
  });

  it("should handle strings with quotes", () => {
    const input = '{"message": "He said \\"hello\\""}';
    const result = parseJSONFromLLM<{ message: string }>(input);
    expect(result).toEqual({ message: 'He said "hello"' });
  });

  it("should handle strings with brackets", () => {
    const input = '{"code": "function() { return {}; }"}';
    const result = parseJSONFromLLM<{ code: string }>(input);
    expect(result).toEqual({ code: "function() { return {}; }" });
  });

  it("should handle arrays of objects", () => {
    const input = '[{"name": "John"}, {"name": "Jane"}]';
    const result = parseJSONFromLLM<{ name: string }[]>(input);
    expect(result).toEqual([{ name: "John" }, { name: "Jane" }]);
  });

  it("should handle whitespace", () => {
    const input = `
      {
        "name": "John",
        "age": 30
      }
    `;
    const result = parseJSONFromLLM<{ name: string; age: number }>(input);
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should handle complex LLM response format", () => {
    const input = `
Based on your request, here is the analysis:

\`\`\`json
{
  "skills": ["JavaScript", "React"],
  "score": 85
}
\`\`\`

I hope this helps!
    `;
    const result = parseJSONFromLLM<{ skills: string[]; score: number }>(input);
    expect(result).toEqual({ skills: ["JavaScript", "React"], score: 85 });
  });

  it("should throw on invalid JSON", () => {
    const input = "not valid json";
    expect(() => parseJSONFromLLM(input)).toThrow();
  });
});

describe("LLMClient OpenAI endpoint resolution", () => {
  const originalOpenAIBaseUrl = process.env.OPENAI_BASE_URL;

  beforeEach(() => {
    delete process.env.OPENAI_BASE_URL;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalOpenAIBaseUrl === undefined) {
      delete process.env.OPENAI_BASE_URL;
    } else {
      process.env.OPENAI_BASE_URL = originalOpenAIBaseUrl;
    }
    vi.unstubAllGlobals();
  });

  it("defaults OpenAI calls to api.openai.com", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json({ choices: [{ message: { content: "ok" } }] }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const client = new LLMClient({
      provider: "openai",
      apiKey: "sk-test",
      model: "gpt-4o-mini",
    });

    await expect(
      client.complete({
        messages: [{ role: "user", content: "hello" }],
      }),
    ).resolves.toBe("ok");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("uses OPENAI_BASE_URL for OpenAI-compatible local endpoints", async () => {
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:4141/v1/";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json({ choices: [{ message: { content: "choomfie ok" } }] }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const client = new LLMClient({
      provider: "openai",
      apiKey: "sk-choomfie-slothing-test",
      model: "choomfie-claude-sonnet",
    });

    await expect(
      client.complete({
        messages: [{ role: "user", content: "hello" }],
      }),
    ).resolves.toBe("choomfie ok");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:4141/v1/chat/completions",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer sk-choomfie-slothing-test",
        }),
      }),
    );
  });
});
