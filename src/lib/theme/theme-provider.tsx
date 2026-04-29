"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PRESET,
  THEME_PRESET_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyThemeVariables,
  isThemeMode,
  isThemePresetName,
  themePresetNames,
  themePresets,
  type ResolvedThemeMode,
  type ThemeMode,
  type ThemePreset,
  type ThemePresetName,
} from "./theme-config";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedThemeMode;
  themePreset: ThemePresetName;
  setThemePreset: (preset: ThemePresetName) => void;
  availableThemePresets: readonly ThemePreset[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

function readStoredThemePreset(): ThemePresetName | null {
  try {
    const stored = localStorage.getItem(THEME_PRESET_STORAGE_KEY);
    return isThemePresetName(stored) ? stored : null;
  } catch {
    return null;
  }
}

function persistTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors and keep the in-memory theme.
  }
}

function persistThemePreset(preset: ThemePresetName): void {
  try {
    localStorage.setItem(THEME_PRESET_STORAGE_KEY, preset);
  } catch {
    // Ignore storage errors and keep the in-memory preset.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [themePreset, setThemePresetState] =
    useState<ThemePresetName>(DEFAULT_THEME_PRESET);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedTheme = readStoredTheme();
    if (storedTheme) {
      setThemeState(storedTheme);
    }

    const storedPreset = readStoredThemePreset();
    if (storedPreset) {
      setThemePresetState(storedPreset);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (
      currentTheme: ThemeMode,
      currentPreset: ThemePresetName
    ) => {
      const nextResolvedTheme =
        currentTheme === "system"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : currentTheme;

      setResolvedTheme(nextResolvedTheme);
      root.classList.toggle("dark", nextResolvedTheme === "dark");
      applyThemeVariables(root, currentPreset, nextResolvedTheme);
    };

    applyTheme(theme, themePreset);

    const handleMediaChange = () => {
      if (theme === "system") {
        applyTheme("system", themePreset);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [theme, themePreset, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    persistTheme(newTheme);
  };

  const setThemePreset = (newPreset: ThemePresetName) => {
    setThemePresetState(newPreset);
    persistThemePreset(newPreset);
  };

  const availableThemePresets = useMemo(
    () => themePresetNames.map((name) => themePresets[name]),
    []
  );

  const value: ThemeContextType = {
    theme: mounted ? theme : DEFAULT_THEME_MODE,
    setTheme: mounted ? setTheme : () => {},
    resolvedTheme: mounted ? resolvedTheme : "light",
    themePreset: mounted ? themePreset : DEFAULT_THEME_PRESET,
    setThemePreset: mounted ? setThemePreset : () => {},
    availableThemePresets,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
