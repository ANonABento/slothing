"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { THEME_CHANGE_EVENT, applyThemePreference, readThemePreference } from "@/lib/theme/theme-presets";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(): Theme | null {
  try {
    return localStorage.getItem("theme") as Theme | null;
  } catch {
    return null;
  }
}

function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore storage errors and keep the in-memory theme.
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readStoredTheme();
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (t: Theme) => {
      let resolved: "light" | "dark";

      if (t === "system") {
        resolved = mediaQuery.matches ? "dark" : "light";
      } else {
        resolved = t;
      }

      setResolvedTheme(resolved);

      if (resolved === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);

    // Listen for system theme changes
    const handleMediaChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const applyStoredThemePreference = () => {
      try {
        applyThemePreference(document.documentElement, readThemePreference());
      } catch {
        // Keep the base theme usable when storage is blocked or malformed.
      }
    };

    applyStoredThemePreference();
    window.addEventListener(THEME_CHANGE_EVENT, applyStoredThemePreference);
    window.addEventListener("storage", applyStoredThemePreference);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, applyStoredThemePreference);
      window.removeEventListener("storage", applyStoredThemePreference);
    };
  }, [mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    persistTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "system", setTheme: () => {}, resolvedTheme: "light" }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
