# `salary` — `/en/salary`

**Source:** `apps/web/src/app/[locale]/(app)/salary/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/salary-1280.png`
- 1440: `../screenshots/salary-1440.png`
- 1920: `../screenshots/salary-1920.png`

## Findings

### High

- _(none)_

### Medium

- **[M1]** Tabs are a one-off pattern, not the shared tab/toggle component — `apps/web/src/app/[locale]/(app)/salary/page.tsx:303-323` builds an inline tab bar with raw `<button>` + cn() pill styling (`bg-primary text-primary-foreground` for active). The Studio uses a different tab pattern for resume / cover-letter (per `CLAUDE.md` Document Studio architecture). The interview page implies a voice/text mode toggle. Three different "tab"/"mode-toggle" UIs across the app. Lift to `<Tabs>` from a shared component. Width: all.

- **[M2]** The tab bar is inside an inset `border-b bg-card/50` strip beneath the PageHeader — this creates a visual seam (header bottom border, then tabs strip with its own bottom border, then content). Compare with other routes that use header + content directly. Either fold the tabs into the PageHeader's actions slot or use a properly-bounded `<Tabs>` panel. Width: all.

- **[M3]** Calculator panel sized at `lg:grid-cols-[minmax(0,42rem)]` via `getResponsiveDetailGridClass(Boolean(salaryRange))` (`apps/web/src/app/[locale]/(app)/salary/page.tsx:329`). Before the user has run a calc, the entire viewport is occupied by a single ~672px-wide panel with a vast empty area on the right at 1920. No visual hint that a results panel will appear. Add an inline "Results will appear here" placeholder card on the right (matches the negotiate tab's `script ? … : empty` pattern at `:757-836`). Width: 1280, 1440, 1920.

- **[M4]** Charts inconsistent with analytics — the salary-range visualization (`apps/web/src/app/[locale]/(app)/salary/page.tsx:412-422`) is an inline horizontal gradient bar with absolutely-positioned min/max labels. The analytics page renders charts via dynamic-imported components without a shared chart wrapper. There is no shared chart primitive between the two pages. Width: all (negotiate tab; not visible in screenshots which show calculator tab).

- **[M5]** Compare-offers card uses ad-hoc removal pattern — the trash button (`apps/web/src/app/[locale]/(app)/salary/page.tsx:592-603`) is `top-2`/`top-7` swap when "Best" badge is present. This is brittle conditional positioning rather than `flex` ordering. Bare destructive `removeOffer` (`:195-200`) — should use the destructive-action confirm/undo pattern from `docs/destructive-actions-pattern.md`. Width: all.

### Low

- **[L1]** Negotiate tab gradient `from-amber-400 via-success to-info` (salary-range bar `:414`) — `amber-400` is a Tailwind palette color. `forbidden-color-lint.cjs` may flag this; if not, it's still inconsistent with the semantic-token convention. Width: negotiate / calculator after results.

- **[L2]** Tab icons (`Calculator`, `BarChart3`, `TrendingUp`) repeat icons used as `PageIconTile` content elsewhere; consider unique icons per tab to reduce semantic clash. Width: all.

## Cross-cutting observations

- **Tab pattern is a one-off** — three "tab-like" UIs in the app (Studio mode tab, salary tab strip, interview empty state should-be-tabs) and none share a primitive. Highest-leverage fix.
- **Chart primitive missing** as called out in M4 — analytics + salary diverge.
- **Empty / placeholder cards** when a paired-panel hasn't rendered are inconsistent: salary calculator shows nothing on the right, negotiate shows "Enter offer details to generate", emails shows "Click 'Generate Email'…". One pattern, three implementations.
- **Bare destructive `removeOffer`** violates `docs/destructive-actions-pattern.md`. Same anti-pattern likely repeats wherever lists support row-level removal without an undo or confirm.
- **`PageHeader` shared primitive used.** Good.

## Console / runtime

- No console errors observed in the captured screenshots (calculator empty state, no fetch in flight).
