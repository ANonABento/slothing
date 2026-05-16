# Empty-state illustrations

Source assets for `EmptyIllustration` (see `src/components/ui/empty-states.tsx`).

**Generation rules**: `docs/empty-states-and-headers-plan/illustration-prompt.md`.
**Why these names**: each maps 1:1 to a feature's onboarding empty state. The component requests `/illustrations/empty/<name>.svg` and falls back to a lucide icon disc if the asset is missing — safe to ship copy before art lands.

## Manifest

Format: `<filename>` — scene line to append to the locked prompt.

### Batch 1 — top-traffic pages (ship first)

- `dashboard-fresh` — sloth setting up a small canvas tent on a flat plain, packing a notebook, a pen, and a thermos into a satchel. Conveys "starting the search system".
- `components-zero` — sloth at a wooden desk, gently pulling colored threads out of a folded résumé and laying them as labeled index cards. Conveys "extract reusable bullets".
- `opportunities-zero` — sloth pinning a single role card onto a corkboard with a length of red yarn loosely connecting it to a calendar and a follow-up note. Conveys "tracking the funnel".
- `studio-zero` — sloth at a vintage typewriter, with finished pages of a resume and a cover letter fluttering out to either side. Conveys "compose tailored docs".
- `upload-zero` — sloth holding a single paper résumé over an open paper tray. Conveys "drop a file here".

### Batch 2 — secondary pages

- `opportunities-review-empty` — sloth standing at an empty inbox tray, peering inside expectantly.
- `opportunities-research-empty` — sloth holding an oversized magnifying glass over a single role card, taking notes on a pocket pad.
- `calendar-empty` — sloth flipping through a paper day planner, the pages mostly blank.
- `interview-empty` — sloth at a desk surrounded by neatly fanned-out interview index cards, holding one up and reading it.
- `ats-zero` — sloth feeding a single sheet of paper into a small mechanical sorter that has a column of green checkmarks and red x's beside it.
- `toolkit-email-templates-empty` — sloth licking the flap of an envelope, with two more envelopes neatly stacked on the desk.
- `toolkit-salary-empty` — sloth sliding stacks of small coins into labeled jars marked with role levels.
- `analytics-empty` — sloth standing next to a chalkboard that has three small bar charts drawn on it, holding chalk.
- `extension-connect-empty` — sloth holding a single chrome puzzle piece up to the light, fitting it into a frame.
- `extension-connect-waiting` — sloth at a window, watching street traffic of paper résumés walk past.
- `documents-empty` — sloth pulling a labeled folder out of a small filing cabinet drawer.

### Per-asset variants

For each `<name>.svg` we will also produce `<name>-dark.svg` in the dark palette. The component does not yet request the dark variant — wiring that up is the Phase 2 follow-up. Until then, the light variant renders against both themes; this is acceptable for now because the illustrations sit on `bg-paper` which is cream in both themes.

## Adding a new asset

1. Append the scene line to this README under the appropriate batch.
2. Generate using the locked prompt.
3. Trace / clean to SVG, target < 40 KB.
4. Run the QA checklist from `docs/empty-states-and-headers-plan/illustration-prompt.md`.
5. Commit `<name>.svg` here. Reference it in the relevant empty state via `illustrationName="<name>"`.

## Why this folder is empty today

We deliberately shipped the empty-state primitives + icon-fallback path *before* the illustrations. Pages can adopt `OnboardingEmptyState` immediately and the icon fallback holds the slot. When a real SVG ships into this folder, no code change is required — the component picks it up by name.
