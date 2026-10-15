import type { Appearance } from "./types";

/** Fired on <html> theme changes so every toggle stays in sync. */
export const THEME_EVENT = "slothing:theme";
/** Fired when the sidebar toggle has saved a new mode, so an open settings page can catch up. */
export const MODE_SAVED_EVENT = "slothing:mode-saved";

/** Apply an appearance to <html> right away (preview while editing, or after the toggle). */
export function applyAppearance(a: Appearance) {
  const h = document.documentElement;
  h.dataset.mode = a.mode;
  h.dataset.light = a.light;
  h.dataset.dark = a.dark;
  const dark = a.mode === "dark" || (a.mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  h.dataset.theme = dark ? a.dark : a.light;
  window.dispatchEvent(new Event(THEME_EVENT));
}
