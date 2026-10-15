"use client";

import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import {
  ACCENTS,
  BULLETS,
  FONTS,
  FONT_SIZES,
  OPTIONAL_SECTIONS,
  STYLE_PRESETS,
  type FontId,
  type Paper,
  type ResumeStyle,
  type Section as SectionId,
  type Settings,
} from "@/lib/types";
import { Dropdown } from "./dropdown";
import { PdfPreview, PreviewPane } from "./pdf-preview";
import { Card, Eyebrow, IconButton, Label, Segmented, cx } from "./ui";

type Layout = Settings["resume"];
type Style = ResumeStyle;

const TABS = [
  { value: "template", label: "Template" },
  { value: "text", label: "Text & color" },
  { value: "page", label: "Page" },
  { value: "sections", label: "Sections" },
  { value: "entries", label: "Entries" },
] as const;
type Tab = (typeof TABS)[number]["value"];

const FONT_OPTIONS = (Object.keys(FONTS) as FontId[]).map((id) => ({
  value: id,
  label: (
    <span className="flex items-baseline justify-between gap-3">
      {FONTS[id].label}
      <span className="font-mono text-[10px] uppercase text-ink-3">{FONTS[id].kind}</span>
    </span>
  ),
  text: FONTS[id].label,
}));

const SECTION_LABELS: Record<SectionId, string> = { summary: "Summary", experience: "Experience", projects: "Projects", education: "Education", skills: "Skills", extras: "Other sections" };
const optional = (s: SectionId): s is (typeof OPTIONAL_SECTIONS)[number] => (OPTIONAL_SECTIONS as readonly string[]).includes(s);

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const sameStyle = (a: Style, b: Style) => JSON.stringify(a) === JSON.stringify(b);
/** The preset this style matches, or the one it differs least from. */
function closestPreset(style: Style) {
  const diff = (p: Style) => (Object.keys(p) as (keyof Style)[]).filter((k) => p[k] !== style[k]).length;
  return STYLE_PRESETS.reduce((best, p) => (diff(p.style) < diff(best.style) ? p : best));
}

/** One setting: a label, the control, and an optional line of help. */
function Row({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-2">{hint}</p>}
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
      <input type="checkbox" className="accent-brand" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  );
}

/*
 * A thumbnail sketch of a preset: header alignment, heading rule, accent and date column. The page and
 * its marks are document colors (always a white sheet), so they're inline like the accent swatches.
 */
const SHEET = "#ffffff";
const INK = "#2b2b2b";
const FAINT = "#c9c9c9";
function PresetSketch({ style }: { style: Style }) {
  const bar = (w: string, color = FAINT, h = 2) => <div style={{ width: w, height: h, background: color, borderRadius: 1 }} />;
  const heading = (
    <div className="flex items-center gap-1" style={{ marginTop: 5 }}>
      <div style={{ width: "28%", height: 3, background: style.accent, borderRadius: 1 }} />
      {style.headingRule === "beside" && <div className="flex-1" style={{ height: 1, background: style.accent }} />}
    </div>
  );
  const rule = style.headingRule === "below" ? <div style={{ height: 1, background: style.accent, marginTop: 2 }} /> : null;
  const entry = (
    <div className="flex gap-1" style={{ marginTop: 3 }}>
      {style.dates === "left" && <div style={{ width: "18%" }}>{bar("100%")}</div>}
      <div className="flex flex-1 flex-col gap-[2px]">
        <div className="flex justify-between">
          {bar("40%", INK)}
          {style.dates === "right" && bar("18%")}
        </div>
        {bar("92%")}
        {bar("84%")}
      </div>
    </div>
  );
  const name = bar(style.header === "center" ? "46%" : "38%", INK, 5);
  return (
    <div className="flex aspect-[8.5/7] flex-col overflow-hidden rounded-chip border border-rule p-2.5" style={{ background: SHEET }} aria-hidden>
      {style.header === "split" ? (
        <div className="flex items-center justify-between">
          {name}
          <div className="flex w-1/3 flex-col items-end gap-[2px]">{bar("100%")}{bar("70%")}</div>
        </div>
      ) : (
        <div className={cx("flex flex-col gap-[3px]", style.header === "center" ? "items-center" : "items-start")}>
          {name}
          {bar("60%")}
        </div>
      )}
      {heading}
      {rule}
      {entry}
      {heading}
      {rule}
      {entry}
    </div>
  );
}

