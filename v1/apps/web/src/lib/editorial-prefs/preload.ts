import { EDITORIAL_PREFS_STORAGE_KEY } from "./types";

export const editorialPrefsPreloadScript = `(() => {
  try {
    const key = ${JSON.stringify(EDITORIAL_PREFS_STORAGE_KEY)};
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};
    const accent = ["rust","olive","plum","coral","indigo","ink"].includes(parsed.accent) ? parsed.accent : "rust";
    const display = ["outfit","space","jakarta","inter","dm"].includes(parsed.display) ? parsed.display : "outfit";
    const body = ["geist","inter","plex","atkinson","source","dm","jakarta","system"].includes(parsed.body) ? parsed.body : "geist";
    const radius = ["sharp","soft","round"].includes(parsed.radius) ? parsed.radius : "sharp";
    const density = ["comfy","compact"].includes(parsed.density) ? parsed.density : "comfy";
    const ink = ["black","midnight","espresso"].includes(parsed.ink) ? parsed.ink : "midnight";
    const root = document.documentElement;
    root.setAttribute("data-accent", accent);
    root.setAttribute("data-display", display);
    root.setAttribute("data-body", body);
    root.setAttribute("data-radius", radius);
    root.setAttribute("data-density", density);
    root.setAttribute("data-ink", ink);
  } catch (_) {}
})();`;
