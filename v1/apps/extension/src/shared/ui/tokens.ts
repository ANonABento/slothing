// Single source of truth for the Slothing extension's editorial design system.
//
// Webpack has no raw/string CSS loader, and the job-page sidebar renders inside
// a shadow root (so it needs its CSS as a *string*, injected via `:host`), while
// the popup and options pages are normal documents. To keep one canonical set of
// tokens + component styles across all three surfaces we export them here as
// strings:
//   - the sidebar interpolates them into SIDEBAR_STYLES (see content/sidebar/styles.ts)
//   - popup/options prepend them to <head> at startup (see popup/index.tsx,
//     options/index.tsx) so the surface stylesheet still wins on equal-specificity
//     ties.
//
// EDITORIAL_TOKENS is a selector-less declaration body so it can be dropped into
// either `:root { … }` (document) or `:host { all: initial; … }` (shadow root).
// COMPONENT_CSS is class-scoped only — no element/`:root` selectors — so it
// behaves identically in both contexts.

export const EDITORIAL_TOKENS = `
  /* Slothing editorial palette — mirrors the web app's "slothing" preset. */
  --bg: #f5efe2;
  --bg-2: #e9dec8;
  --paper: #fffaef;
  --ink: #1a1530;
  --ink-2: #3a2f24;
  --ink-3: #6a5e4a;
  --rule: rgba(26, 20, 16, 0.12);
  --rule-strong: rgba(26, 20, 16, 0.4);
  --rule-strong-bg: rgba(26, 20, 16, 0.07);
  --brand: #b8704a;
  --brand-dark: #8e5132;
  --brand-soft: #f0d9c1;
  --success: #2f6b4f;
  --success-soft: #dcebdc;
  --warn: #a15c1e;
  --danger: #b91c1c;
  --danger-soft: #f3d6d1;
  --shadow-sm: none;
  --shadow-md: 0 10px 24px rgba(26, 21, 48, 0.14);
  --shadow-panel: 0 16px 42px rgba(26, 21, 48, 0.18);
  --radius: 10px;
  --radius-sm: 6px;
  --r-pill: 9999px;
  --font-ui: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto,
    Oxygen, Ubuntu, sans-serif;

  /* Semantic aliases used across the surfaces. */
  --surface: var(--paper);
  --bg-muted: var(--bg-2);
  --bg-soft: rgba(255, 250, 239, 0.64);
  --border: var(--rule);
  --border-strong: var(--rule-strong);
  --text: var(--ink);
  --text-muted: var(--ink-3);
  --text-faint: rgba(106, 94, 74, 0.72);
  --primary: var(--ink);
  --primary-hover: var(--brand-dark);
  --primary-soft: var(--brand-soft);
  --primary-soft-hover: #e6c9ad;
  --accent: var(--brand);

  /* Back-compat aliases for the options page's original vocabulary. */
  --r-sm: var(--radius-sm);
  --r-md: var(--radius);
  --success-bg: var(--success-soft);
  --success-text: var(--success);
  --danger-bg: var(--danger-soft);
  --danger-text: var(--danger);
`;

// Shared component vocabulary. Class-scoped so it is identical under `:root`
// (popup/options) and `:host { all: initial }` (sidebar shadow root).
export const COMPONENT_CSS = `
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}
.card.accent {
  border-color: rgba(184, 112, 74, 0.42);
  background: var(--paper);
}

.eyebrow {
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease,
    color 120ms ease, transform 120ms ease;
}
.btn:hover { background: var(--bg-muted); border-color: var(--border-strong); }
.btn:active { transform: translateY(0.5px) scale(0.99); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; background: var(--surface); }
.btn.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--paper);
}
.btn.primary:hover { background: var(--primary-hover); border-color: var(--primary-hover); }
.btn.primary:disabled { background: var(--primary); opacity: 0.45; }
.btn.ghost { background: transparent; border-color: transparent; color: var(--text-muted); }
.btn.ghost:hover { color: var(--text); background: var(--bg-muted); }
.btn.block { width: 100%; }
.btn.tight { padding: 4px 10px; font-size: 12px; }

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}
.icon-btn:hover { background: var(--rule-strong-bg); border-color: var(--border-strong); }
.icon-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px 3px 7px;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-muted);
  color: var(--text-muted);
}
.pill.ok {
  background: var(--success-soft);
  color: var(--success);
  border-color: rgba(47, 107, 79, 0.28);
}
.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 2px rgba(25, 102, 63, 0.18);
}

.badge {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 2px 8px;
  border: 1px solid rgba(184, 112, 74, 0.28);
  border-radius: var(--r-pill);
}

.score-pill {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-width: 58px;
  justify-content: flex-end;
  padding: 5px 8px;
  border: 1px solid rgba(184, 112, 74, 0.3);
  border-radius: var(--r-pill);
  background: var(--brand-soft);
  color: var(--ink);
}
.score-pill span { font-size: 14px; font-weight: 900; line-height: 1; }
.score-pill small { color: var(--brand-dark); font-size: 10px; font-weight: 800; line-height: 1; }

.field {
  width: 100%;
  min-width: 0;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  color: var(--text);
  background: var(--paper);
  font: inherit;
  font-size: 13px;
}
.field:focus-visible {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(184, 112, 74, 0.22);
}

.empty {
  border: 1px solid var(--border);
  background: var(--bg-soft);
  border-radius: var(--radius);
  padding: 14px;
  text-align: center;
}
.empty-title { font-weight: 700; font-size: 13px; margin-bottom: 4px; color: var(--text); }
.empty-sub { font-size: 12px; color: var(--text-muted); }
`;

/**
 * Builds the document-context stylesheet string (tokens on `:root` plus the
 * shared component vocabulary). Popup and options prepend this to <head>.
 */
export function documentSharedCss(): string {
  return `:root {${EDITORIAL_TOKENS}}\n${COMPONENT_CSS}`;
}

/**
 * Injects the shared tokens + component CSS as the FIRST element in <head> so
 * the per-surface stylesheet (linked later by HtmlWebpackPlugin) still wins on
 * equal-specificity ties. Idempotent.
 */
export function injectSharedCss(doc: Document = document): void {
  const ID = "slothing-shared-tokens";
  if (doc.getElementById(ID)) return;
  const style = doc.createElement("style");
  style.id = ID;
  style.textContent = documentSharedCss();
  doc.head.prepend(style);
}
