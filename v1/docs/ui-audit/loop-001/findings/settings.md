# `settings` — `/en/settings`

**Source:** `apps/web/src/app/[locale]/(app)/settings/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/settings-1280.png`
- 1440: `../screenshots/settings-1440.png`
- 1920: `../screenshots/settings-1920.png`

## Cross-cutting observations

- Settings uses `<PageHeader>` (the bordered banner) — consistent with profile and most other app pages. Dashboard is the outlier; see `_global.md`.
- **Almost all** settings sections already use the shared `PageSection` / `PagePanel` primitive from `apps/web/src/components/ui/page-layout.tsx` — only `BillingSection` re-implements the section header markup inline (see M2). This is the "good" reference for what a section pattern should look like across the app, and is what `profile.md` calls out as a DRY opportunity for the profile page.
- The page composes ~13 sub-section components via `<div class="space-y-8"><div class="space-y-6">...</div>...</div>` (`apps/web/src/app/[locale]/(app)/settings/page.tsx:51-107`). The grouping is implicit — three vertical "buckets" separated by `space-y-8` with no headings between them. Adding lightweight group headings ("AI", "Workspace", "Data & integrations") would make the page's intent obvious without changing the component model.
- The same `max-w-screen-2xl` (no `mx-auto`) cap from `PageContent` leaves a wide right gutter at 1920 — same systemic issue as dashboard/profile.

## Findings

### High

- (none)

### Medium

- **[M1]** "Could not load locale / Failed to get settings" toast is anchored bottom-right and overlaps the bottom of the LLM provider grid at all 3 widths (visible in 1280/1440/1920 screenshots). On the 1280 capture it sits directly on top of the `Anthropic` / `OpenRouter` provider tiles. This is the standard `ToastProvider` placement (`apps/web/src/app/[locale]/(app)/layout.tsx`) and isn't unique to this page, but the toast is dismissible-only and persistent, so it stays welded over interactive content if the user doesn't close it. Either auto-dismiss the toast after N seconds, or top-anchor it so it doesn't obscure the action area. Affects all widths.
- **[M2]** `BillingSection` re-implements the section header pattern inline (`apps/web/src/components/settings/billing-section.tsx:11-23`: `<section className="rounded-lg border bg-card p-5"><div class="flex items-start gap-3"><div class="...bg-primary/10 ...">icon</div><div>...<h2>Billing</h2>...`) instead of using `PageSection`. Every other settings sub-component uses `PageSection` / `PagePanel` (see grep: `theme-section`, `language-section`, `locale-section`, `kanban-lanes-section`, `gmail-auto-status-section`, `google-integration`, `data-management`, `eval-health-section`, `byok-explainer`, `prompt-variants-section`, `opportunity-review-section`, `help-cards`, `what-ai-powers`, `llm-provider-config`, `llm-provider-selector`). Result: subtle spacing/typography drift on Billing only. Convert to `PageSection` for free consistency.
- **[M3]** Settings page is left-stranded at 1920 — same `max-w-screen-2xl` (no `mx-auto`) issue as dashboard and profile. The `<div class="grid gap-6 lg:grid-cols-2">` blocks (lines 61, 84, 92) cap to ~1536px and leave a wide right gutter. See `_global.md`.
- **[M4]** Three implicit "buckets" of sections (`space-y-6` groups separated by `space-y-8` at `apps/web/src/app/[locale]/(app)/settings/page.tsx:53, 81, 92`) with no visible group headings. The 1440/1920 screenshots show this works visually because the gaps are larger, but at 1280 the `space-y-8` jump only adds ~8px of extra gap vs the `space-y-6` inside, so the grouping is imperceptible. Either drop the buckets and rely on order, or promote them to labeled groups (e.g. `<h2>AI</h2>`, `<h2>Workspace</h2>`, `<h2>Data</h2>`).
- **[M5]** Three settings sub-sections embedded in `lg:grid-cols-2` grids — `LLMProviderConfig + WhatAiPowers` (line 61), `LocaleSection + LanguageSection` (line 84), `DataManagement + GoogleIntegration + GmailAutoStatusSection` (line 92). The third grid has **three children in a 2-column grid**, so `GmailAutoStatusSection` wraps onto its own row at all widths and ends up half-width with empty right side. Either move it to a full-row `space-y-6` slot or change the grid to `lg:grid-cols-3` (likely too cramped at 1280) or pair it explicitly. Visible at 1440/1920 (cut off in 1280 viewport screenshot but the same DOM).

### Low

- **[L1]** "Bring Your Own Key (BYOK)" callout uses three sub-tiles inside the section. At 1280 they fit; at 1440/1920 the same three tiles look slightly small relative to the surrounding panel padding because they don't grow with the container. Cosmetic.
- **[L2]** The "Selected" pill on the Ollama provider tile and the surrounding card border use the same primary color and similar weights — could be visually clearer with a checkmark icon in the pill matching shadcn patterns.

## Console / runtime

- React hydration `nonce` mismatch (cross-cutting — see `_global.md`). One per width.
- ~13× `Failed to load resource: 500` per width (settings + locale + various integration fetches). One of these surfaces the visible `Could not load locale / Failed to get settings` toast (M1).
- No `IntlError` missing-message warnings observed for `settings` namespace.
