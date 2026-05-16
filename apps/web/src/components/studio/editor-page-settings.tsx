"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MARGIN_PRESETS,
  PAGE_SIZES,
  normalizePageSettings,
  type MarginPresetId,
  type PageMargins,
  type PageSettings,
  type PageSizeId,
} from "@/lib/editor/page-settings";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface EditorPageSettingsProps {
  pageSettings: PageSettings;
  onChange: (settings: PageSettings) => void;
}

const marginFields: Array<{ key: keyof PageMargins; label: string }> = [
  { key: "top", label: "Top" },
  { key: "right", label: "Right" },
  { key: "bottom", label: "Bottom" },
  { key: "left", label: "Left" },
];

export function EditorPageSettings({
  pageSettings,
  onChange,
}: EditorPageSettingsProps) {
  const a11yT = useA11yTranslations();

  const normalized = normalizePageSettings(pageSettings);
  const custom = normalized.marginPreset === "custom";

  function update(next: Partial<PageSettings>) {
    onChange(normalizePageSettings({ ...normalized, ...next }));
  }

  function updateMargin(key: keyof PageMargins, value: string) {
    update({
      marginPreset: "custom",
      margins: {
        ...normalized.margins,
        [key]: Number(value),
      },
    });
  }

  return (
    <details className="relative">
      <summary className="list-none">
        {/* Sized to match the slim toolbar's button height (`h-8`) so it
            sits flush next to the formatting controls instead of
            standing out as a taller chip. */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          asChild
          className="h-8 px-2 text-[12px]"
        >
          <span>
            <Settings2 className="mr-1 h-3.5 w-3.5" />
            Page setup
          </span>
        </Button>
      </summary>
      <div className="absolute right-0 top-10 z-30 w-72 rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-[var(--shadow-elevated)]">
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">
            Page size
          </span>
          <select
            className="mt-1 h-9 w-full rounded-md border bg-background px-2"
            aria-label={a11yT("pageSize")}
            value={normalized.size}
            onChange={(event) =>
              update({ size: event.currentTarget.value as PageSizeId })
            }
          >
            {Object.values(PAGE_SIZES).map((size) => (
              <option key={size.id} value={size.id}>
                {size.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold text-muted-foreground">
            Margins
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(MARGIN_PRESETS).map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant={
                  normalized.marginPreset === preset.id ? "default" : "outline"
                }
                onClick={() =>
                  update({ marginPreset: preset.id as MarginPresetId })
                }
              >
                {preset.label}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={custom ? "default" : "outline"}
              onClick={() => update({ marginPreset: "custom" })}
            >
              Custom
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {marginFields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-xs text-muted-foreground">
                {field.label}
              </span>
              <input
                type="number"
                min={0}
                max={2}
                step={0.05}
                value={normalized.margins[field.key]}
                disabled={!custom}
                aria-label={`${field.label} margin`}
                className="mt-1 h-9 w-full rounded-md border bg-background px-2 disabled:opacity-60"
                onChange={(event) =>
                  updateMargin(field.key, event.currentTarget.value)
                }
              />
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}
