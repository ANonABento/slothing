import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SettingsLLMPage from "./page";

vi.mock("@/components/settings/llm/bentorouter-settings-section", () => ({
  BentoRouterSettingsSection: () => (
    <section data-testid="bentorouter-settings-section" />
  ),
}));

vi.mock("@/components/settings/prompt-variants-section", () => ({
  PromptVariantsSection: () => (
    <section data-testid="prompt-variants-section" />
  ),
}));

describe("SettingsLLMPage", () => {
  it("renders the BentoRouter settings surface at /settings/llm", () => {
    render(<SettingsLLMPage />);

    expect(
      screen.getByRole("heading", { name: "AI providers" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("bentorouter-settings-section")).toBeVisible();
    expect(screen.getByTestId("prompt-variants-section")).toBeVisible();
  });
});
