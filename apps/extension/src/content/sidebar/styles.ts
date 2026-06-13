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

/* ---- Branded header (draggable) ---- */
.brandhd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--rule);
  background: var(--paper);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.brandhd:active {
  cursor: grabbing;
}

.brand {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.brand-mark {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: block;
  object-fit: cover;
}

.brand-name {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

/* ---- Job section (logo + title + company) ---- */
.jobsec {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid var(--rule);
  background: var(--bg);
}

.job-logo {
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 15px;
  background: var(--brand-soft);
  color: var(--brand-dark);
  border: 1px solid rgba(184, 112, 74, 0.3);
}

.job-meta {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 14px;
  line-height: 1.2;
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
  padding: 6px 9px;
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
  gap: 8px;
  padding: 10px;
}

/* ---- Score ring hero ---- */
.score-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--paper);
}

.ring {
  position: relative;
  width: 60px;
  height: 60px;
  flex: none;
  border-radius: 50%;
}

.ring i {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: var(--paper);
  display: grid;
  place-items: center;
  font-style: normal;
  font-weight: 900;
  font-size: 18px;
}

.score-meta {
  min-width: 0;
}

.score-label {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
}

.score-note {
  margin: 2px 0 0;
  color: var(--ink-3);
  font-size: 12px;
  line-height: 1.35;
}

.fit-tag {
  display: inline-block;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 800;
  color: var(--success);
  background: var(--success-soft);
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(47, 107, 79, 0.28);
}

/* ---- Segmented tabs ---- */
.seg {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 3px;
  padding: 3px;
  background: var(--bg-2);
  border: 1px solid var(--rule);
  border-radius: 8px;
}

.seg button {
  border: 0;
  background: transparent;
  padding: 6px 4px;
  border-radius: 6px;
  font: inherit;
  font-weight: 700;
  font-size: 12px;
  color: var(--ink-3);
  cursor: pointer;
}

.seg button.on {
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 1px 2px rgba(26, 21, 48, 0.08);
}

.tabpane {
  display: grid;
  gap: 8px;
}

/* ---- 2x2 action grid ---- */
.agrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.acard {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
  font-weight: 750;
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
}

.acard svg {
  flex: none;
}

.acard:hover:not(:disabled) {
  filter: brightness(0.97);
}

.acard:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.acard.primary {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.acard.done {
  color: var(--success);
  border-color: rgba(47, 107, 79, 0.3);
}

.acard.wide {
  grid-column: 1 / -1;
  justify-content: center;
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
  padding: 9px 10px;
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
  gap: 5px;
  padding: 7px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 34px;
  padding: 7px 10px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.4;
}

.status-card strong {
  font-size: 12.5px;
}

.status-card .small-button {
  margin-top: 3px;
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

/* ---- Drag-to-resize handle (bottom inner corner) ----
   No persistent visual — just a corner hit-area with a resize cursor; a faint
   chevron fades in on hover so it stays discoverable without cluttering. */
.resize-handle {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 20px;
  z-index: 2;
  touch-action: none;
  background: transparent;
  opacity: 0;
  transition: opacity 120ms ease;
}

.resize-handle:hover {
  opacity: 1;
  background:
    linear-gradient(
      135deg,
      transparent 0 62%,
      var(--rule-strong) 62% 70%,
      transparent 70%
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
