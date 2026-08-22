/**
 * Studio's browser-local preferences: how the document list is shown, and what a newly
 * created document should look like.
 *
 * Browser-local rather than server-persisted, deliberately. None of this is content — it
 * is how one person likes their own list arranged — so it does not deserve a table, a
 * migration, or a network round trip before the list can paint.
 *
 * Keys use the legacy `taida:` prefix per CLAUDE.md. Do not rebrand them.
 */
import {
  DEFAULT_SETTINGS,
  settingsSchema,
  type DocumentSettings,
} from "@/lib/latex/settings";

export const STUDIO_VIEW_KEY = "taida:studio:view";
export const STUDIO_SORT_KEY = "taida:studio:sort";
export const STUDIO_DEFAULTS_KEY = "taida:studio:defaults";

export type StudioView = "list" | "grid";
export type StudioSort = "recent" | "title" | "kind";

export const STUDIO_SORTS: ReadonlyArray<{
  value: StudioSort;
  label: string;
}> = [
  { value: "recent", label: "Last edited" },
  { value: "title", label: "Name" },
  { value: "kind", label: "Type" },
];

/**
 * The subset of document settings that a *default* can meaningfully set.
 *
 * `columns`, `accent`, and `sectionskip` are deliberately excluded: they are per-document
 * design choices that belong in the document's own inspector, and offering them here would
 * imply the list can restyle documents that already exist. It cannot — these apply only at
 * creation.
 */
export type StudioDocumentDefaults = Pick<
  DocumentSettings,
  "font" | "fontsize" | "margin"
>;

export const DEFAULT_DOCUMENT_DEFAULTS: StudioDocumentDefaults = {
  font: DEFAULT_SETTINGS.font,
  fontsize: DEFAULT_SETTINGS.fontsize,
  margin: DEFAULT_SETTINGS.margin,
};

/**
 * Every read is guarded: localStorage throws outright in some privacy modes, and a page
 * that cannot render its own document list because a preference was unreadable is a far
 * worse failure than quietly using the default.
 */
function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Full quota or a blocked store. A lost preference is not worth an error surface.
  }
}

export function readStudioView(): StudioView {
  return readRaw(STUDIO_VIEW_KEY) === "grid" ? "grid" : "list";
}

export function writeStudioView(view: StudioView): void {
  writeRaw(STUDIO_VIEW_KEY, view);
}

export function readStudioSort(): StudioSort {
  const raw = readRaw(STUDIO_SORT_KEY);
  return raw === "title" || raw === "kind" ? raw : "recent";
}

export function writeStudioSort(sort: StudioSort): void {
  writeRaw(STUDIO_SORT_KEY, sort);
}

/**
 * Stored defaults, validated field by field against the real settings schema.
 *
 * Per-field rather than all-or-nothing: a blob written by an older build might carry a
 * font we still accept alongside a margin we no longer do, and discarding the whole thing
 * would silently reset a preference the user did set.
 */
export function readStudioDefaults(): StudioDocumentDefaults {
  const raw = readRaw(STUDIO_DEFAULTS_KEY);
  if (!raw) return DEFAULT_DOCUMENT_DEFAULTS;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return DEFAULT_DOCUMENT_DEFAULTS;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return DEFAULT_DOCUMENT_DEFAULTS;
  }

  const candidate = parsed as Partial<Record<string, unknown>>;
  const shape = settingsSchema.shape;
  const pick = <K extends keyof StudioDocumentDefaults>(
    key: K,
  ): StudioDocumentDefaults[K] => {
    const result = shape[key].safeParse(candidate[key]);
    return result.success
      ? (result.data as StudioDocumentDefaults[K])
      : DEFAULT_DOCUMENT_DEFAULTS[key];
  };

  return {
    font: pick("font"),
    fontsize: pick("fontsize"),
    margin: pick("margin"),
  };
}

export function writeStudioDefaults(defaults: StudioDocumentDefaults): void {
  writeRaw(STUDIO_DEFAULTS_KEY, JSON.stringify(defaults));
}

/** True when the user has moved a default off the built-in value. */
export function hasCustomDefaults(defaults: StudioDocumentDefaults): boolean {
  return (
    defaults.font !== DEFAULT_DOCUMENT_DEFAULTS.font ||
    defaults.fontsize !== DEFAULT_DOCUMENT_DEFAULTS.fontsize ||
    defaults.margin !== DEFAULT_DOCUMENT_DEFAULTS.margin
  );
}