function TemplateTab({ style, onChange }: { style: Style; onChange: (s: Style) => void }) {
  const exact = STYLE_PRESETS.find((p) => sameStyle(p.style, style));
  const closest = closestPreset(style);
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-2">
        {exact ? (
          <>Using <strong className="text-ink">{exact.label}</strong>. Fine-tune it in the other tabs.</>
        ) : (
          <>
            Customized from <strong className="text-ink">{closest.label}</strong>.{" "}
            <button type="button" onClick={() => onChange(closest.style)} className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
              <RotateCcw className="h-3 w-3" /> Reset to {closest.label}
            </button>
          </>
        )}
      </p>
      <div role="radiogroup" aria-label="Template" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STYLE_PRESETS.map((p) => {
          const on = exact?.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(p.style)}
              className={cx(
                "rounded-card border p-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                on ? "border-ink shadow-paper" : "border-rule hover:border-rule-strong",
              )}
            >
              <PresetSketch style={p.style} />
              <div className="mt-2 px-1 text-sm font-semibold">{p.label}</div>
              <p className="px-1 pb-1 text-xs leading-snug text-ink-2">{p.hint}</p>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-ink-3">Choosing a template replaces your text, color and entry choices. Page length, paper and section order stay as they are.</p>
    </div>
  );
}

function TextTab({ style, set }: { style: Style; set: <K extends keyof Style>(k: K, v: Style[K]) => void }) {
  const custom = !(ACCENTS as readonly string[]).includes(style.accent.toLowerCase());
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Row label="Body font">
          <Dropdown label="Body font" value={style.font} options={FONT_OPTIONS} onChange={(font) => set("font", font)} />
        </Row>
        <Row label="Name and headings">
          <Dropdown
            label="Heading font"
            value={style.headingFont}
            options={[{ value: "same" as const, label: "Same as body", text: "Same as body" }, ...FONT_OPTIONS]}
            onChange={(f) => set("headingFont", f)}
          />
        </Row>
      </div>
      <Row label="Text size" hint="Most resumes use 10–11pt. Smaller fits more, but is harder to read.">
        <Segmented value={String(style.size)} onChange={(v) => set("size", Number(v))} options={FONT_SIZES.map((n) => ({ value: String(n), label: `${n}pt` }))} />
      </Row>
      <Row label="Accent color" hint="Used for section headings, their rule, bullets and link icons. Names and body text stay black.">
        <div role="radiogroup" aria-label="Accent color" className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={style.accent.toLowerCase() === c}
              aria-label={c}
              onClick={() => set("accent", c)}
              className={cx(
                "h-8 w-8 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                style.accent.toLowerCase() === c ? "scale-110 border-ink" : "border-transparent hover:scale-105",
              )}
            >
              {/* The swatch shows the document color itself, not an app color. */}
              <span className="block h-full w-full rounded-full border border-rule" style={{ background: c }} />
            </button>
          ))}
          <label className={cx("flex h-8 cursor-pointer items-center gap-2 rounded-control border px-2 text-xs text-ink-2", custom ? "border-ink" : "border-rule")}>
            <input type="color" aria-label="Custom accent color" value={style.accent} onChange={(e) => set("accent", e.target.value)} className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0" />
            Custom
          </label>
        </div>
      </Row>
    </div>
  );
}

function PageTab({ layout, onChange, set }: { layout: Layout; onChange: (l: Layout) => void; set: <K extends keyof Style>(k: K, v: Style[K]) => void }) {
  const style = layout.style;
  return (
    <div className="space-y-5">
      <Row label="Page length" hint="Tailoring picks your best-matching content until the pages are full, measured on this exact layout. Pinned items always go in.">
        <Segmented
          value={layout.pages}
          onChange={(pages) => onChange({ ...layout, pages })}
          options={[
            { value: "one", label: "1 page" },
            { value: "two", label: "2 pages" },
            { value: "any", label: "No limit" },
          ]}
        />
      </Row>
      <div className="flex flex-wrap gap-x-6 gap-y-5">
        <Row label="Spacing">
          <Segmented value={style.spacing} onChange={(v) => set("spacing", v)} options={[{ value: "tight", label: "Tight" }, { value: "normal", label: "Normal" }, { value: "airy", label: "Airy" }]} />
        </Row>
        <Row label="Margins">
          <Segmented value={style.margins} onChange={(v) => set("margins", v)} options={[{ value: "narrow", label: "Narrow" }, { value: "normal", label: "Normal" }, { value: "wide", label: "Wide" }]} />
        </Row>
      </div>
      <Row label="Header">
        <Segmented value={style.header} onChange={(v) => set("header", v)} options={[{ value: "center", label: "Centered" }, { value: "split", label: "Name left, contact right" }, { value: "left", label: "Left" }]} />
      </Row>
      <Row label="Paper" hint="For resumes and cover letters. US Letter in North America, A4 almost everywhere else.">
        <Segmented<Paper>
          value={layout.paper}
          onChange={(paper) => onChange({ ...layout, paper })}
          options={[
            { value: "us-letter", label: "US Letter" },
            { value: "a4", label: "A4" },
          ]}
        />
      </Row>
    </div>
  );
}

