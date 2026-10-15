"use client";

import { useEffect, useState } from "react";

import { ACCENTS, BULLETS, FONTS, FONT_SIZES, STYLE_PRESETS, type FontId, type ResumeStyle, type Settings } from "@/lib/types";
import { Dropdown } from "./dropdown";
import { PdfPreview, PreviewPane } from "./pdf-preview";
import { Card, CardTitle, Label, Segmented, cx } from "./ui";

type Style = ResumeStyle;

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

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const same = (a: Style, b: Style) => JSON.stringify(a) === JSON.stringify(b);

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-2">{hint}</p>}
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
      <input type="checkbox" className="accent-brand" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  );
}

/** Font, spacing, color and the shape of headers and entries. Every resume and cover letter uses it. */
export function DesignCard({ style, onChange }: { style: Style; onChange: (s: Style) => void }) {
  const set = <K extends keyof Style>(k: K, v: Style[K]) => onChange({ ...style, [k]: v });
  const custom = !(ACCENTS as readonly string[]).includes(style.accent.toLowerCase());

  return (
    <Card className="p-5">
      <CardTitle>Design</CardTitle>
      <p className="mb-4 mt-0.5 text-sm text-ink-2">Every resume and cover letter. Start from a preset, then adjust. The preview updates as you go.</p>
      <div className="space-y-4">
        <Row label="Start from">
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.hint}
                aria-pressed={same(p.style, style)}
                onClick={() => onChange(p.style)}
                className={cx(
                  "h-9 rounded-control border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  same(p.style, style) ? "border-ink bg-ink text-paper" : "border-rule text-ink-2 hover:border-rule-strong hover:text-ink",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Row>

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

        <Row label="Text size">
          <Segmented
            value={String(style.size)}
            onChange={(v) => set("size", Number(v))}
            options={FONT_SIZES.map((n) => ({ value: String(n), label: `${n}pt` }))}
          />
        </Row>

        <div className="grid gap-4 sm:grid-cols-2">
          <Row label="Spacing">
            <Segmented value={style.spacing} onChange={(v) => set("spacing", v)} options={[{ value: "tight", label: "Tight" }, { value: "normal", label: "Normal" }, { value: "airy", label: "Airy" }]} />
          </Row>
          <Row label="Margins">
            <Segmented value={style.margins} onChange={(v) => set("margins", v)} options={[{ value: "narrow", label: "Narrow" }, { value: "normal", label: "Normal" }, { value: "wide", label: "Wide" }]} />
          </Row>
        </div>

        <Row label="Accent color" hint="Section headings, their rule, bullets and link icons.">
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

        <Row label="Header">
          <Segmented
            value={style.header}
            onChange={(v) => set("header", v)}
            options={[{ value: "center", label: "Centered" }, { value: "split", label: "Name left, contact right" }, { value: "left", label: "Left" }]}
          />
        </Row>

        <div className="grid gap-4 sm:grid-cols-2">
          <Row label="Section headings">
            <Segmented value={style.headingCase} onChange={(v) => set("headingCase", v)} options={[{ value: "caps", label: "UPPERCASE" }, { value: "smallcaps", label: "Small caps" }, { value: "title", label: "Title case" }]} />
          </Row>
          <Row label="Heading rule">
            <Segmented value={style.headingRule} onChange={(v) => set("headingRule", v)} options={[{ value: "below", label: "Under" }, { value: "beside", label: "Beside" }, { value: "none", label: "None" }]} />
          </Row>
        </div>

        <Row label="Roles and schools" hint="Two lines: title, then company and location. One line: Title — Company — Location.">
          <div className="flex flex-wrap items-center gap-4">
            <Segmented value={style.entry} onChange={(v) => set("entry", v)} options={[{ value: "stacked", label: "Two lines" }, { value: "inline", label: "One line" }]} />
            <Check checked={style.groupRoles} onChange={(v) => set("groupRoles", v)}>Group roles at the same company</Check>
          </div>
        </Row>

        <Row label="Dates">
          <Segmented value={style.dates} onChange={(v) => set("dates", v)} options={[{ value: "right", label: "Right of the title" }, { value: "left", label: "Left column" }]} />
        </Row>

        <div className="grid gap-4 sm:grid-cols-2">
          <Row label="Bullets">
            <Segmented
              value={style.bullet}
              onChange={(v) => set("bullet", v)}
              options={(Object.keys(BULLETS) as (keyof typeof BULLETS)[]).map((b) => ({ value: b, label: <span className="px-1">{BULLETS[b]}</span> }))}
            />
          </Row>
          <Row label="Links">
            <div className="flex h-10 items-center">
              <Check checked={style.linkIcons} onChange={(v) => set("linkIcons", v)}>Link icon instead of the URL</Check>
            </div>
          </Row>
        </div>
      </div>
    </Card>
  );
}

/** Live preview of your profile as a resume with these (unsaved) settings. */
export function DesignPreview({ layout }: { layout: Settings["resume"] }) {
  const json = useDebounced(JSON.stringify(layout), 350);
  return (
    <PreviewPane>
      <PdfPreview query={`kind=resume&layout=${encodeURIComponent(json)}`} version={json.length} />
    </PreviewPane>
  );
}
