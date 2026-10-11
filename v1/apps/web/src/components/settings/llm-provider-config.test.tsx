import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LLMConfig } from "@/types";
import { LLMProviderConfig } from "./llm-provider-config";
import { PROVIDERS, type ProviderOption } from "./llm-provider-selector";

const baseProps = {
  models: ["gpt-4o-mini"],
  saving: false,
  testing: false,
  hasChanges: false,
  testResult: null,
  onConfigChange: vi.fn(),
  onSave: vi.fn(),
  onTestConnection: vi.fn(),
};

function getProvider(value: LLMConfig["provider"]): ProviderOption {
  const provider = PROVIDERS.find((option) => option.value === value);
  if (!provider) throw new Error(`Missing provider ${value}`);
  return provider;
}

describe("LLMProviderConfig", () => {
  it("associates the API key and model controls with labels", () => {
    render(
      <LLMProviderConfig
        {...baseProps}
        selectedProvider={getProvider("openai")}
        config={{
          provider: "openai",
          apiKey: "",
          model: "gpt-4o-mini",
        }}
      />,
    );

    expect(screen.getByLabelText("API Key")).toBeInTheDocument();
    expect(screen.getByLabelText("Model")).toBeInTheDocument();
  });

  it("associates the Ollama URL control with its label", () => {
    render(
      <LLMProviderConfig
        {...baseProps}
        selectedProvider={getProvider("ollama")}
        config={{
          provider: "ollama",
          baseUrl: "http://localhost:11434",
          model: "llama3",
        }}
      />,
    );

    expect(screen.getByLabelText("Ollama URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Model")).toBeInTheDocument();
  });
});
