import { themeTokensToCssVariables } from "./apply";
import { ALL_THEMES, DEFAULT_THEME_ID } from "./registry";
import { THEME_DARK_STORAGE_KEY, THEME_STORAGE_KEY } from "./storage-keys";

const cssVariablesByTheme = Object.fromEntries(
  ALL_THEMES.map((theme) => [
    theme.id,
    {
      light: themeTokensToCssVariables(theme.light),
      dark: themeTokensToCssVariables(theme.dark),
    },
  ]),
);

export function getThemePreloadScript(): string {
  return `
(() => {
  try {
    const themes = ${JSON.stringify(cssVariablesByTheme)};
    const defaultThemeId = ${JSON.stringify(DEFAULT_THEME_ID)};
    const themeKey = ${JSON.stringify(THEME_STORAGE_KEY)};
    const darkKey = ${JSON.stringify(THEME_DARK_STORAGE_KEY)};
    const root = document.documentElement;
    const storedTheme = localStorage.getItem(themeKey);
    const themeId = Object.prototype.hasOwnProperty.call(themes, storedTheme)
      ? storedTheme
      : defaultThemeId;
    const storedDark = localStorage.getItem(darkKey);
    const isDark = storedDark === null
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : storedDark === "true";
    const variables = themes[themeId][isDark ? "dark" : "light"];

    root.dataset.themePreset = themeId;
    root.dataset.themeMode = isDark ? "dark" : "light";
    root.classList.toggle("dark", isDark);

    for (const name in variables) {
      root.style.setProperty(name, variables[name]);
    }
  } catch {
  }
})();
`.trim();
}
