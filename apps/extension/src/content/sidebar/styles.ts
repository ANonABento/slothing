export const SIDEBAR_STYLES = `
:host {
  all: initial;
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.slothing-sidebar {
  position: fixed;
  top: 96px;
  right: 0;
  z-index: 2147483000;
  color: #172026;
  font-family: inherit;
}

.slothing-sidebar[hidden] {
  display: none;
}

.rail,
.panel {
  border: 1px solid rgba(23, 32, 38, 0.14);
  box-shadow: 0 16px 42px rgba(23, 32, 38, 0.22);
}

.rail {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 46px;
  min-height: 148px;
  padding: 10px 7px;
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: #ffffff;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  cursor: pointer;
}

.rail-score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  border-radius: 999px;
  background: #dff6e9;
  color: #135d3b;
  font-size: 12px;
  font-weight: 800;
  writing-mode: horizontal-tb;
}

.rail-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
}

.panel {
  width: min(360px, calc(100vw - 28px));
  max-height: min(720px, calc(100vh - 128px));
  overflow: auto;
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: #fbfcfb;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(23, 32, 38, 0.1);
  background: #ffffff;
}

.brand {
  margin: 0 0 8px;
  color: #1f6f46;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.title {
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.company {
  margin: 4px 0 0;
  color: #536068;
  font-size: 13px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.icon-row {
  display: flex;
  gap: 6px;
}

button {
  border: 0;
  font: inherit;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid #2f8f5b;
  outline-offset: 2px;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #eef3f0;
  color: #243038;
  cursor: pointer;
}

.icon-button:hover {
  background: #dde8e1;
}

.body {
  display: grid;
  gap: 12px;
  padding: 14px 16px 16px;
}

.score-card,
.actions,
.answer-bank,
.chat-panel,
.status-card {
  border: 1px solid rgba(23, 32, 38, 0.1);
  border-radius: 8px;
  background: #ffffff;
}

.score-card {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
}

.score-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: conic-gradient(#2f8f5b var(--score-deg), #e7ece9 0);
}

.score-number span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ffffff;
  color: #135d3b;
  font-size: 20px;
  font-weight: 900;
}

.score-label {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
}

.score-note,
.muted,
.result-meta {
  color: #63717a;
  font-size: 12px;
  line-height: 1.4;
}

.actions {
  display: grid;
  gap: 8px;
  padding: 10px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 40px;
  padding: 9px 11px;
  border-radius: 6px;
  background: #eef3f0;
  color: #172026;
  font-weight: 750;
  cursor: pointer;
}

.action-button.primary {
  background: #1f6f46;
  color: #ffffff;
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
  border-color: rgba(31, 111, 70, 0.3);
  color: #135d3b;
  background: #eefaf3;
}

.status-card.error {
  border-color: rgba(176, 52, 52, 0.3);
  color: #8f2424;
  background: #fff2f2;
}

.answer-bank {
  padding: 12px;
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
  border: 1px solid rgba(23, 32, 38, 0.16);
  border-radius: 6px;
  padding: 0 10px;
  color: #172026;
  font: inherit;
  font-size: 13px;
}

.search-row button,
.small-button {
  min-height: 34px;
  border-radius: 6px;
  padding: 0 10px;
  background: #243038;
  color: #ffffff;
  cursor: pointer;
}

.results {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.result {
  border-top: 1px solid rgba(23, 32, 38, 0.1);
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
  color: #38454d;
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
  background: #eef3f0;
  color: #243038;
}

/* P4/#40 — Inline AI assistant chat panel */
.chat-panel {
  padding: 12px;
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
  border: 1px solid rgba(23, 32, 38, 0.16);
  border-radius: 6px;
  padding: 8px 10px;
  color: #172026;
  font: inherit;
  font-size: 13px;
  line-height: 1.35;
  background: #ffffff;
}

.chat-input-row textarea:disabled {
  background: #f4f7f5;
  color: #63717a;
}

.chat-result {
  margin-top: 10px;
  min-height: 16px;
}

.chat-spinner {
  margin: 0;
  color: #63717a;
  font-size: 12px;
  font-style: italic;
}

.chat-output {
  margin: 0;
  color: #172026;
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
