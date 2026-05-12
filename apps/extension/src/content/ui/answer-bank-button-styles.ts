// Styles for the inline answer-bank button + popover.
//
// Lives in a TS file (not a CSS file) so we can inject it directly into the
// shadow root of each decoration. We mirror the popup design tokens locally —
// the spec says to NOT import from `popup/styles.css`, so any token change in
// the popup needs a parallel change here.
//
// Tokens mirrored from apps/extension/src/popup/styles.css:
//   --primary:        #6d4aaa
//   --primary-hover:  #5a3a8f
//   --primary-soft:   #ede5fb
//   --bg:             #faf9f7
//   --bg-soft:        #f9f6f1
//   --surface:        #ffffff
//   --border:         #e6dfd6
//   --border-strong:  #d8cfc1
//   --text:           #241c30
//   --text-muted:     #6b6373
//   --shadow-md:      0 4px 12px rgba(36, 28, 48, 0.08)
//   --radius:         12px
//   --radius-sm:       8px

export const ANSWER_BANK_BUTTON_STYLES = `
:host, .slothing-ab-root {
  --slothing-ab-primary: #6d4aaa;
  --slothing-ab-primary-hover: #5a3a8f;
  --slothing-ab-primary-soft: #ede5fb;
  --slothing-ab-bg: #faf9f7;
  --slothing-ab-bg-soft: #f9f6f1;
  --slothing-ab-surface: #ffffff;
  --slothing-ab-border: #e6dfd6;
  --slothing-ab-border-strong: #d8cfc1;
  --slothing-ab-text: #241c30;
  --slothing-ab-text-muted: #6b6373;
  --slothing-ab-shadow: 0 4px 12px rgba(36, 28, 48, 0.08);
  --slothing-ab-radius: 12px;
  --slothing-ab-radius-sm: 8px;
}

.slothing-ab-root {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto,
    Oxygen, Ubuntu, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: var(--slothing-ab-text);
}

.slothing-ab-button {
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 0;
  border: 1px solid var(--slothing-ab-border-strong);
  border-radius: 50%;
  background: var(--slothing-ab-surface);
  color: var(--slothing-ab-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  box-shadow: var(--slothing-ab-shadow);
  transition: transform 100ms ease, box-shadow 100ms ease;
}

.slothing-ab-button:hover {
  transform: scale(1.06);
}

.slothing-ab-button:focus-visible {
  outline: 2px solid var(--slothing-ab-primary);
  outline-offset: 2px;
}

.slothing-ab-icon {
  display: inline-block;
  font-size: 11px;
  line-height: 1;
}

.slothing-ab-popover {
  position: absolute;
  top: 22px;
  right: 0;
  width: 240px;
  max-height: 240px;
  display: flex;
  flex-direction: column;
  background: var(--slothing-ab-surface);
  border: 1px solid var(--slothing-ab-border);
  border-radius: var(--slothing-ab-radius);
  box-shadow: var(--slothing-ab-shadow);
  overflow: hidden;
  z-index: 1;
}

.slothing-ab-popover__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: var(--slothing-ab-bg-soft);
  border-bottom: 1px solid var(--slothing-ab-border);
}

.slothing-ab-popover__title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--slothing-ab-text);
}

.slothing-ab-popover__close {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--slothing-ab-text-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
}

.slothing-ab-popover__close:hover {
  background: var(--slothing-ab-primary-soft);
  color: var(--slothing-ab-primary);
}

.slothing-ab-popover__body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 6px;
}

.slothing-ab-popover__status {
  margin: 8px 6px;
  color: var(--slothing-ab-text-muted);
  font-size: 12px;
}

.slothing-ab-popover__status--error {
  color: #b91c1c;
}

.slothing-ab-match {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "question score"
    "answer answer";
  gap: 2px 6px;
  width: 100%;
  padding: 6px 8px;
  margin: 2px 0;
  border: 0;
  border-radius: var(--slothing-ab-radius-sm);
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
}

.slothing-ab-match:hover,
.slothing-ab-match:focus-visible {
  background: var(--slothing-ab-primary-soft);
  outline: none;
}

.slothing-ab-match__question {
  grid-area: question;
  font-weight: 600;
  font-size: 12px;
  color: var(--slothing-ab-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slothing-ab-match__answer {
  grid-area: answer;
  font-size: 11px;
  color: var(--slothing-ab-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.slothing-ab-match__score {
  grid-area: score;
  align-self: start;
  font-size: 10px;
  font-weight: 600;
  color: var(--slothing-ab-primary);
  background: var(--slothing-ab-primary-soft);
  padding: 1px 6px;
  border-radius: 999px;
}

.slothing-ab-popover__footer {
  padding: 6px;
  border-top: 1px solid var(--slothing-ab-border);
  background: var(--slothing-ab-bg-soft);
}

.slothing-ab-popover__generate {
  display: inline-block;
  width: 100%;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--slothing-ab-radius-sm);
  background: var(--slothing-ab-primary);
  color: var(--slothing-ab-surface);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.slothing-ab-popover__generate:hover {
  background: var(--slothing-ab-primary-hover);
}

.slothing-ab-popover__generate:focus-visible {
  outline: 2px solid var(--slothing-ab-primary-hover);
  outline-offset: 2px;
}
`;
