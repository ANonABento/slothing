import { EDITORIAL_TOKENS, COMPONENT_CSS } from "@/shared/ui/tokens";

// Sidebar-specific layout. Shared tokens + component primitives (.icon-btn,
// .score-pill, .btn, .pill, .badge, .field, .card, .empty, .eyebrow) come from
// COMPONENT_CSS so the sidebar matches the popup and options surfaces exactly.
const SIDEBAR_LAYOUT_CSS = `
*, *::before, *::after {
  box-sizing: border-box;
}

button {
  border: 0;
  font: inherit;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.slothing-sidebar {
  position: fixed;
  top: clamp(72px, 10vh, 96px);
  right: 0;
  z-index: 2147483000;
  color: var(--ink);
  font-family: inherit;
}

.slothing-sidebar.dock-left {
  left: 0;
  right: auto;
}

.slothing-sidebar[hidden] {
  display: none;
}

.rail,
.panel {
  border: 1px solid var(--rule);
  box-shadow: var(--shadow-panel);
}

.rail {
  display: grid;
  grid-template-rows: auto auto;
  justify-items: center;
  align-items: center;
  gap: 8px;
  width: 52px;
  min-height: 116px;
  padding: 10px 7px;
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: var(--paper);
  cursor: pointer;
}

.dock-left .rail {
  border-right: 1px solid var(--rule);
  border-left: 0;
  border-radius: 0 8px 8px 0;
}

.rail-score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 800;
}

.rail-label {
  max-width: 44px;
  color: var(--ink);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.1;
  text-align: center;
}

.panel {
  position: relative;
  width: min(330px, calc(100vw - 28px));
  max-height: min(900px, calc(100vh - 64px));
  overflow: auto;
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: var(--bg);
}

.dock-left .panel {
  border-right: 1px solid var(--rule);
  border-left: 0;
  border-radius: 0 8px 8px 0;
}

/* ---- Slim header: title + company on the left, controls on the right ---- */
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.header:active {
  cursor: grabbing;
}

.header-main {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.company {
  margin: 2px 0 0;
  color: var(--ink-3);
  font-size: 12px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.icon-row {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.dock-wrap {
  position: relative;
}

.dock-menu {
  position: absolute;
  top: 32px;
  right: 0;
  z-index: 3;
  display: grid;
  min-width: 124px;
  padding: 4px;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-md);
}

.dock-left .dock-menu {
  right: auto;
  left: 0;
}

.dock-menu button {
  text-align: left;
  padding: 7px 9px;
  border-radius: 4px;
  background: none;
  color: var(--ink);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.dock-menu button:hover {
  background: var(--rule-strong-bg);
}

.body {
  display: grid;
  gap: 10px;
  padding: 12px;
}

.score-card,
.actions,
.status-card {
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--paper);
}

.score-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
}

.score-label {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
}

.score-note,
.muted,
.result-meta {
  color: var(--ink-3);
  font-size: 11px;
  line-height: 1.4;
}

.resume-picker {
  display: grid;
  gap: 4px;
  padding: 8px 8px 0;
}

.resume-picker-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.resume-picker-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
}

.resume-picker-note {
  margin: 0;
  font-size: 11px;
  color: var(--brand-dark);
}

.actions {
  display: grid;
  gap: 6px;
  padding: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 36px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--rule);
  background: var(--paper);
  color: var(--ink);
  font-weight: 750;
  cursor: pointer;
}

.action-status {
  color: var(--success);
  font-size: 10px;
  font-weight: 850;
  text-transform: uppercase;
}

.action-button.primary {
  background: var(--ink);
  color: var(--paper);
}

.action-button:hover:not(:disabled) {
  filter: brightness(0.96);
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.status-card {
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.4;
}

.status-card.success {
  border-color: rgba(47, 107, 79, 0.3);
  color: var(--success);
  background: var(--success-soft);
}

.status-card.error {
  border-color: rgba(153, 27, 27, 0.26);
  color: var(--danger);
  background: var(--danger-soft);
}

.utility-section {
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--paper);
}

.utility-section summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding: 0 10px;
  color: var(--ink);
  font-size: 13px;
  font-weight: 850;
  cursor: pointer;
  list-style: none;
}

.utility-section summary::-webkit-details-marker {
  display: none;
}

.utility-section summary::after {
  content: "+";
  color: var(--ink-3);
  font-weight: 900;
}

.utility-section[open] summary {
  border-bottom: 1px solid var(--rule);
}

.utility-section[open] summary::after {
  content: "-";
}

.answer-bank {
  padding: 10px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 850;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.search-row input {
  width: 100%;
  min-width: 0;
  height: 34px;
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 0 10px;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
}

.search-row button,
.small-button {
  min-height: 34px;
  border-radius: 6px;
  padding: 0 10px;
  border: 1px solid var(--ink);
  background: var(--ink);
  color: var(--paper);
  cursor: pointer;
}

.results {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.result {
  border-top: 1px solid var(--rule);
  padding-top: 8px;
}

.result-question,
.result-answer {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.result-question {
  font-weight: 800;
}

.result-answer {
  margin-top: 4px;
  color: var(--ink-2);
}

.result-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.small-button {
  min-height: 28px;
  padding: 0 8px;
  font-size: 12px;
}

.small-button.secondary {
  border-color: var(--rule);
  background: var(--paper);
  color: var(--ink);
}

/* ---- Drag-to-resize handle (bottom inner corner) ---- */
.resize-handle {
  position: absolute;
  bottom: 0;
  width: 18px;
  height: 18px;
  z-index: 2;
  cursor: nwse-resize;
  touch-action: none;
  background:
    linear-gradient(
      135deg,
      transparent 0 55%,
      var(--rule-strong) 55% 62%,
      transparent 62% 74%,
      var(--rule-strong) 74% 81%,
      transparent 81%
    );
}

/* Right-docked / floating panels grow from the bottom-left corner. */
.slothing-sidebar:not(.dock-left) .resize-handle {
  left: 0;
  cursor: nesw-resize;
  transform: scaleX(-1);
}

.dock-left .resize-handle {
  right: 0;
  cursor: nwse-resize;
}

/* P4/#40 — Inline AI assistant chat panel */
.chat-panel {
  border: 0;
  border-radius: 0;
  padding: 10px;
}

.chat-panel .section-title {
  display: none;
}

.chat-seed-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 8px;
}

.chat-seed-row .small-button {
  width: 100%;
  min-height: 32px;
  padding: 0 8px;
  font-size: 12px;
  white-space: normal;
  line-height: 1.2;
}

.chat-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
  align-items: end;
}

.chat-input-row textarea {
  width: 100%;
  min-width: 0;
  resize: vertical;
  min-height: 36px;
  max-height: 120px;
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 8px 10px;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  line-height: 1.35;
  background: var(--paper);
}

.chat-input-row textarea:disabled {
  background: var(--bg-2);
  color: var(--ink-3);
}

.chat-result {
  margin-top: 10px;
  min-height: 16px;
}

.chat-spinner {
  margin: 0;
  color: var(--ink-3);
  font-size: 12px;
  font-style: italic;
}

.chat-output {
  margin: 0;
  color: var(--ink);
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.chat-error {
  margin-top: 8px;
}

.chat-use-cta {
  margin-top: 10px;
  width: 100%;
}

@media (max-width: 1023px) {
  .slothing-sidebar {
    display: none;
  }
}
`;

export const SIDEBAR_STYLES = `
:host {
  all: initial;
  color-scheme: light;
  ${EDITORIAL_TOKENS}
  font-family: var(--font-ui);
}
${COMPONENT_CSS}
${SIDEBAR_LAYOUT_CSS}
`;
