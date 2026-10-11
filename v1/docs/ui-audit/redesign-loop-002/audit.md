# Loop 002 — Audit

**Routes covered:** `/studio` (drawers + header), `/dashboard` (onboarding panel)
at 1280px light.
**Carry-over from loop-001:** the cross-page heading swap landed; now picking
up the per-component holdouts that don't go through PageHeader/PagePanelHeader.

## Methodology

Reused the loop-001 screenshots for the "before" reference (typography on
those captures matches what these specific components still render — they
opted out of the shared primitives loop-001 touched). For "after" I'll
recapture the same routes once edits land.

## Findings (ranked)

### HIGH — Studio shell title bar opts out of editorial typography

`apps/web/src/components/studio/studio-header.tsx:242`:
```tsx
<h1 className="text-lg font-semibold leading-tight">Document Studio</h1>
```
The studio renders its own header inside a workspace shell, so the loop-001
PageHeader swap didn't reach it. This is the only H1 on `/studio` and it
currently reads as body sans semibold. Add `font-display tracking-tight`.

### HIGH — Studio side-panel section titles use body-sans semibold

Three more sub-h2s on `/studio` opt out of `<PagePanelHeader>`:
- `apps/web/src/components/studio/studio-file-panel.tsx:129` — `<h2 className="text-sm font-semibold">Files</h2>`
- `apps/web/src/components/studio/version-history-section.tsx:32` — `<h2 className="mb-2 text-sm font-semibold">Version History</h2>`
- `apps/web/src/components/studio/ai-assistant-panel.tsx:667` — `<h2 className="text-sm font-semibold">AI Assistant</h2>`
- `apps/web/src/components/builder/section-list.tsx:221` — `<h3 className="text-sm font-semibold">Sections</h3>`

All four are panel-section headings inside the studio workspace shell. They're
small (text-sm) — but small editorial headings are still editorial, and Outfit
at 14px reads distinctly different from Geist semibold at 14px.

### HIGH — Dashboard onboarding eyebrow + heading bypass the shared primitives

`apps/web/src/app/[locale]/(app)/dashboard/page.tsx:459-464`:
```tsx
<p className="text-xs font-semibold uppercase text-primary">
  {t("onboarding.startHere")}
</p>
<h2 className="mt-1 text-xl font-semibold">{t("onboarding.title")}</h2>
```
The "Start here" caption is body-sans bold + uppercase. The editorial system
treats this exact pattern (small uppercase caption above an H2) as a mono
eyebrow — same one used on the landing's "01 · KNOWLEDGE BANK" deep section
headers and on the sidebar nav group labels (which loop-001 already mono-fied).

Swap `font-semibold` → `font-mono tracking-[0.16em]` on the eyebrow, and add
`font-display tracking-tight` on the h2.

### MEDIUM — AI assistant inline caption uses body-sans uppercase

`apps/web/src/components/studio/ai-assistant-panel.tsx:908`:
```tsx
<p className="text-xs font-semibold uppercase text-muted-foreground">
```
Same eyebrow pattern as the dashboard "Start here" — should be mono'd. Same
single-class edit.

### MEDIUM — Studio save-status pill placement competes with Export button

The success-green pill at top-right sits flush against the dark `Export`
button. At 1280px there's no whitespace between them and the eye reads two
competing "right edge" anchors. Fix would be a margin/order tweak inside
`studio-header.tsx:468-486`. Defer — single-class fix wouldn't suffice,
needs visual judgment on order/spacing.

### LOW — Opportunities filter "summary" pills

Row above the opportunity card showing live counts ("Showing 1 · Hackathons 0
· Pending 1 · manual 1") is rendered by `OpportunityFilterTabs` (not yet
located). Visually fine in the cream system. Defer until I'm in that
component for a different reason.

## Fix plan for this loop

1. `studio-header.tsx:242` h1 — add `font-display tracking-tight`.
2. `studio-file-panel.tsx:129` h2 — same.
3. `version-history-section.tsx:32` h2 — same.
4. `ai-assistant-panel.tsx:667` h2 — same.
5. `section-list.tsx:221` h3 — same.
6. `dashboard/page.tsx:459` eyebrow — swap `font-semibold` → `font-mono tracking-[0.16em]`.
7. `dashboard/page.tsx:462` h2 — add `font-display tracking-tight`.
8. `ai-assistant-panel.tsx:908` eyebrow — swap `font-semibold` → `font-mono tracking-[0.16em]`.

Eight single-class edits across six files. Each one is one line. No new
utilities, no token edits, no test fixtures change. Existing studio-header
tests assert on the same `<h1>{title}</h1>` shape — class additions are safe.
