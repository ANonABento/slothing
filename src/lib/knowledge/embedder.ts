import { getLLMConfig } from "@/lib/db";

const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

function getOpenAIKey(): string | null {
  const config = getLLMConfig();
  if (config?.provider === "openai" && config.apiKey) {
    return config.apiKey;
  }
  return process.env.OPENAI_API_KEY ?? null;
}

function float32ArrayToBuffer(arr: Float32Array): Buffer {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
}

function arrayToFloat32Array(arr: number[]): Float32Array {
  return new Float32Array(arr);
}

export async function embedText(text: string): Promise<Float32Array | null> {
  const result = await embedBatch([text]);
  return result ? result[0] : null;
}

export async function embedBatch(texts: string[]): Promise<Float32Array[] | null> {
  if (texts.length === 0) return [];

  const apiKey = getOpenAIKey();
  if (!apiKey) {
    console.warn("[embedder] No OpenAI API key configured, skipping embeddings");
    return null;
  }

  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[embedder] OpenAI embeddings API error:", error);
    return null;
  }

  const data = await response.json() as {
    data: Array<{ embedding: number[]; index: number }>;
  };

  // Sort by index to maintain order
  const sorted = data.data.sort((a, b) => a.index - b.index);
  return sorted.map((item) => arrayToFloat32Array(item.embedding));
}

export function embeddingToBuffer(embedding: Float32Array): Buffer {
  return float32ArrayToBuffer(embedding);
}

export function bufferToEmbedding(buf: Buffer): Float32Array {
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / Float32Array.BYTES_PER_ELEMENT);
}

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    throw new Error(`Embedding dimension mismatch: ${a.length} vs ${b.length}`);
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

export { EMBEDDING_DIMENSIONS };
