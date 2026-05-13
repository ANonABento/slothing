// Two-pass confidence-driven autofill — zone classification + DOM markers.
//
// Roadmap reference: docs/extension-roadmap-2026-05.md, task #32.
//
// Today the autofill writes any field with confidence >= settings.minimumConfidence
// (default 0.5). The 0.5–0.7 band fills wrong often enough that users distrust
// autofill. This module splits fill behavior into three zones:
//
//   - silent  (>= 0.85): fill the field, no visual marker.
//   - yellow  (0.6–0.85): fill the field, apply a 1px yellow outline + "?" tooltip.
//   - cold    (< 0.6):    don't fill, place a small "?" badge near the field that
//                          opens a popover with the top-3 candidates from profile.
//
// `settings.minimumConfidence` becomes the cold-zone floor (existing semantics
// preserved). This module is presentation only — it never alters the scoring
// algorithm.

export type ConfidenceZone = "silent" | "yellow" | "cold";

/** Lower bound (inclusive) for the silent zone. */
export const SILENT_THRESHOLD = 0.85;

/** Lower bound (inclusive) for the yellow zone. */
export const YELLOW_THRESHOLD = 0.6;

/**
 * Classify a confidence score into a zone.
 *
 * Boundaries are inclusive of the lower bound so that:
 *   - score >= 0.85           → "silent"
 *   - 0.6  <= score < 0.85    → "yellow"
 *   - score <  0.6            → "cold"
 *
 * NaN / non-finite scores are treated as cold (safest default).
 */
export function classifyConfidence(score: number): ConfidenceZone {
  if (!Number.isFinite(score)) return "cold";
  if (score >= SILENT_THRESHOLD) return "silent";
  if (score >= YELLOW_THRESHOLD) return "yellow";
  return "cold";
}

// --- DOM markers --------------------------------------------------------------
//
// All marker helpers are no-ops in environments where `document` is undefined
// (e.g. background service worker, vitest without jsdom). The pure-function
// surface above is what the unit tests cover; the DOM helpers below are wired
// from the content script and exercised in manual screenshot passes.

type FillableElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

/** Class names used by the yellow band + cold badge. Mirrors styles.css. */
export const ZONE_YELLOW_CLASS = "slothing-zone-yellow";
export const ZONE_BADGE_CLASS = "slothing-zone-badge";
export const ZONE_POPOVER_CLASS = "slothing-zone-popover";

const YELLOW_TOOLTIP = "Press Enter to accept · Esc to clear";
const COLD_TOOLTIP_PREFIX = "Slothing has";
const COLD_TOOLTIP_SUFFIX = "candidates — click to pick";

interface YellowMarkerOptions {
  /** Optional override for the tooltip text. */
  tooltip?: string;
}

/**
 * Apply the yellow-zone outline + "?" tooltip to a freshly-filled field, and
 * register listeners that clear the marker once the user interacts (typing or
 * focus-out after edit).
 *
 * Returns a `dispose` function that removes the marker manually (used in tests
 * and on pagehide).
 */
export function applyYellowMarker(
  element: FillableElement,
  options: YellowMarkerOptions = {},
): () => void {
  if (typeof document === "undefined") return () => undefined;

  element.classList.add(ZONE_YELLOW_CLASS);
  element.setAttribute("data-slothing-zone", "yellow");
  element.setAttribute(
    "data-slothing-zone-tooltip",
    options.tooltip ?? YELLOW_TOOLTIP,
  );

  const originalValue = "value" in element ? element.value : "";
  let cleared = false;

  const clear = () => {
    if (cleared) return;
    cleared = true;
    element.classList.remove(ZONE_YELLOW_CLASS);
    element.removeAttribute("data-slothing-zone");
    element.removeAttribute("data-slothing-zone-tooltip");
    element.removeEventListener("input", onInput);
    element.removeEventListener("blur", onBlur);
    element.removeEventListener("keydown", onKeyDown);
  };

  const onInput = () => {
    // Typing into the field is acceptance signal — clear the marker.
    clear();
  };

  const onBlur = () => {
    // Focus-out only counts as acceptance if the value changed from the autofilled value.
    if ("value" in element && element.value !== originalValue) {
      clear();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === "Escape") {
      clear();
    }
  };

  element.addEventListener("input", onInput);
  element.addEventListener("blur", onBlur);
  element.addEventListener("keydown", onKeyDown);

  return clear;
}