function SectionsTab({ layout, onChange, set }: { layout: Layout; onChange: (l: Layout) => void; set: <K extends keyof Style>(k: K, v: Style[K]) => void }) {
  const move = (i: number, d: number) => {
    const order = [...layout.order];
    [order[i], order[i + d]] = [order[i + d], order[i]];
    onChange({ ...layout, order });
  };
  const toggle = (s: (typeof OPTIONAL_SECTIONS)[number], show: boolean) =>
    onChange({ ...layout, hide: show ? layout.hide.filter((h) => h !== s) : [...layout.hide, s] });
  return (
    <div className="space-y-5">
      <Row label="Order" hint="Sections with nothing in them are skipped. A hidden section stays in your profile and tailored resumes; it's just left off the page.">
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
      </Row>
      <div className="flex flex-wrap gap-x-6 gap-y-5">
        <Row label="Heading style">
          <Segmented value={layout.style.headingCase} onChange={(v) => set("headingCase", v)} options={[{ value: "caps", label: "UPPERCASE" }, { value: "smallcaps", label: "Small caps" }, { value: "title", label: "Title case" }]} />
        </Row>
        <Row label="Heading rule">
          <Segmented value={layout.style.headingRule} onChange={(v) => set("headingRule", v)} options={[{ value: "below", label: "Under" }, { value: "beside", label: "Beside" }, { value: "none", label: "None" }]} />
        </Row>
      </div>
    </div>
  );
}

function EntriesTab({ style, set }: { style: Style; set: <K extends keyof Style>(k: K, v: Style[K]) => void }) {
  return (
    <div className="space-y-5">
      <Row label="Roles and schools" hint="Two lines: the title, then company and location under it. One line: Title — Company — Location.">
        <Segmented value={style.entry} onChange={(v) => set("entry", v)} options={[{ value: "stacked", label: "Two lines" }, { value: "inline", label: "One line" }]} />
      </Row>
      <Row label="Dates">
        <Segmented value={style.dates} onChange={(v) => set("dates", v)} options={[{ value: "right", label: "Right of the title" }, { value: "left", label: "Own column on the left" }]} />
      </Row>
      <div className="flex flex-wrap gap-x-6 gap-y-5">
        <Row label="Bullets">
          <Segmented
            value={style.bullet}
            onChange={(v) => set("bullet", v)}
            options={(Object.keys(BULLETS) as (keyof typeof BULLETS)[]).map((b) => ({ value: b, label: <span className="px-1">{BULLETS[b]}</span> }))}
          />
        </Row>
        <Row label="Links">
          <div className="flex h-10 items-center">
            <Check checked={style.linkIcons} onChange={(v) => set("linkIcons", v)}>Small link icon instead of the URL</Check>
          </div>
        </Row>
      </div>
      <Check checked={style.groupRoles} onChange={(v) => set("groupRoles", v)}>
        Group back-to-back roles at the same company under one company line (for promotions)
      </Check>
    </div>
  );
}

/** Live preview of your profile as a resume with these (unsaved) settings. */
function DesignPreview({ layout }: { layout: Layout }) {
  const json = useDebounced(JSON.stringify(layout), 350);
  return (
    <PreviewPane>
      <Eyebrow className="mb-2">Preview · your whole profile</Eyebrow>
      <PdfPreview query={`kind=resume&layout=${encodeURIComponent(json)}`} version={json.length} />
    </PreviewPane>
  );
}

/** Settings → Resume design: how every resume and cover letter looks, with a live preview. */
export function ResumeDesignSection({ layout, onChange }: { layout: Layout; onChange: (l: Layout) => void }) {
  const [tab, setTab] = useState<Tab>("template");
  const set = <K extends keyof Style>(k: K, v: Style[K]) => onChange({ ...layout, style: { ...layout.style, [k]: v } });
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card className="self-start p-5">
        <h2 className="font-display text-lg font-semibold tracking-tight">Resume design</h2>
        <p className="mb-4 mt-0.5 text-sm text-ink-2">How every resume looks. Cover letters use the same font, color and header.</p>
        <div className="mb-5 overflow-x-auto">
          <Segmented<Tab> value={tab} onChange={setTab} options={[...TABS]} size="sm" />
        </div>
        {tab === "template" && <TemplateTab style={layout.style} onChange={(style) => onChange({ ...layout, style })} />}
        {tab === "text" && <TextTab style={layout.style} set={set} />}
        {tab === "page" && <PageTab layout={layout} onChange={onChange} set={set} />}
        {tab === "sections" && <SectionsTab layout={layout} onChange={onChange} set={set} />}
        {tab === "entries" && <EntriesTab style={layout.style} set={set} />}
      </Card>
      <DesignPreview layout={layout} />
    </div>
  );
}
