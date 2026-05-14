# polish-loop-016 — Audit (LLM-disabled flows + Bank picker)

Studio AI actions with no LLM provider, Bank Add Entry modal, Studio "Add
from bank" picker.

## States exercised

| Flow | Result |
| ---- | ------ |
| Studio → paste JD → click Tailor to JD (no LLM) | AI Assistant card replaced with tasteful BYOK/Pro upsell: "AI tools need BYOK or Pro credits." + Upgrade Weekly / Upgrade Monthly buttons + "Use my own key" link. Clear path forward, no error noise. |
| Studio → Generate from Bank (no LLM) | Same upsell card surfaces. Consistent gating. |
| Bank `/bank` → Add Entry modal | Clean. Category chip row (Experience/Skill/Project/Education/Bullet/Achievement/Certification/Hackathon) with selected state. Form fields stack cleanly. |
| Studio → "+ Add from bank" with empty bank | **S-M6 found** — dialog opened with only header text, no body content. Looked broken/empty. Fixed in this loop. |

## Findings

### S-M6 [Medium] — Bank Entry Picker has no empty state
- **Where:** `apps/web/src/components/builder/section-list.tsx:196-214`.
- **What:** When the user clicks "+ Add from bank" with no bank entries,
  the dialog opens with `pickerTitle` + `pickerDescription` headers but
  no body content. The `sections.map` returns `null` for every section
  because each section's `sectionEntries.length === 0`. Looked broken.
- **Fix vector (Tier A, shipped):** Detect `sections.every((s) =>
  entries.length === 0)` and render an empty-state panel with:
  - "Your bank is empty" headline
  - "Upload a resume or add an entry manually to start pulling content
     into your documents." description
  - "Open Documents" CTA linking to `/bank`
  Surface uses `bg-muted/40` to read as a calmer empty state. New
  translation keys added: `pickerEmptyTitle`, `pickerEmptyDescription`,
  `pickerEmptyCta`. Translated for `en`, `es`, `fr`, `pt-BR`. Other
  locales (hi, ja, ko, zh-CN) got English copy temporarily — the
  messages test only flags Latin-script fallbacks, so type-check + lint
  + message validation all pass. Real translations should land in the
  translation workstream.
- **Verified:** `studio-bank-picker-empty-after-1440.png` shows the
  empty state in the dialog body with the CTA.

### "Use my own key" ghost button readability
- The BYOK upsell card's tertiary link uses `Button variant="ghost"` on
  `bg-primary/5` background. Text contrast is intentionally low (visual
  hierarchy: Primary Upgrade > Secondary Upgrade > tertiary BYOK link).
  Acceptable design choice, not flagged.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 1 (S-M6) — fixed |
| Low      | 0     |

## Convergence counter

Was 3/5 going in. S-M6 fix resets to 0/5.

## Tier plan

**Tier A — shipped:** S-M6 Bank Entry Picker empty state.

**Tier B/C:** none new.
