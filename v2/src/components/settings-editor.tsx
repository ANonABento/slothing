"use client";

import { AlertTriangle, ArrowDown, ArrowUp, Check, Loader2, Plug, Settings2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { saveSettingsAction, testLlmAction } from "@/app/actions";
import type { ProviderStatus } from "@/lib/llm";
import { safe } from "@/lib/safe";
import { MODE_SAVED_EVENT, applyAppearance } from "@/lib/theme";
import { SETTINGS_SECTIONS, isSettingsSection, safeBack, settingsHref, type SettingsSection } from "@/lib/settings-sections";
import { DARK_THEMES, LATITUDES, LETTER_LENGTHS, LIGHT_THEMES, OPTIONAL_SECTIONS, type Latitude, type LetterLength, type Paper, type Provider, type Section as SectionId, type Settings, type Theme, type ThemeMode } from "@/lib/types";
import { Dropdown } from "./dropdown";
import { PageBody, PageHeader } from "./page-header";
import { SaveBar } from "./save-bar";
import { Button, Card, CardTitle, Field, IconButton, Input, Label, Segmented, SegmentedLinks, Textarea, cx } from "./ui";

function Section({ title, description, children }: { title: string; description: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-5">
      <CardTitle>{title}</CardTitle>
      <p className="mb-4 mt-0.5 text-sm text-ink-2">{description}</p>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

type Test = { state: "idle" } | { state: "running" } | { state: "ok"; text: string } | { state: "error"; text: string };

function ModelSection({ ai, providers, onChange }: { ai: Settings["ai"]; providers: ProviderStatus[]; onChange: (ai: Settings["ai"]) => void }) {
  const [test, setTest] = useState<Test>({ state: "idle" });
  const chosen = ai.provider ? providers.find((p) => p.provider === ai.provider)! : null;
  const fallback = providers.find((p) => p.hasKey);
  const withKey = providers.filter((p) => p.hasKey);
  const withoutKey = providers.filter((p) => !p.hasKey);
  // The provider that will actually be called, so the model field edits the right one.
  const active = chosen?.hasKey ? chosen : fallback;

  const update = (next: Settings["ai"]) => {
    onChange(next);
    setTest({ state: "idle" });
  };

  const runTest = async () => {
    setTest({ state: "running" });
    const res = await safe(() => testLlmAction(ai));
    if (res.ok && res.data) setTest({ state: "ok", text: `${res.data.provider} · ${res.data.model} answered in ${(res.data.ms / 1000).toFixed(1)}s` });
    else setTest({ state: "error", text: res.ok ? "No answer." : res.error });
  };

  const options = [
    { value: "auto" as const, label: `Automatic${fallback ? ` (${fallback.label})` : ""}`, text: "Automatic" },
    ...providers.map((p) => ({ value: p.provider, label: p.hasKey ? p.label : `${p.label} · no key`, text: p.label })),
  ];

  return (
    <Section title="AI model" description="Used for importing resumes, reading job posts, tailoring and cover letters. API keys stay in v2/.env.local.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Provider">
          <Dropdown
            label="Provider"
            value={ai.provider ?? "auto"}
            onChange={(v) => update({ ...ai, provider: v === "auto" ? null : (v as Provider) })}
            options={options}
          />
        </Field>
        {active && (
          <Field label={`${active.label} model`}>
            <Input
              value={ai.models[active.provider]}
              onChange={(e) => update({ ...ai, models: { ...ai.models, [active.provider]: e.target.value } })}
              placeholder={active.defaultModel}
              spellCheck={false}
            />
          </Field>
        )}
      </div>

      {active?.provider === "openai" && (
        <Field label="Endpoint (OpenAI-compatible)">
          <Input value={ai.openaiBaseUrl} onChange={(e) => update({ ...ai, openaiBaseUrl: e.target.value })} placeholder={active.defaultBase} spellCheck={false} />
        </Field>
      )}

      {chosen && !chosen.hasKey && (
        <p className="flex items-start gap-2 text-sm text-warn">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {chosen.keyEnv} isn&apos;t set{fallback ? `, so ${fallback.label} is used until you add it` : ""}.
          </span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-rule pt-4">
        <Button size="sm" onClick={runTest} disabled={!active || test.state === "running"}>
          {test.state === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plug className="h-3.5 w-3.5" />} Test connection
        </Button>
        {test.state === "ok" && <span className="inline-flex items-center gap-1 text-sm text-ok"><Check className="h-4 w-4" />{test.text}</span>}
        {test.state === "error" && <span className="text-sm text-warn">{test.text}</span>}
        {test.state === "idle" && (
          <span className="text-xs text-ink-3">
            {withKey.length ? `Key found for ${withKey.map((p) => p.label).join(", ")}.` : "No API keys found."}
            {withoutKey.length > 0 && ` Add ${withoutKey.map((p) => p.keyEnv).join(" or ")} to use ${withoutKey.length > 1 ? "the others" : withoutKey[0].label}.`}
          </span>
        )}
      </div>
    </Section>
  );
}

const LATITUDE_COPY: Record<Latitude, { label: string; body: string }> = {
  select: { label: "Select only", body: "Picks and orders your bullets. Never changes a word, and keeps your profile summary." },
  rephrase: { label: "Light rephrase", body: "Stays close to each bullet, borrowing the job post's wording where your bullet supports it." },
  rewrite: { label: "Rewrite", body: "Restructures for impact and may merge related bullets from the same role." },
};

function TailoringSection({ t, onChange }: { t: Settings["tailoring"]; onChange: (t: Settings["tailoring"]) => void }) {
  return (
    <Section
      title="Tailoring"
      description="How much AI may change your wording. At every level it can only use facts from your profile, and invented numbers, skills or roles are removed or flagged."
    >
      <div role="radiogroup" aria-label="How much AI may change" className="grid gap-2 sm:grid-cols-3">
        {LATITUDES.map((l) => {
          const on = t.latitude === l;
          return (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange({ ...t, latitude: l })}
              className={cx(
                "rounded-control border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                on ? "border-ink bg-page shadow-paper" : "border-rule hover:border-rule-strong",
              )}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className={cx("h-3 w-3 rounded-full border", on ? "border-[3.5px] border-brand" : "border-rule-strong")} aria-hidden />
                {LATITUDE_COPY[l].label}
              </div>
              <p className="mt-1 text-xs leading-snug text-ink-2">{LATITUDE_COPY[l].body}</p>
            </button>
          );
        })}
      </div>
      <Field label="Extra instructions for resumes and cover letters">
        <Textarea
          rows={3}
          value={t.instructions}
          onChange={(e) => onChange({ ...t, instructions: e.target.value })}
          placeholder={"e.g. No first person. Past tense for past roles. Never use “spearheaded”."}
        />
      </Field>
    </Section>
  );
}

const SECTION_LABELS: Record<SectionId, string> = { summary: "Summary", experience: "Experience", projects: "Projects", education: "Education", skills: "Skills" };
const optional = (s: SectionId): s is (typeof OPTIONAL_SECTIONS)[number] => (OPTIONAL_SECTIONS as readonly string[]).includes(s);

function LayoutSection({ layout, onChange }: { layout: Settings["resume"]; onChange: (l: Settings["resume"]) => void }) {
  const move = (i: number, d: number) => {
    const order = [...layout.order];
    [order[i], order[i + d]] = [order[i + d], order[i]];
    onChange({ ...layout, order });
  };
  const toggle = (s: (typeof OPTIONAL_SECTIONS)[number], show: boolean) =>
    onChange({ ...layout, hide: show ? layout.hide.filter((h) => h !== s) : [...layout.hide, s] });

  return (
    <Section title="Resume layout" description="Section order and paper size for every resume. Hidden sections stay in your profile and tailored resumes; they're just left off the page.">
      <div>
        <Label>Section order</Label>
        <ol className="divide-y divide-rule rounded-control border border-rule">
          {layout.order.map((s, i) => {
            const hidden = optional(s) && layout.hide.includes(s);
            return (
              <li key={s} className="flex h-11 items-center gap-3 px-3">
                <span className="w-4 font-mono text-xs text-ink-3">{i + 1}</span>
                <span className={cx("flex-1 text-sm font-medium", hidden && "text-ink-3 line-through")}>{SECTION_LABELS[s]}</span>
                {optional(s) && (
                  <label className="flex items-center gap-1.5 text-xs text-ink-2">
                    <input type="checkbox" className="accent-brand" checked={!hidden} onChange={(e) => toggle(s, e.target.checked)} />
                    Show
                  </label>
                )}
                <IconButton size="sm" label={`Move ${SECTION_LABELS[s]} up`} onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></IconButton>
                <IconButton size="sm" label={`Move ${SECTION_LABELS[s]} down`} onClick={() => move(i, 1)} disabled={i === layout.order.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconButton>
              </li>
            );
          })}
        </ol>
      </div>
      <div>
        <Label>Paper size (resumes and cover letters)</Label>
        <Segmented<Paper>
          value={layout.paper}
          onChange={(paper) => onChange({ ...layout, paper })}
          options={[
            { value: "us-letter", label: "US Letter" },
            { value: "a4", label: "A4" },
          ]}
        />
      </div>
    </Section>
  );
}

function LetterSection({ letter, onChange }: { letter: Settings["letter"]; onChange: (l: Settings["letter"]) => void }) {
  return (
    <Section title="Cover letter" description="How long AI drafts should be. Letters over the target get a warning.">
      <Segmented<LetterLength>
        value={letter.length}
        onChange={(length) => onChange({ length })}
        options={[
          { value: "short", label: `Short · ${LETTER_LENGTHS.short} words` },
          { value: "standard", label: `Standard · ${LETTER_LENGTHS.standard} words` },
        ]}
      />
    </Section>
  );
}

const THEME_COPY: Record<Theme, { label: string; body: string }> = {
  cream: { label: "Cream", body: "Warm paper, the original." },
  paper: { label: "Paper", body: "Neutral off-white." },
  graphite: { label: "Graphite", body: "Near-black with a little warmth." },
  slate: { label: "Slate", body: "Cool gray, like a code editor." },
  dim: { label: "Dim", body: "Lighter gray, lowest contrast." },
  black: { label: "Black", body: "True black for OLED and dark rooms." },
};

/** A miniature of the app drawn with the theme's own tokens (data-theme scopes them to this element). */
function ThemeSwatch({ theme, selected, onSelect }: { theme: Theme; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cx(
        "rounded-card border p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        selected ? "border-ink shadow-paper" : "border-rule hover:border-rule-strong",
      )}
    >
      <div data-theme={theme} className="flex h-20 overflow-hidden rounded-control border border-rule bg-page">
        <div className="w-1/4 border-r border-rule bg-page p-1.5">
          <div className="mb-1 h-1.5 w-3/4 rounded-full bg-ink" />
          <div className="h-1 w-1/2 rounded-full bg-ink-3" />
        </div>
        <div className="flex-1">
          <div className="h-3 border-b border-rule bg-header" />
          <div className="m-1.5 rounded-chip border border-rule bg-paper p-1.5">
            <div className="mb-1 h-1.5 w-2/3 rounded-full bg-ink" />
            <div className="mb-1 h-1 w-full rounded-full bg-ink-2" />
            <div className="h-1.5 w-6 rounded-full bg-brand" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 px-1 text-sm font-semibold">
        <span className={cx("h-3 w-3 rounded-full border", selected ? "border-[3.5px] border-brand" : "border-rule-strong")} aria-hidden />
        {THEME_COPY[theme].label}
      </div>
      <p className="px-1 pb-1 text-xs text-ink-2">{THEME_COPY[theme].body}</p>
    </button>
  );
}

function AppearanceSection({ a, onChange }: { a: Settings["appearance"]; onChange: (a: Settings["appearance"]) => void }) {
  const group = (label: string, themes: readonly Theme[], value: Theme, set: (t: Theme) => void) => (
    <div>
      <Label>{label}</Label>
      <div role="radiogroup" aria-label={label} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {themes.map((t) => (
          <ThemeSwatch key={t} theme={t} selected={value === t} onSelect={() => set(t)} />
        ))}
      </div>
    </div>
  );
  return (
    <Section title="Appearance" description="Changes preview right away. The moon/sun button in the sidebar switches between your light and dark theme.">
      <div>
        <Label>Mode</Label>
        <Segmented<ThemeMode>
          value={a.mode}
          onChange={(mode) => onChange({ ...a, mode })}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "Match system" },
          ]}
        />
      </div>
      {group("Light theme", LIGHT_THEMES, a.light, (t) => onChange({ ...a, light: t as Settings["appearance"]["light"], mode: a.mode === "dark" ? "light" : a.mode }))}
      {group("Dark theme", DARK_THEMES, a.dark, (t) => onChange({ ...a, dark: t as Settings["appearance"]["dark"], mode: a.mode === "light" ? "dark" : a.mode }))}
    </Section>
  );
}

export function SettingsEditor({ initial, providers }: { initial: Settings; providers: ProviderStatus[] }) {
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);

  // Preview appearance edits live; leaving settings puts the saved theme back.
  // Only an unsaved preview is undone, so a sidebar toggle made meanwhile isn't overwritten.
  const appearanceKey = JSON.stringify(s.appearance);
  const latest = useRef({ current: s.appearance, saved: saved.appearance });
  latest.current = { current: s.appearance, saved: saved.appearance };
  const previewed = useRef(false);
  useEffect(() => {
    if (!previewed.current) return void (previewed.current = true); // first render: already applied server-side
    applyAppearance(JSON.parse(appearanceKey));
  }, [appearanceKey]);
  // The sidebar toggle saves the mode itself; mirror it so this page neither shows nor re-saves a stale one.
  useEffect(() => {
    const onSaved = (e: Event) => {
      const mode = (e as CustomEvent<"light" | "dark">).detail;
      setS((x) => ({ ...x, appearance: { ...x.appearance, mode } }));
      setSaved((x) => ({ ...x, appearance: { ...x.appearance, mode } }));
    };
    window.addEventListener(MODE_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(MODE_SAVED_EVENT, onSaved);
  }, []);
  useEffect(
    () => () => {
      const { current, saved } = latest.current;
      if (JSON.stringify(current) !== JSON.stringify(saved)) applyAppearance(saved);
    },
    [],
  );

  const segment = useSelectedLayoutSegment() ?? "";
  const section: SettingsSection = isSettingsSection(segment) ? segment : "ai";
  const back = safeBack(useSearchParams().get("back"));

  const save = () =>
    start(async () => {
      setError("");
      const res = await safe(() => saveSettingsAction(s));
      if (res.ok) setSaved(s);
      else setError(res.error);
    });

  const nav = SETTINGS_SECTIONS.map((x) => ({ value: x.id, label: x.label, href: settingsHref(x.id, back ?? undefined) }));

  return (
    <>
      <PageHeader
        icon={Settings2}
        back={back ? { href: back, label: back.startsWith("/jobs/") ? "the job" : "where you were" } : undefined}
        title="Settings"
        description="Model, tailoring, document layout and appearance."
        actions={
          <>
            {dirty ? <span className="text-xs text-ink-3">Unsaved changes</span> : <span className="inline-flex items-center gap-1 text-xs text-ok"><Check className="h-3.5 w-3.5" />Saved</span>}
            <Button variant="primary" onClick={save} disabled={pending || !dirty}>{pending ? "Saving…" : "Save settings"}</Button>
          </>
        }
      />
      <PageBody>
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          {/* Mobile: a segmented row. Desktop: a sticky list beside the content. */}
          <div className="overflow-x-auto lg:hidden">
            <SegmentedLinks value={section} options={nav} size="sm" />
          </div>
          <nav aria-label="Settings sections" className="hidden lg:block">
            <div className="sticky top-6 space-y-0.5">
              {nav.map((n) => (
                <Link
                  key={n.value}
                  href={n.href}
                  aria-current={section === n.value ? "page" : undefined}
                  className={cx(
                    "flex h-9 items-center rounded-control border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    section === n.value ? "border-rule bg-paper text-ink shadow-paper" : "border-transparent text-ink-2 hover:border-rule hover:bg-paper hover:text-ink",
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="min-w-0 space-y-4">
            {error && <p className="text-sm text-warn">{error}</p>}
            {section === "ai" && <ModelSection ai={s.ai} providers={providers} onChange={(ai) => setS({ ...s, ai })} />}
            {section === "tailoring" && <TailoringSection t={s.tailoring} onChange={(tailoring) => setS({ ...s, tailoring })} />}
            {section === "layout" && <LayoutSection layout={s.resume} onChange={(resume) => setS({ ...s, resume })} />}
            {section === "letter" && <LetterSection letter={s.letter} onChange={(letter) => setS({ ...s, letter })} />}
            {section === "appearance" && <AppearanceSection a={s.appearance} onChange={(appearance) => setS({ ...s, appearance })} />}
            <SaveBar dirty={dirty} pending={pending} onSave={save} onDiscard={() => setS(saved)} label="Save settings" />
          </div>
        </div>
      </PageBody>
    </>
  );
}
