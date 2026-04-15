import { describe, it, expect } from "vitest";
import { cosineSimilarity, embeddingToBuffer, bufferToEmbedding } from "./embedder";

describe("cosineSimilarity", () => {
  it("should return 1 for identical vectors", () => {
    const a = new Float32Array([1, 2, 3]);
    const b = new Float32Array([1, 2, 3]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
  });

  it("should return 0 for orthogonal vectors", () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([0, 1, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(0.0);
  });

  it("should return -1 for opposite vectors", () => {
    const a = new Float32Array([1, 0, 0]);
    const b = new Float32Array([-1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0);
  });

  it("should handle scaled vectors", () => {
    const a = new Float32Array([1, 2, 3]);
    const b = new Float32Array([2, 4, 6]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
  });

  it("should throw on dimension mismatch", () => {
    const a = new Float32Array([1, 2]);
    const b = new Float32Array([1, 2, 3]);
    expect(() => cosineSimilarity(a, b)).toThrow("dimension mismatch");
  });

  it("should return 0 for zero vectors", () => {
    const a = new Float32Array([0, 0, 0]);
    const b = new Float32Array([1, 2, 3]);
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});

describe("embeddingToBuffer / bufferToEmbedding", () => {
  it("should roundtrip Float32Array through Buffer", () => {
    const original = new Float32Array([0.1, 0.5, -0.3, 1.0]);
    const buf = embeddingToBuffer(original);
    const restored = bufferToEmbedding(buf);

    expect(restored.length).toBe(original.length);
    for (let i = 0; i < original.length; i++) {
      expect(restored[i]).toBeCloseTo(original[i]);
    }
  });

  it("should produce buffer of correct size", () => {
    const arr = new Float32Array([1, 2, 3]);
    const buf = embeddingToBuffer(arr);
    expect(buf.length).toBe(3 * 4); // 3 floats * 4 bytes
  });
});
