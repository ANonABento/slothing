import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  THEME_PRESET_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyThemeVariables,
  getThemePreset,
  getThemeVariables,
  themePresetNames,
} from "./theme-config";
import { ThemeProvider, useTheme } from "./theme-provider";

function resetRootThemeState() {
  document.documentElement.className = "";
  document.documentElement.removeAttribute("data-theme-preset");
  document.documentElement.removeAttribute("data-theme-mode");
  document.documentElement.removeAttribute("style");
}

function mockSystemTheme(matchesDark: boolean) {
  vi.mocked(window.matchMedia).mockImplementation((query) => ({
    matches: matchesDark,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function ThemeProbe() {
  const { theme, resolvedTheme, themePreset, setThemePreset, availableThemePresets } =
    useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="theme-preset">{themePreset}</span>
      <span data-testid="preset-count">{availableThemePresets.length}</span>
      <button type="button" onClick={() => setThemePreset("bold")}>
        Use bold
      </button>
    </div>
  );
}

describe("theme config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRootThemeState();
    mockSystemTheme(false);
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);
  });

  it("falls back to the default preset for unknown preset names", () => {
    expect(getThemePreset("missing").name).toBe("default");
    expect(getThemePreset("bold").name).toBe("bold");
  });

  it("returns CSS custom properties for a preset and color mode", () => {
    const variables = getThemeVariables("bold", "light");

    expect(variables["--primary"]).toBe("246 100% 45%");
    expect(variables["--border-width"]).toBe("2px");
    expect(variables["--font-sans"]).toContain("Aptos");
  });

  it("applies theme variables and metadata to an element", () => {
    applyThemeVariables(document.documentElement, "glassmorphism", "dark");

    expect(document.documentElement.dataset.themePreset).toBe("glassmorphism");
    expect(document.documentElement.dataset.themeMode).toBe("dark");
    expect(document.documentElement.style.getPropertyValue("--backdrop-blur")).toBe(
      "28px"
    );
  });

  it("loads stored theme mode and theme preset in the provider", async () => {
    vi.mocked(window.localStorage.getItem).mockImplementation((key) => {
      if (key === THEME_STORAGE_KEY) return "dark";
      if (key === THEME_PRESET_STORAGE_KEY) return "minimal";
      return null;
    });

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
      expect(screen.getByTestId("theme-preset")).toHaveTextContent("minimal");
    });

    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.dataset.themePreset).toBe("minimal");
    expect(screen.getByTestId("preset-count")).toHaveTextContent(
      String(themePresetNames.length)
    );
  });

  it("persists and applies preset changes from the provider", async () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.dataset.themePreset).toBe("default");
    });

    await act(async () => {
      screen.getByRole("button", { name: "Use bold" }).click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("theme-preset")).toHaveTextContent("bold");
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      THEME_PRESET_STORAGE_KEY,
      "bold"
    );
    expect(document.documentElement.dataset.themePreset).toBe("bold");
    expect(document.documentElement.style.getPropertyValue("--border-width")).toBe(
      "2px"
    );
  });
});