/**
 * Build the small "?" badge that announces a cold-zone field. Clicking the
 * badge invokes `onPick` so the caller can render the candidate popover.
 *
 * The badge is positioned absolutely; the caller is responsible for placing it
 * in a container that establishes a positioning context near the field.
 */
export function createColdBadge(opts: {
  candidateCount: number;
  onPick: () => void;
}): HTMLElement {
  if (typeof document === "undefined") {
    // Return a stub for non-DOM environments.
    return { onclick: null } as unknown as HTMLElement;
  }

  const badge = document.createElement("button");
  badge.type = "button";
  badge.className = ZONE_BADGE_CLASS;
  badge.setAttribute("data-slothing-zone", "cold");
  badge.setAttribute(
    "aria-label",
    `${COLD_TOOLTIP_PREFIX} ${opts.candidateCount} ${COLD_TOOLTIP_SUFFIX}`,
  );
  badge.title = `${COLD_TOOLTIP_PREFIX} ${opts.candidateCount} ${COLD_TOOLTIP_SUFFIX}`;
  badge.textContent = "?";
  badge.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    opts.onPick();
  });
  return badge;
}

export interface ColdCandidate {
  label: string;
  value: string;
}

/**
 * Render a small popover listing the top-3 cold-zone candidates. Clicking a
 * candidate invokes `onSelect(value)` and dismisses the popover.
 *
 * Returns a `dispose` function that removes the popover. The popover is added
 * to `document.body` so it floats above the host site's layout.
 */
export function showColdPopover(opts: {
  anchor: HTMLElement;
  candidates: ColdCandidate[];
  onSelect: (value: string) => void;
}): () => void {
  if (typeof document === "undefined") return () => undefined;

  const popover = document.createElement("div");
  popover.className = ZONE_POPOVER_CLASS;
  popover.setAttribute("role", "listbox");

  const heading = document.createElement("div");
  heading.className = `${ZONE_POPOVER_CLASS}__title`;
  heading.textContent = "Pick a value";
  popover.appendChild(heading);

  const list = document.createElement("ul");
  list.className = `${ZONE_POPOVER_CLASS}__list`;

  for (const candidate of opts.candidates.slice(0, 3)) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${ZONE_POPOVER_CLASS}__item`;
    button.setAttribute("role", "option");

    const label = document.createElement("span");
    label.className = `${ZONE_POPOVER_CLASS}__label`;
    label.textContent = candidate.label;

    const value = document.createElement("span");
    value.className = `${ZONE_POPOVER_CLASS}__value`;
    value.textContent = candidate.value;

    button.append(label, value);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      opts.onSelect(candidate.value);
      dispose();
    });

    item.appendChild(button);
    list.appendChild(item);
  }

  popover.appendChild(list);

  // Position the popover near the anchor (below + right-aligned).
  const rect = opts.anchor.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  popover.style.position = "absolute";
  popover.style.top = `${rect.bottom + scrollY + 6}px`;
  popover.style.left = `${rect.left + scrollX}px`;

  document.body.appendChild(popover);

  const onDocClick = (event: MouseEvent) => {
    if (event.target instanceof Node && popover.contains(event.target)) return;
    if (event.target === opts.anchor) return;
    dispose();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") dispose();
  };

  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    document.removeEventListener("mousedown", onDocClick, true);
    document.removeEventListener("keydown", onKey, true);
    popover.remove();
  }

  // Defer the listener-binding so the click that opened the popover doesn't
  // immediately close it.
  setTimeout(() => {
    if (disposed) return;
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("keydown", onKey, true);
  }, 0);

  return dispose;
}
