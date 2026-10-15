/** The settings pages, in sidebar order. Shared by the server routes and the client editor. */
export const SETTINGS_SECTIONS = [
  { id: "ai", label: "AI model" },
  { id: "tailoring", label: "Tailoring" },
  { id: "layout", label: "Resume layout" },
  { id: "letter", label: "Cover letter" },
] as const;
export type SettingsSection = (typeof SETTINGS_SECTIONS)[number]["id"];

export const isSettingsSection = (s: string): s is SettingsSection => SETTINGS_SECTIONS.some((x) => x.id === s);

/** Only same-app paths, so a crafted ?back= can't send you off-site. */
export const safeBack = (back: string | null | undefined) => (back && back.startsWith("/") && !back.startsWith("//") ? back : null);

/** Link to one settings page; `back` adds a "back to …" arrow to the settings header. */
export const settingsHref = (section: SettingsSection, back?: string) =>
  `/settings/${section}${back ? `?back=${encodeURIComponent(back)}` : ""}`;
