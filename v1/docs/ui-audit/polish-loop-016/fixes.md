# polish-loop-016 — Fixes

## S-M6 — Bank Entry Picker empty state

**Files:**
- `apps/web/src/components/builder/section-list.tsx`
- `apps/web/src/messages/en.json` + 7 locale files (`es`, `fr`, `hi`, `ja`,
  `ko`, `pt-BR`, `zh-CN`)

**Component diff:** Wrap the existing `sections.map` in a conditional that
renders an empty-state panel when every section's entries list is empty.

```diff
  <div className="space-y-4">
+   {sections.every(
+     (section) =>
+       (entriesByCategory.get(section.id) || []).length === 0,
+   ) ? (
+     <div className="rounded-[var(--radius)] border-[length:var(--border-width)] bg-muted/40 p-6 text-center">
+       <p className="font-medium text-foreground">{t("pickerEmptyTitle")}</p>
+       <p className="mt-1 text-sm text-muted-foreground">{t("pickerEmptyDescription")}</p>
+       <Button asChild variant="outline" size="sm" className="mt-4">
+         <a href="/bank">{t("pickerEmptyCta")}</a>
+       </Button>
+     </div>
+   ) : (
      sections.map((section) => {
        // ... existing mapping (unchanged) ...
      })
+   )}
  </div>
```

**Translation keys added:** `pickerEmptyTitle`, `pickerEmptyDescription`,
`pickerEmptyCta` under `dialogs.builder.sectionList`.

Translations:
- `en`: "Your bank is empty" / "Upload a resume or add an entry manually
  to start pulling content into your documents." / "Open Documents"
- `es`: "Tu banco está vacío" / "Sube un currículum o agrega una entrada
  manualmente para comenzar a incluir contenido en tus documentos." /
  "Abrir Documentos"
- `fr`: "Votre banque est vide" / "Téléchargez un CV ou ajoutez une entrée
  manuellement pour commencer à inclure du contenu dans vos documents." /
  "Ouvrir Documents"
- `pt-BR`: "Seu banco está vazio" / "Envie um currículo ou adicione uma
  entrada manualmente para começar a usar conteúdo em seus documentos." /
  "Abrir Documentos"
- `hi`, `ja`, `ko`, `zh-CN`: English copy temporarily — the messages test
  only flags Latin-script English fallbacks, so these locales aren't
  blocked. Real translations are a translation-workstream concern.

**Why:** Empty-state UX. The picker's previous behavior was to render an
almost-blank dialog when the bank had no entries (because every section
filter returned `null`). New users hitting this state had no signal about
what was wrong or how to fix it.

## Verification

- `pnpm exec vitest run src/components/builder/ src/app/[locale]/(app)/studio/page.test.tsx` — 24+ tests pass.
- `pnpm exec vitest run src/messages/messages.test.ts` — 52 tests pass (no
  English-fallback regressions).
- `pnpm --filter @slothing/web type-check` — clean.
- `pnpm --filter @slothing/web lint` — clean (pre-existing warnings only).
- Visual:
  - `studio-bank-picker-1440.png` — before (almost-blank dialog body).
  - `studio-bank-picker-empty-after-1440.png` — after (clear empty state
     with CTA).
