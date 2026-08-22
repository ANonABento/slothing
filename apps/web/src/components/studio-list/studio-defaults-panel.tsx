"use client";

/**
 * Defaults for documents you create from here.
 *
 * Scoped deliberately narrow. These apply at CREATION only — they cannot restyle a
 * document that already exists, because that document's look lives in its own
 * `\slothingset` block and is edited in its own inspector. Saying so on the panel is the
 * difference between a setting and a lie.
 */
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_DOCUMENT_DEFAULTS,
  hasCustomDefaults,
  type StudioDocumentDefaults,
} from "@/lib/studio/preferences";
import type { DocumentSettings } from "@/lib/latex/settings";

const FONTS: DocumentSettings["font"][] = [
  "LatinModern",
  "Times",
  "Helvetica",
  "Palatino",
];
const SIZES: DocumentSettings["fontsize"][] = ["10pt", "11pt", "12pt"];
const MARGINS = ["0.4in", "0.5in", "0.65in", "0.75in", "1in"];

function Row({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-ink-2">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="h-8 w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export function StudioDefaultsPanel({
  defaults,
  onChange,
}: {
  defaults: StudioDocumentDefaults;
  onChange: (next: StudioDocumentDefaults) => void;
}) {
  return (
    <section className="rounded-md border border-rule bg-paper p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            New document defaults
          </h2>
          <p className="mt-1 max-w-prose text-[12.5px] leading-relaxed text-ink-3">
            Applied to documents you create here. Documents that already exist
            keep their own styling — change those in the editor.
          </p>
        </div>
        {hasCustomDefaults(defaults) ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 px-2 text-[12px]"
            onClick={() => onChange(DEFAULT_DOCUMENT_DEFAULTS)}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        ) : null}
      </header>

      <div className="grid gap-2.5 sm:max-w-md">
        <Row
          label="Font"
          value={defaults.font}
          options={FONTS}
          onChange={(font) =>
            onChange({ ...defaults, font: font as DocumentSettings["font"] })
          }
        />
        <Row
          label="Size"
          value={defaults.fontsize}
          options={SIZES}
          onChange={(fontsize) =>
            onChange({
              ...defaults,
              fontsize: fontsize as DocumentSettings["fontsize"],
            })
          }
        />
        <Row
          label="Margin"
          value={defaults.margin}
          options={MARGINS}
          onChange={(margin) => onChange({ ...defaults, margin })}
        />
      </div>
    </section>
  );
}
