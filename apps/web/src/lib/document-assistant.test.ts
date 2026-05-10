import { describe, expect, it } from "vitest";
import {
  applySelectionRewrite,
  buildDocumentAssistantRequestPayload,
  buildDocumentRewritePrompt,
  buildSimpleDiff,
  getDocumentSuggestions,
  isDocumentAssistantAction,
  isMissingLLMSetupError,
  normalizeSelection,
  parseLLMStatusResponse,
  stripDocumentHtml,
} from "./document-assistant";

describe("document assistant helpers", () => {
  it("recognizes supported assistant actions", () => {
    expect(isDocumentAssistantAction("rewrite")).toBe(true);
    expect(isDocumentAssistantAction("make-concise")).toBe(true);
    expect(isDocumentAssistantAction("unknown")).toBe(false);
  });

  it("normalizes a valid text selection", () => {
    expect(normalizeSelection("Hello world", { start: 6, end: 11 })).toEqual({
      start: 6,
      end: 11,
      text: "world",
    });
  });

  it("normalizes reversed selections", () => {
    expect(normalizeSelection("Hello world", { start: 11, end: 6 })).toEqual({
      start: 6,
      end: 11,
      text: "world",
    });
  });

  it("returns null for collapsed selections", () => {
    expect(normalizeSelection("Hello", { start: 2, end: 2 })).toBeNull();
  });

  it("returns null for non-finite selection ranges", () => {
    expect(
      normalizeSelection("Hello", { start: Number.NaN, end: 4 }),
    ).toBeNull();
    expect(normalizeSelection("Hello", { start: 1, end: Infinity })).toBeNull();
  });

  it("applies replacement text to the selected range", () => {
    expect(
      applySelectionRewrite(
        "I built APIs quickly.",
        { start: 8, end: 12 },
        "reliable APIs",
      ),
    ).toBe("I built reliable APIs quickly.");
  });

  it("preserves replacement text exactly when applying a rewrite", () => {
    expect(
      applySelectionRewrite(
        "Hello world",
        { start: 6, end: 11 },
        "focused work",
      ),
    ).toBe("Hello focused work");
  });

  it("returns a compact before and after diff", () => {
    expect(buildSimpleDiff("old text", "new text")).toEqual([
      { type: "removed", value: "old text" },
      { type: "added", value: "new text" },
    ]);
  });

  it("returns document-aware suggestions when content exists", () => {
    const suggestions = getDocumentSuggestions(
      "I led a migration and improved developer workflows.",
      "We need React, migration, and developer productivity experience.",
    );
    expect(suggestions).toContain(
      "Select relevant experience and match JD keywords.",
    );
    expect(suggestions).toHaveLength(3);
  });

  it("prompts users to add content when the document is empty", () => {
    expect(getDocumentSuggestions("", "")).toEqual([
      "Generate or paste document content to get assistant suggestions.",
    ]);
  });

  it("strips document HTML into assistant-readable text", () => {
    expect(
      stripDocumentHtml(
        "<style>.x{}</style><p>Built&nbsp;APIs &amp; dashboards.</p>",
      ),
    ).toBe("Built APIs & dashboards.");
  });

  it("parses LLM status responses defensively", () => {
    expect(
      parseLLMStatusResponse({ configured: true, provider: "openai" }),
    ).toEqual({
      configured: true,
      provider: "openai",
    });
    expect(
      parseLLMStatusResponse({ configured: "yes", provider: 123 }),
    ).toEqual({
      configured: false,
      provider: null,
    });
    expect(parseLLMStatusResponse(null)).toEqual({
      configured: false,
      provider: null,
    });
  });

  it("recognizes missing LLM setup errors", () => {
    expect(
      isMissingLLMSetupError(
        "No LLM provider configured. Go to Settings to set one up.",
      ),
    ).toBe(true);
    expect(isMissingLLMSetupError("OpenAI API key is missing")).toBe(true);
    expect(isMissingLLMSetupError("Failed to rewrite selected text")).toBe(
      false,
    );
  });

  it("builds assistant request payloads with trimmed optional context", () => {
    expect(
      buildDocumentAssistantRequestPayload({
        action: "match-jd-keywords",
        selectedText: "  Built dashboards.  ",
        documentContent: "<p>Built dashboards.</p>",
        jobDescription: "  React role  ",
      }),
    ).toEqual({
      action: "match-jd-keywords",
      selectedText: "Built dashboards.",
      documentContent: "<p>Built dashboards.</p>",
      jobDescription: "React role",
    });
  });

  it("builds rewrite prompts with action and job context", () => {
    const prompt = buildDocumentRewritePrompt({
      action: "match-jd-keywords",
      selectedText: "I built a dashboard.",
      documentContent: "I built a dashboard for sales teams.",
      jobDescription: "The role needs analytics dashboard experience.",
    });

    expect(prompt).toContain("Selected text:");
    expect(prompt).toContain("I built a dashboard.");
    expect(prompt).toContain("Job description:");
    expect(prompt).toContain("analytics dashboard");
  });
});
